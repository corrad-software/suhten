import type { ApplicationStatus, CompetencyCategory, Gender, RegistrationPeriod } from "../types";
import type { RegistrationModuleCode } from "../registration/modules";
import type { EmployerCategory, PlaceRestriction, VoltageRestriction } from "../registration/ok-rules";

/** Application process types from Appendix G (RG-KE / RG-KG / RG-CE / RG-CG). */
export type RegistrationAppType =
  | "new_registration"
  | "renewal"
  | "termination"
  | "multi_employer"
  | "class_change"
  | "ok_appointment"
  | "ok_termination"
  | "employer_registration"
  | "enforcement_cancellation";

export type ComplianceStatus = "active" | "expiring_soon" | "expired" | "suspended";

export interface CompetencyCertificateInfo {
  certificateNo: string;
  category: CompetencyCategory;
  voltageRestriction: VoltageRestriction;
  placeRestriction: PlaceRestriction;
  active: boolean;
  suspended: boolean;
}

export interface RegistrationApplication {
  id: string;
  moduleCode: RegistrationModuleCode;
  refNo: string;
  appType: RegistrationAppType;
  applicantName: string;
  /** MyKad for OK, SSM no. for contractor. */
  identityNo: string;
  /** Competency category (OK) or contractor class. */
  categoryOrClass: string;
  status: ApplicationStatus;
  submittedAt: string;
  stageEnteredAt: string;
  slaTargetHours: number;
  employerName?: string;
  cdpPoints?: number;
  assignedOfficer?: string;
  feeAmount?: number;
  note?: string;
  /** Engine workflow instance UUID when linked (RG-KE → pfd-rg-ke-na, RG-CE → pfd-rg-ce-na). */
  workflowInstanceId?: string;
  /** Extended detail from module wizards (RG-KE / RG-CE). */
  detail?: {
    gender?: Gender;
    dob?: string;
    age?: number;
    address?: string;
    phone?: string;
    email?: string;
    periodYears?: RegistrationPeriod;
    employerCategory?: EmployerCategory;
    employerId?: string;
    certificate?: CompetencyCertificateInfo;
    oshRequired?: boolean;
    oshUploaded?: boolean;
    documents?: Array<{ label: string; fileName: string }>;
    timeline?: Array<{ at: string; label: string; actor: string }>;
    /** RG-CE Bahagian A–G payload */
    ce?: Record<string, unknown>;
    /** Peti Tugasan sync metadata (seeded / API bridge). */
    applicantPersonaId?: string;
    assigneePersonaId?: string | null;
    workflowType?: "OK" | "CE";
    source?: string;
  };
}

export interface RegisteredEntity {
  id: string;
  moduleCode: RegistrationModuleCode;
  certificateNo: string;
  holderName: string;
  identityNo: string;
  categoryOrClass: string;
  employerName?: string;
  registeredAt: string;
  expiresAt: string;
  compliance: ComplianceStatus;
  cdpPoints: number;
  statusLabel?: string;
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 3_600_000).toISOString();
}

function daysAgo(days: number): string {
  return hoursAgo(days * 24);
}

