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
const ACTION = ["awaiting_final_submit", "awaiting_processing_payment", "awaiting_registration_payment", "query_applicant"];
const inReview = computed(() => myApps.value.filter((a) => REVIEW.includes(a.status)).length);
const actionNeeded = computed(() => myApps.value.filter((a) => ACTION.includes(a.status)).length);
const myCerts = computed(() => myApps.value.filter((a) => a.status === "certificate_issued").length);
// CE NA-03: OK persona accepting contractor appointment.
const okConfirmations = computed(() =>
  session.currentPersonaId ? workflow.confirmationsFor(session.currentPersonaId) : [],
);

const applicantStats = computed<StatCard[]>(() => [
  { icon: FileText, value: myApps.value.length, label: "Jumlah Permohonan", caption: "Sejak permohonan pertama", tone: "blue" },
  { icon: Clock, value: inReview.value, label: "Sedang Diproses", caption: shareOf(inReview.value, myApps.value.length), tone: "amber" },
  {
    icon: AlertCircle,
    value: actionNeeded.value + okConfirmations.value.length,
    label: "Perlu Tindakan Anda",
    caption:
      actionNeeded.value + okConfirmations.value.length
        ? "Termasuk penerimaan pelantikan CE"
        : "Tiada tindakan diperlukan",
    tone: "rose",
  },
  { icon: BadgeCheck, value: myCerts.value, label: "Sijil Dikeluarkan", caption: shareOf(myCerts.value, myApps.value.length), tone: "emerald" },
]);

