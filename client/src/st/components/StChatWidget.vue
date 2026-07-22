<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { MessageCircle, Send, X, Sparkles } from "lucide-vue-next";

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

const open = ref(false);
const sending = ref(false);
const input = ref("");
const scrollEl = ref<HTMLDivElement | null>(null);

const GREETING =
  "Salam! Saya Pembantu Digital Suruhanjaya Tenaga. Boleh saya bantu tentang pendaftaran Orang Kompeten / Kontraktor Elektrik, bayaran FPX, atau semakan status?";

const messages = ref<ChatTurn[]>([{ role: "assistant", content: GREETING }]);

const SUGGESTIONS = [
  "Cara mohon Orang Kompeten?",
  "Bagaimana bayar fi?",
  "Semak status permohonan",
];

const canSend = computed(() => input.value.trim().length > 0 && !sending.value);

// ── Mock reply engine (frontend-only prototype; no backend). ──────────────
function generateReply(text: string): string {
  const q = text.toLowerCase();
  if (/(salam|hai|hello|hi|help|bantu)/.test(q))
    return "Tentu! Anda boleh mula dengan log masuk, kemudian pilih perkhidmatan pendaftaran di halaman utama. Ada perkhidmatan tertentu yang anda ingin tahu?";
  if (/(orang kompeten|\bok\b|kompeten|pendawai|wireman)/.test(q))
    return "Untuk pendaftaran Orang Kompeten (Elektrik): log masuk → pilih 'OK Elektrik' → isi borang & muat naik dokumen (PDF) → majikan sahkan lantikan → bayar fi pemprosesan (FPX) → semakan ST → kelulusan → Perakuan Digital.";
  if (/(kontraktor|contractor|\bce\b|kelas)/.test(q))
    return "Untuk pendaftaran Kontraktor Elektrik: pilih Kelas (A–D), lantik Orang Kompeten yang mencukupi mengikut syarat kelas, hantar lantikan untuk pengesahan OK, kemudian teruskan bayaran & semakan.";
  if (/(bayar|fpx|fi|yuran|payment|resit|va)/.test(q))
    return "Bayaran boleh dibuat melalui FPX atau permohonan Virtual Account (VA) dalam tempoh 14 hari dari Notis Bayaran. Resit dijana secara automatik selepas bayaran berjaya.";
  if (/(status|semak|track|di mana|progress)/.test(q))
    return "Anda boleh semak status di menu 'Semak Status' menggunakan nombor rujukan permohonan (cth: ST/OK/2026/00110), atau lihat di Papan Pemuka selepas log masuk.";
  if (/(sijil|perakuan|certificate|cert)/.test(q))
    return "Setelah diluluskan dan fi pendaftaran dibayar, Perakuan Digital anda akan tersedia di Inbox / Papan Pemuka untuk dimuat turun (lengkap dengan kod QR pengesahan).";
  if (/(dokumen|document|muat naik|upload|pdf)/.test(q))
    return "Hanya dokumen PDF dibenarkan, maksimum 5MB setiap fail. Contoh: salinan MyKad, sijil kekompetenan, surat tawaran pekerjaan.";
  if (/(masa|tempoh|berapa lama|sla|piagam)/.test(q))
    return "Setiap peringkat dipantau mengikut Piagam Pelanggan ST — semakan SOS disasarkan dalam 4 jam waktu bekerja, dengan penunjuk 'traffic light' untuk memantau masa.";
  if (/(terima kasih|thanks|thank you|ok baik)/.test(q))
    return "Sama-sama! Ada apa-apa lagi yang boleh saya bantu?";
  return "Maaf, saya pembantu demo dengan jawapan terhad. Cuba tanya tentang: pendaftaran OK/Kontraktor, bayaran FPX, semakan status, dokumen, atau Perakuan Digital.";
}

async function scrollToBottom() {
  await nextTick();
  scrollEl.value?.scrollTo({ top: scrollEl.value.scrollHeight, behavior: "smooth" });
}

function toggle() {
  open.value = !open.value;
  if (open.value) scrollToBottom();
}

function send(preset?: string) {
  const text = (preset ?? input.value).trim();
  if (!text || sending.value) return;

  messages.value.push({ role: "user", content: text });
  input.value = "";
  sending.value = true;
  scrollToBottom();

  const reply = generateReply(text);
  window.setTimeout(() => {
    messages.value.push({ role: "assistant", content: reply });
    sending.value = false;
    scrollToBottom();
  }, 600);
}
</script>

<template>
  <div class="fixed bottom-20 right-4 z-[60] md:bottom-6 md:right-6">
    <div
      v-if="open"
      class="mb-3 flex h-[28rem] max-h-[70vh] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800"
    >
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
        <div class="flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-50)] text-[var(--accent-700)]">
            <Sparkles class="h-4 w-4" />
          </div>
          <div>
            <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">Pembantu Digital ST</p>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">Bantuan pendaftaran & perkhidmatan</p>
          </div>
        </div>
        <button
          type="button"
          class="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          aria-label="Tutup pembantu"
          @click="open = false"
        >
          <X class="h-5 w-5" />
        </button>
      </div>

      <!-- Messages -->
      <div ref="scrollEl" class="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-3 py-3 dark:bg-slate-900/40">
        <div v-for="(turn, idx) in messages" :key="idx" class="flex" :class="turn.role === 'user' ? 'justify-end' : 'justify-start'">
          <p
            class="max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm"
            :class="turn.role === 'user'
              ? 'rounded-br-sm bg-[var(--accent-600)] text-white'
              : 'rounded-bl-sm border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'"
          >
            {{ turn.content }}
          </p>
        </div>
        <div v-if="sending" class="flex justify-start">
          <p class="rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3 py-2 text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500">Menaip…</p>
        </div>

        <!-- Suggestions (only before the user has asked anything) -->
        <div v-if="messages.length === 1 && !sending" class="flex flex-wrap gap-1.5 pt-1">
          <button
            v-for="s in SUGGESTIONS"
            :key="s"
            class="rounded-full border border-[var(--accent-200)] bg-white px-2.5 py-1 text-[11px] font-medium text-[var(--accent-700)] transition-colors hover:bg-[var(--accent-50)] dark:bg-slate-800"
            @click="send(s)"
          >
            {{ s }}
          </button>
        </div>
      </div>

      <!-- Input -->
      <form class="flex items-center gap-2 border-t border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800" @submit.prevent="send()">
        <input
          v-model="input"
          type="text"
          placeholder="Taip soalan anda…"
          class="min-w-0 flex-1 rounded-full border border-slate-300 px-3 py-2 text-sm focus:border-[var(--accent-500)] focus:outline-hidden focus:ring-1 focus:ring-[var(--accent-ring)] dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          :disabled="sending"
        />
        <button
          type="submit"
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent-600)] text-white transition hover:bg-[var(--accent-700)] disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-600"
          :disabled="!canSend"
          aria-label="Hantar"
        >
          <Send class="h-4 w-4" />
        </button>
      </form>
    </div>

    <!-- Floating action button -->
    <button
      type="button"
      class="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-600)] text-white shadow-lg transition-colors hover:bg-[var(--accent-700)]"
      :aria-label="open ? 'Tutup pembantu' : 'Buka pembantu'"
      @click="toggle"
    >
      <X v-if="open" class="h-6 w-6" />
      <MessageCircle v-else class="h-6 w-6" />
    </button>
  </div>
</template>
