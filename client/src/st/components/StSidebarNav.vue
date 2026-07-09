<script setup lang="ts">
import { onMounted, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import { ChevronDown } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import type { PortalMenuGroup, PortalMenuItem } from "../config/portal-menu";
import type { StaffMenuGroup, StaffMenuNode } from "../config/staff-menu";

type SidebarMenuGroup = StaffMenuGroup | PortalMenuGroup;
type SidebarMenuItem = PortalMenuItem | (StaffMenuGroup["items"][number]);

const props = defineProps<{
  menu: SidebarMenuGroup[];
}>();

const route = useRoute();
const { ml } = useLocale();
const openMenus = reactive<Record<string, boolean>>({});

function isActive(path: string) {
  if (path === "/st/applications") return route.path === "/st/applications";
  return route.path === path || route.path.startsWith(path + "/");
}

function isNodeActive(node: { to: string; children?: StaffMenuNode[] | PortalMenuItem[] }): boolean {
  if (isActive(node.to)) return true;
  if (!node.children?.length) return false;
  return node.children.some((child) => isNodeActive(child));
}

function itemClass(active: boolean) {
  return active
    ? "border border-[var(--accent-200)] bg-[var(--accent-50)] font-medium text-[var(--accent-700)]"
    : "border border-transparent text-slate-700 hover:bg-[var(--accent-50)]";
}

function childClass(active: boolean) {
  return active
    ? "bg-[var(--accent-50)] font-medium text-[var(--accent-700)]"
    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900";
}

function toggleMenu(id: string) {
  openMenus[id] = !openMenus[id];
}

function syncOpenMenus() {
  const syncNode = (node: SidebarMenuItem | StaffMenuNode | PortalMenuItem) => {
    if (node.children?.length && isNodeActive(node)) {
      openMenus[node.id] = true;
      for (const child of node.children) syncNode(child);
    }
  };

  for (const group of props.menu) {
    for (const item of group.items) syncNode(item);
  }
}

onMounted(syncOpenMenus);
watch(() => route.path, syncOpenMenus);
watch(() => props.menu, syncOpenMenus, { deep: true });
</script>

<template>
  <nav class="p-3">
    <template v-for="group in menu" :key="group.id">
      <p v-if="group.label" class="mb-1 mt-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {{ ml(group.id, group.label) }}
      </p>

      <div v-for="item in group.items" :key="item.id" class="mb-0.5">
        <button
          v-if="item.children && item.children.length > 0"
          type="button"
          :class="['flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-all', itemClass(isNodeActive(item))]"
          @click="toggleMenu(item.id)"
        >
          <component :is="item.icon" class="h-4 w-4 shrink-0" />
          <span class="flex-1">{{ ml(item.id, item.label) }}</span>
          <span
            v-if="item.phase === 2"
            class="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-700"
          >F2</span>
          <ChevronDown
            class="h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200"
            :class="{ '-rotate-90': !openMenus[item.id] }"
          />
        </button>

        <router-link
          v-else
          :to="item.to"
          :class="['flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all', itemClass(isActive(item.to))]"
        >
          <component :is="item.icon" class="h-4 w-4 shrink-0" />
          <span>{{ ml(item.id, item.label) }}</span>
        </router-link>

        <div
          v-if="item.children && item.children.length > 0 && openMenus[item.id]"
          class="ml-5 mt-1 space-y-0.5 border-l-2 border-slate-200 pl-3"
        >
          <template v-for="child in item.children" :key="child.id">
            <button
              v-if="child.children && child.children.length > 0"
              type="button"
              :class="['flex w-full items-center rounded-md px-2.5 py-1.5 text-left text-[13px] transition-all', childClass(isNodeActive(child))]"
              @click="toggleMenu(child.id)"
            >
              <span class="flex-1">{{ ml(child.id, child.label) }}</span>
              <ChevronDown
                class="h-3 w-3 shrink-0 text-slate-400 transition-transform duration-200"
                :class="{ '-rotate-90': !openMenus[child.id] }"
              />
            </button>

            <router-link
              v-else
              :to="child.to"
              :class="['block rounded-md px-2.5 py-1.5 text-[13px] transition-all', childClass(isActive(child.to))]"
            >
              {{ ml(child.id, child.label) }}
            </router-link>

            <div
              v-if="child.children && child.children.length > 0 && openMenus[child.id]"
              class="ml-3 mt-0.5 space-y-0.5 border-l border-slate-200 pl-2.5"
            >
              <router-link
                v-for="grandchild in child.children"
                :key="grandchild.id"
                :to="grandchild.to"
                :class="['block rounded-md px-2 py-1 text-[12px] transition-all', childClass(isActive(grandchild.to))]"
              >
                {{ ml(grandchild.id, grandchild.label) }}
              </router-link>
            </div>
          </template>
        </div>
      </div>
    </template>
  </nav>
</template>
