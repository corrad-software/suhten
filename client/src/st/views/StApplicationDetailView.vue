<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft, Award, BadgeCheck, Building2, FileText, History, Receipt, ShieldCheck, UserCheck, Wrench } from "lucide-vue-next";

import { getStaffTaskNotifyState } from "@/api/st-registration";
import { useLocale } from "@/composables/useLocale";
import { useStWorkflowStore } from "../stores/workflow";
import { useStRegistrationStore } from "../stores/registration";
import { competencyMeta, contractorClassMeta } from "../mock/competencies";
import { contractorKindMeta, type ContractorKind } from "../registration/ce-rules";
import { PLACE_RESTRICTIONS, VOLTAGE_RESTRICTIONS } from "../registration/ok-rules";
import { workflowLabel } from "../status";
import StatusBadge from "../components/StatusBadge.vue";
import SlaIndicator from "../components/SlaIndicator.vue";
import WorkflowStepper from "../components/WorkflowStepper.vue";
import StPageHero from "../components/StPageHero.vue";
import AuditTrailTimeline from "../components/AuditTrailTimeline.vue";
import ApplicationActionBar from "../components/ApplicationActionBar.vue";

const route = useRoute();
const router = useRouter();
const { ts, locale } = useLocale();
const workflow = useStWorkflowStore();
const regStore = useStRegistrationStore();

const app = computed(() => workflow.byId(String(route.params.id)));
const isCe = computed(() => app.value?.workflowType === "CE");

const okCompetency = computed(() => {
  const a = app.value;
  if (!a || a.workflowType !== "OK") return undefined;
  if (a.competencyCertificate) return a.competencyCertificate;
  // Fallback: registration store twin (same code) when workflow mapping is sparse.
  const twin = regStore.byId(a.id);
  const cert = twin?.detail?.certificate;
  if (!cert) return undefined;
  return {
    certificateNo: cert.certificateNo,
    category: cert.category || a.competencyCategory || twin.categoryOrClass,
    voltageRestriction: cert.voltageRestriction,
    placeRestriction: cert.placeRestriction,
    active: cert.active,
    suspended: cert.suspended,
  };
});

function voltageLabel(code?: string): string {
  const row = VOLTAGE_RESTRICTIONS.find((v) => v.code === code);
  if (!row) return code || "—";
  return locale.value === "bi" ? row.bi : row.bm;
}

function placeLabel(code?: string): string {
  const row = PLACE_RESTRICTIONS.find((v) => v.code === code);
  if (!row) return code || "—";
  return locale.value === "bi" ? row.bi : row.bm;
}

const STAGE_BY_ROLE: Record<string, string> = {
  sos: "sos_review",
  sos_ce: "sos_review",
  technical: "technical_review",
  technical_ce: "technical_review",
  approver: "pending_approval",
};

/** Heal mock status from email deep-link (?stage=) or last server notify. */
async function applyEmailStageSync() {
  const id = String(route.params.id ?? "");
  if (!id) return;

  const stageFromQuery = typeof route.query.stage === "string" ? route.query.stage : "";
  if (stageFromQuery) {
    // Heal stale mock stage only — claim stays in Peti Tugasan (FIFO).
    workflow.syncFromEmailStage(id, stageFromQuery);
    return;
  }

  try {
    const res = await getStaffTaskNotifyState(id);
    const role = res.data?.role;
    const stage = role ? STAGE_BY_ROLE[role] : undefined;
    if (stage) workflow.syncFromEmailStage(id, stage);
  } catch {
    // Optional — ignore if unauthenticated or no notify recorded.
  }
}

onMounted(() => {
  void (async () => {
    await workflow.syncFromApi();
    void regStore.fetchFromApi();
    await applyEmailStageSync();
  })();
});

watch(
  () => [route.params.id, route.query.stage],
  () => {
    void applyEmailStageSync();
  },
);

const categoryLine = computed(() => {
  const a = app.value;
  if (!a) return "";
  if (a.workflowType === "OK") {
    const code = a.competencyCategory ?? (okCompetency.value?.category as typeof a.competencyCategory);
    if (code) {
      const m = competencyMeta(code);
      return `${m.code} — ${m.label}`;
    }
    if (okCompetency.value?.category) return okCompetency.value.category;
  }
  if (a.workflowType === "CE" && a.contractorClass) {
    const m = contractorClassMeta(a.contractorClass);
    return `${m.label} · ${m.ceilingLabel}`;
  }
  return "";
});

