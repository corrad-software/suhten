<script setup lang="ts">
import { CheckCircle2 } from "lucide-vue-next";
import type { Payment } from "../types";

const props = defineProps<{ payment: Payment; refNo: string; payerName: string }>();

function fmt(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("ms-MY", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const kindLabel = props.payment.kind === "processing" ? "Yuran Pemprosesan" : "Yuran Pendaftaran";
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <div class="flex items-center gap-2 border-b border-dashed border-slate-200 bg-emerald-50 px-5 py-3 dark:border-slate-700 dark:bg-emerald-500/15">
      <CheckCircle2 class="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      <p class="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Resit Bayaran Berjaya</p>
    </div>
    <dl class="divide-y divide-slate-100 px-5 py-2 text-sm dark:divide-slate-800">
      <div class="flex justify-between py-2"><dt class="text-slate-500 dark:text-slate-400">No. Resit</dt><dd class="font-mono text-slate-800 dark:text-slate-200">{{ payment.receiptNo }}</dd></div>
      <div class="flex justify-between py-2"><dt class="text-slate-500 dark:text-slate-400">No. Rujukan Permohonan</dt><dd class="font-mono text-slate-800 dark:text-slate-200">{{ refNo }}</dd></div>
      <div class="flex justify-between py-2"><dt class="text-slate-500 dark:text-slate-400">Pembayar</dt><dd class="text-slate-800 dark:text-slate-200">{{ payerName }}</dd></div>
      <div class="flex justify-between py-2"><dt class="text-slate-500 dark:text-slate-400">Perkara</dt><dd class="text-slate-800 dark:text-slate-200">{{ kindLabel }}</dd></div>
      <div class="flex justify-between py-2"><dt class="text-slate-500 dark:text-slate-400">Saluran (FPX)</dt><dd class="text-slate-800 dark:text-slate-200">{{ payment.bank }}</dd></div>
      <div class="flex justify-between py-2"><dt class="text-slate-500 dark:text-slate-400">No. Rujukan FPX</dt><dd class="font-mono text-slate-800 dark:text-slate-200">{{ payment.fpxRef }}</dd></div>
      <div class="flex justify-between py-2"><dt class="text-slate-500 dark:text-slate-400">Tarikh & Masa</dt><dd class="text-slate-800 dark:text-slate-200">{{ fmt(payment.paidAt) }}</dd></div>
      <div class="flex justify-between py-2.5"><dt class="font-semibold text-slate-700 dark:text-slate-300">Jumlah</dt><dd class="text-base font-bold text-slate-900 dark:text-slate-100">RM {{ payment.amount.toFixed(2) }}</dd></div>
    </dl>
  </div>
</template>
