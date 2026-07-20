<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Check, Clock, LogOut, Menu as MenuIcon, RotateCcw, Settings, X } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import { useToast } from "@/composables/useToast";
import { useUiThemeStore } from "@/stores/uiTheme";
import AppToastRegion from "@/components/AppToastRegion.vue";

import { useStSessionStore } from "../stores/session";
import { useStWorkflowStore } from "../stores/workflow";
import { portalMenuFor, type PortalMenuGroup, type PortalMenuItem } from "../config/portal-menu";
import { ROLE_LABEL, ROLE_TIER_LABEL } from "../mock/personas";
import StSidebarNav from "./StSidebarNav.vue";
import NotificationsBell from "./NotificationsBell.vue";
import StChatWidget from "./StChatWidget.vue";

const router = useRouter();
const route = useRoute();
const session = useStSessionStore();
const workflow = useStWorkflowStore();
const uiTheme = useUiThemeStore();
const { t } = useLocale();
const toast = useToast();

// Demo controls (prototype): advance the mock clock and reseed demo data.
function advanceClock() {
  workflow.tick(2);
  toast.info("Masa dimajukan", "Jam demo ditambah 2 jam.");
}
function resetDemo() {
  workflow.resetDemo();
  toast.success("Demo ditetapkan semula", "Data contoh telah dimuat semula.");
}

const settingsOpen = ref(false);
const settingsDropdownRef = ref<HTMLElement | null>(null);

// Mobile sidebar drawer (hidden behind a hamburger on < md).
const sidebarOpen = ref(false);
watch(
  () => route.fullPath,
  () => {
    sidebarOpen.value = false;
  },
);

const menu = computed(() => portalMenuFor(session.role));

// External users (Pemohon / Majikan) get a mobile bottom navigation bar
// (à la Portal Pemohon); staff keep the sidebar drawer for their larger menu.
const bottomNavItems = computed<PortalMenuItem[]>(() =>
  session.isKakitangan ? [] : (menu.value as PortalMenuGroup[]).flatMap((g) => g.items).filter((i) => !i.children),
);
const useBottomNav = computed(() => bottomNavItems.value.length > 0 && bottomNavItems.value.length <= 5);

/**
 * Highlights the most specific matching nav item only.
 * Without this, /st/applications/new lights up BOTH "Permohonan Saya"
 * (/st/applications, prefix match) and "Permohonan Baharu" (exact match).
 */
function isActive(path: string) {
  const matches = (p: string) => route.path === p || route.path.startsWith(`${p}/`);
  if (!matches(path)) return false;
  const longestMatch = bottomNavItems.value
    .map((i) => i.to)
    .filter(matches)
    .reduce((a, b) => (b.length > a.length ? b : a), "");
  return longestMatch === "" || longestMatch === path;
}

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
    <header class="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div class="flex h-12 items-center justify-between px-4">
      <div class="flex items-center gap-2.5">
        <button
          v-if="!useBottomNav"
          class="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-[var(--accent-50)] hover:text-[var(--accent-700)] md:hidden"
          :aria-label="sidebarOpen ? 'Tutup menu' : 'Buka menu'"
          @click="sidebarOpen = !sidebarOpen"
        >
          <X v-if="sidebarOpen" class="h-5 w-5" />
          <MenuIcon v-else class="h-5 w-5" />
        </button>
        <img src="/logo-st-color.svg" alt="Suruhanjaya Tenaga" class="h-7 w-auto object-contain" />
        <span
          v-if="!useBottomNav"
          class="hidden border-l border-slate-200 pl-2.5 text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:inline"
        >
          {{ portalSubtitle }}
        </span>
      </div>

      <div class="flex items-center gap-1">
        <AppToastRegion />

        <!-- Demo controls -->
        <button
          class="hidden items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-[var(--accent-ring)] hover:text-slate-900 sm:flex"
          title="Majukan jam demo 2 jam"
          @click="advanceClock"
        >
          <Clock class="h-3.5 w-3.5" /> Maju 2j
        </button>
        <button
          class="hidden items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-[var(--accent-ring)] hover:text-slate-900 sm:flex"
          title="Tetapkan semula data demo"
          @click="resetDemo"
        >
          <RotateCcw class="h-3.5 w-3.5" /> Reset
        </button>


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
      </div>

      <!-- External users: desktop horizontal nav bar (Portal Pemohon style) -->
      <div v-if="useBottomNav" class="hidden border-t border-[var(--accent-700)] bg-[var(--accent-600)] md:block">
        <div class="mx-auto flex h-11 w-full max-w-6xl items-center justify-between px-4">
          <span class="text-sm font-semibold text-white">{{ portalSubtitle }}</span>
          <nav class="flex items-center gap-1">
            <router-link
              v-for="item in bottomNavItems"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors"
              :class="isActive(item.to)
                ? 'border-white text-white'
                : 'border-transparent text-white/70 hover:bg-white/10 hover:text-white'"
            >
              <component :is="item.icon" class="h-4 w-4" />
              {{ item.label }}
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <div :class="useBottomNav ? '' : 'md:flex md:flex-row'">
      <!-- Staff: static desktop sidebar + slide-in mobile drawer -->
      <template v-if="!useBottomNav">
        <div
          v-if="sidebarOpen"
          class="fixed inset-x-0 bottom-0 top-12 z-40 bg-slate-900/40 md:hidden"
          @click="sidebarOpen = false"
        />
        <aside
          :class="[
            'fixed bottom-0 left-0 top-12 z-50 w-72 max-w-[80%] overflow-y-auto border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out',
            'md:static md:z-auto md:w-64 md:max-w-none md:min-h-[calc(100vh-48px)] md:translate-x-0',
            sidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full md:shadow-none',
          ]"
        >
          <StSidebarNav :menu="menu" />
        </aside>
      </template>

      <main
        :class="useBottomNav
          ? 'mx-auto w-full min-w-0 max-w-6xl px-4 pb-24 pt-5 md:pb-8 md:pt-6'
          : 'w-full min-w-0 flex-1 p-4 md:p-6'"
      >
        <router-view />
      </main>
    </div>

    <!-- External users: mobile bottom navigation bar (Portal Pemohon style) -->
    <nav
      v-if="useBottomNav"
      class="fixed inset-x-4 z-40 flex items-stretch overflow-hidden rounded-full bg-[var(--accent-600)] shadow-lg shadow-[var(--accent-700)]/30 md:hidden"
      style="bottom: max(1rem, env(safe-area-inset-bottom))"
    >
      <router-link
        v-for="item in bottomNavItems"
        :key="item.to"
        :to="item.to"
        class="flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors"
        :class="isActive(item.to) ? 'text-white' : 'text-white/60'"
      >
        <component :is="item.icon" class="h-5 w-5" />
        {{ item.shortLabel ?? item.label }}
      </router-link>
    </nav>

    <StChatWidget />
  </div>
</template>
