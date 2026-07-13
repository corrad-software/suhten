import { computed } from "vue";
import { useRoute } from "vue-router";

import { useLocale } from "@/composables/useLocale";
import type { StMessageKey } from "@/i18n/st-messages";
import {
  REGISTRATION_MODULES,
  moduleFromPath,
  moduleFromRouteMeta,
  type RegistrationModuleCode,
  type RegistrationModuleDef,
} from "../registration/modules";
import type { RegistrationAppType } from "../mock/registration";

const OK_PROCESS: RegistrationAppType[] = [
  "new_registration",
  "employer_registration",
  "renewal",
  "termination",
  "multi_employer",
  "enforcement_cancellation",
];

const CONTRACTOR_PROCESS: RegistrationAppType[] = [
  "new_registration",
  "renewal",
  "ok_appointment",
  "ok_termination",
  "class_change",
  "enforcement_cancellation",
];

const OK_DOCS_BM = [
  "Salinan Kad Pengenalan",
  "Sijil / Perakuan Kekompetenan yang sah",
  "Surat tawaran / pengesahan majikan",
  "Gambar berukuran pasport",
];
const OK_DOCS_BI = [
  "Copy of MyKad",
  "Valid competency certificate",
  "Employer offer / confirmation letter",
  "Passport-sized photograph",
];
const CE_DOCS_BM = [
  "Sijil pendaftaran SSM / Borang 9 & 49",
  "Senarai Orang Kompeten dilantik",
  "Penyata kewangan terkini",
  "Surat lantikan pengarah / wakil",
];
const CE_DOCS_BI = [
  "SSM registration / Forms 9 & 49",
  "List of appointed Competent Persons",
  "Latest financial statement",
  "Director / representative appointment letter",
];

export function useRegistrationModule() {
  const route = useRoute();
  const { locale, ts, ml } = useLocale();

  const code = computed<RegistrationModuleCode | null>(() => {
    return moduleFromRouteMeta(route.meta.moduleCode) ?? moduleFromPath(route.path);
  });

  const def = computed<RegistrationModuleDef | null>(() => {
    return code.value ? REGISTRATION_MODULES[code.value] : null;
  });

  const title = computed(() => {
    if (!code.value) return "";
    return ts(`st.mod.${code.value}` as StMessageKey);
  });

  const menuTitle = computed(() => {
    if (!def.value) return title.value;
    return ml(def.value.menuId, title.value);
  });

  const subtitle = computed(() => {
    if (!def.value) return "";
    return def.value.domain === "ok" ? ts("st.reg.subtitleOk") : ts("st.reg.subtitleContractor");
  });

  const actRef = computed(() => {
    if (!def.value) return "";
    return locale.value === "bi" ? def.value.actRef.bi : def.value.actRef.bm;
  });

  const processTypes = computed<RegistrationAppType[]>(() => {
    if (!def.value) return [];
    if (def.value.domain === "ok") {
      return def.value.code === "RG-KG"
        ? OK_PROCESS.filter((t) => t !== "multi_employer")
        : OK_PROCESS;
    }
    return CONTRACTOR_PROCESS;
  });

  const docChecklist = computed(() => {
    if (!def.value) return [];
    const isOk = def.value.domain === "ok";
    if (locale.value === "bi") return isOk ? OK_DOCS_BI : CE_DOCS_BI;
    return isOk ? OK_DOCS_BM : CE_DOCS_BM;
  });

  const eligibility = computed(() => {
    if (!def.value) return [];
    if (locale.value === "bi") {
      return def.value.domain === "ok"
        ? [
            "Registered ST Digital account",
            "Valid & active competency certificate",
            "Age eligibility check",
            "Sufficient CDP points (renewal)",
          ]
        : [
            "Registered company / representative account",
            "Active Competent Persons meeting class minimum",
            "Sufficient CDP points (renewal)",
            "Online OK acceptance of appointment",
          ];
    }
    return def.value.domain === "ok"
      ? [
          "Akaun Sistem Digital ST berdaftar",
          "Perakuan kekompetenan sah & aktif",
          "Semakan kelayakan umur",
          "Mata CDP mencukupi (pembaharuan)",
        ]
      : [
          "Akaun syarikat / wakil berdaftar",
          "Orang Kompeten aktif memenuhi syarat kelas",
          "Mata CDP mencukupi (pembaharuan)",
          "Penerimaan pelantikan OK secara atas talian",
        ];
  });

  return {
    code,
    def,
    title,
    menuTitle,
    subtitle,
    actRef,
    processTypes,
    docChecklist,
    eligibility,
    ts,
    locale,
  };
}

export function appTypeLabel(type: RegistrationAppType, ts: (k: StMessageKey) => string): string {
  return ts(`st.appType.${type}` as StMessageKey);
}
