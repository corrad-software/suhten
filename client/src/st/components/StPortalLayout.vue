<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { Check, LogOut, Settings, Zap } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import { useToast } from "@/composables/useToast";
import { useUiThemeStore } from "@/stores/uiTheme";
import AppToastRegion from "@/components/AppToastRegion.vue";

import { useStSessionStore } from "../stores/session";
import { portalMenuFor } from "../config/portal-menu";
import { ROLE_LABEL, ROLE_TIER_LABEL } from "../mock/personas";
import StSidebarNav from "./StSidebarNav.vue";
import NotificationsBell from "./NotificationsBell.vue";

const router = useRouter();
const session = useStSessionStore();
const uiTheme = useUiThemeStore();
const { t } = useLocale();
const toast = useToast();

const settingsOpen = ref(false);
const settingsDropdownRef = ref<HTMLElement | null>(null);

const menu = computed(() => portalMenuFor(session.role));
const roleLabel = computed(() => (session.role ? ROLE_LABEL[session.role] : ""));
const tierLabel = computed(() => (session.role ? ROLE_TIER_LABEL[session.role] : ""));
const portalSubtitle = computed(() =>
  session.isKakitangan ? "Sistem Digital ST — Kakitangan" : "Sistem Digital ST — Awam",
);
const initials = computed(() =>
  (session.currentPersona?.name ?? "ST")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2),
);

function logout() {
  void session.logout().then(() => {
    toast.info("Log keluar", "Anda telah log keluar.");
    router.push("/st/login");
  });
}

const handleDocumentClick = (event: MouseEvent) => {
  if (settingsOpen.value && settingsDropdownRef.value && !settingsDropdownRef.value.contains(event.target as Node)) {
    settingsOpen.value = false;
  }
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape") settingsOpen.value = false;
};

onMounted(() => {
  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("keydown", handleEscape);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleDocumentClick);
  document.removeEventListener("keydown", handleEscape);
});
</script>

<template>
  <div data-theme-color="st" class="min-h-screen bg-[#f4f7fb]">
    <header class="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div class="flex items-center gap-2.5">
        <div class="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[var(--accent-600)] to-[var(--accent-500)]">
          <Zap class="h-4 w-4 text-white" />
        </div>
        <div class="leading-tight">
          <p class="text-sm font-semibold text-slate-900">Suruhanjaya Tenaga</p>
          <p class="text-[10px] uppercase tracking-wider text-slate-400">{{ portalSubtitle }}</p>
        </div>
      </div>

      <div class="flex items-center gap-1">
        <AppToastRegion />

        <div ref="settingsDropdownRef" class="relative">
          <button
            class="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-[var(--accent-50)] hover:text-[var(--accent-700)]"
            :title="t('theme.settings')"
            @click.stop="settingsOpen = !settingsOpen"
          >
            <Settings class="h-4 w-4" />
          </button>

          <div
            v-if="settingsOpen"
            class="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-3 shadow-lg"
          >
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('theme.language') }}</p>
            <div class="grid grid-cols-2 gap-2">
              <button
                class="flex items-center justify-between rounded-md border px-2.5 py-2 text-xs font-medium transition-colors"
                :class="uiTheme.locale === 'bm'
                  ? 'border-[var(--accent-500)] bg-[var(--accent-50)] text-[var(--accent-700)]'
                  : 'border-slate-200 text-slate-600 hover:border-[var(--accent-ring)] hover:text-slate-900'"
                @click="uiTheme.setLocale('bm')"
              >
                <span>{{ t('theme.lang.bm') }}</span>
                <Check v-if="uiTheme.locale === 'bm'" class="h-3.5 w-3.5" />
              </button>
              <button
                class="flex items-center justify-between rounded-md border px-2.5 py-2 text-xs font-medium transition-colors"
                :class="uiTheme.locale === 'bi'
                  ? 'border-[var(--accent-500)] bg-[var(--accent-50)] text-[var(--accent-700)]'
                  : 'border-slate-200 text-slate-600 hover:border-[var(--accent-ring)] hover:text-slate-900'"
                @click="uiTheme.setLocale('bi')"
              >
                <span>{{ t('theme.lang.bi') }}</span>
                <Check v-if="uiTheme.locale === 'bi'" class="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        <NotificationsBell />

        <div class="ml-1 flex items-center gap-2 border-l border-slate-200 pl-3">
          <div class="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-600)] to-[var(--accent-500)] text-[10px] font-semibold text-white">
            {{ initials }}
          </div>
          <div class="hidden leading-tight sm:block">
            <p class="text-xs font-medium text-slate-800">{{ session.currentPersona?.name }}</p>
            <p class="text-[10px] text-slate-500">
              <span v-if="tierLabel" class="text-slate-400">{{ tierLabel }} · </span>{{ roleLabel }}
            </p>
          </div>
        </div>

        <button
          class="group relative ml-1 flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
          title="Log keluar"
          @click="logout"
        >
          <LogOut class="h-4 w-4" />
        </button>
      </div>
    </header>

    <div class="flex flex-col md:flex-row">
      <aside class="w-full shrink-0 border-r border-slate-200 bg-white md:min-h-[calc(100vh-48px)] md:w-64 md:overflow-y-auto">
        <StSidebarNav :menu="menu" />
      </aside>

      <main class="w-full min-w-0 flex-1 p-4 md:p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>
