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
    role: "employer",
    organisation: "Syarikat Elektrik Maju Sdn Bhd",
    title: "Wakil Syarikat / Majikan (Kontraktor)",
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
    id: "p-aisyah",
    name: "Nur Aisyah binti Hassan",
    email: "aisyah.hassan@email.my",
    role: "applicant",
    icNumber: "920814-14-5688",
    title: "Pemohon (Orang Kompeten)",
  },
  {
    id: "p-rizal",
    name: "Rizal bin Hassan",
    email: "rizal.hassan@email.my",
    role: "applicant",
    icNumber: "870404-10-5512",
    title: "Orang Kompeten (Pengesahan Lantikan CE)",
  },
  {
    id: "p-farah",
    name: "Farah binti Karim",
    email: "farah.karim@email.my",
    role: "applicant",
    icNumber: "950318-10-5544",
    title: "Pemohon (Orang Kompeten) — akaun kosong",
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
    id: "p-faizal",
    name: "Ahmad Faizal bin Omar",
    email: "faizal@abcelektrik.com.my",
    role: "employer",
    organisation: "ABC Elektrik Sdn Bhd",
    title: "Wakil Syarikat / Majikan (Kontraktor)",
  },
  {
    id: "p-faridah",
    name: "Faridah binti Hassan",
    email: "faridah.hassan@st.gov.my",
    role: "sos",
    title: "Pegawai SOS — OK Elektrik (1)",
  },
  {
    id: "p-rosli",
    name: "Rosli bin Ahmad",
    email: "rosli.ahmad@st.gov.my",
    role: "sos",
    title: "Pegawai SOS — OK Elektrik (2)",
  },
  {
    id: "p-mariam",
    name: "Mariam binti Salleh",
    email: "mariam.salleh@st.gov.my",
    role: "tp_sos",
    title: "TP SOS — Ketua Seksyen Operasi Perkhidmatan",
  },
  {
    id: "p-halim",
    name: "Halim bin Rahim",
    email: "halim.rahim@st.gov.my",
    role: "sos_ce",
    title: "Pegawai SOS — Kontraktor Elektrik (1)",
  },
  {
    id: "p-siti",
    name: "Siti Aminah binti Yusof",
    email: "siti.aminah@st.gov.my",
    role: "sos_ce",
    title: "Pegawai SOS — Kontraktor Elektrik (2)",
  },
  {
    id: "p-kumar",
    name: "Kumaravel a/l Subramaniam",
    email: "kumaravel@st.gov.my",
    role: "technical",
    title: "Pegawai Teknikal — OK Elektrik (1)",
  },
  {
    id: "p-chong",
    name: "Chong Wei Ming",
    email: "weiming.chong@st.gov.my",
    role: "technical",
    title: "Pegawai Teknikal — OK Elektrik (2)",
  },
  {
    id: "p-priya",
    name: "Priya a/p Nair",
    email: "priya.nair@st.gov.my",
    role: "technical_ce",
    title: "Pegawai Teknikal — Kontraktor Elektrik (1)",
  },
  {
    id: "p-daniel",
    name: "Daniel Lim",
    email: "daniel.lim@st.gov.my",
    role: "technical_ce",
    title: "Pegawai Teknikal — Kontraktor Elektrik (2)",
  },
  {
    id: "p-zainab",
    name: "Ir. Zainab binti Othman",
    email: "zainab.othman@st.gov.my",
    role: "approver",
    title: "Pelulus / Timbalan Pengarah",
  },
  {
    id: "p-noraini",
    name: "Datin Noraini binti Yusof",
    email: "noraini@kkr.gov.my",
    role: "committee",
    title: "Ahli Jawatankuasa (Kementerian)",
  },
  {
    id: "p-hafiz",
    name: "Hafiz bin Kamal",
    email: "hafiz.kamal@st.gov.my",
    role: "admin",
    title: "Pentadbir Sistem",
  },
];

export const ROLE_LABEL: Record<PersonaRole, string> = {
  applicant: "Pemohon",
  employer: "Majikan",
  sos: "Pegawai SOS (OK Elektrik)",
  sos_ce: "Pegawai SOS (Kontraktor Elektrik)",
  tp_sos: "TP SOS",
  technical: "Pegawai Teknikal (OK Elektrik)",
  technical_ce: "Pegawai Teknikal (Kontraktor Elektrik)",
  approver: "Pelulus",
  committee: "Ahli Jawatankuasa",
  admin: "Pentadbir Sistem",
};

/** SRS Kakitangan portal — Officer, Staff (all back-office), Admin tiers. */
export const ROLE_TIER_LABEL: Partial<Record<PersonaRole, string>> = {
  sos: "Pegawai",
  sos_ce: "Pegawai",
  tp_sos: "Pegawai",
  technical: "Pegawai",
  technical_ce: "Pegawai",
  approver: "Pegawai",
  committee: "Pegawai",
  admin: "Pentadbir",
};

export function personaById(id: string | null | undefined): Persona | undefined {
  if (!id) return undefined;
  return PERSONAS.find((p) => p.id === id);
}
