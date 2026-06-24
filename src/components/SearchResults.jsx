import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Filter,
  X,
  TrendingDown,
  TrendingUp,
  Brain,
  Star,
  ChevronDown,
  Clock,
  Flame,
  ArrowRight,
  ShoppingBag,
  SlidersHorizontal,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';

// Enhanced Mock Data for Search Results
const MOCK_PRODUCTS = [
  {
    id: 1,
    title: 'Apple iPhone 15 Pro Max (256GB) - Titanium Blue',
    brand: 'Apple',
    category: 'Phone',
    lowestPrice: 61999,
    highestPrice: 65990,
    cheapestStore: 'Amazon.eg',
    cheapestStoreLogo: 'AMZ',
    priceDifference: 3991,
    aiVerdict: 'Historical low. Buy now.',
    aiStatus: 'success',
    priceTrend: 'down',
    rating: 4.9,
    reviews: 1240,
    image: 'bg-blue-100 text-blue-500' // Placeholder for image
  },
  {
    id: 2,
    title: 'Samsung Galaxy S24 Ultra (512GB) - Titanium Gray',
    brand: 'Samsung',
    category: 'Phone',
    lowestPrice: 58500,
    highestPrice: 62000,
    cheapestStore: 'Noon.eg',
    cheapestStoreLogo: 'NON',
    priceDifference: 3500,
    aiVerdict: 'Price stable. Safe to buy.',
    aiStatus: 'success',
    priceTrend: 'stable',
    rating: 4.8,
    reviews: 856,
    image: 'bg-gray-200 text-gray-600'
  },
  {
    id: 3,
    title: 'Sony PlayStation 5 Console (Slim) - Middle East Version',
    brand: 'Sony',
    category: 'Gaming',
    lowestPrice: 23499,
    highestPrice: 25499,
    cheapestStore: 'Amazon.eg',
    cheapestStoreLogo: 'AMZ',
    priceDifference: 2000,
    aiVerdict: 'Highly recommended to purchase today.',
    aiStatus: 'success',
    priceTrend: 'down',
    rating: 4.9,
    reviews: 3200,
    image: 'bg-slate-100 text-slate-800'
  },
  {
    id: 4,
    title: 'Lenovo Legion 5 Pro Intel Core i7 - RTX 4060',
    brand: 'Lenovo',
    category: 'Laptop',
    lowestPrice: 54200,
    highestPrice: 58500,
    cheapestStore: 'Noon.eg',
    cheapestStoreLogo: 'NON',
    priceDifference: 4300,
    aiVerdict: 'Prices fluctuating. Expected drop in 5 days.',
    aiStatus: 'warning',
    priceTrend: 'up',
    rating: 4.7,
    reviews: 420,
    image: 'bg-neutral-800 text-neutral-400'
  },
  {
    id: 5,
    title: 'LG OLED C3 Series 55-inch 4K Smart TV',
    brand: 'LG',
    category: 'TV',
    lowestPrice: 47990,
    highestPrice: 53999,
    cheapestStore: 'B.TECH',
    cheapestStoreLogo: 'BTC',
    priceDifference: 6009,
    aiVerdict: 'Excellent deal. 11% below average.',
    aiStatus: 'success',
    priceTrend: 'down',
    rating: 4.8,
    reviews: 650,
    image: 'bg-zinc-100 text-zinc-500'
  },
  {
    id: 6,
    title: 'Apple AirPods Pro (2nd Generation)',
    brand: 'Apple',
    category: 'Audio',
    lowestPrice: 11200,
    highestPrice: 12500,
    cheapestStore: 'Amazon.eg',
    cheapestStoreLogo: 'AMZ',
    priceDifference: 1300,
    aiVerdict: 'Good price. Rare discounts.',
    aiStatus: 'success',
    priceTrend: 'stable',
    rating: 4.9,
    reviews: 4500,
    image: 'bg-white text-gray-300'
  }
];

const BRANDS = ['All', 'Apple', 'Samsung', 'Sony', 'Lenovo', 'LG'];
const CATEGORIES = ['All', 'Phone', 'Laptop', 'Gaming', 'TV', 'Audio'];
const STORES = ['All', 'Amazon.eg', 'Noon.eg', 'B.TECH'];
const SORTS = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Biggest Discount'];

