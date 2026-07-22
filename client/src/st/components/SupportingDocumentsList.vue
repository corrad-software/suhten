<script setup lang="ts">
import { ref } from "vue";
import { Eye, FileText } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import DocumentPreviewModal from "./DocumentPreviewModal.vue";

export type SupportingDocItem = {
  id?: string;
  label: string;
  fileName?: string;
  sizeKb?: number;
};

defineProps<{
  documents: SupportingDocItem[];
  /** Optional section heading; defaults to Dokumen sokongan / Supporting documents. */
  title?: string;
  emptyText?: string;
}>();

const { locale } = useLocale();

const previewOpen = ref(false);
const previewLabel = ref("");
const previewFileName = ref("");

function openPreview(doc: SupportingDocItem) {
  previewLabel.value = doc.label;
  previewFileName.value = doc.fileName ?? "";
  previewOpen.value = true;
}
</script>

<template>
  <div>
    <h2
      v-if="title !== ''"
      class="mb-3 flex items-center gap-2 border-b border-slate-200 pb-2 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-100"
    >
      <FileText class="h-4 w-4 text-slate-400 dark:text-slate-500" />
      {{ title ?? (locale === "bi" ? "Supporting documents" : "Dokumen Sokongan") }}
    </h2>

    <p v-if="documents.length === 0" class="text-sm text-slate-400 dark:text-slate-500">
      {{ emptyText ?? (locale === "bi" ? "No documents uploaded." : "Tiada dokumen dimuat naik.") }}
    </p>

    <ul v-else>
      <li
        v-for="(d, i) in documents"
        :key="d.id ?? `${d.label}-${i}`"
        class="flex items-center justify-between gap-3 border-b border-slate-100 py-2 text-sm last:border-0 dark:border-slate-800"
      >
        <div class="flex min-w-0 items-center gap-2">
          <FileText class="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
          <div class="min-w-0">
            <p class="truncate font-medium text-slate-700 dark:text-slate-300">{{ d.label }}</p>
            <p v-if="d.fileName || d.sizeKb" class="truncate font-mono text-xs text-slate-500 dark:text-slate-400">
              <template v-if="d.fileName">{{ d.fileName }}</template>
              <template v-if="d.fileName && d.sizeKb"> · </template>
              <template v-if="d.sizeKb">{{ d.sizeKb }} KB</template>
            </p>
          </div>
        </div>
        <button
          type="button"
          class="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          @click="openPreview(d)"
        >
          <Eye class="h-3.5 w-3.5" />
          {{ locale === "bi" ? "View" : "Lihat" }}
        </button>
      </li>
    </ul>

    <DocumentPreviewModal
      :open="previewOpen"
      :label="previewLabel"
      :file-name="previewFileName"
      @close="previewOpen = false"
    />
  </div>
</template>
