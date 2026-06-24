import React, { useState, useEffect, useRef } from 'react'
import {
  Laptop,
  Smartphone,
  Gamepad2,
  Tv,
  Tablet,
  Watch,
  Search,
  Sparkles,
  Brain,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X,
  TrendingUp,
  ShoppingBag,
  CheckCircle2,
  Radar,
  Star,
  ArrowRight,
  Headphones,
  TrendingDown
} from 'lucide-react'

// Beautiful Mock Products / Deals in Egypt with Store prices & Price History
const MOCK_DEALS = [
  {
    id: 1,
    title: 'Apple iPhone 15 Pro Max (256GB) - Titanium Blue',
    category: 'Phone',
    stores: [
      { name: 'Amazon.eg', price: 61999, originalPrice: 65990, logo: 'AMZ', cheapest: true },
      { name: 'Noon.eg', price: 62450, logo: 'NON' },
      { name: 'B.TECH', price: 64999, logo: 'BTC' },
    ],
    savings: 3991,
    savingPercent: 6,
    history: [65000, 64200, 63800, 62500, 61999],
    aiVerdict: 'Best Price! Historical low, buy now.',
    aiStatus: 'success',
  },
  {
    id: 2,
    title: 'Lenovo Legion 5 Pro Intel Core i7 - RTX 4060',
    category: 'Laptop',
    stores: [
      { name: 'Noon.eg', price: 54200, logo: 'NON', cheapest: true },
      { name: 'Amazon.eg', price: 56900, logo: 'AMZ' },
      { name: 'B.TECH', price: 58500, originalPrice: 62000, logo: 'BTC' },
    ],
    savings: 7800,
    savingPercent: 12,
    history: [62000, 60000, 58000, 56000, 54200],
    aiVerdict: 'Wait. Prices are fluctuating, expected drop in 5 days.',
    aiStatus: 'warning',
  },
  {
    id: 3,
    title: 'Sony PlayStation 5 Console (Slim) - Middle East Version',
    category: 'Gaming',
    stores: [
      { name: 'Amazon.eg', price: 23499, originalPrice: 28999, logo: 'AMZ', cheapest: true },
      { name: 'Noon.eg', price: 24200, logo: 'NON' },
      { name: 'Jumia', price: 25499, logo: 'JUM' },
    ],
    savings: 5500,
    savingPercent: 19,
    history: [28999, 27500, 26000, 24500, 23499],
    aiVerdict: 'Best Price! Highly recommended to purchase today.',
    aiStatus: 'success',
  },
  {
    id: 4,
    title: 'LG OLED C3 Series 55-inch 4K Smart TV',
    category: 'TV',
    stores: [
      { name: 'B.TECH', price: 47990, logo: 'BTC', cheapest: true },
      { name: 'Amazon.eg', price: 49200, originalPrice: 53999, logo: 'AMZ' },
      { name: 'Noon.eg', price: 48500, logo: 'NON' },
    ],
    savings: 6009,
    savingPercent: 11,
    history: [53999, 52000, 50000, 48900, 47990],
    aiVerdict: 'Excellent deal. 11% below 30-day average.',
    aiStatus: 'success',
  },
  {
    id: 5,
    title: 'Samsung Galaxy Tab S9 FE+ (128GB, Wi-Fi)',
    category: 'Tablet',
    stores: [
      { name: 'Noon.eg', price: 21200, originalPrice: 24500, logo: 'NON', cheapest: true },
      { name: 'Amazon.eg', price: 22100, logo: 'AMZ' },
      { name: 'Jumia', price: 23000, logo: 'JUM' },
    ],
    savings: 3300,
    savingPercent: 13,
    history: [24500, 23800, 22900, 21800, 21200],
    aiVerdict: 'Stable price. Safe to purchase.',
    aiStatus: 'success',
  },
  {
    id: 6,
    title: 'Apple Watch Series 9 GPS + Cellular (45mm)',
    category: 'Watch',
    stores: [
      { name: 'Amazon.eg', price: 18990, logo: 'AMZ', cheapest: true },
      { name: 'Noon.eg', price: 19450, originalPrice: 21500, logo: 'NON' },
      { name: 'B.TECH', price: 20999, logo: 'BTC' },
    ],
    savings: 2510,
    savingPercent: 11,
    history: [21500, 20500, 19800, 19200, 18990],
    aiVerdict: 'Great price! 11% discount from retail price.',
    aiStatus: 'success',
  },
];

