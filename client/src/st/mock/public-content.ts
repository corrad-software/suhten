import type { Component } from "vue";
import {
  FileCheck2,
  CreditCard,
  ShieldCheck,
  BadgeCheck,
  UserPlus,
  Clock,
  Users,
  FileText,
  Building2,
  Scale,
  Recycle,
  Award,
  Handshake,
} from "lucide-vue-next";

// Static Bahasa Malaysia / English content for the ST public portal.
// Content adapted from the official Suruhanjaya Tenaga site (www.st.gov.my).
// Frontend-only prototype content — not CMS-driven.

/** Bilingual string. */
export interface L {
  bm: string;
  bi: string;
}

/** Official ST corporate slogan (www.st.gov.my). */
export const SLOGAN: L = {
  bm: "Tenaga Boleh Harap. Akses Saksama. Perlindungan Pengguna.",
  bi: "Reliable Energy. Fair Access. Consumer Protection.",
};

export const HERO: {
  badge: L;
  title: L;
  subtitle: L;
  ctaPrimary: L;
  ctaSecondary: L;
} = {
  badge: { bm: "Portal Rasmi Suruhanjaya Tenaga", bi: "Official Energy Commission Portal" },
  title: {
    bm: "Sistem Digital Suruhanjaya Tenaga",
    bi: "Energy Commission Digital System",
  },
  subtitle: {
    bm: "Selama 25 tahun, Suruhanjaya Tenaga menerajui landskap tenaga Malaysia — memastikan bekalan elektrik dan gas dikawal selia dengan integriti, keselamatan dan akauntabiliti. Mohon pendaftaran Orang Kompeten dan Kontraktor Elektrik secara dalam talian.",
    bi: "For 25 years, the Energy Commission has stood at the centre of Malaysia's energy landscape — regulating electricity and gas with integrity, safety and accountability. Apply for Competent Person and Electrical Contractor registration online.",
  },
  ctaPrimary: { bm: "Log Masuk / Mohon", bi: "Log In / Apply" },
  ctaSecondary: { bm: "Semak Status Permohonan", bi: "Check Application Status" },
};

// ── ST regulatory pillars (mirrors the five service cards on www.st.gov.my) ──
export interface Pillar {
  icon: Component;
  title: L;
  desc: L;
}

export const PILLARS: Pillar[] = [
  {
    icon: ShieldCheck,
    title: { bm: "Perkhidmatan Kawal Selia", bi: "Regulatory Services" },
    desc: {
      bm: "Panduan permohonan lesen dan perakuan, prosedur pematuhan serta khidmat nasihat perundangan.",
      bi: "Guidance on licence and certificate applications, compliance procedures and legal advisory support.",
    },
  },
  {
    icon: Scale,
    title: { bm: "Penetapan Harga Telus", bi: "Transparent Pricing" },
    desc: {
      bm: "Memastikan harga rangkaian dan pengguna yang telus melalui kawal selia pasaran yang saksama dan akauntabel.",
      bi: "Ensuring transparent network and consumer prices through fair, accountable market regulation.",
    },
  },
  {
    icon: Recycle,
    title: { bm: "Kawal Selia Pasaran & Peralihan Tenaga", bi: "Market Regulation & Energy Transition" },
    desc: {
      bm: "Memperkukuh keupayaan industri melalui standard dan inovasi untuk daya saing negara dan kecemerlangan kawal selia.",
      bi: "Strengthening industry capability through standards and innovation for national competitiveness and regulatory excellence.",
    },
  },
  {
    icon: Award,
    title: { bm: "Kecemerlangan Industri", bi: "Industry Excellence" },
    desc: {
      bm: "Memacu tenaga bertanggungjawab untuk Malaysia berdaya tahan yang melindungi komuniti dan generasi akan datang.",
      bi: "Driving responsible energy for a resilient Malaysia that safeguards communities and future generations.",
    },
  },
  {
    icon: Handshake,
    title: { bm: "Kerjasama Strategik & Serantau", bi: "Strategic Collaboration & Regional Cooperation" },
    desc: {
      bm: "Memacu kerjasama pihak berkepentingan dan mengukuhkan konektiviti ASEAN untuk pasaran tenaga berdaya tahan.",
      bi: "Driving stakeholder collaboration and strengthening ASEAN connectivity for resilient energy markets.",
    },
  },
];

export interface HowStep {
  icon: Component;
  title: L;
  desc: L;
}

