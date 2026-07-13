import type { Component } from "vue";
import { Building2, UserCog } from "lucide-vue-next";

/** Registration module codes under Pendaftaran (Appendix G). */
export type RegistrationModuleCode = "RG-KE" | "RG-KG" | "RG-CE" | "RG-CG";

export type RegistrationDomain = "ok" | "contractor";
export type RegistrationEnergy = "electric" | "gas";

export interface RegistrationModuleDef {
  code: RegistrationModuleCode;
  domain: RegistrationDomain;
  energy: RegistrationEnergy;
  basePath: string;
  icon: Component;
  /** Menu id prefix used by i18n menu-labels (without st-). */
  menuId: string;
  actRef: { bm: string; bi: string };
}

export const REGISTRATION_MODULES: Record<RegistrationModuleCode, RegistrationModuleDef> = {
  "RG-KE": {
    code: "RG-KE",
    domain: "ok",
    energy: "electric",
    basePath: "/st/registration/ok-electric",
    icon: UserCog,
    menuId: "rg-ke",
    actRef: {
      bm: "Akta Bekalan Elektrik 1990 (Akta 447)",
      bi: "Electricity Supply Act 1990 (Act 447)",
    },
  },
  "RG-KG": {
    code: "RG-KG",
    domain: "ok",
    energy: "gas",
    basePath: "/st/registration/ok-gas",
    icon: UserCog,
    menuId: "rg-kg",
    actRef: {
      bm: "Akta Bekalan Gas 1993 (Akta 501)",
      bi: "Gas Supply Act 1993 (Act 501)",
    },
  },
  "RG-CE": {
    code: "RG-CE",
    domain: "contractor",
    energy: "electric",
    basePath: "/st/registration/contractor-electric",
    icon: Building2,
    menuId: "rg-ce",
    actRef: {
      bm: "Peraturan-Peraturan Elektrik 1994 (P.75–79)",
      bi: "Electricity Regulations 1994 (R.75–79)",
    },
  },
  "RG-CG": {
    code: "RG-CG",
    domain: "contractor",
    energy: "gas",
    basePath: "/st/registration/contractor-gas",
    icon: Building2,
    menuId: "rg-cg",
    actRef: {
      bm: "Peraturan-Peraturan Bekalan Gas 1997",
      bi: "Gas Supply Regulations 1997",
    },
  },
};

/** Map route path segment → module code. */
export function moduleFromPath(path: string): RegistrationModuleCode | null {
  if (path.includes("ok-electric")) return "RG-KE";
  if (path.includes("ok-gas")) return "RG-KG";
  if (path.includes("contractor-electric")) return "RG-CE";
  if (path.includes("contractor-gas")) return "RG-CG";
  return null;
}

export function moduleFromRouteMeta(moduleCode: unknown): RegistrationModuleCode | null {
  if (typeof moduleCode === "string" && moduleCode in REGISTRATION_MODULES) {
    return moduleCode as RegistrationModuleCode;
  }
  return null;
}
