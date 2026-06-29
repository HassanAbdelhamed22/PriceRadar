import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Laptop,
  Smartphone,
  Gamepad2,
  Tv,
  Tablet,
  Watch,
  Search,
  Brain,
  Sun,
  Moon,
  Menu,
  X,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  Radar,
  Clock,
  Flame,
  Star,
  ChevronRight,
  Check,
  Sparkles,
  Heart,
} from 'lucide-react';

import ShopperProfileModal from './ShopperProfileModal';

import productsData from '../data/products.json';

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const MOCK_DEALS = productsData.map(product => {
  const sortedStores = [...product.stores].sort((a, b) => a.price - b.price);
  const cheapest = sortedStores[0];
  const mostExpensive = sortedStores[sortedStores.length - 1];
  const lowestPrice = cheapest ? cheapest.price : 0;
  const highestPrice = mostExpensive ? mostExpensive.price : 0;
  const savings = highestPrice - lowestPrice;
  const savingPercent = highestPrice > 0 ? Math.round((savings / highestPrice) * 100) : 0;

  let category = product.category;
  if (category === 'Laptops') category = 'Laptop';
  if (category === 'Smartphones') category = 'Phone';

  let aiVerdict = 'Price stable. Safe to buy.';
  let aiStatus = 'success';
  if (product.recommendation) {
    aiVerdict = `${product.recommendation.action}! Expect ${product.recommendation.expectedChange} change.`;
    aiStatus = product.recommendation.action.toLowerCase().includes('wait') ? 'warning' : 'success';
  }

  return {
    id: product.id,
    title: product.name,
    brand: product.brand,
    category,
    lowestPrice,
    highestPrice,
    savings,
    savingPercent,
    stores: product.stores.map(s => {
      let storeLogo = 'ST';
      const sName = s.name.toLowerCase();
      if (sName.includes('amazon')) storeLogo = 'AMZ';
      else if (sName.includes('noon')) storeLogo = 'NON';
      else if (sName.includes('jumia')) storeLogo = 'JUM';
      else if (sName.includes('b.tech')) storeLogo = 'BTC';
      else if (sName.includes('raya')) storeLogo = 'RAY';
      else if (sName.includes('select')) storeLogo = 'SEL';
      return { name: s.name, price: s.price, logo: storeLogo, cheapest: cheapest && s.name === cheapest.name };
    }),
    aiVerdict,
    aiStatus,
    rating: product.rating,
    reviews: product.reviews,
    image: product.image,
    cheapestStoreName: cheapest?.name || '',
    homepageDealsSpotlight: product.homepageDealsSpotlight,
    trendingCarousel: product.trendingCarousel,
  };
})
.sort((a, b) => {
  if (a.homepageDealsSpotlight && !b.homepageDealsSpotlight) return -1;
  if (!a.homepageDealsSpotlight && b.homepageDealsSpotlight) return 1;
  return b.savings - a.savings;
})
.slice(0, 6);

const CATEGORIES = [
  { name: 'Laptop', count: '450+ items' },
  { name: 'Phone',  count: '1,200+ items' },
  { name: 'Gaming', count: '320+ items' },
  { name: 'TV',     count: '280+ items' },
  { name: 'Tablet', count: '410+ items' },
  { name: 'Watch',  count: '650+ items' },
];

const ANIMATED_PLACEHOLDERS = [
  'Search "iPhone 16 Pro"',
  'Compare "MacBook Air"',
  'Find "PlayStation 5"',
  'Discover "Galaxy S25"',
];

const RECENT_SEARCHES_KEY = 'priceradar_recent_searches';
const MAX_RECENT = 5;

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
const renderCategoryIcon = (category, className = 'w-6 h-6') => {
  switch (category) {
    case 'Laptop':  return <Laptop    className={className} />;
    case 'Phone':   return <Smartphone className={className} />;
    case 'Gaming':  return <Gamepad2  className={className} />;
    case 'TV':      return <Tv        className={className} />;
    case 'Tablet':  return <Tablet    className={className} />;
    case 'Watch':   return <Watch     className={className} />;
    default:        return <Laptop    className={className} />;
  }
};

