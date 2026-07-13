// Suruhanjaya Tenaga (ST) — Appendix D11 prototype domain model.
// Frontend-only mock model. All date fields are ISO strings to match the
// existing app convention (e.g. createdAt: string).

export type WorkflowType = "OK" | "CE"; // Orang Kompeten | Kontraktor Elektrik

export type PersonaRole =
  | "applicant"
  | "employer"
  | "sos" // Seksyen Operasi Perkhidmatan (service-ops clerk)
  | "technical" // Pegawai Teknikal
  | "approver" // Pelulus
  | "committee" // Ahli Jawatankuasa (PE-JK)
  | "admin"; // Pentadbir Sistem

export type CompetencyCategory = "JPE" | "JEK" | "PE" | "PJ" | "PW" | "PK";

// Wirer (Pendawai) competency grades used to validate a contractor class.
export type WirerType = "PW1" | "PW2" | "PW3" | "PW4" | "PW5" | "PW6";

export type ContractorClass = "A" | "B" | "C" | "D";

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
  | "rejected";

export type ApplicationStatus =
  | "draft"
  | "awaiting_employer_confirm"
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

export interface EmployerRef {
  id: string;
  name: string;
  registrationNo: string;
  address: string;
  contactPerson: string;
  // The persona that must confirm the appointment.
  // OK workflow: the employer (Majikan). CE workflow: the selected Orang Kompeten.
  confirmerPersonaId: string;
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
  issuedAt: string;
  expiresAt: string;
  qrPayload: string;
  trustmarkId: string;
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

export interface Application {
  id: string;
  refNo: string;
  workflowType: WorkflowType;
  status: ApplicationStatus;
  applicant: ApplicantProfile;
  applicantPersonaId: string;
  competencyCategory?: CompetencyCategory; // OK
  contractorClass?: ContractorClass; // CE
  registrationPeriodYears: RegistrationPeriod;
  employer?: EmployerRef;
  appointedOks?: AppointedOk[]; // CE: the Orang Kompeten appointed to satisfy the class
  documents: AppDocument[];
  payments: Payment[];
  auditTrail: AuditEntry[];
  assignedRole: PersonaRole | null; // which back-office role currently owns it
  assigneePersonaId: string | null;
  slaTargetHours: number; // Piagam Pelanggan target for the CURRENT stage
  stageEnteredAt: string; // when it entered the current back-office stage
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
