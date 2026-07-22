<script setup lang="ts" generic="T extends object">
import { computed } from "vue";
import { Filter, Search, X } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import { useSmartTable, type SmartTableColumn } from "../composables/useSmartTable";

const props = defineProps<{
  rows: T[];
  columns: SmartTableColumn<T>[];
  rowKey: (row: T) => string | number;
  pageSizeOptions?: number[];
  emptyText?: string;
  searchPlaceholder?: string;
  clickableRows?: boolean;
}>();

defineEmits<{ (e: "row-click", row: T): void }>();

const { locale } = useLocale();
const bm = computed(() => locale.value === "bm");

const table = useSmartTable(() => props.rows, props.columns, { pageSizeOptions: props.pageSizeOptions });
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="relative w-full max-w-xs">
        <Search class="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          v-model="table.search"
          type="text"
          :placeholder="searchPlaceholder ?? (bm ? 'Cari...' : 'Search...')"
          class="w-full rounded-md border border-slate-300 py-2 pl-8 pr-3 text-sm focus:border-[var(--accent-500)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent-ring)]/30"
        />
      </div>
      <div class="flex items-center gap-3">
        <label class="flex items-center gap-1.5 text-xs text-slate-500">
          {{ bm ? 'Papar' : 'Show' }}
          <select
            v-model.number="table.pageSize"
            class="rounded-md border border-slate-300 bg-white py-1 pl-2 pr-6 text-xs text-slate-700 focus:border-[var(--accent-500)] focus:outline-hidden"
          >
            <option v-for="n in table.pageSizeOptions" :key="n" :value="n">{{ n }}</option>
          </select>
        </label>
        <span class="shrink-0 text-xs text-slate-500">{{ table.filtered.length }} {{ bm ? 'daripada' : 'of' }} {{ rows.length }}</span>
      </div>
    </div>

    <div v-if="table.activeFilterChips.length" class="mt-3 flex flex-wrap items-center gap-2">
      <span class="text-xs font-medium text-slate-500">{{ bm ? 'Tapisan aktif:' : 'Active filters:' }}</span>
      <span
        v-for="chip in table.activeFilterChips"
        :key="chip.key"
        class="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-50)] px-2.5 py-1 text-xs font-medium text-[var(--accent-700)]"
      >
        {{ chip.label }} ({{ chip.count }})
        <button type="button" class="rounded-full hover:text-[var(--accent-900)]" @click="table.clearColumnFilter(chip.key)">
          <X class="h-3 w-3" />
        </button>
      </span>
      <button type="button" class="text-xs font-medium text-slate-500 hover:text-slate-800 hover:underline" @click="table.clearAllFilters()">
        {{ bm ? 'Kosongkan semua' : 'Clear all' }}
      </button>
    </div>

    <p v-if="rows.length === 0" class="py-12 text-center text-sm text-slate-400">
      {{ emptyText ?? (bm ? 'Tiada data.' : 'No data.') }}
    </p>
    <p v-else-if="table.filtered.length === 0" class="py-12 text-center text-sm text-slate-400">
      {{ bm ? 'Tiada padanan.' : 'No matches.' }}
    </p>

    <div v-else class="mt-4 overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-400">
            <th v-for="col in columns" :key="col.key" class="py-2 pr-4 font-medium last:pr-0">
              <slot :name="`header-${col.key}`" :col="col">
                <div class="relative inline-flex items-center gap-1" data-col-filter>
                  <span>{{ col.label }}</span>
                  <button
                    v-if="col.filterable !== false"
                    type="button"
                    class="rounded p-0.5 transition-colors hover:text-slate-700"
                    :class="table.columnFilters[col.key]?.length ? 'text-[var(--accent-600)]' : 'text-slate-400'"
                    @click.stop="table.toggleFilterCol(col.key)"
                  >
                    <Filter class="h-3 w-3" />
                  </button>
                  <div
                    v-if="table.openFilterCol === col.key"
                    class="absolute left-0 top-full z-20 mt-1 w-56 rounded-md border border-slate-200 bg-white p-2 normal-case shadow-lg"
                    @click.stop
                  >
                    <label class="mb-1 flex items-center gap-2 rounded border-b border-slate-300 px-1 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
                      <input
                        type="checkbox"
                        class="h-3.5 w-3.5 rounded border-slate-300 text-[var(--accent-600)] focus:ring-[var(--accent-ring)]"
                        :checked="table.isAllSelected(col.key)"
                        @change="table.toggleSelectAll(col.key)"
                      />
                      {{ bm ? 'Pilih Semua' : 'Select All' }}
                    </label>
                    <div class="max-h-48 space-y-0.5 overflow-y-auto">
                      <label
                        v-for="opt in table.columnOptions[col.key]?.value"
                        :key="opt"
                        class="flex items-center gap-2 rounded px-1 py-1 text-xs font-normal text-slate-700 hover:bg-slate-50"
                      >
                        <input v-model="table.columnFilters[col.key]" type="checkbox" :value="opt" class="h-3.5 w-3.5 rounded border-slate-300 text-[var(--accent-600)] focus:ring-[var(--accent-ring)]" />
                        {{ opt }}
                      </label>
                    </div>
                  </div>
                </div>
              </slot>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in table.paginated"
            :key="rowKey(row)"
            class="border-b border-slate-100 last:border-0"
            :class="clickableRows ? 'cursor-pointer hover:bg-slate-50/60' : ''"
            @click="clickableRows && $emit('row-click', row)"
          >
            <td v-for="col in columns" :key="col.key" class="py-3 pr-4 last:pr-0">
              <slot :name="`cell-${col.key}`" :row="row" :value="col.value(row)">{{ col.value(row) }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="table.filtered.length > table.pageSize" class="mt-4 flex items-center justify-between">
      <button
        type="button"
        class="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="table.page === 1"
        @click="table.page--"
      >
        {{ bm ? 'Sebelum' : 'Previous' }}
      </button>
      <span class="text-xs text-slate-500">{{ bm ? 'Halaman' : 'Page' }} {{ table.page }} / {{ table.totalPages }}</span>
      <button
        type="button"
        class="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="table.page === table.totalPages"
        @click="table.page++"
      >
        {{ bm ? 'Seterusnya' : 'Next' }}
      </button>
    </div>
  </div>
</template>
