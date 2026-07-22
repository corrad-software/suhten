<script setup lang="ts">
import { computed, type Component } from "vue";
import { useRouter } from "vue-router";
import {
  FilePlus2, FileText, Inbox, ShieldCheck, Clock, AlertCircle, BadgeCheck,
  Building2, UserCog, Timer, ListChecks, ArrowRight,
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
import StPageHero from "../components/StPageHero.vue";

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
type Tone = "accent" | "amber" | "rose" | "emerald" | "blue" | "slate";
interface StatCard { icon: Component; value: number | string; label: string; caption: string; tone: Tone }

// Semantic dot colour per tone — kept separate from the single ST accent hue.
function toneDot(tone: Tone): string {
  return {
    accent: "bg-[var(--accent-600)]",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    emerald: "bg-emerald-500",
    blue: "bg-[var(--accent-600)]",
    slate: "bg-slate-500",
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
  <div class="space-y-8">
    <StPageHero :title="persona?.name ?? ''" :eyebrow="`${greeting} 👋`">
      <template #action>
        <div class="text-right text-xs text-slate-500">
          <p class="capitalize">{{ todayLabel }}</p>
          <p class="mt-0.5">{{ roleLabel }}</p>
        </div>
      </template>
      <p class="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
        <ShieldCheck class="h-4 w-4 shrink-0 text-slate-400" />
        <span class="truncate">{{ persona?.title }}</span>
      </p>
    </StPageHero>

    <!-- APPLICANT -->
    <template v-if="role === 'applicant'">
      <div class="grid grid-cols-2 gap-y-5 sm:grid-cols-4 sm:divide-x sm:divide-slate-200">
        <div v-for="(s, i) in applicantStats" :key="i" class="px-0 sm:px-5 sm:first:pl-0">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{{ s.label }}</p>
          <p class="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900">{{ s.value }}</p>
          <p class="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <span :class="['h-1.5 w-1.5 shrink-0 rounded-full', toneDot(s.tone)]" />
            {{ s.caption }}
          </p>
        </div>
      </div>

      <!-- Tindakan Pantas -->
      <div>
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

      <div>
        <div class="flex items-center justify-between border-b border-slate-200 pb-2">
          <h2 class="text-sm font-semibold text-slate-900">Permohonan Terkini</h2>
          <button class="text-xs font-medium text-[var(--accent-700)] hover:underline" @click="router.push('/st/applications')">Lihat semua</button>
        </div>
        <p v-if="myApps.length === 0" class="py-8 text-center text-sm text-slate-400">Belum ada permohonan. Mulakan satu di atas.</p>
        <button
          v-for="a in myApps.slice(0, 5)"
          :key="a.id"
          class="flex w-full items-center justify-between gap-3 border-b border-slate-100 py-3 text-left last:border-0 hover:bg-slate-50/60"
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
      <div>
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
      <div class="grid grid-cols-2 gap-y-5 sm:grid-cols-4 sm:divide-x sm:divide-slate-200">
        <div v-for="(s, i) in employerStats" :key="i" class="px-0 sm:px-5 sm:first:pl-0">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{{ s.label }}</p>
          <p class="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900">{{ s.value }}</p>
          <p class="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <span :class="['h-1.5 w-1.5 shrink-0 rounded-full', toneDot(s.tone)]" />
            {{ s.caption }}
          </p>
        </div>
      </div>

      <div>
        <div class="border-b border-slate-200 pb-2">
          <h2 class="text-sm font-semibold text-slate-900">Pengesahan Lantikan Diperlukan</h2>
        </div>
        <p v-if="confirmations.length === 0" class="py-8 text-center text-sm text-slate-400">Tiada lantikan menunggu pengesahan.</p>
        <button
          v-for="a in confirmations"
          :key="a.id"
          class="flex w-full items-center justify-between gap-3 border-b border-slate-100 py-3 text-left last:border-0 hover:bg-slate-50/60"
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
      <div class="grid grid-cols-2 gap-y-5 sm:grid-cols-4 sm:divide-x sm:divide-slate-200">
        <div v-for="(s, i) in backStats" :key="i" class="px-0 sm:px-5 sm:first:pl-0">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{{ s.label }}</p>
          <p class="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900">{{ s.value }}</p>
          <p class="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <span :class="['h-1.5 w-1.5 shrink-0 rounded-full', toneDot(s.tone)]" />
            {{ s.caption }}
          </p>
        </div>
        <!-- SLA breakdown -->
        <div class="px-0 sm:px-5">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Status SLA Giliran</p>
          <div class="mt-1.5 flex items-center gap-3">
            <span class="flex items-center gap-1.5 text-xl font-semibold text-slate-900"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />{{ slaBreakdown.green }}</span>
            <span class="flex items-center gap-1.5 text-xl font-semibold text-slate-900"><span class="h-1.5 w-1.5 rounded-full bg-amber-500" />{{ slaBreakdown.yellow }}</span>
            <span class="flex items-center gap-1.5 text-xl font-semibold text-slate-900"><span class="h-1.5 w-1.5 rounded-full bg-rose-500" />{{ slaBreakdown.red }}</span>
          </div>
          <p class="mt-1 text-xs text-slate-500">Hijau · Kuning · Merah</p>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between border-b border-slate-200 pb-2">
          <h2 class="text-sm font-semibold text-slate-900">Giliran Terkini (FIFO)</h2>
          <button class="text-xs font-medium text-[var(--accent-700)] hover:underline" @click="router.push('/st/inbox')">Buka peti tugasan</button>
        </div>
        <p v-if="queue.length === 0" class="py-8 text-center text-sm text-slate-400">Tiada tugasan dalam giliran.</p>
        <button
          v-for="(it, i) in queue.slice(0, 5)"
          :key="it.applicationId"
          class="flex w-full items-center justify-between gap-3 border-b border-slate-100 py-3 text-left last:border-0 hover:bg-slate-50/60"
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