const CATEGORIES = [
  { name: 'Laptop', count: '450+ items' },
  { name: 'Phone', count: '1,200+ items' },
  { name: 'Gaming', count: '320+ items' },
  { name: 'TV', count: '280+ items' },
  { name: 'Tablet', count: '410+ items' },
  { name: 'Watch', count: '650+ items' },
];

// Helper to render category icon component
const renderCategoryIcon = (category, className = "w-6 h-6") => {
  switch (category) {
    case 'Laptop':
      return <Laptop className={className} />;
    case 'Phone':
      return <Smartphone className={className} />;
    case 'Gaming':
      return <Gamepad2 className={className} />;
    case 'TV':
      return <Tv className={className} />;
    case 'Tablet':
      return <Tablet className={className} />;
    case 'Watch':
      return <Watch className={className} />;
    default:
      return <Laptop className={className} />;
  }
};

// Premium Brand Logo Component (incorporating Lucide Radar)
const LogoIcon = () => (
  <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-tr from-primary to-accent text-white shadow-lg overflow-hidden shrink-0">
    <Radar className="w-5.5 h-5.5 animate-pulse" />
    <div className="absolute inset-0 border border-white/20 rounded-xl" />
    {/* Radar waves indicator */}
    <div className="absolute inset-0 bg-white/20 animate-ping opacity-25 rounded-xl scale-75" />
  </div>
);

// Custom SVG GitHub Icon since Lucide React removed brand icons in newer versions
const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.646.64.699 1.026 1.592 1.026 2.683 0 3.842-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

