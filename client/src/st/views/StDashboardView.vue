<script setup lang="ts">
import { computed, type Component } from "vue";
import { useRouter } from "vue-router";
import {
  FilePlus2, FileText, Inbox, ShieldCheck, Clock, AlertCircle, BadgeCheck,
  Building2, UserCog, Timer, ListChecks, Activity, ArrowRight, User,
} from "lucide-vue-next";

import type { PersonaRole } from "../types";
import { useStSessionStore } from "../stores/session";
import { useStWorkflowStore } from "../stores/workflow";
import { slaLevel } from "../sla";
import { workflowShort } from "../status";
import { ROLE_LABEL } from "../mock/personas";
import { SLA_TARGET_HOURS } from "../mock/charter";
import { useServiceCatalog } from "../composables/useServiceCatalog";
import StatusBadge from "../components/StatusBadge.vue";
import SlaIndicator from "../components/SlaIndicator.vue";

// Other ST services offered (same catalogue as /st/perkhidmatan).
const { otherGroups } = useServiceCatalog();

const router = useRouter();
const session = useStSessionStore();
const workflow = useStWorkflowStore();

const persona = computed(() => session.currentPersona);
const role = computed<PersonaRole | null>(() => session.role);
const roleLabel = computed(() => (role.value ? ROLE_LABEL[role.value] : ""));

