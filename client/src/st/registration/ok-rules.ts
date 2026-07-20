import type { CompetencyCategory, RegistrationPeriod } from "../types";
import { competencyMeta } from "../mock/competencies";

/** Categories allowed to choose Self Employed (PFD-RG-KE-NA-01). */
export const SELF_EMPLOYED_CATEGORIES: CompetencyCategory[] = ["JPE", "JEK", "PE"];

export type EmployerCategory = "company" | "self_employed";

/**
 * Max registration period (years) by age band — Appendix D11 / PFD-RG-KE-NA-01.
 * Engineer/Supervisor (maxAge 75) vs Wirer/Cable (maxAge 65).
 */
export function maxPeriodForAge(age: number, category: CompetencyCategory): RegistrationPeriod {
  const meta = competencyMeta(category);
  const engineerBand = meta.maxAge >= 75;

  if (engineerBand) {
    if (age >= 75) return 1;
    if (age === 74) return 1;
    if (age === 73) return 2;
    if (age === 72) return 3;
    if (age === 71) return 4;
    return 5;
  }

  // Pendawai / Penjaga Jentera / Pencantum Kabel
  if (age >= 65) return 1;
  if (age === 64) return 1;
  if (age === 63) return 2;
  if (age === 62) return 3;
  if (age === 61) return 4;
  return 5;
}

export function allowedPeriods(age: number, category: CompetencyCategory): RegistrationPeriod[] {
  const max = maxPeriodForAge(age, category);
  return ([1, 2, 3, 4, 5] as RegistrationPeriod[]).filter((p) => p <= max);
}

/** OSH medical report required when at/over category age limit. */
export function oshRequired(age: number, category: CompetencyCategory): boolean {
  return age >= competencyMeta(category).maxAge;
}

export function canSelfEmploy(category: CompetencyCategory): boolean {
  return SELF_EMPLOYED_CATEGORIES.includes(category);
}

export const VOLTAGE_RESTRICTIONS = [
  { code: "none", bm: "Tiada sekatan", bi: "No restriction" },
  { code: "lv", bm: "Voltan Rendah (LV)", bi: "Low Voltage (LV)" },
  { code: "mv", bm: "Voltan Sederhana (MV)", bi: "Medium Voltage (MV)" },
  { code: "hv", bm: "Voltan Tinggi (HV)", bi: "High Voltage (HV)" },
  { code: "kv", bm: "kV / Terhad", bi: "kV / Restricted" },
] as const;

export const PLACE_RESTRICTIONS = [
  { code: "none", bm: "Tiada", bi: "None" },
  { code: "mine", bm: "Lombong", bi: "Mine" },
  { code: "oil_gas", bm: "Minyak & Gas", bi: "Oil & Gas" },
  { code: "confined", bm: "Ruang terkurung", bi: "Confined space" },
] as const;

export type VoltageRestriction = (typeof VOLTAGE_RESTRICTIONS)[number]["code"];
export type PlaceRestriction = (typeof PLACE_RESTRICTIONS)[number]["code"];

/** Strip separators from MyKad / IC numbers. */
export function myKadDigits(ic: string): string {
  return ic.replace(/\D/g, "");
}

/**
 * Derive YYYY-MM-DD date of birth from MyKad (first 6 digits = YYMMDD).
 * Century: YY greater than current year's last two digits → 19xx, else 20xx.
 */
export function parseMyKadDob(ic: string, asOf: Date = new Date()): string | null {
  const digits = myKadDigits(ic);
  if (digits.length < 6) return null;

  const yy = Number(digits.slice(0, 2));
  const mm = Number(digits.slice(2, 4));
  const dd = Number(digits.slice(4, 6));
  if (!Number.isFinite(yy) || mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;

  const currentYy = asOf.getFullYear() % 100;
  const year = yy > currentYy ? 1900 + yy : 2000 + yy;
  const date = new Date(year, mm - 1, dd);
  if (date.getFullYear() !== year || date.getMonth() !== mm - 1 || date.getDate() !== dd) {
    return null;
  }

  return `${year}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
}

/** Whole-year age from an ISO date string (YYYY-MM-DD). */
export function ageFromDob(dob: string, asOf: Date = new Date()): number {
  const [y, m, d] = dob.split("-").map(Number);
  if (!y || !m || !d) return 0;
  let age = asOf.getFullYear() - y;
  if (asOf.getMonth() + 1 < m || (asOf.getMonth() + 1 === m && asOf.getDate() < d)) {
    age -= 1;
  }
  return age;
}
