import type { ApplicationStatus, WorkflowType } from "./types";

export interface StatusMeta {
  label: string;
  classes: string; // tailwind pill classes
}

export const STATUS_META: Record<ApplicationStatus, StatusMeta> = {
  draft: { label: "Draf", classes: "bg-slate-100 text-slate-600" },
  awaiting_employer_confirm: { label: "Menunggu Pengesahan Lantikan", classes: "bg-amber-100 text-amber-700" },
  awaiting_final_submit: { label: "Menunggu Penghantaran Permohonan", classes: "bg-amber-100 text-amber-700" },
  awaiting_processing_payment: { label: "Menunggu Bayaran Pemprosesan", classes: "bg-amber-100 text-amber-700" },
  sos_review: { label: "Semakan SOS", classes: "bg-blue-100 text-blue-700" },
  query_applicant: { label: "Pertanyaan Pemohon", classes: "bg-orange-100 text-orange-700" },
  technical_review: { label: "Semakan Teknikal", classes: "bg-indigo-100 text-indigo-700" },
  pending_approval: { label: "Menunggu Kelulusan", classes: "bg-violet-100 text-violet-700" },
  awaiting_registration_payment: { label: "Menunggu Bayaran Pendaftaran", classes: "bg-amber-100 text-amber-700" },
  certificate_issued: { label: "Sijil Dikeluarkan", classes: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Ditolak", classes: "bg-rose-100 text-rose-700" },
  withdrawn: { label: "Ditarik Balik", classes: "bg-slate-200 text-slate-600" },
};

// Ordered "happy path" stages for the workflow stepper.
export interface StepDef {
  key: string;
  label: string;
  statuses: ApplicationStatus[];
}

export const WORKFLOW_STEPS: StepDef[] = [
  { key: "submit", label: "Permohonan", statuses: ["draft"] },
  { key: "confirm", label: "Pengesahan Lantikan", statuses: ["awaiting_employer_confirm"] },
  { key: "final_submit", label: "Hantar Permohonan", statuses: ["awaiting_final_submit"] },
  { key: "processing", label: "Bayaran Pemprosesan", statuses: ["awaiting_processing_payment"] },
  { key: "sos", label: "Semakan SOS", statuses: ["sos_review", "query_applicant"] },
  { key: "technical", label: "Semakan Teknikal", statuses: ["technical_review"] },
  { key: "approval", label: "Kelulusan", statuses: ["pending_approval"] },
  { key: "registration", label: "Bayaran Pendaftaran", statuses: ["awaiting_registration_payment"] },
  { key: "certificate", label: "Sijil Digital", statuses: ["certificate_issued"] },
];

// Index of a status within the happy-path order (for stepper progress).
export function stepIndexForStatus(status: ApplicationStatus): number {
  const idx = WORKFLOW_STEPS.findIndex((s) => s.statuses.includes(status));
  return idx;
}

export function workflowLabel(type: WorkflowType): string {
  return type === "OK" ? "Pendaftaran Orang Kompeten Elektrik" : "Pendaftaran Kontraktor Elektrik";
}

export function workflowShort(type: WorkflowType): string {
  return type === "OK" ? "Orang Kompeten" : "Kontraktor Elektrik";
}
