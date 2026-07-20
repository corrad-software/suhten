import { createRouter, createWebHistory } from "vue-router";
import type { RouteLocationGeneric, RouteRecordRaw } from "vue-router";

import DashboardView from "@/views/DashboardView.vue";
import MainDashboardView from "@/views/MainDashboardView.vue";
import KitchenChartsView from "@/views/KitchenChartsView.vue";
import KitchenFormsView from "@/views/KitchenFormsView.vue";
import LoginView from "@/views/LoginView.vue";
import MediaLibraryView from "@/views/MediaLibraryView.vue";
import KitchenSinkView from "@/views/KitchenSinkView.vue";
import PageEditorView from "@/views/PageEditorView.vue";
import PagesListView from "@/views/PagesListView.vue";
import PostEditorView from "@/views/PostEditorView.vue";
import PostsListView from "@/views/PostsListView.vue";
import CategoriesListView from "@/views/CategoriesListView.vue";
import CategoryEditorView from "@/views/CategoryEditorView.vue";
import DatabaseSchemaView from "@/views/DatabaseSchemaView.vue";
import DevelopersGuideView from "@/views/DevelopersGuideView.vue";
import ApiManagementView from "@/views/ApiManagementView.vue";
import MenusView from "@/views/MenusView.vue";
import StorefrontMenuView from "@/views/StorefrontMenuView.vue";
import WebfrontSettingsView from "@/views/WebfrontSettingsView.vue";
import AuditLogsView from "@/views/AuditLogsView.vue";
import QueueMonitorView from "@/views/QueueMonitorView.vue";
import ComingSoonView from "@/views/ComingSoonView.vue";
import RolesView from "@/views/RolesView.vue";
import SettingsView from "@/views/SettingsView.vue";
import SystemInfoView from "@/views/SystemInfoView.vue";
import UsersView from "@/views/UsersView.vue";
import UserEditView from "@/views/UserEditView.vue";
import WorkflowsListView from "@/views/workflows/WorkflowsListView.vue";
import WorkflowEditorView from "@/views/workflows/WorkflowEditorView.vue";
import WorkflowInstancesView from "@/views/workflows/WorkflowInstancesView.vue";
import StorefrontHomeView from "@/views/StorefrontHomeView.vue";
import StorefrontPageView from "@/views/StorefrontPageView.vue";
import AdminLayoutShell from "@/layouts/AdminLayoutShell.vue";
import { useAuthStore } from "@/stores/auth";
import { useSiteStore } from "@/stores/site";

// ── Suruhanjaya Tenaga (ST) — Appendix D11 prototype ──
import StPortalLayout from "@/st/components/StPortalLayout.vue";
import StLoginView from "@/st/views/StLoginView.vue";
import StDashboardView from "@/st/views/StDashboardView.vue";
import StInboxView from "@/st/views/StInboxView.vue";
import StApplicationListView from "@/st/views/StApplicationListView.vue";
import ApplicationFormView from "@/st/views/ApplicationFormView.vue";
import StApplicationDetailView from "@/st/views/StApplicationDetailView.vue";
import FpxPaymentView from "@/st/views/FpxPaymentView.vue";
import CertificateView from "@/st/views/CertificateView.vue";
import StNotificationsView from "@/st/views/StNotificationsView.vue";
import StSearchView from "@/st/views/StSearchView.vue";
import AinaUserChatView from "@/st/views/aina/AinaUserChatView.vue";
import StComingSoonView from "@/st/views/StComingSoonView.vue";
import StRegApplicationsView from "@/st/views/registration/StRegApplicationsView.vue";
import StRegReviewView from "@/st/views/registration/StRegReviewView.vue";
import StRegComplianceView from "@/st/views/registration/StRegComplianceView.vue";
import StRegReportsView from "@/st/views/registration/StRegReportsView.vue";
import StOkElectricApplyView from "@/st/views/registration/StOkElectricApplyView.vue";
import StOkElectricDetailView from "@/st/views/registration/StOkElectricDetailView.vue";
import StContractorElectricApplyView from "@/st/views/registration/StContractorElectricApplyView.vue";
import StContractorElectricDetailView from "@/st/views/registration/StContractorElectricDetailView.vue";
import StServiceWorkspaceView from "@/st/views/workspace/StServiceWorkspaceView.vue";
import StOpsWorkspaceView from "@/st/views/workspace/StOpsWorkspaceView.vue";
import StAnalyticsWorkspaceView from "@/st/views/workspace/StAnalyticsWorkspaceView.vue";
import StAdminWorkspaceView from "@/st/views/workspace/StAdminWorkspaceView.vue";
import { staffMenuLeafRoutes } from "@/st/config/staff-menu";
import {
  ADMIN_SCREENS,
  ANALYTICS_SCREENS,
  OPS_MODULES,
  SERVICE_MODULES,
  workspaceImplementedPaths,
  type OpsModuleCode,
  type ServiceModuleCode,
  type ServiceScreen,
} from "@/st/modules/catalog";
import { useStSessionStore } from "@/st/stores/session";

