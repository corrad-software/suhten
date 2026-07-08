<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { FilePlus2, FileText, Inbox, ShieldCheck, TrendingUp } from "lucide-vue-next";

import type { PersonaRole } from "../types";
import { useStSessionStore } from "../stores/session";
import { useStWorkflowStore } from "../stores/workflow";
import { slaLevel } from "../sla";
import { workflowShort } from "../status";
import { SLA_TARGET_HOURS } from "../mock/charter";
import StatusBadge from "../components/StatusBadge.vue";
import SlaIndicator from "../components/SlaIndicator.vue";

const router = useRouter();
const session = useStSessionStore();
const workflow = useStWorkflowStore();

const persona = computed(() => session.currentPersona);
const role = computed<PersonaRole | null>(() => session.role);

// ── applicant ───────────────────────────────────────────────────────────────
const myApps = computed(() => workflow.myApplications);
const myActive = computed(() => myApps.value.filter((a) => !["certificate_issued", "rejected", "withdrawn"].includes(a.status)).length);
const myCerts = computed(() => myApps.value.filter((a) => a.status === "certificate_issued").length);

// ── employer / confirmer ─────────────────────────────────────────────────────
const confirmations = computed(() => (session.currentPersonaId ? workflow.confirmationsFor(session.currentPersonaId) : []));

// ── back-office ──────────────────────────────────────────────────────────────
const inbox = computed(() => (role.value ? workflow.inboxFor(role.value) : null));
const queue = computed(() => inbox.value?.new ?? []);
const slaBreakdown = computed(() => {
  const b = { green: 0, yellow: 0, red: 0 };
  for (const it of queue.value) b[slaLevel(it.stageEnteredAt, it.slaTargetHours, workflow.now)]++;
  return b;
});
const activeCount = computed(() => (role.value ? workflow.activeCountFor(role.value) : 0));
const slaTarget = computed(() => (role.value ? SLA_TARGET_HOURS[role.value] : undefined));

