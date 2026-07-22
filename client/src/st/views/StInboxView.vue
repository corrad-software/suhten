<script setup lang="ts">
import { computed, onMounted } from "vue";
import { Inbox } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import { useStSessionStore } from "../stores/session";
import { useStWorkflowStore } from "../stores/workflow";
import { ROLE_LABEL } from "../mock/personas";
import { SLA_TARGET_HOURS, SOS_ESCALATE_AFTER_HOURS } from "../mock/charter";
import { isTechnicalRole, isTpSosRole } from "../staff-roles";
import TaskInboxTable from "../components/TaskInboxTable.vue";
import TpSosEscalationPanel from "../components/TpSosEscalationPanel.vue";

const session = useStSessionStore();
const workflow = useStWorkflowStore();
const { ts } = useLocale();
const role = computed(() => session.role);
const slaTarget = computed(() => (role.value ? SLA_TARGET_HOURS[role.value] : undefined));
const isTp = computed(() => isTpSosRole(role.value));

// SOS measures the charter in hours; technical/approver in days as % of charter.
const usesPercent = computed(() => isTechnicalRole(role.value) || role.value === "approver");

const charterLine = computed(() => {
  if (isTp.value) {
    return ts("st.inbox.tpCharter", { n: SOS_ESCALATE_AFTER_HOURS });
  }
  if (!slaTarget.value) return "";
  if (usesPercent.value) {
    return ts("st.inbox.charterDays", { n: (slaTarget.value / 24).toFixed(0) });
  }
  return ts("st.inbox.charterHours", { n: slaTarget.value });
});

onMounted(() => {
  if (isTp.value) workflow.syncSosEscalationFlags();
});
</script>

<template>
  <div v-if="role" class="space-y-5">
    <div class="flex items-center gap-3">
      <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-50)]">
        <Inbox class="h-5 w-5 text-[var(--accent-700)]" />
      </div>
      <div>
        <h1 class="text-xl font-semibold text-slate-900">{{ ts("st.inbox.title") }}</h1>
        <p class="text-sm text-slate-500">
          {{ ROLE_LABEL[role] }}
          <span v-if="charterLine"> · {{ charterLine }}</span>
        </p>
      </div>
    </div>

    <TpSosEscalationPanel v-if="isTp" />
    <template v-else>
      <TaskInboxTable :role="role" />

      <div class="flex flex-wrap items-center gap-4 rounded-lg bg-white px-4 py-3 text-xs text-slate-500 shadow-sm">
        <span class="flex items-center gap-1.5">
          <span class="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          {{ ts("st.inbox.slaGreen") }} (&lt; {{ usesPercent ? "70%" : "50%" }})
        </span>
        <span class="flex items-center gap-1.5">
          <span class="h-2.5 w-2.5 rounded-full bg-amber-500" />
          {{ ts("st.inbox.slaYellow") }} ({{ usesPercent ? "70–100%" : "50–100%" }})
        </span>
        <span class="flex items-center gap-1.5">
          <span class="h-2.5 w-2.5 rounded-full bg-rose-500" />
          {{ ts("st.inbox.slaRed") }}
        </span>
        <span class="ml-auto">{{ ts("st.inbox.fifoHint") }}</span>
      </div>
    </template>
  </div>
</template>
