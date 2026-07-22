import type {
  AppDocument,
  AppointedOk,
  Application,
  ApplicationStatus,
  AuditEntry,
  Certificate,
  ContractorClass,
  Payment,
  PersonaRole,
  WirerType,
} from "../types";
import { personaById } from "./personas";
import { employerById } from "./employers";
import { slaTargetFor } from "./charter";
import { CLASS_REQUIREMENTS } from "./competencies";

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
const CE_DOCS = [
  "Perjanjian sewa atau jual beli pejabat",
  "Lesen perniagaan PBT",
  "Annual return / Perakuan Pendaftaran",
  "SOCSO Borang 8A (3 bulan) + resit",
];

/** Prototype OK set that satisfies CLASS_REQUIREMENTS for Peti Tugasan CE detail. */
function appointedOksForClass(cls: ContractorClass, baseNow: number, employerId?: string): AppointedOk[] {
  const req = CLASS_REQUIREMENTS[cls] ?? { PW4: 1 };
  // Ahmad / Tan reserved for Tenaga Murni; ABC uses alternate pool.
  const pool: Array<{ name: string; mykad: string; wirerType: WirerType; registeredOkId?: string; personaId?: string }> =
    employerId === "emp-abc-elektrik"
      ? [
          { name: "Rizal bin Hassan", mykad: "870404-10-5512", wirerType: "PW4", registeredOkId: "ok-rizal" },
          { name: "Suresh a/l Maniam", mykad: "880101-14-5099", wirerType: "PW3", registeredOkId: "ok-suresh" },
          { name: "Lim Mei Ling", mykad: "900818-14-5220", wirerType: "PW3" },
          { name: "Mohd Faizal bin Yusof", mykad: "910722-05-5331", wirerType: "PW2", registeredOkId: "ok-faizal" },
          { name: "Azman bin Rahim", mykad: "830909-12-5443", wirerType: "PW1", registeredOkId: "ok-azman" },
          { name: "Vimala a/p Krishnan", mykad: "920215-08-5688", wirerType: "PW1", registeredOkId: "ok-vimala" },
        ]
      : [
          { name: "Ahmad bin Ismail", mykad: "840512-10-5523", wirerType: "PW4", registeredOkId: "ok-ahmad", personaId: "p-ahmad" },
          { name: "Tan Chee Keong", mykad: "790238-08-6191", wirerType: "PW3", registeredOkId: "ok-tan", personaId: "p-tan" },
          { name: "Chong Wei Liang", mykad: "860318-07-5217", wirerType: "PW1", registeredOkId: "ok-chong" },
          { name: "Siti Aminah binti Osman", mykad: "930627-05-6024", wirerType: "PW2", registeredOkId: "ok-siti-osman" },
          { name: "Ganesan a/l Muthu", mykad: "760213-10-5093", wirerType: "PW1", registeredOkId: "ok-ganesan" },
        ];
  const out: AppointedOk[] = [];
  let i = 0;
  for (const [wirerType, need] of Object.entries(req) as Array<[WirerType, number]>) {
    for (let n = 0; n < need; n++) {
      const src = pool.find((p) => p.wirerType === wirerType && !out.some((o) => o.mykad === p.mykad))
        ?? pool[i % pool.length];
      i++;
      out.push({
        registeredOkId: src.registeredOkId ?? `ok-seed-${cls}-${out.length}`,
        personaId: src.personaId,
        name: src.name,
        mykad: src.mykad,
        wirerType,
        competencyCategory: "PW",
        confirmed: true,
        confirmedAt: iso(baseNow, 14),
      });
    }
  }
  return out;
}

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

  // ── Extra applicants for back-office volume ────────────────────────────────
  // These are NOT login personas, so they add realistic depth to the SOS /
  // Teknikal / Pelulus queues without cluttering the three demo applicants'
  // "Permohonan Saya" lists.
  function profile(fullName: string, ic: string, age: number, city: string, state: string): Application["applicant"] {
    const slug = fullName.toLowerCase().replace(/[^a-z]+/g, ".").replace(/^\.|\.$/g, "");
    return {
      fullName,
      icNumber: ic,
      dob: `${2026 - age}-01-01`,
      age,
      address: `No. ${10 + (ic.charCodeAt(2) % 80)}, Jalan ${city} ${1 + (age % 9)}, ${city}, ${state}`,
      phone: `01${age % 10}-${ic.slice(0, 3)}${ic.slice(7, 11)}`,
      email: `${slug}@email.my`,
    };
  }

  const EXTRA = [
    { id: "p-nurul", p: profile("Nurul Aina binti Rosli", "900314-14-5182", 36, "Ampang", "Selangor") },
    { id: "p-ext-02", p: profile("Sivakumar a/l Rajan", "830722-08-5461", 43, "Ipoh", "Perak") },
    { id: "p-ext-03", p: profile("Mohd Hafiz bin Zulkifli", "870105-03-5237", 39, "Kuantan", "Pahang") },
    { id: "p-ext-04", p: profile("Lee Chong Wei", "810918-07-5119", 45, "Bayan Lepas", "Pulau Pinang") },
    { id: "p-ext-05", p: profile("Siti Aminah binti Osman", "930627-05-6024", 33, "Melaka Tengah", "Melaka") },
    { id: "p-ext-06", p: profile("Ganesan a/l Muthu", "760213-10-5093", 50, "Klang", "Selangor") },
    { id: "p-ext-07", p: profile("Wong Kah Meng", "890430-01-5771", 37, "Johor Bahru", "Johor") },
    { id: "p-ext-08", p: profile("Abdul Rahim bin Salleh", "680809-02-5315", 58, "Alor Setar", "Kedah") },
    { id: "p-ext-09", p: profile("Chan Mei Fong", "920115-14-6248", 34, "Cheras", "Selangor") },
    { id: "p-ext-10", p: profile("Zulkarnain bin Mat Noor", "850526-11-5602", 41, "Kuala Terengganu", "Terengganu") },
    { id: "p-ext-11", p: profile("Prakash a/l Subramaniam", "780304-06-5427", 48, "Seremban", "Negeri Sembilan") },
    { id: "p-ext-12", p: profile("Nor Azlina binti Hamid", "910908-12-5990", 35, "Kota Kinabalu", "Sabah") },
  ];

  const EMPLOYER_IDS = ["emp-tenaga-murni", "emp-elektrik-maju", "emp-kuasa-bistari"];
  const OK_CATS: NonNullable<Spec["competencyCategory"]>[] = ["PW", "PE", "PJ", "PK", "JEK", "JPE"];

  /** Compact builder for the extra volume applications. */
  function mk(
    ref: number,
    status: ApplicationStatus,
    who: number,
    opts: {
      type?: "OK" | "CE";
      cat?: Spec["competencyCategory"];
      cls?: Spec["contractorClass"];
      period?: Spec["period"];
      stageHoursAgo: number;
      createdHoursAgo: number;
      assignee?: string | null;
      identityVerified?: boolean;
    },
  ): Spec {
    const e = EXTRA[who % EXTRA.length];
    const type = opts.type ?? "OK";
    const role: PersonaRole | null =
      status === "sos_review"
        ? type === "CE"
          ? "sos_ce"
          : "sos"
        : status === "technical_review"
          ? type === "CE"
            ? "technical_ce"
            : "technical"
          : status === "pending_approval"
            ? "approver"
            : null;
    const paid: Payment[] = ["awaiting_employer_confirm", "awaiting_processing_payment"].includes(status)
      ? []
      : [paidPayment(baseNow, "processing", type === "OK" ? 50 : 100, opts.createdHoursAgo - 1)];
    if (status === "certificate_issued") paid.push(paidPayment(baseNow, "registration", 300, 1));

    const employerId = EMPLOYER_IDS[who % EMPLOYER_IDS.length];
    const employer = employerById(employerId);
    const ceOwnerPersonaId = employer?.confirmerPersonaId ?? e.id;
    const ceOwner = personaById(ceOwnerPersonaId);
    const ownerPersonaId = type === "CE" ? ceOwnerPersonaId : e.id;
    const ownerApplicant =
      type === "CE" && ceOwner
        ? {
            fullName: ceOwner.name,
            icNumber: ceOwner.icNumber ?? e.p.icNumber,
            dob: e.p.dob,
            age: e.p.age,
            address: employer?.address ?? e.p.address,
            phone: employer?.phone ?? e.p.phone,
            email: ceOwner.email,
          }
        : e.p;

    return {
      ref,
      type,
      status,
      applicantPersonaId: ownerPersonaId,
      applicant: ownerApplicant,
      competencyCategory: type === "OK" ? (opts.cat ?? OK_CATS[who % OK_CATS.length]) : undefined,
      contractorClass: type === "CE" ? (opts.cls ?? "C") : undefined,
      period: opts.period ?? ((1 + (who % 5)) as Spec["period"]),
      employerId,
      assignedRole: role,
      assigneePersonaId: opts.assignee ?? null,
      stageHoursAgo: opts.stageHoursAgo,
      createdHoursAgo: opts.createdHoursAgo,
      documents: docs(baseNow, type === "OK" ? OK_DOCS : CE_DOCS, status === "sos_review" ? "pending" : "accepted"),
      payments: paid,
      appointedOks: type === "CE" ? appointedOksForClass(opts.cls ?? "C", baseNow, employerId) : undefined,
      auditTrail: audit(baseNow, [
        {
          actorPersonaId: ownerPersonaId,
          action: "Menghantar permohonan",
          hoursAgo: opts.createdHoursAgo,
          actorRole: type === "CE" ? "employer" : "applicant",
          actorName: ownerApplicant.fullName,
        },
      ]),
      identityVerified: opts.identityVerified,
    };
  }

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
    // 1b) OK — awaiting employer confirmation (Tan → Rahman / Tenaga Murni).
    // Baharu diterima (2j) — untuk menguji PFD-RG-KE-NA-03 Mengesahkan Pelantikan.
    {
      ref: 111, type: "OK", status: "awaiting_employer_confirm", applicantPersonaId: "p-tan", applicant: tan,
      competencyCategory: "JEK", period: 5, employerId: "emp-tenaga-murni", assignedRole: null,
      stageHoursAgo: 2, createdHoursAgo: 2, documents: docs(baseNow, OK_DOCS),
      payments: [],
      auditTrail: audit(baseNow, [
        { actorPersonaId: "p-tan", action: "Menghantar permohonan", hoursAgo: 2, toStatus: "awaiting_employer_confirm" },
      ]),
    },
    // 1c) OK — awaiting employer confirmation (Ahmad → Rahman), hampir tamat
    // tempoh 14 hari pengesahan majikan (hari ke-12).
    {
      ref: 112, type: "OK", status: "awaiting_employer_confirm", applicantPersonaId: "p-ahmad", applicant: ahmad,
      competencyCategory: "PK", period: 1, employerId: "emp-tenaga-murni", assignedRole: null,
      stageHoursAgo: 288, createdHoursAgo: 288, documents: docs(baseNow, OK_DOCS),
      payments: [],
      auditTrail: audit(baseNow, [
        { actorPersonaId: "p-ahmad", action: "Menghantar permohonan", hoursAgo: 288, toStatus: "awaiting_employer_confirm" },
      ]),
    },
    // 1d) OK — SEDIA BAYAR fi pemprosesan (Ahmad). Log masuk terus → FPX (§4.1b).
    {
      ref: 113, type: "OK", status: "awaiting_processing_payment", applicantPersonaId: "p-ahmad", applicant: ahmad,
      competencyCategory: "PW", period: 3, employerId: "emp-tenaga-murni", assignedRole: null,
      stageHoursAgo: 1, createdHoursAgo: 5, documents: docs(baseNow, OK_DOCS),
      payments: [],
      auditTrail: audit(baseNow, [
        { actorPersonaId: "p-ahmad", action: "Menghantar permohonan", hoursAgo: 5, toStatus: "awaiting_employer_confirm" },
        { actorPersonaId: "p-rahman", action: "Mengesahkan lantikan (KWSP & PERKESO)", hoursAgo: 2, toStatus: "awaiting_processing_payment" },
      ]),
    },
    // 1e) OK — SEDIA BAYAR fi pendaftaran (Tan), selepas kelulusan. → FPX (§4.1f).
    {
      ref: 114, type: "OK", status: "awaiting_registration_payment", applicantPersonaId: "p-tan", applicant: tan,
      competencyCategory: "PE", period: 5, employerId: "emp-kuasa-bistari", assignedRole: null,
      stageHoursAgo: 1, createdHoursAgo: 90, documents: docs(baseNow, OK_DOCS, "accepted"),
      payments: [paidPayment(baseNow, "processing", 50, 80)],
      identityVerified: true,
      auditTrail: audit(baseNow, [
        { actorPersonaId: "p-tan", action: "Menghantar permohonan", hoursAgo: 90 },
        { actorPersonaId: "p-tan", action: "Membayar yuran pemprosesan", hoursAgo: 80 },
        { actorPersonaId: "p-zainab", action: "Meluluskan & menandatangani secara digital", hoursAgo: 1, toStatus: "awaiting_registration_payment" },
      ]),
    },
    // 2) OK — SOS review, GREEN (1h) — unassigned (first visit uses FIFO claim only)
    {
      ref: 103, type: "OK", status: "sos_review", applicantPersonaId: "p-tan", applicant: tan,
      competencyCategory: "PE", period: 5, employerId: "emp-kuasa-bistari", assignedRole: "sos", assigneePersonaId: null,
      stageHoursAgo: 1, createdHoursAgo: 26, documents: docs(baseNow, OK_DOCS),
      payments: [paidPayment(baseNow, "processing", 50, 1.2)],
      auditTrail: audit(baseNow, [
        { actorPersonaId: "p-tan", action: "Menghantar permohonan", hoursAgo: 26 },
        { actorPersonaId: "p-goh", action: "Mengesahkan lantikan", hoursAgo: 22 },
        { actorPersonaId: "p-tan", action: "Membayar yuran pemprosesan", hoursAgo: 1.2, toStatus: "sos_review" },
      ]),
    },
    // 3) OK — SOS review, YELLOW (~3.2h) — exceeds 3h → flagged to TP SOS
    {
      ref: 104, type: "OK", status: "sos_review", applicantPersonaId: "p-tan", applicant: tan,
      competencyCategory: "PW", period: 1, employerId: "emp-kuasa-bistari", assignedRole: "sos", assigneePersonaId: null,
      stageHoursAgo: 3.2, createdHoursAgo: 28, documents: docs(baseNow, OK_DOCS),
      payments: [paidPayment(baseNow, "processing", 50, 3.3)],
      auditTrail: audit(baseNow, [
        { actorPersonaId: "p-tan", action: "Menghantar permohonan", hoursAgo: 28 },
        { actorPersonaId: "p-tan", action: "Membayar yuran pemprosesan", hoursAgo: 3.3, toStatus: "sos_review" },
      ]),
      identityVerified: true,
    },
    // 4) OK — SOS review, RED (6h, overdue) — unassigned (max-3 lock demo)
    {
      ref: 105, type: "OK", status: "sos_review", applicantPersonaId: "p-ahmad", applicant: ahmad,
      competencyCategory: "PK", period: 2, employerId: "emp-tenaga-murni", assignedRole: "sos", assigneePersonaId: null,
      stageHoursAgo: 6, createdHoursAgo: 40, documents: docs(baseNow, OK_DOCS),
      payments: [paidPayment(baseNow, "processing", 50, 6.2)],
      auditTrail: audit(baseNow, [
        { actorPersonaId: "p-ahmad", action: "Menghantar permohonan", hoursAgo: 40 },
        { actorPersonaId: "p-ahmad", action: "Membayar yuran pemprosesan", hoursAgo: 6.2, toStatus: "sos_review" },
      ]),
    },
    // 5) OK — SOS review, GREEN (0.4h) — unassigned (max-3 lock demo)
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
    // 8) OK — pending approval (unassigned — Pelulus claims via FIFO / max-3)
    {
      ref: 109, type: "OK", status: "pending_approval", applicantPersonaId: "p-ahmad", applicant: ahmad,
      competencyCategory: "PE", period: 3, employerId: "emp-tenaga-murni", assignedRole: "approver", assigneePersonaId: null,
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
        categoryGrade: "PW4",
        perakuanNo: "PW-T-4-B-0110-2026",
        icNumber: "840512-10-5523",
        dob: "1984-05-12",
        restrictions: "Voltan Rendah (LV)",
        issuedPlace: "KUALA LUMPUR",
        issuedVia: "ST PORTAL",
        signatoryName: "IR AHMAD FAUZI BIN HASAN",
        signatoryAgency: "Suruhanjaya Tenaga",
        issuedAt: iso(baseNow, 1),
        expiresAt: new Date(baseNow + 5 * 365 * 24 * 3_600_000).toISOString(),
        qrPayload: "https://verify.st.gov.my/cert/ST-OK-2026-00110",
        trustmarkId: "ST-TRUST-00110",
      },
    },
    // 10) CE — SOS review, YELLOW — unassigned (first visit uses FIFO claim only)
    {
      ref: 202, type: "CE", status: "sos_review", applicantPersonaId: "p-lim", applicant: lim,
      contractorClass: "B", period: 2, employerId: "emp-elektrik-maju", assignedRole: "sos_ce", assigneePersonaId: null,
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

    // ── Volume: realistic back-office load ────────────────────────────────
    // Pelulus queue — FIFO + max-3 (D11): a few already claimed for bulk demo; rest unassigned.
    mk(301, "pending_approval", 0, { cat: "PW", stageHoursAgo: 1, createdHoursAgo: 62, assignee: "p-zainab", identityVerified: true }),
    mk(302, "pending_approval", 1, { cat: "PE", stageHoursAgo: 3, createdHoursAgo: 70, assignee: "p-zainab", identityVerified: true }),
    mk(303, "pending_approval", 2, { cat: "PJ", stageHoursAgo: 5, createdHoursAgo: 74, assignee: null, identityVerified: true }),
    mk(304, "pending_approval", 3, { cat: "JEK", stageHoursAgo: 6.5, createdHoursAgo: 80, assignee: null, identityVerified: true }),
    mk(305, "pending_approval", 4, { cat: "PK", stageHoursAgo: 9, createdHoursAgo: 92, assignee: null, identityVerified: true }),
    mk(306, "pending_approval", 5, { type: "CE", cls: "A", stageHoursAgo: 2, createdHoursAgo: 66, assignee: null, identityVerified: true }),

    // Teknikal queue — some already claimed by officer 1 / 2; rest unassigned for FIFO
    // (other officer sees Telah Dituntut — same Peti Tugasan Tindakan as SOS).
    mk(311, "technical_review", 6, { cat: "PW", stageHoursAgo: 4, createdHoursAgo: 40, assignee: "p-kumar", identityVerified: true }),
    mk(312, "technical_review", 7, { cat: "JPE", stageHoursAgo: 14, createdHoursAgo: 52, assignee: "p-chong", identityVerified: true }),
    mk(313, "technical_review", 8, { cat: "PE", stageHoursAgo: 19, createdHoursAgo: 58, assignee: "p-kumar", identityVerified: true }),
    mk(314, "technical_review", 9, { cat: "PJ", stageHoursAgo: 27, createdHoursAgo: 66, assignee: null, identityVerified: true }),
    mk(317, "technical_review", 1, { cat: "PW", stageHoursAgo: 6, createdHoursAgo: 42, assignee: null, identityVerified: true }),
    mk(318, "technical_review", 2, { cat: "JEK", stageHoursAgo: 10, createdHoursAgo: 48, assignee: null, identityVerified: true }),
    mk(315, "technical_review", 10, { type: "CE", cls: "D", stageHoursAgo: 8, createdHoursAgo: 44, assignee: "p-priya", identityVerified: true }),
    mk(316, "technical_review", 11, { type: "CE", cls: "C", stageHoursAgo: 12, createdHoursAgo: 50, assignee: "p-daniel", identityVerified: true }),
    mk(319, "technical_review", 3, { type: "CE", cls: "B", stageHoursAgo: 5, createdHoursAgo: 40, assignee: null, identityVerified: true }),

    // SOS queue — some already claimed by officer 1 / 2; rest unassigned for FIFO.
    mk(321, "sos_review", 11, { cat: "PW", stageHoursAgo: 0.6, createdHoursAgo: 24, assignee: "p-faridah" }),
    mk(322, "sos_review", 0, { cat: "PK", stageHoursAgo: 1.4, createdHoursAgo: 26, assignee: "p-rosli" }),
    mk(323, "sos_review", 1, { cat: "PE", stageHoursAgo: 2.8, createdHoursAgo: 28 }),
    mk(324, "sos_review", 2, { cat: "JEK", stageHoursAgo: 3.6, createdHoursAgo: 30 }),
    mk(325, "sos_review", 3, { cat: "PJ", stageHoursAgo: 5.5, createdHoursAgo: 34 }),
    mk(326, "sos_review", 4, { type: "CE", cls: "B", stageHoursAgo: 7.2, createdHoursAgo: 38, assignee: "p-halim" }),
    mk(327, "sos_review", 5, { type: "CE", cls: "A", stageHoursAgo: 3.1, createdHoursAgo: 36, assignee: "p-siti" }),
    mk(328, "sos_review", 6, { type: "CE", cls: "D", stageHoursAgo: 1.2, createdHoursAgo: 22 }),

    // Menunggu tindakan pemohon / bayaran.
    mk(331, "awaiting_processing_payment", 5, { cat: "PW", stageHoursAgo: 3, createdHoursAgo: 12 }),
    mk(332, "awaiting_processing_payment", 6, { type: "CE", cls: "C", stageHoursAgo: 20, createdHoursAgo: 30 }),
    mk(333, "awaiting_registration_payment", 7, { cat: "PE", stageHoursAgo: 6, createdHoursAgo: 96, identityVerified: true }),
    mk(334, "awaiting_registration_payment", 8, { cat: "PW", stageHoursAgo: 30, createdHoursAgo: 120, identityVerified: true }),
    mk(335, "query_applicant", 9, { cat: "PJ", stageHoursAgo: 18, createdHoursAgo: 48 }),

    // Selesai / terminal — memberi kedalaman pada tab "Selesai" & laporan.
    mk(341, "certificate_issued", 10, { cat: "PW", period: 5, stageHoursAgo: 2, createdHoursAgo: 130, identityVerified: true }),
    mk(342, "certificate_issued", 11, { cat: "JEK", period: 3, stageHoursAgo: 20, createdHoursAgo: 150, identityVerified: true }),
    mk(343, "certificate_issued", 0, { type: "CE", cls: "B", period: 2, stageHoursAgo: 44, createdHoursAgo: 170, identityVerified: true }),
    mk(344, "rejected", 1, { cat: "PK", stageHoursAgo: 8, createdHoursAgo: 100, identityVerified: true }),
    mk(345, "rejected", 2, { type: "CE", cls: "D", stageHoursAgo: 52, createdHoursAgo: 140 }),
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
      contractorKind: s.type === "CE" ? "electrical" : undefined,
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
