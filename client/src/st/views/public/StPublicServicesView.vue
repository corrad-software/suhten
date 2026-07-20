<script setup lang="ts">
import { useRouter } from "vue-router";
import { ArrowRight } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import StPublicLayout from "../../components/StPublicLayout.vue";
import { useServiceCatalog, type ServiceTile } from "../../composables/useServiceCatalog";

const router = useRouter();
const { locale } = useLocale();
const { groups } = useServiceCatalog();

function go(t: ServiceTile) {
  if (t.available) router.push("/st/login");
}
</script>

<template>
  <StPublicLayout>
    <div class="mb-8">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900">
        {{ locale === 'bm' ? 'Perkhidmatan Suruhanjaya Tenaga' : 'Energy Commission Services' }}
      </h1>
      <p class="mt-2 max-w-2xl text-sm text-slate-600">
        {{ locale === 'bm'
          ? 'Senarai penuh perkhidmatan pendaftaran, pelesenan, persijilan dan penguatkuasaan yang ditawarkan secara dalam talian.'
          : 'The full range of registration, licensing, certification and enforcement services offered online.' }}
      </p>
    </div>

    <section v-for="group in groups" :key="group.id" class="mb-10">
      <div class="mb-4">
        <h2 class="text-lg font-semibold text-slate-900">{{ group.title }}</h2>
        <p class="mt-0.5 text-sm text-slate-500">{{ group.desc }}</p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="tile in group.tiles"
          :key="tile.code"
          class="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all"
          :class="tile.available ? 'hover:border-[var(--accent-ring)] hover:shadow-md' : 'opacity-80'"
        >
          <div class="flex items-start justify-between">
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--accent-50)] text-[var(--accent-700)]">
              <component :is="tile.icon" class="h-5 w-5" />
            </div>
            <span
              class="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
              :class="tile.available ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-100 text-amber-700'"
            >
              {{ tile.available ? (locale === 'bm' ? 'Tersedia' : 'Available') : (locale === 'bm' ? 'Akan Datang' : 'Soon') }}
            </span>
          </div>

          <div class="mt-3 flex items-center gap-2">
            <p class="font-semibold text-slate-900">{{ tile.title }}</p>
            <span class="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-500">{{ tile.code }}</span>
          </div>
          <p class="mt-1 text-xs leading-relaxed text-slate-500">{{ tile.actRef }}</p>

          <div v-if="tile.processTypes.length" class="mt-3 flex flex-wrap gap-1.5">
            <span
              v-for="(pt, pi) in tile.processTypes"
              :key="pi"
              class="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600"
            >{{ pt }}</span>
          </div>

          <div class="mt-4 flex-1" />
          <button
            v-if="tile.available"
            class="mt-2 inline-flex items-center gap-1.5 self-start rounded-md bg-[var(--accent-600)] px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-700)]"
            @click="go(tile)"
          >
            {{ locale === 'bm' ? 'Mohon' : 'Apply' }} <ArrowRight class="h-4 w-4" />
          </button>
          <span v-else class="mt-2 self-start text-xs italic text-slate-400">
            {{ locale === 'bm' ? 'Fasa akan datang' : 'Upcoming phase' }}
          </span>
        </div>
      </div>
    </section>
  </StPublicLayout>
</template>
