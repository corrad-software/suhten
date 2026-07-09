import { computed } from "vue";

import { translate, type MessageKey } from "@/i18n/messages";
import { translateSt, type StMessageKey } from "@/i18n/st-messages";
import { MENU_LABELS } from "@/i18n/menu-labels";
import { useUiThemeStore } from "@/stores/uiTheme";
import type { DisplayLanguage } from "@/types";

export function useLocale() {
  const uiTheme = useUiThemeStore();

  const locale = computed(() => uiTheme.locale);

  function t(key: MessageKey): string {
    return translate(key, uiTheme.locale);
  }

  /** ST portal / prototype strings (BM/BI). Supports `{n}` style placeholders. */
  function ts(key: StMessageKey, vars?: Record<string, string | number>): string {
    return translateSt(key, uiTheme.locale, vars);
  }

  function ml(id: string, fallback: string): string {
    const loc: DisplayLanguage = uiTheme.locale;
    if (MENU_LABELS[id]?.[loc]) return MENU_LABELS[id][loc];
    const prefixed = `st-${id}`;
    if (MENU_LABELS[prefixed]?.[loc]) return MENU_LABELS[prefixed][loc];
    return fallback;
  }

  function setLocale(lang: DisplayLanguage) {
    uiTheme.setLocale(lang);
  }

  return { locale, t, ts, ml, setLocale };
}
