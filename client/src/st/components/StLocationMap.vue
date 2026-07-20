<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2, LocateFixed } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import type { GeoPoint } from "../types";

const props = defineProps<{ modelValue: GeoPoint | null }>();
const emit = defineEmits<{ "update:modelValue": [GeoPoint] }>();

const { locale } = useLocale();
const bm = () => locale.value === "bm";

const mapEl = ref<HTMLDivElement | null>(null);
const locating = ref(false);
const geoError = ref("");

let map: L.Map | null = null;
let pin: L.Marker | null = null;

// Inline SVG marker — Leaflet's default marker images don't resolve under Vite bundling.
const pinIcon = L.divIcon({
  className: "",
  html:
    '<svg width="30" height="30" viewBox="0 0 24 24" fill="#1d4ed8" stroke="#ffffff" stroke-width="1.4">' +
    '<path d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10z"/>' +
    '<circle cx="12" cy="11" r="2.3" fill="#ffffff" stroke="none"/></svg>',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

function emitLocation(lat: number, lng: number) {
  emit("update:modelValue", { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) });
}

function setPin(lat: number, lng: number, pan = false) {
  if (!map) return;
  if (!pin) {
    pin = L.marker([lat, lng], { icon: pinIcon, draggable: true }).addTo(map);
    pin.on("dragend", () => {
      const p = pin!.getLatLng();
      emitLocation(p.lat, p.lng);
    });
  } else {
    pin.setLatLng([lat, lng]);
  }
  if (pan) map.setView([lat, lng], Math.max(map.getZoom(), 15));
}

function useMyLocation() {
  geoError.value = "";
  if (!navigator.geolocation) {
    geoError.value = bm() ? "Peranti anda tidak menyokong geolokasi." : "Your device does not support geolocation.";
    return;
  }
  locating.value = true;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      setPin(latitude, longitude, true);
      emitLocation(latitude, longitude);
      locating.value = false;
    },
    () => {
      geoError.value = bm()
        ? "Tidak dapat mengesan lokasi. Sila benarkan kebenaran lokasi atau letak pin secara manual."
        : "Could not detect location. Allow location permission or drop the pin manually.";
      locating.value = false;
    },
    { enableHighAccuracy: true, timeout: 8000 },
  );
}

onMounted(() => {
  if (!mapEl.value) return;
  const has = props.modelValue !== null;
  // Default view: peninsular Malaysia.
  map = L.map(mapEl.value).setView(has ? [props.modelValue!.lat, props.modelValue!.lng] : [4.2, 108.0], has ? 15 : 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19,
  }).addTo(map);

  map.on("click", (e: L.LeafletMouseEvent) => {
    setPin(e.latlng.lat, e.latlng.lng);
    emitLocation(e.latlng.lat, e.latlng.lng);
  });

  if (has) setPin(props.modelValue!.lat, props.modelValue!.lng);

  // Container may size slightly after mount inside a card/panel.
  setTimeout(() => map?.invalidateSize(), 0);
});

watch(
  () => props.modelValue,
  (val) => {
    if (!val) return;
    const cur = pin?.getLatLng();
    if (!cur || cur.lat !== val.lat || cur.lng !== val.lng) setPin(val.lat, val.lng);
  },
);

onBeforeUnmount(() => {
  map?.remove();
  map = null;
  pin = null;
});
</script>

<template>
  <div>
    <div class="mb-2 flex flex-wrap items-center gap-2">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60"
        :disabled="locating"
        @click="useMyLocation"
      >
        <Loader2 v-if="locating" class="h-3.5 w-3.5 animate-spin" />
        <LocateFixed v-else class="h-3.5 w-3.5" />
        {{ bm() ? 'Guna Lokasi Semasa' : 'Use Current Location' }}
      </button>
      <span class="text-xs text-slate-400">
        {{ bm() ? 'atau klik / seret pin pada peta' : 'or click / drag the pin on the map' }}
      </span>
    </div>

    <div ref="mapEl" class="w-full overflow-hidden rounded-lg border border-slate-200" style="height: 320px; z-index: 0" />

    <div class="mt-2 flex flex-wrap items-center justify-between gap-2">
      <p v-if="modelValue" class="font-mono text-xs text-slate-500">
        {{ modelValue.lat.toFixed(6) }}, {{ modelValue.lng.toFixed(6) }}
      </p>
      <p v-else class="text-xs text-slate-400">{{ bm() ? 'Belum ada pin lokasi.' : 'No location pinned yet.' }}</p>
      <p v-if="geoError" class="text-xs text-amber-600">{{ geoError }}</p>
    </div>
  </div>
</template>
