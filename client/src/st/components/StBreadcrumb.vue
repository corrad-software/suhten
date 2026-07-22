<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { ChevronRight, House } from "lucide-vue-next";

import { useStSessionStore } from "../stores/session";

export interface StBreadcrumbEntry {
  label: string;
  /** May contain ":paramName" tokens resolved against the current route's params. */
  to?: string;
}

const route = useRoute();
const session = useStSessionStore();

const homeTo = computed(() => session.homeRoute());

function resolveTo(to: string): string {
  return to.replace(/:([a-zA-Z0-9_]+)/g, (match, key) => {
    const value = route.params[key];
    return typeof value === "string" ? value : match;
  });
}

/**
 * Deep/nested pages (a detail view reached from a list, a payment step reached
 * from an application, etc.) declare `meta.breadcrumb` explicitly so the trail
 * shows the real parent chain instead of just the current page's own title.
 * Everything else falls back to splitting the route's "Segment — Segment — ST" title.
 */
const crumbs = computed<StBreadcrumbEntry[]>(() => {
  const declared = route.meta.breadcrumb as StBreadcrumbEntry[] | undefined;
  if (declared?.length) {
    return declared.map((c) => ({ label: c.label, to: c.to ? resolveTo(c.to) : undefined }));
  }
  const raw = (route.meta.title as string) ?? "";
  const parts = raw
    .split(" — ")
    .map((s) => s.trim())
    .filter((s) => s && s !== "ST" && s !== "Suruhanjaya Tenaga");
  return (parts.length ? parts : ["Halaman"]).map((label) => ({ label }));
});
</script>

<template>
  <nav class="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
    <router-link :to="homeTo" class="flex items-center text-slate-400 transition-colors hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200">
      <House class="h-3.5 w-3.5" />
    </router-link>
    <template v-for="(crumb, i) in crumbs" :key="i">
      <ChevronRight class="h-3 w-3 shrink-0 text-slate-300 dark:text-slate-600" />
      <router-link
        v-if="crumb.to && i < crumbs.length - 1"
        :to="crumb.to"
        class="truncate transition-colors hover:text-slate-700 dark:hover:text-slate-200"
      >
        {{ crumb.label }}
      </router-link>
      <span v-else :class="i === crumbs.length - 1 ? 'font-medium text-slate-700 dark:text-slate-200' : 'truncate'">{{ crumb.label }}</span>
    </template>
  </nav>
</template>
