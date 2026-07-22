import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";

import type {
  AppDocument,
  AppointedOk,
  Application,
  ApplicationStatus,
  AuditEntry,
  Certificate,
  CompetencyCategory,
  ContractorClass,
  InboxItem,
  NotificationType,
  PaymentKind,
  PersonaRole,
  RegistrationPeriod,
  TaskTab,
  WorkflowType,
} from "../types";
import { withCeCertificateFields } from "../certificate-ce";
import { withOkCertificateFields } from "../certificate-ok";
import {
  getStRegistrationApplicationByCode,
  getStaffTaskNotifyState,
  listStRegistrationApplications,
  notifyApplicantQuery,
  notifyApplicantRejection,
  notifyStaffWorkflowTask,
  updateStRegistrationApplication,
  type StaffTaskNotifyInput,
} from "@/api/st-registration";
import { seedState } from "../mock";
import { feeFor as charterFeeFor, slaTargetFor, SOS_ESCALATE_AFTER_HOURS } from "../mock/charter";
import { personaById, PERSONAS, ROLE_LABEL } from "../mock/personas";
import { employerById, EMPLOYERS } from "../mock/employers";
import { mapRegistrationDtoToApplication } from "../map-registration-to-application";
import { elapsedHours } from "../sla";
import {
  isTpSosRole,
  STAGE_FOR_STAFF_ROLE,
  STAFF_PERSONA_BY_ROLE,
  sosOfficersForWorkflow,
  staffRoleFor,
  staffRoleForStatus,
} from "../staff-roles";
import { useStSessionStore } from "./session";
import { useStNotificationsStore } from "./notifications";

const STORAGE_KEY = "st.workflow.state.v14";
const MAX_ACTIVE_TASKS = 3;

// Demo PIN for the digital signature step.
export const DEMO_SIGNATURE_PIN = "1234";

// Demo PIN required to submit a new application (PIN Keselamatan).
export const DEMO_SUBMIT_PIN = "1234";

let idSeq = 1000;
function nextId(prefix: string): string {
  return `${prefix}-${++idSeq}`;
}

export interface NewApplicationInput {
  workflowType: WorkflowType;
  applicantPersonaId: string;
  applicant: Application["applicant"];
  competencyCategory?: CompetencyCategory;
  contractorClass?: ContractorClass;
  contractorKind?: Application["contractorKind"];
  registrationPeriodYears: RegistrationPeriod;
  employerId?: string;
  // CE flow supplies a confirmer-bearing ref inline (the selected Orang Kompeten);
  // takes precedence over employerId when present.
  employer?: Application["employer"];
  // CE flow: the full set of appointed Orang Kompeten satisfying the class.
  appointedOks?: AppointedOk[];
  declarationAccepted?: boolean;
  documents: Application["documents"];
}

export type WorkflowAction =
  | "submit"
  | "confirm_appointment"
  | "decline_appointment"
  | "submit_final"
  | "pay_processing"
  | "verify_identity"
  | "raise_query"
  | "forward"
  | "reject"
  | "resubmit"
  | "approve_sign"
  | "pay_registration"
  | "withdraw";

export interface ActionPayload {
  note?: string;
  bank?: string;
  pin?: string;
  documents?: AppDocument[];
  /** Real gateway transaction details (ToyyibPay), when not a simulated payment. */
  payment?: { fpxRef?: string; receiptNo?: string; provider?: string };
}