const LogoIcon = () => (
  <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-tr from-primary to-accent text-white shadow-lg overflow-hidden shrink-0">
    <Radar className="w-5.5 h-5.5 animate-pulse" />
    <div className="absolute inset-0 border border-white/20 rounded-xl" />
    <div className="absolute inset-0 bg-white/20 animate-ping opacity-25 rounded-xl scale-75" />
  </div>
);

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
export default function LandingPage({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const searchInputRef      = useRef(null);
  const searchWrapperRef    = useRef(null);
  const suggestionsRef      = useRef(null);
  const shopperPlansRef     = useRef(null);

  // ── Search state ──────────────────────────────────────────
  const [searchQuery, setSearchQuery]           = useState('');
  const [debouncedSearchQuery, setDebounced]    = useState('');
  const [searchResults, setSearchResults]       = useState([]);
  const [showSuggestions, setShowSuggestions]   = useState(false);
  const [selectedIndex, setSelectedIndex]       = useState(-1);
  const [searchFocused, setSearchFocused]       = useState(false);
  const [isTransitioning, setIsTransitioning]   = useState(false);

  // ── Recent searches (localStorage) ───────────────────────
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
    } catch {
      return [];
    }
  });

  // ── Animated placeholder ──────────────────────────────────
  const [placeholderIdx, setPlaceholderIdx]     = useState(0);
  const [placeholderFading, setPlaceholderFading] = useState(false);

  // ── UI state ──────────────────────────────────────────────
  const [activeCategory, setActiveCategory]     = useState('All');
  const [newsletterEmail, setNewsletterEmail]   = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('idle');
  const [mobileMenuOpen, setMobileMenuOpen]     = useState(false);

  // ── Shopper plans state ──────────────────────────────────
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('plus'); // 'plus', 'pro'
  const [shopperEmail, setShopperEmail] = useState('');
  const [shopperName, setShopperName] = useState('');
  const [shopperWaitlistSubmitted, setShopperWaitlistSubmitted] = useState(false);
  const [shopperWaitlistLoading, setShopperWaitlistLoading] = useState(false);

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

  /* Debounce search query */
  useEffect(() => {
    const t = setTimeout(() => setDebounced(searchQuery), 150);
    return () => clearTimeout(t);
  }, [searchQuery]);

  /* Filter products for suggestions */
  useEffect(() => {
    if (debouncedSearchQuery.trim().length > 0) {
      const filtered = productsData
        .filter(p =>
          p.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        )
        .slice(0, 6)
        .map(product => ({
          id: product.id,
          title: product.name,
        }));
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
    setSelectedIndex(-1);
  }, [debouncedSearchQuery]);

  /* Animated placeholder cycling */
  useEffect(() => {
    const iv = setInterval(() => {
      setPlaceholderFading(true);
      setTimeout(() => {
        setPlaceholderIdx(i => (i + 1) % ANIMATED_PLACEHOLDERS.length);
        setPlaceholderFading(false);
      }, 280);
    }, 2800);
    return () => clearInterval(iv);
  }, []);

  /* Close suggestions on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Save a recent search ─────────────────────────────── */
  const saveRecentSearch = useCallback((q) => {
    if (!q.trim()) return;
    setRecentSearches(prev => {
      const next = [q, ...prev.filter(s => s.toLowerCase() !== q.toLowerCase())].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  /* ── Submit search with transition animation ─────────── */
  const handleSearchSubmit = useCallback((queryToSubmit) => {
    const q = typeof queryToSubmit === 'string' ? queryToSubmit : searchQuery;
    if (!q.trim()) return;
    saveRecentSearch(q.trim());
    setShowSuggestions(false);
    setIsTransitioning(true);
    setTimeout(() => {
      navigate(`/search?q=${encodeURIComponent(q)}&fresh=1`);
    }, 520);
  }, [searchQuery, navigate, saveRecentSearch]);

  /* ── Keyboard navigation ─────────────────────────────── */
  const handleKeyDown = useCallback((e) => {
    if (!showSuggestions) return;

    const allItems = [...searchResults];
    const total = allItems.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => (i < total - 1 ? i + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => (i > 0 ? i - 1 : total - 1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
      searchInputRef.current?.blur();
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        const selected = searchResults[selectedIndex];
        setSearchQuery(selected.title);
        handleSearchSubmit(selected.title);
      } else {
        handleSearchSubmit();
      }
    }
  }, [showSuggestions, searchResults, selectedIndex, handleSearchSubmit]);

  /* ── Quick tag / trending click ──────────────────────── */
  const handleTagSearch = useCallback((tag) => {
    saveRecentSearch(tag);
    navigate(`/search?q=${encodeURIComponent(tag)}&fresh=1`);
  }, [navigate, saveRecentSearch]);

  /* ── Newsletter ──────────────────────────────────────── */
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus('loading');
    setTimeout(() => {
      setNewsletterStatus('success');
      setNewsletterEmail('');
    }, 1200);
  };

  const filteredDeals = activeCategory === 'All'
    ? MOCK_DEALS
    : MOCK_DEALS.filter(d => d.category === activeCategory);

  const showDropdown = showSuggestions && searchFocused && (
    searchResults.length > 0 || recentSearches.length > 0
  );

  /* ──────────────────────────────────────────────────────────
     RENDER
  ─────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background text-text-primary font-sans transition-colors duration-300 relative selection:bg-primary/20 selection:text-primary">

      {/* DECORATIVE BACKGROUNDS */}
      <div className="absolute top-0 inset-x-0 h-256 grid-overlay pointer-events-none z-0" />
      <div className="absolute top-24 left-[10%] w-140 h-140 radial-glow rounded-full pointer-events-none z-0 animate-float" />
      <div className="absolute top-64 right-[10%] w-160 h-160 radial-glow rounded-full pointer-events-none z-0 animate-float-delayed" />

      {/* ── STICKY NAVBAR ───────────────────────────────── */}
      <header className="sticky top-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-7xl glass rounded-full border transition-all duration-300 shadow-md">
        <div className="px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center space-x-2.5 group">
            <LogoIcon />
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-text-primary">PriceRadar</span>
              <span className="text-[10px] font-black bg-secondary text-background px-1.5 py-0.5 rounded-md uppercase tracking-wider">EG</span>
            </div>
          </a>

          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => searchInputRef.current?.focus()} className="text-sm font-medium text-text-secondary hover:text-text-primary hover:cursor-pointer transition-colors duration-200">Search</button>
            <button onClick={() => navigate('/categories')} className="text-sm font-medium text-text-secondary hover:text-text-primary hover:cursor-pointer transition-colors duration-200 bg-transparent border-none">Categories</button>
            <button onClick={() => navigate('/deals')} className="text-sm font-medium text-text-secondary hover:text-text-primary hover:cursor-pointer transition-colors duration-200 bg-transparent border-none">Deals</button>
            <button onClick={() => navigate('/merchant')} className="text-sm font-medium text-text-secondary hover:text-text-primary hover:cursor-pointer transition-colors duration-200 bg-transparent border-none">For Retailers</button>
          </nav>

          <div className="flex items-center space-x-3.5">
            <button onClick={() => searchInputRef.current?.focus()} aria-label="Focus search" className="p-2 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-all duration-200">
              <Search className="w-4.5 h-4.5" />
            </button>
            
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

            <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-all duration-200">
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            <button onClick={() => shopperPlansRef.current?.scrollIntoView({ behavior: 'smooth' })} className="hidden sm:inline-flex py-2 px-5 bg-text-primary text-background hover:opacity-90 font-bold text-xs rounded-full shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
              Try free
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle navigation menu" className="md:hidden p-2 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-all duration-200">
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden glass border-b absolute left-0 right-0 py-4 px-6 animate-slide-down shadow-xl flex flex-col space-y-4">
            <button onClick={() => { setMobileMenuOpen(false); navigate('/categories'); }} className="text-left text-base font-semibold text-text-secondary hover:text-primary transition-colors py-1 bg-transparent border-none cursor-pointer">Categories</button>
            <button onClick={() => { setMobileMenuOpen(false); navigate('/deals'); }} className="text-left text-base font-semibold text-text-secondary hover:text-primary transition-colors py-1 bg-transparent border-none cursor-pointer">Deals</button>
            <button onClick={() => { setMobileMenuOpen(false); navigate('/merchant'); }} className="text-left text-base font-semibold text-text-secondary hover:text-primary transition-colors py-1 bg-transparent border-none cursor-pointer">For Retailers</button>
          </div>
        )}
      </header>

      {/* ── HERO SECTION ──────────────────────────────────── */}
      <section className="relative pt-16 pb-20 overflow-visible z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center justify-center space-y-7 py-8">

          {/* Promo Pill */}
          <div className="inline-flex items-center space-x-2 py-1.5 px-3 rounded-full border border-border bg-card/65 shadow-sm text-xs font-semibold text-text-secondary hover:border-primary transition-all duration-300 z-10">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="text-text-primary font-bold">AI-powered price intelligence · Egypt</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-text-primary z-10">
            Find the <span className="font-serif italic bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">best price</span> <br />
            before you buy.
          </h1>

          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed font-normal z-10">
            PriceRadar scans Egypt's top stores in real time, learns price patterns and tells you the smartest moment to checkout.
          </p>

          {/* ── ENHANCED SEARCH BAR ───────────────────────────── */}
          <div
            ref={searchWrapperRef}
            className={`relative w-full max-w-2xl mx-auto z-25 pt-2 ${isTransitioning ? 'animate-search-collapse pointer-events-none' : ''}`}
          >
            {/* Background blur overlay when transitioning */}
            {isTransitioning && (
              <div className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm pointer-events-none animate-fade-in" />
            )}

            <div className={`
              relative flex items-center w-full bg-card/60 glass border rounded-full shadow-lg p-2 
              transition-all duration-300 search-focus-glow
              ${searchFocused ? 'border-primary/50 shadow-primary/10' : 'border-border'}
            `}>
              {/* Search icon with animation on focus */}
              <div className={`pl-4 shrink-0 transition-all duration-300 ${searchFocused ? 'text-primary scale-110' : 'text-text-secondary'}`}>
                <Search className={`w-5 h-5 transition-transform duration-300 ${searchFocused ? 'rotate-[-15deg]' : ''}`} />
              </div>

              {/* Input with animated placeholder */}
              <div className="relative flex-1 px-3">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => { setSearchFocused(true); setShowSuggestions(true); }}
                  onBlur={() => setSearchFocused(false)}
                  onKeyDown={handleKeyDown}
                  placeholder=""
                  className="w-full py-3 bg-transparent text-text-primary outline-none text-sm sm:text-base font-semibold relative z-10"
                />
                {/* Animated placeholder (shows only when input is empty) */}
                {!searchQuery && (
                  <span
                    className={`absolute inset-y-0 left-0 flex items-center text-sm sm:text-base font-semibold text-muted pointer-events-none transition-all duration-280 ${
                      placeholderFading ? 'opacity-0 -translate-y-1.5' : 'opacity-100 translate-y-0'
                    }`}
                  >
                    {ANIMATED_PLACEHOLDERS[placeholderIdx]}
                  </span>
                )}
              </div>

              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); setShowSuggestions(false); }} className="mr-2 p-1.5 rounded-full hover:bg-surface text-text-secondary hover:text-primary transition-all">
                  <X className="w-4.5 h-4.5" />
                </button>
              )}

              <button
                onClick={handleSearchSubmit}
                className="py-3 px-6 bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-full flex items-center space-x-1.5 shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all btn-gradient-shimmer shrink-0"
              >
                <span>Compare</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* ── SUGGESTION DROPDOWN ───────────────────────── */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-surface/98 backdrop-blur-2xl border border-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-slide-down">
                {/* Live matches header */}
                {searchResults.length > 0 && (
                  <>
                    <div className="px-4 py-2 flex items-center justify-between border-b border-border/40 bg-surface/30">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Search Suggestions</span>
                    </div>

                    <div className="divide-y divide-border/40 max-h-72 overflow-y-auto">
                      {searchResults.map((result, idx) => (
                        <button
                          key={result.id}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setSearchQuery(result.title);
                            setShowSuggestions(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-150 group ${
                            selectedIndex === idx ? 'bg-primary/8' : 'hover:bg-surface/60'
                          }`}
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
                <div className={`flex flex-col sm:flex-row ${searchResults.length > 0 ? 'border-t border-border/60' : ''}`}>
                  {/* Recent searches */}
                  {recentSearches.length > 0 && (
                    <div className="flex-1 p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Clock className="w-3.5 h-3.5 text-muted" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Recent</span>
                      </div>
                      <div className="space-y-1">
                        {recentSearches.slice(0, 4).map(item => (
                          <button
                            key={item}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setSearchQuery(item);
                              setShowSuggestions(false);
                            }}
                            className="w-full text-left flex items-center space-x-2.5 py-1.5 px-2 rounded-lg hover:bg-surface text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors"
                          >
                            <Search className="w-3 h-3 text-muted/60 shrink-0" />
                            <span className="truncate">{item}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular searches */}
                  <div className={`flex-1 p-4 ${recentSearches.length > 0 ? 'border-t sm:border-t-0 sm:border-l border-border/40 bg-surface/30' : ''}`}>
                    <div className="flex items-center space-x-2 mb-3">
                      <Flame className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Popular Now</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {['iPhone 16 Pro', 'MacBook Air M3', 'PS5 Slim', 'Galaxy S25'].map(tag => (
                        <button
                          key={tag}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setSearchQuery(tag);
                            setShowSuggestions(false);
                          }}
                          className="py-1 px-2.5 border border-border hover:border-primary bg-card/45 hover:bg-primary/5 rounded-full text-[11px] font-bold text-text-secondary hover:text-primary transition-all"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Keyboard hints */}
                <div className="px-4 py-2 border-t border-border/40 bg-surface/30 flex items-center space-x-4 text-[10px] text-muted font-medium">
                  <span>↑↓ navigate</span>
                  <span>↵ select</span>
                  <span>Esc close</span>
                </div>
              </div>
            )}
          </div>

          {/* Trending tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-1.5 text-xs z-10">
            <span className="text-muted font-bold mr-1">Trending:</span>
            {['iPhone 15 Pro', 'MacBook Air M3', 'PS5 Slim', 'Galaxy S24'].map(tag => (
              <button
                key={tag}
                onClick={() => handleTagSearch(tag)}
                className="py-1 px-3 border border-border hover:border-primary bg-card/45 hover:bg-primary/5 rounded-full font-bold text-text-secondary hover:text-primary transition-all duration-300"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Statistics Banner */}
          <div className="grid grid-cols-3 gap-8 sm:gap-16 pt-16 border-t border-border/40 w-full max-w-3xl mx-auto z-10">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-serif font-bold text-text-primary tracking-tight">20,000+</p>
              <p className="text-[10px] sm:text-xs text-text-secondary font-bold uppercase tracking-widest">Products tracked</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-serif font-bold text-text-primary tracking-tight">5</p>
              <p className="text-[10px] sm:text-xs text-text-secondary font-bold uppercase tracking-widest">Partner stores</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-serif font-bold text-text-primary tracking-tight">50,000+</p>
              <p className="text-[10px] sm:text-xs text-text-secondary font-bold uppercase tracking-widest">Price updates / day</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES SECTION ─────────────────────────────── */}
      <section id="categories" className="py-20 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/70 scroll-mt-16">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Discover Smart</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Browse Popular Categories</h2>
          <p className="text-text-secondary max-w-lg mx-auto text-base">Select a category to view live price differences and analyze AI recommendations across stores.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {CATEGORIES.map(cat => (
            <button
              key={cat.name}
              onClick={() => navigate(`/search?c=${encodeURIComponent(cat.name)}`)}
              className="p-4 sm:p-6 rounded-2xl border text-center transition-all duration-300 hover-tilt hover-lift flex flex-col items-center justify-center space-y-3 group bg-card border-border hover:border-primary/50"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/10 bg-surface border border-border text-primary">
                {renderCategoryIcon(cat.name, 'w-7 h-7')}
              </div>
              <div>
                <h3 className="font-bold text-sm text-text-primary">{cat.name}</h3>
                <p className="text-xs mt-1 font-semibold text-muted">{cat.count}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── DEALS SECTION ──────────────────────────────────── */}
      <section id="deals" className="py-20 bg-surface/40 border-t border-b border-border/70 relative z-10 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div className="space-y-3 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Live Scan</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Today's Best Electronics Deals</h2>
              <p className="text-text-secondary max-w-lg text-base">Real-time price comparisons computed from Egyptian retailers.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 border border-border bg-card p-1 rounded-xl">
              {['All', ...CATEGORIES.map(c => c.name)].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveCategory(tab)}
                  className={`py-1.5 px-4 rounded-lg text-xs font-bold transition-all duration-300 ${
                    activeCategory === tab ? 'bg-primary text-white shadow-md' : 'text-text-secondary hover:text-primary hover:bg-surface'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDeals.map(deal => {
              const sortedStores = [...deal.stores].sort((a, b) => a.price - b.price);
              return (
                <div 
                  key={deal.id} 
                  className={`bg-card border rounded-2xl overflow-hidden hover-tilt hover-lift shadow-sm flex flex-col relative ${
                    deal.homepageDealsSpotlight ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/10 shadow-md' : 'border-border'
                  }`}
                >
                  <div className="p-6 pb-4 border-b border-border/70 relative">
                    {deal.homepageDealsSpotlight && (
                      <div className="absolute top-2 right-6 bg-linear-to-r from-orange-500 to-amber-500 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full z-10 flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Featured Deal</span>
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center text-primary shadow-inner">
                        {renderCategoryIcon(deal.category, 'w-6 h-6')}
                      </div>
                      
                      {!deal.homepageDealsSpotlight ? (
                        <span className="bg-success/10 text-success border border-success/20 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          Save EGP {deal.savings.toLocaleString()}
                        </span>
                      ) : (
                        <span className="bg-success/20 text-success border border-success/35 text-xs font-black px-2.5 py-0.5 rounded-full mt-4">
                          Save EGP {deal.savings.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-text-primary line-clamp-2 h-12 leading-snug">{deal.title}</h3>

                    <div className="mt-5 space-y-3">
                      {deal.stores.map(store => (
                        <div
                          key={store.name}
                          className={`flex justify-between items-center p-2 rounded-xl border transition-all duration-200 ${
                            store.cheapest ? 'bg-success/5 border-success/30' : 'bg-surface/50 border-transparent hover:border-border'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-gray-100 text-gray-800">{store.logo}</span>
                            <span className="text-xs font-semibold text-text-secondary">{store.name}</span>
                          </div>
                          <span className={`text-sm font-bold ${store.cheapest ? 'text-success' : 'text-text-primary'}`}>
                            EGP {store.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 bg-surface/30 mt-auto flex flex-col space-y-4">
                    <div className={`p-3 rounded-xl border text-xs flex items-start space-x-2.5 ${
                      deal.aiStatus === 'warning' ? 'bg-warning/5 border-warning/20' : 'bg-success/5 border-success/20'
                    }`}>
                      <Brain className="w-5 h-5 text-current shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="font-bold uppercase text-[9px] tracking-wider text-muted">AI Verdict</p>
                        <p className={`font-medium mt-0.5 ${deal.aiStatus === 'warning' ? 'text-warning' : 'text-success'}`}>{deal.aiVerdict}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/product/${deal.id}`)}
                      className="w-full text-center py-2.5 px-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-xs shadow-md transition-all duration-300 btn-gradient-shimmer"
                    >
                      Compare Retailers
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TRENDING PRODUCTS CAROUSEL (MEMBER/ADS SPONSORED) ── */}
      <section className="relative py-16 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/40">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span>Trending Products</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Trending Products Carousel
            </h2>
            <p className="text-sm text-text-secondary max-w-xl leading-relaxed">
              Highly searched items matching merchant-featured visibility boosts and top Cairo pricing comparisons.
            </p>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-6 pt-2 scrollbar-thin snap-x">
          {productsData
            .filter(p => p.trendingCarousel)
            .map(product => {
              const sortedStores = [...product.stores].sort((a, b) => a.price - b.price);
              const cheapest = sortedStores[0];
              const lowestPrice = cheapest ? cheapest.price : 0;
              
              return (
                <div 
                  key={product.id} 
                  className="w-72 shrink-0 bg-card border border-primary/30 ring-1 ring-primary/10 rounded-2xl overflow-hidden hover-tilt hover-lift shadow-md flex flex-col justify-between snap-start"
                >
                  <div className="h-40 relative bg-zinc-950/40 overflow-hidden">
                    <div className="absolute top-3 left-3 bg-linear-to-r from-orange-500 to-amber-500 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md z-10 flex items-center gap-1 shadow-md">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Trending Carousel</span>
                    </div>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">
                      {product.category}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between text-left">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">{product.brand}</span>
                      <h3 className="font-extrabold text-sm text-text-primary line-clamp-2 h-10 leading-snug">{product.name}</h3>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border/50 flex items-end justify-between">
                      <div>
                        <span className="text-[9px] font-bold text-muted uppercase block">Best Price</span>
                        <span className="text-base font-black text-success">EGP {lowestPrice.toLocaleString()}</span>
                      </div>
                      
                      <button
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="py-1.5 px-3.5 bg-primary text-white hover:bg-primary-hover font-bold text-[10px] rounded-lg shadow-sm transition-all"
                      >
                        Compare
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* ── SHOPPER PLANS (B2C) ─────────────────────────────── */}
      <section ref={shopperPlansRef} className="relative py-20 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/40 bg-surface/10 rounded-3xl my-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Shopper Plans</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Plans for Every Type of Buyer
          </h2>
          <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
            Searching, comparing, and viewing AI recommendations is 100% free with no login required. Unlock account subscriptions for tracking, alerts, and reports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Plan 1: Free (Guest) */}
          <div className="bg-card glass border border-border rounded-3xl p-8 flex flex-col justify-between hover-lift shadow-sm text-left relative overflow-hidden transition-all duration-300">
            <div>
              <div className="space-y-2">
                <div className="inline-block bg-success/15 text-success text-[10px] font-black py-0.5 px-2 rounded-full uppercase tracking-wider">
                  Perfect for 90% of Users
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted block pt-1">Free (Guest)</span>
                <p className="text-3xl font-black text-text-primary">
                  EGP 0 <span className="text-xs font-semibold text-muted">/ month</span>
                </p>
                <p className="text-xs text-text-secondary pt-2">No login or account registration required to browse and compare stores.</p>
              </div>

              <hr className="border-border/60 my-6" />

              <ul className="space-y-3.5 text-xs font-semibold text-text-secondary">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Unlimited searches</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Compare prices across Egypt stores</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>AI Buy/Wait recommendations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Basic price history charts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Price predictions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Product details & specifications</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Related products recommendations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>View top deals discounts lists</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Browse electronic categories</span>
                </li>
              </ul>
            </div>

            <button 
              onClick={() => searchInputRef.current?.focus()}
              className="mt-8 w-full py-3 bg-surface hover:bg-border text-text-primary font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer text-center"
            >
              Start Searching
            </button>
          </div>

          {/* Plan 2: Plus Shopper */}
          <div className="bg-card glass border-2 border-primary rounded-3xl p-8 flex flex-col justify-between hover-lift shadow-lg text-left relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-black py-1 px-4 rounded-bl-xl uppercase tracking-widest">
              Power Shopper
            </div>

            <div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Plus Plan</span>
                <p className="text-3xl font-black text-text-primary">
                  EGP 49 <span className="text-xs font-semibold text-muted">/ month</span>
                </p>
                <p className="text-xs text-text-secondary pt-2">For power shoppers wanting real-time drop alerts, custom tracking, and search history.</p>
              </div>

              <hr className="border-border/60 my-6" />

              <ul className="space-y-3.5 text-xs font-semibold text-text-secondary">
                <li className="flex items-center gap-2 text-text-primary font-bold">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Everything in Free</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Price Drop Alerts notifications</span>
                </li>
                <li className="flex items-center gap-2 text-primary font-bold">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Interactive charts & track analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Personalized Wishlist folders</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Track prices of favorite products</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Daily AI shopping summaries</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Save recent searches histories</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Email & alerts updates</span>
                </li>
                <li className="flex items-center gap-2 text-muted">
                  <Check className="w-3.5 h-3.5 text-success/50 shrink-0" />
                  <span>Telegram/WhatsApp alerts (Coming soon)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Early access to new AI features</span>
                </li>
              </ul>
            </div>

            <button 
              onClick={() => { setSelectedPlan('plus'); setShowPlansModal(true); setShopperWaitlistSubmitted(false); setShopperName(''); setShopperEmail(''); }}
              className="mt-8 w-full py-3 bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-md hover:scale-[1.02] transition-all btn-gradient-shimmer cursor-pointer text-center animate-pulse"
            >
              Start Plus Trial
            </button>
          </div>

          {/* Plan 3: Pro Shopper */}
          {/* <div className="bg-card glass border border-border rounded-3xl p-8 flex flex-col justify-between hover-lift shadow-sm text-left relative overflow-hidden transition-all duration-300">
            <div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Pro Shopper</span>
                <p className="text-3xl font-black text-text-primary">
                  EGP 199 <span className="text-xs font-semibold text-muted">/ month</span>
                </p>
                <p className="text-xs text-text-secondary pt-2">For pricing enthusiasts and businesses wanting historical trends and side-by-side tools.</p>
              </div>

              <hr className="border-border/60 my-6" />

              <ul className="space-y-3.5 text-xs font-semibold text-text-secondary">
                <li className="flex items-center gap-2 text-text-primary font-bold">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Everything in Plus</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Unlimited tracked products</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Advanced deep AI price predictions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Historical prices (up to 1 full year)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Market trend & price indices reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Export price catalog history (CSV/Excel)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Compare multiple items side by side</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>AI Shopping Assistant Chatbot</span>
                </li>
              </ul>
            </div>

            <button 
              onClick={() => { setSelectedPlan('pro'); setShowPlansModal(true); setShopperWaitlistSubmitted(false); setShopperName(''); setShopperEmail(''); }}
              className="mt-8 w-full py-3 bg-surface hover:bg-border text-text-primary font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer text-center"
            >
              Get Pro Shopper
            </button>
          </div> */}

        </div>
      </section>

      {/* ── SHOPPER PLANS MODAL ──────────────────────────────── */}
      {showPlansModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowPlansModal(false)} className="absolute inset-0 bg-background/70 backdrop-blur-md transition-opacity duration-300 z-0" />
          
          <div className="relative bg-card glass border border-border rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto z-10">
            <button 
              onClick={() => setShowPlansModal(false)} 
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-surface text-text-secondary hover:text-primary transition-colors cursor-pointer bg-transparent border-none"
            >
              <X className="w-5 h-5" />
            </button>

            {shopperWaitlistSubmitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-success/20 text-success mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-text-primary">Welcome to the Club!</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-sm mx-auto">
                  Thank you for joining. We will notify you at <strong className="text-text-primary">{shopperEmail}</strong> as soon as the {selectedPlan === 'plus' ? 'Plus Plan' : 'Pro Shopper Plan'} features are rolled out to your email account.
                </p>
                <button 
                  onClick={() => setShowPlansModal(false)}
                  className="mt-4 px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-5 text-left">
                <div className="space-y-1">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-text-primary">
                    Join {selectedPlan === 'plus' ? 'Plus Plan' : 'Pro Shopper'} Waitlist
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Premium shopper accounts are currently in closed beta testing. Be among the first to gain access.
                  </p>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!shopperName || !shopperEmail) return;
                  setShopperWaitlistLoading(true);
                  setTimeout(() => {
                    setShopperWaitlistLoading(false);
                    setShopperWaitlistSubmitted(true);
                  }, 1000);
                }} className="space-y-4 pt-1">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-muted tracking-wider">Your Full Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Hassan Ali"
                      value={shopperName}
                      onChange={e => setShopperName(e.target.value)}
                      className="w-full py-2.5 px-4 bg-surface border border-border text-text-primary placeholder-muted rounded-xl text-xs outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-muted tracking-wider">Your Email Address</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="name@example.com"
                      value={shopperEmail}
                      onChange={e => setShopperEmail(e.target.value)}
                      className="w-full py-2.5 px-4 bg-surface border border-border text-text-primary placeholder-muted rounded-xl text-xs outline-none focus:border-primary"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={shopperWaitlistLoading}
                    className="w-full mt-2 py-3 bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 btn-gradient-shimmer cursor-pointer flex justify-center items-center"
                  >
                    {shopperWaitlistLoading ? 'Submitting...' : 'Register for Early Access'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="bg-footer border-t border-border/80 pt-20 pb-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-16">
            <div className="col-span-12 md:col-span-6 space-y-5">
              <a href="#" className="flex items-center space-x-2.5">
                <LogoIcon />
                <span className="font-extrabold text-lg tracking-tight text-text-primary">PriceRadar EG</span>
              </a>
              <p className="text-xs text-text-secondary max-w-sm leading-relaxed font-medium">
                An advanced AI-powered price analysis engine for smart shoppers in Egypt. Stop paying extra; track deals on smartphones, appliances, and laptops.
              </p>

              <div className="space-y-2 max-w-md">
                <h4 className="font-bold text-xs text-text-primary uppercase tracking-wider">Subscribe to Price Alerts</h4>
                <form onSubmit={handleNewsletterSubmit} className="flex space-x-2 pt-1">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={e => setNewsletterEmail(e.target.value)}
                    required
                    className="py-2.5 px-4 bg-card border border-border text-text-primary placeholder-muted rounded-xl text-xs grow outline-none focus:border-primary"
                  />
                  <button type="submit" className="py-2.5 px-5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md btn-gradient-shimmer">
                    {newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
                {newsletterStatus === 'success' && (
                  <p className="text-xs font-semibold text-success flex items-center space-x-1.5 mt-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Successfully subscribed!</span>
                  </p>
                )}
              </div>
            </div>

            <div className="col-span-6 md:col-span-3 space-y-4">
              <h4 className="font-extrabold text-xs text-text-primary uppercase tracking-wider">Product Categories</h4>
              <ul className="space-y-2.5 text-xs font-semibold">
                <li><button onClick={() => navigate('/search?c=Laptop')} className="text-text-secondary hover:text-primary transition-colors text-left">Laptops &amp; PCs</button></li>
                <li><button onClick={() => navigate('/search?c=Phone')} className="text-text-secondary hover:text-primary transition-colors text-left">Smartphones</button></li>
                <li><button onClick={() => navigate('/search?c=Gaming')} className="text-text-secondary hover:text-primary transition-colors text-left">Gaming Consoles</button></li>
                <li><button onClick={() => navigate('/search?c=TV')} className="text-text-secondary hover:text-primary transition-colors text-left">Smart Televisions</button></li>
              </ul>
            </div>

          </div>

          <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted font-medium">
            <p>© {new Date().getFullYear()} PriceRadar Egypt. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Shopper profile and wishlist/loyalty drawer */}
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
