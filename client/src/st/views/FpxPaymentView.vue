<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft, Loader2 } from "lucide-vue-next";

import { useToast } from "@/composables/useToast";

import type { PaymentKind } from "../types";
import { useStWorkflowStore } from "../stores/workflow";
import { useStRegistrationStore } from "../stores/registration";
import { workflowLabel } from "../status";
import FpxPaymentScreen from "../components/FpxPaymentScreen.vue";
import ReceiptCard from "../components/ReceiptCard.vue";

const route = useRoute();
const router = useRouter();
const workflow = useStWorkflowStore();
const regStore = useStRegistrationStore();
const toast = useToast();

const loading = ref(true);
const appId = computed(() => String(route.params.id ?? ""));
const app = computed(() => workflow.byId(appId.value));
const kind = computed<PaymentKind>(() => (route.params.kind === "registration" ? "registration" : "processing"));
const amount = computed(() => (app.value ? workflow.feeFor(app.value, kind.value) : 0));
const title = computed(() => (kind.value === "processing" ? "Yuran Pemprosesan" : "Yuran Pendaftaran"));
const portalBase = computed(() => (route.path.startsWith("/admin/st") ? "/admin/st" : "/st"));
const isContractorApp = computed(() => app.value?.workflowType === "CE" || Boolean(regStore.byId(appId.value)));

const paid = ref(false);

onMounted(async () => {
  if (!workflow.byId(appId.value)) {
    await workflow.syncFromApi();
  }
  loading.value = false;
});

// The payment created by the transition (last of its kind).
const payment = computed(() => {
  if (!app.value) return undefined;
  return [...app.value.payments].reverse().find((p) => p.kind === kind.value);
});

function backToApp() {
  if (isContractorApp.value) {
    router.push(`${portalBase.value}/registration/contractor-electric/applications/${appId.value}`);
    return;
  }
  router.push(`${portalBase.value}/applications/${appId.value}`);
}

async function onPaid(bank: string) {
  if (!app.value) return;
  const action = kind.value === "processing" ? "pay_processing" : "pay_registration";
  try {
    await workflow.transition(app.value.id, action, { bank, payment: { provider: bank } });
    // Keep registration module detail in sync for majikan CE apps.
    const twin = regStore.byId(app.value.id);
    if (twin) {
      twin.status = kind.value === "processing" ? "sos_review" : "certificate_issued";
      twin.stageEnteredAt = new Date().toISOString();
    }
    paid.value = true;
    toast.success("Bayaran berjaya", `${title.value} telah dibayar.`);
  } catch (e) {
    toast.error("Bayaran gagal disimpan", e instanceof Error ? e.message : "Sila cuba lagi.");
  }
}
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
    <Loader2 class="h-4 w-4 animate-spin" /> Memuatkan…
  </div>

  <div v-else-if="app" class="space-y-5">
    <button class="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800" @click="backToApp">
      <ArrowLeft class="h-4 w-4" /> Kembali ke permohonan
    </button>

    <div class="text-center">
      <h1 class="text-lg font-semibold text-slate-900">{{ title }}</h1>
      <p class="text-sm text-slate-500">{{ workflowLabel(app.workflowType) }} · {{ app.refNo }}</p>
    </div>

    <FpxPaymentScreen v-if="!paid" :amount="amount" :title="title" :reference="app.refNo" @paid="onPaid" />

    <template v-else-if="payment">
      <ReceiptCard :payment="payment" :ref-no="app.refNo" :payer-name="app.applicant.fullName" />
      <div class="rounded-lg bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-700">
        {{ kind === "processing"
          ? "Permohonan kini dalam giliran semakan SOS."
          : "Sijil digital anda telah dikeluarkan." }}
      </div>
      <button
        class="w-full rounded-md bg-[var(--accent-600)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-700)]"
        @click="
          kind === 'registration'
            ? router.push(`${portalBase}/applications/${app.id}/certificate`)
            : backToApp()
        "
      >
        {{ kind === "registration" ? "Lihat Sijil Digital" : "Kembali ke Permohonan" }}
      </button>
    </template>
  </div>

  <div v-else class="py-16 text-center text-slate-500">Permohonan tidak dijumpai. Sila cuba semula dari senarai permohonan.</div>
</template>
