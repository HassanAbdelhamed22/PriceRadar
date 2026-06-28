import React, { useState, useEffect } from 'react';
import { 
  X, Heart, Award, Sparkles, CheckCircle2, Gift, Trash2, 
  ExternalLink, ArrowUpRight, Zap, RefreshCw, Bookmark
} from 'lucide-react';
import productsData from '../data/products.json';

export default function ShopperProfileModal({ isOpen, onClose, wishlist, toggleWishlist, navigate }) {
  const [activeTab, setActiveTab] = useState('wishlist'); // 'wishlist', 'loyalty'
  
  // Local points system states
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('priceradar_shopper_points');
    return saved ? Number(saved) : 1250; // default start points
  });

  const [redeemedCodes, setRedeemedCodes] = useState(() => {
    const saved = localStorage.getItem('priceradar_redeemed_codes');
    return saved ? JSON.parse(saved) : [];
  });

  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemingReward, redeemingRewardSet] = useState(null);
  const [earnProgress, setEarnProgress] = useState({ review: false, alert: false, share: false });

  useEffect(() => {
    localStorage.setItem('priceradar_shopper_points', points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem('priceradar_redeemed_codes', JSON.stringify(redeemedCodes));
  }, [redeemedCodes]);

  if (!isOpen) return null;

  // Filter items in wishlist
  const wishlistItems = productsData
    .filter(p => wishlist.includes(p.id))
    .map(p => {
      const sortedStores = [...p.stores].sort((a, b) => a.price - b.price);
      return {
        id: p.id,
        name: p.name,
        brand: p.brand,
        image: p.image,
        price: sortedStores[0]?.price || 0,
        store: sortedStores[0]?.name || 'Unknown'
      };
    });

  // Earn points tasks
  const handleEarnPoints = (taskType, val) => {
    if (earnProgress[taskType]) return;
    setPoints(prev => prev + val);
    setEarnProgress(prev => ({ ...prev, [taskType]: true }));
  };

  // Redeem vouchers
  const handleRedeem = (reward) => {
    if (points < reward.cost) return;
    setIsRedeeming(true);
    redeemingRewardSet(reward);

    setTimeout(() => {
      setPoints(prev => prev - reward.cost);
      const code = `${reward.codePrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
      setRedeemedCodes(prev => [...prev, { title: reward.title, code, date: 'Just now' }]);
      setIsRedeeming(false);
      redeemingRewardSet(null);
    }, 2000);
  };

  const rewards = [
    { id: 1, title: 'Select Egypt EGP 100 Voucher', cost: 500, codePrefix: 'SELECT-LOYAL-100', desc: 'Valid on laptops and smart accessories at Select Egypt stores.' },
    { id: 2, title: '2B Egypt EGP 150 Voucher', cost: 750, codePrefix: '2B-SAVER-150', desc: 'Valid on smartphone and computing models online.' },
    { id: 3, title: 'Tradeline EGP 200 Voucher', cost: 1000, codePrefix: 'TL-PRO-200', desc: 'Valid on Apple device accessories across Egypt outlets.' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-0 sm:p-4 select-none">
      
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-background/85 backdrop-blur-xs transition-opacity duration-300 z-0" 
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md h-full sm:h-[calc(100vh-2rem)] bg-card border-l sm:border sm:rounded-3xl border-border/80 shadow-2xl flex flex-col justify-between z-10 overflow-hidden animate-slide-right select-none">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-border/60 flex items-center justify-between text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Award className="w-5.5 h-5.5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-text-primary">Shopper Profile</h3>
              <p className="text-[10px] text-primary font-black uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-primary" />
                <span>Gold Loyalty Member</span>
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary cursor-pointer border-none bg-transparent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 flex gap-2 border-b border-border/40 text-xs">
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`pb-3 font-bold px-2 relative cursor-pointer border-none bg-transparent ${
              activeTab === 'wishlist' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <span>Wishlist ({wishlistItems.length})</span>
            {activeTab === 'wishlist' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('loyalty')}
            className={`pb-3 font-bold px-2 relative cursor-pointer border-none bg-transparent flex items-center gap-1 ${
              activeTab === 'loyalty' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <span>Loyalty & Rewards</span>
            <span className="bg-primary/10 text-primary text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
              {points} pts
            </span>
            {activeTab === 'loyalty' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </div>

        {/* Content Pane */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin space-y-6">
          
          {activeTab === 'wishlist' && (
            /* ── TAB: WISHLIST ──────────────────────────────────── */
            <div className="space-y-4 text-left">
              {wishlistItems.length === 0 ? (
                <div className="py-16 text-center space-y-3.5 border border-dashed border-border rounded-2xl">
                  <Heart className="w-10 h-10 text-muted mx-auto" />
                  <p className="text-xs text-text-secondary font-semibold">Your wishlist is empty.</p>
                  <p className="text-[10px] text-muted max-w-[200px] mx-auto">Click the heart icon on search listing cards to track prices here.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {wishlistItems.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-surface/50 border border-border/80 rounded-2xl p-3 flex gap-3.5 items-center justify-between hover:border-border transition-colors relative"
                    >
                      <div className="flex gap-3 items-center min-w-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-12 h-12 object-cover rounded-xl bg-zinc-950/40"
                        />
                        <div className="min-w-0">
                          <span className="text-[9px] font-black text-muted uppercase tracking-wider block">{item.brand}</span>
                          <span className="text-xs font-extrabold text-text-primary block truncate max-w-[160px]">{item.name}</span>
                          <span className="text-[10px] text-success font-black block mt-0.5">cheapest: EGP {item.price.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            onClose();
                            navigate(`/product/${item.id}`);
                          }}
                          title="Compare Prices"
                          className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                        
                        <button
                          onClick={() => toggleWishlist(item.id)}
                          title="Remove"
                          className="p-2 rounded-xl bg-surface border border-border text-text-secondary hover:text-red-500 hover:border-red-500/20 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'loyalty' && (
            /* ── TAB: LOYALTY ───────────────────────────────────── */
            <div className="space-y-6 text-left">
              
              {/* Points summary card */}
              <div className="bg-linear-to-tr from-primary/15 to-accent/15 border border-primary/20 rounded-3xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-muted uppercase tracking-wider">Radar Points Pool</span>
                  <div className="flex items-center gap-1 text-[9px] font-black text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                    <Zap className="w-3 h-3 text-primary fill-primary animate-pulse" />
                    <span>Double Earn Mode</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-text-primary">{points}</span>
                  <span className="text-xs font-bold text-text-secondary">pts available</span>
                </div>

                {/* Progress bar to next reward */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-black text-text-secondary uppercase">
                    <span>Pro Saver tier</span>
                    <span>1,500 pts</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: `${Math.min((points / 1500) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>

              {/* Earn Points Tasks */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-text-primary uppercase tracking-wider">Earn Points Tasks</h4>
                
                <div className="space-y-2.5">
                  {[
                    { id: 'review', label: 'Verify lower retailer price', pts: 100, desc: 'Flag competitor price drops on Amazon or Noon.' },
                    { id: 'alert', label: 'Activate Price Drop alerts', pts: 50, desc: 'Add tech items to your watch alerts.' },
                    { id: 'share', label: 'Share price charts with friends', pts: 30, desc: 'Promote budget saving matches on socials.' }
                  ].map((task) => (
                    <div 
                      key={task.id}
                      className="bg-surface/50 border border-border/80 p-3 rounded-2xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5 text-left">
                        <span className="font-extrabold text-text-primary block">{task.label}</span>
                        <span className="text-[10px] text-text-secondary block leading-normal">{task.desc}</span>
                      </div>
                      
                      <button
                        onClick={() => handleEarnPoints(task.id, task.pts)}
                        disabled={earnProgress[task.id]}
                        className={`py-1.5 px-3 rounded-xl font-bold text-[10px] cursor-pointer shrink-0 border select-none transition-all ${
                          earnProgress[task.id] 
                            ? 'bg-success/10 border-success/20 text-success cursor-not-allowed' 
                            : 'bg-primary hover:bg-primary-hover text-white border-primary shadow-xs hover:scale-[1.02]'
                        }`}
                      >
                        {earnProgress[task.id] ? 'Completed' : `+${task.pts} pts`}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Redeem Rewards list */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-text-primary uppercase tracking-wider">Redeem Retailer Coupons</h4>
                <div className="space-y-2.5">
                  {rewards.map((reward) => {
                    const isRedeemed = redeemedCodes.some(c => c.title === reward.title);
                    return (
                      <div 
                        key={reward.id}
                        className="bg-surface/50 border border-border/80 p-3.5 rounded-2xl text-xs space-y-3 relative overflow-hidden"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-0.5 text-left">
                            <span className="font-black text-text-primary block">{reward.title}</span>
                            <p className="text-[10px] text-text-secondary leading-normal">{reward.desc}</p>
                          </div>
                          
                          <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0">
                            {reward.cost} pts
                          </span>
                        </div>

                        <div className="flex justify-between items-center border-t border-border/40 pt-3 mt-2">
                          <span className="text-[9px] font-black text-muted uppercase">Select Egypt Promo Code</span>
                          
                          <button
                            onClick={() => handleRedeem(reward)}
                            disabled={points < reward.cost || isRedeemed}
                            className={`py-1.5 px-4.5 rounded-xl font-black text-[10px] transition-all cursor-pointer border ${
                              isRedeemed 
                                ? 'bg-success/15 border-success/35 text-success cursor-not-allowed' 
                                : points < reward.cost 
                                  ? 'bg-card text-muted border-border cursor-not-allowed' 
                                  : 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-md hover:scale-[1.02]'
                            }`}
                          >
                            {isRedeemed ? 'Claimed' : 'Redeem'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Redeemed Codes Log */}
              {redeemedCodes.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black text-success uppercase tracking-wider">Active Promo Codes</h4>
                  <div className="space-y-2">
                    {redeemedCodes.map((codeObj, idx) => (
                      <div 
                        key={idx}
                        className="bg-success/5 border border-success/20 p-3 rounded-2xl flex justify-between items-center text-xs font-bold"
                      >
                        <div className="text-left space-y-0.5">
                          <span className="text-text-primary block font-extrabold">{codeObj.title}</span>
                          <span className="text-[9px] text-muted block font-mono">{codeObj.date}</span>
                        </div>
                        <span className="bg-card border border-success/30 px-3 py-1 rounded-xl text-success font-black font-mono tracking-wider">
                          {codeObj.code}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Drawer Footer */}
        <div className="p-5 border-t border-border/60 bg-surface/20 flex justify-between items-center select-none text-xs font-bold">
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Bookmark className="w-4 h-4 text-primary" />
            <span>Egypt Loyalty Partner Programs</span>
          </div>
          <span className="text-[10px] text-muted">v1.2</span>
        </div>

      </div>

      {/* Redemption Loading Animation Screen */}
      {isRedeeming && redeemingReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="bg-card glass border border-border rounded-3xl w-full max-w-sm p-8 text-center space-y-6 shadow-2xl">
            <div className="relative w-12 h-12 mx-auto">
              <RefreshCw className="w-12 h-12 text-primary animate-spin" />
            </div>
            
            <div className="space-y-1.5">
              <h4 className="font-black text-text-primary">Generating Discount Voucher</h4>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Deducting {redeemingReward.cost} points from balance and issuing verified promo code for {redeemingReward.title}...
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