const greeting = computed(() => {
  const h = new Date(workflow.now).getHours();
  if (h < 12) return "Selamat Pagi";
  if (h < 15) return "Selamat Tengah Hari";
  if (h < 19) return "Selamat Petang";
  return "Selamat Malam";
});
const todayLabel = computed(() =>
  new Date(workflow.now).toLocaleDateString("ms-MY", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
);
const initials = computed(() =>
  (persona.value?.name ?? "ST").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
);

type Tone = "accent" | "amber" | "rose" | "emerald" | "blue" | "slate";
interface StatCard { icon: Component; value: number | string; label: string; caption: string; tone: Tone }

function toneGradient(tone: Tone): string {
  return {
    accent: "bg-gradient-to-br from-[var(--accent-500)] to-[var(--accent-700)]",
    amber: "bg-gradient-to-br from-amber-500 to-orange-600",
    rose: "bg-gradient-to-br from-rose-500 to-rose-600",
    emerald: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    blue: "bg-gradient-to-br from-blue-500 to-blue-600",
    slate: "bg-gradient-to-br from-slate-700 to-slate-800",
  }[tone];
}

function shareOf(count: number, total: number): string {
  return total > 0 ? `${Math.round((count / total) * 100)}% daripada jumlah` : "Tiada data lagi";
}

// ── applicant ───────────────────────────────────────────────────────────────
const myApps = computed(() => workflow.myApplications);
const REVIEW = ["awaiting_employer_confirm", "sos_review", "technical_review", "pending_approval"];
const ACTION = ["awaiting_processing_payment", "awaiting_registration_payment", "query_applicant"];
const inReview = computed(() => myApps.value.filter((a) => REVIEW.includes(a.status)).length);
const actionNeeded = computed(() => myApps.value.filter((a) => ACTION.includes(a.status)).length);
const myCerts = computed(() => myApps.value.filter((a) => a.status === "certificate_issued").length);

const applicantStats = computed<StatCard[]>(() => [
  { icon: FileText, value: myApps.value.length, label: "Jumlah Permohonan", caption: "Sejak permohonan pertama", tone: "blue" },
  { icon: Clock, value: inReview.value, label: "Sedang Diproses", caption: shareOf(inReview.value, myApps.value.length), tone: "amber" },
  { icon: AlertCircle, value: actionNeeded.value, label: "Perlu Tindakan Anda", caption: actionNeeded.value ? "Menunggu tindakan anda" : "Tiada tindakan diperlukan", tone: "rose" },
  { icon: BadgeCheck, value: myCerts.value, label: "Sijil Dikeluarkan", caption: shareOf(myCerts.value, myApps.value.length), tone: "emerald" },
]);

// ── employer / confirmer ─────────────────────────────────────────────────────
const confirmations = computed(() => (session.currentPersonaId ? workflow.confirmationsFor(session.currentPersonaId) : []));
const employerStats = computed<StatCard[]>(() => [
  { icon: ShieldCheck, value: confirmations.value.length, label: "Menunggu Pengesahan", caption: "Perlu disahkan dalam 14 hari", tone: "amber" },
  { icon: UserCog, value: confirmations.value.filter((a) => a.workflowType === "OK").length, label: "Orang Kompeten", caption: shareOf(confirmations.value.filter((a) => a.workflowType === "OK").length, confirmations.value.length), tone: "blue" },
  { icon: Building2, value: confirmations.value.filter((a) => a.workflowType === "CE").length, label: "Kontraktor", caption: shareOf(confirmations.value.filter((a) => a.workflowType === "CE").length, confirmations.value.length), tone: "accent" },
  { icon: Timer, value: "14 hari", label: "Tempoh Pengesahan", caption: "Tempoh maksimum pengesahan", tone: "emerald" },
]);

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
const backStats = computed<StatCard[]>(() => [
  { icon: Inbox, value: queue.value.length, label: "Dalam Giliran", caption: "Menunggu tindakan (FIFO)", tone: "blue" },
  { icon: ListChecks, value: `${activeCount.value} / ${workflow.maxActiveTasks}`, label: "Tugasan Aktif", caption: "Had maksimum 3 tugasan", tone: "amber" },
  { icon: Timer, value: slaTarget.value ? `${slaTarget.value}j` : "-", label: "Sasaran Piagam", caption: "Piagam Pelanggan", tone: "emerald" },
]);

function open(id: string) {
  router.push(`/st/applications/${id}`);
}
</script>

<template>
  <div class="space-y-5">
    <!-- Hero header (flush under the top nav for external users, à la Portal Pemohon) -->
    <div
      class="st-brand-gradient p-6 text-white shadow-sm sm:p-7"
      :class="session.isKakitangan ? 'rounded-2xl' : '-mt-5 rounded-b-2xl md:-mt-6'"
    >
      <div class="flex items-center justify-between gap-4">
        <div class="min-w-0">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">{{ greeting }} 👋</p>
          <h1 class="mt-2 truncate text-2xl font-bold sm:text-3xl">{{ persona?.name }}</h1>
          <p class="mt-1.5 flex items-center gap-1.5 text-sm text-white/80">
            <ShieldCheck class="h-4 w-4 shrink-0" />
            <span class="truncate">{{ persona?.title }}</span>
          </p>
        </div>
        <div class="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold ring-1 ring-white/25 sm:flex">
          {{ initials }}
        </div>
      </div>
      <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/15 pt-3 text-xs text-white/80">
        <span class="capitalize">{{ todayLabel }}</span>
        <span class="flex items-center gap-1"><User class="h-3.5 w-3.5" /> {{ roleLabel }}</span>
      </div>
    </div>

    <!-- APPLICANT -->
    <template v-if="role === 'applicant'">
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div
          v-for="(s, i) in applicantStats"
          :key="i"
          class="rounded-xl p-5 shadow-sm transition-shadow hover:shadow-md"
          :class="toneGradient(s.tone)"
        >
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
            <component :is="s.icon" class="h-5 w-5 text-white" />
          </div>
          <p class="mt-3 text-3xl font-bold text-white">{{ s.value }}</p>
          <p class="mt-1 text-xs font-medium text-white/90">{{ s.label }}</p>
          <p class="mt-2 text-[11px] text-white/70">{{ s.caption }}</p>
        </div>
      </div>

      <!-- Tindakan Pantas -->
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-sm font-semibold text-slate-900">Tindakan Pantas</h2>
        <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <router-link
            to="/st/applications/new"
            class="flex items-center justify-between rounded-lg border border-[var(--accent-200)] bg-[var(--accent-50)] p-4 transition-colors hover:bg-[var(--accent-100)]"
          >
            <div class="flex items-center gap-3">
              <FilePlus2 class="h-5 w-5 text-[var(--accent-700)]" />
              <span class="text-sm font-medium text-[var(--accent-700)]">Permohonan Orang Kompeten</span>
            </div>
            <ArrowRight class="h-4 w-4 text-[var(--accent-600)]" />
          </router-link>
          <router-link
            to="/st/applications/new?type=CE"
            class="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100"
          >
            <div class="flex items-center gap-3">
              <FilePlus2 class="h-5 w-5 text-slate-600" />
              <span class="text-sm font-medium text-slate-900">Permohonan Kontraktor Elektrik</span>
            </div>
            <ArrowRight class="h-4 w-4 text-slate-500" />
          </router-link>
        </div>
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

      <!-- Perkhidmatan lain yang ditawarkan (same catalogue as /st/perkhidmatan) -->
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h2 class="text-sm font-semibold text-slate-900">Perkhidmatan Lain Yang Ditawarkan</h2>
            <p class="mt-0.5 text-xs text-slate-500">Perkhidmatan Suruhanjaya Tenaga selain pendaftaran.</p>
          </div>
          <router-link to="/st/perkhidmatan" class="shrink-0 text-xs font-medium text-[var(--accent-700)] hover:underline">
            Lihat semua
          </router-link>
        </div>

        <div v-for="group in otherGroups" :key="group.id" class="mt-5">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{{ group.title }}</p>
          <div class="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="tile in group.tiles"
              :key="tile.code"
              class="flex items-start gap-3 rounded-lg border border-slate-200 p-3 transition-colors"
              :class="tile.available ? 'hover:border-[var(--accent-ring)] hover:bg-slate-50' : 'opacity-75'"
            >
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-50)] text-[var(--accent-700)]">
                <component :is="tile.icon" class="h-4.5 w-4.5" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5">
                  <p class="truncate text-sm font-medium text-slate-900">{{ tile.title }}</p>
                  <span
                    class="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide"
                    :class="tile.available ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-100 text-amber-700'"
                  >{{ tile.available ? 'Tersedia' : 'Akan Datang' }}</span>
                </div>
                <p class="mt-0.5 truncate text-[11px] text-slate-500">{{ tile.actRef }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- EMPLOYER / CONFIRMER -->
    <template v-else-if="role === 'employer'">
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div
          v-for="(s, i) in employerStats"
          :key="i"
          class="rounded-xl p-5 shadow-sm transition-shadow hover:shadow-md"
          :class="toneGradient(s.tone)"
        >
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
            <component :is="s.icon" class="h-5 w-5 text-white" />
          </div>
          <p class="mt-3 text-3xl font-bold text-white">{{ s.value }}</p>
          <p class="mt-1 text-xs font-medium text-white/90">{{ s.label }}</p>
          <p class="mt-2 text-[11px] text-white/70">{{ s.caption }}</p>
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
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div
          v-for="(s, i) in backStats"
          :key="i"
          class="rounded-xl p-5 shadow-sm transition-shadow hover:shadow-md"
          :class="toneGradient(s.tone)"
        >
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
            <component :is="s.icon" class="h-5 w-5 text-white" />
          </div>
          <p class="mt-3 text-3xl font-bold text-white">{{ s.value }}</p>
          <p class="mt-1 text-xs font-medium text-white/90">{{ s.label }}</p>
          <p class="mt-2 text-[11px] text-white/70">{{ s.caption }}</p>
        </div>
        <!-- SLA breakdown -->
        <div class="rounded-xl p-5 shadow-sm transition-shadow hover:shadow-md" :class="toneGradient('slate')">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
            <Activity class="h-5 w-5 text-white" />
          </div>
          <div class="mt-3 flex items-center gap-3">
            <span class="flex items-center gap-1 text-2xl font-bold text-white"><span class="h-2.5 w-2.5 rounded-full bg-emerald-400" />{{ slaBreakdown.green }}</span>
            <span class="flex items-center gap-1 text-2xl font-bold text-white"><span class="h-2.5 w-2.5 rounded-full bg-amber-400" />{{ slaBreakdown.yellow }}</span>
            <span class="flex items-center gap-1 text-2xl font-bold text-white"><span class="h-2.5 w-2.5 rounded-full bg-rose-400" />{{ slaBreakdown.red }}</span>
          </div>
          <p class="mt-1 text-xs font-medium text-white/90">Status SLA Giliran</p>
          <p class="mt-2 text-[11px] text-white/70">Hijau · Kuning · Merah</p>
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
