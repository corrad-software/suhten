<script setup lang="ts">
import { ref, watch } from "vue";
import { X } from "lucide-vue-next";

import posDigicertLogo from "../assets/pos-digicert-logo.png";
import { DEMO_SIGNATURE_PIN } from "../stores/workflow";

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: "confirm", pin: string): void; (e: "cancel"): void }>();

const pin = ref("");
const error = ref("");

watch(
  () => props.open,
  (v) => {
    if (v) {
      pin.value = "";
      error.value = "";
    }
  },
);

function confirm() {
  if (pin.value.length < 4) {
    error.value = "Sila masukkan PIN 4 digit.";
    return;
  }
  emit("confirm", pin.value);
}
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
    <div class="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
      <div class="mb-4 flex items-start justify-between gap-3">
        <div class="min-w-0">
          <img
            :src="posDigicertLogo"
            alt="Pos Digicert"
            class="mb-3 h-9 w-auto max-w-[220px] object-contain object-left"
          />
          <h3 class="text-base font-semibold text-slate-900">Tandatangan Digital</h3>
          <p class="mt-0.5 text-[11px] text-slate-400">Dikuasakan oleh Pos Digicert</p>
        </div>
        <button class="shrink-0 text-slate-400 hover:text-slate-600" @click="emit('cancel')"><X class="h-5 w-5" /></button>
      </div>

      <p class="mb-4 text-sm text-slate-500">
        Masukkan PIN tandatangan digital anda untuk meluluskan permohonan ini.
      </p>

      <input
        v-model="pin"
        type="password"
        inputmode="numeric"
        maxlength="6"
        placeholder="• • • •"
        class="w-full rounded-md border border-slate-300 px-3 py-2.5 text-center text-lg tracking-[0.5em] focus:border-[var(--accent-500)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]/30"
        @keyup.enter="confirm"
      />
      <p v-if="error" class="mt-2 text-xs text-rose-600">{{ error }}</p>
      <p class="mt-2 text-[11px] text-slate-400">PIN demo: <span class="font-mono">{{ DEMO_SIGNATURE_PIN }}</span></p>

      <div class="mt-5 flex gap-2">
        <button
          class="flex-1 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          @click="emit('cancel')"
        >
          Batal
        </button>
        <button
          class="flex-1 rounded-md bg-[var(--accent-600)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-700)]"
          @click="confirm"
        >
          Tandatangan & Lulus
        </button>
      </div>
    </div>
  </div>
</template>
