import type {
  AppDocument,
  AppointedOk,
  Application,
  ApplicationStatus,
  AuditEntry,
  Certificate,
  Payment,
  PersonaRole,
} from "../types";
import { personaById } from "./personas";
import { employerById } from "./employers";
import { slaTargetFor } from "./charter";

let seq = 0;

function iso(baseNow: number, hoursAgo: number): string {
  return new Date(baseNow - hoursAgo * 3_600_000).toISOString();
}

function refNo(type: "OK" | "CE", n: number): string {
  return `ST/${type}/2026/${String(n).padStart(5, "0")}`;
}

function docs(baseNow: number, labels: string[], status: AppDocument["status"] = "pending"): AppDocument[] {
  return labels.map((label, i) => ({
    id: `doc-${++seq}`,
    label,
    fileName: `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`,
    sizeKb: 320 + i * 110,
    mimeType: "application/pdf",
    uploadedAt: iso(baseNow, 50),
    status,
  }));
}

const OK_DOCS = ["Salinan Kad Pengenalan", "Sijil Kekompetenan", "Surat Tawaran Pekerjaan", "Gambar Pasport"];
const CE_DOCS = ["Sijil Pendaftaran SSM", "Borang 49", "Surat Lantikan Orang Kompeten", "Penyata Kewangan"];

function audit(
  baseNow: number,
  entries: Array<Pick<AuditEntry, "actorPersonaId" | "action"> & Partial<AuditEntry> & { hoursAgo: number }>,
): AuditEntry[] {
  return entries.map((e) => {
    const persona = personaById(e.actorPersonaId);
    return {
      id: `aud-${++seq}`,
      at: iso(baseNow, e.hoursAgo),
      actorPersonaId: e.actorPersonaId,
      actorRole: (e.actorRole ?? persona?.role ?? "system") as AuditEntry["actorRole"],
      actorName: e.actorName ?? persona?.name ?? "Sistem",
      action: e.action,
      fromStatus: e.fromStatus,
      toStatus: e.toStatus,
      note: e.note,
    };
  });
}

function paidPayment(baseNow: number, kind: Payment["kind"], amount: number, hoursAgo: number): Payment {
  return {
    id: `pay-${++seq}`,
    kind,
    amount,
    currency: "MYR",
    status: "paid",
    fpxRef: `FPX${String(100000 + seq).slice(-6)}`,
    bank: "Maybank2u",
    paidAt: iso(baseNow, hoursAgo),
    receiptNo: `RCP-${2026}${String(seq).padStart(4, "0")}`,
  };
}

interface Spec {
  ref: number;
  type: "OK" | "CE";
  status: ApplicationStatus;
  applicantPersonaId: string;
  applicant: Application["applicant"];
  competencyCategory?: Application["competencyCategory"];
  contractorClass?: Application["contractorClass"];
  period: Application["registrationPeriodYears"];
  employerId: string;
  assignedRole: PersonaRole | null;
  assigneePersonaId?: string | null;
  stageHoursAgo: number; // how long in current back-office stage
  createdHoursAgo: number;
  documents: AppDocument[];
  payments: Payment[];
  auditTrail: AuditEntry[];
  certificate?: Certificate;
  appointedOks?: AppointedOk[];
  identityVerified?: boolean;
}