export const REGISTRATION_APPLICATIONS: RegistrationApplication[] = [
  // ── RG-KE ──
  {
    id: "rg-ke-1",
    moduleCode: "RG-KE",
    refNo: "ST/RG-KE/2026/00041",
    appType: "new_registration",
    applicantName: "Ahmad bin Ismail",
    identityNo: "850101-10-5432",
    categoryOrClass: "PW4",
    status: "sos_review",
    submittedAt: daysAgo(2),
    stageEnteredAt: hoursAgo(18),
    slaTargetHours: 24,
    employerName: "Syarikat Elektrik Maju Sdn Bhd",
    cdpPoints: 12,
    assignedOfficer: "Faridah Hassan",
    feeAmount: 50,
  },
  {
    id: "rg-ke-2",
    moduleCode: "RG-KE",
    refNo: "ST/RG-KE/2026/00038",
    appType: "renewal",
    applicantName: "Siti Nurhaliza binti Kamal",
    identityNo: "900215-14-2211",
    categoryOrClass: "JEK",
    status: "technical_review",
    submittedAt: daysAgo(5),
    stageEnteredAt: hoursAgo(40),
    slaTargetHours: 72,
    employerName: "Tenaga Power Solutions Sdn Bhd",
    cdpPoints: 28,
    assignedOfficer: "Kumar a/l Rajan",
    feeAmount: 50,
  },
  {
    id: "rg-ke-3",
    moduleCode: "RG-KE",
    refNo: "ST/RG-KE/2026/00035",
    appType: "multi_employer",
    applicantName: "Lim Wei Jie",
    identityNo: "880330-08-3344",
    categoryOrClass: "PE",
    status: "awaiting_employer_confirm",
    submittedAt: daysAgo(1),
    stageEnteredAt: hoursAgo(8),
    slaTargetHours: 48,
    employerName: "Metro Switchgear Sdn Bhd",
    cdpPoints: 20,
    feeAmount: 30,
  },
  {
    id: "rg-ke-4",
    moduleCode: "RG-KE",
    refNo: "ST/RG-KE/2026/00029",
    appType: "new_registration",
    applicantName: "Nurul Aina binti Razak",
    identityNo: "920512-03-7788",
    categoryOrClass: "PW2",
    status: "certificate_issued",
    submittedAt: daysAgo(21),
    stageEnteredAt: daysAgo(3),
    slaTargetHours: 24,
    employerName: "Ampere Engineering Sdn Bhd",
    cdpPoints: 15,
    feeAmount: 50,
  },
  {
    id: "rg-ke-5",
    moduleCode: "RG-KE",
    refNo: "ST/RG-KE/2026/00044",
    appType: "termination",
    applicantName: "Mohd Hafiz bin Osman",
    identityNo: "870820-05-1122",
    categoryOrClass: "PW3",
    status: "query_applicant",
    submittedAt: daysAgo(4),
    stageEnteredAt: hoursAgo(30),
    slaTargetHours: 48,
    employerName: "Voltcare Services Sdn Bhd",
    note: "Dokumen surat penamatan majikan tidak lengkap",
    feeAmount: 0,
  },

  // ── RG-KG ──
  {
    id: "rg-kg-1",
    moduleCode: "RG-KG",
    refNo: "ST/RG-KG/2026/00012",
    appType: "new_registration",
    applicantName: "Razak bin Abdullah",
    identityNo: "860707-10-9988",
    categoryOrClass: "GPE",
    status: "pending_approval",
    submittedAt: daysAgo(8),
    stageEnteredAt: hoursAgo(20),
    slaTargetHours: 48,
    employerName: "GasTech Malaysia Sdn Bhd",
    cdpPoints: 18,
    assignedOfficer: "Zainab Omar",
    feeAmount: 50,
  },
  {
    id: "rg-kg-2",
    moduleCode: "RG-KG",
    refNo: "ST/RG-KG/2026/00009",
    appType: "renewal",
    applicantName: "Chong Mei Ling",
    identityNo: "910404-14-5566",
    categoryOrClass: "GJE",
    status: "sos_review",
    submittedAt: daysAgo(3),
    stageEnteredAt: hoursAgo(10),
    slaTargetHours: 24,
    employerName: "Petronas Gas Retail Sdn Bhd",
    cdpPoints: 32,
    assignedOfficer: "Faridah Hassan",
    feeAmount: 50,
  },
  {
    id: "rg-kg-3",
    moduleCode: "RG-KG",
    refNo: "ST/RG-KG/2026/00007",
    appType: "employer_registration",
    applicantName: "Hafizah binti Yusof",
    identityNo: "890119-06-3344",
    categoryOrClass: "GPE",
    status: "awaiting_processing_payment",
    submittedAt: daysAgo(1),
    stageEnteredAt: hoursAgo(6),
    slaTargetHours: 72,
    employerName: "Industrial Gas Hub Sdn Bhd",
    cdpPoints: 10,
    feeAmount: 50,
  },
  {
    id: "rg-kg-4",
    moduleCode: "RG-KG",
    refNo: "ST/RG-KG/2026/00005",
    appType: "new_registration",
    applicantName: "Arif bin Salleh",
    identityNo: "930225-01-6677",
    categoryOrClass: "GPW",
    status: "certificate_issued",
    submittedAt: daysAgo(30),
    stageEnteredAt: daysAgo(5),
    slaTargetHours: 24,
    employerName: "SafeGas Contractors Sdn Bhd",
    cdpPoints: 14,
    feeAmount: 50,
  },

  // ── RG-CE ──
  {
    id: "rg-ce-1",
    moduleCode: "RG-CE",
    refNo: "ST/RG-CE/2026/00061",
    appType: "new_registration",
    applicantName: "Syarikat Elektrik Maju Sdn Bhd",
    identityNo: "201501012345 (1122334-A)",
    categoryOrClass: "B",
    status: "technical_review",
    submittedAt: daysAgo(6),
    stageEnteredAt: hoursAgo(55),
    slaTargetHours: 72,
    assignedOfficer: "Kumar a/l Rajan",
    feeAmount: 200,
    note: "3 Orang Kompeten dilantik (PW4, PW3, PW2)",
    detail: { applicantPersonaId: "p-lim", employerId: "emp-elektrik-maju" },
  },
  {
    id: "rg-ce-2",
    moduleCode: "RG-CE",
    refNo: "ST/RG-CE/2026/00058",
    appType: "class_change",
    applicantName: "Voltworks Engineering Sdn Bhd",
    identityNo: "201201098765 (9988776-X)",
    categoryOrClass: "A",
    status: "pending_approval",
    submittedAt: daysAgo(10),
    stageEnteredAt: hoursAgo(28),
    slaTargetHours: 48,
    assignedOfficer: "Zainab Omar",
    feeAmount: 150,
    note: "Naik taraf Kelas C → A",
  },
  {
    id: "rg-ce-3",
    moduleCode: "RG-CE",
    refNo: "ST/RG-CE/2026/00055",
    appType: "ok_appointment",
    applicantName: "Cahaya Wiring Enterprise",
    identityNo: "SA0123456-A",
    categoryOrClass: "D",
    status: "awaiting_employer_confirm",
    submittedAt: daysAgo(2),
    stageEnteredAt: hoursAgo(12),
    slaTargetHours: 48,
    feeAmount: 30,
    note: "Menunggu pengesahan OK: Ahmad bin Ismail (PW4)",
  },
  {
    id: "rg-ce-4",
    moduleCode: "RG-CE",
    refNo: "ST/RG-CE/2026/00050",
    appType: "renewal",
    applicantName: "Mega Circuit Sdn Bhd",
    identityNo: "200801045678 (5566778-U)",
    categoryOrClass: "C",
    status: "certificate_issued",
    submittedAt: daysAgo(40),
    stageEnteredAt: daysAgo(7),
    slaTargetHours: 72,
    feeAmount: 200,
  },
  {
    id: "rg-ce-5",
    moduleCode: "RG-CE",
    refNo: "ST/RG-CE/2026/00063",
    appType: "new_registration",
    applicantName: "Tenaga Murni Sdn Bhd",
    identityNo: "200801012345 (812345-A)",
    categoryOrClass: "C",
    status: "sos_review",
    submittedAt: daysAgo(1),
    stageEnteredAt: hoursAgo(5),
    slaTargetHours: 24,
    assignedOfficer: undefined,
    employerName: "Tenaga Murni Sdn Bhd",
    feeAmount: 200,
    note: "Permohonan majikan Tenaga Murni (wakil: Rahman bin Abdullah)",
    detail: { applicantPersonaId: "p-rahman", employerId: "emp-tenaga-murni" },
  },
  {
    id: "rg-ce-6",
    moduleCode: "RG-CE",
    refNo: "ST/RG-CE/2026/00070",
    appType: "new_registration",
    applicantName: "ABC Elektrik Sdn Bhd",
    identityNo: "201901089012 (1289012-H)",
    categoryOrClass: "B",
    status: "sos_review",
    submittedAt: daysAgo(2),
    stageEnteredAt: hoursAgo(8),
    slaTargetHours: 24,
    assignedOfficer: "Halim bin Rahim",
    employerName: "ABC Elektrik Sdn Bhd",
    feeAmount: 200,
    note: "Permohonan majikan ABC Elektrik (wakil: Ahmad Faizal bin Omar)",
    detail: { applicantPersonaId: "p-faizal", employerId: "emp-abc-elektrik" },
  },
  {
    id: "rg-ce-7",
    moduleCode: "RG-CE",
    refNo: "ST/RG-CE/2026/00068",
    appType: "class_change",
    applicantName: "ABC Elektrik Sdn Bhd",
    identityNo: "201901089012 (1289012-H)",
    categoryOrClass: "A",
    status: "technical_review",
    submittedAt: daysAgo(8),
    stageEnteredAt: hoursAgo(40),
    slaTargetHours: 72,
    assignedOfficer: "Priya a/p Nair",
    employerName: "ABC Elektrik Sdn Bhd",
    feeAmount: 150,
    note: "Naik taraf Kelas B → A",
    detail: { applicantPersonaId: "p-faizal", employerId: "emp-abc-elektrik" },
  },
  {
    id: "rg-ce-8",
    moduleCode: "RG-CE",
    refNo: "ST/RG-CE/2026/00065",
    appType: "renewal",
    applicantName: "ABC Elektrik Sdn Bhd",
    identityNo: "201901089012 (1289012-H)",
    categoryOrClass: "B",
    status: "awaiting_registration_payment",
    submittedAt: daysAgo(14),
    stageEnteredAt: hoursAgo(20),
    slaTargetHours: 72,
    employerName: "ABC Elektrik Sdn Bhd",
    feeAmount: 200,
    note: "Pembaharuan pendaftaran kontraktor",
    detail: { applicantPersonaId: "p-faizal", employerId: "emp-abc-elektrik" },
  },
  {
    id: "rg-ce-9",
    moduleCode: "RG-CE",
    refNo: "ST/RG-CE/2026/00062",
    appType: "ok_appointment",
    applicantName: "ABC Elektrik Sdn Bhd",
    identityNo: "201901089012 (1289012-H)",
    categoryOrClass: "B",
    status: "awaiting_employer_confirm",
    submittedAt: daysAgo(1),
    stageEnteredAt: hoursAgo(6),
    slaTargetHours: 48,
    employerName: "ABC Elektrik Sdn Bhd",
    feeAmount: 30,
    note: "Menunggu pengesahan lantikan OK: Suresh a/l Maniam (PW3)",
    detail: { applicantPersonaId: "p-faizal", employerId: "emp-abc-elektrik" },
  },
  {
    id: "rg-ce-10",
    moduleCode: "RG-CE",
    refNo: "ST/RG-CE/2026/00064",
    appType: "new_registration",
    applicantName: "Tenaga Murni Sdn Bhd",
    identityNo: "200801012345 (812345-A)",
    categoryOrClass: "C",
    status: "awaiting_final_submit",
    submittedAt: hoursAgo(10),
    stageEnteredAt: hoursAgo(1),
    slaTargetHours: 168,
    employerName: "Tenaga Murni Sdn Bhd",
    feeAmount: 200,
    note: "PFD-RG-CE-NA-04 · OK Rizal telah terima pelantikan — tunggu majikan hantar permohonan",
    detail: { applicantPersonaId: "p-rahman", employerId: "emp-tenaga-murni" },
  },

  // ── RG-CG ──
  {
    id: "rg-cg-1",
    moduleCode: "RG-CG",
    refNo: "ST/RG-CG/2026/00018",
    appType: "new_registration",
    applicantName: "GasLink Contractors Sdn Bhd",
    identityNo: "201701067890 (3344556-W)",
    categoryOrClass: "G1",
    status: "sos_review",
    submittedAt: daysAgo(3),
    stageEnteredAt: hoursAgo(22),
    slaTargetHours: 24,
    assignedOfficer: "Faridah Hassan",
    feeAmount: 250,
  },
  {
    id: "rg-cg-2",
    moduleCode: "RG-CG",
    refNo: "ST/RG-CG/2026/00015",
    appType: "renewal",
    applicantName: "Pipeline Pros Sdn Bhd",
    identityNo: "201001034567 (7788990-P)",
    categoryOrClass: "G2",
    status: "awaiting_registration_payment",
    submittedAt: daysAgo(12),
    stageEnteredAt: hoursAgo(36),
    slaTargetHours: 72,
    feeAmount: 250,
  },
  {
    id: "rg-cg-3",
    moduleCode: "RG-CG",
    refNo: "ST/RG-CG/2026/00011",
    appType: "ok_appointment",
    applicantName: "SafePipe Services Sdn Bhd",
    identityNo: "201601078901 (4455667-Q)",
    categoryOrClass: "G1",
    status: "query_applicant",
    submittedAt: daysAgo(7),
    stageEnteredAt: hoursAgo(50),
    slaTargetHours: 48,
    note: "Sijil kompeten gas OK tidak sah / tamat tempoh",
    feeAmount: 30,
  },
  {
    id: "rg-cg-4",
    moduleCode: "RG-CG",
    refNo: "ST/RG-CG/2026/00008",
    appType: "new_registration",
    applicantName: "Borneo Gas Works Sdn Bhd",
    identityNo: "201401056789 (6677889-R)",
    categoryOrClass: "G3",
    status: "certificate_issued",
    submittedAt: daysAgo(45),
    stageEnteredAt: daysAgo(10),
    slaTargetHours: 72,
    feeAmount: 250,
  },
];

