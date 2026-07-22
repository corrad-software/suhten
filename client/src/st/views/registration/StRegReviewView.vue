<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";

import { useLocale } from "@/composables/useLocale";
import { useStRegistrationStore } from "../../stores/registration";
import { appTypeLabel, useRegistrationModule } from "../../composables/useRegistrationModule";
import { slaLevel } from "../../sla";
import RegStatusBadge from "../../components/RegStatusBadge.vue";
import SlaIndicator from "../../components/SlaIndicator.vue";
import StPageHero from "../../components/StPageHero.vue";

const REVIEW_STATUSES = new Set([
  "sos_review",
  "technical_review",
  "pending_approval",
  "query_applicant",
]);

const router = useRouter();
const { ts, locale } = useLocale();
const regStore = useStRegistrationStore();
const { code, def, title } = useRegistrationModule();

const rows = computed(() => {
  if (!code.value) return [];
  return regStore
    .applicationsFor(code.value)
    .filter((a) => REVIEW_STATUSES.has(a.status))
    .sort((a, b) => new Date(a.stageEnteredAt).getTime() - new Date(b.stageEnteredAt).getTime());
});

const portalBase = computed(() => (router.currentRoute.value.path.startsWith("/admin/st") ? "/admin/st" : "/st"));

function openRow(id: string) {
  if (code.value === "RG-KE") {
    router.push(`${portalBase.value}/registration/ok-electric/applications/${id}`);
    return;
  }
  if (code.value === "RG-CE") {
    router.push(`${portalBase.value}/registration/contractor-electric/applications/${id}`);
  }
}

const slaCounts = computed(() => {
  const now = Date.now();
  const c = { green: 0, yellow: 0, red: 0 };
  for (const r of rows.value) {
    c[slaLevel(r.stageEnteredAt, r.slaTargetHours, now)]++;
  }
  return c;
});

function fmt(iso: string): string {
  return new Date(iso).toLocaleString(locale.value === "bi" ? "en-MY" : "ms-MY", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<template>
  <div v-if="code && def" class="space-y-8">
    <StPageHero :title="ts('st.reg.review')" :subtitle="`${title} · ${ts('st.reg.reviewSubtitle')}`">
      <div class="mt-2 flex flex-wrap items-center gap-2">
        <span class="rounded-md bg-slate-100 dark:bg-slate-700 px-2 py-0.5 font-mono text-xs text-slate-600 dark:text-slate-400">{{ code }}</span>
      </div>
    </StPageHero>

    <p class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.common.mockNote") }}</p>

    <div class="flex flex-wrap gap-3 text-xs">
      <span class="flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 px-3 py-1 font-medium text-emerald-700 dark:text-emerald-400">
        <span class="h-2 w-2 rounded-full bg-emerald-500" /> {{ ts("st.inbox.slaGreen") }}: {{ slaCounts.green }}
      </span>
      <span class="flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-500/15 px-3 py-1 font-medium text-amber-700 dark:text-amber-400">
        <span class="h-2 w-2 rounded-full bg-amber-500" /> {{ ts("st.inbox.slaYellow") }}: {{ slaCounts.yellow }}
      </span>
      <span class="flex items-center gap-1.5 rounded-full bg-rose-50 dark:bg-rose-500/15 px-3 py-1 font-medium text-rose-700 dark:text-rose-400">
        <span class="h-2 w-2 rounded-full bg-rose-500" /> {{ ts("st.inbox.slaRed") }}: {{ slaCounts.red }}
      </span>
    </div>

    <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
      <h2 class="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{{ ts("st.reg.reviewTitle") }}</h2>
      <p v-if="rows.length === 0" class="py-12 text-center text-sm text-slate-400 dark:text-slate-500">{{ ts("st.reg.reviewEmpty") }}</p>
      <div v-else class="divide-y divide-slate-100 dark:divide-slate-800">
        <article
          v-for="(row, i) in rows"
          :key="row.id"
          class="flex flex-wrap items-center gap-4 py-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/60"
        >
          <span class="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400" :title="ts('st.common.fifo')">
            {{ i + 1 }}
          </span>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-mono text-xs text-slate-700 dark:text-slate-300">{{ row.refNo }}</span>
              <RegStatusBadge :status="row.status" />
            </div>
            <p class="mt-0.5 text-sm font-medium text-slate-900 dark:text-slate-100">{{ row.applicantName }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              {{ appTypeLabel(row.appType, ts) }}
              <span v-if="row.assignedOfficer"> · {{ ts("st.common.officer") }}: {{ row.assignedOfficer }}</span>
              <span v-if="row.note"> · {{ row.note }}</span>
            </p>
          </div>
          <div class="text-right">
            <SlaIndicator :stage-entered-at="row.stageEnteredAt" :target-hours="row.slaTargetHours" role="sos" />
            <p class="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{{ fmt(row.stageEnteredAt) }}</p>
          </div>
          <button
            type="button"
            class="rounded-md bg-[var(--accent-600)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--accent-700)]"
            @click="openRow(row.id)"
          >
            {{ ts("st.common.open") }}
          </button>
        </article>
      </div>
    </div>
  </div>
</template>
