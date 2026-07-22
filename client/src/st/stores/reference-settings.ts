import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";

import type { ApplicationStatus, CompetencyCategory, RegistrationPeriod } from "../types";
import { competencyMeta } from "../mock/competencies";
import { maxPeriodForAge as defaultMaxPeriod, allowedPeriods as defaultAllowedPeriods } from "../registration/ok-rules";

const STORAGE_KEY = "st.reference-settings.v4";

/** D11 PFD-RG-KE-NA-01 point 7 — age band → max registration years. */
export type PeriodBandRow = {
  id: string;
  /** Matches D11 table groups. */
  categoryGroup: "pendawai_pj_pk" | "jurutera_penyelia";
  ageMin: number;
  /** null = no upper bound */
  ageMax: number | null;
  maxPeriodYears: RegistrationPeriod;
  active: boolean;
};

/** Point 7 — per-category application requirements. */
export type RequirementRow = {
  id: string;
  moduleCode: string;
  category: CompetencyCategory;
  maxAge: number;
  requireActiveCertificate: boolean;
  allowSelfEmployed: boolean;
  oshAtOrAboveMaxAge: boolean;
  active: boolean;
};

/** Point 8 — document types for upload. */
export type DocumentTypeRow = {
  id: string;
  moduleCode: string;
  code: string;
  labelBm: string;
  labelBi: string;
  required: boolean;
  /** Hide when employer is self-employed (e.g. employment letter). */
  skipIfSelfEmployed: boolean;
  sortOrder: number;
  active: boolean;
};

/** Point 9a — payment days per application / fee kind. */
export type PaymentDaysRow = {
  id: string;
  moduleCode: string;
  feeKind: "processing" | "registration";
  paymentDays: number;
  active: boolean;
};

/** Point 9b — reminder notification days. */
export type ReminderDaysRow = {
  id: string;
  moduleCode: string;
  eventCode: string;
  eventLabelBm: string;
  eventLabelBi: string;
  reminderDays: number;
  active: boolean;
};

/** Point 9c — notification text. */
export type NotificationTextRow = {
  id: string;
  code: string;
  channel: string;
  subjectBm: string;
  subjectBi: string;
  bodyBm: string;
  bodyBi: string;
  active: boolean;
};

/** Point 9d — application status catalogue. */
export type AppStatusRow = {
  id: string;
  code: ApplicationStatus;
  labelBm: string;
  labelBi: string;
  sortOrder: number;
  active: boolean;
};

