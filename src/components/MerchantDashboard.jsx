import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Radar, Sun, Moon, LogOut, CheckCircle2, AlertCircle, XCircle, 
  RotateCw, RefreshCw, Eye, EyeOff, Star, ShieldAlert, BarChart3, 
  Layers, Package, TrendingUp, DollarSign, Globe, ShoppingBag 
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

  // Connected Website State
  const [websiteStatus, setWebsiteStatus] = useState('Connected'); // 'Connected', 'Syncing', 'Disconnected'
  const [lastSyncTime, setLastSyncTime] = useState('15 mins ago');
  const [isSyncing, setIsSyncing] = useState(false);

  // Products Table States
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [toast, setToast] = useState('');

  // Inventory Overview Aggregations
  const totalProductsCount = products.length;
  const inStockCount = products.filter(p => p.stock === 'In Stock').length;
  const lowStockCount = products.filter(p => p.stock === 'Low Stock').length;
  const outOfStockCount = products.filter(p => p.stock === 'Out of Stock').length;

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
      // Reconnect
      setWebsiteStatus('Connected');
      setLastSyncTime('Just now');
      showToast('Website store reconnected!');
    } else {
      // Disconnect
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

  const handleToggleFeature = (id) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const nextFeatured = !p.isFeatured;
        showToast(nextFeatured ? `Promoted "${p.name}" as featured` : `Removed featured status from "${p.name}"`);
        return { ...p, isFeatured: nextFeatured };
      }
      return p;
    }));
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
              { label: 'Dashboard', icon: BarChart3, active: true },
              { label: 'Products Feed', icon: Package, active: false },
              { label: 'Sync Settings', icon: Globe, active: false },
              { label: 'Analytics Reports', icon: Layers, active: false, badge: 'Soon' }
            ].map((link, idx) => (
              <button 
                key={idx}
                className={`w-full py-3 px-4 rounded-xl flex items-center justify-between text-xs font-bold transition-all cursor-pointer bg-transparent border-none ${
                  link.active 
                    ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                    : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <link.icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="bg-primary/20 text-primary text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
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
              <span>Retailer Dashboard</span>
              <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full uppercase tracking-wider">Prototype</span>
            </h1>
            <p className="text-[11px] text-text-secondary mt-0.5 hidden sm:block">Welcome back. Monitoring pricing matching indexes in Cairo, Egypt.</p>
          </div>

          <div className="flex items-center gap-3.5">
            <button 
              onClick={toggleTheme} 
              aria-label="Toggle theme" 
              className="p-2 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-all duration-200 cursor-pointer bg-transparent border-none"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            
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

          {/* Row 1: Statistics Cards */}
          <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            
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
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
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
                  <span>Stock levels distribution</span>
                  <span>{totalProductsCount} total categories</span>
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
                            onClick={() => handleToggleFeature(product.id)}
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
                              <Star className="w-2 h-2 fill-white text-white" />
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
                        onClick={() => handleToggleFeature(product.id)}
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

        </main>
      </div>

    </div>
  );
}
