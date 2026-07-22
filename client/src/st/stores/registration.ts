import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";

import type { CompetencyCategory, ContractorClass, Gender, RegistrationPeriod } from "../types";
import type { EmployerCategory, PlaceRestriction, VoltageRestriction } from "../registration/ok-rules";
import type {
  AppointedOkForm,
  ContractorKind,
  ContractorVoltage,
  DirectorShareholder,
  ProfessionalEngineer,
  SkilledPerson,
  TestEquipment,
} from "../registration/ce-rules";
import type { RegistrationModuleCode } from "../registration/modules";
import {
  REGISTRATION_APPLICATIONS,
  REGISTERED_ENTITIES,
  type RegistrationAppType,
  type RegistrationApplication,
  type RegisteredEntity,
} from "../mock/registration";
import { employerById } from "../mock/employers";
import {
  createStRegistrationApplication,
  listStRegisteredEntities,
  listStRegistrationApplications,
  mapApplicationDto,
  mapEntityDto,
} from "@/api/st-registration";

const STORAGE_KEY = "st.registration.state.v1";

/** Modules wired to backend in Phase 3 (partial). */
const API_MODULES: RegistrationModuleCode[] = ["RG-KE", "RG-KG", "RG-CE", "RG-CG"];

export interface OkElectricSubmitInput {
  applicantPersonaId: string;
  fullName: string;
  icNumber: string;
  dob: string;
  age: number;
  gender: Gender;
  address: string;
  phone: string;
  email: string;
  certificateNo: string;
  competencyCategory: CompetencyCategory;
  voltageRestriction: VoltageRestriction;
  placeRestriction: PlaceRestriction;
  periodYears: RegistrationPeriod;
  employerCategory: EmployerCategory;
  employerId?: string;
  cdpPoints: number;
  oshRequired: boolean;
  oshUploaded: boolean;
  documents: Array<{ label: string; fileName: string }>;
}

export interface ContractorElectricSubmitInput {
  applicantPersonaId: string;
  /** Stable employer company id (e.g. emp-tenaga-murni) for majikan scoping. */
  employerId?: string;
  representativeName: string;
  representativeIc: string;
  representativeGender: Gender;
  representativePhone: string;
  representativeEmail: string;
  contractorKind: ContractorKind;
  contractorClass?: ContractorClass;
  voltage?: ContractorVoltage;
  periodYears: RegistrationPeriod;
  companyName: string;
  companyRegNo: string;
  companyAddress: string;
  postcode: string;
  city: string;
  state: string;
  companyEmail: string;
  companyPhone: string;
  companyFax: string;
  directors: DirectorShareholder[];
  appointedOks: AppointedOkForm[];
  skilledPersons: SkilledPerson[];
  professionalEngineers: ProfessionalEngineer[];
  equipment: TestEquipment[];
  confirmationChecks: string[];
  documents: Array<{ label: string; fileName: string }>;
  cdpPoints: number;
}

let seq = 500;

function seedOkDetail(a: RegistrationApplication): RegistrationApplication["detail"] {
  return {
    age: 41,
    gender: "male",
    periodYears: 1,
    employerCategory: a.employerName ? "company" : "self_employed",
    certificate: {
      certificateNo: `COMP/${a.categoryOrClass}/2024/${a.id.slice(-3)}`,
      category: a.categoryOrClass as CompetencyCategory,
      voltageRestriction: "lv",
      placeRestriction: "none",
      active: true,
      suspended: false,
    },
    timeline: [
      { at: a.submittedAt, label: "Permohonan dihantar", actor: a.applicantName },
      { at: a.stageEnteredAt, label: `Status: ${a.status}`, actor: a.assignedOfficer ?? "Sistem" },
    ],
  };
}

/**
 * Appointed OK seeds by employer.
 * Ahmad / Tan (demo personas) are reserved for Tenaga Murni CE — ABC uses other pool OKs.
 */
