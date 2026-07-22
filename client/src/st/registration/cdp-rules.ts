import type { CompetencyCategory, RegistrationPeriod } from "../types";
import { myKadDigits } from "./ok-rules";

/**
 * D11 / PFD-RG-KE-NA-10 & PFD-RG-CE-NA-11:
 * First registration awards +2 CDP on the OK profile (once in a lifetime).
 */
export const CDP_FIRST_REGISTRATION_BONUS = 2;

/**
 * D11 renewal thresholds — mata keseluruhan by category × tempoh (1–5 tahun).
 * First registration: no CDP check (gate skipped).
 */
const CDP_REQUIRED: Record<CompetencyCategory, Record<RegistrationPeriod, number>> = {
  JPE: { 1: 15, 2: 30, 3: 40, 4: 50, 5: 60 },
  JEK: { 1: 15, 2: 30, 3: 40, 4: 50, 5: 60 },
  PE: { 1: 12, 2: 25, 3: 35, 4: 45, 5: 55 },
  PJ: { 1: 12, 2: 25, 3: 35, 4: 45, 5: 55 },
  PW: { 1: 12, 2: 25, 3: 35, 4: 45, 5: 55 },
  PK: { 1: 12, 2: 25, 3: 35, 4: 45, 5: 55 },
};

export function requiredCdpPoints(
  category: CompetencyCategory,
  periodYears: RegistrationPeriod,
): number {
  return CDP_REQUIRED[category]?.[periodYears] ?? CDP_REQUIRED.PW[periodYears] ?? 0;
}

export type CdpGateResult = {
  allowed: boolean;
  isFirstRegistration: boolean;
  required: number;
  available: number;
  shortfall: number;
};

/**
 * First registration → always allowed (no CDP check).
 * Otherwise → available points must meet the D11 table for category × years.
 */
export function evaluateCdpGate(input: {
  isFirstRegistration: boolean;
  category: CompetencyCategory;
  periodYears: RegistrationPeriod;
  availablePoints: number;
}): CdpGateResult {
  if (input.isFirstRegistration) {
    return {
      allowed: true,
      isFirstRegistration: true,
      required: 0,
      available: input.availablePoints,
      shortfall: 0,
    };
  }
  const required = requiredCdpPoints(input.category, input.periodYears);
  const available = Math.max(0, input.availablePoints);
  const shortfall = Math.max(0, required - available);
  return {
    allowed: shortfall === 0,
    isFirstRegistration: false,
    required,
    available,
    shortfall,
  };
}

/** Match MyKad across formatting (dashes / spaces). */
export function sameMyKad(a: string, b: string): boolean {
  const da = myKadDigits(a);
  const db = myKadDigits(b);
  return da.length >= 8 && da === db;
}

export type PriorRegistrationLookup = {
  identityNo: string;
  moduleCode?: string;
  cdpPoints?: number | null;
};

/**
 * Prior RG-KE (or OK-like) registration for this MyKad ⇒ not first registration.
 * Uses the latest matching entity's CDP balance when present.
 */
export function resolveOkRegistrationHistory(
  icNumber: string,
  entities: PriorRegistrationLookup[],
): { isFirstRegistration: boolean; availablePoints: number } {
  const matches = entities.filter(
    (e) =>
      (!e.moduleCode || e.moduleCode === "RG-KE" || e.moduleCode === "RG-KG") &&
      sameMyKad(e.identityNo, icNumber),
  );
  if (matches.length === 0) {
    return { isFirstRegistration: true, availablePoints: 0 };
  }
  const best = matches.reduce((a, b) => ((b.cdpPoints ?? 0) >= (a.cdpPoints ?? 0) ? b : a));
  return {
    isFirstRegistration: false,
    availablePoints: Math.max(0, best.cdpPoints ?? 0),
  };
}

/** Export table for Tetapan / UI reference. */
export function cdpThresholdTable(): Array<{
  category: CompetencyCategory;
  years: Record<RegistrationPeriod, number>;
}> {
  return (Object.keys(CDP_REQUIRED) as CompetencyCategory[]).map((category) => ({
    category,
    years: { ...CDP_REQUIRED[category] },
  }));
}
