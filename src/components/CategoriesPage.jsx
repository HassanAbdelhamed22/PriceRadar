import React, { useState } from 'react';
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
  Search
} from 'lucide-react';

const CATEGORIES_DATA = [
  {
    name: 'Laptop',
    label: 'Laptops & PCs',
    count: '450+ items',
    icon: Laptop,
    color: 'from-orange-500 to-amber-500',
    description: 'High-performance workstations, ultrabooks, and gaming laptops from Apple, Lenovo, Dell, and HP.',
    illustration: (
      <svg className="w-full h-full opacity-80 transition-transform duration-500 group-hover:scale-105" viewBox="0 0 100 60" fill="none">
        <rect x="15" y="10" width="70" height="40" rx="3" fill="currentColor" className="text-surface" stroke="var(--color-border)" strokeWidth="1.5" />
        <rect x="20" y="15" width="60" height="30" rx="1.5" fill="var(--color-background)" />
        <path d="M 5 50 L 95 50 L 90 53 L 10 53 Z" fill="currentColor" className="text-text-secondary/20" stroke="var(--color-border)" strokeWidth="1.5" />
        <rect x="45" y="50" width="10" height="2" fill="var(--color-primary)" />
        {/* Glow vector lines representing circuits */}
        <path d="M 25 25 L 40 25 L 45 30 L 55 30" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" className="animate-pulse" />
        <circle cx="25" cy="25" r="2" fill="var(--color-primary)" />
        <circle cx="55" cy="30" r="2" fill="var(--color-primary)" />
      </svg>
    )
  },
  {
    name: 'Phone',
    label: 'Smartphones',
    count: '1,200+ items',
    icon: Smartphone,
    color: 'from-pink-500 to-rose-500',
    description: 'Latest iOS and Android devices, including flagship series from Apple, Samsung, Xiaomi, and Realme.',
    illustration: (
      <svg className="w-full h-full opacity-80 transition-transform duration-500 group-hover:scale-105" viewBox="0 0 100 60" fill="none">
        <rect x="35" y="5" width="30" height="50" rx="5" fill="currentColor" className="text-surface" stroke="var(--color-border)" strokeWidth="1.5" />
        <rect x="38" y="8" width="24" height="44" rx="3" fill="var(--color-background)" />
        <circle cx="50" cy="48" r="1.5" fill="currentColor" className="text-text-secondary" />
        <rect x="46" y="6" width="8" height="1" rx="0.5" fill="currentColor" className="text-text-secondary" />
        {/* Price drop graph line illustration */}
        <path d="M 40 35 L 46 25 L 52 30 L 58 18" stroke="var(--color-success)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="58" cy="18" r="2" fill="var(--color-success)" />
      </svg>
    )
  },
  {
    name: 'Gaming',
    label: 'Gaming Consoles',
    count: '320+ items',
    icon: Gamepad2,
    color: 'from-purple-500 to-indigo-500',
    description: 'Next-gen consoles, VR setups, and controllers from PlayStation, Xbox, and Nintendo Switch.',
    illustration: (
      <svg className="w-full h-full opacity-80 transition-transform duration-500 group-hover:scale-105" viewBox="0 0 100 60" fill="none">
        <path d="M 20 20 C 20 15, 80 15, 80 20 C 80 30, 75 48, 65 48 C 58 48, 55 42, 50 42 C 45 42, 42 48, 35 48 C 25 48, 20 30, 20 20 Z" fill="currentColor" className="text-surface" stroke="var(--color-border)" strokeWidth="1.5" />
        <circle cx="32" cy="27" r="3" fill="var(--color-primary)" />
        <circle cx="32" cy="35" r="3" fill="var(--color-primary)" />
        <circle cx="28" cy="31" r="3" fill="var(--color-primary)" />
        <circle cx="36" cy="31" r="3" fill="var(--color-primary)" />
        <circle cx="68" cy="28" r="2.5" fill="var(--color-accent)" />
        <circle cx="62" cy="32" r="2.5" fill="var(--color-accent)" />
        <circle cx="74" cy="32" r="2.5" fill="var(--color-accent)" />
        <circle cx="68" cy="36" r="2.5" fill="var(--color-accent)" />
      </svg>
    )
  },
  {
    name: 'TV',
    label: 'Smart Televisions',
    count: '280+ items',
    icon: Tv,
    color: 'from-blue-500 to-cyan-500',
    description: '4K Ultra HD TVs, OLED displays, and smart entertainment boxes with cinema sound integrations.',
    illustration: (
      <svg className="w-full h-full opacity-80 transition-transform duration-500 group-hover:scale-105" viewBox="0 0 100 60" fill="none">
        <rect x="10" y="8" width="80" height="42" rx="3" fill="currentColor" className="text-surface" stroke="var(--color-border)" strokeWidth="1.5" />
        <rect x="13" y="11" width="74" height="36" rx="1" fill="var(--color-background)" />
        <path d="M 42 50 L 58 50 L 54 55 L 46 55 Z" fill="currentColor" className="text-text-secondary/20" stroke="var(--color-border)" strokeWidth="1" />
        {/* Glow center */}
        <circle cx="50" cy="29" r="8" fill="var(--color-primary)" opacity="0.15" className="animate-pulse" />
      </svg>
    )
  },
  {
    name: 'Tablet',
    label: 'Tablets & iPads',
    count: '410+ items',
    icon: Tablet,
    color: 'from-emerald-500 to-teal-500',
    description: 'Versatile drawing pads, note-taking tablets, and powerful iPads for creators and students.',
    illustration: (
      <svg className="w-full h-full opacity-80 transition-transform duration-500 group-hover:scale-105" viewBox="0 0 100 60" fill="none">
        <rect x="20" y="8" width="60" height="44" rx="4" fill="currentColor" className="text-surface" stroke="var(--color-border)" strokeWidth="1.5" />
        <rect x="23" y="11" width="54" height="38" rx="2" fill="var(--color-background)" />
        <circle cx="75" cy="30" r="1" fill="currentColor" className="text-text-secondary" />
        {/* Diagonal glowing beam */}
        <line x1="28" y1="40" x2="72" y2="15" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      </svg>
    )
  },
  {
    name: 'Audio',
    label: 'Audio & Headphones',
    count: '650+ items',
    icon: Headphones,
    color: 'from-violet-500 to-purple-500',
    description: 'Wireless earbuds, noise-canceling headphones, and high-fidelity home Bluetooth speaker systems.',
    illustration: (
      <svg className="w-full h-full opacity-80 transition-transform duration-500 group-hover:scale-105" viewBox="0 0 100 60" fill="none">
        <path d="M 25 35 C 25 15, 75 15, 75 35" stroke="var(--color-border)" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 25 35 C 25 15, 75 15, 75 35" stroke="var(--color-primary)" strokeWidth="1.5" strokeDasharray="1,1" strokeLinecap="round" fill="none" opacity="0.6" />
        <rect x="20" y="32" width="10" height="15" rx="3" fill="currentColor" className="text-surface" stroke="var(--color-border)" strokeWidth="1" />
        <rect x="70" y="32" width="10" height="15" rx="3" fill="currentColor" className="text-surface" stroke="var(--color-border)" strokeWidth="1" />
        {/* Audio waves */}
        <path d="M 12 39 C 14 36, 14 44, 12 41" stroke="var(--color-primary)" strokeWidth="1" strokeLinecap="round" />
        <path d="M 88 39 C 86 36, 86 44, 88 41" stroke="var(--color-primary)" strokeWidth="1" strokeLinecap="round" />
      </svg>
    )
  }
];

