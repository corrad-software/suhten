<script setup lang="ts">
import { computed } from "vue";
import type { PersonaRole } from "../types";
import { useStWorkflowStore } from "../stores/workflow";
import { slaThresholdsFor } from "../mock/charter";
import { slaLevel, slaCountdownLabel, SLA_META } from "../sla";

const props = withDefaults(
  defineProps<{ stageEnteredAt: string; targetHours: number; showLabel?: boolean; role?: PersonaRole | null }>(),
  { showLabel: true, role: null },
);

const workflow = useStWorkflowStore();
const thresholds = computed(() => slaThresholdsFor(props.role));
const level = computed(() => slaLevel(props.stageEnteredAt, props.targetHours, workflow.now, thresholds.value));
const meta = computed(() => SLA_META[level.value]);
const countdown = computed(() => slaCountdownLabel(props.stageEnteredAt, props.targetHours, workflow.now));
</script>

<template>
  <span
    v-if="targetHours > 0"
    :class="['inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium', meta.bg, meta.text]"
    :title="meta.label"
  >
    <span :class="['h-2 w-2 rounded-full', meta.dot]" />
    <template v-if="showLabel">{{ countdown }}</template>
  </span>
  <span v-else class="text-xs text-slate-400">—</span>
</template>
