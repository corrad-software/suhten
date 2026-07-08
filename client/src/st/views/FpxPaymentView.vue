<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";

import { useToast } from "@/composables/useToast";

import type { PaymentKind } from "../types";
import { useStWorkflowStore } from "../stores/workflow";
import { workflowLabel } from "../status";
import FpxPaymentScreen from "../components/FpxPaymentScreen.vue";
import ReceiptCard from "../components/ReceiptCard.vue";

const route = useRoute();
const router = useRouter();
const workflow = useStWorkflowStore();
const toast = useToast();

const app = computed(() => workflow.byId(String(route.params.id)));
const kind = computed<PaymentKind>(() => (route.params.kind === "registration" ? "registration" : "processing"));
const amount = computed(() => (app.value ? workflow.feeFor(app.value, kind.value) : 0));
const title = computed(() => (kind.value === "processing" ? "Yuran Pemprosesan" : "Yuran Pendaftaran"));

const paid = ref(false);

// The payment created by the transition (last of its kind).
const payment = computed(() => {
  if (!app.value) return undefined;
  return [...app.value.payments].reverse().find((p) => p.kind === kind.value);
});

function onPaid(bank: string) {
  if (!app.value) return;
  const action = kind.value === "processing" ? "pay_processing" : "pay_registration";
  workflow.transition(app.value.id, action, { bank });
  paid.value = true;
  toast.success("Bayaran berjaya", `${title.value} telah dibayar.`);
}
</script>

<template>
  <div v-if="app" class="space-y-5">
    <button class="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800" @click="router.push(`/st/applications/${app.id}`)">
      <ArrowLeft class="h-4 w-4" /> Kembali ke permohonan
    </button>

    <div class="text-center">
      <h1 class="text-lg font-semibold text-slate-900">{{ title }}</h1>
      <p class="text-sm text-slate-500">{{ workflowLabel(app.workflowType) }} · {{ app.refNo }}</p>
    </div>

    <FpxPaymentScreen v-if="!paid" :amount="amount" :title="title" @paid="onPaid" />

    <template v-else-if="payment">
      <ReceiptCard :payment="payment" :ref-no="app.refNo" :payer-name="app.applicant.fullName" />
      <div class="rounded-lg bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-700">
        {{ kind === "processing"
          ? "Permohonan kini dalam giliran semakan SOS."
          : "Sijil digital anda telah dikeluarkan." }}
      </div>
      <button
        class="w-full rounded-md bg-[var(--accent-600)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-700)]"
        @click="router.push(kind === 'registration' ? `/st/applications/${app.id}/certificate` : `/st/applications/${app.id}`)"
      >
        {{ kind === "registration" ? "Lihat Sijil Digital" : "Kembali ke Permohonan" }}
      </button>
    </template>
  </div>

  <div v-else class="py-16 text-center text-slate-500">Permohonan tidak dijumpai.</div>
</template>
