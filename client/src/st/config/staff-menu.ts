import type { Component } from "vue";
import {
  BadgeDollarSign,
  Bell,
  BookOpen,
  Building2,
  ClipboardCheck,
  FileSearch,
  FileText,
  Flame,
  Gauge,
  Gavel,
  GraduationCap,
  Inbox,
  Landmark,
  MessageSquare,
  Search,
  Settings,
  Shield,
  UserCog,
  Users,
  Wrench,
  Zap,
} from "lucide-vue-next";

import type { PersonaRole } from "../types";

/**
 * Sistem Digital ST — Kakitangan menu (Phase 1).
 * Derived from SRS §3 (17 modules), §6 (standard screens), Appendix G.
 * Route prefix: /st/*
 */

export type StaffMenuNode = {
  id: string;
  label: string;
  to: string;
  moduleCode?: string;
  phase?: 1 | 2;
  /** When set, item is visible only to these persona roles. */
  roles?: PersonaRole[];
  children?: StaffMenuNode[];
};

export type StaffMenuItemDef = StaffMenuNode & {
  icon: Component;
};

export type StaffMenuGroup = {
  id: string;
  label: string;
  roles?: PersonaRole[];
  items: StaffMenuItemDef[];
};

/** Back-office roles that use the Kakitangan portal (excludes public applicants). */
export const KAKITANGAN_ROLES: PersonaRole[] = [
  "sos",
  "technical",
  "approver",
  "committee",
  "admin",
];

const OFFICER_ROLES: PersonaRole[] = ["sos", "technical", "approver", "committee", "admin"];
const ADMIN_ONLY: PersonaRole[] = ["admin"];

function moduleChildren(basePath: string, prefix: string): StaffMenuNode[] {
  return [
    { id: `${prefix}-applications`, label: "Permohonan", to: `${basePath}/applications` },
    {
      id: `${prefix}-review`,
      label: "Semakan & Kelulusan",
      to: `${basePath}/review`,
      roles: OFFICER_ROLES,
    },
    { id: `${prefix}-compliance`, label: "Pemantauan & Pematuhan", to: `${basePath}/compliance` },
    { id: `${prefix}-reports`, label: "Laporan Modul", to: `${basePath}/reports` },
  ];
}

function serviceModule(
  id: string,
  label: string,
  to: string,
  icon: Component,
  moduleCode: string,
  phase: 1 | 2,
  prefix: string,
): StaffMenuItemDef {
  return {
    id,
    label,
    to,
    icon,
    moduleCode,
    phase,
    children: moduleChildren(to, prefix),
  };
}

