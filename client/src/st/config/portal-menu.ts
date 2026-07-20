import type { Component } from "vue";
import { Bell, Building2, FilePlus2, FileText, Gauge, ShieldCheck } from "lucide-vue-next";

import type { PersonaRole } from "../types";
import { KAKITANGAN_ROLES, staffMenuFor } from "./staff-menu";

export interface PortalMenuItem {
  id: string;
  label: string;
  /** Short label for the mobile bottom navigation bar. */
  shortLabel?: string;
  to: string;
  icon: Component;
  phase?: 1 | 2;
  children?: PortalMenuItem[];
}

export interface PortalMenuGroup {
  id: string;
  label: string;
  items: PortalMenuItem[];
}

const DASHBOARD: PortalMenuItem = { id: "dashboard", label: "Papan Pemuka", shortLabel: "Utama", to: "/st/dashboard", icon: Gauge };
const NOTIFICATIONS: PortalMenuItem = { id: "notifications", label: "Notifikasi", shortLabel: "Notifikasi", to: "/st/notifications", icon: Bell };

/** Public portal menu for external users (Pemohon / Majikan). */
function publicMenuFor(role: PersonaRole): PortalMenuGroup[] {
  if (role === "applicant") {
    return [
      {
        id: "main",
        label: "",
        items: [
          DASHBOARD,
          { id: "applications", label: "Permohonan Saya", shortLabel: "Permohonan", to: "/st/applications", icon: FileText },
          { id: "new", label: "Permohonan Baharu", shortLabel: "Baharu", to: "/st/applications/new", icon: FilePlus2 },
          NOTIFICATIONS,
        ],
      },
    ];
  }

  if (role === "employer") {
    return [
      {
        id: "main",
        label: "",
        items: [
          DASHBOARD,
          { id: "applications", label: "Pengesahan Lantikan", shortLabel: "Lantikan", to: "/st/applications", icon: ShieldCheck },
          { id: "employer-profile", label: "Maklumat Majikan", shortLabel: "Majikan", to: "/st/majikan/profil", icon: Building2 },
          NOTIFICATIONS,
        ],
      },
    ];
  }

  return [];
}

export function isKakitanganRole(role: PersonaRole | null): boolean {
  return role !== null && KAKITANGAN_ROLES.includes(role);
}

/**
 * Returns the sidebar menu for the active persona.
 * Kakitangan (Officer/Staff/Admin) use the SRS-based staff menu; public users keep the awam menu.
 */
export function portalMenuFor(role: PersonaRole | null) {
  if (!role) return [];
  if (isKakitanganRole(role)) return staffMenuFor(role);
  return publicMenuFor(role);
}
