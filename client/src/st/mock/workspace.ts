import type { ApplicationStatus } from "../types";
import type { OpsModuleCode, ServiceModuleCode } from "../modules/catalog";

export type WorkspaceAppStatus = ApplicationStatus | "scheduled" | "in_progress" | "closed";

export interface WorkspaceApplication {
  id: string;
  moduleCode: ServiceModuleCode;
  refNo: string;
  applicantName: string;
  identityNo: string;
  processType: string;
  status: ApplicationStatus;
  submittedAt: string;
  stageEnteredAt: string;
  slaTargetHours: number;
  categoryOrClass?: string;
  location?: string;
  feeRm?: number;
  officer?: string;
}

export interface WorkspaceEntity {
  id: string;
  moduleCode: ServiceModuleCode;
  name: string;
  identityNo: string;
  certificateNo: string;
  categoryOrClass: string;
  compliance: "active" | "expiring_soon" | "expired" | "suspended";
  expiresAt: string;
  location?: string;
}

export interface IdentityUser {
  id: string;
  name: string;
  identityNo: string;
  email: string;
  phone: string;
  role: string;
  status: "active" | "pending" | "suspended";
  lastLoginAt: string;
}

export interface Organisation {
  id: string;
  name: string;
  regNo: string;
  type: string;
  state: string;
  status: "active" | "pending" | "inactive";
  contactEmail: string;
}

export interface PaymentRow {
  id: string;
  receiptNo: string;
  refNo: string;
  payer: string;
  moduleCode: string;
  kind: "processing" | "registration" | "licence" | "exam";
  amountRm: number;
  paidAt: string;
  channel: "FPX" | "Manual";
  status: "success" | "pending" | "failed";
}

export interface SiteVisit {
  id: string;
  refNo: string;
  moduleCode: string;
  siteName: string;
  location: string;
  scheduledAt: string;
  officer: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  outcome?: string;
}

export interface CommitteeItem {
  id: string;
  refNo: string;
  title: string;
  moduleCode: string;
  meetingDate: string;
  status: "queued" | "deferred" | "approved" | "rejected";
  chair?: string;
}

