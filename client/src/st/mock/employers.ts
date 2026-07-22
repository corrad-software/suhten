import type { EmployerCategory, EmployerRef } from "../types";
import { fuzzySearch } from "../search";

// Employers selectable via the "elastic" search in the application form
// (D11 §4.2.2). confirmerPersonaId points at the persona who must confirm the
// appointment. Login-linked confirmers: Tenaga Murni (p-rahman), Elektrik Maju
// (p-lim), ABC Elektrik (p-faizal). All others use non-login placeholders.
export const EMPLOYERS: EmployerRef[] = [
  {
    id: "emp-tenaga-murni",
    name: "Tenaga Murni Sdn Bhd",
    registrationNo: "200801012345 (812345-A)",
    stRegNo: "ST-KE-A-00812",
    category: "kontraktor",
    address: "No. 12, Jalan Perindustrian 4, 40000 Shah Alam, Selangor",
    city: "Shah Alam",
    state: "Selangor",
    contactPerson: "Rahman bin Abdullah",
    confirmerPersonaId: "p-rahman",
    phone: "03-5511 2233",
    email: "hr@tenagamurni.com.my",
    location: { lat: 3.0733, lng: 101.5185 },
    status: "active",
  },
  {
    id: "emp-elektrik-maju",
    name: "Syarikat Elektrik Maju Sdn Bhd",
    registrationNo: "201101023456 (945678-K)",
    stRegNo: "ST-CE-B-00945",
    category: "kontraktor",
    address: "Lot 8, Jalan Teknologi 3/5, 47810 Petaling Jaya, Selangor",
    city: "Petaling Jaya",
    state: "Selangor",
    contactPerson: "Lim Wei Sheng",
    confirmerPersonaId: "p-lim",
    phone: "03-7788 4455",
    email: "info@elektrikmaju.com.my",
    location: { lat: 3.1073, lng: 101.6067 },
    status: "active",
  },
  {
    id: "emp-kuasa-bistari",
    name: "Kuasa Bistari Engineering Sdn Bhd",
    registrationNo: "201501034567 (1134567-P)",
    stRegNo: "ST-CE-C-01134",
    category: "kontraktor",
    address: "No. 5, Persiaran Bukit, 81100 Johor Bahru, Johor",
    city: "Johor Bahru",
    state: "Johor",
    contactPerson: "Goh Mei Ling",
    confirmerPersonaId: "p-goh",
    phone: "07-2233 6677",
    email: "admin@kuasabistari.com.my",
    location: { lat: 1.4927, lng: 103.7414 },
    status: "active",
  },
  {
    id: "emp-abc-elektrik",
    name: "ABC Elektrik Sdn Bhd",
    registrationNo: "201901089012 (1289012-H)",
    stRegNo: "ST-CE-B-01289",
    category: "kontraktor",
    address: "No. 18, Jalan Industri USJ 1, 47600 Subang Jaya, Selangor",
    city: "Subang Jaya",
    state: "Selangor",
    contactPerson: "Ahmad Faizal bin Omar",
    confirmerPersonaId: "p-faizal",
    phone: "03-8023 1188",
    email: "info@abcelektrik.com.my",
    location: { lat: 3.0642, lng: 101.5851 },
    status: "active",
  },
  // ── Pool for a convincing "elastic" search (not login-linked) ──
  {
    id: "emp-jana-letrik",
    name: "Jana Letrik Sdn Bhd",
    registrationNo: "201801045678 (1245678-T)",
    stRegNo: "ST-CE-A-01245",
    category: "kontraktor",
    address: "No. 22, Jalan Perusahaan 2, 68100 Batu Caves, Selangor",
    city: "Batu Caves",
    state: "Selangor",
    contactPerson: "Tan Boon Huat",
    confirmerPersonaId: "p-ext-jana",
    status: "active",
  },
  {
    id: "emp-voltan-prima",
    name: "Voltan Prima Elektrik Sdn Bhd",
    registrationNo: "201203056789 (1056789-M)",
    stRegNo: "ST-CE-B-01056",
    category: "kontraktor",
    address: "12, Lorong IKS, 09000 Kulim, Kedah",
    city: "Kulim",
    state: "Kedah",
    contactPerson: "Nurul Huda binti Aziz",
    confirmerPersonaId: "p-ext-voltan",
    status: "active",
  },
  {
    id: "emp-arus-teguh",
    name: "Arus Teguh Kejuruteraan Sdn Bhd",
    registrationNo: "200901067890 (867890-W)",
    stRegNo: "ST-CE-A-00867",
    category: "kontraktor",
    address: "Lot 44, Kawasan Perindustrian Prai, 13600 Perai, Pulau Pinang",
    city: "Perai",
    state: "Pulau Pinang",
    contactPerson: "K. Anbarasu",
    confirmerPersonaId: "p-ext-arus",
    status: "active",
  },
  {
    id: "emp-suria-kuasa",
    name: "Suria Kuasa Sdn Bhd",
    registrationNo: "201605078901 (1178901-D)",
    stRegNo: "ST-CE-C-01178",
    category: "pepasangan",
    address: "8, Jalan Cempaka, 70200 Seremban, Negeri Sembilan",
    city: "Seremban",
    state: "Negeri Sembilan",
    contactPerson: "Faridah binti Omar",
    confirmerPersonaId: "p-ext-suria",
    status: "active",
  },
  {
    id: "emp-daya-elektrik",
    name: "Daya Elektrik Kontraktor Sdn Bhd",
    registrationNo: "201007089012 (889012-U)",
    stRegNo: "ST-CE-B-00889",
    category: "kontraktor",
    address: "3A, Jalan Bandar, 25000 Kuantan, Pahang",
    city: "Kuantan",
    state: "Pahang",
    contactPerson: "Mohd Redza bin Ali",
    confirmerPersonaId: "p-ext-daya",
    status: "active",
  },
  {
    id: "emp-mega-watt",
    name: "Mega Watt Engineering Sdn Bhd",
    registrationNo: "201909090123 (1390123-X)",
    stRegNo: "ST-CE-A-01390",
    category: "kontraktor",
    address: "No. 17, Jalan Utama, 93350 Kuching, Sarawak",
    city: "Kuching",
    state: "Sarawak",
    contactPerson: "Sylvester Anak Jugah",
    confirmerPersonaId: "p-ext-mega",
    status: "active",
  },
  {
    id: "emp-institut-tenaga",
    name: "Institut Latihan Tenaga Negara",
    registrationNo: "—",
    stRegNo: "ST-IN-00021",
    category: "institusi",
    address: "Persiaran ILSAS, 43000 Kajang, Selangor",
    city: "Kajang",
    state: "Selangor",
    contactPerson: "Dr. Halim bin Yusof",
    confirmerPersonaId: "p-ext-institut",
    status: "active",
  },
  {
    id: "emp-lestari-power",
    name: "Lestari Power Systems Sdn Bhd",
    registrationNo: "202001101234 (1401234-V)",
    stRegNo: "ST-CE-C-01401",
    category: "kontraktor",
    // Inactive — must be excluded by the ACTIVE-only filter.
    address: "5, Jalan Industri, 75450 Ayer Keroh, Melaka",
    city: "Ayer Keroh",
    state: "Melaka",
    contactPerson: "Chong Kah Wai",
    confirmerPersonaId: "p-ext-lestari",
    status: "inactive",
  },
  {
    id: "emp-gemilang-volt",
    name: "Gemilang Volt Sdn Bhd",
    registrationNo: "201704112345 (1212345-B)",
    stRegNo: "ST-CE-B-01212",
    category: "kontraktor",
    address: "No. 9, Jalan Sultan, 05100 Alor Setar, Kedah",
    city: "Alor Setar",
    state: "Kedah",
    contactPerson: "Zulkifli bin Hassan",
    confirmerPersonaId: "p-ext-gemilang",
    status: "active",
  },
];

