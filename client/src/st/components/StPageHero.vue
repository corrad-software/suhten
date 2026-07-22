<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
  eyebrow?: string;
}>();
</script>

<template>
  <div class="border-b border-slate-200 pb-4 dark:border-slate-700">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0">
        <p v-if="eyebrow" class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-700)]">
          {{ eyebrow }}
        </p>
        <h1 class="text-xl font-semibold text-slate-900 sm:text-2xl dark:text-slate-100" :class="eyebrow ? 'mt-1.5' : ''">{{ title }}</h1>
        <p v-if="subtitle" class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.action" class="shrink-0">
        <slot name="action" />
      </div>
    </div>
    <slot />
  </div>
</template>