export interface AuditEvent {
  id: string;
  at: string;
  actor: string;
  action: string;
  moduleCode: string;
  refNo: string;
  detail: string;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

function hoursAgo(n: number): string {
  return new Date(Date.now() - n * 3600_000).toISOString();
}

const SERVICE_APPS: WorkspaceApplication[] = [
  {
    id: "ws-le-1",
    moduleCode: "LC-LE",
    refNo: "ST/LC-LE/2026/00112",
    applicantName: "Tenaga Prima Sdn Bhd",
    identityNo: "201901012345",
    processType: "new_licence",
    status: "sos_review",
    submittedAt: daysAgo(3),
    stageEnteredAt: hoursAgo(2),
    slaTargetHours: 4,
    categoryOrClass: "Lesen Pengagihan",
    location: "Selangor",
    feeRm: 2500,
    officer: "SOS Aina",
  },
  {
    id: "ws-le-2",
    moduleCode: "LC-LE",
    refNo: "ST/LC-LE/2026/00098",
    applicantName: "VoltGrid Power",
    identityNo: "201801098765",
    processType: "renewal",
    status: "technical_review",
    submittedAt: daysAgo(8),
    stageEnteredAt: hoursAgo(20),
    slaTargetHours: 24,
    categoryOrClass: "Lesen Penjanaan",
    location: "Johor",
    feeRm: 1800,
  },
  {
    id: "ws-le-3",
    moduleCode: "LC-LE",
    refNo: "ST/LC-LE/2026/00071",
    applicantName: "Metro Cable Sdn Bhd",
    identityNo: "201701055512",
    processType: "amendment",
    status: "pending_approval",
    submittedAt: daysAgo(12),
    stageEnteredAt: hoursAgo(6),
    slaTargetHours: 8,
    categoryOrClass: "Lesen Penghantaran",
    location: "WP Kuala Lumpur",
  },
  {
    id: "ws-pe-1",
    moduleCode: "LC-PE",
    refNo: "ST/LC-PE/2026/00441",
    applicantName: "Bina Volt Engineering",
    identityNo: "202001033221",
    processType: "installation_approval",
    status: "sos_review",
    submittedAt: daysAgo(1),
    stageEnteredAt: hoursAgo(1),
    slaTargetHours: 4,
    categoryOrClass: "HV Substation",
    location: "Penang",
    feeRm: 450,
  },
  {
    id: "ws-pe-2",
    moduleCode: "LC-PE",
    refNo: "ST/LC-PE/2026/00402",
    applicantName: "Kilang Elektronik Utara",
    identityNo: "199901044110",
    processType: "completion_inspection",
    status: "query_applicant",
    submittedAt: daysAgo(15),
    stageEnteredAt: hoursAgo(48),
    slaTargetHours: 24,
    categoryOrClass: "LV Industrial",
    location: "Kedah",
  },
  {
    id: "ws-lg-1",
    moduleCode: "LC-LG",
    refNo: "ST/LC-LG/2026/00055",
    applicantName: "GasLink Distribution",
    identityNo: "201501022334",
    processType: "new_licence",
    status: "technical_review",
    submittedAt: daysAgo(5),
    stageEnteredAt: hoursAgo(10),
    slaTargetHours: 24,
    categoryOrClass: "Pengagihan Gas",
    location: "Terengganu",
    feeRm: 3200,
  },
  {
    id: "ws-lg-2",
    moduleCode: "LC-LG",
    refNo: "ST/LC-LG/2026/00041",
    applicantName: "Pantai Gas Retail",
    identityNo: "201901077889",
    processType: "renewal",
    status: "certificate_issued",
    submittedAt: daysAgo(40),
    stageEnteredAt: daysAgo(2),
    slaTargetHours: 8,
    categoryOrClass: "Runcit Gas",
    location: "Melaka",
  },
  {
    id: "ws-pg-1",
    moduleCode: "LC-PG",
    refNo: "ST/LC-PG/2026/00210",
    applicantName: "Pipeline Works MY",
    identityNo: "201601066778",
    processType: "installation_approval",
    status: "sos_review",
    submittedAt: daysAgo(2),
    stageEnteredAt: hoursAgo(3),
    slaTargetHours: 4,
    categoryOrClass: "Paip Tekanan Tinggi",
    location: "Pahang",
  },
  {
    id: "ws-xe-1",
    moduleCode: "CC-XE",
    refNo: "ST/CC-XE/2026/00881",
    applicantName: "Nurul Aisyah binti Kamal",
    identityNo: "950312145678",
    processType: "exam_registration",
    status: "awaiting_processing_payment",
    submittedAt: daysAgo(4),
    stageEnteredAt: hoursAgo(12),
    slaTargetHours: 48,
    categoryOrClass: "JEK",
    location: "Putrajaya",
    feeRm: 150,
  },
  {
    id: "ws-xe-2",
    moduleCode: "CC-XE",
    refNo: "ST/CC-XE/2026/00840",
    applicantName: "Lim Wei Jie",
    identityNo: "920808085432",
    processType: "exam_result",
    status: "certificate_issued",
    submittedAt: daysAgo(60),
    stageEnteredAt: daysAgo(5),
    slaTargetHours: 24,
    categoryOrClass: "PE",
  },
  {
    id: "ws-xg-1",
    moduleCode: "CC-XG",
    refNo: "ST/CC-XG/2026/00120",
    applicantName: "Hafiz bin Osman",
    identityNo: "880101105566",
    processType: "exam_registration",
    status: "sos_review",
    submittedAt: daysAgo(6),
    stageEnteredAt: hoursAgo(5),
    slaTargetHours: 4,
    categoryOrClass: "Gas Fitter",
  },
  {
    id: "ws-cd-1",
    moduleCode: "CC-CD",
    refNo: "ST/CC-CD/2026/00333",
    applicantName: "Institut Latihan Tenaga",
    identityNo: "ORG-CPD-001",
    processType: "programme_approval",
    status: "technical_review",
    submittedAt: daysAgo(9),
    stageEnteredAt: hoursAgo(30),
    slaTargetHours: 24,
    categoryOrClass: "CPD Provider",
  },
  {
    id: "ws-ee-1",
    moduleCode: "EE-KT",
    refNo: "ST/EE-KT/2026/00019",
    applicantName: "Kilang Baja Selatan",
    identityNo: "199801011122",
    processType: "efficiency_report",
    status: "query_applicant",
    submittedAt: daysAgo(20),
    stageEnteredAt: hoursAgo(72),
    slaTargetHours: 48,
    categoryOrClass: "Large Consumer",
    location: "Johor",
  },
  {
    id: "ws-en-1",
    moduleCode: "EN-IV",
    refNo: "ST/EN-IV/2026/00007",
    applicantName: "Aduan Awam — Tapak Bina",
    identityNo: "CASE-2026-007",
    processType: "investigation",
    status: "technical_review",
    submittedAt: daysAgo(7),
    stageEnteredAt: hoursAgo(18),
    slaTargetHours: 24,
    categoryOrClass: "Kesalahan Pepasangan",
    location: "Selangor",
    officer: "Pegawai EN Razak",
  },
];

const SERVICE_ENTITIES: WorkspaceEntity[] = [
  {
    id: "ent-le-1",
    moduleCode: "LC-LE",
    name: "Tenaga Prima Sdn Bhd",
    identityNo: "201901012345",
    certificateNo: "LE/SEL/2024/0881",
    categoryOrClass: "Lesen Pengagihan",
    compliance: "active",
    expiresAt: daysFromNow(280),
    location: "Selangor",
  },
  {
    id: "ent-le-2",
    moduleCode: "LC-LE",
    name: "Coastal Gen Power",
    identityNo: "201201099001",
    certificateNo: "LE/TRG/2023/0412",
    categoryOrClass: "Lesen Penjanaan",
    compliance: "expiring_soon",
    expiresAt: daysFromNow(45),
    location: "Terengganu",
  },
  {
    id: "ent-pe-1",
    moduleCode: "LC-PE",
    name: "Kilang Elektronik Utara — Pepasangan LV",
    identityNo: "INST-PE-4402",
    certificateNo: "PE/KDH/2025/1102",
    categoryOrClass: "LV Industrial",
    compliance: "active",
    expiresAt: daysFromNow(400),
    location: "Kedah",
  },
  {
    id: "ent-lg-1",
    moduleCode: "LC-LG",
    name: "GasLink Distribution",
    identityNo: "201501022334",
    certificateNo: "LG/TRG/2022/0099",
    categoryOrClass: "Pengagihan Gas",
    compliance: "suspended",
    expiresAt: daysFromNow(120),
    location: "Terengganu",
  },
  {
    id: "ent-pg-1",
    moduleCode: "LC-PG",
    name: "Pipeline Works MY — Line A",
    identityNo: "INST-PG-0210",
    certificateNo: "PG/PHG/2024/0330",
    categoryOrClass: "Paip Tekanan Tinggi",
    compliance: "active",
    expiresAt: daysFromNow(500),
    location: "Pahang",
  },
  {
    id: "ent-xe-1",
    moduleCode: "CC-XE",
    name: "Lim Wei Jie",
    identityNo: "920808085432",
    certificateNo: "XE/PE/2026/0840",
    categoryOrClass: "PE",
    compliance: "active",
    expiresAt: daysFromNow(900),
  },
  {
    id: "ent-cd-1",
    moduleCode: "CC-CD",
    name: "Institut Latihan Tenaga",
    identityNo: "ORG-CPD-001",
    certificateNo: "CPD/PROV/2025/12",
    categoryOrClass: "CPD Provider",
    compliance: "expiring_soon",
    expiresAt: daysFromNow(30),
  },
  {
    id: "ent-ee-1",
    moduleCode: "EE-KT",
    name: "Kilang Baja Selatan",
    identityNo: "199801011122",
    certificateNo: "EE/JHR/2024/0019",
    categoryOrClass: "Large Consumer",
    compliance: "expired",
    expiresAt: daysAgo(10),
    location: "Johor",
  },
  {
    id: "ent-en-1",
    moduleCode: "EN-IV",
    name: "Kes EN-IV/2025/044",
    identityNo: "CASE-2025-044",
    certificateNo: "EN/CLOSED/044",
    categoryOrClass: "Ditutup",
    compliance: "active",
    expiresAt: daysFromNow(0),
    location: "Negeri Sembilan",
  },
];

export const PUBLIC_USERS: IdentityUser[] = [
  {
    id: "u1",
    name: "Ahmad bin Ismail",
    identityNo: "850101145678",
    email: "ahmad.ismail@email.my",
    phone: "012-3456789",
    role: "Pemohon",
    status: "active",
    lastLoginAt: hoursAgo(5),
  },
  {
    id: "u2",
    name: "Siti Nurhaliza",
    identityNo: "900215085432",
    email: "siti.n@email.my",
    phone: "013-9876543",
    role: "Pemohon",
    status: "active",
    lastLoginAt: daysAgo(1),
  },
  {
    id: "u3",
    name: "Chong Wei Liang",
    identityNo: "880808105566",
    email: "chong.wl@email.my",
    phone: "016-1122334",
    role: "Pemohon",
    status: "pending",
    lastLoginAt: daysAgo(12),
  },
  {
    id: "u4",
    name: "Wakil Elektro Prima",
    identityNo: "COMP-REP-01",
    email: "wakil@elektroprima.my",
    phone: "03-88881234",
    role: "Majikan",
    status: "active",
    lastLoginAt: hoursAgo(28),
  },
];

export const STAFF_USERS: IdentityUser[] = [
  {
    id: "s1",
    name: "Aina binti Roslan",
    identityNo: "ST-SOS-001",
    email: "aina@st.gov.my",
    phone: "03-8870 1001",
    role: "SOS",
    status: "active",
    lastLoginAt: hoursAgo(1),
  },
  {
    id: "s2",
    name: "Razak bin Hassan",
    identityNo: "ST-TECH-014",
    email: "razak@st.gov.my",
    phone: "03-8870 1014",
    role: "Teknikal",
    status: "active",
    lastLoginAt: hoursAgo(3),
  },
  {
    id: "s3",
    name: "Dr. Farah Aziz",
    identityNo: "ST-APR-003",
    email: "farah@st.gov.my",
    phone: "03-8870 1003",
    role: "Pelulus",
    status: "active",
    lastLoginAt: daysAgo(0),
  },
];

export const ORGANISATIONS: Organisation[] = [
  {
    id: "o1",
    name: "Elektro Prima Sdn Bhd",
    regNo: "201901012345",
    type: "Kontraktor Elektrik",
    state: "Selangor",
    status: "active",
    contactEmail: "admin@elektroprima.my",
  },
  {
    id: "o2",
    name: "GasLink Distribution",
    regNo: "201501022334",
    type: "Pengagihan Gas",
    state: "Terengganu",
    status: "active",
    contactEmail: "ops@gaslink.my",
  },
  {
    id: "o3",
    name: "Bina Volt Engineering",
    regNo: "202001033221",
    type: "Pepasangan",
    state: "Penang",
    status: "pending",
    contactEmail: "info@binavolt.my",
  },
];

export const PAYMENTS: PaymentRow[] = [
  {
    id: "p1",
    receiptNo: "RCP/2026/10021",
    refNo: "ST/RG-KE/2026/00041",
    payer: "Ahmad bin Ismail",
    moduleCode: "RG-KE",
    kind: "processing",
    amountRm: 50,
    paidAt: daysAgo(2),
    channel: "FPX",
    status: "success",
  },
  {
    id: "p2",
    receiptNo: "RCP/2026/10045",
    refNo: "ST/LC-LE/2026/00112",
    payer: "Tenaga Prima Sdn Bhd",
    moduleCode: "LC-LE",
    kind: "licence",
    amountRm: 2500,
    paidAt: daysAgo(1),
    channel: "FPX",
    status: "success",
  },
  {
    id: "p3",
    receiptNo: "RCP/2026/10088",
    refNo: "ST/CC-XE/2026/00881",
    payer: "Nurul Aisyah binti Kamal",
    moduleCode: "CC-XE",
    kind: "exam",
    amountRm: 150,
    paidAt: hoursAgo(6),
    channel: "FPX",
    status: "pending",
  },
  {
    id: "p4",
    receiptNo: "RCP/2026/09901",
    refNo: "ST/RG-CE/2026/00012",
    payer: "Elektro Prima Sdn Bhd",
    moduleCode: "RG-CE",
    kind: "registration",
    amountRm: 500,
    paidAt: daysAgo(10),
    channel: "Manual",
    status: "failed",
  },
];

export const SITE_VISITS: SiteVisit[] = [
  {
    id: "v1",
    refNo: "SV/2026/0044",
    moduleCode: "LC-PE",
    siteName: "Kilang Elektronik Utara",
    location: "Kulim, Kedah",
    scheduledAt: daysFromNow(2),
    officer: "Razak bin Hassan",
    status: "scheduled",
  },
  {
    id: "v2",
    refNo: "SV/2026/0039",
    moduleCode: "LC-PG",
    siteName: "Pipeline Works MY — Line A",
    location: "Kuantan, Pahang",
    scheduledAt: daysAgo(1),
    officer: "Razak bin Hassan",
    status: "in_progress",
  },
  {
    id: "v3",
    refNo: "SV/2026/0028",
    moduleCode: "EN-IV",
    siteName: "Tapak Bina — Aduan Awam",
    location: "Shah Alam, Selangor",
    scheduledAt: daysAgo(5),
    officer: "Pegawai EN Razak",
    status: "completed",
    outcome: "Notis pembetulan dikeluarkan",
  },
  {
    id: "v4",
    refNo: "SV/2026/0021",
    moduleCode: "LC-LE",
    siteName: "Coastal Gen Power",
    location: "Kemaman, Terengganu",
    scheduledAt: daysAgo(12),
    officer: "Aina binti Roslan",
    status: "cancelled",
  },
];

export const COMMITTEE_QUEUE: CommitteeItem[] = [
  {
    id: "jk1",
    refNo: "JK/2026/0018",
    title: "Kelulusan lesen pengagihan — Tenaga Prima",
    moduleCode: "LC-LE",
    meetingDate: daysFromNow(5),
    status: "queued",
    chair: "Pengerusi JK Pelesenan",
  },
  {
    id: "jk2",
    refNo: "JK/2026/0015",
    title: "Pembaharuan kelas kontraktor — Elektro Prima",
    moduleCode: "RG-CE",
    meetingDate: daysFromNow(5),
    status: "queued",
  },
  {
    id: "jk3",
    refNo: "JK/2026/0011",
    title: "Keputusan peperiksaan khas — CC-XE",
    moduleCode: "CC-XE",
    meetingDate: daysAgo(7),
    status: "approved",
    chair: "Pengerusi JK Kompetensi",
  },
  {
    id: "jk4",
    refNo: "JK/2026/0009",
    title: "Rayuan penggantungan lesen gas",
    moduleCode: "LC-LG",
    meetingDate: daysAgo(14),
    status: "deferred",
  },
];

export const AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "a1",
    at: hoursAgo(1),
    actor: "Aina binti Roslan",
    action: "CLAIM_TASK",
    moduleCode: "RG-KE",
    refNo: "ST/RG-KE/2026/00041",
    detail: "Tugasan diambil dari peti FIFO",
  },
  {
    id: "a2",
    at: hoursAgo(3),
    actor: "Sistem FPX",
    action: "PAYMENT_SUCCESS",
    moduleCode: "LC-LE",
    refNo: "ST/LC-LE/2026/00112",
    detail: "Bayaran lesen RM2,500 berjaya",
  },
  {
    id: "a3",
    at: hoursAgo(8),
    actor: "Dr. Farah Aziz",
    action: "DIGITAL_SIGN",
    moduleCode: "RG-CE",
    refNo: "ST/RG-CE/2026/00012",
    detail: "Kelulusan & tandatangan digital",
  },
  {
    id: "a4",
    at: daysAgo(1),
    actor: "Admin ST",
    action: "ROLE_UPDATE",
    moduleCode: "PE-ID",
    refNo: "ST-TECH-014",
    detail: "Peranan teknikal dikemas kini",
  },
  {
    id: "a5",
    at: daysAgo(2),
    actor: "Razak bin Hassan",
    action: "QUERY_ISSUED",
    moduleCode: "LC-PE",
    refNo: "ST/LC-PE/2026/00402",
    detail: "Kuiri dokumen pelan elektrik",
  },
];

