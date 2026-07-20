<script setup lang="ts">
import { computed, ref } from "vue";
import { Lock, Loader2, CheckCircle2, ChevronLeft, ShieldCheck } from "lucide-vue-next";

const props = defineProps<{ amount: number; title: string; reference?: string }>();
const emit = defineEmits<{ (e: "paid", bank: string): void }>();

interface Bank {
  name: string;
  domain: string;
  bg: string;
  fg: string;
}

// Malaysian FPX participating banks (retail).
const BANKS: Bank[] = [
  { name: "Maybank2u", domain: "www.maybank2u.com.my", bg: "#FFC83D", fg: "#0a0a0a" },
  { name: "CIMB Clicks", domain: "www.cimbclicks.com.my", bg: "#EC1C24", fg: "#ffffff" },
  { name: "Public Bank (PBe)", domain: "www.pbebank.com", bg: "#C8102E", fg: "#ffffff" },
  { name: "RHB Now", domain: "www.rhbgroup.com", bg: "#00518F", fg: "#ffffff" },
  { name: "Hong Leong Connect", domain: "www.hongleongconnect.my", bg: "#F58220", fg: "#ffffff" },
  { name: "Bank Islam", domain: "www.bankislam.biz", bg: "#00954C", fg: "#ffffff" },
  { name: "AmOnline", domain: "www.ambank.com.my", bg: "#E4002B", fg: "#ffffff" },
  { name: "Bank Rakyat", domain: "www.bankrakyat.com.my", bg: "#003DA5", fg: "#ffffff" },
];

type Step = "select" | "login" | "authorize" | "processing" | "success";
const step = ref<Step>("select");
const bank = ref<Bank | null>(null);
const username = ref("");
const password = ref("");
const account = ref("1234-5678-9012");
const tac = ref("");
const procMessage = ref("");

const amountLabel = computed(() => `RM ${props.amount.toFixed(2)}`);
const orderNo = computed(() => props.reference ?? "ORD-" + Math.floor(1000 + props.amount).toString());

// The fake secure address bar changes per step to sell the "redirect" illusion.
const addressBar = computed(() => {
  if (step.value === "select") return "www.mepsfpx.com.my";
  return bank.value?.domain ?? "www.mepsfpx.com.my";
});

function chooseBank(b: Bank) {
  bank.value = b;
  step.value = "login";
  username.value = "";
  password.value = "";
}

function doLogin() {
  step.value = "processing";
  procMessage.value = `Log masuk ke ${bank.value?.name}…`;
  window.setTimeout(() => {
    step.value = "authorize";
  }, 900);
}

function requestTac() {
  tac.value = "492817"; // simulated TAC pushed to phone
}

function approve() {
  step.value = "processing";
  const seq = [
    "Mengesahkan TAC…",
    "Menghubungi FPX…",
    `Mendebit akaun ${bank.value?.name}…`,
    "Memuktamadkan transaksi…",
  ];
  let i = 0;
  procMessage.value = seq[0];
  const timer = window.setInterval(() => {
    i++;
    if (i < seq.length) {
      procMessage.value = seq[i];
    } else {
      window.clearInterval(timer);
      step.value = "success";
    }
  }, 650);
}

function backToMerchant() {
  emit("paid", bank.value?.name ?? "FPX");
}

const canLogin = computed(() => username.value.trim().length > 0 && password.value.length > 0);
const canApprove = computed(() => /^\d{6}$/.test(tac.value));
</script>

