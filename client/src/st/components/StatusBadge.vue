<script setup lang="ts">
import { computed } from "vue";
import type { ApplicationStatus } from "../types";
import { STATUS_META } from "../status";

const props = defineProps<{ status: ApplicationStatus }>();
const meta = computed(() => STATUS_META[props.status]);
</script>

<template>
  <span :class="['inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', meta.classes]">
    {{ meta.label }}
  </span>
</template>
