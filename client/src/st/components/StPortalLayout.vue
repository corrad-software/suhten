<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Clock, LogOut, RotateCcw, Zap } from "lucide-vue-next";

import { useToast } from "@/composables/useToast";
import AppToastRegion from "@/components/AppToastRegion.vue";

import { useStSessionStore } from "../stores/session";
import { useStWorkflowStore } from "../stores/workflow";
import { portalMenuFor } from "../config/portal-menu";
import { ROLE_LABEL } from "../mock/personas";
import NotificationsBell from "./NotificationsBell.vue";

const route = useRoute();
const router = useRouter();
const session = useStSessionStore();
const workflow = useStWorkflowStore();
const toast = useToast();

const menu = computed(() => portalMenuFor(session.role));
const roleLabel = computed(() => (session.role ? ROLE_LABEL[session.role] : ""));
const initials = computed(() =>
  (session.currentPersona?.name ?? "ST")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2),
);

function isActive(path: string) {
  if (path === "/st/applications") return route.path === "/st/applications";
  return route.path === path || route.path.startsWith(path + "/");
}

function itemClass(path: string) {
  return isActive(path)
    ? "border border-[var(--accent-200)] bg-[var(--accent-50)] font-medium text-[var(--accent-700)]"
    : "border border-transparent text-slate-700 hover:bg-[var(--accent-50)]";
}

function logout() {
  session.logout();
  toast.info("Log keluar", "Anda telah log keluar.");
  router.push("/st/login");
}

function advance() {
  workflow.tick(2);
  toast.info("Masa dimajukan", "Jam demo ditambah 2 jam.");
}

function reset() {
  workflow.resetDemo();
  toast.success("Demo ditetapkan semula", "Data contoh telah dimuat semula.");
}
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
          <p class="text-[10px] uppercase tracking-wider text-slate-400">Sistem Pendaftaran Elektrik</p>
        </div>
      </div>

      <div class="flex items-center gap-1">
        <AppToastRegion />

        <button
          class="hidden items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-[var(--accent-ring)] hover:text-slate-900 sm:flex"
          title="Majukan jam demo 2 jam"
          @click="advance"
        >
          <Clock class="h-3.5 w-3.5" /> Maju 2j
        </button>
        <button
          class="hidden items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-[var(--accent-ring)] hover:text-slate-900 sm:flex"
          title="Tetapkan semula data demo"
          @click="reset"
        >
          <RotateCcw class="h-3.5 w-3.5" /> Reset
        </button>

        <NotificationsBell />

        <div class="ml-1 flex items-center gap-2 border-l border-slate-200 pl-3">
          <div class="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-600)] to-[var(--accent-500)] text-[10px] font-semibold text-white">
            {{ initials }}
          </div>
          <div class="hidden leading-tight sm:block">
            <p class="text-xs font-medium text-slate-800">{{ session.currentPersona?.name }}</p>
            <p class="text-[10px] text-slate-500">{{ roleLabel }}</p>
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
      <aside class="w-full shrink-0 border-r border-slate-200 bg-white md:min-h-[calc(100vh-48px)] md:w-60">
        <nav class="p-3">
          <template v-for="group in menu" :key="group.id">
            <p v-if="group.label" class="mb-1 mt-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {{ group.label }}
            </p>
            <router-link
              v-for="item in group.items"
              :key="item.id"
              :to="item.to"
              :class="['mb-0.5 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all', itemClass(item.to)]"
            >
              <component :is="item.icon" class="h-4 w-4 shrink-0" />
              <span>{{ item.label }}</span>
            </router-link>
          </template>
        </nav>
      </aside>

      <main class="w-full min-w-0 flex-1 p-4 md:p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>