/** "Cara Permohonan" — the D11 end-to-end applicant journey. */
export const HOW_IT_WORKS: HowStep[] = [
  {
    icon: UserPlus,
    title: { bm: "Log Masuk & Pilih Perkhidmatan", bi: "Log In & Choose Service" },
    desc: {
      bm: "Log masuk dan pilih pendaftaran Orang Kompeten atau Kontraktor Elektrik.",
      bi: "Log in and select Competent Person or Electrical Contractor registration.",
    },
  },
  {
    icon: FileText,
    title: { bm: "Isi Borang & Muat Naik Dokumen", bi: "Fill Form & Upload Documents" },
    desc: {
      bm: "Lengkapkan borang, pilih kekompetenan dan muat naik dokumen sokongan (PDF).",
      bi: "Complete the form, choose competency and upload supporting documents (PDF).",
    },
  },
  {
    icon: CreditCard,
    title: { bm: "Bayar Fi melalui FPX", bi: "Pay Fee via FPX" },
    desc: {
      bm: "Bayar fi pemprosesan melalui FPX dan terima resit secara automatik.",
      bi: "Pay the processing fee via FPX and receive an automatic receipt.",
    },
  },
  {
    icon: FileCheck2,
    title: { bm: "Semakan ST", bi: "ST Review" },
    desc: {
      bm: "Pegawai SOS dan Teknikal menyemak permohonan mengikut Piagam Pelanggan.",
      bi: "SOS and Technical officers review the application per the Client Charter.",
    },
  },
  {
    icon: ShieldCheck,
    title: { bm: "Kelulusan Digital", bi: "Digital Approval" },
    desc: {
      bm: "Pelulus ST meluluskan permohonan menggunakan Tandatangan Digital.",
      bi: "ST Approver approves the application using a Digital Signature.",
    },
  },
  {
    icon: BadgeCheck,
    title: { bm: "Perakuan Digital", bi: "Digital Certificate" },
    desc: {
      bm: "Muat turun Perakuan Pendaftaran Digital anda terus dari Inbox.",
      bi: "Download your Digital Registration Certificate straight from your Inbox.",
    },
  },
];

export interface Stat {
  icon: Component;
  value: string;
  label: L;
}

export const STATS: Stat[] = [
  { icon: Award, value: "25 Tahun", label: { bm: "Mengawal selia tenaga negara", bi: "Regulating national energy" } },
  { icon: Clock, value: "4 jam", label: { bm: "Sasaran semakan SOS", bi: "SOS review target" } },
  { icon: Users, value: "6+", label: { bm: "Kategori kekompetenan", bi: "Competency categories" } },
  { icon: Building2, value: "A–D", label: { bm: "Kelas kontraktor", bi: "Contractor classes" } },
];

export interface Announcement {
  date: string;
  tag: L;
  title: L;
}

/** Adapted from the ST Newsroom (www.st.gov.my/newsroom). */
export const ANNOUNCEMENTS: Announcement[] = [
  {
    date: "2026-06-29",
    tag: { bm: "Pengumuman", bi: "Announcement" },
    title: {
      bm: "Pengumuman Berkaitan Permohonan Sebagai Juruaudit Tenaga Berdaftar (REA).",
      bi: "Announcement Regarding Applications for Registered Energy Auditor (REA).",
    },
  },
  {
    date: "2026-06-11",
    tag: { bm: "Penguatkuasaan", bi: "Enforcement" },
    title: {
      bm: "Arahan Penguatkuasaan Pelaksanaan Kod Warna Baharu Kabel.",
      bi: "Enforcement Directive on Implementation of the New Cable Colour Code.",
    },
  },
  {
    date: "2026-05-28",
    tag: { bm: "Perundingan", bi: "Consultation" },
    title: {
      bm: "Gas Supply to the Power Sector Post Gas Framework Agreement (GFA).",
      bi: "Gas Supply to the Power Sector Post Gas Framework Agreement (GFA).",
    },
  },
];

export interface Faq {
  q: L;
  a: L;
}

