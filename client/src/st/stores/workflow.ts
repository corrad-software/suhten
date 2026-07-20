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
import { notifyStaffWorkflowTask } from "@/api/st-registration";
import { seedState } from "../mock";
import { feeFor as charterFeeFor, slaTargetFor } from "../mock/charter";
import { personaById } from "../mock/personas";
import { employerById } from "../mock/employers";
import { useStSessionStore } from "./session";
import { useStNotificationsStore } from "./notifications";

const STORAGE_KEY = "st.workflow.state.v5";
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
}

export const useStWorkflowStore = defineStore("st-workflow", () => {
  const applications = ref<Application[]>([]);
  const now = ref<number>(Date.now());
  const realtimeTick = ref(false);
  let realtimeTimer: number | null = null;

  // ── getters ──────────────────────────────────────────────────────────────
  const byId = (id: string) => applications.value.find((a) => a.id === id);

  const myApplications = computed(() => {
    const session = useStSessionStore();
    const id = session.currentPersonaId;
    if (!id) return [];
    return applications.value
      .filter((a) => a.applicantPersonaId === id)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  });

  // Applications awaiting the given persona's appointment confirmation.
  const confirmationsFor = (personaId: string): Application[] =>
    applications.value.filter(
      (a) => a.status === "awaiting_employer_confirm" && a.employer?.confirmerPersonaId === personaId,
    );

  const activeStatusForRole: Record<string, ApplicationStatus> = {
    sos: "sos_review",
    technical: "technical_review",
    approver: "pending_approval",
  };

  function toInboxItem(a: Application, forRole: PersonaRole, tab: TaskTab): InboxItem {
    return {
      applicationId: a.id,
      refNo: a.refNo,
      applicantName: a.applicant.fullName,
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
    [...arr].sort((a, b) => Date.parse(a.stageEnteredAt) - Date.parse(b.stageEnteredAt));

  const inboxFor = (role: PersonaRole): Record<TaskTab, InboxItem[]> => {
    const active = activeStatusForRole[role];

    const newItems = active ? fifoBySla(applications.value.filter((a) => a.status === active)) : [];

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

  /** SLA FIFO head for "Baharu" — oldest stageEnteredAt in the role queue. */
  const fifoHeadId = (role: PersonaRole): string | null => {
    const active = activeStatusForRole[role];
    if (!active) return null;
    const head = fifoBySla(applications.value.filter((a) => a.status === active))[0];
    return head?.id ?? null;
  };

  /** Only the SLA head may be claimed, and only while still untaken. */
  const canClaimByFifo = (applicationId: string, role: PersonaRole): boolean => {
    if (fifoHeadId(role) !== applicationId) return false;
    const app = byId(applicationId);
    return Boolean(app && !app.assigneePersonaId);
  };

  const activeCountFor = (role: PersonaRole): number =>
    applications.value.filter((a) => a.assignedRole === role && a.assigneePersonaId != null).length;

  const atActiveLimit = (role: PersonaRole): boolean => activeCountFor(role) >= MAX_ACTIVE_TASKS;

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

  const STAGE_FOR_STAFF_ROLE: Record<"sos" | "technical" | "approver", ApplicationStatus> = {
    sos: "sos_review",
    technical: "technical_review",
    approver: "pending_approval",
  };

  /** Progress rank — used to heal stale localStorage when opening an email deep link. */
  function statusRank(status: ApplicationStatus): number {
    const order: ApplicationStatus[] = [
      "draft",
      "awaiting_employer_confirm",
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

    const role: PersonaRole =
      stage === "sos_review" ? "sos" : stage === "technical_review" ? "technical" : "approver";
    const roleLabel =
      role === "sos" ? "Pegawai SOS" : role === "technical" ? "Pegawai Teknikal" : "Pelulus";
    const from = app.status;
    app.status = stage;
    assignTo(app, role, null);
    app.updatedAt = new Date(now.value).toISOString();
    addAudit(app, "system", `Disegerakkan dari e-mel tugasan (${roleLabel})`, {
      actorRole: "system",
      actorName: "Sistem",
      fromStatus: from,
      toStatus: stage,
    });
    return true;
  }

  /** Email SOS / technical / approver via backend (simulation inbox override). */
  function emailStaffTask(app: Application, role: "sos" | "technical" | "approver") {
    const moduleCode = app.workflowType === "CE" ? "RG-CE" : "RG-KE";
    const stage = STAGE_FOR_STAFF_ROLE[role];
    void notifyStaffWorkflowTask({
      role,
      refNo: app.refNo,
      applicantName: app.applicant.fullName,
      moduleCode,
      applicationCode: app.id,
      // Embed target stage so opening the link heals stale browser mock state.
      actionPath: `/admin/st/applications/${app.id}?stage=${stage}`,
      stepId: `mock-${role}`,
    }).catch(() => {
      // Non-blocking: UI transition must not fail if mail/API is unavailable.
    });
  }

  // ── state machine ──────────────────────────────────────────────────────────
  function transition(applicationId: string, action: WorkflowAction, payload: ActionPayload = {}) {
    const app = byId(applicationId);
    if (!app) throw new Error("Permohonan tidak dijumpai");
    const session = useStSessionStore();
    const actorId = session.currentPersonaId ?? "system";
    const from = app.status;

    const setStatus = (to: ApplicationStatus) => {
      app.status = to;
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
        setStatus("awaiting_processing_payment");
        addAudit(app, actorId, "Mengesahkan lantikan", { fromStatus: from, toStatus: app.status });
        notify(app.applicantPersonaId, "payment_due", "Lantikan disahkan",
          `Sila bayar yuran pemprosesan bagi ${app.refNo}.`, app.id);
        break;
      }
      case "decline_appointment": {
        if (from !== "awaiting_employer_confirm") break;
        setStatus("rejected");
        addAudit(app, actorId, "Menolak lantikan", { fromStatus: from, toStatus: app.status, note: payload.note });
        notify(app.applicantPersonaId, "rejected", "Lantikan ditolak", `Lantikan bagi ${app.refNo} telah ditolak.`, app.id);
        break;
      }
      case "pay_processing": {
        if (from !== "awaiting_processing_payment") break;
        app.payments.push({
          id: nextId("pay"), kind: "processing", amount: feeFor(app, "processing"), currency: "MYR",
          status: "paid", fpxRef: nextId("FPX").toUpperCase(), bank: payload.bank ?? "Maybank2u",
          paidAt: new Date(now.value).toISOString(), receiptNo: nextId("RCP").toUpperCase(),
        });
        addAudit(app, actorId, "Membayar yuran pemprosesan");
        setStatus("sos_review");
        assignTo(app, "sos", null);
        addAudit(app, actorId, "Permohonan memasuki giliran SOS", { toStatus: app.status });
        notify("p-faridah", "task_assigned", "Tugasan baharu di peti masuk",
          `Permohonan ${app.refNo} menunggu semakan SOS.`, app.id);
        emailStaffTask(app, "sos");
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
        notify(app.applicantPersonaId, "query_raised", "Pertanyaan daripada pegawai",
          `Permohonan ${app.refNo} memerlukan tindakan anda.`, app.id);
        break;
      }
      case "forward": {
        if (from === "sos_review") {
          setStatus("technical_review");
          assignTo(app, "technical", null);
          addAudit(app, actorId, "Memajukan ke Pegawai Teknikal", { fromStatus: from, toStatus: app.status });
          notify("p-kumar", "task_assigned", "Tugasan semakan teknikal",
            `Permohonan ${app.refNo} menunggu semakan teknikal.`, app.id);
          emailStaffTask(app, "technical");
        } else if (from === "technical_review") {
          setStatus("pending_approval");
          assignTo(app, "approver", null);
          addAudit(app, actorId, "Memajukan ke Pelulus", { fromStatus: from, toStatus: app.status });
          notify("p-zainab", "task_assigned", "Permohonan menunggu kelulusan",
            `Permohonan ${app.refNo} menunggu kelulusan & tandatangan digital.`, app.id);
          emailStaffTask(app, "approver");
        }
        break;
      }
      case "reject": {
        if (!["sos_review", "technical_review", "pending_approval"].includes(from)) break;
        setStatus("rejected");
        assignTo(app, null);
        addAudit(app, actorId, "Menolak permohonan", { fromStatus: from, toStatus: app.status, note: payload.note });
        notify(app.applicantPersonaId, "rejected", "Permohonan ditolak",
          `Permohonan ${app.refNo} telah ditolak.`, app.id);
        break;
      }
      case "resubmit": {
        if (from !== "query_applicant") break;
        setStatus("sos_review");
        assignTo(app, "sos", null);
        addAudit(app, actorId, "Menghantar semula maklumat", { fromStatus: from, toStatus: app.status, note: payload.note });
        notify("p-faridah", "task_assigned", "Pertanyaan dijawab",
          `Permohonan ${app.refNo} telah dikemas kini oleh pemohon.`, app.id);
        emailStaffTask(app, "sos");
        break;
      }
      case "approve_sign": {
        if (from !== "pending_approval") break;
        if (payload.pin !== DEMO_SIGNATURE_PIN) throw new Error("PIN tandatangan digital tidak sah");
        setStatus("awaiting_registration_payment");
        assignTo(app, null);
        addAudit(app, actorId, "Meluluskan & menandatangani secara digital", { fromStatus: from, toStatus: app.status });
        notify(app.applicantPersonaId, "approved", "Permohonan diluluskan",
          `Permohonan ${app.refNo} diluluskan. Sila bayar yuran pendaftaran.`, app.id);
        break;
      }
      case "pay_registration": {
        if (from !== "awaiting_registration_payment") break;
        app.payments.push({
          id: nextId("pay"), kind: "registration", amount: feeFor(app, "registration"), currency: "MYR",
          status: "paid", fpxRef: nextId("FPX").toUpperCase(), bank: payload.bank ?? "Maybank2u",
          paidAt: new Date(now.value).toISOString(), receiptNo: nextId("RCP").toUpperCase(),
        });
        addAudit(app, actorId, "Membayar yuran pendaftaran");
        issueCertificate(app);
        setStatus("certificate_issued");
        addAudit(app, "system", "Sijil digital dikeluarkan", { actorRole: "system", actorName: "Sistem", toStatus: app.status });
        notify(app.applicantPersonaId, "certificate_issued", "Sijil digital dikeluarkan",
          `Sijil bagi ${app.refNo} telah dikeluarkan.`, app.id);
        break;
      }
      case "withdraw": {
        if (["certificate_issued", "rejected", "withdrawn"].includes(from)) break;
        setStatus("withdrawn");
        assignTo(app, null);
        addAudit(app, actorId, "Menarik balik permohonan", { fromStatus: from, toStatus: app.status });
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
    app.certificate = {
      id: nextId("cert"),
      serialNo: serial,
      applicationId: app.id,
      holderName: app.applicant.fullName,
      competencyCategory: app.competencyCategory,
      contractorClass: app.contractorClass,
      issuedAt,
      expiresAt,
      qrPayload: `https://verify.st.gov.my/cert/${serial}`,
      trustmarkId: `ST-TRUST-${refTail}`,
    };

    // CE: also issue a Perakuan Orang Kompeten for each appointed OK.
    if (app.workflowType === "CE" && app.appointedOks?.length) {
      app.okCertificates = app.appointedOks.map((ok, i) => {
        const okSerial = `ST-OK-2026-${refTail}-${String(i + 1).padStart(2, "0")}`;
        return {
          id: nextId("cert"),
          serialNo: okSerial,
          applicationId: app.id,
          holderName: ok.name,
          competencyCategory: ok.competencyCategory,
          issuedAt,
          expiresAt,
          qrPayload: `https://verify.st.gov.my/cert/${okSerial}`,
          trustmarkId: `ST-TRUST-${refTail}-OK${i + 1}`,
        } satisfies Certificate;
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
  function bulkApprove(ids: string[], pin: string): { ok: string[]; failed: string[] } {
    const result = { ok: [] as string[], failed: [] as string[] };
    for (const id of ids) {
      try {
        transition(id, "approve_sign", { pin });
        result.ok.push(id);
      } catch {
        result.failed.push(id);
      }
    }
    return result;
  }

  function takeTask(applicationId: string): boolean {
    const app = byId(applicationId);
    const session = useStSessionStore();
    if (!app || !app.assignedRole || !session.role) return false;
    if (app.assigneePersonaId) return true; // already taken
    if (atActiveLimit(app.assignedRole)) return false; // max-3 rule
    // Strict FIFO by SLA: only the oldest untaken stage clock may be claimed.
    if (!canClaimByFifo(applicationId, app.assignedRole)) return false;
    app.assigneePersonaId = session.currentPersonaId;
    addAudit(app, session.currentPersonaId ?? "system", "Mengambil tugasan");
    return true;
  }

  // ── clock ────────────────────────────────────────────────────────────────
  function tick(hours: number) {
    now.value += hours * 3_600_000;
  }

  function toggleRealtime() {
    realtimeTick.value = !realtimeTick.value;
    if (realtimeTick.value) {
      realtimeTimer = window.setInterval(() => {
        now.value += 60_000;
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

  function hydrateFromRaw(raw: string): boolean {
    try {
      const parsed = JSON.parse(raw);
      applyingRemote = true;
      applications.value = parsed.applications ?? [];
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
    const s = seedState();
    applications.value = s.applications;
    now.value = s.baseNow;
    useStNotificationsStore().setAll(s.notifications);
    persist();
  }

  function init() {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw && hydrateFromRaw(raw)) {
        window.addEventListener("storage", (event) => {
          if (event.key === STORAGE_KEY && event.newValue) {
            hydrateFromRaw(event.newValue);
          }
        });
        return;
      }
      window.addEventListener("storage", (event) => {
        if (event.key === STORAGE_KEY && event.newValue) {
          hydrateFromRaw(event.newValue);
        }
      });
    }
    seedFresh();
  }

  function resetDemo() {
    seedFresh();
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
    submitNewApplication,
    bulkApprove,
    takeTask,
    tick,
    toggleRealtime,
    init,
    resetDemo,
  };
});
