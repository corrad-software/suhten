import type { Component } from "vue";
import { Bell, FilePlus2, FileText, Gauge, Inbox, ShieldCheck } from "lucide-vue-next";

import type { PersonaRole } from "../types";

export interface PortalMenuItem {
  id: string;
  label: string;
  to: string;
  icon: Component;
}

export interface PortalMenuGroup {
  id: string;
  label: string;
  items: PortalMenuItem[];
}

const DASHBOARD: PortalMenuItem = { id: "dashboard", label: "Papan Pemuka", to: "/st/dashboard", icon: Gauge };
const NOTIFICATIONS: PortalMenuItem = { id: "notifications", label: "Notifikasi", to: "/st/notifications", icon: Bell };

export function portalMenuFor(role: PersonaRole | null): PortalMenuGroup[] {
  if (!role) return [];

  if (role === "applicant") {
    return [
      {
        id: "main",
        label: "",
        items: [
          DASHBOARD,
          { id: "applications", label: "Permohonan Saya", to: "/st/applications", icon: FileText },
          { id: "new", label: "Permohonan Baharu", to: "/st/applications/new", icon: FilePlus2 },
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
          { id: "applications", label: "Pengesahan Lantikan", to: "/st/applications", icon: ShieldCheck },
          NOTIFICATIONS,
        ],
      },
    ];
  }

  // sos / technical / approver
  return [
    {
      id: "main",
      label: "",
      items: [
        DASHBOARD,
        { id: "inbox", label: "Peti Tugasan", to: "/st/inbox", icon: Inbox },
        NOTIFICATIONS,
      ],
    },
  ];
}