export function seedApplications(baseNow: number): Application[] {
  seq = 0;

  const ahmad = {
    fullName: "Ahmad bin Ismail",
    icNumber: "840512-10-5523",
    dob: "1984-05-12",
    age: 41,
    address: "No. 24, Jalan Melati 3, Taman Seri Indah, 43000 Kajang, Selangor",
    phone: "012-3456789",
    email: "ahmad.ismail@email.my",
  };
  const tan = {
    fullName: "Tan Chee Keong",
    icNumber: "790238-08-6191",
    dob: "1979-02-08",
    age: 47,
    address: "12A, Lorong Permai, 11900 Bayan Lepas, Pulau Pinang",
    phone: "016-7788990",
    email: "ck.tan@email.my",
  };
  const lim = {
    fullName: "Lim Wei Sheng",
    icNumber: "880920-14-5099",
    dob: "1988-09-20",
    age: 37,
    address: "Lot 8, Jalan Teknologi 3/5, 47810 Petaling Jaya, Selangor",
    phone: "019-2233445",
    email: "weisheng@elektrikmaju.com.my",
  };

  const specs: Spec[] = [
    // 1) OK — awaiting employer confirmation (Ahmad → Rahman)
    {
      ref: 101, type: "OK", status: "awaiting_employer_confirm", applicantPersonaId: "p-ahmad", applicant: ahmad,
      competencyCategory: "PW", period: 3, employerId: "emp-tenaga-murni", assignedRole: null,
      stageHoursAgo: 6, createdHoursAgo: 6, documents: docs(baseNow, OK_DOCS),
      payments: [],
      auditTrail: audit(baseNow, [
        { actorPersonaId: "p-ahmad", action: "Menghantar permohonan", hoursAgo: 6, toStatus: "awaiting_employer_confirm" },
      ]),
    },
    // 2) OK — SOS review, GREEN (1h)
    {
      ref: 103, type: "OK", status: "sos_review", applicantPersonaId: "p-tan", applicant: tan,
      competencyCategory: "PE", period: 5, employerId: "emp-kuasa-bistari", assignedRole: "sos", assigneePersonaId: "p-faridah",
      stageHoursAgo: 1, createdHoursAgo: 26, documents: docs(baseNow, OK_DOCS),
      payments: [paidPayment(baseNow, "processing", 50, 1.2)],
      auditTrail: audit(baseNow, [
        { actorPersonaId: "p-tan", action: "Menghantar permohonan", hoursAgo: 26 },
        { actorPersonaId: "p-rahman", action: "Mengesahkan lantikan", hoursAgo: 22 },
        { actorPersonaId: "p-tan", action: "Membayar yuran pemprosesan", hoursAgo: 1.2, toStatus: "sos_review" },
      ]),
    },
    // 3) OK — SOS review, YELLOW (3h)
    {
      ref: 104, type: "OK", status: "sos_review", applicantPersonaId: "p-tan", applicant: tan,
      competencyCategory: "PW", period: 1, employerId: "emp-kuasa-bistari", assignedRole: "sos", assigneePersonaId: "p-faridah",
      stageHoursAgo: 3, createdHoursAgo: 28, documents: docs(baseNow, OK_DOCS),
      payments: [paidPayment(baseNow, "processing", 50, 3.1)],
      auditTrail: audit(baseNow, [
        { actorPersonaId: "p-tan", action: "Menghantar permohonan", hoursAgo: 28 },
        { actorPersonaId: "p-tan", action: "Membayar yuran pemprosesan", hoursAgo: 3.1, toStatus: "sos_review" },
      ]),
      identityVerified: true,
    },
    // 4) OK — SOS review, RED (6h, overdue)
    {
      ref: 105, type: "OK", status: "sos_review", applicantPersonaId: "p-ahmad", applicant: ahmad,
      competencyCategory: "PK", period: 2, employerId: "emp-tenaga-murni", assignedRole: "sos", assigneePersonaId: "p-faridah",
      stageHoursAgo: 6, createdHoursAgo: 40, documents: docs(baseNow, OK_DOCS),
      payments: [paidPayment(baseNow, "processing", 50, 6.2)],
      auditTrail: audit(baseNow, [
        { actorPersonaId: "p-ahmad", action: "Menghantar permohonan", hoursAgo: 40 },
        { actorPersonaId: "p-ahmad", action: "Membayar yuran pemprosesan", hoursAgo: 6.2, toStatus: "sos_review" },
      ]),
    },
    // 5) OK — SOS review, GREEN (0.4h) — the 4th unassigned item (max-3 lock demo)
    {
      ref: 106, type: "OK", status: "sos_review", applicantPersonaId: "p-tan", applicant: tan,
      competencyCategory: "PJ", period: 3, employerId: "emp-kuasa-bistari", assignedRole: "sos", assigneePersonaId: null,
      stageHoursAgo: 0.4, createdHoursAgo: 25, documents: docs(baseNow, OK_DOCS),
      payments: [paidPayment(baseNow, "processing", 50, 0.5)],
      auditTrail: audit(baseNow, [
        { actorPersonaId: "p-tan", action: "Menghantar permohonan", hoursAgo: 25 },
        { actorPersonaId: "p-tan", action: "Membayar yuran pemprosesan", hoursAgo: 0.5, toStatus: "sos_review" },
      ]),
    },
    // 6) OK — queried back to applicant (Ahmad)
    {
      ref: 107, type: "OK", status: "query_applicant", applicantPersonaId: "p-ahmad", applicant: ahmad,
      competencyCategory: "PW", period: 4, employerId: "emp-tenaga-murni", assignedRole: null,
      stageHoursAgo: 5, createdHoursAgo: 36, documents: docs(baseNow, OK_DOCS),
      payments: [paidPayment(baseNow, "processing", 50, 30)],
      auditTrail: audit(baseNow, [
        { actorPersonaId: "p-ahmad", action: "Menghantar permohonan", hoursAgo: 36 },
        { actorPersonaId: "p-ahmad", action: "Membayar yuran pemprosesan", hoursAgo: 30 },
        { actorPersonaId: "p-faridah", action: "Membangkitkan pertanyaan", hoursAgo: 5, fromStatus: "sos_review", toStatus: "query_applicant", note: "Sijil Kekompetenan tidak jelas. Sila muat naik semula salinan yang lebih terang." },
      ]),
    },
    // 7) OK — technical review
    {
      ref: 108, type: "OK", status: "technical_review", applicantPersonaId: "p-tan", applicant: tan,
      competencyCategory: "JEK", period: 5, employerId: "emp-kuasa-bistari", assignedRole: "technical", assigneePersonaId: "p-kumar",
      stageHoursAgo: 8, createdHoursAgo: 50, documents: docs(baseNow, OK_DOCS, "accepted"),
      payments: [paidPayment(baseNow, "processing", 50, 45)],
      auditTrail: audit(baseNow, [
        { actorPersonaId: "p-tan", action: "Menghantar permohonan", hoursAgo: 50 },
        { actorPersonaId: "p-tan", action: "Membayar yuran pemprosesan", hoursAgo: 45 },
        { actorPersonaId: "p-faridah", action: "Mengesahkan identiti (JPN)", hoursAgo: 12 },
        { actorPersonaId: "p-faridah", action: "Memajukan ke Pegawai Teknikal", hoursAgo: 8, fromStatus: "sos_review", toStatus: "technical_review" },
      ]),
      identityVerified: true,
    },
    // 8) OK — pending approval
    {
      ref: 109, type: "OK", status: "pending_approval", applicantPersonaId: "p-ahmad", applicant: ahmad,
      competencyCategory: "PE", period: 3, employerId: "emp-tenaga-murni", assignedRole: "approver", assigneePersonaId: "p-zainab",
      stageHoursAgo: 2, createdHoursAgo: 60, documents: docs(baseNow, OK_DOCS, "accepted"),
      payments: [paidPayment(baseNow, "processing", 50, 55)],
      auditTrail: audit(baseNow, [
        { actorPersonaId: "p-ahmad", action: "Menghantar permohonan", hoursAgo: 60 },
        { actorPersonaId: "p-ahmad", action: "Membayar yuran pemprosesan", hoursAgo: 55 },
        { actorPersonaId: "p-faridah", action: "Memajukan ke Pegawai Teknikal", hoursAgo: 20 },
        { actorPersonaId: "p-kumar", action: "Memajukan ke Pelulus", hoursAgo: 2, fromStatus: "technical_review", toStatus: "pending_approval" },
      ]),
      identityVerified: true,
    },
    // 9) OK — certificate issued (completed)
    {
      ref: 110, type: "OK", status: "certificate_issued", applicantPersonaId: "p-ahmad", applicant: ahmad,
      competencyCategory: "PW", period: 5, employerId: "emp-tenaga-murni", assignedRole: null,
      stageHoursAgo: 1, createdHoursAgo: 90, documents: docs(baseNow, OK_DOCS, "accepted"),
      payments: [paidPayment(baseNow, "processing", 50, 85), paidPayment(baseNow, "registration", 500, 1)],
      auditTrail: audit(baseNow, [
        { actorPersonaId: "p-ahmad", action: "Menghantar permohonan", hoursAgo: 90 },
        { actorPersonaId: "p-ahmad", action: "Membayar yuran pemprosesan", hoursAgo: 85 },
        { actorPersonaId: "p-faridah", action: "Memajukan ke Pegawai Teknikal", hoursAgo: 60 },
        { actorPersonaId: "p-kumar", action: "Memajukan ke Pelulus", hoursAgo: 30 },
        { actorPersonaId: "p-zainab", action: "Meluluskan & menandatangani secara digital", hoursAgo: 5 },
        { actorPersonaId: "p-ahmad", action: "Membayar yuran pendaftaran", hoursAgo: 1 },
        { actorPersonaId: "system", action: "Sijil digital dikeluarkan", hoursAgo: 1, toStatus: "certificate_issued" },
      ]),
      certificate: {
        id: "cert-110",
        serialNo: "ST-OK-2026-00110",
        applicationId: "", // filled below
        holderName: "Ahmad bin Ismail",
        competencyCategory: "PW",
        issuedAt: iso(baseNow, 1),
        expiresAt: new Date(baseNow + 5 * 365 * 24 * 3_600_000).toISOString(),
        qrPayload: "https://verify.st.gov.my/cert/ST-OK-2026-00110",
        trustmarkId: "ST-TRUST-00110",
      },
    },
    // 10) CE — SOS review, YELLOW (unassigned → queued behind the max-3 lock)
    {
      ref: 202, type: "CE", status: "sos_review", applicantPersonaId: "p-lim", applicant: lim,
      contractorClass: "B", period: 2, employerId: "emp-elektrik-maju", assignedRole: "sos", assigneePersonaId: null,
      stageHoursAgo: 2.5, createdHoursAgo: 20, documents: docs(baseNow, CE_DOCS),
      payments: [paidPayment(baseNow, "processing", 100, 2.6)],
      // Class B needs PW4×1 + PW3×1 + PW1×1 — satisfied & confirmed.
      appointedOks: [
        { registeredOkId: "ok-ahmad", personaId: "p-ahmad", name: "Ahmad bin Ismail", mykad: "840512-10-5523", wirerType: "PW4", competencyCategory: "PW", confirmed: true, confirmedAt: iso(baseNow, 14) },
        { registeredOkId: "ok-tan", personaId: "p-tan", name: "Tan Chee Keong", mykad: "790238-08-6191", wirerType: "PW3", competencyCategory: "PW", confirmed: true, confirmedAt: iso(baseNow, 14) },
        { registeredOkId: "ok-chong", name: "Chong Wei Liang", mykad: "860318-07-5217", wirerType: "PW1", competencyCategory: "PW", confirmed: true, confirmedAt: iso(baseNow, 15) },
      ],
      auditTrail: audit(baseNow, [
        { actorPersonaId: "p-lim", action: "Menghantar permohonan kontraktor", hoursAgo: 20 },
        { actorPersonaId: "p-tan", action: "Mengesahkan lantikan Orang Kompeten", hoursAgo: 14 },
        { actorPersonaId: "p-lim", action: "Membayar yuran pemprosesan", hoursAgo: 2.6, toStatus: "sos_review" },
      ]),
    },
  ];

  return specs.map((s) => {
    const id = `app-${s.ref}`;
    const employer = employerById(s.employerId)!;
    if (s.certificate) s.certificate.applicationId = id;
    return {
      id,
      refNo: refNo(s.type, s.ref),
      workflowType: s.type,
      status: s.status,
      applicant: s.applicant,
      applicantPersonaId: s.applicantPersonaId,
      competencyCategory: s.competencyCategory,
      contractorClass: s.contractorClass,
      appointedOks: s.appointedOks,
      registrationPeriodYears: s.period,
      employer,
      documents: s.documents,
      payments: s.payments,
      auditTrail: s.auditTrail,
      assignedRole: s.assignedRole,
      assigneePersonaId: s.assigneePersonaId ?? null,
      slaTargetHours: s.assignedRole ? slaTargetFor(s.assignedRole) : 0,
      stageEnteredAt: iso(baseNow, s.stageHoursAgo),
      identityCheck: s.identityVerified
        ? { jpnStatus: "alive", checkedAt: iso(baseNow, s.stageHoursAgo + 1), checkedByPersonaId: "p-faridah" }
        : undefined,
      certificate: s.certificate,
      createdAt: iso(baseNow, s.createdHoursAgo),
      updatedAt: iso(baseNow, s.stageHoursAgo),
    } as Application;
  });
}