export default function App() {
  const searchInputRef = useRef(null);
  // Theme Manager State
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
  });

  // Apply Theme on load & change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);
  
  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('idle');

  // Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search Suggestion Simulation
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsSearching(true);
      const filtered = MOCK_DEALS.filter(deal =>
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Filter Deals based on activeCategory
  const filteredDeals = activeCategory === 'All'
    ? MOCK_DEALS
    : MOCK_DEALS.filter(deal => deal.category === activeCategory);

  // Handle Newsletter Sign Up
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus('loading');
    setTimeout(() => {
      setNewsletterStatus('success');
      setNewsletterEmail('');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans transition-colors duration-300 relative selection:bg-primary/20 selection:text-primary">
      {/* ----------------------------------------------------
         DECORATIVE GLOW BACKGROUNDS
      ------------------------------------------------------- */}
      <div className="absolute top-0 inset-x-0 h-256 grid-overlay pointer-events-none z-0" />
      <div className="absolute top-24 left-[10%] w-140 h-140 radial-glow rounded-full pointer-events-none z-0 animate-float" />
      <div className="absolute top-64 right-[10%] w-160 h-160 radial-glow rounded-full pointer-events-none z-0 animate-float-delayed" />

      {/* ----------------------------------------------------
         STICKY HEADER & NAVBAR
      ------------------------------------------------------- */}
      <header className="sticky top-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-7xl glass rounded-full border transition-all duration-300 shadow-md">
        <div className="px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-2.5 group">
            <LogoIcon />
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-text-primary">
                PriceRadar
              </span>
              <span className="text-[10px] font-black bg-secondary text-background px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                EG
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => searchInputRef.current?.focus()}
              className="text-sm font-medium text-text-secondary hover:text-text-primary hover:cursor-pointer transition-colors duration-200"
            >
              Search
            </button>
            <a href="#categories" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200">
              Categories
            </a>
            <a href="#deals" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200">
              Deals
            </a>
            <a href="#testimonials" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200">
              About
            </a>
          </nav>

          {/* Interactive Nav Options */}
          <div className="flex items-center space-x-3.5">
            {/* Search Icon Shortcut */}
            <button
              onClick={() => searchInputRef.current?.focus()}
              aria-label="Focus search"
              className="p-2 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-all duration-200"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* GitHub Repo Icon */}
            <a
              href="https://github.com/HassanAbdelhamed22/PriceRadar"
              target="_blank"
              rel="noreferrer"
              aria-label="View source on GitHub"
              className="p-2 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-all duration-200 hidden sm:inline-flex"
            >
              <GithubIcon className="w-4.5 h-4.5" />
            </a>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-all duration-200"
            >
              {theme === 'dark' ? (
                <Sun className="w-4.5 h-4.5" />
              ) : (
                <Moon className="w-4.5 h-4.5" />
              )}
            </button>

            {/* Try Free Pill Button */}
            <button
              onClick={() => searchInputRef.current?.focus()}
              className="hidden sm:inline-flex py-2 px-5 bg-text-primary text-background hover:opacity-90 font-bold text-xs rounded-full shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Try free
            </button>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-all duration-200"
            >
              {mobileMenuOpen ? (
                <X className="w-4.5 h-4.5" />
              ) : (
                <Menu className="w-4.5 h-4.5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden glass border-b absolute left-0 right-0 py-4 px-6 animate-slide-down shadow-xl flex flex-col space-y-4">
            <a
              href="#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-text-secondary hover:text-primary transition-colors py-1"
            >
              Categories
            </a>
            <a
              href="#deals"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-text-secondary hover:text-primary transition-colors py-1"
            >
              Deals
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-text-secondary hover:text-primary transition-colors py-1"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-text-secondary hover:text-primary transition-colors py-1"
            >
              About
            </a>
            <hr className="border-border my-2" />
            <a
              href="https://github.com/HassanAbdelhamed22/PriceRadar"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 py-2 text-text-secondary hover:text-primary"
            >
              <GithubIcon className="w-5 h-5" />
              <span className="font-medium text-sm">View Source Code</span>
            </a>
          </div>
        )}
      </header>

      {/* ----------------------------------------------------
         HERO SECTION
      ------------------------------------------------------- */}
      <section className="relative pt-16 pb-20 overflow-visible z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Background 3D glass bubbles / spheres */}
        <div className="bubble-3d w-28 h-28 left-[5%] top-[12%] animate-float hidden lg:block" />
        <div className="bubble-3d w-36 h-36 right-[15%] top-[5%] animate-float-delayed hidden lg:block" />
        <div className="bubble-3d w-18 h-18 right-[5%] top-[45%] animate-float hidden lg:block" />
        <div className="bubble-3d w-24 h-24 left-[10%] bottom-[15%] animate-float-delayed hidden lg:block" />

        {/* Relative Container for centering and placing absolute cards */}
        <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center justify-center space-y-7 py-8">
          
          {/* Floating Card 1: MacBook Air (Left) */}
          <div className="absolute left-[-22%] top-[30%] w-[250px] hidden lg:flex items-center space-x-4.5 glass-card p-4.5 rounded-2xl border border-border/80 hover-lift z-20">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/15 shadow-sm">
              <Laptop className="w-5.5 h-5.5" />
            </div>
            <div className="text-left grow min-w-0">
              <h3 className="font-bold text-xs text-text-primary truncate">MacBook Air M3</h3>
              <p className="font-extrabold text-sm text-text-primary mt-0.5">EGP 64,900</p>
              <div className="flex items-center space-x-1 mt-1 text-success text-[11px] font-bold">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>-12%</span>
              </div>
            </div>
          </div>

          {/* Floating Card 2: iPhone 15 Pro (Right Top) */}
          <div className="absolute right-[-18%] top-[15%] w-[230px] hidden lg:flex items-center space-x-4.5 glass-card p-4.5 rounded-2xl border border-border/80 hover-lift z-20">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 border border-accent/15 shadow-sm">
              <Smartphone className="w-5.5 h-5.5" />
            </div>
            <div className="text-left grow min-w-0">
              <h3 className="font-bold text-xs text-text-primary truncate">iPhone 15 Pro</h3>
              <p className="font-extrabold text-sm text-text-primary mt-0.5">EGP 78,500</p>
              <div className="flex items-center space-x-1 mt-1 text-success text-[11px] font-bold">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>-8%</span>
              </div>
            </div>
          </div>

          {/* Floating Card 3: Sony Headphones (Right Bottom) */}
          <div className="absolute right-[-20%] bottom-[5%] w-[250px] hidden lg:flex items-center space-x-4.5 glass-card p-4.5 rounded-2xl border border-border/80 hover-lift z-20">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary dark:text-text-primary shrink-0 border border-border shadow-sm">
              <Headphones className="w-5.5 h-5.5" />
            </div>
            <div className="text-left grow min-w-0">
              <h3 className="font-bold text-xs text-text-primary truncate">Sony WH-1000XM5</h3>
              <p className="font-extrabold text-sm text-text-primary mt-0.5">EGP 18,200</p>
              <div className="flex items-center space-x-1 mt-1 text-success text-[11px] font-bold">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>-22%</span>
              </div>
            </div>
          </div>

          {/* Promo Pill */}
          <div className="inline-flex items-center space-x-2 py-1.5 px-3 rounded-full border border-border bg-card/65 shadow-sm text-xs font-semibold text-text-secondary hover:border-primary transition-all duration-300 z-10">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span className="text-text-primary font-bold">AI-powered price intelligence · Now live in Egypt</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-text-primary z-10">
            Find the <span className="font-serif italic bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">best price</span> <br />
            before you buy.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed font-normal z-10">
            PriceRadar scans Egypt's top stores in real time, learns price patterns and tells you the smartest moment to checkout.
          </p>

          {/* Huge Animated Search Bar Capsule */}
          <div className="relative w-full max-w-2xl mx-auto z-20 pt-2">
            <div className="relative flex items-center w-full bg-card/60 glass border border-border rounded-full shadow-lg search-glow p-2 transition-all duration-300">
              <div className="pl-4 text-text-secondary shrink-0">
                <Search className="w-5 h-5 text-text-secondary" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for iPhone 15, RTX 4070, AirPods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2.5 px-3 bg-transparent text-text-primary placeholder-muted outline-none text-sm sm:text-base font-semibold"
              />
              
              {/* Clear Input */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mr-2 p-1.5 rounded-full hover:bg-surface text-text-secondary hover:text-primary transition-all duration-200"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              )}

              {/* Compare Button */}
              <button
                onClick={() => {
                  if (searchQuery.trim()) {
                    setActiveCategory('All');
                  }
                }}
                className="py-2.5 px-6 bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-full flex items-center space-x-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
              >
                <span>Compare</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Autocomplete / Live Search Suggestions overlay */}
            {isSearching && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-slide-down">
                <div className="p-3 border-b border-border bg-surface text-xs font-semibold text-muted uppercase tracking-wider flex items-center justify-between">
                  <span>Live Matches Found</span>
                  <span>AI Analysis Active</span>
                </div>
                {searchResults.length > 0 ? (
                  <div className="divide-y divide-border max-h-[300px] overflow-y-auto">
                    {searchResults.map((deal) => (
                      <a
                        key={deal.id}
                        href="#deals"
                        onClick={() => {
                          setSearchQuery(deal.title);
                          setActiveCategory(deal.category);
                        }}
                        className="flex items-center justify-between p-4 hover:bg-surface transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3.5 min-w-0">
                          <span className="p-2.5 bg-surface border border-border rounded-xl flex items-center justify-center text-primary">
                            {renderCategoryIcon(deal.category, "w-5 h-5")}
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold text-text-primary text-sm truncate">{deal.title}</p>
                            <span className="inline-block text-[11px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase mt-0.5">
                              {deal.category}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0 pl-3">
                          <p className="text-sm font-bold text-success">
                            EGP {deal.stores[0].price.toLocaleString()}
                          </p>
                          <p className="text-[11px] text-muted">
                            Save {deal.savingPercent}%
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-text-secondary">
                    <p className="font-medium text-sm">No results match your search term.</p>
                    <p className="text-xs text-muted mt-1">Try matching "iPhone", "Sony", or "Lenovo".</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Trending Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-1.5 text-xs z-10">
            <span className="text-muted font-bold mr-1">Trending:</span>
            {['iPhone 15 Pro', 'MacBook Air M3', 'PS5 Slim', 'Galaxy S24'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
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

      {/* ----------------------------------------------------
         CATEGORIES SECTION
      ------------------------------------------------------- */}
      <section id="categories" className="py-20 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/70 scroll-mt-16">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Discover Smart</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Browse Popular Categories
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto text-base">
            Select a category to view live price differences and analyze AI recommendations across stores.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => {
                  setActiveCategory(isActive ? 'All' : cat.name);
                }}
                className={`p-6 rounded-2xl border text-center transition-all duration-300 hover-lift flex flex-col items-center justify-center space-y-3 group ${
                  isActive
                    ? 'bg-linear-to-tr from-primary to-accent border-transparent text-white shadow-xl shadow-primary/10'
                    : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-surface border border-border text-primary'
                }`}>
                  {renderCategoryIcon(cat.name, "w-7 h-7")}
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${isActive ? 'text-white' : 'text-text-primary'}`}>{cat.name}</h3>
                  <p className={`text-xs mt-1 font-semibold ${isActive ? 'text-white/80' : 'text-muted'}`}>{cat.count}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ----------------------------------------------------
         DEALS & PRODUCTS GRID
      ------------------------------------------------------- */}
      <section id="deals" className="py-20 bg-surface/40 border-t border-b border-border/70 relative z-10 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div className="space-y-3 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Live Scan</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Today's Best Electronics Deals
              </h2>
              <p className="text-text-secondary max-w-lg text-base">
                Real-time price comparisons computed from Egyptian retailers. Hover on sparklines to preview 30-day trends.
              </p>
            </div>
            
            {/* Category Filter Pills (Deals view control) */}
            <div className="flex flex-wrap justify-center gap-2 border border-border bg-card p-1 rounded-xl">
              {['All', ...CATEGORIES.map(c => c.name)].map((tab) => {
                const isActive = activeCategory === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveCategory(tab)}
                    className={`py-1.5 px-4 rounded-lg text-xs font-bold transition-all duration-300 ${
                      isActive
                        ? 'bg-primary text-white shadow-md'
                        : 'text-text-secondary hover:text-primary hover:bg-surface'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDeals.length > 0 ? (
              filteredDeals.map((deal) => {
                // Determine cheapest price
                const sortedStores = [...deal.stores].sort((a, b) => a.price - b.price);
                const cheapestStore = sortedStores[0];

                return (
                  <div key={deal.id} className="bg-card border border-border rounded-2xl overflow-hidden hover-lift shadow-sm flex flex-col">
                    {/* Upper layout preview */}
                    <div className="p-6 pb-4 border-b border-border/70 relative">
                      {/* Product image placeholder & tag */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center text-primary shadow-inner">
                          {renderCategoryIcon(deal.category, "w-6 h-6")}
                        </div>
                        <span className="bg-success/10 text-success border border-success/20 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          Save EGP {deal.savings.toLocaleString()} ({deal.savingPercent}%)
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-base text-text-primary line-clamp-2 h-12 leading-snug">
                        {deal.title}
                      </h3>

                      {/* Store lists */}
                      <div className="mt-5 space-y-3">
                        {deal.stores.map((store) => (
                          <div
                            key={store.name}
                            className={`flex justify-between items-center p-2 rounded-xl border transition-all duration-200 ${
                              store.cheapest
                                ? 'bg-success/5 border-success/30'
                                : 'bg-surface/50 border-transparent hover:border-border'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                                store.logo === 'AMZ' ? 'bg-amber-100 text-amber-800' :
                                store.logo === 'NON' ? 'bg-yellow-100 text-yellow-800' :
                                store.logo === 'BTC' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {store.logo}
                              </span>
                              <span className="text-xs font-semibold text-text-secondary">{store.name}</span>
                            </div>
                            <div className="text-right">
                              <span className={`text-sm font-bold ${store.cheapest ? 'text-success' : 'text-text-primary'}`}>
                                EGP {store.price.toLocaleString()}
                              </span>
                              {store.originalPrice && (
                                <p className="text-[10px] text-muted line-through">
                                  EGP {store.originalPrice.toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sparkline & AI recommendation footer */}
                    <div className="p-5 bg-surface/30 mt-auto flex flex-col space-y-4">
                      {/* Mini Sparkline Chart */}
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] font-bold text-muted uppercase tracking-wider">30-Day Price Trend</span>
                          <span className="text-[10px] font-semibold text-text-secondary">EGP {cheapestStore.price.toLocaleString()} Lowest</span>
                        </div>
                        <div className="h-8 w-full pt-1">
                          <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id={`gradient-spark-${deal.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            {/* Area Path under line */}
                            <path
                              d={`M 0 20 
                                  L 0 ${20 - ((deal.history[0] - cheapestStore.price * 0.9) / (cheapestStore.price * 0.2)) * 18}
                                  L 25 ${20 - ((deal.history[1] - cheapestStore.price * 0.9) / (cheapestStore.price * 0.2)) * 18}
                                  L 50 ${20 - ((deal.history[2] - cheapestStore.price * 0.9) / (cheapestStore.price * 0.2)) * 18}
                                  L 75 ${20 - ((deal.history[3] - cheapestStore.price * 0.9) / (cheapestStore.price * 0.2)) * 18}
                                  L 100 ${20 - ((deal.history[4] - cheapestStore.price * 0.9) / (cheapestStore.price * 0.2)) * 18}
                                  L 100 20 Z`}
                              fill={`url(#gradient-spark-${deal.id})`}
                            />
                            {/* Stroke Trend Line */}
                            <path
                              d={`M 0 ${20 - ((deal.history[0] - cheapestStore.price * 0.9) / (cheapestStore.price * 0.2)) * 18} 
                                  L 25 ${20 - ((deal.history[1] - cheapestStore.price * 0.9) / (cheapestStore.price * 0.2)) * 18}
                                  L 50 ${20 - ((deal.history[2] - cheapestStore.price * 0.9) / (cheapestStore.price * 0.2)) * 18}
                                  L 75 ${20 - ((deal.history[3] - cheapestStore.price * 0.9) / (cheapestStore.price * 0.2)) * 18}
                                  L 100 ${20 - ((deal.history[4] - cheapestStore.price * 0.9) / (cheapestStore.price * 0.2)) * 18}`}
                              fill="none"
                              stroke="var(--color-primary)"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* AI Verdict Card */}
                      <div className={`p-3 rounded-xl border text-xs flex items-start space-x-2.5 ${
                        deal.aiStatus === 'warning'
                          ? 'bg-warning/5 border-warning/20 text-warning-800 dark:text-warning'
                          : 'bg-success/5 border-success/20 text-success-800 dark:text-success'
                      }`}>
                        <Brain className="w-5 h-5 text-current shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold uppercase text-[9px] tracking-wider">AI Comparison Verdict</p>
                          <p className="font-medium mt-0.5">{deal.aiVerdict}</p>
                        </div>
                      </div>

                      {/* Buy Button */}
                      <a
                        href="#how-it-works"
                        className="w-full text-center py-2.5 px-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-xs shadow-md transition-all duration-300 hover:shadow-lg focus:outline-none"
                      >
                        Compare {deal.stores.length} Retailers
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-16 text-center text-text-secondary">
                <Search className="w-12 h-12 text-muted mx-auto" />
                <h3 className="text-lg font-bold mt-4 text-text-primary">No Deals Found</h3>
                <p className="text-sm text-muted mt-1 max-w-sm mx-auto">
                  We couldn't find matches for "{searchQuery}" under the category "{activeCategory}". Click clear or try other categories.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                  }}
                  className="mt-6 py-2 px-5 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary-hover shadow-md transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
         HOW IT WORKS
      ------------------------------------------------------- */}
      <section id="how-it-works" className="py-20 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-16">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Simple & Direct</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            How PriceRadar Works
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto text-base">
            Save money on imports and local manufacturing. Get the absolute best deals in 3 easy steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          
          {/* Step 1 */}
          <div className="bg-card border border-border p-8 rounded-2xl hover-lift relative overflow-hidden flex flex-col items-center text-center space-y-4">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full flex items-center justify-center font-black text-2xl text-primary/10 select-none pl-6 pb-6">
              01
            </div>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-xl text-text-primary">Compare</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              We crawl Egypt's top retail platforms multiple times a day to update exact matches, tax differences, and current listing rates.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-card border border-border p-8 rounded-2xl hover-lift relative overflow-hidden flex flex-col items-center text-center space-y-4">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full flex items-center justify-center font-black text-2xl text-accent/10 select-none pl-6 pb-6">
              02
            </div>
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shadow-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-xl text-text-primary">Analyze</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Our smart tracking system cross-references previous price hikes and drops, warning you if current listings represent artificial discounts.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-card border border-border p-8 rounded-2xl hover-lift relative overflow-hidden flex flex-col items-center text-center space-y-4">
            <div className="absolute top-0 right-0 w-24 h-24 bg-success/5 rounded-bl-full flex items-center justify-center font-black text-2xl text-success/10 select-none pl-6 pb-6">
              03
            </div>
            <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center text-success shadow-sm">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-xl text-text-primary">Buy</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Once you lock onto the perfect rate, click the link to go directly to the verified store checkout. 100% free with no commissions.
            </p>
          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
         TESTIMONIALS SECTION
      ------------------------------------------------------- */}
      <section id="testimonials" className="py-20 bg-surface/30 border-t border-border/70 relative z-10 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">User Reviews</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Trusted by Smart Buyers in Egypt
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto text-base">
              See how our comparison metrics helped local consumers make educated, cost-effective decisions.
            </p>
          </div>

          {/* Testimonial Cards Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-card border border-border p-7 rounded-2xl flex flex-col justify-between hover-lift shadow-sm">
              <div>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed italic">
                  "I was looking for the Legion 5 laptop in Cairo for weeks. The store prices ranged from 56K to 63K. PriceRadar pointed me to a Noon deal that was 54.2K EGP. Saved over 4,000 EGP instantly!"
                </p>
              </div>
              <div className="flex items-center space-x-3.5 mt-6 pt-4 border-t border-border/70">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm shrink-0">
                  HA
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text-primary">Hassan Abdelhamed</h4>
                  <p className="text-[11px] text-muted">Software Engineer, Cairo</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-card border border-border p-7 rounded-2xl flex flex-col justify-between hover-lift shadow-sm">
              <div>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed italic">
                  "Checking the price history chart on PriceRadar saved me from purchasing a television on Noon during a fake White Friday sale. The AI verdict said wait, and the price dropped the following week."
                </p>
              </div>
              <div className="flex items-center space-x-3.5 mt-6 pt-4 border-t border-border/70">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center font-bold text-accent text-sm shrink-0">
                  MA
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text-primary">Mostafa Aly</h4>
                  <p className="text-[11px] text-muted">Business Analyst, Alexandria</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-card border border-border p-7 rounded-2xl flex flex-col justify-between hover-lift shadow-sm">
              <div>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed italic">
                  "PriceRadar makes compare shopping in Egypt actually work. I love how it automatically flags the cheapest merchant and includes the shipping rates, saving me the hassle of open tabs."
                </p>
              </div>
              <div className="flex items-center space-x-3.5 mt-6 pt-4 border-t border-border/70">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center font-bold text-success text-sm shrink-0">
                  NY
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text-primary">Nour Youssef</h4>
                  <p className="text-[11px] text-muted">UX Designer, Giza</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
         FAQ SECTION
      ------------------------------------------------------- */}
      <section id="faq" className="py-20 relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/70 scroll-mt-16">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Got Questions?</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-text-secondary text-base">
            Everything you need to know about comparing prices on PriceRadar.
          </p>
        </div>

        {/* FAQs Accordions */}
        <div className="space-y-4">
          {[
            {
              q: 'How does PriceRadar find the best prices in Egypt?',
              a: 'Our crawler engines scan thousands of product pages daily across top local merchants like Amazon.eg, Noon.eg, Jumia, B.TECH, and others. We map variations like capacity, colors, and models using smart algorithms, indexing matching deals instantly.',
            },
            {
              q: 'Are the prices updated in real time?',
              a: 'Yes, we index and update prices continuously throughout the day. However, due to high volatility and flash sales, checking the merchant page using our redirection link is always recommended to lock in the final checkout price.',
            },
            {
              q: 'Is PriceRadar free to use?',
              a: 'PriceRadar is 100% free to use. We do not insert additional markup, charge memberships, or receive secret payouts. We show clean, unbiased price comparisons so you can save real money.',
            },
            {
              q: 'What does the "AI Verdict" mean?',
              a: 'Our AI Verdict analyses the 30-day and 90-day price trends. If the price is near a historical low, it recommends buying. If the price was recently inflated, it advises you to wait or check alternative stores.',
            },
          ].map((faq, index) => {
            const isOpen = faqOpenIndex === index;
            return (
              <div
                key={index}
                className="bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
              >
                <button
                  onClick={() => setFaqOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left font-bold text-base text-text-primary hover:text-primary transition-colors focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <span className="p-1.5 border border-border bg-surface rounded-lg transition-transform duration-300 flex items-center justify-center">
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'text-text-secondary'}`} />
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-text-secondary text-sm leading-relaxed border-t border-border/50 pt-4 animate-slide-down">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ----------------------------------------------------
         MODERN FOOTER
      ------------------------------------------------------- */}
      <footer className="bg-footer border-t border-border relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">
            
            {/* Logo, Description & Newsletter */}
            <div className="md:col-span-6 space-y-6">
              <a href="#" className="flex items-center space-x-2.5 group">
                <LogoIcon />
                <div className="flex flex-col">
                  <span className="font-bold text-sm leading-tight text-text-primary group-hover:text-primary transition-colors">
                    PriceRadar
                  </span>
                  <span className="text-[9px] text-primary font-semibold tracking-widest uppercase -mt-0.5">
                    Egypt
                  </span>
                </div>
              </a>
              <p className="text-text-secondary text-sm max-w-sm leading-relaxed font-normal">
                An advanced AI-powered price analysis engine for smart shoppers in Egypt. Stop paying extra; track deals on smartphones, appliances, and laptops.
              </p>
              
              {/* Newsletter Form */}
              <div className="space-y-2 max-w-md">
                <h4 className="font-bold text-xs text-text-primary uppercase tracking-wider">Subscribe to Price Alerts</h4>
                <p className="text-xs text-muted">Get weekly reports on laptops, phones and gaming console price drops in Cairo.</p>
                <form onSubmit={handleNewsletterSubmit} className="flex space-x-2 pt-1">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="py-2.5 px-4 bg-card border border-border text-text-primary placeholder-muted rounded-xl text-xs grow outline-none focus:border-primary transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition-all duration-300 focus:outline-none shrink-0"
                  >
                    {newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
                {newsletterStatus === 'success' && (
                  <p className="text-xs font-semibold text-success animate-fade-in flex items-center space-x-1.5 mt-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Successfully subscribed to weekly drops!</span>
                  </p>
                )}
              </div>
            </div>

            {/* Quick Links Column 1 */}
            <div className="col-span-6 md:col-span-3 space-y-4">
              <h4 className="font-extrabold text-xs text-text-primary uppercase tracking-wider">Product Categories</h4>
              <ul className="space-y-2.5 text-xs font-semibold">
                <li><a href="#categories" onClick={() => setActiveCategory('Laptop')} className="text-text-secondary hover:text-primary transition-colors">Laptops & PCs</a></li>
                <li><a href="#categories" onClick={() => setActiveCategory('Phone')} className="text-text-secondary hover:text-primary transition-colors">Smartphones</a></li>
                <li><a href="#categories" onClick={() => setActiveCategory('Gaming')} className="text-text-secondary hover:text-primary transition-colors">Gaming Consoles</a></li>
                <li><a href="#categories" onClick={() => setActiveCategory('TV')} className="text-text-secondary hover:text-primary transition-colors">Smart Televisions</a></li>
                <li><a href="#categories" onClick={() => setActiveCategory('Tablet')} className="text-text-secondary hover:text-primary transition-colors">Tablets & Readers</a></li>
              </ul>
            </div>

            {/* Quick Links Column 2 */}
            <div className="col-span-6 md:col-span-3 space-y-4">
              <h4 className="font-extrabold text-xs text-text-primary uppercase tracking-wider">Company & Legal</h4>
              <ul className="space-y-2.5 text-xs font-semibold">
                <li><a href="#how-it-works" className="text-text-secondary hover:text-primary transition-colors">About our AI Crawler</a></li>
                <li><a href="#testimonials" className="text-text-secondary hover:text-primary transition-colors">User Testimonials</a></li>
                <li><a href="#faq" className="text-text-secondary hover:text-primary transition-colors">FAQ Support</a></li>
                <li><a href="https://github.com/HassanAbdelhamed22/PriceRadar" target="_blank" rel="noreferrer" className="text-text-secondary hover:text-primary transition-colors">GitHub Repository</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted font-medium">
            <p>© {new Date().getFullYear()} PriceRadar Egypt. Built for comparison shopping only. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
