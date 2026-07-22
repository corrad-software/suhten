<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowRight, AlertCircle, Eye, EyeOff, FileText, ShieldCheck, CreditCard, BadgeCheck, Loader2 } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import { useAuthStore } from "@/stores/auth";
import { useSiteStore } from "@/stores/site";
import { useUiThemeStore } from "@/stores/uiTheme";
import { ensureCsrfCookie } from "@/api/client";
import { API_BASE_URL } from "@/env";
import { useStSessionStore } from "../stores/session";
import { DEMO_PASSWORD } from "../mock/personas";

/** Demo identity that the MyDigital ID handshake returns in this prototype. */
const MYDIGITAL_DEMO_EMAIL = "ahmad.ismail@email.my";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const site = useSiteStore();
const session = useStSessionStore();
const uiTheme = useUiThemeStore();
const { t, locale } = useLocale();

const email = ref("");
const password = ref("");
const error = ref("");
const showPassword = ref(false);
const loading = ref(false);
const loadingMyDigitalId = ref(false);

const bm = computed(() => locale.value === "bm");

const features = computed(() => [
  { icon: FileText, label: bm.value ? "Permohonan Dalam Talian" : "Online Applications" },
  { icon: ShieldCheck, label: bm.value ? "Pengesahan Identiti JPN" : "JPN Identity Verification" },
  { icon: CreditCard, label: bm.value ? "Bayaran FPX Selamat" : "Secure FPX Payment" },
  { icon: BadgeCheck, label: bm.value ? "Perakuan Digital" : "Digital Certificate" },
]);

function resolveUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
}

/** Honor email deep-link redirects after ST portal login. */
function postLoginDestination(): string {
  const raw = route.query.redirect;
  if (typeof raw === "string" && raw.startsWith("/st") && !raw.startsWith("//")) {
    return raw;
  }
  return session.homeRoute();
}

onMounted(async () => {
  // Warm CSRF in parallel with site settings. Do not wait on background logout —
  // server logout keeps the session/CSRF cookie so re-login is a single POST.
  if (!auth.initialized) {
    await auth.initialize();
  }
  await Promise.all([
    ensureCsrfCookie(),
    site.initialized ? Promise.resolve() : site.load(),
  ]);
  session.syncFromAuth();
  if (auth.isAuthenticated && session.currentPersona) {
    router.replace(postLoginDestination());
  }
});

async function submit() {
  error.value = "";
  loading.value = true;
  try {
    await session.loginWithCredentials(email.value.trim(), password.value);
    // Clear spinner before navigation so auth wait is not confused with inbox load.
    loading.value = false;
    await router.replace(postLoginDestination());
  } catch (e) {
    error.value =
      e instanceof Error && e.message === "ST_UNAUTHORIZED"
        ? t("st.login.unauthorized")
        : e instanceof Error
          ? e.message
          : t("login.failed");
    loading.value = false;
  }
}

// Simulated MyDigital ID (NACSA) sign-in — Appendix H lists it as an inbound
// MyKad-data integration. Prototype only: no real NACSA handshake.
async function loginWithMyDigitalId() {
  error.value = "";
  loadingMyDigitalId.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 900));
    await session.loginWithCredentials(MYDIGITAL_DEMO_EMAIL, DEMO_PASSWORD);
    void router.replace(postLoginDestination());
  } catch (e) {
    error.value = e instanceof Error ? e.message : t("login.failed");
  } finally {
    loadingMyDigitalId.value = false;
  }
}
</script>

