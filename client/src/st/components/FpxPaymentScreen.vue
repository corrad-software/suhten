<script setup lang="ts">
import { ref } from "vue";
import { Landmark, Loader2 } from "lucide-vue-next";

const props = defineProps<{ amount: number; title: string }>();
const emit = defineEmits<{ (e: "paid", bank: string): void }>();

const BANKS = ["Maybank2u", "CIMB Clicks", "Public Bank", "RHB Now", "AmOnline", "Bank Islam"];
const selectedBank = ref(BANKS[0]);
const processing = ref(false);

function pay() {
  processing.value = true;
  // Simulate FPX redirect latency.
  window.setTimeout(() => {
    processing.value = false;
    emit("paid", selectedBank.value);
  }, 900);
}
</script>

<template>
  <div class="mx-auto max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <div class="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-5 py-3">
      <Landmark class="h-5 w-5 text-slate-500" />
      <p class="text-sm font-semibold text-slate-700">FPX — Pembayaran Dalam Talian</p>
    </div>

    <div class="space-y-4 px-5 py-5">
      <div class="rounded-lg bg-[var(--accent-50)] px-4 py-3">
        <p class="text-xs text-slate-500">{{ title }}</p>
        <p class="text-2xl font-bold text-slate-900">RM {{ amount.toFixed(2) }}</p>
      </div>

      <div>
        <label class="mb-1.5 block text-[13px] font-medium text-slate-700">Pilih Bank</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="bank in BANKS"
            :key="bank"
            type="button"
            :class="[
              'rounded-md border px-3 py-2 text-sm transition-colors',
              selectedBank === bank
                ? 'border-[var(--accent-500)] bg-[var(--accent-50)] font-medium text-[var(--accent-700)]'
                : 'border-slate-200 text-slate-600 hover:border-[var(--accent-ring)]',
            ]"
            @click="selectedBank = bank"
          >
            {{ bank }}
          </button>
        </div>
      </div>

      <button
        class="flex w-full items-center justify-center gap-2 rounded-md bg-[var(--accent-600)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-700)] disabled:opacity-60"
        :disabled="processing"
        @click="pay"
      >
        <Loader2 v-if="processing" class="h-4 w-4 animate-spin" />
        {{ processing ? "Memproses bayaran..." : `Bayar RM ${props.amount.toFixed(2)}` }}
      </button>
      <p class="text-center text-[11px] text-slate-400">Simulasi gerbang pembayaran FPX untuk tujuan demo.</p>
    </div>
  </div>
</template>
