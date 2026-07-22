import { ref, watch } from "vue";
import { defineStore } from "pinia";

import type { DisplayLanguage, ThemeColor } from "@/types";

const COLOR_KEY = "admin.theme.color";
const LOCALE_KEY = "admin.display.language";
const FONT_SIZE_KEY = "admin.display.fontSize";
const DARK_MODE_KEY = "admin.display.darkMode";

const THEME_COLORS: ThemeColor[] = ["violet", "blue", "green", "red", "black-white", "grey"];

export type FontSize = "sm" | "md" | "lg";
const FONT_SIZE_PX: Record<FontSize, string> = { sm: "14px", md: "16px", lg: "18px" };

function isThemeColor(value: string | null): value is ThemeColor {
  return !!value && THEME_COLORS.includes(value as ThemeColor);
}

function isDisplayLanguage(value: string | null): value is DisplayLanguage {
  return value === "bm" || value === "bi";
}

function isFontSize(value: string | null): value is FontSize {
  return value === "sm" || value === "md" || value === "lg";
}

export const useUiThemeStore = defineStore("ui-theme", () => {
  const themeColor = ref<ThemeColor>("violet");
  const locale = ref<DisplayLanguage>("bm");
  const fontSize = ref<FontSize>("md");
  const darkMode = ref(false);

  function applyToDocument() {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.dataset.themeColor = themeColor.value;
    root.lang = locale.value === "bm" ? "ms" : "en";
    root.style.fontSize = FONT_SIZE_PX[fontSize.value];
    root.classList.toggle("dark", darkMode.value);
  }

  function persist() {
    if (typeof window === "undefined") return;
    localStorage.setItem(COLOR_KEY, themeColor.value);
    localStorage.setItem(LOCALE_KEY, locale.value);
    localStorage.setItem(FONT_SIZE_KEY, fontSize.value);
    localStorage.setItem(DARK_MODE_KEY, darkMode.value ? "1" : "0");
  }

  function initFromStorage() {
    if (typeof window === "undefined") return;

    const savedColor = localStorage.getItem(COLOR_KEY);
    const savedLocale = localStorage.getItem(LOCALE_KEY);
    const savedFontSize = localStorage.getItem(FONT_SIZE_KEY);
    const savedDarkMode = localStorage.getItem(DARK_MODE_KEY);

    if (isThemeColor(savedColor)) themeColor.value = savedColor;
    if (isDisplayLanguage(savedLocale)) locale.value = savedLocale;
    if (isFontSize(savedFontSize)) fontSize.value = savedFontSize;
    if (savedDarkMode === "1") darkMode.value = true;

    applyToDocument();
  }

  function setThemeColor(color: ThemeColor) {
    themeColor.value = color;
  }

  function setLocale(lang: DisplayLanguage) {
    locale.value = lang;
  }

  function setFontSize(size: FontSize) {
    fontSize.value = size;
  }

  function toggleDarkMode() {
    darkMode.value = !darkMode.value;
  }

  watch(themeColor, () => {
    persist();
    applyToDocument();
  }, { immediate: true });

  watch(locale, () => {
    persist();
    applyToDocument();
  }, { immediate: true });

  watch(fontSize, () => {
    persist();
    applyToDocument();
  }, { immediate: true });

  watch(darkMode, () => {
    persist();
    applyToDocument();
  }, { immediate: true });

  return {
    themeColor,
    locale,
    fontSize,
    darkMode,
    initFromStorage,
    setThemeColor,
    setLocale,
    setFontSize,
    toggleDarkMode,
  };
});
