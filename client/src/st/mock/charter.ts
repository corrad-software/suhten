import type {
  Application,
  ContractorClass,
  PaymentKind,
  PersonaRole,
  WorkflowType,
} from "../types";

// Piagam Pelanggan — SLA target (hours) per back-office stage.
// SOS target 4h reproduces the brief's traffic light: green < 2h, yellow 2–4h, red > 4h.
export const SLA_TARGET_HOURS: Partial<Record<PersonaRole, number>> = {
  sos: 4,
  sos_ce: 4,
  tp_sos: 4,
  technical: 24,
  technical_ce: 24,
  approver: 8,
};

/** D11: flag TP SOS when Baharu exceeds this many hours (before 4h red). */
export const SOS_ESCALATE_AFTER_HOURS = 3;

export function slaTargetFor(role: PersonaRole): number {
  return SLA_TARGET_HOURS[role] ?? 24;
}

// Traffic-light thresholds (fraction of the SLA target) per stage.
// SOS is measured in hours (green < 2h, yellow 2–4h, red > 4h with a 4h target).
// Technical & Approver are measured in days as a percentage of the Piagam Pelanggan
// (green < 70%, yellow 70–100%, red > 100%) per BRS §KE-NA-06.
export interface SlaThresholds {
  green: number; // ratio below which the light is green
  yellow: number; // ratio below which the light is yellow (else red)
}

export const SLA_THRESHOLDS: Record<PersonaRole, SlaThresholds> = {
  applicant: { green: 0.5, yellow: 1.0 },
  employer: { green: 0.5, yellow: 1.0 },
  sos: { green: 0.5, yellow: 1.0 },
  sos_ce: { green: 0.5, yellow: 1.0 },
  tp_sos: { green: 0.5, yellow: 1.0 },
  technical: { green: 0.7, yellow: 1.0 },
  technical_ce: { green: 0.7, yellow: 1.0 },
  approver: { green: 0.7, yellow: 1.0 },
  committee: { green: 0.7, yellow: 1.0 },
  admin: { green: 0.5, yellow: 1.0 },
};

export function slaThresholdsFor(role: PersonaRole | null | undefined): SlaThresholds {
  return (role && SLA_THRESHOLDS[role]) || { green: 0.5, yellow: 1.0 };
}

// Fee schedule (RM). Processing = yuran pemprosesan; Registration = yuran pendaftaran.
const PROCESSING_FEE: Record<WorkflowType, number> = { OK: 50, CE: 100 };

const OK_REGISTRATION_PER_YEAR = 100;

const CE_REGISTRATION_BY_CLASS: Record<ContractorClass, number> = {
  A: 500,
  B: 400,
  C: 300,
  D: 200,
};

export function feeFor(application: Application, kind: PaymentKind): number {
  if (kind === "processing") return PROCESSING_FEE[application.workflowType];
  // registration
  if (application.workflowType === "OK") {
    return OK_REGISTRATION_PER_YEAR * application.registrationPeriodYears;
  }
  const cls = application.contractorClass ?? "D";
  return CE_REGISTRATION_BY_CLASS[cls];
}
