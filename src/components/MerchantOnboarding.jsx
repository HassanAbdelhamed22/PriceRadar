import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Radar, Sun, Moon, ArrowLeft, Building2, Globe, Tag, 
  Check, Loader2, Sparkles, AlertCircle, BarChart3, Database 
} from 'lucide-react';

export default function MerchantOnboarding({ theme, toggleTheme }) {
  const navigate = useNavigate();

  // Form inputs
  const [storeName, setStoreName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [category, setCategory] = useState('Phones');

  // Connection Simulator States
  const [isConnecting, setIsConnecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Simulation steps details
  const steps = [
    { label: 'Pinging Store Host', desc: 'Verifying server response and SSL certificate...' },
    { label: 'Crawl Catalog Layout', desc: 'Parsing HTML maps and detecting SKU links...' },
    { label: 'AI Match Analysis', desc: 'Comparing product tags with Amazon, Noon, & Jumia Egypt databases...' },
    { label: 'Indexing Database', desc: 'Saving pricing logs and caching retailer results...' }
  ];

  // Simulating connection logs and progress bar
  useEffect(() => {
    if (!isConnecting) return;

    let timer;
    let logTimer;
    
    // Progress interval
    timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsCompleted(true);
          return 100;
        }
        return prev + 1;
      });
    }, 80);

    // Dynamic log generator during crawling
    let logCount = 0;
    const logPool = [
      { step: 0, text: 'Resolving domain IP address...', type: 'info' },
      { step: 0, text: 'Host responded in 124ms. HTTPS connection secure.', type: 'success' },
      { step: 1, text: 'Starting PriceRadar crawler v3.2 bot...', type: 'info' },
      { step: 1, text: 'Scanning /robots.txt to verify crawler permissions...', type: 'info' },
      { step: 1, text: 'Crawling site map directories... Found 4 categories list pages.', type: 'info' },
      { step: 1, text: 'Indexing store item cards. 342 active items detected.', type: 'success' },
      { step: 2, text: 'Comparing product SKUs against Egyptian price databases...', type: 'info' },
      { step: 2, text: 'Resolving competitor products in Egypt market...', type: 'info' },
      { step: 2, text: 'Matched 294 items against Amazon Egypt listings.', type: 'success' },
      { step: 2, text: 'Matched 281 items against Noon Egypt listings.', type: 'success' },
      { step: 2, text: '188 competitor undercutting price indicators resolved.', type: 'warning' },
      { step: 3, text: 'Creating retail client price feeds database schema...', type: 'info' },
      { step: 3, text: 'Generating initial store optimization pricing report...', type: 'success' },
      { step: 3, text: 'All 342 products successfully indexed onto PriceRadar!', type: 'success' }
    ];

    logTimer = setInterval(() => {
      if (logCount < logPool.length) {
        const nextLog = logPool[logCount];
        setLogs(prev => [...prev, {
          id: Date.now() + logCount,
          time: new Date().toTimeString().split(' ')[0],
          text: nextLog.text,
          type: nextLog.type
        }]);
        
        // Advance current step based on log index
        if (logCount === 2) setCurrentStep(1);
        if (logCount === 6) setCurrentStep(2);
        if (logCount === 11) setCurrentStep(3);

        logCount++;
      } else {
        clearInterval(logTimer);
      }
    }, 600);

    return () => {
      clearInterval(timer);
      clearInterval(logTimer);
    };
  }, [isConnecting]);

  const handleConnectSubmit = (e) => {
    e.preventDefault();
    if (!storeName || !websiteUrl) return;
    setIsConnecting(true);
    setProgress(0);
    setCurrentStep(0);
    setLogs([{
      id: 1,
      time: new Date().toTimeString().split(' ')[0],
      text: `Initializing AI catalog scan for "${storeName}"...`,
      type: 'info'
    }]);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* DECORATIVE BACKGROUNDS */}
      <div className="absolute top-0 inset-x-0 h-full grid-overlay pointer-events-none z-0" />
      <div className="absolute top-24 left-[10%] w-96 h-96 radial-glow rounded-full pointer-events-none z-0 animate-float" />
      <div className="absolute bottom-24 right-[10%] w-96 h-96 radial-glow rounded-full pointer-events-none z-0 animate-float-delayed" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between z-10 relative">
        <button 
          onClick={() => navigate('/merchant')} 
          className="flex items-center space-x-2 bg-transparent border-none cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-linear-to-tr from-primary to-accent text-white shadow-lg shrink-0">
            <Radar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-text-primary">PriceRadar Retailer</span>
        </button>

        <button 
          onClick={toggleTheme} 
          aria-label="Toggle theme" 
          className="p-2 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-all duration-200 cursor-pointer bg-transparent border-none"
        >
          {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
        </button>
      </header>

      {/* Onboarding Box */}
      <main className="flex-1 flex items-center justify-center p-4 z-10 relative">
        
        {/* VIEW 1: Input Setup Form */}
        {!isConnecting && !isCompleted && (
          <div className="w-full max-w-lg bg-card glass border border-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="space-y-2 text-left">
              <button 
                onClick={() => navigate('/merchant/login')}
                className="flex items-center gap-1 text-[10px] font-bold text-muted hover:text-primary tracking-widest uppercase bg-transparent border-none cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </button>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight pt-2">Connect Your Store</h2>
              <p className="text-xs sm:text-sm text-text-secondary">
                Point PriceRadar AI to your catalog dashboard. We will detect your products automatically.
              </p>
            </div>

            <form onSubmit={handleConnectSubmit} className="space-y-4">
              
              {/* Store Name Field */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black uppercase text-muted tracking-wider">Store Name</label>
                <div 
                  className="flex items-center w-full bg-surface border border-border rounded-xl focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all pr-4"
                  style={{ paddingLeft: '1rem' }}
                >
                  <span className="text-muted flex items-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </span>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Raya Shop, B.Tech Online"
                    value={storeName}
                    onChange={e => setStoreName(e.target.value)}
                    className="w-full py-3 px-3 bg-transparent text-text-primary placeholder-muted text-xs outline-none font-semibold transition-all"
                  />
                </div>
              </div>

              {/* Website URL Field */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black uppercase text-muted tracking-wider">Website URL</label>
                <div 
                  className="flex items-center w-full bg-surface border border-border rounded-xl focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all pr-4"
                  style={{ paddingLeft: '1rem' }}
                >
                  <span className="text-muted flex items-center shrink-0">
                    <Globe className="w-4 h-4" />
                  </span>
                  <input 
                    type="url" 
                    required 
                    placeholder="https://mystore.com"
                    value={websiteUrl}
                    onChange={e => setWebsiteUrl(e.target.value)}
                    className="w-full py-3 px-3 bg-transparent text-text-primary placeholder-muted text-xs outline-none font-semibold transition-all font-mono"
                  />
                </div>
              </div>

              {/* Dropdown Category */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black uppercase text-muted tracking-wider">Primary Business Category</label>
                <div 
                  className="flex items-center w-full bg-surface border border-border rounded-xl focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all pr-4 relative"
                  style={{ paddingLeft: '1rem' }}
                >
                  <span className="text-muted flex items-center shrink-0">
                    <Tag className="w-4 h-4" />
                  </span>
                  <select 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full py-3 px-3 bg-transparent text-text-primary rounded-xl text-xs outline-none font-semibold appearance-none cursor-pointer relative z-10"
                  >
                    <option value="Phones">Phones</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Gaming">Gaming</option>
                    <option value="TVs">TVs</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full mt-6 py-3.5 bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex justify-center items-center gap-2 btn-gradient-shimmer"
              >
                <span>Connect Store</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </form>

          </div>
        )}

        {/* VIEW 2: Beautiful Progress Simulator */}
        {isConnecting && !isCompleted && (
          <div className="w-full max-w-2xl bg-card glass border border-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                <h3 className="text-xl font-extrabold text-text-primary">Connecting Your Store...</h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Please wait while PriceRadar bots ping your store domain and extract your catalog tags.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-black">
                <span className="text-primary uppercase tracking-widest text-[9px]">Analyzing data feeds</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-border rounded-full h-2.5 overflow-hidden relative">
                <div 
                  className="bg-linear-to-r from-orange-500 to-amber-500 h-full transition-all duration-100 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 border-t border-b border-border/50 py-5">
              {steps.map((st, idx) => {
                const isActive = idx === currentStep;
                const isPassed = idx < currentStep;
                return (
                  <div key={idx} className={`space-y-1 transition-opacity ${isActive ? 'opacity-100' : isPassed ? 'opacity-80' : 'opacity-40'}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isPassed ? 'bg-success text-white' : isActive ? 'bg-primary text-white animate-pulse' : 'bg-surface border border-border text-muted'
                      }`}>
                        {isPassed ? <Check className="w-3 h-3" /> : idx + 1}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider">{st.label}</span>
                    </div>
                    <p className="text-[9px] text-text-secondary leading-tight pl-7">{st.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Simulated Live Activity Log console */}
            <div className="space-y-2">
              <span className="text-[9px] font-black uppercase text-muted tracking-widest block">Live Indexing Log Console</span>
              <div className="bg-background border border-border p-4 rounded-2xl h-44 overflow-y-auto font-mono text-[10px] space-y-1.5 scrollbar-thin">
                {logs.map((lg) => (
                  <div key={lg.id} className="flex gap-2 leading-relaxed">
                    <span className="text-muted shrink-0">[{lg.time}]</span>
                    <span className={
                      lg.type === 'success' ? 'text-success' :
                      lg.type === 'warning' ? 'text-warning' : 'text-text-primary'
                    }>
                      {lg.type === 'success' && '✓ '}
                      {lg.type === 'warning' && '⚠ '}
                      {lg.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* VIEW 3: Onboarding Success Details */}
        {isCompleted && (
          <div className="w-full max-w-lg bg-card glass border border-border rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
            
            <div className="w-16 h-16 rounded-full bg-success/20 text-success mx-auto flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Store Connected Successfully!</h2>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-md mx-auto">
                PriceRadar crawler has mapped your website structures. Shoppers can now view your prices live!
              </p>
            </div>

            {/* Indexing Metrics Box */}
            <div className="grid grid-cols-2 gap-4 bg-surface border border-border p-5 rounded-2xl text-left">
              <div className="space-y-1 flex items-start gap-2.5">
                <Database className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] font-black uppercase text-muted tracking-wider block">Products Detected</span>
                  <strong className="text-xl font-black text-text-primary">342 products</strong>
                  <p className="text-[9px] text-muted leading-tight mt-0.5">Categorized in {category}.</p>
                </div>
              </div>

              <div className="space-y-1 flex items-start gap-2.5 border-l border-border/60 pl-4">
                <BarChart3 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] font-black uppercase text-muted tracking-wider block">Cheapest Matches</span>
                  <strong className="text-xl font-black text-success">188 listings</strong>
                  <p className="text-[9px] text-muted leading-tight mt-0.5">Identified pricing match opportunities.</p>
                </div>
              </div>
            </div>

            {/* Prototype Next Steps helper */}
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl text-left flex gap-3">
              <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase text-primary tracking-widest block">Dashboard Prototype Note</span>
                <p className="text-[10px] text-text-secondary leading-relaxed">
                  You are viewing the login and connection prototype. The retailer dashboard UI is currently in development.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                onClick={() => {
                  alert("Dashboard prototype complete! Directing back to the Retailer Home.");
                  navigate('/merchant');
                }}
                className="flex-1 py-3.5 bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex justify-center items-center gap-1.5"
              >
                <span>Go to Dashboard (Prototype)</span>
              </button>
              <button 
                onClick={() => navigate('/merchant')}
                className="py-3.5 px-6 bg-card hover:bg-surface border border-border text-text-primary font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Retailer Home
              </button>
            </div>

          </div>
        )}

      </main>

      <footer className="py-6 text-center text-xs text-muted font-medium z-10 relative">
        <p>© {new Date().getFullYear()} PriceRadar Egypt. Onboarding scanning system.</p>
      </footer>
    </div>
  );
}