/** Prefer RG-CE registration twin (same company / SSM) when present for full Bahagian A–F. */
const regTwin = computed(() => {
  const a = app.value;
  if (!a || a.workflowType !== "CE") return undefined;
  const company = a.employer?.name?.trim().toLowerCase();
  const ssm = a.employer?.registrationNo?.trim().toLowerCase();
  return regStore.applications.find((r) => {
    if (r.moduleCode !== "RG-CE") return false;
    const ce = (r.detail?.ce ?? {}) as Record<string, unknown>;
    const names = [r.applicantName, typeof ce.companyName === "string" ? ce.companyName : ""]
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    const regs = [r.identityNo, typeof ce.companyRegNo === "string" ? ce.companyRegNo : ""]
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    return (company != null && names.includes(company)) || (ssm != null && regs.includes(ssm));
  });
});

const ce = computed(() => {
  const a = app.value;
  if (!a || a.workflowType !== "CE") return {} as Record<string, unknown>;

  const emp = a.employer;
  const cls = a.contractorClass ?? "C";
  const fallback: Record<string, unknown> = {
    contractorKind: "electrical",
    contractorClass: cls,
    voltage: cls === "A" ? "33kV" : "415V",
    companyName: emp?.name ?? a.applicant.fullName,
    companyRegNo: emp?.registrationNo ?? "—",
    companyAddress: emp?.address ?? a.applicant.address,
    postcode: "",
    city: emp?.city,
    state: emp?.state,
    companyPhone: emp?.phone ?? a.applicant.phone,
    companyFax: emp?.id === "emp-tenaga-murni" ? "03-5511 2244" : emp?.id === "emp-elektrik-maju" ? "03-7788 4466" : "",
    companyEmail: emp?.email ?? a.applicant.email,
    representativeName: a.applicant.fullName,
    representativeIc: a.applicant.icNumber,
    directors: [
      {
        name: a.applicant.fullName,
        icNumber: a.applicant.icNumber,
        address: emp?.address ?? a.applicant.address,
        sharePercent: 100,
      },
    ],
    appointedOks: (a.appointedOks ?? []).map((o) => ({
      name: o.name,
      wirerType: o.wirerType,
      mykad: o.mykad,
      certificateNo: `OK-E/${o.wirerType}/2024/00821`,
      periodYears: a.registrationPeriodYears,
    })),
    skilledPersons: [],
    professionalEngineers: [],
    equipment: [
      {
        equipmentType: "insulation_tester",
        brand: "fluke",
        model: "1507",
        serialNo: `INS-${a.refNo.slice(-5)}`,
      },
      {
        equipmentType: "earth_tester",
        brand: "megger",
        model: "DET3TD",
        serialNo: `EAR-${a.refNo.slice(-5)}`,
      },
    ],
  };

  const fromReg = (regTwin.value?.detail?.ce ?? null) as Record<string, unknown> | null;
  if (!fromReg || !Object.keys(fromReg).length) return fallback;

  const merged = { ...fallback, ...fromReg };
  for (const key of ["directors", "appointedOks", "equipment"] as const) {
    const cur = merged[key];
    if (!Array.isArray(cur) || cur.length === 0) merged[key] = fallback[key];
  }
  for (const key of ["voltage", "companyAddress", "companyPhone", "companyFax", "city", "state", "postcode"] as const) {
    if (!merged[key]) merged[key] = fallback[key];
  }
  return merged;
});

const directors = computed(() => (Array.isArray(ce.value.directors) ? ce.value.directors : []) as Array<Record<string, unknown>>);
const oks = computed(() => {
  if (Array.isArray(ce.value.appointedOks) && ce.value.appointedOks.length) {
    return ce.value.appointedOks as Array<Record<string, unknown>>;
  }
  return (app.value?.appointedOks ?? []).map((o) => ({
    name: o.name,
    wirerType: o.wirerType,
    mykad: o.mykad,
    certificateNo: `OK-E/${o.wirerType}/2024/00821`,
    periodYears: app.value?.registrationPeriodYears,
  }));
});
const equipment = computed(() => (Array.isArray(ce.value.equipment) ? ce.value.equipment : []) as Array<Record<string, unknown>>);

const companyAddressLine = computed(() => {
  const street = typeof ce.value.companyAddress === "string" ? ce.value.companyAddress.trim() : "";
  const postcode = typeof ce.value.postcode === "string" ? ce.value.postcode.trim() : "";
  const city = typeof ce.value.city === "string" ? ce.value.city.trim() : "";
  const state = typeof ce.value.state === "string" ? ce.value.state.trim() : "";
  const locality = [postcode, city].filter(Boolean).join(" ");
  const parts = [street, [locality, state].filter(Boolean).join(", ")].filter(Boolean);
  return parts.length ? parts.join(" · ") : "—";
});

