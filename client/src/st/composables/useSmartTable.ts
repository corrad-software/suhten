import { computed, type ComputedRef, onMounted, onUnmounted, reactive, ref, watch } from "vue";

export interface SmartTableColumn<T> {
  key: string;
  label: string;
  /** Extracts a plain-text value from a row — used for search matching and filter option values. */
  value: (row: T) => string;
  /** Set to false to hide the filter icon for this column (still searchable). Defaults to true. */
  filterable?: boolean;
}

export interface SmartTableChip {
  key: string;
  label: string;
  count: number;
}

/**
 * Shared "smart table" behaviour: free-text search, per-column Excel-style
 * checkbox filters (multi-select), active-filter chips, and pagination with
 * a configurable page size. Pure state/logic — pairing UI lives in SmartTable.vue.
 */
export function useSmartTable<T>(
  getRows: () => T[],
  columns: SmartTableColumn<T>[],
  options?: { pageSizeOptions?: number[] },
) {
  const rows = computed(getRows);
  const pageSizeOptions = options?.pageSizeOptions ?? [5, 10, 25, 50];

  const search = ref("");
  const page = ref(1);
  const pageSize = ref(pageSizeOptions[0]);

  const filterableColumns = columns.filter((c) => c.filterable !== false);
  const columnFilters = reactive<Record<string, string[]>>(
    Object.fromEntries(filterableColumns.map((c) => [c.key, []])),
  );
  const openFilterCol = ref<string | null>(null);

  const columnOptions: Record<string, ComputedRef<string[]>> = {};
  for (const c of filterableColumns) {
    columnOptions[c.key] = computed(() => [...new Set(rows.value.map((r) => c.value(r)))]);
  }

  function toggleFilterCol(key: string) {
    openFilterCol.value = openFilterCol.value === key ? null : key;
  }

  function isAllSelected(key: string): boolean {
    const opts = columnOptions[key]?.value ?? [];
    return opts.length > 0 && (columnFilters[key]?.length ?? 0) === opts.length;
  }

  function toggleSelectAll(key: string) {
    columnFilters[key] = isAllSelected(key) ? [] : [...(columnOptions[key]?.value ?? [])];
  }

  function clearColumnFilter(key: string) {
    columnFilters[key] = [];
  }

  function clearAllFilters() {
    for (const key of Object.keys(columnFilters)) columnFilters[key] = [];
  }

  function onDocumentClick(ev: MouseEvent) {
    if (!(ev.target as HTMLElement).closest("[data-col-filter]")) openFilterCol.value = null;
  }
  onMounted(() => document.addEventListener("click", onDocumentClick));
  onUnmounted(() => document.removeEventListener("click", onDocumentClick));

  const filtered = computed(() => {
    const q = search.value.trim().toLowerCase();
    return rows.value.filter((row) => {
      for (const c of filterableColumns) {
        const sel = columnFilters[c.key];
        if (sel.length && !sel.includes(c.value(row))) return false;
      }
      if (!q) return true;
      return columns.some((c) => c.value(row).toLowerCase().includes(q));
    });
  });

  const activeFilterChips = computed<SmartTableChip[]>(() =>
    filterableColumns
      .filter((c) => columnFilters[c.key].length > 0)
      .map((c) => ({ key: c.key, label: c.label, count: columnFilters[c.key].length })),
  );

  const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)));

  const paginated = computed(() => {
    const start = (page.value - 1) * pageSize.value;
    return filtered.value.slice(start, start + pageSize.value);
  });

  watch(
    [search, columnFilters, pageSize],
    () => {
      page.value = 1;
    },
    { deep: true },
  );

  return reactive({
    search,
    page,
    pageSize,
    pageSizeOptions,
    columnFilters,
    openFilterCol,
    columnOptions,
    toggleFilterCol,
    isAllSelected,
    toggleSelectAll,
    clearColumnFilter,
    clearAllFilters,
    activeFilterChips,
    filtered,
    totalPages,
    paginated,
  });
}
