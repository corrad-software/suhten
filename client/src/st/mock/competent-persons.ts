import type { CompetencyCategory, WirerType } from "../types";

// Pool of registered Orang Kompeten that a contractor (CE) application can appoint.
// `linkedPersonaId` ties a record to a login persona so appointment acceptance is
// demoable; pool-only records auto-confirm during the demo.
export interface RegisteredOk {
  id: string;
  name: string;
  mykad: string;
  wirerType: WirerType;
  competencyCategory: CompetencyCategory;
  certificateNo: string;
  voltageRestriction: string;
  placeRestriction: string;
  /** True if already registered under another employer (panduan Bahagian C block). */
  employedElsewhere: boolean;
  currentEmployerName?: string;
  linkedPersonaId?: string;
}

export const REGISTERED_OKS: RegisteredOk[] = [
  { id: "ok-ahmad", name: "Ahmad bin Ismail", mykad: "840512-10-5523", wirerType: "PW4", competencyCategory: "PW", certificateNo: "COMP/PW4/2024/00821", voltageRestriction: "LV", placeRestriction: "Tiada", employedElsewhere: false, linkedPersonaId: "p-ahmad" },
  { id: "ok-tan", name: "Tan Chee Keong", mykad: "790238-08-6191", wirerType: "PW3", competencyCategory: "PW", certificateNo: "COMP/PW3/2023/00412", voltageRestriction: "LV", placeRestriction: "Tiada", employedElsewhere: false, linkedPersonaId: "p-tan" },
  { id: "ok-rizal", name: "Rizal bin Hassan", mykad: "870404-10-5512", wirerType: "PW4", competencyCategory: "PW", certificateNo: "COMP/PW4/2023/00644", voltageRestriction: "LV", placeRestriction: "Tiada", employedElsewhere: false, linkedPersonaId: "p-rizal" },
  { id: "ok-suresh", name: "Suresh a/l Maniam", mykad: "880101-14-5099", wirerType: "PW3", competencyCategory: "PW", certificateNo: "COMP/PW3/2022/01102", voltageRestriction: "LV", placeRestriction: "Tiada", employedElsewhere: false },
  { id: "ok-lim-mei", name: "Lim Mei Ling", mykad: "900818-14-5220", wirerType: "PW3", competencyCategory: "PW", certificateNo: "COMP/PW3/2024/00721", voltageRestriction: "LV", placeRestriction: "Tiada", employedElsewhere: false },
  { id: "ok-faizal", name: "Mohd Faizal bin Yusof", mykad: "910722-05-5331", wirerType: "PW2", competencyCategory: "PW", certificateNo: "COMP/PW2/2024/00211", voltageRestriction: "LV", placeRestriction: "Tiada", employedElsewhere: false },
  { id: "ok-siti-osman", name: "Siti Aminah binti Osman", mykad: "930627-05-6024", wirerType: "PW2", competencyCategory: "PW", certificateNo: "COMP/PW2/2023/00880", voltageRestriction: "LV", placeRestriction: "Tiada", employedElsewhere: false },
  { id: "ok-chong", name: "Chong Wei Liang", mykad: "860318-07-5217", wirerType: "PW1", competencyCategory: "PW", certificateNo: "COMP/PW1/2021/00990", voltageRestriction: "LV", placeRestriction: "Tiada", employedElsewhere: true, currentEmployerName: "Voltcare Services Sdn Bhd" },
  { id: "ok-azman", name: "Azman bin Rahim", mykad: "830909-12-5443", wirerType: "PW1", competencyCategory: "PW", certificateNo: "COMP/PW1/2020/00771", voltageRestriction: "LV", placeRestriction: "Tiada", employedElsewhere: false },
  { id: "ok-vimala", name: "Vimala a/p Krishnan", mykad: "920215-08-5688", wirerType: "PW1", competencyCategory: "PW", certificateNo: "COMP/PW1/2023/00330", voltageRestriction: "LV", placeRestriction: "Tiada", employedElsewhere: false },
  { id: "ok-ganesan", name: "Ganesan a/l Muthu", mykad: "760213-10-5093", wirerType: "PW1", competencyCategory: "PW", certificateNo: "COMP/PW1/2019/00440", voltageRestriction: "LV", placeRestriction: "Tiada", employedElsewhere: false },
  { id: "ok-hafiz", name: "Hafiz bin Kamarudin", mykad: "871130-03-5275", wirerType: "PW6", competencyCategory: "PJ", certificateNo: "COMP/PW6/2022/00155", voltageRestriction: "MV", placeRestriction: "Lombong", employedElsewhere: false },
];

export function okById(id: string | null | undefined): RegisteredOk | undefined {
  if (!id) return undefined;
  return REGISTERED_OKS.find((o) => o.id === id);
}

export function searchOks(q: string): RegisteredOk[] {
  const term = q.trim().toLowerCase().replace(/-/g, "");
  if (!term) return REGISTERED_OKS;
  return REGISTERED_OKS.filter((o) => {
    const mykad = o.mykad.toLowerCase().replace(/-/g, "");
    return (
      o.name.toLowerCase().includes(term) ||
      mykad.includes(term) ||
      o.wirerType.toLowerCase().includes(term) ||
      o.certificateNo.toLowerCase().includes(term)
    );
  });
}
