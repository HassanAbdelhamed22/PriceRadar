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
} from 'lucide-react';

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
      return { name: s.name, price: s.price, logo: storeLogo, cheapest: cheapest && s.name === cheapest.name };
    }),
    aiVerdict,
    aiStatus,
    rating: product.rating,
    reviews: product.reviews,
    image: product.image,
    cheapestStoreName: cheapest?.name || '',
  };
})
.sort((a, b) => b.savings - a.savings)
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

const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.646.64.699 1.026 1.592 1.026 2.683 0 3.842-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
export default function LandingPage({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const searchInputRef      = useRef(null);
  const searchWrapperRef    = useRef(null);
  const suggestionsRef      = useRef(null);

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
          </nav>

          <div className="flex items-center space-x-3.5">
            <button onClick={() => searchInputRef.current?.focus()} aria-label="Focus search" className="p-2 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-all duration-200">
              <Search className="w-4.5 h-4.5" />
            </button>
            <a href="https://github.com/HassanAbdelhamed22/PriceRadar" target="_blank" rel="noreferrer" aria-label="View source on GitHub" className="p-2 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-all duration-200 hidden sm:inline-flex">
              <GithubIcon className="w-4.5 h-4.5" />
            </a>
            <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-all duration-200">
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            <button onClick={() => searchInputRef.current?.focus()} className="hidden sm:inline-flex py-2 px-5 bg-text-primary text-background hover:opacity-90 font-bold text-xs rounded-full shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
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
            <hr className="border-border my-2" />
            <a href="https://github.com/HassanAbdelhamed22/PriceRadar" target="_blank" rel="noreferrer" className="flex items-center space-x-2 py-2 text-text-secondary hover:text-primary">
              <GithubIcon className="w-5 h-5" />
              <span className="font-medium text-sm">View Source Code</span>
            </a>
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
                <div key={deal.id} className="bg-card border border-border rounded-2xl overflow-hidden hover-tilt hover-lift shadow-sm flex flex-col">
                  <div className="p-6 pb-4 border-b border-border/70 relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center text-primary shadow-inner">
                        {renderCategoryIcon(deal.category, 'w-6 h-6')}
                      </div>
                      <span className="bg-success/10 text-success border border-success/20 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        Save EGP {deal.savings.toLocaleString()}
                      </span>
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

            <div className="col-span-6 md:col-span-3 space-y-4">
              <h4 className="font-extrabold text-xs text-text-primary uppercase tracking-wider">Company</h4>
              <ul className="space-y-2.5 text-xs font-semibold">
                <li><a href="https://github.com/HassanAbdelhamed22/PriceRadar" target="_blank" rel="noreferrer" className="text-text-secondary hover:text-primary transition-colors">GitHub Repository</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted font-medium">
            <p>© {new Date().getFullYear()} PriceRadar Egypt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