export type ReferenceSettingsState = {
  requirements: RequirementRow[];
  periodBands: PeriodBandRow[];
  documentTypes: DocumentTypeRow[];
  paymentDays: PaymentDaysRow[];
  reminderDays: ReminderDaysRow[];
  notificationTexts: NotificationTextRow[];
  appStatuses: AppStatusRow[];
};

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function seedState(): ReferenceSettingsState {
  const requirements: RequirementRow[] = (
    [
      ["JPE", 75, true],
      ["JEK", 75, true],
      ["PE", 75, true],
      ["PJ", 65, false],
      ["PW", 65, false],
      ["PK", 65, false],
    ] as Array<[CompetencyCategory, number, boolean]>
  ).map(([category, maxAge, allowSelfEmployed]) => ({
    id: `req-${category}`,
    moduleCode: "RG-KE",
    category,
    maxAge,
    requireActiveCertificate: true,
    allowSelfEmployed,
    oshAtOrAboveMaxAge: true,
    active: true,
  }));

  const periodBands: PeriodBandRow[] = [
    // Pendawai, Penjaga Jentera, Pencantum Kabel (had umur 65)
    { id: "pb-w-65", categoryGroup: "pendawai_pj_pk", ageMin: 65, ageMax: null, maxPeriodYears: 1, active: true },
    { id: "pb-w-64", categoryGroup: "pendawai_pj_pk", ageMin: 64, ageMax: 64, maxPeriodYears: 1, active: true },
    { id: "pb-w-63", categoryGroup: "pendawai_pj_pk", ageMin: 63, ageMax: 63, maxPeriodYears: 2, active: true },
    { id: "pb-w-62", categoryGroup: "pendawai_pj_pk", ageMin: 62, ageMax: 62, maxPeriodYears: 3, active: true },
    { id: "pb-w-61", categoryGroup: "pendawai_pj_pk", ageMin: 61, ageMax: 61, maxPeriodYears: 4, active: true },
    { id: "pb-w-60", categoryGroup: "pendawai_pj_pk", ageMin: 0, ageMax: 60, maxPeriodYears: 5, active: true },
    // Jurutera & Penyelia (had umur 75)
    { id: "pb-e-75", categoryGroup: "jurutera_penyelia", ageMin: 75, ageMax: null, maxPeriodYears: 1, active: true },
    { id: "pb-e-74", categoryGroup: "jurutera_penyelia", ageMin: 74, ageMax: 74, maxPeriodYears: 1, active: true },
    { id: "pb-e-73", categoryGroup: "jurutera_penyelia", ageMin: 73, ageMax: 73, maxPeriodYears: 2, active: true },
    { id: "pb-e-72", categoryGroup: "jurutera_penyelia", ageMin: 72, ageMax: 72, maxPeriodYears: 3, active: true },
    { id: "pb-e-71", categoryGroup: "jurutera_penyelia", ageMin: 71, ageMax: 71, maxPeriodYears: 4, active: true },
    { id: "pb-e-70", categoryGroup: "jurutera_penyelia", ageMin: 0, ageMax: 70, maxPeriodYears: 5, active: true },
  ];

  const documentTypes: DocumentTypeRow[] = [
    {
      id: "doc-mykad",
      moduleCode: "RG-KE",
      code: "MYKAD",
      labelBm: "Salinan Kad Pengenalan",
      labelBi: "Copy of MyKad",
      required: true,
      skipIfSelfEmployed: false,
      sortOrder: 1,
      active: true,
    },
    {
      id: "doc-comp",
      moduleCode: "RG-KE",
      code: "COMP_CERT",
      labelBm: "Salinan perakuan kekompetenan",
      labelBi: "Competency certificate copy",
      required: true,
      skipIfSelfEmployed: false,
      sortOrder: 2,
      active: true,
    },
    {
      id: "doc-photo",
      moduleCode: "RG-KE",
      code: "PASSPORT_PHOTO",
      labelBm: "Gambar berukuran pasport",
      labelBi: "Passport photograph",
      required: true,
      skipIfSelfEmployed: false,
      sortOrder: 3,
      active: true,
    },
    {
      id: "doc-offer",
      moduleCode: "RG-KE",
      code: "EMPLOYMENT_LETTER",
      labelBm: "Surat tawaran pekerjaan",
      labelBi: "Letter of employment",
      required: true,
      skipIfSelfEmployed: true,
      sortOrder: 4,
      active: true,
    },
    {
      id: "doc-osh",
      moduleCode: "RG-KE",
      code: "OSH_REPORT",
      labelBm: "Laporan OSH",
      labelBi: "OSH medical report",
      required: false,
      skipIfSelfEmployed: false,
      sortOrder: 5,
      active: true,
    },
    // RG-CE — D11 PFD-RG-CE-NA-01 explicit supporting documents only
    {
      id: "doc-ce-premise",
      moduleCode: "RG-CE",
      code: "PREMISE_TENANCY",
      labelBm: "Perjanjian sewa atau jual beli pejabat",
      labelBi: "Office tenancy or sale agreement",
      required: true,
      skipIfSelfEmployed: false,
      sortOrder: 1,
      active: true,
    },
    {
      id: "doc-ce-licence",
      moduleCode: "RG-CE",
      code: "BUSINESS_LICENCE",
      labelBm: "Lesen perniagaan daripada Pihak Berkuasa Tempatan (PBT)",
      labelBi: "Local authority (PBT) business licence",
      required: true,
      skipIfSelfEmployed: false,
      sortOrder: 2,
      active: true,
    },
    {
      id: "doc-ce-annual",
      moduleCode: "RG-CE",
      code: "ANNUAL_RETURN",
      labelBm: "Salinan laporan annual return terkini (disahkan setiausaha syarikat) atau Perakuan Pendaftaran",
      labelBi: "Latest annual return (company secretary certified) or Certificate of Registration",
      required: true,
      skipIfSelfEmployed: false,
      sortOrder: 3,
      active: true,
    },
    {
      id: "doc-ce-socso",
      moduleCode: "RG-CE",
      code: "SOCSO_8A",
      labelBm: "Perlindungan insurans syarikat & kakitangan (SOCSO) — Borang 8A 3 bulan terkini + resit",
      labelBi: "Company & staff insurance (SOCSO) — Form 8A last 3 months + receipts",
      required: true,
      skipIfSelfEmployed: false,
      sortOrder: 4,
      active: true,
    },
    {
      id: "doc-ce-workshop",
      moduleCode: "RG-CE",
      code: "WORKSHOP_TENANCY",
      labelBm: "Perjanjian sewa atau jual beli bengkel (jika alamat pejabat berbeza)",
      labelBi: "Workshop tenancy or sale agreement (if office address differs)",
      required: false,
      skipIfSelfEmployed: false,
      sortOrder: 5,
      active: true,
    },
  ];

  const paymentDays: PaymentDaysRow[] = [
    { id: "pay-ke-proc", moduleCode: "RG-KE", feeKind: "processing", paymentDays: 14, active: true },
    { id: "pay-ke-reg", moduleCode: "RG-KE", feeKind: "registration", paymentDays: 14, active: true },
    { id: "pay-ce-proc", moduleCode: "RG-CE", feeKind: "processing", paymentDays: 14, active: true },
    { id: "pay-ce-reg", moduleCode: "RG-CE", feeKind: "registration", paymentDays: 14, active: true },
  ];

  const reminderDays: ReminderDaysRow[] = [
    {
      id: "rem-pay",
      moduleCode: "RG-KE",
      eventCode: "PAYMENT_DUE",
      eventLabelBm: "Peringatan bayaran",
      eventLabelBi: "Payment reminder",
      reminderDays: 3,
      active: true,
    },
    {
      id: "rem-emp",
      moduleCode: "RG-KE",
      eventCode: "EMPLOYER_CONFIRM",
      eventLabelBm: "Peringatan pengesahan majikan",
      eventLabelBi: "Employer confirmation reminder",
      reminderDays: 7,
      active: true,
    },
    {
      id: "rem-draft",
      moduleCode: "RG-KE",
      eventCode: "DRAFT_EXPIRY",
      eventLabelBm: "Amaran draf akan dihapus",
      eventLabelBi: "Draft expiry warning",
      reminderDays: 7,
      active: true,
    },
  ];

  const notificationTexts: NotificationTextRow[] = [
    {
      id: "nt-submit",
      code: "APP_SUBMITTED",
      channel: "Email+SMS",
      subjectBm: "Permohonan dihantar",
      subjectBi: "Application submitted",
      bodyBm: "Permohonan anda telah dihantar kepada majikan untuk pengesahan.",
      bodyBi: "Your application has been sent to the employer for confirmation.",
      active: true,
    },
    {
      id: "nt-query",
      code: "QUERY_ISSUED",
      channel: "Email",
      subjectBm: "Kuiri kepada pemohon",
      subjectBi: "Query to applicant",
      bodyBm: "Terdapat pertanyaan berkaitan permohonan anda. Sila log masuk untuk tindakan.",
      bodyBi: "There is a query on your application. Please log in to respond.",
      active: true,
    },
    {
      id: "nt-pay",
      code: "PAYMENT_DUE",
      channel: "Email+SMS",
      subjectBm: "Peringatan bayaran",
      subjectBi: "Payment reminder",
      bodyBm: "Sila buat bayaran dalam tempoh yang ditetapkan. Resit akan dijana selepas bayaran berjaya.",
      bodyBi: "Please make payment within the stipulated period. A receipt will be issued after successful payment.",
      active: true,
    },
    {
      id: "nt-cert",
      code: "CERT_ISSUED",
      channel: "Email",
      subjectBm: "Sijil dikeluarkan",
      subjectBi: "Certificate issued",
      bodyBm: "Perakuan Digital Pendaftaran Orang Kompeten telah dikeluarkan. Anda boleh memuat turunnya dari Inbox.",
      bodyBi: "Your Competent Person Digital Certificate has been issued. You may download it from the Inbox.",
      active: true,
    },
  ];

  const appStatuses: AppStatusRow[] = [
    { id: "st-draft", code: "draft", labelBm: "Draf", labelBi: "Draft", sortOrder: 1, active: true },
    {
      id: "st-emp",
      code: "awaiting_employer_confirm",
      labelBm: "Menunggu Pengesahan Lantikan",
      labelBi: "Awaiting appointment confirmation",
      sortOrder: 2,
      active: true,
    },
    {
      id: "st-final",
      code: "awaiting_final_submit",
      labelBm: "Menunggu Penghantaran Permohonan",
      labelBi: "Awaiting final application submit",
      sortOrder: 3,
      active: true,
    },
    {
      id: "st-proc",
      code: "awaiting_processing_payment",
      labelBm: "Menunggu Bayaran Pemprosesan",
      labelBi: "Awaiting processing payment",
      sortOrder: 4,
      active: true,
    },
    { id: "st-sos", code: "sos_review", labelBm: "Semakan SOS", labelBi: "SOS review", sortOrder: 5, active: true },
    {
      id: "st-qry",
      code: "query_applicant",
      labelBm: "Pertanyaan Pemohon",
      labelBi: "Applicant query",
      sortOrder: 6,
      active: true,
    },
    {
      id: "st-tech",
      code: "technical_review",
      labelBm: "Semakan Teknikal",
      labelBi: "Technical review",
      sortOrder: 7,
      active: true,
    },
    {
      id: "st-apr",
      code: "pending_approval",
      labelBm: "Menunggu Kelulusan",
      labelBi: "Pending approval",
      sortOrder: 8,
      active: true,
    },
    {
      id: "st-reg",
      code: "awaiting_registration_payment",
      labelBm: "Menunggu Bayaran Pendaftaran",
      labelBi: "Awaiting registration payment",
      sortOrder: 9,
      active: true,
    },
    {
      id: "st-cert",
      code: "certificate_issued",
      labelBm: "Sijil Dikeluarkan",
      labelBi: "Certificate issued",
      sortOrder: 10,
      active: true,
    },
    { id: "st-rej", code: "rejected", labelBm: "Ditolak", labelBi: "Rejected", sortOrder: 11, active: true },
    { id: "st-wd", code: "withdrawn", labelBm: "Ditarik Balik", labelBi: "Withdrawn", sortOrder: 12, active: true },
  ];

  return {
    requirements,
    periodBands,
    documentTypes,
    paymentDays,
    reminderDays,
    notificationTexts,
    appStatuses,
  };
}

