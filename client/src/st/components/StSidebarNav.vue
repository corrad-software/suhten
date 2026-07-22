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
  collapsed?: boolean;
}>();

const emit = defineEmits<{
  expand: [];
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
    ? "border border-white/25 bg-white font-medium text-[#1e3a8a] shadow-sm"
    : "border border-transparent text-blue-100/90 hover:bg-white/10 hover:text-white";
}

function childClass(active: boolean) {
  return active
    ? "bg-white/15 font-medium text-white"
    : "text-blue-100/70 hover:bg-white/10 hover:text-white";
}

function toggleMenu(id: string) {
  openMenus[id] = !openMenus[id];
}

function onCollapsedParentClick(item: SidebarMenuItem) {
  if (props.collapsed) {
    emit("expand");
    openMenus[item.id] = true;
    return;
  }
  toggleMenu(item.id);
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
  <nav :class="collapsed ? 'p-1.5 md:px-0 md:py-2' : 'p-2.5'">
    <template v-for="group in menu" :key="group.id">
      <p
        v-if="group.label"
        class="mb-0.5 mt-2.5 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-blue-200/60"
        :class="collapsed ? 'md:hidden' : ''"
      >
        {{ ml(group.id, group.label) }}
      </p>

      <div v-for="item in group.items" :key="item.id" class="mb-0.5">
        <button
          v-if="item.children && item.children.length > 0"
          type="button"
          :class="[
            'group relative flex w-full items-center text-left transition-all',
            collapsed
              ? 'gap-2 rounded-md px-2.5 py-1.5 text-xs md:justify-center md:rounded-none md:px-0 md:py-2'
              : 'gap-2 rounded-md px-2.5 py-1.5 text-xs',
            itemClass(isNodeActive(item)),
          ]"
          @click="onCollapsedParentClick(item)"
        >
          <component :is="item.icon" class="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" />
          <span class="flex-1" :class="collapsed ? 'md:hidden' : ''">{{ ml(item.id, item.label) }}</span>
          <span
            v-if="item.phase === 2"
            class="rounded bg-amber-100/90 px-1 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-amber-800"
            :class="collapsed ? 'md:hidden' : ''"
          >F2</span>
          <ChevronDown
            class="h-3 w-3 shrink-0 text-blue-200/50 transition-transform duration-200"
            :class="[{ '-rotate-90': !openMenus[item.id] }, collapsed ? 'md:hidden' : '']"
          />
          <span
            v-if="collapsed"
            class="pointer-events-none absolute left-full z-50 ml-2 hidden whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 md:block"
          >
            {{ ml(item.id, item.label) }}
          </span>
        </button>

        <router-link
          v-else
          :to="item.to"
          :class="[
            'group relative flex items-center transition-all',
            collapsed
              ? 'gap-2 rounded-md px-2.5 py-1.5 text-xs md:justify-center md:rounded-none md:px-0 md:py-2'
              : 'gap-2 rounded-md px-2.5 py-1.5 text-xs',
            itemClass(isActive(item.to)),
          ]"
        >
          <component :is="item.icon" class="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" />
          <span :class="collapsed ? 'md:hidden' : ''">{{ ml(item.id, item.label) }}</span>
          <span
            v-if="collapsed"
            class="pointer-events-none absolute left-full z-50 ml-2 hidden whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 md:block"
          >
            {{ ml(item.id, item.label) }}
          </span>
        </router-link>

        <div
          v-if="item.children && item.children.length > 0 && openMenus[item.id] && !collapsed"
          class="ml-4 mt-0.5 space-y-0.5 border-l-2 border-white/20 pl-2.5"
        >
          <template v-for="child in item.children" :key="child.id">
            <button
              v-if="child.children && child.children.length > 0"
              type="button"
              :class="['flex w-full items-center rounded-md px-2 py-1 text-left text-xs transition-all', childClass(isNodeActive(child))]"
              @click="toggleMenu(child.id)"
            >
              <span class="flex-1">{{ ml(child.id, child.label) }}</span>
              <ChevronDown
                class="h-2.5 w-2.5 shrink-0 text-blue-200/50 transition-transform duration-200"
                :class="{ '-rotate-90': !openMenus[child.id] }"
              />
            </button>

            <router-link
              v-else
              :to="child.to"
              :class="['block rounded-md px-2 py-1 text-xs transition-all', childClass(isActive(child.to))]"
            >
              {{ ml(child.id, child.label) }}
            </router-link>

            <div
              v-if="child.children && child.children.length > 0 && openMenus[child.id]"
              class="ml-2.5 mt-0.5 space-y-0.5 border-l border-white/15 pl-2"
            >
              <router-link
                v-for="grandchild in child.children"
                :key="grandchild.id"
                :to="grandchild.to"
                :class="['block rounded-md px-1.5 py-0.5 text-[11px] transition-all', childClass(isActive(grandchild.to))]"
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
