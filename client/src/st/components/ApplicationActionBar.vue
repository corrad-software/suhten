<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useToast } from "@/composables/useToast";
import { useConfirmDialog } from "@/composables/useConfirmDialog";

import type { AppDocument, Application, PersonaRole } from "../types";
import { ROLE_LABEL } from "../mock/personas";
import { useStSessionStore } from "../stores/session";
import { useStWorkflowStore, type WorkflowAction } from "../stores/workflow";
import DigitalSignatureModal from "./DigitalSignatureModal.vue";
import DocumentUploadField from "./DocumentUploadField.vue";

type ActionKey = WorkflowAction;

interface ActionBtn {
  key: ActionKey;
  label: string;
  variant: "primary" | "outline" | "danger";
  needsNote?: boolean;
  to?: string; // route navigation instead of a transition
}

const props = defineProps<{ application: Application }>();

const route = useRoute();
const router = useRouter();
const session = useStSessionStore();
const workflow = useStWorkflowStore();
const toast = useToast();
const { confirm } = useConfirmDialog();

const portalBase = computed(() => (route.path.startsWith("/admin/st") ? "/admin/st" : "/st"));

const signOpen = ref(false);
const notePrompt = ref<{ action: ActionKey; label: string } | null>(null);
const noteText = ref("");

// Employer confirmation (OK flow) requires KWSP/PERKESO uploads.
const confirmOpen = ref(false);
const confirmDocs = ref<AppDocument[]>([]);
const CONFIRM_DOC_LABELS = ["Penyata KWSP (EPF)", "Penyata PERKESO (SOCSO)"];

const isConfirmer = computed(
  () =>
    props.application.status === "awaiting_employer_confirm" &&
    props.application.employer?.confirmerPersonaId === session.currentPersonaId,
);

const identityDone = computed(() => Boolean(props.application.identityCheck));

const actions = computed<ActionBtn[]>(() => {
  const role = session.role;
  const status = props.application.status;
  const mine = props.application.applicantPersonaId === session.currentPersonaId;
  const list: ActionBtn[] = [];

  // Appointment confirmation (confirmer = employer persona, or OK persona in CE)
  if (isConfirmer.value) {
    list.push({ key: "confirm_appointment", label: "Sahkan Lantikan", variant: "primary" });
    list.push({ key: "decline_appointment", label: "Tolak Lantikan", variant: "danger", needsNote: true });
    return list;
  }

  // Applicant-owned actions
  if (mine) {
    if (status === "awaiting_processing_payment")
      list.push({ key: "pay_processing", label: "Bayar Yuran Pemprosesan", variant: "primary", to: `${portalBase.value}/applications/${props.application.id}/pay/processing` });
    if (status === "awaiting_registration_payment")
      list.push({ key: "pay_registration", label: "Bayar Yuran Pendaftaran", variant: "primary", to: `${portalBase.value}/applications/${props.application.id}/pay/registration` });
    if (status === "query_applicant")
      list.push({ key: "resubmit", label: "Hantar Semula", variant: "primary", needsNote: true });
    if (status === "certificate_issued")
      list.push({ key: "submit", label: "Lihat Sijil", variant: "primary", to: `${portalBase.value}/applications/${props.application.id}/certificate` });
    if (["awaiting_employer_confirm", "awaiting_processing_payment", "query_applicant", "awaiting_registration_payment"].includes(status))
      list.push({ key: "withdraw", label: "Tarik Balik", variant: "outline" });
    return list;
  }

  // Back-office actions
  if (role === "sos" && status === "sos_review") {
    if (!identityDone.value)
      list.push({ key: "verify_identity", label: "Sahkan Identiti (JPN)", variant: "outline" });
    list.push({ key: "forward", label: "Majukan ke Teknikal", variant: "primary" });
    list.push({ key: "raise_query", label: "Pertanyaan", variant: "outline", needsNote: true });
    list.push({ key: "reject", label: "Tolak", variant: "danger", needsNote: true });
  }
  if (role === "technical" && status === "technical_review") {
    list.push({ key: "forward", label: "Majukan ke Pelulus", variant: "primary" });
    list.push({ key: "raise_query", label: "Pertanyaan", variant: "outline", needsNote: true });
    list.push({ key: "reject", label: "Tolak", variant: "danger", needsNote: true });
  }
  if (role === "approver" && status === "pending_approval") {
    list.push({ key: "approve_sign", label: "Lulus & Tandatangan", variant: "primary" });
    list.push({ key: "reject", label: "Tolak", variant: "danger", needsNote: true });
  }

  return list;
});

/** Which back-office role can act on the current status (if any). */
const requiredRole = computed<PersonaRole | null>(() => {
  const status = props.application.status;
  if (status === "sos_review") return "sos";
  if (status === "technical_review") return "technical";
  if (status === "pending_approval") return "approver";
  return null;
});

const idleHint = computed(() => {
  if (actions.value.length > 0) return null;
  const need = requiredRole.value;
  if (!need) {
    return "Tiada tindakan untuk peranan anda pada status permohonan ini.";
  }
  return `Permohonan ini menunggu ${ROLE_LABEL[need]}.`;
});