export const AIRR_STATS = [
  { labelBm: "Permohonan diterima", labelBi: "Applications received", value: 1284, delta: 8 },
  { labelBm: "Diluluskan", labelBi: "Approved", value: 942, delta: 5 },
  { labelBm: "Ditolak / ditarik", labelBi: "Rejected / withdrawn", value: 61, delta: -2 },
  { labelBm: "Dalam proses", labelBi: "In progress", value: 281, delta: 3 },
];

export const SLA_MODULE_STATS = [
  { module: "RG-KE", green: 72, yellow: 18, red: 10 },
  { module: "RG-CE", green: 65, yellow: 22, red: 13 },
  { module: "LC-LE", green: 58, yellow: 25, red: 17 },
  { module: "LC-PE", green: 70, yellow: 20, red: 10 },
  { module: "PE-SV", green: 80, yellow: 15, red: 5 },
];

export const FEE_SCHEDULE = [
  { code: "RG-KE", itemBm: "Yuran pemprosesan OK Elektrik", itemBi: "OK Electric processing fee", amountRm: 50 },
  { code: "RG-KE", itemBm: "Yuran pendaftaran / tahun", itemBi: "Registration fee / year", amountRm: 100 },
  { code: "RG-CE", itemBm: "Yuran pemprosesan kontraktor", itemBi: "Contractor processing fee", amountRm: 100 },
  { code: "RG-CE", itemBm: "Kelas A — pendaftaran", itemBi: "Class A — registration", amountRm: 500 },
  { code: "LC-LE", itemBm: "Lesen pengagihan (contoh)", itemBi: "Distribution licence (sample)", amountRm: 2500 },
  { code: "CC-XE", itemBm: "Yuran peperiksaan", itemBi: "Examination fee", amountRm: 150 },
];

