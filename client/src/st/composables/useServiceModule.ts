import { computed } from "vue";
import { useRoute } from "vue-router";

import { useLocale } from "@/composables/useLocale";
import type { StMessageKey } from "@/i18n/st-messages";
import {
  SERVICE_MODULES,
  isServiceModuleCode,
  type ServiceModuleCode,
  type ServiceModuleDef,
  type ServiceScreen,
} from "../modules/catalog";

export function useServiceModule() {
  const route = useRoute();
  const { locale, ts } = useLocale();

  const code = computed<ServiceModuleCode | null>(() => {
    const meta = route.meta.moduleCode;
    return isServiceModuleCode(meta) ? meta : null;
  });

  const def = computed<ServiceModuleDef | null>(() => {
    return code.value ? SERVICE_MODULES[code.value] : null;
  });

  const screen = computed<ServiceScreen>(() => {
    return (route.meta.serviceScreen as ServiceScreen) || "applications";
  });

  const title = computed(() => {
    if (!code.value) return "";
    return ts(`st.mod.${code.value}` as StMessageKey);
  });

  const actRef = computed(() => {
    if (!def.value) return "";
    return locale.value === "bi" ? def.value.actRef.bi : def.value.actRef.bm;
  });

  const processTypes = computed(() => {
    if (!def.value) return [];
    return def.value.processTypes.map((p) => (locale.value === "bi" ? p.bi : p.bm));
  });

  const screenTitle = computed(() => {
    const map: Record<ServiceScreen, StMessageKey> = {
      applications: "st.reg.applications",
      review: "st.reg.review",
      compliance: "st.reg.compliance",
      reports: "st.reg.reports",
    };
    return ts(map[screen.value]);
  });

  return { code, def, screen, title, actRef, processTypes, screenTitle, ts, locale };
}
