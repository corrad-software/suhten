import { computed, type Component } from "vue";

import { useLocale } from "@/composables/useLocale";
import type { StMessageKey } from "@/i18n/st-messages";

import { REGISTRATION_MODULES } from "../registration/modules";
import { SERVICE_MODULES } from "../modules/catalog";

export interface ServiceTile {
  code: string;
  title: string;
  icon: Component;
  actRef: string;
  processTypes: string[];
  available: boolean;
  /** Where a logged-in applicant starts this service, when it is live. */
  applyPath?: string;
}

export interface ServiceGroup {
  id: string;
  title: string;
  desc: string;
  tiles: ServiceTile[];
}

/**
 * Single source of truth for the ST services catalogue, shared by the public
 * services page (/st/perkhidmatan) and the authenticated dashboard.
 */
export function useServiceCatalog() {
  const { ts, locale } = useLocale();
  const bm = computed(() => locale.value === "bm");

  const pick = (v: { bm: string; bi: string }) => (bm.value ? v.bm : v.bi);
  const modTitle = (code: string) => ts(`st.mod.${code}` as StMessageKey);

  const registrationTiles = computed<ServiceTile[]>(() =>
    Object.values(REGISTRATION_MODULES).map((m) => ({
      code: m.code,
      title: modTitle(m.code),
      icon: m.icon,
      actRef: pick(m.actRef),
      processTypes: [],
      // Electric registration is live in the prototype; gas is an upcoming phase.
      available: m.energy === "electric",
      applyPath: m.energy === "electric" ? `${m.basePath}/applications/new` : undefined,
    })),
  );

  function tilesForDomains(domains: string[]): ServiceTile[] {
    return Object.values(SERVICE_MODULES)
      .filter((m) => domains.includes(m.domain))
      .map<ServiceTile>((m) => ({
        code: m.code,
        title: modTitle(m.code),
        icon: m.icon,
        actRef: pick(m.actRef),
        processTypes: m.processTypes.map(pick),
        available: m.phase === 1,
      }));
  }

  const licensing = computed<ServiceGroup>(() => ({
    id: "licensing",
    title: bm.value ? "Pelesenan & Pepasangan" : "Licensing & Installation",
    desc: bm.value
      ? "Lesen pembekalan tenaga dan kelulusan pepasangan elektrik & gas."
      : "Energy supply licences and electrical & gas installation approvals.",
    tiles: tilesForDomains(["licensing", "installation"]),
  }));

  const certification = computed<ServiceGroup>(() => ({
    id: "certification",
    title: bm.value ? "Persijilan" : "Certification",
    desc: bm.value
      ? "Peperiksaan kekompetenan dan pembangunan profesional berterusan."
      : "Competency examinations and continuing professional development.",
    tiles: tilesForDomains(["certification"]),
  }));

  const enforcement = computed<ServiceGroup>(() => ({
    id: "enforcement",
    title: bm.value ? "Kecekapan Tenaga & Penguatkuasaan" : "Energy Efficiency & Enforcement",
    desc: bm.value
      ? "Pematuhan kecekapan tenaga, penguatkuasaan dan penyiasatan."
      : "Energy-efficiency compliance, enforcement and investigation.",
    tiles: tilesForDomains(["enforcement"]),
  }));

  const registration = computed<ServiceGroup>(() => ({
    id: "registration",
    title: bm.value ? "Pendaftaran" : "Registration",
    desc: bm.value
      ? "Pendaftaran Orang Kompeten dan Kontraktor Elektrik & Gas."
      : "Competent Person and Electrical & Gas Contractor registration.",
    tiles: registrationTiles.value,
  }));

  /** Full catalogue, as shown on /st/perkhidmatan. */
  const groups = computed<ServiceGroup[]>(() => [
    registration.value,
    licensing.value,
    certification.value,
    enforcement.value,
  ]);

  /** Everything beyond registration — the "other services" shown on the dashboard. */
  const otherGroups = computed<ServiceGroup[]>(() => [licensing.value, certification.value, enforcement.value]);

  return { groups, otherGroups, registrationTiles };
}
