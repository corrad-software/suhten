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
import type { SmartTableColumn } from "../../composables/useSmartTable";
import SmartTable from "../../components/SmartTable.vue";

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

type IdentityUserRow = (typeof PUBLIC_USERS)[number];
const publicUserColumns = computed<SmartTableColumn<IdentityUserRow>[]>(() => [
  { key: "name", label: ts("st.common.applicant"), value: (u) => u.name },
  { key: "identity", label: ts("st.common.identity"), value: (u) => u.identityNo },
  { key: "email", label: "E-mel", value: (u) => u.email },
  { key: "role", label: ts("st.common.type"), value: (u) => u.role },
  { key: "status", label: ts("st.common.status"), value: (u) => u.status },
  { key: "lastLogin", label: ts("st.ws.lastLogin"), value: (u) => fmt(u.lastLoginAt) },
]);

const staffColumns = computed<SmartTableColumn<IdentityUserRow>[]>(() => [
  { key: "name", label: ts("st.common.officer"), value: (u) => u.name },
  { key: "identity", label: "ID", value: (u) => u.identityNo },
  { key: "email", label: "E-mel", value: (u) => u.email },
  { key: "role", label: ts("st.common.type"), value: (u) => u.role },
  { key: "status", label: ts("st.common.status"), value: (u) => u.status },
]);

type OrganisationRow = (typeof ORGANISATIONS)[number];
const organisationColumns = computed<SmartTableColumn<OrganisationRow>[]>(() => [
  { key: "name", label: ts("st.ws.orgName"), value: (o) => o.name },
  { key: "regNo", label: "SSM", value: (o) => o.regNo },
  { key: "type", label: ts("st.common.type"), value: (o) => o.type },
  { key: "state", label: ts("st.ceApply.state"), value: (o) => o.state },
  { key: "status", label: ts("st.common.status"), value: (o) => o.status },
]);

type PaymentRowT = (typeof PAYMENTS)[number];
const paymentColumns = computed<SmartTableColumn<PaymentRowT>[]>(() => [
  { key: "receipt", label: ts("st.ws.receipt"), value: (p) => p.receiptNo },
  { key: "refNo", label: ts("st.common.refNo"), value: (p) => p.refNo },
  { key: "payer", label: ts("st.common.applicant"), value: (p) => p.payer },
  { key: "module", label: ts("st.common.module"), value: (p) => `${p.moduleCode} ${p.channel}` },
  { key: "fee", label: ts("st.common.fee"), value: (p) => money(p.amountRm) },
  { key: "status", label: ts("st.common.status"), value: (p) => p.status },
]);

const visitRows = computed(() =>
  SITE_VISITS.filter((x) =>
    screen.value === "schedule"
      ? x.status === "scheduled" || x.status === "in_progress"
      : screen.value === "inspections"
        ? x.status !== "cancelled"
        : true,
  ),
);

type SiteVisitRow = (typeof SITE_VISITS)[number];
const visitColumns = computed<SmartTableColumn<SiteVisitRow>[]>(() => [
  { key: "refNo", label: ts("st.common.refNo"), value: (v) => v.refNo },
  { key: "site", label: ts("st.ws.site"), value: (v) => v.siteName },
  { key: "module", label: ts("st.common.module"), value: (v) => v.moduleCode },
  { key: "officer", label: ts("st.common.officer"), value: (v) => v.officer },
  { key: "date", label: ts("st.common.date"), value: (v) => fmt(v.scheduledAt) },
  { key: "status", label: ts("st.common.status"), value: (v) => v.status },
]);

const committeeRows = computed(() =>
  COMMITTEE_QUEUE.filter((x) =>
    screen.value === "queue"
      ? x.status === "queued" || x.status === "deferred"
      : x.status === "approved" || x.status === "rejected" || x.status === "deferred",
  ),
);

type CommitteeRow = (typeof COMMITTEE_QUEUE)[number];
const committeeColumns = computed<SmartTableColumn<CommitteeRow>[]>(() => [
  { key: "refNo", label: ts("st.common.refNo"), value: (item) => item.refNo },
  { key: "agenda", label: ts("st.ws.agenda"), value: (item) => item.title },
  { key: "module", label: ts("st.common.module"), value: (item) => item.moduleCode },
  { key: "meeting", label: ts("st.ws.meeting"), value: (item) => fmt(item.meetingDate) },
  { key: "status", label: ts("st.common.status"), value: (item) => item.status },
]);
</script>