function loadState(): ReferenceSettingsState {
  if (typeof window === "undefined") return seedState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw) as Partial<ReferenceSettingsState>;
    const seed = seedState();
    // Always refresh RG-CE document types from D11 seed so Tetapan stays aligned.
    const storedDocs = parsed.documentTypes ?? [];
    const ceSeed = seed.documentTypes.filter((d) => d.moduleCode === "RG-CE");
    const nonCeStored = storedDocs.filter((d) => d.moduleCode !== "RG-CE");
    const documentTypes =
      nonCeStored.length > 0 ? [...nonCeStored, ...ceSeed] : seed.documentTypes;

    return {
      requirements: parsed.requirements?.length ? parsed.requirements : seed.requirements,
      periodBands: parsed.periodBands?.length ? parsed.periodBands : seed.periodBands,
      documentTypes,
      paymentDays: parsed.paymentDays?.length ? parsed.paymentDays : seed.paymentDays,
      reminderDays: parsed.reminderDays?.length ? parsed.reminderDays : seed.reminderDays,
      notificationTexts: parsed.notificationTexts?.length ? parsed.notificationTexts : seed.notificationTexts,
      appStatuses: parsed.appStatuses?.length ? parsed.appStatuses : seed.appStatuses,
    };
  } catch {
    return seedState();
  }
}

