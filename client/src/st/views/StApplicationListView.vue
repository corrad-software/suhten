<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { FilePlus2 } from "lucide-vue-next";

import { useStSessionStore } from "../stores/session";
import { useStWorkflowStore } from "../stores/workflow";
import { workflowShort } from "../status";
import StatusBadge from "../components/StatusBadge.vue";
import StPageHero from "../components/StPageHero.vue";

const router = useRouter();
const session = useStSessionStore();
const workflow = useStWorkflowStore();

const isEmployer = computed(() => session.role === "employer");

const rows = computed(() => {
  if (isEmployer.value) return session.currentPersonaId ? workflow.confirmationsFor(session.currentPersonaId) : [];
  return workflow.myApplications;
});

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString("ms-MY", { day: "2-digit", month: "short", year: "numeric" });
}

function open(id: string) {
  router.push(`/st/applications/${id}`);
}
</script>

<template>
  <div class="space-y-5">
    <StPageHero
      :title="isEmployer ? 'Pengesahan Lantikan' : 'Permohonan Saya'"
      :subtitle="`${rows.length} ${isEmployer ? 'menunggu pengesahan' : 'permohonan'}`"
    >
      <template v-if="!isEmployer" #action>
        <button
          class="flex shrink-0 items-center gap-1.5 rounded-md bg-white px-4 py-2 text-sm font-medium text-[var(--accent-700)] transition-colors hover:bg-white/90"
          @click="router.push('/st/applications/new')"
        >
          <FilePlus2 class="h-4 w-4" /> Permohonan Baharu
        </button>
      </template>
    </StPageHero>

    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <p v-if="rows.length === 0" class="px-4 py-12 text-center text-sm text-slate-400">
        {{ isEmployer ? "Tiada lantikan menunggu pengesahan." : "Belum ada permohonan." }}
      </p>
      <table v-else class="w-full text-left text-sm">
        <thead>
          <tr class="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
            <th class="px-4 py-2 font-medium">No. Rujukan</th>
            <th v-if="isEmployer" class="px-4 py-2 font-medium">Pemohon</th>
            <th class="px-4 py-2 font-medium">Jenis</th>
            <th class="px-4 py-2 font-medium">Tarikh</th>
            <th class="px-4 py-2 font-medium">Status</th>
            <th class="px-4 py-2 text-right font-medium">Tindakan</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="a in rows"
            :key="a.id"
            class="cursor-pointer border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
            @click="open(a.id)"
          >
            <td class="px-4 py-3 font-mono text-xs text-slate-700">{{ a.refNo }}</td>
            <td v-if="isEmployer" class="px-4 py-3 text-slate-700">{{ a.applicant.fullName }}</td>
            <td class="px-4 py-3">
              <span class="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">{{ workflowShort(a.workflowType) }}</span>
            </td>
            <td class="px-4 py-3 text-slate-500">{{ fmt(a.createdAt) }}</td>
            <td class="px-4 py-3"><StatusBadge :status="a.status" /></td>
            <td class="px-4 py-3 text-right">
              <span class="text-xs font-medium text-[var(--accent-700)]">Lihat →</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
