<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { Settings } from "lucide-vue-next";

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
  if (s === "connected") return "bg-emerald-100 text-emerald-800";
  if (s === "planned") return "bg-slate-100 text-slate-600";
  return "bg-amber-100 text-amber-800";
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-start gap-3">
      <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-50)]">
        <Settings class="h-5 w-5 text-[var(--accent-700)]" />
      </div>
      <div>
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="text-xl font-semibold text-slate-900">{{ ts(titleKey) }}</h1>
          <span class="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">ADMIN</span>
        </div>
        <p class="mt-0.5 text-sm text-slate-500">{{ ts("st.ws.adminSubtitle") }}</p>
      </div>
    </div>

    <p class="text-xs text-slate-400">{{ ts("st.common.mockNote") }}</p>

    <template v-if="screen === 'admin-ref-tables'">
      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th class="px-4 py-3">{{ ts("st.ws.tableName") }}</th>
              <th class="px-4 py-3">{{ ts("st.ws.rows") }}</th>
              <th class="px-4 py-3">{{ ts("st.ws.updated") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="t in REF_TABLES" :key="t.id" class="hover:bg-slate-50/80">
              <td class="px-4 py-3 font-medium">{{ locale === "bi" ? t.nameBi : t.nameBm }}</td>
              <td class="px-4 py-3">{{ t.rows }}</td>
              <td class="px-4 py-3 text-slate-500">{{ fmt(t.updatedAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template v-else-if="screen === 'admin-fees'">
      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th class="px-4 py-3">{{ ts("st.common.module") }}</th>
              <th class="px-4 py-3">{{ ts("st.ws.feeItem") }}</th>
              <th class="px-4 py-3">{{ ts("st.common.fee") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="(f, i) in FEE_SCHEDULE" :key="i" class="hover:bg-slate-50/80">
              <td class="px-4 py-3 font-mono text-xs">{{ f.code }}</td>
              <td class="px-4 py-3">{{ locale === "bi" ? f.itemBi : f.itemBm }}</td>
              <td class="px-4 py-3 font-semibold">{{ money(f.amountRm) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template v-else-if="screen === 'admin-notifications'">
      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th class="px-4 py-3">Kod</th>
              <th class="px-4 py-3">{{ ts("st.ws.template") }}</th>
              <th class="px-4 py-3">{{ ts("st.ws.channel") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="n in NOTIF_TEMPLATES" :key="n.id" class="hover:bg-slate-50/80">
              <td class="px-4 py-3 font-mono text-xs">{{ n.code }}</td>
              <td class="px-4 py-3 font-medium">{{ locale === "bi" ? n.nameBi : n.nameBm }}</td>
              <td class="px-4 py-3">{{ n.channel }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template v-else-if="screen === 'admin-workflow'">
      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th class="px-4 py-3">{{ ts("st.common.module") }}</th>
              <th class="px-4 py-3">{{ ts("st.ws.stage") }}</th>
              <th class="px-4 py-3">LOA</th>
              <th class="px-4 py-3">SLA (jam)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="w in WORKFLOW_LOA" :key="w.id" class="hover:bg-slate-50/80">
              <td class="px-4 py-3 font-mono text-xs">{{ w.module }}</td>
              <td class="px-4 py-3">{{ locale === "bi" ? w.stageBi : w.stageBm }}</td>
              <td class="px-4 py-3">{{ w.loa }}</td>
              <td class="px-4 py-3">{{ w.slaHours }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template v-else-if="screen === 'admin-roles' || screen === 'admin-permissions'">
      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th class="px-4 py-3">{{ ts("st.ws.role") }}</th>
              <th class="px-4 py-3">{{ ts("st.ws.users") }}</th>
              <th class="px-4 py-3">{{ ts("st.ws.scope") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="r in RBAC_ROLES" :key="r.id" class="hover:bg-slate-50/80">
              <td class="px-4 py-3 font-medium">{{ r.name }}</td>
              <td class="px-4 py-3">{{ r.users }}</td>
              <td class="px-4 py-3 text-slate-600">{{ r.modules }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="screen === 'admin-permissions'" class="text-sm text-slate-500">{{ ts("st.ws.permsNote") }}</p>
    </template>

    <template v-else-if="screen === 'admin-audit'">
      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th class="px-4 py-3">{{ ts("st.common.date") }}</th>
              <th class="px-4 py-3">{{ ts("st.ws.actor") }}</th>
              <th class="px-4 py-3">{{ ts("st.ws.action") }}</th>
              <th class="px-4 py-3">{{ ts("st.common.refNo") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="e in AUDIT_EVENTS" :key="e.id">
              <td class="px-4 py-3 text-slate-600">{{ fmtDt(e.at) }}</td>
              <td class="px-4 py-3">{{ e.actor }}</td>
              <td class="px-4 py-3">
                <p class="font-mono text-xs">{{ e.action }}</p>
                <p class="text-xs text-slate-400">{{ e.detail }}</p>
              </td>
              <td class="px-4 py-3 font-mono text-xs">{{ e.refNo }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template v-else>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="i in INTEGRATIONS"
          :key="i.id"
          class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div class="flex items-start justify-between gap-2">
            <h2 class="text-sm font-semibold text-slate-800">{{ i.name }}</h2>
            <span :class="['rounded-full px-2.5 py-0.5 text-xs font-medium', integClass(i.status)]">
              {{ i.status }}
            </span>
          </div>
          <p class="mt-3 text-xs text-slate-500">
            {{ ts("st.ws.lastSync") }}: {{ i.status === "planned" ? "—" : fmtDt(i.lastSync) }}
          </p>
        </article>
      </div>
    </template>
  </div>
</template>
