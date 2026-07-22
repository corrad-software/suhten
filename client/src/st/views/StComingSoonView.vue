<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { Construction } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";

const route = useRoute();
const { t } = useLocale();

const title = computed(() => (route.meta.title as string) || t("comingSoon.title"));
const moduleCode = computed(() => route.meta.moduleCode as string | undefined);
const phase = computed(() => route.meta.phase as number | undefined);
</script>

<template>
  <div>
    <div class="mb-4 flex flex-wrap items-center gap-2">
      <h1 class="text-lg font-semibold text-slate-900">{{ title }}</h1>
      <span v-if="moduleCode" class="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">{{ moduleCode }}</span>
      <span v-if="phase === 2" class="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">{{ t('phase.2') }}</span>
    </div>

    <article class="border-t border-slate-200">
      <div class="flex flex-col items-center justify-center px-6 py-16 text-center">
        <Construction class="h-10 w-10 text-slate-300" />
        <h2 class="mt-4 text-base font-semibold text-slate-700">{{ t('comingSoon.heading') }}</h2>
        <p class="mt-2 max-w-md text-sm text-slate-500">
          {{ t('comingSoon.body') }}
        </p>
      </div>
    </article>
  </div>
</template>
