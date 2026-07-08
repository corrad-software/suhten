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
  linkedPersonaId?: string;
}

export const REGISTERED_OKS: RegisteredOk[] = [
  { id: "ok-ahmad", name: "Ahmad bin Ismail", mykad: "840512-10-5523", wirerType: "PW4", competencyCategory: "PW", linkedPersonaId: "p-ahmad" },
  { id: "ok-tan", name: "Tan Chee Keong", mykad: "790238-08-6191", wirerType: "PW3", competencyCategory: "PW", linkedPersonaId: "p-tan" },
  { id: "ok-suresh", name: "Suresh a/l Maniam", mykad: "880101-14-5099", wirerType: "PW3", competencyCategory: "PW" },
  { id: "ok-faizal", name: "Mohd Faizal bin Yusof", mykad: "910722-05-5331", wirerType: "PW2", competencyCategory: "PW" },
  { id: "ok-chong", name: "Chong Wei Liang", mykad: "860318-07-5217", wirerType: "PW1", competencyCategory: "PW" },
  { id: "ok-azman", name: "Azman bin Rahim", mykad: "830909-12-5443", wirerType: "PW1", competencyCategory: "PW" },
  { id: "ok-vimala", name: "Vimala a/p Krishnan", mykad: "920215-08-5688", wirerType: "PW1", competencyCategory: "PW" },
  { id: "ok-hafiz", name: "Hafiz bin Kamarudin", mykad: "871130-03-5275", wirerType: "PW6", competencyCategory: "PJ" },
];

export function okById(id: string | null | undefined): RegisteredOk | undefined {
  if (!id) return undefined;
  return REGISTERED_OKS.find((o) => o.id === id);
}

export function searchOks(q: string): RegisteredOk[] {
  const term = q.trim().toLowerCase();
  if (!term) return REGISTERED_OKS;
  return REGISTERED_OKS.filter(
    (o) => o.name.toLowerCase().includes(term) || o.mykad.toLowerCase().includes(term) || o.wirerType.toLowerCase().includes(term),
  );
}
