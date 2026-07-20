/** Structured Malaysian address used by every ST address entry form. */
export interface StAddress {
  line1: string;
  line2: string;
  district: string; // Daerah
  postcode: string; // Poskod
  state: string; // Negeri
}

/** Negeri & Wilayah Persekutuan Malaysia. */
export const MALAYSIAN_STATES: string[] = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Perak",
  "Perlis",
  "Pulau Pinang",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
  "W.P. Kuala Lumpur",
  "W.P. Labuan",
  "W.P. Putrajaya",
];

export function emptyAddress(): StAddress {
  return { line1: "", line2: "", district: "", postcode: "", state: "" };
}

/** Poskod Malaysia: exactly 5 digits. */
export function isValidPostcode(postcode: string): boolean {
  return /^\d{5}$/.test(postcode.trim());
}

/** Line 2 is optional; the rest are required. */
export function isAddressComplete(a: StAddress): boolean {
  return (
    a.line1.trim().length > 0 &&
    a.district.trim().length > 0 &&
    a.state.trim().length > 0 &&
    isValidPostcode(a.postcode)
  );
}

/** Flatten to the single-line form the stored model / API expects. */
export function formatAddress(a: StAddress): string {
  const street = [a.line1, a.line2].map((s) => s.trim()).filter(Boolean).join(", ");
  const locality = [a.postcode.trim(), a.district.trim()].filter(Boolean).join(" ");
  return [street, locality, a.state.trim()].filter(Boolean).join(", ");
}

/**
 * Best-effort parse of a legacy one-line address back into fields, so existing
 * seeded/profile data still populates the structured form.
 * Expected shape: "<street...>, <poskod> <daerah>, <negeri>"
 */
export function parseAddress(value: string): StAddress {
  const a = emptyAddress();
  if (!value?.trim()) return a;

  const parts = value.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return a;

  // Last part is the state when it matches a known state.
  const last = parts[parts.length - 1];
  if (MALAYSIAN_STATES.some((s) => s.toLowerCase() === last.toLowerCase())) {
    a.state = MALAYSIAN_STATES.find((s) => s.toLowerCase() === last.toLowerCase()) ?? "";
    parts.pop();
  }

  // Then "<poskod> <daerah>".
  const localityIdx = parts.findIndex((p) => /^\d{5}\s+/.test(p));
  if (localityIdx >= 0) {
    const m = parts[localityIdx].match(/^(\d{5})\s+(.*)$/);
    if (m) {
      a.postcode = m[1];
      a.district = m[2];
    }
    parts.splice(localityIdx, 1);
  }

  a.line1 = parts.shift() ?? "";
  a.line2 = parts.join(", ");
  return a;
}
