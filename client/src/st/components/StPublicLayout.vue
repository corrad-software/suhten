<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { LogIn, Menu as MenuIcon, MapPin, Phone } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import { useSiteStore } from "@/stores/site";
import { useUiThemeStore } from "@/stores/uiTheme";
import { API_BASE_URL } from "@/env";
import { CONTACT, SOCIAL } from "../mock/public-content";
import StChatWidget from "./StChatWidget.vue";

const route = useRoute();
const site = useSiteStore();
const uiTheme = useUiThemeStore();
const { locale, t } = useLocale();

const mobileOpen = ref(false);

const NAV: { to: string; label: { bm: string; bi: string } }[] = [
  { to: "/st/utama", label: { bm: "Utama", bi: "Home" } },
  { to: "/st/perkhidmatan", label: { bm: "Perkhidmatan", bi: "Services" } },
  { to: "/st/semak-status", label: { bm: "Semak Status", bi: "Check Status" } },
];

const year = new Date().getFullYear();

function resolveUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
}

function isActive(to: string) {
  return route.path === to || (to === "/st/utama" && route.path === "/st");
}
</script>

<template>
  <div data-theme-color="st" class="flex min-h-screen flex-col bg-[#f4f7fb]">
    <!-- Masthead -->
    <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <router-link to="/st/utama" class="flex items-center gap-2.5">
          <img
            :src="site.siteIconUrl ? resolveUrl(site.siteIconUrl) : '/logo-st-color.svg'"
            alt="Suruhanjaya Tenaga"
            class="h-8 w-auto object-contain"
          />
          <span class="hidden border-l border-slate-200 pl-2.5 text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:inline">
            Sistem Digital
          </span>
        </router-link>

        <!-- Desktop nav -->
        <nav class="hidden items-center gap-1 md:flex">
          <router-link
            v-for="item in NAV"
            :key="item.to"
            :to="item.to"
            :class="[
              'rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive(item.to)
                ? 'bg-[var(--accent-50)] text-[var(--accent-700)]'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            ]"
          >
            {{ item.label[locale] }}
          </router-link>
        </nav>

        <div class="flex items-center gap-2">
          <!-- Language toggle -->
          <div class="hidden items-center rounded-md border border-slate-200 p-0.5 sm:flex">
            <button
              type="button"
              class="rounded px-2 py-1 text-xs font-medium transition-colors"
              :class="locale === 'bm' ? 'bg-[var(--accent-600)] text-white' : 'text-slate-500 hover:text-slate-800'"
              @click="uiTheme.setLocale('bm')"
            >
              {{ t('theme.lang.bm') }}
            </button>
            <button
              type="button"
              class="rounded px-2 py-1 text-xs font-medium transition-colors"
              :class="locale === 'bi' ? 'bg-[var(--accent-600)] text-white' : 'text-slate-500 hover:text-slate-800'"
              @click="uiTheme.setLocale('bi')"
            >
              {{ t('theme.lang.bi') }}
            </button>
          </div>

          <router-link
            to="/st/login"
            class="hidden items-center gap-1.5 rounded-md bg-[var(--accent-600)] px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-700)] sm:flex"
          >
            <LogIn class="h-4 w-4" />
            {{ locale === 'bm' ? 'Log Masuk' : 'Log In' }}
          </router-link>

          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 md:hidden"
            @click="mobileOpen = !mobileOpen"
          >
            <MenuIcon class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Mobile nav -->
      <div v-if="mobileOpen" class="border-t border-slate-100 px-4 py-2 md:hidden">
        <router-link
          v-for="item in NAV"
          :key="item.to"
          :to="item.to"
          class="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          @click="mobileOpen = false"
        >
          {{ item.label[locale] }}
        </router-link>
        <router-link
          to="/st/login"
          class="mt-1 flex items-center gap-1.5 rounded-md bg-[var(--accent-600)] px-3 py-2 text-sm font-medium text-white"
          @click="mobileOpen = false"
        >
          <LogIn class="h-4 w-4" /> {{ locale === 'bm' ? 'Log Masuk' : 'Log In' }}
        </router-link>
      </div>
    </header>

    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-200 bg-white">
      <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <!-- Brand + address -->
          <div class="max-w-sm">
            <img src="/logo-st-color.svg" alt="Suruhanjaya Tenaga" class="h-8 w-auto object-contain" />
            <p class="mt-3 text-xs font-medium text-[var(--accent-700)]">
              {{ locale === 'bm' ? 'Tenaga Boleh Harap. Akses Saksama. Perlindungan Pengguna.' : 'Reliable Energy. Fair Access. Consumer Protection.' }}
            </p>
            <address class="mt-3 space-y-1 text-xs not-italic leading-relaxed text-slate-500">
              <p class="flex items-start gap-1.5"><MapPin class="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" /> {{ CONTACT.address }}</p>
              <p class="flex items-center gap-1.5"><Phone class="h-3.5 w-3.5 shrink-0 text-slate-400" /> {{ locale === 'bm' ? 'Talian Bebas Tol' : 'Toll Free' }}: {{ CONTACT.tollFree }}</p>
              <p class="flex items-center gap-1.5"><Phone class="h-3.5 w-3.5 shrink-0 text-slate-400" /> Tel: {{ CONTACT.tel }} · Faks: {{ CONTACT.fax }}</p>
            </address>
          </div>

          <!-- Links -->
          <div class="text-sm">
            <p class="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {{ locale === 'bm' ? 'Pautan' : 'Links' }}
            </p>
            <ul class="space-y-1.5">
              <li v-for="item in NAV" :key="item.to">
                <router-link :to="item.to" class="text-slate-600 hover:text-[var(--accent-700)]">{{ item.label[locale] }}</router-link>
              </li>
              <li>
                <router-link to="/st/login" class="text-slate-600 hover:text-[var(--accent-700)]">
                  {{ locale === 'bm' ? 'Log Masuk' : 'Log In' }}
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Social -->
          <div class="text-sm">
            <p class="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {{ locale === 'bm' ? 'Media Sosial' : 'Social Media' }}
            </p>
            <ul class="space-y-1.5">
              <li v-for="s in SOCIAL" :key="s.label">
                <a :href="s.url" target="_blank" rel="noopener noreferrer" class="text-slate-600 hover:text-[var(--accent-700)]">
                  {{ s.label }} <span class="text-slate-400">· {{ s.handle }}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p class="mt-8 border-t border-slate-100 pt-5 text-xs text-slate-400">
          &copy; {{ year }} {{ CONTACT.org[locale] }} ({{ locale === 'bm' ? 'Energy Commission' : 'Suruhanjaya Tenaga' }}).
          {{ locale === 'bm' ? 'Hak cipta terpelihara.' : 'All rights reserved.' }}
        </p>
      </div>
    </footer>

    <StChatWidget />
  </div>
</template>
