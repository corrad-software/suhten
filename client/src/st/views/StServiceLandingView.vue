<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { ArrowRight } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import { useStSessionStore } from "../stores/session";
import { REGISTRATION_MODULES } from "../registration/modules";
import StPageHero from "../components/StPageHero.vue";

const router = useRouter();
const session = useStSessionStore();
const { locale, ml } = useLocale();

// D11 §4.2.1 / §5.2.1: after login, public users pick an ST registration service.
// Pemohon → Orang Kompeten (RG-KE/KG); Majikan → Kontraktor (RG-CE/CG).
// Electric is live; gas is upcoming.
const services = computed(() => {
  const domain = session.role === "employer" ? "contractor" : "ok";
  return Object.values(REGISTRATION_MODULES)
    .filter((m) => m.domain === domain)
    .map((m) => ({
      code: m.code,
      title: ml(m.menuId, m.code),
      icon: m.icon,
      actRef: m.actRef,
      available: m.energy === "electric",
      applyPath: `${m.basePath}/applications/new`,
    }));
});

const greeting = computed(() => session.currentPersona?.name ?? "");

function open(applyPath: string, available: boolean) {
  if (available) router.push(applyPath);
}
</script>

<template>
  <div class="space-y-6">
    <StPageHero
      :title="locale === 'bm' ? 'Perkhidmatan ST' : 'ST Services'"
      :subtitle="(greeting ? (locale === 'bm' ? `Selamat datang, ${greeting}. ` : `Welcome, ${greeting}. `) : '')
        + (locale === 'bm' ? 'Pilih perkhidmatan pendaftaran untuk meneruskan.' : 'Choose a registration service to continue.')"
    />

    <div class="grid gap-4 sm:grid-cols-2">
      <button
        v-for="s in services"
        :key="s.code"
        class="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all"
        :class="s.available ? 'hover:border-[var(--accent-ring)] hover:shadow-md' : 'cursor-not-allowed opacity-75'"
        :disabled="!s.available"
        @click="open(s.applyPath, s.available)"
      >
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-50)] text-[var(--accent-700)]">
          <component :is="s.icon" class="h-6 w-6" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <p class="font-semibold text-slate-900">{{ s.title }}</p>
            <span
              v-if="!s.available"
              class="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-700"
            >{{ locale === 'bm' ? 'Akan Datang' : 'Soon' }}</span>
          </div>
          <p class="mt-1 text-xs leading-relaxed text-slate-500">{{ s.actRef[locale] }}</p>
          <span
            v-if="s.available"
            class="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-700)]"
          >
            {{ locale === 'bm' ? 'Mula Permohonan' : 'Start Application' }}
            <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </button>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-sm">
      <template v-if="session.role === 'employer'">
        {{ locale === 'bm'
          ? 'Permohonan kontraktor anda yang sedia ada boleh dilihat di menu “Permohonan Kontraktor”.'
          : 'Your existing contractor applications are available under “Contractor Applications”.' }}
        <button
          class="ml-1 font-medium text-[var(--accent-700)] hover:underline"
          @click="router.push('/st/registration/contractor-electric/applications')"
        >
          {{ locale === 'bm' ? 'Lihat Permohonan Kontraktor' : 'View Contractor Applications' }}
        </button>
      </template>
      <template v-else>
        {{ locale === 'bm'
          ? 'Permohonan anda yang sedia ada boleh dilihat di menu “Permohonan Saya”.'
          : 'Your existing applications are available under “My Applications”.' }}
        <button class="ml-1 font-medium text-[var(--accent-700)] hover:underline" @click="router.push('/st/applications')">
          {{ locale === 'bm' ? 'Lihat Permohonan Saya' : 'View My Applications' }}
        </button>
      </template>
    </div>
  </div>
</template>