<template>
  <div data-theme-color="st" class="flex min-h-screen bg-[#f6f9fc]">
    <!-- Left: form -->
    <div class="flex w-full flex-col items-center justify-center px-4 py-10 lg:w-1/2 lg:px-16">
      <div class="w-full max-w-[400px]">
        <!-- Language -->
        <div class="mb-6 flex justify-center gap-2 lg:justify-start">
          <button
            type="button"
            class="rounded-md border px-3 py-1 text-xs font-medium transition-colors"
            :class="bm ? 'border-[var(--accent-500)] bg-[var(--accent-50)] text-[var(--accent-700)]' : 'border-slate-200 text-slate-600 hover:border-slate-300'"
            @click="uiTheme.setLocale('bm')"
          >
            {{ t('theme.lang.bm') }}
          </button>
          <button
            type="button"
            class="rounded-md border px-3 py-1 text-xs font-medium transition-colors"
            :class="!bm ? 'border-[var(--accent-500)] bg-[var(--accent-50)] text-[var(--accent-700)]' : 'border-slate-200 text-slate-600 hover:border-slate-300'"
            @click="uiTheme.setLocale('bi')"
          >
            {{ t('theme.lang.bi') }}
          </button>
        </div>

        <!-- Logo → public home -->
        <div class="mb-7 flex justify-center lg:justify-start">
          <router-link to="/st/utama" class="inline-flex" :aria-label="bm ? 'Ke halaman utama' : 'Go to home'">
            <img
              :src="site.siteIconUrl ? resolveUrl(site.siteIconUrl) : '/logo-st-color.svg'"
              alt="Suruhanjaya Tenaga"
              class="h-9 w-auto object-contain"
            />
          </router-link>
        </div>

        <h1 class="mb-1 text-center text-xl font-semibold tracking-tight text-[#1a1f36] lg:text-left">{{ t('login.title') }}</h1>
        <p class="mb-8 text-center text-[13px] text-[#697386] lg:text-left">{{ t('st.login.subtitle') }}</p>

        <form class="space-y-5" @submit.prevent="submit">
          <div class="space-y-1.5">
            <label class="text-[13px] font-medium text-[#1a1f36]">{{ t('login.email') }}</label>
            <input
              v-model="email"
              type="email"
              autocomplete="username"
              required
              class="w-full rounded-md border border-[#d8dee4] bg-white px-3 py-[9px] text-sm text-[#1a1f36] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow placeholder:text-[#a3acb9] focus:border-[var(--accent-500)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent-ring)]/30"
              :placeholder="t('login.emailPlaceholder')"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-[13px] font-medium text-[#1a1f36]">{{ t('login.password') }}</label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                class="w-full rounded-md border border-[#d8dee4] bg-white px-3 py-[9px] pr-10 text-sm text-[#1a1f36] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow placeholder:text-[#a3acb9] focus:border-[var(--accent-500)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent-ring)]/30"
                :placeholder="t('login.passwordPlaceholder')"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-[#a3acb9] transition-colors hover:text-[#697386]"
                @click="showPassword = !showPassword"
              >
                <EyeOff v-if="showPassword" class="h-4 w-4" />
                <Eye v-else class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div v-if="error" class="flex items-center gap-2 rounded-md border border-[#f8d7da] bg-[#fdf2f2] px-3.5 py-2.5 text-[13px] text-[#cd3d64]">
            <AlertCircle class="h-4 w-4 shrink-0" />
            {{ error }}
          </div>

          <button
            type="submit"
            class="flex w-full items-center justify-center gap-2 rounded-md bg-[var(--accent-600)] px-4 py-[9px] text-sm font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)] transition-all hover:bg-[var(--accent-700)] disabled:opacity-60"
            :disabled="loading"
          >
            {{ loading ? t('login.signingIn') : t('login.continue') }}
            <ArrowRight v-if="!loading" class="h-4 w-4" />
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-[#e3e8ee]" />
          </div>
          <div class="relative flex justify-center">
            <span class="bg-[#f6f9fc] px-3 text-[12px] text-[#8792a2]">{{ bm ? 'Atau' : 'Or' }}</span>
          </div>
        </div>

        <!-- MyDigital ID (simulated — Appendix H integration) -->
        <button
          type="button"
          class="flex w-full items-center justify-center gap-2 rounded-md border border-[#d8dee4] bg-white px-4 py-[9px] text-sm font-medium text-[#1a1f36] shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-60"
          :disabled="loadingMyDigitalId || loading"
          @click="loginWithMyDigitalId"
        >
          <Loader2 v-if="loadingMyDigitalId" class="h-6 w-6 animate-spin" />
          <img v-else src="/mydigital-id-logo.png" alt="" class="h-6 w-6 rounded-sm" />
          {{ loadingMyDigitalId
            ? (bm ? 'Menyambung…' : 'Connecting…')
            : (bm ? 'Log Masuk dengan MyDigital ID' : 'Log In with MyDigital ID') }}
        </button>

        <p class="mt-6 rounded-md bg-slate-100 px-3 py-2 text-center text-[12px] text-slate-500 lg:bg-slate-50">
          {{ bm ? 'Demo: guna mana-mana persona · kata laluan' : 'Demo: use any persona · password' }} <span class="font-mono font-medium">demo1234</span>
        </p>

        <p class="mt-8 text-center text-[12px] text-[#8792a2]">&copy; {{ new Date().getFullYear() }} Suruhanjaya Tenaga</p>
      </div>
    </div>

    <!-- Right: banner -->
    <div class="relative hidden overflow-hidden st-brand-gradient lg:block lg:w-1/2">
      <div class="silk-layer">
        <div class="silk-blob silk-blob-1" />
        <div class="silk-blob silk-blob-2" />
        <div class="silk-blob silk-blob-3" />
        <div class="silk-blob silk-blob-4" />
      </div>

      <div class="relative flex h-full flex-col justify-center px-14 py-16 text-white">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
          {{ bm ? 'Sistem Digital Suruhanjaya Tenaga' : 'Energy Commission Digital System' }}
        </p>
        <h2 class="mt-3 max-w-md text-3xl font-bold leading-tight">
          {{ bm ? 'Pendaftaran Tenaga Yang Mudah & Selamat' : 'Simple & Secure Energy Registration' }}
        </h2>
        <p class="mt-4 max-w-sm text-sm leading-relaxed text-white/85">
          {{ bm
            ? 'Mohon, bayar dan pantau pendaftaran Orang Kompeten dan Kontraktor Elektrik dalam satu portal.'
            : 'Apply, pay and track Competent Person and Electrical Contractor registration in one portal.' }}
        </p>

        <div class="mt-10 space-y-4">
          <div v-for="feature in features" :key="feature.label" class="flex items-center gap-3">
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
              <component :is="feature.icon" class="h-4.5 w-4.5 text-white" />
            </div>
            <span class="text-sm font-medium text-white/90">{{ feature.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.silk-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.silk-blob {
  position: absolute;
  border-radius: 9999px;
  filter: blur(40px);
  mix-blend-mode: overlay;
  opacity: 1;
  will-change: transform;
}

.silk-blob-1 {
  top: -20%;
  right: -15%;
  height: 38rem;
  width: 38rem;
  background: radial-gradient(circle, rgba(240, 249, 255, 1), rgba(59, 130, 246, 0.45) 60%, transparent 78%);
  animation: silk-drift-1 7s ease-in-out infinite;
}

.silk-blob-2 {
  bottom: -5%;
  left: -18%;
  height: 32rem;
  width: 32rem;
  background: radial-gradient(circle, rgba(219, 234, 254, 1), rgba(58, 66, 169, 0.45) 60%, transparent 78%);
  animation: silk-drift-2 8.5s ease-in-out infinite;
}

.silk-blob-3 {
  bottom: -25%;
  right: 10%;
  height: 36rem;
  width: 36rem;
  background: radial-gradient(circle, rgba(255, 228, 230, 0.9), rgba(231, 50, 57, 0.3) 60%, transparent 78%);
  animation: silk-drift-3 10s ease-in-out infinite;
}

.silk-blob-4 {
  top: 30%;
  left: 20%;
  height: 24rem;
  width: 24rem;
  background: radial-gradient(circle, rgba(191, 219, 254, 0.9), rgba(37, 99, 235, 0.35) 60%, transparent 78%);
  animation: silk-drift-4 6s ease-in-out infinite;
}

@keyframes silk-drift-1 {
  0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
  33% { transform: translate(-180px, 140px) scale(1.5) rotate(25deg); }
  66% { transform: translate(100px, 80px) scale(0.75) rotate(-18deg); }
}

@keyframes silk-drift-2 {
  0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
  33% { transform: translate(170px, -120px) scale(1.4) rotate(-28deg); }
  66% { transform: translate(-80px, -50px) scale(0.7) rotate(20deg); }
}

@keyframes silk-drift-3 {
  0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
  33% { transform: translate(-140px, -170px) scale(0.65) rotate(30deg); }
  66% { transform: translate(120px, -70px) scale(1.35) rotate(-22deg); }
}

@keyframes silk-drift-4 {
  0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
  50% { transform: translate(90px, -100px) scale(1.3) rotate(-25deg); }
}

@media (prefers-reduced-motion: reduce) {
  .silk-blob {
    animation: none;
  }
}
</style>
