<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { ArrowRight, LogIn, Search, CheckCircle2 } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import StPublicLayout from "../../components/StPublicLayout.vue";
import { REGISTRATION_MODULES, type RegistrationModuleDef } from "../../registration/modules";
import { HERO, SLOGAN, PILLARS, HOW_IT_WORKS, STATS, ANNOUNCEMENTS } from "../../mock/public-content";

const router = useRouter();
const { locale, ml } = useLocale();

// Featured registration services: electric = available, gas = coming soon.
const featured = computed(() =>
  (Object.values(REGISTRATION_MODULES) as RegistrationModuleDef[]).map((m) => ({
    ...m,
    title: ml(m.menuId, m.code),
    available: m.energy === "electric",
  })),
);

function go(path: string) {
  router.push(path);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(locale.value === "bm" ? "ms-MY" : "en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
</script>

<template>
  <StPublicLayout>
    <!-- Hero -->
    <section class="st-brand-gradient grid gap-8 overflow-hidden rounded-2xl p-6 text-white shadow-lg sm:p-10 lg:grid-cols-[1.15fr_1fr] lg:items-center">
      <div>
        <span class="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          <CheckCircle2 class="h-3.5 w-3.5" /> {{ HERO.badge[locale] }}
        </span>
        <h1 class="mt-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
          {{ HERO.title[locale] }}
        </h1>
        <p class="mt-3 text-base font-semibold text-white/90">{{ SLOGAN[locale] }}</p>
        <p class="mt-4 max-w-xl text-base leading-relaxed text-white/80">
          {{ HERO.subtitle[locale] }}
        </p>
        <div class="mt-7 flex flex-wrap gap-3">
          <button
            class="flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-[#3a42a9] shadow-sm transition-transform hover:scale-[1.02]"
            @click="go('/st/login')"
          >
            <LogIn class="h-4 w-4" /> {{ HERO.ctaPrimary[locale] }}
          </button>
          <button
            class="flex items-center gap-2 rounded-md border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
            @click="go('/st/semak-status')"
          >
            <Search class="h-4 w-4" /> {{ HERO.ctaSecondary[locale] }}
          </button>
        </div>

        <!-- Stats -->
        <dl class="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div v-for="(s, i) in STATS" :key="i" class="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur">
            <component :is="s.icon" class="h-5 w-5 text-white" />
            <dd class="mt-2 text-xl font-bold text-white">{{ s.value }}</dd>
            <dt class="text-xs text-white/70">{{ s.label[locale] }}</dt>
          </div>
        </dl>
      </div>

      <!-- Featured services -->
      <div class="space-y-3">
        <p class="text-[11px] font-semibold uppercase tracking-wider text-white/70">
          {{ locale === 'bm' ? 'Perkhidmatan Pendaftaran' : 'Registration Services' }}
        </p>
        <button
          v-for="m in featured"
          :key="m.code"
          class="group flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:border-[var(--accent-ring)] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="!m.available"
          @click="m.available && go('/st/login')"
        >
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-50)] text-[var(--accent-700)]">
            <component :is="m.icon" class="h-5 w-5" />
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <p class="truncate font-semibold text-slate-900">{{ m.title }}</p>
              <span
                v-if="!m.available"
                class="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-700"
              >{{ locale === 'bm' ? 'Akan Datang' : 'Soon' }}</span>
            </div>
            <p class="mt-0.5 truncate text-xs text-slate-500">{{ m.actRef[locale] }}</p>
          </div>
          <ArrowRight v-if="m.available" class="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-[var(--accent-600)]" />
        </button>
      </div>
    </section>

    <!-- ST regulatory pillars -->
    <section class="mt-14">
      <h2 class="text-lg font-semibold text-slate-900">{{ locale === 'bm' ? 'Peranan Suruhanjaya Tenaga' : 'The Role of the Energy Commission' }}</h2>
      <p class="mt-1 text-sm text-slate-500">
        {{ locale === 'bm'
          ? 'Mengawal selia sektor elektrik dan gas Malaysia dengan integriti, keselamatan dan akauntabiliti.'
          : 'Regulating Malaysia\'s electricity and gas sectors with integrity, safety and accountability.' }}
      </p>
      <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="(p, i) in PILLARS" :key="i" class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-50)] text-[var(--accent-700)]">
            <component :is="p.icon" class="h-5 w-5" />
          </div>
          <p class="mt-3 font-semibold text-slate-900">{{ p.title[locale] }}</p>
          <p class="mt-1 text-sm leading-relaxed text-slate-500">{{ p.desc[locale] }}</p>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="mt-14">
      <h2 class="text-lg font-semibold text-slate-900">{{ locale === 'bm' ? 'Cara Permohonan' : 'How It Works' }}</h2>
      <p class="mt-1 text-sm text-slate-500">
        {{ locale === 'bm' ? 'Enam langkah mudah dari permohonan hingga Perakuan Digital.' : 'Six simple steps from application to Digital Certificate.' }}
      </p>
      <ol class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="(step, i) in HOW_IT_WORKS" :key="i" class="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-50)] text-[var(--accent-700)]">
              <component :is="step.icon" class="h-4.5 w-4.5" />
            </div>
            <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {{ locale === 'bm' ? 'Langkah' : 'Step' }} {{ i + 1 }}
            </span>
          </div>
          <p class="mt-3 font-semibold text-slate-900">{{ step.title[locale] }}</p>
          <p class="mt-1 text-sm leading-relaxed text-slate-500">{{ step.desc[locale] }}</p>
        </li>
      </ol>
    </section>

    <!-- Announcements -->
    <section class="mt-14">
      <h2 class="text-lg font-semibold text-slate-900">{{ locale === 'bm' ? 'Pengumuman' : 'Announcements' }}</h2>
      <ul class="mt-5 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <li v-for="(a, i) in ANNOUNCEMENTS" :key="i" class="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:gap-4">
          <span class="shrink-0 rounded bg-[var(--accent-50)] px-2 py-0.5 text-[11px] font-medium text-[var(--accent-700)]">{{ a.tag[locale] }}</span>
          <p class="flex-1 text-sm text-slate-700">{{ a.title[locale] }}</p>
          <span class="shrink-0 text-xs text-slate-400">{{ fmtDate(a.date) }}</span>
        </li>
      </ul>
    </section>

    <!-- CTA band -->
    <section class="mt-14 overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--accent-700)] to-[var(--accent-500)] px-6 py-10 text-center text-white sm:px-10">
      <h2 class="text-2xl font-bold">{{ locale === 'bm' ? 'Sedia untuk memohon?' : 'Ready to apply?' }}</h2>
      <p class="mx-auto mt-2 max-w-xl text-sm text-white/85">
        {{ locale === 'bm'
          ? 'Log masuk ke Sistem Digital ST dan pilih perkhidmatan pendaftaran anda.'
          : 'Log in to the ST Digital System and choose your registration service.' }}
      </p>
      <button
        class="mt-6 inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-[var(--accent-700)] shadow-sm transition-transform hover:scale-[1.02]"
        @click="go('/st/login')"
      >
        <LogIn class="h-4 w-4" /> {{ HERO.ctaPrimary[locale] }}
      </button>
    </section>
  </StPublicLayout>
</template>