function seedAppointedOks(
  employerId: string | undefined,
  code: string,
  cls: string,
): AppointedOkForm[] {
  type OkSeed = { okId: string; name: string; mykad: string; wirerType: string; certificateNo: string };
  const abcPool: OkSeed[] = [
    { okId: "ok-rizal", name: "Rizal bin Hassan", mykad: "870404-10-5512", wirerType: "PW4", certificateNo: "COMP/PW4/2023/00644" },
    { okId: "ok-suresh", name: "Suresh a/l Maniam", mykad: "880101-14-5099", wirerType: "PW3", certificateNo: "COMP/PW3/2022/01102" },
    { okId: "ok-lim-mei", name: "Lim Mei Ling", mykad: "900818-14-5220", wirerType: "PW3", certificateNo: "COMP/PW3/2024/00721" },
    { okId: "ok-faizal", name: "Mohd Faizal bin Yusof", mykad: "910722-05-5331", wirerType: "PW2", certificateNo: "COMP/PW2/2024/00211" },
    { okId: "ok-azman", name: "Azman bin Rahim", mykad: "830909-12-5443", wirerType: "PW1", certificateNo: "COMP/PW1/2020/00771" },
    { okId: "ok-vimala", name: "Vimala a/p Krishnan", mykad: "920215-08-5688", wirerType: "PW1", certificateNo: "COMP/PW1/2023/00330" },
  ];
  const tenagaPool: OkSeed[] = [
    { okId: "ok-ahmad", name: "Ahmad bin Ismail", mykad: "840512-10-5523", wirerType: "PW4", certificateNo: "COMP/PW4/2024/00821" },
    { okId: "ok-tan", name: "Tan Chee Keong", mykad: "790238-08-6191", wirerType: "PW3", certificateNo: "COMP/PW3/2023/00412" },
    { okId: "ok-siti-osman", name: "Siti Aminah binti Osman", mykad: "930627-05-6024", wirerType: "PW2", certificateNo: "COMP/PW2/2023/00880" },
    { okId: "ok-ganesan", name: "Ganesan a/l Muthu", mykad: "760213-10-5093", wirerType: "PW1", certificateNo: "COMP/PW1/2019/00440" },
  ];
  // PFD-RG-CE-NA-03 demo — Rizal leads Tenaga Murni CE appointment acceptance.
  const tenagaNa03Pool: OkSeed[] = [
    { okId: "ok-rizal", name: "Rizal bin Hassan", mykad: "870404-10-5512", wirerType: "PW4", certificateNo: "COMP/PW4/2023/00644" },
    { okId: "ok-tan", name: "Tan Chee Keong", mykad: "790238-08-6191", wirerType: "PW3", certificateNo: "COMP/PW3/2023/00412" },
  ];
  const needByClass: Record<string, string[]> = {
    A: ["PW4", "PW3", "PW3", "PW1", "PW1"],
    B: ["PW4", "PW3", "PW1"],
    C: ["PW4", "PW3"],
    D: ["PW2"],
  };
  const need = needByClass[cls] ?? ["PW4"];
  const pool =
    code === "rg-ce-10"
      ? tenagaNa03Pool
      : employerId === "emp-abc-elektrik"
        ? abcPool
        : tenagaPool;
  const used = new Set<string>();

  return need.map((wirerType, i) => {
    const src =
      pool.find((p) => p.wirerType === wirerType && !used.has(p.okId)) ??
      pool.find((p) => !used.has(p.okId)) ??
      pool[0];
    used.add(src.okId);
    return {
      okId: `${src.okId}-${code}-${i}`,
      name: src.name,
      mykad: src.mykad,
      wirerType: src.wirerType as AppointedOkForm["wirerType"],
      certificateNo: src.certificateNo,
      periodYears: 1 as AppointedOkForm["periodYears"],
      employedElsewhere: false,
    };
  });
}

