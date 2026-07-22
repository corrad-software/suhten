import type { ContractorClass, ContractorKind, RegistrationPeriod, WirerType } from "../types";
import { CLASS_REQUIREMENTS, validateOkSet } from "../mock/competencies";

/** Jenis kontraktor from panduan Bahagian A / PFD-RG-CE-NA. */
export type { ContractorKind };

export const CONTRACTOR_KINDS: Array<{
  code: ContractorKind;
  bm: string;
  bi: string;
  needsClass: boolean;
  needsVoltage: boolean;
  /** PFD-RG-CE-NA-02 — search & appoint registered OK (MyKad / No. Perakuan). */
  needsOkSearch: boolean;
  needsSkilledPersons: boolean;
  needsProfessionalEngineers: boolean;
}> = [
  {
    code: "electrical",
    bm: "Kontraktor Elektrik",
    bi: "Electrical Contractor",
    needsClass: true,
    needsVoltage: false,
    needsOkSearch: true,
    needsSkilledPersons: false,
    needsProfessionalEngineers: false,
  },
  {
    code: "service",
    bm: "Kontraktor Perkhidmatan Elektrik",
    bi: "Electrical Service Contractor",
    needsClass: false,
    needsVoltage: true,
    needsOkSearch: true,
    needsSkilledPersons: false,
    needsProfessionalEngineers: false,
  },
  {
    code: "repair",
    // Tender D11: Pembaikan uses "orang berkemahiran" (Borang T), not registered OK appointment.
    bm: "Kontraktor Pembaikan Elektrik",
    bi: "Electrical Repair Contractor",
    needsClass: false,
    needsVoltage: false,
    needsOkSearch: false,
    needsSkilledPersons: true,
    needsProfessionalEngineers: false,
  },
  {
    code: "signboard",
    bm: "Kontraktor Papan Tanda Elektrik",
    bi: "Electrical Signboard Contractor",
    needsClass: false,
    needsVoltage: false,
    needsOkSearch: true,
    needsSkilledPersons: false,
    needsProfessionalEngineers: false,
  },
  {
    code: "switchboard",
    bm: "Pengilang Papan Suis",
    bi: "Switchboard Manufacturer",
    needsClass: false,
    needsVoltage: true,
    needsOkSearch: true,
    needsSkilledPersons: false,
    needsProfessionalEngineers: true,
  },
  {
    code: "private_wiring",
    bm: "Unit Pendawaian Persendirian",
    bi: "Private Wiring Unit",
    needsClass: false,
    needsVoltage: false,
    needsOkSearch: true,
    needsSkilledPersons: false,
    needsProfessionalEngineers: false,
  },
];

export function contractorKindMeta(code: ContractorKind) {
  return CONTRACTOR_KINDS.find((k) => k.code === code) ?? CONTRACTOR_KINDS[0];
}

export const CONTRACTOR_VOLTAGES = [
  { code: "415V", bm: "415V", bi: "415V" },
  { code: "600V", bm: "600V", bi: "600V" },
  { code: "11kV", bm: "11kV", bi: "11kV" },
  { code: "33kV", bm: "33kV", bi: "33kV" },
  { code: "132kV", bm: "132kV", bi: "132kV" },
  { code: "275kV", bm: "275kV", bi: "275kV" },
  { code: "500kV", bm: "500kV", bi: "500kV" },
] as const;

export type ContractorVoltage = (typeof CONTRACTOR_VOLTAGES)[number]["code"];

export const PERIODS: RegistrationPeriod[] = [1, 2, 3, 4, 5];

export const TEST_EQUIPMENT_TYPES = [
  { code: "insulation_tester", bm: "Insulation Tester", bi: "Insulation Tester" },
  { code: "earth_tester", bm: "Earth Tester", bi: "Earth Tester" },
  { code: "multimeter", bm: "Multimeter", bi: "Multimeter" },
  { code: "clamp_meter", bm: "Clamp Meter", bi: "Clamp Meter" },
  { code: "phase_rotation", bm: "Phase Rotation Meter", bi: "Phase Rotation Meter" },
  { code: "loop_impedance", bm: "Loop Impedance Tester", bi: "Loop Impedance Tester" },
  { code: "other", bm: "Lain-lain", bi: "Other" },
] as const;

