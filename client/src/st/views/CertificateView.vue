<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft, Printer } from "lucide-vue-next";

import type { Certificate } from "../types";
import { withCeCertificateFields } from "../certificate-ce";
import { withOkCertificateFields } from "../certificate-ok";
import { useStWorkflowStore } from "../stores/workflow";
import CertificateCard from "../components/CertificateCard.vue";

const route = useRoute();
const router = useRouter();
const workflow = useStWorkflowStore();

const app = computed(() => workflow.byId(String(route.params.id)));

function enrichCertificate(a: NonNullable<typeof app.value>, base: Certificate): Certificate {
  if (a.workflowType === "CE") return withCeCertificateFields(base, a);
  return withOkCertificateFields(base, a);
}

/** Prefer stored digital sijil; synthesize when status is issued but payload is missing. */
const displayCert = computed<Certificate | undefined>(() => {
  const a = app.value;
  if (!a) return undefined;
  if (a.certificate) {
    return enrichCertificate(a, a.certificate);
  }
  if (a.status !== "certificate_issued") return undefined;

  const refTail = a.refNo.split("/").pop() ?? a.id;
  const issuedAt = a.updatedAt || a.stageEnteredAt || a.createdAt;
  const issuedMs = Date.parse(issuedAt);
  const years = a.registrationPeriodYears || 1;
  const serialNo = `ST-${a.workflowType}-2026-${refTail}`;
  const base: Certificate = {
    id: `cert-${a.id}`,
    serialNo,
    applicationId: a.id,
    holderName: a.workflowType === "CE" ? (a.employer?.name ?? a.applicant.fullName) : a.applicant.fullName,
    competencyCategory: a.competencyCategory,
    contractorClass: a.contractorClass,
    contractorKind: a.contractorKind,
    issuedAt,
    expiresAt: new Date(
      (Number.isFinite(issuedMs) ? issuedMs : Date.now()) + years * 365 * 24 * 3_600_000,
    ).toISOString(),
    qrPayload: `https://verify.st.gov.my/cert/${serialNo}`,
    trustmarkId: `ST-TRUST-${refTail}`,
  };
  return enrichCertificate(a, base);
});

const hasCert = computed(() => Boolean(displayCert.value));
const okCerts = computed(() => app.value?.okCertificates ?? []);

function printPage() {
  window.print();
}

function goBack() {
  const a = app.value;
  if (!a) {
    router.push("/st");
    return;
  }
  if (a.workflowType === "CE") {
    router.push(`/st/registration/contractor-electric/applications/${a.id}`);
    return;
  }
  router.push(`/st/applications/${a.id}`);
}
</script>

<template>
  <div v-if="app" class="space-y-5 print:space-y-3">
    <div class="flex items-center justify-between print:hidden">
      <button class="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800" @click="goBack">
        <ArrowLeft class="h-4 w-4" /> Kembali ke permohonan
      </button>
      <button
        v-if="hasCert"
        class="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        @click="printPage"
      >
        <Printer class="h-4 w-4" /> Cetak
      </button>
    </div>

    <template v-if="hasCert && displayCert">
      <CertificateCard :application="app" :certificate="displayCert" />

      <div v-if="okCerts.length" class="space-y-3 print:break-before-page">
        <h2 class="text-sm font-semibold text-slate-700 print:hidden">Sijil Orang Kompeten Dilantik</h2>
        <CertificateCard
          v-for="okCert in okCerts"
          :key="okCert.serialNo"
          :application="app"
          :certificate="okCert"
          heading="Perakuan Orang Kompeten"
        />
      </div>
    </template>
    <div v-else class="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
      Sijil belum dikeluarkan untuk permohonan ini.
    </div>
  </div>

  <div v-else class="py-16 text-center text-slate-500">Permohonan tidak dijumpai.</div>
</template>
