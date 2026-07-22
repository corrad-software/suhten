import type { StRegistrationApplicationDto } from "@/api/st-registration";
import { slaTargetFor } from "./mock/charter";
import { employerById, EMPLOYERS } from "./mock/employers";
import { okById, REGISTERED_OKS } from "./mock/competent-persons";
import { PERSONAS } from "./mock/personas";
import { staffRoleForStatus } from "./staff-roles";
import { withCeCertificateFields } from "./certificate-ce";
import { withOkCertificateFields } from "./certificate-ok";
import type {
  Application,
  ApplicationStatus,
  AppointedOk,
  Certificate,
  CompetencyCategory,
  CompetencyCertificateInfo,
  ContractorClass,
  ContractorKind,
  PersonaRole,
  RegistrationPeriod,
  WirerType,
  WorkflowType,
} from "./types";

const COMPETENCY: CompetencyCategory[] = ["JPE", "JEK", "PE", "PJ", "PW", "PK"];
const CONTRACTOR: ContractorClass[] = ["A", "B", "C", "D"];
const CONTRACTOR_KINDS: ContractorKind[] = [
  "electrical",
  "service",
  "repair",
  "signboard",
  "switchboard",
  "private_wiring",
];

function workflowTypeFor(moduleCode: string, detailWorkflowType?: unknown): WorkflowType {
  if (detailWorkflowType === "OK" || detailWorkflowType === "CE") return detailWorkflowType;
  return moduleCode === "RG-CE" ? "CE" : "OK";
}

function competencyFrom(raw: string): CompetencyCategory | undefined {
  const u = raw.toUpperCase();
  if (COMPETENCY.includes(u as CompetencyCategory)) return u as CompetencyCategory;
  if (u.startsWith("PW")) return "PW";
  return undefined;
}

function contractorFrom(raw: string): ContractorClass | undefined {
  const u = raw.toUpperCase();
  return CONTRACTOR.includes(u as ContractorClass) ? (u as ContractorClass) : undefined;
}

