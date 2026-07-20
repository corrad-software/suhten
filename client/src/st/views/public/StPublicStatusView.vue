<script setup lang="ts">
import { ref, type Component } from "vue";
import { useRouter } from "vue-router";
import { Search, FileSearch, AlertCircle, CheckCircle2, Clock, CreditCard, XCircle, BadgeCheck } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import StPublicLayout from "../../components/StPublicLayout.vue";
import { lookupStatus, DEMO_STATUS, type PublicStatusRecord, type PublicStatusTone } from "../../mock/public-content";

const router = useRouter();
const { locale } = useLocale();

const query = ref("");
const searched = ref(false);
const result = ref<PublicStatusRecord | null>(null);

const TONE_META: Record<PublicStatusTone, { icon: unknown; cls: string }> = {
  review: { icon: Clock, cls: "bg-amber-50 text-amber-700 border-amber-200" },
  payment: { icon: CreditCard, cls: "bg-blue-50 text-blue-700 border-blue-200" },
  approved: { icon: CheckCircle2, cls: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  issued: { icon: BadgeCheck, cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  rejected: { icon: XCircle, cls: "bg-rose-50 text-rose-700 border-rose-200" },
};

function submit() {
  searched.value = true;
  result.value = lookupStatus(query.value) ?? null;
}

function useExample(code: string) {
  query.value = code;
  submit();
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(locale.value === "bm" ? "ms-MY" : "en-MY", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
</script>

<template>
  <StPublicLayout>
    <div class="mx-auto max-w-2xl">
      <div class="text-center">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-50)] text-[var(--accent-700)]">
          <FileSearch class="h-6 w-6" />
        </div>
        <h1 class="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          {{ locale === 'bm' ? 'Semak Status Permohonan' : 'Check Application Status' }}
        </h1>
        <p class="mt-2 text-sm text-slate-600">
          {{ locale === 'bm'
            ? 'Masukkan nombor rujukan permohonan anda untuk menyemak status terkini.'
            : 'Enter your application reference number to check the latest status.' }}
        </p>
      </div>

      <form class="mt-7 flex flex-col gap-2 sm:flex-row" @submit.prevent="submit">
        <input
          v-model="query"
          type="text"
          :placeholder="locale === 'bm' ? 'Cth: ST/OK/2026/00110' : 'e.g. ST/OK/2026/00110'"
          class="flex-1 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-shadow placeholder:text-slate-400 focus:border-[var(--accent-500)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent-ring)]/30"
        />
        <button
          type="submit"
          class="flex items-center justify-center gap-2 rounded-md bg-[var(--accent-600)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-700)]"
        >
          <Search class="h-4 w-4" /> {{ locale === 'bm' ? 'Semak' : 'Check' }}
        </button>
      </form>

      <!-- Example codes -->
      <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span>{{ locale === 'bm' ? 'Contoh:' : 'Examples:' }}</span>
        <button
          v-for="r in DEMO_STATUS"
          :key="r.code"
          class="rounded border border-slate-200 bg-white px-2 py-0.5 font-mono text-[11px] text-slate-600 hover:border-[var(--accent-ring)] hover:text-[var(--accent-700)]"
          @click="useExample(r.code)"
        >
          {{ r.code }}
        </button>
      </div>

      <!-- Result -->
      <div v-if="searched" class="mt-6">
        <div v-if="result" class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <p class="font-mono text-sm font-semibold text-slate-900">{{ result.code }}</p>
              <p class="text-xs text-slate-500">{{ result.applicantName }}</p>
            </div>
            <span
              class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
              :class="TONE_META[result.tone].cls"
            >
              <component :is="TONE_META[result.tone].icon" class="h-3.5 w-3.5" />
              {{ result.statusLabel[locale] }}
            </span>
          </div>
          <dl class="grid gap-4 px-5 py-4 sm:grid-cols-2">
            <div>
              <dt class="text-[11px] uppercase tracking-wider text-slate-400">{{ locale === 'bm' ? 'Perkhidmatan' : 'Service' }}</dt>
              <dd class="mt-0.5 text-sm text-slate-700">{{ result.service[locale] }}</dd>
            </div>
            <div>
              <dt class="text-[11px] uppercase tracking-wider text-slate-400">{{ locale === 'bm' ? 'Tarikh Hantar' : 'Submitted' }}</dt>
              <dd class="mt-0.5 text-sm text-slate-700">{{ fmtDate(result.submittedAt) }}</dd>
            </div>
            <div class="sm:col-span-2">
              <dt class="text-[11px] uppercase tracking-wider text-slate-400">{{ locale === 'bm' ? 'Peringkat Semasa' : 'Current Stage' }}</dt>
              <dd class="mt-0.5 text-sm text-slate-700">{{ result.stage[locale] }}</dd>
            </div>
          </dl>
          <div class="border-t border-slate-100 bg-slate-50/60 px-5 py-3 text-xs text-slate-500">
            {{ locale === 'bm'
              ? 'Log masuk untuk melihat butiran penuh, dokumen dan Perakuan Digital.'
              : 'Log in to view full details, documents and the Digital Certificate.' }}
            <button class="ml-1 font-medium text-[var(--accent-700)] hover:underline" @click="router.push('/st/login')">
              {{ locale === 'bm' ? 'Log Masuk' : 'Log In' }}
            </button>
          </div>
        </div>

        <div v-else class="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          <AlertCircle class="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p class="font-medium">{{ locale === 'bm' ? 'Rekod tidak dijumpai' : 'No record found' }}</p>
            <p class="mt-0.5 text-amber-700">
              {{ locale === 'bm'
                ? 'Sila semak nombor rujukan anda dan cuba lagi, atau gunakan salah satu contoh di atas.'
                : 'Please check your reference number and try again, or use one of the examples above.' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </StPublicLayout>
</template>
