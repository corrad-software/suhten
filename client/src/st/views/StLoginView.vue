<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { ArrowRight, Zap } from "lucide-vue-next";

import { useStSessionStore } from "../stores/session";
import { DEMO_PASSWORD, PERSONAS, ROLE_LABEL } from "../mock/personas";
import type { PersonaRole } from "../types";

const router = useRouter();
const session = useStSessionStore();

const selectedId = ref(PERSONAS[0].id);
const password = ref(DEMO_PASSWORD);

const roleOrder: PersonaRole[] = ["applicant", "employer", "sos", "technical", "approver"];
const grouped = computed(() =>
  roleOrder.map((role) => ({
    role,
    label: ROLE_LABEL[role],
    personas: PERSONAS.filter((p) => p.role === role),
  })).filter((g) => g.personas.length > 0),
);

const selectedPersona = computed(() => PERSONAS.find((p) => p.id === selectedId.value));

onMounted(() => {
  if (session.currentPersona) router.replace(session.homeRoute());
});

function submit() {
  session.loginAs(selectedId.value);
  router.push(session.homeRoute());
}
</script>

<template>
  <div data-theme-color="st" class="flex min-h-screen flex-col items-center justify-center bg-[#eef3f8] px-4">
    <div class="w-full max-w-[420px]">
      <div class="mb-6 flex flex-col items-center gap-2">
        <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-600)] to-[var(--accent-500)] shadow-md">
          <Zap class="h-6 w-6 text-white" />
        </div>
        <div class="text-center">
          <h1 class="text-lg font-semibold text-slate-900">Suruhanjaya Tenaga</h1>
          <p class="text-xs uppercase tracking-wider text-slate-400">Sistem Pendaftaran Elektrik</p>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white px-8 pb-8 pt-7 shadow-sm">
        <h2 class="mb-1 text-center text-base font-semibold text-slate-900">Log Masuk Demo</h2>
        <p class="mb-6 text-center text-[13px] text-slate-500">Pilih persona untuk pembentangan prototaip</p>

        <form class="space-y-5" @submit.prevent="submit">
          <div class="space-y-1.5">
            <label class="text-[13px] font-medium text-slate-700">Pengguna (mengikut peranan)</label>
            <select
              v-model="selectedId"
              class="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-[var(--accent-500)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]/30"
            >
              <optgroup v-for="g in grouped" :key="g.role" :label="g.label">
                <option v-for="p in g.personas" :key="p.id" :value="p.id">
                  {{ p.name }} — {{ p.title }}
                </option>
              </optgroup>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-[13px] font-medium text-slate-700">Kata Laluan</label>
            <input
              v-model="password"
              type="text"
              class="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-[var(--accent-500)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]/30"
            />
            <p class="text-[11px] text-slate-400">Kata laluan demo: <span class="font-mono">{{ DEMO_PASSWORD }}</span></p>
          </div>

          <div v-if="selectedPersona" class="rounded-md bg-[var(--accent-50)] px-3 py-2 text-[12px] text-[var(--accent-700)]">
            Log masuk sebagai <strong>{{ ROLE_LABEL[selectedPersona.role] }}</strong>
          </div>

          <button
            type="submit"
            class="flex w-full items-center justify-center gap-2 rounded-md bg-[var(--accent-600)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-700)]"
          >
            Log Masuk
            <ArrowRight class="h-4 w-4" />
          </button>
        </form>
      </div>

      <p class="mt-6 text-center text-[12px] text-slate-400">Prototaip Appendix D11 · Demo dalaman</p>
    </div>
  </div>
</template>