export const useStWorkflowStore = defineStore("st-workflow", () => {
  const applications = ref<Application[]>([]);
  const now = ref<number>(Date.now());
  const realtimeTick = ref(false);
  let realtimeTimer: number | null = null;
  /** Apps healed from staff-task email notify (inbox sync). Claim still follows FIFO. */
  const emailPriorityIds = ref<Set<string>>(new Set());

  // ── getters ──────────────────────────────────────────────────────────────
  const byId = (id: string) => applications.value.find((a) => a.id === id);

  const myApplications = computed(() => {
    const session = useStSessionStore();
    const id = session.currentPersonaId;
    if (!id) return [];
    const myEmployerIds = new Set(
      EMPLOYERS.filter((e) => e.confirmerPersonaId === id).map((e) => e.id),
    );
    const myOrgNames = new Set(
      EMPLOYERS.filter((e) => e.confirmerPersonaId === id).map((e) => e.name.trim().toLowerCase()),
    );
    return applications.value
      .filter((a) => {
        if (a.applicantPersonaId === id) return true;
        // CE NA-03: appointed OK follows the contractor application after acceptance.
        if (a.appointedOks?.some((o) => o.personaId === id)) return true;
        // Majikan: own contractor applications (by org / employer id).
        if (a.workflowType === "CE") {
          if (a.employer?.id && myEmployerIds.has(a.employer.id)) return true;
          if (a.employer?.name && myOrgNames.has(a.employer.name.trim().toLowerCase())) return true;
        }
        return false;
      })
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  });

  // Applications awaiting the given persona's appointment confirmation.
  // OK flow → majikan confirmer; CE NA-03 → appointed OK with linked persona.
  const confirmationsFor = (personaId: string): Application[] => {
    const myEmployerIds = new Set(
      EMPLOYERS.filter((e) => e.confirmerPersonaId === personaId).map((e) => e.id),
    );
    const myOrgNames = new Set(
      EMPLOYERS.filter((e) => e.confirmerPersonaId === personaId).map((e) => e.name.trim().toLowerCase()),
    );
    return applications.value.filter((a) => {
      if (a.status !== "awaiting_employer_confirm") return false;
      // CE: only the appointed OK who still needs to accept (PFD-RG-CE-NA-03).
      if (a.workflowType === "CE" && a.appointedOks?.length) {
        return a.appointedOks.some((o) => o.personaId === personaId && !o.confirmed);
      }
      if (a.employer?.confirmerPersonaId === personaId) return true;
      if (a.employer?.id && myEmployerIds.has(a.employer.id)) return true;
      if (a.employer?.name && myOrgNames.has(a.employer.name.trim().toLowerCase())) return true;
      return false;
    });
  };

  function toInboxItem(a: Application, forRole: PersonaRole, tab: TaskTab): InboxItem {
    return {
      applicationId: a.id,
      refNo: a.refNo,
      // CE inbox shows the company; OK shows the competent person.
      applicantName: a.workflowType === "CE" ? (a.employer?.name ?? a.applicant.fullName) : a.applicant.fullName,
      workflowType: a.workflowType,
      forRole,
      tab,
      status: a.status,
      stageEnteredAt: a.stageEnteredAt,
      slaTargetHours: a.slaTargetHours,
      createdAt: a.createdAt,
    };
  }

  function lastQueryRole(a: Application): PersonaRole | "system" | undefined {
    const q = [...a.auditTrail].reverse().find((e) => e.toStatus === "query_applicant");
    return q?.actorRole;
  }

  /** Oldest stage entry first — matches SLA countdown urgency. */
  const fifoBySla = (arr: Application[]) =>
    [...arr].sort((a, b) => {
      // D11 reassignment: boosted cases sit at the top of the new SOS queue.
      const aBoost = a.queueBoostAt ? Date.parse(a.queueBoostAt) : 0;
      const bBoost = b.queueBoostAt ? Date.parse(b.queueBoostAt) : 0;
      if (aBoost !== bBoost) return bBoost - aBoost;
      return Date.parse(a.stageEnteredAt) - Date.parse(b.stageEnteredAt);
    });

  /** Queue membership is by workflow stream + status — never by stale assignedRole alone. */
  function belongsToRoleQueue(a: Application, role: PersonaRole): boolean {
    const active = STAGE_FOR_STAFF_ROLE[role];
    if (!active || a.status !== active) return false;
    return staffRoleForStatus(a.workflowType, a.status) === role;
  }

  const inboxFor = (role: PersonaRole): Record<TaskTab, InboxItem[]> => {
    const newItems = fifoBySla(applications.value.filter((a) => belongsToRoleQueue(a, role)));

    const queryItems = fifoBySla(
      applications.value.filter((a) => a.status === "query_applicant" && lastQueryRole(a) === role),
    );

    const completedItems = fifoBySla(
      applications.value.filter(
        (a) =>
          a.assignedRole !== role &&
          a.status !== "query_applicant" &&
          a.auditTrail.some((e) => e.actorRole === role),
      ),
    );

    return {
      new: newItems.map((a) => toInboxItem(a, role, "new")),
      query: queryItems.map((a) => toInboxItem(a, role, "query")),
      completed: completedItems.map((a) => toInboxItem(a, role, "completed")),
    };
  };

  /**
   * Next claimable FIFO head for "Baharu" — oldest unassigned item by stageEnteredAt.
   * Already-claimed tasks stay in the list (as Buka) but do not block the next claim.
   */
  const fifoHeadId = (role: PersonaRole): string | null => {
    const head = fifoBySla(
      applications.value.filter((a) => belongsToRoleQueue(a, role) && !a.assigneePersonaId),
    )[0];
    return head?.id ?? null;
  };

  /** Only the next unassigned SLA head may be claimed (FIFO). */
  const canClaimByFifo = (applicationId: string, role: PersonaRole): boolean => {
    const app = byId(applicationId);
    if (!app || app.assigneePersonaId) return false;
    return fifoHeadId(role) === applicationId;
  };

  function markEmailPriority(applicationId: string) {
    if (emailPriorityIds.value.has(applicationId)) return;
    const next = new Set(emailPriorityIds.value);
    next.add(applicationId);
    emailPriorityIds.value = next;
  }

  function clearEmailPriority(applicationId: string) {
    if (!emailPriorityIds.value.has(applicationId)) return;
    const next = new Set(emailPriorityIds.value);
    next.delete(applicationId);
    emailPriorityIds.value = next;
  }

  const isEmailPriority = (applicationId: string): boolean => emailPriorityIds.value.has(applicationId);

  /** Active load for one officer (max-3 is per person, so two SOS can work in parallel). */
  const activeCountFor = (role: PersonaRole, personaId?: string | null): number => {
    const session = useStSessionStore();
    const mine = personaId ?? session.currentPersonaId;
    return applications.value.filter(
      (a) =>
        a.assignedRole === role &&
        a.assigneePersonaId != null &&
        (mine ? a.assigneePersonaId === mine : true),
    ).length;
  };

  const atActiveLimit = (role: PersonaRole, personaId?: string | null): boolean =>
    activeCountFor(role, personaId) >= MAX_ACTIVE_TASKS;

  const maxActiveTasks = MAX_ACTIVE_TASKS;

  const feeFor = (application: Application, kind: PaymentKind) => charterFeeFor(application, kind);

  // ── audit / notification helpers ───────────────────────────────────────────
  function addAudit(app: Application, actorPersonaId: string, action: string, extra: Partial<AuditEntry> = {}) {
    const persona = personaById(actorPersonaId);
    app.auditTrail.push({
      id: nextId("aud"),
      at: new Date(now.value).toISOString(),
      actorPersonaId,
      actorRole: (extra.actorRole ?? persona?.role ?? "system") as AuditEntry["actorRole"],
      actorName: extra.actorName ?? persona?.name ?? "Sistem",
      action,
      fromStatus: extra.fromStatus,
      toStatus: extra.toStatus,
      note: extra.note,
    });
    app.updatedAt = new Date(now.value).toISOString();
  }

  function notify(
    personaId: string,
    type: NotificationType,
    title: string,
    body: string,
    applicationId?: string,
  ) {
    useStNotificationsStore().push(personaId, type, title, body, applicationId, new Date(now.value).toISOString());
  }

  /**
   * Retire the action-required notification once the task behind it is done, so
   * the Inbox only surfaces outstanding work. Without this, e.g. a majikan keeps
   * seeing "Pengesahan lantikan diperlukan" for an application already confirmed.
   */
  function resolveNotifications(applicationId: string, types: NotificationType[], personaId?: string) {
    useStNotificationsStore().resolve(applicationId, types, personaId);
  }

  function assignTo(app: Application, role: PersonaRole | null, personaId: string | null = null) {
    app.assignedRole = role;
    app.assigneePersonaId = personaId;
    if (role) {
      app.slaTargetHours = slaTargetFor(role);
      app.stageEnteredAt = new Date(now.value).toISOString();
    } else {
      app.slaTargetHours = 0;
    }
  }

  /** Progress rank — used to heal stale localStorage when opening an email deep link. */
  function statusRank(status: ApplicationStatus): number {
    const order: ApplicationStatus[] = [
      "draft",
      "awaiting_employer_confirm",
      "awaiting_final_submit",
      "awaiting_processing_payment",
      "sos_review",
      "query_applicant",
      "technical_review",
      "pending_approval",
      "awaiting_registration_payment",
      "certificate_issued",
      "rejected",
      "withdrawn",
    ];
    const i = order.indexOf(status);
    return i < 0 ? 0 : i;
  }

  /**
   * When an email deep link includes ?stage=…, advance a stale mock app so the
   * recipient sees the same stage the email promised (localStorage can lag/reset).
   */
  function syncFromEmailStage(applicationId: string, stage: string): boolean {
    const app = byId(applicationId);
    if (!app) return false;
    if (
      stage !== "sos_review" &&
      stage !== "technical_review" &&
      stage !== "pending_approval"
    ) {
      return false;
    }
    if (statusRank(app.status) >= statusRank(stage)) {
      return false;
    }

    const role = staffRoleForStatus(app.workflowType, stage) ?? "approver";
    const roleLabel = ROLE_LABEL[role];
    const from = app.status;
    app.status = stage;
    assignTo(app, role, null);
    app.updatedAt = new Date(now.value).toISOString();
    markEmailPriority(applicationId);
    addAudit(app, "system", `Disegerakkan dari e-mel tugasan (${roleLabel})`, {
      actorRole: "system",
      actorName: "Sistem",
      fromStatus: from,
      toStatus: stage,
    });
    return true;
  }

  /**
   * Claim via legacy email deep-link — still follows FIFO (no skip).
   * New staff emails land on Peti Tugasan instead of application detail.
   */
  function claimFromEmailLink(applicationId: string): boolean {
    const app = byId(applicationId);
    const session = useStSessionStore();
    if (!app || !session.role || app.assignedRole !== session.role) return false;
    if (app.assigneePersonaId === session.currentPersonaId) return true;
    if (app.assigneePersonaId) return false;
    if (!canClaimByFifo(applicationId, session.role)) return false;
    if (atActiveLimit(session.role, session.currentPersonaId)) return false;
    app.assigneePersonaId = session.currentPersonaId;
    addAudit(app, session.currentPersonaId ?? "system", "Mengambil tugasan (pautan e-mel)");
    clearEmailPriority(applicationId);
    app.queueBoostAt = undefined;
    return true;
  }

  /**
   * Heal Peti Tugasan when this browser's localStorage lags the server notify
   * cache (SOS forwarded + emailed in another session/browser).
   */
  async function syncInboxFromStaffNotifies(role: PersonaRole): Promise<number> {
    const targetStage = STAGE_FOR_STAFF_ROLE[role];
    if (!targetStage) return 0;

    // Include apps already at this stage (unassigned) so email priority is restored
    // after a refresh, plus anything still lagging behind — scoped to this role's stream.
    const candidates = applications.value.filter(
      (a) =>
        staffRoleForStatus(a.workflowType, targetStage) === role &&
        ((a.status === targetStage && !a.assigneePersonaId) ||
          statusRank(a.status) < statusRank(targetStage)),
    );
    if (candidates.length === 0) return 0;

    let healed = 0;
    await Promise.all(
      candidates.map(async (a) => {
        try {
          const res = await getStaffTaskNotifyState(a.id);
          const notifyRole = res.data?.role;
          if (notifyRole !== role) return;
          const notifyStage = STAGE_FOR_STAFF_ROLE[notifyRole as PersonaRole];
          if (!notifyStage) return;
          if (syncFromEmailStage(a.id, notifyStage) || a.status === notifyStage) {
            markEmailPriority(a.id);
            healed += 1;
          }
        } catch {
          // No notify recorded for this code — leave local mock as-is.
        }
      }),
    );
    return healed;
  }

  /** Email SOS / technical / approver via backend (simulation inbox override). */
  function emailStaffTask(app: Application, role: PersonaRole) {
    if (!(role in STAGE_FOR_STAFF_ROLE)) return;
    const moduleCode = app.workflowType === "CE" ? "RG-CE" : "RG-KE";
    void notifyStaffWorkflowTask({
      role: role as StaffTaskNotifyInput["role"],
      refNo: app.refNo,
      applicantName: app.applicant.fullName,
      moduleCode,
      applicationCode: app.id,
      // Staff emails open Peti Tugasan (FIFO); stage heal happens via notify cache on inbox load.
      actionPath: "/st/inbox",
      stepId: `mock-${role}`,
    }).catch(() => {
      // Non-blocking: UI transition must not fail if mail/API is unavailable.
    });
  }

  /** Email applicant when staff raises Pertanyaan (simulation inbox override). */
  function emailApplicantQuery(app: Application, note: string) {
    const trimmed = note.trim();
    if (!trimmed || !app.applicant.email) return;
    const moduleCode = app.workflowType === "CE" ? "RG-CE" : "RG-KE";
    void notifyApplicantQuery({
      applicantEmail: app.applicant.email,
      note: trimmed,
      refNo: app.refNo,
      applicantName: app.applicant.fullName,
      moduleCode,
      applicationCode: app.id,
      actionPath: `/st/applications/${app.id}?stage=query_applicant`,
    }).catch(() => {
      // Non-blocking: UI transition must not fail if mail/API is unavailable.
    });
  }

  /** Email applicant when staff rejects an application (simulation inbox override). */
  function emailApplicantRejection(app: Application, note?: string) {
    if (!app.applicant.email) return;
    const moduleCode = app.workflowType === "CE" ? "RG-CE" : "RG-KE";
    void notifyApplicantRejection({
      applicantEmail: app.applicant.email,
      note: note?.trim() || undefined,
      refNo: app.refNo,
      applicantName: app.applicant.fullName,
      moduleCode,
      applicationCode: app.id,
      actionPath: `/st/applications/${app.id}?stage=rejected`,
    }).catch(() => {
      // Non-blocking: UI transition must not fail if mail/API is unavailable.
    });
  }

  /**
   * Persist status changes for API-backed RG-KE/RG-CE apps so syncFromApi
   * (and other sessions) do not revert local Pinia transitions.
   */
  async function persistApplicationStatus(
    app: Application,
    status: ApplicationStatus,
    extras: { note?: string; documents?: AppDocument[]; timelineLabel?: string } = {},
  ): Promise<void> {
    try {
      const existing = await getStRegistrationApplicationByCode(app.id);
      const prevDetail =
        existing.data.detail && typeof existing.data.detail === "object"
          ? { ...(existing.data.detail as Record<string, unknown>) }
          : {};
      const timeline = Array.isArray(prevDetail.timeline) ? [...prevDetail.timeline] : [];
      const actorName = personaById(useStSessionStore().currentPersonaId ?? "")?.name ?? "Sistem";
      timeline.push({
        at: app.stageEnteredAt || new Date().toISOString(),
        label: extras.timelineLabel ?? `Status: ${status}`,
        actor: actorName,
      });
      if (extras.documents?.length) {
        const docs = Array.isArray(prevDetail.documents) ? [...prevDetail.documents] : [];
        for (const d of extras.documents) {
          docs.push({ label: d.label, fileName: d.fileName });
        }
        prevDetail.documents = docs;
      }
      prevDetail.timeline = timeline;
      // Keep claim/queue metadata aligned with Pinia so syncFromApi does not revive claims.
      prevDetail.assigneePersonaId = app.assigneePersonaId;
      if (app.assignedRole) prevDetail.assignedRole = app.assignedRole;
      else delete prevDetail.assignedRole;

      // Persist CE appointed-OK confirmation so syncFromApi does not reopen NA-03.
      if (app.appointedOks?.length) {
        const ce =
          prevDetail.ce && typeof prevDetail.ce === "object" && !Array.isArray(prevDetail.ce)
            ? { ...(prevDetail.ce as Record<string, unknown>) }
            : {};
        const prevOks = Array.isArray(ce.appointedOks) ? ce.appointedOks : [];
        ce.appointedOks = app.appointedOks.map((ok, i) => {
          const prev = (prevOks[i] && typeof prevOks[i] === "object"
            ? (prevOks[i] as Record<string, unknown>)
            : {}) as Record<string, unknown>;
          return {
            ...prev,
            okId: prev.okId ?? ok.registeredOkId,
            registeredOkId: ok.registeredOkId,
            name: ok.name,
            mykad: ok.mykad,
            wirerType: ok.wirerType,
            personaId: ok.personaId,
            confirmed: ok.confirmed,
            confirmedAt: ok.confirmedAt,
          };
        });
        prevDetail.ce = ce;
      }

      await updateStRegistrationApplication(existing.data.id, {
        status,
        stageEnteredAt: app.stageEnteredAt,
        note: extras.note,
        detail: prevDetail as NonNullable<typeof existing.data.detail>,
      });

      // Keep registration module list in sync with Peti status.
      try {
        const { useStRegistrationStore } = await import("./registration");
        const twin = useStRegistrationStore().byId(app.id);
        if (twin) {
          twin.status = status;
          twin.stageEnteredAt = app.stageEnteredAt;
          twin.detail = { ...(twin.detail ?? {}), ...prevDetail };
        }
      } catch {
        // Registration store may not be initialised yet.
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      // Local-only / mock apps have no DB row — Pinia state is enough.
      if (/not found/i.test(message)) {
        return;
      }
      // Never block the UI transition/redirect if the API write fails.
      console.error("persistApplicationStatus failed", app.id, status, err);
    }
  }

  /** Fire-and-forget persist so staff can return to Peti Tugasan immediately. */
  function queuePersistApplicationStatus(
    app: Application,
    status: ApplicationStatus,
    extras: { note?: string; documents?: AppDocument[]; timelineLabel?: string } = {},
  ): void {
    void persistApplicationStatus(app, status, extras);
  }

  // ── state machine ──────────────────────────────────────────────────────────
  async function transition(applicationId: string, action: WorkflowAction, payload: ActionPayload = {}) {
    const app = byId(applicationId);
    if (!app) throw new Error("Permohonan tidak dijumpai");
    const session = useStSessionStore();
    const actorId = session.currentPersonaId ?? "system";
    const from = app.status;

    const setStatus = (to: ApplicationStatus) => {
      app.status = to;
      app.stageEnteredAt = new Date(now.value).toISOString();
      app.updatedAt = app.stageEnteredAt;
    };

    switch (action) {
      case "submit": {
        if (from !== "draft") break;
        setStatus("awaiting_employer_confirm");
        assignTo(app, null);
        if (app.declarationAcceptedAt) {
          addAudit(app, actorId, "Pengakuan pemohon disahkan (PIN keselamatan)");
        }
        addAudit(app, actorId, "Menghantar permohonan", { fromStatus: from, toStatus: app.status });
        if (app.employer) {
          notify(app.employer.confirmerPersonaId, "appointment_request", "Pengesahan lantikan diperlukan",
            `${app.applicant.fullName} memohon pengesahan lantikan (${app.refNo}).`, app.id);
        }
        break;
      }
      case "confirm_appointment": {
        if (from !== "awaiting_employer_confirm") break;
        if (payload.documents?.length) {
          app.documents.push(...payload.documents);
          addAudit(app, actorId, "Memuat naik penyata KWSP & PERKESO");
        }
        // Mark the confirming OK (CE flow) as accepted.
        const appointed = app.appointedOks?.find((o) => o.personaId === actorId);
        if (appointed) {
          appointed.confirmed = true;
          appointed.confirmedAt = new Date(now.value).toISOString();
        }
        // CE NA-03 → NA-04 (majikan hantar); OK flow → bayaran terus.
        if (app.workflowType === "CE") {
          setStatus("awaiting_final_submit");
          addAudit(app, actorId, "Mengesahkan lantikan OK", { fromStatus: from, toStatus: app.status });
          resolveNotifications(app.id, ["appointment_request"]);
          notify(
            app.applicantPersonaId,
            "appointment_request",
            "Pelantikan OK diterima — hantar permohonan",
            `Orang Kompeten telah menerima pelantikan bagi ${app.refNo}. Sila hantar permohonan (PFD-RG-CE-NA-04).`,
            app.id,
          );
          await persistApplicationStatus(app, app.status, {
            documents: payload.documents,
            timelineLabel: "Lantikan OK disahkan — menunggu penghantaran majikan",
          });
        } else {
          setStatus("awaiting_processing_payment");
          addAudit(app, actorId, "Mengesahkan lantikan", { fromStatus: from, toStatus: app.status });
          resolveNotifications(app.id, ["appointment_request"]);
          notify(app.applicantPersonaId, "payment_due", "Lantikan disahkan",
            `Sila bayar yuran pemprosesan bagi ${app.refNo}.`, app.id);
          await persistApplicationStatus(app, app.status, {
            documents: payload.documents,
            timelineLabel: "Lantikan disahkan majikan",
          });
        }
        break;
      }
      case "submit_final": {
        // PFD-RG-CE-NA-04 · Hantar Permohonan (selepas OK terima pelantikan).
        if (from !== "awaiting_final_submit") break;
        setStatus("awaiting_processing_payment");
        addAudit(app, actorId, "Menghantar permohonan (selepas penerimaan OK)", {
          fromStatus: from,
          toStatus: app.status,
        });
        resolveNotifications(app.id, ["appointment_request"], app.applicantPersonaId);
        notify(
          app.applicantPersonaId,
          "payment_due",
          "Sila bayar fi proses",
          `Permohonan ${app.refNo} telah dihantar. Sila buat bayaran fi proses (PFD-RG-CE-NA-05).`,
          app.id,
        );
        await persistApplicationStatus(app, app.status, {
          timelineLabel: "Permohonan dihantar majikan (PFD-RG-CE-NA-04)",
        });
        break;
      }
      case "decline_appointment": {
        if (from !== "awaiting_employer_confirm") break;
        setStatus("rejected");
        addAudit(app, actorId, "Menolak lantikan", { fromStatus: from, toStatus: app.status, note: payload.note });
        resolveNotifications(app.id, ["appointment_request"]);
        notify(app.applicantPersonaId, "rejected", "Lantikan ditolak", `Lantikan bagi ${app.refNo} telah ditolak.`, app.id);
        emailApplicantRejection(app, payload.note ?? "Lantikan ditolak oleh majikan/pengesah.");
        await persistApplicationStatus(app, app.status, {
          note: payload.note,
          timelineLabel: "Lantikan ditolak majikan",
        });
        break;
      }
      case "pay_processing": {
        if (from !== "awaiting_processing_payment") break;
        app.payments.push({
          id: nextId("pay"), kind: "processing", amount: feeFor(app, "processing"), currency: "MYR",
          status: "paid", fpxRef: payload.payment?.fpxRef ?? nextId("FPX").toUpperCase(),
          bank: payload.bank ?? payload.payment?.provider ?? "Maybank2u",
          paidAt: new Date(now.value).toISOString(), receiptNo: payload.payment?.receiptNo ?? nextId("RCP").toUpperCase(),
        });
        addAudit(app, actorId, "Membayar yuran pemprosesan");
        resolveNotifications(app.id, ["payment_due"], app.applicantPersonaId);
        setStatus("sos_review");
        const sosRole = staffRoleFor(app.workflowType, "sos");
        assignTo(app, sosRole, null);
        addAudit(app, actorId, "Permohonan memasuki giliran SOS", { toStatus: app.status });
        const sosPersona = STAFF_PERSONA_BY_ROLE[sosRole];
        if (sosPersona) {
          notify(sosPersona, "task_assigned", "Tugasan baharu di peti masuk",
            `Permohonan ${app.refNo} menunggu semakan SOS.`, app.id);
        }
        emailStaffTask(app, sosRole);
        await persistApplicationStatus(app, app.status, {
          timelineLabel: "Yuran pemprosesan dibayar",
        });
        break;
      }
      case "verify_identity": {
        if (from !== "sos_review") break;
        app.identityCheck = { jpnStatus: "alive", checkedAt: new Date(now.value).toISOString(), checkedByPersonaId: actorId };
        addAudit(app, actorId, "Mengesahkan identiti (JPN — masih hidup)");
        break;
      }
      case "raise_query": {
        if (from !== "sos_review" && from !== "technical_review") break;
        setStatus("query_applicant");
        assignTo(app, null);
        addAudit(app, actorId, "Membangkitkan pertanyaan", { fromStatus: from, toStatus: app.status, note: payload.note });
        // Application leaves the officer's queue — retire their task notice.
        resolveNotifications(app.id, ["task_assigned"]);
        notify(app.applicantPersonaId, "query_raised", "Pertanyaan daripada pegawai",
          `Permohonan ${app.refNo} memerlukan tindakan anda.`, app.id);
        emailApplicantQuery(app, payload.note ?? "");
        queuePersistApplicationStatus(app, app.status, {
          note: payload.note,
          timelineLabel: "Pertanyaan dibangkitkan kepada pemohon",
        });
        break;
      }
      case "forward": {
        // Retire the current officer's task notice before raising the next one.
        resolveNotifications(app.id, ["task_assigned"]);
        if (from === "sos_review") {
          setStatus("technical_review");
          const techRole = staffRoleFor(app.workflowType, "technical");
          assignTo(app, techRole, null);
          addAudit(app, actorId, "Memajukan ke Pegawai Teknikal", { fromStatus: from, toStatus: app.status });
          const techPersona = STAFF_PERSONA_BY_ROLE[techRole];
          if (techPersona) {
            notify(techPersona, "task_assigned", "Tugasan semakan teknikal",
              `Permohonan ${app.refNo} menunggu semakan teknikal.`, app.id);
          }
          emailStaffTask(app, techRole);
          queuePersistApplicationStatus(app, app.status, {
            timelineLabel: "Dimajukan ke Pegawai Teknikal",
          });
        } else if (from === "technical_review") {
          setStatus("pending_approval");
          assignTo(app, "approver", null);
          addAudit(app, actorId, "Memajukan ke Pelulus", { fromStatus: from, toStatus: app.status });
          notify("p-zainab", "task_assigned", "Permohonan menunggu kelulusan",
            `Permohonan ${app.refNo} menunggu kelulusan & tandatangan digital.`, app.id);
          emailStaffTask(app, "approver");
          queuePersistApplicationStatus(app, app.status, {
            timelineLabel: "Dimajukan ke Pelulus",
          });
        }
        break;
      }
      case "reject": {
        if (!["sos_review", "technical_review", "pending_approval"].includes(from)) break;
        setStatus("rejected");
        assignTo(app, null);
        addAudit(app, actorId, "Menolak permohonan", { fromStatus: from, toStatus: app.status, note: payload.note });
        // Terminal — nothing outstanding for anyone on this application.
        resolveNotifications(app.id, ["task_assigned", "appointment_request", "payment_due", "query_raised"]);
        notify(app.applicantPersonaId, "rejected", "Permohonan ditolak",
          `Permohonan ${app.refNo} telah ditolak.`, app.id);
        emailApplicantRejection(app, payload.note);
        queuePersistApplicationStatus(app, app.status, {
          note: payload.note,
          timelineLabel: "Permohonan ditolak",
        });
        break;
      }
      case "resubmit": {
        if (from !== "query_applicant") break;
        const returnRole = lastQueryRole(app);
        const sosFallback = staffRoleFor(app.workflowType, "sos");
        const resumeRole: PersonaRole =
          returnRole === "technical" || returnRole === "technical_ce"
            ? staffRoleFor(app.workflowType, "technical")
            : returnRole === "approver"
              ? "approver"
              : sosFallback;
        const resumeStatus = STAGE_FOR_STAFF_ROLE[resumeRole] ?? "sos_review";
        setStatus(resumeStatus);
        assignTo(app, resumeRole, null);
        addAudit(app, actorId, "Menghantar semula maklumat", { fromStatus: from, toStatus: app.status, note: payload.note });
        // Applicant answered the query — retire their query notice.
        resolveNotifications(app.id, ["query_raised"], app.applicantPersonaId);
        const resumePersona = STAFF_PERSONA_BY_ROLE[resumeRole];
        if (resumePersona) {
          notify(resumePersona, "task_assigned", "Pertanyaan dijawab",
            `Permohonan ${app.refNo} telah dikemas kini oleh pemohon.`, app.id);
        }
        emailStaffTask(app, resumeRole);
        await persistApplicationStatus(app, app.status, {
          note: payload.note,
          timelineLabel: "Pemohon menghantar semula maklumat",
        });
        break;
      }
      case "approve_sign": {
        if (from !== "pending_approval") {
          throw new Error("Permohonan tidak dalam status menunggu kelulusan");
        }
        if (payload.pin !== DEMO_SIGNATURE_PIN) throw new Error("PIN tandatangan digital tidak sah");
        setStatus("awaiting_registration_payment");
        assignTo(app, null);
        addAudit(app, actorId, "Meluluskan & menandatangani secara digital", { fromStatus: from, toStatus: app.status });
        // Approval done — retire the approver's task notice.
        resolveNotifications(app.id, ["task_assigned"]);
        notify(app.applicantPersonaId, "approved", "Permohonan diluluskan",
          `Permohonan ${app.refNo} diluluskan. Sila bayar yuran pendaftaran.`, app.id);
        await persistApplicationStatus(app, app.status, {
          timelineLabel: "Diluluskan & ditandatangani secara digital",
        });
        break;
      }
      case "pay_registration": {
        if (from !== "awaiting_registration_payment") break;
        app.payments.push({
          id: nextId("pay"), kind: "registration", amount: feeFor(app, "registration"), currency: "MYR",
          status: "paid", fpxRef: payload.payment?.fpxRef ?? nextId("FPX").toUpperCase(),
          bank: payload.bank ?? payload.payment?.provider ?? "Maybank2u",
          paidAt: new Date(now.value).toISOString(), receiptNo: payload.payment?.receiptNo ?? nextId("RCP").toUpperCase(),
        });
        addAudit(app, actorId, "Membayar yuran pendaftaran");
        resolveNotifications(app.id, ["payment_due", "approved"], app.applicantPersonaId);
        issueCertificate(app);
        setStatus("certificate_issued");
        addAudit(app, "system", "Sijil digital dikeluarkan", { actorRole: "system", actorName: "Sistem", toStatus: app.status });
        notify(app.applicantPersonaId, "certificate_issued", "Sijil digital dikeluarkan",
          `Sijil bagi ${app.refNo} telah dikeluarkan.`, app.id);
        await persistApplicationStatus(app, app.status, {
          timelineLabel: "Yuran pendaftaran dibayar · sijil dikeluarkan",
        });
        break;
      }
      case "withdraw": {
        if (["certificate_issued", "rejected", "withdrawn"].includes(from)) break;
        setStatus("withdrawn");
        assignTo(app, null);
        addAudit(app, actorId, "Menarik balik permohonan", { fromStatus: from, toStatus: app.status });
        // Terminal — retire every outstanding action notice for this application.
        resolveNotifications(app.id, ["task_assigned", "appointment_request", "payment_due", "query_raised"]);
        await persistApplicationStatus(app, app.status, {
          timelineLabel: "Permohonan ditarik balik",
        });
        break;
      }
    }
  }

  function issueCertificate(app: Application) {
    const refTail = app.refNo.split("/").pop();
    const serial = `ST-${app.workflowType}-2026-${refTail}`;
    const years = app.registrationPeriodYears;
    const issuedAt = new Date(now.value).toISOString();
    const expiresAt = new Date(now.value + years * 365 * 24 * 3_600_000).toISOString();
    const base: Certificate = {
      id: nextId("cert"),
      serialNo: serial,
      applicationId: app.id,
      holderName:
        app.workflowType === "CE"
          ? (app.employer?.name ?? app.applicant.fullName)
          : app.applicant.fullName,
      competencyCategory: app.competencyCategory,
      contractorClass: app.contractorClass,
      contractorKind: app.contractorKind,
      issuedAt,
      expiresAt,
      qrPayload: `https://verify.st.gov.my/cert/${serial}`,
      trustmarkId: `ST-TRUST-${refTail}`,
    };
    app.certificate =
      app.workflowType === "OK"
        ? withOkCertificateFields(base, app)
        : withCeCertificateFields(base, app);

    // CE: also issue a Perakuan Orang Kompeten for each appointed OK.
    if (app.workflowType === "CE" && app.appointedOks?.length) {
      app.okCertificates = app.appointedOks.map((ok, i) => {
        const okSerial = `ST-OK-2026-${refTail}-${String(i + 1).padStart(2, "0")}`;
        const okBase: Certificate = {
          id: nextId("cert"),
          serialNo: okSerial,
          applicationId: app.id,
          holderName: ok.name,
          competencyCategory: ok.competencyCategory ?? "PW",
          issuedAt,
          expiresAt,
          qrPayload: `https://verify.st.gov.my/cert/${okSerial}`,
          trustmarkId: `ST-TRUST-${refTail}-OK${i + 1}`,
        };
        return withOkCertificateFields(okBase, app, {
          holderIc: ok.mykad,
          categoryGrade: ok.wirerType,
        });
      });
    }
  }

  // ── convenience wrappers ─────────────────────────────────────────────────
  function submitNewApplication(input: NewApplicationInput): string {
    const employer = input.employer ?? employerById(input.employerId);
    const id = nextId("app");
    const refSeq = 300 + applications.value.length;
    const app: Application = {
      id,
      refNo: `ST/${input.workflowType}/2026/${String(refSeq).padStart(5, "0")}`,
      workflowType: input.workflowType,
      status: "draft",
      applicant: input.applicant,
      applicantPersonaId: input.applicantPersonaId,
      competencyCategory: input.competencyCategory,
      contractorClass: input.contractorClass,
      contractorKind:
        input.contractorKind ??
        (input.workflowType === "CE" ? "electrical" : undefined),
      registrationPeriodYears: input.registrationPeriodYears,
      employer,
      appointedOks: input.appointedOks,
      documents: input.documents,
      payments: [],
      auditTrail: [],
      assignedRole: null,
      assigneePersonaId: null,
      slaTargetHours: 0,
      stageEnteredAt: new Date(now.value).toISOString(),
      declarationAcceptedAt: input.declarationAccepted ? new Date(now.value).toISOString() : undefined,
      createdAt: new Date(now.value).toISOString(),
      updatedAt: new Date(now.value).toISOString(),
    };
    applications.value.unshift(app);
    transition(id, "submit");
    return id;
  }

  // Approve & digitally sign several applications with one PIN entry (BRS §4.2.7 pukal).
  // Must await each transition so DB persist finishes before the majikan refreshes.
  async function bulkApprove(ids: string[], pin: string): Promise<{ ok: string[]; failed: string[] }> {
    const result = { ok: [] as string[], failed: [] as string[] };
    for (const id of ids) {
      try {
        await transition(id, "approve_sign", { pin });
        const app = byId(id);
        if (!app || app.status !== "awaiting_registration_payment") {
          result.failed.push(id);
          continue;
        }
        result.ok.push(id);
      } catch (err) {
        console.error("bulkApprove failed", id, err);
        result.failed.push(id);
      }
    }
    return result;
  }

  function takeTask(applicationId: string): boolean {
    const app = byId(applicationId);
    const session = useStSessionStore();
    if (!app || !app.assignedRole || !session.role) return false;
    // Already claimed by me → idempotent success; claimed by another → refuse.
    if (app.assigneePersonaId) {
      return app.assigneePersonaId === session.currentPersonaId;
    }
    if (atActiveLimit(app.assignedRole, session.currentPersonaId)) return false; // max-3 per officer
    // Strict FIFO by SLA, unless this app was assigned via staff-task email.
    if (!canClaimByFifo(applicationId, app.assignedRole)) return false;
    app.assigneePersonaId = session.currentPersonaId;
    app.queueBoostAt = undefined;
    addAudit(app, session.currentPersonaId ?? "system", "Mengambil tugasan");
    clearEmailPriority(applicationId);
    return true;
  }

  /**
   * D11 SOS Catatan: flag TP SOS when Baharu exceeds 3h (waktu bekerja → wall-clock in prototype).
   * SLA / stageEnteredAt is not reset. Idempotent per application.
   */
  function syncSosEscalationFlags(): number {
    let flagged = 0;
    const tpId = STAFF_PERSONA_BY_ROLE.tp_sos;
    for (const app of applications.value) {
      if (app.status !== "sos_review") continue;
      if (app.escalationFlaggedAt) continue;
      const hours = elapsedHours(app.stageEnteredAt, now.value);
      if (hours <= SOS_ESCALATE_AFTER_HOURS) continue;

      app.escalationFlaggedAt = new Date(now.value).toISOString();
      addAudit(app, "system", `Ditanda eskalasi SLA (>${SOS_ESCALATE_AFTER_HOURS} jam) kepada TP SOS`, {
        actorRole: "system",
        actorName: "Sistem",
        note: "Permohonan melebihi 3 jam dalam Peti Tugasan (Baharu). TP SOS boleh menyerah semula.",
      });
      if (tpId) {
        notify(
          tpId,
          "sla_escalation",
          "Eskalasi SLA SOS",
          `${app.refNo} — ${app.applicant.fullName} telah melebihi ${SOS_ESCALATE_AFTER_HOURS} jam di Baharu. Sila semak dan serah semula jika perlu.`,
          app.id,
        );
      }
      flagged += 1;
    }
    return flagged;
  }

  /** SOS Baharu cases already flagged to TP SOS (still in sos_review). */
  function escalatedSosApplications(): Application[] {
    syncSosEscalationFlags();
    return fifoBySla(
      applications.value.filter(
        (a) => a.status === "sos_review" && Boolean(a.escalationFlaggedAt),
      ),
    );
  }

  /** SOS officer personas available as reassignment targets for a case. */
  function sosReassignTargets(applicationId: string) {
    const app = byId(applicationId);
    if (!app) return [];
    const role = sosOfficersForWorkflow(app.workflowType);
    return PERSONAS.filter((p) => p.role === role);
  }

  /**
   * TP SOS reassigns a flagged SOS case to another SOS.
   * Puts the case at the top of the new officer's queue; Piagam timer keeps running.
   */
  function reassignSos(
    applicationId: string,
    toPersonaId: string,
  ): { ok: true } | { ok: false; reason: string } {
    const session = useStSessionStore();
    if (!isTpSosRole(session.role)) {
      return { ok: false, reason: "Hanya TP SOS boleh menyerah semula tugasan." };
    }
    const app = byId(applicationId);
    if (!app || app.status !== "sos_review") {
      return { ok: false, reason: "Permohonan tidak berada dalam semakan SOS." };
    }
    const target = personaById(toPersonaId);
    const expectedRole = sosOfficersForWorkflow(app.workflowType);
    if (!target || target.role !== expectedRole) {
      return { ok: false, reason: "Pegawai SOS sasaran tidak sah untuk aliran ini." };
    }
    if (app.assigneePersonaId === toPersonaId) {
      return { ok: false, reason: "Permohonan sudah di bawah pegawai ini." };
    }

    const fromName = personaById(app.assigneePersonaId)?.name ?? "— (belum diambil)";
    // Do NOT reset stageEnteredAt / slaTargetHours — Piagam dikira berterusan.
    app.assignedRole = expectedRole;
    app.assigneePersonaId = toPersonaId;
    app.queueBoostAt = new Date(now.value).toISOString();
    if (!app.escalationFlaggedAt) {
      app.escalationFlaggedAt = new Date(now.value).toISOString();
    }

    addAudit(app, session.currentPersonaId ?? "system", "Menyerah semula (reassign) kepada SOS lain", {
      actorRole: "tp_sos",
      note: `Dari ${fromName} → ${target.name}. Masa Piagam Pelanggan diteruskan. Diletakkan di baris teratas peti SOS baharu.`,
    });

    notify(
      toPersonaId,
      "task_assigned",
      "Tugasan diserah semula (keutamaan)",
      `${app.refNo} — ${app.applicant.fullName} telah diserah semula oleh TP SOS dan diletakkan di baris teratas peti anda.`,
      app.id,
    );

    resolveNotifications(app.id, ["sla_escalation"]);
    return { ok: true };
  }

  // ── clock ────────────────────────────────────────────────────────────────
  function tick(hours: number) {
    now.value += hours * 3_600_000;
    syncSosEscalationFlags();
  }

  function toggleRealtime() {
    realtimeTick.value = !realtimeTick.value;
    if (realtimeTick.value) {
      realtimeTimer = window.setInterval(() => {
        now.value += 60_000;
        syncSosEscalationFlags();
      }, 1000);
    } else if (realtimeTimer != null) {
      window.clearInterval(realtimeTimer);
      realtimeTimer = null;
    }
  }

  // ── persistence / lifecycle ──────────────────────────────────────────────
  let applyingRemote = false;

  function persist() {
    if (typeof window === "undefined" || applyingRemote) return;
    const notifications = useStNotificationsStore();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ applications: applications.value, notifications: notifications.notifications, now: now.value }),
    );
  }

  /** Remap CE apps still tagged with OK sos/technical after the role split. */
  function normalizeStreamRoles(apps: Application[]): Application[] {
    return apps.map((a) => {
      if (a.workflowType !== "CE") return a;
      if (a.assignedRole === "sos") return { ...a, assignedRole: "sos_ce" };
      if (a.assignedRole === "technical") return { ...a, assignedRole: "technical_ce" };
      return a;
    });
  }

  function hydrateFromRaw(raw: string): boolean {
    try {
      const parsed = JSON.parse(raw);
      applyingRemote = true;
      applications.value = normalizeStreamRoles(parsed.applications ?? []);
      now.value = parsed.now ?? Date.now();
      useStNotificationsStore().setAll(parsed.notifications ?? []);
      applyingRemote = false;
      return true;
    } catch {
      applyingRemote = false;
      return false;
    }
  }

  function seedFresh() {
    applyingRemote = true;
    const s = seedState();
    applications.value = s.applications;
    now.value = s.baseNow;
    useStNotificationsStore().setAll(s.notifications);
    applyingRemote = false;
    persist();
  }

  /** Insert/replace a single application (e.g. after online OK/CE submit). */
  function ingestApplication(app: Application) {
    applyingRemote = true;
    const i = applications.value.findIndex((a) => a.id === app.id);
    if (i >= 0) {
      applications.value[i] = app;
    } else {
      applications.value.unshift(app);
    }
    applyingRemote = false;
    persist();
  }

  /**
   * Load RG-KE / RG-CE rows from the API so Peti Tugasan matches seeded DB
   * data and applications submitted online.
   */
  async function syncFromApi(): Promise<boolean> {
    try {
      const res = await listStRegistrationApplications(
        "?limit=200&sort_by=submitted_at&sort_dir=desc",
      );
      const mapped = (res.data ?? [])
        .filter((row) => row.moduleCode === "RG-KE" || row.moduleCode === "RG-CE")
        .map(mapRegistrationDtoToApplication);
      if (mapped.length === 0) return false;
      const localById = new Map(applications.value.map((a) => [a.id, a]));
      // Prefer optimistic local advances while background persist is still in flight.
      const merged = mapped.map((apiApp) => {
        const local = localById.get(apiApp.id);
        if (local && statusRank(local.status) > statusRank(apiApp.status)) {
          return local;
        }
        return apiApp;
      });
      const apiIds = new Set(merged.map((a) => a.id));
      // Keep in-session / local-only apps (e.g. ApplicationFormView) not yet in DB.
      const localExtras = applications.value.filter((a) => !apiIds.has(a.id));
      applyingRemote = true;
      applications.value = [...merged, ...localExtras];
      applyingRemote = false;
      persist();
      return true;
    } catch {
      return false;
    }
  }

  function init() {
    if (typeof window !== "undefined") {
      // Drop legacy keys so a version bump always reseeds once.
      for (const legacy of [
        "st.workflow.state.v13",
        "st.workflow.state.v12",
        "st.workflow.state.v11",
        "st.workflow.state.v10",
        "st.workflow.state.v9",
        "st.workflow.state.v8",
        "st.workflow.state.v7",
        "st.workflow.state.v6",
        "st.workflow.state.v5",
        "st.workflow.state.v4",
        "st.workflow.state.v3",
      ]) {
        localStorage.removeItem(legacy);
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw && hydrateFromRaw(raw)) {
        window.addEventListener("storage", (event) => {
          if (event.key === STORAGE_KEY && event.newValue) {
            hydrateFromRaw(event.newValue);
          }
        });
        syncSosEscalationFlags();
        void syncFromApi();
        return;
      }
      window.addEventListener("storage", (event) => {
        if (event.key === STORAGE_KEY && event.newValue) {
          hydrateFromRaw(event.newValue);
        }
      });
    }
    seedFresh();
    syncSosEscalationFlags();
    void syncFromApi();
  }

  function resetDemo() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    seedFresh();
    void syncFromApi();
  }

  // Persist app changes; keep `now` updates from clobbering newer apps written by another tab.
  watch(applications, persist, { deep: true });
  watch(now, () => {
    if (typeof window === "undefined" || applyingRemote) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        persist();
        return;
      }
      const parsed = JSON.parse(raw) as { applications?: Application[]; notifications?: unknown; now?: number };
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          applications: parsed.applications ?? applications.value,
          notifications: parsed.notifications ?? useStNotificationsStore().notifications,
          now: now.value,
        }),
      );
    } catch {
      persist();
    }
  });

  return {
    applications,
    now,
    realtimeTick,
    maxActiveTasks,
    byId,
    myApplications,
    confirmationsFor,
    inboxFor,
    fifoHeadId,
    canClaimByFifo,
    activeCountFor,
    atActiveLimit,
    feeFor,
    transition,
    syncFromEmailStage,
    syncFromApi,
    syncInboxFromStaffNotifies,
    claimFromEmailLink,
    isEmailPriority,
    submitNewApplication,
    bulkApprove,
    takeTask,
    syncSosEscalationFlags,
    escalatedSosApplications,
    sosReassignTargets,
    reassignSos,
    tick,
    toggleRealtime,
    init,
    resetDemo,
    ingestApplication,
  };
});