export const EQUIPMENT_BRANDS = [
  { code: "fluke", bm: "Fluke", bi: "Fluke" },
  { code: "megger", bm: "Megger", bi: "Megger" },
  { code: "kyoritsu", bm: "Kyoritsu", bi: "Kyoritsu" },
  { code: "hioki", bm: "Hioki", bi: "Hioki" },
  { code: "other", bm: "Lain-lain", bi: "Other" },
] as const;

export interface DirectorShareholder {
  id: string;
  name: string;
  icNumber: string;
  address: string;
  sharePercent: number;
}

export interface AppointedOkForm {
  okId: string;
  name: string;
  mykad: string;
  wirerType: WirerType;
  certificateNo: string;
  periodYears: RegistrationPeriod;
  employedElsewhere: boolean;
}

export interface SkilledPerson {
  id: string;
  name: string;
  icNumber: string;
  qualification: string;
  field: string;
}

export interface ProfessionalEngineer {
  id: string;
  registrationNo: string;
  name: string;
  icNumber: string;
}

export interface TestEquipment {
  id: string;
  equipmentType: string;
  serialNo: string;
  brand: string;
  model: string;
}

/** Panduan Bahagian E — pengesahan / senarai semak. */
export const CONFIRMATION_CHECKS = [
  { id: "class_ok", bm: "Kelas / kategori kontraktor dipilih dengan betul", bi: "Contractor class / category selected correctly" },
  { id: "company_ok", bm: "Maklumat syarikat dan pengarah lengkap", bi: "Company and director information complete" },
  { id: "ok_ok", bm: "Orang Kompeten / personel memenuhi syarat minima", bi: "Competent / skilled personnel meet minimum requirements" },
  { id: "equip_ok", bm: "Peralatan menguji telah disenaraikan", bi: "Test equipment has been listed" },
  { id: "docs_ok", bm: "Dokumen sokongan akan dimuat naik", bi: "Supporting documents will be uploaded" },
] as const;

/**
 * D11 PFD-RG-CE-NA-01 — dokumen sokongan eksplisit (Bahagian B).
 * Workshop tenancy is optional when office ≠ workshop.
 */
export const SUPPORTING_DOCS = [
  {
    id: "premise_tenancy",
    bm: "Perjanjian sewa atau jual beli pejabat",
    bi: "Office tenancy or sale agreement",
    required: true,
  },
  {
    id: "business_licence",
    bm: "Lesen perniagaan daripada Pihak Berkuasa Tempatan (PBT)",
    bi: "Local authority (PBT) business licence",
    required: true,
  },
  {
    id: "annual_return",
    bm: "Salinan laporan annual return terkini (disahkan setiausaha syarikat) atau Perakuan Pendaftaran",
    bi: "Latest annual return (company secretary certified) or Certificate of Registration",
    required: true,
  },
  {
    id: "socso_insurance",
    bm: "Perlindungan insurans syarikat & kakitangan (SOCSO) — Borang 8A 3 bulan terkini + resit",
    bi: "Company & staff insurance (SOCSO) — Form 8A last 3 months + receipts",
    required: true,
  },
  {
    id: "workshop_tenancy",
    bm: "Perjanjian sewa atau jual beli bengkel (jika alamat pejabat berbeza)",
    bi: "Workshop tenancy or sale agreement (if office address differs)",
    required: false,
  },
] as const;

export function classRequirementsLabel(cls: ContractorClass): string {
  const req = CLASS_REQUIREMENTS[cls];
  return (Object.entries(req) as Array<[WirerType, number]>)
    .map(([w, n]) => `${n}× ${w}`)
    .join(", ");
}

export { validateOkSet, CLASS_REQUIREMENTS };
