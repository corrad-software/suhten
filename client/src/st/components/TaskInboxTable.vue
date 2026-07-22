<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Lock, Stamp } from "lucide-vue-next";

import { useToast } from "@/composables/useToast";
import { useConfirmDialog } from "@/composables/useConfirmDialog";
import { useLocale } from "@/composables/useLocale";
import type { StMessageKey } from "@/i18n/st-messages";

import type { PersonaRole, TaskTab, WorkflowType } from "../types";
import { isStaffOfficerRole } from "../staff-roles";
import { useStSessionStore } from "../stores/session";
import { useStWorkflowStore } from "../stores/workflow";
import { workflowShort } from "../status";
import type { SmartTableColumn } from "../composables/useSmartTable";
import RegStatusBadge from "./RegStatusBadge.vue";
import SlaIndicator from "./SlaIndicator.vue";
import DigitalSignatureModal from "./DigitalSignatureModal.vue";
import SmartTable from "./SmartTable.vue";

const props = defineProps<{ role: PersonaRole }>();

const route = useRoute();
const router = useRouter();
const session = useStSessionStore();
const workflow = useStWorkflowStore();
const toast = useToast();
const { confirm } = useConfirmDialog();
const { ts } = useLocale();

const portalBase = computed(() => (route.path.startsWith("/admin/st") ? "/admin/st" : "/st"));

const tab = ref<TaskTab>("new");
/** Pelulus: filter Peti by JENIS (OK / CE). */
type JenisFilter = "all" | WorkflowType;
const jenisFilter = ref<JenisFilter>("all");
const showJenisFilter = computed(() => props.role === "approver");

const inbox = computed(() => workflow.inboxFor(props.role));
const items = computed(() => {
  const rows = inbox.value[tab.value];
  if (!showJenisFilter.value || jenisFilter.value === "all") return rows;
  return rows.filter((it) => it.workflowType === jenisFilter.value);
});
/** SLA FIFO head = oldest stageEnteredAt in Baharu (next claim candidate). */
const fifoHeadId = computed(() => workflow.fifoHeadId(props.role));

const activeCount = computed(() => workflow.activeCountFor(props.role));
const atLimit = computed(() => workflow.atActiveLimit(props.role));

const JENIS_OPTIONS = computed(() => [
  { key: "all" as JenisFilter, label: ts("st.common.filterAll") },
  { key: "OK" as JenisFilter, label: workflowShort("OK") },
  { key: "CE" as JenisFilter, label: workflowShort("CE") },
]);

// Pull DB registration apps (seeded + online) then heal from staff-task notify cache.
async function healFromServerNotifies() {
  if (!isStaffOfficerRole(props.role)) return;
  await workflow.syncFromApi();
  await workflow.syncInboxFromStaffNotifies(props.role);
}

onMounted(() => {
  void healFromServerNotifies();
});

watch(
  () => props.role,
  (role) => {
    if (role !== "approver") jenisFilter.value = "all";
    void healFromServerNotifies();
  },
);

// ── bulk approval (Pelulus, "Baharu" tab) ──────────────────────────────────
const canBulk = computed(() => props.role === "approver" && tab.value === "new");
const selectedIds = ref<string[]>([]);
const signOpen = ref(false);

watch([tab, () => props.role, jenisFilter], () => (selectedIds.value = []));

function toggleSelect(id: string) {
  const i = selectedIds.value.indexOf(id);
  if (i >= 0) selectedIds.value.splice(i, 1);
  else selectedIds.value.push(id);
}

const allSelected = computed(() => items.value.length > 0 && selectedIds.value.length === items.value.length);
function toggleSelectAll() {
  selectedIds.value = allSelected.value ? [] : items.value.map((it) => it.applicationId);
}

function countFor(key: TaskTab) {
  const rows = inbox.value[key];
  if (!showJenisFilter.value || jenisFilter.value === "all") return rows.length;
  return rows.filter((it) => it.workflowType === jenisFilter.value).length;
}

async function startBulkApprove() {
  if (selectedIds.value.length === 0) return;
  const ok = await confirm({
    title: ts("st.inbox.bulkTitle"),
    message: ts("st.inbox.bulkMsg", { n: selectedIds.value.length }),
    confirmText: ts("st.inbox.continue"),
  });
  if (ok) signOpen.value = true;
}

async function onBulkSigned(pin: string) {
  const ids = [...selectedIds.value];
  signOpen.value = false;
  try {
    const res = await workflow.bulkApprove(ids, pin);
    if (res.failed.length && res.ok.length === 0) {
      toast.error("Gagal", "PIN tandatangan digital tidak sah, atau tiada permohonan diluluskan.");
      return;
    }
    toast.success(
      "Kelulusan pukal selesai",
      `${res.ok.length} permohonan diluluskan${res.failed.length ? `, ${res.failed.length} gagal` : ""}.`,
    );
    selectedIds.value = [];
    // Refresh from API so majikan / other sessions see awaiting_registration_payment.
    void workflow.syncFromApi();
  } catch (e) {
    toast.error("Gagal", e instanceof Error ? e.message : "Kelulusan pukal gagal.");
  }
}

