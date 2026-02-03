import * as React from 'react';
import type { Category } from "../api/category.api";

export interface FiltersProps {
  filters: {
    search?: string;
    categoryId?: string;
    location?: string;
    date?: string;
  };
  categories: Category[];
  onChange: (newFilters: any) => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, categories, onChange }) => {
  return (
    <div className="bg-neutral-secondary-soft p-6 rounded-base shadow-lg border border-default/60 mb-6 backdrop-blur-sm">
      <h2 className="text-heading text-lg font-semibold mb-4 pb-2 border-b border-default/40">
        Filters
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Search */}
        <div>
          <label className="block mb-1 text-body font-medium">Search</label>
          <input
            type="text"
            value={filters.search || ""}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search title or description"
            className="w-full p-2 border border-default rounded-base bg-neutral-primary text-body"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 text-body font-medium">Category</label>
          <select
            value={filters.categoryId || ""}
            onChange={(e) =>
              onChange({ ...filters, categoryId: e.target.value })
            }
            className="w-full p-2 border border-default rounded-base bg-neutral-primary text-body"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={String(category.categoryId)}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        {/* Location */}
        <div>
          <label className="block mb-1 text-body font-medium">Location</label>
          <input
            type="text"
            value={filters.location || ""}
            onChange={(e) =>
              onChange({ ...filters, location: e.target.value })
            }
            placeholder="e.g., Luxembourg"
            className="w-full p-2 border border-default rounded-base bg-neutral-primary text-body"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1 text-body font-medium">Date</label>
          <input
            type="date"
            value={filters.date || ""}
            onChange={(e) => onChange({ ...filters, date: e.target.value })}
            className="w-full p-2 border border-default rounded-base bg-neutral-primary text-body"
          />
        </div>

      </div>
    </div>
  );
};

export default Filters;
