/** POC dummy document kinds shown when staff click "Lihat" on supporting docs. */
export type DummyDocKind =
  | "mykad"
  | "competency"
  | "passport_photo"
  | "employment_letter"
  | "osh"
  | "ssm"
  | "borang49"
  | "ok_appointment"
  | "premises"
  | "equipment"
  | "epf_socso"
  | "generic";

export type DummyDocMeta = {
  kind: DummyDocKind;
  titleBm: string;
  titleBi: string;
  badge: string;
};

/** Map uploaded doc label / filename to a POC preview kind. */
export function resolveDummyDocKind(label: string, fileName?: string): DummyDocKind {
  const hay = `${label} ${fileName ?? ""}`.toLowerCase();

  if (/mykad|kad pengenalan|ic\b|nric/.test(hay)) return "mykad";
  if (/kekompetenan|competenc|sijil komp|comp[_ ]?cert|perakuan kekompetenan/.test(hay)) return "competency";
  if (/premis|premise|foto premis/.test(hay)) return "premises";
  if (/pasport|passport|gambar berukuran|gambar pasport|passport.?photo/.test(hay)) return "passport_photo";
  if (/gambar|photograph|\bphoto\b/.test(hay)) return "passport_photo";
  if (/tawaran|employment|sokongan majikan|offer letter/.test(hay)) return "employment_letter";
  if (/\bosh\b|perubatan|medical/.test(hay)) return "osh";
  if (/ssm|borang\s*9|pendaftaran syarikat|annual return|perakuan pendaftaran/.test(hay)) return "ssm";
  if (/borang\s*49|pengarah|director/.test(hay)) return "borang49";
  if (/lantikan|appointment|orang kompeten/.test(hay)) return "ok_appointment";
  if (/peralatan|equipment|menguji/.test(hay)) return "equipment";
  if (/kwsp|epf|perkeso|socso|penyata/.test(hay)) return "epf_socso";

  return "generic";
}

export function dummyDocMeta(kind: DummyDocKind): DummyDocMeta {
  const map: Record<DummyDocKind, DummyDocMeta> = {
    mykad: { kind, titleBm: "Dummy MyKad", titleBi: "Dummy MyKad", badge: "MYKAD" },
    competency: {
      kind,
      titleBm: "Dummy Sijil Kekompetenan",
      titleBi: "Dummy Competency Certificate",
      badge: "COMP",
    },
    passport_photo: {
      kind,
      titleBm: "Dummy Gambar Pasport",
      titleBi: "Dummy Passport Photo",
      badge: "PHOTO",
    },
    employment_letter: {
      kind,
      titleBm: "Dummy Surat Tawaran Pekerjaan",
      titleBi: "Dummy Employment Offer Letter",
      badge: "LETTER",
    },
    osh: { kind, titleBm: "Dummy Laporan OSH", titleBi: "Dummy OSH Report", badge: "OSH" },
    ssm: { kind, titleBm: "Dummy SSM / Borang 9", titleBi: "Dummy SSM / Form 9", badge: "SSM" },
    borang49: { kind, titleBm: "Dummy Borang 49", titleBi: "Dummy Form 49", badge: "B49" },
    ok_appointment: {
      kind,
      titleBm: "Dummy Surat Lantikan OK",
      titleBi: "Dummy OK Appointment Letter",
      badge: "OK",
    },
    premises: {
      kind,
      titleBm: "Dummy Foto Premis",
      titleBi: "Dummy Premises Photo",
      badge: "PHOTO",
    },
    equipment: {
      kind,
      titleBm: "Dummy Senarai Peralatan",
      titleBi: "Dummy Equipment List",
      badge: "LIST",
    },
    epf_socso: {
      kind,
      titleBm: "Dummy Penyata KWSP / PERKESO",
      titleBi: "Dummy EPF / SOCSO Statement",
      badge: "STAT",
    },
    generic: {
      kind,
      titleBm: "Dummy Dokumen Sokongan",
      titleBi: "Dummy Supporting Document",
      badge: "PDF",
    },
  };
  return map[kind];
}