function contractorKindFrom(
  detail: Record<string, unknown>,
  categoryOrClass?: string,
): ContractorKind | undefined {
  const ce = asRecord(detail.ce);
  const fromCe = detailString(ce, "contractorKind", "contractor_kind");
  if (fromCe) {
    const code = fromCe.toLowerCase().replace(/-/g, "_") as ContractorKind;
    if (CONTRACTOR_KINDS.includes(code)) return code;
  }
  if (categoryOrClass) {
    const code = categoryOrClass.toLowerCase().replace(/-/g, "_") as ContractorKind;
    if (CONTRACTOR_KINDS.includes(code)) return code;
  }
  // Class A–D on category implies standard electrical contractor.
  if (categoryOrClass && CONTRACTOR.includes(categoryOrClass.toUpperCase() as ContractorClass)) {
    return "electrical";
  }
  return undefined;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function detailString(detail: Record<string, unknown> | undefined | null, ...keys: string[]): string | undefined {
  if (!detail) return undefined;
  for (const key of keys) {
    const value = detail[key];
    if (typeof value === "string" && value) return value;
  }
  return undefined;
}

function detailNumber(detail: Record<string, unknown> | undefined | null, ...keys: string[]): number | undefined {
  if (!detail) return undefined;
  for (const key of keys) {
    const value = detail[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return undefined;
}

function personaIdForApplicant(dto: StRegistrationApplicationDto): string {
  const detail = asRecord(dto.detail);
  const fromDetail = detailString(detail, "applicantPersonaId", "applicant_persona_id");
  if (fromDetail) return fromDetail;

  const ce = asRecord(detail?.ce);
  const representativeName = detailString(ce, "representativeName", "representative_name");
  if (representativeName) {
    const byRep = PERSONAS.find((p) => p.name.toLowerCase() === representativeName.toLowerCase());
    if (byRep) return byRep.id;
  }

  const byIc = PERSONAS.find((p) => p.icNumber && p.icNumber === dto.identityNo);
  if (byIc) return byIc.id;

  // CE company registration: match Majikan wakil by organisation / company name.
  const companyName = (dto.applicantName ?? dto.employerName ?? "").toLowerCase();
  if (companyName) {
    const byOrg = PERSONAS.find(
      (p) => p.organisation && p.organisation.toLowerCase() === companyName,
    );
    if (byOrg) return byOrg.id;
  }

  const byName = PERSONAS.find((p) => p.name.toLowerCase() === dto.applicantName.toLowerCase());
  if (byName) return byName.id;

  return `api-${dto.code}`;
}

function assigneePersonaId(dto: StRegistrationApplicationDto): string | null {
  const detail = asRecord(dto.detail);
  if (detail && "assigneePersonaId" in detail && detail.assigneePersonaId === null) return null;
  if (detail && "assignee_persona_id" in detail && detail.assignee_persona_id === null) return null;
  const fromDetail = detailString(detail, "assigneePersonaId", "assignee_persona_id");
  if (fromDetail) return fromDetail;
  // Do not fall back to assignedOfficer — that column is seed/display metadata and
  // can falsely mark CE apps as claimed by OK officers (e.g. Faridah on RG-CE/00063).
  return null;
}

function resolveOkPersonaId(raw: Record<string, unknown>, registeredOkId?: string, mykad?: string): string | undefined {
  const fromRow = detailString(raw, "personaId", "persona_id");
  if (fromRow) return fromRow;
  if (registeredOkId) {
    const baseId = registeredOkId.replace(/-rg-ce-\d+-\d+$/, "");
    const linked = okById(registeredOkId)?.linkedPersonaId ?? okById(baseId)?.linkedPersonaId;
    if (linked) return linked;
  }
  if (mykad) {
    const byMykad = REGISTERED_OKS.find((o) => o.mykad === mykad);
    if (byMykad?.linkedPersonaId) return byMykad.linkedPersonaId;
  }
  return undefined;
}

function mapAppointedOks(detail: Record<string, unknown> | undefined, status: ApplicationStatus): AppointedOk[] | undefined {
  const ce = asRecord(detail?.ce);
  const raw = ce?.appointedOks ?? ce?.appointed_oks ?? detail?.appointedOks ?? detail?.appointed_oks;
  if (!Array.isArray(raw) || raw.length === 0) return undefined;

  const awaiting = status === "awaiting_employer_confirm";
  let leadSet = false;

  return raw.map((item, i) => {
    const row = asRecord(item) ?? {};
    const registeredOkId =
      detailString(row, "registeredOkId", "registered_ok_id", "okId", "ok_id") ?? `ok-api-${i}`;
    const mykad = detailString(row, "mykad", "icNumber", "ic_number") ?? "";
    const personaId = resolveOkPersonaId(row, registeredOkId, mykad);
    const explicitConfirmed = typeof row.confirmed === "boolean" ? row.confirmed : undefined;
    const isLead = awaiting && Boolean(personaId) && !leadSet && explicitConfirmed !== true;
    if (isLead) leadSet = true;
    const confirmed = explicitConfirmed ?? !isLead;

    return {
      registeredOkId,
      personaId,
      name: detailString(row, "name") ?? "Orang Kompeten",
      mykad,
      wirerType: (detailString(row, "wirerType", "wirer_type") as WirerType | undefined) ?? "PW4",
      competencyCategory: "PW" as CompetencyCategory,
      confirmed,
      confirmedAt: confirmed ? detailString(row, "confirmedAt", "confirmed_at") : undefined,
    };
  });
}

function employerRef(
  dto: StRegistrationApplicationDto,
  appointedOks?: AppointedOk[],
): Application["employer"] {
  const detail = asRecord(dto.detail);
  const employerId = detailString(detail, "employerId", "employer_id");
  let base =
    (employerId ? employerById(employerId) : undefined) ??
    EMPLOYERS.find(
      (e) => dto.employerName && e.name.toLowerCase() === dto.employerName.toLowerCase(),
    ) ??
    EMPLOYERS.find(
      (e) => dto.applicantName && e.name.toLowerCase() === dto.applicantName.toLowerCase(),
    );

  if (!base) {
    base = {
      id: `emp-api-${dto.code}`,
      name: dto.employerName ?? dto.applicantName ?? "Majikan",
      registrationNo: "—",
      address: "",
      contactPerson: dto.employerName ?? dto.applicantName ?? "Majikan",
      // Do not default unknown companies to a demo confirmer (was p-rahman).
      confirmerPersonaId: "",
      status: "active",
    };
  }

  // CE NA-03: lead appointed OK (not majikan wakil) confirms the appointment.
  if (dto.status === "awaiting_employer_confirm" && appointedOks?.length) {
    const lead = appointedOks.find((o) => o.personaId && !o.confirmed);
    if (lead?.personaId) {
      return {
        ...base,
        confirmerPersonaId: lead.personaId,
        contactPerson: lead.name,
      };
    }
  }

  // After OK acceptance (NA-04+), confirmer stays the majikan wakil.
  return base;
}

function mapCompetencyCertificate(
  detail: Record<string, unknown> | undefined,
  categoryOrClass: string,
): CompetencyCertificateInfo | undefined {
  const cert = asRecord(detail?.certificate);
  if (!cert) {
    if (!categoryOrClass) return undefined;
    return {
      certificateNo: "—",
      category: categoryOrClass,
    };
  }

  return {
    certificateNo: detailString(cert, "certificateNo", "certificate_no") ?? "—",
    category: detailString(cert, "category") ?? categoryOrClass,
    voltageRestriction: detailString(cert, "voltageRestriction", "voltage_restriction"),
    placeRestriction: detailString(cert, "placeRestriction", "place_restriction"),
    active: typeof cert.active === "boolean" ? cert.active : undefined,
    suspended: typeof cert.suspended === "boolean" ? cert.suspended : undefined,
  };
}

/**
 * Digital sijil (Lihat Sijil). Distinct from competencyCertificate on the form.
 * Prefer detail.issuedCertificate when present; otherwise synthesize for issued apps.
 */
function mapIssuedCertificate(
  dto: StRegistrationApplicationDto,
  detail: Record<string, unknown>,
  workflowType: WorkflowType,
  competencyCategory: CompetencyCategory | undefined,
  contractorClass: ContractorClass | undefined,
  periodYears: number,
): Certificate | undefined {
  if (dto.status !== "certificate_issued") return undefined;

  const stored = asRecord(detail.issuedCertificate) ?? asRecord(detail.issued_certificate);
  const refTail = dto.refNo.split("/").pop() ?? dto.code;
  const issuedAt =
    detailString(stored, "issuedAt", "issued_at") ??
    dto.stageEnteredAt ??
    dto.updatedAt ??
    dto.submittedAt ??
    new Date().toISOString();
  const issuedMs = Date.parse(issuedAt);
  const expiresAt =
    detailString(stored, "expiresAt", "expires_at") ??
    new Date(
      (Number.isFinite(issuedMs) ? issuedMs : Date.now()) + periodYears * 365 * 24 * 3_600_000,
    ).toISOString();
  const serialNo =
    detailString(stored, "serialNo", "serial_no") ?? `ST-${workflowType}-2026-${refTail}`;

  const base: Certificate = {
    id: detailString(stored, "id") ?? `cert-${dto.code}`,
    serialNo,
    applicationId: dto.code,
    holderName: detailString(stored, "holderName", "holder_name") ?? dto.applicantName,
    competencyCategory:
      (detailString(stored, "competencyCategory", "competency_category") as CompetencyCategory | undefined) ??
      competencyCategory,
    contractorClass:
      (detailString(stored, "contractorClass", "contractor_class") as ContractorClass | undefined) ??
      contractorClass,
    contractorKind: (() => {
      const raw = detailString(stored, "contractorKind", "contractor_kind");
      if (!raw) return undefined;
      const code = raw.toLowerCase().replace(/-/g, "_") as ContractorKind;
      return CONTRACTOR_KINDS.includes(code) ? code : undefined;
    })(),
    issuedAt,
    expiresAt,
    qrPayload: detailString(stored, "qrPayload", "qr_payload") ?? `https://verify.st.gov.my/cert/${serialNo}`,
    trustmarkId: detailString(stored, "trustmarkId", "trustmark_id") ?? `ST-TRUST-${refTail}`,
    perakuanNo: detailString(stored, "perakuanNo", "perakuan_no"),
    icNumber: detailString(stored, "icNumber", "ic_number"),
    dob: detailString(stored, "dob"),
    categoryGrade: detailString(stored, "categoryGrade", "category_grade"),
    restrictions: detailString(stored, "restrictions"),
    issuedPlace: detailString(stored, "issuedPlace", "issued_place"),
    issuedVia: detailString(stored, "issuedVia", "issued_via"),
    signatoryName: detailString(stored, "signatoryName", "signatory_name"),
    signatoryAgency: detailString(stored, "signatoryAgency", "signatory_agency"),
    businessAddress: detailString(stored, "businessAddress", "business_address"),
    registrationNo: detailString(stored, "registrationNo", "registration_no"),
    feeRm: (() => {
      const raw = stored?.feeRm ?? stored?.fee_rm;
      return typeof raw === "number" ? raw : undefined;
    })(),
    periodYears: (() => {
      const raw = stored?.periodYears ?? stored?.period_years;
      return typeof raw === "number" ? raw : undefined;
    })(),
  };

  // OK / CE enrichment happens after Application is assembled.
  return base;
}

function mapDocuments(
  detail: Record<string, unknown> | undefined,
  code: string,
  submittedAt: string,
): Application["documents"] {
  const raw = detail?.documents;
  if (!Array.isArray(raw)) return [];

  return raw.map((item, i) => {
    const doc = asRecord(item) ?? {};
    return {
      id: `${code}-doc-${i}`,
      label: detailString(doc, "label") ?? `Dokumen ${i + 1}`,
      fileName: detailString(doc, "fileName", "file_name") ?? "dokumen.pdf",
      sizeKb: 320,
      mimeType: "application/pdf",
      uploadedAt: submittedAt,
      status: "pending" as const,
    };
  });
}

/**
 * Map a DB registration application into the Peti Tugasan Application shape
 * so seeded + online submits share one inbox source.
 */
export function mapRegistrationDtoToApplication(dto: StRegistrationApplicationDto): Application {
  const detail = asRecord(dto.detail) ?? {};
  const workflowType = workflowTypeFor(
    dto.moduleCode,
    detailString(detail, "workflowType", "workflow_type"),
  );
  const status = dto.status as ApplicationStatus;
  const assignedRole: PersonaRole | null = staffRoleForStatus(workflowType, status);
  const submittedAt = dto.submittedAt ?? dto.createdAt ?? new Date().toISOString();
  const stageEnteredAt = dto.stageEnteredAt ?? submittedAt;
  const timeline = Array.isArray(detail.timeline) ? detail.timeline : [];
  const period =
    detailNumber(detail, "periodYears", "period_years") ?? 1;
  const competencyCertificate =
    workflowType === "OK" ? mapCompetencyCertificate(detail, dto.categoryOrClass) : undefined;
  const competencyCategory =
    workflowType === "OK"
      ? competencyFrom(competencyCertificate?.category ?? dto.categoryOrClass)
      : undefined;
  const contractorClass =
    workflowType === "CE" ? contractorFrom(dto.categoryOrClass) : undefined;
  const contractorKind =
    workflowType === "CE" ? contractorKindFrom(detail, dto.categoryOrClass) : undefined;
  const certificate = mapIssuedCertificate(
    dto,
    detail,
    workflowType,
    competencyCategory,
    contractorClass,
    period,
  );
  const appointedOks = workflowType === "CE" ? mapAppointedOks(detail, status) : undefined;

  const app: Application = {
    id: dto.code,
    refNo: dto.refNo,
    workflowType,
    status,
    applicant: {
      fullName: dto.applicantName,
      icNumber: dto.identityNo,
      dob: detailString(detail, "dob") ?? "1984-01-01",
      age: detailNumber(detail, "age") ?? 40,
      address: detailString(detail, "address") ?? "",
      phone: detailString(detail, "phone") ?? "",
      email: detailString(detail, "email") ?? "",
      gender: detailString(detail, "gender") as Application["applicant"]["gender"],
    },
    applicantPersonaId: personaIdForApplicant(dto),
    competencyCategory,
    contractorClass,
    contractorKind: contractorKind ?? (workflowType === "CE" ? "electrical" : undefined),
    registrationPeriodYears: period as RegistrationPeriod,
    competencyCertificate,
    employer: employerRef(dto, appointedOks),
    appointedOks,
    documents: mapDocuments(detail, dto.code, submittedAt),
    payments: [],
    auditTrail: timeline.map((t, i) => {
      const row = asRecord(t) ?? {};
      return {
        id: `${dto.code}-aud-${i}`,
        at: detailString(row, "at") ?? submittedAt,
        actorPersonaId: "system",
        actorRole: "system" as const,
        actorName: detailString(row, "actor") ?? "Sistem",
        action: detailString(row, "label") ?? "Kemaskini",
      };
    }),
    assignedRole,
    assigneePersonaId: assignedRole ? assigneePersonaId(dto) : null,
    slaTargetHours: assignedRole
      ? (dto.slaTargetHours || slaTargetFor(assignedRole))
      : dto.slaTargetHours || 0,
    stageEnteredAt,
    createdAt: submittedAt,
    updatedAt: dto.updatedAt ?? stageEnteredAt,
    certificate,
  };

  if (certificate && workflowType === "OK") {
    app.certificate = withOkCertificateFields(certificate, app);
  }
  if (certificate && workflowType === "CE") {
    app.certificate = withCeCertificateFields(certificate, app);
  }

  return app;
}
