<script setup lang="ts">
import { computed } from "vue";
import { Check } from "lucide-vue-next";

import type { ApplicationStatus } from "../types";
import { WORKFLOW_STEPS, stepIndexForStatus } from "../status";

const props = defineProps<{ status: ApplicationStatus }>();

const terminalBad = computed(() => props.status === "rejected" || props.status === "withdrawn");
const currentIndex = computed(() => {
  if (props.status === "certificate_issued") return WORKFLOW_STEPS.length; // all done
  return stepIndexForStatus(props.status);
});

function state(i: number): "done" | "active" | "pending" {
  if (i < currentIndex.value) return "done";
  if (i === currentIndex.value) return "active";
  return "pending";
}
</script>

<template>
  <div>
    <div v-if="terminalBad" class="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
      Permohonan {{ status === "rejected" ? "telah ditolak" : "telah ditarik balik" }}.
    </div>

    <ol v-else class="flex flex-wrap items-center gap-y-3">
      <li v-for="(step, i) in WORKFLOW_STEPS" :key="step.key" class="flex items-center">
        <div class="flex flex-col items-center text-center" style="width: 84px">
          <span
            :class="[
              'flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold',
              state(i) === 'done' ? 'bg-emerald-500 text-white'
                : state(i) === 'active' ? 'bg-[var(--accent-600)] text-white ring-4 ring-[var(--accent-100)]'
                : 'bg-slate-200 text-slate-500',
            ]"
          >
            <Check v-if="state(i) === 'done'" class="h-4 w-4" />
            <template v-else>{{ i + 1 }}</template>
          </span>
          <span :class="['mt-1.5 text-[10.5px] leading-tight', state(i) === 'pending' ? 'text-slate-400' : 'text-slate-700 font-medium']">
            {{ step.label }}
          </span>
        </div>
        <span
          v-if="i < WORKFLOW_STEPS.length - 1"
          :class="['mx-0.5 h-0.5 w-6 rounded -translate-y-2', i < currentIndex ? 'bg-emerald-500' : 'bg-slate-200']"
        />
      </li>
    </ol>
  </div>
</template>