function categoryGroupFor(category: CompetencyCategory): PeriodBandRow["categoryGroup"] {
  const meta = competencyMeta(category);
  return meta.maxAge >= 75 ? "jurutera_penyelia" : "pendawai_pj_pk";
}

export const useStReferenceSettingsStore = defineStore("st-reference-settings", () => {
  const state = ref<ReferenceSettingsState>(loadState());

  watch(
    state,
    (v) => {
      if (typeof window === "undefined") return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
    },
    { deep: true },
  );

  const requirements = computed(() => state.value.requirements);
  const periodBands = computed(() => state.value.periodBands);
  const documentTypes = computed(() => state.value.documentTypes);
  const paymentDays = computed(() => state.value.paymentDays);
  const reminderDays = computed(() => state.value.reminderDays);
  const notificationTexts = computed(() => state.value.notificationTexts);
  const appStatuses = computed(() => state.value.appStatuses);

  function persistPatch(partial: Partial<ReferenceSettingsState>) {
    state.value = { ...state.value, ...partial };
  }

  function resetToDefaults() {
    state.value = seedState();
  }

  function maxPeriodForAge(age: number, category: CompetencyCategory): RegistrationPeriod {
    const group = categoryGroupFor(category);
    const bands = state.value.periodBands.filter((b) => b.active && b.categoryGroup === group);
    const match = bands.find((b) => age >= b.ageMin && (b.ageMax === null || age <= b.ageMax));
    if (match) return match.maxPeriodYears;
    return defaultMaxPeriod(age, category);
  }

  function allowedPeriods(age: number, category: CompetencyCategory): RegistrationPeriod[] {
    const max = maxPeriodForAge(age, category);
    if (!state.value.periodBands.some((b) => b.active)) {
      return defaultAllowedPeriods(age, category);
    }
    return ([1, 2, 3, 4, 5] as RegistrationPeriod[]).filter((p) => p <= max);
  }

  function documentLabels(moduleCode: string, locale: "bm" | "bi", selfEmployed: boolean): string[] {
    return documentRows(moduleCode, selfEmployed).map((d) => {
      const base = locale === "bi" ? d.labelBi : d.labelBm;
      if (d.required) return base;
      return locale === "bi" ? `${base} (optional)` : `${base} (pilihan)`;
    });
  }

  function requiredDocumentLabels(moduleCode: string, locale: "bm" | "bi", selfEmployed = false): string[] {
    return documentRows(moduleCode, selfEmployed)
      .filter((d) => d.required)
      .map((d) => (locale === "bi" ? d.labelBi : d.labelBm));
  }

  function documentRows(moduleCode: string, selfEmployed: boolean) {
    return state.value.documentTypes
      .filter(
        (d) =>
          d.active &&
          d.moduleCode === moduleCode &&
          !(selfEmployed && d.skipIfSelfEmployed) &&
          d.code !== "OSH_REPORT",
      )
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  /** Replace all RG-CE document types with the D11 CE-NA-01 seed list. */
  function resetCeDocumentsToD11() {
    const seedCe = seedState().documentTypes.filter((d) => d.moduleCode === "RG-CE");
    state.value.documentTypes = [
      ...state.value.documentTypes.filter((d) => d.moduleCode !== "RG-CE"),
      ...seedCe,
    ];
  }

  function addRequirement() {
    const row: RequirementRow = {
      id: uid("req"),
      moduleCode: "RG-KE",
      category: "PW",
      maxAge: 65,
      requireActiveCertificate: true,
      allowSelfEmployed: false,
      oshAtOrAboveMaxAge: true,
      active: true,
    };
    state.value.requirements = [...state.value.requirements, row];
  }

  function removeRequirement(id: string) {
    state.value.requirements = state.value.requirements.filter((r) => r.id !== id);
  }

  function addPeriodBand() {
    const row: PeriodBandRow = {
      id: uid("pb"),
      categoryGroup: "pendawai_pj_pk",
      ageMin: 60,
      ageMax: 60,
      maxPeriodYears: 5,
      active: true,
    };
    state.value.periodBands = [...state.value.periodBands, row];
  }

  function removePeriodBand(id: string) {
    state.value.periodBands = state.value.periodBands.filter((r) => r.id !== id);
  }

  function addDocumentType() {
    const row: DocumentTypeRow = {
      id: uid("doc"),
      moduleCode: "RG-KE",
      code: "NEW_DOC",
      labelBm: "Dokumen baharu",
      labelBi: "New document",
      required: true,
      skipIfSelfEmployed: false,
      sortOrder: state.value.documentTypes.length + 1,
      active: true,
    };
    state.value.documentTypes = [...state.value.documentTypes, row];
  }

  function removeDocumentType(id: string) {
    state.value.documentTypes = state.value.documentTypes.filter((r) => r.id !== id);
  }

  function addPaymentDays() {
    const row: PaymentDaysRow = {
      id: uid("pay"),
      moduleCode: "RG-KE",
      feeKind: "processing",
      paymentDays: 14,
      active: true,
    };
    state.value.paymentDays = [...state.value.paymentDays, row];
  }

  function removePaymentDays(id: string) {
    state.value.paymentDays = state.value.paymentDays.filter((r) => r.id !== id);
  }

  function addReminderDays() {
    const row: ReminderDaysRow = {
      id: uid("rem"),
      moduleCode: "RG-KE",
      eventCode: "CUSTOM",
      eventLabelBm: "Peringatan baharu",
      eventLabelBi: "New reminder",
      reminderDays: 3,
      active: true,
    };
    state.value.reminderDays = [...state.value.reminderDays, row];
  }

  function removeReminderDays(id: string) {
    state.value.reminderDays = state.value.reminderDays.filter((r) => r.id !== id);
  }

  function addNotificationText() {
    const row: NotificationTextRow = {
      id: uid("nt"),
      code: "CUSTOM",
      channel: "Email",
      subjectBm: "Subjek",
      subjectBi: "Subject",
      bodyBm: "Teks notifikasi…",
      bodyBi: "Notification text…",
      active: true,
    };
    state.value.notificationTexts = [...state.value.notificationTexts, row];
  }

  function removeNotificationText(id: string) {
    state.value.notificationTexts = state.value.notificationTexts.filter((r) => r.id !== id);
  }

  function addAppStatus() {
    const row: AppStatusRow = {
      id: uid("st"),
      code: "draft",
      labelBm: "Status baharu",
      labelBi: "New status",
      sortOrder: state.value.appStatuses.length + 1,
      active: true,
    };
    state.value.appStatuses = [...state.value.appStatuses, row];
  }

  function removeAppStatus(id: string) {
    state.value.appStatuses = state.value.appStatuses.filter((r) => r.id !== id);
  }

  return {
    requirements,
    periodBands,
    documentTypes,
    paymentDays,
    reminderDays,
    notificationTexts,
    appStatuses,
    persistPatch,
    resetToDefaults,
    resetCeDocumentsToD11,
    maxPeriodForAge,
    allowedPeriods,
    documentLabels,
    requiredDocumentLabels,
    documentRows,
    addRequirement,
    removeRequirement,
    addPeriodBand,
    removePeriodBand,
    addDocumentType,
    removeDocumentType,
    addPaymentDays,
    removePaymentDays,
    addReminderDays,
    removeReminderDays,
    addNotificationText,
    removeNotificationText,
    addAppStatus,
    removeAppStatus,
  };
});
