import React, { useState, useEffect, useRef } from 'react';
import productsData from '../data/products.json';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Heart,
  Share2,
  TrendingDown,
  TrendingUp,
  Brain,
  Star,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  Info,
  Maximize2,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  Radar,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';

const PRODUCT_DETAILS_MAP = {
  1: {
    id: 1,
    title: 'Apple iPhone 15 Pro Max (256GB) - Titanium Blue',
    brand: 'Apple',
    category: 'Smartphones',
    rating: 4.9,
    reviewsCount: 1240,
    lowestPrice: 61999,
    highestPrice: 65990,
    averagePrice: 63500,
    priceDifference: 3991,
    trend: 'down',
    trendPercent: 6,
    confidence: 94,
    aiVerdict: 'Strong Buy. The lowest price tracked in the last 90 days. Prices are expected to rise slightly next week due to customs adjustments.',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=800',
    ],
    specifications: {
      'Display': '6.7-inch Super Retina XDR OLED, 120Hz',
      'Processor': 'Apple A17 Pro (3nm)',
      'Camera': '48MP Main + 12MP Ultra Wide + 12MP Telephoto (5x Optical Zoom)',
      'Battery': '4441 mAh with 20W Fast Charging',
      'Storage': '256GB / 512GB / 1TB',
      'OS': 'iOS 17 (Upgradable to iOS 18)',
      'Weight': '221g',
      'Warranty': '1 Year Local Warranty'
    },
    stores: [
      { name: 'Amazon.eg', price: 61999, originalPrice: 65990, stock: 'In Stock', delivery: 'Tomorrow, Free', logo: 'AMZ', cheapest: true, link: 'https://amazon.eg' },
      { name: 'Noon.eg', price: 62450, originalPrice: 64990, stock: 'In Stock', delivery: '2-3 Days, Free', logo: 'NON', cheapest: false, link: 'https://noon.eg' },
      { name: 'B.TECH', price: 64999, originalPrice: null, stock: 'In Stock', delivery: 'Store Pickup Available', logo: 'BTC', cheapest: false, link: 'https://btech.com' },
      { name: 'Jumia Egypt', price: 65200, originalPrice: 66999, stock: 'Limited Stock', delivery: '5-7 Days, EGP 50', logo: 'JUM', cheapest: false, link: 'https://jumia.com.eg' },
    ],
    priceHistory: {
      labels: ['May 1', 'May 10', 'May 20', 'Jun 1', 'Jun 10', 'Jun 20', 'Jun 24'],
      values: [65990, 64800, 63900, 64200, 62500, 62100, 61999]
    },
    relatedProducts: [
      {
        id: 2,
        title: 'Samsung Galaxy S24 Ultra (512GB) - Titanium Gray',
        brand: 'Samsung',
        price: 58500,
        save: 3500,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 6,
        title: 'Apple AirPods Pro (2nd Generation)',
        brand: 'Apple',
        price: 11200,
        save: 1300,
        image: 'https://images.unsplash.com/photo-1588449668365-d15e397f6787?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 3,
        title: 'Sony PlayStation 5 Console (Slim) - Middle East Version',
        brand: 'Sony',
        price: 23499,
        save: 2000,
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  2: {
    id: 2,
    title: 'Samsung Galaxy S24 Ultra (512GB) - Titanium Gray',
    brand: 'Samsung',
    category: 'Smartphones',
    rating: 4.8,
    reviewsCount: 856,
    lowestPrice: 58500,
    highestPrice: 62000,
    averagePrice: 60200,
    priceDifference: 3500,
    trend: 'stable',
    trendPercent: 0,
    confidence: 88,
    aiVerdict: 'Fair price. Stable market. Recommend buying if needed immediately, as drops are not expected soon.',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610945415295-d9bff067e59c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565849906660-446e295391e1?auto=format&fit=crop&w=800&q=80',
    ],
    specifications: {
      'Display': '6.8-inch Dynamic AMOLED 2X, 120Hz',
      'Processor': 'Snapdragon 8 Gen 3 for Galaxy',
      'Camera': '200MP Main + 50MP + 12MP + 10MP Quad Camera',
      'Battery': '5000 mAh with 45W Fast Charging',
      'Storage': '256GB / 512GB / 1TB',
      'OS': 'Android 14 with One UI 6.1',
      'Weight': '232g',
      'Warranty': '1 Year Local Warranty'
    },
    stores: [
      { name: 'Noon.eg', price: 58500, originalPrice: 62000, stock: 'In Stock', delivery: 'Tomorrow, Free', logo: 'NON', cheapest: true, link: 'https://noon.eg' },
      { name: 'Amazon.eg', price: 59900, originalPrice: 61500, stock: 'In Stock', delivery: '2-3 Days, Free', logo: 'AMZ', cheapest: false, link: 'https://amazon.eg' },
      { name: 'B.TECH', price: 62000, originalPrice: null, stock: 'In Stock', delivery: 'Store Pickup Available', logo: 'BTC', cheapest: false, link: 'https://btech.com' },
    ],
    priceHistory: {
      labels: ['May 1', 'May 10', 'May 20', 'Jun 1', 'Jun 10', 'Jun 20', 'Jun 24'],
      values: [62000, 61500, 60800, 60200, 59900, 58900, 58500]
    },
    relatedProducts: [
      {
        id: 1,
        title: 'Apple iPhone 15 Pro Max (256GB) - Titanium Blue',
        brand: 'Apple',
        price: 61999,
        save: 3991,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 6,
        title: 'Apple AirPods Pro (2nd Generation)',
        brand: 'Apple',
        price: 11200,
        save: 1300,
        image: 'https://images.unsplash.com/photo-1588449668365-d15e397f6787?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 3,
        title: 'Sony PlayStation 5 Console (Slim) - Middle East Version',
        brand: 'Sony',
        price: 23499,
        save: 2000,
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  3: {
    id: 3,
    title: 'Sony PlayStation 5 Console (Slim) - Middle East Version',
    brand: 'Sony',
    category: 'Gaming',
    rating: 4.9,
    reviewsCount: 3200,
    lowestPrice: 23499,
    highestPrice: 25499,
    averagePrice: 24500,
    priceDifference: 2000,
    trend: 'down',
    trendPercent: 8,
    confidence: 91,
    aiVerdict: 'Excellent deal. 8% below 30-day average. Buy now before stock drops.',
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=80',
    ],
    specifications: {
      'Type': 'Slim Digital / Disc Edition Console',
      'Storage': '1TB Custom High-Speed SSD',
      'Processor': 'Custom AMD Zen 2 CPU, RDNA 2 GPU',
      'Resolution': 'Up to 4K at 120Hz refresh rates',
      'Features': 'Tempest 3D AudioTech, Ray Tracing, HDR support',
      'Controller': 'DualSense Wireless Controller included',
      'Warranty': '2 Years Sony Middle East Warranty'
    },
    stores: [
      { name: 'Amazon.eg', price: 23499, originalPrice: 25499, stock: 'In Stock', delivery: 'Tomorrow, Free', logo: 'AMZ', cheapest: true, link: 'https://amazon.eg' },
      { name: 'Noon.eg', price: 24200, originalPrice: 24999, stock: 'In Stock', delivery: '2-3 Days', logo: 'NON', cheapest: false, link: 'https://noon.eg' },
      { name: 'Jumia Egypt', price: 25499, originalPrice: null, stock: 'In Stock', delivery: '5-7 Days', logo: 'JUM', cheapest: false, link: 'https://jumia.com.eg' },
    ],
    priceHistory: {
      labels: ['May 1', 'May 10', 'May 20', 'Jun 1', 'Jun 10', 'Jun 20', 'Jun 24'],
      values: [25499, 25100, 24800, 24500, 24200, 23800, 23499]
    },
    relatedProducts: [
      {
        id: 4,
        title: 'Lenovo Legion 5 Pro Intel Core i7 - RTX 4060',
        brand: 'Lenovo',
        price: 54200,
        save: 4300,
        image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 5,
        title: 'LG OLED C3 Series 55-inch 4K Smart TV',
        brand: 'LG',
        price: 47990,
        save: 6009,
        image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 1,
        title: 'Apple iPhone 15 Pro Max (256GB) - Titanium Blue',
        brand: 'Apple',
        price: 61999,
        save: 3991,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  4: {
    id: 4,
    title: 'Lenovo Legion 5 Pro Intel Core i7 - RTX 4060',
    brand: 'Lenovo',
    category: 'Laptops',
    rating: 4.7,
    reviewsCount: 420,
    lowestPrice: 54200,
    highestPrice: 58500,
    averagePrice: 56100,
    priceDifference: 4300,
    trend: 'up',
    trendPercent: 2,
    confidence: 76,
    aiVerdict: 'Slight price increases expected due to inventory strain. If you need it for work/study, purchase now.',
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    ],
    specifications: {
      'Display': '16-inch WQXGA IPS, 165Hz, 100% sRGB',
      'Processor': 'Intel Core i7-13700HX (16 Cores)',
      'Memory': '16GB DDR5 4800MHz (Upgradable)',
      'Graphics': 'NVIDIA GeForce RTX 4060 8GB GDDR6',
      'Storage': '1TB NVMe PCIe Gen4 SSD',
      'OS': 'Windows 11 Home',
      'Weight': '2.5kg',
      'Warranty': '2 Years Lenovo Egypt Warranty'
    },
    stores: [
      { name: 'Noon.eg', price: 54200, originalPrice: 58500, stock: 'In Stock', delivery: '2-3 Days, Free', logo: 'NON', cheapest: true, link: 'https://noon.eg' },
      { name: 'Amazon.eg', price: 56900, originalPrice: null, stock: 'In Stock', delivery: 'Tomorrow, Free', logo: 'AMZ', cheapest: false, link: 'https://amazon.eg' },
      { name: 'B.TECH', price: 58500, originalPrice: 62000, stock: 'In Stock', delivery: 'Store Pickup Available', logo: 'BTC', cheapest: false, link: 'https://btech.com' },
    ],
    priceHistory: {
      labels: ['May 1', 'May 10', 'May 20', 'Jun 1', 'Jun 10', 'Jun 20', 'Jun 24'],
      values: [58500, 57900, 56800, 56000, 55200, 54900, 54200]
    },
    relatedProducts: [
      {
        id: 1,
        title: 'Apple iPhone 15 Pro Max (256GB) - Titanium Blue',
        brand: 'Apple',
        price: 61999,
        save: 3991,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 2,
        title: 'Samsung Galaxy S24 Ultra (512GB) - Titanium Gray',
        brand: 'Samsung',
        price: 58500,
        save: 3500,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 3,
        title: 'Sony PlayStation 5 Console (Slim) - Middle East Version',
        brand: 'Sony',
        price: 23499,
        save: 2000,
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  5: {
    id: 5,
    title: 'LG OLED C3 Series 55-inch 4K Smart TV',
    brand: 'LG',
    category: 'TV',
    rating: 4.8,
    reviewsCount: 650,
    lowestPrice: 47990,
    highestPrice: 53999,
    averagePrice: 51200,
    priceDifference: 6009,
    trend: 'down',
    trendPercent: 11,
    confidence: 93,
    aiVerdict: 'Excellent deal. OLED C3 TV models are heavily discounted ahead of the new model release. Buy now.',
    images: [
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552533267-30f555c6e38b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1461151304267-386db973c280?auto=format&fit=crop&w=800&q=80',
    ],
    specifications: {
      'Display': '55-inch 4K OLED (Self-lit Pixels)',
      'Processor': 'a9 AI Processor Gen6 4K',
      'Smart TV': 'webOS 23 with ThinQ AI',
      'Gaming': '0.1ms Response, G-Sync Compatible, 4x HDMI 2.1',
      'Audio': '9.1.2 Virtual Surround Sound, Dolby Atmos',
      'Warranty': '2 Years LG Egypt Warranty'
    },
    stores: [
      { name: 'B.TECH', price: 47990, originalPrice: null, stock: 'In Stock', delivery: 'Delivery Tomorrow', logo: 'BTC', cheapest: true, link: 'https://btech.com' },
      { name: 'Noon.eg', price: 48500, originalPrice: 50999, stock: 'In Stock', delivery: '2-3 Days', logo: 'NON', cheapest: false, link: 'https://noon.eg' },
      { name: 'Amazon.eg', price: 53999, originalPrice: null, stock: 'Limited Stock', delivery: '3-4 Days', logo: 'AMZ', cheapest: false, link: 'https://amazon.eg' },
    ],
    priceHistory: {
      labels: ['May 1', 'May 10', 'May 20', 'Jun 1', 'Jun 10', 'Jun 20', 'Jun 24'],
      values: [53999, 52800, 51500, 50200, 48900, 48200, 47990]
    },
    relatedProducts: [
      {
        id: 3,
        title: 'Sony PlayStation 5 Console (Slim) - Middle East Version',
        brand: 'Sony',
        price: 23499,
        save: 2000,
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 4,
        title: 'Lenovo Legion 5 Pro Intel Core i7 - RTX 4060',
        brand: 'Lenovo',
        price: 54200,
        save: 4300,
        image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 2,
        title: 'Samsung Galaxy S24 Ultra (512GB) - Titanium Gray',
        brand: 'Samsung',
        price: 58500,
        save: 3500,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  6: {
    id: 6,
    title: 'Apple AirPods Pro (2nd Generation)',
    brand: 'Apple',
    category: 'Audio',
    rating: 4.9,
    reviewsCount: 4500,
    lowestPrice: 11200,
    highestPrice: 12500,
    averagePrice: 11800,
    priceDifference: 1300,
    trend: 'stable',
    trendPercent: 0,
    confidence: 90,
    aiVerdict: 'Stable pricing structure. Rare discounts on Apple accessories. Safe to purchase.',
    images: [
      'https://images.unsplash.com/photo-1588449668365-d15e397f6787?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    ],
    specifications: {
      'Audio Chip': 'Apple H2 Headphone Chip',
      'Noise Cancellation': 'Active Noise Cancellation & Adaptive Transparency',
      'Dust/Water': 'IP54 Sweat and water resistance',
      'Battery': 'Up to 6 hours listening time, 30 hours with case',
      'Charging Case': 'MagSafe Case (USB-C) with speaker and lanyard loop',
      'Warranty': '1 Year Apple International Warranty'
    },
    stores: [
      { name: 'Amazon.eg', price: 11200, originalPrice: 12500, stock: 'In Stock', delivery: 'Tomorrow, Free', logo: 'AMZ', cheapest: true, link: 'https://amazon.eg' },
      { name: 'Noon.eg', price: 11850, originalPrice: 12000, stock: 'In Stock', delivery: '2-3 Days', logo: 'NON', cheapest: false, link: 'https://noon.eg' },
      { name: 'B.TECH', price: 12500, originalPrice: null, stock: 'In Stock', delivery: 'Store Pickup Available', logo: 'BTC', cheapest: false, link: 'https://btech.com' },
    ],
    priceHistory: {
      labels: ['May 1', 'May 10', 'May 20', 'Jun 1', 'Jun 10', 'Jun 20', 'Jun 24'],
      values: [12500, 12200, 11950, 11850, 11800, 11450, 11200]
    },
    relatedProducts: [
      {
        id: 1,
        title: 'Apple iPhone 15 Pro Max (256GB) - Titanium Blue',
        brand: 'Apple',
        price: 61999,
        save: 3991,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 2,
        title: 'Samsung Galaxy S24 Ultra (512GB) - Titanium Gray',
        brand: 'Samsung',
        price: 58500,
        save: 3500,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 3,
        title: 'Sony PlayStation 5 Console (Slim) - Middle East Version',
        brand: 'Sony',
        price: 23499,
        save: 2000,
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80'
      }
    ]
  }
};

const LogoIcon = () => (
  <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-tr from-primary to-accent text-white shadow-lg overflow-hidden shrink-0">
    <Radar className="w-5.5 h-5.5 animate-pulse" />
    <div className="absolute inset-0 border border-white/20 rounded-xl" />
  </div>
);

export default function ProductDetails({ theme, toggleTheme }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const selectedId = parseInt(id, 10) || 1;
  
  // Find product from JSON catalog
  const product = productsData.find(p => p.id === selectedId) || productsData[0];
  
  // Map stores
  const sortedStores = [...product.stores].sort((a, b) => a.price - b.price);
  const cheapest = sortedStores[0];
  const mostExpensive = sortedStores[sortedStores.length - 1];
  
  const lowestPrice = cheapest ? cheapest.price : 0;
  const highestPrice = mostExpensive ? mostExpensive.price : 0;
  const averagePrice = Math.round(product.stores.reduce((acc, s) => acc + s.price, 0) / product.stores.length);
  const priceDifference = highestPrice - lowestPrice;
  
  const mappedStores = product.stores.map(s => {
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
      originalPrice: s.price + Math.round(s.price * 0.1),
      stock: 'In Stock',
      delivery: '2-3 Days, Free',
      logo: storeLogo,
      cheapest: cheapest && s.name === cheapest.name,
      link: s.url || '#'
    };
  });
  
  const historyValues = product.priceHistory || [lowestPrice, lowestPrice + 1000, lowestPrice - 500];
  const historyLabels = historyValues.map((_, idx) => `Day ${idx + 1}`);
  
  let aiVerdict = 'Price stable. Safe to buy.';
  let confidence = 80;
  let trendPercent = 5;
  let action = 'Buy Now';
  let trend = 'stable';
  if (product.recommendation) {
    action = product.recommendation.action;
    confidence = product.recommendation.confidence;
    trendPercent = Math.abs(parseInt(product.recommendation.expectedChange)) || 5;
    trend = product.recommendation.expectedChange.startsWith('-') ? 'down' : 'up';
    aiVerdict = `${action}. The model forecasts a ${product.recommendation.expectedChange} change in pricing. Historical log indicates a confidence index of ${confidence}%.`;
  }
  
  const specifications = product.category === 'Smartphones' ? {
    'Display': '6.7-inch OLED Super Retina, 120Hz',
    'Processor': 'Octa-Core Flagship CPU (4nm)',
    'Camera': '50MP Quad Camera System with OIS',
    'Battery': '5000 mAh with 45W Fast Charging',
    'Storage': '256GB / 512GB Options',
    'OS': 'Android 14 / iOS 17',
    'Weight': '210g',
    'Warranty': '1 Year International Warranty'
  } : {
    'Display': '14.2-inch Liquid Retina IPS Display, 120Hz',
    'Processor': 'Next-gen Performance Octa-Core Processor',
    'Camera': '1080p FaceTime HD camera',
    'Battery': 'Up to 18 hours wireless web runtime',
    'Storage': '512GB PCIe-based onboard SSD',
    'OS': 'macOS / Windows 11 Home',
    'Weight': '1.24 kg / 2.7 lbs',
    'Warranty': '1 Year Local Warranty'
  };
  
  const relatedProducts = productsData
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3)
    .map(p => {
      const pSortedStores = [...p.stores].sort((a, b) => a.price - b.price);
      const pLowest = pSortedStores[0] ? pSortedStores[0].price : 0;
      const pHighest = pSortedStores[pSortedStores.length - 1] ? pSortedStores[pSortedStores.length - 1].price : 0;
      return {
        id: p.id,
        title: p.name,
        brand: p.brand,
        price: pLowest,
        save: pHighest - pLowest,
        image: p.image
      };
    });
    
  const productData = {
    id: product.id,
    title: product.name,
    brand: product.brand,
    category: product.category,
    rating: product.rating || 4.5,
    reviewsCount: product.reviews || 120,
    lowestPrice: lowestPrice,
    highestPrice: highestPrice,
    averagePrice: averagePrice,
    priceDifference: priceDifference,
    trend: trend,
    trendPercent: trendPercent,
    confidence: confidence,
    aiVerdict: aiVerdict,
    images: product.images || [product.image],
    specifications: specifications,
    stores: mappedStores,
    priceHistory: {
      labels: historyLabels,
      values: historyValues
    },
    relatedProducts: relatedProducts
  };
  
  const cheapestStore = productData.stores.find(s => s.cheapest);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });
  const [activeTab, setActiveTab] = useState('specs');
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const [chartPeriod, setChartPeriod] = useState('30d');



  const [activeChartTab, setActiveChartTab] = useState('history');
  const [alertPrice, setAlertPrice] = useState('');
  const [alertCreated, setAlertCreated] = useState(false);

  const handleSetAlert = () => {
    setAlertCreated(true);
    setTimeout(() => setAlertCreated(false), 3000);
  };

  // Reset active image and scroll to top when product changes
  useEffect(() => {
    setActiveImageIndex(0);
    window.scrollTo(0, 0);
  }, [selectedId]);

  // Watch scroll for sticky buy card
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsStickyVisible(true);
      } else {
        setIsStickyVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Image Zoom logic
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${productData.images[activeImageIndex]})`,
      backgroundPosition: `${x}% ${y}%`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', backgroundPosition: '0% 0%' });
  };



  return (
    <div className="min-h-screen bg-background text-text-primary font-sans relative pb-20">
      
      {/* ----------------------------------------------------
         DECORATIVE GLOW BACKGROUNDS
      ------------------------------------------------------- */}
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
            <button onClick={() => navigate('/deals')} className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer bg-transparent border-none">Deals</button>
            <button onClick={() => navigate('/merchant')} className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer bg-transparent border-none">For Retailers</button>
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
            <button onClick={() => { setMobileMenuOpen(false); navigate('/categories'); }} className="text-left font-semibold text-text-secondary hover:text-primary transition-colors h-11 flex items-center w-full bg-transparent border-none cursor-pointer">Categories</button>
            <button onClick={() => { setMobileMenuOpen(false); navigate('/deals'); }} className="text-left font-semibold text-text-secondary hover:text-primary transition-colors h-11 flex items-center w-full bg-transparent border-none cursor-pointer">Deals</button>
            <button onClick={() => { setMobileMenuOpen(false); navigate('/merchant'); }} className="text-left font-semibold text-text-secondary hover:text-primary transition-colors h-11 flex items-center w-full bg-transparent border-none cursor-pointer">For Retailers</button>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10 space-y-6">
        
        {/* Back and Action Toolbar */}
        <div className="flex items-center justify-between pb-2">
          <button 
            onClick={() => navigate(-1)}
            className="h-11 flex items-center space-x-2 px-4 rounded-xl bg-card border border-border text-xs font-bold text-text-primary hover:bg-surface transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Search</span>
          </button>
          <div className="flex items-center space-x-3">
            <button className="w-11 h-11 flex items-center justify-center bg-card border border-border rounded-xl hover:bg-surface text-text-secondary hover:text-text-primary transition-all cursor-pointer">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="w-11 h-11 flex items-center justify-center bg-card border border-border rounded-xl hover:bg-surface text-text-secondary hover:text-danger transition-all cursor-pointer">
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Product Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Left Column: Image Gallery & Zoom (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {/* Main Image container with Zoom capability */}
            <div className="relative aspect-square w-full bg-zinc-950/40 border border-border rounded-2xl overflow-hidden shadow-md">
              <img
                src={productData.images[activeImageIndex]}
                alt={productData.title}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 hover:scale-[1.02]"
              />
              {/* Zoom Panel */}
              <div
                style={zoomStyle}
                className="absolute inset-0 pointer-events-none border border-border rounded-2xl bg-no-repeat bg-size-[200%] bg-zinc-950 z-10"
              />
              <div className="absolute bottom-3 right-3 p-2 bg-black/60 backdrop-blur rounded-lg text-white pointer-events-none">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>

            {/* Thumbnail selector */}
            <div className="grid grid-cols-3 gap-3">
              {productData.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all bg-zinc-950/40 ${
                    activeImageIndex === index ? 'border-primary' : 'border-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Title, Ratings, Fast info, Stores Summary (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            {/* Top info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2 text-xs font-bold text-muted uppercase tracking-widest">
                <span>{productData.brand}</span>
                <span>•</span>
                <span className="text-primary">{productData.category}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                {productData.title}
              </h2>
              
              {/* Rating and Reviews */}
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center text-warning">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4.5 h-4.5 fill-warning" />
                  ))}
                  <span className="ml-1.5 font-bold text-text-primary text-sm">{productData.rating}</span>
                </div>
                <span className="text-xs text-muted font-semibold">({productData.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Instant Price Insight Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-card border border-border rounded-2xl glass-card">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted uppercase">Cheapest Store Price</p>
                <p className="text-2xl font-black text-success tracking-tight">
                  EGP {productData.lowestPrice.toLocaleString()}
                </p>
                <p className="text-[10px] text-text-secondary font-bold">
                  at {cheapestStore.name} <span className="bg-success/15 text-success text-[8px] px-1 rounded font-black uppercase">Cheapest</span>
                </p>
              </div>

              <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-border pt-3 sm:pt-0 sm:pl-4">
                <p className="text-[10px] font-bold text-muted uppercase">Price Difference</p>
                <p className="text-xl font-extrabold text-primary tracking-tight">
                  Save EGP {productData.priceDifference.toLocaleString()}
                </p>
                <p className="text-[10px] text-text-secondary font-medium">Compared to highest store price</p>
              </div>

              <div className="space-y-1 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-4">
                <p className="text-[10px] font-bold text-muted uppercase">Expected Trend</p>
                <div className="flex items-center space-x-1.5 text-success mt-0.5 font-black text-sm">
                  {productData.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 text-danger" />}
                  <span>{productData.trend === 'down' ? 'Down' : 'Up'} ({productData.trendPercent}%)</span>
                </div>
                <p className="text-[10px] text-text-secondary font-medium">{productData.confidence}% Prediction Confidence</p>
              </div>

              <div className="space-y-1 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-4">
                <p className="text-[10px] font-bold text-muted uppercase">AI Radar Deal Score</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="relative w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center font-extrabold text-xs text-primary shadow-sm bg-primary/5">
                    {productData.confidence}
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-primary uppercase">GRADE A+</span>
                    <p className="text-[9px] text-text-secondary font-medium">Highly Optimized Deal</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Recommendation Alert */}
            <div className="p-4 bg-success/5 border border-success/20 rounded-xl flex items-start space-x-3.5 text-sm">
              <div className="p-2 bg-success/15 rounded-lg text-success shrink-0">
                <Brain className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-success uppercase text-[10px] tracking-wider">AI Recommendation Verdict</p>
                <p className="text-success-800 dark:text-success/90 font-medium leading-relaxed">
                  {productData.aiVerdict}
                </p>
              </div>
            </div>

            {/* AI Smart Deal Score & Breakdown Card */}
            <div className="bg-card glass border border-border rounded-2xl p-5 shadow-sm space-y-4">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-text-primary flex items-center space-x-2">
                <Brain className="w-4.5 h-4.5 text-primary" />
                <span>AI Deal Score Insights & Analysis</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted uppercase">Historical Index</span>
                  <div className="flex items-center space-x-1 text-xs font-black text-success">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>All-Time Low Range</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted uppercase">Market Volatility</span>
                  <div className="text-xs font-black text-text-primary">Low (Stable Retailer Stock)</div>
                </div>
                <div className="space-y-1 border-t border-border/40 pt-2.5 sm:border-t-0">
                  <span className="text-[10px] font-bold text-muted uppercase">Restocking Estimate</span>
                  <div className="text-xs font-black text-warning">Expected in 12 days</div>
                </div>
                <div className="space-y-1 border-t border-border/40 pt-2.5 sm:border-t-0">
                  <span className="text-[10px] font-bold text-muted uppercase">Deal Health</span>
                  <div className="text-xs font-black text-success">98% Positive Score</div>
                </div>
              </div>
            </div>

            {/* Guaranteed Badges */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-surface/40 rounded-xl border border-border flex items-center space-x-2 text-xs">
                <ShieldCheck className="w-4.5 h-4.5 text-primary shrink-0" />
                <span className="font-semibold truncate">Authentic Dealer</span>
              </div>
              <div className="p-3 bg-surface/40 rounded-xl border border-border flex items-center space-x-2 text-xs">
                <Truck className="w-4.5 h-4.5 text-primary shrink-0" />
                <span className="font-semibold truncate">Fast Express Shipping</span>
              </div>
              <div className="p-3 bg-surface/40 rounded-xl border border-border flex items-center space-x-2 text-xs">
                <RotateCcw className="w-4.5 h-4.5 text-primary shrink-0" />
                <span className="font-semibold truncate">Easy Returns</span>
              </div>
            </div>

          </div>
        </div>

        {/* Store Comparison & Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Store Comparison (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl font-bold tracking-tight">Compare Prices Across Retailers</h3>
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="divide-y divide-border">
                {productData.stores.map((store, stIdx) => (
                  <div 
                    key={store.name} 
                    className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover-tilt animate-slide-up-reveal ${
                      store.cheapest ? 'bg-success/5' : 'hover:bg-surface/50'
                    }`}
                    style={{ animationDelay: `${stIdx * 80}ms` }}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Logo Pill */}
                      <span className={`text-xs font-black tracking-widest px-2.5 py-1 rounded-lg border ${
                        store.logo === 'AMZ' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        store.logo === 'NON' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        store.logo === 'BTC' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        'bg-gray-100 text-gray-800 border-gray-200'
                      }`}>
                        {store.logo}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-text-primary text-sm">{store.name}</span>
                          {store.cheapest && (
                            <span className="bg-success text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                              Cheapest
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted font-medium mt-0.5">{store.delivery} • {store.stock}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-6">
                      <div className="text-left sm:text-right">
                        <span className={`text-lg font-black ${store.cheapest ? 'text-success' : 'text-text-primary'}`}>
                          EGP {store.price.toLocaleString()}
                        </span>
                        {store.originalPrice && (
                          <p className="text-xs text-muted line-through">
                            EGP {store.originalPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                      
                      <a
                        href={store.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`h-11 px-4 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1.5 shrink-0 ${
                          store.cheapest 
                            ? 'bg-success hover:bg-success-hover text-white' 
                            : 'bg-surface hover:bg-border text-text-primary border border-border'
                        }`}
                      >
                        <span>Buy Now</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats & Predictions Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xl font-bold tracking-tight">Price Trend & History</h3>
            
            {/* Live Store Spread Bar Chart Card */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center text-xs font-bold text-text-primary">
                <span className="uppercase tracking-wider">Live Store Spreads (EGP)</span>
                <span className="text-success text-[10px] uppercase font-black tracking-widest bg-success/10 px-2 py-0.5 rounded">Store Compare</span>
              </div>
              
              {/* Bar Chart for Store Spread */}
              <div className="space-y-3 pt-2">
                {productData.stores.map((store, stIdx) => {
                  const maxPrice = productData.highestPrice;
                  const widthPercent = Math.max(35, Math.min(100, (store.price / maxPrice) * 100));
                  return (
                    <div key={store.name} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-text-secondary">
                        <span className="flex items-center space-x-1.5">
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-surface border border-border text-text-primary">{store.logo}</span>
                          <span>{store.name}</span>
                        </span>
                        <span className={store.cheapest ? 'text-success font-black' : 'text-text-primary'}>
                          EGP {store.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-surface rounded-full overflow-hidden border border-border/50">
                        <div 
                          style={{ 
                            width: `${widthPercent}%`,
                            animation: `bar-grow 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${stIdx * 120}ms both`
                          }}
                          className={`h-full rounded-full bg-linear-to-r ${
                            store.cheapest ? 'from-success to-emerald-400' : 'from-primary to-orange-400'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SVG Price History & Forecast Card */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex space-x-3 border-b border-border/40 pb-1">
                  <button
                    onClick={() => setActiveChartTab('history')}
                    className={`text-xs font-black uppercase tracking-wider pb-1.5 transition-all cursor-pointer ${
                      activeChartTab === 'history' ? 'border-b-2 border-primary text-text-primary font-extrabold' : 'text-muted hover:text-text-primary'
                    }`}
                  >
                    History
                  </button>
                  <button
                    onClick={() => setActiveChartTab('forecast')}
                    className={`text-xs font-black uppercase tracking-wider pb-1.5 transition-all cursor-pointer ${
                      activeChartTab === 'forecast' ? 'border-b-2 border-primary text-text-primary font-extrabold' : 'text-muted hover:text-text-primary'
                    }`}
                  >
                    AI Forecast (7d)
                  </button>
                </div>
                {activeChartTab === 'history' && (
                  <div className="flex bg-surface rounded-lg p-0.5 text-[10px] font-bold">
                    {['30d', '90d', '1y'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setChartPeriod(p)}
                        className={`px-2 py-1 rounded-md transition-all ${
                          chartPeriod === p ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        {p.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Beautiful responsive SVG chart */}
              <div className="h-44 w-full relative">
                {activeChartTab === 'history' ? (
                  <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Grid Lines */}
                    <line x1="0" y1="10" x2="100" y2="10" stroke="var(--color-border)" strokeWidth="0.2" strokeDasharray="1,1" />
                    <line x1="0" y1="20" x2="100" y2="20" stroke="var(--color-border)" strokeWidth="0.2" strokeDasharray="1,1" />
                    <line x1="0" y1="30" x2="100" y2="30" stroke="var(--color-border)" strokeWidth="0.2" strokeDasharray="1,1" />

                    {/* SVG Area */}
                    <path
                      d={`M 0 40 L 0 ${40 - (productData.priceHistory.values[0] - productData.lowestPrice * 0.95) / (productData.highestPrice - productData.lowestPrice * 0.95) * 30}
                          L 16 ${40 - (productData.priceHistory.values[1] - productData.lowestPrice * 0.95) / (productData.highestPrice - productData.lowestPrice * 0.95) * 30}
                          L 33 ${40 - (productData.priceHistory.values[2] - productData.lowestPrice * 0.95) / (productData.highestPrice - productData.lowestPrice * 0.95) * 30}
                          L 50 ${40 - (productData.priceHistory.values[3] - productData.lowestPrice * 0.95) / (productData.highestPrice - productData.lowestPrice * 0.95) * 30}
                          L 66 ${40 - (productData.priceHistory.values[4] - productData.lowestPrice * 0.95) / (productData.highestPrice - productData.lowestPrice * 0.95) * 30}
                          L 83 ${40 - (productData.priceHistory.values[5] - productData.lowestPrice * 0.95) / (productData.highestPrice - productData.lowestPrice * 0.95) * 30}
                          L 100 ${40 - (productData.priceHistory.values[6] - productData.lowestPrice * 0.95) / (productData.highestPrice - productData.lowestPrice * 0.95) * 30}
                          L 100 40 Z`}
                      fill="url(#chartGrad)"
                    />
                    {/* SVG Line — draws itself on render */}
                    <path
                      d={`M 0 ${40 - (productData.priceHistory.values[0] - productData.lowestPrice * 0.95) / (productData.highestPrice - productData.lowestPrice * 0.95) * 30}
                          L 16 ${40 - (productData.priceHistory.values[1] - productData.lowestPrice * 0.95) / (productData.highestPrice - productData.lowestPrice * 0.95) * 30}
                          L 33 ${40 - (productData.priceHistory.values[2] - productData.lowestPrice * 0.95) / (productData.highestPrice - productData.lowestPrice * 0.95) * 30}
                          L 50 ${40 - (productData.priceHistory.values[3] - productData.lowestPrice * 0.95) / (productData.highestPrice - productData.lowestPrice * 0.95) * 30}
                          L 66 ${40 - (productData.priceHistory.values[4] - productData.lowestPrice * 0.95) / (productData.highestPrice - productData.lowestPrice * 0.95) * 30}
                          L 83 ${40 - (productData.priceHistory.values[5] - productData.lowestPrice * 0.95) / (productData.highestPrice - productData.lowestPrice * 0.95) * 30}
                          L 100 ${40 - (productData.priceHistory.values[6] - productData.lowestPrice * 0.95) / (productData.highestPrice - productData.lowestPrice * 0.95) * 30}`}
                      fill="none"
                      stroke="var(--color-primary)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-draw-path"
                    />
                  </svg>
                ) : (
                  <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    <line x1="0" y1="10" x2="100" y2="10" stroke="var(--color-border)" strokeWidth="0.2" strokeDasharray="1,1" />
                    <line x1="0" y1="20" x2="100" y2="20" stroke="var(--color-border)" strokeWidth="0.2" strokeDasharray="1,1" />
                    <line x1="0" y1="30" x2="100" y2="30" stroke="var(--color-border)" strokeWidth="0.2" strokeDasharray="1,1" />

                    {/* Forecast Line */}
                    {productData.trend === 'down' ? (
                      <>
                        <path
                          d="M 0 15 L 20 18 L 40 22 L 60 25 L 80 29 L 100 32 L 100 40 L 0 40 Z"
                          fill="url(#forecastGrad)"
                        />
                        <path
                          d="M 0 15 L 20 18 L 40 22 L 60 25 L 80 29 L 100 32"
                          fill="none"
                          stroke="#a855f7"
                          strokeWidth="1.5"
                          strokeDasharray="2,2"
                        />
                      </>
                    ) : (
                      <>
                        <path
                          d="M 0 25 L 20 22 L 40 18 L 60 15 L 80 12 L 100 9 L 100 40 L 0 40 Z"
                          fill="url(#forecastGrad)"
                        />
                        <path
                          d="M 0 25 L 20 22 L 40 18 L 60 15 L 80 12 L 100 9"
                          fill="none"
                          stroke="#a855f7"
                          strokeWidth="1.5"
                          strokeDasharray="2,2"
                        />
                      </>
                    )}
                  </svg>
                )}

                {/* Legend & labels */}
                <div className="absolute top-2 left-2 text-[9px] text-muted font-bold">
                  {activeChartTab === 'history' ? `EGP ${productData.highestPrice.toLocaleString()}` : 'Forecasting Band Upper'}
                </div>
                <div className="absolute bottom-2 left-2 text-[9px] text-muted font-bold">
                  {activeChartTab === 'history' ? `EGP ${productData.lowestPrice.toLocaleString()}` : 'Forecasting Band Lower'}
                </div>
              </div>

              {/* Stat Summary Row */}
              <div className="grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
                <div>
                  <p className="text-[9px] font-bold text-muted uppercase">Highest Price</p>
                  <p className="text-sm font-black text-text-primary mt-0.5">EGP {productData.highestPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-muted uppercase">Lowest Price</p>
                  <p className="text-sm font-black text-text-primary mt-0.5">EGP {productData.lowestPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-muted uppercase">Average Price</p>
                  <p className="text-sm font-black text-text-primary mt-0.5">EGP {productData.averagePrice.toLocaleString()}</p>
                </div>
              </div>

              {/* Target Price Alert Box */}
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-text-primary">
                  <span>Set Target Price Alert</span>
                  <span className="text-primary font-black">EGP {(productData.lowestPrice * 0.95).toLocaleString()}</span>
                </div>
                <div className="flex space-x-2">
                  <div className="relative grow flex items-center bg-surface border border-border rounded-xl px-3 h-11">
                    <span className="text-xs text-muted font-bold mr-1.5">EGP</span>
                    <input 
                      type="number" 
                      placeholder={(productData.lowestPrice * 0.95).toFixed(0)} 
                      value={alertPrice}
                      onChange={(e) => setAlertPrice(e.target.value)}
                      className="w-full bg-transparent outline-none text-xs font-bold text-text-primary"
                    />
                  </div>
                  <button 
                    onClick={handleSetAlert}
                    className="bg-primary hover:bg-primary-hover text-white px-4 h-11 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border-none"
                  >
                    Track Drop
                  </button>
                </div>
                {alertCreated && (
                  <p className="text-[10px] font-bold text-success flex items-center space-x-1 text-left animate-fade-in mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Price Alert created! We will notify you when price drops.</span>
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Tabs section: Specs / Reviews */}
        <div className="mb-12">
          <div className="flex border-b border-border mb-6">
            <button
              onClick={() => setActiveTab('specs')}
              className={`h-11 text-sm font-bold border-b-2 transition-all mr-6 flex items-center cursor-pointer bg-transparent border-none ${
                activeTab === 'specs' ? 'border-primary text-text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('warranty')}
              className={`h-11 text-sm font-bold border-b-2 transition-all flex items-center cursor-pointer bg-transparent border-none ${
                activeTab === 'warranty' ? 'border-primary text-text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              Warranty & Returns
            </button>
          </div>

          {activeTab === 'specs' ? (
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {Object.entries(productData.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2.5 border-b border-border/40 text-sm">
                    <span className="text-text-secondary font-bold">{key}</span>
                    <span className="text-text-primary font-semibold text-right max-w-[60%]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm text-sm space-y-4">
              <p className="font-semibold leading-relaxed">
                This item is covered under the standard <span className="font-bold text-primary">1-Year Egypt Local Warranty</span>. In case of any technical hardware defects, repairs or replacements will be performed free of charge through authorized service partners.
              </p>
              <div className="flex items-center space-x-3 mt-4 text-xs font-bold text-muted uppercase">
                <CheckCircle2 className="w-4.5 h-4.5 text-success shrink-0" />
                <span>Hassle-free replacement policy active</span>
              </div>
            </div>
          )}
        </div>

        {/* Related Products Carousel */}
        <div className="mb-12 space-y-6">
          <h3 className="text-xl font-bold tracking-tight">Compare with Similar Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {productData.relatedProducts.map((p) => (
              <div 
                key={p.id} 
                onClick={() => navigate(`/product/${p.id}`)}
                className="bg-card border border-border rounded-2xl overflow-hidden hover-lift shadow-sm flex flex-col cursor-pointer transition-all hover:border-primary/50"
              >
                <div className="h-40 bg-zinc-950/40 overflow-hidden">
                  <img src={p.image} alt={p.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-muted uppercase">{p.brand}</span>
                    <h4 className="font-bold text-sm text-text-primary line-clamp-2 mt-0.5 leading-snug">{p.title}</h4>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-sm font-black text-text-primary">EGP {p.price.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">Save EGP {p.save.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Sticky Buy Card */}
      {isStickyVisible && (
        <div className="fixed bottom-0 left-0 right-0 bg-navbar/95 backdrop-blur-xl border-t border-border shadow-2xl py-3 px-4 sm:px-6 lg:px-8 z-40 animate-slide-down">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            <div className="flex items-center space-x-3.5 min-w-0">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-border hidden sm:block shrink-0 bg-white items-center justify-center p-1">
                <img src={productData.images[0]} alt="" loading="lazy" decoding="async" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-text-primary truncate">{productData.title}</h4>
                <p className="text-[10px] text-muted font-semibold mt-0.5">cheapest at {cheapestStore.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-6 shrink-0">
              <div className="text-right">
                <span className="text-lg font-black text-success">
                  EGP {productData.lowestPrice.toLocaleString()}
                </span>
                <p className="text-[10px] text-muted line-through font-bold">EGP {productData.highestPrice.toLocaleString()}</p>
              </div>
              <a
                href={cheapestStore.link}
                target="_blank"
                rel="noreferrer"
                className="h-11 px-6 bg-success hover:bg-success-hover text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 shrink-0"
              >
                <span>Buy Now</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