function variantClass(v: ActionBtn["variant"]) {
  if (v === "primary") return "bg-[var(--accent-600)] text-white hover:bg-[var(--accent-700)]";
  if (v === "danger") return "border border-rose-300 text-rose-600 hover:bg-rose-50";
  return "border border-slate-300 text-slate-700 hover:bg-slate-50";
}

async function run(btn: ActionBtn) {
  if (btn.to) {
    router.push(btn.to);
    return;
  }
  if (btn.key === "approve_sign") {
    signOpen.value = true;
    return;
  }
  // OK-flow employer must attach EPF/SOCSO before confirming the appointment.
  if (btn.key === "confirm_appointment" && props.application.workflowType === "OK") {
    confirmDocs.value = [];
    confirmOpen.value = true;
    return;
  }
  if (btn.needsNote) {
    noteText.value = "";
    notePrompt.value = { action: btn.key, label: btn.label };
    return;
  }
  if (btn.key === "withdraw") {
    const ok = await confirm({ title: "Tarik balik permohonan?", message: "Tindakan ini tidak boleh dibatalkan.", destructive: true, confirmText: "Tarik Balik" });
    if (!ok) return;
  }
  doTransition(btn.key);
}

function submitNote() {
  if (!notePrompt.value) return;
  doTransition(notePrompt.value.action, { note: noteText.value });
  notePrompt.value = null;
}

function submitConfirm() {
  if (confirmDocs.value.length === 0) {
    toast.error("Dokumen diperlukan", "Sila muat naik penyata KWSP & PERKESO sebelum mengesahkan.");
    return;
  }
  try {
    workflow.transition(props.application.id, "confirm_appointment", { documents: confirmDocs.value });
    confirmOpen.value = false;
    toast.success("Lantikan disahkan", "Penyata KWSP & PERKESO telah dilampirkan.");
  } catch (e) {
    toast.error("Gagal", e instanceof Error ? e.message : "Tindakan gagal.");
  }
}

function onSigned(pin: string) {
  try {
    workflow.transition(props.application.id, "approve_sign", { pin });
    signOpen.value = false;
    toast.success("Diluluskan", "Permohonan diluluskan & ditandatangani.");
  } catch (e) {
    toast.error("Gagal", e instanceof Error ? e.message : "PIN tidak sah.");
  }
}

function doTransition(action: ActionKey, payload: { note?: string } = {}) {
  const actedAsTechnical = session.role === "technical";
  try {
    workflow.transition(props.application.id, action, payload);
    toast.success("Berjaya", "Tindakan telah direkodkan.");
    // After Technical processes a task, return to Peti Tugasan (Baharu).
    if (actedAsTechnical && ["forward", "reject", "raise_query"].includes(action)) {
      router.push(`${portalBase.value}/inbox`);
    }
  } catch (e) {
    toast.error("Gagal", e instanceof Error ? e.message : "Tindakan gagal.");
  }
}
</script>

<template>
  <div v-if="actions.length" class="flex flex-wrap gap-2">
    <button
      v-for="btn in actions"
      :key="btn.key + btn.label"
      :class="['rounded-md px-4 py-2 text-sm font-medium transition-colors', variantClass(btn.variant)]"
      @click="run(btn)"
    >
      {{ btn.label }}
    </button>
  </div>
  <p v-else-if="idleHint" class="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
    {{ idleHint }}
  </p>

  <DigitalSignatureModal :open="signOpen" @confirm="onSigned" @cancel="signOpen = false" />

  <!-- Employer confirmation: attach EPF/SOCSO -->
  <div v-if="confirmOpen" class="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
    <div class="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
      <h3 class="mb-1 text-base font-semibold text-slate-900">Sahkan Lantikan Pekerja</h3>
      <p class="mb-4 text-sm text-slate-500">Sahkan bahawa pemohon adalah pekerja anda dan lampirkan penyata caruman KWSP & PERKESO.</p>
      <DocumentUploadField v-model="confirmDocs" :labels="CONFIRM_DOC_LABELS" />
      <div class="mt-5 flex gap-2">
        <button class="flex-1 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50" @click="confirmOpen = false">Batal</button>
        <button class="flex-1 rounded-md bg-[var(--accent-600)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-700)]" @click="submitConfirm">Sahkan Lantikan</button>
      </div>
    </div>
  </div>

  <!-- Note prompt -->
  <div v-if="notePrompt" class="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
    <div class="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
      <h3 class="mb-3 text-base font-semibold text-slate-900">{{ notePrompt.label }}</h3>
      <textarea
        v-model="noteText"
        rows="3"
        placeholder="Catatan / sebab (pilihan)..."
        class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[var(--accent-500)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]/30"
      />
      <div class="mt-4 flex gap-2">
        <button class="flex-1 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50" @click="notePrompt = null">Batal</button>
        <button class="flex-1 rounded-md bg-[var(--accent-600)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-700)]" @click="submitNote">Teruskan</button>
      </div>
    </div>
  </div>
</template>
