import React, { useState, useMemo } from 'react';
import { useAppData } from '../../hooks/useAppData';
import { ProductCard } from '../../components/storefront/ProductCard';
import { ProductFilters } from '../../components/storefront/ProductFilters';
import { Item } from '../../types';

export const ShopPage: React.FC = () => {
  const { data, loading } = useAppData();
  const [filters, setFilters] = useState({
    category: '',
    size: '',
    // FIX: Explicitly type priceRange as a tuple to match ProductFilters prop type.
    priceRange: [0, 25000] as [number, number],
    searchTerm: ''
  });

  const handleFilterChange = (name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const filteredItems = useMemo(() => {
    if (!data?.items) return [];
    return data.items.filter(item => {
      const matchesCategory = filters.category ? item.category === filters.category : true;
      const matchesSize = filters.size ? item.sizes.includes(filters.size) : true;
      const matchesPrice = item.buy_price >= filters.priceRange[0] && item.buy_price <= filters.priceRange[1];
      const matchesSearch = filters.searchTerm ? item.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) : true;
      return matchesCategory && matchesSize && matchesPrice && matchesSearch;
    });
  }, [data?.items, filters]);
  
  const uniqueCategories = useMemo(() => {
    if (!data?.items) return [];
    return [...new Set(data.items.map(item => item.category))];
  }, [data?.items]);

  const uniqueSizes = useMemo(() => {
    if (!data?.items) return [];
    return [...new Set(data.items.flatMap(item => item.sizes))];
  }, [data?.items]);

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold">Our Collection</h1>
        <p className="text-lg text-slate-600 mt-2">Browse our curated selection of fine garments.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="sticky top-28 bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-100">
            <h2 className="text-2xl font-semibold mb-6">Filters</h2>
             <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={filters.searchTerm}
                    onChange={e => handleFilterChange('searchTerm', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
             </div>
            <ProductFilters
              categories={uniqueCategories}
              sizes={uniqueSizes}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </aside>

        <main className="lg:col-span-3">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredItems.map(item => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-slate-600">No products match your filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};