export const REGISTERED_ENTITIES: RegisteredEntity[] = [
  {
    id: "ent-ke-1",
    moduleCode: "RG-KE",
    certificateNo: "OK-E/PW4/2024/00821",
    holderName: "Ahmad bin Ismail",
    identityNo: "850101-10-5432",
    categoryOrClass: "PW4",
    employerName: "Syarikat Elektrik Maju Sdn Bhd",
    registeredAt: daysAgo(400),
    expiresAt: daysFromNow(45),
    compliance: "expiring_soon",
    cdpPoints: 22,
  },
  {
    id: "ent-ke-2",
    moduleCode: "RG-KE",
    certificateNo: "OK-E/JEK/2023/00412",
    holderName: "Siti Nurhaliza binti Kamal",
    identityNo: "900215-14-2211",
    categoryOrClass: "JEK",
    employerName: "Tenaga Power Solutions Sdn Bhd",
    registeredAt: daysAgo(700),
    expiresAt: daysFromNow(120),
    compliance: "active",
    cdpPoints: 35,
  },
  {
    id: "ent-ke-3",
    moduleCode: "RG-KE",
    certificateNo: "OK-E/PW2/2022/01102",
    holderName: "Tan Kok Weng",
    identityNo: "820101-08-9900",
    categoryOrClass: "PW2",
    employerName: "—",
    registeredAt: daysAgo(900),
    expiresAt: daysFromNow(-20),
    compliance: "expired",
    cdpPoints: 8,
  },
  {
    id: "ent-kg-1",
    moduleCode: "RG-KG",
    certificateNo: "OK-G/GPE/2024/00155",
    holderName: "Razak bin Abdullah",
    identityNo: "860707-10-9988",
    categoryOrClass: "GPE",
    employerName: "GasTech Malaysia Sdn Bhd",
    registeredAt: daysAgo(300),
    expiresAt: daysFromNow(80),
    compliance: "active",
    cdpPoints: 18,
  },
  {
    id: "ent-kg-2",
    moduleCode: "RG-KG",
    certificateNo: "OK-G/GJE/2023/00088",
    holderName: "Chong Mei Ling",
    identityNo: "910404-14-5566",
    categoryOrClass: "GJE",
    employerName: "Petronas Gas Retail Sdn Bhd",
    registeredAt: daysAgo(500),
    expiresAt: daysFromNow(25),
    compliance: "expiring_soon",
    cdpPoints: 32,
  },
  {
    id: "ent-ce-1",
    moduleCode: "RG-CE",
    certificateNo: "CE/B/2024/00301",
    holderName: "Elektro Prima Sdn Bhd",
    identityNo: "201501012345 (1122334-A)",
    categoryOrClass: "B",
    registeredAt: daysAgo(350),
    expiresAt: daysFromNow(90),
    compliance: "active",
    cdpPoints: 40,
  },
  {
    id: "ent-ce-2",
    moduleCode: "RG-CE",
    certificateNo: "CE/C/2022/00777",
    holderName: "Mega Circuit Sdn Bhd",
    identityNo: "200801045678 (5566778-U)",
    categoryOrClass: "C",
    registeredAt: daysAgo(800),
    expiresAt: daysFromNow(-5),
    compliance: "expired",
    cdpPoints: 12,
  },
  {
    id: "ent-ce-3",
    moduleCode: "RG-CE",
    certificateNo: "CE/D/2025/00110",
    holderName: "Cahaya Wiring Enterprise",
    identityNo: "SA0123456-A",
    categoryOrClass: "D",
    registeredAt: daysAgo(120),
    expiresAt: daysFromNow(200),
    compliance: "active",
    cdpPoints: 16,
  },
  {
    id: "ent-cg-1",
    moduleCode: "RG-CG",
    certificateNo: "CG/G1/2024/00044",
    holderName: "GasLink Contractors Sdn Bhd",
    identityNo: "201701067890 (3344556-W)",
    categoryOrClass: "G1",
    registeredAt: daysAgo(280),
    expiresAt: daysFromNow(60),
    compliance: "active",
    cdpPoints: 24,
  },
  {
    id: "ent-cg-2",
    moduleCode: "RG-CG",
    certificateNo: "CG/G2/2023/00021",
    holderName: "Pipeline Pros Sdn Bhd",
    identityNo: "201001034567 (7788990-P)",
    categoryOrClass: "G2",
    registeredAt: daysAgo(600),
    expiresAt: daysFromNow(18),
    compliance: "expiring_soon",
    cdpPoints: 20,
  },
  {
    id: "ent-cg-3",
    moduleCode: "RG-CG",
    certificateNo: "CG/G3/2021/00009",
    holderName: "Legacy Gas Co Sdn Bhd",
    identityNo: "199901012222 (1111222-T)",
    categoryOrClass: "G3",
    registeredAt: daysAgo(1200),
    expiresAt: daysFromNow(-40),
    compliance: "suspended",
    cdpPoints: 0,
    statusLabel: "Penguatkuasaan",
  },
];

export function applicationsFor(module: RegistrationModuleCode): RegistrationApplication[] {
  return REGISTRATION_APPLICATIONS.filter((a) => a.moduleCode === module);
}

export function entitiesFor(module: RegistrationModuleCode): RegisteredEntity[] {
  return REGISTERED_ENTITIES.filter((e) => e.moduleCode === module);
}

export type SearchHit =
  | (RegistrationApplication & { kind: "application" })
  | (RegisteredEntity & { kind: "entity" });

export function searchRegistration(query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const apps: SearchHit[] = REGISTRATION_APPLICATIONS.filter(
    (a) =>
      a.refNo.toLowerCase().includes(q) ||
      a.applicantName.toLowerCase().includes(q) ||
      a.identityNo.toLowerCase().includes(q),
  ).map((a) => ({ ...a, kind: "application" }));

  const ents: SearchHit[] = REGISTERED_ENTITIES.filter(
    (e) =>
      e.certificateNo.toLowerCase().includes(q) ||
      e.holderName.toLowerCase().includes(q) ||
      e.identityNo.toLowerCase().includes(q),
  ).map((e) => ({ ...e, kind: "entity" }));

  return [...apps, ...ents];
}
