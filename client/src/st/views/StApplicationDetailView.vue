<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft, BadgeCheck, Building2, FileText, Receipt, ShieldCheck, UserCheck } from "lucide-vue-next";

import { getStaffTaskNotifyState } from "@/api/st-registration";
import { useStWorkflowStore } from "../stores/workflow";
import { competencyMeta, contractorClassMeta } from "../mock/competencies";
import { workflowLabel } from "../status";
import StatusBadge from "../components/StatusBadge.vue";
import SlaIndicator from "../components/SlaIndicator.vue";
import WorkflowStepper from "../components/WorkflowStepper.vue";
import AuditTrailTimeline from "../components/AuditTrailTimeline.vue";
import ApplicationActionBar from "../components/ApplicationActionBar.vue";

const route = useRoute();
const router = useRouter();
const workflow = useStWorkflowStore();

const app = computed(() => workflow.byId(String(route.params.id)));

const STAGE_BY_ROLE: Record<string, string> = {
  sos: "sos_review",
  technical: "technical_review",
  approver: "pending_approval",
};

/** Heal mock status from email deep-link (?stage=) or last server notify. */
async function applyEmailStageSync() {
  const id = String(route.params.id ?? "");
  if (!id) return;

  const stageFromQuery = typeof route.query.stage === "string" ? route.query.stage : "";
  if (stageFromQuery) {
    workflow.syncFromEmailStage(id, stageFromQuery);
    return;
  }

  try {
    const res = await getStaffTaskNotifyState(id);
    const role = res.data?.role;
    const stage = role ? STAGE_BY_ROLE[role] : undefined;
    if (stage) workflow.syncFromEmailStage(id, stage);
  } catch {
    // Optional — ignore if unauthenticated or no notify recorded.
  }
}

onMounted(() => {
  void applyEmailStageSync();
});

watch(
  () => [route.params.id, route.query.stage],
  () => {
    void applyEmailStageSync();
  },
);

const categoryLine = computed(() => {
  const a = app.value;
  if (!a) return "";
  if (a.workflowType === "OK" && a.competencyCategory) {
    const m = competencyMeta(a.competencyCategory);
    return `${m.code} — ${m.label}`;
  }
  if (a.workflowType === "CE" && a.contractorClass) {
    const m = contractorClassMeta(a.contractorClass);
    return `${m.label} · ${m.ceilingLabel}`;
  }
  return "";
});

