<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Check, ChevronDown, LogOut, Menu as MenuIcon, Moon, Settings, Sun, X } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import { useToast } from "@/composables/useToast";
import { useUiThemeStore } from "@/stores/uiTheme";
import AppToastRegion from "@/components/AppToastRegion.vue";

import { useStSessionStore } from "../stores/session";
import { portalMenuFor, type PortalMenuGroup, type PortalMenuItem } from "../config/portal-menu";
import { ROLE_LABEL, ROLE_TIER_LABEL } from "../mock/personas";
import StSidebarNav from "./StSidebarNav.vue";
import NotificationsBell from "./NotificationsBell.vue";
import StChatWidget from "./StChatWidget.vue";
import StBreadcrumb from "./StBreadcrumb.vue";

const router = useRouter();
const route = useRoute();
const session = useStSessionStore();
const uiTheme = useUiThemeStore();
const { t } = useLocale();
const toast = useToast();

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

// Desktop sidebar collapse (kakitangan only; separate key from admin CMS).
const SIDEBAR_COLLAPSED_KEY = "st-kakitangan-sidebar-collapsed";
const sidebarCollapsed = ref(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true");
watch(sidebarCollapsed, (val) => {
  localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(val));
});

function toggleSidebarCollapsed() {
  sidebarCollapsed.value = !sidebarCollapsed.value;
}

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
  toast.info("Log keluar", "Anda telah log keluar.");
  // Clear local session first, then leave the portal shell immediately.
  session.logout();
  void router.replace({ name: "st-login" }).catch(() => {
    window.location.assign("/st/login");
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
  <div data-theme-color="st" class="min-h-screen bg-white dark:bg-slate-900">
    <header class="sticky top-0 z-40 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
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

        <button
          class="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-[var(--accent-50)] hover:text-[var(--accent-700)] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          :title="uiTheme.darkMode ? 'Tukar ke mod cerah' : 'Tukar ke mod gelap'"
          @click="uiTheme.toggleDarkMode()"
        >
          <Sun v-if="uiTheme.darkMode" class="h-4 w-4" />
          <Moon v-else class="h-4 w-4" />
        </button>

        <div ref="settingsDropdownRef" class="relative">
          <button
            class="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-[var(--accent-50)] hover:text-[var(--accent-700)] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            :title="t('theme.settings')"
            @click.stop="settingsOpen = !settingsOpen"
          >
            <Settings class="h-4 w-4" />
          </button>

          <div
            v-if="settingsOpen"
            class="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800"
          >
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{{ t('theme.language') }}</p>
            <div class="grid grid-cols-2 gap-2">
              <button
                class="flex items-center justify-between rounded-md border px-2.5 py-2 text-xs font-medium transition-colors"
                :class="uiTheme.locale === 'bm'
                  ? 'border-[var(--accent-500)] bg-[var(--accent-50)] text-[var(--accent-700)]'
                  : 'border-slate-200 text-slate-600 hover:border-[var(--accent-ring)] hover:text-slate-900 dark:border-slate-600 dark:text-slate-300'"
                @click="uiTheme.setLocale('bm')"
              >
                <span>{{ t('theme.lang.bm') }}</span>
                <Check v-if="uiTheme.locale === 'bm'" class="h-3.5 w-3.5" />
              </button>
              <button
                class="flex items-center justify-between rounded-md border px-2.5 py-2 text-xs font-medium transition-colors"
                :class="uiTheme.locale === 'bi'
                  ? 'border-[var(--accent-500)] bg-[var(--accent-50)] text-[var(--accent-700)]'
                  : 'border-slate-200 text-slate-600 hover:border-[var(--accent-ring)] hover:text-slate-900 dark:border-slate-600 dark:text-slate-300'"
                @click="uiTheme.setLocale('bi')"
              >
                <span>{{ t('theme.lang.bi') }}</span>
                <Check v-if="uiTheme.locale === 'bi'" class="h-3.5 w-3.5" />
              </button>
            </div>

            <p class="mt-3 mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Saiz Teks</p>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="size in [{ key: 'sm', px: 'text-xs' }, { key: 'md', px: 'text-base' }, { key: 'lg', px: 'text-xl' }]"
                :key="size.key"
                class="flex items-center justify-center rounded-md border py-2 font-semibold transition-colors"
                :class="[
                  size.px,
                  uiTheme.fontSize === size.key
                    ? 'border-[var(--accent-500)] bg-[var(--accent-50)] text-[var(--accent-700)]'
                    : 'border-slate-200 text-slate-600 hover:border-[var(--accent-ring)] hover:text-slate-900 dark:border-slate-600 dark:text-slate-300',
                ]"
                @click="uiTheme.setFontSize(size.key as 'sm' | 'md' | 'lg')"
              >
                Aa
              </button>
            </div>
          </div>
        </div>

        <NotificationsBell />

        <div class="ml-1 flex items-center gap-2 border-l border-slate-200 pl-3">
          <div class="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-50)] text-[10px] font-semibold text-[var(--accent-700)]">
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
      <div v-if="useBottomNav" class="hidden bg-[var(--accent-600)] md:block">
        <div class="mx-auto flex h-11 w-full max-w-6xl items-stretch justify-between px-4">
          <span class="flex items-center text-xs font-medium uppercase tracking-wider text-white/60">{{ portalSubtitle }}</span>
          <nav class="flex items-stretch gap-1">
            <router-link
              v-for="item in bottomNavItems"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-1.5 border-b-2 px-3 text-sm font-medium transition-colors"
              :class="isActive(item.to)
                ? 'border-white text-white'
                : 'border-transparent text-white/70 hover:text-white'"
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
            'relative fixed bottom-0 left-0 top-12 z-50 w-56 max-w-[80%] border-r border-[#1a3278] bg-[#1e3a8a] transition-[width,transform] duration-200 ease-in-out dark:border-[#1a2d5c] dark:bg-[#16213f]',
            'md:static md:z-auto md:max-w-none md:min-h-[calc(100vh-48px)] md:translate-x-0',
            sidebarCollapsed ? 'overflow-y-auto md:w-14 md:overflow-visible' : 'overflow-y-auto md:w-52',
            sidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full md:shadow-none',
          ]"
        >
          <button
            type="button"
            class="absolute -right-3 top-3 z-40 hidden h-6 w-6 items-center justify-center rounded-full border border-[#1a3278] bg-white text-[#1e3a8a] shadow-md transition-all hover:bg-[var(--accent-50)] hover:shadow-lg md:flex"
            :aria-label="sidebarCollapsed ? 'Kembangkan menu' : 'Runtuhkan menu'"
            :title="sidebarCollapsed ? 'Kembangkan menu' : 'Runtuhkan menu'"
            @click="toggleSidebarCollapsed"
          >
            <ChevronDown
              class="h-3.5 w-3.5 transition-transform duration-200"
              :class="sidebarCollapsed ? '-rotate-90' : 'rotate-90'"
            />
          </button>
          <StSidebarNav
            :menu="menu"
            :collapsed="sidebarCollapsed"
            @expand="sidebarCollapsed = false"
          />
        </aside>
      </template>

      <main
        :class="useBottomNav
          ? 'mx-auto w-full min-w-0 max-w-6xl px-4 pb-24 pt-5 md:pb-8 md:pt-6'
          : 'w-full min-w-0 flex-1 p-4 md:p-6'"
      >
        <StBreadcrumb class="mb-4" />
        <router-view />
      </main>
    </div>

    <!-- External users: mobile bottom navigation bar (Portal Pemohon style) -->
    <nav
      v-if="useBottomNav"
      class="fixed inset-x-4 z-40 flex items-stretch overflow-hidden rounded-full bg-[var(--accent-600)] shadow-lg shadow-slate-900/20 md:hidden"
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

  </div>
</template>