function open(id: string) {
  router.push(`/st/applications/${id}`);
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-semibold text-slate-900">Selamat datang, {{ persona?.name }}</h1>
      <p class="text-sm text-slate-500">{{ persona?.title }}</p>
    </div>

    <!-- APPLICANT -->
    <template v-if="role === 'applicant'">
      <div class="grid gap-4 sm:grid-cols-3">
        <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <FileText class="h-5 w-5 text-[var(--accent-600)]" />
          <p class="mt-2 text-2xl font-bold text-slate-900">{{ myApps.length }}</p>
          <p class="text-sm text-slate-500">Jumlah permohonan</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <TrendingUp class="h-5 w-5 text-amber-500" />
          <p class="mt-2 text-2xl font-bold text-slate-900">{{ myActive }}</p>
          <p class="text-sm text-slate-500">Sedang diproses</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <ShieldCheck class="h-5 w-5 text-emerald-500" />
          <p class="mt-2 text-2xl font-bold text-slate-900">{{ myCerts }}</p>
          <p class="text-sm text-slate-500">Sijil dikeluarkan</p>
        </div>
      </div>

      <div class="flex flex-wrap gap-3">
        <button
          class="flex items-center gap-2 rounded-md bg-[var(--accent-600)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-700)]"
          @click="router.push('/st/applications/new')"
        >
          <FilePlus2 class="h-4 w-4" /> Permohonan Orang Kompeten
        </button>
        <button
          class="flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          @click="router.push('/st/applications/new?type=CE')"
        >
          <FilePlus2 class="h-4 w-4" /> Permohonan Kontraktor Elektrik
        </button>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h2 class="text-sm font-semibold text-slate-700">Permohonan Terkini</h2>
          <button class="text-xs font-medium text-[var(--accent-700)] hover:underline" @click="router.push('/st/applications')">Lihat semua</button>
        </div>
        <p v-if="myApps.length === 0" class="px-4 py-8 text-center text-sm text-slate-400">Belum ada permohonan. Mulakan satu di atas.</p>
        <button
          v-for="a in myApps.slice(0, 5)"
          :key="a.id"
          class="flex w-full items-center justify-between gap-3 border-b border-slate-50 px-4 py-3 text-left last:border-0 hover:bg-slate-50"
          @click="open(a.id)"
        >
          <div class="min-w-0">
            <p class="font-mono text-xs text-slate-500">{{ a.refNo }}</p>
            <p class="text-sm font-medium text-slate-800">{{ workflowShort(a.workflowType) }}</p>
          </div>
          <StatusBadge :status="a.status" />
        </button>
      </div>
    </template>

    <!-- EMPLOYER / CONFIRMER -->
    <template v-else-if="role === 'employer'">
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <ShieldCheck class="h-5 w-5 text-amber-500" />
          <p class="mt-2 text-2xl font-bold text-slate-900">{{ confirmations.length }}</p>
          <p class="text-sm text-slate-500">Menunggu pengesahan lantikan</p>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-100 px-4 py-3">
          <h2 class="text-sm font-semibold text-slate-700">Pengesahan Lantikan Diperlukan</h2>
        </div>
        <p v-if="confirmations.length === 0" class="px-4 py-8 text-center text-sm text-slate-400">Tiada lantikan menunggu pengesahan.</p>
        <button
          v-for="a in confirmations"
          :key="a.id"
          class="flex w-full items-center justify-between gap-3 border-b border-slate-50 px-4 py-3 text-left last:border-0 hover:bg-slate-50"
          @click="open(a.id)"
        >
          <div class="min-w-0">
            <p class="font-mono text-xs text-slate-500">{{ a.refNo }}</p>
            <p class="text-sm font-medium text-slate-800">{{ a.applicant.fullName }} · {{ workflowShort(a.workflowType) }}</p>
          </div>
          <StatusBadge :status="a.status" />
        </button>
      </div>
    </template>

    <!-- BACK-OFFICE (sos / technical / approver) -->
    <template v-else-if="role">
      <div class="grid gap-4 sm:grid-cols-4">
        <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <Inbox class="h-5 w-5 text-[var(--accent-600)]" />
          <p class="mt-2 text-2xl font-bold text-slate-900">{{ queue.length }}</p>
          <p class="text-sm text-slate-500">Dalam giliran</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-2xl font-bold text-slate-900">{{ activeCount }} <span class="text-base font-medium text-slate-400">/ {{ workflow.maxActiveTasks }}</span></p>
          <p class="text-sm text-slate-500">Tugasan aktif</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="mt-1 text-2xl font-bold text-slate-900">{{ slaTarget }}j</p>
          <p class="text-sm text-slate-500">Sasaran Piagam</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="flex items-center gap-3">
            <span class="flex items-center gap-1 text-sm font-semibold text-emerald-600"><span class="h-2.5 w-2.5 rounded-full bg-emerald-500" />{{ slaBreakdown.green }}</span>
            <span class="flex items-center gap-1 text-sm font-semibold text-amber-600"><span class="h-2.5 w-2.5 rounded-full bg-amber-500" />{{ slaBreakdown.yellow }}</span>
            <span class="flex items-center gap-1 text-sm font-semibold text-rose-600"><span class="h-2.5 w-2.5 rounded-full bg-rose-500" />{{ slaBreakdown.red }}</span>
          </div>
          <p class="mt-2 text-sm text-slate-500">Status SLA giliran</p>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h2 class="text-sm font-semibold text-slate-700">Giliran Terkini (FIFO)</h2>
          <button class="text-xs font-medium text-[var(--accent-700)] hover:underline" @click="router.push('/st/inbox')">Buka peti tugasan</button>
        </div>
        <p v-if="queue.length === 0" class="px-4 py-8 text-center text-sm text-slate-400">Tiada tugasan dalam giliran.</p>
        <button
          v-for="(it, i) in queue.slice(0, 5)"
          :key="it.applicationId"
          class="flex w-full items-center justify-between gap-3 border-b border-slate-50 px-4 py-3 text-left last:border-0 hover:bg-slate-50"
          @click="open(it.applicationId)"
        >
          <div class="flex min-w-0 items-center gap-2">
            <span class="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-100 px-1 text-[10px] font-semibold text-slate-500">{{ i + 1 }}</span>
            <div>
              <p class="font-mono text-xs text-slate-500">{{ it.refNo }}</p>
              <p class="text-sm font-medium text-slate-800">{{ it.applicantName }}</p>
            </div>
          </div>
          <SlaIndicator :stage-entered-at="it.stageEnteredAt" :target-hours="it.slaTargetHours" />
        </button>
      </div>
    </template>
  </div>
</template>
