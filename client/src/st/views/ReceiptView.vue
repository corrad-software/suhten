<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft, Download, Printer } from "lucide-vue-next";

import { useStWorkflowStore } from "../stores/workflow";
import ReceiptCard from "../components/ReceiptCard.vue";

const route = useRoute();
const router = useRouter();
const workflow = useStWorkflowStore();

const app = computed(() => workflow.byId(String(route.params.id)));
const payments = computed(() => app.value?.payments ?? []);

function fmt(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("ms-MY", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function printPage() {
  window.print();
}

// Generates a real, standalone HTML file of the receipt(s) — no PDF library
// dependency; the user can open it in a browser and print/save as PDF.
function downloadReceipt() {
  const a = app.value;
  if (!a) return;

  const rows = payments.value
    .map((p) => {
      const kindLabel = p.kind === "processing" ? "Yuran Pemprosesan" : "Yuran Pendaftaran";
      return `
        <div class="receipt">
          <h2>Resit Bayaran Berjaya</h2>
          <table>
            <tr><td>No. Resit</td><td>${p.receiptNo ?? "-"}</td></tr>
            <tr><td>No. Rujukan Permohonan</td><td>${a.refNo}</td></tr>
            <tr><td>Pembayar</td><td>${a.applicant.fullName}</td></tr>
            <tr><td>Perkara</td><td>${kindLabel}</td></tr>
            <tr><td>Saluran (FPX)</td><td>${p.bank ?? "-"}</td></tr>
            <tr><td>No. Rujukan FPX</td><td>${p.fpxRef ?? "-"}</td></tr>
            <tr><td>Tarikh & Masa</td><td>${fmt(p.paidAt)}</td></tr>
            <tr class="total"><td>Jumlah</td><td>RM ${p.amount.toFixed(2)}</td></tr>
          </table>
        </div>`;
    })
    .join("<hr />");

  const html = `<!doctype html>
<html lang="ms">
<head>
<meta charset="utf-8" />
<title>Resit — ${a.refNo}</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; color: #1e293b; padding: 24px; max-width: 480px; margin: 0 auto; }
  h2 { font-size: 15px; color: #059669; border-bottom: 1px dashed #d1d5db; padding-bottom: 10px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  td { padding: 6px 0; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
  td:first-child { color: #64748b; }
  td:last-child { text-align: right; font-weight: 500; }
  tr.total td { font-size: 16px; font-weight: 700; border-bottom: none; padding-top: 10px; }
  hr { border: none; border-top: 2px solid #e2e8f0; margin: 20px 0; }
</style>
</head>
<body>${rows}</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `resit-${a.refNo.replace(/\//g, "-")}.html`;
  link.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div v-if="app" class="space-y-5">
    <div class="flex items-center justify-between print:hidden">
      <button class="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800" @click="router.push(`/st/applications/${app.id}`)">
        <ArrowLeft class="h-4 w-4" /> Kembali ke permohonan
      </button>
      <div v-if="payments.length" class="flex items-center gap-2">
        <button
          class="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          @click="downloadReceipt"
        >
          <Download class="h-4 w-4" /> Muat Turun
        </button>
        <button
          class="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          @click="printPage"
        >
          <Printer class="h-4 w-4" /> Cetak
        </button>
      </div>
    </div>

    <template v-if="payments.length">
      <ReceiptCard
        v-for="p in payments"
        :key="p.id"
        :payment="p"
        :ref-no="app.refNo"
        :payer-name="app.applicant.fullName"
      />
    </template>
    <div v-else class="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
      Tiada resit bayaran untuk permohonan ini.
    </div>
  </div>

  <div v-else class="py-16 text-center text-slate-500">Permohonan tidak dijumpai.</div>
</template>