export const FAQ: Faq[] = [
  {
    q: { bm: "Siapa yang boleh memohon pendaftaran Orang Kompeten?", bi: "Who can apply for Competent Person registration?" },
    a: {
      bm: "Individu yang memiliki perakuan kekompetenan aktif dan tiada penggantungan boleh memohon melalui sistem.",
      bi: "Individuals holding an active competency certificate with no suspension may apply through the system.",
    },
  },
  {
    q: { bm: "Apakah kaedah pembayaran yang diterima?", bi: "What payment methods are accepted?" },
    a: {
      bm: "Bayaran boleh dibuat melalui FPX atau permohonan Virtual Account (VA) dalam tempoh 14 hari dari Notis Bayaran.",
      bi: "Payment can be made via FPX or a Virtual Account (VA) request within 14 days of the Payment Notice.",
    },
  },
  {
    q: { bm: "Berapa lama tempoh pemprosesan permohonan?", bi: "How long does processing take?" },
    a: {
      bm: "Setiap peringkat dipantau mengikut Piagam Pelanggan ST — semakan SOS disasarkan dalam 4 jam waktu bekerja.",
      bi: "Each stage is monitored per the ST Client Charter — SOS review is targeted within 4 working hours.",
    },
  },
];

// ── Official ST contact (www.st.gov.my footer) ─────────────────────────────
export const CONTACT = {
  org: { bm: "Suruhanjaya Tenaga", bi: "Energy Commission" },
  address: "No. 12, Jalan Tun Hussein, Presint 2, 62100 Putrajaya, Malaysia",
  tollFree: "1-800-2222-78",
  tel: "(603) 8870 8500",
  fax: "(603) 8888 8637",
};

export interface SocialLink {
  label: string;
  handle: string;
  url: string;
}

export const SOCIAL: SocialLink[] = [
  { label: "Facebook", handle: "SuruhanjayaTenagaHQ", url: "https://www.facebook.com/SuruhanjayaTenagaHQ" },
  { label: "Instagram", handle: "@st_malaysia", url: "https://www.instagram.com/st_malaysia" },
  { label: "YouTube", handle: "@stportal", url: "https://www.youtube.com/@stportal" },
  { label: "LinkedIn", handle: "Suruhanjaya Tenaga", url: "https://www.linkedin.com/company/suruhanjaya-tenaga" },
  { label: "TikTok", handle: "@st_malaysia", url: "https://www.tiktok.com/@st_malaysia" },
  { label: "X", handle: "@st_malaysia", url: "https://x.com/st_malaysia" },
];

// ── Demo dataset for the public "Semak Status" lookup ──────────────────────
export type PublicStatusTone = "review" | "payment" | "approved" | "issued" | "rejected";

export interface PublicStatusRecord {
  code: string;
  applicantName: string;
  service: L;
  statusLabel: L;
  tone: PublicStatusTone;
  submittedAt: string;
  stage: L;
}

export const DEMO_STATUS: PublicStatusRecord[] = [
  {
    code: "ST/OK/2026/00110",
    applicantName: "Ahmad bin Ismail",
    service: { bm: "Pendaftaran Orang Kompeten (Elektrik)", bi: "Competent Person Registration (Electrical)" },
    statusLabel: { bm: "Perakuan Dikeluarkan", bi: "Certificate Issued" },
    tone: "issued",
    submittedAt: "2026-07-02",
    stage: { bm: "Selesai — Perakuan Digital tersedia", bi: "Completed — Digital Certificate available" },
  },
  {
    code: "ST/OK/2026/00104",
    applicantName: "Tan Chee Keong",
    service: { bm: "Pendaftaran Orang Kompeten (Elektrik)", bi: "Competent Person Registration (Electrical)" },
    statusLabel: { bm: "Dalam Semakan SOS", bi: "Under SOS Review" },
    tone: "review",
    submittedAt: "2026-07-11",
    stage: { bm: "Semakan dokumen oleh Seksyen Operasi Perkhidmatan", bi: "Document review by Service Operations Section" },
  },
  {
    code: "ST/CE/2026/00202",
    applicantName: "Syarikat Elektrik Maju Sdn Bhd",
    service: { bm: "Pendaftaran Kontraktor Elektrik (Kelas B)", bi: "Electrical Contractor Registration (Class B)" },
    statusLabel: { bm: "Menunggu Bayaran Pendaftaran", bi: "Awaiting Registration Payment" },
    tone: "payment",
    submittedAt: "2026-07-09",
    stage: { bm: "Notis Bayaran Fi Pendaftaran dikeluarkan", bi: "Registration Fee Payment Notice issued" },
  },
];

export function lookupStatus(code: string): PublicStatusRecord | undefined {
  const q = code.trim().toUpperCase();
  if (!q) return undefined;
  return DEMO_STATUS.find((r) => r.code.toUpperCase() === q);
}
