import type {
  Application,
  Certificate,
  CompetencyCategory,
  CompetencyCertificateInfo,
} from "./types";
import { VOLTAGE_RESTRICTIONS, PLACE_RESTRICTIONS } from "./registration/ok-rules";

/** Official Borang N title by competency family. */
export function okCertificateTitle(category?: CompetencyCategory): string {
  switch (category) {
    case "PW":
      return "PERAKUAN KEKOMPETENAN SEBAGAI PENDAWAI";
    case "PE":
      return "PERAKUAN KEKOMPETENAN SEBAGAI PENYELIA ELEKTRIK";
    case "PJ":
      return "PERAKUAN KEKOMPETENAN SEBAGAI PENJAGA JENTERA";
    case "PK":
      return "PERAKUAN KEKOMPETENAN SEBAGAI PENCANTUM KABEL";
    case "JPE":
      return "PERAKUAN KEKOMPETENAN SEBAGAI JURUTERA PERKHIDMATAN ELEKTRIK";
    case "JEK":
      return "PERAKUAN KEKOMPETENAN SEBAGAI JURUTERA ELEKTRIK KOMPETEN";
    default:
      return "PERAKUAN KEKOMPETENAN SEBAGAI ORANG KOMPETEN";
  }
}

function voltageBm(code?: string): string | undefined {
  if (!code) return undefined;
  const row = VOLTAGE_RESTRICTIONS.find((v) => v.code === code.toLowerCase());
  if (row) return row.bm;
  // Already a display label (e.g. "LV", "Tiga Fasa…")
  if (code.length > 3 || /[a-zA-Z\s&]/.test(code)) return code;
  return code.toUpperCase();
}

function placeBm(code?: string): string | undefined {
  if (!code) return undefined;
  const row = PLACE_RESTRICTIONS.find((v) => v.code === code.toLowerCase());
  if (row) {
    return row.code === "none" ? undefined : row.bm;
  }
  if (/^tiada|none$/i.test(code)) return undefined;
  return code;
}

/** Build SEKATAN line from competency certificate / stored restrictions. */
export function formatOkRestrictions(
  info?: CompetencyCertificateInfo,
  fallback?: string,
): string {
  if (fallback?.trim()) return fallback.trim();
  if (!info) return "Tiada";

  const parts: string[] = [];
  const v = voltageBm(info.voltageRestriction);
  if (v && !/^tiada/i.test(v)) parts.push(v);
  const p = placeBm(info.placeRestriction);
  if (p) parts.push(p);
  return parts.length ? parts.join(" & ") : "Tiada";
}

/** Category grade shown under KATEGORI (e.g. PW4). */
export function resolveCategoryGrade(
  category?: CompetencyCategory,
  info?: CompetencyCertificateInfo,
  override?: string,
): string {
  if (override?.trim()) return override.trim();
  const fromInfo = info?.category?.trim();
  if (fromInfo) return fromInfo;
  return category ?? "—";
}

/** Formal Perakuan No. for the left header. */
export function buildPerakuanNo(
  category: CompetencyCategory | undefined,
  refTail: string,
  issuedAt: string,
  info?: CompetencyCertificateInfo,
): string {
  const existing = info?.certificateNo?.trim();
  if (existing && existing !== "—") return existing;

  const year = new Date(issuedAt).getFullYear() || new Date().getFullYear();
  const cat = category ?? "OK";
  const digits = refTail.replace(/\D/g, "").padStart(4, "0").slice(-4);
  return `${cat}-T-${digits}-${year}`;
}

/** Display "No." on the right — keep digital serial, lightly styled for PW. */
export function formatDisplaySerial(serialNo: string, category?: CompetencyCategory): string {
  if (/^\s*[A-Z]{1,3}\s+\d/.test(serialNo)) return serialNo;
  const digits = serialNo.replace(/\D/g, "").slice(-8) || "00000000";
  const prefix = category ?? "ST";
  return `${prefix} ${digits.padStart(8, "0")}`;
}

export function fmtCertDate(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    // Already dd-mm-yyyy
    if (/^\d{2}-\d{2}-\d{4}$/.test(iso)) return iso;
    return iso;
  }
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export function fmtIc(ic?: string): string {
  if (!ic) return "—";
  return ic.replace(/[-\s]/g, "");
}

const DEFAULT_SIGNATORY = "IR AHMAD FAUZI BIN HASAN";
const DEFAULT_AGENCY = "Suruhanjaya Tenaga";
const DEFAULT_PLACE = "KUALA LUMPUR";

/** Enrich / build OK-facing fields when issuing or synthesising a digital sijil. */
export function withOkCertificateFields(
  base: Certificate,
  app: Application,
  opts?: { holderIc?: string; holderDob?: string; categoryGrade?: string },
): Certificate {
  const info = app.competencyCertificate;
  const refTail = app.refNo.split("/").pop() ?? app.id;
  const category = base.competencyCategory ?? app.competencyCategory;

  return {
    ...base,
    perakuanNo: base.perakuanNo ?? buildPerakuanNo(category, refTail, base.issuedAt, info),
    icNumber: base.icNumber ?? opts?.holderIc ?? app.applicant.icNumber,
    dob: base.dob ?? opts?.holderDob ?? app.applicant.dob,
    categoryGrade: resolveCategoryGrade(category, info, opts?.categoryGrade ?? base.categoryGrade),
    restrictions: formatOkRestrictions(info, base.restrictions),
    issuedPlace: base.issuedPlace ?? DEFAULT_PLACE,
    issuedVia: base.issuedVia ?? app.employer?.name?.split(" ")[0]?.toUpperCase() ?? "ST PORTAL",
    signatoryName: base.signatoryName ?? DEFAULT_SIGNATORY,
    signatoryAgency: base.signatoryAgency ?? DEFAULT_AGENCY,
  };
}
