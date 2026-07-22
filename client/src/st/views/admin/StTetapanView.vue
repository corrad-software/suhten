<script setup lang="ts">
import { computed, ref } from "vue";
import { Plus, RotateCcw, Settings2, Trash2 } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import { useToast } from "@/composables/useToast";
import { useConfirmDialog } from "@/composables/useConfirmDialog";
import { COMPETENCY_CATEGORIES } from "../../mock/competencies";
import { useStReferenceSettingsStore } from "../../stores/reference-settings";

type TabId = "requirements" | "documents" | "payment" | "reminder" | "notif" | "status";

const { ts, locale } = useLocale();
const toast = useToast();
const { confirm } = useConfirmDialog();
const store = useStReferenceSettingsStore();

const tab = ref<TabId>("requirements");
const docModuleFilter = ref<string>("all");

const TABS = computed(() => [
  { id: "requirements" as const, label: ts("st.tetapan.tabRequirements"), d11: "7" },
  { id: "documents" as const, label: ts("st.tetapan.tabDocuments"), d11: "8" },
  { id: "payment" as const, label: ts("st.tetapan.tabPayment"), d11: "9a" },
  { id: "reminder" as const, label: ts("st.tetapan.tabReminder"), d11: "9b" },
  { id: "notif" as const, label: ts("st.tetapan.tabNotif"), d11: "9c" },
  { id: "status" as const, label: ts("st.tetapan.tabStatus"), d11: "9d" },
]);

const filteredDocumentTypes = computed(() => {
  const rows = store.documentTypes;
  if (docModuleFilter.value === "all") return rows;
  return rows.filter((r) => r.moduleCode === docModuleFilter.value);
});

function resetCeDocs() {
  store.resetCeDocumentsToD11();
  docModuleFilter.value = "RG-CE";
  saved();
  toast.success(ts("st.tetapan.resetCeDocsDone"));
}

const MODULES = ["RG-KE", "RG-CE", "RG-KG", "RG-CG"];
const PERIODS = [1, 2, 3, 4, 5] as const;
const FEE_KINDS = [
  { value: "processing", bm: "Fi pemprosesan", bi: "Processing fee" },
  { value: "registration", bm: "Fi pendaftaran", bi: "Registration fee" },
] as const;
const CAT_GROUPS = [
  { value: "pendawai_pj_pk", bm: "Pendawai / PJ / PK", bi: "Wirer / Machine / Cable" },
  { value: "jurutera_penyelia", bm: "Jurutera & Penyelia", bi: "Engineer & Supervisor" },
] as const;

function feeLabel(v: string): string {
  const row = FEE_KINDS.find((f) => f.value === v);
  if (!row) return v;
  return locale.value === "bi" ? row.bi : row.bm;
}

function groupLabel(v: string): string {
  const row = CAT_GROUPS.find((g) => g.value === v);
  if (!row) return v;
  return locale.value === "bi" ? row.bi : row.bm;
}

async function resetAll() {
  const ok = await confirm({
    title: ts("st.tetapan.resetTitle"),
    message: ts("st.tetapan.resetMsg"),
    destructive: true,
    confirmText: ts("st.tetapan.resetConfirm"),
  });
  if (!ok) return;
  store.resetToDefaults();
  toast.success(ts("st.tetapan.resetDone"));
}

function saved() {
  toast.success(ts("st.tetapan.saved"));
}

const inputCls =
  "w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-[var(--accent-500)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]/30";
