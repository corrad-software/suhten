import type { Persona, PersonaRole } from "../types";

// Shared demo password shown on the login screen for easy presenting.
export const DEMO_PASSWORD = "demo1234";

export const PERSONAS: Persona[] = [
  {
    id: "p-ahmad",
    name: "Ahmad bin Ismail",
    email: "ahmad.ismail@email.my",
    role: "applicant",
    icNumber: "840512-10-5523",
    title: "Pemohon (Orang Kompeten)",
  },
  {
    id: "p-lim",
    name: "Lim Wei Sheng",
    email: "weisheng@elektrikmaju.com.my",
    role: "applicant",
    organisation: "Syarikat Elektrik Maju Sdn Bhd",
    title: "Wakil Syarikat (Kontraktor)",
  },
  {
    id: "p-tan",
    name: "Tan Chee Keong",
    email: "ck.tan@email.my",
    role: "applicant",
    icNumber: "790238-08-6191",
    title: "Orang Kompeten (Penyenggara)",
  },
  {
    id: "p-rahman",
    name: "Rahman bin Abdullah",
    email: "rahman@tenagamurni.com.my",
    role: "employer",
    organisation: "Tenaga Murni Sdn Bhd",
    title: "Pengurus Sumber Manusia (Majikan)",
  },
  {
    id: "p-faridah",
    name: "Faridah binti Hassan",
    email: "faridah.hassan@st.gov.my",
    role: "sos",
    title: "Pegawai Seksyen Operasi Perkhidmatan (SOS)",
  },
  {
    id: "p-kumar",
    name: "Kumaravel a/l Subramaniam",
    email: "kumaravel@st.gov.my",
    role: "technical",
    title: "Pegawai Teknikal",
  },
  {
    id: "p-zainab",
    name: "Ir. Zainab binti Othman",
    email: "zainab.othman@st.gov.my",
    role: "approver",
    title: "Pelulus / Timbalan Pengarah",
  },
];

export const ROLE_LABEL: Record<PersonaRole, string> = {
  applicant: "Pemohon",
  employer: "Majikan",
  sos: "Pegawai SOS",
  technical: "Pegawai Teknikal",
  approver: "Pelulus",
};

export function personaById(id: string | null | undefined): Persona | undefined {
  if (!id) return undefined;
  return PERSONAS.find((p) => p.id === id);
}
