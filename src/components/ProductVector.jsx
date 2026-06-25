import React from 'react';

export default function ProductVector({ category, index = 0, className = "w-full h-full" }) {
  const cat = category?.toLowerCase();
  
  if (cat === 'phone' || cat === 'smartphones') {
    const gradients = [
      'bg-gradient-to-b from-orange-500 via-rose-500 to-indigo-600',
      'bg-gradient-to-b from-blue-600 via-violet-500 to-pink-500',
      'bg-gradient-to-b from-emerald-400 via-teal-600 to-cyan-700'
    ];
    const grad = gradients[index % gradients.length];
    return (
      <svg className={`${className} bg-slate-950 p-4`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Phone Frame */}
        <rect x="28" y="10" width="44" height="80" rx="8" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
        {/* Screen */}
        <rect x="30" y="12" width="40" height="76" rx="6" fill="url(#screenGradPhone)" />
        <defs>
          <linearGradient id="screenGradPhone" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={index === 0 ? "#ea580c" : index === 1 ? "#2563eb" : "#10b981"} />
            <stop offset="50%" stopColor={index === 0 ? "#f43f5e" : index === 1 ? "#7c3aed" : "#0d9488"} />
            <stop offset="100%" stopColor={index === 0 ? "#4f46e5" : index === 1 ? "#db2777" : "#0f766e"} />
          </linearGradient>
        </defs>
        {/* Dynamic Island */}
        <rect x="42" y="15" width="16" height="3.5" rx="1.75" fill="#000" />
        {/* Gloss reflection line */}
        <path d="M 30 12 L 70 58" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        {/* Screen details / icons (mini widget layout) */}
        <circle cx="36" cy="22" r="1.5" fill="rgba(255,255,255,0.4)" />
        <rect x="40" y="21" width="8" height="1.5" rx="0.75" fill="rgba(255,255,255,0.4)" />
        <rect x="36" y="76" width="28" height="8" rx="2" fill="rgba(0,0,0,0.2)" />
      </svg>
    );
  }
  
  if (cat === 'laptop' || cat === 'laptops') {
    return (
      <svg className={`${className} bg-slate-950 p-4`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Screen Bezel */}
        <rect x="18" y="20" width="64" height="42" rx="3" fill="#191d24" stroke="#475569" strokeWidth="1" />
        {/* Screen Display */}
        <rect x="20" y="22" width="60" height="38" rx="1" fill="url(#screenGradLaptop)" />
        <defs>
          <linearGradient id="screenGradLaptop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        {/* Gloss */}
        <path d="M 20 22 L 80 50" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        {/* Camera */}
        <circle cx="50" cy="21" r="0.5" fill="#000" />
        {/* Hinge */}
        <rect x="44" y="62" width="12" height="2" fill="#0f172a" />
        {/* Keyboard Deck base */}
        <path d="M 8 64 L 92 64 L 86 70 L 14 70 Z" fill="#334155" stroke="#475569" strokeWidth="1" />
        {/* Keyboard area */}
        <polygon points="20,65 80,65 78,68 22,68" fill="#0f172a" />
        {/* Trackpad */}
        <rect x="45" y="68.5" width="10" height="1" rx="0.5" fill="#1e293b" />
      </svg>
    );
  }

  if (cat === 'gaming') {
    return (
      <svg className={`${className} bg-slate-950 p-4`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Glow backdrop */}
        <circle cx="50" cy="50" r="25" fill="rgba(59,130,246,0.1)" filter="blur(8px)" />
        {/* Console black core */}
        <path d="M 47 15 L 53 15 L 51 85 L 49 85 Z" fill="#020617" stroke="#1e293b" strokeWidth="1" />
        {/* Blue LED Strip */}
        <line x1="50" y1="16" x2="50" y2="84" stroke="#3b82f6" strokeWidth="0.8" strokeLinecap="round" />
        {/* Left Curved Fin */}
        <path d="M 47 15 Q 38 40 48 84" fill="none" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />
        {/* Right Curved Fin */}
        <path d="M 53 15 Q 62 40 52 84" fill="none" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />
        {/* Console Base stand */}
        <ellipse cx="50" cy="85" rx="12" ry="2.5" fill="#0f172a" />
      </svg>
    );
  }

  if (cat === 'tv') {
    return (
      <svg className={`${className} bg-slate-950 p-4`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* TV Screen Thin Border */}
        <rect x="8" y="20" width="84" height="50" rx="2" fill="#0f172a" stroke="#475569" strokeWidth="1.2" />
        {/* Screen Display */}
        <rect x="9.5" y="21.5" width="81" height="47" rx="1" fill="url(#screenGradTv)" />
        <defs>
          <linearGradient id="screenGradTv" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        {/* Stand */}
        <polygon points="46,70 54,70 52,76 48,76" fill="#334155" />
        <rect x="36" y="76" width="28" height="2" rx="1" fill="#1e293b" />
        {/* Gloss */}
        <path d="M 9.5 21.5 L 90.5 60" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      </svg>
    );
  }

  if (cat === 'audio' || cat === 'headphones') {
    return (
      <svg className={`${className} bg-slate-950 p-4`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Headband */}
        <path d="M 28 50 A 22 22 0 0 1 72 50" fill="none" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
        {/* Left Cushion */}
        <rect x="22" y="44" width="9" height="18" rx="4.5" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
        {/* Right Cushion */}
        <rect x="69" y="44" width="9" height="18" rx="4.5" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
        {/* Left Arm extension */}
        <line x1="28" y1="44" x2="28" y2="52" stroke="#64748b" strokeWidth="2.5" />
        {/* Right Arm extension */}
        <line x1="72" y1="44" x2="72" y2="52" stroke="#64748b" strokeWidth="2.5" />
        {/* Wave indicator details */}
        <path d="M 12 53 Q 15 48 18 53" fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <path d="M 82 53 Q 85 48 88 53" fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      </svg>
    );
  }

  if (cat === 'watch') {
    return (
      <svg className={`${className} bg-slate-950 p-4`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Strap upper */}
        <rect x="42" y="8" width="16" height="26" rx="4" fill="#334155" />
        {/* Strap lower */}
        <rect x="42" y="66" width="16" height="26" rx="4" fill="#334155" />
        {/* Watch Body */}
        <rect x="32" y="28" width="36" height="42" rx="8" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
        {/* Watch Screen */}
        <rect x="34" y="30" width="32" height="38" rx="6.5" fill="url(#watchGrad)" />
        <defs>
          <linearGradient id="watchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>
        {/* Time display text shape */}
        <rect x="40" y="44" width="20" height="7" rx="1.5" fill="#fff" opacity="0.9" />
        <rect x="44" y="54" width="12" height="3" rx="1" fill="#fff" opacity="0.6" />
        {/* Digital Crown */}
        <rect x="68" y="46" width="2" height="6" rx="0.5" fill="#64748b" />
      </svg>
    );
  }

  return (
    <svg className={`${className} bg-slate-950 p-4`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="25" width="50" height="50" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
      <path d="M 25 25 L 75 75" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="10" fill="rgba(249,115,22,0.1)" stroke="#f97316" strokeWidth="1.5" />
    </svg>
  );
}
