<script setup lang="ts">
import { computed, watch } from "vue";
import { Eye, X } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import { dummyDocMeta, resolveDummyDocKind, type DummyDocKind } from "../dummy-documents";

const props = defineProps<{
  open: boolean;
  label?: string;
  fileName?: string;
}>();

const emit = defineEmits<{ (e: "close"): void }>();

const { locale } = useLocale();
const bm = computed(() => locale.value !== "bi");

const kind = computed<DummyDocKind>(() =>
  resolveDummyDocKind(props.label ?? "", props.fileName),
);

const meta = computed(() => dummyDocMeta(kind.value));
const title = computed(() => (bm.value ? meta.value.titleBm : meta.value.titleBi));

watch(
  () => props.open,
  (v) => {
    if (!v) return;
    // Escape to close is handled by backdrop / button.
  },
);

function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") emit("close");
}

watch(
  () => props.open,
  (v) => {
    if (typeof window === "undefined") return;
    if (v) window.addEventListener("keydown", onKey);
    else window.removeEventListener("keydown", onKey);
  },
);
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/50 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      @click.self="emit('close')"
    >
      <div class="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
        <div class="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <div class="min-w-0">
            <p class="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              <Eye class="h-3.5 w-3.5" />
              {{ bm ? "Pratonton dokumen (POC)" : "Document preview (POC)" }}
            </p>
            <h3 class="mt-1 truncate text-base font-semibold text-slate-900 dark:text-slate-100">
              {{ label || title }}
            </h3>
            <p v-if="fileName" class="mt-0.5 truncate font-mono text-xs text-slate-500 dark:text-slate-400">
              {{ fileName }}
            </p>
          </div>
          <button
            type="button"
            class="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            :aria-label="bm ? 'Tutup' : 'Close'"
            @click="emit('close')"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <div class="overflow-y-auto bg-slate-100/80 p-5 dark:bg-slate-900/40">
          <div class="mx-auto max-w-lg">
            <!-- MYKAD -->
            <div
              v-if="kind === 'mykad'"
              class="overflow-hidden rounded-xl border border-slate-300 bg-gradient-to-br from-[#c8d8e8] via-[#e8f0f6] to-[#d4e4f0] shadow-lg dark:border-slate-600"
            >
              <div class="flex items-center justify-between bg-[#003d7a] px-4 py-2 text-white">
                <span class="text-[10px] font-semibold tracking-wider">MALAYSIA · MYKAD</span>
                <span class="rounded bg-white/15 px-2 py-0.5 text-[10px] font-mono">{{ meta.badge }}</span>
              </div>
              <div class="flex gap-4 p-4">
                <div class="flex h-28 w-20 shrink-0 flex-col items-center justify-center rounded-md border border-slate-400/40 bg-slate-200 text-center dark:bg-slate-700">
                  <div class="mb-1 h-14 w-12 rounded-sm bg-slate-400/60 dark:bg-slate-500/60" />
                  <span class="text-[9px] text-slate-500 dark:text-slate-400">PHOTO</span>
                </div>
                <div class="min-w-0 flex-1 space-y-1.5 text-[11px] text-slate-800 dark:text-slate-200">
                  <p class="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Nama / Name</p>
                  <p class="font-semibold">NURUL AINA BINTI ROSLI</p>
                  <p class="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">No. KP / NRIC</p>
                  <p class="font-mono font-semibold tracking-wide">900314-14-5182</p>
                  <p class="pt-1 text-[10px] text-slate-500 dark:text-slate-400">
                    {{ bm ? "Dokumen sampel POC — bukan data sebenar" : "POC sample — not real data" }}
                  </p>
                </div>
              </div>
              <div class="border-t border-slate-300/60 bg-white/40 px-4 py-2 text-[10px] text-slate-600 dark:border-slate-600 dark:bg-slate-800/40 dark:text-slate-400">
                Warganegara · Perempuan · Ampang, Selangor
              </div>
            </div>

            <!-- COMPETENCY CERT -->
            <div
              v-else-if="kind === 'competency'"
              class="rounded-lg border border-amber-200 bg-[#fffdf7] p-6 shadow-lg dark:border-amber-800/50 dark:bg-slate-800"
            >
              <div class="mb-4 text-center">
                <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-800 dark:text-amber-400">
                  Suruhanjaya Tenaga
                </p>
                <h4 class="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                  {{ bm ? "SIJIL KEKOMPETENAN" : "COMPETENCY CERTIFICATE" }}
                </h4>
                <p class="mt-1 font-mono text-xs text-slate-500">COMP/PW/2024/301</p>
              </div>
              <div class="space-y-2 border-y border-dashed border-amber-200 py-4 text-sm dark:border-amber-800/40">
                <div class="flex justify-between gap-4"><span class="text-slate-500">{{ bm ? "Nama" : "Name" }}</span><span class="font-medium text-slate-800 dark:text-slate-200">Nurul Aina binti Rosli</span></div>
                <div class="flex justify-between gap-4"><span class="text-slate-500">{{ bm ? "Kategori" : "Category" }}</span><span class="font-medium text-slate-800 dark:text-slate-200">PW</span></div>
                <div class="flex justify-between gap-4"><span class="text-slate-500">{{ bm ? "Sekatan voltan" : "Voltage" }}</span><span class="font-medium text-slate-800 dark:text-slate-200">LV</span></div>
              </div>
              <p class="mt-4 text-center text-[10px] text-slate-400">{{ bm ? "Salinan dummy untuk pratonton POC" : "Dummy copy for POC preview" }}</p>
            </div>

            <!-- PASSPORT PHOTO -->
            <div
              v-else-if="kind === 'passport_photo'"
              class="flex flex-col items-center rounded-lg border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-600 dark:bg-slate-800"
            >
              <div class="flex h-56 w-44 flex-col items-center justify-end rounded border-2 border-slate-300 bg-gradient-to-b from-sky-100 to-slate-200 pb-3 dark:border-slate-500 dark:from-slate-600 dark:to-slate-700">
                <div class="mb-3 h-20 w-20 rounded-full bg-slate-400/70 dark:bg-slate-500/70" />
                <div class="h-24 w-28 rounded-t-[40%] bg-slate-500/50 dark:bg-slate-400/40" />
              </div>
              <p class="mt-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                {{ bm ? "Gambar berukuran pasport (dummy)" : "Passport-size photo (dummy)" }}
              </p>
              <p class="mt-1 text-xs text-slate-400">35mm × 45mm · POC</p>
            </div>

            <!-- EMPLOYMENT LETTER -->
            <div
              v-else-if="kind === 'employment_letter'"
              class="rounded-lg border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-600 dark:bg-slate-800"
            >
              <div class="mb-4 border-b border-slate-200 pb-3 dark:border-slate-700">
                <p class="text-sm font-bold text-[var(--accent-700)] dark:text-[var(--accent-400)]">TENAGA MURNI SDN BHD</p>
                <p class="text-[10px] text-slate-500">No. 12, Jalan Perindustrian 4, 40000 Shah Alam</p>
              </div>
              <p class="text-xs text-slate-500">Ruj: TM/HR/2026/0142</p>
              <h4 class="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {{ bm ? "SURAT TAWARAN PEKERJAAN" : "LETTER OF EMPLOYMENT" }}
              </h4>
              <p class="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {{ bm
                  ? "Dengan ini disahkan bahawa Nurul Aina binti Rosli (900314-14-5182) telah ditawarkan jawatan Wireman di syarikat ini."
                  : "This confirms that Nurul Aina binti Rosli (900314-14-5182) has been offered the position of Wireman in this company." }}
              </p>
              <div class="mt-8 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                <div class="h-8 w-28 border-b border-slate-400 dark:border-slate-500" />
                <p class="font-medium">Rahman bin Abdullah</p>
                <p>{{ bm ? "Pengurus HR" : "HR Manager" }}</p>
              </div>
            </div>

            <!-- OSH -->
            <div
              v-else-if="kind === 'osh'"
              class="rounded-lg border border-emerald-200 bg-white p-6 shadow-lg dark:border-emerald-800/40 dark:bg-slate-800"
            >
              <p class="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                {{ bm ? "Laporan Pemeriksaan OSH" : "OSH Medical Report" }}
              </p>
              <p class="mt-2 text-sm text-slate-700 dark:text-slate-300">
                {{ bm ? "Status kesihatan: LAYAK bertugas elektrik" : "Fitness status: FIT for electrical duties" }}
              </p>
              <div class="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                <div class="rounded border border-slate-200 p-2 dark:border-slate-600">BP: 118/76</div>
                <div class="rounded border border-slate-200 p-2 dark:border-slate-600">Vision: 6/6</div>
                <div class="rounded border border-slate-200 p-2 dark:border-slate-600">Hearing: Normal</div>
                <div class="rounded border border-slate-200 p-2 dark:border-slate-600">Colour: Pass</div>
              </div>
            </div>

            <!-- SSM -->
            <div
              v-else-if="kind === 'ssm'"
              class="rounded-lg border border-slate-300 bg-[#faf9f6] p-6 shadow-lg dark:border-slate-600 dark:bg-slate-800"
            >
              <div class="mb-3 flex items-center justify-between">
                <p class="text-xs font-bold uppercase text-slate-800 dark:text-slate-200">SSM · Borang 9</p>
                <span class="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-white dark:bg-slate-600">{{ meta.badge }}</span>
              </div>
              <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">SYARIKAT ELEKTRIK MAJU SDN BHD</p>
              <p class="mt-1 font-mono text-xs text-slate-500">201101023456 (945678-K)</p>
              <p class="mt-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {{ bm
                  ? "Perakuan pendaftaran syarikat di bawah Akta Syarikat 2016 — salinan dummy POC."
                  : "Company registration under Companies Act 2016 — POC dummy copy." }}
              </p>
            </div>

            <!-- BORANG 49 -->
            <div
              v-else-if="kind === 'borang49'"
              class="rounded-lg border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-600 dark:bg-slate-800"
            >
              <p class="text-xs font-bold uppercase text-slate-800 dark:text-slate-200">Borang 49 — {{ bm ? "Senarai Pengarah" : "Directors" }}</p>
              <ul class="mt-4 divide-y divide-slate-100 text-sm dark:divide-slate-700">
                <li class="flex justify-between py-2"><span>Lim Wei Sheng</span><span class="text-xs text-slate-400">Director</span></li>
                <li class="flex justify-between py-2"><span>Tan Mei Ling</span><span class="text-xs text-slate-400">Director</span></li>
                <li class="flex justify-between py-2"><span>Ahmad Faizal</span><span class="text-xs text-slate-400">Secretary</span></li>
              </ul>
            </div>

            <!-- OK APPOINTMENT -->
            <div
              v-else-if="kind === 'ok_appointment'"
              class="rounded-lg border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-600 dark:bg-slate-800"
            >
              <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {{ bm ? "Surat Lantikan Orang Kompeten" : "Competent Person Appointment Letter" }}
              </p>
              <p class="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {{ bm
                  ? "Syarikat melantik orang kompeten bernama untuk tanggungjawab elektrik di premis berdaftar."
                  : "The company appoints the named competent person for electrical duties at the registered premises." }}
              </p>
            </div>

            <!-- PREMISES PHOTO -->
            <div
              v-else-if="kind === 'premises'"
              class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-800"
            >
              <div class="relative flex h-48 items-end bg-gradient-to-br from-slate-400 via-slate-500 to-slate-700 p-4">
                <div class="absolute inset-x-8 bottom-10 h-20 rounded-t bg-slate-300/80 dark:bg-slate-600/80" />
                <div class="absolute bottom-10 left-1/2 h-14 w-10 -translate-x-1/2 rounded-t bg-slate-200/90 dark:bg-slate-500/90" />
                <p class="relative z-10 text-xs font-medium text-white drop-shadow">
                  {{ bm ? "Foto premis (dummy)" : "Premises photo (dummy)" }}
                </p>
              </div>
            </div>

            <!-- EQUIPMENT LIST -->
            <div
              v-else-if="kind === 'equipment'"
              class="rounded-lg border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-600 dark:bg-slate-800"
            >
              <p class="mb-3 text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                {{ bm ? "Senarai peralatan menguji" : "Test equipment list" }}
              </p>
              <table class="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead class="border-b border-slate-200 text-slate-500 dark:border-slate-600">
                  <tr><th class="py-1.5">Item</th><th>S/N</th><th>Cal.</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-slate-100 dark:border-slate-700"><td class="py-1.5">Insulation Tester</td><td>IT-2041</td><td>2026-01</td></tr>
                  <tr class="border-b border-slate-100 dark:border-slate-700"><td class="py-1.5">Multimeter</td><td>MM-8812</td><td>2025-11</td></tr>
                  <tr><td class="py-1.5">Earth Tester</td><td>ET-3310</td><td>2026-03</td></tr>
                </tbody>
              </table>
            </div>

            <!-- EPF / SOCSO -->
            <div
              v-else-if="kind === 'epf_socso'"
              class="rounded-lg border border-indigo-200 bg-white p-6 shadow-lg dark:border-indigo-800/40 dark:bg-slate-800"
            >
              <p class="text-xs font-semibold text-indigo-700 dark:text-indigo-400">KWSP · PERKESO</p>
              <p class="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                {{ bm ? "Penyata caruman (3 bulan)" : "Contribution statement (3 months)" }}
              </p>
              <div class="mt-4 space-y-2 text-xs">
                <div class="flex justify-between rounded bg-slate-50 px-3 py-2 dark:bg-slate-900/50"><span>Jan 2026</span><span class="font-mono">RM 420.00</span></div>
                <div class="flex justify-between rounded bg-slate-50 px-3 py-2 dark:bg-slate-900/50"><span>Feb 2026</span><span class="font-mono">RM 420.00</span></div>
                <div class="flex justify-between rounded bg-slate-50 px-3 py-2 dark:bg-slate-900/50"><span>Mac 2026</span><span class="font-mono">RM 420.00</span></div>
              </div>
            </div>

            <!-- GENERIC PDF -->
            <div
              v-else
              class="rounded-lg border border-slate-300 bg-white p-6 shadow-lg dark:border-slate-600 dark:bg-slate-800"
            >
              <div class="mb-4 flex items-center gap-2">
                <span class="rounded bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white">PDF</span>
                <span class="text-sm font-medium text-slate-800 dark:text-slate-200">{{ title }}</span>
              </div>
              <div class="space-y-2">
                <div class="h-2 w-full rounded bg-slate-200 dark:bg-slate-600" />
                <div class="h-2 w-11/12 rounded bg-slate-200 dark:bg-slate-600" />
                <div class="h-2 w-4/5 rounded bg-slate-200 dark:bg-slate-600" />
                <div class="h-2 w-full rounded bg-slate-200 dark:bg-slate-600" />
                <div class="h-2 w-3/5 rounded bg-slate-200 dark:bg-slate-600" />
              </div>
              <p class="mt-4 text-xs text-slate-400">
                {{ bm ? "Pratonton dummy untuk dokumen sokongan ini." : "Dummy preview for this supporting document." }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-end border-t border-slate-200 px-5 py-3 dark:border-slate-700">
          <button
            type="button"
            class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
            @click="emit('close')"
          >
            {{ bm ? "Tutup" : "Close" }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
