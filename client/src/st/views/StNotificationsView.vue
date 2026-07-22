<script setup lang="ts">
import { useRouter } from "vue-router";

import { useLocale } from "@/composables/useLocale";
import { useStNotificationsStore } from "../stores/notifications";
import StPageHero from "../components/StPageHero.vue";

const router = useRouter();
const { ts, locale } = useLocale();
const notifications = useStNotificationsStore();

function fmt(iso: string): string {
  return new Date(iso).toLocaleString(locale.value === "bi" ? "en-MY" : "ms-MY", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function open(applicationId: string | undefined, id: string) {
  notifications.markRead(id);
  if (applicationId) router.push(`/st/applications/${applicationId}`);
}
</script>

<template>
  <div class="space-y-4">
    <StPageHero
      :title="ts('st.notif.title')"
      :subtitle="ts('st.notif.unread', { n: notifications.unreadCount })"
    />

    <div>
      <p v-if="notifications.forCurrentPersona.length === 0" class="py-12 text-center text-sm text-slate-400 dark:text-slate-500">
        {{ ts("st.notif.empty") }}
      </p>
      <button
        v-for="n in notifications.forCurrentPersona"
        :key="n.id"
        class="flex w-full items-start gap-3 border-b border-slate-100 py-3 text-left transition-colors last:border-0 hover:bg-slate-50/60 dark:border-slate-800 dark:hover:bg-slate-800/60"
        @click="open(n.applicationId, n.id)"
      >
        <span :class="['mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full', n.read ? 'bg-slate-200 dark:bg-slate-600' : 'bg-[var(--accent-500)]']" />
        <span class="min-w-0 flex-1">
          <span class="flex items-center justify-between gap-2">
            <span :class="['text-sm', n.read ? 'font-medium text-slate-700 dark:text-slate-300' : 'font-semibold text-slate-900 dark:text-slate-100']">{{ n.title }}</span>
            <span class="shrink-0 text-[11px] text-slate-400 dark:text-slate-500">{{ fmt(n.createdAt) }}</span>
          </span>
          <span class="block text-sm text-slate-500 dark:text-slate-400">{{ n.body }}</span>
        </span>
      </button>
    </div>
  </div>
</template>
