import type { Application, Certificate, ContractorClass, ContractorKind } from "./types";
import { feeFor } from "./mock/charter";
import { fmtCertDate } from "./certificate-ok";
import { CONTRACTOR_KINDS, contractorKindMeta } from "./registration/ce-rules";

export const CE_CLASS_CODES: ContractorClass[] = ["A", "B", "C", "D"];

const KIND_CODES = new Set<string>(CONTRACTOR_KINDS.map((k) => k.code));

/** Resolve jenis kontraktor from cert / application (defaults to electrical). */
export function resolveContractorKind(
  app: Application,
  override?: string | null,
): ContractorKind {
  const candidates = [override, app.contractorKind, app.certificate?.contractorKind];
  for (const raw of candidates) {
    if (!raw?.trim()) continue;
    const code = raw.trim().toLowerCase().replace(/-/g, "_") as ContractorKind;
    if (KIND_CODES.has(code)) return code;
  }
  // Class A–D implies standard electrical contractor.
  if (app.contractorClass || (override && /^[ABCD]$/i.test(override))) return "electrical";
  return "electrical";
}

/** BM label for the jenis, e.g. "Kontraktor Perkhidmatan Elektrik". */
export function ceKindLabel(kind?: string | null, app?: Application): string {
  const resolved = resolveContractorKind(app ?? ({ contractorKind: kind } as Application), kind);
  return contractorKindMeta(resolved).bm;
}

/** Official Borang Q title driven by Jenis Kontraktor. */
export function ceCertificateTitle(kind?: string | null, app?: Application): string {
  return `PERAKUAN PENDAFTARAN SEBAGAI ${ceKindLabel(kind, app).toUpperCase()}`;
}

/** Formal No. Pendaftaran for the left header / data grid. */
export function buildCeRegistrationNo(
  app: Application,
  issuedAt: string,
  existing?: string,
): string {
  if (existing?.trim()) return existing.trim();
  const stReg = app.employer?.stRegNo?.trim();
  if (stReg) return stReg;

  const year = new Date(issuedAt).getFullYear() || new Date().getFullYear();
  const digits = (app.refNo.split("/").pop() ?? app.id).replace(/\D/g, "").padStart(5, "0").slice(-5);
  return `ST(TKL)SGR/C/KE/${digits}/${year}`;
}

/** Display "No." on the right — year/sequence like 2018/00401. */
export function formatCeDisplaySerial(serialNo: string, issuedAt: string): string {
  if (/^\d{4}\/\d{4,}$/.test(serialNo.trim())) return serialNo.trim();
  const year = new Date(issuedAt).getFullYear() || new Date().getFullYear();
  const digits = serialNo.replace(/\D/g, "").slice(-5).padStart(5, "0");
  return `${year}/${digits}`;
}

export function formatFeeRm(amount?: number): string {
  if (amount == null || Number.isNaN(amount)) return "—";
  return amount.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function resolveCeBusinessAddress(app: Application, override?: string): string {
  if (override?.trim()) return override.trim();
  return (
    app.employer?.address?.trim() ||
    app.applicant.address?.trim() ||
    "—"
  );
}

export function resolveCeFeeRm(app: Application, override?: number): number {
  if (override != null && Number.isFinite(override)) return override;
  const paid = app.payments.find((p) => p.kind === "registration" && p.status === "paid");
  if (paid) return paid.amount;
  return feeFor(app, "registration");
}

const DEFAULT_SIGNATORY = "IR. MD. RADZI BIN ABDULLAH";
const DEFAULT_AGENCY = "Pengarah Kawasan, Suruhanjaya Tenaga";

/** Enrich / build Borang Q fields when issuing or synthesising a CE sijil. */
export function withCeCertificateFields(base: Certificate, app: Application): Certificate {
  const holderName =
    base.holderName?.trim() && base.holderName !== app.applicant.fullName
      ? base.holderName
      : (app.employer?.name ?? base.holderName);
  const contractorKind = resolveContractorKind(app, base.contractorKind);

  return {
    ...base,
    holderName,
    contractorKind,
    contractorClass: base.contractorClass ?? app.contractorClass,
    businessAddress: resolveCeBusinessAddress(app, base.businessAddress),
    registrationNo: buildCeRegistrationNo(app, base.issuedAt, base.registrationNo ?? base.perakuanNo),
    perakuanNo: base.perakuanNo ?? buildCeRegistrationNo(app, base.issuedAt, base.registrationNo),
    feeRm: resolveCeFeeRm(app, base.feeRm),
    periodYears: base.periodYears ?? app.registrationPeriodYears,
    issuedPlace: base.issuedPlace ?? "KUALA LUMPUR",
    issuedVia: base.issuedVia ?? "ST PORTAL",
    signatoryName: base.signatoryName ?? DEFAULT_SIGNATORY,
    signatoryAgency: base.signatoryAgency ?? DEFAULT_AGENCY,
  };
}

export { fmtCertDate };
