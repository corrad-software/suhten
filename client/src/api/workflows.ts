import { apiRequest } from "./client";

export type WorkflowFieldDef = {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "textarea";
  required?: boolean;
  placeholder?: string;
  options?: string[];
  default?: string | number;
};

export type WorkflowActionDef = {
  key: string;
  label: string;
  description: string;
  action: string;
  fields: WorkflowFieldDef[];
};

export type WorkflowStepInput = {
  id: string;
  name?: string;
  actionKey: string;
  /** Piagam Pelanggan target for this step (hours). Setup-only until inbox is wired. */
  slaTargetHours?: number | null;
  parameters?: Record<string, unknown>;
};

export type WorkflowTransitionInput = {
  from: string;
  to: string;
  condition?: string;
};

export type WorkflowDefinitionInput = {
  name: string;
  slug?: string;
  version?: string;
  description?: string;
  isActive?: boolean;
  steps: WorkflowStepInput[];
  transitions?: WorkflowTransitionInput[];
};

export type WorkflowDefinition = {
  id: number;
  name: string;
  slug: string;
  version: string;
  description?: string | null;
  definition: {
    name: string;
    version: string;
    steps: Array<{
      id: string;
      name?: string;
      action: string;
      /** Present when configured in workflow setup. */
      slaTargetHours?: number | null;
      parameters?: Record<string, unknown>;
    }>;
    transitions?: WorkflowTransitionInput[];
  };
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type WorkflowInstanceRow = {
  id: string;
  name: string;
  state: string;
  progress: number;
  completedSteps?: string[];
  failedSteps?: string[];
  /** Linked ST registration application (from engine context), when started from submit. */
  applicationId?: number | null;
  applicationCode?: string | null;
  moduleCode?: string | null;
  refNo?: string | null;
  applicantName?: string | null;
};

export async function fetchWorkflowCatalog() {
  return apiRequest<{ data: { actions: WorkflowActionDef[] } }>("/api/workflows/catalog");
}

export async function translateWorkflowCondition(naturalLanguage: string) {
  return apiRequest<{ data: { condition: string } }>("/api/workflows/translate-condition", {
    method: "POST",
    body: JSON.stringify({ naturalLanguage }),
  });
}

export async function listWorkflows(params = "") {
  return apiRequest<{ data: WorkflowDefinition[]; meta: Record<string, unknown> }>(`/api/workflows${params}`);
}

export async function getWorkflow(id: number) {
  return apiRequest<{ data: WorkflowDefinition }>(`/api/workflows/${id}`);
}

export async function createWorkflow(input: WorkflowDefinitionInput) {
  return apiRequest<{ data: WorkflowDefinition }>("/api/workflows", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateWorkflow(id: number, input: WorkflowDefinitionInput) {
  return apiRequest<{ data: WorkflowDefinition }>(`/api/workflows/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deleteWorkflow(id: number) {
  return apiRequest<{ data: { success: boolean } }>(`/api/workflows/${id}`, { method: "DELETE" });
}

export async function startWorkflow(id: number, context: Record<string, unknown> = {}) {
  return apiRequest<{ data: { instanceId: string; status: Record<string, unknown> } }>(
    `/api/workflows/${id}/start`,
    { method: "POST", body: JSON.stringify({ context }) },
  );
}

export async function listWorkflowInstances(params = "") {
  return apiRequest<{ data: WorkflowInstanceRow[]; meta: Record<string, unknown> }>(
    `/api/workflow-instances${params}`,
  );
}

export async function getWorkflowInstance(id: string) {
  return apiRequest<{ data: Record<string, unknown> }>(`/api/workflow-instances/${id}`);
}

export async function cancelWorkflowInstance(id: string, reason?: string) {
  return apiRequest<{ data: { success: boolean } }>(`/api/workflow-instances/${id}/cancel`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export async function resumeWorkflowInstance(id: string) {
  return apiRequest<{ data: { id: string; status: Record<string, unknown> } }>(
    `/api/workflow-instances/${id}/resume`,
    { method: "POST", body: JSON.stringify({}) },
  );
}

/** Map stored engine action back to catalog key. */
export function actionToKey(
  action: string,
  catalog: WorkflowActionDef[],
  parameters?: Record<string, unknown> | null,
): string {
  const params = parameters ?? {};
  const hasNaturalLanguage =
    (typeof params.naturalLanguage === "string" && params.naturalLanguage.trim() !== "") ||
    (typeof params.natural_language === "string" && params.natural_language.trim() !== "") ||
    "naturalLanguage" in params ||
    "natural_language" in params;

  if (hasNaturalLanguage) {
    const ai = catalog.find((a) => a.key === "conditionAi" || a.key === "condition_ai");
    if (ai) return ai.key;
  }

  const byAction = catalog.find((a) => a.action === action || a.key === action);
  if (byAction) {
    // Prefer plain Condition when both catalog entries share ConditionAction FQCN.
    if (byAction.key === "conditionAi" || byAction.key === "condition_ai") {
      const plain = catalog.find((a) => a.key === "condition");
      if (plain) return "condition";
    }
    return byAction.key;
  }

  const lower = action.toLowerCase();
  if (lower.includes("log")) return "log";
  if (lower.includes("delay")) return "delay";
  if (lower.includes("email")) return "email";
  if (lower.includes("http")) return "http";
  if (lower.includes("human") || lower.includes("approval")) return "human";
  if (lower.includes("condition")) return "condition";
  return catalog[0]?.key ?? "log";
}
