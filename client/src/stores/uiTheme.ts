import { ref, watch } from "vue";
import { defineStore } from "pinia";

import type { DisplayLanguage, ThemeColor } from "@/types";

const COLOR_KEY = "admin.theme.color";
const LOCALE_KEY = "admin.display.language";

const THEME_COLORS: ThemeColor[] = ["violet", "blue", "green", "red", "black-white", "grey"];

function isThemeColor(value: string | null): value is ThemeColor {
  return !!value && THEME_COLORS.includes(value as ThemeColor);
}

function isDisplayLanguage(value: string | null): value is DisplayLanguage {
  return value === "bm" || value === "bi";
}

export const useUiThemeStore = defineStore("ui-theme", () => {
  const themeColor = ref<ThemeColor>("violet");
  const locale = ref<DisplayLanguage>("bm");

  function applyToDocument() {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.dataset.themeColor = themeColor.value;
    root.lang = locale.value === "bm" ? "ms" : "en";
    root.classList.remove("dark");
  }

  function persist() {
    if (typeof window === "undefined") return;
    localStorage.setItem(COLOR_KEY, themeColor.value);
    localStorage.setItem(LOCALE_KEY, locale.value);
  }

  function initFromStorage() {
    if (typeof window === "undefined") return;

    const savedColor = localStorage.getItem(COLOR_KEY);
    const savedLocale = localStorage.getItem(LOCALE_KEY);

    if (isThemeColor(savedColor)) themeColor.value = savedColor;
    if (isDisplayLanguage(savedLocale)) locale.value = savedLocale;

    applyToDocument();
  }

  function setThemeColor(color: ThemeColor) {
    themeColor.value = color;
  }

  function setLocale(lang: DisplayLanguage) {
    locale.value = lang;
  }

  watch(themeColor, () => {
    persist();
    applyToDocument();
  }, { immediate: true });

  watch(locale, () => {
    persist();
    applyToDocument();
  }, { immediate: true });

  return {
    themeColor,
    locale,
    initFromStorage,
    setThemeColor,
    setLocale,
  };
});
