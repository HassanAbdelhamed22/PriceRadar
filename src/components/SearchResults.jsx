import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search, Filter, X, TrendingDown, TrendingUp, Brain, Star,
  ChevronDown, ChevronRight, Clock, Flame, ArrowRight, ShoppingBag, SlidersHorizontal,
  CheckCircle2, Check, Plus, Scale, Radar, Sun, Moon, Menu, Zap,
  TrendingUp as TrendUp, Target, BarChart3, ShoppingCart, Award,
  DollarSign, Percent,
  Sparkles,
  Heart
} from 'lucide-react';

import AISearchWorkflow from './AISearchWorkflow';
import ShopperProfileModal from './ShopperProfileModal';
import productsData from '../data/products.json';

/* ─────────────────────────────────────────────────────────────
   DATA MAPPING
───────────────────────────────────────────────────────────── */
const MOCK_PRODUCTS = productsData.map(product => {
  const sortedStores = [...product.stores].sort((a, b) => a.price - b.price);
  const cheapest     = sortedStores[0];
  const mostExp      = sortedStores[sortedStores.length - 1];
  const lowestPrice  = cheapest?.price || 0;
  const highestPrice = mostExp?.price  || 0;
  const priceDiff    = highestPrice - lowestPrice;

  let category = product.category;
  if (category === 'Laptops')    category = 'Laptop';
  if (category === 'Smartphones') category = 'Phone';

  let aiVerdict = 'Price stable. Safe to buy.';
  let aiStatus  = 'success';
  if (product.recommendation) {
    aiVerdict = `${product.recommendation.action}. Expect ${product.recommendation.expectedChange} change (${product.recommendation.confidence}% confidence).`;
    aiStatus  = product.recommendation.action.toLowerCase().includes('wait') ? 'warning' : 'success';
  }

  let cheapestStoreLogo = 'ST';
  if (cheapest) {
    const s = cheapest.name.toLowerCase();
    if (s.includes('amazon')) cheapestStoreLogo = 'AMZ';
    else if (s.includes('noon')) cheapestStoreLogo = 'NON';
    else if (s.includes('jumia')) cheapestStoreLogo = 'JUM';
    else if (s.includes('b.tech')) cheapestStoreLogo = 'BTC';
    else if (s.includes('raya')) cheapestStoreLogo = 'RAY';
  }

  return {
    id: product.id,
    title: product.name,
    brand: product.brand,
    category,
    lowestPrice,
    highestPrice,
    cheapestStore: cheapest?.name || 'Unknown',
    cheapestStoreLogo,
    priceDifference: priceDiff,
    aiVerdict,
    aiStatus,
    priceTrend: product.recommendation?.expectedChange?.startsWith('-') ? 'down' : 'up',
    rating: product.rating  || 4.5,
    reviews: product.reviews || 100,
    image: product.image,
    images: product.images,
    specSummary: product.description,
    stores: product.stores.map(s => {
      let logo = 'ST';
      const n = s.name.toLowerCase();
      if (n.includes('amazon')) logo = 'AMZ';
      else if (n.includes('noon')) logo = 'NON';
      else if (n.includes('jumia')) logo = 'JUM';
      else if (n.includes('b.tech')) logo = 'BTC';
      else if (n.includes('raya')) logo = 'RAY';
      else if (n.includes('select')) logo = 'SEL';
      return { name: s.name, price: s.price, logo, cheapest: cheapest && s.name === cheapest.name };
    }),
    priceHistory: product.priceHistory,
    recommendation: product.recommendation,
    topSearchPlacement: product.topSearchPlacement,
    homepageDealsSpotlight: product.homepageDealsSpotlight,
    recommendedPlacement: product.recommendedPlacement,
    trendingCarousel: product.trendingCarousel,
  };
});

const BRANDS     = ['All', ...new Set(MOCK_PRODUCTS.map(p => p.brand))];
const CATEGORIES = ['All', 'Phone', 'Laptop'];
const STORES     = ['All', 'Amazon Egypt', 'Noon', 'Jumia', 'B.Tech', 'Raya'];
const SORTS      = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Biggest Discount'];

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
const LogoIcon = () => (
  <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-tr from-primary to-accent text-white shadow-lg overflow-hidden shrink-0">
    <Radar className="w-5.5 h-5.5 animate-pulse" />
    <div className="absolute inset-0 border border-white/20 rounded-xl" />
  </div>
);

/* Animated counter hook */
function useCountUp(target, enabled, duration = 900) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!enabled || target === 0) { setCount(target); return; }
    let start = 0;
    const step = target / (duration / 16);
    const iv = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(iv); }
      else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(iv);
  }, [target, enabled, duration]);
  return count;
}

