<script setup lang="ts">
import { computed } from "vue";

import { useLocale } from "@/composables/useLocale";
import type { StMessageKey } from "@/i18n/st-messages";
import type { ComplianceStatus } from "../mock/registration";

const props = defineProps<{ status: ComplianceStatus }>();
const { ts } = useLocale();

const classes: Record<ComplianceStatus, string> = {
  active: "bg-emerald-100 text-emerald-700",
  expiring_soon: "bg-amber-100 text-amber-800",
  expired: "bg-rose-100 text-rose-700",
  suspended: "bg-slate-200 text-slate-700",
};

const label = computed(() => ts(`st.compliance.${props.status}` as StMessageKey));
</script>

<template>
  <span :class="['inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', classes[status]]">
    {{ label }}
  </span>
</template>
