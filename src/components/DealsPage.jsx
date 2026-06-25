import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Laptop,
  Smartphone,
  Gamepad2,
  Tv,
  Tablet,
  Headphones,
  Radar,
  Sun,
  Moon,
  ArrowRight,
  Menu,
  X,
  Brain,
  Clock,
  Flame,
  Percent,
  TrendingDown,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Star,
  ChevronLeft
} from 'lucide-react';

import productsData from '../data/products.json';

const DEALS_DATA = productsData.map(product => {
  const sortedStores = [...product.stores].sort((a, b) => a.price - b.price);
  const cheapest = sortedStores[0];
  const mostExpensive = sortedStores[sortedStores.length - 1];
  
  const lowestPrice = cheapest ? cheapest.price : 0;
  const highestPrice = mostExpensive ? mostExpensive.price : 0;
  const savings = highestPrice - lowestPrice;
  const savingPercent = highestPrice > 0 ? Math.round((savings / highestPrice) * 100) : 0;
  
  // Categorization tags
  const tags = [];
  if (product.recommendation && product.recommendation.action === 'Buy Now') {
    tags.push("Today's Picks");
  }
  if (savings > 1000) {
    tags.push("Best Savings");
  }
  if (product.reviews > 400 || product.rating >= 4.4) {
    tags.push("Trending Products");
  }
  if (tags.length === 0) {
    tags.push("Today's Picks");
  }
  
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
    category: category,
    lowestPrice: lowestPrice,
    highestPrice: highestPrice,
    savings: savings,
    savingPercent: savingPercent,
    stores: product.stores.map(s => {
      let storeLogo = 'ST';
      const sName = s.name.toLowerCase();
      if (sName.includes('amazon')) storeLogo = 'AMZ';
      else if (sName.includes('noon')) storeLogo = 'NON';
      else if (sName.includes('jumia')) storeLogo = 'JUM';
      else if (sName.includes('b.tech')) storeLogo = 'BTC';
      else if (sName.includes('raya')) storeLogo = 'RAY';
      return {
        name: s.name,
        price: s.price,
        logo: storeLogo,
        cheapest: cheapest && s.name === cheapest.name
      };
    }),
    aiVerdict: aiVerdict,
    aiStatus: aiStatus,
    rating: product.rating,
    reviews: product.reviews,
    image: product.image,
    tags: tags
  };
});

const CATEGORY_ICONS = {
  Laptop: Laptop,
  Phone: Smartphone,
  Gaming: Gamepad2,
  TV: Tv,
  Tablet: Tablet,
  Audio: Headphones
};

const LogoIcon = () => (
  <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-tr from-primary to-accent text-white shadow-lg overflow-hidden shrink-0">
    <Radar className="w-5.5 h-5.5 animate-pulse" />
    <div className="absolute inset-0 border border-white/20 rounded-xl" />
  </div>
);

