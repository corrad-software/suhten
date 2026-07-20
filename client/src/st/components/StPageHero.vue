<script setup lang="ts">
import { computed } from "vue";

import { useStSessionStore } from "../stores/session";

defineProps<{
  title: string;
  subtitle?: string;
  eyebrow?: string;
}>();

const session = useStSessionStore();

// External users (Pemohon/Majikan) use the top-nav shell, so the hero sits flush
// against the nav bar (Portal Pemohon style: only bottom corners rounded, and a
// negative top margin cancelling <main>'s pt-5/md:pt-6).
// Staff use the sidebar shell, where a floating rounded card reads better.
const flush = computed(() => !session.isKakitangan);
</script>

<template>
  <div
    :class="[
      'st-brand-gradient p-6 text-white shadow-sm sm:p-7',
      flush ? '-mt-5 rounded-b-2xl md:-mt-6' : 'rounded-2xl',
    ]"
  >
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0">
        <p v-if="eyebrow" class="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
          {{ eyebrow }}
        </p>
        <h1 class="text-xl font-semibold sm:text-2xl" :class="eyebrow ? 'mt-1.5' : ''">{{ title }}</h1>
        <p v-if="subtitle" class="mt-1 text-sm text-white/80">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.action" class="shrink-0">
        <slot name="action" />
      </div>
    </div>
    <slot />
  </div>
</template>