/** Prototype CE detail for staff review when seed/API rows lack Bahagian A–F payload. */
function seedCeDetail(a: RegistrationApplication): RegistrationApplication["detail"] {
  const cls = a.categoryOrClass || "C";
  const suffix = a.id.slice(-1) || "5";
  const repByCode: Record<string, string> = {
    "rg-ce-1": "Lim Wei Sheng",
    "rg-ce-2": "Tan Mei Ling",
    "rg-ce-3": "Ravi a/l Kumar",
    "rg-ce-4": "Azman bin Hassan",
    "rg-ce-5": "Rahman bin Abdullah",
    "rg-ce-6": "Ahmad Faizal bin Omar",
    "rg-ce-7": "Ahmad Faizal bin Omar",
    "rg-ce-8": "Ahmad Faizal bin Omar",
    "rg-ce-9": "Ahmad Faizal bin Omar",
    "rg-ce-10": "Rahman bin Abdullah",
  };
  const ownershipByCode: Record<string, { applicantPersonaId: string; employerId: string }> = {
    "rg-ce-1": { applicantPersonaId: "p-lim", employerId: "emp-elektrik-maju" },
    "rg-ce-5": { applicantPersonaId: "p-rahman", employerId: "emp-tenaga-murni" },
    "rg-ce-6": { applicantPersonaId: "p-faizal", employerId: "emp-abc-elektrik" },
    "rg-ce-7": { applicantPersonaId: "p-faizal", employerId: "emp-abc-elektrik" },
    "rg-ce-8": { applicantPersonaId: "p-faizal", employerId: "emp-abc-elektrik" },
    "rg-ce-9": { applicantPersonaId: "p-faizal", employerId: "emp-abc-elektrik" },
    "rg-ce-10": { applicantPersonaId: "p-rahman", employerId: "emp-tenaga-murni" },
  };
  const cityByCode: Record<string, { city: string; postcode: string }> = {
    "rg-ce-1": { city: "Petaling Jaya", postcode: "47810" },
    "rg-ce-2": { city: "Shah Alam", postcode: "40000" },
    "rg-ce-3": { city: "Klang", postcode: "41000" },
    "rg-ce-4": { city: "Subang Jaya", postcode: "47500" },
    "rg-ce-5": { city: "Shah Alam", postcode: "40000" },
    "rg-ce-6": { city: "Subang Jaya", postcode: "47600" },
    "rg-ce-7": { city: "Subang Jaya", postcode: "47600" },
    "rg-ce-8": { city: "Subang Jaya", postcode: "47600" },
    "rg-ce-9": { city: "Subang Jaya", postcode: "47600" },
  };
  const repName = repByCode[a.id] ?? "Farid bin Abdullah";
  const repIc = `8${suffix}0101-10-5${suffix}23`;
  const loc = cityByCode[a.id] ?? { city: "Cyberjaya", postcode: "63000" };
  const slug = a.applicantName.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 12) || "syarikat";
  const employerId = ownershipByCode[a.id]?.employerId ?? a.detail?.employerId;

  return {
    applicantPersonaId: ownershipByCode[a.id]?.applicantPersonaId ?? a.detail?.applicantPersonaId,
    employerId,
    gender: "male",
    phone: `012-345678${suffix}`,
    email: `wakil@${slug}.my`,
    periodYears: 1,
    documents: [
      { label: "Sijil pendaftaran SSM / Borang 9", fileName: "ssm-borang-9.pdf" },
      { label: "Borang 49 / senarai pengarah", fileName: "borang-49.pdf" },
      { label: "Surat lantikan Orang Kompeten", fileName: "surat-lantikan-ok.pdf" },
      { label: "Foto premis / operasi", fileName: "foto-premis.jpg" },
    ],
    timeline: [
      { at: a.submittedAt, label: "Permohonan dihantar", actor: repName },
      { at: a.stageEnteredAt, label: `Status: ${a.status}`, actor: a.assignedOfficer ?? "Sistem" },
    ],
    ce: {
      contractorKind: "electrical",
      contractorClass: cls as ContractorClass,
      voltage: cls === "A" ? "33kV" : "415V",
      representativeName: repName,
      representativeIc: repIc,
      companyName: a.applicantName,
      companyRegNo: a.identityNo,
      companyAddress: `Lot ${suffix}, Jalan Industri 2/${suffix}`,
      postcode: loc.postcode,
      city: loc.city,
      state: "Selangor",
      companyEmail: `info@${slug}.my`,
      companyPhone: `03-8${suffix}45678${suffix}`,
      companyFax: `03-8${suffix}45679${suffix}`,
      directors: [
        {
          id: `dir-${a.id}`,
          name: repName,
          icNumber: repIc,
          address: `No. ${suffix}2, Taman Industri, ${loc.postcode} ${loc.city}, Selangor`,
          sharePercent: 100,
        },
      ],
      appointedOks: seedAppointedOks(employerId, a.id, cls),
      skilledPersons: [],
      professionalEngineers: [],
      equipment: [
        {
          id: `eq-${a.id}-1`,
          equipmentType: "insulation_tester",
          serialNo: `INS-2024-${suffix}01`,
          brand: "fluke",
          model: "1507",
        },
        {
          id: `eq-${a.id}-2`,
          equipmentType: "earth_tester",
          serialNo: `EAR-2024-${suffix}02`,
          brand: "megger",
          model: "DET3TD",
        },
      ],
      confirmationChecks: ["class_ok", "company_ok", "ok_ok", "equip_ok", "docs_ok"],
    },
  };
}