function fmt(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("ms-MY", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
</script>

<template>
  <div v-if="app" class="space-y-10">
    <button
      class="flex items-center gap-1.5 rounded-md border border-black px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-black/5"
      @click="router.back()"
    >
      <ArrowLeft class="h-4 w-4" /> Kembali
    </button>

    <!-- Header -->
    <div class="border-b border-slate-200 pb-4">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="font-mono text-xs text-slate-500">{{ app.refNo }}</p>
          <h1 class="text-lg font-semibold text-slate-900">{{ workflowLabel(app.workflowType) }}</h1>
          <p class="text-sm text-slate-500">{{ categoryLine }} · {{ app.registrationPeriodYears }} tahun</p>
        </div>
        <div class="flex flex-col items-end gap-2">
          <StatusBadge :status="app.status" />
          <SlaIndicator v-if="app.slaTargetHours > 0" :stage-entered-at="app.stageEnteredAt" :target-hours="app.slaTargetHours" :role="app.assignedRole" />
        </div>
      </div>

      <div class="mt-5 overflow-x-auto pb-1">
        <WorkflowStepper :status="app.status" />
      </div>
    </div>

    <!-- Action bar -->
    <div class="rounded-xl border border-rose-200 bg-rose-50 p-4">
      <div class="flex flex-wrap items-center justify-end gap-3">
        <p class="text-xs font-semibold uppercase tracking-wider text-rose-700">Tindakan</p>
        <ApplicationActionBar :application="app" />
      </div>
      <p class="mt-2 text-right text-xs text-slate-500" v-if="app.status === 'certificate_issued'">Permohonan selesai. Sijil digital telah dikeluarkan.</p>
    </div>

    <div class="grid gap-6 md:grid-cols-2 md:divide-x md:divide-slate-200">
      <!-- Applicant -->
      <div class="md:pr-6">
        <h2 class="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900"><UserCheck class="h-4 w-4 text-slate-400" /> Maklumat Pemohon</h2>
        <dl class="space-y-1.5 text-sm">
          <div class="flex justify-between"><dt class="text-slate-500">Nama</dt><dd class="font-medium text-slate-800">{{ app.applicant.fullName }}</dd></div>
          <div class="flex justify-between"><dt class="text-slate-500">No. KP</dt><dd class="font-mono text-slate-800">{{ app.applicant.icNumber }}</dd></div>
          <div class="flex justify-between"><dt class="text-slate-500">Umur</dt><dd class="text-slate-800">{{ app.applicant.age }} tahun</dd></div>
          <div class="flex justify-between"><dt class="text-slate-500">Telefon</dt><dd class="text-slate-800">{{ app.applicant.phone }}</dd></div>
          <div class="flex justify-between"><dt class="text-slate-500">E-mel</dt><dd class="text-slate-800">{{ app.applicant.email }}</dd></div>
        </dl>

        <div v-if="app.identityCheck" class="mt-3 flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          <ShieldCheck class="h-4 w-4" />
          Identiti disahkan (JPN — {{ app.identityCheck.jpnStatus === 'alive' ? 'masih hidup' : app.identityCheck.jpnStatus }}) · {{ fmt(app.identityCheck.checkedAt) }}
        </div>
      </div>

      <!-- Employer / confirmer -->
      <div v-if="app.employer" class="md:pl-6">
        <h2 class="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900"><Building2 class="h-4 w-4 text-slate-400" /> {{ app.workflowType === 'OK' ? 'Majikan' : 'Syarikat / Orang Kompeten' }}</h2>
        <dl class="space-y-1.5 text-sm">
          <div class="flex justify-between"><dt class="text-slate-500">Nama</dt><dd class="font-medium text-slate-800">{{ app.employer.name }}</dd></div>
          <div class="flex justify-between"><dt class="text-slate-500">No. Pendaftaran</dt><dd class="font-mono text-xs text-slate-800">{{ app.employer.registrationNo }}</dd></div>
          <div class="flex justify-between"><dt class="text-slate-500">Pegawai Dihubungi</dt><dd class="text-slate-800">{{ app.employer.contactPerson }}</dd></div>
        </dl>
      </div>
    </div>

    <!-- Documents -->
    <div>
      <h2 class="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900"><FileText class="h-4 w-4 text-slate-400" /> Dokumen Sokongan</h2>
      <p v-if="app.documents.length === 0" class="text-sm text-slate-400">Tiada dokumen dimuat naik.</p>
      <ul v-else>
        <li v-for="d in app.documents" :key="d.id" class="flex items-center justify-between border-b border-slate-100 py-2 text-sm last:border-0">
          <span class="text-slate-700">{{ d.label }}</span>
          <span class="font-mono text-xs text-slate-500">{{ d.fileName }} · {{ d.sizeKb }} KB</span>
        </li>
      </ul>
    </div>

    <!-- Payments -->
    <div v-if="app.payments.length">
      <h2 class="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900"><Receipt class="h-4 w-4 text-slate-400" /> Pembayaran</h2>
      <ul>
        <li v-for="p in app.payments" :key="p.id" class="flex items-center justify-between border-b border-slate-100 py-2 text-sm last:border-0">
          <span class="text-slate-700">{{ p.kind === 'processing' ? 'Yuran Pemprosesan' : 'Yuran Pendaftaran' }} <span class="text-xs text-slate-400">· {{ p.receiptNo }}</span></span>
          <span class="font-medium text-slate-800">RM {{ p.amount.toFixed(2) }}</span>
        </li>
      </ul>
    </div>

    <!-- Certificate & receipt links -->
    <div v-if="app.status === 'certificate_issued' || app.payments.length" class="grid gap-3 sm:grid-cols-2">
      <button
        v-if="app.payments.length"
        class="flex w-full items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-left hover:bg-emerald-100"
        @click="router.push(`/st/applications/${app.id}/receipt`)"
      >
        <span class="flex items-center gap-3">
          <Receipt class="h-6 w-6 text-emerald-600" />
          <span>
            <span class="block text-sm font-semibold text-slate-800">Resit Pembayaran</span>
            <span class="block text-xs text-slate-500">{{ app.payments.length }} resit · muat turun / cetak</span>
          </span>
        </span>
        <span class="text-sm font-medium text-emerald-700">Buka →</span>
      </button>

      <button
        v-if="app.status === 'certificate_issued'"
        class="flex w-full items-center justify-between rounded-xl border border-[var(--accent-200)] bg-[var(--accent-50)] p-4 text-left hover:bg-[var(--accent-100)]"
        @click="router.push(`/st/applications/${app.id}/certificate`)"
      >
        <span class="flex items-center gap-3">
          <BadgeCheck class="h-6 w-6 text-[var(--accent-600)]" />
          <span>
            <span class="block text-sm font-semibold text-slate-800">Sijil Digital Tersedia</span>
            <span class="block text-xs text-slate-500">Lihat sijil dengan kod QR & trustmark</span>
          </span>
        </span>
        <span class="text-sm font-medium text-[var(--accent-700)]">Buka →</span>
      </button>
    </div>

    <!-- Audit trail -->
    <div>
      <h2 class="mb-4 text-sm font-semibold text-slate-900">Jejak Audit</h2>
      <AuditTrailTimeline :entries="app.auditTrail" />
    </div>
  </div>

  <div v-else class="mx-auto max-w-md py-16 text-center">
    <p class="text-slate-500">Permohonan tidak dijumpai.</p>
    <button class="mt-3 text-sm font-medium text-[var(--accent-700)] hover:underline" @click="router.push('/st/dashboard')">Kembali ke papan pemuka</button>
  </div>
</template>
