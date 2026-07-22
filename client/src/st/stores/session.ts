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
    // D11 §4.2.1/§5.2.1: public users land on the ST services picker after login.
    // Pemohon → OK Elektrik; Majikan → Kontraktor Elektrik (filtered in landing view).
    case "applicant":
    case "employer":
      return "/st/dashboard";
      return "/st/perkhidmatan-saya";
    case "admin":
      return "/st/dashboard";
    case "committee":
      return "/st/operations/committee/queue";
    case "tp_sos":
      return "/st/inbox";
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
      auth.signOut();
      throw new Error("ST_UNAUTHORIZED");
    }
    // Inbox/dashboard hydrate from the destination view — do not start a competing
    // list fetch here (blocks `php artisan serve` and makes re-login feel >5s).
  }

  function logout() {
    const auth = useAuthStore();
    // Clear persona immediately; server logout runs in the background.
    // Login page awaits waitForLogout() before CSRF warm-up to avoid races.
    currentPersonaId.value = null;
    auth.signOut();
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