/** Paths with real views — exclude from Coming Soon placeholders. */
const ST_PHASE2_IMPLEMENTED = new Set([
  "dashboard",
  "inbox",
  "notifications",
  "search",
  "aina",
  "registration/ok-electric/applications",
  "registration/ok-electric/review",
  "registration/ok-electric/compliance",
  "registration/ok-electric/reports",
  "registration/ok-gas/applications",
  "registration/ok-gas/review",
  "registration/ok-gas/compliance",
  "registration/ok-gas/reports",
  "registration/contractor-electric/applications",
  "registration/contractor-electric/review",
  "registration/contractor-electric/compliance",
  "registration/contractor-electric/reports",
  "registration/contractor-gas/applications",
  "registration/contractor-gas/review",
  "registration/contractor-gas/compliance",
  "registration/contractor-gas/reports",
  ...workspaceImplementedPaths(),
]);

const REG_MODULE_META = [
  { path: "registration/ok-electric", code: "RG-KE", title: "OK Elektrik" },
  { path: "registration/ok-gas", code: "RG-KG", title: "OK Gas" },
  { path: "registration/contractor-electric", code: "RG-CE", title: "Kontraktor Elektrik" },
  { path: "registration/contractor-gas", code: "RG-CG", title: "Kontraktor Gas" },
] as const;

function registrationRoutes(prefix: "st" | "admin-st"): RouteRecordRaw[] {
  const base = prefix === "admin-st" ? "/admin/st" : "/st";
  const routes: RouteRecordRaw[] = [];

  // Module-owned apply + detail (RG-KE / RG-CE)
  routes.push(
    {
      path: "registration/ok-electric/applications/new",
      name: `${prefix}-registration-ok-electric-applications-new`,
      component: StOkElectricApplyView,
      meta: {
        requiresAuth: prefix === "admin-st",
        title: "Permohonan Baharu OK Elektrik — ST",
        moduleCode: "RG-KE",
        phase: 1,
      },
    },
    {
      path: "registration/ok-electric/applications/:id",
      name: `${prefix}-registration-ok-electric-applications-detail`,
      component: StOkElectricDetailView,
      meta: {
        requiresAuth: prefix === "admin-st",
        title: "Butiran Permohonan OK Elektrik — ST",
        moduleCode: "RG-KE",
        phase: 1,
      },
    },
    {
      path: "registration/contractor-electric/applications/new",
      name: `${prefix}-registration-contractor-electric-applications-new`,
      component: StContractorElectricApplyView,
      meta: {
        requiresAuth: prefix === "admin-st",
        title: "Permohonan Baharu Kontraktor Elektrik — ST",
        moduleCode: "RG-CE",
        phase: 1,
      },
    },
    {
      path: "registration/contractor-electric/applications/:id",
      name: `${prefix}-registration-contractor-electric-applications-detail`,
      component: StContractorElectricDetailView,
      meta: {
        requiresAuth: prefix === "admin-st",
        title: "Butiran Permohonan Kontraktor Elektrik — ST",
        moduleCode: "RG-CE",
        phase: 1,
      },
    },
  );

  for (const mod of REG_MODULE_META) {
    const children: Array<{ suffix: string; component: typeof StRegApplicationsView; titleSuffix: string }> = [
      { suffix: "applications", component: StRegApplicationsView, titleSuffix: "Permohonan" },
      { suffix: "review", component: StRegReviewView, titleSuffix: "Semakan" },
      { suffix: "compliance", component: StRegComplianceView, titleSuffix: "Pematuhan" },
      { suffix: "reports", component: StRegReportsView, titleSuffix: "Laporan" },
    ];
    for (const child of children) {
      const fullPath = `${mod.path}/${child.suffix}`;
      routes.push({
        path: fullPath,
        name: `${prefix}-${fullPath.replace(/\//g, "-")}`,
        component: child.component,
        meta: {
          requiresAuth: prefix === "admin-st",
          title: `${mod.title} — ${child.titleSuffix} — ST`,
          moduleCode: mod.code,
          phase: 1,
        },
      });
    }
    routes.push({
      path: mod.path,
      redirect: `${base}/${mod.path}/applications`,
    });
  }
  return routes;
}

