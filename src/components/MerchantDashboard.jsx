import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Radar, Sun, Moon, LogOut, CheckCircle2, AlertCircle, XCircle, 
  RotateCw, RefreshCw, Eye, EyeOff, Star, ShieldAlert, BarChart3, 
  Layers, Package, TrendingUp, DollarSign, Globe, ShoppingBag, 
  Sparkles, ChevronRight, TrendingDown, Lock, ArrowRight, ArrowUp,
  MessageSquare, Play, Sparkle, Send
} from 'lucide-react';

// Mock detected products dataset
const INITIAL_PRODUCTS = [
  { id: 1, name: 'iPhone 16 Pro Max 256GB', category: 'Phones', price: 69900, stock: 'In Stock', count: 42, visibility: 98, status: 'Listed', isFeatured: true },
  { id: 2, name: 'MacBook Air M3 13-inch 16GB', category: 'Laptops', price: 74500, stock: 'In Stock', count: 18, visibility: 94, status: 'Listed', isFeatured: false },
  { id: 3, name: 'PlayStation 5 Slim Digital', category: 'Gaming', price: 27900, stock: 'Low Stock', count: 4, visibility: 88, status: 'Listed', isFeatured: true },
  { id: 4, name: 'Samsung 65" Neo QLED 4K Smart TV', category: 'TVs', price: 42000, stock: 'Out of Stock', count: 0, visibility: 72, status: 'Listed', isFeatured: false },
  { id: 5, name: 'Apple AirPods Pro Gen 2 USB-C', category: 'Accessories', price: 11900, stock: 'In Stock', count: 112, visibility: 95, status: 'Listed', isFeatured: false },
  { id: 6, name: 'Xbox Series X Console 1TB', category: 'Gaming', price: 29900, stock: 'Low Stock', count: 3, visibility: 85, status: 'Listed', isFeatured: false },
  { id: 7, name: 'Dell XPS 15 9530 Core i9', category: 'Laptops', price: 95000, stock: 'In Stock', count: 12, visibility: 91, status: 'Listed', isFeatured: true }
];