export const REF_TABLES = [
  { id: "rt1", nameBm: "Negeri / Daerah", nameBi: "State / District", rows: 180, updatedAt: daysAgo(30) },
  { id: "rt2", nameBm: "Kategori kekompetenan elektrik", nameBi: "Electrical competency categories", rows: 24, updatedAt: daysAgo(12) },
  { id: "rt3", nameBm: "Kelas kontraktor", nameBi: "Contractor classes", rows: 8, updatedAt: daysAgo(90) },
  { id: "rt4", nameBm: "Kod fi & hari bayaran", nameBi: "Fee codes & payment days", rows: 42, updatedAt: daysAgo(5) },
];

export const NOTIF_TEMPLATES = [
  { id: "nt1", code: "APP_SUBMITTED", channel: "Email+SMS", nameBm: "Permohonan dihantar", nameBi: "Application submitted" },
  { id: "nt2", code: "QUERY_ISSUED", channel: "Email", nameBm: "Kuiri kepada pemohon", nameBi: "Query to applicant" },
  { id: "nt3", code: "PAYMENT_DUE", channel: "Email+SMS", nameBm: "Peringatan bayaran", nameBi: "Payment reminder" },
  { id: "nt4", code: "CERT_ISSUED", channel: "Email", nameBm: "Sijil dikeluarkan", nameBi: "Certificate issued" },
];

