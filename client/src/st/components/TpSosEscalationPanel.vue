<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { AlertTriangle, ArrowRightLeft } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import { useToast } from "@/composables/useToast";
import { useConfirmDialog } from "@/composables/useConfirmDialog";

import { SOS_ESCALATE_AFTER_HOURS } from "../mock/charter";
import { personaById } from "../mock/personas";
import { useStWorkflowStore } from "../stores/workflow";
import { elapsedHours } from "../sla";
import { workflowShort } from "../status";
import RegStatusBadge from "./RegStatusBadge.vue";
import SlaIndicator from "./SlaIndicator.vue";

const route = useRoute();
const router = useRouter();
const workflow = useStWorkflowStore();
const toast = useToast();
const { confirm } = useConfirmDialog();
const { ts } = useLocale();

const portalBase = computed(() => (route.path.startsWith("/admin/st") ? "/admin/st" : "/st"));

const items = computed(() => workflow.escalatedSosApplications());

const reassignFor = ref<string | null>(null);
const targetId = ref("");

onMounted(() => {
  workflow.syncSosEscalationFlags();
});

function hoursInQueue(stageEnteredAt: string): string {
  return elapsedHours(stageEnteredAt, workflow.now).toFixed(1);
}

function assigneeLabel(personaId: string | null): string {
  if (!personaId) return ts("st.inbox.unassigned");
  return personaById(personaId)?.name ?? personaId;
}

function openReassign(applicationId: string) {
  const targets = workflow.sosReassignTargets(applicationId);
  const app = workflow.byId(applicationId);
  // Prefer an officer who does not already own the case.
  targetId.value = targets.find((t) => t.id !== app?.assigneePersonaId)?.id ?? targets[0]?.id ?? "";
  reassignFor.value = applicationId;
}

async function confirmReassign() {
  if (!reassignFor.value || !targetId.value) return;
  const app = workflow.byId(reassignFor.value);
  const target = personaById(targetId.value);
  const ok = await confirm({
    title: ts("st.inbox.reassignTitle"),
    message: ts("st.inbox.reassignMsg", {
      ref: app?.refNo ?? "",
      name: target?.name ?? "",
    }),
    confirmText: ts("st.inbox.reassignConfirm"),
  });
  if (!ok) return;

  const res = workflow.reassignSos(reassignFor.value, targetId.value);
  if (!res.ok) {
    toast.error(ts("st.inbox.reassignFail"), res.reason);
    return;
  }
  toast.success(ts("st.inbox.reassignOk"), ts("st.inbox.reassignOkHint", { name: target?.name ?? "" }));
  reassignFor.value = null;
}

function open(applicationId: string) {
  router.push(`${portalBase.value}/applications/${applicationId}`);
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <AlertTriangle class="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
      <div>
        <p class="font-medium">{{ ts("st.inbox.tpHintTitle") }}</p>
        <p class="mt-0.5 text-amber-800/90">
          {{ ts("st.inbox.tpHintBody", { n: SOS_ESCALATE_AFTER_HOURS }) }}
        </p>
      </div>
    </div>

    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <h2 class="text-sm font-semibold text-slate-900">
          {{ ts("st.inbox.escalationList") }}
          <span class="ml-2 rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
            {{ items.length }}
          </span>
        </h2>
      </div>

      <div v-if="items.length === 0" class="px-4 py-10 text-center text-sm text-slate-500">
        {{ ts("st.inbox.escalationEmpty") }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th class="px-4 py-3">{{ ts("st.common.refNo") }}</th>
              <th class="px-4 py-3">{{ ts("st.common.applicant") }}</th>
              <th class="px-4 py-3">{{ ts("st.common.type") }}</th>
              <th class="px-4 py-3">{{ ts("st.inbox.currentSos") }}</th>
              <th class="px-4 py-3">{{ ts("st.inbox.hoursInQueue") }}</th>
              <th class="px-4 py-3">SLA</th>
              <th class="px-4 py-3">{{ ts("st.common.status") }}</th>
              <th class="px-4 py-3" />
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="app in items" :key="app.id" class="hover:bg-slate-50/80">
              <td class="px-4 py-3 font-mono text-xs text-slate-700">{{ app.refNo }}</td>
              <td class="px-4 py-3 font-medium text-slate-900">{{ app.applicant.fullName }}</td>
              <td class="px-4 py-3 text-slate-600">{{ workflowShort(app.workflowType) }}</td>
              <td class="px-4 py-3 text-slate-600">{{ assigneeLabel(app.assigneePersonaId) }}</td>
              <td class="px-4 py-3 font-mono text-xs text-rose-700">{{ hoursInQueue(app.stageEnteredAt) }}j</td>
              <td class="px-4 py-3">
                <SlaIndicator
                  :stage-entered-at="app.stageEnteredAt"
                  :target-hours="app.slaTargetHours"
                  :role="app.assignedRole ?? 'sos'"
                />
              </td>
              <td class="px-4 py-3"><RegStatusBadge :status="app.status" /></td>
              <td class="px-4 py-3">
                <div class="flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    class="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    @click="open(app.id)"
                  >
                    {{ ts("st.common.view") }}
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 rounded-md bg-[var(--accent-600)] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[var(--accent-700)]"
                    @click="openReassign(app.id)"
                  >
                    <ArrowRightLeft class="h-3.5 w-3.5" />
                    {{ ts("st.inbox.reassign") }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Reassign dialog -->
    <div
      v-if="reassignFor"
      class="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
    >
      <div class="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
        <h3 class="mb-1 text-base font-semibold text-slate-900">{{ ts("st.inbox.reassignTitle") }}</h3>
        <p class="mb-4 text-sm text-slate-500">{{ ts("st.inbox.reassignPick") }}</p>
        <label class="block text-sm">
          <span class="mb-1 block font-medium text-slate-700">{{ ts("st.inbox.targetSos") }}</span>
          <select v-model="targetId" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option v-for="p in workflow.sosReassignTargets(reassignFor)" :key="p.id" :value="p.id">
              {{ p.name }} — {{ p.title }}
            </option>
          </select>
        </label>
        <p class="mt-3 text-xs text-slate-500">{{ ts("st.inbox.reassignSlaNote") }}</p>
        <div class="mt-5 flex gap-2">
          <button
            type="button"
            class="flex-1 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            @click="reassignFor = null"
          >
            {{ ts("st.inbox.cancel") }}
          </button>
          <button
            type="button"
            class="flex-1 rounded-md bg-[var(--accent-600)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-700)]"
            :disabled="!targetId"
            @click="confirmReassign"
          >
            {{ ts("st.inbox.reassignConfirm") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