const TABS = computed(() => [
  { key: "new" as TaskTab, label: ts("st.inbox.tabNew") },
  { key: "query" as TaskTab, label: ts("st.inbox.tabQuery") },
  { key: "completed" as TaskTab, label: ts("st.inbox.tabDone") },
]);

function isTaken(applicationId: string): boolean {
  // Only the officer who claimed it gets Buka; others still follow FIFO.
  const app = workflow.byId(applicationId);
  return Boolean(app?.assigneePersonaId && app.assigneePersonaId === session.currentPersonaId);
}

type NewAction = "open" | "take" | "limit" | "wait" | "claimed";

function newActionFor(applicationId: string): NewAction {
  // Pelulus can open any item and approve in batch — no FIFO claim gate.
  if (props.role === "approver") return "open";
  // Already claimed by me → Buka (officer can work their 3 active tasks even at capacity).
  // Applies to SOS + Technical (+ CE stream roles) alike.
  if (isTaken(applicationId)) return "open";
  // Claimed by another officer — Telah Dituntut (not the same as Menunggu giliran).
  const app = workflow.byId(applicationId);
  if (app?.assigneePersonaId) return "claimed";
  // Untaken: only SLA FIFO head may be claimed.
  if (fifoHeadId.value !== applicationId) return "wait";
  if (atLimit.value) return "limit";
  return "take";
}

const actionsById = computed(() => {
  const map = new Map<string, NewAction>();
  for (const item of items.value) {
    map.set(item.applicationId, newActionFor(item.applicationId));
  }
  return map;
});

function newActionLabel(action: NewAction): string {
  if (action === "open") return ts("st.common.open");
  if (action === "take") return ts("st.common.takeOpen");
  if (action === "limit") return ts("st.common.limitFull");
  if (action === "claimed") return ts("st.common.claimed");
  return ts("st.common.waitFifo");
}

function newActionTitle(action: NewAction): string | undefined {
  if (action === "wait") return ts("st.common.fifo");
  if (action === "claimed") return ts("st.common.claimedHint");
  return undefined;
}

function newActionClass(action: NewAction): string {
  if (action === "open") return "border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800/60";
  if (action === "take") return "bg-[var(--accent-600)] text-white hover:bg-[var(--accent-700)]";
  if (action === "claimed") return "cursor-not-allowed bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400";
  return "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-700/40 dark:text-slate-500";
}

function open(applicationId: string) {
  router.push(`${portalBase.value}/applications/${applicationId}`);
}

function takeAndOpen(applicationId: string) {
  const action = newActionFor(applicationId);
  if (action === "open") {
    open(applicationId);
    return;
  }
  if (action === "limit") {
    toast.error("Had tugasan dicapai", `Maksimum ${workflow.maxActiveTasks} tugasan aktif pada satu masa. Selesaikan satu dahulu.`);
    return;
  }
  if (action === "wait") {
    toast.error(ts("st.common.fifo"), ts("st.common.waitFifo"));
    return;
  }
  if (action === "claimed") {
    toast.error(ts("st.common.claimed"), ts("st.common.claimedHint"));
    return;
  }
  const ok = workflow.takeTask(applicationId);
  if (!ok) {
    toast.error("Tidak dapat mengambil tugasan", ts("st.common.waitFifo"));
    return;
  }
  toast.success("Tugasan diambil", "Tugasan kini di bawah tanggungjawab anda.");
  open(applicationId);
}

/** True FIFO queue position (independent of any search/filter/pagination in the table). */
function fifoRank(applicationId: string): number {
  return items.value.findIndex((it) => it.applicationId === applicationId) + 1;
}

type InboxItem = ReturnType<typeof workflow.inboxFor>["new"][number];

const columns = computed<SmartTableColumn<InboxItem>[]>(() => {
  const cols: SmartTableColumn<InboxItem>[] = [];
  if (canBulk.value) cols.push({ key: "select", label: "", value: () => "", filterable: false });
  cols.push(
    { key: "refNo", label: ts("st.common.refNo"), value: (it) => it.refNo },
    { key: "applicant", label: ts("st.common.applicant"), value: (it) => it.applicantName },
    { key: "type", label: ts("st.common.type"), value: (it) => workflowShort(it.workflowType) },
    { key: "status", label: ts("st.common.status"), value: (it) => ts(`st.status.${it.status}` as StMessageKey) },
    { key: "sla", label: "SLA", value: () => "", filterable: false },
    { key: "action", label: ts("st.common.action"), value: () => "", filterable: false },
  );
  return cols;
});
</script>

