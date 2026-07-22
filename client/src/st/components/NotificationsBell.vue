<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { Bell } from "lucide-vue-next";

import { useStNotificationsStore } from "../stores/notifications";

const router = useRouter();
const notifications = useStNotificationsStore();
const open = ref(false);
const rootRef = ref<HTMLElement | null>(null);

function handleClick(e: MouseEvent) {
  if (!open.value || !rootRef.value) return;
  if (!rootRef.value.contains(e.target as Node)) open.value = false;
}

onMounted(() => document.addEventListener("click", handleClick));
onBeforeUnmount(() => document.removeEventListener("click", handleClick));

function openItem(applicationId?: string, id?: string) {
  if (id) notifications.markRead(id);
  open.value = false;
  if (applicationId) router.push(`/st/applications/${applicationId}`);
  else router.push("/st/notifications");
}
</script>

<template>
  <div ref="rootRef" class="relative">
    <button
      class="relative flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-[var(--accent-50)] hover:text-[var(--accent-700)] dark:text-slate-400"
      title="Notifikasi"
      @click.stop="open = !open"
    >
      <Bell class="h-4 w-4" />
      <span
        v-if="notifications.unreadCount > 0"
        class="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-semibold text-white ring-2 ring-white dark:ring-slate-900"
      >
        {{ notifications.unreadCount }}
      </span>
    </button>

    <div
      v-if="open"
      class="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800"
    >
      <div class="flex items-center justify-between border-b border-slate-100 px-3 py-2 dark:border-slate-800">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Notifikasi</p>
        <button
          v-if="notifications.unreadCount > 0"
          class="text-[11px] font-medium text-[var(--accent-700)] hover:underline"
          @click="notifications.markAllRead()"
        >
          Tanda semua dibaca
        </button>
      </div>
      <div class="max-h-80 overflow-y-auto">
        <p v-if="notifications.forCurrentPersona.length === 0" class="px-3 py-6 text-center text-sm text-slate-400 dark:text-slate-500">
          Tiada notifikasi.
        </p>
        <button
          v-for="n in notifications.forCurrentPersona"
          :key="n.id"
          class="flex w-full items-start gap-2 border-b border-slate-50 px-3 py-2.5 text-left transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
          @click="openItem(n.applicationId, n.id)"
        >
          <span :class="['mt-1.5 h-2 w-2 shrink-0 rounded-full', n.read ? 'bg-slate-200 dark:bg-slate-600' : 'bg-[var(--accent-500)]']" />
          <span class="min-w-0">
            <span class="block text-sm font-medium text-slate-800 dark:text-slate-200">{{ n.title }}</span>
            <span class="block truncate text-xs text-slate-500 dark:text-slate-400">{{ n.body }}</span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
