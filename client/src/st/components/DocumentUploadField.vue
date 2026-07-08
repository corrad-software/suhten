<script setup lang="ts">
import { UploadCloud, CheckCircle2 } from "lucide-vue-next";

import type { AppDocument } from "../types";

const props = defineProps<{ labels: string[]; modelValue: AppDocument[] }>();
const emit = defineEmits<{ (e: "update:modelValue", v: AppDocument[]): void }>();

let seq = 0;

function docFor(label: string): AppDocument | undefined {
  return props.modelValue.find((d) => d.label === label);
}

// Simulated upload — records a filename/size only (no real bytes), enough for the demo.
function simulate(label: string) {
  const doc: AppDocument = {
    id: `doc-up-${++seq}-${Date.now()}`,
    label,
    fileName: `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`,
    sizeKb: 420,
    mimeType: "application/pdf",
    uploadedAt: new Date().toISOString(),
    status: "pending",
  };
  emit("update:modelValue", [...props.modelValue.filter((d) => d.label !== label), doc]);
}
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="label in labels"
      :key="label"
      class="flex items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2.5"
    >
      <div class="min-w-0">
        <p class="text-sm font-medium text-slate-700">{{ label }}</p>
        <p v-if="docFor(label)" class="truncate text-xs text-emerald-600">
          {{ docFor(label)!.fileName }} · {{ docFor(label)!.sizeKb }} KB
        </p>
        <p v-else class="text-xs text-slate-400">PDF, maksimum 5MB</p>
      </div>
      <div class="flex shrink-0 items-center gap-2">
        <CheckCircle2 v-if="docFor(label)" class="h-5 w-5 text-emerald-500" />
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-[var(--accent-ring)] hover:text-slate-900"
          @click="simulate(label)"
        >
          <UploadCloud class="h-3.5 w-3.5" />
          {{ docFor(label) ? "Ganti" : "Muat naik" }}
        </button>
      </div>
    </div>
  </div>
</template>
