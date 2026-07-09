import type { DisplayLanguage } from "@/types";

export type MessageKey =
  | "theme.settings"
  | "theme.color"
  | "theme.language"
  | "theme.compactSidebar"
  | "theme.lang.bm"
  | "theme.lang.bi"
  | "header.notifications"
  | "header.logout"
  | "header.chat"
  | "login.title"
  | "login.subtitle"
  | "login.email"
  | "login.password"
  | "login.emailPlaceholder"
  | "login.passwordPlaceholder"
  | "login.continue"
  | "login.signingIn"
  | "login.failed"
  | "st.login.subtitle"
  | "st.login.unauthorized"
  | "comingSoon.title"
  | "comingSoon.heading"
  | "comingSoon.body"
  | "phase.2";

const BM: Record<MessageKey, string> = {
  "theme.settings": "Tetapan Tema",
  "theme.color": "Warna Tema",
  "theme.language": "Bahasa Paparan",
  "theme.compactSidebar": "Bar sisi padat",
  "theme.lang.bm": "BM",
  "theme.lang.bi": "BI",
  "header.notifications": "Notifikasi",
  "header.logout": "Log keluar",
  "header.chat": "Sembang",
  "login.title": "Log masuk ke akaun anda",
  "login.subtitle": "Papan Pemuka",
  "login.email": "E-mel",
  "login.password": "Kata Laluan",
  "login.emailPlaceholder": "anda@contoh.com",
  "login.passwordPlaceholder": "Masukkan kata laluan",
  "login.continue": "Teruskan",
  "login.signingIn": "Sedang log masuk...",
  "login.failed": "Log masuk gagal",
  "st.login.subtitle": "Sistem Digital ST",
  "st.login.unauthorized": "Akaun ini tidak dibenarkan untuk Sistem Digital ST.",
  "comingSoon.title": "Dalam Pembangunan",
  "comingSoon.heading": "Halaman Dalam Pembangunan",
  "comingSoon.body": "Menu dan struktur navigasi Fasa 1 telah ditetapkan. Kandungan halaman akan diisi pada Fasa 2.",
  "phase.2": "Fasa 2",
};

const BI: Record<MessageKey, string> = {
  "theme.settings": "Theme Settings",
  "theme.color": "Theme Color",
  "theme.language": "Display Language",
  "theme.compactSidebar": "Compact sidebar",
  "theme.lang.bm": "BM",
  "theme.lang.bi": "BI",
  "header.notifications": "Notifications",
  "header.logout": "Logout",
  "header.chat": "Chat",
  "login.title": "Sign in to your account",
  "login.subtitle": "Dashboard",
  "login.email": "Email",
  "login.password": "Password",
  "login.emailPlaceholder": "you@example.com",
  "login.passwordPlaceholder": "Enter your password",
  "login.continue": "Continue",
  "login.signingIn": "Signing in...",
  "login.failed": "Login failed",
  "st.login.subtitle": "ST Digital System",
  "st.login.unauthorized": "This account is not authorized for the ST Digital System.",
  "comingSoon.title": "Under Development",
  "comingSoon.heading": "Page Under Development",
  "comingSoon.body": "Phase 1 menu and navigation structure is in place. Page content will be added in Phase 2.",
  "phase.2": "Phase 2",
};

export const messages: Record<DisplayLanguage, Record<MessageKey, string>> = { bm: BM, bi: BI };

export function translate(key: MessageKey, locale: DisplayLanguage): string {
  return messages[locale][key] ?? messages.bi[key] ?? key;
}