const LogoIcon = () => (
  <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-tr from-primary to-accent text-white shadow-lg overflow-hidden shrink-0">
    <Radar className="w-5.5 h-5.5 animate-pulse" />
    <div className="absolute inset-0 border border-white/20 rounded-xl" />
  </div>
);

export default function CategoriesPage({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans transition-colors duration-300 relative pb-20 select-none">
      
      {/* DECORATIVE GLOW BACKGROUNDS */}
      <div className="absolute top-0 inset-x-0 h-192 grid-overlay pointer-events-none z-0" />
      <div className="absolute top-24 left-[5%] w-96 h-96 radial-glow rounded-full pointer-events-none z-0" />
      <div className="absolute top-48 right-[5%] w-96 h-96 radial-glow rounded-full pointer-events-none z-0" />

      {/* HEADER NAVBAR */}
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
            <button onClick={() => navigate('/categories')} className="text-sm font-extrabold text-primary hover:text-primary transition-colors cursor-pointer bg-transparent border-none">Categories</button>
            <button onClick={() => navigate('/deals')} className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer bg-transparent border-none">Deals</button>
          </nav>

          {/* Interactive features */}
          <div className="flex items-center space-x-3.5">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-all duration-200 cursor-pointer bg-transparent border-none"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-all duration-200 cursor-pointer bg-transparent border-none"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden glass border absolute left-0 right-0 py-4 px-6 animate-slide-down shadow-xl flex flex-col space-y-2 rounded-3xl mt-2">
            <button onClick={() => { setMobileMenuOpen(false); navigate('/'); }} className="text-left font-semibold text-text-secondary hover:text-primary transition-colors h-11 flex items-center w-full bg-transparent border-none cursor-pointer">Home</button>
            <button onClick={() => { setMobileMenuOpen(false); navigate('/categories'); }} className="text-left font-semibold text-primary transition-colors h-11 flex items-center w-full bg-transparent border-none cursor-pointer">Categories</button>
            <button onClick={() => { setMobileMenuOpen(false); navigate('/deals'); }} className="text-left font-semibold text-text-secondary hover:text-primary transition-colors h-11 flex items-center w-full bg-transparent border-none cursor-pointer">Deals</button>
          </div>
        )}
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10">
        
        {/* TITLE & SEARCH SECTION */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">PriceRadar Categories</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Browse Egypt's <span className="font-serif italic bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Top Markets</span>
          </h1>
          <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto">
            Scan across retail price lists, analyze historical logs, and track AI recommendations on today's popular categories.
          </p>

          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-md mx-auto pt-4 flex items-center bg-card glass border border-border rounded-2xl shadow-sm p-1">
            <div className="pl-3 pr-1.5 text-text-secondary">
              <Search className="w-4.5 h-4.5" />
            </div>
            <input 
              type="text" 
              placeholder="Search category keywords..." 
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-transparent border-none outline-none py-2.5 text-xs font-bold text-text-primary placeholder-muted"
            />
            <button 
              type="submit" 
              className="bg-primary hover:bg-primary-hover text-white rounded-xl px-5 py-3 text-xs font-bold shadow transition-all cursor-pointer border-none"
            >
              Search
            </button>
          </form>
        </div>

        {/* CATEGORY CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {CATEGORIES_DATA.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div 
                key={cat.name}
                onClick={() => navigate(`/search?c=${encodeURIComponent(cat.name)}`)}
                className="group bg-card border border-border rounded-3xl overflow-hidden hover-lift shadow-sm hover:shadow-xl transition-all duration-300 hover:border-primary/50 cursor-pointer flex flex-col justify-between"
              >
                {/* Illustration Frame */}
                <div className="h-44 bg-surface/50 border-b border-border/40 relative flex items-center justify-center p-6 overflow-hidden">
                  <div className="w-full h-full max-w-[180px] max-h-[120px]">
                    {cat.illustration}
                  </div>
                  {/* Decorative glowing gradient sphere */}
                  <div className={`absolute -bottom-10 -right-10 w-24 h-24 bg-linear-to-tr ${cat.color} opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500`} />
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <span className={`p-2.5 bg-linear-to-tr ${cat.color} text-white rounded-xl shadow-md shrink-0`}>
                          <IconComponent className="w-4.5 h-4.5" />
                        </span>
                        <h3 className="font-extrabold text-base text-text-primary tracking-tight">{cat.label}</h3>
                      </div>
                      <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {cat.count}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed font-medium">
                      {cat.description}
                    </p>
                  </div>

                  {/* Navigation tag action */}
                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-primary group-hover:text-primary-hover border-t border-border/30">
                    <span>Explore Products</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </main>

    </div>
  );
}
