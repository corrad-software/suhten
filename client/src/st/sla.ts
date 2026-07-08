// Pure SLA helpers for the Piagam Pelanggan (client charter) traffic-light system.
// `now` is always supplied by the caller (from the workflow store's reactive clock)
// so the demo can advance time deterministically.

import type { SlaLevel } from "./types";

const MS_PER_HOUR = 3_600_000;

export function elapsedHours(stageEnteredAt: string, now: number): number {
  return (now - Date.parse(stageEnteredAt)) / MS_PER_HOUR;
}

export function slaRatio(stageEnteredAt: string, targetHours: number, now: number): number {
  if (targetHours <= 0) return 0;
  return elapsedHours(stageEnteredAt, now) / targetHours;
}

export interface SlaThresholds {
  green: number;
  yellow: number;
}

export function slaLevel(
  stageEnteredAt: string,
  targetHours: number,
  now: number,
  thresholds: SlaThresholds = { green: 0.5, yellow: 1.0 },
): SlaLevel {
  const ratio = slaRatio(stageEnteredAt, targetHours, now);
  if (ratio < thresholds.green) return "green";
  if (ratio < thresholds.yellow) return "yellow";
  return "red";
}

// Signed hours remaining against the target (negative = overdue).
export function remainingHours(stageEnteredAt: string, targetHours: number, now: number): number {
  return targetHours - elapsedHours(stageEnteredAt, now);
}

// Human-friendly countdown / overdue label, e.g. "3j 12m baki" or "5j 02m lewat".
// When the target is a full day or more (technical/approver stages), the label is
// expressed in days/hours to mirror the day-based Piagam Pelanggan.
export function slaCountdownLabel(stageEnteredAt: string, targetHours: number, now: number): string {
  const remaining = remainingHours(stageEnteredAt, targetHours, now);
  const overdue = remaining < 0;
  const abs = Math.abs(remaining);
  const suffix = overdue ? "lewat" : "baki";

  if (targetHours >= 24) {
    const d = Math.floor(abs / 24);
    const h = Math.floor(abs - d * 24);
    const time = `${d}h ${String(h).padStart(2, "0")}j`;
    return `${time} ${suffix}`;
  }

  const h = Math.floor(abs);
  const m = Math.floor((abs - h) * 60);
  const time = `${h}j ${String(m).padStart(2, "0")}m`;
  return `${time} ${suffix}`;
}

export const SLA_META: Record<SlaLevel, { label: string; dot: string; text: string; bg: string }> = {
  green: { label: "Dalam Tempoh", dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  yellow: { label: "Hampir Tamat", dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" },
  red: { label: "Melebihi Tempoh", dot: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-50" },
};