export default function MerchantDashboard({ theme, toggleTheme }) {
  const navigate = useNavigate();

  // Active View Tab State - Starts directly with the AI Copilot
  const [activeTab, setActiveTab] = useState('copilot'); // 'copilot', 'dashboard', 'analytics', 'billing'

  // Connected Website State
  const [websiteStatus, setWebsiteStatus] = useState('Connected'); 
  const [lastSyncTime, setLastSyncTime] = useState('15 mins ago');
  const [isSyncing, setIsSyncing] = useState(false);

  // Products Table States
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [toast, setToast] = useState('');

  // Subscription States
  const [currentPlan, setCurrentPlan] = useState('Free'); 
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeStep, setUpgradeStep] = useState(0); 

  // Feature Listing Modal States
  const [selectedFeatureProduct, setSelectedFeatureProduct] = useState(null);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [featureStep, setFeatureStep] = useState(0); 

  // On-Demand Campaign Creator States
  const [selectedPlacement, setSelectedPlacement] = useState('search'); 
  const [selectedDuration, setSelectedDuration] = useState('7'); 
  const [campaignProductId, setCampaignProductId] = useState(1);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaignStep, setCampaignStep] = useState(0); 

  // AI Copilot Conversation States
  const chatEndRef = useRef(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [activeRecType, setActiveRecType] = useState('sales'); // 'sales', 'undercut', 'stock', 'none'
  const [recApplied, setRecApplied] = useState({ sales: false, undercut: false, stock: false });
  const [isApplyingRec, setIsApplyingRec] = useState(false);
  const [recProgressStep, setRecProgressStep] = useState(0); // 0: Idle, 1: Stage 1, 2: Stage 2, 3: Success

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hello! I am your PriceRadar Merchant AI Copilot. I analyze Amazon Egypt, Noon, Jumia, and B.Tech catalog data in real time to optimize your pricing, profit margins, and organic reach in Cairo. How can I help you optimize your sales this week?"
    }
  ]);

  // Scroll to bottom of chat logs
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatLoading]);

  // Inventory Overview Aggregations
  const totalProductsCount = products.length;
  const inStockCount = products.filter(p => p.stock === 'In Stock').length;
  const lowStockCount = products.filter(p => p.stock === 'Low Stock').length;
  const outOfStockCount = products.filter(p => p.stock === 'Out of Stock').length;

  // On-Demand Ads Pricing Matrix
  const pricingMatrix = {
    search: { '7': 499, '30': 1699, seasonal: 3499, title: 'Top Search Results Placement', desc: 'Capture buyer intent directly when shoppers search for related terms.' },
    deals: { '7': 399, '30': 1399, seasonal: 2899, title: 'Homepage Deals Spotlight', desc: 'Feature your pricing advantages directly on the shopper landing homepage.' },
    recs: { '7': 299, '30': 1099, seasonal: 2299, title: 'Recommended Competitor Placement', desc: 'Infiltrate competitor listings pages to highlight your discount offers.' },
    trends: { '7': 349, '30': 1199, seasonal: 2499, title: 'Trending Products Carousel', desc: 'Get spotlighted inside Egypt trending search categories.' }
  };

  const getCampaignViews = (duration) => {
    if (duration === '7') return '~15,000+ views';
    if (duration === '30') return '~75,000+ views';
    return '~150,000+ views';
  };

  // Actions
  const handleSyncNow = () => {
    if (websiteStatus === 'Disconnected') {
      showToast('Cannot sync. Website is disconnected.');
      return;
    }
    setIsSyncing(true);
    setWebsiteStatus('Syncing');
    showToast('Catalog sync in progress...');
    
    setTimeout(() => {
      setIsSyncing(false);
      setWebsiteStatus('Connected');
      setLastSyncTime('Just now');
      showToast('All 342 products synced successfully!');
    }, 2000);
  };

  const handleDisconnect = () => {
    if (websiteStatus === 'Disconnected') {
      setWebsiteStatus('Connected');
      setLastSyncTime('Just now');
      showToast('Website store reconnected!');
    } else {
      setWebsiteStatus('Disconnected');
      showToast('Store website disconnected from PriceRadar.');
    }
  };

  const handleToggleStatus = (id) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'Listed' ? 'Hidden' : 'Listed';
        showToast(`"${p.name}" is now ${nextStatus.toLowerCase()}`);
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  const handleToggleFeature = (product) => {
    if (product.isFeatured) {
      setProducts(prev => prev.map(p => {
        if (p.id === product.id) {
          showToast(`Removed featured status from "${p.name}"`);
          return { ...p, isFeatured: false };
        }
        return p;
      }));
    } else {
      setSelectedFeatureProduct(product);
      setShowFeatureModal(true);
      setFeatureStep(0);
    }
  };

  // Plan Subscription upgrade animation workflow
  const triggerPlanUpgrade = () => {
    setUpgradeStep(1); 
    setTimeout(() => setUpgradeStep(2), 1500);
    setTimeout(() => setUpgradeStep(3), 3000);
    setTimeout(() => {
      setCurrentPlan('Pro');
      setShowUpgradeModal(false);
      showToast('Successfully upgraded to Pro Merchant!');
    }, 4500);
  };

  // Product Feature list promotion animation workflow
  const triggerFeatureUpgrade = () => {
    setFeatureStep(1); 
    setTimeout(() => setFeatureStep(2), 1500);
    setTimeout(() => setFeatureStep(3), 3000);
    setTimeout(() => {
      setProducts(prev => prev.map(p => 
        p.id === selectedFeatureProduct.id ? { ...p, isFeatured: true, visibility: Math.min(p.visibility + 5, 99) } : p
      ));
      setShowFeatureModal(false);
      showToast(`"${selectedFeatureProduct.name}" is now Featured!`);
    }, 4500);
  };

  // On-Demand Ad Campaign Launch animation workflow
  const triggerLaunchCampaign = () => {
    setShowCampaignModal(true);
    setCampaignStep(1); 
    setTimeout(() => setCampaignStep(2), 1500);
    setTimeout(() => setCampaignStep(3), 3000);
    setTimeout(() => {
      setProducts(prev => prev.map(p => 
        p.id === Number(campaignProductId) ? { ...p, isFeatured: true, visibility: Math.min(p.visibility + 8, 99) } : p
      ));
      setShowCampaignModal(false);
      const prodName = products.find(p => p.id === Number(campaignProductId))?.name || 'Product';
      showToast(`Ad campaign launched successfully for "${prodName}"!`);
    }, 4500);
  };

  // AI Copilot prompt chips triggers
  const triggerCopilotQuery = (queryType) => {
    if (chatLoading) return;
    
    let userText = "";
    let botResponse = {};
    
    if (queryType === 'sales') {
      userText = "How can I increase my sales this week?";
      botResponse = {
        id: messages.length + 2,
        sender: 'assistant',
        text: "I have calculated 5 pricing and inventory matching improvements to boost sales volume:\n\n• Lower your MacBook Air M3 price by 3% (EGP 2,235) to match Noon's current discount.\n• Feature your Xbox Series X Console 1TB to gain organic search spotlight.\n• Promote Gaming Laptops category items—Cairo search trends are up 22% this week.\n• Investigate Samsung 65\" Smart TV details; current visibility index is low (72%).\n• Amazon Egypt reduced prices on 5 competing electronics listings this morning.",
        type: 'sales'
      };
      setActiveRecType('sales');
    } else if (queryType === 'undercut') {
      userText = "Which products are facing undercutting?";
      botResponse = {
        id: messages.length + 2,
        sender: 'assistant',
        text: "I matched 2 products where local Egyptian competitors are undercutting your catalog prices:\n\n• PlayStation 5 Slim: B.Tech is listing at EGP 27,500 (EGP 400 cheaper than you).\n• Samsung 65\" TV: Raya is offering EGP 41,200 (EGP 800 cheaper than you).\n\nMatch their offers below to capture buyer attention.",
        type: 'undercut'
      };
      setActiveRecType('undercut');
    } else if (queryType === 'stock') {
      userText = "How is my inventory stock holding up?";
      botResponse = {
        id: messages.length + 2,
        sender: 'assistant',
        text: "Your overall stock index is stable, but 2 items have low inventory alerts:\n\n• PlayStation 5 Slim: Only 4 units remaining.\n• Xbox Series X: Only 3 units remaining.\n\nVisitor traffic has spiked 40% today. I recommend increasing margins temporarily by EGP 150 on these items while restocking to protect profits.",
        type: 'stock'
      };
      setActiveRecType('stock');
    }

    setMessages(prev => [...prev, { id: messages.length + 1, sender: 'user', text: userText }]);
    setChatLoading(true);

    setTimeout(() => {
      setChatLoading(false);
      setMessages(prev => [...prev, botResponse]);
    }, 1200);
  };

  // Chat custom text submit input
  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customPrompt.trim() || chatLoading) return;

    const userText = customPrompt;
    setMessages(prev => [...prev, { id: messages.length + 1, sender: 'user', text: userText }]);
    setCustomPrompt('');
    setChatLoading(true);

    setTimeout(() => {
      setChatLoading(false);
      setMessages(prev => [...prev, {
        id: messages.length + 2,
        sender: 'assistant',
        text: `I've analyzed your store catalog for "${userText}". To execute matching optimization workflows, click on one of the recommended preset diagnostic tags below.`
      }]);
    }, 1500);
  };

  // Apply Recommendations action handler
  const handleApplyRecommendations = () => {
    if (recApplied[activeRecType]) {
      showToast('Recommendation already applied!');
      return;
    }

    setIsApplyingRec(true);
    setRecProgressStep(1); // "Establishing Ad Bid..." or similar loading stages

    setTimeout(() => {
      setRecProgressStep(2); // "Syncing AI pricing drops..."
    }, 1500);

    setTimeout(() => {
      setRecProgressStep(3); // "Success!"
    }, 3000);

    setTimeout(() => {
      setIsApplyingRec(false);
      setRecProgressStep(0);
      setRecApplied(prev => ({ ...prev, [activeRecType]: true }));

      // Actually mutate catalog state products
      if (activeRecType === 'sales') {
        setProducts(prev => prev.map(p => {
          if (p.id === 2) {
            // Lower MacBook Air price by 3% (approx EGP 2,235)
            return { ...p, price: 72265, visibility: 99 };
          }
          if (p.id === 6) {
            // Feature Xbox Series X
            return { ...p, isFeatured: true, visibility: 95 };
          }
          return p;
        }));
        showToast('MacBook Air price reduced to EGP 72,265! Xbox featured.');
      } else if (activeRecType === 'undercut') {
        setProducts(prev => prev.map(p => {
          if (p.id === 3) {
            // PS5 Slim matches competitors at EGP 27,450
            return { ...p, price: 27450, visibility: 96 };
          }
          if (p.id === 4) {
            // Samsung TV matches Raya at EGP 41,000
            return { ...p, price: 41000, visibility: 85 };
          }
          return p;
        }));
        showToast('Matched competitor rates on PlayStation 5 & Samsung Smart TV!');
      } else if (activeRecType === 'stock') {
        setProducts(prev => prev.map(p => {
          if (p.id === 3 || p.id === 6) {
            // Apply EGP 150 margin premium on PS5 & Xbox
            return { ...p, price: p.price + 150 };
          }
          return p;
        }));
        showToast('Applied EGP 150 pricing margin premium on low stock products.');
      }

      // Add success response in chat log
      setMessages(prev => [...prev, {
        id: messages.length + 1,
        sender: 'assistant',
        text: `✓ Applied recommendations successfully! Store products list adjusted and catalog search tags synced on Egypt shopper results. Check out the updated listings inside the "Dashboard" tab.`
      }]);

    }, 4500);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Background decorations */}
      <div className="absolute top-0 inset-x-0 h-full grid-overlay pointer-events-none z-0" />
      <div className="absolute top-24 left-[10%] w-96 h-96 radial-glow rounded-full pointer-events-none z-0 animate-float" />
      <div className="absolute bottom-24 right-[10%] w-96 h-96 radial-glow rounded-full pointer-events-none z-0 animate-float-delayed" />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-card glass border border-primary/30 py-3 px-5 rounded-2xl shadow-2xl animate-slide-down flex items-center gap-2">
          <Sparkles className="w-4.5 h-4.5 text-primary animate-pulse" />
          <span className="text-xs font-bold text-text-primary">{toast}</span>
        </div>
      )}

      {/* Sidebar Navigation Column */}
      <aside className="w-64 border-r border-border bg-card/45 backdrop-blur-md hidden lg:flex flex-col justify-between p-6 z-10 select-none">
        <div className="space-y-8">
          
          {/* Logo brand */}
          <div className="flex items-center space-x-2.5">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-linear-to-tr from-primary to-accent text-white shadow-lg overflow-hidden shrink-0">
              <Radar className="w-5 h-5 animate-pulse" />
            </div>
            <span className="font-extrabold text-sm tracking-tight">PriceRadar Retail</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-left">
            <span className="text-[9px] font-black uppercase text-muted tracking-widest pl-3 block mb-2">Workspace</span>
            {[
              { id: 'copilot', label: 'AI Copilot 🧠', icon: Sparkles },
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'analytics', label: 'AI Analytics', icon: Layers },
              { id: 'billing', label: 'Subscriptions', icon: DollarSign },
              { id: 'feed', label: 'Products Feed', icon: Package, disabled: true },
              { id: 'settings', label: 'Sync Settings', icon: Globe, disabled: true }
            ].map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button 
                  key={link.id}
                  disabled={link.disabled}
                  onClick={() => setActiveTab(link.id)}
                  className={`w-full py-3 px-4 rounded-xl flex items-center justify-between text-xs font-bold transition-all cursor-pointer bg-transparent border-none disabled:opacity-50 ${
                    isActive 
                      ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                      : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <link.icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.disabled && (
                    <span className="bg-surface border border-border text-muted text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase">
                      Lock
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info logout */}
        <button 
          onClick={() => navigate('/merchant')}
          className="w-full py-3 px-4 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 flex items-center gap-2.5 transition-all cursor-pointer bg-transparent border-none text-left"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Logout Portal</span>
        </button>
      </aside>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto z-10 relative">
        
        {/* Top Header Bar */}
        <header className="border-b border-border bg-card/40 backdrop-blur-md py-4 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="text-left">
            <h1 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
              <span>
                {activeTab === 'copilot' && 'Merchant AI Copilot 🧠'}
                {activeTab === 'dashboard' && 'Retailer Dashboard'}
                {activeTab === 'analytics' && 'AI Analytics Report'}
                {activeTab === 'billing' && 'Billing & Plans'}
              </span>
              <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full uppercase tracking-wider">Active</span>
            </h1>
            <p className="text-[11px] text-text-secondary mt-0.5 hidden sm:block">
              {activeTab === 'copilot' && 'Optimize listings and catalog prices using real-time competitive scans.'}
              {activeTab === 'dashboard' && 'Welcome back. Monitoring pricing matching indexes in Egypt.'}
              {activeTab === 'analytics' && 'Deep AI metrics insights and competitor price recommendations.'}
              {activeTab === 'billing' && 'Manage your retailer subscription level and listing promotion slots.'}
            </p>
          </div>

          <div className="flex items-center gap-3.5">
            <button 
              onClick={toggleTheme} 
              aria-label="Toggle theme" 
              className="p-2 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-all duration-200 cursor-pointer bg-transparent border-none"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            
            {/* Mobile Tab Selector */}
            <div className="lg:hidden flex bg-surface p-1 rounded-xl border border-border">
              <button 
                onClick={() => setActiveTab('copilot')}
                className={`py-1 px-2 rounded-lg text-[9px] font-extrabold cursor-pointer border-none bg-transparent ${activeTab === 'copilot' ? 'bg-card text-primary shadow-xs' : 'text-text-secondary'}`}
              >
                AI
              </button>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`py-1 px-2 rounded-lg text-[9px] font-extrabold cursor-pointer border-none bg-transparent ${activeTab === 'dashboard' ? 'bg-card text-primary shadow-xs' : 'text-text-secondary'}`}
              >
                Dash
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`py-1 px-2 rounded-lg text-[9px] font-extrabold cursor-pointer border-none bg-transparent ${activeTab === 'analytics' ? 'bg-card text-primary shadow-xs' : 'text-text-secondary'}`}
              >
                Stats
              </button>
              <button 
                onClick={() => setActiveTab('billing')}
                className={`py-1 px-2 rounded-lg text-[9px] font-extrabold cursor-pointer border-none bg-transparent ${activeTab === 'billing' ? 'bg-card text-primary shadow-xs' : 'text-text-secondary'}`}
              >
                Plans
              </button>
            </div>

            {/* Mobile LogOut icon */}
            <button 
              onClick={() => navigate('/merchant')}
              aria-label="Logout"
              className="p-2 rounded-full hover:bg-red-500/10 text-text-secondary hover:text-red-500 transition-all duration-200 cursor-pointer bg-transparent border-none lg:hidden"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </header>

        {/* Dashboard Grid Workspace */}
        <main className="p-6 sm:p-8 space-y-8 flex-1 max-w-7xl w-full mx-auto">

          {activeTab === 'copilot' && (
            /* ── MERCHANT AI COPILOT VIEW ────────────────────────── */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-workflow-appear">
              
              {/* Left Column: Interactive Chat Interface */}
              <div className="lg:col-span-7 bg-card glass border border-border rounded-3xl p-5 sm:p-6 shadow-md flex flex-col justify-between h-[650px] relative">
                
                <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-4 select-none">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Radar className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-extrabold text-sm text-text-primary">🧠 Merchant AI</h3>
                      <p className="text-[9px] text-success font-bold flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-success inline-block animate-ping" />
                        <span>Real-Time Market Analytics</span>
                      </p>
                    </div>
                  </div>
                  
                  <span className="text-[9px] font-black uppercase text-muted bg-surface/80 border border-border py-1 px-3 rounded-full">
                    PriceRadar GPT v4
                  </span>
                </div>

                {/* Messages log */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                  {messages.map((msg) => {
                    const isAssistant = msg.sender === 'assistant';
                    return (
                      <div 
                        key={msg.id}
                        className={`flex gap-3 text-left ${isAssistant ? 'justify-start' : 'justify-end'}`}
                      >
                        {isAssistant && (
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                            <Sparkle className="w-4 h-4 text-primary" />
                          </div>
                        )}
                        
                        <div className={`rounded-2xl p-4 text-xs leading-relaxed max-w-[85%] relative ${
                          isAssistant 
                            ? 'bg-surface/50 border border-border/80 text-text-primary' 
                            : 'bg-primary text-white font-semibold'
                        }`}>
                          {/* Formatting bot bullets correctly with line breaks */}
                          {msg.text.split('\n').map((line, i) => (
                            <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
                              {line}
                            </p>
                          ))}

                          {/* Action Apply recommendations attached directly to the message if it's the current suggestion */}
                          {isAssistant && msg.type && activeRecType === msg.type && (
                            <div className="mt-5 border-t border-border/50 pt-4 flex items-center gap-3">
                              <button
                                onClick={handleApplyRecommendations}
                                disabled={recApplied[msg.type]}
                                className={`py-2 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                                  recApplied[msg.type] 
                                    ? 'bg-success/20 text-success border border-success/30 cursor-not-allowed' 
                                    : 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-md hover:scale-[1.02] active:scale-[0.98]'
                                }`}
                              >
                                {recApplied[msg.type] ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Applied</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-3 h-3 fill-white" />
                                    <span>Apply Recommendation</span>
                                  </>
                                )}
                              </button>
                              
                              {!recApplied[msg.type] && (
                                <span className="text-[10px] text-muted font-bold animate-pulse">
                                  Configures prices & visibility
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* AI thinking loader indicator */}
                  {chatLoading && (
                    <div className="flex gap-3 justify-start text-left items-center">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                        <Sparkle className="w-4 h-4 animate-spin text-primary" />
                      </div>
                      <div className="bg-surface/50 border border-border/80 rounded-2xl py-3.5 px-5 text-xs text-text-secondary font-semibold italic flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-100" />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-200" />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-300" />
                        <span>Copilot is scanning Jumia & Raya shop indices...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Preset Chips and Chat Form */}
                <div className="mt-4 border-t border-border/50 pt-4 space-y-3">
                  
                  {/* Preset prompt questions chips */}
                  <div className="flex flex-wrap gap-2 text-left">
                    <button 
                      onClick={() => triggerCopilotQuery('sales')}
                      className="py-2 px-3 bg-surface hover:bg-border border border-border rounded-xl text-[10px] font-black text-text-primary transition-colors cursor-pointer"
                    >
                      💡 How can I increase my sales?
                    </button>
                    <button 
                      onClick={() => triggerCopilotQuery('undercut')}
                      className="py-2 px-3 bg-surface hover:bg-border border border-border rounded-xl text-[10px] font-black text-text-primary transition-colors cursor-pointer"
                    >
                      🚨 Which products are undercut?
                    </button>
                    <button 
                      onClick={() => triggerCopilotQuery('stock')}
                      className="py-2 px-3 bg-surface hover:bg-border border border-border rounded-xl text-[10px] font-black text-text-primary transition-colors cursor-pointer"
                    >
                      📦 Inventory stock checks
                    </button>
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleCustomSubmit} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Ask AI Copilot for competitor prices..."
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      className="flex-1 py-3 px-4 bg-surface border border-border rounded-xl text-xs outline-none text-text-primary placeholder-muted font-semibold transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                    />
                    <button 
                      type="submit" 
                      className="py-3 px-4.5 bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-xl shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>

                </div>

              </div>

              {/* Right Column: Visual Recommendations Impact Checklist Panel */}
              <div className="lg:col-span-5 space-y-6 text-left flex flex-col justify-between">
                
                {/* Active Suggestion panel list */}
                <div className="bg-card glass border border-border p-6 rounded-3xl shadow-md space-y-5 flex-1">
                  <div className="space-y-1 border-b border-border/50 pb-4">
                    <span className="text-[10px] font-black uppercase text-primary tracking-widest block">Actionable Diagnostics</span>
                    <h3 className="text-base sm:text-lg font-black text-text-primary tracking-tight">Active Recommendations</h3>
                  </div>

                  {activeRecType === 'sales' && (
                    <div className="space-y-4 animate-workflow-appear">
                      <div className="bg-primary/5 border border-primary/25 rounded-2xl p-4 flex gap-3 items-start">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${recApplied.sales ? 'text-success' : 'text-muted'}`} />
                        <div className="space-y-0.5">
                          <span className="text-xs font-black text-text-primary block">MacBook Air M3 Price Drop</span>
                          <p className="text-[11px] text-text-secondary leading-relaxed">Lower MacBook price by 3% (to EGP 72,265) to claim cheapest listing rank.</p>
                          <span className="text-[9px] text-primary font-black uppercase tracking-wider block pt-1">Estimated: +17% Click conversion</span>
                        </div>
                      </div>

                      <div className="bg-primary/5 border border-primary/25 rounded-2xl p-4 flex gap-3 items-start">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${recApplied.sales ? 'text-success' : 'text-muted'}`} />
                        <div className="space-y-0.5">
                          <span className="text-xs font-black text-text-primary block">Promote Xbox Series X</span>
                          <p className="text-[11px] text-text-secondary leading-relaxed">Highlight Xbox console using Featured placement to capture trending search traffic.</p>
                        </div>
                      </div>

                      <div className="bg-primary/5 border border-primary/25 rounded-2xl p-4 flex gap-3 items-start">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${recApplied.sales ? 'text-success' : 'text-muted'}`} />
                        <div className="space-y-0.5">
                          <span className="text-xs font-black text-text-primary block">Optimize TV category visibility</span>
                          <p className="text-[11px] text-text-secondary leading-relaxed">Add missing specification specs parameters to boost organic ranking index.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeRecType === 'undercut' && (
                    <div className="space-y-4 animate-workflow-appear">
                      <div className="bg-primary/5 border border-primary/25 rounded-2xl p-4 flex gap-3 items-start">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${recApplied.undercut ? 'text-success' : 'text-muted'}`} />
                        <div className="space-y-0.5">
                          <span className="text-xs font-black text-text-primary block">Match PlayStation 5 Slim</span>
                          <p className="text-[11px] text-text-secondary leading-relaxed">Drop yours to EGP 27,450 to undercut B.Tech (EGP 27,500).</p>
                        </div>
                      </div>

                      <div className="bg-primary/5 border border-primary/25 rounded-2xl p-4 flex gap-3 items-start">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${recApplied.undercut ? 'text-success' : 'text-muted'}`} />
                        <div className="space-y-0.5">
                          <span className="text-xs font-black text-text-primary block">Match Samsung 65" TV</span>
                          <p className="text-[11px] text-text-secondary leading-relaxed">Drop yours to EGP 41,000 to match Raya Egypt (EGP 41,200).</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeRecType === 'stock' && (
                    <div className="space-y-4 animate-workflow-appear">
                      <div className="bg-primary/5 border border-primary/25 rounded-2xl p-4 flex gap-3 items-start">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${recApplied.stock ? 'text-success' : 'text-muted'}`} />
                        <div className="space-y-0.5">
                          <span className="text-xs font-black text-text-primary block">Margin Premium: PS5 & Xbox</span>
                          <p className="text-[11px] text-text-secondary leading-relaxed">Add EGP 150 price buffer on low stock items while catalog restocking clears.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeRecType === 'none' && (
                    <div className="h-48 flex items-center justify-center text-xs text-muted font-bold border border-dashed border-border rounded-2xl">
                      Select one of the preset prompts to calculate suggestions
                    </div>
                  )}

                </div>

                {/* Copilot Diagnostics Overview Box */}
                <div className="bg-surface border border-border p-4.5 rounded-3xl space-y-3">
                  <span className="text-[9px] font-black uppercase text-muted tracking-wider block">AI Catalog Scraper Status</span>
                  <div className="flex items-center justify-between text-xs font-bold text-text-secondary">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-success inline-block" />
                      <span>Competitors: Amazon, Noon, B.Tech</span>
                    </div>
                    <span>Cairo Sync Live</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab === 'dashboard' && (
            <>
              {/* Row 1: Statistics Cards */}
              <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-workflow-appear">
                
                {/* Card 1: Products */}
                <div className="bg-card glass border border-border p-5 rounded-2xl text-left hover-lift shadow-sm relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-muted tracking-wider block">Products</span>
                    <p className="text-2xl font-black text-text-primary">342</p>
                  </div>
                  <div className="flex items-center gap-1 mt-3.5 text-[10px] font-black text-success">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+12% this week</span>
                  </div>
                </div>

                {/* Card 2: Monthly Views */}
                <div className="bg-card glass border border-border p-5 rounded-2xl text-left hover-lift shadow-sm relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-muted tracking-wider block">Monthly Views</span>
                    <p className="text-2xl font-black text-text-primary">25.4K</p>
                  </div>
                  <div className="flex items-center gap-1 mt-3.5 text-[10px] font-black text-success">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+8.2% vs last mo</span>
                  </div>
                </div>

                {/* Card 3: Clicks */}
                <div className="bg-card glass border border-border p-5 rounded-2xl text-left hover-lift shadow-sm relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-muted tracking-wider block">Clicks</span>
                    <p className="text-2xl font-black text-text-primary">1,889</p>
                  </div>
                  <div className="flex items-center gap-1 mt-3.5 text-[10px] font-black text-success">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+14.5% conversion</span>
                  </div>
                </div>

                {/* Card 4: CTR */}
                <div className="bg-card glass border border-border p-5 rounded-2xl text-left hover-lift shadow-sm relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-muted tracking-wider block">CTR Avg</span>
                    <p className="text-2xl font-black text-text-primary">7.41%</p>
                  </div>
                  <div className="flex items-center gap-1 mt-3.5 text-[10px] font-black text-success">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+0.3% search visibility</span>
                  </div>
                </div>

                {/* Card 5: Revenue */}
                <div className="bg-card glass border border-border p-5 rounded-2xl text-left hover-lift shadow-sm relative overflow-hidden flex flex-col justify-between col-span-2 md:col-span-1">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-muted tracking-wider block">Total Revenue</span>
                    <p className="text-2xl font-black text-text-primary">EGP 124K</p>
                  </div>
                  <div className="flex items-center gap-1 mt-3.5 text-[10px] font-black text-success">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+18% from ads listings</span>
                  </div>
                </div>

              </section>

              {/* Row 2: Website Connection Control Card & Inventory Overview */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch animate-workflow-appear">
                
                {/* Website connection details card */}
                <div className="lg:col-span-7 bg-card glass border border-border p-6 rounded-3xl text-left flex flex-col justify-between shadow-md relative overflow-hidden">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-primary tracking-widest block">Connected Store Sync</span>
                      <div className={`flex items-center gap-1.5 text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                        websiteStatus === 'Connected' ? 'bg-success/15 border-success/30 text-success' :
                        websiteStatus === 'Syncing' ? 'bg-primary/15 border-primary/30 text-primary' : 'bg-red-500/15 border-red-500/30 text-red-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                          websiteStatus === 'Connected' ? 'bg-success' :
                          websiteStatus === 'Syncing' ? 'bg-primary animate-ping' : 'bg-red-500'
                        }`} />
                        <span>{websiteStatus === 'Connected' ? 'Online Sync Active' : websiteStatus === 'Syncing' ? 'Syncing Catalog...' : 'Store Disconnected'}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="w-12 h-12 bg-surface border border-border rounded-xl flex items-center justify-center text-text-secondary shrink-0">
                        <Globe className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base text-text-primary">rayashop.com</h4>
                        <p className="text-[11px] text-text-secondary mt-0.5">Primary business categories: Phones & Laptops. Scrapers active.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-4 text-xs font-semibold text-text-secondary">
                      <div>
                        <span className="text-[9px] font-black text-muted uppercase">Sync Schedule</span>
                        <p className="text-text-primary mt-0.5">Every 24 hours (Daily)</p>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-muted uppercase">Last Catalog Sync</span>
                        <p className="text-text-primary mt-0.5">{lastSyncTime}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-border/50 mt-6">
                    <button
                      onClick={handleSyncNow}
                      disabled={isSyncing}
                      className="flex-1 py-3 bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer flex justify-center items-center gap-1.5 disabled:opacity-60"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>Sync Now</span>
                    </button>
                    <button
                      onClick={handleDisconnect}
                      className={`py-3 px-5 font-bold text-xs rounded-xl transition-all cursor-pointer border ${
                        websiteStatus === 'Disconnected' 
                          ? 'bg-success/15 hover:bg-success/20 text-success border-success/30' 
                          : 'bg-card hover:bg-surface border-border text-text-primary hover:text-red-500 hover:border-red-500/30'
                      }`}
                    >
                      {websiteStatus === 'Disconnected' ? 'Reconnect Website' : 'Disconnect Website'}
                    </button>
                  </div>
                </div>

                {/* Inventory Overview Card */}
                <div className="lg:col-span-5 bg-card glass border border-border p-6 rounded-3xl text-left flex flex-col justify-between shadow-md">
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase text-muted tracking-widest block">Inventory Overview</span>
                    
                    <div className="space-y-3 pt-2">
                      
                      {/* Metric: In Stock */}
                      <div className="flex items-center justify-between border-b border-border/50 pb-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-success" />
                          <span className="text-xs font-bold text-text-primary">In Stock items</span>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-xs text-text-primary block">{inStockCount} SKUs</span>
                          <span className="text-[9px] text-muted block">Stable competitor matches</span>
                        </div>
                      </div>

                      {/* Metric: Low Stock */}
                      <div className="flex items-center justify-between border-b border-border/50 pb-3">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-warning animate-pulse" />
                          <span className="text-xs font-bold text-text-primary">Low Stock warning</span>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-xs text-text-primary block">{lowStockCount} SKUs</span>
                          <span className="text-[9px] text-warning font-bold block">Re-stock alert generated</span>
                        </div>
                      </div>

                      {/* Metric: Out Of Stock */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-danger" />
                          <span className="text-xs font-bold text-text-primary">Out of Stock lists</span>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-xs text-text-primary block">{outOfStockCount} SKUs</span>
                          <span className="text-[9px] text-danger font-bold block">Search listings paused</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Total stock bar tracker */}
                  <div className="border-t border-border/50 pt-5 mt-5">
                    <div className="flex justify-between items-center text-[10px] font-black text-muted uppercase">
                      <span>Interactive Stock Bar</span>
                      <span>{totalProductsCount} total SKUs</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2 overflow-hidden flex mt-2">
                      <div className="bg-success h-full" style={{ width: `${(inStockCount / totalProductsCount) * 100}%` }} />
                      <div className="bg-warning h-full" style={{ width: `${(lowStockCount / totalProductsCount) * 100}%` }} />
                      <div className="bg-danger h-full" style={{ width: `${(outOfStockCount / totalProductsCount) * 100}%` }} />
                    </div>
                  </div>

                </div>

              </section>

              {/* Row 3: Products Section Table */}
              <section className="bg-card glass border border-border rounded-3xl p-6 shadow-md text-left space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-black tracking-tight">Detected Products Catalog</h3>
                    <p className="text-xs text-text-secondary mt-0.5">Review automatic SKU detections, toggle shopper listings, or promote items.</p>
                  </div>
                  
                  <div className="text-xs font-bold text-muted bg-surface/50 border border-border py-1.5 px-3 rounded-xl flex items-center gap-1.5 self-start sm:self-center font-mono">
                    <ShoppingBag className="w-4 h-4 text-primary" />
                    <span>Showing {products.length} Products</span>
                  </div>
                </div>

                {/* Desktop Responsive Table Layout */}
                <div className="overflow-x-auto border border-border/60 rounded-2xl bg-surface/20">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border/80 bg-surface/40 text-[10px] font-extrabold uppercase text-muted tracking-wider">
                        <th className="py-4 px-5">Product Details</th>
                        <th className="py-4 px-4 text-center">Category</th>
                        <th className="py-4 px-4 text-center">Visibility Score</th>
                        <th className="py-4 px-4 text-center">Status</th>
                        <th className="py-4 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 text-xs font-semibold text-text-secondary">
                      {products.map((product) => {
                        const isListed = product.status === 'Listed';
                        
                        return (
                          <tr key={product.id} className="hover:bg-surface/10 transition-colors">
                            
                            {/* Column 1: Image & Product Name */}
                            <td className="py-4.5 px-5 flex items-center gap-3.5">
                              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-primary/10 to-accent/10 border border-border/80 flex items-center justify-center text-primary shrink-0 relative">
                                <span className="font-bold text-xs uppercase">{product.category.substring(0,2)}</span>
                                {product.isFeatured && (
                                  <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white rounded-full p-0.5 border border-card shadow-sm">
                                    <Star className="w-2.5 h-2.5 fill-white text-white" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 text-left">
                                <span className="font-black text-text-primary text-xs sm:text-sm block truncate max-w-sm sm:max-w-md">{product.name}</span>
                                <span className="text-[10px] text-muted block mt-0.5 font-mono">EGP {product.price.toLocaleString()}</span>
                              </div>
                            </td>

                            {/* Column 2: Category */}
                            <td className="py-4.5 px-4 text-center font-bold text-text-primary">
                              {product.category}
                            </td>

                            {/* Column 3: Visibility Score */}
                            <td className="py-4.5 px-4 text-center">
                              <div className="inline-flex items-center gap-1.5">
                                <div className="w-10 bg-border rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${
                                      product.visibility >= 90 ? 'bg-success' :
                                      product.visibility >= 80 ? 'bg-warning' : 'bg-danger'
                                    }`} 
                                    style={{ width: `${product.visibility}%` }} 
                                  />
                                </div>
                                <span className="font-black text-text-primary">{product.visibility}%</span>
                              </div>
                            </td>

                            {/* Column 4: Status Stock */}
                            <td className="py-4.5 px-4 text-center">
                              <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                product.stock === 'In Stock' ? 'bg-success/10 text-success' :
                                product.stock === 'Low Stock' ? 'bg-warning/10 text-warning animate-pulse' : 'bg-danger/10 text-danger'
                              }`}>
                                {product.stock}
                              </span>
                            </td>

                            {/* Column 5: Action Buttons */}
                            <td className="py-4.5 px-5 text-right space-x-1.5">
                              <button 
                                onClick={() => alert(`Reviewing catalog index values for "${product.name}". Compiles Egypt price records.`)}
                                title="View product specifications"
                                className="p-2 rounded-lg bg-surface border border-border text-text-primary hover:bg-border transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              
                              <button 
                                onClick={() => handleToggleStatus(product.id)}
                                title={isListed ? 'Hide product from shopper results' : 'Show product in shopper results'}
                                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                                  isListed 
                                    ? 'bg-surface border-border text-text-primary hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20' 
                                    : 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-success/10 hover:text-success hover:border-success/20'
                                }`}
                              >
                                {isListed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>

                              <button 
                                onClick={() => handleToggleFeature(product)}
                                title={product.isFeatured ? 'Remove from featured ads list' : 'Highlight as Featured product'}
                                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                                  product.isFeatured 
                                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-500 hover:bg-surface hover:text-text-primary hover:border-border' 
                                    : 'bg-surface border-border text-text-primary hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500/20'
                                }`}
                              >
                                <Star className={`w-3.5 h-3.5 ${product.isFeatured ? 'fill-amber-500' : ''}`} />
                              </button>
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile / Tablet Card list view (Fallback) */}
                <div className="grid grid-cols-1 md:hidden gap-4">
                  {products.map((product) => {
                    const isListed = product.status === 'Listed';
                    return (
                      <div key={product.id} className="bg-surface/30 border border-border p-4.5 rounded-2xl text-left space-y-4">
                        <div className="flex items-center gap-3.5 justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-primary/10 to-accent/10 border border-border flex items-center justify-center text-primary shrink-0 relative">
                              <span className="font-bold text-xs uppercase">{product.category.substring(0,2)}</span>
                              {product.isFeatured && (
                                <div className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-0.5">
                                  <Star className="w-2.5 h-2.5 fill-white text-white" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="font-black text-text-primary text-sm block truncate max-w-[150px]">{product.name}</span>
                              <span className="text-[10px] text-muted block mt-0.5 font-mono">EGP {product.price.toLocaleString()}</span>
                            </div>
                          </div>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            product.stock === 'In Stock' ? 'bg-success/10 text-success' :
                            product.stock === 'Low Stock' ? 'bg-warning/10 text-warning animate-pulse' : 'bg-danger/10 text-danger'
                          }`}>
                            {product.stock}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-[11px] font-bold text-text-secondary border-t border-b border-border/50 py-2">
                          <span>Category: {product.category}</span>
                          <span>Visibility Score: <strong className="text-text-primary">{product.visibility}%</strong></span>
                        </div>

                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => alert(`Reviewing catalog index values for "${product.name}". Compiles Egypt price records.`)}
                            className="py-2 px-3 bg-surface hover:bg-border text-text-primary border border-border rounded-xl text-xs font-bold cursor-pointer"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => handleToggleStatus(product.id)}
                            className={`py-2 px-3 border rounded-xl text-xs font-bold cursor-pointer ${
                              isListed 
                                ? 'bg-surface border-border text-text-primary hover:bg-red-500/10 hover:text-red-500' 
                                : 'bg-red-500/10 border-red-500/20 text-red-500'
                            }`}
                          >
                            {isListed ? 'Hide' : 'Show'}
                          </button>
                          <button 
                            onClick={() => handleToggleFeature(product)}
                            className={`py-2 px-3 border rounded-xl text-xs font-bold cursor-pointer ${
                              product.isFeatured 
                                ? 'bg-amber-500/15 border-amber-500/30 text-amber-500' 
                                : 'bg-surface border-border text-text-primary hover:text-amber-500'
                            }`}
                          >
                            {product.isFeatured ? 'Featured' : 'Promote'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </section>
            </>
          )}

          {activeTab === 'analytics' && (
            /* ── AI ANALYTICS VIEW ──────────────────────────────── */
            <div className="space-y-8 animate-workflow-appear">
              
              {/* Row 1: Dashboard Charts (Views/Clicks & Donut Traffic & Top bars) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* 1. Monthly Views & Clicks Area Chart (SVG Animated) */}
                <div className="lg:col-span-8 bg-card glass border border-border p-6 rounded-3xl text-left shadow-md flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-primary tracking-widest block">Traffic Performance</span>
                      
                      {/* Legend */}
                      <div className="flex items-center gap-4 text-[10px] font-bold">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
                          <span>Monthly Views</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />
                          <span>Clicks</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-black tracking-tight pt-1">Monthly Views & Clicks Trend</h3>
                  </div>

                  {/* SVG Chart Area */}
                  <div className="relative h-56 w-full mt-6 bg-surface/20 rounded-2xl border border-border/50 p-4 overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      <line x1="0" y1="40" x2="800" y2="40" stroke="var(--color-border)" strokeWidth="0.8" strokeDasharray="5,5" />
                      <line x1="0" y1="90" x2="800" y2="90" stroke="var(--color-border)" strokeWidth="0.8" strokeDasharray="5,5" />
                      <line x1="0" y1="140" x2="800" y2="140" stroke="var(--color-border)" strokeWidth="0.8" strokeDasharray="5,5" />

                      {/* Views Area & Line */}
                      <path 
                        d="M 20 180 Q 120 70 220 130 T 420 50 T 620 100 T 780 40 L 780 180 Z" 
                        fill="url(#viewsGrad)" 
                        className="opacity-70"
                      />
                      <path 
                        d="M 20 180 Q 120 70 220 130 T 420 50 T 620 100 T 780 40" 
                        fill="none" 
                        stroke="var(--color-primary)" 
                        strokeWidth="3.5" 
                        className="animate-draw-path"
                        strokeLinecap="round"
                      />

                      {/* Clicks Area & Line */}
                      <path 
                        d="M 20 180 Q 120 130 220 160 T 420 100 T 620 140 T 780 90 L 780 180 Z" 
                        fill="url(#clicksGrad)" 
                        className="opacity-60"
                      />
                      <path 
                        d="M 20 180 Q 120 130 220 160 T 420 100 T 620 140 T 780 90" 
                        fill="none" 
                        stroke="var(--color-accent)" 
                        strokeWidth="2.5" 
                        className="animate-draw-path"
                        strokeLinecap="round"
                      />

                      {/* Chart Interactive nodes */}
                      <circle cx="220" cy="130" r="4.5" fill="var(--color-primary)" className="animate-pulse" />
                      <circle cx="420" cy="50" r="4.5" fill="var(--color-primary)" className="animate-pulse" />
                      <circle cx="780" cy="40" r="4.5" fill="var(--color-primary)" className="animate-pulse" />
                    </svg>

                    <div className="absolute top-4 left-6 bg-background/90 border border-border px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping" />
                      <span className="text-[10px] font-bold text-text-primary">Live Traffic: Jun 2026</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[9px] font-black text-muted uppercase mt-3 px-1">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun (Current)</span>
                  </div>
                </div>

                {/* 2. Store Ranking Card */}
                <div className="lg:col-span-4 bg-card glass border border-border p-6 rounded-3xl text-left shadow-md flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase text-primary tracking-widest block">Market Position</span>
                    <h3 className="text-base sm:text-lg font-black tracking-tight">Cairo Store Ranking</h3>
                    
                    <div className="py-6 text-center space-y-2.5">
                      <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center border border-amber-500/20 shadow-inner">
                        <Star className="w-7 h-7 fill-amber-500" />
                      </div>
                      <div>
                        <span className="text-3xl font-black text-text-primary">#4</span>
                        <span className="text-xs font-semibold text-muted"> / 188</span>
                      </div>
                      <p className="text-[10px] text-muted font-bold uppercase tracking-wider">Egypt Electronics Retailers</p>
                    </div>
                  </div>

                  <div className="bg-surface/50 border border-border/80 p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold">
                    <span className="text-text-secondary">Performance Index:</span>
                    <span className="text-success uppercase tracking-widest text-[9px] font-black bg-success/10 px-2.5 py-0.5 rounded-full">Top 3% store</span>
                  </div>
                </div>

              </div>

              {/* Row 2: Traffic Sources (Donut) & Top Categories / Top Products (Horizontal Bars) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch animate-workflow-appear">
                
                {/* Donut Chart: Traffic Sources */}
                <div className="lg:col-span-4 bg-card glass border border-border p-6 rounded-3xl text-left shadow-md flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-muted tracking-widest block">Traffic Mediums</span>
                    <h3 className="text-base sm:text-lg font-black tracking-tight pt-1">Store Traffic Sources</h3>
                  </div>

                  {/* Circular Donut chart SVG */}
                  <div className="flex justify-center py-6">
                    <div className="relative w-36 h-36">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-primary)" strokeWidth="12" strokeDasharray="113 251" strokeDashoffset="0" />
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-accent)" strokeWidth="12" strokeDasharray="75 251" strokeDashoffset="-113" />
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="12" strokeDasharray="38 251" strokeDashoffset="-188" />
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#64748b" strokeWidth="12" strokeDasharray="25 251" strokeDashoffset="-226" />
                      </svg>
                      <div className="absolute inset-0 m-auto w-20 h-20 bg-card rounded-full flex flex-col items-center justify-center shadow-inner">
                        <span className="text-lg font-black text-text-primary">25.4K</span>
                        <span className="text-[8px] font-bold text-muted uppercase">Total Views</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-text-secondary pt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      <span>Google Search (45%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-accent" />
                      <span>Shopper App (30%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Direct (15%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-500" />
                      <span>Others (10%)</span>
                    </div>
                  </div>
                </div>

                {/* Top Categories & Products Horizontal Bar Charts */}
                <div className="lg:col-span-8 bg-card glass border border-border p-6 rounded-3xl text-left shadow-md grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Part 1: Top Categories */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-primary tracking-widest block">Volume Split</span>
                      <h4 className="font-extrabold text-sm text-text-primary pt-0.5">Top Categories</h4>
                    </div>

                    <div className="space-y-4 pt-2">
                      {[
                        { label: 'Phones', value: 65, color: 'bg-primary' },
                        { label: 'Laptops', value: 18, color: 'bg-accent' },
                        { label: 'Gaming', value: 12, color: 'bg-blue-500' },
                        { label: 'TVs', value: 5, color: 'bg-slate-500' }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-text-secondary">
                            <span>{item.label}</span>
                            <span className="text-text-primary">{item.value}%</span>
                          </div>
                          <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                            <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Part 2: Top Products */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-primary tracking-widest block">Item Clicks</span>
                      <h4 className="font-extrabold text-sm text-text-primary pt-0.5">Top Clicked Products</h4>
                    </div>

                    <div className="space-y-4 pt-2">
                      {[
                        { label: 'iPhone 16 Pro Max', value: 40, color: 'bg-primary' },
                        { label: 'PlayStation 5 Slim', value: 25, color: 'bg-accent' },
                        { label: 'MacBook Air M3', value: 20, color: 'bg-blue-500' },
                        { label: 'Apple AirPods Pro', value: 15, color: 'bg-slate-500' }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-text-secondary">
                            <span className="truncate max-w-[150px]">{item.label}</span>
                            <span className="text-text-primary">{item.value}%</span>
                          </div>
                          <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                            <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* Row 3: AI Insights Cards Section */}
              <div className="space-y-5">
                <div className="text-left space-y-1">
                  <span className="text-[10px] font-black uppercase text-primary tracking-widest pl-1 block">AI Engine Diagnostics</span>
                  <h3 className="text-base sm:text-lg font-black tracking-tight">AI Price & Visibility Recommendations</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-workflow-appear">
                  
                  {/* Insight 1: AI Pricing Insight / Price Recommendation */}
                  <div className="bg-card glass border border-primary/20 p-5 rounded-2xl text-left hover-lift shadow-md flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary/10 text-primary text-[8px] font-black py-0.5 px-3 rounded-bl-lg uppercase tracking-wider">
                      Price Recommendation
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Radar className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-text-primary">🧠 AI Pricing Insight</h4>
                        <p className="text-[11px] text-text-secondary mt-1.5 leading-relaxed">
                          Lower the price of <strong className="text-text-primary">MacBook Air M3</strong> by <strong className="text-primary">EGP 900</strong> to match Jumia's discount.
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-border/50 pt-3 mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-success">
                      <span>Expected Outcome</span>
                      <span>+17% Clicks</span>
                    </div>
                  </div>

                  {/* Insight 2: Competitor Alert */}
                  <div className="bg-card glass border border-border p-5 rounded-2xl text-left hover-lift shadow-sm relative overflow-hidden flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-accent/10 text-accent text-[8px] font-black py-0.5 px-3 rounded-bl-lg uppercase tracking-wider">
                      Competitor Price Drop
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-text-primary">Competitor Alert</h4>
                        <p className="text-[11px] text-text-secondary mt-1.5 leading-relaxed">
                          B.Tech dropped <strong className="text-text-primary">PlayStation 5 Slim</strong> to <strong className="text-accent">EGP 27,500</strong>, undercutting your store catalog by EGP 400.
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-border/50 pt-3 mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-text-secondary">
                      <span>Suggested Action</span>
                      <span className="text-primary">Apply Price Match</span>
                    </div>
                  </div>

                  {/* Insight 3: Inventory Alert */}
                  <div className="bg-card glass border border-border p-5 rounded-2xl text-left hover-lift shadow-sm relative overflow-hidden flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-yellow-500/10 text-warning text-[8px] font-black py-0.5 px-3 rounded-bl-lg uppercase tracking-wider">
                      Low Stock Warning
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="w-9 h-9 rounded-lg bg-yellow-500/10 text-warning flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-warning" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-text-primary">Inventory Alert</h4>
                        <p className="text-[11px] text-text-secondary mt-1.5 leading-relaxed">
                          <strong className="text-text-primary">Xbox Series X</strong> has only <strong className="text-warning">3 units</strong> remaining. Daily CTR has jumped 40%.
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-border/50 pt-3 mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-text-secondary">
                      <span>Suggested Action</span>
                      <span className="text-primary">Replenish 15 Units</span>
                    </div>
                  </div>

                  {/* Insight 4: Trending Category */}
                  <div className="bg-card glass border border-border p-5 rounded-2xl text-left hover-lift shadow-sm relative overflow-hidden flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-500/10 text-blue-500 text-[8px] font-black py-0.5 px-3 rounded-bl-lg uppercase tracking-wider">
                      Market Demand
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-text-primary">Trending Category</h4>
                        <p className="text-[11px] text-text-secondary mt-1.5 leading-relaxed">
                          Egyptian organic consumer search demand for <strong className="text-text-primary">Laptops</strong> peaked <strong className="text-blue-500">22% higher</strong> this week.
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-border/50 pt-3 mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-text-secondary">
                      <span>Suggested Action</span>
                      <span className="text-primary">Feature Laptops</span>
                    </div>
                  </div>

                  {/* Insight 5: Best Selling Product */}
                  <div className="bg-card glass border border-border p-5 rounded-2xl text-left hover-lift shadow-sm relative overflow-hidden flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-green-500/10 text-success text-[8px] font-black py-0.5 px-3 rounded-bl-lg uppercase tracking-wider">
                      Performance Leader
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="w-9 h-9 rounded-lg bg-green-500/10 text-success flex items-center justify-center shrink-0">
                        <Star className="w-5 h-5 text-success fill-success" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-text-primary">Best Selling Product</h4>
                        <p className="text-[11px] text-text-secondary mt-1.5 leading-relaxed">
                          <strong className="text-text-primary">iPhone 16 Pro Max 256GB</strong> is your highest converter item, holding a <strong className="text-success">9.8% CTR</strong>.
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-border/50 pt-3 mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-text-secondary">
                      <span>Recommendation</span>
                      <span className="text-primary">Keep Price Stable</span>
                    </div>
                  </div>

                  {/* Insight 6: Visibility Recommendation */}
                  <div className="bg-card glass border border-border p-5 rounded-2xl text-left hover-lift shadow-sm relative overflow-hidden flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-purple-500/10 text-purple-500 text-[8px] font-black py-0.5 px-3 rounded-bl-lg uppercase tracking-wider">
                      Search SEO Growth
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                        <Eye className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-text-primary">Visibility Recommendation</h4>
                        <p className="text-[11px] text-text-secondary mt-1.5 leading-relaxed">
                          Add specs data values to <strong className="text-text-primary">Samsung Neo QLED TV</strong> to improve listings details indexing.
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-border/50 pt-3 mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-success">
                      <span>Expected Outcome</span>
                      <span>+14% Search Rank</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {activeTab === 'billing' && (
            /* ── SUBSCRIPTIONS & BILLING VIEW ─────────────────────── */
            <div className="space-y-12 animate-workflow-appear">
              
              {/* Active Plan Overview Card */}
              <div className="bg-card glass border border-border rounded-3xl p-6 text-left shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary/10 text-primary text-[8px] font-black py-0.5 px-3.5 rounded-bl-lg uppercase tracking-wider">
                  Active Subscription
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-muted uppercase tracking-wider">Current Tier</span>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-text-primary">
                      {currentPlan === 'Free' ? 'Free Merchant Plan' : 'Pro Merchant Plan ⭐'}
                    </h3>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed max-w-lg">
                    {currentPlan === 'Free' 
                      ? 'You are currently on the trial Free plan. Upgrading unlocks daily sync schedules and advanced competitor scanning widgets.' 
                      : 'You are on the Pro plan. Daily crawl indices, competitor alert notifications, and homepage deals features are unlocked.'}
                  </p>
                </div>

                <div className="bg-surface/50 border border-border p-5 rounded-2xl text-left shrink-0 sm:w-64 space-y-3">
                  <div>
                    <span className="text-[9px] font-black text-muted uppercase block">Active Limits</span>
                    <ul className="text-[11px] font-semibold text-text-secondary space-y-1 mt-1">
                      <li>· Websites: {currentPlan === 'Free' ? '1 Store' : '1 Store (Max)'}</li>
                      <li>· Categories: {currentPlan === 'Free' ? '1 active' : 'Unlimited'}</li>
                      <li>· Products: {currentPlan === 'Free' ? 'Up to 50' : 'Unlimited'}</li>
                    </ul>
                  </div>
                  {currentPlan === 'Free' && (
                    <button 
                      onClick={() => { setShowUpgradeModal(true); setUpgradeStep(0); }}
                      className="w-full py-2.5 bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center font-black animate-pulse"
                    >
                      Upgrade to Pro
                    </button>
                  )}
                </div>
              </div>

              {/* Three Plans Layout Grid */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-left">Choose Your Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch animate-workflow-appear">
                  
                  {/* Plan 1: Free */}
                  <div className="bg-card glass border border-border rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm text-left hover-lift relative overflow-hidden transition-all duration-300">
                    <div>
                      <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted block">Free</span>
                        <p className="text-2xl font-black text-text-primary">
                          EGP 0 <span className="text-xs font-semibold text-muted">/ month</span>
                        </p>
                      </div>

                      <hr className="border-border/60 my-6" />

                      <div className="space-y-4">
                        <div>
                          <span className="text-[9px] font-black text-primary uppercase tracking-wider block">Limits</span>
                          <ul className="space-y-1 text-xs text-text-secondary font-semibold mt-1">
                            <li>· 1 Website</li>
                            <li>· 1 Category</li>
                            <li>· Up to 50 Products</li>
                          </ul>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-muted uppercase tracking-wider block">Included Features</span>
                          <ul className="space-y-2 text-xs font-semibold text-text-secondary mt-1.5">
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                              <span>Weekly Sync</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                              <span>Basic Analytics</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                              <span>Basic AI Insights</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <button 
                      disabled={currentPlan === 'Free'}
                      className="mt-8 w-full py-2.5 bg-surface text-text-secondary font-bold text-xs rounded-xl shadow-xs transition-all text-center cursor-not-allowed border border-border"
                    >
                      {currentPlan === 'Free' ? 'Current Plan' : 'Downgrade Locked'}
                    </button>
                  </div>

                  {/* Plan 2: Pro */}
                  <div className="bg-card glass border-2 border-primary rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-md text-left hover-lift relative overflow-hidden transition-all duration-300">
                    <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-black py-1 px-4 rounded-bl-xl uppercase tracking-widest">
                      Most Popular
                    </div>

                    <div>
                      <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary block">Pro ⭐</span>
                        <p className="text-2xl font-black text-text-primary">
                          EGP 999 <span className="text-xs font-semibold text-muted">/ month</span>
                        </p>
                      </div>

                      <hr className="border-border/60 my-6" />

                      <div className="space-y-4">
                        <div>
                          <span className="text-[9px] font-black text-primary uppercase tracking-wider block">Limits</span>
                          <ul className="space-y-1 text-xs text-text-primary font-semibold mt-1">
                            <li>· Unlimited Categories</li>
                            <li>· Unlimited Products</li>
                          </ul>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-muted uppercase tracking-wider block">Included Features</span>
                          <ul className="space-y-2 text-xs font-semibold text-text-secondary mt-1.5">
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                              <span>Daily Sync</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                              <span>AI Pricing Insights</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                              <span>Competitor Monitoring</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                              <span>Featured Listings ads</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                              <span>Homepage Deals</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                              <span>Recommended Products</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                              <span>Email Reports</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {currentPlan === 'Pro' ? (
                      <button 
                        disabled
                        className="mt-8 w-full py-2.5 bg-success/15 border border-success/30 text-success font-bold text-xs rounded-xl shadow-xs transition-all text-center"
                      >
                        Active Pro Plan
                      </button>
                    ) : (
                      <button 
                        onClick={() => { setShowUpgradeModal(true); setUpgradeStep(0); }}
                        className="mt-8 w-full py-2.5 bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center font-black animate-pulse"
                      >
                        Upgrade to Pro
                      </button>
                    )}
                  </div>

                  {/* Plan 3: Enterprise */}
                  <div className="bg-card glass border border-border rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm text-left hover-lift relative overflow-hidden transition-all duration-300">
                    <div>
                      <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted block">Enterprise</span>
                        <p className="text-2xl font-black text-text-primary">
                          Custom <span className="text-xs font-semibold text-muted">pricing</span>
                        </p>
                      </div>

                      <hr className="border-border/60 my-6" />

                      <div className="space-y-4">
                        <div>
                          <span className="text-[9px] font-black text-primary uppercase tracking-wider block">Limits</span>
                          <ul className="space-y-1 text-xs text-text-secondary font-semibold mt-1">
                            <li>· Multiple Websites</li>
                          </ul>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-muted uppercase tracking-wider block">Included Features</span>
                          <ul className="space-y-2 text-xs font-semibold text-text-secondary mt-1.5">
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                              <span>API Integrations</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                              <span>Priority Support channels</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => alert('Contact Enterprise Sales at sales@priceradar.ai to coordinate multiple website crawlers.')}
                      className="mt-8 w-full py-2.5 bg-surface hover:bg-border text-text-primary font-bold text-xs rounded-xl shadow-xs transition-all text-center cursor-pointer border border-border"
                    >
                      Contact Sales
                    </button>
                  </div>

                </div>
              </div>

              {/* ── INTERACTIVE ON-DEMAND ADS CAMPAIGN CALCULATOR ───────── */}
              <div className="space-y-6 pt-10 border-t border-border/50 text-left animate-workflow-appear">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-primary tracking-widest block">On-Demand Ads</span>
                  <h3 className="text-xl font-black tracking-tight text-text-primary">Featured Listings Ads Manager</h3>
                  <p className="text-xs text-text-secondary max-w-2xl leading-relaxed">
                    Promote specific products separately from subscriptions, similar to Google Ads, to capture more buyer attention.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Controls column */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* Selector 1: Placement Spot */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-black uppercase text-muted tracking-wider block">1. Select Placement Spot</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {[
                          { id: 'search', label: 'Top Search Results', desc: 'Promoted at the top of search listings' },
                          { id: 'deals', label: 'Homepage Deals', desc: 'Featured in homepage deals spotlight carousel' },
                          { id: 'recs', label: 'Recommended Products', desc: 'Shown on competitor product detail pages' },
                          { id: 'trends', label: 'Trending Products', desc: 'Displayed in organic trending feeds' }
                        ].map((spot) => {
                          const isSelected = selectedPlacement === spot.id;
                          return (
                            <button
                              key={spot.id}
                              type="button"
                              onClick={() => setSelectedPlacement(spot.id)}
                              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer bg-card/35 hover:bg-surface/50 w-full flex flex-col justify-between h-20 ${
                                isSelected ? 'border-primary ring-2 ring-primary/10 bg-primary/5' : 'border-border'
                              }`}
                            >
                              <span className="font-extrabold text-xs text-text-primary block">{spot.label}</span>
                              <span className="text-[9px] text-text-secondary mt-1 block leading-normal">{spot.desc}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Selector 2: Campaign Duration */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-black uppercase text-muted tracking-wider block">2. Choose Campaign Duration</span>
                      <div className="grid grid-cols-3 gap-3.5">
                        {[
                          { id: '7', label: '7 Days', label2: 'Starter Trial' },
                          { id: '30', label: '30 Days', label2: 'Save 15%' },
                          { id: 'seasonal', label: 'Seasonal', label2: 'Best Value' }
                        ].map((duration) => {
                          const isSelected = selectedDuration === duration.id;
                          return (
                            <button
                              key={duration.id}
                              type="button"
                              onClick={() => setSelectedDuration(duration.id)}
                              className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer bg-card/35 hover:bg-surface/50 w-full flex flex-col justify-center items-center ${
                                isSelected ? 'border-primary ring-2 ring-primary/10 bg-primary/5' : 'border-border'
                              }`}
                            >
                              <span className="font-extrabold text-xs text-text-primary block">{duration.label}</span>
                              <span className={`text-[8px] font-bold uppercase mt-0.5 block ${isSelected ? 'text-primary' : 'text-muted'}`}>{duration.label2}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Selector 3: Product to Promote */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-black uppercase text-muted tracking-wider block">3. Select Product to Promote</span>
                      <div className="relative w-full">
                        <select
                          value={campaignProductId}
                          onChange={(e) => setCampaignProductId(e.target.value)}
                          className="w-full py-3 px-4 bg-surface border border-border rounded-xl text-xs font-semibold outline-none text-text-primary cursor-pointer appearance-none"
                        >
                          {products.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} (EGP {p.price.toLocaleString()})
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Details Summary column */}
                  <div className="lg:col-span-4 bg-surface border border-border p-6 rounded-3xl shadow-sm space-y-6">
                    <div className="space-y-4">
                      <span className="bg-primary/15 border border-primary/20 text-primary text-[8px] font-black py-1 px-3.5 rounded-full uppercase tracking-widest inline-block">
                        Campaign Details
                      </span>
                      
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-base text-text-primary">
                          {pricingMatrix[selectedPlacement].title}
                        </h4>
                        <p className="text-[11px] text-text-secondary leading-relaxed">
                          {pricingMatrix[selectedPlacement].desc}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-b border-border/50 py-4 text-xs font-bold text-text-secondary">
                        <div>
                          <span className="text-[8px] font-black text-muted uppercase">Duration</span>
                          <p className="text-text-primary mt-0.5">
                            {selectedDuration === '7' && '7 Days Slot'}
                            {selectedDuration === '30' && '30 Days Slot'}
                            {selectedDuration === 'seasonal' && 'Seasonal Slot'}
                          </p>
                        </div>
                        <div>
                          <span className="text-[8px] font-black text-muted uppercase">Estimated Reach</span>
                          <p className="text-success font-black mt-0.5">
                            {getCampaignViews(selectedDuration)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-muted uppercase">Estimated Campaign Budget</span>
                        <div className="text-3xl font-black text-text-primary">
                          EGP {pricingMatrix[selectedPlacement][selectedDuration]}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={triggerLaunchCampaign}
                      className="w-full py-3.5 bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center font-black"
                    >
                      Launch Ad Campaign
                    </button>
                  </div>

                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* ── UPGRADE SUBSCRIPTION ANIMATION MODAL ────────────────── */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => { if (upgradeStep === 0) setShowUpgradeModal(false); }} className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-300 z-0" />
          
          <div className="relative bg-card glass border border-border rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl overflow-hidden text-center z-10 space-y-6">
            {upgradeStep === 0 ? (
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-black text-text-primary">Confirm Pro Subscription</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Would you like to upgrade your store to the Pro plan for EGP 999/month? You will unlock unlimited products and daily crawl feeds.
                  </p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={triggerPlanUpgrade}
                    className="flex-1 py-3 bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer"
                  >
                    Confirm & Upgrade
                  </button>
                  <button 
                    onClick={() => setShowUpgradeModal(false)}
                    className="py-3 px-5 bg-card hover:bg-surface border border-border text-text-primary font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 space-y-6 flex flex-col items-center">
                
                {upgradeStep < 3 ? (
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-success/20 text-success flex items-center justify-center animate-bounce">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-base font-black text-text-primary transition-all">
                    {upgradeStep === 1 && 'Activating Pro...'}
                    {upgradeStep === 2 && 'Unlocking AI Insights...'}
                    {upgradeStep === 3 && 'Pro Subscription Active!'}
                  </h4>
                  <p className="text-[11px] text-text-secondary leading-relaxed max-w-xs mx-auto">
                    {upgradeStep === 1 && 'Establishing daily index scraper queues and allocating server storage...'}
                    {upgradeStep === 2 && 'Activating competitive alarms, daily reports, and featured matching triggers...'}
                    {upgradeStep === 3 && 'Your store has been upgraded successfully. Pricing feeds are active.'}
                  </p>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* ── FEATURE LISTING / PROMOTE UPGRADE MODAL ──────────────── */}
      {showFeatureModal && selectedFeatureProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => { if (featureStep === 0) setShowFeatureModal(false); }} className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-300 z-0" />
          
          <div className="relative bg-card glass border border-border rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl overflow-hidden text-center z-10 space-y-6">
            
            {featureStep === 0 ? (
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-2 border border-amber-500/20">
                  <Star className="w-6 h-6 fill-amber-500" />
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-xl font-black text-text-primary">Promote Specific Product</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Highlight <strong className="text-text-primary">{selectedFeatureProduct.name}</strong> as a Featured Listing on PriceRadar Egypt search results.
                  </p>
                </div>

                {/* Rank Position Comparative Card */}
                <div className="bg-surface/50 border border-border p-4.5 rounded-2xl text-left grid grid-cols-3 items-center gap-4">
                  <div className="text-center">
                    <span className="text-[9px] font-bold text-muted uppercase tracking-wider block">Current Position</span>
                    <span className="text-lg font-black text-danger mt-1 block">#12</span>
                  </div>
                  
                  <div className="flex justify-center text-primary animate-pulse">
                    <ArrowRight className="w-6 h-6 hidden sm:block" />
                    <ArrowRight className="w-5 h-5 sm:hidden" />
                  </div>

                  <div className="text-center">
                    <span className="text-[9px] font-bold text-muted uppercase tracking-wider block">Target Slot</span>
                    <span className="text-lg font-black text-success mt-1 block flex justify-center items-center gap-1">
                      <ArrowUp className="w-4 h-4 text-success" />
                      <span>Top 3</span>
                    </span>
                  </div>
                </div>

                <div className="bg-success/10 border border-success/20 py-2.5 px-4 rounded-xl text-[10px] font-black text-success uppercase tracking-wider">
                  Estimated Visibility Boost: +43%
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={triggerFeatureUpgrade}
                    className="flex-1 py-3 bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer"
                  >
                    Promote Product
                  </button>
                  <button 
                    onClick={() => setShowFeatureModal(false)}
                    className="py-3 px-5 bg-card hover:bg-surface border border-border text-text-primary font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 space-y-6 flex flex-col items-center">
                
                {featureStep < 3 ? (
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-success/20 text-success flex items-center justify-center animate-bounce">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-base font-black text-text-primary transition-all">
                    {featureStep === 1 && 'Activating Pro...'}
                    {featureStep === 2 && 'Unlocking AI...'}
                    {featureStep === 3 && 'Success'}
                  </h4>
                  <p className="text-[11px] text-text-secondary leading-relaxed max-w-xs mx-auto">
                    {featureStep === 1 && 'Allocating promoted listing slots in organic shopper search results database...'}
                    {featureStep === 2 && 'Enabling real-time visibility monitoring and competitor undercut reports...'}
                    {featureStep === 3 && `"${selectedFeatureProduct.name}" has been promoted to the Top 3 positions.`}
                  </p>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* ── CAMPAIGN ADS CREATION ANIMATION MODAL ────────────────── */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-300 z-0" />
          
          <div className="relative bg-card glass border border-border rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl overflow-hidden text-center z-10 space-y-6">
            <div className="py-8 space-y-6 flex flex-col items-center">
              
              {campaignStep < 3 ? (
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-success/20 text-success flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-base font-black text-text-primary transition-all">
                  {campaignStep === 1 && 'Establishing Ad Bid Placement...'}
                  {campaignStep === 2 && 'Allocating Search Visibility Indexes...'}
                  {campaignStep === 3 && 'Campaign Live! 🚀'}
                </h4>
                <p className="text-[11px] text-text-secondary leading-relaxed max-w-xs mx-auto">
                  {campaignStep === 1 && 'Configuring organic bid priorities for search keywords and related categories...'}
                  {campaignStep === 2 && 'Syncing featured banners with homepage deals grids and competitor recommended lists...'}
                  {campaignStep === 3 && 'Your campaign has launched successfully. Visibility multipliers are now active.'}
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── RECOMMENDATIONS APPLY LOADING ANIMATION MODAL ────────── */}
      {isApplyingRec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/85 backdrop-blur-md z-0" />
          
          <div className="relative bg-card glass border border-border rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl overflow-hidden text-center z-10 space-y-6">
            <div className="py-8 space-y-6 flex flex-col items-center">
              
              {recProgressStep < 3 ? (
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-success/20 text-success flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-base font-black text-text-primary transition-all">
                  {recProgressStep === 1 && 'Syncing AI pricing drops...'}
                  {recProgressStep === 2 && 'Promoting highlighted SKUs...'}
                  {recProgressStep === 3 && 'Success!'}
                </h4>
                <p className="text-[11px] text-text-secondary leading-relaxed max-w-xs mx-auto">
                  {recProgressStep === 1 && 'Updating local Egyptian retailer catalog feeds and syncing pricing margins...'}
                  {recProgressStep === 2 && 'Configuring visibility tags, promoting featured items, and establishing bid scopes...'}
                  {recProgressStep === 3 && 'The recommendations have been applied successfully to your active products catalog.'}
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Simple loader helper icon
const Loader2 = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
