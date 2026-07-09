<script setup lang="ts">
import { computed } from "vue";

import { useLocale } from "@/composables/useLocale";
import type { StMessageKey } from "@/i18n/st-messages";
import type { ApplicationStatus } from "../types";
import { STATUS_META } from "../status";

const props = defineProps<{ status: ApplicationStatus }>();
const { ts } = useLocale();

const meta = computed(() => STATUS_META[props.status]);
const label = computed(() => ts(`st.status.${props.status}` as StMessageKey));
</script>

<template>
  <span :class="['inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', meta.classes]">
    {{ label }}
  </span>
</template>
