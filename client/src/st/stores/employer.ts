import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";

import type { EmployerRef } from "../types";
import { EMPLOYERS } from "../mock/employers";
import { useStSessionStore } from "./session";

const STORAGE_KEY = "st.employers.v2";

/**
 * Employer profiles (Kemaskini Maklumat Majikan).
 * Prototype: seeded from mock/employers.ts and persisted to localStorage.
 */
export const useStEmployerStore = defineStore("st-employer", () => {
  const employers = ref<EmployerRef[]>(structuredClone(EMPLOYERS));

  function init() {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as EmployerRef[];
      // Merge saved edits over the seed so new seed fields still appear.
      employers.value = EMPLOYERS.map((seed) => {
        const s = saved.find((e) => e.id === seed.id);
        return s ? { ...seed, ...s } : structuredClone(seed);
      });
    } catch {
      /* ignore corrupt drafts */
    }
  }

  watch(
    employers,
    (v) => {
      if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
    },
    { deep: true },
  );

  function byId(id: string | null | undefined): EmployerRef | undefined {
    if (!id) return undefined;
    return employers.value.find((e) => e.id === id);
  }

  /**
   * The employer company the signed-in persona maintains.
   * Prefer the company matching persona `organisation`, else the first they confirm for.
   */
  const myEmployer = computed<EmployerRef | undefined>(() => {
    const session = useStSessionStore();
    const personaId = session.currentPersonaId;
    if (!personaId) return undefined;
    const mine = employers.value.filter((e) => e.confirmerPersonaId === personaId);
    if (mine.length === 0) return undefined;
    const org = session.currentPersona?.organisation;
    return (org && mine.find((e) => e.name === org)) || mine[0];
  });

  function update(id: string, patch: Partial<EmployerRef>) {
    const i = employers.value.findIndex((e) => e.id === id);
    if (i < 0) return;
    employers.value[i] = { ...employers.value[i], ...patch };
  }

  function reset() {
    employers.value = structuredClone(EMPLOYERS);
  }

  return { employers, init, byId, myEmployer, update, reset };
});
