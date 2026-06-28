import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Radar,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertCircle,
  Sun,
  Moon,
} from "lucide-react";

export default function MerchantLogin({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (email === "merchant@priceradar.ai" && password === "password123") {
      setError("");
      navigate("/merchant/onboarding");
    } else {
      setError(
        "Invalid credentials. Please use the demo credentials provided below.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col relative overflow-hidden font-sans transition-colors duration-300">
      {/* DECORATIVE BACKGROUNDS */}
      <div className="absolute top-0 inset-x-0 h-full grid-overlay pointer-events-none z-0" />
      <div className="absolute top-24 left-[10%] w-96 h-96 radial-glow rounded-full pointer-events-none z-0 animate-float" />
      <div className="absolute bottom-24 right-[10%] w-96 h-96 radial-glow rounded-full pointer-events-none z-0 animate-float-delayed" />

      {/* Header bar with Back Link & Theme toggle */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between z-10 relative">
        <button
          onClick={() => navigate("/merchant")}
          className="flex items-center space-x-2 bg-transparent border-none cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-linear-to-tr from-primary to-accent text-white shadow-lg shrink-0">
            <Radar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-text-primary">
            PriceRadar Retailer
          </span>
        </button>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-all duration-200 cursor-pointer bg-transparent border-none"
        >
          {theme === "dark" ? (
            <Sun className="w-4.5 h-4.5" />
          ) : (
            <Moon className="w-4.5 h-4.5" />
          )}
        </button>
      </header>

      {/* Main Login Form Container */}
      <main className="flex-1 flex items-center justify-center p-4 z-10 relative">
        <div className="w-full max-w-md bg-card glass border border-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden transition-all duration-300">
          {/* Brand Logo & Title */}
          <div className="flex flex-col items-center text-center space-y-3.5">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-tr from-primary to-accent text-white shadow-lg overflow-hidden shrink-0">
              <Radar className="w-6 h-6 animate-pulse" />
              <div className="absolute inset-0 border border-white/20 rounded-2xl" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-text-primary">
                Retailer Portal
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary">
                Login to configure your store's AI pricing scanner and monitor
                competitors.
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-3.5 rounded-2xl text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email Field with robust flex layout */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-black uppercase text-muted tracking-wider">
                Email Address
              </label>
              <div
                className="flex items-center w-full bg-surface border border-border rounded-xl focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all pr-4"
                style={{ paddingLeft: "1rem" }}
              >
                <span className="text-muted flex items-center shrink-0">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="merchant@priceradar.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3 px-3 bg-transparent text-text-primary placeholder-muted text-xs outline-none font-semibold transition-all"
                />
              </div>
            </div>

            {/* Password Field with robust flex layout */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-black uppercase text-muted tracking-wider">
                Password
              </label>
              <div
                className="flex items-center w-full bg-surface border border-border rounded-xl focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all pr-3.5"
                style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
              >
                <span className="text-muted flex items-center shrink-0">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 px-3 bg-transparent text-text-primary placeholder-muted text-xs outline-none font-semibold transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted hover:text-text-primary transition-colors cursor-pointer bg-transparent border-none shrink-0"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3.5 bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex justify-center items-center gap-2 btn-gradient-shimmer"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo Credentials Helper Box */}
          <div className="bg-surface/50 border border-border/80 p-4 rounded-2xl text-left space-y-1.5">
            <span className="text-[9px] font-black uppercase text-primary tracking-widest block">
              Demo Credentials
            </span>
            <div className="text-[11px] font-medium text-text-secondary space-y-1 font-mono">
              <p>
                Email:{" "}
                <strong className="text-text-primary select-all">
                  merchant@priceradar.ai
                </strong>
              </p>
              <p>
                Password:{" "}
                <strong className="text-text-primary select-all">
                  password123
                </strong>
              </p>
            </div>
            <p className="text-[9px] text-muted pt-1 leading-relaxed">
              Use these credentials to view the store onboarding and connection
              simulator.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-muted font-medium z-10 relative">
        <p>
          © {new Date().getFullYear()} PriceRadar Egypt. Retailer onboarding
          portal.
        </p>
      </footer>
    </div>
  );
}
