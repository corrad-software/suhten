import type { Component } from "vue";
import {
  BadgeDollarSign,
  BookOpen,
  Building2,
  ClipboardCheck,
  FileSearch,
  FileText,
  Flame,
  Gauge,
  Gavel,
  GraduationCap,
  Landmark,
  Settings,
  Shield,
  Users,
  Wrench,
  Zap,
} from "lucide-vue-next";

/** Non-registration ST modules that share the workspace page pattern. */
export type ServiceModuleCode =
  | "LC-LE"
  | "LC-PE"
  | "LC-LG"
  | "LC-PG"
  | "CC-XE"
  | "CC-XG"
  | "CC-CD"
  | "EE-KT"
  | "EN-IV";

export type OpsModuleCode = "PE-ID" | "PE-RV" | "PE-SV" | "PE-JK";

export type AnalyticsScreen =
  | "reports-airr"
  | "reports-sla"
  | "reports-export"
  | "reports-audit";

export type AdminScreen =
  | "admin-ref-tables"
  | "admin-fees"
  | "admin-notifications"
  | "admin-workflow"
  | "admin-roles"
  | "admin-permissions"
  | "admin-audit"
  | "admin-integrations";

export type ServiceScreen = "applications" | "review" | "compliance" | "reports";

export type OpsScreen =
  | "public-users"
  | "staff"
  | "organisations"
  | "access"
  | "payments"
  | "reconciliation"
  | "revenue-reports"
  | "schedule"
  | "inspections"
  | "visit-reports"
  | "queue"
  | "decisions";

export interface ServiceModuleDef {
  code: ServiceModuleCode;
  basePath: string;
  icon: Component;
  phase: 1 | 2;
  domain: "licensing" | "installation" | "certification" | "enforcement";
  energy?: "electric" | "gas" | "both";
  actRef: { bm: string; bi: string };
  processTypes: { bm: string; bi: string }[];
}

export interface OpsModuleDef {
  code: OpsModuleCode;
  basePath: string;
  icon: Component;
  phase: 1;
  actRef: { bm: string; bi: string };
}