/** Full Kakitangan menu tree (before role filtering). */
export const STAFF_MENU: StaffMenuGroup[] = [
  {
    id: "utama",
    label: "",
    items: [
      { id: "dashboard", label: "Papan Pemuka", to: "/st/dashboard", icon: Gauge },
      {
        id: "inbox",
        label: "Peti Tugasan",
        to: "/st/inbox",
        icon: Inbox,
        roles: OFFICER_ROLES,
      },
      { id: "notifications", label: "Notifikasi", to: "/st/notifications", icon: Bell },
      { id: "search", label: "Carian & Semakan Status", to: "/st/search", icon: Search },
      { id: "aina", label: "AINA — User", to: "/st/aina", icon: MessageSquare },
    ],
  },
  {
    id: "pelesenan",
    label: "Pelesenan & Pepasangan",
    items: [
      serviceModule("lc-le", "Pelesenan Elektrik", "/st/licensing/electric", Zap, "LC-LE", 1, "lc-le"),
      serviceModule("lc-pe", "Pepasangan Elektrik", "/st/licensing/installation-electric", Wrench, "LC-PE", 1, "lc-pe"),
      serviceModule("lc-lg", "Pelesenan Gas", "/st/licensing/gas", Flame, "LC-LG", 1, "lc-lg"),
      serviceModule("lc-pg", "Pepasangan Gas", "/st/licensing/installation-gas", Building2, "LC-PG", 1, "lc-pg"),
    ],
  },
  {
    id: "pendaftaran",
    label: "Pendaftaran",
    items: [
      serviceModule("rg-ke", "OK Elektrik", "/st/registration/ok-electric", UserCog, "RG-KE", 1, "rg-ke"),
      serviceModule("rg-kg", "OK Gas", "/st/registration/ok-gas", UserCog, "RG-KG", 1, "rg-kg"),
      serviceModule("rg-ce", "Kontraktor Elektrik", "/st/registration/contractor-electric", Building2, "RG-CE", 1, "rg-ce"),
      serviceModule("rg-cg", "Kontraktor Gas", "/st/registration/contractor-gas", Building2, "RG-CG", 1, "rg-cg"),
    ],
  },
  {
    id: "operasi",
    label: "Operasi & Perkhidmatan",
    items: [
      {
        id: "pe-id",
        label: "Pengurusan ID & Akaun",
        to: "/st/operations/identity",
        icon: Users,
        moduleCode: "PE-ID",
        phase: 1,
        roles: [...OFFICER_ROLES],
        children: [
          { id: "pe-id-users", label: "Pengguna Awam", to: "/st/operations/identity/public-users" },
          { id: "pe-id-staff", label: "Kakitangan ST", to: "/st/operations/identity/staff", roles: ADMIN_ONLY },
          { id: "pe-id-orgs", label: "Entiti Perniagaan", to: "/st/operations/identity/organisations" },
          { id: "pe-id-access", label: "Pengurusan Akses", to: "/st/operations/identity/access", roles: ADMIN_ONLY },
        ],
      },
      {
        id: "pe-rv",
        label: "Pengurusan Hasil",
        to: "/st/operations/revenue",
        icon: BadgeDollarSign,
        moduleCode: "PE-RV",
        phase: 1,
        children: [
          { id: "pe-rv-payments", label: "Bayaran & Resit", to: "/st/operations/revenue/payments" },
          { id: "pe-rv-reconciliation", label: "Rekonsiliasi Hasil", to: "/st/operations/revenue/reconciliation", roles: OFFICER_ROLES },
          { id: "pe-rv-reports", label: "Laporan Hasil", to: "/st/operations/revenue/reports" },
        ],
      },
      {
        id: "pe-sv",
        label: "Lawatan Tapak / Pemeriksaan",
        to: "/st/operations/site-visits",
        icon: ClipboardCheck,
        moduleCode: "PE-SV",
        phase: 1,
        roles: OFFICER_ROLES,
        children: [
          { id: "pe-sv-schedule", label: "Penjadualan", to: "/st/operations/site-visits/schedule" },
          { id: "pe-sv-inspections", label: "Pemeriksaan & Audit", to: "/st/operations/site-visits/inspections" },
          { id: "pe-sv-reports", label: "Laporan Lawatan", to: "/st/operations/site-visits/reports" },
        ],
      },
      {
        id: "pe-jk",
        label: "Kelulusan Jawatankuasa",
        to: "/st/operations/committee",
        icon: Landmark,
        moduleCode: "PE-JK",
        phase: 1,
        roles: ["approver", "committee", "admin"],
        children: [
          { id: "pe-jk-queue", label: "Senarai Kelulusan JK", to: "/st/operations/committee/queue" },
          { id: "pe-jk-minutes", label: "Minit & Keputusan", to: "/st/operations/committee/decisions" },
        ],
      },
    ],
  },
  {
    id: "pensijilan",
    label: "Pensijilan & Kompetensi",
    items: [
      serviceModule("cc-xe", "Peperiksaan Elektrik", "/st/certification/exam-electric", GraduationCap, "CC-XE", 2, "cc-xe"),
      serviceModule("cc-xg", "Peperiksaan Gas", "/st/certification/exam-gas", GraduationCap, "CC-XG", 2, "cc-xg"),
      serviceModule("cc-cd", "Pembangunan Berterusan (CPD)", "/st/certification/cpd", BookOpen, "CC-CD", 2, "cc-cd"),
    ],
  },
  {
    id: "penguatkuasaan",
    label: "Kecekapan & Penguatkuasaan",
    items: [
      serviceModule("ee-kt", "Kecekapan Tenaga", "/st/enforcement/energy-efficiency", Zap, "EE-KT", 2, "ee-kt"),
      serviceModule("en-iv", "Penguatkuasaan & Penyiasatan", "/st/enforcement/investigation", Gavel, "EN-IV", 2, "en-iv"),
    ],
  },
  {
    id: "pelaporan",
    label: "Pelaporan & Analitik",
    items: [
      {
        id: "reports-operations",
        label: "Laporan Operasi",
        to: "/st/reports/operations",
        icon: FileText,
        children: [
          { id: "reports-airr", label: "Statistik AIRR", to: "/st/reports/airr" },
          { id: "reports-sla", label: "Piagam Pelanggan (SLA)", to: "/st/reports/sla" },
          { id: "reports-export", label: "Eksport Data", to: "/st/reports/export", roles: OFFICER_ROLES },
        ],
      },
      {
        id: "reports-audit",
        label: "Jejak Audit Transaksi",
        to: "/st/reports/audit-trail",
        icon: FileSearch,
        roles: OFFICER_ROLES,
      },
    ],
  },
  {
    id: "pentadbiran",
    label: "Pentadbiran Sistem",
    roles: ADMIN_ONLY,
    items: [
      {
        id: "admin-config",
        label: "Konfigurasi Modul",
        to: "/st/admin/configuration",
        icon: Settings,
        roles: ADMIN_ONLY,
        children: [
          { id: "admin-ref-tables", label: "Jadual Rujukan", to: "/st/admin/configuration/reference-tables" },
          { id: "admin-fees", label: "Fi & Hari Bayaran", to: "/st/admin/configuration/fees" },
          { id: "admin-notifications", label: "Templat Notifikasi", to: "/st/admin/configuration/notifications" },
          { id: "admin-workflow", label: "Aliran Kerja & LOA", to: "/st/admin/configuration/workflow" },
        ],
      },
      {
        id: "admin-rbac",
        label: "Peranan & Kebenaran",
        to: "/st/admin/rbac",
        icon: Shield,
        roles: ADMIN_ONLY,
        children: [
          { id: "admin-roles", label: "Peranan (RBAC)", to: "/st/admin/rbac/roles" },
          { id: "admin-permissions", label: "Kebenaran Modul", to: "/st/admin/rbac/permissions" },
        ],
      },
      {
        id: "admin-system",
        label: "Pemantauan Sistem",
        to: "/st/admin/system",
        icon: Gauge,
        roles: ADMIN_ONLY,
        children: [
          { id: "admin-audit", label: "Audit Trail", to: "/st/admin/system/audit" },
          { id: "admin-integrations", label: "Integrasi Luaran", to: "/st/admin/system/integrations" },
        ],
      },
    ],
  },
];

