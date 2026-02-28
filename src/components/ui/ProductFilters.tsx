'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FilterOptions } from '@/types';

interface Category {
  id: string;
  name: string;
  _count: { products: number };
}

interface ProductFiltersProps {
  filters: FilterOptions;
  searchQuery: string;
  onFiltersChange: (filters: FilterOptions) => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
  isFiltersOpen: boolean;
  onToggleFilters: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  searchQuery,
  onFiltersChange,
  onSearchChange,
  onClearFilters,
  isFiltersOpen,
  onToggleFilters,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handlePriceRangeChange = (min: number, max: number) => {
    onFiltersChange({
      ...filters,
      priceRange: { min, max },
    });
  };

  const handleInStockChange = (inStock: boolean) => {
    onFiltersChange({
      ...filters,
      inStock,
    });
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category,
    });
  };

  const hasActiveFilters = 
    filters.category !== 'all' ||
    filters.priceRange.min > 0 || 
    filters.priceRange.max < 10000 || 
    filters.inStock;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Mobile Filter Toggle */}
      <div className="flex items-center justify-between lg:hidden">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFilters}
          className="flex items-center space-x-2"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </Button>
      </div>

      {/* Filter Panel */}
        <div className="space-y-6">      <div className={`${isFiltersOpen ? "block" : "hidden"} lg:block`}>
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Category</h4>
            <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="radio"
                name="category"
                value="all"
                checked={filters.category === 'all'}
                onChange={() => handleCategoryChange('all')}
                className="w-4 h-4 text-red-500 bg-background border-border focus:ring-red-500"
              />
              <span className="text-sm group-hover:text-red-500 transition-colors">
                All Categories
              </span>
            </label>
            {loadingCategories ? (
              <div className="text-sm text-muted-foreground">Loading categories...</div>
            ) : (
              categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center space-x-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="category"
                    value={category.id}
                    checked={filters.category === category.id}
                    onChange={() => handleCategoryChange(category.id)}
                    className="w-4 h-4 text-red-500 bg-background border-border focus:ring-red-500"
                  />
                  <span className="text-sm group-hover:text-red-500 transition-colors">
                    {category.name} ({category._count.products})
                  </span>
                </label>
              ))
            )}
          </div>
        </div>

          {/* Price Range Filter */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Price Range</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Min Price</label>
                  <Input
                    type="number"
                    value={filters.priceRange.min}
                    onChange={(e) =>
                      handlePriceRangeChange(
                        Number(e.target.value),
                        filters.priceRange.max
                      )
                    }
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Max Price</label>
                  <Input
                    type="number"
                    value={filters.priceRange.max}
                    onChange={(e) =>
                      handlePriceRangeChange(
                        filters.priceRange.min,
                        Number(e.target.value)
                      )
                    }
                    placeholder="10000"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stock Filter */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Availability</h4>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => handleInStockChange(e.target.checked)}
                className="w-4 h-4 text-red-500 bg-background border-border focus:ring-red-500 rounded"
              />
              <span className="text-sm group-hover:text-red-500 transition-colors">
                In Stock Only
              </span>
            </label>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="w-full flex items-center justify-center space-x-2 border-red-500/20 hover:border-red-500 hover:text-red-500"
            >
              <X className="w-4 h-4" />
              <span>Clear Filters</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;