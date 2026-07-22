<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import { useLocale } from "@/composables/useLocale";
import type { StMessageKey } from "@/i18n/st-messages";
import {
  AUDIT_EVENTS,
  FEE_SCHEDULE,
  INTEGRATIONS,
  NOTIF_TEMPLATES,
  RBAC_ROLES,
  REF_TABLES,
  WORKFLOW_LOA,
  adminScreenKey,
} from "../../mock/workspace";
import type { SmartTableColumn } from "../../composables/useSmartTable";
import SmartTable from "../../components/SmartTable.vue";
import StPageHero from "../../components/StPageHero.vue";

const route = useRoute();
const { ts, locale } = useLocale();

const screen = computed(() => (route.meta.adminScreen as string) || adminScreenKey(route.path));

const titleKey = computed<StMessageKey>(() => {
  const map: Record<string, StMessageKey> = {
    "admin-ref-tables": "st.ws.adminRef",
    "admin-fees": "st.ws.adminFees",
    "admin-notifications": "st.ws.adminNotif",
    "admin-workflow": "st.ws.adminWorkflow",
    "admin-roles": "st.ws.adminRoles",
    "admin-permissions": "st.ws.adminPerms",
    "admin-audit": "st.ws.adminAudit",
    "admin-integrations": "st.ws.adminIntegrations",
  };
  return map[screen.value] ?? "st.ws.workspace";
});

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString(locale.value === "bi" ? "en-MY" : "ms-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fmtDt(iso: string): string {
  return new Date(iso).toLocaleString(locale.value === "bi" ? "en-MY" : "ms-MY", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function money(n: number): string {
  return `RM ${n.toLocaleString()}`;
}

function integClass(s: string): string {
  if (s === "connected") return "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400";
  if (s === "planned") return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400";
  return "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400";
}

type RefTableRow = (typeof REF_TABLES)[number];
const refTableColumns = computed<SmartTableColumn<RefTableRow>[]>(() => [
  { key: "name", label: ts("st.ws.tableName"), value: (t) => (locale.value === "bi" ? t.nameBi : t.nameBm) },
  { key: "rows", label: ts("st.ws.rows"), value: (t) => String(t.rows) },
  { key: "updated", label: ts("st.ws.updated"), value: (t) => fmt(t.updatedAt) },
]);

type FeeRow = (typeof FEE_SCHEDULE)[number];
const feeColumns = computed<SmartTableColumn<FeeRow>[]>(() => [
  { key: "code", label: ts("st.common.module"), value: (f) => f.code },
  { key: "item", label: ts("st.ws.feeItem"), value: (f) => (locale.value === "bi" ? f.itemBi : f.itemBm) },
  { key: "fee", label: ts("st.common.fee"), value: (f) => money(f.amountRm) },
]);

type NotifRow = (typeof NOTIF_TEMPLATES)[number];
const notifColumns = computed<SmartTableColumn<NotifRow>[]>(() => [
  { key: "code", label: "Kod", value: (n) => n.code },
  { key: "template", label: ts("st.ws.template"), value: (n) => (locale.value === "bi" ? n.nameBi : n.nameBm) },
  { key: "channel", label: ts("st.ws.channel"), value: (n) => n.channel },
]);

type WorkflowRow = (typeof WORKFLOW_LOA)[number];
const workflowColumns = computed<SmartTableColumn<WorkflowRow>[]>(() => [
  { key: "module", label: ts("st.common.module"), value: (w) => w.module },
  { key: "stage", label: ts("st.ws.stage"), value: (w) => (locale.value === "bi" ? w.stageBi : w.stageBm) },
  { key: "loa", label: "LOA", value: (w) => String(w.loa) },
  { key: "sla", label: "SLA (jam)", value: (w) => String(w.slaHours) },
]);

type RoleRow = (typeof RBAC_ROLES)[number];
const roleColumns = computed<SmartTableColumn<RoleRow>[]>(() => [
  { key: "name", label: ts("st.ws.role"), value: (r) => r.name },
  { key: "users", label: ts("st.ws.users"), value: (r) => String(r.users) },
  { key: "scope", label: ts("st.ws.scope"), value: (r) => r.modules },
]);

type AuditRow = (typeof AUDIT_EVENTS)[number];
const auditColumns = computed<SmartTableColumn<AuditRow>[]>(() => [
  { key: "date", label: ts("st.common.date"), value: (e) => fmtDt(e.at) },
  { key: "actor", label: ts("st.ws.actor"), value: (e) => e.actor },
  { key: "action", label: ts("st.ws.action"), value: (e) => `${e.action} ${e.detail}` },
  { key: "refNo", label: ts("st.common.refNo"), value: (e) => e.refNo },
]);
</script>

<template>
  <div class="space-y-8">
    <StPageHero :title="ts(titleKey)" :subtitle="ts('st.ws.adminSubtitle')">
      <div class="mt-2 flex flex-wrap items-center gap-2">
        <span class="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-400">ADMIN</span>
      </div>
    </StPageHero>

    <p class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.common.mockNote") }}</p>

    <template v-if="screen === 'admin-ref-tables'">
      <SmartTable :rows="REF_TABLES" :columns="refTableColumns" :row-key="(t) => t.id" :empty-text="ts('st.common.noResults')" />
    </template>

    <template v-else-if="screen === 'admin-fees'">
      <SmartTable :rows="FEE_SCHEDULE" :columns="feeColumns" :row-key="(f) => `${f.code}-${f.itemBm}`" :empty-text="ts('st.common.noResults')">
        <template #cell-code="{ row }">
          <span class="font-mono text-xs">{{ row.code }}</span>
        </template>
        <template #cell-fee="{ row }">
          <span class="font-semibold">{{ money(row.amountRm) }}</span>
        </template>
      </SmartTable>
    </template>

    <template v-else-if="screen === 'admin-notifications'">
      <SmartTable :rows="NOTIF_TEMPLATES" :columns="notifColumns" :row-key="(n) => n.id" :empty-text="ts('st.common.noResults')">
        <template #cell-code="{ row }">
          <span class="font-mono text-xs">{{ row.code }}</span>
        </template>
        <template #cell-template="{ row }">
          <span class="font-medium">{{ locale === "bi" ? row.nameBi : row.nameBm }}</span>
        </template>
      </SmartTable>
    </template>

    <template v-else-if="screen === 'admin-workflow'">
      <SmartTable :rows="WORKFLOW_LOA" :columns="workflowColumns" :row-key="(w) => w.id" :empty-text="ts('st.common.noResults')">
        <template #cell-module="{ row }">
          <span class="font-mono text-xs">{{ row.module }}</span>
        </template>
      </SmartTable>
    </template>

    <template v-else-if="screen === 'admin-roles' || screen === 'admin-permissions'">
      <SmartTable :rows="RBAC_ROLES" :columns="roleColumns" :row-key="(r) => r.id" :empty-text="ts('st.common.noResults')">
        <template #cell-scope="{ row }">
          <span class="text-slate-600 dark:text-slate-400">{{ row.modules }}</span>
        </template>
      </SmartTable>
      <p v-if="screen === 'admin-permissions'" class="mt-3 text-sm text-slate-500 dark:text-slate-400">{{ ts("st.ws.permsNote") }}</p>
    </template>

    <template v-else-if="screen === 'admin-audit'">
      <SmartTable :rows="AUDIT_EVENTS" :columns="auditColumns" :row-key="(e) => e.id" :empty-text="ts('st.common.noResults')">
        <template #cell-action="{ row }">
          <p class="font-mono text-xs">{{ row.action }}</p>
          <p class="text-xs text-slate-400 dark:text-slate-500">{{ row.detail }}</p>
        </template>
        <template #cell-refNo="{ row }">
          <span class="font-mono text-xs">{{ row.refNo }}</span>
        </template>
      </SmartTable>
    </template>

    <template v-else>
      <div>
        <div
          v-for="i in INTEGRATIONS"
          :key="i.id"
          class="flex items-center justify-between gap-3 border-b border-slate-100 py-3 last:border-0 dark:border-slate-800"
        >
          <div>
            <h2 class="text-sm font-semibold text-slate-800 dark:text-slate-200">{{ i.name }}</h2>
            <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {{ ts("st.ws.lastSync") }}: {{ i.status === "planned" ? "—" : fmtDt(i.lastSync) }}
            </p>
          </div>
          <span :class="['rounded-full px-2.5 py-0.5 text-xs font-medium', integClass(i.status)]">
            {{ i.status }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>
