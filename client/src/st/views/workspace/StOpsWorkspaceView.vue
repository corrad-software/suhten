<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import { useLocale } from "@/composables/useLocale";
import type { StMessageKey } from "@/i18n/st-messages";
import { OPS_MODULES, isOpsModuleCode } from "../../modules/catalog";
import {
  COMMITTEE_QUEUE,
  ORGANISATIONS,
  PAYMENTS,
  PUBLIC_USERS,
  SITE_VISITS,
  STAFF_USERS,
  opsScreenKey,
} from "../../mock/workspace";

const route = useRoute();
const { ts, locale } = useLocale();

const code = computed(() => {
  const meta = route.meta.moduleCode;
  return isOpsModuleCode(meta) ? meta : null;
});

const def = computed(() => (code.value ? OPS_MODULES[code.value] : null));
const screen = computed(() => (route.meta.opsScreen as string) || opsScreenKey(route.path));

const title = computed(() => {
  if (!code.value) return "";
  return ts(`st.mod.${code.value}` as StMessageKey);
});

const actRef = computed(() => {
  if (!def.value) return "";
  return locale.value === "bi" ? def.value.actRef.bi : def.value.actRef.bm;
});

const screenTitle = computed(() => {
  const map: Record<string, StMessageKey> = {
    "public-users": "st.ws.publicUsers",
    staff: "st.ws.staffUsers",
    organisations: "st.ws.organisations",
    access: "st.ws.access",
    payments: "st.ws.payments",
    reconciliation: "st.ws.reconciliation",
    "revenue-reports": "st.ws.revenueReports",
    schedule: "st.ws.schedule",
    inspections: "st.ws.inspections",
    "visit-reports": "st.ws.visitReports",
    queue: "st.ws.jkQueue",
    decisions: "st.ws.jkDecisions",
  };
  return ts(map[screen.value] ?? "st.ws.workspace");
});

const paymentTotals = computed(() => {
  const success = PAYMENTS.filter((p) => p.status === "success");
  return {
    count: success.length,
    amount: success.reduce((s, p) => s + p.amountRm, 0),
    pending: PAYMENTS.filter((p) => p.status === "pending").length,
    failed: PAYMENTS.filter((p) => p.status === "failed").length,
  };
});

const visitStats = computed(() => ({
  scheduled: SITE_VISITS.filter((v) => v.status === "scheduled").length,
  inProgress: SITE_VISITS.filter((v) => v.status === "in_progress").length,
  completed: SITE_VISITS.filter((v) => v.status === "completed").length,
}));

function fmt(iso: string): string {
  return new Date(iso).toLocaleString(locale.value === "bi" ? "en-MY" : "ms-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function money(n: number): string {
  return n.toLocaleString(locale.value === "bi" ? "en-MY" : "ms-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 0,
  });
}

function statusClass(s: string): string {
  const map: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    suspended: "bg-rose-100 text-rose-800",
    inactive: "bg-slate-100 text-slate-600",
    success: "bg-emerald-100 text-emerald-800",
    failed: "bg-rose-100 text-rose-800",
    scheduled: "bg-sky-100 text-sky-800",
    in_progress: "bg-amber-100 text-amber-800",
    completed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-slate-100 text-slate-600",
    queued: "bg-sky-100 text-sky-800",
    deferred: "bg-amber-100 text-amber-800",
    approved: "bg-emerald-100 text-emerald-800",
    rejected: "bg-rose-100 text-rose-800",
  };
  return map[s] ?? "bg-slate-100 text-slate-700";
}
</script>