<template>
  <div>
    <!-- Tabs + active-load meter -->
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-700">
      <div class="flex gap-1">
        <button
          v-for="t in TABS"
          :key="t.key"
          :class="[
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            tab === t.key ? 'bg-[var(--accent-600)] text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
          ]"
          @click="tab = t.key"
        >
          {{ t.label }}
          <span
            :class="[
              'ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
              tab === t.key ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
            ]"
          >{{ countFor(t.key) }}</span>
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <!-- Pelulus: filter by JENIS (OK / CE) -->
        <div v-if="showJenisFilter" class="flex items-center gap-1.5">
          <label class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500" for="inbox-jenis-filter">
            {{ ts("st.common.type") }}
          </label>
          <select
            id="inbox-jenis-filter"
            v-model="jenisFilter"
            class="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm focus:border-[var(--accent-500)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            <option v-for="opt in JENIS_OPTIONS" :key="opt.key" :value="opt.key">{{ opt.label }}</option>
          </select>
        </div>

        <div
          :class="[
            'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
            atLimit ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-300',
          ]"
          :title="ts('st.common.activeTasks')"
        >
          <Lock v-if="atLimit" class="h-3.5 w-3.5" />
          {{ ts("st.common.activeTasks") }}: {{ activeCount }} / {{ workflow.maxActiveTasks }}
        </div>
      </div>
    </div>

    <!-- Bulk approval bar -->
    <div v-if="canBulk && selectedIds.length" class="mt-3 flex items-center justify-between gap-3 rounded-lg bg-[var(--accent-50)] px-4 py-2.5">
      <span class="text-sm font-medium text-[var(--accent-700)]">{{ ts("st.inbox.selected", { n: selectedIds.length }) }}</span>
      <button
        class="flex items-center gap-1.5 rounded-md bg-[var(--accent-600)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--accent-700)]"
        @click="startBulkApprove"
      >
        <Stamp class="h-3.5 w-3.5" /> {{ ts("st.inbox.bulkApprove") }}
      </button>
    </div>

    <!-- Table -->
    <SmartTable
      :rows="items"
      :columns="columns"
      :row-key="(it) => it.applicationId"
      :empty-text="ts('st.inbox.empty')"
    >
      <template #header-select>
        <input type="checkbox" :checked="allSelected" class="h-4 w-4 rounded border-slate-300 text-[var(--accent-600)] focus:ring-[var(--accent-ring)] dark:border-slate-600" @change="toggleSelectAll" />
      </template>
      <template #cell-select="{ row }">
        <input
          type="checkbox"
          :checked="selectedIds.includes(row.applicationId)"
          class="h-4 w-4 rounded border-slate-300 text-[var(--accent-600)] focus:ring-[var(--accent-ring)] dark:border-slate-600"
          @change="toggleSelect(row.applicationId)"
        />
      </template>
      <template #cell-refNo="{ row }">
        <div class="flex items-center gap-2">
          <span
            :class="[
              'flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold',
              tab === 'new' && row.applicationId === fifoHeadId ? 'bg-[var(--accent-600)] text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-700/40 dark:text-slate-400',
            ]"
            :title="ts('st.common.fifo')"
          >{{ fifoRank(row.applicationId) }}</span>
          <span class="font-mono text-xs text-slate-700 dark:text-slate-300">{{ row.refNo }}</span>
        </div>
      </template>
      <template #cell-type="{ row }">
        <span class="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-700/40 dark:text-slate-300">{{ workflowShort(row.workflowType) }}</span>
      </template>
      <template #cell-status="{ row }">
        <RegStatusBadge :status="row.status" />
      </template>
      <template #cell-sla="{ row }">
        <SlaIndicator :stage-entered-at="row.stageEnteredAt" :target-hours="row.slaTargetHours" :role="role" />
      </template>
      <template #cell-action="{ row }">
        <div class="text-right">
          <button
            v-if="tab === 'new' && actionsById.get(row.applicationId)"
            :disabled="['wait', 'limit'].includes(actionsById.get(row.applicationId)!)"
            :title="actionsById.get(row.applicationId) === 'wait' ? ts('st.common.fifo') : undefined"
            :class="['rounded-md px-3 py-1.5 text-xs font-medium transition-colors', newActionClass(actionsById.get(row.applicationId)!)]"
            @click="takeAndOpen(row.applicationId)"
          >
            {{ newActionLabel(actionsById.get(row.applicationId)!) }}
          </button>
          <button
            v-else-if="tab !== 'new'"
            class="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800/60"
            @click="open(row.applicationId)"
          >
            {{ ts("st.common.open") }}
          </button>
        </div>
      </template>
    </SmartTable>

    <DigitalSignatureModal :open="signOpen" @confirm="onBulkSigned" @cancel="signOpen = false" />
  </div>
</template>
