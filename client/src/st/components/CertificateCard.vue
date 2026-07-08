<script setup lang="ts">
import { computed } from "vue";
import { BadgeCheck, Zap } from "lucide-vue-next";

import type { Application, Certificate } from "../types";
import { competencyMeta, contractorClassMeta } from "../mock/competencies";
import { workflowShort } from "../status";
import QrCode from "./QrCode.vue";

// `certificate` overrides the primary cert (used for CE appointed-OK sub-certs).
const props = defineProps<{ application: Application; certificate?: Certificate; heading?: string }>();
const cert = computed(() => props.certificate ?? props.application.certificate);

const headingLabel = computed(() => props.heading ?? workflowShort(props.application.workflowType));

const categoryLine = computed(() => {
  const c = cert.value;
  if (!c) return "";
  if (c.competencyCategory) {
    const m = competencyMeta(c.competencyCategory);
    return `${m.code} — ${m.label}`;
  }
  if (c.contractorClass) {
    const m = contractorClassMeta(c.contractorClass);
    return `${m.label} (${m.ceilingLabel})`;
  }
  return "";
});

function fmtDate(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ms-MY", { day: "2-digit", month: "long", year: "numeric" });
}
</script>

<template>
  <div v-if="cert" class="overflow-hidden rounded-xl border border-[var(--accent-200)] bg-white shadow-sm">
    <div class="flex items-center justify-between bg-gradient-to-r from-[var(--accent-700)] to-[var(--accent-500)] px-6 py-4 text-white">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
          <Zap class="h-5 w-5" />
        </div>
        <div>
          <p class="text-sm font-semibold">Suruhanjaya Tenaga</p>
          <p class="text-[11px] uppercase tracking-wider text-white/80">Sijil Pendaftaran Digital</p>
        </div>
      </div>
      <BadgeCheck class="h-8 w-8 text-white/90" />
    </div>

    <div class="grid gap-6 px-6 py-6 sm:grid-cols-[1fr_auto]">
      <div class="space-y-3">
        <div>
          <p class="text-[11px] uppercase tracking-wider text-slate-400">Pemegang Sijil</p>
          <p class="text-lg font-semibold text-slate-900">{{ cert.holderName }}</p>
        </div>
        <div>
          <p class="text-[11px] uppercase tracking-wider text-slate-400">{{ headingLabel }}</p>
          <p class="text-sm font-medium text-slate-700">{{ categoryLine }}</p>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <p class="text-[11px] uppercase tracking-wider text-slate-400">No. Siri</p>
            <p class="font-mono text-sm text-slate-700">{{ cert.serialNo }}</p>
          </div>
          <div>
            <p class="text-[11px] uppercase tracking-wider text-slate-400">Tempoh Sah</p>
            <p class="text-sm text-slate-700">{{ application.registrationPeriodYears }} tahun</p>
          </div>
          <div>
            <p class="text-[11px] uppercase tracking-wider text-slate-400">Tarikh Dikeluarkan</p>
            <p class="text-sm text-slate-700">{{ fmtDate(cert.issuedAt) }}</p>
          </div>
          <div>
            <p class="text-[11px] uppercase tracking-wider text-slate-400">Tarikh Tamat</p>
            <p class="text-sm text-slate-700">{{ fmtDate(cert.expiresAt) }}</p>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center gap-2">
        <QrCode :value="cert.qrPayload" :size="120" />
        <p class="text-[10px] text-slate-400">Imbas untuk sahkan</p>
        <p class="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">{{ cert.trustmarkId }}</p>
      </div>
    </div>
  </div>
</template>
