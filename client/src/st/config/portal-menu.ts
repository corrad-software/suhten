import type { Component } from "vue";
import { Bell, Building2, FilePlus2, FileText, Gauge, ShieldCheck, UserCog } from "lucide-vue-next";

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
          // Pemohon: Orang Kompeten (RG-KE) only — Kontraktor Elektrik is Majikan.
          { id: "new", label: "Permohonan Baharu", shortLabel: "Baharu", to: "/st/registration/ok-electric/applications/new", icon: FilePlus2 },
          NOTIFICATIONS,
          { id: "profile", label: "Profil Saya", shortLabel: "Profil", to: "/st/profil", icon: UserCog },
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
          {
            id: "ce-applications",
            label: "Permohonan Kontraktor",
            shortLabel: "Kontraktor",
            to: "/st/registration/contractor-electric/applications",
            icon: FileText,
          },
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