function serviceWorkspaceRoutes(prefix: "st" | "admin-st"): RouteRecordRaw[] {
  const base = prefix === "admin-st" ? "/admin/st" : "/st";
  const routes: RouteRecordRaw[] = [];
  const screens: ServiceScreen[] = ["applications", "review", "compliance", "reports"];

  for (const mod of Object.values(SERVICE_MODULES)) {
    const rel = mod.basePath.replace(/^\/st\//, "");
    for (const screen of screens) {
      const fullPath = `${rel}/${screen}`;
      routes.push({
        path: fullPath,
        name: `${prefix}-${fullPath.replace(/\//g, "-")}`,
        component: StServiceWorkspaceView,
        meta: {
          requiresAuth: prefix === "admin-st",
          title: `${mod.code} — ${screen} — ST`,
          moduleCode: mod.code as ServiceModuleCode,
          phase: mod.phase,
          serviceScreen: screen,
        },
      });
    }
    routes.push({
      path: rel,
      redirect: `${base}/${rel}/applications`,
    });
  }
  return routes;
}

function opsWorkspaceRoutes(prefix: "st" | "admin-st"): RouteRecordRaw[] {
  const base = prefix === "admin-st" ? "/admin/st" : "/st";
  const routes: RouteRecordRaw[] = [];

  const leaves: Array<{ code: OpsModuleCode; leaf: string; opsScreen: string; title: string }> = [
    { code: "PE-ID", leaf: "public-users", opsScreen: "public-users", title: "Pengguna Awam" },
    { code: "PE-ID", leaf: "staff", opsScreen: "staff", title: "Kakitangan ST" },
    { code: "PE-ID", leaf: "organisations", opsScreen: "organisations", title: "Entiti Perniagaan" },
    { code: "PE-ID", leaf: "access", opsScreen: "access", title: "Pengurusan Akses" },
    { code: "PE-RV", leaf: "payments", opsScreen: "payments", title: "Bayaran & Resit" },
    { code: "PE-RV", leaf: "reconciliation", opsScreen: "reconciliation", title: "Rekonsiliasi" },
    { code: "PE-RV", leaf: "reports", opsScreen: "revenue-reports", title: "Laporan Hasil" },
    { code: "PE-SV", leaf: "schedule", opsScreen: "schedule", title: "Penjadualan" },
    { code: "PE-SV", leaf: "inspections", opsScreen: "inspections", title: "Pemeriksaan" },
    { code: "PE-SV", leaf: "reports", opsScreen: "visit-reports", title: "Laporan Lawatan" },
    { code: "PE-JK", leaf: "queue", opsScreen: "queue", title: "Senarai JK" },
    { code: "PE-JK", leaf: "decisions", opsScreen: "decisions", title: "Minit & Keputusan" },
  ];

  for (const item of leaves) {
    const rel = `${OPS_MODULES[item.code].basePath.replace(/^\/st\//, "")}/${item.leaf}`;
    routes.push({
      path: rel,
      name: `${prefix}-${rel.replace(/\//g, "-")}`,
      component: StOpsWorkspaceView,
      meta: {
        requiresAuth: prefix === "admin-st",
        title: `${item.title} — ST`,
        moduleCode: item.code,
        phase: 1,
        opsScreen: item.opsScreen,
      },
    });
  }

  for (const mod of Object.values(OPS_MODULES)) {
    const rel = mod.basePath.replace(/^\/st\//, "");
    const first = leaves.find((l) => l.code === mod.code);
    if (first) {
      routes.push({
        path: rel,
        redirect: `${base}/${rel}/${first.leaf}`,
      });
    }
  }

  return routes;
}

function analyticsWorkspaceRoutes(prefix: "st" | "admin-st"): RouteRecordRaw[] {
  return Object.entries(ANALYTICS_SCREENS).map(([key, def]) => ({
    path: def.path,
    name: `${prefix}-${def.path.replace(/\//g, "-")}`,
    component: StAnalyticsWorkspaceView,
    meta: {
      requiresAuth: prefix === "admin-st",
      title: `${key} — ST`,
      analyticsScreen: key,
      phase: 1,
    },
  }));
}

function adminWorkspaceRoutes(prefix: "st" | "admin-st"): RouteRecordRaw[] {
  return Object.entries(ADMIN_SCREENS).map(([key, def]) => ({
    path: def.path,
    name: `${prefix}-${def.path.replace(/\//g, "-")}`,
    component: StAdminWorkspaceView,
    meta: {
      requiresAuth: prefix === "admin-st",
      title: `${key} — ST`,
      adminScreen: key,
      phase: 1,
    },
  }));
}

// Guards the ST portal: requires Sanctum auth and a valid ST role.
async function stAuthGuard() {
  const auth = useAuthStore();
  await auth.initialize();
  const session = useStSessionStore();
  session.syncFromAuth();
  if (!auth.isAuthenticated || !session.currentPersona) {
    return { path: "/st/login" };
  }
  return true;
}

// CMS /admin/st pages sync ST session from the authenticated CMS user.
function stAdminBootstrap() {
  useStSessionStore().syncFromAuth();
  return true;
}

const stAdminPlaceholderRoutes: RouteRecordRaw[] = staffMenuLeafRoutes()
  .filter((leaf) => !ST_PHASE2_IMPLEMENTED.has(leaf.path))
  .map((leaf) => ({
    path: leaf.path,
    name: `admin-st-${leaf.path.replace(/\//g, "-")}`,
    component: StComingSoonView,
    meta: {
      requiresAuth: true,
      title: `${leaf.title} — ST`,
      moduleCode: leaf.moduleCode,
      phase: leaf.phase,
    },
  }));

const stAdminRoutes: RouteRecordRaw = {
  path: "/admin/st",
  component: AdminLayoutShell,
  meta: { requiresAuth: true },
  beforeEnter: stAdminBootstrap,
  children: [
    { path: "", redirect: "/admin/st/dashboard" },
    { path: "dashboard", name: "admin-st-dashboard", component: StDashboardView, meta: { requiresAuth: true, title: "Papan Pemuka — ST" } },
    { path: "inbox", name: "admin-st-inbox", component: StInboxView, meta: { requiresAuth: true, title: "Peti Tugasan — ST" } },
    { path: "applications", name: "admin-st-applications", component: StApplicationListView, meta: { requiresAuth: true, title: "Permohonan — ST" } },
    { path: "applications/:id", name: "admin-st-application-detail", component: StApplicationDetailView, meta: { requiresAuth: true, title: "Butiran Permohonan — ST" } },
    { path: "notifications", name: "admin-st-notifications", component: StNotificationsView, meta: { requiresAuth: true, title: "Notifikasi — ST" } },
    { path: "search", name: "admin-st-search", component: StSearchView, meta: { requiresAuth: true, title: "Carian & Semakan Status — ST" } },
    { path: "aina", name: "admin-st-aina", component: AinaUserChatView, meta: { requiresAuth: true, title: "AINA — User" } },
    ...registrationRoutes("admin-st"),
    ...serviceWorkspaceRoutes("admin-st"),
    ...opsWorkspaceRoutes("admin-st"),
    ...analyticsWorkspaceRoutes("admin-st"),
    ...adminWorkspaceRoutes("admin-st"),
    ...stAdminPlaceholderRoutes,
  ],
};

const legacyAdminPaths = [
  "/login",
  "/portal/dashboard",
  "/posts",
  "/posts/new",
  "/posts/:id",
  "/categories",
  "/categories/new",
  "/categories/:id",
  "/pages",
  "/pages/new",
  "/pages/:id",
  "/media",
  "/menus",
  "/webfront-menu",
  "/webfront-settings",
  "/storefront-menu",
  "/kitchen-sink",
  "/kitchen-sink/forms",
  "/kitchen-sink/charts",
  "/development/database-schema",
  "/development/api-management",
  "/profile",
  "/settings",
  "/settings/users",
  "/settings/users/new",
  "/settings/users/:id",
  "/settings/roles",
  "/settings/audit-logs",
  "/settings/queue-monitor",
  "/settings/system",
];

// Backward-compat redirects: old /admin/settings/* → new /admin/platform/* paths
const settingsRedirects: RouteRecordRaw[] = [
  { path: "/admin/settings/users", redirect: "/admin/platform/identity/users" },
  { path: "/admin/settings/users/new", redirect: "/admin/platform/identity/users/new" },
  { path: "/admin/settings/users/:id", redirect: (to: RouteLocationGeneric) => `/admin/platform/identity/users/${String(to.params.id ?? "")}` },
  { path: "/admin/settings/roles", redirect: "/admin/platform/identity/roles" },
  { path: "/admin/settings/audit-logs", redirect: "/admin/platform/observability/audit-trail" },
  { path: "/admin/settings/queue-monitor", redirect: "/admin/platform/queue" },
];

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/admin/login", name: "login", component: LoginView, meta: { guestOnly: true, title: "Login" } },
    { path: "/admin", name: "main-dashboard", component: MainDashboardView, meta: { requiresAuth: true, title: "Main Dashboard" } },
    { path: "/admin/portal/dashboard", name: "dashboard", component: DashboardView, meta: { requiresAuth: true, title: "Dashboard" } },
    { path: "/admin/posts", name: "posts", component: PostsListView, meta: { requiresAuth: true, title: "Posts" } },
    { path: "/admin/posts/new", name: "post-create", component: PostEditorView, meta: { requiresAuth: true, title: "New Post" } },
    { path: "/admin/posts/:id", name: "post-edit", component: PostEditorView, meta: { requiresAuth: true, title: "Edit Post" } },
    { path: "/admin/categories", name: "categories", component: CategoriesListView, meta: { requiresAuth: true, title: "Categories" } },
    { path: "/admin/categories/new", name: "category-create", component: CategoryEditorView, meta: { requiresAuth: true, title: "New Category" } },
    { path: "/admin/categories/:id", name: "category-edit", component: CategoryEditorView, meta: { requiresAuth: true, title: "Edit Category" } },
    { path: "/admin/pages", name: "pages", component: PagesListView, meta: { requiresAuth: true, title: "Pages" } },
    { path: "/admin/pages/new", name: "page-create", component: PageEditorView, meta: { requiresAuth: true, title: "New Page" } },
    { path: "/admin/pages/:id", name: "page-edit", component: PageEditorView, meta: { requiresAuth: true, title: "Edit Page" } },
    { path: "/admin/media", name: "media", component: MediaLibraryView, meta: { requiresAuth: true, title: "Media" } },
    { path: "/admin/webfront-menu", name: "storefront-menu", component: StorefrontMenuView, meta: { requiresAuth: true, title: "Menus" } },
    { path: "/admin/storefront-menu", redirect: "/admin/webfront-menu" },
    { path: "/admin/webfront-settings", name: "webfront-settings", component: WebfrontSettingsView, meta: { requiresAuth: true, title: "Settings" } },
    { path: "/admin/menus", name: "menus", component: MenusView, meta: { requiresAuth: true, title: "Menus" } },
    { path: "/admin/kitchen-sink", name: "kitchen-sink", component: KitchenSinkView, meta: { requiresAuth: true, title: "Kitchen Sink" } },
    { path: "/admin/kitchen-sink/forms", name: "kitchen-forms", component: KitchenFormsView, meta: { requiresAuth: true, title: "Forms" } },
    { path: "/admin/kitchen-sink/charts", name: "kitchen-charts", component: KitchenChartsView, meta: { requiresAuth: true, title: "Charts" } },
    { path: "/admin/development/developers-guide", name: "developers-guide", component: DevelopersGuideView, meta: { requiresAuth: true, title: "Developers Guide" } },
    { path: "/admin/development/database-schema", name: "database-schema", component: DatabaseSchemaView, meta: { requiresAuth: true, title: "Database Schema" } },
    { path: "/admin/development/api-explorer", name: "api-explorer", component: ApiManagementView, meta: { requiresAuth: true, title: "API Explorer" } },
    { path: "/admin/development/api-management", redirect: "/admin/development/api-explorer" },
    { path: "/admin/workflows", name: "workflows", component: WorkflowsListView, meta: { requiresAuth: true, title: "Workflows" } },
    { path: "/admin/workflows/new", name: "workflow-create", component: WorkflowEditorView, meta: { requiresAuth: true, title: "New Workflow" } },
    { path: "/admin/workflows/instances", name: "workflow-instances", component: WorkflowInstancesView, meta: { requiresAuth: true, title: "Workflow Instances" } },
    { path: "/admin/workflows/:id", name: "workflow-edit", component: WorkflowEditorView, meta: { requiresAuth: true, title: "Edit Workflow" } },
    {
      path: "/admin/profile",
      name: "profile",
      meta: { requiresAuth: true },
      beforeEnter: async () => {
        const auth = useAuthStore();
        await auth.initialize();
        if (auth.user?.id) return `/admin/platform/identity/users/${auth.user.id}`;
        return { name: "login" };
      },
      component: { template: "" },
    },

    // ── Administration ──
    { path: "/admin/settings", name: "settings", component: SettingsView, meta: { requiresAuth: true, title: "Settings" } },
    { path: "/admin/settings/system", name: "settings-system", component: SystemInfoView, meta: { requiresAuth: true, title: "System Info" } },

    // ── Core Platform: Identity & Access ──
    { path: "/admin/platform/identity", redirect: "/admin/platform/identity/users" },
    { path: "/admin/platform/identity/users", name: "platform-users", component: UsersView, meta: { requiresAuth: true, title: "Users" } },
    { path: "/admin/platform/identity/users/new", name: "platform-user-create", component: UserEditView, meta: { requiresAuth: true, title: "New User" } },
    { path: "/admin/platform/identity/users/:id", name: "platform-user-edit", component: UserEditView, meta: { requiresAuth: true, title: "Edit User" } },
    { path: "/admin/platform/identity/roles", name: "platform-rbac", component: RolesView, meta: { requiresAuth: true, title: "RBAC" } },
    { path: "/admin/platform/identity/tokens", name: "platform-tokens", component: ComingSoonView, meta: { requiresAuth: true, title: "Token Management" } },

    // ── Core Platform: Observability (Grafana) ──
    { path: "/admin/platform/observability", redirect: "/admin/platform/observability/audit-trail" },
    { path: "/admin/platform/observability/audit-trail", name: "platform-audit-trail", component: AuditLogsView, meta: { requiresAuth: true, title: "Audit Trail" } },
    { path: "/admin/platform/observability/activity-log", name: "platform-activity-log", component: ComingSoonView, meta: { requiresAuth: true, title: "Activity Log" } },
    { path: "/admin/platform/observability/logging", name: "platform-logging", component: ComingSoonView, meta: { requiresAuth: true, title: "Logging" } },
    { path: "/admin/platform/observability/errors", name: "platform-error-tracking", component: ComingSoonView, meta: { requiresAuth: true, title: "Error Tracking" } },
    { path: "/admin/platform/observability/monitoring", name: "platform-monitoring", component: ComingSoonView, meta: { requiresAuth: true, title: "Monitoring" } },

    // ── Core Platform: Queue (Laravel Queue) ──
    { path: "/admin/platform/queue", name: "platform-queue", component: QueueMonitorView, meta: { requiresAuth: true, title: "Queue" } },
    { path: "/admin/platform/queue/failed", name: "platform-queue-failed", component: ComingSoonView, meta: { requiresAuth: true, title: "Failed Jobs" } },
    { path: "/admin/platform/queue/scheduled", name: "platform-queue-scheduled", component: ComingSoonView, meta: { requiresAuth: true, title: "Scheduled Jobs" } },

    // ── Core Platform: Messaging ──
    { path: "/admin/platform/messaging", redirect: "/admin/platform/messaging/event-bus" },
    { path: "/admin/platform/messaging/event-bus", name: "platform-event-bus", component: ComingSoonView, meta: { requiresAuth: true, title: "Event Bus" } },
    { path: "/admin/platform/messaging/notifications", name: "platform-notifications", component: ComingSoonView, meta: { requiresAuth: true, title: "Notifications" } },

    // ── Backward-compat redirects from old governance/communication paths ──
    { path: "/admin/platform/governance", redirect: "/admin/platform/observability/audit-trail" },
    { path: "/admin/platform/governance/audit-trail", redirect: "/admin/platform/observability/audit-trail" },
    { path: "/admin/platform/governance/activity-log", redirect: "/admin/platform/observability/activity-log" },
    { path: "/admin/platform/communication", redirect: "/admin/platform/messaging/notifications" },
    { path: "/admin/platform/communication/notifications", redirect: "/admin/platform/messaging/notifications" },
    { path: "/admin/platform/messaging/queue", redirect: "/admin/platform/queue" },
    { path: "/admin/platform/messaging/queue/failed", redirect: "/admin/platform/queue/failed" },
    { path: "/admin/platform/messaging/queue/scheduled", redirect: "/admin/platform/queue/scheduled" },

    // ── Core Platform: System Management ──
    { path: "/admin/platform/system", redirect: "/admin/platform/system/configuration" },
    { path: "/admin/platform/system/configuration", name: "platform-config", component: ComingSoonView, meta: { requiresAuth: true, title: "Configuration" } },
    { path: "/admin/platform/system/feature-flags", name: "platform-feature-flags", component: ComingSoonView, meta: { requiresAuth: true, title: "Feature Flags" } },
    { path: "/admin/platform/system/scheduler", name: "platform-scheduler", component: ComingSoonView, meta: { requiresAuth: true, title: "Scheduler" } },

    // ── Core Platform: Storage ──
    { path: "/admin/platform/storage", redirect: "/admin/platform/storage/media" },
    { path: "/admin/platform/storage/media", name: "platform-file-media", component: ComingSoonView, meta: { requiresAuth: true, title: "File / Media Management" } },

    // ── Core Platform: API Gateway (APISIX) ──
    { path: "/admin/platform/gateway", redirect: "/admin/platform/gateway/routes" },
    { path: "/admin/platform/gateway/routes", name: "platform-gateway-routes", component: ComingSoonView, meta: { requiresAuth: true, title: "Routes" } },
    { path: "/admin/platform/gateway/upstreams", name: "platform-gateway-upstreams", component: ComingSoonView, meta: { requiresAuth: true, title: "Upstreams" } },
    { path: "/admin/platform/gateway/consumers", name: "platform-gateway-consumers", component: ComingSoonView, meta: { requiresAuth: true, title: "Consumers" } },
    { path: "/admin/platform/gateway/plugins", name: "platform-gateway-plugins", component: ComingSoonView, meta: { requiresAuth: true, title: "Plugins" } },
    { path: "/admin/platform/gateway/ssl", name: "platform-gateway-ssl", component: ComingSoonView, meta: { requiresAuth: true, title: "SSL Certificates" } },
    { path: "/admin/platform/gateway/webhooks", name: "platform-webhooks", component: ComingSoonView, meta: { requiresAuth: true, title: "Webhooks" } },

    // ── Backward-compat redirects from old integration paths ──
    { path: "/admin/platform/integration", redirect: "/admin/platform/gateway/routes" },
    { path: "/admin/platform/integration/api", redirect: "/admin/platform/gateway/routes" },
    { path: "/admin/platform/integration/webhooks", redirect: "/admin/platform/gateway/webhooks" },

    // ── Core Platform: AI Integration ──
    { path: "/admin/platform/ai", redirect: "/admin/platform/ai/providers" },
    { path: "/admin/platform/ai/providers", name: "platform-ai-providers", component: ComingSoonView, meta: { requiresAuth: true, title: "AI Providers" } },
    { path: "/admin/platform/ai/models", name: "platform-ai-models", component: ComingSoonView, meta: { requiresAuth: true, title: "AI Models" } },
    { path: "/admin/platform/ai/prompts", name: "platform-ai-prompts", component: ComingSoonView, meta: { requiresAuth: true, title: "Prompt Templates" } },
    { path: "/admin/platform/ai/usage", name: "platform-ai-usage", component: ComingSoonView, meta: { requiresAuth: true, title: "AI Usage & Billing" } },

    // ── Backward-compat redirects from old settings paths ──
    ...settingsRedirects,

    ...legacyAdminPaths.map<RouteRecordRaw>((path) => ({
      path,
      redirect: (to: RouteLocationGeneric) => `/admin${to.fullPath}`,
    })),

    // ── Sistem Digital ST under CMS admin (/admin/st/*) ──
    stAdminRoutes,

    // ── Suruhanjaya Tenaga (ST) D11 prototype ──
    { path: "/st/login", name: "st-login", component: StLoginView, meta: { title: "Log Masuk — Suruhanjaya Tenaga" } },
    {
      path: "/st",
      component: StPortalLayout,
      beforeEnter: stAuthGuard,
      children: [
        { path: "", redirect: () => useStSessionStore().homeRoute() },
        { path: "dashboard", name: "st-dashboard", component: StDashboardView, meta: { title: "Papan Pemuka — ST" } },
        { path: "inbox", name: "st-inbox", component: StInboxView, meta: { title: "Peti Tugasan — ST" } },
        { path: "applications", name: "st-applications", component: StApplicationListView, meta: { title: "Permohonan — ST" } },
        { path: "applications/new", name: "st-application-new", component: ApplicationFormView, meta: { title: "Permohonan Baharu — ST" } },
        { path: "applications/:id", name: "st-application-detail", component: StApplicationDetailView, meta: { title: "Butiran Permohonan — ST" } },
        { path: "applications/:id/pay/:kind", name: "st-payment", component: FpxPaymentView, meta: { title: "Pembayaran — ST" } },
        { path: "applications/:id/certificate", name: "st-certificate", component: CertificateView, meta: { title: "Sijil Digital — ST" } },
        { path: "notifications", name: "st-notifications", component: StNotificationsView, meta: { title: "Notifikasi — ST" } },
        { path: "search", name: "st-search", component: StSearchView, meta: { title: "Carian & Semakan Status — ST" } },
        { path: "aina", name: "st-aina", component: AinaUserChatView, meta: { title: "AINA — User" } },
        ...registrationRoutes("st"),
        ...serviceWorkspaceRoutes("st"),
        ...opsWorkspaceRoutes("st"),
        ...analyticsWorkspaceRoutes("st"),
        ...adminWorkspaceRoutes("st"),
        // Any leftover menu leaves (should be empty once workspace covers all)
        ...staffMenuLeafRoutes()
          .filter((leaf) => !ST_PHASE2_IMPLEMENTED.has(leaf.path))
          .map((leaf) => ({
            path: leaf.path,
            name: `st-${leaf.path.replace(/\//g, "-")}`,
            component: StComingSoonView,
            meta: {
              title: `${leaf.title} — ST`,
              moduleCode: leaf.moduleCode,
              phase: leaf.phase,
            },
          })),
      ],
    },

    { path: "/", name: "storefront-home", component: StorefrontHomeView, meta: { title: "Webfront" } },
    { path: "/:slug", name: "storefront-page", component: StorefrontPageView, meta: { title: "Webfront" } },
  ],
});

function safeInternalRedirect(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw.startsWith("/") || raw.startsWith("//")) {
    return null;
  }
  // Only allow in-app admin/ST paths (email deep links).
  if (!raw.startsWith("/admin")) {
    return null;
  }
  return raw;
}

router.beforeEach(async (to) => {
  const auth = useAuthStore();
  await auth.initialize();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      name: "login",
      query: { redirect: to.fullPath },
    };
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    const redirect = safeInternalRedirect(to.query.redirect);
    if (redirect) {
      return redirect;
    }
    return { name: "main-dashboard" };
  }

  return true;
});

router.afterEach((to) => {
  const site = useSiteStore();
  const pageTitle = (to.meta.title as string) || "Admin";
  site.setDocumentTitle(pageTitle);
});

export default router;