<template>
  <div v-if="code && def" class="space-y-5">
    <div class="flex items-start gap-3">
      <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-50)]">
        <component :is="def.icon" class="h-5 w-5 text-[var(--accent-700)]" />
      </div>
      <div>
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="text-xl font-semibold text-slate-900">{{ screenTitle }}</h1>
          <span class="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">{{ code }}</span>
        </div>
        <p class="mt-0.5 text-sm text-slate-500">{{ title }}</p>
        <p class="mt-1 text-xs text-slate-400">{{ actRef }}</p>
      </div>
    </div>

    <p class="text-xs text-slate-400">{{ ts("st.common.mockNote") }}</p>

    <!-- PE-ID: public users -->
    <template v-if="screen === 'public-users'">
      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th class="px-4 py-3">{{ ts("st.common.applicant") }}</th>
              <th class="px-4 py-3">{{ ts("st.common.identity") }}</th>
              <th class="px-4 py-3">E-mel</th>
              <th class="px-4 py-3">{{ ts("st.common.type") }}</th>
              <th class="px-4 py-3">{{ ts("st.common.status") }}</th>
              <th class="px-4 py-3">{{ ts("st.ws.lastLogin") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="u in PUBLIC_USERS" :key="u.id" class="hover:bg-slate-50/80">
              <td class="px-4 py-3 font-medium">{{ u.name }}</td>
              <td class="px-4 py-3 font-mono text-xs">{{ u.identityNo }}</td>
              <td class="px-4 py-3 text-slate-600">{{ u.email }}</td>
              <td class="px-4 py-3">{{ u.role }}</td>
              <td class="px-4 py-3">
                <span :class="['rounded-full px-2.5 py-0.5 text-xs font-medium', statusClass(u.status)]">{{ u.status }}</span>
              </td>
              <td class="px-4 py-3 text-slate-500">{{ fmt(u.lastLoginAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- PE-ID: staff -->
    <template v-else-if="screen === 'staff'">
      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th class="px-4 py-3">{{ ts("st.common.officer") }}</th>
              <th class="px-4 py-3">ID</th>
              <th class="px-4 py-3">E-mel</th>
              <th class="px-4 py-3">{{ ts("st.common.type") }}</th>
              <th class="px-4 py-3">{{ ts("st.common.status") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="u in STAFF_USERS" :key="u.id" class="hover:bg-slate-50/80">
              <td class="px-4 py-3 font-medium">{{ u.name }}</td>
              <td class="px-4 py-3 font-mono text-xs">{{ u.identityNo }}</td>
              <td class="px-4 py-3 text-slate-600">{{ u.email }}</td>
              <td class="px-4 py-3">{{ u.role }}</td>
              <td class="px-4 py-3">
                <span :class="['rounded-full px-2.5 py-0.5 text-xs font-medium', statusClass(u.status)]">{{ u.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- PE-ID: organisations -->
    <template v-else-if="screen === 'organisations'">
      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th class="px-4 py-3">{{ ts("st.ws.orgName") }}</th>
              <th class="px-4 py-3">SSM</th>
              <th class="px-4 py-3">{{ ts("st.common.type") }}</th>
              <th class="px-4 py-3">{{ ts("st.ceApply.state") }}</th>
              <th class="px-4 py-3">{{ ts("st.common.status") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="o in ORGANISATIONS" :key="o.id" class="hover:bg-slate-50/80">
              <td class="px-4 py-3">
                <p class="font-medium">{{ o.name }}</p>
                <p class="text-xs text-slate-400">{{ o.contactEmail }}</p>
              </td>
              <td class="px-4 py-3 font-mono text-xs">{{ o.regNo }}</td>
              <td class="px-4 py-3">{{ o.type }}</td>
              <td class="px-4 py-3">{{ o.state }}</td>
              <td class="px-4 py-3">
                <span :class="['rounded-full px-2.5 py-0.5 text-xs font-medium', statusClass(o.status)]">{{ o.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- PE-ID: access -->
    <template v-else-if="screen === 'access'">
      <div class="grid gap-4 md:grid-cols-2">
        <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 class="text-sm font-semibold text-slate-800">{{ ts("st.ws.accessMatrix") }}</h2>
          <p class="mt-1 text-sm text-slate-500">{{ ts("st.ws.accessBody") }}</p>
          <ul class="mt-4 space-y-2 text-sm">
            <li class="flex justify-between border-b border-slate-100 py-2"><span>SOS</span><span class="text-slate-500">Inbox · Semakan awal</span></li>
            <li class="flex justify-between border-b border-slate-100 py-2"><span>Teknikal</span><span class="text-slate-500">Semakan domain</span></li>
            <li class="flex justify-between border-b border-slate-100 py-2"><span>Pelulus</span><span class="text-slate-500">Kelulusan · Tandatangan</span></li>
            <li class="flex justify-between py-2"><span>Admin</span><span class="text-slate-500">Konfigurasi · RBAC</span></li>
          </ul>
        </article>
        <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 class="text-sm font-semibold text-slate-800">{{ ts("st.ws.accessRequests") }}</h2>
          <ul class="mt-3 space-y-3 text-sm">
            <li class="rounded-lg bg-amber-50 px-3 py-2 text-amber-900">Razak — naik taraf LOA LC-LE (menunggu)</li>
            <li class="rounded-lg bg-slate-50 px-3 py-2 text-slate-700">Aina — akses PE-SV (diluluskan)</li>
          </ul>
        </article>
      </div>
    </template>

    <!-- PE-RV: payments -->
    <template v-else-if="screen === 'payments'">
      <div class="grid gap-3 sm:grid-cols-3">
        <div class="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p class="text-2xl font-bold text-slate-900">{{ money(paymentTotals.amount) }}</p>
          <p class="text-xs text-slate-500">{{ ts("st.ws.collected") }}</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p class="text-2xl font-bold text-amber-700">{{ paymentTotals.pending }}</p>
          <p class="text-xs text-slate-500">{{ ts("st.ws.pendingPay") }}</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p class="text-2xl font-bold text-rose-700">{{ paymentTotals.failed }}</p>
          <p class="text-xs text-slate-500">{{ ts("st.ws.failedPay") }}</p>
        </div>
      </div>
      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th class="px-4 py-3">{{ ts("st.ws.receipt") }}</th>
              <th class="px-4 py-3">{{ ts("st.common.refNo") }}</th>
              <th class="px-4 py-3">{{ ts("st.common.applicant") }}</th>
              <th class="px-4 py-3">{{ ts("st.common.module") }}</th>
              <th class="px-4 py-3">{{ ts("st.common.fee") }}</th>
              <th class="px-4 py-3">{{ ts("st.common.status") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="p in PAYMENTS" :key="p.id" class="hover:bg-slate-50/80">
              <td class="px-4 py-3 font-mono text-xs">{{ p.receiptNo }}</td>
              <td class="px-4 py-3 font-mono text-xs">{{ p.refNo }}</td>
              <td class="px-4 py-3">{{ p.payer }}</td>
              <td class="px-4 py-3">{{ p.moduleCode }} · {{ p.channel }}</td>
              <td class="px-4 py-3 font-medium">{{ money(p.amountRm) }}</td>
              <td class="px-4 py-3">
                <span :class="['rounded-full px-2.5 py-0.5 text-xs font-medium', statusClass(p.status)]">{{ p.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- PE-RV: reconciliation / reports -->
    <template v-else-if="screen === 'reconciliation' || screen === 'revenue-reports'">
      <div class="grid gap-4 lg:grid-cols-2">
        <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 class="text-sm font-semibold">{{ ts("st.ws.reconTitle") }}</h2>
          <p class="mt-1 text-sm text-slate-500">{{ ts("st.ws.reconBody") }}</p>
          <dl class="mt-4 space-y-2 text-sm">
            <div class="flex justify-between"><dt>{{ ts("st.ws.fpxTotal") }}</dt><dd class="font-semibold">{{ money(paymentTotals.amount) }}</dd></div>
            <div class="flex justify-between"><dt>{{ ts("st.ws.ledgerTotal") }}</dt><dd class="font-semibold">{{ money(paymentTotals.amount) }}</dd></div>
            <div class="flex justify-between text-emerald-700"><dt>{{ ts("st.ws.variance") }}</dt><dd class="font-semibold">{{ money(0) }}</dd></div>
          </dl>
        </article>
        <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 class="text-sm font-semibold">{{ ts("st.ws.byModule") }}</h2>
          <ul class="mt-3 space-y-2 text-sm">
            <li v-for="mod in ['RG-KE', 'RG-CE', 'LC-LE', 'CC-XE']" :key="mod" class="flex justify-between border-b border-slate-50 py-2">
              <span>{{ mod }}</span>
              <span class="font-medium">{{ money(PAYMENTS.filter((p) => p.moduleCode === mod && p.status === "success").reduce((s, p) => s + p.amountRm, 0)) }}</span>
            </li>
          </ul>
        </article>
      </div>
    </template>

    <!-- PE-SV -->
    <template v-else-if="screen === 'schedule' || screen === 'inspections' || screen === 'visit-reports'">
      <div class="grid gap-3 sm:grid-cols-3">
        <div class="rounded-xl border border-sky-200 bg-sky-50/80 px-4 py-3">
          <p class="text-2xl font-bold text-sky-700">{{ visitStats.scheduled }}</p>
          <p class="text-xs text-sky-800/80">{{ ts("st.ws.scheduled") }}</p>
        </div>
        <div class="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3">
          <p class="text-2xl font-bold text-amber-700">{{ visitStats.inProgress }}</p>
          <p class="text-xs text-amber-800/80">{{ ts("st.ws.inProgress") }}</p>
        </div>
        <div class="rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3">
          <p class="text-2xl font-bold text-emerald-700">{{ visitStats.completed }}</p>
          <p class="text-xs text-emerald-800/80">{{ ts("st.ws.completed") }}</p>
        </div>
      </div>
      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th class="px-4 py-3">{{ ts("st.common.refNo") }}</th>
              <th class="px-4 py-3">{{ ts("st.ws.site") }}</th>
              <th class="px-4 py-3">{{ ts("st.common.module") }}</th>
              <th class="px-4 py-3">{{ ts("st.common.officer") }}</th>
              <th class="px-4 py-3">{{ ts("st.common.date") }}</th>
              <th class="px-4 py-3">{{ ts("st.common.status") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="v in SITE_VISITS.filter((x) =>
                screen === 'schedule'
                  ? x.status === 'scheduled' || x.status === 'in_progress'
                  : screen === 'inspections'
                    ? x.status !== 'cancelled'
                    : true,
              )"
              :key="v.id"
              class="hover:bg-slate-50/80"
            >
              <td class="px-4 py-3 font-mono text-xs">{{ v.refNo }}</td>
              <td class="px-4 py-3">
                <p class="font-medium">{{ v.siteName }}</p>
                <p class="text-xs text-slate-400">{{ v.location }}</p>
                <p v-if="v.outcome && screen === 'visit-reports'" class="mt-1 text-xs text-slate-600">{{ v.outcome }}</p>
              </td>
              <td class="px-4 py-3">{{ v.moduleCode }}</td>
              <td class="px-4 py-3">{{ v.officer }}</td>
              <td class="px-4 py-3 text-slate-600">{{ fmt(v.scheduledAt) }}</td>
              <td class="px-4 py-3">
                <span :class="['rounded-full px-2.5 py-0.5 text-xs font-medium', statusClass(v.status)]">{{ v.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- PE-JK -->
    <template v-else-if="screen === 'queue' || screen === 'decisions'">
      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th class="px-4 py-3">{{ ts("st.common.refNo") }}</th>
              <th class="px-4 py-3">{{ ts("st.ws.agenda") }}</th>
              <th class="px-4 py-3">{{ ts("st.common.module") }}</th>
              <th class="px-4 py-3">{{ ts("st.ws.meeting") }}</th>
              <th class="px-4 py-3">{{ ts("st.common.status") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="item in COMMITTEE_QUEUE.filter((x) =>
                screen === 'queue' ? x.status === 'queued' || x.status === 'deferred' : x.status === 'approved' || x.status === 'rejected' || x.status === 'deferred',
              )"
              :key="item.id"
              class="hover:bg-slate-50/80"
            >
              <td class="px-4 py-3 font-mono text-xs">{{ item.refNo }}</td>
              <td class="px-4 py-3">
                <p class="font-medium">{{ item.title }}</p>
                <p v-if="item.chair" class="text-xs text-slate-400">{{ item.chair }}</p>
              </td>
              <td class="px-4 py-3">{{ item.moduleCode }}</td>
              <td class="px-4 py-3 text-slate-600">{{ fmt(item.meetingDate) }}</td>
              <td class="px-4 py-3">
                <span :class="['rounded-full px-2.5 py-0.5 text-xs font-medium', statusClass(item.status)]">{{ item.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>