const thCls = "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500";
const tdCls = "px-3 py-2 align-middle";
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="flex items-start gap-3">
        <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-50)]">
          <Settings2 class="h-5 w-5 text-[var(--accent-700)]" />
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="text-xl font-semibold text-slate-900">{{ ts("st.tetapan.title") }}</h1>
            <span class="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">D11 §7–9</span>
          </div>
          <p class="mt-0.5 max-w-2xl text-sm text-slate-500">{{ ts("st.tetapan.subtitle") }}</p>
        </div>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        @click="resetAll"
      >
        <RotateCcw class="h-4 w-4" /> {{ ts("st.tetapan.reset") }}
      </button>
    </div>

    <div class="flex flex-wrap gap-1 border-b border-slate-200 pb-px">
      <button
        v-for="t in TABS"
        :key="t.id"
        type="button"
        :class="[
          'rounded-t-md px-3 py-2 text-sm font-medium transition-colors',
          tab === t.id
            ? 'border border-b-white border-slate-200 bg-white text-[var(--accent-700)]'
            : 'text-slate-500 hover:text-slate-800',
        ]"
        @click="tab = t.id"
      >
        <span class="mr-1.5 font-mono text-[10px] text-slate-400">{{ t.d11 }}</span>
        {{ t.label }}
      </button>
    </div>

    <!-- 7: Syarat + tempoh umur -->
    <div v-if="tab === 'requirements'" class="space-y-5">
      <section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div>
            <h2 class="text-sm font-semibold text-slate-900">{{ ts("st.tetapan.reqTitle") }}</h2>
            <p class="text-xs text-slate-500">{{ ts("st.tetapan.reqHint") }}</p>
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-1 rounded-md bg-[var(--accent-600)] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[var(--accent-700)]"
            @click="store.addRequirement(); saved()"
          >
            <Plus class="h-3.5 w-3.5" /> {{ ts("st.tetapan.add") }}
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-slate-50">
              <tr>
                <th :class="thCls">{{ ts("st.common.module") }}</th>
                <th :class="thCls">{{ ts("st.tetapan.category") }}</th>
                <th :class="thCls">{{ ts("st.tetapan.maxAge") }}</th>
                <th :class="thCls">{{ ts("st.tetapan.activeCert") }}</th>
                <th :class="thCls">{{ ts("st.tetapan.selfEmploy") }}</th>
                <th :class="thCls">OSH</th>
                <th :class="thCls">{{ ts("st.tetapan.active") }}</th>
                <th :class="thCls" />
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="row in store.requirements" :key="row.id">
                <td :class="tdCls">
                  <select v-model="row.moduleCode" :class="inputCls" @change="saved">
                    <option v-for="m in MODULES" :key="m" :value="m">{{ m }}</option>
                  </select>
                </td>
                <td :class="tdCls">
                  <select v-model="row.category" :class="inputCls" @change="saved">
                    <option v-for="c in COMPETENCY_CATEGORIES" :key="c.code" :value="c.code">{{ c.code }} — {{ c.label }}</option>
                  </select>
                </td>
                <td :class="tdCls">
                  <input v-model.number="row.maxAge" type="number" min="18" max="99" :class="inputCls" class="w-20" @change="saved" />
                </td>
                <td :class="tdCls">
                  <input v-model="row.requireActiveCertificate" type="checkbox" class="h-4 w-4" @change="saved" />
                </td>
                <td :class="tdCls">
                  <input v-model="row.allowSelfEmployed" type="checkbox" class="h-4 w-4" @change="saved" />
                </td>
                <td :class="tdCls">
                  <input v-model="row.oshAtOrAboveMaxAge" type="checkbox" class="h-4 w-4" @change="saved" />
                </td>
                <td :class="tdCls">
                  <input v-model="row.active" type="checkbox" class="h-4 w-4" @change="saved" />
                </td>
                <td :class="tdCls">
                  <button type="button" class="rounded p-1 text-rose-500 hover:bg-rose-50" @click="store.removeRequirement(row.id); saved()">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div>
            <h2 class="text-sm font-semibold text-slate-900">{{ ts("st.tetapan.periodTitle") }}</h2>
            <p class="text-xs text-slate-500">{{ ts("st.tetapan.periodHint") }}</p>
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-1 rounded-md bg-[var(--accent-600)] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[var(--accent-700)]"
            @click="store.addPeriodBand(); saved()"
          >
            <Plus class="h-3.5 w-3.5" /> {{ ts("st.tetapan.add") }}
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-slate-50">
              <tr>
                <th :class="thCls">{{ ts("st.tetapan.catGroup") }}</th>
                <th :class="thCls">{{ ts("st.tetapan.ageMin") }}</th>
                <th :class="thCls">{{ ts("st.tetapan.ageMax") }}</th>
                <th :class="thCls">{{ ts("st.tetapan.maxPeriod") }}</th>
                <th :class="thCls">{{ ts("st.tetapan.active") }}</th>
                <th :class="thCls" />
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="row in store.periodBands" :key="row.id">
                <td :class="tdCls">
                  <select v-model="row.categoryGroup" :class="inputCls" @change="saved">
                    <option v-for="g in CAT_GROUPS" :key="g.value" :value="g.value">{{ groupLabel(g.value) }}</option>
                  </select>
                </td>
                <td :class="tdCls">
                  <input v-model.number="row.ageMin" type="number" min="0" max="120" :class="inputCls" class="w-20" @change="saved" />
                </td>
                <td :class="tdCls">
                  <input
                    :value="row.ageMax ?? ''"
                    type="number"
                    min="0"
                    max="120"
                    :placeholder="ts('st.tetapan.noUpper')"
                    :class="inputCls"
                    class="w-24"
                    @change="
                      (e) => {
                        const v = (e.target as HTMLInputElement).value;
                        row.ageMax = v === '' ? null : Number(v);
                        saved();
                      }
                    "
                  />
                </td>
                <td :class="tdCls">
                  <select v-model.number="row.maxPeriodYears" :class="inputCls" class="w-24" @change="saved">
                    <option v-for="p in PERIODS" :key="p" :value="p">{{ p }} {{ ts("st.tetapan.years") }}</option>
                  </select>
                </td>
                <td :class="tdCls">
                  <input v-model="row.active" type="checkbox" class="h-4 w-4" @change="saved" />
                </td>
                <td :class="tdCls">
                  <button type="button" class="rounded p-1 text-rose-500 hover:bg-rose-50" @click="store.removePeriodBand(row.id); saved()">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <!-- 8: Documents -->
    <section v-else-if="tab === 'documents'" class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div>
          <h2 class="text-sm font-semibold text-slate-900">{{ ts("st.tetapan.docTitle") }}</h2>
          <p class="text-xs text-slate-500">{{ ts("st.tetapan.docHint") }}</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <select v-model="docModuleFilter" :class="inputCls" class="w-36">
            <option value="all">{{ ts("st.tetapan.allModules") }}</option>
            <option v-for="m in MODULES" :key="m" :value="m">{{ m }}</option>
          </select>
          <button
            type="button"
            class="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            @click="resetCeDocs"
          >
            <RotateCcw class="h-3.5 w-3.5" /> {{ ts("st.tetapan.resetCeDocs") }}
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-1 rounded-md bg-[var(--accent-600)] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[var(--accent-700)]"
            @click="store.addDocumentType(); saved()"
          >
            <Plus class="h-3.5 w-3.5" /> {{ ts("st.tetapan.add") }}
          </button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-slate-50">
            <tr>
              <th :class="thCls">{{ ts("st.common.module") }}</th>
              <th :class="thCls">Kod</th>
              <th :class="thCls">{{ ts("st.tetapan.labelBm") }}</th>
              <th :class="thCls">{{ ts("st.tetapan.labelBi") }}</th>
              <th :class="thCls">{{ ts("st.tetapan.required") }}</th>
              <th :class="thCls">{{ ts("st.tetapan.skipSelf") }}</th>
              <th :class="thCls">{{ ts("st.tetapan.sort") }}</th>
              <th :class="thCls">{{ ts("st.tetapan.active") }}</th>
              <th :class="thCls" />
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="row in filteredDocumentTypes" :key="row.id">
              <td :class="tdCls">
                <select v-model="row.moduleCode" :class="inputCls" @change="saved">
                  <option v-for="m in MODULES" :key="m" :value="m">{{ m }}</option>
                </select>
              </td>
              <td :class="tdCls"><input v-model="row.code" :class="inputCls" class="w-28 font-mono text-xs" @change="saved" /></td>
              <td :class="tdCls"><input v-model="row.labelBm" :class="inputCls" @change="saved" /></td>
              <td :class="tdCls"><input v-model="row.labelBi" :class="inputCls" @change="saved" /></td>
              <td :class="tdCls"><input v-model="row.required" type="checkbox" class="h-4 w-4" @change="saved" /></td>
              <td :class="tdCls"><input v-model="row.skipIfSelfEmployed" type="checkbox" class="h-4 w-4" @change="saved" /></td>
              <td :class="tdCls">
                <input v-model.number="row.sortOrder" type="number" min="0" :class="inputCls" class="w-16" @change="saved" />
              </td>
              <td :class="tdCls"><input v-model="row.active" type="checkbox" class="h-4 w-4" @change="saved" /></td>
              <td :class="tdCls">
                <button type="button" class="rounded p-1 text-rose-500 hover:bg-rose-50" @click="store.removeDocumentType(row.id); saved()">
                  <Trash2 class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 9a: Payment days -->
    <section v-else-if="tab === 'payment'" class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <h2 class="text-sm font-semibold text-slate-900">{{ ts("st.tetapan.payTitle") }}</h2>
          <p class="text-xs text-slate-500">{{ ts("st.tetapan.payHint") }}</p>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-1 rounded-md bg-[var(--accent-600)] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[var(--accent-700)]"
          @click="store.addPaymentDays(); saved()"
        >
          <Plus class="h-3.5 w-3.5" /> {{ ts("st.tetapan.add") }}
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-slate-50">
            <tr>
              <th :class="thCls">{{ ts("st.common.module") }}</th>
              <th :class="thCls">{{ ts("st.tetapan.feeKind") }}</th>
              <th :class="thCls">{{ ts("st.tetapan.paymentDays") }}</th>
              <th :class="thCls">{{ ts("st.tetapan.active") }}</th>
              <th :class="thCls" />
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="row in store.paymentDays" :key="row.id">
              <td :class="tdCls">
                <select v-model="row.moduleCode" :class="inputCls" @change="saved">
                  <option v-for="m in MODULES" :key="m" :value="m">{{ m }}</option>
                </select>
              </td>
              <td :class="tdCls">
                <select v-model="row.feeKind" :class="inputCls" @change="saved">
                  <option v-for="f in FEE_KINDS" :key="f.value" :value="f.value">{{ feeLabel(f.value) }}</option>
                </select>
              </td>
              <td :class="tdCls">
                <input v-model.number="row.paymentDays" type="number" min="1" max="365" :class="inputCls" class="w-24" @change="saved" />
              </td>
              <td :class="tdCls"><input v-model="row.active" type="checkbox" class="h-4 w-4" @change="saved" /></td>
              <td :class="tdCls">
                <button type="button" class="rounded p-1 text-rose-500 hover:bg-rose-50" @click="store.removePaymentDays(row.id); saved()">
                  <Trash2 class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 9b: Reminder days -->
    <section v-else-if="tab === 'reminder'" class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <h2 class="text-sm font-semibold text-slate-900">{{ ts("st.tetapan.remTitle") }}</h2>
          <p class="text-xs text-slate-500">{{ ts("st.tetapan.remHint") }}</p>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-1 rounded-md bg-[var(--accent-600)] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[var(--accent-700)]"
          @click="store.addReminderDays(); saved()"
        >
          <Plus class="h-3.5 w-3.5" /> {{ ts("st.tetapan.add") }}
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-slate-50">
            <tr>
              <th :class="thCls">{{ ts("st.common.module") }}</th>
              <th :class="thCls">Kod</th>
              <th :class="thCls">{{ ts("st.tetapan.labelBm") }}</th>
              <th :class="thCls">{{ ts("st.tetapan.labelBi") }}</th>
              <th :class="thCls">{{ ts("st.tetapan.reminderDays") }}</th>
              <th :class="thCls">{{ ts("st.tetapan.active") }}</th>
              <th :class="thCls" />
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="row in store.reminderDays" :key="row.id">
              <td :class="tdCls">
                <select v-model="row.moduleCode" :class="inputCls" @change="saved">
                  <option v-for="m in MODULES" :key="m" :value="m">{{ m }}</option>
                </select>
              </td>
              <td :class="tdCls"><input v-model="row.eventCode" :class="inputCls" class="w-36 font-mono text-xs" @change="saved" /></td>
              <td :class="tdCls"><input v-model="row.eventLabelBm" :class="inputCls" @change="saved" /></td>
              <td :class="tdCls"><input v-model="row.eventLabelBi" :class="inputCls" @change="saved" /></td>
              <td :class="tdCls">
                <input v-model.number="row.reminderDays" type="number" min="0" max="365" :class="inputCls" class="w-20" @change="saved" />
              </td>
              <td :class="tdCls"><input v-model="row.active" type="checkbox" class="h-4 w-4" @change="saved" /></td>
              <td :class="tdCls">
                <button type="button" class="rounded p-1 text-rose-500 hover:bg-rose-50" @click="store.removeReminderDays(row.id); saved()">
                  <Trash2 class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 9c: Notification text -->
    <section v-else-if="tab === 'notif'" class="space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-sm font-semibold text-slate-900">{{ ts("st.tetapan.notifTitle") }}</h2>
          <p class="text-xs text-slate-500">{{ ts("st.tetapan.notifHint") }}</p>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-1 rounded-md bg-[var(--accent-600)] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[var(--accent-700)]"
          @click="store.addNotificationText(); saved()"
        >
          <Plus class="h-3.5 w-3.5" /> {{ ts("st.tetapan.add") }}
        </button>
      </div>
      <div
        v-for="row in store.notificationTexts"
        :key="row.id"
        class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div class="mb-3 flex flex-wrap items-center gap-3">
          <input v-model="row.code" :class="inputCls" class="w-40 font-mono text-xs" @change="saved" />
          <input v-model="row.channel" :class="inputCls" class="w-32" @change="saved" />
          <label class="flex items-center gap-1.5 text-xs text-slate-600">
            <input v-model="row.active" type="checkbox" class="h-4 w-4" @change="saved" />
            {{ ts("st.tetapan.active") }}
          </label>
          <button type="button" class="ml-auto rounded p-1 text-rose-500 hover:bg-rose-50" @click="store.removeNotificationText(row.id); saved()">
            <Trash2 class="h-4 w-4" />
          </button>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <label class="block text-xs">
            <span class="mb-1 block font-medium text-slate-600">{{ ts("st.tetapan.subjectBm") }}</span>
            <input v-model="row.subjectBm" :class="inputCls" @change="saved" />
          </label>
          <label class="block text-xs">
            <span class="mb-1 block font-medium text-slate-600">{{ ts("st.tetapan.subjectBi") }}</span>
            <input v-model="row.subjectBi" :class="inputCls" @change="saved" />
          </label>
          <label class="block text-xs sm:col-span-2">
            <span class="mb-1 block font-medium text-slate-600">{{ ts("st.tetapan.bodyBm") }}</span>
            <textarea v-model="row.bodyBm" rows="2" :class="inputCls" @change="saved" />
          </label>
          <label class="block text-xs sm:col-span-2">
            <span class="mb-1 block font-medium text-slate-600">{{ ts("st.tetapan.bodyBi") }}</span>
            <textarea v-model="row.bodyBi" rows="2" :class="inputCls" @change="saved" />
          </label>
        </div>
      </div>
    </section>

    <!-- 9d: Status -->
    <section v-else class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <h2 class="text-sm font-semibold text-slate-900">{{ ts("st.tetapan.statusTitle") }}</h2>
          <p class="text-xs text-slate-500">{{ ts("st.tetapan.statusHint") }}</p>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-slate-50">
            <tr>
              <th :class="thCls">Kod</th>
              <th :class="thCls">{{ ts("st.tetapan.labelBm") }}</th>
              <th :class="thCls">{{ ts("st.tetapan.labelBi") }}</th>
              <th :class="thCls">{{ ts("st.tetapan.sort") }}</th>
              <th :class="thCls">{{ ts("st.tetapan.active") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="row in [...store.appStatuses].sort((a, b) => a.sortOrder - b.sortOrder)" :key="row.id">
              <td :class="[tdCls, 'font-mono text-xs text-slate-600']">{{ row.code }}</td>
              <td :class="tdCls"><input v-model="row.labelBm" :class="inputCls" @change="saved" /></td>
              <td :class="tdCls"><input v-model="row.labelBi" :class="inputCls" @change="saved" /></td>
              <td :class="tdCls">
                <input v-model.number="row.sortOrder" type="number" min="0" :class="inputCls" class="w-16" @change="saved" />
              </td>
              <td :class="tdCls"><input v-model="row.active" type="checkbox" class="h-4 w-4" @change="saved" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
