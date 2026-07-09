import { computed, ref } from "vue";
import { defineStore } from "pinia";

import { useAuthStore } from "@/stores/auth";
import { isKakitanganRole } from "../config/portal-menu";
import type { PersonaRole } from "../types";
import { personaFromUser } from "../auth";
import { personaById } from "../mock/personas";

// Maps a logged-in persona role to its landing route.
function homeRouteForRole(role: PersonaRole): string {
  switch (role) {
    case "applicant":
    case "employer":
      return "/st/applications";
    case "admin":
      return "/st/dashboard";
    case "committee":
      return "/st/operations/committee/queue";
    default:
      return "/st/inbox";
  }
}

export const useStSessionStore = defineStore("st-session", () => {
  const currentPersonaId = ref<string | null>(null);

  const currentPersona = computed(() => {
    if (!currentPersonaId.value) return undefined;
    const fromMock = personaById(currentPersonaId.value);
    if (fromMock) return fromMock;
    const auth = useAuthStore();
    if (auth.user && currentPersonaId.value === `user-${auth.user.id}`) {
      return personaFromUser(auth.user) ?? undefined;
    }
    return undefined;
  });
  const role = computed<PersonaRole | null>(() => currentPersona.value?.role ?? null);
  const isApplicant = computed(() => role.value === "applicant");
  const isEmployer = computed(() => role.value === "employer");
  const isKakitangan = computed(() => isKakitanganRole(role.value));
  const isBackOffice = computed(() => isKakitangan.value);

  /** Sync ST session state from the Sanctum-authenticated user. */
  function syncFromAuth() {
    const auth = useAuthStore();
    if (!auth.user) {
      currentPersonaId.value = null;
      return;
    }
    const persona = personaFromUser(auth.user);
    currentPersonaId.value = persona?.id ?? null;
  }

  async function loginWithCredentials(email: string, password: string) {
    const auth = useAuthStore();
    await auth.signIn(email, password);
    syncFromAuth();
    if (!currentPersonaId.value) {
      await auth.signOut();
      throw new Error("ST_UNAUTHORIZED");
    }
  }

  async function logout() {
    const auth = useAuthStore();
    try {
      await auth.signOut();
    } finally {
      currentPersonaId.value = null;
    }
  }

  function homeRoute(): string {
    return role.value ? homeRouteForRole(role.value) : "/st/login";
  }

  return {
    currentPersonaId,
    currentPersona,
    role,
    isApplicant,
    isEmployer,
    isKakitangan,
    isBackOffice,
    syncFromAuth,
    loginWithCredentials,
    logout,
    homeRoute,
  };
});
