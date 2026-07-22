import { apiRequest } from "./client";
import type {
  RegistrationApplication,
  RegisteredEntity,
  RegistrationAppType,
  ComplianceStatus,
} from "@/st/mock/registration";
import type { ApplicationStatus } from "@/st/types";
import type { RegistrationModuleCode } from "@/st/registration/modules";

/** Raw API row (camelCase via CamelCaseMiddleware). */
export type StRegistrationApplicationDto = {
  id: number;
  code: string;
  moduleCode: RegistrationModuleCode;
  refNo: string;
  appType: RegistrationAppType;
  applicantName: string;
  identityNo: string;
  categoryOrClass: string;
  status: ApplicationStatus;
  submittedAt: string | null;
  stageEnteredAt: string | null;
  slaTargetHours: number;
  employerName?: string | null;
  cdpPoints?: number | null;
  assignedOfficer?: string | null;
  feeAmount?: number | string | null;
  note?: string | null;
  detail?: RegistrationApplication["detail"] | null;
  workflowInstanceId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type StRegisteredEntityDto = {
  id: number;
  code: string;
  moduleCode: RegistrationModuleCode;
  certificateNo: string;
  holderName: string;
  identityNo: string;
  categoryOrClass: string;
  employerName?: string | null;
  registeredAt: string;
  expiresAt: string;
  compliance: ComplianceStatus;
  cdpPoints: number;
  statusLabel?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type StRegistrationApplicationInput = {
  code?: string;
  moduleCode: RegistrationModuleCode;
  refNo?: string;
  appType: RegistrationAppType;
  applicantName: string;
  identityNo: string;
  categoryOrClass: string;
  status?: ApplicationStatus;
  submittedAt?: string;
  stageEnteredAt?: string;
  slaTargetHours?: number;
  employerName?: string;
  cdpPoints?: number;
  assignedOfficer?: string;
  feeAmount?: number;
  note?: string;
  detail?: RegistrationApplication["detail"];
};

export function mapApplicationDto(dto: StRegistrationApplicationDto): RegistrationApplication {
  return {
    id: dto.code,
    moduleCode: dto.moduleCode,
    refNo: dto.refNo,
    appType: dto.appType,
    applicantName: dto.applicantName,
    identityNo: dto.identityNo,
    categoryOrClass: dto.categoryOrClass,
    status: dto.status,
    submittedAt: dto.submittedAt ?? new Date().toISOString(),
    stageEnteredAt: dto.stageEnteredAt ?? new Date().toISOString(),
    slaTargetHours: dto.slaTargetHours,
    employerName: dto.employerName ?? undefined,
    cdpPoints: dto.cdpPoints ?? undefined,
    assignedOfficer: dto.assignedOfficer ?? undefined,
    feeAmount: dto.feeAmount != null ? Number(dto.feeAmount) : undefined,
    note: dto.note ?? undefined,
    workflowInstanceId: dto.workflowInstanceId ?? undefined,
    detail: dto.detail ?? undefined,
  };
}

export function mapEntityDto(dto: StRegisteredEntityDto): RegisteredEntity {
  return {
    id: dto.code,
    moduleCode: dto.moduleCode,
    certificateNo: dto.certificateNo,
    holderName: dto.holderName,
    identityNo: dto.identityNo,
    categoryOrClass: dto.categoryOrClass,
    employerName: dto.employerName ?? undefined,
    registeredAt: dto.registeredAt,
    expiresAt: dto.expiresAt,
    compliance: dto.compliance,
    cdpPoints: dto.cdpPoints,
    statusLabel: dto.statusLabel ?? undefined,
  };
}

export async function listStRegistrationApplications(params = "") {
  return apiRequest<{ data: StRegistrationApplicationDto[]; meta: Record<string, unknown> }>(
    `/api/st/registration-applications${params}`,
  );
}

export async function getStRegistrationApplicationByCode(code: string) {
  return apiRequest<{ data: StRegistrationApplicationDto }>(
    `/api/st/registration-applications/by-code/${encodeURIComponent(code)}`,
  );
}

export async function createStRegistrationApplication(input: StRegistrationApplicationInput) {
  return apiRequest<{ data: StRegistrationApplicationDto }>("/api/st/registration-applications", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateStRegistrationApplication(
  id: number,
  input: Partial<StRegistrationApplicationInput>,
) {
  return apiRequest<{ data: StRegistrationApplicationDto }>(`/api/st/registration-applications/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export type StaffTaskNotifyInput = {
  role: "sos" | "sos_ce" | "technical" | "technical_ce" | "approver";
  refNo?: string;
  applicantName?: string;
  moduleCode?: string;
  applicationId?: number;
  applicationCode?: string;
  stepId?: string;
  actionPath?: string;
};

/** Fire-and-forget staff task email (simulation override applies server-side). */
export async function notifyStaffWorkflowTask(input: StaffTaskNotifyInput) {
  return apiRequest<{ data: { success: boolean } }>("/api/st/staff-task-notify", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export type ApplicantQueryNotifyInput = {
  applicantEmail: string;
  note: string;
  refNo?: string;
  applicantName?: string;
  moduleCode?: string;
  applicationId?: number;
  applicationCode?: string;
  actionPath?: string;
};

/** Fire-and-forget applicant Pertanyaan email (simulation override applies server-side). */
export async function notifyApplicantQuery(input: ApplicantQueryNotifyInput) {
  return apiRequest<{ data: { success: boolean } }>("/api/st/applicant-query-notify", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export type ApplicantRejectionNotifyInput = {
  applicantEmail: string;
  note?: string;
  refNo?: string;
  applicantName?: string;
  moduleCode?: string;
  applicationId?: number;
  applicationCode?: string;
  actionPath?: string;
};

/** Fire-and-forget applicant rejection email (simulation override applies server-side). */
export async function notifyApplicantRejection(input: ApplicantRejectionNotifyInput) {
  return apiRequest<{ data: { success: boolean } }>("/api/st/applicant-rejection-notify", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getStaffTaskNotifyState(applicationCode: string) {
  return apiRequest<{
    data: {
      role: "sos" | "sos_ce" | "technical" | "technical_ce" | "approver";
      refNo?: string | null;
      moduleCode?: string | null;
      actionUrl?: string | null;
      notifiedAt?: string | null;
    };
  }>(`/api/st/staff-task-notify/${encodeURIComponent(applicationCode)}`);
}

/** Resolve opaque /st/go/{token} email deep-link to an internal SPA path. */
export async function resolveStaffTaskLink(token: string) {
  return apiRequest<{ data: { path: string } }>(
    `/api/public/st/task-link/${encodeURIComponent(token)}`,
  );
}

export async function listStRegisteredEntities(params = "") {
  return apiRequest<{ data: StRegisteredEntityDto[]; meta: Record<string, unknown> }>(
    `/api/st/registered-entities${params}`,
  );
}
