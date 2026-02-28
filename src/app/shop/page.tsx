'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ui/ProductCard';
import ProductFilters from '@/components/ui/ProductFilters';
import { Button } from '@/components/ui/Button';
import { FilterOptions, Product } from '@/types';
import { Grid, List, ChevronDown } from 'lucide-react';

interface ApiProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  images: { url: string; alt: string }[];
  category: { name: string };
}

const PRODUCTS_PER_LOAD = 12;

const ShopPage = () => {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    material: 'all',
    category: categoryFromUrl || 'all',
    priceRange: { min: 0, max: 10000 }, // Increased max to ensure all products are included
    inStock: false, // Changed to false to show all products initially
  });
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  // Set initial filter state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsFiltersOpen(true);
      } else {
        setIsFiltersOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initial fetch of products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setCurrentPage(1);
      try {
        const params = new URLSearchParams({
          page: '1',
          limit: PRODUCTS_PER_LOAD.toString(),
        });
        
        if (searchQuery.trim()) {
          params.append('search', searchQuery.trim());
        }
        
        if (filters.category !== 'all') {
          params.append('category', filters.category);
        }

        const response = await fetch(`/api/products?${params}`);
        const data = await response.json();
        
        if (data.products) {
          const formattedProducts: Product[] = data.products.map((apiProduct: ApiProduct) => ({
            id: apiProduct.id,
            name: apiProduct.name,
            description: apiProduct.description,
            price: apiProduct.price,
            material: (apiProduct.category?.name?.toLowerCase().includes('leather') ? 'leather' : 'wood') as 'leather' | 'wood',
            images: apiProduct.images?.map(img => img.url) || ['/placeholder-product.jpg'],
            category: apiProduct.category?.name || 'Unknown',
            inStock: true,
            featured: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }));
          setProducts(formattedProducts);
          setTotalProducts(data.pagination?.total || formattedProducts.length);
          setHasMore(formattedProducts.length === PRODUCTS_PER_LOAD && formattedProducts.length < (data.pagination?.total || formattedProducts.length));
        } else {
          setProducts([]);
          setTotalProducts(0);
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setTotalProducts(0);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, filters.category]);

  // Load more products function
  const loadMoreProducts = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const params = new URLSearchParams({
        page: nextPage.toString(),
        limit: PRODUCTS_PER_LOAD.toString(),
      });
      
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      
      if (filters.category !== 'all') {
        params.append('category', filters.category);
      }

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      
      if (data.products) {
        const formattedProducts: Product[] = data.products.map((apiProduct: ApiProduct) => ({
          id: apiProduct.id,
          name: apiProduct.name,
          description: apiProduct.description,
          price: apiProduct.price,
          material: (apiProduct.category?.name?.toLowerCase().includes('leather') ? 'leather' : 'wood') as 'leather' | 'wood',
          images: apiProduct.images?.map(img => img.url) || ['/placeholder-product.jpg'],
          category: apiProduct.category?.name || 'Unknown',
          inStock: true,
          featured: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        
        setProducts(prev => [...prev, ...formattedProducts]);
        setCurrentPage(nextPage);
        setHasMore(formattedProducts.length === PRODUCTS_PER_LOAD);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more products:', error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  // Filter and search products
  const filteredProducts = useMemo(() => {
    // If no products (regardless of loading state), return empty array
    if (products.length === 0) {
      return [];
    }

    let results = [...products];

    // Note: Search and category filtering are now handled server-side

    // Material filter
    if (filters.material !== 'all') {
      results = results.filter((product) => product.material === filters.material);
    }

    // Price range filter - only apply if user has modified the default range
    const hasCustomPriceRange = filters.priceRange.min > 0 || filters.priceRange.max < 10000;
    if (hasCustomPriceRange) {
      results = results.filter(
        (product) =>
          product.price >= filters.priceRange.min &&
          product.price <= filters.priceRange.max
      );
    }

    // Stock filter - only apply if explicitly enabled
    if (filters.inStock) {
      results = results.filter((product) => product.inStock);
    }

    // Sorting
    results.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'price') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (sortBy === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // String comparison for name
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    return results;
  }, [products, searchQuery, filters, sortBy, sortOrder]);

  // No pagination needed - using Load More functionality

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearFilters = () => {
    setFilters({
      material: 'all',
      category: 'all',
      priceRange: { min: 0, max: 10000 }, // Increased max to ensure all products are included
      inStock: false, // Changed to false to show all products
    });
    setSearchQuery('');
  };

  const handleSortChange = (sort: string) => {
    const [field, order] = sort.split('-');
    setSortBy(field as any);
    setSortOrder(order as any);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-amber-50/30 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Decorative top line */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-12 bg-amber-400" />
              <span className="text-xs uppercase tracking-[0.3em] text-amber-700 font-light">
                Collection
              </span>
              <div className="h-px w-12 bg-amber-400" />
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-6 tracking-wide">
              Notre <span className="italic font-serif">Boutique</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 font-light tracking-wide leading-relaxed">
              Découvrez notre collection de sacs artisanaux en cuir, fabriqués à la main en Tunisie
            </p>
          </motion.div>
        </div>

        {/* Decorative bottom element */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <ProductFilters
                  filters={filters}
                  searchQuery={searchQuery}
                  onFiltersChange={handleFiltersChange}
                  onSearchChange={handleSearchChange}
                  onClearFilters={handleClearFilters}
                  isFiltersOpen={isFiltersOpen}
                  onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
                />
              </div>
            </div>

            {/* Products Section */}
            <div className="lg:col-span-3">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 pb-6 border-b border-amber-200/50 space-y-4 sm:space-y-0">
                <div className="text-sm text-gray-600 font-light tracking-wide">
                  <span className="text-amber-800 font-normal">{filteredProducts.length}</span> sur {totalProducts} produits
                </div>

                <div className="flex items-center space-x-4">
                  {/* View Mode Toggle */}
                  <div className="flex rounded-none border border-amber-200 overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2.5 transition-all duration-300 ${
                        viewMode === 'grid'
                          ? 'bg-amber-700 text-white'
                          : 'bg-white hover:bg-amber-50 text-gray-600'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2.5 transition-all duration-300 ${
                        viewMode === 'list'
                          ? 'bg-amber-700 text-white'
                          : 'bg-white hover:bg-amber-50 text-gray-600'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="appearance-none bg-white border border-amber-200 px-4 py-2.5 pr-10 text-sm font-light tracking-wide focus:outline-none focus:border-amber-400 transition-colors text-gray-700"
                    >
                      <option value="createdAt-desc">Nouveautés</option>
                      <option value="createdAt-asc">Anciens</option>
                      <option value="name-asc">Nom A-Z</option>
                      <option value="name-desc">Nom Z-A</option>
                      <option value="price-asc">Prix croissant</option>
                      <option value="price-desc">Prix décroissant</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-amber-700" />
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <>
                  <motion.div
                    layout
                    className={`grid gap-8 ${
                      viewMode === 'grid'
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                        : 'grid-cols-1'
                    }`}
                  >
                    {filteredProducts.map((product: Product, index: number) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                      >
                        <ProductCard 
                          product={product} 
                          className={viewMode === 'list' ? 'flex-row' : ''}
                        />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="flex justify-center mt-16">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={loadMoreProducts}
                        disabled={loadingMore}
                        className="px-10 py-4 border border-amber-300 hover:border-amber-600 hover:bg-amber-700 hover:text-white transition-all duration-300 text-gray-900 font-light tracking-[0.15em] uppercase text-sm"
                      >
                        {loadingMore ? (
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 border-2 border-amber-300 border-t-amber-700 rounded-full animate-spin"></div>
                            <span>Chargement...</span>
                          </div>
                        ) : (
                          <span>Voir plus de produits</span>
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-24">
                  <div className="text-7xl mb-6 opacity-20">🔍</div>
                  <h3 className="text-2xl font-light text-gray-900 mb-3 tracking-wide">
                    Aucun produit trouvé
                  </h3>
                  <p className="text-gray-600 font-light mb-8 tracking-wide">
                    Essayez d'ajuster vos critères de recherche ou de filtrage
                  </p>
                  <Button 
                    onClick={handleClearFilters} 
                    variant="outline"
                    className="px-8 py-3 border border-amber-300 hover:border-amber-600 hover:bg-amber-700 hover:text-white transition-all duration-300 text-gray-900 font-light tracking-[0.15em] uppercase text-sm"
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;