function DealCard({ deal, navigate, getCategoryIcon }) {
  const [showAllStores, setShowAllStores] = useState(false);

  const cheapestStore = deal.stores.find(s => s.cheapest) || deal.stores[0];
  const otherStores = deal.stores.filter(s => s.name !== cheapestStore.name);

  return (
    <div 
      className="bg-card border border-border rounded-3xl overflow-hidden hover-lift shadow-sm hover:shadow-xl transition-all duration-300 hover:border-primary/50 flex flex-col justify-between group"
    >
      {/* Top Image Frame */}
      <div 
        onClick={() => navigate(`/product/${deal.id}`)}
        className="h-48 bg-white relative flex items-center justify-center border-b border-border/40 overflow-hidden shrink-0 select-none w-full cursor-pointer"
      >
        <img 
          src={deal.image} 
          alt={deal.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-accent text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-md select-none">
          {deal.savingPercent}% Off
        </div>
      </div>

      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Header: Category Badge & Savings Tag */}
          <div 
            onClick={() => navigate(`/product/${deal.id}`)}
            className="flex justify-between items-start cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-surface border border-border/60 flex items-center justify-center text-primary shadow-inner">
              {getCategoryIcon(deal.category)}
            </div>
            <span className="bg-success/10 text-success border border-success/20 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Save EGP {deal.savings.toLocaleString()}
            </span>
          </div>

          {/* Title & Ratings */}
          <div 
            onClick={() => navigate(`/product/${deal.id}`)}
            className="space-y-1 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-muted uppercase tracking-wider">{deal.brand}</span>
              {/* Rating Badge */}
              <div className="flex items-center space-x-1 text-warning bg-warning/5 border border-warning/10 px-1.5 py-0.5 rounded-md select-none">
                <Star className="w-3 h-3 fill-warning stroke-warning" />
                <span className="text-[10px] font-bold">{deal.rating}</span>
              </div>
            </div>
            <h3 className="font-extrabold text-base text-text-primary line-clamp-2 leading-snug min-h-[44px]">
              {deal.title}
            </h3>
            <p className="text-[10px] text-muted font-semibold mt-0.5">({deal.reviews} catalog reviews)</p>
          </div>

          {/* Stores Compare Mini-Widget */}
          <div className="space-y-2 pt-2">
            {/* Cheapest Store (Always Visible) */}
            {cheapestStore && (
              <div 
                className="flex justify-between items-center p-2 rounded-xl border bg-success/5 border-success/25"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-surface border border-border/80 text-text-secondary select-none">
                    {cheapestStore.logo}
                  </span>
                  <span className="text-xs font-semibold text-text-secondary">{cheapestStore.name}</span>
                  <span className="bg-success text-white text-[8px] px-1.5 rounded font-black uppercase tracking-widest select-none">Cheapest</span>
                </div>
                <span className="text-xs font-bold text-success">
                  EGP {cheapestStore.price.toLocaleString()}
                </span>
              </div>
            )}

            {/* Toggle Other Stores Button */}
            {otherStores.length > 0 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllStores(!showAllStores);
                }}
                className="w-full text-center py-2 text-[10px] font-extrabold text-primary hover:text-primary-hover flex items-center justify-center space-x-1 border border-dashed border-border hover:border-primary/40 rounded-xl transition-all cursor-pointer bg-transparent"
              >
                <span>{showAllStores ? 'Hide other stores' : `+ Show ${otherStores.length} more stores`}</span>
              </button>
            )}

            {/* Other Stores Panel */}
            {showAllStores && otherStores.map((store) => (
              <div 
                key={store.name} 
                className="flex justify-between items-center p-2 rounded-xl border border-transparent bg-surface/40 animate-slide-down"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-surface border border-border/80 text-text-secondary select-none">
                    {store.logo}
                  </span>
                  <span className="text-xs font-semibold text-text-secondary">{store.name}</span>
                </div>
                <span className="text-xs font-bold text-text-primary">
                  EGP {store.price.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Verdict Box & Details Navigation Bar */}
        <div className="space-y-3.5 pt-4 border-t border-border/40">
          <div 
            onClick={() => navigate(`/product/${deal.id}`)}
            className={`p-3 rounded-xl border text-[11px] flex items-start space-x-2.5 cursor-pointer ${deal.aiStatus === 'warning' ? 'bg-warning/5 border-warning/20 text-warning-800' : 'bg-success/5 border-success/20 text-success-800'}`}
          >
            <Brain className="w-4.5 h-4.5 text-current shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="font-bold uppercase text-[9px] tracking-wider block">AI Verdict</span>
              <span className="font-semibold leading-normal">{deal.aiVerdict}</span>
            </div>
          </div>

          <button
            onClick={() => navigate(`/product/${deal.id}`)}
            className="w-full text-center py-2.5 px-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-xs shadow-md transition-all duration-300 cursor-pointer border-none"
          >
            Compare Retailers
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DealsPage({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Today\'s Picks', 'Best Savings', 'Trending Products'
  const [sortBy, setSortBy] = useState('savings-desc'); // 'savings-desc', 'price-asc', 'percent-desc'
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const dealsSectionRef = useRef(null);
  const ITEMS_PER_PAGE = 10;

  // Reset page when sorting or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, sortBy]);

  // Countdown timer logic to midnight
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  const getCategoryIcon = (category) => {
    const IconComp = CATEGORY_ICONS[category] || ShoppingBag;
    return <IconComp className="w-4 h-4" />;
  };

  // Filtering
  const filteredDeals = DEALS_DATA.filter((deal) => {
    if (activeTab === 'All') return true;
    return deal.tags.includes(activeTab);
  });

  // Sorting
  const sortedDeals = [...filteredDeals].sort((a, b) => {
    if (sortBy === 'savings-desc') return b.savings - a.savings;
    if (sortBy === 'price-asc') return a.lowestPrice - b.lowestPrice;
    if (sortBy === 'percent-desc') return b.savingPercent - a.savingPercent;
    return 0;
  });

  // Pagination calculation
  const totalPages = Math.ceil(sortedDeals.length / ITEMS_PER_PAGE);
  const paginatedDeals = sortedDeals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Split into Spotlight (top 2 savings) and list
  const spotlightDeals = [...DEALS_DATA]
    .sort((a, b) => b.savings - a.savings)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans transition-colors duration-300 relative pb-20 select-none">
      
      {/* DECORATIVE GLOW BACKGROUNDS */}
      <div className="absolute top-0 inset-x-0 h-192 grid-overlay pointer-events-none z-0" />
      <div className="absolute top-24 left-[5%] w-96 h-96 radial-glow rounded-full pointer-events-none z-0" />
      <div className="absolute top-48 right-[5%] w-96 h-96 radial-glow rounded-full pointer-events-none z-0" />

      {/* STICKY HEADER & NAVBAR */}
      <header className="sticky top-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-7xl glass rounded-full border transition-all duration-300 shadow-md">
        <div className="px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center space-x-2.5 group cursor-pointer bg-transparent border-none">
            <LogoIcon />
            <div className="flex items-center space-x-2 text-left">
              <span className="font-extrabold text-lg tracking-tight text-text-primary">
                PriceRadar
              </span>
              <span className="text-[10px] font-black bg-secondary text-background px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                EG
              </span>
            </div>
          </button>

          {/* Nav links */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => navigate('/')} className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer bg-transparent border-none">Home</button>
            <button onClick={() => navigate('/categories')} className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer bg-transparent border-none">Categories</button>
            <button onClick={() => navigate('/deals')} className="text-sm font-extrabold text-primary hover:text-primary transition-colors cursor-pointer bg-transparent border-none">Deals</button>
          </nav>

          {/* Interactive features */}
          <div className="flex items-center space-x-3.5">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-all duration-200 cursor-pointer bg-transparent border-none"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-all duration-200 cursor-pointer bg-transparent border-none"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden glass border-b absolute left-0 right-0 py-4 px-6 animate-slide-down shadow-xl flex flex-col space-y-4 rounded-3xl mt-2 border">
            <button onClick={() => { setMobileMenuOpen(false); navigate('/'); }} className="text-left font-semibold text-text-secondary hover:text-primary transition-colors py-1 bg-transparent border-none">Home</button>
            <button onClick={() => { setMobileMenuOpen(false); navigate('/categories'); }} className="text-left font-semibold text-text-secondary hover:text-primary transition-colors py-1 bg-transparent border-none">Categories</button>
            <button onClick={() => { setMobileMenuOpen(false); navigate('/deals'); }} className="text-left font-semibold text-primary transition-colors py-1 bg-transparent border-none">Deals</button>
          </div>
        )}
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10 space-y-16">
        
        {/* HERO HEADER WITH COUNTDOWN TIMER */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 border-b border-border/40 pb-10">
          <div className="text-center lg:text-left space-y-4 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center justify-center lg:justify-start gap-1">
              <Sparkles className="w-4.5 h-4.5 text-primary animate-pulse" />
              Live Scanner Enabled
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Today's Golden <span className="font-serif italic bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Retail Deals</span>
            </h1>
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
              We trace catalog discounts across Egypt's largest retailers in real-time, matching high saving margins with AI buy suggestions.
            </p>
          </div>

          {/* Countdown Clock Widget */}
          <div className="bg-card glass border border-border rounded-3xl p-6 shadow-xl flex flex-col items-center space-y-3 min-w-[280px]">
            <div className="flex items-center space-x-2 text-text-secondary text-[11px] font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4 text-primary animate-spin-slow" />
              <span>Deals Refresh In</span>
            </div>
            <div className="flex items-center space-x-3.5">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black tabular-nums tracking-tight font-display bg-surface border border-border px-3.5 py-2.5 rounded-2xl shadow-inner min-w-[54px] text-center">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-muted mt-1 uppercase">Hours</span>
              </div>
              <span className="text-xl font-bold text-muted -translate-y-2.5">:</span>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black tabular-nums tracking-tight font-display bg-surface border border-border px-3.5 py-2.5 rounded-2xl shadow-inner min-w-[54px] text-center">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-muted mt-1 uppercase">Mins</span>
              </div>
              <span className="text-xl font-bold text-muted -translate-y-2.5">:</span>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black tabular-nums tracking-tight font-display bg-surface border border-border px-3.5 py-2.5 rounded-2xl shadow-inner min-w-[54px] text-center text-primary">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-muted mt-1 uppercase">Secs</span>
              </div>
            </div>
          </div>
        </div>

        {/* SPOTLIGHT DEALS SECTION (BIG DISCOUNT SPOTLIGHT) */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <span className="p-1.5 bg-accent/10 rounded-lg text-accent">
              <Flame className="w-5 h-5 animate-bounce" />
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight">Big Discount Spotlights</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {spotlightDeals.map((deal) => {
              // Calculate discount percentage logic representation
              const savingPercent = Math.round((deal.savings / deal.highestPrice) * 100);
              
              return (
                <div 
                  key={deal.id}
                  onClick={() => navigate(`/product/${deal.id}`)}
                  className="group bg-card border border-border rounded-3xl overflow-hidden hover-lift shadow-sm hover:shadow-xl transition-all duration-300 hover:border-primary/50 cursor-pointer flex flex-col sm:flex-row"
                >
                  {/* Image Column */}
                  <div className="sm:w-2/5 h-48 sm:h-auto bg-white relative flex items-center justify-center p-6 border-b sm:border-b-0 sm:border-r border-border/40 overflow-hidden shrink-0">
                    <img 
                      src={deal.image} 
                      alt={deal.title}
                      loading="lazy"
                      decoding="async"
                      className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-accent text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-md">
                      {savingPercent}% Off
                    </div>
                  </div>

                  {/* Body Column */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{deal.brand}</span>
                        <span className="flex items-center space-x-1 text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Save EGP {deal.savings.toLocaleString()}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-base text-text-primary tracking-tight leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {deal.title}
                      </h3>
                    </div>

                    {/* Progress Bar of Savings */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-text-secondary">Discount Margin</span>
                        <span className="text-primary">{savingPercent}%</span>
                      </div>
                      <div className="h-2 w-full bg-surface rounded-full overflow-hidden border border-border/40">
                        <div 
                          className="h-full bg-linear-to-r from-orange-500 to-accent rounded-full transition-all duration-500" 
                          style={{ width: `${savingPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* AI Verdict snippet box */}
                    <div className={`p-3 rounded-xl border text-[11px] flex items-start space-x-2 ${deal.aiStatus === 'warning' ? 'bg-warning/5 border-warning/20 text-warning-800' : 'bg-success/5 border-success/20 text-success-800'}`}>
                      <Brain className="w-4.5 h-4.5 text-current shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="font-bold uppercase text-[9px] tracking-wider block">AI Verdict</span>
                        <span className="font-medium">{deal.aiVerdict}</span>
                      </div>
                    </div>

                    {/* Footer price comparison action */}
                    <div className="pt-2 flex items-center justify-between text-xs font-bold border-t border-border/30">
                      <div>
                        <span className="text-text-secondary block text-[9px] uppercase">Best Price</span>
                        <span className="text-sm font-black text-text-primary">EGP {deal.lowestPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-primary group-hover:text-primary-hover">
                        <span>Compare Retailers</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TODAY'S DEALS GRID WITH CATEGORY FILTERS & TABS */}
        <div ref={dealsSectionRef} className="space-y-8">
          
          {/* Filters, Tabs & Sorting Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-5">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold tracking-tight">Trending & Featured Drops</h2>
              <p className="text-xs text-text-secondary">Filter daily drops based on real-time scanners & category labels.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Category tabs */}
              <div className="flex flex-wrap gap-1.5 border border-border bg-card p-1 rounded-2xl shadow-inner">
                {['All', 'Today\'s Picks', 'Best Savings', 'Trending Products'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 ${
                      activeTab === tab ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-primary hover:bg-surface'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Sorting selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-card glass border border-border text-text-primary text-xs font-bold rounded-xl px-3.5 py-2.5 outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="savings-desc">Highest Savings</option>
                <option value="percent-desc">Highest Discount %</option>
                <option value="price-asc">Price: Low to High</option>
              </select>
            </div>
          </div>

          {/* DEALS LIST GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedDeals.map((deal) => (
              <DealCard 
                key={deal.id} 
                deal={deal} 
                navigate={navigate} 
                getCategoryIcon={getCategoryIcon} 
              />
            ))}
          </div>

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-8 border-t border-border/30">
              <button
                onClick={() => {
                  if (currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                    dealsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                disabled={currentPage === 1}
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-card border border-border text-text-secondary hover:text-text-primary hover:bg-surface disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      dealsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-11 h-11 flex items-center justify-center rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                      currentPage === pageNum
                        ? 'bg-primary border-primary text-white shadow-sm'
                        : 'bg-card border-border text-text-secondary hover:bg-surface hover:text-text-primary'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => {
                  if (currentPage < totalPages) {
                    setCurrentPage(currentPage + 1);
                    dealsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                disabled={currentPage === totalPages}
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-card border border-border text-text-secondary hover:text-text-primary hover:bg-surface disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </main>

    </div>
  );
}