export default function SearchResults() {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    brand: 'All',
    category: 'All',
    store: 'All',
    sort: 'Recommended'
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  
  const searchRef = useRef(null);

  const RECENT_SEARCHES = ['iPhone 15', 'RTX 4070', 'PS5 Controller'];
  const POPULAR_SEARCHES = ['MacBook Air M3', 'Galaxy S24', 'AirPods Pro', 'LG OLED'];

  // Simulate instant filtering
  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesQuery = product.title.toLowerCase().includes(query.toLowerCase());
    const matchesBrand = activeFilters.brand === 'All' || product.brand === activeFilters.brand;
    const matchesCategory = activeFilters.category === 'All' || product.category === activeFilters.category;
    const matchesStore = activeFilters.store === 'All' || product.cheapestStore === activeFilters.store;
    return matchesQuery && matchesBrand && matchesCategory && matchesStore;
  }).sort((a, b) => {
    if (activeFilters.sort === 'Price: Low to High') return a.lowestPrice - b.lowestPrice;
    if (activeFilters.sort === 'Price: High to Low') return b.lowestPrice - a.lowestPrice;
    if (activeFilters.sort === 'Biggest Discount') return b.priceDifference - a.priceDifference;
    return 0; // Recommended
  });

  // Handle outside click for autocomplete
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsAutocompleteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simulate loading state on query change (only if empty to show skeleton briefly)
  useEffect(() => {
    if (query === '' && filteredProducts.length > 0) {
      // no loading for empty if we just cleared
    }
  }, [query]);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    setIsAutocompleteOpen(true);
  };

  const clearFilters = () => {
    setActiveFilters({ brand: 'All', category: 'All', store: 'All', sort: 'Recommended' });
  };

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans">
      {/* Premium Header / Search Area */}
      <div className="sticky top-0 z-40 bg-navbar/80 backdrop-blur-xl border-b border-border shadow-sm pt-6 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col space-y-4">
          
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Search Results</h1>
            <button className="p-2 bg-surface rounded-full hover:bg-border transition-colors">
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {/* Large Premium Search Bar */}
          <div className="relative z-50 w-full" ref={searchRef}>
            <div className="relative flex items-center w-full bg-card glass border border-border rounded-2xl shadow-md search-glow p-1.5 transition-all duration-300">
              <div className="pl-4 pr-2 text-primary">
                <Search className="w-6 h-6" />
              </div>
              <input
                type="text"
                placeholder="Search for anything..."
                value={query}
                onChange={handleSearchChange}
                onFocus={() => setIsAutocompleteOpen(true)}
                className="w-full py-3 px-2 bg-transparent text-text-primary placeholder-muted outline-none text-lg font-semibold"
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); setIsAutocompleteOpen(false); }}
                  className="p-2 mr-1 rounded-full hover:bg-surface text-text-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button 
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={`flex items-center space-x-2 py-2.5 px-4 rounded-xl font-bold text-sm transition-all ${isFiltersOpen ? 'bg-primary text-white' : 'bg-surface text-text-primary hover:bg-border'}`}
              >
                <SlidersHorizontal className="w-4.5 h-4.5" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>

            {/* Autocomplete Dropdown */}
            {isAutocompleteOpen && (
              <div className="absolute top-full mt-3 left-0 right-0 bg-card glass border border-border rounded-2xl shadow-2xl overflow-hidden animate-slide-down">
                <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-border">
                  {/* Recent Searches */}
                  <div className="flex-1 p-5">
                    <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-muted mb-4">
                      <Clock className="w-4 h-4" />
                      <span>Recent Searches</span>
                    </div>
                    <ul className="space-y-2">
                      {RECENT_SEARCHES.map(item => (
                        <li key={item}>
                          <button 
                            onClick={() => { setQuery(item); setIsAutocompleteOpen(false); }}
                            className="w-full text-left py-2 px-3 rounded-lg hover:bg-surface text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors flex items-center"
                          >
                            <Search className="w-3.5 h-3.5 mr-2 opacity-50" />
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Popular Searches */}
                  <div className="flex-1 p-5 bg-surface/30">
                    <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-primary mb-4">
                      <Flame className="w-4 h-4" />
                      <span>Popular Now</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCHES.map(item => (
                        <button 
                          key={item}
                          onClick={() => { setQuery(item); setIsAutocompleteOpen(false); }}
                          className="py-1.5 px-3 border border-border bg-card hover:border-primary rounded-full text-xs font-semibold text-text-secondary hover:text-primary transition-all"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Advanced Filters (Collapsible) */}
          {isFiltersOpen && (
            <div className="mt-4 p-5 bg-card glass rounded-2xl border border-border animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-text-primary">Advanced Filters</h3>
                <button onClick={clearFilters} className="text-xs font-bold text-primary hover:underline">
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Brand */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase">Brand</label>
                  <select 
                    value={activeFilters.brand}
                    onChange={e => setActiveFilters({...activeFilters, brand: e.target.value})}
                    className="w-full bg-surface border border-border text-text-primary text-sm rounded-xl px-3 py-2 outline-none focus:border-primary"
                  >
                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                {/* Category */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase">Category</label>
                  <select 
                    value={activeFilters.category}
                    onChange={e => setActiveFilters({...activeFilters, category: e.target.value})}
                    className="w-full bg-surface border border-border text-text-primary text-sm rounded-xl px-3 py-2 outline-none focus:border-primary"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {/* Store */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase">Store</label>
                  <select 
                    value={activeFilters.store}
                    onChange={e => setActiveFilters({...activeFilters, store: e.target.value})}
                    className="w-full bg-surface border border-border text-text-primary text-sm rounded-xl px-3 py-2 outline-none focus:border-primary"
                  >
                    {STORES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {/* Sort */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase">Sort By</label>
                  <select 
                    value={activeFilters.sort}
                    onChange={e => setActiveFilters({...activeFilters, sort: e.target.value})}
                    className="w-full bg-surface border border-border text-text-primary text-sm rounded-xl px-3 py-2 outline-none focus:border-primary"
                  >
                    {SORTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="font-medium text-text-secondary">
            Showing <span className="font-bold text-text-primary">{filteredProducts.length}</span> results
            {query && <span> for "<span className="font-bold text-text-primary">{query}</span>"</span>}
          </p>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center text-muted mb-6">
              <Search className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-text-primary mb-2">No matches found</h2>
            <p className="text-text-secondary max-w-md">We couldn't find anything matching your search criteria. Try adjusting your filters or search terms.</p>
            <button 
              onClick={clearFilters}
              className="mt-6 py-2.5 px-6 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-card glass border border-border rounded-2xl overflow-hidden hover-lift shadow-sm flex flex-col animate-fade-in-up">
              
              {/* Product Header / Image Placeholder */}
              <div className={`h-40 ${product.image} flex items-center justify-center relative`}>
                <ImageIcon className="w-12 h-12 opacity-50" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-lg text-text-primary shadow-sm flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                  <span>{product.rating}</span>
                </div>
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md">
                  {product.category}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-1 text-xs font-bold text-muted uppercase tracking-wider">{product.brand}</div>
                <h3 className="font-bold text-base text-text-primary leading-snug line-clamp-2 mb-4">
                  {product.title}
                </h3>

                {/* Price Section */}
                <div className="mt-auto space-y-3">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-muted uppercase">Best Price</p>
                      <p className="text-2xl font-extrabold text-success tracking-tight">
                        EGP {product.lowestPrice.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-muted uppercase">Highest</p>
                      <p className="text-sm font-semibold text-text-secondary line-through">
                        EGP {product.highestPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Badge & Difference */}
                  <div className="flex items-center justify-between p-2.5 bg-surface/50 rounded-xl border border-border">
                    <div className="flex items-center space-x-2">
                      <span className="bg-white dark:bg-black px-1.5 py-0.5 rounded text-[10px] font-extrabold text-text-primary border border-border">
                        {product.cheapestStoreLogo}
                      </span>
                      <span className="text-xs font-semibold">{product.cheapestStore}</span>
                    </div>
                    <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      Save EGP {product.priceDifference.toLocaleString()}
                    </span>
                  </div>

                  {/* AI & Trend */}
                  <div className="flex items-center space-x-2 text-xs">
                    <div className={`flex-1 flex items-center space-x-1.5 p-2 rounded-lg border ${
                      product.aiStatus === 'success' ? 'bg-success/5 border-success/20 text-success' : 'bg-warning/5 border-warning/20 text-warning'
                    }`}>
                      <Brain className="w-4 h-4 shrink-0" />
                      <span className="font-semibold text-[11px] truncate">{product.aiVerdict}</span>
                    </div>
                    <div className="p-2 bg-surface border border-border rounded-lg flex items-center justify-center shrink-0">
                      {product.priceTrend === 'down' ? <TrendingDown className="w-4 h-4 text-success" /> : 
                       product.priceTrend === 'up' ? <TrendingUp className="w-4 h-4 text-danger" /> : 
                       <TrendingDown className="w-4 h-4 text-text-secondary opacity-50" />}
                    </div>
                  </div>
                </div>

              </div>
              
              {/* Footer / Action */}
              <div className="p-4 border-t border-border bg-surface/30">
                <button className="w-full flex items-center justify-center space-x-2 bg-text-primary text-background hover:opacity-90 py-2.5 rounded-xl font-bold text-sm transition-opacity">
                  <ShoppingBag className="w-4 h-4" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