function enrichSeed(apps: RegistrationApplication[]): RegistrationApplication[] {
  return apps.map((a) => {
    if (a.moduleCode === "RG-KE" && !a.detail) {
      return { ...a, detail: seedOkDetail(a) };
    }
    if (a.moduleCode === "RG-CE") {
      const seeded = seedCeDetail(a);
      const existingCe = (a.detail?.ce ?? {}) as Record<string, unknown>;
      // Peti seeds may ship a sparse `ce` object — merge so detail screens are complete.
      const mergedCe = { ...(seeded?.ce as Record<string, unknown>), ...existingCe };
      for (const key of ["directors", "appointedOks", "equipment", "skilledPersons", "professionalEngineers"] as const) {
        const cur = mergedCe[key];
        if (!Array.isArray(cur) || cur.length === 0) {
          mergedCe[key] = (seeded?.ce as Record<string, unknown>)?.[key];
        }
      }
      for (const key of ["voltage", "companyAddress", "postcode", "city", "state", "companyPhone", "companyFax", "companyEmail"] as const) {
        if (!mergedCe[key]) mergedCe[key] = (seeded?.ce as Record<string, unknown>)?.[key];
      }
      return {
        ...a,
        detail: {
          ...seeded,
          ...a.detail,
          documents: a.detail?.documents?.length ? a.detail.documents : seeded?.documents,
          ce: mergedCe,
        },
      };
    }
    return a;
  });
}

function mockFallbackApplications(): RegistrationApplication[] {
  return enrichSeed([...REGISTRATION_APPLICATIONS]);
}

function mockFallbackEntities(): RegisteredEntity[] {
  return [...REGISTERED_ENTITIES];
}

