import type { EmployerRef } from "../types";

// Employers selectable via the "intelligent search" in the application form.
// confirmerPersonaId points at the persona who must confirm the appointment.
export const EMPLOYERS: EmployerRef[] = [
  {
    id: "emp-tenaga-murni",
    name: "Tenaga Murni Sdn Bhd",
    registrationNo: "200801012345 (812345-A)",
    address: "No. 12, Jalan Perindustrian 4, 40000 Shah Alam, Selangor",
    contactPerson: "Rahman bin Abdullah",
    confirmerPersonaId: "p-rahman",
  },
  {
    id: "emp-elektrik-maju",
    name: "Syarikat Elektrik Maju Sdn Bhd",
    registrationNo: "201101023456 (945678-K)",
    address: "Lot 8, Jalan Teknologi 3/5, 47810 Petaling Jaya, Selangor",
    contactPerson: "Lim Wei Sheng",
    confirmerPersonaId: "p-lim",
  },
  {
    id: "emp-kuasa-bistari",
    name: "Kuasa Bistari Engineering Sdn Bhd",
    registrationNo: "201501034567 (1134567-P)",
    address: "No. 5, Persiaran Bukit, 81100 Johor Bahru, Johor",
    contactPerson: "Goh Mei Ling",
    confirmerPersonaId: "p-rahman",
  },
];

export function employerById(id: string | null | undefined): EmployerRef | undefined {
  if (!id) return undefined;
  return EMPLOYERS.find((e) => e.id === id);
}
