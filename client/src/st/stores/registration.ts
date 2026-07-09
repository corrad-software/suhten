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
const API_MODULES: RegistrationModuleCode[] = ["RG-KE", "RG-CE"];

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

function enrichSeed(apps: RegistrationApplication[]): RegistrationApplication[] {
  return apps.map((a) => {
    if (a.detail) return a;
    if (a.moduleCode !== "RG-KE") return a;
    return {
      ...a,
      detail: {
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
      },
    };
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

      applications.value = [...apiApps, ...otherApps];
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
      return mapped.id;
    } catch {
      // Offline / API failure — local fallback (same as Phase 2)
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
      return id;
    }
  }

  async function submitContractorElectric(input: ContractorElectricSubmitInput): Promise<string> {
    const now = new Date().toISOString();
    const classOrKind = input.contractorClass ?? input.contractorKind.toUpperCase();
    const detail: RegistrationApplication["detail"] = {
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
        applications.value = parsed.applications;
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
