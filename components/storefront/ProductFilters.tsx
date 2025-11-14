import React from 'react';

interface ProductFiltersProps {
  categories: string[];
  sizes: string[];
  filters: {
    category: string;
    size: string;
    priceRange: [number, number];
  };
  onFilterChange: (name: string, value: any) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ categories, sizes, filters, onFilterChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Category</h3>
        <select
          name="category"
          value={filters.category}
          onChange={e => onFilterChange('category', e.target.value)}
          className="w-full p-2 border border-stone-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
        >
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Size</h3>
        <select
          name="size"
          value={filters.size}
          onChange={e => onFilterChange('size', e.target.value)}
          className="w-full p-2 border border-stone-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
        >
          <option value="">All Sizes</option>
          {sizes.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Price Range</h3>
        <div className="flex items-center space-x-2">
            <span>₹{filters.priceRange[0]}</span>
            <input
                type="range"
                min="0"
                max="25000"
                step="500"
                value={filters.priceRange[1]}
                onChange={e => onFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                className="w-full"
            />
            <span>₹{filters.priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
};
