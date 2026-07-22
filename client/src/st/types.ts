// Suruhanjaya Tenaga (ST) — Appendix D11 prototype domain model.
// Frontend-only mock model. All date fields are ISO strings to match the
// existing app convention (e.g. createdAt: string).

export type WorkflowType = "OK" | "CE"; // Orang Kompeten | Kontraktor Elektrik

export type PersonaRole =
  | "applicant"
  | "employer"
  | "sos" // SOS — OK Elektrik (RG-KE)
  | "sos_ce" // SOS — Kontraktor Elektrik (RG-CE)
  | "tp_sos" // TP SOS — escalate / reassign SOS queues (D11)
  | "technical" // Pegawai Teknikal — OK Elektrik
  | "technical_ce" // Pegawai Teknikal — Kontraktor Elektrik
  | "approver" // Pelulus (shared OK + CE)
  | "committee" // Ahli Jawatankuasa (PE-JK)
  | "admin"; // Pentadbir Sistem

export type CompetencyCategory = "JPE" | "JEK" | "PE" | "PJ" | "PW" | "PK";

// Wirer (Pendawai) competency grades used to validate a contractor class.
export type WirerType = "PW1" | "PW2" | "PW3" | "PW4" | "PW5" | "PW6";

export type ContractorClass = "A" | "B" | "C" | "D";

/** Jenis kontraktor (RG-CE) — aligns with `CONTRACTOR_KINDS` in ce-rules. */
export type ContractorKind =
  | "electrical"
  | "service"
  | "repair"
  | "signboard"
  | "switchboard"
  | "private_wiring";

export type PaymentKind = "processing" | "registration";

export type PaymentStatus = "pending" | "paid" | "failed";

export type TaskTab = "new" | "query" | "completed";

export type SlaLevel = "green" | "yellow" | "red";

export type NotificationType =
  | "appointment_request"
  | "task_assigned"
  | "query_raised"
  | "payment_due"
  | "approved"
  | "certificate_issued"
  | "rejected"
  | "sla_escalation";

export type ApplicationStatus =
  | "draft"
  | "awaiting_employer_confirm"
  | "awaiting_final_submit"
  | "awaiting_processing_payment"
  | "sos_review"
  | "query_applicant"
  | "technical_review"
  | "pending_approval"
  | "awaiting_registration_payment"
  | "certificate_issued"
  | "rejected"
  | "withdrawn";

export type RegistrationPeriod = 1 | 2 | 3 | 4 | 5;

export type JpnStatus = "alive" | "deceased" | "not_found";

export interface Persona {
  id: string;
  name: string;
  email: string;
  role: PersonaRole;
  icNumber?: string;
  organisation?: string;
  title?: string; // e.g. "Pegawai Teknikal Kanan"
}

export type Gender = "male" | "female";

export interface ApplicantProfile {
  fullName: string;
  icNumber: string;
  dob: string;
  age: number;
  address: string;
  phone: string;
  email: string;
  gender?: Gender;
}

/** Map coordinate for the employer's operating premises (OpenStreetMap). */
export interface GeoPoint {
  lat: number;
  lng: number;
}

/** Employer registration category (D11 §4.2.2 / Jadual 6). */
export type EmployerCategory = "kontraktor" | "pepasangan" | "pelesenan" | "institusi" | "individu" | "lain";

export interface EmployerRef {
  id: string;
  name: string;
  registrationNo: string;
  address: string;
  contactPerson: string;
  // The persona that must confirm the appointment.
  // OK workflow: the employer (Majikan). CE workflow: the selected Orang Kompeten.
  confirmerPersonaId: string;
  // ── Fields powering the "elastic" employer search (D11 §4.2.2) ──
  /** No. Pendaftaran ST. */
  stRegNo?: string;
  category?: EmployerCategory;
  city?: string;
  state?: string;
  /** Only ACTIVE registrations are shown in the employer search. */
  status?: "active" | "inactive";
  // ── Employer-maintained profile (Kemaskini Maklumat Majikan) ──
  phone?: string;
  email?: string;
  /** Premises location pinned on the map. */
  location?: GeoPoint;
  /** Company logo as a data URL (prototype: stored client-side). */
  logoUrl?: string;
  /** Supporting company documents (SSM, Borang 49, …). */
  documents?: AppDocument[];
}

export type DocumentStatus = "pending" | "accepted" | "rejected";

export interface AppDocument {
  id: string;
  label: string;
  fileName: string;
  sizeKb: number;
  mimeType: string;
  uploadedAt: string;
  status: DocumentStatus;
  reviewerNote?: string;
}

export interface Payment {
  id: string;
  kind: PaymentKind;
  amount: number;
  currency: "MYR";
  status: PaymentStatus;
  fpxRef?: string;
  bank?: string;
  paidAt?: string;
  receiptNo?: string;
}

