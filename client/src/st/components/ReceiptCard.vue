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
  <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <div class="flex items-center gap-2 border-b border-dashed border-slate-200 bg-emerald-50 px-5 py-3">
      <CheckCircle2 class="h-5 w-5 text-emerald-600" />
      <p class="text-sm font-semibold text-emerald-700">Resit Bayaran Berjaya</p>
    </div>
    <dl class="divide-y divide-slate-100 px-5 py-2 text-sm">
      <div class="flex justify-between py-2"><dt class="text-slate-500">No. Resit</dt><dd class="font-mono text-slate-800">{{ payment.receiptNo }}</dd></div>
      <div class="flex justify-between py-2"><dt class="text-slate-500">No. Rujukan Permohonan</dt><dd class="font-mono text-slate-800">{{ refNo }}</dd></div>
      <div class="flex justify-between py-2"><dt class="text-slate-500">Pembayar</dt><dd class="text-slate-800">{{ payerName }}</dd></div>
      <div class="flex justify-between py-2"><dt class="text-slate-500">Perkara</dt><dd class="text-slate-800">{{ kindLabel }}</dd></div>
      <div class="flex justify-between py-2"><dt class="text-slate-500">Saluran (FPX)</dt><dd class="text-slate-800">{{ payment.bank }}</dd></div>
      <div class="flex justify-between py-2"><dt class="text-slate-500">No. Rujukan FPX</dt><dd class="font-mono text-slate-800">{{ payment.fpxRef }}</dd></div>
      <div class="flex justify-between py-2"><dt class="text-slate-500">Tarikh & Masa</dt><dd class="text-slate-800">{{ fmt(payment.paidAt) }}</dd></div>
      <div class="flex justify-between py-2.5"><dt class="font-semibold text-slate-700">Jumlah</dt><dd class="text-base font-bold text-slate-900">RM {{ payment.amount.toFixed(2) }}</dd></div>
    </dl>
  </div>
</template>
