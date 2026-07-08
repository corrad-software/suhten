<script setup lang="ts">
import { computed } from "vue";
import { Inbox } from "lucide-vue-next";

import { useStSessionStore } from "../stores/session";
import { ROLE_LABEL } from "../mock/personas";
import { SLA_TARGET_HOURS } from "../mock/charter";
import TaskInboxTable from "../components/TaskInboxTable.vue";

const session = useStSessionStore();
const role = computed(() => session.role);
const slaTarget = computed(() => (role.value ? SLA_TARGET_HOURS[role.value] : undefined));

// SOS measures the charter in hours; technical/approver in days as % of charter.
const usesPercent = computed(() => role.value === "technical" || role.value === "approver");
</script>

<template>
  <div v-if="role" class="space-y-5">
    <div class="flex items-center gap-3">
      <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-50)]">
        <Inbox class="h-5 w-5 text-[var(--accent-700)]" />
      </div>
      <div>
        <h1 class="text-xl font-semibold text-slate-900">Peti Tugasan</h1>
        <p class="text-sm text-slate-500">
          {{ ROLE_LABEL[role] }}
          <span v-if="slaTarget"> · Piagam Pelanggan: {{ usesPercent ? `${(slaTarget / 24).toFixed(0)} hari` : `${slaTarget} jam` }} setiap permohonan</span>
        </p>
      </div>
    </div>

    <TaskInboxTable :role="role" />

    <div class="flex flex-wrap items-center gap-4 rounded-lg bg-white px-4 py-3 text-xs text-slate-500 shadow-sm">
      <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Dalam tempoh (&lt; {{ usesPercent ? "70%" : "50%" }})</span>
      <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-amber-500" /> Hampir tamat ({{ usesPercent ? "70–100%" : "50–100%" }})</span>
      <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-rose-500" /> Melebihi tempoh</span>
      <span class="ml-auto">Giliran disusun FIFO · Had 3 tugasan aktif</span>
    </div>
  </div>
</template>
