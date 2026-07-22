<script setup lang="ts">
import { computed } from "vue";

import type { Application, Certificate, ContractorClass } from "../types";
import {
  CE_CLASS_CODES,
  ceCertificateTitle,
  ceKindLabel,
  formatCeDisplaySerial,
  formatFeeRm,
  withCeCertificateFields,
  fmtCertDate,
} from "../certificate-ce";
import {
  formatDisplaySerial,
  formatOkRestrictions,
  okCertificateTitle,
  resolveCategoryGrade,
  withOkCertificateFields,
} from "../certificate-ok";
import QrCode from "./QrCode.vue";

// `certificate` overrides the primary cert (used for CE appointed-OK sub-certs).
const props = defineProps<{ application: Application; certificate?: Certificate; heading?: string }>();

const cert = computed(() => {
  const raw = props.certificate ?? props.application.certificate;
  if (!raw) return undefined;
  if (props.application.workflowType === "CE" && (raw.contractorClass || !raw.competencyCategory)) {
    return withCeCertificateFields(raw, props.application);
  }
  // Enrich OK-style certs (no contractor class) with Borang N fields when missing.
  if (!raw.contractorClass) {
    return withOkCertificateFields(raw, props.application);
  }
  return withCeCertificateFields(raw, props.application);
});

const isCeStyle = computed(() => {
  if (!cert.value) return false;
  if (cert.value.contractorClass) return true;
  // Primary CE sijil may omit class (service/repair kinds); OK sub-certs have competencyCategory.
  if (props.application.workflowType === "CE" && !cert.value.competencyCategory) return true;
  return false;
});

const isOkStyle = computed(() => Boolean(cert.value) && !isCeStyle.value);

const okTitle = computed(() => okCertificateTitle(cert.value?.competencyCategory));

const ceTitle = computed(() =>
  ceCertificateTitle(cert.value?.contractorKind, props.application),
);

const ceRoleLabel = computed(() =>
  ceKindLabel(cert.value?.contractorKind, props.application),
);

const categoryGrade = computed(() =>
  resolveCategoryGrade(
    cert.value?.competencyCategory,
    props.application.competencyCertificate,
    cert.value?.categoryGrade,
  ),
);

const restrictions = computed(() =>
  formatOkRestrictions(props.application.competencyCertificate, cert.value?.restrictions),
);

const displaySerial = computed(() => {
  const c = cert.value;
  if (!c) return "";
  if (isCeStyle.value) return formatCeDisplaySerial(c.serialNo, c.issuedAt);
  return formatDisplaySerial(c.serialNo, c.competencyCategory);
});

const holderInitials = computed(() => {
  const name = cert.value?.holderName ?? "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
});

const periodYears = computed(() => cert.value?.periodYears ?? props.application.registrationPeriodYears ?? 1);

const activeClass = computed<ContractorClass | undefined>(() => cert.value?.contractorClass);

const addressLines = computed(() => {
  const raw = cert.value?.businessAddress ?? "";
  return raw
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
});
</script>