export const SERVICE_MODULES: Record<ServiceModuleCode, ServiceModuleDef> = {
  "LC-LE": {
    code: "LC-LE",
    basePath: "/st/licensing/electric",
    icon: Zap,
    phase: 1,
    domain: "licensing",
    energy: "electric",
    actRef: {
      bm: "Akta Bekalan Elektrik 1990 (Akta 447) — Pelesenan",
      bi: "Electricity Supply Act 1990 (Act 447) — Licensing",
    },
    processTypes: [
      { bm: "Lesen baharu", bi: "New licence" },
      { bm: "Pembaharuan", bi: "Renewal" },
      { bm: "Pindaan syarat", bi: "Condition amendment" },
      { bm: "Pembatalan", bi: "Cancellation" },
    ],
  },
  "LC-PE": {
    code: "LC-PE",
    basePath: "/st/licensing/installation-electric",
    icon: Wrench,
    phase: 1,
    domain: "installation",
    energy: "electric",
    actRef: {
      bm: "Akta Bekalan Elektrik 1990 — Pepasangan Elektrik",
      bi: "Electricity Supply Act 1990 — Electrical Installation",
    },
    processTypes: [
      { bm: "Kelulusan pepasangan", bi: "Installation approval" },
      { bm: "Pemeriksaan siap", bi: "Completion inspection" },
      { bm: "Pindaan pepasangan", bi: "Installation amendment" },
    ],
  },
  "LC-LG": {
    code: "LC-LG",
    basePath: "/st/licensing/gas",
    icon: Flame,
    phase: 1,
    domain: "licensing",
    energy: "gas",
    actRef: {
      bm: "Akta Bekalan Gas 1993 (Akta 501) — Pelesenan",
      bi: "Gas Supply Act 1993 (Act 501) — Licensing",
    },
    processTypes: [
      { bm: "Lesen baharu", bi: "New licence" },
      { bm: "Pembaharuan", bi: "Renewal" },
      { bm: "Pindaan syarat", bi: "Condition amendment" },
    ],
  },
  "LC-PG": {
    code: "LC-PG",
    basePath: "/st/licensing/installation-gas",
    icon: Building2,
    phase: 1,
    domain: "installation",
    energy: "gas",
    actRef: {
      bm: "Akta Bekalan Gas 1993 — Pepasangan Gas",
      bi: "Gas Supply Act 1993 — Gas Installation",
    },
    processTypes: [
      { bm: "Kelulusan pepasangan", bi: "Installation approval" },
      { bm: "Pemeriksaan siap", bi: "Completion inspection" },
      { bm: "Pindaan pepasangan", bi: "Installation amendment" },
    ],
  },
  "CC-XE": {
    code: "CC-XE",
    basePath: "/st/certification/exam-electric",
    icon: GraduationCap,
    phase: 2,
    domain: "certification",
    energy: "electric",
    actRef: {
      bm: "Peperiksaan kekompetenan elektrik — ST",
      bi: "Electrical competency examination — ST",
    },
    processTypes: [
      { bm: "Pendaftaran peperiksaan", bi: "Exam registration" },
      { bm: "Jadual peperiksaan", bi: "Exam scheduling" },
      { bm: "Keputusan & sijil", bi: "Results & certificate" },
    ],
  },
  "CC-XG": {
    code: "CC-XG",
    basePath: "/st/certification/exam-gas",
    icon: GraduationCap,
    phase: 2,
    domain: "certification",
    energy: "gas",
    actRef: {
      bm: "Peperiksaan kekompetenan gas — ST",
      bi: "Gas competency examination — ST",
    },
    processTypes: [
      { bm: "Pendaftaran peperiksaan", bi: "Exam registration" },
      { bm: "Jadual peperiksaan", bi: "Exam scheduling" },
      { bm: "Keputusan & sijil", bi: "Results & certificate" },
    ],
  },
  "CC-CD": {
    code: "CC-CD",
    basePath: "/st/certification/cpd",
    icon: BookOpen,
    phase: 2,
    domain: "certification",
    energy: "both",
    actRef: {
      bm: "Pembangunan profesional berterusan (CPD/CDP)",
      bi: "Continuing professional development (CPD/CDP)",
    },
    processTypes: [
      { bm: "Tuntut mata CPD", bi: "Claim CPD points" },
      { bm: "Kelulusan program", bi: "Programme approval" },
      { bm: "Laporan mata", bi: "Points report" },
    ],
  },
  "EE-KT": {
    code: "EE-KT",
    basePath: "/st/enforcement/energy-efficiency",
    icon: Zap,
    phase: 2,
    domain: "enforcement",
    energy: "both",
    actRef: {
      bm: "Kecekapan tenaga — pematuhan & pelaporan",
      bi: "Energy efficiency — compliance & reporting",
    },
    processTypes: [
      { bm: "Laporan kecekapan", bi: "Efficiency report" },
      { bm: "Audit kecekapan", bi: "Efficiency audit" },
      { bm: "Notis pematuhan", bi: "Compliance notice" },
    ],
  },
  "EN-IV": {
    code: "EN-IV",
    basePath: "/st/enforcement/investigation",
    icon: Gavel,
    phase: 2,
    domain: "enforcement",
    energy: "both",
    actRef: {
      bm: "Penguatkuasaan & penyiasatan — ST",
      bi: "Enforcement & investigation — ST",
    },
    processTypes: [
      { bm: "Aduan / kes baharu", bi: "New complaint / case" },
      { bm: "Siasatan lapangan", bi: "Field investigation" },
      { bm: "Tindakan penguatkuasaan", bi: "Enforcement action" },
    ],
  },
};

