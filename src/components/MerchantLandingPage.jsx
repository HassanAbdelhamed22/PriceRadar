import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radar,
  Sun,
  Moon,
  Menu,
  X,
  ArrowRight,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  Star,
  Clock,
  ChevronRight,
  Link as LinkIcon,
  Globe,
  Eye,
  Users,
  Zap,
  Check,
  ChevronDown,
  ChevronUp,
  Percent,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   HELPERS & SUBCOMPONENTS
   ───────────────────────────────────────────────────────────── */
const LogoIcon = () => (
  <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-tr from-primary to-accent text-white shadow-lg overflow-hidden shrink-0">
    <Radar className="w-5.5 h-5.5 animate-pulse" />
    <div className="absolute inset-0 border border-white/20 rounded-xl" />
    <div className="absolute inset-0 bg-white/20 animate-ping opacity-25 rounded-xl scale-75" />
  </div>
);

export default function MerchantLandingPage({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const pricingRef = useRef(null);

  // ── States ────────────────────────────────────────────────
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);
  
  // Waitlist / Demo Modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('free'); // 'free', 'demo', 'pro', 'business', 'campaign'
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistName, setWaitlistName] = useState('');
  const [waitlistStore, setWaitlistStore] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistLoading, setWaitlistLoading] = useState(false);

  // Campaign Calculator State
  const [campaignPlacement, setCampaignPlacement] = useState('search'); // 'search', 'deals', 'recommended', 'trending'
  const [campaignDuration, setCampaignDuration] = useState('7'); // '7', '30', 'seasonal'

  // Dashboard Demo Interaction States
  const [demoSelectedProduct, setDemoSelectedProduct] = useState('iphone16');
  const [demoYourPrice, setDemoYourPrice] = useState({ iphone16: 62000, macbook: 79000 });
  const [demoAlertApplied, setDemoAlertApplied] = useState({ iphone16: false, macbook: false });
  const [scanLogs, setScanLogs] = useState([
    { id: 1, time: '09:41:02', text: 'Initializing AI catalog crawler...', type: 'info' },
    { id: 2, time: '09:41:04', text: 'Scanning Noon & Amazon Egypt for matching SKUs...', type: 'info' },
    { id: 3, time: '09:41:07', text: 'Catalog scan complete. 2 products tracked.', type: 'success' },
  ]);

  // Collapsible accordion FAQ list
  const FAQ_ITEMS = [
    {
      q: 'How does PriceRadar scan my products?',
      a: 'We scan your website automatically using our intelligent web crawler, or you can supply standard XML, CSV, or JSON product feeds. Our indexing engine is designed to check price lists with zero impact on your store\'s loading speed or performance.',
    },
    {
      q: 'Do I need developer support to connect my store?',
      a: 'No technical background is required! The integration process is designed for simplicity. For standard installations, simply enter your store\'s homepage URL. For popular systems like Shopify, WooCommerce, or Magento, we offer automated product feeds that can be connected in under 5 minutes.',
    },
    {
      q: 'How often is competitor pricing updated?',
      a: 'Competitor pricing is updated daily on the Free tier, every 30 minutes on the Pro tier, and in real time on our Enterprise plan. Real-time updates ensure you stay ahead and capture high-intent buyers instantly.',
    },
    {
      q: 'Will my store\'s confidential analytics be visible to shoppers?',
      a: 'Absolutely not. PriceRadar only crawls and monitors public price lists and inventory levels available on your website. Your internal inventory counts, client statistics, feed configuration credentials, and billing data are fully encrypted and private.',
    },
  ];

  // Dynamic log generator to make dashboard preview feel "live"
  useEffect(() => {
    const texts = [
      'Scanning Amazon EG for iPhone 16 Pro price changes...',
      'Detected new price on noon: EGP 61,500 (was EGP 62,500)',
      'AI Recommendation: Adjust Price to EGP 61,400 to win Buy Box',
      'Scanning Raya Shop for MacBook Air listings...',
      'Verified competitor stocks: B.Tech stocks are stable',
      'AI Analysis complete: Retailer margins healthy (+14%)',
    ];
    const types = ['info', 'warning', 'success', 'info', 'success', 'success'];

    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * texts.length);
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setScanLogs(prev => [
        ...prev.slice(-4), // keep last 5 logs
        { id: Date.now(), time: timeStr, text: texts[randomIdx], type: types[randomIdx] }
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // ── Handlers ──────────────────────────────────────────────
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenModal = (type) => {
    setModalType(type);
    setShowModal(true);
    setWaitlistSubmitted(false);
    setWaitlistEmail('');
    setWaitlistName('');
    setWaitlistStore('');
  };

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    if (!waitlistEmail || !waitlistName || !waitlistStore) return;
    setWaitlistLoading(true);
    setTimeout(() => {
      setWaitlistLoading(false);
      setWaitlistSubmitted(true);
    }, 1200);
  };

  const handleApplyPriceMatch = (productKey, targetPrice) => {
    setDemoYourPrice(prev => ({
      ...prev,
      [productKey]: targetPrice
    }));
    setDemoAlertApplied(prev => ({
      ...prev,
      [productKey]: true
    }));
    
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setScanLogs(prev => [
      ...prev,
      { 
        id: Date.now(), 
        time: timeStr, 
        text: `Price matched to EGP ${targetPrice.toLocaleString()} for ${productKey === 'iphone16' ? 'iPhone 16 Pro' : 'MacBook Air M3'}!`, 
        type: 'success' 
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans transition-colors duration-300 relative selection:bg-primary/20 selection:text-primary">
      
      {/* DECORATIVE BACKGROUNDS */}
      <div className="absolute top-0 inset-x-0 h-256 grid-overlay pointer-events-none z-0" />
      <div className="absolute top-24 left-[10%] w-140 h-140 radial-glow rounded-full pointer-events-none z-0 animate-float" />
      <div className="absolute top-64 right-[10%] w-160 h-160 radial-glow rounded-full pointer-events-none z-0 animate-float-delayed" />

      {/* ── STICKY NAVBAR ───────────────────────────────── */}
      <header className="sticky top-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-7xl glass rounded-full border transition-all duration-300 shadow-md">
        <div className="px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center space-x-2.5 group cursor-pointer bg-transparent border-none">
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
            <button onClick={() => navigate('/merchant')} className="text-sm font-extrabold text-primary hover:text-primary transition-colors cursor-pointer bg-transparent border-none">For Retailers</button>
          </nav>

          <div className="flex items-center space-x-3.5">
            <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-all duration-200 cursor-pointer bg-transparent border-none">
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            <button onClick={() => navigate('/merchant/login')} className="hidden sm:inline-flex text-xs font-bold text-text-primary hover:text-primary transition-colors cursor-pointer bg-transparent border-none px-2.5">
              Login
            </button>
            <button onClick={() => navigate('/merchant/login')} className="hidden sm:inline-flex py-2 px-5 bg-text-primary text-background hover:opacity-90 font-bold text-xs rounded-full shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
              Start Free
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle navigation menu" className="md:hidden p-2 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-all duration-200 cursor-pointer bg-transparent border-none">
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden glass border-b absolute left-0 right-0 py-4 px-6 animate-slide-down shadow-xl flex flex-col space-y-4 rounded-3xl mt-2 border">
            <button onClick={() => { setMobileMenuOpen(false); navigate('/'); }} className="text-left text-base font-semibold text-text-secondary hover:text-primary transition-colors py-1 bg-transparent border-none cursor-pointer">Home</button>
            <button onClick={() => { setMobileMenuOpen(false); navigate('/categories'); }} className="text-left text-base font-semibold text-text-secondary hover:text-primary transition-colors py-1 bg-transparent border-none cursor-pointer">Categories</button>
            <button onClick={() => { setMobileMenuOpen(false); navigate('/deals'); }} className="text-left text-base font-semibold text-text-secondary hover:text-primary transition-colors py-1 bg-transparent border-none cursor-pointer">Deals</button>
            <button onClick={() => { setMobileMenuOpen(false); navigate('/merchant'); }} className="text-left text-base font-semibold text-primary transition-colors py-1 bg-transparent border-none cursor-pointer">For Retailers</button>
          </div>
        )}
      </header>

      {/* ── HERO SECTION ──────────────────────────────────── */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-visible z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-7 text-left flex flex-col items-start">
            <div className="inline-flex items-center space-x-2 py-1.5 px-3 rounded-full border border-border bg-card/65 shadow-sm text-xs font-semibold text-text-secondary hover:border-primary transition-all duration-300">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-text-primary font-bold">PriceRadar Business Hub</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-text-primary">
              Grow Your Online <br />
              Business <span className="font-serif italic bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">with AI</span>
            </h1>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-normal">
              Connect your online store and let PriceRadar automatically monitor prices, analyze competitors and help increase sales.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => navigate('/merchant/login')}
                className="py-3.5 px-7 bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold text-sm rounded-full flex items-center space-x-2 shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all btn-gradient-shimmer cursor-pointer"
              >
                <span>Start Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => navigate('/merchant/login')}
                className="py-3.5 px-7 bg-card hover:bg-surface border border-border text-text-primary font-bold text-sm rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                View Demo
              </button>
            </div>
          </div>

          {/* Right Mockup Dashboard Panel Column */}
          <div className="lg:col-span-6">
            <div className="relative bg-card glass border border-border rounded-3xl p-5 sm:p-6 shadow-2xl overflow-hidden w-full">
              
              {/* Dashboard Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <div className="flex items-center space-x-2.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500/80" />
                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80" />
                  <div className="w-3.5 h-3.5 rounded-full bg-green-500/80" />
                  <span className="text-xs font-bold text-text-secondary pl-2 font-mono">priceradar-merchant-v1.0</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full border border-success/20 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
                  <span>Live Tracking Active</span>
                </div>
              </div>

              {/* Mini Stats Banner */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 my-4">
                <div className="bg-surface/50 border border-border p-3 rounded-2xl text-left">
                  <span className="text-[10px] font-bold text-muted uppercase">Products</span>
                  <p className="text-lg font-black text-text-primary mt-0.5">342</p>
                </div>
                <div className="bg-surface/50 border border-border p-3 rounded-2xl text-left">
                  <span className="text-[10px] font-bold text-muted uppercase">Best Deals (#1)</span>
                  <p className="text-lg font-black text-success mt-0.5">188</p>
                </div>
                <div className="bg-surface/50 border border-border p-3 rounded-2xl text-left">
                  <span className="text-[10px] font-bold text-muted uppercase">Opportunity</span>
                  <p className="text-lg font-black text-primary mt-0.5">12</p>
                </div>
              </div>

              {/* Demo Interactive Area */}
              <div className="space-y-4">
                {/* Product Select Tabs */}
                <div className="flex space-x-2 border-b border-border/40 pb-2">
                  <button 
                    onClick={() => setDemoSelectedProduct('iphone16')}
                    className={`py-1 px-3 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      demoSelectedProduct === 'iphone16' 
                        ? 'bg-primary text-white' 
                        : 'text-text-secondary hover:bg-surface'
                    }`}
                  >
                    iPhone 16 Pro
                  </button>
                  <button 
                    onClick={() => setDemoSelectedProduct('macbook')}
                    className={`py-1 px-3 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      demoSelectedProduct === 'macbook' 
                        ? 'bg-primary text-white' 
                        : 'text-text-secondary hover:bg-surface'
                    }`}
                  >
                    MacBook Air M3
                  </button>
                </div>

                {demoSelectedProduct === 'iphone16' ? (
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between items-center bg-surface/30 p-3 rounded-2xl border border-border">
                      <div>
                        <span className="text-[10px] font-bold text-muted uppercase">Your Price</span>
                        <p className="text-sm font-black text-text-primary">EGP {demoYourPrice.iphone16.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-muted uppercase">Lowest Competitor</span>
                        <p className="text-sm font-black text-accent">EGP 61,500 (Noon)</p>
                      </div>
                    </div>

                    {/* AI Recommendation Banner */}
                    <div className={`p-3 rounded-2xl border flex items-start gap-2.5 transition-all duration-300 ${
                      demoAlertApplied.iphone16 
                        ? 'bg-success/5 border-success/20 text-success' 
                        : 'bg-warning/5 border-warning/20 text-warning'
                    }`}>
                      <Zap className="w-5 h-5 text-current shrink-0 mt-0.5" />
                      <div className="grow">
                        <p className="font-bold text-[10px] uppercase tracking-wider text-muted">AI Pricing Verdict</p>
                        <p className="font-medium text-xs mt-0.5 text-text-primary">
                          {demoAlertApplied.iphone16 
                            ? 'Matched! You now have the lowest price badge on PriceRadar and are ranked #1.' 
                            : 'Noon is undercutting you by EGP 500. Match price to secure the #1 Best Deal badge.'}
                        </p>
                        {!demoAlertApplied.iphone16 && (
                          <button 
                            onClick={() => handleApplyPriceMatch('iphone16', 61400)}
                            className="mt-2 text-[10px] font-bold bg-primary text-white py-1 px-3.5 rounded-lg shadow-sm hover:opacity-90 cursor-pointer"
                          >
                            Match price to EGP 61,400
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between items-center bg-surface/30 p-3 rounded-2xl border border-border">
                      <div>
                        <span className="text-[10px] font-bold text-muted uppercase">Your Price</span>
                        <p className="text-sm font-black text-text-primary">EGP {demoYourPrice.macbook.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-muted uppercase">Lowest Competitor</span>
                        <p className="text-sm font-black text-success">EGP 82,000 (Amazon)</p>
                      </div>
                    </div>

                    <div className={`p-3 rounded-2xl border flex items-start gap-2.5 transition-all duration-300 ${
                      demoAlertApplied.macbook 
                        ? 'bg-success/5 border-success/20 text-success' 
                        : 'bg-primary/5 border-primary/20 text-primary'
                    }`}>
                      <Zap className="w-5 h-5 text-current shrink-0 mt-0.5" />
                      <div className="grow">
                        <p className="font-bold text-[10px] uppercase tracking-wider text-muted">AI Pricing Verdict</p>
                        <p className="font-medium text-xs mt-0.5 text-text-primary">
                          {demoAlertApplied.macbook 
                            ? 'Adjusted! Safe margin maintained at EGP 81,900.'
                            : 'You are EGP 3,000 cheaper than Amazon. Suggest rising to EGP 81,900 to gain 4% extra margin while keeping #1 spot.'}
                        </p>
                        {!demoAlertApplied.macbook && (
                          <button 
                            onClick={() => handleApplyPriceMatch('macbook', 81900)}
                            className="mt-2 text-[10px] font-bold bg-primary text-white py-1 px-3.5 rounded-lg shadow-sm hover:opacity-90 cursor-pointer"
                          >
                            Optimize price to EGP 81,900
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Console scan activity logs */}
              <div className="mt-4 pt-4 border-t border-border/60">
                <p className="text-[10px] font-extrabold text-muted text-left uppercase tracking-wider mb-2">Live Store Activity Console</p>
                <div className="bg-surface/90 border border-border/80 rounded-xl p-3 font-mono text-[10px] text-left space-y-1.5 max-h-32 overflow-y-auto select-none">
                  {scanLogs.map(log => (
                    <div key={log.id} className="flex gap-2 items-start">
                      <span className="text-muted shrink-0">[{log.time}]</span>
                      <span className={
                        log.type === 'success' ? 'text-success' :
                        log.type === 'warning' ? 'text-warning' : 'text-text-primary'
                      }>
                        {log.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── BENEFITS SECTION ────────────────────────────────── */}
      <section className="relative py-20 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/40">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Benefits</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Why Retailers Partner with PriceRadar
          </h2>
          <p className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
            PriceRadar helps electronics retailers stay competitive by automatically monitoring market prices, analyzing competitors, and providing AI-powered recommendations—all from one intuitive dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Automatic Product Detection */}
          <div className="bg-card glass border border-border rounded-3xl p-6 hover-lift shadow-sm text-left relative overflow-hidden transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <Radar className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-text-primary mb-3">Automatic Product Detection</h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Connect your online store, and PriceRadar AI automatically detects your products and matches them with similar listings across major Egyptian retailers. No manual product uploads required.
            </p>
          </div>

          {/* Card 2: AI Pricing Insights */}
          <div className="bg-card glass border border-border rounded-3xl p-6 hover-lift shadow-sm text-left relative overflow-hidden transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-text-primary mb-3">AI Pricing Insights</h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Receive intelligent pricing recommendations based on competitor prices and historical market trends. Discover opportunities to stay competitive while protecting your profit margins.
            </p>
          </div>

          {/* Card 3: Competitor Monitoring */}
          <div className="bg-card glass border border-border rounded-3xl p-6 hover-lift shadow-sm text-left relative overflow-hidden transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success mb-6">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-text-primary mb-3">Competitor Monitoring</h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Track prices across Amazon Egypt, Noon, Jumia, B.Tech, Raya, and other supported retailers. Monitor competitor pricing, product availability, and market movements in one place.
            </p>
          </div>

          {/* Card 4: Featured Listings */}
          <div className="bg-card glass border border-border rounded-3xl p-6 hover-lift shadow-sm text-left relative overflow-hidden transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-6">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-text-primary mb-3">Featured Listings</h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Increase your product visibility by promoting selected products. Featured products appear higher in search results, homepage deals, and recommendation sections, helping attract more potential customers.
            </p>
          </div>

          {/* Card 5: Advanced Analytics */}
          <div className="bg-card glass border border-border rounded-3xl p-6 hover-lift shadow-sm text-left relative overflow-hidden transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6">
              <Percent className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-text-primary mb-3">Advanced Analytics</h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Monitor product performance with easy-to-understand dashboards. Track product views, clicks, visibility trends, and overall store performance to make better business decisions.
            </p>
          </div>

          {/* Card 6: Increase Your Visibility */}
          <div className="bg-card glass border border-border rounded-3xl p-6 hover-lift shadow-sm text-left relative overflow-hidden transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-text-primary mb-3">Increase Your Visibility</h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Reach shoppers who are actively comparing prices before making a purchase. Improve your visibility, attract more qualified traffic, and convert more visitors into customers.
            </p>
          </div>

        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section className="relative py-20 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/40">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Process Flow</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            How PriceRadar Works for Retailers
          </h2>
          <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
            Getting started takes just a few steps.
          </p>
        </div>

        {/* Timeline Desktop/Mobile */}
        <div className="relative">
          
          {/* Connector Line Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-4 right-4 h-0.5 bg-border -translate-y-6 z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4 group">
              <div className="w-12 h-12 rounded-full bg-primary text-white font-extrabold flex items-center justify-center shadow-lg relative group-hover:scale-110 transition-transform duration-300">
                1
                <div className="absolute inset-0 bg-primary/20 animate-ping opacity-25 rounded-full scale-125" />
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-base text-text-primary">1. Connect Your Store</h4>
                <p className="text-xs text-text-secondary max-w-xs leading-relaxed">
                  Enter your website URL to connect your online store to PriceRadar.
                </p>
              </div>
              <div className="lg:hidden text-muted text-sm py-1">↓</div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4 group">
              <div className="w-12 h-12 rounded-full bg-primary text-white font-extrabold flex items-center justify-center shadow-lg relative group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-base text-text-primary">2. AI Scans Your Store</h4>
                <p className="text-xs text-text-secondary max-w-xs leading-relaxed">
                  Our AI analyzes your website, detects supported product categories, and begins indexing your catalog.
                </p>
              </div>
              <div className="lg:hidden text-muted text-sm py-1">↓</div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4 group">
              <div className="w-12 h-12 rounded-full bg-primary text-white font-extrabold flex items-center justify-center shadow-lg relative group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-base text-text-primary">3. Products Are Detected</h4>
                <p className="text-xs text-text-secondary max-w-xs leading-relaxed">
                  Products are automatically identified and matched with similar products across supported retailers.
                </p>
              </div>
              <div className="lg:hidden text-muted text-sm py-1">↓</div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center space-y-4 group">
              <div className="w-12 h-12 rounded-full bg-primary text-white font-extrabold flex items-center justify-center shadow-lg relative group-hover:scale-110 transition-transform duration-300">
                4
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-base text-text-primary">4. AI Generates Insights</h4>
                <p className="text-xs text-text-secondary max-w-xs leading-relaxed">
                  PriceRadar compares market prices, identifies trends, and provides pricing recommendations and competitor insights.
                </p>
              </div>
              <div className="lg:hidden text-muted text-sm py-1">↓</div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col items-center text-center space-y-4 group">
              <div className="w-12 h-12 rounded-full bg-linear-to-tr from-primary to-accent text-white font-extrabold flex items-center justify-center shadow-lg relative group-hover:scale-110 transition-transform duration-300">
                5
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-base text-text-primary">5. Grow Your Sales</h4>
                <p className="text-xs text-text-secondary max-w-xs leading-relaxed">
                  Use AI recommendations, analytics, and featured listings to improve product visibility and attract more customers.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────── */}
      <section className="relative py-20 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/40">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Trusted by Egypt's Top E-commerce Retailers
          </h2>
          <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto">
            Here is what online store owners in Cairo and Giza say about using PriceRadar Business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Testimonial 1 */}
          <div className="bg-card glass border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between text-left hover-lift transition-all">
            <div className="space-y-4">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed italic">
                "Integrating PriceRadar boosted our conversion rate by 24%. We no longer manually check noon and Amazon five times a day. The platform updates competitor lists on the fly."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-sm text-primary">TM</div>
              <div>
                <h4 className="text-xs font-extrabold text-text-primary">Tarek M.</h4>
                <p className="text-[10px] text-muted font-medium">E-commerce Director, Cairo Tech Store</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-card glass border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between text-left hover-lift transition-all">
            <div className="space-y-4">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed italic">
                "The AI pricing recommendations are gold. We discovered we were pricing our Smart TVs 5% too low relative to Noon EG and successfully captured higher margins while keeping our #1 spot."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-bold text-sm text-accent">MA</div>
              <div>
                <h4 className="text-xs font-extrabold text-text-primary">Mariam A.</h4>
                <p className="text-[10px] text-muted font-medium">Co-founder, ElectroEG</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-card glass border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between text-left hover-lift transition-all">
            <div className="space-y-4">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed italic">
                "Being featured on PriceRadar brought a flood of high-intent buyers directly to our checkout. The return on investment is undeniable. Easiest setup we\'ve ever completed."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center font-bold text-sm text-purple-500">AS</div>
              <div>
                <h4 className="text-xs font-extrabold text-text-primary">Ahmed S.</h4>
                <p className="text-[10px] text-muted font-medium">Sales Manager, Giza Gadgets</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── PRICING PREVIEW ─────────────────────────────────── */}
      <section ref={pricingRef} className="relative py-20 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/40">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">B2B Plans</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Flexible Merchant Plans
          </h2>
          <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
            Choose the right subscription level to automate your store catalog crawling and access competitive analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Plan 1: Free Merchant */}
          <div className="bg-card glass border border-border rounded-3xl p-8 flex flex-col justify-between hover-lift shadow-sm text-left relative overflow-hidden transition-all duration-300">
            <div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Free Merchant</span>
                <p className="text-3xl font-black text-text-primary">
                  EGP 0 <span className="text-xs font-semibold text-muted">/ month</span>
                </p>
                <p className="text-xs text-text-secondary pt-2">Perfect for trying the platform and testing indexing features.</p>
              </div>

              <hr className="border-border/60 my-6" />

              <div className="space-y-4">
                <div>
                  <span className="text-[9px] font-bold text-primary uppercase tracking-wider block">Limits</span>
                  <ul className="space-y-1.5 text-xs text-text-secondary font-semibold mt-1">
                    <li>· 1 Website integration</li>
                    <li>· 1 Category tracked</li>
                    <li>· Up to 50 Products listed</li>
                  </ul>
                </div>

                <div>
                  <span className="text-[9px] font-bold text-muted uppercase tracking-wider block">Included Features</span>
                  <ul className="space-y-2 text-xs font-semibold text-text-secondary mt-1.5">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>AI Product Detection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>Weekly Sync</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>Basic Analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>Basic Dashboard</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>Product Visibility Score</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>Basic AI Pricing Insights</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>Competitor Price Monitoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>Store Health Score</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleOpenModal('free')}
              className="mt-8 w-full py-3 bg-surface hover:bg-border text-text-primary font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer text-center"
            >
              Start Free
            </button>
          </div>

          {/* Plan 2: Pro Merchant */}
          <div className="bg-card glass border-2 border-primary rounded-3xl p-8 flex flex-col justify-between hover-lift shadow-lg text-left relative overflow-hidden transition-all duration-300">
            {/* Promo label banner */}
            <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-black py-1 px-4 rounded-bl-xl uppercase tracking-widest">
              Most Popular
            </div>

            <div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Pro Merchant ⭐</span>
                <p className="text-3xl font-black text-text-primary">
                  EGP 999 <span className="text-xs font-semibold text-muted">/ month</span>
                </p>
                <p className="text-xs text-text-secondary pt-2">Our highlighted plan. Built for growing professional sellers.</p>
              </div>

              <hr className="border-border/60 my-6" />

              <div className="space-y-4">
                <div>
                  <span className="text-[9px] font-bold text-primary uppercase tracking-wider block">Limits</span>
                  <ul className="space-y-1.5 text-xs text-text-primary font-semibold mt-1">
                    <li>· 1 Website integration</li>
                    <li>· Unlimited Categories</li>
                    <li>· Unlimited Products listed</li>
                    <li>· Daily Synchronization</li>
                  </ul>
                </div>

                <div>
                  <span className="text-[9px] font-bold text-muted uppercase tracking-wider block">Included Features</span>
                  <ul className="space-y-2 text-xs font-semibold text-text-secondary mt-1.5">
                    <li className="flex items-center gap-2 text-text-primary font-bold">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>Everything in Free</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>Advanced Analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>AI Pricing Insights</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>Competitor Monitoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>Price Trend Reports</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>Featured Listings ads support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>Homepage Deals placement</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>Recommended Products modules</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>Email Reports alerts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>Priority Indexing scans</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>Store Performance Reports</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>Product Visibility Reports</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleOpenModal('pro')}
              className="mt-8 w-full py-3 bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-md hover:scale-[1.02] transition-all btn-gradient-shimmer cursor-pointer text-center animate-pulse"
            >
              Start 14-Day Free Trial
            </button>
          </div>

          {/* Plan 3: Business */}
          <div className="bg-card glass border border-border rounded-3xl p-8 flex flex-col justify-between hover-lift shadow-sm text-left relative overflow-hidden transition-all duration-300">
            <div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Business</span>
                <p className="text-3xl font-black text-text-primary">
                  EGP 2,999 <span className="text-xs font-semibold text-muted">/ month</span>
                </p>
                <p className="text-xs text-text-secondary pt-2">For large retailers and multi-brand operators needing full sync.</p>
              </div>

              <hr className="border-border/60 my-6" />

              <div className="space-y-4">
                <div>
                  <span className="text-[9px] font-bold text-primary uppercase tracking-wider block">Limits</span>
                  <ul className="space-y-1.5 text-xs text-text-secondary font-semibold mt-1">
                    <li>· Multiple Websites integration</li>
                    <li>· Unlimited Categories</li>
                    <li>· Unlimited Products listed</li>
                    <li>· Real-time Synchronization</li>
                  </ul>
                </div>

                <div>
                  <span className="text-[9px] font-bold text-muted uppercase tracking-wider block">Included Features</span>
                  <ul className="space-y-2 text-xs font-semibold text-text-secondary mt-1.5">
                    <li className="flex items-center gap-2 text-text-primary font-bold">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>Everything in Pro</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>API Access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>Custom Reports</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>Advanced AI Forecasting</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>Team Members seats</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>Dedicated Support channel</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>Custom Integrations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>Priority Feature Requests</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleOpenModal('business')}
              className="mt-8 w-full py-3 bg-surface hover:bg-border text-text-primary font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer text-center"
            >
              Contact Sales
            </button>
          </div>

        </div>
      </section>

      {/* ── FEATURED LISTINGS (SEPARATE REVENUE) ────────────────── */}
      <section className="relative py-20 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/40">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">On-Demand Ads</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Featured Listings Ads
          </h2>
          <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
            Promote specific products separately from subscriptions, similar to Google Ads, to capture more buyer attention.
          </p>
        </div>

        <div className="bg-card glass border border-border rounded-3xl p-6 sm:p-10 shadow-xl max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Options Panel */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div>
                <label className="text-[10px] font-black uppercase text-muted tracking-wider">1. Select Placement Spot</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
                  {[
                    { id: 'search', label: 'Top Search Results', desc: 'Promoted at the top of search listings' },
                    { id: 'deals', label: 'Homepage Deals', desc: 'Featured in homepage deals spotlight carousel' },
                    { id: 'recommended', label: 'Recommended Products', desc: 'Shown on competitor product detail pages' },
                    { id: 'trending', label: 'Trending Products', desc: 'Displayed in organic trending feeds' }
                  ].map(spot => (
                    <button
                      key={spot.id}
                      onClick={() => setCampaignPlacement(spot.id)}
                      className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                        campaignPlacement === spot.id
                          ? 'border-primary bg-primary/5 text-text-primary'
                          : 'border-border bg-surface/30 hover:border-border text-text-secondary'
                      }`}
                    >
                      <span className="font-extrabold text-xs block">{spot.label}</span>
                      <span className="text-[9px] text-muted leading-tight block mt-1">{spot.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-muted tracking-wider">2. Choose Campaign Duration</label>
                <div className="grid grid-cols-3 gap-2.5 mt-2">
                  {[
                    { id: '7', label: '7 Days', bonus: 'Starter Trial' },
                    { id: '30', label: '30 Days', bonus: 'Save 15%' },
                    { id: 'seasonal', label: 'Seasonal Campaign', bonus: 'Best Value' }
                  ].map(dur => (
                    <button
                      key={dur.id}
                      onClick={() => setCampaignDuration(dur.id)}
                      className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer text-center ${
                        campaignDuration === dur.id
                          ? 'border-primary bg-primary/5 text-text-primary'
                          : 'border-border bg-surface/30 hover:border-border text-text-secondary'
                      }`}
                    >
                      <span className="font-black text-xs block">{dur.label}</span>
                      <span className="text-[9px] text-primary font-bold block mt-0.5">{dur.bonus}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Campaign Summary & Price Display */}
            <div className="lg:col-span-5 bg-surface/50 border border-border p-6 rounded-3xl space-y-5 text-left relative overflow-hidden flex flex-col justify-between h-full">
              <div className="space-y-4">
                <span className="text-[9px] font-black bg-primary text-white py-0.5 px-2.5 rounded-full uppercase tracking-wider inline-block">Campaign Details</span>
                
                <div>
                  <h4 className="font-extrabold text-sm text-text-primary">
                    {campaignPlacement === 'search' && 'Top Search Results Placement'}
                    {campaignPlacement === 'deals' && 'Homepage Deals Spotlight'}
                    {campaignPlacement === 'recommended' && 'Competitor Recommendations'}
                    {campaignPlacement === 'trending' && 'Trending Products Placement'}
                  </h4>
                  <p className="text-[10px] text-muted mt-1 leading-relaxed">
                    {campaignPlacement === 'search' && 'Capture buyer intent directly when shoppers search for related terms.'}
                    {campaignPlacement === 'deals' && 'Display discounts on the primary deals widget visible to all traffic.'}
                    {campaignPlacement === 'recommended' && 'Undercut competitors on their page details alternatives lists.'}
                    {campaignPlacement === 'trending' && 'Expose products under the high-growth trending widgets.'}
                  </p>
                </div>

                <div className="border-t border-border/60 pt-4 flex justify-between items-baseline">
                  <div>
                    <span className="text-[10px] font-bold text-muted uppercase">Duration</span>
                    <p className="font-extrabold text-xs text-text-primary mt-0.5">
                      {campaignDuration === '7' && '7 Days Slot'}
                      {campaignDuration === '30' && '30 Days Slot'}
                      {campaignDuration === 'seasonal' && 'Seasonal (90 Days)'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-muted uppercase">Estimated Reach</span>
                    <p className="font-extrabold text-xs text-success mt-0.5">
                      {campaignDuration === '7' && '~15,000+ views'}
                      {campaignDuration === '30' && '~80,000+ views'}
                      {campaignDuration === 'seasonal' && '~350,000+ views'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border/60 pt-4">
                  <span className="text-[10px] font-bold text-muted uppercase block">Estimated Campaign Budget</span>
                  <span className="text-3xl font-black text-text-primary mt-1 inline-block">
                    EGP {
                      campaignDuration === '7' ? (campaignPlacement === 'deals' ? 599 : campaignPlacement === 'search' ? 499 : campaignPlacement === 'trending' ? 449 : 399) :
                      campaignDuration === '30' ? (campaignPlacement === 'deals' ? 1999 : campaignPlacement === 'search' ? 1699 : campaignPlacement === 'trending' ? 1499 : 1399) :
                      (campaignPlacement === 'deals' ? 4999 : campaignPlacement === 'search' ? 4199 : campaignPlacement === 'trending' ? 3799 : 3499)
                    }
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleOpenModal('campaign')}
                className="w-full mt-4 py-3 bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all btn-gradient-shimmer cursor-pointer text-center"
              >
                Launch Ad Campaign
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ────────────────────────────────────── */}
      <section className="relative py-20 z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/40">
        <div className="text-center space-y-4 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">FAQ</span>
          <h2 className="text-3xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = faqOpenIndex === idx;
            return (
              <div 
                key={idx} 
                className="bg-card glass border border-border rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button 
                  onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-sm sm:text-base text-text-primary hover:bg-surface/30 cursor-pointer bg-transparent border-none"
                >
                  <span>{item.q}</span>
                  {isOpen ? <ChevronUp className="w-4.5 h-4.5 text-primary shrink-0" /> : <ChevronDown className="w-4.5 h-4.5 text-text-secondary shrink-0" />}
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-border/30 bg-surface/10">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="bg-footer border-t border-border/80 pt-16 pb-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12">
            <div className="col-span-12 md:col-span-6 space-y-5">
              <button onClick={() => navigate('/')} className="flex items-center space-x-2.5 bg-transparent border-none cursor-pointer">
                <LogoIcon />
                <span className="font-extrabold text-lg tracking-tight text-text-primary">PriceRadar EG</span>
              </button>
              <p className="text-xs text-text-secondary max-w-sm leading-relaxed font-medium text-left">
                An advanced AI-powered price analysis engine for smart shoppers and e-commerce merchants in Egypt. Track competitor listings and optimize sales.
              </p>
            </div>

            <div className="col-span-6 md:col-span-3 space-y-4 text-left">
              <h4 className="font-extrabold text-xs text-text-primary uppercase tracking-wider">Shopper Pages</h4>
              <ul className="space-y-2.5 text-xs font-semibold">
                <li><button onClick={() => navigate('/')} className="text-text-secondary hover:text-primary transition-colors text-left bg-transparent border-none cursor-pointer">Search Homepage</button></li>
                <li><button onClick={() => navigate('/categories')} className="text-text-secondary hover:text-primary transition-colors text-left bg-transparent border-none cursor-pointer">Product Categories</button></li>
                <li><button onClick={() => navigate('/deals')} className="text-text-secondary hover:text-primary transition-colors text-left bg-transparent border-none cursor-pointer">Top Saving Deals</button></li>
              </ul>
            </div>

            <div className="col-span-6 md:col-span-3 space-y-4 text-left">
              <h4 className="font-extrabold text-xs text-text-primary uppercase tracking-wider">Retailer Portal</h4>
              <ul className="space-y-2.5 text-xs font-semibold">
                <li><button onClick={() => scrollToSection(pricingRef)} className="text-text-secondary hover:text-primary transition-colors text-left bg-transparent border-none cursor-pointer">Pricing Tiers</button></li>
                <li><button onClick={() => handleOpenModal('demo')} className="text-text-secondary hover:text-primary transition-colors text-left bg-transparent border-none cursor-pointer">View Interactive Demo</button></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted font-medium">
            <p>© {new Date().getFullYear()} PriceRadar Egypt. Retailer dashboard experience.</p>
          </div>
        </div>
      </footer>

      {/* ── WAITLIST / DEMO MODAL ───────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Modal Background Blur Overlay */}
          <div onClick={() => setShowModal(false)} className="absolute inset-0 bg-background/70 backdrop-blur-md transition-opacity duration-300" />
          
          <div className="relative bg-card glass border border-border rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-surface text-text-secondary hover:text-primary transition-colors cursor-pointer bg-transparent border-none"
            >
              <X className="w-5 h-5" />
            </button>

            {waitlistSubmitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-success/20 text-success mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-text-primary">You're on the Waitlist!</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-sm mx-auto">
                  Thanks for expressing interest. We will contact you at <strong className="text-text-primary">{waitlistEmail}</strong> as soon as your store account is ready for setup.
                </p>
                <button 
                  onClick={() => setShowModal(false)}
                  className="mt-4 px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  Got it
                </button>
              </div>
            ) : (
              <div className="space-y-5 text-left">
                <div className="space-y-1">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-text-primary">
                    {modalType === 'demo' && 'Request Retailer Demo'}
                    {modalType === 'free' && 'Get Started (Free Merchant)'}
                    {modalType === 'pro' && 'Subscribe to Pro Merchant'}
                    {modalType === 'business' && 'Subscribe to Business Plan'}
                    {modalType === 'campaign' && 'Book Featured Listing Campaign'}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {modalType === 'campaign' 
                      ? 'Select your target spots and budgets. Register below to book your ad slots.'
                      : 'PriceRadar Business Portal is currently onboarding a select group of online stores. Reserve your spot today.'}
                  </p>
                </div>

                <form onSubmit={handleWaitlistSubmit} className="space-y-4 pt-1">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-muted tracking-wider">Your Full Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Ahmed Ali"
                      value={waitlistName}
                      onChange={e => setWaitlistName(e.target.value)}
                      className="w-full py-2.5 px-4 bg-surface border border-border text-text-primary placeholder-muted rounded-xl text-xs outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-muted tracking-wider">Store Domain URL</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. mystore.com"
                      value={waitlistStore}
                      onChange={e => setWaitlistStore(e.target.value)}
                      className="w-full py-2.5 px-4 bg-surface border border-border text-text-primary placeholder-muted rounded-xl text-xs outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-muted tracking-wider">Business Email Address</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="name@store.com"
                      value={waitlistEmail}
                      onChange={e => setWaitlistEmail(e.target.value)}
                      className="w-full py-2.5 px-4 bg-surface border border-border text-text-primary placeholder-muted rounded-xl text-xs outline-none focus:border-primary"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={waitlistLoading}
                    className="w-full mt-2 py-3 bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 btn-gradient-shimmer cursor-pointer flex justify-center items-center"
                  >
                    {waitlistLoading ? 'Submitting...' : 'Register Business Spot'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
