import { computed, ref } from "vue";
import { defineStore } from "pinia";

import { useAuthStore } from "@/stores/auth";
import type { PersonaRole } from "../types";
import { PERSONAS, personaById } from "../mock/personas";

const PERSONA_KEY = "st.session.personaId";

// Maps a logged-in persona role to its landing route.
function homeRouteForRole(role: PersonaRole): string {
  switch (role) {
    case "applicant":
    case "employer":
      return "/st/applications";
    default:
      return "/st/inbox";
  }
}

export const useStSessionStore = defineStore("st-session", () => {
  const currentPersonaId = ref<string | null>(null);

  const currentPersona = computed(() => personaById(currentPersonaId.value));
  const role = computed<PersonaRole | null>(() => currentPersona.value?.role ?? null);
  const isApplicant = computed(() => role.value === "applicant");
  const isEmployer = computed(() => role.value === "employer");
  const isBackOffice = computed(() => ["sos", "technical", "approver"].includes(role.value ?? ""));

  // Push a shim user into the existing auth store so the global router guard
  // (which checks auth.isAuthenticated) treats the ST session as authenticated.
  function applyAuthShim() {
    const auth = useAuthStore();
    const persona = currentPersona.value;
    if (persona) {
      auth.user = { id: 1, email: persona.email, name: persona.name, role: persona.title ?? persona.role };
    } else {
      auth.user = null;
    }
    auth.initialized = true; // prevent initialize() from clobbering the shim
  }

  function loginAs(personaId: string) {
    currentPersonaId.value = personaId;
    if (typeof window !== "undefined") localStorage.setItem(PERSONA_KEY, personaId);
    applyAuthShim();
  }

  function logout() {
    currentPersonaId.value = null;
    if (typeof window !== "undefined") localStorage.removeItem(PERSONA_KEY);
    const auth = useAuthStore();
    auth.user = null;
    auth.initialized = true;
  }

  // Called once at boot (from main.ts) before the router resolves the first route.
  function restore() {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(PERSONA_KEY);
    if (saved && personaById(saved)) {
      currentPersonaId.value = saved;
      applyAuthShim();
    }
  }

  function homeRoute(): string {
    return role.value ? homeRouteForRole(role.value) : "/st/login";
  }

  return {
    personas: PERSONAS,
    currentPersonaId,
    currentPersona,
    role,
    isApplicant,
    isEmployer,
    isBackOffice,
    loginAs,
    logout,
    restore,
    homeRoute,
  };
});