export const WORKFLOW_LOA = [
  { id: "w1", module: "RG-KE", stageBm: "Semakan SOS", stageBi: "SOS review", loa: "SOS", slaHours: 4 },
  { id: "w2", module: "RG-KE", stageBm: "Semakan teknikal", stageBi: "Technical review", loa: "Teknikal", slaHours: 24 },
  { id: "w3", module: "RG-KE", stageBm: "Kelulusan", stageBi: "Approval", loa: "Pelulus", slaHours: 8 },
  { id: "w4", module: "LC-LE", stageBm: "Kelulusan JK", stageBi: "Committee approval", loa: "JK", slaHours: 120 },
];

export const RBAC_ROLES = [
  { id: "r1", name: "SOS", users: 12, modules: "Semua modul semakan awal" },
  { id: "r2", name: "Teknikal", users: 28, modules: "Semakan teknikal modul domain" },
  { id: "r3", name: "Pelulus", users: 8, modules: "Kelulusan & tandatangan" },
  { id: "r4", name: "Jawatankuasa", users: 15, modules: "PE-JK" },
  { id: "r5", name: "Admin", users: 3, modules: "Semua + konfigurasi" },
];

export const INTEGRATIONS = [
  { id: "i1", name: "FPX / Payment Gateway", status: "connected", lastSync: hoursAgo(0.2) },
  { id: "i2", name: "MyKad / JPN (rujukan)", status: "planned", lastSync: daysAgo(0) },
  { id: "i3", name: "SSM (rujukan syarikat)", status: "planned", lastSync: daysAgo(0) },
  { id: "i4", name: "e-Mel / SMS Gateway", status: "connected", lastSync: hoursAgo(1) },
  { id: "i5", name: "Digital Signature", status: "connected", lastSync: hoursAgo(8) },
];

