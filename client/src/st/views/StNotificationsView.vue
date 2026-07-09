<script setup lang="ts">
import { useRouter } from "vue-router";
import { Bell, CheckCheck } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import { useStNotificationsStore } from "../stores/notifications";

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
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-50)]">
          <Bell class="h-5 w-5 text-[var(--accent-700)]" />
        </div>
        <div>
          <h1 class="text-xl font-semibold text-slate-900">{{ ts("st.notif.title") }}</h1>
          <p class="text-sm text-slate-500">{{ ts("st.notif.unread", { n: notifications.unreadCount }) }}</p>
        </div>
      </div>
      <button
        v-if="notifications.unreadCount > 0"
        class="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        @click="notifications.markAllRead()"
      >
        <CheckCheck class="h-4 w-4" /> {{ ts("st.notif.markAll") }}
      </button>
    </div>

    <p class="text-xs text-slate-400">{{ ts("st.common.mockNote") }}</p>

    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <p v-if="notifications.forCurrentPersona.length === 0" class="px-4 py-12 text-center text-sm text-slate-400">
        {{ ts("st.notif.empty") }}
      </p>
      <button
        v-for="n in notifications.forCurrentPersona"
        :key="n.id"
        class="flex w-full items-start gap-3 border-b border-slate-50 px-4 py-3 text-left transition-colors last:border-0 hover:bg-slate-50"
        @click="open(n.applicationId, n.id)"
      >
        <span :class="['mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full', n.read ? 'bg-slate-200' : 'bg-[var(--accent-500)]']" />
        <span class="min-w-0 flex-1">
          <span class="flex items-center justify-between gap-2">
            <span :class="['text-sm', n.read ? 'font-medium text-slate-700' : 'font-semibold text-slate-900']">{{ n.title }}</span>
            <span class="shrink-0 text-[11px] text-slate-400">{{ fmt(n.createdAt) }}</span>
          </span>
          <span class="block text-sm text-slate-500">{{ n.body }}</span>
        </span>
      </button>
    </div>
  </div>
</template>