export const OPS_MODULES: Record<OpsModuleCode, OpsModuleDef> = {
  "PE-ID": {
    code: "PE-ID",
    basePath: "/st/operations/identity",
    icon: Users,
    phase: 1,
    actRef: {
      bm: "Pengurusan identiti & akaun Sistem Digital ST",
      bi: "ST Digital identity & account management",
    },
  },
  "PE-RV": {
    code: "PE-RV",
    basePath: "/st/operations/revenue",
    icon: BadgeDollarSign,
    phase: 1,
    actRef: {
      bm: "Pengurusan hasil, bayaran FPX & resit",
      bi: "Revenue management, FPX payments & receipts",
    },
  },
  "PE-SV": {
    code: "PE-SV",
    basePath: "/st/operations/site-visits",
    icon: ClipboardCheck,
    phase: 1,
    actRef: {
      bm: "Lawatan tapak / pemeriksaan teknikal",
      bi: "Site visits / technical inspections",
    },
  },
  "PE-JK": {
    code: "PE-JK",
    basePath: "/st/operations/committee",
    icon: Landmark,
    phase: 1,
    actRef: {
      bm: "Kelulusan jawatankuasa (JK)",
      bi: "Committee (JK) approvals",
    },
  },
};

export const ANALYTICS_SCREENS: Record<
  AnalyticsScreen,
  { path: string; icon: Component; titleKey: string }
> = {
  "reports-airr": { path: "reports/airr", icon: FileText, titleKey: "st.ws.airr" },
  "reports-sla": { path: "reports/sla", icon: Gauge, titleKey: "st.ws.sla" },
  "reports-export": { path: "reports/export", icon: FileText, titleKey: "st.ws.export" },
  "reports-audit": { path: "reports/audit-trail", icon: FileSearch, titleKey: "st.ws.auditTrail" },
};

export const ADMIN_SCREENS: Record<
  AdminScreen,
  { path: string; icon: Component; titleKey: string }
> = {
  "admin-ref-tables": {
    path: "admin/configuration/reference-tables",
    icon: Settings,
    titleKey: "st.ws.adminRef",
  },
  "admin-fees": { path: "admin/configuration/fees", icon: BadgeDollarSign, titleKey: "st.ws.adminFees" },
  "admin-notifications": {
    path: "admin/configuration/notifications",
    icon: Settings,
    titleKey: "st.ws.adminNotif",
  },
  "admin-workflow": {
    path: "admin/configuration/workflow",
    icon: Settings,
    titleKey: "st.ws.adminWorkflow",
  },
  "admin-roles": { path: "admin/rbac/roles", icon: Shield, titleKey: "st.ws.adminRoles" },
  "admin-permissions": {
    path: "admin/rbac/permissions",
    icon: Shield,
    titleKey: "st.ws.adminPerms",
  },
  "admin-audit": { path: "admin/system/audit", icon: FileSearch, titleKey: "st.ws.adminAudit" },
  "admin-integrations": {
    path: "admin/system/integrations",
    icon: Gauge,
    titleKey: "st.ws.adminIntegrations",
  },
};

export function isServiceModuleCode(code: unknown): code is ServiceModuleCode {
  return typeof code === "string" && code in SERVICE_MODULES;
}

export function isOpsModuleCode(code: unknown): code is OpsModuleCode {
  return typeof code === "string" && code in OPS_MODULES;
}

/** Paths that get real workspace pages (relative to /st/). */
export function workspaceImplementedPaths(): string[] {
  const paths: string[] = [];

  for (const mod of Object.values(SERVICE_MODULES)) {
    const rel = mod.basePath.replace(/^\/st\//, "");
    for (const screen of ["applications", "review", "compliance", "reports"] as const) {
      paths.push(`${rel}/${screen}`);
    }
  }

  const opsLeaves: Array<[OpsModuleCode, string]> = [
    ["PE-ID", "public-users"],
    ["PE-ID", "staff"],
    ["PE-ID", "organisations"],
    ["PE-ID", "access"],
    ["PE-RV", "payments"],
    ["PE-RV", "reconciliation"],
    ["PE-RV", "reports"],
    ["PE-SV", "schedule"],
    ["PE-SV", "inspections"],
    ["PE-SV", "reports"],
    ["PE-JK", "queue"],
    ["PE-JK", "decisions"],
  ];
  for (const [code, leaf] of opsLeaves) {
    const rel = OPS_MODULES[code].basePath.replace(/^\/st\//, "");
    paths.push(`${rel}/${leaf}`);
  }

  for (const s of Object.values(ANALYTICS_SCREENS)) paths.push(s.path);
  for (const s of Object.values(ADMIN_SCREENS)) paths.push(s.path);

  return paths;
}
