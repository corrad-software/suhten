<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Loader2 } from "lucide-vue-next";

import { resolveStaffTaskLink } from "@/api/st-registration";
import { useStSessionStore } from "../stores/session";
import StPageHero from "../components/StPageHero.vue";

const route = useRoute();
const router = useRouter();
const session = useStSessionStore();

const error = ref("");

onMounted(async () => {
  const token = typeof route.params.token === "string" ? route.params.token : "";
  if (!token) {
    error.value = "Pautan tugasan tidak sah.";
    return;
  }

  try {
    const res = await resolveStaffTaskLink(token);
    const path = res.data?.path;
    if (typeof path !== "string" || !path.startsWith("/st") || path.startsWith("//")) {
      throw new Error("Invalid path");
    }
    await router.replace(path);
  } catch {
    error.value = "Pautan tugasan tidak sah atau telah tamat tempoh.";
  }
});

function goHome() {
  router.replace(session.homeRoute());
}
</script>

<template>
  <div class="space-y-5">
    <StPageHero title="Membuka Peti Tugasan" />

    <div class="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <template v-if="!error">
        <Loader2 class="h-6 w-6 animate-spin text-slate-400 dark:text-slate-500" aria-hidden="true" />
        <p class="text-sm text-slate-600 dark:text-slate-400">Membuka Peti Tugasan…</p>
      </template>
      <template v-else>
        <p class="text-sm text-slate-700 dark:text-slate-300">{{ error }}</p>
        <button
          type="button"
          class="rounded-md bg-[#0f4c81] px-4 py-2 text-sm font-medium text-white"
          @click="goHome"
        >
          Kembali
        </button>
      </template>
    </div>
  </div>
</template>
