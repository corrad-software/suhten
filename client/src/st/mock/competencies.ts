import type { CompetencyCategory, ContractorClass, WirerType } from "../types";

export interface CompetencyMeta {
  code: CompetencyCategory;
  label: string;
  description: string;
  maxAge: number; // age limit for registration
}

// Kekompetenan Orang Kompeten Elektrik
export const COMPETENCY_CATEGORIES: CompetencyMeta[] = [
  { code: "JPE", label: "Jurutera Perkhidmatan Elektrik", description: "Jurutera profesional perkhidmatan elektrik", maxAge: 75 },
  { code: "JEK", label: "Jurutera Elektrik Kompeten", description: "Jurutera elektrik berdaftar", maxAge: 75 },
  { code: "PE", label: "Penyelia Elektrik", description: "Penyelia kerja pemasangan elektrik", maxAge: 75 },
  { code: "PJ", label: "Penjaga Jentera Elektrik", description: "Penjaga jentera pepasangan elektrik", maxAge: 65 },
  { code: "PW", label: "Pendawai Elektrik", description: "Pendawai pemasangan elektrik", maxAge: 65 },
  { code: "PK", label: "Pencantum Kabel", description: "Pencantum kabel voltan", maxAge: 65 },
];

export function competencyMeta(code: CompetencyCategory): CompetencyMeta {
  return COMPETENCY_CATEGORIES.find((c) => c.code === code) ?? COMPETENCY_CATEGORIES[0];
}

export interface ContractorClassMeta {
  code: ContractorClass;
  label: string;
  ceilingLabel: string;
  minCompetentPersons: number;
}

// Kelas Kontraktor Elektrik (had nilai kerja)
export const CONTRACTOR_CLASSES: ContractorClassMeta[] = [
  { code: "A", label: "Kelas A", ceilingLabel: "Melebihi RM1 juta", minCompetentPersons: 3 },
  { code: "B", label: "Kelas B", ceilingLabel: "Sehingga RM1 juta", minCompetentPersons: 2 },
  { code: "C", label: "Kelas C", ceilingLabel: "Sehingga RM500,000", minCompetentPersons: 1 },
  { code: "D", label: "Kelas D", ceilingLabel: "Sehingga RM100,000", minCompetentPersons: 1 },
];

export function contractorClassMeta(code: ContractorClass): ContractorClassMeta {
  return CONTRACTOR_CLASSES.find((c) => c.code === code) ?? CONTRACTOR_CLASSES[3];
}

// Minimum number/grade of Orang Kompeten (Pendawai) required per contractor class.
// Representative subset of the BRS competency matrix.
export const CLASS_REQUIREMENTS: Record<ContractorClass, Partial<Record<WirerType, number>>> = {
  A: { PW4: 1, PW3: 2, PW1: 2 },
  B: { PW4: 1, PW3: 1, PW1: 1 },
  C: { PW4: 1 },
  D: { PW2: 1 },
};

export interface OkRequirementRow {
  wirerType: WirerType;
  need: number;
  have: number;
  ok: boolean;
}

export interface OkSetValidation {
  items: OkRequirementRow[];
  valid: boolean;
}

// Validate a set of appointed OK wirer types against a contractor class requirement.
export function validateOkSet(selected: WirerType[], cls: ContractorClass): OkSetValidation {
  const req = CLASS_REQUIREMENTS[cls];
  const items: OkRequirementRow[] = (Object.keys(req) as WirerType[]).map((wirerType) => {
    const need = req[wirerType] ?? 0;
    const have = selected.filter((w) => w === wirerType).length;
    return { wirerType, need, have, ok: have >= need };
  });
  return { items, valid: items.every((i) => i.ok) };
}
