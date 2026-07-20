import { computed, ref } from "vue";
import { defineStore } from "pinia";

import type { NotificationType, StNotification } from "../types";
import { useStSessionStore } from "./session";

let counter = 0;

export const useStNotificationsStore = defineStore("st-notifications", () => {
  const notifications = ref<StNotification[]>([]);

  const forCurrentPersona = computed(() => {
    const session = useStSessionStore();
    const id = session.currentPersonaId;
    if (!id) return [];
    return notifications.value
      .filter((n) => n.personaId === id)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  });

  const unreadCount = computed(() => forCurrentPersona.value.filter((n) => !n.read).length);

  function setAll(items: StNotification[]) {
    notifications.value = items;
  }

  function push(
    personaId: string,
    type: NotificationType,
    title: string,
    body: string,
    applicationId?: string,
    at?: string,
  ) {
    notifications.value.unshift({
      id: `ntf-live-${++counter}`,
      personaId,
      type,
      title,
      body,
      applicationId,
      createdAt: at ?? new Date().toISOString(),
      read: false,
    });
  }

  function markRead(id: string) {
    const n = notifications.value.find((x) => x.id === id);
    if (n) n.read = true;
  }

  function markAllRead() {
    const session = useStSessionStore();
    for (const n of notifications.value) {
      if (n.personaId === session.currentPersonaId) n.read = true;
    }
  }

  /**
   * Retire action-required notifications once their task is done, so the Inbox
   * reflects only outstanding work (D11: Inbox = current tasks).
   * Marks matching notifications read rather than deleting them, keeping history.
   */
  function resolve(applicationId: string, types: NotificationType[], personaId?: string) {
    for (const n of notifications.value) {
      if (n.applicationId !== applicationId) continue;
      if (!types.includes(n.type)) continue;
      if (personaId && n.personaId !== personaId) continue;
      n.read = true;
    }
  }

  return { notifications, forCurrentPersona, unreadCount, setAll, push, markRead, markAllRead, resolve };
});
