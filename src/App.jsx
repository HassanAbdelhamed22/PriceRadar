import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SearchResults from './components/SearchResults';
import ProductDetails from './components/ProductDetails';
import CategoriesPage from './components/CategoriesPage';
import DealsPage from './components/DealsPage';
import MerchantLandingPage from './components/MerchantLandingPage';
import MerchantLogin from './components/MerchantLogin';
import MerchantOnboarding from './components/MerchantOnboarding';

export default function App() {
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

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/search" element={<SearchResults theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/product/:id" element={<ProductDetails theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/categories" element={<CategoriesPage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/deals" element={<DealsPage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/merchant" element={<MerchantLandingPage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/merchant/login" element={<MerchantLogin theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/merchant/onboarding" element={<MerchantOnboarding theme={theme} toggleTheme={toggleTheme} />} />
      </Routes>
    </Router>
  );
}
