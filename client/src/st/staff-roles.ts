import type { ApplicationStatus, PersonaRole, WorkflowType } from "./types";

/** OK Elektrik keeps legacy sos/technical; CE uses dedicated officers. Approver is shared. */
export type StaffStage = "sos" | "technical" | "approver";

export function isSosRole(role: PersonaRole | null | undefined): boolean {
  return role === "sos" || role === "sos_ce";
}

export function isTpSosRole(role: PersonaRole | null | undefined): boolean {
  return role === "tp_sos";
}

export function isTechnicalRole(role: PersonaRole | null | undefined): boolean {
  return role === "technical" || role === "technical_ce";
}

export function isStaffOfficerRole(role: PersonaRole | null | undefined): boolean {
  return isSosRole(role) || isTpSosRole(role) || isTechnicalRole(role) || role === "approver";
}

/** Resolve Peti Tugasan role for a workflow stream + review stage. */
export function staffRoleFor(workflowType: WorkflowType, stage: StaffStage): PersonaRole {
  if (stage === "approver") return "approver";
  if (workflowType === "CE") {
    return stage === "sos" ? "sos_ce" : "technical_ce";
  }
  return stage === "sos" ? "sos" : "technical";
}

export function staffRoleForStatus(
  workflowType: WorkflowType,
  status: ApplicationStatus,
): PersonaRole | null {
  if (status === "sos_review") return staffRoleFor(workflowType, "sos");
  if (status === "technical_review") return staffRoleFor(workflowType, "technical");
  if (status === "pending_approval") return "approver";
  return null;
}

export const STAGE_FOR_STAFF_ROLE: Partial<Record<PersonaRole, ApplicationStatus>> = {
  sos: "sos_review",
  sos_ce: "sos_review",
  technical: "technical_review",
  technical_ce: "technical_review",
  approver: "pending_approval",
};

/** Demo persona ids used for in-app notifications. */
export const STAFF_PERSONA_BY_ROLE: Partial<Record<PersonaRole, string>> = {
  sos: "p-faridah",
  technical: "p-kumar",
  sos_ce: "p-halim",
  technical_ce: "p-priya",
  approver: "p-zainab",
  tp_sos: "p-mariam",
};

/** SOS officers eligible as reassignment targets for a stream. */
export function sosOfficersForWorkflow(workflowType: WorkflowType): PersonaRole {
  return workflowType === "CE" ? "sos_ce" : "sos";
}