export interface AuditEntry {
  id: string;
  at: string;
  actorPersonaId: string;
  actorRole: PersonaRole | "system";
  actorName: string;
  action: string;
  fromStatus?: ApplicationStatus;
  toStatus?: ApplicationStatus;
  note?: string;
}

export interface Certificate {
  id: string;
  serialNo: string;
  applicationId: string;
  holderName: string;
  competencyCategory?: CompetencyCategory;
  contractorClass?: ContractorClass;
  /** Borang Q — jenis kontraktor (drives certificate title) */
  contractorKind?: ContractorKind;
  issuedAt: string;
  expiresAt: string;
  qrPayload: string;
  trustmarkId: string;
  /** Borang N — Perakuan No. (left header), e.g. PW-T-4-B-0177-2006 */
  perakuanNo?: string;
  /** Kad Pengenalan / MyKad of the holder */
  icNumber?: string;
  /** Date of birth (ISO or dd-mm-yyyy) */
  dob?: string;
  /** Display grade under KATEGORI, e.g. PW4 */
  categoryGrade?: string;
  /** SEKATAN, JIKA ADA — free-text endorsements / restrictions */
  restrictions?: string;
  /** TEMPAT — place of issue */
  issuedPlace?: string;
  /** Melalui — issuing channel / body */
  issuedVia?: string;
  /** Signatory under the official stamp */
  signatoryName?: string;
  signatoryAgency?: string;
  /** Borang Q — alamat perniagaan dan cawangan */
  businessAddress?: string;
  /** Borang Q — No. Pendaftaran (e.g. ST(TKL)SGR/C/KE/00596/2015) */
  registrationNo?: string;
  /** Borang Q — Fi RM (yuran pendaftaran) */
  feeRm?: number;
  /** Borang Q — tempoh sah (tahun), shown as "selama tempoh N tahun" */
  periodYears?: number;
}

export interface IdentityCheck {
  jpnStatus: JpnStatus;
  checkedAt: string;
  checkedByPersonaId: string;
}

// An Orang Kompeten appointed to a contractor (CE) application.
export interface AppointedOk {
  registeredOkId: string;
  personaId?: string; // set when the OK is also a login persona (can confirm in-app)
  name: string;
  mykad: string;
  wirerType: WirerType;
  competencyCategory?: CompetencyCategory;
  confirmed: boolean;
  confirmedAt?: string;
}

/** Competency certificate declared on an OK registration application (not the issued digital sijil). */
export interface CompetencyCertificateInfo {
  certificateNo: string;
  category: string;
  voltageRestriction?: string;
  placeRestriction?: string;
  active?: boolean;
  suspended?: boolean;
}

export interface Application {
  id: string;
  refNo: string;
  workflowType: WorkflowType;
  status: ApplicationStatus;
  applicant: ApplicantProfile;
  applicantPersonaId: string;
  competencyCategory?: CompetencyCategory; // OK
  contractorClass?: ContractorClass; // CE
  /** CE — jenis kontraktor (electrical, service, repair, …) */
  contractorKind?: ContractorKind;
  registrationPeriodYears: RegistrationPeriod;
  employer?: EmployerRef;
  appointedOks?: AppointedOk[]; // CE: the Orang Kompeten appointed to satisfy the class
  /** OK: perakuan kekompetenan from the application form / registration detail. */
  competencyCertificate?: CompetencyCertificateInfo;
  documents: AppDocument[];
  payments: Payment[];
  auditTrail: AuditEntry[];
  assignedRole: PersonaRole | null; // which back-office role currently owns it
  assigneePersonaId: string | null;
  slaTargetHours: number; // Piagam Pelanggan target for the CURRENT stage
  stageEnteredAt: string; // when it entered the current back-office stage
  /** D11: set when SOS Baharu exceeds 3h — flagged to TP SOS (SLA clock keeps running). */
  escalationFlaggedAt?: string;
  /** D11 reassignment: bumps FIFO sort so case sits at top of new SOS queue (does not reset SLA). */
  queueBoostAt?: string;
  declarationAcceptedAt?: string; // applicant pengakuan confirmed at submission
  identityCheck?: IdentityCheck;
  certificate?: Certificate; // primary cert (OK holder, or CE contractor)
  okCertificates?: Certificate[]; // CE: one Perakuan OK per appointed OK
  createdAt: string;
  updatedAt: string;
}

export interface StNotification {
  id: string;
  personaId: string;
  type: NotificationType;
  title: string;
  body: string;
  applicationId?: string;
  createdAt: string;
  read: boolean;
}

// A denormalised projection of an Application for a back-office queue.
export interface InboxItem {
  applicationId: string;
  refNo: string;
  applicantName: string;
  workflowType: WorkflowType;
  forRole: PersonaRole;
  tab: TaskTab;
  status: ApplicationStatus;
  stageEnteredAt: string;
  slaTargetHours: number;
  createdAt: string;
}