function roleAllowed(node: { roles?: PersonaRole[] }, role: PersonaRole): boolean {
  if (!node.roles || node.roles.length === 0) return true;
  return node.roles.includes(role);
}

function filterNodes(nodes: StaffMenuNode[], role: PersonaRole): StaffMenuNode[] {
  return nodes
    .filter((n) => roleAllowed(n, role))
    .map((n) => ({
      ...n,
      children: n.children ? filterNodes(n.children, role) : undefined,
    }))
    .filter((n) => !n.children || n.children.length > 0);
}

/** Returns the Kakitangan sidebar menu filtered for the active persona role. */
export function staffMenuFor(role: PersonaRole): StaffMenuGroup[] {
  const groups: StaffMenuGroup[] = [];

  for (const group of STAFF_MENU) {
    if (group.roles && !roleAllowed(group, role)) continue;

    const items = group.items
      .filter((item) => roleAllowed(item, role))
      .map((item) => ({
        ...item,
        children: item.children ? filterNodes(item.children, role) : undefined,
      }))
      .filter((item) => !item.children || item.children.length > 0);

    if (items.length > 0) {
      groups.push({ ...group, items });
    }
  }

  return groups;
}

/** Flatten all leaf routes from the staff menu (for Phase 1 placeholder routing). */
export function staffMenuLeafRoutes(): Array<{ path: string; title: string; moduleCode?: string; phase?: 1 | 2 }> {
  const leaves: Array<{ path: string; title: string; moduleCode?: string; phase?: 1 | 2 }> = [];

  function walk(nodes: StaffMenuNode[]) {
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        walk(node.children);
      } else {
        leaves.push({
          path: node.to.replace(/^\/st\//, ""),
          title: node.label,
          moduleCode: node.moduleCode,
          phase: node.phase,
        });
      }
    }
  }

  for (const group of STAFF_MENU) {
    for (const item of group.items) {
      if (item.children && item.children.length > 0) {
        walk(item.children);
      } else {
        leaves.push({
          path: item.to.replace(/^\/st\//, ""),
          title: item.label,
          moduleCode: item.moduleCode,
          phase: item.phase,
        });
      }
    }
  }

  return leaves;
}