const periodYears = computed(() => regTwin.value?.detail?.periodYears ?? app.value?.registrationPeriodYears ?? "—");

function kindLabel(code?: unknown): string {
  if (typeof code !== "string") return "—";
  const k = contractorKindMeta(code as ContractorKind);
  return locale.value === "bi" ? k.bi : k.bm;
}

function fmt(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("ms-MY", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const portalBase = computed(() => (route.path.startsWith("/admin/st") ? "/admin/st" : "/st"));
</script>

<template>
  <div v-if="app" class="space-y-10">
    <button
      class="flex items-center gap-1.5 rounded-md border border-black px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-black/5 dark:border-slate-500 dark:text-slate-200 dark:hover:bg-white/5"
      @click="router.back()"
    >
      <ArrowLeft class="h-4 w-4" /> Kembali
    </button>

    <!-- Header -->
    <StPageHero
      :eyebrow="app.refNo"
      :title="isCe ? ts('st.ceDetail.title') : workflowLabel(app.workflowType)"
      :subtitle="`${categoryLine} · ${app.registrationPeriodYears} tahun`"
    >
      <template #action>
        <div class="flex flex-col items-end gap-2">
          <StatusBadge :status="app.status" />
          <SlaIndicator v-if="app.slaTargetHours > 0" :stage-entered-at="app.stageEnteredAt" :target-hours="app.slaTargetHours" :role="app.assignedRole" />
        </div>
      </template>
      <div class="mt-5 overflow-x-auto pb-1">
        <WorkflowStepper :status="app.status" />
      </div>
    </StPageHero>

    <!-- Action bar -->
    <div class="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-800 dark:bg-rose-500/10">
      <div class="flex flex-wrap items-center justify-end gap-3">
        <p class="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">Tindakan</p>
        <ApplicationActionBar :application="app" />
      </div>
      <p class="mt-2 text-right text-xs text-slate-500 dark:text-slate-400" v-if="app.status === 'certificate_issued'">Permohonan selesai. Sijil digital telah dikeluarkan.</p>
    </div>

    <!-- CE: contractor company detail (same fields as modul Permohonan) -->
    <template v-if="isCe">
      <div class="grid gap-5 lg:grid-cols-2">
        <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 class="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <Building2 class="h-4 w-4 text-slate-400 dark:text-slate-500" />
            {{ ts("st.ceApply.stepA") }} / {{ ts("st.ceApply.stepB") }}
          </h2>
          <dl class="grid gap-2 text-sm sm:grid-cols-2">
            <div><dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.ceApply.kind") }}</dt><dd>{{ kindLabel(ce.contractorKind) }}</dd></div>
            <div><dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.ceApply.class") }}</dt><dd>{{ ce.contractorClass ?? app.contractorClass ?? "—" }}</dd></div>
            <div><dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.ceApply.voltage") }}</dt><dd>{{ ce.voltage || "—" }}</dd></div>
            <div><dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.ceApply.period") }}</dt><dd>{{ periodYears }}</dd></div>
            <div class="sm:col-span-2">
              <dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.ceApply.companyName") }}</dt>
              <dd class="font-medium">{{ ce.companyName || app.employer?.name || "—" }}</dd>
            </div>
            <div>
              <dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.ceApply.companyReg") }}</dt>
              <dd class="font-mono text-xs">{{ ce.companyRegNo || app.employer?.registrationNo || "—" }}</dd>
            </div>
            <div>
              <dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.ceApply.companyPhone") }}</dt>
              <dd>{{ ce.companyPhone || app.employer?.phone || "—" }}</dd>
            </div>
            <div>
              <dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.ceApply.companyFax") }}</dt>
              <dd>{{ ce.companyFax || "—" }}</dd>
            </div>
            <div class="sm:col-span-2">
              <dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.ceApply.companyAddress") }}</dt>
              <dd>{{ companyAddressLine }}</dd>
            </div>
            <div>
              <dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.ceApply.repName") }}</dt>
              <dd>{{ ce.representativeName || app.applicant.fullName }}</dd>
            </div>
            <div>
              <dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.ceApply.repIc") }}</dt>
              <dd class="font-mono text-xs">{{ ce.representativeIc || app.applicant.icNumber || "—" }}</dd>
            </div>
          </dl>
          <div v-if="app.identityCheck" class="mt-3 flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
            <ShieldCheck class="h-4 w-4" />
            Identiti disahkan (JPN — {{ app.identityCheck.jpnStatus === "alive" ? "masih hidup" : app.identityCheck.jpnStatus }}) · {{ fmt(app.identityCheck.checkedAt) }}
          </div>
        </section>

        <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 class="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Jejak proses</h2>
          <ol class="space-y-3">
            <li v-for="ev in app.auditTrail" :key="ev.id" class="border-l-2 border-slate-200 pl-3 dark:border-slate-700">
              <p class="text-sm font-medium text-slate-800 dark:text-slate-200">{{ ev.action }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ ev.actorName }} · {{ fmt(ev.at) }}</p>
            </li>
            <li v-if="!app.auditTrail.length" class="text-sm text-slate-400 dark:text-slate-500">—</li>
          </ol>
        </section>
      </div>

      <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 class="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">{{ ts("st.ceApply.directors") }}</h2>
        <ul class="divide-y divide-slate-50 text-sm dark:divide-slate-800">
          <li v-for="(d, i) in directors" :key="i" class="py-2">
            <span class="font-medium">{{ d.name }}</span>
            <span class="ml-2 font-mono text-xs text-slate-500 dark:text-slate-400">{{ d.icNumber }}</span>
            <span v-if="d.sharePercent != null" class="ml-2 text-xs text-slate-400 dark:text-slate-500">{{ d.sharePercent }}%</span>
            <p v-if="d.address" class="text-xs text-slate-500 dark:text-slate-400">{{ d.address }}</p>
          </li>
          <li v-if="!directors.length" class="py-2 text-slate-400 dark:text-slate-500">—</li>
        </ul>
      </section>

      <div class="grid gap-5 lg:grid-cols-2">
        <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 class="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <UserCheck class="h-4 w-4 text-slate-400 dark:text-slate-500" />
            {{ ts("st.ceApply.stepC") }}
          </h2>
          <ul class="space-y-2 text-sm">
            <li v-for="(o, i) in oks" :key="'ok' + i" class="rounded-md border border-slate-100 px-3 py-2 dark:border-slate-800">
              <p class="font-medium">{{ o.name }} <span class="text-xs text-slate-500 dark:text-slate-400">({{ o.wirerType }})</span></p>
              <p class="font-mono text-xs text-slate-500 dark:text-slate-400">{{ o.mykad }} · {{ o.certificateNo }} · {{ o.periodYears }}y</p>
            </li>
            <li v-if="!oks.length" class="text-slate-400 dark:text-slate-500">—</li>
          </ul>
        </section>

        <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 class="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <Wrench class="h-4 w-4 text-slate-400 dark:text-slate-500" />
            {{ ts("st.ceApply.equipment") }}
          </h2>
          <ul class="space-y-2 text-sm">
            <li v-for="(eq, i) in equipment" :key="i" class="rounded-md border border-slate-100 px-3 py-2 dark:border-slate-800">
              <p class="font-medium">{{ eq.equipmentType }} · {{ eq.brand }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ eq.model }} · S/N {{ eq.serialNo }}</p>
            </li>
            <li v-if="!equipment.length" class="text-slate-400 dark:text-slate-500">—</li>
          </ul>
        </section>
      </div>
    </template>

    <!-- OK: person + competency + employer -->
    <template v-else>
      <div class="grid gap-8 md:grid-cols-2">
        <div>
          <h2 class="mb-3 flex items-center gap-2 border-b border-slate-200 pb-2 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-100"><UserCheck class="h-4 w-4 text-slate-400 dark:text-slate-500" /> Maklumat Pemohon</h2>
          <dl class="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            <div class="sm:col-span-2">
              <dt class="mb-0.5 text-xs text-slate-400 dark:text-slate-500">Nama</dt>
              <dd class="font-medium text-slate-800 dark:text-slate-200">{{ app.applicant.fullName }}</dd>
            </div>
            <div>
              <dt class="mb-0.5 text-xs text-slate-400 dark:text-slate-500">No. KP</dt>
              <dd class="font-mono text-slate-800 dark:text-slate-200">{{ app.applicant.icNumber }}</dd>
            </div>
            <div>
              <dt class="mb-0.5 text-xs text-slate-400 dark:text-slate-500">Umur</dt>
              <dd class="text-slate-800 dark:text-slate-200">{{ app.applicant.age }} tahun</dd>
            </div>
            <div>
              <dt class="mb-0.5 text-xs text-slate-400 dark:text-slate-500">Telefon</dt>
              <dd class="text-slate-800 dark:text-slate-200">{{ app.applicant.phone || "—" }}</dd>
            </div>
            <div class="min-w-0">
              <dt class="mb-0.5 text-xs text-slate-400 dark:text-slate-500">E-mel</dt>
              <dd class="truncate text-slate-800 dark:text-slate-200">{{ app.applicant.email || "—" }}</dd>
            </div>
          </dl>

          <div v-if="app.identityCheck" class="mt-4 flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
            <ShieldCheck class="h-4 w-4 shrink-0" />
            Identiti disahkan (JPN — {{ app.identityCheck.jpnStatus === 'alive' ? 'masih hidup' : app.identityCheck.jpnStatus }}) · {{ fmt(app.identityCheck.checkedAt) }}
          </div>
        </div>

        <div>
          <h2 class="mb-3 flex items-center gap-2 border-b border-slate-200 pb-2 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-100">
            <Award class="h-4 w-4 text-slate-400 dark:text-slate-500" /> Maklumat Kekompetenan
          </h2>
          <dl class="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            <div class="sm:col-span-2">
              <dt class="mb-0.5 text-xs text-slate-400 dark:text-slate-500">{{ ts("st.common.category") }}</dt>
              <dd class="font-medium text-slate-800 dark:text-slate-200">{{ categoryLine || okCompetency?.category || "—" }}</dd>
            </div>
            <div>
              <dt class="mb-0.5 text-xs text-slate-400 dark:text-slate-500">{{ ts("st.okApply.certNo") }}</dt>
              <dd class="font-mono text-xs text-slate-800 dark:text-slate-200">{{ okCompetency?.certificateNo || "—" }}</dd>
            </div>
            <div>
              <dt class="mb-0.5 text-xs text-slate-400 dark:text-slate-500">{{ ts("st.okApply.period") }}</dt>
              <dd class="text-slate-800 dark:text-slate-200">{{ ts("st.okApply.periodYear", { n: app.registrationPeriodYears }) }}</dd>
            </div>
            <div>
              <dt class="mb-0.5 text-xs text-slate-400 dark:text-slate-500">{{ ts("st.okApply.voltage") }}</dt>
              <dd class="text-slate-800 dark:text-slate-200">{{ voltageLabel(okCompetency?.voltageRestriction) }}</dd>
            </div>
            <div>
              <dt class="mb-0.5 text-xs text-slate-400 dark:text-slate-500">{{ ts("st.okApply.place") }}</dt>
              <dd class="text-slate-800 dark:text-slate-200">{{ placeLabel(okCompetency?.placeRestriction) }}</dd>
            </div>
            <div v-if="okCompetency" class="sm:col-span-2">
              <dt class="mb-0.5 text-xs text-slate-400 dark:text-slate-500">Status perakuan</dt>
              <dd>
                <span v-if="okCompetency.suspended" class="text-rose-600 dark:text-rose-400">Digantung</span>
                <span v-else-if="okCompetency.active === false" class="text-amber-600 dark:text-amber-400">Tidak aktif</span>
                <span v-else class="text-emerald-700 dark:text-emerald-400">Aktif</span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div v-if="app.employer">
        <h2 class="mb-3 flex items-center gap-2 border-b border-slate-200 pb-2 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-100"><Building2 class="h-4 w-4 text-slate-400 dark:text-slate-500" /> Majikan</h2>
        <dl class="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <div>
            <dt class="mb-0.5 text-xs text-slate-400 dark:text-slate-500">Nama</dt>
            <dd class="font-medium text-slate-800 dark:text-slate-200">{{ app.employer.name }}</dd>
          </div>
          <div>
            <dt class="mb-0.5 text-xs text-slate-400 dark:text-slate-500">No. Pendaftaran</dt>
            <dd class="font-mono text-xs text-slate-800 dark:text-slate-200">{{ app.employer.registrationNo }}</dd>
          </div>
          <div>
            <dt class="mb-0.5 text-xs text-slate-400 dark:text-slate-500">Pegawai Dihubungi</dt>
            <dd class="text-slate-800 dark:text-slate-200">{{ app.employer.contactPerson }}</dd>
          </div>
          <div v-if="app.employer.address" class="sm:col-span-2">
            <dt class="mb-0.5 text-xs text-slate-400 dark:text-slate-500">Alamat</dt>
            <dd class="text-slate-800 dark:text-slate-200">{{ app.employer.address }}</dd>
          </div>
        </dl>
      </div>
    </template>

    <!-- Documents -->
    <div>
      <h2 class="mb-3 flex items-center gap-2 border-b border-slate-200 pb-2 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-100"><FileText class="h-4 w-4 text-slate-400 dark:text-slate-500" /> Dokumen Sokongan</h2>
      <p v-if="app.documents.length === 0" class="text-sm text-slate-400 dark:text-slate-500">Tiada dokumen dimuat naik.</p>
      <ul v-else>
        <li v-for="d in app.documents" :key="d.id" class="flex items-center justify-between border-b border-slate-100 py-2 text-sm last:border-0 dark:border-slate-800">
          <span class="text-slate-700 dark:text-slate-300">{{ d.label }}</span>
          <span class="font-mono text-xs text-slate-500 dark:text-slate-400">{{ d.fileName }} · {{ d.sizeKb }} KB</span>
        </li>
      </ul>
    </div>

    <!-- Payments -->
    <div v-if="app.payments.length">
      <h2 class="mb-3 flex items-center gap-2 border-b border-slate-200 pb-2 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-100"><Receipt class="h-4 w-4 text-slate-400 dark:text-slate-500" /> Pembayaran</h2>
      <ul>
        <li v-for="p in app.payments" :key="p.id" class="flex items-center justify-between border-b border-slate-100 py-2 text-sm last:border-0 dark:border-slate-800">
          <span class="text-slate-700 dark:text-slate-300">{{ p.kind === 'processing' ? 'Yuran Pemprosesan' : 'Yuran Pendaftaran' }} <span class="text-xs text-slate-400 dark:text-slate-500">· {{ p.receiptNo }}</span></span>
          <span class="font-medium text-slate-800 dark:text-slate-200">RM {{ p.amount.toFixed(2) }}</span>
        </li>
      </ul>
    </div>

    <!-- Certificate & receipt links -->
    <div v-if="app.status === 'certificate_issued' || app.payments.length" class="grid gap-3 sm:grid-cols-2">
      <button
        v-if="app.payments.length"
        class="flex w-full items-center justify-between rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-4 text-left shadow-sm hover:from-emerald-100 dark:border-emerald-800 dark:from-emerald-500/10 dark:to-slate-800 dark:hover:from-emerald-500/20"
        @click="router.push(`${portalBase}/applications/${app.id}/receipt`)"
      >
        <span class="flex items-center gap-3">
          <Receipt class="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          <span>
            <span class="block text-sm font-semibold text-slate-800 dark:text-slate-200">Resit Pembayaran</span>
            <span class="block text-xs text-slate-500 dark:text-slate-400">{{ app.payments.length }} resit · muat turun / cetak</span>
          </span>
        </span>
        <span class="text-sm font-medium text-emerald-700 dark:text-emerald-400">Buka →</span>
      </button>

      <button
        v-if="app.status === 'certificate_issued'"
        class="flex w-full items-center justify-between rounded-xl border border-[var(--accent-200)] bg-gradient-to-r from-[var(--accent-50)] to-white p-4 text-left shadow-sm hover:from-[var(--accent-100)] dark:to-slate-800"
        @click="router.push(`${portalBase}/applications/${app.id}/certificate`)"
      >
        <span class="flex items-center gap-3">
          <BadgeCheck class="h-6 w-6 text-[var(--accent-600)]" />
          <span>
            <span class="block text-sm font-semibold text-slate-800 dark:text-slate-200">Sijil Digital Tersedia</span>
            <span class="block text-xs text-slate-500 dark:text-slate-400">Lihat sijil dengan kod QR & trustmark</span>
          </span>
        </span>
        <span class="text-sm font-medium text-[var(--accent-700)]">Buka →</span>
      </button>
    </div>

    <!-- Audit trail -->
    <div>
      <h2 class="mb-3 flex items-center gap-2 border-b border-slate-200 pb-2 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-100"><History class="h-4 w-4 text-slate-400 dark:text-slate-500" /> Jejak Audit</h2>
      <AuditTrailTimeline :entries="app.auditTrail" />
    </div>
  </div>

  <div v-else class="mx-auto max-w-md py-16 text-center">
    <p class="text-slate-500 dark:text-slate-400">Permohonan tidak dijumpai.</p>
    <button class="mt-3 text-sm font-medium text-[var(--accent-700)] hover:underline" @click="router.push(`${portalBase}/dashboard`)">Kembali ke papan pemuka</button>
  </div>
</template>