export function appsForModule(code: ServiceModuleCode): WorkspaceApplication[] {
  return SERVICE_APPS.filter((a) => a.moduleCode === code);
}

export function entitiesForModule(code: ServiceModuleCode): WorkspaceEntity[] {
  return SERVICE_ENTITIES.filter((e) => e.moduleCode === code);
}

export function opsScreenKey(path: string): string {
  const p = path.replace(/^\/(admin\/)?st\//, "");
  if (p.includes("public-users")) return "public-users";
  if (p.includes("identity/staff")) return "staff";
  if (p.includes("organisations")) return "organisations";
  if (p.includes("identity/access")) return "access";
  if (p.includes("revenue/payments")) return "payments";
  if (p.includes("reconciliation")) return "reconciliation";
  if (p.includes("revenue/reports")) return "revenue-reports";
  if (p.includes("site-visits/schedule")) return "schedule";
  if (p.includes("inspections")) return "inspections";
  if (p.includes("site-visits/reports")) return "visit-reports";
  if (p.includes("committee/queue")) return "queue";
  if (p.includes("committee/decisions")) return "decisions";
  return "";
}

export function analyticsScreenKey(path: string): string {
  if (path.includes("reports/airr")) return "reports-airr";
  if (path.includes("reports/sla")) return "reports-sla";
  if (path.includes("reports/export")) return "reports-export";
  if (path.includes("audit-trail")) return "reports-audit";
  return "";
}

export function adminScreenKey(path: string): string {
  if (path.includes("reference-tables")) return "admin-ref-tables";
  if (path.includes("configuration/fees")) return "admin-fees";
  if (path.includes("configuration/notifications")) return "admin-notifications";
  if (path.includes("configuration/workflow")) return "admin-workflow";
  if (path.includes("rbac/roles")) return "admin-roles";
  if (path.includes("rbac/permissions")) return "admin-permissions";
  if (path.includes("system/audit")) return "admin-audit";
  if (path.includes("system/integrations")) return "admin-integrations";
  return "";
}

export function serviceScreenFromPath(path: string): "applications" | "review" | "compliance" | "reports" | null {
  if (path.endsWith("/applications") || path.includes("/applications?")) return "applications";
  if (path.includes("/review")) return "review";
  if (path.includes("/compliance")) return "compliance";
  if (path.includes("/reports") && !path.includes("revenue") && !path.includes("site-visits")) return "reports";
  // service module reports paths end with /reports
  const m = path.match(/\/(applications|review|compliance|reports)\/?$/);
  return (m?.[1] as "applications" | "review" | "compliance" | "reports") ?? null;
}

export type { OpsModuleCode, ServiceModuleCode };
