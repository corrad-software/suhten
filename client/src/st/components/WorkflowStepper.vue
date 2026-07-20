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

    <template v-else>
      <!-- Desktop: horizontal stepper -->
      <ol class="hidden flex-wrap items-center gap-y-3 sm:flex">
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

      <!-- Mobile: vertical timeline -->
      <ol class="space-y-0 sm:hidden">
        <li v-for="(step, i) in WORKFLOW_STEPS" :key="step.key" class="relative flex gap-3 pb-5 last:pb-0">
          <span
            v-if="i < WORKFLOW_STEPS.length - 1"
            class="absolute left-3.5 top-7 h-full w-px"
            :class="i < currentIndex ? 'bg-emerald-300' : 'bg-slate-200'"
          />
          <span
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
            :class="[
              state(i) === 'done' ? 'bg-emerald-500 text-white'
                : state(i) === 'active' ? 'border-2 border-[var(--accent-600)] bg-white text-[var(--accent-700)]'
                : 'border-2 border-slate-200 bg-white text-slate-400',
            ]"
          >
            <Check v-if="state(i) === 'done'" class="h-3.5 w-3.5" />
            <span v-else>{{ i + 1 }}</span>
          </span>
          <div class="pt-0.5">
            <p class="text-sm font-medium" :class="state(i) === 'pending' ? 'text-slate-400' : 'text-slate-900'">
              {{ step.label }}
            </p>
            <p
              class="mt-0.5 text-xs"
              :class="state(i) === 'active' ? 'font-medium text-[var(--accent-700)]' : state(i) === 'done' ? 'text-emerald-600' : 'text-slate-300'"
            >
              {{ state(i) === "active" ? "Sedang berlangsung" : state(i) === "done" ? "Selesai" : "Menunggu" }}
            </p>
          </div>
        </li>
      </ol>
    </template>
  </div>
</template>
