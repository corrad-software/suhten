<script setup lang="ts">
import { computed } from "vue";

import { useLocale } from "@/composables/useLocale";
import { MALAYSIAN_STATES, isValidPostcode, type StAddress } from "../address";

const props = defineProps<{
  modelValue: StAddress;
  /** Show inline validation hints (e.g. after a failed submit attempt). */
  showErrors?: boolean;
}>();

const emit = defineEmits<{ "update:modelValue": [StAddress] }>();

const { locale } = useLocale();
const bm = computed(() => locale.value === "bm");

function set<K extends keyof StAddress>(key: K, value: string) {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
}

/** Poskod: digits only, max 5. */
function onPostcode(e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(/\D/g, "").slice(0, 5);
  set("postcode", raw);
}

const postcodeInvalid = computed(
  () => Boolean(props.showErrors) && props.modelValue.postcode.length > 0 && !isValidPostcode(props.modelValue.postcode),
);

const INPUT =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[var(--accent-500)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent-ring)]/30";
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-2">
    <label class="sm:col-span-2">
      <span class="mb-1 block text-sm font-medium text-slate-700">
        {{ bm ? 'Alamat Baris 1' : 'Address Line 1' }} <span class="text-rose-500">*</span>
      </span>
      <input
        :value="modelValue.line1"
        :class="INPUT"
        :placeholder="bm ? 'No. rumah / lot, jalan' : 'House / lot no., street'"
        @input="set('line1', ($event.target as HTMLInputElement).value)"
      />
    </label>

    <label class="sm:col-span-2">
      <span class="mb-1 block text-sm font-medium text-slate-700">
        {{ bm ? 'Alamat Baris 2' : 'Address Line 2' }}
        <span class="text-xs font-normal text-slate-400">({{ bm ? 'pilihan' : 'optional' }})</span>
      </span>
      <input
        :value="modelValue.line2"
        :class="INPUT"
        :placeholder="bm ? 'Taman / kawasan / bangunan' : 'Taman / area / building'"
        @input="set('line2', ($event.target as HTMLInputElement).value)"
      />
    </label>

    <label>
      <span class="mb-1 block text-sm font-medium text-slate-700">
        {{ bm ? 'Daerah' : 'District' }} <span class="text-rose-500">*</span>
      </span>
      <input
        :value="modelValue.district"
        :class="INPUT"
        :placeholder="bm ? 'Cth: Petaling Jaya' : 'e.g. Petaling Jaya'"
        @input="set('district', ($event.target as HTMLInputElement).value)"
      />
    </label>

    <label>
      <span class="mb-1 block text-sm font-medium text-slate-700">
        {{ bm ? 'Poskod' : 'Postcode' }} <span class="text-rose-500">*</span>
      </span>
      <input
        :value="modelValue.postcode"
        inputmode="numeric"
        maxlength="5"
        :class="[INPUT, postcodeInvalid ? 'border-rose-300 focus:border-rose-400' : '']"
        placeholder="47810"
        @input="onPostcode"
      />
      <span v-if="postcodeInvalid" class="mt-1 block text-xs text-rose-600">
        {{ bm ? 'Poskod mesti 5 digit.' : 'Postcode must be 5 digits.' }}
      </span>
    </label>

    <label class="sm:col-span-2">
      <span class="mb-1 block text-sm font-medium text-slate-700">
        {{ bm ? 'Negeri' : 'State' }} <span class="text-rose-500">*</span>
      </span>
      <select :value="modelValue.state" :class="INPUT" @change="set('state', ($event.target as HTMLSelectElement).value)">
        <option value="">{{ bm ? '— Pilih negeri —' : '— Select state —' }}</option>
        <option v-for="s in MALAYSIAN_STATES" :key="s" :value="s">{{ s }}</option>
      </select>
    </label>
  </div>
</template>