/* ─────────────────────────────────────────────────────────────
   SUMMARY STAT CARD
───────────────────────────────────────────────────────────── */
function StatCard({ label, value, prefix, suffix, icon: Icon, color, enabled, delay = 0 }) {
  const numValue = typeof value === 'number' ? value : 0;
  const counted  = useCountUp(numValue, enabled, 800);

  return (
    <div
      className="animate-slide-up-reveal glass-card bg-card/70 glass border border-border rounded-2xl p-4 flex items-center space-x-3.5 hover-lift"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-0.5">{label}</p>
        {typeof value === 'number' ? (
          <p className="font-black text-text-primary text-lg leading-tight tabular-nums animate-counter-appear">
            {prefix}{counted.toLocaleString()}{suffix}
          </p>
        ) : (
          <p className="font-black text-text-primary text-sm leading-tight truncate">{value}</p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function SearchResults({ theme, toggleTheme }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const queryParam    = searchParams.get('q') || '';
  const categoryParam = searchParams.get('c') || 'All';
  const isFresh       = searchParams.get('fresh') === '1';

  // ── Search text state ─────────────────────────────────────
  // `query`          → what the input shows while typing (live)
  // `committedQuery` → what results actually filter on (only updates after Compare/Enter)
  const [query, setQuery]                   = useState(queryParam);
  const [committedQuery, setCommittedQuery] = useState(queryParam);

  const [activeFilters, setActiveFilters] = useState({
    brand: 'All', category: categoryParam, store: 'All',
    sort: 'Recommended', maxPrice: 80000,
  });

  // ── AI Workflow State ─────────────────────────────────────
  const [showWorkflow, setShowWorkflow]       = useState(isFresh);
  const [workflowDone, setWorkflowDone]       = useState(!isFresh);
  const [resultsVisible, setResultsVisible]   = useState(!isFresh);

  // ── UI State ──────────────────────────────────────────────
  const [isFiltersOpen, setIsFiltersOpen]     = useState(false);
  const [isAutocompleteOpen, setIsAutoOpen]   = useState(false);
  const [visibleCount, setVisibleCount]       = useState(3);
  const [isPaginationLoading, setPagLoading]  = useState(false);
  const [selectedCompare, setSelectedCompare] = useState([]);
  const [showCompareModal, setShowCompare]    = useState(false);

  // Wishlist and Profile drawer state
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('priceradar_wishlist') || '[]');
    } catch {
      return [];
    }
  });
  const [showProfile, setShowProfile] = useState(false);
  const [navbarPoints, setNavbarPoints] = useState(1250);

  // Refresh points display whenever profile modal open/close updates
  useEffect(() => {
    const pts = localStorage.getItem('priceradar_shopper_points');
    if (pts) setNavbarPoints(Number(pts));
  }, [showProfile]);

  const toggleWishlist = (id) => {
    setWishlist(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('priceradar_wishlist', JSON.stringify(next));
      return next;
    });
  };

  const searchRef = useRef(null);

  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('priceradar_recent_searches');
      return saved ? JSON.parse(saved) : ['iPhone 15', 'RTX 4070', 'PS5 Controller'];
    } catch {
      return ['iPhone 15', 'RTX 4070', 'PS5 Controller'];
    }
  });

  const saveRecentSearch = useCallback((q) => {
    if (!q.trim()) return;
    setRecentSearches(prev => {
      const next = [q, ...prev.filter(s => s.toLowerCase() !== q.toLowerCase())].slice(0, 5);
      localStorage.setItem('priceradar_recent_searches', JSON.stringify(next));
      return next;
    });
  }, []);

  const autocompleteSuggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return productsData
      .filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
      .slice(0, 6)
      .map(p => ({
        id: p.id,
        title: p.name,
      }));
  }, [query]);

  const POPULAR_SEARCHES = ['MacBook Air M3', 'Galaxy S24', 'AirPods Pro', 'LG OLED'];

  const spotlightDeals = useMemo(() => {
    return productsData
      .map(product => {
        const sortedStores = [...product.stores].sort((a, b) => a.price - b.price);
        const cheapest = sortedStores[0];
        const mostExpensive = sortedStores[sortedStores.length - 1];
        const lowestPrice = cheapest ? cheapest.price : 0;
        const highestPrice = mostExpensive ? mostExpensive.price : 0;
        const savings = highestPrice - lowestPrice;
        const savingPercent = highestPrice > 0 ? Math.round((savings / highestPrice) * 100) : 0;
        return {
          id: product.id,
          title: product.name,
          brand: product.brand,
          lowestPrice,
          highestPrice,
          savings,
          savingPercent,
          image: product.image,
        };
      })
      .sort((a, b) => b.savings - a.savings)
      .slice(0, 3);
  }, []);

  /* Remove ?fresh param from URL once workflow starts (prevent re-trigger on refresh) */
  useEffect(() => {
    if (isFresh) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('fresh');
      window.history.replaceState(null, '', `${window.location.pathname}?${newParams}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Sync local query display when URL param changes (e.g. back/fwd navigation) */
  useEffect(() => {
    setQuery(queryParam);
    setCommittedQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    setActiveFilters(prev => ({ ...prev, category: categoryParam }));
  }, [categoryParam]);

  /* Close autocomplete on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setIsAutoOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Filtered products ─────────────────────────────────────
     Filtering is driven by `committedQuery` (updated only on Compare/Enter),
     NOT by the live `query` input value.
  ─────────────────────────────────────────────────────────── */
  const filteredProducts = useMemo(() =>
    MOCK_PRODUCTS.filter(p => {
      const q  = committedQuery.trim() === '' || p.title.toLowerCase().includes(committedQuery.toLowerCase()) || p.brand.toLowerCase().includes(committedQuery.toLowerCase());
      const b  = activeFilters.brand    === 'All' || p.brand         === activeFilters.brand;
      const c  = activeFilters.category === 'All' || p.category      === activeFilters.category;
      const s  = activeFilters.store    === 'All' || p.cheapestStore === activeFilters.store;
      const pr = p.lowestPrice <= activeFilters.maxPrice;
      return q && b && c && s && pr;
    }).sort((a, b) => {
      // Float sponsored search placement products to the top
      if (a.topSearchPlacement && !b.topSearchPlacement) return -1;
      if (!a.topSearchPlacement && b.topSearchPlacement) return 1;

      if (activeFilters.sort === 'Price: Low to High')  return a.lowestPrice   - b.lowestPrice;
      if (activeFilters.sort === 'Price: High to Low') return b.lowestPrice   - a.lowestPrice;
      if (activeFilters.sort === 'Biggest Discount')   return b.priceDifference - a.priceDifference;
      return 0;
    }),
  [committedQuery, activeFilters]);

  /* ── Summary statistics ──────────────────────────────── */
  const summaryStats = useMemo(() => {
    if (filteredProducts.length === 0) return null;
    const lowestPrice  = Math.min(...filteredProducts.map(p => p.lowestPrice));
    const avgPrice     = Math.round(filteredProducts.reduce((s, p) => s + p.lowestPrice, 0) / filteredProducts.length);
    const maxSavings   = Math.max(...filteredProducts.map(p => p.priceDifference));
    const topProduct   = filteredProducts[0];
    const storeCount   = {}; filteredProducts.forEach(p => { storeCount[p.cheapestStore] = (storeCount[p.cheapestStore] || 0) + 1; });
    const cheapestStoreName = Object.entries(storeCount).sort((a,b) => b[1]-a[1])[0]?.[0] || '';
    const confidence   = topProduct?.recommendation?.confidence || 88;
    return { lowestPrice, avgPrice, maxSavings, cheapestStoreName, confidence, recommendation: topProduct?.aiVerdict };
  }, [filteredProducts]);



  /* ── Handlers ─────────────────────────────────────────── */
  const handleWorkflowComplete = useCallback(() => {
    if (filteredProducts.length === 1) {
      navigate(`/product/${filteredProducts[0].id}`);
      return;
    }
    setShowWorkflow(false);
    setWorkflowDone(true);
    setTimeout(() => setResultsVisible(true), 80);
  }, [filteredProducts, navigate]);

  // Triggered by the Compare button or pressing Enter in the search bar
  // Always re-runs the full AI workflow experience
  const handleCompareSubmit = useCallback(() => {
    if (!query.trim()) return;
    saveRecentSearch(query.trim());
    setIsAutoOpen(false);
    setVisibleCount(3);
    navigate(`/search?q=${encodeURIComponent(query.trim())}&fresh=1`);
  }, [query, navigate, saveRecentSearch]);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    setIsAutoOpen(true);
  };

  const clearFilters = () => {
    setActiveFilters({ brand: 'All', category: 'All', store: 'All', sort: 'Recommended', maxPrice: 80000 });
    setSearchParams({ q: committedQuery, c: 'All' });
  };

  const toggleCompare = (product) => {
    if (selectedCompare.some(p => p.id === product.id)) {
      setSelectedCompare(prev => prev.filter(p => p.id !== product.id));
    } else {
      if (selectedCompare.length >= 3) { alert('You can compare up to 3 products side-by-side.'); return; }
      setSelectedCompare(prev => [...prev, product]);
    }
  };

  const loadMoreItems = () => {
    setPagLoading(true);
    setTimeout(() => { setVisibleCount(p => p + 3); setPagLoading(false); }, 600);
  };

  const hasActiveFilters =
    activeFilters.brand !== 'All' || activeFilters.category !== 'All' ||
    activeFilters.store !== 'All' || activeFilters.maxPrice !== 80000;

  /* ── AI Workflow: pass top matching product ─────────── */
  const topProduct = useMemo(() => filteredProducts[0] || null, [filteredProducts]);

  /* ─────────────────────────────────────────────────────────
     RENDER: AI WORKFLOW OVERLAY
  ───────────────────────────────────────────────────────── */
  if (showWorkflow) {
    return (
      <AISearchWorkflow
        query={queryParam || query}
        productData={topProduct}
        onComplete={handleWorkflowComplete}
      />
    );
  }

  /* ─────────────────────────────────────────────────────────
     RENDER: RESULTS
  ───────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background text-text-primary font-sans relative pb-24">

      {/* DECORATIVE BACKGROUNDS */}
      <div className="absolute top-0 inset-x-0 h-192 grid-overlay pointer-events-none z-0" />
      <div className="absolute top-24 left-[5%] w-96 h-96 radial-glow rounded-full pointer-events-none z-0" />
      <div className="absolute top-48 right-[5%] w-96 h-96 radial-glow rounded-full pointer-events-none z-0" />

      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <header className="sticky top-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-7xl glass rounded-full border transition-all duration-300 shadow-md">
        <div className="px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center space-x-2.5 cursor-pointer bg-transparent border-none">
            <LogoIcon />
            <div className="flex items-center space-x-2 text-left">
              <span className="font-extrabold text-lg tracking-tight text-text-primary">PriceRadar</span>
              <span className="text-[10px] font-black bg-secondary text-background px-1.5 py-0.5 rounded-md uppercase tracking-wider">EG</span>
            </div>
          </button>

          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => navigate('/')} className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer bg-transparent border-none">Home</button>
            <button onClick={() => navigate('/categories')} className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer bg-transparent border-none">Categories</button>
            <button onClick={() => navigate('/deals')} className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer bg-transparent border-none">Deals</button>
            <button onClick={() => navigate('/merchant')} className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer bg-transparent border-none">For Retailers</button>
          </nav>

          <div className="flex items-center space-x-3.5">
            {/* Wishlist toggle & Drawer */}
            <button 
              onClick={() => setShowProfile(true)} 
              aria-label="Wishlist drawer"
              className="relative p-2 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-all duration-200 cursor-pointer border-none bg-transparent"
            >
              <Heart className={`w-4.5 h-4.5 ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-card">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Loyalty points chip */}
            <button 
              onClick={() => setShowProfile(true)} 
              className="hidden sm:inline-flex py-1.5 px-3 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black rounded-full items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-primary animate-pulse" />
              <span>{navbarPoints} pts</span>
            </button>

            <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-all duration-200 cursor-pointer bg-transparent border-none">
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-full hover:bg-surface text-text-secondary transition-all duration-200 cursor-pointer bg-transparent border-none">
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden glass border-b absolute left-0 right-0 py-4 px-6 animate-slide-down shadow-xl flex flex-col space-y-4 rounded-3xl mt-2 border">
            <button onClick={() => { setMobileMenuOpen(false); navigate('/'); }} className="text-left font-semibold text-text-secondary hover:text-primary transition-colors py-1 bg-transparent border-none">Home</button>
            <button onClick={() => { setMobileMenuOpen(false); navigate('/categories'); }} className="text-left font-semibold text-text-secondary hover:text-primary transition-colors py-1 bg-transparent border-none">Categories</button>
            <button onClick={() => { setMobileMenuOpen(false); navigate('/deals'); }} className="text-left font-semibold text-text-secondary hover:text-primary transition-colors py-1 bg-transparent border-none">Deals</button>
            <button onClick={() => { setMobileMenuOpen(false); navigate('/merchant'); }} className="text-left font-semibold text-text-secondary hover:text-primary transition-colors py-1 bg-transparent border-none">For Retailers</button>
          </div>
        )}
      </header>

      {/* ── MAIN ────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10 space-y-6">

        {/* Search controls */}
        <div className="bg-card glass border border-border rounded-3xl p-6 shadow-sm flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight animate-fade-in">
              {committedQuery ? `Results for "${committedQuery}"` : 'Search Results'}
            </h1>
            <button onClick={() => navigate('/')} className="p-2 bg-surface rounded-full hover:bg-border transition-colors">
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative z-50 w-full" ref={searchRef}>
            <div className="relative flex items-center w-full bg-card glass border border-border rounded-2xl shadow-md search-focus-glow p-1.5 transition-all duration-300">
              <div className="pl-4 pr-2 text-primary">
                <Search className="w-6 h-6" />
              </div>
              <input
                type="text"
                placeholder="Search for iPhone 15, S24 Ultra, PS5, OLED..."
                value={query}
                onChange={handleSearchChange}
                onFocus={() => setIsAutoOpen(true)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleCompareSubmit();
                  if (e.key === 'Escape') { setIsAutoOpen(false); }
                }}
                className="w-full py-3 px-2 bg-transparent text-text-primary placeholder-muted outline-none text-lg font-semibold"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    setCommittedQuery('');
                    setIsAutoOpen(false);
                    navigate(`/search?q=&c=${activeFilters.category}`);
                  }}
                  className="p-2 mr-1 rounded-full hover:bg-surface text-text-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={`flex items-center space-x-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${isFiltersOpen ? 'bg-primary text-white' : 'bg-surface text-text-primary hover:bg-border'}`}
              >
                <SlidersHorizontal className="w-4.5 h-4.5" />
                <span className="hidden sm:inline">Filters</span>
              </button>
              {/* Compare button — triggers AI workflow */}
              <button
                onClick={handleCompareSubmit}
                disabled={!query.trim()}
                className="ml-2 flex items-center space-x-1.5 py-3 px-5 bg-linear-to-r from-orange-500 to-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.97] transition-all btn-gradient-shimmer shrink-0"
              >
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Compare</span>
              </button>
            </div>

            {/* Dirty query hint — shown when user has typed but not yet submitted */}
            {query.trim() !== committedQuery.trim() && query.trim() !== '' && (
              <div className="mt-2 flex items-center space-x-2 text-xs font-semibold text-muted animate-fade-in pl-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
                <span>Press <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border font-mono text-[10px]">Enter</kbd> or click <strong className="text-primary">Compare</strong> to search</span>
              </div>
            )}

            {/* Autocomplete */}
            {isAutocompleteOpen && (
              <div className="absolute top-full mt-3 left-0 right-0 bg-surface/98 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden animate-slide-down z-50">
                {/* Live matches header */}
                {autocompleteSuggestions.length > 0 && (
                  <>
                    <div className="px-4 py-2 flex items-center justify-between border-b border-border/40 bg-surface/30">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Search Suggestions</span>
                    </div>

                    <div className="divide-y divide-border/40 max-h-64 overflow-y-auto">
                      {autocompleteSuggestions.map((result) => (
                        <button
                          key={result.id}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setQuery(result.title);
                            setIsAutoOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-155 group hover:bg-primary/5"
                        >
                          <Search className="w-4 h-4 text-muted group-hover:text-primary transition-colors shrink-0" />
                          <span className="flex-1 text-sm font-semibold text-text-secondary group-hover:text-text-primary transition-colors truncate">
                            {result.title}
                          </span>
                          <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors shrink-0 opacity-0 group-hover:opacity-100" />
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Recent searches & popular */}
                <div className={`flex flex-col sm:flex-row ${autocompleteSuggestions.length > 0 ? 'border-t border-border/60' : ''}`}>
                  {recentSearches.length > 0 && (
                    <div className="flex-1 p-5">
                      <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-muted mb-4">
                        <Clock className="w-4 h-4 text-muted" />
                        <span>Recent Searches</span>
                      </div>
                      <ul className="space-y-2">
                        {recentSearches.slice(0, 4).map(item => (
                          <li key={item}>
                            <button
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setQuery(item);
                                setIsAutoOpen(false);
                              }}
                              className="w-full text-left py-2 px-3 rounded-lg hover:bg-surface text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors flex items-center"
                            >
                              <Search className="w-3.5 h-3.5 mr-2 opacity-50" />
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className={`flex-1 p-5 bg-surface/30 ${recentSearches.length > 0 ? 'border-t sm:border-t-0 sm:border-l border-border/40' : ''}`}>
                    <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-primary mb-4">
                      <Flame className="w-4 h-4 text-primary" />
                      <span>Popular Now</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCHES.map(item => (
                        <button
                          key={item}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setQuery(item);
                            setIsAutoOpen(false);
                          }}
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

          {/* Advanced Filters */}
          {isFiltersOpen && (
            <div className="mt-4 p-5 bg-card glass rounded-2xl border border-border animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-text-primary">Advanced Filters</h3>
                <button onClick={clearFilters} className="text-xs font-bold text-primary hover:underline">Clear All</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                {[
                  { label: 'Brand', key: 'brand', options: BRANDS },
                  { label: 'Category', key: 'category', options: CATEGORIES },
                  { label: 'Store', key: 'store', options: STORES },
                  { label: 'Sort By', key: 'sort', options: SORTS },
                ].map(({ label, key, options }) => (
                  <div key={key} className="space-y-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider">{label}</label>
                    <select
                      value={activeFilters[key]}
                      onChange={e => {
                        const v = e.target.value;
                        setActiveFilters(p => ({ ...p, [key]: v }));
                        if (key === 'category') setSearchParams({ q: query, c: v });
                        setVisibleCount(3);
                      }}
                      className="w-full bg-surface border border-border text-text-primary text-sm rounded-xl px-3 py-2 outline-none focus:border-primary transition-colors"
                    >
                      {options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
                <div className="space-y-2 col-span-1 sm:col-span-2 md:col-span-1">
                  <div className="flex justify-between text-[10px] font-bold text-muted uppercase tracking-wider">
                    <span>Max Price</span>
                    <span className="text-primary font-black">EGP {activeFilters.maxPrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="range" min="10000" max="100000" step="5000"
                    value={activeFilters.maxPrice}
                    onChange={e => { setActiveFilters(p => ({ ...p, maxPrice: parseInt(e.target.value) })); setVisibleCount(3); }}
                    className="w-full h-1.5 bg-surface rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Active filter pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-muted font-bold mr-1">Active Filters:</span>
              {activeFilters.brand !== 'All' && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-primary/10 border border-primary/20 text-primary font-bold text-xs rounded-full">
                  <span>Brand: {activeFilters.brand}</span>
                  <button onClick={() => setActiveFilters(p => ({ ...p, brand: 'All' }))}><X className="w-3 h-3" /></button>
                </span>
              )}
              {activeFilters.category !== 'All' && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-primary/10 border border-primary/20 text-primary font-bold text-xs rounded-full">
                  <span>Cat: {activeFilters.category}</span>
                  <button onClick={() => { setActiveFilters(p => ({ ...p, category: 'All' })); setSearchParams({ q: query, c: 'All' }); }}><X className="w-3 h-3" /></button>
                </span>
              )}
              {activeFilters.store !== 'All' && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-primary/10 border border-primary/20 text-primary font-bold text-xs rounded-full">
                  <span>Store: {activeFilters.store}</span>
                  <button onClick={() => setActiveFilters(p => ({ ...p, store: 'All' }))}><X className="w-3 h-3" /></button>
                </span>
              )}
              {activeFilters.maxPrice !== 80000 && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-primary/10 border border-primary/20 text-primary font-bold text-xs rounded-full">
                  <span>Max EGP {activeFilters.maxPrice.toLocaleString()}</span>
                  <button onClick={() => setActiveFilters(p => ({ ...p, maxPrice: 80000 }))}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button onClick={clearFilters} className="text-xs font-bold text-text-secondary hover:text-primary transition-colors underline">Clear Filters</button>
            </div>
          )}
        </div>

        {/* ── AI SUMMARY STATS BAR ──────────────────────── */}
        {resultsVisible && summaryStats && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard label="Cheapest Store"    value={summaryStats.cheapestStoreName}          icon={Award}       color="bg-amber-500/15 text-amber-500"  enabled={workflowDone} delay={0} />
            <StatCard label="Lowest Price"      value={summaryStats.lowestPrice}  prefix="EGP " icon={DollarSign}  color="bg-success/15 text-success"      enabled={workflowDone} delay={60} />
            <StatCard label="Average Price"     value={summaryStats.avgPrice}     prefix="EGP " icon={BarChart3}   color="bg-blue-500/15 text-blue-500"    enabled={workflowDone} delay={120} />
            <StatCard label="Max Savings"       value={summaryStats.maxSavings}   prefix="EGP " icon={Percent}     color="bg-primary/15 text-primary"      enabled={workflowDone} delay={180} />
            <StatCard label="AI Confidence"     value={summaryStats.confidence}  suffix="%"     icon={Brain}       color="bg-purple-500/15 text-purple-500" enabled={workflowDone} delay={240} />
            <StatCard label="Results Found"     value={filteredProducts.length}               icon={Search}      color="bg-surface text-text-secondary"  enabled={workflowDone} delay={300} />
          </div>
        )}
      </main>

      {/* ── RESULTS AREA ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Results count */}
        {resultsVisible && (
          <div className="flex items-center justify-between mb-6 animate-slide-up-reveal">
            <p className="font-semibold text-text-secondary text-sm">
              Showing <span className="font-bold text-text-primary">{filteredProducts.length}</span> results
              {committedQuery && <span> for "<span className="font-bold text-text-primary">{committedQuery}</span>"</span>}
            </p>
            {workflowDone && filteredProducts.length > 0 && (
              <div className="flex items-center space-x-2 text-xs font-bold text-success bg-success/8 border border-success/20 px-3 py-1.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>AI Analysis Complete</span>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {resultsVisible && filteredProducts.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-center animate-fade-in space-y-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full bg-surface/80 animate-pulse" />
                <div className="relative w-24 h-24 bg-surface rounded-full flex items-center justify-center">
                  <Search className="w-10 h-10 text-muted" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary">
                  We couldn't find this product.
                </h2>
                <p className="text-sm text-text-secondary max-w-md mx-auto">
                  Try another search, adjust your filters, or check out today's top deals.
                </p>
              </div>
              <button onClick={clearFilters} className="py-2.5 px-6 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity btn-gradient-shimmer text-sm shadow-md">
                Clear Filters
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Popular Searches</p>
              <div className="flex flex-wrap justify-center gap-2">
                {POPULAR_SEARCHES.map(tag => (
                  <button
                    key={tag}
                    onClick={() => { setQuery(tag); setSearchParams({ q: tag }); }}
                    className="py-1.5 px-3.5 border border-border bg-card hover:border-primary rounded-full text-xs font-semibold text-text-secondary hover:text-primary transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Recommended Deals Section */}
            <div className="pt-8 border-t border-border/40 w-full max-w-4xl space-y-5">
              <div className="text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Best Deals Found</span>
                <h3 className="text-base font-black text-text-primary mt-1">Recommended Deals For You</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {spotlightDeals.map(deal => (
                  <div
                    key={deal.id}
                    onClick={() => navigate(`/product/${deal.id}`)}
                    className="bg-card glass border border-border hover:border-primary/30 rounded-2xl p-4 flex flex-col h-full hover-lift cursor-pointer text-left transition-all duration-300 shadow-sm"
                  >
                    <div className="aspect-square bg-white border border-border/40 rounded-xl overflow-hidden flex items-center justify-center p-2 mb-3 h-28 w-full shrink-0">
                      <img src={deal.image} alt="" className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="text-[9px] font-bold text-muted uppercase mb-0.5">{deal.brand}</div>
                    <h4 className="font-extrabold text-xs text-text-primary leading-snug line-clamp-2 mb-2 flex-1">{deal.title}</h4>
                    <div className="flex justify-between items-end mt-2 pt-2 border-t border-border/20 shrink-0">
                      <div>
                        <span className="text-[9px] font-bold text-muted uppercase">Cheapest</span>
                        <p className="font-black text-xs text-success">EGP {deal.lowestPrice.toLocaleString()}</p>
                      </div>
                      <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        Save {deal.savingPercent}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCTS GRID ─────────────────────────────── */}
        {resultsVisible && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.slice(0, visibleCount).map((product, index) => {
              const isSelected  = selectedCompare.some(p => p.id === product.id);

              return (
                <div
                  key={product.id}
                  className="animate-slide-up-reveal"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div
                    className={`bg-card glass border hover:border-primary/30 rounded-2xl overflow-hidden flex flex-col h-full hover-tilt relative ${
                      product.topSearchPlacement ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-md' : 'border-border'
                    }`}
                  >

                    {/* Product image */}
                    <div className="h-44 relative overflow-hidden bg-zinc-950/40 group">
                      {product.topSearchPlacement && (
                        <div className="absolute top-3 left-3 bg-linear-to-r from-orange-500 to-amber-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-md z-10 flex items-center gap-1 shadow-md">
                          <Sparkles className="w-3 h-3 text-white fill-white" />
                          <span>Featured Listing</span>
                        </div>
                      )}

                      {/* Heart wishlist overlay */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className="absolute top-3 right-14 bg-white/95 backdrop-blur text-xs font-bold p-1.5 rounded-lg text-text-primary shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer z-10 dark:text-white dark:bg-black/60"
                      >
                        <Heart className={`w-3.5 h-3.5 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-text-secondary'}`} />
                      </button>

                      <img
                        src={product.image}
                        alt={product.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-lg text-text-primary shadow-sm flex items-center space-x-1 dark:text-white dark:bg-black/60">
                        <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                        <span>{product.rating}</span>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">
                        {product.category}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="mb-1 text-xs font-bold text-muted uppercase tracking-wider">{product.brand}</div>
                      <h3 className="font-bold text-base text-text-primary leading-snug line-clamp-2 mb-2">{product.title}</h3>
                      <p className="text-xs text-text-secondary line-clamp-2 h-8 mb-4">{product.specSummary}</p>

                      {/* Price section */}
                      <div className="mt-auto space-y-3">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-[10px] font-bold text-muted uppercase">Best Price</p>
                            <p className="text-2xl font-extrabold tracking-tight text-success">
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

                        {/* Store badge */}
                        <div className="flex items-center justify-between p-2.5 bg-surface/50 rounded-xl border border-border">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-surface border border-border/80 text-text-secondary select-none">
                              {product.cheapestStoreLogo}
                            </span>
                            <span className="text-xs font-semibold">{product.cheapestStore}</span>
                          </div>
                          <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            Save EGP {product.priceDifference.toLocaleString()}
                          </span>
                        </div>

                        {/* AI verdict + trend */}
                        <div className="flex items-center space-x-2 text-xs">
                          <div className={`flex-1 min-w-0 flex items-center space-x-1.5 p-2 rounded-lg border ${
                            product.aiStatus === 'success'
                              ? 'bg-success/5 border-success/20 text-success'
                              : 'bg-warning/5 border-warning/20 text-warning'
                          }`}>
                            <Brain className="w-4 h-4 shrink-0" />
                            <span className="font-semibold text-[11px] truncate">{product.aiVerdict}</span>
                          </div>
                          <div className="p-2 bg-surface border border-border rounded-lg flex items-center justify-center shrink-0">
                            {product.priceTrend === 'down'
                              ? <TrendingDown className="w-4 h-4 text-success" />
                              : <TrendingUp className="w-4 h-4 text-danger" />
                            }
                          </div>
                        </div>

                        {/* Available stores count */}
                        <div className="pt-2 text-[10px] text-muted font-bold tracking-wider uppercase flex items-center space-x-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                          </span>
                          <span>Available in {product.stores.length} stores</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer actions */}
                    <div className="p-4 border-t border-border bg-surface/30 flex space-x-2.5">
                      <button
                        onClick={() => toggleCompare(product)}
                        className={`flex-1 flex items-center justify-center space-x-1.5 border font-bold text-xs py-2.5 rounded-xl transition-all ${
                          isSelected
                            ? 'bg-success/15 border-success text-success'
                            : 'bg-card border-border hover:bg-surface text-text-primary'
                        }`}
                      >
                        {isSelected ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
                        <span>{isSelected ? 'Selected' : 'Compare'}</span>
                      </button>
                      <button
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="flex-1 flex items-center justify-center space-x-1.5 bg-text-primary text-background hover:opacity-90 py-2.5 rounded-xl font-bold text-xs transition-opacity btn-gradient-shimmer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More */}
        {resultsVisible && filteredProducts.length > visibleCount && (
          <div className="mt-12 flex flex-col items-center">
            {isPaginationLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-card/45 border border-border/50 rounded-2xl h-[450px] p-6 space-y-4">
                    <div className="h-40 shimmer-loader rounded-xl" />
                    <div className="h-6 shimmer-loader rounded w-1/3" />
                    <div className="h-8 shimmer-loader rounded w-3/4" />
                    <div className="h-10 shimmer-loader rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <button
                onClick={loadMoreItems}
                className="py-3 px-8 bg-card border border-border hover:border-primary text-text-primary hover:text-primary rounded-full font-bold text-sm shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] btn-gradient-shimmer"
              >
                Load More Products
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── FLOATING COMPARE BAR ──────────────────────────── */}
      {selectedCompare.length > 0 && (
        <div className="fixed bottom-6 inset-x-4 max-w-2xl mx-auto bg-navbar/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl py-3 px-4 sm:px-6 z-40 flex items-center justify-between gap-4 animate-slide-down">
          <div className="flex items-center space-x-4 min-w-0">
            <span className="p-2.5 bg-primary/10 text-primary rounded-xl hidden sm:inline-flex">
              <Scale className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <p className="font-bold text-sm text-text-primary">Compare items ({selectedCompare.length}/3)</p>
              <p className="text-[10px] text-muted font-semibold mt-0.5">Select up to 3 for side-by-side comparison</p>
            </div>
            <div className="flex -space-x-2">
              {selectedCompare.map(p => (
                <div key={p.id} className="w-8 h-8 rounded-full border border-border bg-white overflow-hidden shrink-0 flex items-center justify-center p-0.5 shadow-sm">
                  <img src={p.image} alt="" loading="lazy" decoding="async" className="max-w-full max-h-full object-contain" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <button onClick={() => setSelectedCompare([])} className="text-xs font-bold text-text-secondary hover:text-primary transition-colors px-2 py-1">Clear</button>
            <button onClick={() => setShowCompare(true)} className="py-2 px-5 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]">Compare Now</button>
          </div>
        </div>
      )}

      {/* ── COMPARE MODAL ─────────────────────────────────── */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in">
          <div className="bg-surface border border-border w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col animate-fade-in-up">
            <div className="p-6 border-b border-border bg-surface flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-3">
                <span className="p-2.5 bg-primary/10 text-primary rounded-xl">
                  <Scale className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="font-extrabold text-lg text-text-primary">Side-by-Side Comparison</h3>
                  <p className="text-xs text-muted font-medium mt-0.5">Real-time store differences, technical specs, and AI recommendations</p>
                </div>
              </div>
              <button onClick={() => setShowCompare(false)} className="p-2 bg-surface hover:bg-border rounded-full transition-colors cursor-pointer">
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            <div className="p-6 overflow-auto flex-1">
              <table className="w-full text-left border-collapse min-w-[750px] table-fixed">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="py-4 px-3 text-xs font-bold text-muted uppercase tracking-wider w-1/4">Feature</th>
                    {selectedCompare.map(p => (
                      <th key={p.id} className="py-4 px-4 text-center w-1/4">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="w-24 h-24 bg-white border border-border rounded-2xl overflow-hidden flex items-center justify-center p-2.5 shadow-sm">
                            <img src={p.image} alt="" className="max-w-full max-h-full object-contain" />
                          </div>
                          <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {p.category}
                          </span>
                        </div>
                      </th>
                    ))}
                    {Array.from({ length: 3 - selectedCompare.length }).map((_, idx) => (
                      <th key={`empty-th-${idx}`} className="w-1/4 py-4 px-4 text-center text-muted font-bold text-xs opacity-35">
                        <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-border/50 rounded-2xl h-24">
                          <span>Empty Slot</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {/* BRAND */}
                  <tr className="hover:bg-surface/30 transition-colors">
                    <td className="py-4 px-3 font-bold text-xs text-muted uppercase tracking-wider">Brand</td>
                    {selectedCompare.map(p => (
                      <td key={p.id} className="py-4 px-4 text-center font-black text-text-primary text-sm">
                        <div>{p.brand}</div>
                      </td>
                    ))}
                    {Array.from({ length: 3 - selectedCompare.length }).map((_, idx) => (
                      <td key={`empty-brand-${idx}`} className="py-4 px-4 text-center text-muted opacity-30 text-xs">—</td>
                    ))}
                  </tr>

                  {/* PRODUCT NAME */}
                  <tr className="hover:bg-surface/30 transition-colors">
                    <td className="py-4 px-3 font-bold text-xs text-muted uppercase tracking-wider">Product</td>
                    {selectedCompare.map(p => (
                      <td key={p.id} className="py-4 px-4 text-center">
                        <div className="text-xs font-extrabold text-text-primary leading-snug line-clamp-2 max-w-[180px] mx-auto">
                          {p.title}
                        </div>
                      </td>
                    ))}
                    {Array.from({ length: 3 - selectedCompare.length }).map((_, idx) => (
                      <td key={`empty-title-${idx}`} className="py-4 px-4 text-center text-muted opacity-30 text-xs">—</td>
                    ))}
                  </tr>

                  {/* BEST PRICE */}
                  <tr className="hover:bg-surface/30 transition-colors">
                    <td className="py-4 px-3 font-bold text-xs text-muted uppercase tracking-wider">Best Price</td>
                    {selectedCompare.map(p => (
                      <td key={p.id} className="py-4 px-4 text-center">
                        <div className="text-lg font-black text-success">
                          EGP {p.lowestPrice.toLocaleString()}
                        </div>
                      </td>
                    ))}
                    {Array.from({ length: 3 - selectedCompare.length }).map((_, idx) => (
                      <td key={`empty-price-${idx}`} className="py-4 px-4 text-center text-muted opacity-30 text-xs">—</td>
                    ))}
                  </tr>

                  {/* STORE DIFFERENCE */}
                  <tr className="hover:bg-surface/30 transition-colors">
                    <td className="py-4 px-3 font-bold text-xs text-muted uppercase tracking-wider">Store Difference</td>
                    {selectedCompare.map(p => (
                      <td key={p.id} className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-[11px] font-semibold text-text-secondary">Max: EGP {p.highestPrice.toLocaleString()}</span>
                          <span className="text-[11px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1.5 inline-block">Save EGP {p.priceDifference.toLocaleString()}</span>
                        </div>
                      </td>
                    ))}
                    {Array.from({ length: 3 - selectedCompare.length }).map((_, idx) => (
                      <td key={`empty-diff-${idx}`} className="py-4 px-4 text-center text-muted opacity-30 text-xs">—</td>
                    ))}
                  </tr>

                  {/* RETAILER PRICES GROUP HEADER */}
                  <tr className="bg-surface/50 font-black text-text-primary">
                    <td colSpan={4} className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-extrabold text-primary border-t border-border">
                      Prices by Store (EGP)
                    </td>
                  </tr>

                  {/* RETAILER PRICE ROWS */}
                  {[
                    { key: 'amazon', label: 'Amazon Egypt' },
                    { key: 'noon', label: 'Noon' },
                    { key: 'jumia', label: 'Jumia' },
                    { key: 'b.tech', label: 'B.Tech' },
                    { key: 'raya', label: 'Raya' }
                  ].map(store => (
                    <tr key={store.key} className="hover:bg-surface/30 transition-colors">
                      <td className="py-3.5 px-3 text-xs font-semibold text-text-secondary pl-6">{store.label}</td>
                      {selectedCompare.map(p => {
                        const s = p.stores.find(st => st.name.toLowerCase().includes(store.key));
                        return (
                          <td key={p.id} className="py-3.5 px-4 text-center text-sm font-bold text-text-primary">
                            <div>
                              {s ? `EGP ${s.price.toLocaleString()}` : <span className="text-muted/50 font-normal text-xs">Not Available</span>}
                            </div>
                          </td>
                        );
                      })}
                      {Array.from({ length: 3 - selectedCompare.length }).map((_, idx) => (
                        <td key={`empty-${store.key}-${idx}`} className="py-3.5 px-4 text-center text-muted opacity-30 text-xs">—</td>
                      ))}
                    </tr>
                  ))}

                  {/* TECHNICAL SPECS GROUP HEADER */}
                  <tr className="bg-surface/50 font-black text-text-primary">
                    <td colSpan={4} className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-extrabold text-primary border-t border-border">
                      Technical Specifications
                    </td>
                  </tr>

                  {/* SPECIFICATION ROWS */}
                  {[
                    { label: 'Display Size & Type', getVal: (p) => p.category === 'Laptop' ? '14.2" Liquid Retina IPS, 120Hz' : '6.7" Super Retina XDR OLED, 120Hz' },
                    { label: 'Processor / CPU', getVal: (p) => p.category === 'Laptop' ? 'Apple M4 / Intel Core Ultra 7' : 'Apple A17 Pro / Snapdragon 8 Gen 3' },
                    { label: 'Camera / Video', getVal: (p) => p.category === 'Laptop' ? '1080p FaceTime HD Camera' : '50MP Main + 12MP Ultra-Wide' },
                    { label: 'Battery / Power', getVal: (p) => p.category === 'Laptop' ? 'Up to 18 Hours Battery Life' : '5000 mAh, 45W Fast Charging' },
                    { label: 'Base Storage Option', getVal: (p) => p.category === 'Laptop' ? '512GB PCIe SSD Onboard' : '256GB / 512GB Options' },
                    { label: 'Operating System', getVal: (p) => p.category === 'Laptop' ? 'macOS / Windows 11 Home' : 'iOS 18 / Android 14' }
                  ].map(spec => (
                    <tr key={spec.label} className="hover:bg-surface/30 transition-colors">
                      <td className="py-3.5 px-3 text-xs font-semibold text-text-secondary pl-6">{spec.label}</td>
                      {selectedCompare.map(p => (
                        <td key={p.id} className="py-3.5 px-4 text-center text-xs font-bold text-text-primary">
                          <div className="max-w-[200px] mx-auto leading-relaxed">
                            {spec.getVal(p)}
                          </div>
                        </td>
                      ))}
                      {Array.from({ length: 3 - selectedCompare.length }).map((_, idx) => (
                        <td key={`empty-spec-${spec.label}-${idx}`} className="py-3.5 px-4 text-center text-muted opacity-30 text-xs">—</td>
                      ))}
                    </tr>
                  ))}

                  {/* AI DEALS & RATINGS GROUP HEADER */}
                  <tr className="bg-surface/50 font-black text-text-primary">
                    <td colSpan={4} className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-extrabold text-primary border-t border-border">
                      AI Deal Analysis & Market Verdict
                    </td>
                  </tr>

                  {/* AI VERDICT */}
                  <tr className="hover:bg-surface/30 transition-colors">
                    <td className="py-4 px-3 font-bold text-xs text-muted uppercase tracking-wider">AI Verdict</td>
                    {selectedCompare.map(p => (
                      <td key={p.id} className="py-4 px-4 text-center">
                        <div className={`p-3 rounded-xl border text-[11px] leading-relaxed font-bold max-w-[220px] mx-auto ${p.aiStatus === 'success' ? 'bg-success/5 border-success/20 text-success' : 'bg-warning/5 border-warning/20 text-warning'}`}>
                          {p.aiVerdict}
                        </div>
                      </td>
                    ))}
                    {Array.from({ length: 3 - selectedCompare.length }).map((_, idx) => (
                      <td key={`empty-verdict-${idx}`} className="py-4 px-4 text-center text-muted opacity-30 text-xs">—</td>
                    ))}
                  </tr>

                  {/* TREND */}
                  <tr className="hover:bg-surface/30 transition-colors">
                    <td className="py-4 px-3 font-bold text-xs text-muted uppercase tracking-wider">Trend</td>
                    {selectedCompare.map(p => (
                      <td key={p.id} className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5 font-bold text-xs">
                          {p.priceTrend === 'down'
                            ? <span className="text-success flex items-center space-x-1"><TrendingDown className="w-4 h-4" /><span>Downward</span></span>
                            : <span className="text-danger flex items-center space-x-1"><TrendingUp className="w-4 h-4" /><span>Upward</span></span>
                          }
                        </div>
                      </td>
                    ))}
                    {Array.from({ length: 3 - selectedCompare.length }).map((_, idx) => (
                      <td key={`empty-trend-${idx}`} className="py-4 px-4 text-center text-muted opacity-30 text-xs">—</td>
                    ))}
                  </tr>

                  {/* ACTIONS */}
                  <tr className="hover:bg-surface/30 transition-colors">
                    <td className="py-4 px-3 font-bold text-xs text-muted uppercase tracking-wider">Action</td>
                    {selectedCompare.map(p => (
                      <td key={p.id} className="py-4 px-4 text-center">
                        <button
                          onClick={() => { setShowCompare(false); navigate(`/product/${p.id}`); }}
                          className="py-2.5 px-5 bg-text-primary hover:opacity-90 text-background rounded-xl font-bold text-xs transition-opacity shadow-sm max-w-[160px] mx-auto w-full inline-block cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    ))}
                    {Array.from({ length: 3 - selectedCompare.length }).map((_, idx) => (
                      <td key={`empty-action-${idx}`} className="py-4 px-4 text-center text-muted opacity-30 text-xs">—</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-border bg-surface flex justify-end shrink-0">
              <button onClick={() => setShowCompare(false)} className="py-2.5 px-6 bg-surface hover:bg-border text-text-primary border border-border font-bold text-xs rounded-xl transition-all cursor-pointer">Close Comparison</button>
            </div>
          </div>
        </div>
      )}

      {/* Shopper profile drawer */}
      <ShopperProfileModal 
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
        navigate={navigate}
      />
    </div>
  );
}
