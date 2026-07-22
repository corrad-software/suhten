<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Building2, ImageUp, Save, Trash2 } from "lucide-vue-next";

import { useToast } from "@/composables/useToast";
import { useLocale } from "@/composables/useLocale";

import type { AppDocument, GeoPoint } from "../types";
import { formatAddress, isAddressComplete, parseAddress, type StAddress } from "../address";
import { useStEmployerStore } from "../stores/employer";
import { useStWorkflowStore } from "../stores/workflow";
import { STATUS_META, workflowShort } from "../status";
import type { SmartTableColumn } from "../composables/useSmartTable";
import StPageHero from "../components/StPageHero.vue";
import AddressFieldset from "../components/AddressFieldset.vue";
import StLocationMap from "../components/StLocationMap.vue";
import DocumentUploadField from "../components/DocumentUploadField.vue";
import StatusBadge from "../components/StatusBadge.vue";
import SmartTable from "../components/SmartTable.vue";

const toast = useToast();
const { locale } = useLocale();
const employerStore = useStEmployerStore();
const workflow = useStWorkflowStore();

const bm = computed(() => locale.value === "bm");
const employer = computed(() => employerStore.myEmployer);

const COMPANY_DOC_LABELS = ["Sijil Pendaftaran SSM", "Borang 49 / Seksyen 14", "Penyata Kewangan Terkini"];

// ── editable form state ────────────────────────────────────────────────────
const form = ref({ name: "", registrationNo: "", contactPerson: "", phone: "", email: "" });
const addressForm = ref<StAddress>(parseAddress(""));
const location = ref<GeoPoint | null>(null);
const documents = ref<AppDocument[]>([]);
const logoUrl = ref<string>("");
const showErrors = ref(false);

function hydrate() {
  const e = employer.value;
  if (!e) return;
  form.value = {
    name: e.name,
    registrationNo: e.registrationNo,
    contactPerson: e.contactPerson,
    phone: e.phone ?? "",
    email: e.email ?? "",
  };
  addressForm.value = parseAddress(e.address);
  location.value = e.location ?? null;
  documents.value = e.documents ? [...e.documents] : [];
  logoUrl.value = e.logoUrl ?? "";
}

onMounted(() => {
  employerStore.init();
  hydrate();
});

// ── Orang Kompeten registered under this company (read-only) ───────────────
const registeredOks = computed(() => {
  const e = employer.value;
  if (!e) return [];
  return workflow.applications.filter((a) => a.workflowType === "OK" && a.employer?.id === e.id);
});

// ── logo upload ────────────────────────────────────────────────────────────
function onLogo(ev: Event) {
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
  reader.onload = () => (logoUrl.value = String(reader.result));
  reader.readAsDataURL(file);
}

const canSave = computed(
  () => Boolean(form.value.name && form.value.registrationNo && form.value.contactPerson) && isAddressComplete(addressForm.value),
);

function save() {
  showErrors.value = true;
  const e = employer.value;
  if (!e) return;
  if (!canSave.value) {
    toast.error(
      bm.value ? "Maklumat tidak lengkap" : "Incomplete information",
      bm.value ? "Sila lengkapkan nama, no. pendaftaran, orang hubungan dan alamat." : "Please complete name, registration no., contact person and address.",
    );
    return;
  }
  employerStore.update(e.id, {
    name: form.value.name,
    registrationNo: form.value.registrationNo,
    contactPerson: form.value.contactPerson,
    phone: form.value.phone,
    email: form.value.email,
    address: formatAddress(addressForm.value),
    location: location.value ?? undefined,
    documents: documents.value,
    logoUrl: logoUrl.value || undefined,
  });
  toast.success(
    bm.value ? "Maklumat dikemaskini" : "Details updated",
    bm.value ? "Maklumat majikan telah disimpan." : "Employer details have been saved.",
  );
}

const INPUT =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[var(--accent-500)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent-ring)]/30";

type ProfileTab = "company" | "address" | "oks" | "documents";
const activeTab = ref<ProfileTab>("company");
const TABS = computed<Array<{ key: ProfileTab; label: string }>>(() => [
  { key: "company", label: bm.value ? "Maklumat Syarikat" : "Company Information" },
  { key: "address", label: bm.value ? "Alamat Operasi" : "Operating Address" },
  { key: "oks", label: bm.value ? "Orang Kompeten Di Bawah Syarikat" : "Competent Persons" },
  { key: "documents", label: bm.value ? "Dokumen Syarikat" : "Company Documents" },
]);

// ── Orang Kompeten tab: SmartTable column definitions ───────────────────────
function statusLabel(status: string): string {
  return STATUS_META[status as keyof typeof STATUS_META]?.label ?? status;
}

const okColumns = computed<SmartTableColumn<(typeof registeredOks.value)[number]>[]>(() => [
  { key: "refNo", label: bm.value ? "No. Rujukan" : "Ref No.", value: (a) => a.refNo },
  { key: "name", label: bm.value ? "Nama" : "Name", value: (a) => a.applicant.fullName },
  { key: "type", label: bm.value ? "Jenis" : "Type", value: (a) => workflowShort(a.workflowType) },
  { key: "status", label: bm.value ? "Status" : "Status", value: (a) => statusLabel(a.status) },
]);
</script>