<template>
  <div v-if="code && def" class="space-y-8">
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
      <SmartTable :rows="PUBLIC_USERS" :columns="publicUserColumns" :row-key="(u) => u.id">
        <template #cell-identity="{ row }">
          <span class="font-mono text-xs">{{ row.identityNo }}</span>
        </template>
        <template #cell-email="{ row }">
          <span class="text-slate-600">{{ row.email }}</span>
        </template>
        <template #cell-status="{ row }">
          <span :class="['rounded-full px-2.5 py-0.5 text-xs font-medium', statusClass(row.status)]">{{ row.status }}</span>
        </template>
        <template #cell-lastLogin="{ row }">
          <span class="text-slate-500">{{ fmt(row.lastLoginAt) }}</span>
        </template>
      </SmartTable>
    </template>

    <!-- PE-ID: staff -->
    <template v-else-if="screen === 'staff'">
      <SmartTable :rows="STAFF_USERS" :columns="staffColumns" :row-key="(u) => u.id">
        <template #cell-identity="{ row }">
          <span class="font-mono text-xs">{{ row.identityNo }}</span>
        </template>
        <template #cell-email="{ row }">
          <span class="text-slate-600">{{ row.email }}</span>
        </template>
        <template #cell-status="{ row }">
          <span :class="['rounded-full px-2.5 py-0.5 text-xs font-medium', statusClass(row.status)]">{{ row.status }}</span>
        </template>
      </SmartTable>
    </template>

    <!-- PE-ID: organisations -->
    <template v-else-if="screen === 'organisations'">
      <SmartTable :rows="ORGANISATIONS" :columns="organisationColumns" :row-key="(o) => o.id">
        <template #cell-name="{ row }">
          <p class="font-medium">{{ row.name }}</p>
          <p class="text-xs text-slate-400">{{ row.contactEmail }}</p>
        </template>
        <template #cell-regNo="{ row }">
          <span class="font-mono text-xs">{{ row.regNo }}</span>
        </template>
        <template #cell-status="{ row }">
          <span :class="['rounded-full px-2.5 py-0.5 text-xs font-medium', statusClass(row.status)]">{{ row.status }}</span>
        </template>
      </SmartTable>
    </template>

    <!-- PE-ID: access -->
    <template v-else-if="screen === 'access'">
      <div class="grid gap-6 md:grid-cols-2 md:divide-x md:divide-slate-200">
        <div>
          <h2 class="text-sm font-semibold text-slate-800">{{ ts("st.ws.accessMatrix") }}</h2>
          <p class="mt-1 text-sm text-slate-500">{{ ts("st.ws.accessBody") }}</p>
          <ul class="mt-4 space-y-2 text-sm">
            <li class="flex justify-between border-b border-slate-100 py-2"><span>SOS</span><span class="text-slate-500">Inbox · Semakan awal</span></li>
            <li class="flex justify-between border-b border-slate-100 py-2"><span>Teknikal</span><span class="text-slate-500">Semakan domain</span></li>
            <li class="flex justify-between border-b border-slate-100 py-2"><span>Pelulus</span><span class="text-slate-500">Kelulusan · Tandatangan</span></li>
            <li class="flex justify-between py-2"><span>Admin</span><span class="text-slate-500">Konfigurasi · RBAC</span></li>
          </ul>
        </div>
        <div class="md:pl-6">
          <h2 class="text-sm font-semibold text-slate-800">{{ ts("st.ws.accessRequests") }}</h2>
          <ul class="mt-3 space-y-3 text-sm">
            <li class="rounded-lg bg-amber-50 px-3 py-2 text-amber-900">Razak — naik taraf LOA LC-LE (menunggu)</li>
            <li class="rounded-lg bg-slate-50 px-3 py-2 text-slate-700">Aina — akses PE-SV (diluluskan)</li>
          </ul>
        </div>
      </div>
    </template>

    <!-- PE-RV: payments -->
    <template v-else-if="screen === 'payments'">
      <div class="grid grid-cols-3 gap-y-4 sm:divide-x sm:divide-slate-200">
        <div class="px-0 sm:px-5 sm:first:pl-0">
          <p class="text-2xl font-bold text-slate-900">{{ money(paymentTotals.amount) }}</p>
          <p class="text-xs text-slate-500">{{ ts("st.ws.collected") }}</p>
        </div>
        <div class="px-0 sm:px-5">
          <p class="text-2xl font-bold text-amber-700">{{ paymentTotals.pending }}</p>
          <p class="text-xs text-slate-500">{{ ts("st.ws.pendingPay") }}</p>
        </div>
        <div class="px-0 sm:px-5">
          <p class="text-2xl font-bold text-rose-700">{{ paymentTotals.failed }}</p>
          <p class="text-xs text-slate-500">{{ ts("st.ws.failedPay") }}</p>
        </div>
      </div>
      <div class="border-t border-slate-200 pt-6">
        <SmartTable :rows="PAYMENTS" :columns="paymentColumns" :row-key="(p) => p.id">
          <template #cell-receipt="{ row }">
            <span class="font-mono text-xs">{{ row.receiptNo }}</span>
          </template>
          <template #cell-refNo="{ row }">
            <span class="font-mono text-xs">{{ row.refNo }}</span>
          </template>
          <template #cell-module="{ row }">
            <span>{{ row.moduleCode }} · {{ row.channel }}</span>
          </template>
          <template #cell-fee="{ row }">
            <span class="font-medium">{{ money(row.amountRm) }}</span>
          </template>
          <template #cell-status="{ row }">
            <span :class="['rounded-full px-2.5 py-0.5 text-xs font-medium', statusClass(row.status)]">{{ row.status }}</span>
          </template>
        </SmartTable>
      </div>
    </template>

    <!-- PE-RV: reconciliation / reports -->
    <template v-else-if="screen === 'reconciliation' || screen === 'revenue-reports'">
      <div class="grid gap-6 lg:grid-cols-2 lg:divide-x lg:divide-slate-200">
        <div>
          <h2 class="text-sm font-semibold">{{ ts("st.ws.reconTitle") }}</h2>
          <p class="mt-1 text-sm text-slate-500">{{ ts("st.ws.reconBody") }}</p>
          <dl class="mt-4 space-y-2 text-sm">
            <div class="flex justify-between"><dt>{{ ts("st.ws.fpxTotal") }}</dt><dd class="font-semibold">{{ money(paymentTotals.amount) }}</dd></div>
            <div class="flex justify-between"><dt>{{ ts("st.ws.ledgerTotal") }}</dt><dd class="font-semibold">{{ money(paymentTotals.amount) }}</dd></div>
            <div class="flex justify-between text-emerald-700"><dt>{{ ts("st.ws.variance") }}</dt><dd class="font-semibold">{{ money(0) }}</dd></div>
          </dl>
        </div>
        <div class="lg:pl-6">
          <h2 class="text-sm font-semibold">{{ ts("st.ws.byModule") }}</h2>
          <ul class="mt-3 space-y-2 text-sm">
            <li v-for="mod in ['RG-KE', 'RG-CE', 'LC-LE', 'CC-XE']" :key="mod" class="flex justify-between border-b border-slate-50 py-2">
              <span>{{ mod }}</span>
              <span class="font-medium">{{ money(PAYMENTS.filter((p) => p.moduleCode === mod && p.status === "success").reduce((s, p) => s + p.amountRm, 0)) }}</span>
            </li>
          </ul>
        </div>
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
      <div class="border-t border-slate-200 pt-6">
        <SmartTable :rows="visitRows" :columns="visitColumns" :row-key="(v) => v.id">
          <template #cell-refNo="{ row }">
            <span class="font-mono text-xs">{{ row.refNo }}</span>
          </template>
          <template #cell-site="{ row }">
            <p class="font-medium">{{ row.siteName }}</p>
            <p class="text-xs text-slate-400">{{ row.location }}</p>
            <p v-if="row.outcome && screen === 'visit-reports'" class="mt-1 text-xs text-slate-600">{{ row.outcome }}</p>
          </template>
          <template #cell-date="{ row }">
            <span class="text-slate-600">{{ fmt(row.scheduledAt) }}</span>
          </template>
          <template #cell-status="{ row }">
            <span :class="['rounded-full px-2.5 py-0.5 text-xs font-medium', statusClass(row.status)]">{{ row.status }}</span>
          </template>
        </SmartTable>
      </div>
    </template>

    <!-- PE-JK -->
    <template v-else-if="screen === 'queue' || screen === 'decisions'">
      <SmartTable :rows="committeeRows" :columns="committeeColumns" :row-key="(item) => item.id">
        <template #cell-refNo="{ row }">
          <span class="font-mono text-xs">{{ row.refNo }}</span>
        </template>
        <template #cell-agenda="{ row }">
          <p class="font-medium">{{ row.title }}</p>
          <p v-if="row.chair" class="text-xs text-slate-400">{{ row.chair }}</p>
        </template>
        <template #cell-meeting="{ row }">
          <span class="text-slate-600">{{ fmt(row.meetingDate) }}</span>
        </template>
        <template #cell-status="{ row }">
          <span :class="['rounded-full px-2.5 py-0.5 text-xs font-medium', statusClass(row.status)]">{{ row.status }}</span>
        </template>
      </SmartTable>
    </template>
  </div>
</template>