<template>
  <div class="mx-auto max-w-md overflow-hidden rounded-xl border border-slate-300 bg-white shadow-lg">
    <!-- Fake secure browser chrome -->
    <div class="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-3 py-2">
      <div class="flex gap-1.5">
        <span class="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span class="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span class="h-2.5 w-2.5 rounded-full bg-emerald-400" />
      </div>
      <div class="flex flex-1 items-center gap-1.5 rounded bg-white px-2.5 py-1 text-[11px] text-slate-500 ring-1 ring-slate-200">
        <Lock class="h-3 w-3 text-emerald-600" />
        <span class="truncate">{{ addressBar }}</span>
      </div>
    </div>

    <!-- ── FPX: select bank ── -->
    <div v-if="step === 'select'">
      <div class="flex items-center justify-between bg-[#0b3d91] px-5 py-3 text-white">
        <p class="text-sm font-bold tracking-wide">FPX</p>
        <p class="text-[11px] text-blue-100">Financial Process Exchange</p>
      </div>
      <div class="space-y-4 px-5 py-5">
        <div class="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
          <div class="flex justify-between"><span class="text-slate-500">Penjual</span><span class="font-medium text-slate-800">SURUHANJAYA TENAGA</span></div>
          <div class="flex justify-between"><span class="text-slate-500">No. Rujukan</span><span class="font-mono text-slate-700">{{ orderNo }}</span></div>
          <div class="mt-1 flex justify-between border-t border-slate-200 pt-1"><span class="text-slate-500">{{ title }}</span><span class="text-lg font-bold text-slate-900">{{ amountLabel }}</span></div>
        </div>

        <p class="text-[13px] font-medium text-slate-700">Pilih bank anda</p>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="b in BANKS"
            :key="b.name"
            type="button"
            class="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2.5 text-left text-xs font-medium text-slate-700 transition-all hover:border-[var(--accent-ring)] hover:shadow-sm"
            @click="chooseBank(b)"
          >
            <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[10px] font-bold" :style="{ background: b.bg, color: b.fg }">
              {{ b.name.slice(0, 2).toUpperCase() }}
            </span>
            <span class="truncate">{{ b.name }}</span>
          </button>
        </div>
        <p class="flex items-center justify-center gap-1 text-[11px] text-slate-400">
          <ShieldCheck class="h-3 w-3" /> Simulasi gerbang FPX untuk tujuan demo
        </p>
      </div>
    </div>

    <!-- ── Bank login ── -->
    <div v-else-if="step === 'login'">
      <div class="flex items-center gap-2 px-5 py-3" :style="{ background: bank!.bg, color: bank!.fg }">
        <button class="opacity-80 hover:opacity-100" @click="step = 'select'"><ChevronLeft class="h-4 w-4" /></button>
        <p class="text-sm font-bold">{{ bank!.name }}</p>
      </div>
      <div class="space-y-4 px-5 py-5">
        <p class="text-sm font-medium text-slate-700">Log masuk perbankan internet</p>
        <label class="block">
          <span class="mb-1 block text-[13px] text-slate-600">Nama Pengguna</span>
          <input v-model="username" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[var(--accent-500)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent-ring)]/30" placeholder="ID pengguna" />
        </label>
        <label class="block">
          <span class="mb-1 block text-[13px] text-slate-600">Kata Laluan</span>
          <input v-model="password" type="password" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[var(--accent-500)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent-ring)]/30" placeholder="••••••" />
        </label>
        <button
          class="w-full rounded-md px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
          :style="{ background: bank!.bg === '#FFC83D' ? '#0a0a0a' : bank!.bg }"
          :disabled="!canLogin"
          @click="doLogin"
        >
          Log Masuk
        </button>
        <p class="text-center text-[11px] text-slate-400">Masukkan sebarang ID & kata laluan (simulasi).</p>
      </div>
    </div>

    <!-- ── Bank authorize ── -->
    <div v-else-if="step === 'authorize'">
      <div class="flex items-center gap-2 px-5 py-3" :style="{ background: bank!.bg, color: bank!.fg }">
        <p class="text-sm font-bold">{{ bank!.name }}</p>
      </div>
      <div class="space-y-4 px-5 py-5">
        <p class="text-sm font-medium text-slate-700">Sahkan pembayaran</p>
        <div class="space-y-1.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
          <div class="flex justify-between"><span class="text-slate-500">Kepada</span><span class="font-medium text-slate-800">SURUHANJAYA TENAGA</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Rujukan</span><span class="font-mono text-slate-700">{{ orderNo }}</span></div>
          <div class="flex justify-between border-t border-slate-200 pt-1.5"><span class="text-slate-500">Jumlah</span><span class="text-lg font-bold text-slate-900">{{ amountLabel }}</span></div>
        </div>
        <label class="block">
          <span class="mb-1 block text-[13px] text-slate-600">Debit dari akaun</span>
          <select v-model="account" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[var(--accent-500)] focus:outline-hidden">
            <option value="1234-5678-9012">Akaun Simpanan — 1234-5678-9012</option>
            <option value="9988-7766-5544">Akaun Semasa — 9988-7766-5544</option>
          </select>
        </label>
        <div>
          <div class="mb-1 flex items-center justify-between">
            <span class="text-[13px] text-slate-600">Nombor TAC</span>
            <button class="text-xs font-medium text-[var(--accent-700)] hover:underline" @click="requestTac">Minta TAC</button>
          </div>
          <input v-model="tac" inputmode="numeric" maxlength="6" class="w-full rounded-md border border-slate-300 px-3 py-2 text-center font-mono text-lg tracking-[0.4em] focus:border-[var(--accent-500)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent-ring)]/30" placeholder="––––––" />
          <p class="mt-1 text-[11px] text-slate-400">TAC dihantar ke telefon anda (simulasi: klik "Minta TAC").</p>
        </div>
        <button
          class="w-full rounded-md px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
          :style="{ background: bank!.bg === '#FFC83D' ? '#0a0a0a' : bank!.bg }"
          :disabled="!canApprove"
          @click="approve"
        >
          Sahkan &amp; Bayar {{ amountLabel }}
        </button>
      </div>
    </div>

    <!-- ── Processing ── -->
    <div v-else-if="step === 'processing'" class="px-5 py-12 text-center">
      <Loader2 class="mx-auto h-9 w-9 animate-spin text-[var(--accent-600)]" />
      <p class="mt-4 text-sm font-medium text-slate-700">{{ procMessage }}</p>
      <p class="mt-1 text-xs text-slate-400">Jangan tutup atau muat semula tetingkap ini.</p>
    </div>

    <!-- ── Success ── -->
    <div v-else class="px-5 py-8 text-center">
      <CheckCircle2 class="mx-auto h-12 w-12 text-emerald-500" />
      <h3 class="mt-3 text-lg font-semibold text-slate-900">Transaksi Berjaya</h3>
      <p class="mt-1 text-sm text-slate-500">Pembayaran {{ amountLabel }} melalui {{ bank!.name }} telah diproses.</p>
      <div class="mx-auto mt-4 max-w-xs space-y-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs">
        <div class="flex justify-between"><span class="text-slate-500">Rujukan FPX</span><span class="font-mono text-slate-700">FPX{{ orderNo.replace(/\D/g, "").slice(-8) || "24681012" }}</span></div>
        <div class="flex justify-between"><span class="text-slate-500">Bank</span><span class="text-slate-700">{{ bank!.name }}</span></div>
        <div class="flex justify-between"><span class="text-slate-500">Status</span><span class="font-medium text-emerald-600">Berjaya</span></div>
      </div>
      <button
        class="mt-5 w-full rounded-md bg-[var(--accent-600)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-700)]"
        @click="backToMerchant"
      >
        Kembali ke Suruhanjaya Tenaga
      </button>
    </div>
  </div>
</template>
