import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";

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
  getColumns: SmartTableColumn<T>[] | (() => SmartTableColumn<T>[]),
  options?: { pageSizeOptions?: number[] },
) {
  const rows = computed(getRows);
  const columns = computed(() =>
    typeof getColumns === "function" ? getColumns() : getColumns,
  );
  const pageSizeOptions = options?.pageSizeOptions ?? [5, 10, 25, 50];

  const search = ref("");
  const page = ref(1);
  const pageSize = ref(pageSizeOptions[0]);

  const filterableColumns = computed(() => columns.value.filter((c) => c.filterable !== false));
  const columnFilters = reactive<Record<string, string[]>>({});
  const openFilterCol = ref<string | null>(null);

  watch(
    filterableColumns,
    (cols) => {
      const keys = new Set(cols.map((c) => c.key));
      for (const c of cols) {
        if (!(c.key in columnFilters)) columnFilters[c.key] = [];
      }
      for (const key of Object.keys(columnFilters)) {
        if (!keys.has(key)) delete columnFilters[key];
      }
    },
    { immediate: true },
  );

  /** Unique, sorted option values per filterable column (plain arrays — safe under reactive()). */
  const columnOptions = computed(() => {
    const result: Record<string, string[]> = {};
    for (const c of filterableColumns.value) {
      const values = rows.value
        .map((r) => c.value(r))
        .filter((v) => v != null && String(v).trim() !== "");
      result[c.key] = [...new Set(values)].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" }),
      );
    }
    return result;
  });

  function toggleFilterCol(key: string) {
    openFilterCol.value = openFilterCol.value === key ? null : key;
  }

  function isAllSelected(key: string): boolean {
    const opts = columnOptions.value[key] ?? [];
    return opts.length > 0 && (columnFilters[key]?.length ?? 0) === opts.length;
  }

  function toggleSelectAll(key: string) {
    columnFilters[key] = isAllSelected(key) ? [] : [...(columnOptions.value[key] ?? [])];
  }

  function clearColumnFilter(key: string) {
    columnFilters[key] = [];
  }

  function clearAllFilters() {
    for (const key of Object.keys(columnFilters)) columnFilters[key] = [];
  }

  function closeFilterPanel() {
    openFilterCol.value = null;
  }

  function onDocumentClick(ev: MouseEvent) {
    if (!(ev.target as HTMLElement).closest("[data-col-filter]")) closeFilterPanel();
  }

  function onScrollOrResize(ev: Event) {
    // Keep panel open while scrolling inside the options list itself.
    if (ev.type === "scroll" && (ev.target as HTMLElement | null)?.closest?.("[data-col-filter]")) return;
    closeFilterPanel();
  }

  onMounted(() => {
    document.addEventListener("click", onDocumentClick);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
  });
  onUnmounted(() => {
    document.removeEventListener("click", onDocumentClick);
    window.removeEventListener("scroll", onScrollOrResize, true);
    window.removeEventListener("resize", onScrollOrResize);
  });

  const filtered = computed(() => {
    const q = search.value.trim().toLowerCase();
    return rows.value.filter((row) => {
      for (const c of filterableColumns.value) {
        const sel = columnFilters[c.key];
        if (sel?.length && !sel.includes(c.value(row))) return false;
      }
      if (!q) return true;
      return columns.value.some((c) => c.value(row).toLowerCase().includes(q));
    });
  });

  const activeFilterChips = computed<SmartTableChip[]>(() =>
    filterableColumns.value
      .filter((c) => (columnFilters[c.key]?.length ?? 0) > 0)
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