<template>
  <!-- ── Borang Q — Sijil CE (Perakuan Pendaftaran Kontraktor Elektrik) ───── -->
  <article
    v-if="cert && isCeStyle"
    class="ce-cert mx-auto max-w-[640px] overflow-hidden border border-slate-300 bg-[#fafaf8] text-slate-900 shadow-md print:max-w-none print:border-slate-800 print:shadow-none"
  >
    <header class="flex items-start justify-between gap-3 border-b border-slate-200 px-6 pb-3 pt-5">
      <p class="max-w-[38%] text-[11px] leading-snug text-slate-700">
        <span class="mt-0.5 block font-mono tracking-wide">{{ cert.registrationNo }}</span>
      </p>
      <div class="flex flex-col items-center gap-1 pt-0.5">
        <img src="/logo-st-color.svg" alt="Suruhanjaya Tenaga" class="h-9 w-auto" />
      </div>
      <p class="max-w-[38%] text-right text-[11px] leading-snug text-slate-700">
        <span class="font-semibold">NO:</span>
        <span class="mt-0.5 block font-mono tracking-wide">{{ displaySerial }}</span>
      </p>
    </header>

    <div class="space-y-3 px-6 py-5 text-center">
      <div class="space-y-0.5">
        <p class="text-sm font-bold tracking-wide">BORANG Q</p>
        <p class="text-xs text-slate-600">(peraturan 75)</p>
      </div>

      <div class="space-y-0.5 pt-1">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-700">Akta Bekalan Elektrik 1990</p>
      </div>

      <h1 class="px-2 pt-2 text-base font-extrabold uppercase leading-snug tracking-wide text-slate-900 sm:text-lg">
        {{ ceTitle }}
      </h1>

      <p class="mx-auto max-w-lg pt-2 text-justify text-[11px] leading-relaxed text-slate-700 sm:text-xs">
        Mengikut peraturan 75 Peraturan-Peraturan Elektrik 1994, Perakuan ini dikeluarkan kepada
      </p>

      <p class="pt-1 text-lg font-bold uppercase tracking-wide text-slate-900 sm:text-xl">
        {{ cert.holderName }}
      </p>
      <p class="text-[10px] uppercase tracking-wider text-slate-500">(nama syarikat)</p>

      <p class="mx-auto max-w-lg pt-2 text-justify text-[11px] leading-relaxed text-slate-700 sm:text-xs">
        dan memberi kuasa kepada pemegang untuk menjalankan perniagaan kerja elektrik sebagai
        {{ ceRoleLabel }} di :
      </p>

      <div class="mx-auto max-w-md space-y-0.5 pt-1 text-center text-sm font-semibold uppercase leading-snug text-slate-900">
        <p v-for="(line, i) in addressLines" :key="i">{{ line }}</p>
        <p class="text-[10px] font-normal normal-case tracking-wider text-slate-500">(alamat perniagaan dan cawangan)</p>
      </div>

      <div
        v-if="activeClass"
        class="flex flex-wrap items-center justify-center gap-2 pt-4 text-xs sm:text-sm"
      >
        <span class="text-slate-700">di bawah kelas</span>
        <div class="flex items-center gap-1.5">
          <span
            v-for="code in CE_CLASS_CODES"
            :key="code"
            class="flex h-8 w-8 items-center justify-center border-2 border-slate-800 text-sm font-bold"
            :class="activeClass === code ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-500'"
          >
            {{ activeClass === code ? code : "X" }}
          </span>
        </div>
      </div>

      <p class="mx-auto max-w-lg pt-2 text-justify text-[11px] leading-relaxed text-slate-700 sm:text-xs">
        selama tempoh
        <span class="font-bold">{{ periodYears }} tahun**</span>
        dari tarikh diperbaharui yang ditunjukkan di :
      </p>
    </div>

    <div class="grid grid-cols-[1fr_auto] items-end gap-4 px-6 pb-5 pt-1">
      <div class="space-y-2.5 text-left text-xs sm:text-sm">
        <div class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2">
          <p class="text-slate-500">Tarikh diperbaharui</p>
          <p class="font-semibold">: {{ fmtCertDate(cert.issuedAt) }}</p>
          <p class="text-slate-500">Tarikh Habis Tempoh</p>
          <p class="font-semibold">: {{ fmtCertDate(cert.expiresAt) }}</p>
          <p class="text-slate-500">No. Pendaftaran</p>
          <p class="font-mono text-[11px] font-semibold sm:text-xs">: {{ cert.registrationNo }}</p>
          <p class="text-slate-500">Fi RM</p>
          <p class="font-semibold">: {{ formatFeeRm(cert.feeRm) }}</p>
        </div>
        <div class="flex items-center gap-2 pt-2 print:hidden">
          <QrCode :value="cert.qrPayload" :size="56" />
          <div class="text-[9px] leading-tight text-slate-500">
            <p>Imbas untuk sahkan</p>
            <p class="font-mono text-emerald-700">{{ cert.trustmarkId }}</p>
          </div>
        </div>
      </div>

      <div class="flex w-[140px] flex-col items-center text-center">
        <div class="relative mb-2 flex h-[88px] w-[88px] items-center justify-center">
          <div
            class="pointer-events-none flex h-[88px] w-[88px] flex-col items-center justify-center rounded-full border-[3px] border-[#1e4a8c]/70"
            aria-hidden="true"
          >
            <div class="flex h-[72px] w-[72px] flex-col items-center justify-center rounded-full border border-[#1e4a8c]/50 px-1">
              <p class="text-[6px] font-bold uppercase leading-tight tracking-wide text-[#1e4a8c]/90">Suruhanjaya Tenaga</p>
              <p class="mt-0.5 text-[8px] font-extrabold uppercase text-[#1e4a8c]">Energy Commission</p>
              <p class="text-[6px] font-bold uppercase text-[#1e4a8c]/90">Malaysia</p>
            </div>
          </div>
        </div>
        <div class="w-full border-t border-slate-400 pt-1">
          <p
            class="font-[cursive] text-sm italic leading-none text-slate-800"
            style="font-family: 'Segoe Script', 'Brush Script MT', cursive"
          >
            {{ (cert.signatoryName ?? "").split(" ").slice(-2).join(" ") }}
          </p>
          <p class="mt-1 text-[10px] font-bold uppercase leading-tight">{{ cert.signatoryName }}</p>
          <p class="text-[10px] text-slate-600">{{ cert.signatoryAgency }}</p>
        </div>
      </div>
    </div>

    <footer class="border-t border-slate-300 px-6 py-3 text-[9px] leading-relaxed text-slate-600">
      <p>** Tidak kurang daripada satu tahun dan tidak lebih daripada lima tahun.</p>
      <p class="mt-1 text-[8px] uppercase tracking-wider text-slate-400">
        Perakuan Pendaftaran Kontraktor · Sijil Digital
      </p>
    </footer>
  </article>

  <!-- ── Borang N — Sijil OK (Perakuan Kekompetenan) ─────────────────────── -->
  <article
    v-else-if="cert && isOkStyle"
    class="ok-cert mx-auto max-w-[640px] overflow-hidden border border-slate-300 bg-[#fafaf8] text-slate-900 shadow-md print:max-w-none print:border-slate-800 print:shadow-none"
  >
    <!-- Header numbers + logo -->
    <header class="flex items-start justify-between gap-3 border-b border-slate-200 px-6 pb-3 pt-5">
      <p class="max-w-[38%] text-[11px] leading-snug text-slate-700">
        <span class="font-semibold">Perakuan No.:</span>
        <span class="mt-0.5 block font-mono tracking-wide">{{ cert.perakuanNo }}</span>
      </p>
      <div class="flex flex-col items-center gap-1 pt-0.5">
        <img src="/logo-st-color.svg" alt="Suruhanjaya Tenaga" class="h-9 w-auto" />
      </div>
      <p class="max-w-[38%] text-right text-[11px] leading-snug text-slate-700">
        <span class="font-semibold">No.:</span>
        <span class="mt-0.5 block font-mono tracking-wide">{{ displaySerial }}</span>
      </p>
    </header>

    <div class="space-y-4 px-6 py-5 text-center">
      <div class="space-y-0.5">
        <p class="text-sm font-bold tracking-wide">BORANG N</p>
        <p class="text-xs text-slate-600">(Peraturan 56)</p>
      </div>

      <div class="space-y-0.5 pt-1">
        <p class="text-sm font-bold uppercase tracking-wider">Suruhanjaya Tenaga</p>
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-700">Akta Bekalan Elektrik 1990</p>
      </div>

      <h1 class="px-2 pt-2 text-base font-extrabold uppercase leading-snug tracking-wide text-slate-900 sm:text-lg">
        {{ okTitle }}
      </h1>

      <p class="pt-3 text-lg font-bold uppercase tracking-wide text-slate-900 sm:text-xl">
        {{ cert.holderName }}
      </p>

      <div class="mx-auto grid max-w-md grid-cols-2 gap-x-4 gap-y-1 pt-1 text-left text-xs sm:text-sm">
        <p>
          <span class="text-slate-500">Kad Pengenalan No.:</span>
          <span class="ml-1 font-mono font-semibold">{{ (cert.icNumber ?? "—").replace(/[-\s]/g, "") }}</span>
        </p>
        <p class="text-right">
          <span class="text-slate-500">Tarikh Lahir:</span>
          <span class="ml-1 font-semibold">{{ fmtCertDate(cert.dob) }}</span>
        </p>
      </div>

      <p class="mx-auto max-w-lg pt-2 text-justify text-[11px] leading-relaxed text-slate-700 sm:text-xs">
        telah diperiksa dan didapati mempunyai kelayakan yang ditetapkan oleh Peraturan-Peraturan Elektrik 1994
        yang dibuat di bawah Akta Bekalan Elektrik 1990. Perakuan Kekompetenan ini dikeluarkan kepadanya dan tidak
        boleh digunakan oleh mana-mana orang lain.
      </p>

      <div class="mx-auto grid max-w-md grid-cols-2 gap-4 pt-3 text-left text-xs sm:text-sm">
        <div>
          <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Kategori</p>
          <p class="mt-0.5 text-base font-bold tracking-wide">{{ categoryGrade }}</p>
        </div>
        <div>
          <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Sekatan, jika ada</p>
          <p class="mt-0.5 font-semibold leading-snug">{{ restrictions }}</p>
        </div>
      </div>
    </div>

    <!-- Issue details + photo / stamp -->
    <div class="grid grid-cols-[1fr_auto] items-end gap-4 px-6 pb-5 pt-2">
      <div class="space-y-2 text-left text-xs sm:text-sm">
        <div>
          <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Tempat</p>
          <p class="font-semibold">Dikeluarkan — {{ cert.issuedPlace }}</p>
          <p class="text-slate-600">Melalui — {{ cert.issuedVia }}</p>
        </div>
        <div>
          <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Tarikh</p>
          <p class="font-semibold">{{ fmtCertDate(cert.issuedAt) }}</p>
        </div>
        <div class="pt-2">
          <p class="text-[10px] text-slate-500">Sah hingga</p>
          <p class="font-medium text-slate-700">{{ fmtCertDate(cert.expiresAt) }}</p>
        </div>
        <div class="flex items-center gap-2 pt-1 print:hidden">
          <QrCode :value="cert.qrPayload" :size="64" />
          <div class="text-[9px] leading-tight text-slate-500">
            <p>Imbas untuk sahkan</p>
            <p class="font-mono text-emerald-700">{{ cert.trustmarkId }}</p>
          </div>
        </div>
      </div>

      <div class="flex w-[132px] flex-col items-center text-center">
        <div class="relative">
          <div
            class="flex h-[118px] w-[96px] items-center justify-center border border-slate-400 bg-[#4a90c8] text-2xl font-bold tracking-wider text-white/90"
            aria-hidden="true"
          >
            {{ holderInitials }}
          </div>
          <div
            class="pointer-events-none absolute -bottom-2 -left-4 flex h-[72px] w-[72px] items-center justify-center rounded-full border-[3px] border-[#1e4a8c]/70 bg-transparent"
            aria-hidden="true"
          >
            <div class="flex h-[58px] w-[58px] flex-col items-center justify-center rounded-full border border-[#1e4a8c]/50 px-1 text-center">
              <p class="text-[5px] font-bold uppercase leading-tight tracking-wide text-[#1e4a8c]/90">Suruhanjaya Tenaga</p>
              <p class="mt-0.5 text-[7px] font-extrabold uppercase text-[#1e4a8c]">Pengerusi</p>
              <p class="text-[5px] font-bold uppercase text-[#1e4a8c]/90">Malaysia</p>
            </div>
          </div>
        </div>
        <div class="mt-5 w-full border-t border-slate-400 pt-1">
          <p
            class="font-[cursive] text-sm italic leading-none text-slate-800"
            style="font-family: 'Segoe Script', 'Brush Script MT', cursive"
          >
            {{ (cert.signatoryName ?? "").split(" ").slice(-2).join(" ") }}
          </p>
          <p class="mt-1 text-[10px] font-bold uppercase leading-tight">{{ cert.signatoryName }}</p>
          <p class="text-[10px] text-slate-600">{{ cert.signatoryAgency }}</p>
        </div>
      </div>
    </div>

    <footer class="border-t border-slate-300 px-6 py-3 text-[9px] leading-relaxed text-slate-600">
      <p>
        Perhatian: Jika perakuan ini dijumpai oleh sesiapa selain daripada pemiliknya, ia hendaklah dipulangkan
        segera kepada Suruhanjaya Tenaga.
      </p>
      <p class="mt-1 text-[8px] uppercase tracking-wider text-slate-400">PKN., KL. · Sijil Digital</p>
    </footer>
  </article>
</template>