export const useStRegistrationStore = defineStore("st-registration", () => {
  const applications = ref<RegistrationApplication[]>(mockFallbackApplications());
  const entities = ref<RegisteredEntity[]>(mockFallbackEntities());
  const loadedFromApi = ref(false);
  const loading = ref(false);
  const loadError = ref<string | null>(null);

  function applicationsFor(module: RegistrationModuleCode): RegistrationApplication[] {
    return applications.value
      .filter((a) => a.moduleCode === module)
      .sort((a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt));
  }

  function entitiesFor(module: RegistrationModuleCode): RegisteredEntity[] {
    return entities.value.filter((e) => e.moduleCode === module);
  }

  function byId(id: string): RegistrationApplication | undefined {
    return applications.value.find((a) => a.id === id);
  }

  async function fetchFromApi(): Promise<void> {
    loading.value = true;
    loadError.value = null;
    try {
      const [appsRes, entsRes] = await Promise.all([
        listStRegistrationApplications("?limit=200&sort_by=submitted_at&sort_dir=desc"),
        listStRegisteredEntities("?limit=200&sort_by=expires_at&sort_dir=asc"),
      ]);

      const apiApps = (appsRes.data ?? []).map(mapApplicationDto);
      const apiEnts = (entsRes.data ?? []).map(mapEntityDto);

      // Keep mock data for modules not yet seeded (RG-KG / RG-CG).
      const otherApps = mockFallbackApplications().filter((a) => !API_MODULES.includes(a.moduleCode));
      const otherEnts = mockFallbackEntities().filter((e) => !API_MODULES.includes(e.moduleCode));

      applications.value = enrichSeed([...apiApps, ...otherApps]);
      entities.value = [...apiEnts, ...otherEnts];
      loadedFromApi.value = true;
      persist();
    } catch (err) {
      loadError.value = err instanceof Error ? err.message : "Failed to load registration data";
      // Keep mock / localStorage fallback
    } finally {
      loading.value = false;
    }
  }

  async function submitOkElectric(input: OkElectricSubmitInput): Promise<string> {
    const now = new Date().toISOString();
    const employer = input.employerCategory === "company" ? employerById(input.employerId) : undefined;
    const status =
      input.employerCategory === "self_employed" ? "awaiting_processing_payment" : "awaiting_employer_confirm";
    const detail: RegistrationApplication["detail"] = {
      applicantPersonaId: input.applicantPersonaId,
      gender: input.gender,
      dob: input.dob,
      age: input.age,
      address: input.address,
      phone: input.phone,
      email: input.email,
      periodYears: input.periodYears,
      employerCategory: input.employerCategory,
      employerId: input.employerId,
      certificate: {
        certificateNo: input.certificateNo,
        category: input.competencyCategory,
        voltageRestriction: input.voltageRestriction,
        placeRestriction: input.placeRestriction,
        active: true,
        suspended: false,
      },
      oshRequired: input.oshRequired,
      oshUploaded: input.oshUploaded,
      documents: input.documents,
      timeline: [
        { at: now, label: "Permohonan dihantar", actor: input.fullName },
        {
          at: now,
          label:
            input.employerCategory === "self_employed"
              ? "Menunggu bayaran fi pemprosesan"
              : "Menunggu pengesahan majikan",
          actor: "Sistem",
        },
      ],
    };

    try {
      const res = await createStRegistrationApplication({
        moduleCode: "RG-KE",
        appType: "new_registration",
        applicantName: input.fullName,
        identityNo: input.icNumber,
        categoryOrClass: input.competencyCategory,
        status,
        submittedAt: now,
        stageEnteredAt: now,
        slaTargetHours: input.employerCategory === "self_employed" ? 72 : 48,
        employerName: employer?.name ?? (input.employerCategory === "self_employed" ? "Bekerja Sendiri" : undefined),
        cdpPoints: input.cdpPoints,
        feeAmount: 50,
        detail,
      });
      const mapped = mapApplicationDto(res.data);
      applications.value.unshift(mapped);
      persist();
      // Push into Peti / Majikan confirmation inbox (workflow store).
      const { useStWorkflowStore } = await import("./workflow");
      const { mapRegistrationDtoToApplication } = await import("../map-registration-to-application");
      const workflow = useStWorkflowStore();
      await workflow.syncFromApi();
      const peti = mapRegistrationDtoToApplication(res.data);
      if (!workflow.byId(peti.id)) {
        workflow.ingestApplication(peti);
      }
      return mapped.id;
    } catch (err) {
      // Offline / API failure — local fallback (same as Phase 2)
      console.error("submitOkElectric API failed; using local fallback", err);
      const id = `rg-ke-live-${++seq}`;
      const refNo = `ST/RG-KE/2026/${String(400 + applications.value.length).padStart(5, "0")}`;
      const app: RegistrationApplication = {
        id,
        moduleCode: "RG-KE",
        refNo,
        appType: "new_registration",
        applicantName: input.fullName,
        identityNo: input.icNumber,
        categoryOrClass: input.competencyCategory,
        status,
        submittedAt: now,
        stageEnteredAt: now,
        slaTargetHours: input.employerCategory === "self_employed" ? 72 : 48,
        employerName: employer?.name ?? (input.employerCategory === "self_employed" ? "Bekerja Sendiri" : undefined),
        cdpPoints: input.cdpPoints,
        feeAmount: 50,
        detail,
      };
      applications.value.unshift(app);
      persist();
      // Still surface to Majikan inbox in this browser session.
      try {
        const { useStWorkflowStore } = await import("./workflow");
        const { mapRegistrationDtoToApplication } = await import("../map-registration-to-application");
        const workflow = useStWorkflowStore();
        workflow.ingestApplication(
          mapRegistrationDtoToApplication({
            id: 0,
            code: app.id,
            moduleCode: app.moduleCode,
            refNo: app.refNo,
            appType: app.appType,
            applicantName: app.applicantName,
            identityNo: app.identityNo,
            categoryOrClass: app.categoryOrClass,
            status: app.status,
            submittedAt: app.submittedAt,
            stageEnteredAt: app.stageEnteredAt,
            slaTargetHours: app.slaTargetHours,
            employerName: app.employerName ?? null,
            cdpPoints: app.cdpPoints ?? null,
            feeAmount: app.feeAmount ?? null,
            detail: app.detail ?? null,
          }),
        );
      } catch {
        /* ignore */
      }
      return id;
    }
  }

  async function submitContractorElectric(input: ContractorElectricSubmitInput): Promise<string> {
    const now = new Date().toISOString();
    const classOrKind = input.contractorClass ?? input.contractorKind.toUpperCase();
    const detail: RegistrationApplication["detail"] = {
      applicantPersonaId: input.applicantPersonaId,
      employerId: input.employerId,
      gender: input.representativeGender,
      phone: input.representativePhone,
      email: input.representativeEmail,
      periodYears: input.periodYears,
      documents: input.documents,
      timeline: [
        { at: now, label: "Permohonan dihantar", actor: input.representativeName },
        { at: now, label: "Menunggu pengesahan pelantikan OK", actor: "Sistem" },
      ],
      ce: {
        contractorKind: input.contractorKind,
        contractorClass: input.contractorClass,
        voltage: input.voltage,
        representativeName: input.representativeName,
        representativeIc: input.representativeIc,
        companyName: input.companyName,
        companyRegNo: input.companyRegNo,
        companyAddress: input.companyAddress,
        postcode: input.postcode,
        city: input.city,
        state: input.state,
        companyEmail: input.companyEmail,
        companyPhone: input.companyPhone,
        companyFax: input.companyFax,
        directors: input.directors,
        appointedOks: input.appointedOks,
        skilledPersons: input.skilledPersons,
        professionalEngineers: input.professionalEngineers,
        equipment: input.equipment,
        confirmationChecks: input.confirmationChecks,
      },
    };

    try {
      const res = await createStRegistrationApplication({
        moduleCode: "RG-CE",
        appType: "new_registration",
        applicantName: input.companyName,
        identityNo: input.companyRegNo,
        categoryOrClass: String(classOrKind),
        status: "awaiting_employer_confirm",
        submittedAt: now,
        stageEnteredAt: now,
        slaTargetHours: 48,
        employerName: input.companyName,
        cdpPoints: input.cdpPoints,
        feeAmount: 200,
        note: `${input.appointedOks.length} OK dilantik · menunggu pengesahan`,
        detail,
      });
      const mapped = mapApplicationDto(res.data);
      applications.value.unshift(mapped);
      persist();
      return mapped.id;
    } catch {
      const id = `rg-ce-live-${++seq}`;
      const refNo = `ST/RG-CE/2026/${String(500 + applications.value.length).padStart(5, "0")}`;
      const app: RegistrationApplication = {
        id,
        moduleCode: "RG-CE",
        refNo,
        appType: "new_registration",
        applicantName: input.companyName,
        identityNo: input.companyRegNo,
        categoryOrClass: String(classOrKind),
        status: "awaiting_employer_confirm",
        submittedAt: now,
        stageEnteredAt: now,
        slaTargetHours: 48,
        employerName: input.companyName,
        cdpPoints: input.cdpPoints,
        feeAmount: 200,
        note: `${input.appointedOks.length} OK dilantik · menunggu pengesahan`,
        detail,
      };
      applications.value.unshift(app);
      persist();
      return id;
    }
  }

  const forCurrentModule = computed(() => applicationsFor);

  function persist() {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ applications: applications.value }));
  }

  function initFromLocalStorage() {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { applications?: RegistrationApplication[] };
      if (parsed.applications?.length) {
        applications.value = enrichSeed(parsed.applications);
      }
    } catch {
      /* ignore corrupt cache */
    }
  }

  watch(applications, persist, { deep: true });
  initFromLocalStorage();

  // Hydrate RG-KE / RG-CE from API when the store is first used in the browser.
  if (typeof window !== "undefined") {
    void fetchFromApi();
  }

  return {
    applications,
    entities,
    loadedFromApi,
    loading,
    loadError,
    applicationsFor,
    entitiesFor,
    byId,
    fetchFromApi,
    submitOkElectric,
    submitContractorElectric,
    forCurrentModule,
  };
});

export type { RegistrationAppType };
