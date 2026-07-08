<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft, Printer } from "lucide-vue-next";

import { useStWorkflowStore } from "../stores/workflow";
import CertificateCard from "../components/CertificateCard.vue";

const route = useRoute();
const router = useRouter();
const workflow = useStWorkflowStore();

const app = computed(() => workflow.byId(String(route.params.id)));
const hasCert = computed(() => Boolean(app.value?.certificate));
const okCerts = computed(() => app.value?.okCertificates ?? []);

function printPage() {
  window.print();
}
</script>

<template>
  <div v-if="app" class="space-y-5">
    <div class="flex items-center justify-between">
      <button class="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800" @click="router.push(`/st/applications/${app.id}`)">
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

    <template v-if="hasCert">
      <CertificateCard :application="app" />

      <div v-if="okCerts.length" class="space-y-3">
        <h2 class="text-sm font-semibold text-slate-700">Sijil Orang Kompeten Dilantik</h2>
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