// ── employer / confirmer ─────────────────────────────────────────────────────
const confirmations = computed(() => (session.currentPersonaId ? workflow.confirmationsFor(session.currentPersonaId) : []));
/** Majikan-owned contractor (RG-CE) applications. */
const myCeApps = computed(() => myApps.value.filter((a) => a.workflowType === "CE"));
/** CE apps waiting for majikan NA-04 / NA-05 after OK acceptance. */
const ceActionNeeded = computed(() =>
  myCeApps.value.filter((a) =>
    ["awaiting_final_submit", "awaiting_processing_payment", "query_applicant", "awaiting_registration_payment"].includes(
      a.status,
    ),
  ),
);
const employerStats = computed<StatCard[]>(() => [
  { icon: ShieldCheck, value: confirmations.value.length, label: "Menunggu Pengesahan", caption: "Perlu disahkan dalam 14 hari", tone: "amber" },
  {
    icon: AlertCircle,
    value: ceActionNeeded.value.length,
    label: "Perlu Tindakan Majikan",
    caption: ceActionNeeded.value.length ? "Hantar permohonan / bayar fi" : "Tiada tindakan diperlukan",
    tone: "rose",
  },
  { icon: Building2, value: myCeApps.value.length, label: "Permohonan Kontraktor", caption: shareOf(myCeApps.value.length, myApps.value.length || myCeApps.value.length), tone: "accent" },
  { icon: UserCog, value: confirmations.value.filter((a) => a.workflowType === "OK").length, label: "Lantikan OK", caption: shareOf(confirmations.value.filter((a) => a.workflowType === "OK").length, confirmations.value.length), tone: "blue" },
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
        <div class="text-right text-xs text-slate-500 dark:text-slate-400">
          <p class="capitalize">{{ todayLabel }}</p>
          <p class="mt-0.5">{{ roleLabel }}</p>
        </div>
      </template>
      <p class="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
        <ShieldCheck class="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
        <span class="truncate">{{ persona?.title }}</span>
      </p>
    </StPageHero>

    <!-- APPLICANT -->
    <template v-if="role === 'applicant'">
      <div class="grid grid-cols-2 gap-y-5 sm:grid-cols-4 sm:divide-x sm:divide-slate-200 dark:sm:divide-slate-700">
        <div v-for="(s, i) in applicantStats" :key="i" class="px-0 sm:px-5 sm:first:pl-0">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{{ s.label }}</p>
          <p class="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{{ s.value }}</p>
          <p class="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span :class="['h-1.5 w-1.5 shrink-0 rounded-full', toneDot(s.tone)]" />
            {{ s.caption }}
          </p>
        </div>
      </div>

      <!-- Tindakan Pantas — Pemohon: Orang Kompeten only -->
      <div>
        <h2 class="text-sm font-semibold text-slate-900 dark:text-slate-100">Tindakan Pantas</h2>
        <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <router-link
            to="/st/registration/ok-electric/applications/new"
            class="flex items-center justify-between rounded-lg border border-[var(--accent-200)] bg-[var(--accent-50)] p-4 transition-colors hover:bg-[var(--accent-100)]"
          >
            <div class="flex items-center gap-3">
              <FilePlus2 class="h-5 w-5 text-[var(--accent-700)]" />
              <span class="text-sm font-medium text-[var(--accent-700)]">Permohonan Orang Kompeten</span>
            </div>
            <ArrowRight class="h-4 w-4 text-[var(--accent-600)]" />
          </router-link>
          <router-link
            to="/st/applications"
            class="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:bg-slate-700"
          >
            <div class="flex items-center gap-3">
              <FileText class="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <span class="text-sm font-medium text-slate-900 dark:text-slate-100">Permohonan Saya</span>
            </div>
            <ArrowRight class="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </router-link>
        </div>
      </div>

      <!-- Penerimaan Pelantikan (CE NA-03) -->
      <div v-if="okConfirmations.length" class="border-t border-slate-200 pt-8 dark:border-slate-700">
        <div class="border-b border-amber-200 pb-2 dark:border-amber-800">
          <h2 class="text-sm font-semibold text-amber-900 dark:text-amber-400">Penerimaan Pelantikan (PFD-RG-CE-NA-03)</h2>
          <p class="mt-0.5 text-xs text-amber-800/80 dark:text-amber-400/80">Sahkan atau tolak pelantikan sebagai OK bagi permohonan kontraktor.</p>
        </div>
        <button
          v-for="a in okConfirmations"
          :key="a.id"
          class="flex w-full items-center justify-between gap-3 border-b border-amber-100 py-3 text-left last:border-0 hover:bg-amber-50/60 dark:border-amber-900 dark:hover:bg-amber-500/10"
          @click="open(a.id)"
        >
          <div class="min-w-0">
            <p class="font-mono text-xs text-slate-500 dark:text-slate-400">{{ a.refNo }}</p>
            <p class="text-sm font-medium text-slate-800 dark:text-slate-200">{{ a.employer?.name ?? a.applicant.fullName }} · {{ workflowShort(a.workflowType) }}</p>
          </div>
          <StatusBadge :status="a.status" />
        </button>
      </div>

      <div class="border-t border-slate-200 pt-8 dark:border-slate-700">
        <div class="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-700">
          <h2 class="text-sm font-semibold text-slate-900 dark:text-slate-100">Permohonan Terkini</h2>
          <button class="text-xs font-medium text-[var(--accent-700)] hover:underline" @click="router.push('/st/applications')">Lihat semua</button>
        </div>
        <p v-if="myApps.length === 0" class="py-8 text-center text-sm text-slate-400 dark:text-slate-500">Belum ada permohonan. Mulakan satu di atas.</p>
        <button
          v-for="a in myApps.slice(0, 5)"
          :key="a.id"
          class="flex w-full items-center justify-between gap-3 border-b border-slate-100 py-3 text-left last:border-0 hover:bg-slate-50/60 dark:border-slate-800 dark:hover:bg-slate-800/60"
          @click="open(a.id)"
        >
          <div class="min-w-0">
            <p class="font-mono text-xs text-slate-500 dark:text-slate-400">{{ a.refNo }}</p>
            <p class="text-sm font-medium text-slate-800 dark:text-slate-200">{{ workflowShort(a.workflowType) }}</p>
          </div>
          <StatusBadge :status="a.status" />
        </button>
      </div>

      <!-- Perkhidmatan lain yang ditawarkan (same catalogue as /st/perkhidmatan) -->
      <div class="border-t border-slate-200 pt-8 dark:border-slate-700">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h2 class="text-sm font-semibold text-slate-900 dark:text-slate-100">Perkhidmatan Lain Yang Ditawarkan</h2>
            <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Perkhidmatan Suruhanjaya Tenaga selain pendaftaran.</p>
          </div>
          <router-link to="/st/perkhidmatan" class="shrink-0 text-xs font-medium text-[var(--accent-700)] hover:underline">
            Lihat semua
          </router-link>
        </div>

        <div v-for="group in otherGroups" :key="group.id" class="mt-5">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{{ group.title }}</p>
          <div class="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="tile in group.tiles"
              :key="tile.code"
              class="flex items-start gap-3 rounded-lg border border-slate-200 p-3 transition-colors dark:border-slate-700"
              :class="tile.available ? 'hover:border-[var(--accent-ring)] hover:bg-slate-50 dark:hover:bg-slate-800/60' : 'opacity-75'"
            >
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-50)] text-[var(--accent-700)]">
                <component :is="tile.icon" class="h-4.5 w-4.5" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5">
                  <p class="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{{ tile.title }}</p>
                  <span
                    class="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide"
                    :class="tile.available ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'"
                  >{{ tile.available ? 'Tersedia' : 'Akan Datang' }}</span>
                </div>
                <p class="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">{{ tile.actRef }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- EMPLOYER / MAJIKAN — Kontraktor Elektrik + pengesahan lantikan OK -->
    <template v-else-if="role === 'employer'">
      <div class="grid grid-cols-2 gap-y-5 sm:grid-cols-4 sm:divide-x sm:divide-slate-200 dark:sm:divide-slate-700">
        <div v-for="(s, i) in employerStats" :key="i" class="px-0 sm:px-5 sm:first:pl-0">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{{ s.label }}</p>
          <p class="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{{ s.value }}</p>
          <p class="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span :class="['h-1.5 w-1.5 shrink-0 rounded-full', toneDot(s.tone)]" />
            {{ s.caption }}
          </p>
        </div>
      </div>

      <!-- Tindakan Pantas -->
      <div>
        <h2 class="text-sm font-semibold text-slate-900 dark:text-slate-100">Tindakan Pantas</h2>
        <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <router-link
            to="/st/registration/contractor-electric/applications/new"
            class="flex items-center justify-between rounded-lg border border-[var(--accent-200)] bg-[var(--accent-50)] p-4 transition-colors hover:bg-[var(--accent-100)]"
          >
            <div class="flex items-center gap-3">
              <FilePlus2 class="h-5 w-5 text-[var(--accent-700)]" />
              <span class="text-sm font-medium text-[var(--accent-700)]">Permohonan Kontraktor Elektrik</span>
            </div>
            <ArrowRight class="h-4 w-4 text-[var(--accent-600)]" />
          </router-link>
          <router-link
            to="/st/registration/contractor-electric/applications"
            class="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:bg-slate-700"
          >
            <div class="flex items-center gap-3">
              <Building2 class="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <span class="text-sm font-medium text-slate-900 dark:text-slate-100">Permohonan Kontraktor</span>
            </div>
            <ArrowRight class="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </router-link>
        </div>
      </div>

      <!-- Hantar Permohonan / Bayaran (CE NA-04/05) -->
      <div v-if="ceActionNeeded.length" class="border-t border-slate-200 pt-8 dark:border-slate-700">
        <div class="border-b border-amber-200 pb-2 dark:border-amber-800">
          <h2 class="text-sm font-semibold text-amber-900 dark:text-amber-400">Hantar Permohonan / Bayaran (PFD-RG-CE-NA-04 / NA-05)</h2>
          <p class="mt-0.5 text-xs text-amber-800/80 dark:text-amber-400/80">OK telah menerima pelantikan — sila hantar permohonan dan bayar fi proses.</p>
        </div>
        <button
          v-for="a in ceActionNeeded"
          :key="a.id"
          class="flex w-full items-center justify-between gap-3 border-b border-amber-100 py-3 text-left last:border-0 hover:bg-amber-50/60 dark:border-amber-900 dark:hover:bg-amber-500/10"
          @click="open(a.id)"
        >
          <div class="min-w-0">
            <p class="font-mono text-xs text-slate-500 dark:text-slate-400">{{ a.refNo }}</p>
            <p class="text-sm font-medium text-slate-800 dark:text-slate-200">
              {{ a.employer?.name ?? a.applicant.fullName }} ·
              {{ a.status === "awaiting_final_submit" ? "Hantar Permohonan" : workflowShort(a.workflowType) }}
            </p>
          </div>
          <StatusBadge :status="a.status" />
        </button>
      </div>

      <div class="border-t border-slate-200 pt-8 dark:border-slate-700">
        <div class="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-700">
          <h2 class="text-sm font-semibold text-slate-900 dark:text-slate-100">Pengesahan Lantikan Diperlukan</h2>
          <button class="text-xs font-medium text-[var(--accent-700)] hover:underline" @click="router.push('/st/applications')">Lihat semua</button>
        </div>
        <p v-if="confirmations.length === 0" class="py-8 text-center text-sm text-slate-400 dark:text-slate-500">Tiada lantikan menunggu pengesahan.</p>
        <button
          v-for="a in confirmations"
          :key="a.id"
          class="flex w-full items-center justify-between gap-3 border-b border-slate-100 py-3 text-left last:border-0 hover:bg-slate-50/60 dark:border-slate-800 dark:hover:bg-slate-800/60"
          @click="open(a.id)"
        >
          <div class="min-w-0">
            <p class="font-mono text-xs text-slate-500 dark:text-slate-400">{{ a.refNo }}</p>
            <p class="text-sm font-medium text-slate-800 dark:text-slate-200">{{ a.applicant.fullName }} · {{ workflowShort(a.workflowType) }}</p>
          </div>
          <StatusBadge :status="a.status" />
        </button>
      </div>
    </template>

    <!-- BACK-OFFICE (sos / technical / approver) -->
    <template v-else-if="role">
      <div class="grid grid-cols-2 gap-y-5 sm:grid-cols-4 sm:divide-x sm:divide-slate-200 dark:sm:divide-slate-700">
        <div v-for="(s, i) in backStats" :key="i" class="px-0 sm:px-5 sm:first:pl-0">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{{ s.label }}</p>
          <p class="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{{ s.value }}</p>
          <p class="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span :class="['h-1.5 w-1.5 shrink-0 rounded-full', toneDot(s.tone)]" />
            {{ s.caption }}
          </p>
        </div>
        <!-- SLA breakdown -->
        <div class="px-0 sm:px-5">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Status SLA Giliran</p>
          <div class="mt-1.5 flex items-center gap-3">
            <span class="flex items-center gap-1.5 text-xl font-semibold text-slate-900 dark:text-slate-100"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />{{ slaBreakdown.green }}</span>
            <span class="flex items-center gap-1.5 text-xl font-semibold text-slate-900 dark:text-slate-100"><span class="h-1.5 w-1.5 rounded-full bg-amber-500" />{{ slaBreakdown.yellow }}</span>
            <span class="flex items-center gap-1.5 text-xl font-semibold text-slate-900 dark:text-slate-100"><span class="h-1.5 w-1.5 rounded-full bg-rose-500" />{{ slaBreakdown.red }}</span>
          </div>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Hijau · Kuning · Merah</p>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-700">
          <h2 class="text-sm font-semibold text-slate-900 dark:text-slate-100">Giliran Terkini (FIFO)</h2>
          <button class="text-xs font-medium text-[var(--accent-700)] hover:underline" @click="router.push('/st/inbox')">Buka peti tugasan</button>
        </div>
        <p v-if="queue.length === 0" class="py-8 text-center text-sm text-slate-400 dark:text-slate-500">Tiada tugasan dalam giliran.</p>
        <button
          v-for="(it, i) in queue.slice(0, 5)"
          :key="it.applicationId"
          class="flex w-full items-center justify-between gap-3 border-b border-slate-100 py-3 text-left last:border-0 hover:bg-slate-50/60 dark:border-slate-800 dark:hover:bg-slate-800/60"
          @click="open(it.applicationId)"
        >
          <div class="flex min-w-0 items-center gap-2">
            <span class="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-100 px-1 text-[10px] font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-400">{{ i + 1 }}</span>
            <div>
              <p class="font-mono text-xs text-slate-500 dark:text-slate-400">{{ it.refNo }}</p>
              <p class="text-sm font-medium text-slate-800 dark:text-slate-200">{{ it.applicantName }}</p>
            </div>
          </div>
          <SlaIndicator :stage-entered-at="it.stageEnteredAt" :target-hours="it.slaTargetHours" />
        </button>
      </div>
    </template>
  </div>
</template>
