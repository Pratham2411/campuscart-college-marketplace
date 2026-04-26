import { Search, SlidersHorizontal } from "lucide-react";
import { SORT_OPTIONS } from "../utils/constants.js";

export default function ProductFilters({
  filters,
  categories,
  onChange,
  onReset
}) {
  return (
    <section className="surface-card space-y-4 p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <SlidersHorizontal size={18} />
        Filter Listings
      </div>

      <label className="relative block">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          className="input-field pl-11"
          onChange={(event) => onChange("search", event.target.value)}
          placeholder="Search by keyword, item, or tag"
          type="text"
          value={filters.search}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <select
          className="input-field"
          onChange={(event) => onChange("category", event.target.value)}
          value={filters.category}
        >
          <option value="All">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <input
          className="input-field"
          min="0"
          onChange={(event) => onChange("minPrice", event.target.value)}
          placeholder="Min price"
          type="number"
          value={filters.minPrice}
        />

        <input
          className="input-field"
          min="0"
          onChange={(event) => onChange("maxPrice", event.target.value)}
          placeholder="Max price"
          type="number"
          value={filters.maxPrice}
        />

        <select
          className="input-field"
          onChange={(event) => onChange("sortBy", event.target.value)}
          value={filters.sortBy}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button className="btn-secondary w-full" onClick={onReset} type="button">
          Reset Filters
        </button>
      </div>
    </section>
  );
}