export const EMPLOYER_CATEGORY_LABEL: Record<EmployerCategory, string> = {
  kontraktor: "Kontraktor",
  pepasangan: "Pepasangan",
  pelesenan: "Pelesenan",
  institusi: "Institusi",
  individu: "Individu",
  lain: "Lain-Lain",
};

export function employerById(id: string | null | undefined): EmployerRef | undefined {
  if (!id) return undefined;
  return EMPLOYERS.find((e) => e.id === id);
}

export interface EmployerHit {
  employer: EmployerRef;
  matchedField: string;
}

/**
 * "Elastic" employer search (D11 §4.2.2): fuzzy, multi-field, relevance-ranked,
 * ACTIVE registrations only. Matches on name, SSM no., ST reg no., contact,
 * city and state. Empty query lists all active employers.
 */
export function searchEmployers(query: string, category?: EmployerCategory): EmployerHit[] {
  let pool = EMPLOYERS.filter((e) => e.status !== "inactive");
  if (category) pool = pool.filter((e) => e.category === category);

  return fuzzySearch(
    pool,
    query,
    [
      { get: (e) => e.name, label: "Nama Syarikat", weight: 1 },
      { get: (e) => e.registrationNo, label: "No. Pendaftaran Syarikat", weight: 0.95 },
      { get: (e) => e.stRegNo, label: "No. Pendaftaran ST", weight: 0.95 },
      { get: (e) => e.contactPerson, label: "Orang Hubungan", weight: 0.85 },
      { get: (e) => e.city, label: "Bandar", weight: 0.8 },
      { get: (e) => e.state, label: "Negeri", weight: 0.75 },
    ],
    { limit: 8, threshold: 22 },
  ).map((h) => ({ employer: h.item, matchedField: h.matchedField }));
}
