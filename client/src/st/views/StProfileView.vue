<script setup lang="ts">
import { computed, ref } from "vue";
import { ImageUp, KeyRound, Save, Trash2, User } from "lucide-vue-next";

import { useToast } from "@/composables/useToast";
import { useLocale } from "@/composables/useLocale";

import StPageHero from "../components/StPageHero.vue";

const toast = useToast();
const { locale } = useLocale();
const bm = computed(() => locale.value === "bm");

// ── dummy pre-filled profile state ──────────────────────────────────────────
const form = ref({
  fullName: "Ahmad bin Abdullah",
  icNo: "880102-14-5678",
  email: "ahmad.abdullah@example.com",
  phone: "012-345 6789",
  address: "No. 12, Jalan Melur 3, Taman Seri Melur, 43000 Kajang, Selangor",
});
const photoUrl = ref<string>("");

// ── password state ──────────────────────────────────────────────────────────
const password = ref({ current: "", next: "", confirm: "" });

const INPUT =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[var(--accent-500)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent-ring)]/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100";

function onPhoto(ev: Event) {
  const file = (ev.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    toast.error(bm.value ? "Format tidak sah" : "Invalid format", bm.value ? "Sila pilih fail imej." : "Please choose an image file.");
    return;
  }
  if (file.size > 1_000_000) {
    toast.error(bm.value ? "Fail terlalu besar" : "File too large", bm.value ? "Maksimum 1MB." : "Maximum 1MB.");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => (photoUrl.value = String(reader.result));
  reader.readAsDataURL(file);
}

function saveProfile() {
  toast.success(
    bm.value ? "Profil dikemaskini" : "Profile updated",
    bm.value ? "Maklumat profil anda telah disimpan." : "Your profile details have been saved.",
  );
}

function changePassword() {
  if (!password.value.current || !password.value.next || !password.value.confirm) {
    toast.error(
      bm.value ? "Maklumat tidak lengkap" : "Incomplete information",
      bm.value ? "Sila lengkapkan semua ruangan kata laluan." : "Please complete all password fields.",
    );
    return;
  }
  if (password.value.next !== password.value.confirm) {
    toast.error(
      bm.value ? "Kata laluan tidak sepadan" : "Passwords do not match",
      bm.value ? "Kata laluan baharu dan pengesahan tidak sama." : "New password and confirmation do not match.",
    );
    return;
  }
  password.value = { current: "", next: "", confirm: "" };
  toast.success(
    bm.value ? "Kata laluan ditukar" : "Password changed",
    bm.value ? "Kata laluan anda telah dikemaskini." : "Your password has been updated.",
  );
}

type ProfileTab = "profile" | "password";
const activeTab = ref<ProfileTab>("profile");
const TABS = computed<Array<{ key: ProfileTab; label: string }>>(() => [
  { key: "profile", label: bm.value ? "Maklumat Peribadi" : "Personal Information" },
  { key: "password", label: bm.value ? "Kata Laluan" : "Password" },
]);
</script>

<template>
  <div class="space-y-5">
    <StPageHero
      :title="bm ? 'Profil Saya' : 'My Profile'"
      :subtitle="bm ? 'Urus maklumat peribadi dan tetapan akaun anda' : 'Manage your personal details and account settings'"
    />

    <div class="flex gap-1 border-b border-slate-200 dark:border-slate-700">
      <button
        v-for="t in TABS"
        :key="t.key"
        type="button"
        class="border-b-2 px-3 pb-2 text-sm font-medium transition-colors"
        :class="activeTab === t.key ? 'border-[var(--accent-600)] text-slate-900 dark:text-slate-100' : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'"
        @click="activeTab = t.key"
      >
        {{ t.label }}
      </button>
    </div>

    <!-- Maklumat Peribadi -->
    <div v-if="activeTab === 'profile'" class="pt-6">
      <!-- Photo -->
      <div class="mb-6 flex items-center gap-4">
        <div class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
          <img v-if="photoUrl" :src="photoUrl" alt="Photo" class="h-full w-full object-cover" />
          <User v-else class="h-8 w-8 text-slate-300 dark:text-slate-600" />
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <label class="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800/60">
            <ImageUp class="h-3.5 w-3.5" /> {{ bm ? 'Muat Naik Foto' : 'Upload Photo' }}
            <input type="file" accept="image/*" class="hidden" @change="onPhoto" />
          </label>
          <button
            v-if="photoUrl"
            class="inline-flex items-center gap-1.5 rounded-md border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-500/15"
            @click="photoUrl = ''"
          >
            <Trash2 class="h-3.5 w-3.5" /> {{ bm ? 'Buang' : 'Remove' }}
          </button>
          <span class="text-xs text-slate-400 dark:text-slate-500">PNG / JPG, {{ bm ? 'maksimum' : 'max' }} 1MB</span>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <label class="sm:col-span-2">
          <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ bm ? 'Nama Penuh' : 'Full Name' }}</span>
          <input v-model="form.fullName" :class="INPUT" />
        </label>
        <label>
          <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ bm ? 'No. Kad Pengenalan' : 'IC No.' }}</span>
          <input v-model="form.icNo" :class="INPUT" />
        </label>
        <label>
          <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ bm ? 'No. Telefon' : 'Phone No.' }}</span>
          <input v-model="form.phone" :class="INPUT" placeholder="012-345 6789" />
        </label>
        <label class="sm:col-span-2">
          <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ bm ? 'E-mel' : 'Email' }}</span>
          <input v-model="form.email" type="email" :class="INPUT" />
        </label>
        <label class="sm:col-span-2">
          <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ bm ? 'Alamat' : 'Address' }}</span>
          <textarea v-model="form.address" rows="3" :class="INPUT"></textarea>
        </label>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          class="flex items-center gap-1.5 rounded-md bg-[var(--accent-600)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-700)]"
          @click="saveProfile"
        >
          <Save class="h-4 w-4" /> {{ bm ? 'Simpan' : 'Save' }}
        </button>
      </div>
    </div>

    <!-- Kata Laluan -->
    <div v-else-if="activeTab === 'password'" class="pt-6">
      <div class="grid max-w-md gap-4">
        <label>
          <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ bm ? 'Kata Laluan Semasa' : 'Current Password' }}</span>
          <input v-model="password.current" type="password" :class="INPUT" autocomplete="current-password" />
        </label>
        <label>
          <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ bm ? 'Kata Laluan Baharu' : 'New Password' }}</span>
          <input v-model="password.next" type="password" :class="INPUT" autocomplete="new-password" />
        </label>
        <label>
          <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ bm ? 'Sahkan Kata Laluan Baharu' : 'Confirm New Password' }}</span>
          <input v-model="password.confirm" type="password" :class="INPUT" autocomplete="new-password" />
        </label>
      </div>

      <div class="mt-6 flex max-w-md justify-end">
        <button
          class="flex items-center gap-1.5 rounded-md bg-[var(--accent-600)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-700)]"
          @click="changePassword"
        >
          <KeyRound class="h-4 w-4" /> {{ bm ? 'Tukar Kata Laluan' : 'Change Password' }}
        </button>
      </div>
    </div>
  </div>
</template>
