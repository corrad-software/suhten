<script setup lang="ts">
import type { AuditEntry } from "../types";
import { ROLE_LABEL } from "../mock/personas";

defineProps<{ entries: AuditEntry[] }>();

function fmt(at: string): string {
  return new Date(at).toLocaleString("ms-MY", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function roleLabel(role: AuditEntry["actorRole"]): string {
  if (role === "system") return "Sistem";
  return ROLE_LABEL[role];
}
</script>

<template>
  <ol class="space-y-0">
    <li
      v-for="(e, i) in [...entries].reverse()"
      :key="e.id"
      class="relative flex gap-3 pb-4 last:pb-0"
    >
      <div class="flex flex-col items-center">
        <span class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--accent-500)] ring-4 ring-[var(--accent-50)]" />
        <span v-if="i < entries.length - 1" class="mt-0.5 w-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>
      <div class="min-w-0 pb-1">
        <p class="text-sm font-medium text-slate-800 dark:text-slate-200">{{ e.action }}</p>
        <p class="text-xs text-slate-500 dark:text-slate-400">{{ e.actorName }} · {{ roleLabel(e.actorRole) }} · {{ fmt(e.at) }}</p>
        <p v-if="e.note" class="mt-1 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">{{ e.note }}</p>
      </div>
    </li>
  </ol>
</template>
