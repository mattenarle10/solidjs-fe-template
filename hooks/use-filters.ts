import { createSignal } from "solid-js";

export interface FilterState {
  search: string;
  status: string;
  [key: string]: string;
}

export function useFilters(
  initialFilters: FilterState = { search: "", status: "" },
) {
  const [filters, setFilters] = createSignal<FilterState>(initialFilters);

  const setSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const setStatus = (value: string) => {
    setFilters((prev) => ({ ...prev, status: value }));
  };

  const setFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  return {
    filters,
    search: () => filters().search,
    status: () => filters().status,
    setSearch,
    setStatus,
    setFilter,
    clearFilters,
    hasActiveFilters: () => Object.values(filters()).some((v) => v !== ""),
  };
}