<template>
  <div class="space-y-5">
    <StPageHero
      :title="bm ? 'Kemaskini Maklumat Majikan' : 'Update Employer Details'"
      :subtitle="employer?.name ?? (bm ? 'Tiada syarikat dikaitkan' : 'No linked company')"
    >
      <template #action>
        <button
          class="flex shrink-0 items-center gap-1.5 rounded-md bg-[var(--accent-600)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-700)] disabled:opacity-60"
          :disabled="!employer"
          @click="save"
        >
          <Save class="h-4 w-4" /> {{ bm ? 'Simpan' : 'Save' }}
        </button>
      </template>
    </StPageHero>

    <div v-if="!employer" class="py-16 text-center text-sm text-slate-500">
      {{ bm ? 'Tiada syarikat majikan dikaitkan dengan akaun ini.' : 'No employer company is linked to this account.' }}
    </div>

    <template v-else>
      <div class="flex gap-1 border-b border-slate-200">
        <button
          v-for="t in TABS"
          :key="t.key"
          type="button"
          class="border-b-2 px-3 pb-2 text-sm font-medium transition-colors"
          :class="activeTab === t.key ? 'border-[var(--accent-600)] text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-900'"
          @click="activeTab = t.key"
        >
          {{ t.label }}
        </button>
      </div>

      <!-- Maklumat Syarikat -->
      <div v-if="activeTab === 'company'" class="pt-6">
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="sm:col-span-2">
            <span class="mb-1 block text-sm font-medium text-slate-700">
              {{ bm ? 'Nama Syarikat' : 'Company Name' }} <span class="text-rose-500">*</span>
            </span>
            <input v-model="form.name" :class="INPUT" />
          </label>
          <label>
            <span class="mb-1 block text-sm font-medium text-slate-700">
              {{ bm ? 'No. Pendaftaran SSM' : 'SSM Registration No.' }} <span class="text-rose-500">*</span>
            </span>
            <input v-model="form.registrationNo" :class="INPUT" />
          </label>
          <label>
            <span class="mb-1 block text-sm font-medium text-slate-700">
              {{ bm ? 'Orang Hubungan' : 'Contact Person' }} <span class="text-rose-500">*</span>
            </span>
            <input v-model="form.contactPerson" :class="INPUT" />
          </label>
          <label>
            <span class="mb-1 block text-sm font-medium text-slate-700">{{ bm ? 'No. Telefon' : 'Phone No.' }}</span>
            <input v-model="form.phone" :class="INPUT" placeholder="03-1234 5678" />
          </label>
          <label>
            <span class="mb-1 block text-sm font-medium text-slate-700">{{ bm ? 'E-mel' : 'Email' }}</span>
            <input v-model="form.email" type="email" :class="INPUT" />
          </label>
        </div>

        <!-- Logo -->
        <div class="mt-5 border-t border-slate-100 pt-4">
          <p class="mb-2 text-sm font-medium text-slate-700">{{ bm ? 'Logo Syarikat' : 'Company Logo' }}</p>
          <div class="flex items-center gap-4">
            <div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              <img v-if="logoUrl" :src="logoUrl" alt="Logo" class="h-full w-full object-contain" />
              <Building2 v-else class="h-6 w-6 text-slate-300" />
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <label class="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50">
                <ImageUp class="h-3.5 w-3.5" /> {{ bm ? 'Muat Naik Logo' : 'Upload Logo' }}
                <input type="file" accept="image/*" class="hidden" @change="onLogo" />
              </label>
              <button
                v-if="logoUrl"
                class="inline-flex items-center gap-1.5 rounded-md border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50"
                @click="logoUrl = ''"
              >
                <Trash2 class="h-3.5 w-3.5" /> {{ bm ? 'Buang' : 'Remove' }}
              </button>
              <span class="text-xs text-slate-400">PNG / JPG, {{ bm ? 'maksimum' : 'max' }} 1MB</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Alamat + Peta -->
      <div v-else-if="activeTab === 'address'" class="pt-6">
        <AddressFieldset v-model="addressForm" :show-errors="showErrors" />

        <div class="mt-5 border-t border-slate-100 pt-4">
          <p class="mb-1 text-sm font-medium text-slate-700">{{ bm ? 'Lokasi Premis (Peta)' : 'Premises Location (Map)' }}</p>
          <p class="mb-3 text-xs text-slate-500">
            {{ bm
              ? 'Tandakan lokasi premis operasi anda untuk memudahkan lawatan tapak / pemeriksaan ST.'
              : 'Pin your operating premises to assist ST site visits / inspections.' }}
          </p>
          <StLocationMap v-model="location" />
        </div>
      </div>

      <!-- Orang Kompeten berdaftar (read-only, search + pagination) -->
      <div v-else-if="activeTab === 'oks'" class="pt-6">
        <SmartTable
          :rows="registeredOks"
          :columns="okColumns"
          :row-key="(a) => a.id"
          :search-placeholder="bm ? 'Cari nama, no. rujukan atau status...' : 'Search name, ref no. or status...'"
          :empty-text="bm ? 'Tiada Orang Kompeten dikaitkan dengan syarikat ini.' : 'No Competent Persons linked to this company.'"
        >
          <template #cell-status="{ row }">
            <StatusBadge :status="row.status" />
          </template>
        </SmartTable>
      </div>

      <!-- Dokumen Syarikat -->
      <div v-else-if="activeTab === 'documents'" class="pt-6">
        <p class="mb-3 text-xs text-slate-500">
          {{ bm ? 'Dokumen sokongan syarikat untuk semakan ST.' : 'Supporting company documents for ST review.' }}
        </p>
        <DocumentUploadField v-model="documents" :labels="COMPANY_DOC_LABELS" />
      </div>
    </template>
  </div>
</template>
