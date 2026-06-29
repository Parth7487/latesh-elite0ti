import React, { useState, useEffect, useRef } from 'react';
import { 
  FinishType, 
  KitComponent, 
  BuildState, 
  Tier2State, 
  Tier3State, 
  CartItem 
} from './types';
import CarVisualizer from './components/CarVisualizer';
import CartDrawer from './components/CartDrawer';
import { InteractiveCarExplorer } from './components/InteractiveCarExplorer';
import { ModelFinder } from './components/ModelFinder';
import { StoreMap } from './components/StoreMap';
import { AboutUs } from './components/AboutUs';
import { BlogPage } from './components/Blog';
import { Resources } from './components/Resources';
import TitaniumCatalog from './components/TitaniumCatalog';
import ProductDetail from './components/ProductDetail';
import ContactPage from './components/ContactPage';
import { LogoLoop } from './components/LogoLoop';
import { ExpandOnHover } from './components/ExpandOnHover';

import StorySplitReveal from './components/StorySplitReveal';
import JoinVortex from './components/JoinVortex';
import ForzaShowroom from './components/ForzaShowroom';
import MaterialVisualizer from './components/MaterialVisualizer';

import { 
  Facebook,
  Instagram,
  ShieldCheck,
  ShoppingBag, 
  Search, 
  ChevronDown, 
  Sparkles, 
  Flame, 
  Check, 
  Settings, 
  Sliders, 
  Info, 
  Gauge, 
  Cpu, 
  AlertCircle,
  Clock,
  Truck,
  HelpCircle,
  Layers,
  ArrowRight,
  User,
  Car,
  ShoppingCart,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BannerGsapFramerAnimation } from '../Banner-gsap-framer-animation/BannerGsapFramerAnimation';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ target, duration = 1500, decimals = 0, suffix = "" }) => {
  const [count, setCount] = React.useState(0);
  const elementRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    let observer: IntersectionObserver;
    let animationFrameId: number;

    const startAnimation = () => {
      const startTime = performance.now();
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = progress * (2 - progress); // easeOutQuad
        const currentValue = easeProgress * target;
        setCount(currentValue);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setCount(target);
        }
      };
      animationFrameId = requestAnimationFrame(animate);
    };

    if (elementRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startAnimation();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(elementRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [target, duration]);

  return (
    <span ref={elementRef}>
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
};

// Nissan 350Z Top Secret Style Widebody Body Kit — real prices from Shopify CSV
const initialTier1Components: KitComponent[] = [
  { id: 'front_bumper', name: 'FRONT BUMPER', price: 955, material: 'carbon', canFRP: true, isSelected: true, finish: 'matte',
    prices: { frp: 955, matte: 2105, gloss: 2105, forged: 2315, kevlar: 2420 } },
  { id: 'front_fender', name: 'FRONT FENDER', price: 1275, material: 'carbon', canFRP: true, isSelected: true, finish: 'matte',
    prices: { frp: 1275, matte: 2805, gloss: 2805, forged: 3085, kevlar: 3225 } },
  { id: 'side_skirt', name: 'SIDE SKIRT', price: 955, material: 'carbon', canFRP: true, isSelected: true, finish: 'matte',
    prices: { frp: 955, matte: 2105, gloss: 2105, forged: 2315, kevlar: 2420 } },
  { id: 'rear_fender', name: 'REAR FENDER', price: 1595, material: 'carbon', canFRP: true, isSelected: true, finish: 'matte',
    prices: { frp: 1595, matte: 3505, gloss: 3505, forged: 3855, kevlar: 4030 } },
  { id: 'rear_bumper', name: 'REAR BUMPER', price: 955, material: 'carbon', canFRP: true, isSelected: true, finish: 'matte',
    prices: { frp: 955, matte: 2105, gloss: 2105, forged: 2315, kevlar: 2420 } },
  { id: 'fuel_cover', name: 'FUEL COVER', price: 195, material: 'carbon', canFRP: true, isSelected: true, finish: 'matte',
    prices: { frp: 195, matte: 425, gloss: 425, forged: 465, kevlar: 485 } },
  { id: 'lower_wing_top_legs', name: 'LOWER WING TOP LEGS', price: 575, material: 'carbon', canFRP: false, isSelected: true, finish: 'matte',
    prices: { matte: 575, gloss: 575, forged: 635, kevlar: 660 } }
];

// Centralized dynamic component price calculator — uses real CSV prices and dynamic scaling factor
export const getComponentPrice = (item: KitComponent, priceScalingFactor: number = 1.0) => {
  let price = item.price;
  // If we have real per-variant prices, use them directly
  if (item.prices) {
    if (item.material === 'frp' && item.prices.frp) {
      price = item.prices.frp;
    } else if (item.material === 'carbon') {
      const fin = item.finish || 'matte';
      const p = item.prices[fin as keyof typeof item.prices];
      if (p) price = p;
    }
  }
  // Fallback to base price
  return Math.round(price * priceScalingFactor);
};

interface CatalogProduct {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  eyebrow: string;
  category: 'body-kits' | 'aero' | 'interior' | 'hoods' | 'engine' | 'titanium';
  subCategory?: 'front-bumper' | 'rear-bumper' | 'fender' | 'side-skirt' | 'diffuser' | 'canard' | 'wing' | 'lip' | 'detail';
  isSale?: boolean;
  isConfigurable?: boolean;
  isIcon?: boolean;
  iconName?: 'insurance' | 'chair';
}

const catalogProducts: CatalogProduct[] = [
  // Body Kits
  {
    id: 'prod_350z_body_kit',
    title: 'TOP SECRET STYLE WIDEBODY BODY KIT',
    price: 5845,
    image: '/images/prod_350z_body_kit.jpg',
    category: 'body-kits',
    eyebrow: 'Nissan 350Z',
    isConfigurable: true
  },
  {
    id: 'prod_350z_nismo380',
    title: 'NISMO STYLE 380 BODY KIT',
    price: 2095,
    image: '/images/prod_350z_nismo380_1.jpg',
    category: 'body-kits',
    eyebrow: 'Nissan 350Z',
    isConfigurable: true
  },
  {
    id: 'prod_350z_superleggera',
    title: 'SUPER LEGGERA BODY KIT',
    price: 3910,
    image: '/images/prod_350z_superleggera_1.jpg',
    category: 'body-kits',
    eyebrow: 'Nissan 350Z',
    isConfigurable: true
  },
  {
    id: 'prod_r32_pandem_kit',
    title: 'R32 GTR PANDEM STYLE WIDEBODY KIT',
    price: 4900,
    image: '/images/prod_r32_pandem_kit.jpg',
    category: 'body-kits',
    eyebrow: 'Skyline GTR R32',
    isConfigurable: true
  },
  {
    id: 'prod_370z_allure_kit',
    title: '370Z ETi ALLURE WIDE BODY KIT',
    price: 5450,
    image: '/images/prod_370z_allure_kit.jpg',
    category: 'body-kits',
    eyebrow: 'Nissan 370Z',
    isConfigurable: true
  },

  // Aero & Body Panels
  {
    id: 'prod_a90_pro_lip',
    title: 'A90 PRO LIP',
    price: 925,
    image: '/images/prod_a90_pro_lip.png',
    category: 'aero',
    subCategory: 'lip',
    eyebrow: 'Supra MK5'
  },
  {
    id: 'prod_a90_rear_splitter',
    title: 'A90 REAR BUMPER SPLITTER',
    price: 250,
    image: '/images/prod_a90_rear_splitter.png',
    category: 'aero',
    subCategory: 'lip',
    eyebrow: 'Supra MK5'
  },
  {
    id: 'prod_r34_gtt_front_bumper',
    title: 'R34 GTT Z-TUNE STYLE FRONT BUMPER',
    price: 1150,
    image: '/images/prod_fk_exhaust.jpg',
    category: 'aero',
    subCategory: 'front-bumper',
    eyebrow: 'Skyline R34 GTT'
  },
  {
    id: 'prod_r32_doluck_rear',
    title: 'R32 GTR DO-LUCK STYLE REAR BUMPER',
    price: 950,
    image: '/images/prod_fk_exhaust.jpg',
    category: 'aero',
    subCategory: 'rear-bumper',
    eyebrow: 'Skyline GTR R32'
  },
  {
    id: 'prod_r35_wald_covers',
    title: 'R35 GTR WALD STYLE BUMPER SIDE COVER',
    price: 350,
    image: '/images/prod_rx7_pulley_kit.jpg',
    category: 'aero',
    subCategory: 'detail',
    eyebrow: 'GT-R R35'
  },
  {
    id: 'prod_370z_kaze_skirts',
    title: '370Z KAZE STYLE SIDE SKIRTS',
    price: 650,
    image: '/images/prod_fk_exhaust.jpg',
    category: 'aero',
    subCategory: 'side-skirt',
    eyebrow: 'Nissan 370Z'
  },

  // Interior
  {
    id: 'prod_carbon_interior',
    title: '8PCS CARBON FIBER INTERIOR SET',
    price: 499,
    originalPrice: 650,
    image: '/images/prod_carbon_interior_set.png',
    category: 'interior',
    eyebrow: 'Universal / Tesla',
    isSale: true
  },
  {
    id: 'prod_alcantara_armrest',
    title: 'ALCANTARA CAR ARMREST BOX',
    price: 29.99,
    originalPrice: 45,
    image: '/images/prod_alcantara_armrest.png',
    category: 'interior',
    eyebrow: 'Universal / Tesla',
    isSale: true
  },
  {
    id: 'prod_valtari_chair',
    title: 'VALTARI RACING SEAT',
    price: 450,
    image: '',
    category: 'interior',
    eyebrow: 'Universal',
    isIcon: true,
    iconName: 'chair'
  },

  // Hoods, Trunks & Cowls
  {
    id: 'prod_r32_nismo_hood',
    title: 'R32 GTR NISMO STYLE CARBON HOOD',
    price: 1450,
    image: '/images/prod_350z_body_kit.jpg',
    category: 'hoods',
    eyebrow: 'Skyline GTR R32'
  },
  {
    id: 'prod_r32_topsecret_hood',
    title: 'R32 GTR TOP SECRET STYLE HOOD',
    price: 1650,
    image: '/images/prod_r32_pandem_kit.jpg',
    category: 'hoods',
    eyebrow: 'Skyline GTR R32'
  },
  {
    id: 'prod_r32_roof_spoiler',
    title: 'R32 GTR DX CARBON ROOF SPOILER',
    price: 350,
    image: '/images/prod_370z_allure_kit.jpg',
    category: 'hoods',
    eyebrow: 'Skyline GTR R32'
  },

  // Engine Bay
  {
    id: 'prod_2jz_swap_kit',
    title: '2JZ SWAP KIT',
    price: 445,
    image: '/images/prod_2jz_swap_kit.png',
    category: 'engine',
    eyebrow: 'Universal / Toyota'
  },
  {
    id: 'prod_2jz_intake',
    title: '2JZ-GTE/GE CARBON INTAKE MANIFOLD',
    price: 2450,
    image: '/images/prod_2jz_intake_manifold.png',
    category: 'engine',
    eyebrow: 'Supra MK4 / 2JZ'
  },

  // Titanium
  {
    id: 'prod_350z_ti_kit',
    title: '350Z TITANIUM HARDWARE KIT',
    price: 189,
    image: '/images/prod_350z_ti_hardware_kit.png',
    category: 'titanium',
    eyebrow: 'Nissan 350Z',
    isConfigurable: true
  },

  // Additional Body Kits
  {
    id: 'prod_gr86_pandem_kit',
    title: 'GR86 PANDEM V1 WIDEBODY KIT',
    price: 4750,
    image: '/images/prod_gr86_pandem_kit.jpg',
    category: 'body-kits',
    eyebrow: 'Toyota GR86 (ZN8)',
    isConfigurable: true
  },
  {
    id: 'prod_370z_allure_widebody',
    title: '370Z ETi ALLURE WIDEBODY W1 KIT',
    price: 5750,
    image: '/images/prod_370z_allure_widebody.jpg',
    category: 'body-kits',
    eyebrow: 'Nissan 370Z (Z34)',
    isSale: true,
    isConfigurable: true
  },
  {
    id: 'prod_rx7_rocket_bunny',
    title: 'RX-7 ROCKET BUNNY WIDE BODY KIT',
    price: 5250,
    image: '/images/prod_rx7_rocket_bunny.jpg',
    category: 'body-kits',
    eyebrow: 'Mazda RX-7 FD3S',
    isConfigurable: true
  },
  {
    id: 'prod_rx8_pandem_kit',
    title: 'RX-8 PANDEM BODY KIT',
    price: 4200,
    image: '/images/prod_rx8_pandem_kit.jpg',
    category: 'body-kits',
    eyebrow: 'Mazda RX-8 SE3P',
    isConfigurable: true
  },

  // Additional Hoods
  {
    id: 'prod_supra_trd_hood',
    title: 'SUPRA MKIV TRD CARBON FIBER HOOD',
    price: 1650,
    image: '/images/prod_supra_trd_hood.jpg',
    category: 'hoods',
    eyebrow: 'Toyota Supra MKIV (JZA80)'
  },
  {
    id: 'prod_supra_veilside_hood',
    title: 'SUPRA MKIV VEILSIDE CARBON FIBER HOOD',
    price: 1750,
    image: '/images/prod_supra_veilside_hood.jpg',
    category: 'hoods',
    eyebrow: 'Toyota Supra MKIV (JZA80)'
  },
  {
    id: 'prod_supra_abflug_hood',
    title: 'SUPRA MKIV AB FLUG CARBON FIBER HOOD',
    price: 1850,
    image: '/images/prod_supra_abflug_hood.jpg',
    category: 'hoods',
    eyebrow: 'Toyota Supra MKIV (JZA80)',
    isSale: true
  },
  {
    id: 'prod_370z_ts_hood',
    title: '370Z TOP SECRET STYLE CARBON FIBER HOOD',
    price: 1550,
    image: '/images/prod_370z_ts_hood.jpg',
    category: 'hoods',
    eyebrow: 'Nissan 370Z (Z34)'
  },
  {
    id: 'prod_350z_cf_roof',
    title: '350Z CARBON FIBER ROOF REPLACEMENT',
    price: 1950,
    image: '/images/prod_350z_cf_roof.jpg',
    category: 'hoods',
    eyebrow: 'Nissan 350Z (Z33)'
  },
  {
    id: 'prod_gt86_cf_roof',
    title: 'GT86 / FT86 CARBON FIBER ROOF',
    price: 1650,
    image: '/images/prod_gt86_cf_roof.jpg',
    category: 'hoods',
    eyebrow: 'Toyota GT86 / Subaru BRZ'
  },
  {
    id: 'prod_r35_cf_roof',
    title: 'R35 GT-R CARBON FIBER ROOF',
    price: 2250,
    image: '/images/prod_r35_cf_roof.jpg',
    category: 'hoods',
    eyebrow: 'Nissan GT-R R35'
  },

  // Additional Aero
  {
    id: 'prod_s2000_js_hood',
    title: 'S2000 J\'S RACING STYLE CARBON FIBER HOOD',
    price: 1350,
    image: '/images/prod_s2000_js_hood.jpg',
    category: 'aero',
    subCategory: 'detail',
    eyebrow: 'Honda S2000 (AP1/AP2)'
  }
];

const matchSearchQuery = (product: CatalogProduct, query: string): boolean => {
  if (!query) return true;
  const q = query.toLowerCase();
  
  // Direct matches in title or eyebrow
  const title = product.title.toLowerCase();
  const eyebrow = product.eyebrow ? product.eyebrow.toLowerCase() : '';
  if (title.includes(q) || eyebrow.includes(q)) return true;

  // Custom mapping for ModelFinder codes to product terms
  const mappings: { [key: string]: string[] } = {
    // Mazda
    mazda: ['fd3s', 'rx7', 'rx-7', 'se3p', 'rx8', 'rx-8', 'mazda'],
    fd3s: ['fd3s', 'rx7', 'rx-7'],
    se3p: ['se3p', 'rx8', 'rx-8'],
    'mazda 2 / 3': ['mazda 2', 'mazda 3', 'mazda'],
    // Toyota
    toyota: ['toyota', 'supra', '2jz', 'jza80', 'a90', 'zn6', 'zn8', 'mr2', 'sw20'],
    jza80: ['jza80', 'supra', 'mkiv', 'mk4', '2jz'],
    a90: ['a90', 'supra', 'mkv', 'mk5'],
    zn6: ['zn6', 'gt86', 'ft86', '86'],
    zn8: ['zn8', 'gr86', '86'],
    sw20: ['sw20', 'mr2'],
    // Nissan
    nissan: ['nissan', '350z', '370z', 'r32', 'r33', 'r34', 'r35', 'skyline', 'gtr', 'gtt', 'z33', 'z34', 's13', 's14', 's15'],
    r32: ['r32', 'skyline', 'gtr'],
    r33: ['r33', 'skyline', 'gtr'],
    r34: ['r34', 'skyline', 'gtt', 'gtr'],
    r35: ['r35', 'gtr', 'gt-r'],
    z33: ['350z', 'z33'],
    z34: ['370z', 'z34'],
    s15: ['s15', 'silvia'],
    s14: ['s14', 'silvia'],
    s13: ['s13', '180sx', 'silvia'],
    v35: ['v35', 'g35'],
    // Mitsubishi
    mitsubishi: ['mitsubishi', 'lancer', 'evo', 'evolution', 'gto', '3000gt', 'fto'],
    '8 / 9': ['evo', 'lancer', 'evolution'],
    x: ['evo x', 'lancer', 'evolution'],
    '3000gt': ['3000gt', 'gto'],
    fto: ['fto'],
    // Honda
    honda: ['honda', 'civic', 'fit', 'jazz'],
    'fc / fk': ['civic', 'fc', 'fk'],
    'eg / ek': ['civic', 'eg', 'ek'],
    'jazz / fit': ['jazz', 'fit'],
    // Subaru
    subaru: ['subaru', 'impreza', 'wrx'],
    'impreza / wrx': ['impreza', 'wrx'],
    // BMW
    bmw: ['bmw', 'm2', 'f87', 'e46', '3-series', '4-series', 'm4', '5-series', 'z4'],
    f87: ['f87', 'm2'],
    e46: ['e46'],
    'e90-e93': ['e90', 'e91', 'e92', 'e93', '3-series'],
    'f32 · m4': ['f32', 'm4', '4-series'],
    'e60-g30': ['e60', 'g30', '5-series'],
    e89: ['e89', 'z4'],
    'heritage & gt': ['heritage', 'gt'],
    // Mercedes-Benz
    'mercedes-benz': ['mercedes', 'benz', 'w140', 'w220', 'r129', 'slr'],
    w140: ['w140', 's-class'],
    w220: ['w220', 's-class'],
    r129: ['r129', 'sl'],
    'slr mclaren': ['slr', 'mclaren'],
    'more mercedes': ['mercedes', 'benz'],
    // Porsche
    porsche: ['porsche', '718', '911', 'cayman', 'boxster', 'cayenne', 'panamera', 'taycan'],
    '718': ['718'],
    '981 cayman / boxster': ['981', 'cayman', 'boxster'],
    '986 / 987': ['986', '987', 'cayman', 'boxster'],
    '911': ['911'],
    cayenne: ['cayenne'],
    panamera: ['panamera'],
    taycan: ['taycan'],
    // Others
    lamborghini: ['lamborghini'],
    chevrolet: ['chevrolet', 'c8', 'corvette'],
    'c8 corvette': ['c8', 'corvette'],
    ford: ['ford', 'ranger'],
    ranger: ['ranger'],
    // Tesla
    tesla: ['tesla', 'model y', 'model s', 'model x', 'model 3'],
    'model y': ['model y'],
    'model s': ['model s'],
    'model x': ['model x'],
    'model 3': ['model 3'],
  };

  const terms = mappings[q];
  if (terms) {
    return terms.some(term => title.includes(term) || eyebrow.includes(term));
  }

  return false;
};

const ScrollDrifter = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [rotation, setRotation] = useState(0);
  const lastScrollY = useRef(0);
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = window.scrollY / totalHeight;
      setScrollProgress(progress);

      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;

      if (diff > 0) {
        setRotation(20); // drift right
      } else if (diff < 0) {
        setRotation(-20); // drift left
      }

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setRotation(0);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="fixed right-6 bottom-16 z-50 flex flex-col items-center select-none pointer-events-none hidden md:flex">
      <div className="h-40 w-1 bg-neutral-900/60 rounded-full relative flex justify-center border-l border-dashed border-neutral-850">
        <div 
          className="absolute top-0 w-[2px] bg-[#c0f20c] rounded-full transition-all duration-100"
          style={{ height: `${scrollProgress * 100}%` }}
        />
        <div 
          className="absolute transition-all duration-75"
          style={{ 
            top: `calc(${scrollProgress * 100}% - 16px)`,
            transform: `rotate(${rotation + 180}deg) scale(1.35)`,
            transformOrigin: 'center center'
          }}
        >
          <img 
            src="/images/top_down_car_drifter.png" 
            alt="Drifting Car" 
            className="w-8 h-8 object-contain filter drop-shadow-[0_0_8px_rgba(192,242,12,0.6)]"
          />
        </div>
      </div>
      <span className="text-[8px] font-mono tracking-widest text-neutral-500 uppercase mt-4">DRIFT SCROLL</span>
    </div>
  );
};

const BrandLogos: Record<string, React.ReactNode> = {
  'MAZDA': <img src="https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/mazda.png" className="w-6 h-6 object-contain shrink-0" alt="Mazda" />,
  'TOYOTA': <img src="https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/toyota.png" className="w-6 h-6 object-contain shrink-0" alt="Toyota" />,
  'NISSAN': <img src="https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/nissan.png" className="w-6 h-6 object-contain shrink-0" alt="Nissan" />,
  'MITSUBISHI': <img src="https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/mitsubishi.png" className="w-6 h-6 object-contain shrink-0" alt="Mitsubishi" />,
  'HONDA': <img src="https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/honda.png" className="w-6 h-6 object-contain shrink-0" alt="Honda" />,
  'SUBARU': <img src="https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/subaru.png" className="w-6 h-6 object-contain shrink-0" alt="Subaru" />,
  'BMW': <img src="https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/bmw.png" className="w-6 h-6 object-contain shrink-0" alt="BMW" />,
  'MERCEDES-BENZ': <img src="https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/mercedes-benz.png" className="w-6 h-6 object-contain shrink-0" alt="Mercedes-Benz" />,
  'PORSCHE': <img src="https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/porsche.png" className="w-6 h-6 object-contain shrink-0" alt="Porsche" />,
  'LAMBORGHINI': <img src="https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/lamborghini.png" className="w-6 h-6 object-contain shrink-0" alt="Lamborghini" />,
  'CHEVROLET': <img src="https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/chevrolet.png" className="w-6 h-6 object-contain shrink-0" alt="Chevrolet" />,
  'FORD': <img src="https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/ford.png" className="w-6 h-6 object-contain shrink-0" alt="Ford" />,
  'TESLA': <img src="https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/tesla.png" className="w-6 h-6 object-contain shrink-0" alt="Tesla" />
};

const BrandLoopList = [
  { name: 'MAZDA', logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/mazda.png' },
  { name: 'TOYOTA', logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/toyota.png' },
  { name: 'NISSAN', logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/nissan.png' },
  { name: 'MITSUBISHI', logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/mitsubishi.png' },
  { name: 'HONDA', logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/honda.png' },
  { name: 'SUBARU', logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/subaru.png' },
  { name: 'BMW', logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/bmw.png' },
  { name: 'MERCEDES-BENZ', logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/mercedes-benz.png' },
  { name: 'PORSCHE', logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/porsche.png' },
  { name: 'LAMBORGHINI', logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/lamborghini.png' },
  { name: 'CHEVROLET', logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/chevrolet.png' },
  { name: 'FORD', logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/ford.png' },
  { name: 'TESLA', logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/tesla.png' }
];

const CHASSIS_LIST = [
  { make: "MAZDA", model: "RX-7", code: "FD3S", image: "https://cdn.shopify.com/s/files/1/0842/8362/1657/collections/mazda-rx7-6482440.jpg?v=1765735254" },
  { make: "TOYOTA", model: "SUPRA MK4", code: "JZA80", image: "https://cdn.shopify.com/s/files/1/0842/8362/1657/collections/toyota-supra-mkiv-2961889.png?v=1765735300" },
  { make: "NISSAN", model: "SKYLINE GT-R", code: "BNR34", image: "https://cdn.shopify.com/s/files/1/0842/8362/1657/collections/nissan-r34-gtr-1940832.png?v=1765735270" },
  { make: "TOYOTA", model: "SUPRA MK5", code: "A90", image: "https://cdn.shopify.com/s/files/1/0842/8362/1657/collections/toyota-supra-mkv-a90-5805566.jpg?v=1765735301" },
  { make: "HONDA", model: "NSX", code: "NA1", image: "/images/honda_nsx_telegram.jpg" },
  { make: "NISSAN", model: "GT-R", code: "R35", image: "https://cdn.shopify.com/s/files/1/0842/8362/1657/collections/nissan-r35-gtr-8162604.jpg?v=1765735271" },
  { make: "NISSAN", model: "350Z", code: "Z33", image: "https://cdn.shopify.com/s/files/1/0842/8362/1657/collections/nissan-370z-3763099.jpg?v=1765735262" }
];

export default function App() {
  // --- Cart State ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [shopByCarOpen, setShopByCarOpen] = useState(false);
  const [isHeroHidden, setIsHeroHidden] = useState(false);
  const [activeCar, setActiveCar] = useState('Nissan 350Z');
  const [activeConfigProduct, setActiveConfigProduct] = useState<CatalogProduct>(catalogProducts[0]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const productImages = activeConfigProduct.id === 'prod_350z_body_kit' ? [
    '/images/350z-hero-0.jpg',
    '/images/350z-hero-1.jpg',
    '/images/350z-hero-8.jpg',
    '/images/350z-hero-9.jpg'
  ] : activeConfigProduct.id === 'prod_350z_nismo380' ? [
    '/images/prod_350z_nismo380_1.jpg',
    '/images/prod_350z_nismo380_2.jpg',
    '/images/prod_350z_nismo380_3.jpg',
    '/images/prod_350z_nismo380_4.jpg',
    '/images/prod_350z_nismo380_5.jpg',
  ] : activeConfigProduct.id === 'prod_350z_superleggera' ? [
    '/images/prod_350z_superleggera_0.jpg',
    '/images/prod_350z_superleggera_1.jpg',
    '/images/prod_350z_superleggera_2.jpg',
    '/images/prod_350z_superleggera_3.jpg',
    '/images/prod_350z_superleggera_4.jpg',
  ] : [activeConfigProduct.image];

  const priceScalingFactor = activeConfigProduct.id === 'prod_350z_body_kit'
    ? 1.0
    : activeConfigProduct.price / 5845;

  // Toasts / alerts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeProductTab, setActiveProductTab] = useState<'overview' | 'panels' | 'features' | 'materials' | 'leadtime'>('overview');

  // --- ETi Active Color Changer States ---
  const [recolourColor, setRecolourColor] = useState<string>('#ef4444'); // Candy Red default
  const [recolourPart, setRecolourPart] = useState<string>(''); // empty means "entire car"
  const [recolourEngine, setRecolourEngine] = useState<'local' | 'photoroom'>('photoroom');
  const [recolourKeepBg, setRecolourKeepBg] = useState<boolean>(true);
  const [recolourColorize, setRecolourColorize] = useState<boolean>(false);
  const [recolourCustomImage, setRecolourCustomImage] = useState<string | null>(null);
  const [recolourCustomImageName, setRecolourCustomImageName] = useState<string>('');
  const [recolouredImages, setRecolouredImages] = useState<Record<number, string>>({});
  const [isRecolourLoading, setIsRecolourLoading] = useState<boolean>(false);
  const [isRecolourServerConnected, setIsRecolourServerConnected] = useState<boolean | null>(null);
  const [recolourAllViews, setRecolourAllViews] = useState<boolean>(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const resp = await fetch('/api', { method: 'GET' });
        if (resp.ok) {
          setIsRecolourServerConnected(true);
        } else {
          setIsRecolourServerConnected(false);
        }
      } catch (e) {
        setIsRecolourServerConnected(false);
      }
    };
    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleApplyRecolour = async (opts?: {
    color?: string;
    part?: string;
    engine?: 'local' | 'photoroom';
    keepBg?: boolean;
    colorize?: boolean;
  }) => {
    const colorToApply = opts?.color || recolourColor;
    const partToApply = opts?.part !== undefined ? opts.part : recolourPart;
    const engineToApply = opts?.engine || recolourEngine;
    const keepBgToApply = opts?.keepBg !== undefined ? opts.keepBg : recolourKeepBg;
    const colorizeToApply = opts?.colorize !== undefined ? opts.colorize : recolourColorize;

    setIsRecolourLoading(true);
    try {
      if (recolourCustomImage) {
        const res = await fetch(recolourCustomImage);
        const blob = await res.blob();
        const fileToSend = new File([blob], recolourCustomImageName || 'custom.jpg', { type: blob.type });

        const formData = new FormData();
        formData.append('image', fileToSend);
        formData.append('color', colorToApply);
        formData.append('keep_bg', keepBgToApply ? 'true' : 'false');
        formData.append('colorize', colorizeToApply ? 'true' : 'false');
        formData.append('part', partToApply);
        formData.append('engine', engineToApply);

        const resp = await fetch('/api/recolour', {
          method: 'POST',
          body: formData,
        });

        if (!resp.ok) {
          const errorData = await resp.json();
          throw new Error(errorData.error || 'Server error');
        }

        const data = await resp.json();
        if (data.result) {
          setRecolouredImages(prev => ({
            ...prev,
            [activeImageIndex]: data.result
          }));
          triggerToast('🎨 Custom color applied successfully!');
        }
      } else {
        if (recolourAllViews) {
          // Recolour all views in parallel
          const promises = productImages.map(async (imgUrl, idx) => {
            const res = await fetch(imgUrl);
            const blob = await res.blob();
            const fileToSend = new File([blob], imgUrl.substring(imgUrl.lastIndexOf('/') + 1), { type: 'image/jpeg' });

            const formData = new FormData();
            formData.append('image', fileToSend);
            formData.append('color', colorToApply);
            formData.append('keep_bg', keepBgToApply ? 'true' : 'false');
            formData.append('colorize', colorizeToApply ? 'true' : 'false');
            formData.append('part', partToApply);
            formData.append('engine', engineToApply);

            const resp = await fetch('/api/recolour', {
              method: 'POST',
              body: formData,
            });

            if (!resp.ok) {
              const errorData = await resp.json();
              throw new Error(errorData.error || 'Server error');
            }

            const data = await resp.json();
            return { idx, result: data.result };
          });

          const results = await Promise.all(promises);
          const newRecoloured: Record<number, string> = {};
          results.forEach(r => {
            newRecoloured[r.idx] = r.result;
          });
          setRecolouredImages(newRecoloured);
          triggerToast('🎨 Color scheme applied to all views!');
        } else {
          // Recolour only current view
          const imgUrl = productImages[activeImageIndex];
          const res = await fetch(imgUrl);
          const blob = await res.blob();
          const fileToSend = new File([blob], imgUrl.substring(imgUrl.lastIndexOf('/') + 1), { type: 'image/jpeg' });

          const formData = new FormData();
          formData.append('image', fileToSend);
          formData.append('color', colorToApply);
          formData.append('keep_bg', keepBgToApply ? 'true' : 'false');
          formData.append('colorize', colorizeToApply ? 'true' : 'false');
          formData.append('part', partToApply);
          formData.append('engine', engineToApply);

          const resp = await fetch('/api/recolour', {
            method: 'POST',
            body: formData,
          });

          if (!resp.ok) {
            const errorData = await resp.json();
            throw new Error(errorData.error || 'Server error');
          }

          const data = await resp.json();
          if (data.result) {
            setRecolouredImages(prev => ({
              ...prev,
              [activeImageIndex]: data.result
            }));
            triggerToast('🎨 Custom color applied successfully!');
          }
        }
      }
    } catch (e: any) {
      console.error(e);
      triggerToast(`❌ Recolour failed: ${e.message || e}`);
    } finally {
      setIsRecolourLoading(false);
    }
  };

  // --- Tier 1 State ---
  const [tier1Components, setTier1Components] = useState<KitComponent[]>(initialTier1Components);
  const [tier1Finish, setTier1Finish] = useState<FinishType>('matte');
  const [tier1ActiveView, setTier1ActiveView] = useState<'front' | 'side' | 'rear' | 'hood'>('front');
  const [isCompleteKit, setIsCompleteKit] = useState(true);

  // --- Tier 2 State ---
  const [tier2, setTier2] = useState<Tier2State>({
    finish: 'matte',
    innerShell: 'standard',
    addTitaniumHardware: false
  });

  // --- Tier 3 State ---
  const [tier3, setTier3] = useState<Tier3State>({
    finish: 'raw_ti',
    quantity: 1
  });

  // Custom feedback triggers when selecting parts
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Keep Complete Kit state in sync with selected components:
  // If all 7 components are selected, complete kit toggled = true. Otherwise false.
  useEffect(() => {
    const selectedCount = tier1Components.filter(c => c.isSelected).length;
    if (selectedCount === 7 && !isCompleteKit) {
      setIsCompleteKit(true);
    } else if (selectedCount < 7 && isCompleteKit) {
      setIsCompleteKit(false);
    }
  }, [tier1Components]);

  // Handle master Complete Kit toggle switch clicks
  const handleCompleteKitToggle = () => {
    const nextState = !isCompleteKit;
    setIsCompleteKit(nextState);
    
    // Select or unselect all components
    setTier1Components(prev => prev.map(c => ({
      ...c,
      isSelected: nextState
    })));

    triggerToast(nextState 
      ? "COMPLETE KIT — ALL 7 PIECES selected with 10% discount!" 
      : "Bulk kit deselected. Standard item prices applied."
    );
  };

  // Modify individual component checkbox
  const handleComponentSelectToggle = (id: string) => {
    setTier1Components(prev => prev.map(c => {
      if (c.id === id) {
        const updatedSelected = !c.isSelected;
        // Suggest changing viewpoint based on what they click:
        if (updatedSelected) {
          if (id === 'vented_hood') setTier1ActiveView('hood');
          else if (id === 'gt_wing' || id === 'rear_bumper') setTier1ActiveView('rear');
          else if (id === 'front_bumper') setTier1ActiveView('front');
          else if (id === 'side_skirts' || id === 'front_fenders') setTier1ActiveView('side');
        }
        return { ...c, isSelected: updatedSelected };
      }
      return c;
    }));
  };

  // Modify individual component material (FRP vs CARBON)
  const handleComponentMaterialChange = (id: string, material: 'frp' | 'carbon') => {
    setTier1Components(prev => prev.map(c => {
      if (c.id === id) {
        // If switching to carbon, ensure it has a finish defined
        return { ...c, material, finish: c.finish || 'matte' };
      }
      return c;
    }));
    triggerToast(`${id.replace('_', ' ').toUpperCase()} Material configured to ${material.toUpperCase()}`);
  };

  // Modify individual component finish
  const handleComponentFinishChange = (id: string, finish: FinishType) => {
    setTier1Components(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, finish };
      }
      return c;
    }));
    triggerToast(`${id.replace('_', ' ').toUpperCase()} Finish set to ${finish.toUpperCase()}`);
  };

  // --- Calculations for Tier 1 ---
  // Subtotal counts Selected Parts referencing centralized dynamic calculator
  const calculateTier1Subtotal = () => {
    return tier1Components.reduce((sum, item) => {
      if (!item.isSelected) return sum;
      return sum + getComponentPrice(item, priceScalingFactor);
    }, 0);
  };

  const tier1Subtotal = calculateTier1Subtotal();
  const tier1Discount = isCompleteKit ? Math.round(tier1Subtotal * 0.10) : 0;
  const tier1Total = tier1Subtotal - tier1Discount;
  const selectedTier1Count = tier1Components.filter(c => c.isSelected).length;

  // Add Tier 1 to Cart
  const handleAddTier1ToCart = () => {
    if (selectedTier1Count === 0) {
      triggerToast("❌ Select at least 1 component to build.");
      return;
    }

    const hasCarbon = tier1Components.some(c => c.isSelected && c.material === 'carbon');
    const selectedFins = hasCarbon ? "BESPOKE CLIENT SPEC" : 'FRP STANDARD';

    const cartId = `tier1-${Date.now()}`;
    const selectedPartNames = tier1Components
      .filter(c => c.isSelected)
      .map(c => {
        if (c.material === 'carbon') {
          return `${c.name} (${(c.finish || 'matte').toUpperCase()} CARBON)`;
        }
        return `${c.name} (FRP)`;
      });

    const newCartItem: CartItem = {
      id: cartId,
      title: activeConfigProduct.title,
      subtitle: `${activeConfigProduct.eyebrow.toUpperCase()} FULL BUILD`,
      imageType: 'tier1',
      qty: 1,
      unitPrice: tier1Total,
      totalPrice: tier1Total,
      selectedOptions: [
        { label: "Finishing style", value: selectedFins },
        { label: "Pieces", value: `${selectedTier1Count} of 7` },
        { label: "Discount", value: isCompleteKit ? "10% Package Save" : "Standard Build" }
      ],
      specDetails: [
        `Package Finish: INDIVIDUAL CUSTOM SPEC`,
        ...selectedPartNames
      ]
    };

    setCart(prev => [...prev, newCartItem]);
    setIsCartOpen(true);
    triggerToast("✨ Top Secret Widebody Build Added to Cart!");
  };

  // --- Calculations for Tier 2 ---
  const calculateTier2Price = () => {
    let price = 1450; // base GT hood price
    
    // Finish pricing
    if (tier2.finish === 'forged') {
      price += 145; // 10%
    } else if (tier2.finish === 'kevlar') {
      price += 170; // 12% is ~174, let's keep it $170 as in mockup text "+$170"
    }

    // Inner Shell upgrade
    if (tier2.innerShell === 'carbon_underside') {
      price += 550;
    }

    return price;
  };

  const tier2UnitPrice = calculateTier2Price();
  // Titanium Hardware Option
  const tier2HardwarePrice = tier2.addTitaniumHardware ? 95 : 0;
  const tier2Total = tier2UnitPrice + tier2HardwarePrice;

  const handleAddTier2ToCart = () => {
    const cartId = `tier2-${Date.now()}`;
    const desc = [
      `Finish: ${tier2.finish.toUpperCase()}`,
      `Inner Shell: ${tier2.innerShell.replace('_', ' ').toUpperCase()}`,
      `Titanium Hardware: ${tier2.addTitaniumHardware ? 'Included (+$95)' : 'None'}`
    ];

    const newCartItem: CartItem = {
      id: cartId,
      title: "RE AMEMIYA GT CARBON HOOD",
      subtitle: `NISSAN 350Z / HOODS`,
      imageType: 'tier2',
      qty: 1,
      unitPrice: tier2Total,
      totalPrice: tier2Total,
      selectedOptions: [
        { label: "Finish", value: tier2.finish.toUpperCase() },
        { label: "Underside", value: tier2.innerShell === 'standard' ? 'STANDARD' : 'CARBON UNDERSIDE' },
        { label: "Hardware Upgrade", value: tier2.addTitaniumHardware ? "YES" : "NO" }
      ],
      specDetails: desc
    };

    setCart(prev => [...prev, newCartItem]);
    setIsCartOpen(true);
    triggerToast("✨ RE Amemiya Carbon Hood Config Added to Cart!");
  };

  // --- Calculations for Tier 3 ---
  const tier3UnitPrice = 189;
  const tier3Total = tier3UnitPrice * tier3.quantity;

  const handleAddTier3ToCart = () => {
    const cartId = `tier3-${Date.now()}`;
    const newCartItem: CartItem = {
      id: cartId,
      title: "ETI TITANIUM HARDWARE KIT",
      subtitle: "GRADE 5 TITANIUM SEAT-RAIL SPEC",
      imageType: 'tier3',
      qty: tier3.quantity,
      unitPrice: tier3UnitPrice,
      totalPrice: tier3Total,
      selectedOptions: [
        { label: "Metal Finish", value: tier3.finish.replace('_', ' ').toUpperCase() },
        { label: "Specs", value: "Grade 5 Titanium M10 x 1.25" }
      ]
    };

    setCart(prev => [...prev, newCartItem]);
    setIsCartOpen(true);
    triggerToast("✨ Titanium Hardware Package Added to Cart!");
  };

  // Global Cart Actions
  const handleUpdateCartQty = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          qty: newQty,
          totalPrice: item.unitPrice * newQty
        };
      }
      return item;
    }));
  };

  const handleRemoveCartItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    triggerToast("Item removed from your cart.");
  };

  // Page state routing
  const [currentPage, setCurrentPage] = useState<'home' | 'product' | 'catalog' | 'titanium' | 'swag' | 'story' | 'showroom' | 'product-detail' | 'contact' | 'blog' | 'resources'>('home');
  const [selectedProductDetail, setSelectedProductDetail] = useState<any | null>(null);
  const [vehiclesMenuOpen, setVehiclesMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Custom Interactive states & datasets for newly added sections and pages

  const [catalogFilter, setCatalogFilter] = useState<'all' | 'carbon' | 'titanium' | 'swag'>('all');
  const [catalogSort, setCatalogSort] = useState<'alpha-asc' | 'alpha-desc' | 'price-asc' | 'price-desc'>('alpha-asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [titaniumFinish, setTitaniumFinish] = useState<'raw_ti' | 'burnt_blue' | 'gold' | 'purple'>('burnt_blue');
  const [swagSize, setSwagSize] = useState<'S' | 'M' | 'L' | 'XL'>('M');

  // --- Catalog Restructure States ---
  const [aeroSubFilter, setAeroSubFilter] = useState<string>('all');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'body-kits': false,
    'aero': false,
    'interior': false,
    'hoods': false,
    'engine': false,
    'titanium': false,
  });
  const [activeNav, setActiveNav] = useState<string>('cat-body-kits');
  
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      setIsHeroHidden(window.scrollY > 1150);
      
      let currentSection = 'cat-body-kits';
      for (const id of ['cat-body-kits', 'cat-aero', 'cat-interior', 'cat-hoods', 'cat-engine', 'cat-titanium']) {
        const el = sectionsRef.current[id];
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentSection = id;
            break;
          }
        }
      }
      setActiveNav(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll reveal animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px 300px 0px',
      threshold: 0.01
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.reveal, .reveal-mask');
      elements.forEach(el => observer.observe(el));
    }, 50);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [currentPage, searchQuery, aeroSubFilter]);

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop - 120;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveNav(id);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleProductAction = (e: React.MouseEvent, product: CatalogProduct) => {
    e.preventDefault();
    if (product.isConfigurable) {
      triggerToast(`Redirecting to interactive custom builder spec for ${product.title}...`);
      setActiveConfigProduct(product);
      setActiveCar(product.eyebrow);
      setRecolouredImages({});
      setRecolourCustomImage(null);
      setRecolourCustomImageName('');
      setActiveImageIndex(0);
      setCurrentPage('product');
      return;
    }

    // Redirect directly to the product detail/preview page
    const detailProduct = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      eyebrow: product.eyebrow,
      fitment: product.eyebrow.split(' ')[0] || 'Universal',
    };
    setSelectedProductDetail(detailProduct);
    setCurrentPage('product-detail');
  };

  // Grouped products
  const bodyKits = catalogProducts
    .filter(p => p.category === 'body-kits')
    .filter(p => matchSearchQuery(p, searchQuery));
  
  const aeroFiltered = catalogProducts
    .filter(p => {
      if (p.category !== 'aero') return false;
      if (aeroSubFilter === 'all') return true;
      return p.subCategory === aeroSubFilter;
    })
    .filter(p => matchSearchQuery(p, searchQuery));

  const interior = catalogProducts
    .filter(p => p.category === 'interior')
    .filter(p => matchSearchQuery(p, searchQuery));

  const hoods = catalogProducts
    .filter(p => p.category === 'hoods')
    .filter(p => matchSearchQuery(p, searchQuery));

  const engine = catalogProducts
    .filter(p => p.category === 'engine')
    .filter(p => matchSearchQuery(p, searchQuery));

  const titanium = catalogProducts
    .filter(p => p.category === 'titanium')
    .filter(p => matchSearchQuery(p, searchQuery));

  const totalFound = bodyKits.length + aeroFiltered.length + interior.length + hoods.length + engine.length + titanium.length;




  // Handler to add simple products (catalog / swag / titanium) to cart
  const handleAddSimpleProductToCart = (p: { id: string, title: string, price: number, category: string, imageType?: 'tier1' | 'tier2' | 'tier3' }) => {
    const cartId = `${p.id}-${Date.now()}`;
    const imgType = p.imageType || (p.category === 'titanium' ? 'tier3' : p.category === 'swag' ? 'tier2' : 'tier1');
    const newCartItem: CartItem = {
      id: cartId,
      title: p.title,
      subtitle: `${p.category.toUpperCase()} PRODUCT`,
      imageType: imgType,
      qty: 1,
      unitPrice: p.price,
      totalPrice: p.price,
      selectedOptions: [
        { label: "Category", value: p.category.toUpperCase() }
      ],
      specDetails: [
        `Direct Catalog Order`,
        `Price: $${p.price} USD`
      ]
    };
    setCart(prev => [...prev, newCartItem]);
    setIsCartOpen(true);
    triggerToast(`✨ Added ${p.title} to cart!`);
  };

  const handleSelectChassis = (query: string, page: 'catalog' | 'product' = 'catalog') => {
    setSearchQuery(query);
    setCurrentPage(page);
    setShopByCarOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Scroll to top on every page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-[#030303] text-neutral-200 selection:bg-[#c0f20c]/30 selection:text-[#c0f20c] font-sans pb-12">
      
      {/* 1. Announcement Marquee Bar */}
      <div className="w-full bg-[#0a0a0a] border-b border-neutral-900/50 py-2 overflow-hidden relative z-40">
        <div className="whitespace-nowrap flex text-[10px] uppercase font-mono tracking-[0.25em] text-neutral-400">
          <div className="animate-marquee flex gap-8 items-center">
            <span>MADE TO ORDER</span>
            <span className="text-[#c0f20c]">•</span>
            <span>TITANIUM HARDWARE</span>
            <span className="text-[#c0f20c]">•</span>
            <span>RACE-ENGINEERED</span>
            <span className="text-[#c0f20c]">•</span>
            <span>THE MANUFAKTUR FOR JDM</span>
            <span className="text-[#c0f20c]">•</span>
            <span>BUILT FOR THE DRIVEN</span>
            <span className="text-[#c0f20c]">•</span>
            <span>BESPOKE CARBON</span>
            <span className="text-[#c0f20c]">•</span>
            <span>TITANIUM HARDWARE</span>
            <span className="text-[#c0f20c]">•</span>
          </div>
          <div className="animate-marquee flex gap-8 items-center">
            <span>MADE TO ORDER</span>
            <span className="text-[#c0f20c]">•</span>
            <span>TITANIUM HARDWARE</span>
            <span className="text-[#c0f20c]">•</span>
            <span>RACE-ENGINEERED</span>
            <span className="text-[#c0f20c]">•</span>
            <span>THE MANUFAKTUR FOR JDM</span>
            <span className="text-[#c0f20c]">•</span>
            <span>BUILT FOR THE DRIVEN</span>
            <span className="text-[#c0f20c]">•</span>
            <span>BESPOKE CARBON</span>
            <span className="text-[#c0f20c]">•</span>
            <span>TITANIUM HARDWARE</span>
            <span className="text-[#c0f20c]">•</span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Header — matches Elite TI Shopify store */}
      <header className="sticky top-0 z-50 bg-[#0a0a0b] border-b border-neutral-900 transition-all">
        <div className="w-full px-4 md:px-8 lg:px-12 py-0 flex items-center justify-between h-[76px] relative max-w-[1700px] mx-auto">
          
          {/* Left: Logo */}
          <button 
            onClick={() => setCurrentPage('home')}
            className="shrink-0 flex items-center mr-6 hover:opacity-90 transition-opacity cursor-pointer bg-transparent border-0"
          >
            <img src="/images/logo.png" alt="Elite TI Logo" className="h-[48px] w-auto object-contain" />
          </button>

          {/* Center: Navigation links */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] font-bold uppercase tracking-[0.18em] text-white">
            <div 
              className="relative"
              onMouseEnter={() => setVehiclesMenuOpen(true)}
              onMouseLeave={() => setVehiclesMenuOpen(false)}
            >
              <button 
                onClick={() => {
                  setCurrentPage('catalog');
                  setVehiclesMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 hover:text-[#c0f20c] transition-colors py-6 cursor-pointer bg-transparent border-0 font-bold ${currentPage === 'catalog' ? 'text-[#c0f20c]' : ''}`}
              >
                VEHICLES
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
              </button>

              {/* VEHICLES Dropdown Mega Menu — Vertical List matching Screenshot 3 */}
              <AnimatePresence>
                {vehiclesMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-0 w-60 bg-[#0a0a0b] border border-neutral-850 p-6 shadow-2xl z-50 flex flex-col gap-3 font-display font-medium text-[13px] tracking-widest text-neutral-400"
                  >
                    {[
                      'MAZDA', 'TOYOTA', 'NISSAN', 'MITSUBISHI', 'HONDA', 
                      'SUBARU', 'BMW', 'MERCEDES-BENZ', 'PORSCHE', 
                      'LAMBORGHINI', 'CHEVROLET', 'FORD', 'TESLA'
                    ].map((make) => (
                      <button
                        key={make}
                        onClick={() => {
                          setCurrentPage('catalog');
                          setVehiclesMenuOpen(false);
                        }}
                        className="hover:text-white transition-colors cursor-pointer text-left w-full uppercase bg-transparent border-0 flex items-center gap-3 py-1.5"
                      >
                        {BrandLogos[make]}
                        <span>{make}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => setCurrentPage('catalog')} className={`hover:text-[#c0f20c] transition-colors py-6 cursor-pointer bg-transparent border-0 font-bold ${currentPage === 'catalog' ? 'text-[#c0f20c]' : ''}`}>CATALOG</button>
            <button onClick={() => setCurrentPage('titanium')} className={`hover:text-[#c0f20c] transition-colors py-6 cursor-pointer bg-transparent border-0 font-bold ${currentPage === 'titanium' ? 'text-[#c0f20c]' : ''}`}>TITANIUM</button>
            <button onClick={() => setCurrentPage('story')} className={`hover:text-[#c0f20c] transition-colors py-6 cursor-pointer bg-transparent border-0 font-bold ${currentPage === 'story' ? 'text-[#c0f20c]' : ''}`}>STORY</button>
            <button onClick={() => setCurrentPage('resources')} className={`hover:text-[#c0f20c] transition-colors py-6 cursor-pointer bg-transparent border-0 font-bold ${currentPage === 'resources' ? 'text-[#c0f20c]' : ''}`}>RESOURCES</button>
            <button onClick={() => setCurrentPage('contact')} className={`hover:text-[#c0f20c] transition-colors py-6 cursor-pointer bg-transparent border-0 font-bold ${currentPage === 'contact' ? 'text-[#c0f20c]' : ''}`}>CONTACT</button>
            <button onClick={() => setCurrentPage('swag')} className={`hover:text-[#c0f20c] transition-colors py-6 cursor-pointer bg-transparent border-0 font-bold ${currentPage === 'swag' ? 'text-[#c0f20c]' : ''}`}>SWAG</button>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 md:gap-3">

            {/* SHOP BY CAR dropdown */}
            <div className="relative hidden md:block">
              <button 
                onClick={() => setShopByCarOpen(!shopByCarOpen)}
                id="shop-by-car-trigger"
                className={`h-9 px-4 border rounded-full font-mono text-[9px] tracking-widest uppercase transition-colors flex items-center gap-1.5 cursor-pointer ${
                  shopByCarOpen 
                    ? 'bg-[#c0f20c] text-black border-[#c0f20c]' 
                    : 'bg-[#111112] border-neutral-850 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>SHOP BY CAR</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Country / Currency selector */}
            <button className="hidden lg:flex h-9 px-4 bg-[#111112] border border-neutral-850 rounded-full font-mono text-[9px] tracking-widest uppercase text-neutral-300 hover:border-neutral-700 transition-colors items-center gap-1.5 cursor-pointer">
              <span>UNITED STATES</span>
              <span className="text-neutral-600">|</span>
              <span>USD $</span>
              <ChevronDown className="w-3 h-3 text-neutral-500" />
            </button>

            {/* Search */}
            <button 
              aria-label="Search Catalog"
              className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all cursor-pointer bg-transparent border-0"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            {/* Account */}
            <button 
              aria-label="User Account"
              className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a9 9 0 1 0-18 0c0 2 0 4 .5 5.5C4 18.5 5.5 21 8.5 21c2 0 2.5-1 3.5-1s1.5 1 3.5 1c3 0 4.5-2.5 5-4 .5-1.5.5-3.5.5-5.5z" />
                <path d="M6.5 10.5h11a.5.5 0 0 1 .5.5v2.5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 6 13.5v-2.5a.5.5 0 0 1 .5-.5z" />
                <path d="M11 18.5h2M10 20h4" />
              </svg>
            </button>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              id="cart-drawer-trigger"
              className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all relative cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="8" width="18" height="12" rx="1" />
                <path d="M9 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
                <path d="M3 14h18" />
                <path d="M8 11h2M14 11h2M11 17h2" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c0f20c] text-black rounded-full text-[8px] font-mono font-bold flex items-center justify-center border-[1.5px] border-[#111111]">
                  {cart.reduce((sum, item) => sum + item.qty, 0)}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all cursor-pointer lg:hidden bg-transparent border-0"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu Drawer/Modal */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#0a0a0b]/98 border-l border-neutral-900 shadow-2xl z-50 flex flex-col p-6 backdrop-blur-md lg:hidden"
              >
                {/* Header in Drawer */}
                <div className="flex justify-between items-center border-b border-neutral-900 pb-5 mb-8">
                  <span className="font-mono text-[9px] text-[#c0f20c] tracking-[0.25em] font-bold">ETI MENU</span>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors bg-transparent border-0 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation links */}
                <nav className="flex flex-col gap-6 text-left">
                  {[
                    { name: 'HOME', page: 'home' },
                    { name: 'CATALOG', page: 'catalog' },
                    { name: 'TITANIUM HARDWARE', page: 'titanium' },
                    { name: 'STORY', page: 'story' },
                    { name: 'RESOURCES', page: 'resources' },
                    { name: 'CONTACT', page: 'contact' },
                    { name: 'SWAG', page: 'swag' }
                  ].map((link) => (
                    <button
                      key={link.name}
                      onClick={() => {
                        setCurrentPage(link.page as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`text-lg font-display font-bold uppercase tracking-widest text-left py-1 cursor-pointer bg-transparent border-0 transition-colors ${
                        currentPage === link.page ? 'text-[#c0f20c]' : 'text-neutral-300 hover:text-white'
                      }`}
                    >
                      {link.name}
                    </button>
                  ))}
                </nav>

                {/* Divider */}
                <div className="border-t border-neutral-900 my-8 pt-8">
                  {/* SHOP BY CAR for mobile inside the menu */}
                  <button
                    onClick={() => {
                      setShopByCarOpen(!shopByCarOpen);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-3 bg-[#111112] border border-neutral-850 hover:border-neutral-700 text-neutral-300 font-mono text-[10px] tracking-widest uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 17h2a2 2 0 0 1 4 0h8a2 2 0 0 1 4 0h2v-3c0-1.5-1.5-2.5-3-3h-2.5l-3-4h-4.5l-2.5 4h-2c-1.5 0-2.5 1-2.5 2.5z" />
                      <circle cx="6" cy="17" r="1.5" />
                      <circle cx="18" cy="17" r="1.5" />
                    </svg>
                    <span>SHOP BY CAR</span>
                  </button>
                </div>

                {/* Footer Metadata in Drawer */}
                <div className="mt-auto space-y-4 font-mono text-[9px] text-neutral-500 uppercase tracking-widest text-left">
                  <div>
                    <span className="block text-neutral-600">ESTABLISHED</span>
                    <span className="text-neutral-400 font-bold">2022 &bull; HIGH PERFORMANCE</span>
                  </div>
                  <div>
                    <span className="block text-neutral-600">DISTRIBUTION</span>
                    <span className="text-neutral-400 font-bold">HK &bull; USA &bull; TH</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </header>

      {/* SHOP BY CAR Dropdown Panel */}
      <AnimatePresence>
        {shopByCarOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed left-0 right-0 top-[76px] bg-[#0a0a0b]/98 border-t border-neutral-900/50 shadow-2xl z-40 overflow-y-auto max-h-[calc(100vh-76px)]"
          >
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10">
              <div className="flex justify-between items-center border-b border-neutral-900 pb-4 mb-8">
                <div>
                  <h3 className="font-display font-bold text-xs uppercase tracking-[0.2em] text-[#fafaf7]">SELECT YOUR CHASSIS</h3>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 block mt-1 md:inline md:mt-0">30+ CHASSIS &nbsp;/&nbsp; MADE-TO-ORDER FITMENT</span>
                </div>
                <button 
                  onClick={() => setShopByCarOpen(false)}
                  className="p-2 -mr-2 bg-transparent border-0 text-neutral-400 hover:text-white cursor-pointer transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-12 text-left">
                {/* COLUMN 1: MAZDA -> BMW -> TESLA */}
                <div className="flex flex-col gap-8">
                  {/* MAZDA */}
                  <div>
                    <button
                      onClick={() => handleSelectChassis('MAZDA')}
                      className="w-full text-left font-display font-bold text-sm uppercase text-[#fafaf7] hover:text-[#9cce00] border-b border-[#9cce00]/40 pb-2 mb-4 bg-transparent border-0 cursor-pointer flex items-center gap-2.5"
                    >
                      {BrandLogos['MAZDA']}
                      <span>MAZDA</span>
                    </button>
                    <ul className="space-y-3 list-none p-0 m-0">
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('FD3S'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">RX-7</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">FD3S</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('SE3P'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">RX-8</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">SE3P</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('MAZDA 2 / 3'); }} className="text-neutral-400 hover:text-[#9cce00] transition-colors font-sans text-xs">
                          MAZDA 2 / 3
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* BMW */}
                  <div>
                    <button
                      onClick={() => handleSelectChassis('BMW')}
                      className="w-full text-left font-display font-bold text-sm uppercase text-[#fafaf7] hover:text-[#9cce00] border-b border-[#9cce00]/40 pb-2 mb-4 bg-transparent border-0 cursor-pointer flex items-center gap-2.5"
                    >
                      {BrandLogos['BMW']}
                      <span>BMW</span>
                    </button>
                    <ul className="space-y-3 list-none p-0 m-0">
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('F87'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">M2</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">F87</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('E46'); }} className="text-neutral-400 hover:text-[#9cce00] transition-colors font-sans text-xs">
                          E46
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('E90-E93'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">3-SERIES</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">E90-E93</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('F32 \u00b7 M4'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">4-SERIES</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">F32 &middot; M4</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('E60-G30'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">5-SERIES</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">E60-G30</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('E89'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">Z4</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">E89</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('HERITAGE & GT'); }} className="text-neutral-400 hover:text-[#9cce00] transition-colors font-sans text-xs">
                          HERITAGE & GT
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Green rule divider between BMW and Tesla */}
                  <div className="border-t border-[#9cce00]/40 my-1"></div>

                  {/* TESLA */}
                  <div>
                    <button
                      onClick={() => handleSelectChassis('TESLA')}
                      className="w-full text-left font-display font-bold text-sm uppercase text-[#fafaf7] hover:text-[#9cce00] border-b border-[#9cce00]/40 pb-2 mb-4 bg-transparent border-0 cursor-pointer flex items-center gap-2.5"
                    >
                      {BrandLogos['TESLA']}
                      <span>TESLA</span>
                    </button>
                    <ul className="space-y-3 list-none p-0 m-0">
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('MODEL Y'); }} className="text-neutral-400 hover:text-[#9cce00] transition-colors font-sans text-xs">
                          MODEL Y
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('MODEL S'); }} className="text-neutral-400 hover:text-[#9cce00] transition-colors font-sans text-xs">
                          MODEL S
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('MODEL X'); }} className="text-neutral-400 hover:text-[#9cce00] transition-colors font-sans text-xs">
                          MODEL X
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('MODEL 3'); }} className="text-neutral-400 hover:text-[#9cce00] transition-colors font-sans text-xs">
                          MODEL 3
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* COLUMN 2: TOYOTA -> MERCEDES-BENZ */}
                <div className="flex flex-col gap-8">
                  {/* TOYOTA */}
                  <div>
                    <button
                      onClick={() => handleSelectChassis('TOYOTA')}
                      className="w-full text-left font-display font-bold text-sm uppercase text-[#fafaf7] hover:text-[#9cce00] border-b border-[#9cce00]/40 pb-2 mb-4 bg-transparent border-0 cursor-pointer flex items-center gap-2.5"
                    >
                      {BrandLogos['TOYOTA']}
                      <span>TOYOTA</span>
                    </button>
                    <ul className="space-y-3 list-none p-0 m-0">
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('JZA80'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">SUPRA MK4</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">JZA80</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('A90'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">SUPRA MK5</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">A90</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('ZN6'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">GT86 / FT86</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">ZN6</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('ZN8'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">GR86</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">ZN8</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('SW20'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">MR2</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">SW20</span>
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* MERCEDES-BENZ */}
                  <div>
                    <button
                      onClick={() => handleSelectChassis('MERCEDES-BENZ')}
                      className="w-full text-left font-display font-bold text-sm uppercase text-[#fafaf7] hover:text-[#9cce00] border-b border-[#9cce00]/40 pb-2 mb-4 bg-transparent border-0 cursor-pointer flex items-center gap-2.5"
                    >
                      {BrandLogos['MERCEDES-BENZ']}
                      <span>MERCEDES-BENZ</span>
                    </button>
                    <ul className="space-y-3 list-none p-0 m-0">
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('W140'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">S-CLASS</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">W140</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('W220'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">S-CLASS</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">W220</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('R129'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">SL</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">R129</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('SLR MCLAREN'); }} className="text-neutral-400 hover:text-[#9cce00] transition-colors font-sans text-xs">
                          SLR MCLAREN
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('MORE MERCEDES'); }} className="text-neutral-400 hover:text-[#9cce00] transition-colors font-sans text-xs">
                          MORE MERCEDES
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* COLUMN 3: NISSAN -> PORSCHE */}
                <div className="flex flex-col gap-8">
                  {/* NISSAN */}
                  <div>
                    <button
                      onClick={() => handleSelectChassis('NISSAN')}
                      className="w-full text-left font-display font-bold text-sm uppercase text-[#fafaf7] hover:text-[#9cce00] border-b border-[#9cce00]/40 pb-2 mb-4 bg-transparent border-0 cursor-pointer flex items-center gap-2.5"
                    >
                      {BrandLogos['NISSAN']}
                      <span>NISSAN</span>
                    </button>
                    <ul className="space-y-3 list-none p-0 m-0">
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('R32'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">SKYLINE GT-R</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">R32</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('R33'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">SKYLINE GT-R</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">R33</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('R34'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">SKYLINE GT-R</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">R34</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('R35'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">GT-R</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">R35</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('Z33', 'product'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">350Z</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">Z33</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('Z34'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">370Z</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">Z34</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('S15'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">SILVIA</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">S15</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('S14'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">SILVIA</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">S14</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('S13'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">180SX</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">S13</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('V35'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">G35</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">V35</span>
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* PORSCHE */}
                  <div>
                    <button
                      onClick={() => handleSelectChassis('PORSCHE')}
                      className="w-full text-left font-display font-bold text-sm uppercase text-[#fafaf7] hover:text-[#9cce00] border-b border-[#9cce00]/40 pb-2 mb-4 bg-transparent border-0 cursor-pointer flex items-center gap-2.5"
                    >
                      {BrandLogos['PORSCHE']}
                      <span>PORSCHE</span>
                    </button>
                    <ul className="space-y-3 list-none p-0 m-0">
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('718'); }} className="text-neutral-400 hover:text-[#9cce00] transition-colors font-sans text-xs">
                          718
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('981 CAYMAN / BOXSTER'); }} className="text-neutral-400 hover:text-[#9cce00] transition-colors font-sans text-xs font-bold">
                          981 CAYMAN / BOXSTER
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('986 / 987'); }} className="text-neutral-400 hover:text-[#9cce00] transition-colors font-sans text-xs font-bold">
                          986 / 987
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('911'); }} className="text-neutral-400 hover:text-[#9cce00] transition-colors font-sans text-xs">
                          911
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('CAYENNE'); }} className="text-neutral-400 hover:text-[#9cce00] transition-colors font-sans text-xs">
                          CAYENNE
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('PANAMERA'); }} className="text-neutral-400 hover:text-[#9cce00] transition-colors font-sans text-xs">
                          PANAMERA
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('TAYCAN'); }} className="text-neutral-400 hover:text-[#9cce00] transition-colors font-sans text-xs">
                          TAYCAN
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* COLUMN 4: MITSUBISHI -> LAMBORGHINI */}
                <div className="flex flex-col gap-8">
                  {/* MITSUBISHI */}
                  <div>
                    <button
                      onClick={() => handleSelectChassis('MITSUBISHI')}
                      className="w-full text-left font-display font-bold text-sm uppercase text-[#fafaf7] hover:text-[#9cce00] border-b border-[#9cce00]/40 pb-2 mb-4 bg-transparent border-0 cursor-pointer flex items-center gap-2.5"
                    >
                      {BrandLogos['MITSUBISHI']}
                      <span>MITSUBISHI</span>
                    </button>
                    <ul className="space-y-3 list-none p-0 m-0">
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('8 / 9'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">LANCER EVO</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">8 / 9</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('X'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">LANCER EVO</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">X</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('3000GT'); }} className="text-neutral-400 hover:text-[#9cce00] transition-colors font-sans text-xs">
                          GTO / 3000GT
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('FTO'); }} className="text-neutral-400 hover:text-[#9cce00] transition-colors font-sans text-xs">
                          FTO
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* LAMBORGHINI */}
                  <div>
                    <button
                      onClick={() => handleSelectChassis('LAMBORGHINI')}
                      className="w-full text-left font-display font-bold text-sm uppercase text-[#fafaf7] hover:text-[#9cce00] border-b border-[#9cce00]/40 pb-2 mb-4 bg-transparent border-0 cursor-pointer flex items-center gap-2.5"
                    >
                      {BrandLogos['LAMBORGHINI']}
                      <span>LAMBORGHINI</span>
                    </button>
                    <ul className="space-y-3 list-none p-0 m-0">
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('LAMBORGHINI'); }} className="text-neutral-400 hover:text-[#9cce00] transition-colors font-sans text-xs">
                          SHOP LAMBORGHINI
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* COLUMN 5: HONDA -> CHEVROLET */}
                <div className="flex flex-col gap-8">
                  {/* HONDA */}
                  <div>
                    <button
                      onClick={() => handleSelectChassis('HONDA')}
                      className="w-full text-left font-display font-bold text-sm uppercase text-[#fafaf7] hover:text-[#9cce00] border-b border-[#9cce00]/40 pb-2 mb-4 bg-transparent border-0 cursor-pointer flex items-center gap-2.5"
                    >
                      {BrandLogos['HONDA']}
                      <span>HONDA</span>
                    </button>
                    <ul className="space-y-3 list-none p-0 m-0">
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('FC / FK'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">CIVIC</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">FC / FK</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('EG / EK'); }} className="flex items-baseline gap-2 text-neutral-400 hover:text-[#9cce00] transition-colors group">
                          <span className="font-sans text-xs">CIVIC</span>
                          <span className="font-mono text-[9px] text-neutral-600 group-hover:text-[#9cce00]">EG / EK</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('JAZZ / FIT'); }} className="text-neutral-400 hover:text-[#9cce00] transition-colors font-sans text-xs">
                          JAZZ / FIT
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* CHEVROLET */}
                  <div>
                    <button
                      onClick={() => handleSelectChassis('CHEVROLET')}
                      className="w-full text-left font-display font-bold text-sm uppercase text-[#fafaf7] hover:text-[#9cce00] border-b border-[#9cce00]/40 pb-2 mb-4 bg-transparent border-0 cursor-pointer flex items-center gap-2.5"
                    >
                      {BrandLogos['CHEVROLET']}
                      <span>CHEVROLET</span>
                    </button>
                    <ul className="space-y-3 list-none p-0 m-0">
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('C8 CORVETTE'); }} className="text-neutral-400 hover:text-[#9cce00] transition-colors font-sans text-xs">
                          C8 CORVETTE
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* COLUMN 6: SUBARU -> FORD */}
                <div className="flex flex-col gap-8">
                  {/* SUBARU */}
                  <div>
                    <button
                      onClick={() => handleSelectChassis('SUBARU')}
                      className="w-full text-left font-display font-bold text-sm uppercase text-[#fafaf7] hover:text-[#9cce00] border-b border-[#9cce00]/40 pb-2 mb-4 bg-transparent border-0 cursor-pointer flex items-center gap-2.5"
                    >
                      {BrandLogos['SUBARU']}
                      <span>SUBARU</span>
                    </button>
                    <ul className="space-y-3 list-none p-0 m-0">
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('iMPREZA / WRX'); }} className="text-neutral-400 hover:text-[#9cce00] transition-colors font-sans text-xs italic">
                          iMPREZA / WRX
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* FORD */}
                  <div>
                    <button
                      onClick={() => handleSelectChassis('FORD')}
                      className="w-full text-left font-display font-bold text-sm uppercase text-[#fafaf7] hover:text-[#9cce00] border-b border-[#9cce00]/40 pb-2 mb-4 bg-transparent border-0 cursor-pointer flex items-center gap-2.5"
                    >
                      {BrandLogos['FORD']}
                      <span>FORD</span>
                    </button>
                    <ul className="space-y-3 list-none p-0 m-0">
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSelectChassis('RANGER'); }} className="text-neutral-400 hover:text-[#9cce00] transition-colors font-sans text-xs">
                          RANGER
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center border-t border-neutral-900 pt-6 mt-8 text-neutral-500 font-mono text-[10px] uppercase tracking-wider">
                <span>DON'T SEE YOUR CHASSIS? BESPOKE FITMENT AVAILABLE.</span>
                <a href="#" onClick={(e) => { e.preventDefault(); triggerToast("Bespoke fitment request form opened."); }} className="text-[#9cce00] hover:text-[#aacc00] font-bold">REQUEST A FITMENT &rarr;</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast alert system for interactive styling changes */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#0e0e0e]/95 border border-[#c0f20c]/45 px-5 py-2.5 rounded shadow-2xl flex items-center gap-2 max-w-sm w-[90%] backdrop-blur-md"
          >
            <div className="w-2 h-2 rounded-full bg-[#c0f20c] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-neutral-200 text-center w-full uppercase">
              {toastMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RENDER PAGES BASED ON STATE */}
      {currentPage === 'home' && (
        <div className="eti-page">
          {/* INTERACTIVE GSAP/FRAMER BANNER ANIME */}
          <BannerGsapFramerAnimation />
          {/* OVERLAPPING HOME CONTENT CONTAINER */}
          <div className="home-overlapping-content">
            {/* BRAND SPEC STRIP (MARQUEE) */}
            <div className="py-2 border-y border-neutral-900/50 bg-[#030303] overflow-hidden">
              <LogoLoop
                speed={30}
                direction="left"
                pauseOnHover={true}
                fadeOut={true}
                gap="gap-6 md:gap-8"
                items={BrandLoopList.map((brand) => (
                  <button
                    key={brand.name}
                    onClick={() => handleSelectChassis(brand.name)}
                    className="flex items-center gap-3 px-5 py-2.5 bg-neutral-950/40 border border-neutral-900/60 rounded-xl backdrop-blur-sm transition-all duration-300 hover:border-[#9cce00]/40 hover:bg-neutral-900/40 group cursor-pointer text-left focus:outline-none focus:ring-1 focus:ring-[#9cce00]/30 shrink-0"
                  >
                    <div className="w-8 h-8 flex items-center justify-center filter brightness-90 group-hover:brightness-110 group-hover:scale-105 transition-all duration-300">
                      <img src={brand.logo} className="w-8 h-8 object-contain shrink-0" alt={brand.name} />
                    </div>
                    <span className="font-display font-bold text-[11px] md:text-xs tracking-wider text-neutral-300 group-hover:text-[#9cce00] transition-colors">
                      {brand.name}
                    </span>
                  </button>
                ))}
              />
            </div>

          {/* 001-A — CHASSIS COLLECTIONS (EXPAND ON HOVER) */}
          <section className="pt-0 pb-24 border-b border-neutral-900 bg-[#080809]" id="fitment-hover">
            <div className="reveal w-full px-0" style={{ '--reveal-delay': '250ms' } as React.CSSProperties}>
              <ExpandOnHover 
                items={CHASSIS_LIST} 
                onSelect={(card) => {
                  if (card.model.includes("350Z")) {
                    setCurrentPage('product');
                  } else {
                    setCurrentPage('catalog');
                  }
                }} 
              />
            </div>
          </section>


          {/* Forza Showroom Tuner Section */}
          <ForzaShowroom triggerToast={triggerToast} onAddToCart={handleAddSimpleProductToCart} />

          {/* 002.5 — INTERACTIVE AERO EXPLORER */}
          <InteractiveCarExplorer onAddToCart={handleAddSimpleProductToCart} />

          {/* 003 — THE ETI STANDARD */}
          <section className="section standard">
            <div className="container">
              <div className="section-head">
                <div>
                  <span className="kicker reveal">003 — STANDARD</span>
                  <h2 className="display-l reveal" style={{ '--reveal-delay': '100ms', marginTop: '14px' } as React.CSSProperties}>The ETi Standard</h2>
                </div>
                <div className="ti-rule"></div>
                <span className="mono reveal" style={{ color: 'var(--eti-ti-dim)', '--reveal-delay': '200ms' } as React.CSSProperties}>Engineered. Tested. Built to last.</span>
              </div>

              <p className="standard__lede reveal" style={{ '--reveal-delay': '250ms' } as React.CSSProperties}>
                Every ETi piece is <strong>bespoke carbon</strong>, made to order against your chassis — not a catalog template.{" "}
                <strong>Race-engineered</strong> for measurable downforce. <strong>OEM-precision fit</strong> for bolt-on, drive-off install.{" "}
                Lighter than the factory part. Stronger under load. Built to outlast your build.
              </p>

              <div className="standard-grid">
                <div className="standard-item reveal" style={{ '--reveal-delay': '0ms' } as React.CSSProperties}>
                  <div className="ti-divider"></div>
                  <span className="item-num"><em>01</em> &nbsp;/&nbsp; MATERIAL</span>
                  <div className="standard-item__glyph" aria-hidden="true">
                    <svg viewBox="0 0 32 32" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="16,3 27,9.5 27,22.5 16,29 5,22.5 5,9.5" />
                      <polygon points="16,11 22,14.5 22,21.5 16,25 10,21.5 10,14.5" />
                      <line x1="5" y1="9.5" x2="10" y2="14.5" />
                      <line x1="27" y1="9.5" x2="22" y2="14.5" />
                      <line x1="5" y1="22.5" x2="10" y2="21.5" />
                      <line x1="27" y1="22.5" x2="22" y2="21.5" />
                      <line x1="16" y1="3" x2="16" y2="11" />
                      <line x1="16" y1="25" x2="16" y2="29" />
                    </svg>
                  </div>
                  <div className="counter"><span><AnimatedCounter target={40} suffix="%" /></span></div>
                  <h3>Lighter Than OEM</h3>
                  <p>Aerospace-grade carbon construction with a measurable weight reduction over the factory part. Stronger flex, greater fatigue life.</p>
                </div>

                <div className="standard-item reveal" style={{ '--reveal-delay': '120ms' } as React.CSSProperties}>
                  <div className="ti-divider"></div>
                  <span className="item-num"><em>02</em> &nbsp;/&nbsp; AERO</span>
                  <div className="standard-item__glyph" aria-hidden="true">
                    <svg viewBox="0 0 32 32" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 9 Q16 4 28 9" />
                      <path d="M4 16 Q16 11 28 16" />
                      <path d="M4 23 Q16 18 28 23" />
                      <polyline points="22,6 28,9 25,15" />
                      <polyline points="22,13 28,16 25,22" />
                    </svg>
                  </div>
                  <div className="counter"><span><AnimatedCounter target={200} /></span><span className="unit">km/h</span></div>
                  <h3>Track-Tuned Downforce</h3>
                  <p>Every shape is refined on real cars at real speed. Measurable downforce, reduced drag, no guesswork.</p>
                </div>

                <div className="standard-item reveal" style={{ '--reveal-delay': '240ms' } as React.CSSProperties}>
                  <div className="ti-divider"></div>
                  <span className="item-num"><em>03</em> &nbsp;/&nbsp; FINISH</span>
                  <div className="standard-item__glyph" aria-hidden="true">
                    <svg viewBox="0 0 32 32" stroke="currentColor" stroke-width="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="16" cy="16" r="12" />
                      <circle cx="16" cy="16" r="6" />
                      <path d="M9 9 L11.5 11.5" />
                      <path d="M14 5 L14 8" />
                      <path d="M22 9 L20 11" />
                      <circle cx="16" cy="16" r="1.6" fill="currentColor" stroke="none" />
                    </svg>
                  </div>
                  <div className="counter"><span><AnimatedCounter target={10} /></span><span className="unit">yr</span></div>
                  <h3>Built to Last</h3>
                  <p>Marine-grade clearcoat resists yellowing, heat cycling, and daily abuse. Gloss holds for years, not seasons.</p>
                </div>

                <div className="standard-item reveal" style={{ '--reveal-delay': '360ms' } as React.CSSProperties}>
                  <div className="ti-divider"></div>
                  <span className="item-num"><em>04</em> &nbsp;/&nbsp; FITMENT</span>
                  <div className="standard-item__glyph" aria-hidden="true">
                    <svg viewBox="0 0 32 32" stroke="currentColor" stroke-width="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="16" cy="16" r="12" />
                      <circle cx="16" cy="16" r="6" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="16" y1="26" x2="16" y2="30" />
                      <line x1="2" y1="16" x2="6" y2="16" />
                      <line x1="26" y1="16" x2="30" y2="16" />
                      <circle cx="16" cy="16" r="1.6" fill="currentColor" stroke="none" />
                    </svg>
                  </div>
                  <div className="counter"><span><AnimatedCounter target={0.5} decimals={1} /></span><span className="unit">mm</span></div>
                  <h3>OEM-Precision Fit</h3>
                  <p>Made to your chassis, not a catalog template. No heat gun. No sanding guesswork. Bolt on and drive.</p>
                </div>
              </div>

              <div className="standard__close reveal" style={{ '--reveal-delay': '480ms' } as React.CSSProperties}>
                <p className="standard__close-tagline">
                  The ETi Standard isn't a feature list. It's how every part leaves the bench.
                </p>
                <button onClick={() => setCurrentPage('catalog')} className="btn btn--paper">Read the ETi Process <span className="arrow"></span></button>
              </div>
            </div>
          </section>

          {/* MATERIAL EXPLORER (Moved below ETi Standard) */}
          <MaterialVisualizer type="accordion" />



          {/* 004-B — STORY SPLIT REVEAL ALTERNATIVE */}
          <StorySplitReveal />







        </div>
      </div>
    )}

      {/* CATALOG PAGE VIEW */}
      {currentPage === 'catalog' && (() => {
        const renderProductCard = (p: CatalogProduct, index: number) => {
          return (
            <a 
              key={p.id}
              href={`/products/${p.id}`}
              onClick={(e) => {
                if (p.isConfigurable) {
                  e.preventDefault();
                  setActiveConfigProduct(p);
                  setActiveCar(p.eyebrow);
                  setRecolouredImages({});
                  setRecolourCustomImage(null);
                  setRecolourCustomImageName('');
                  setActiveImageIndex(0);
                  setCurrentPage('product');
                } else {
                  handleProductAction(e, p);
                }
              }}
              className="eti-card reveal"
              style={{ '--reveal-delay': `${(index % 8) * 60}ms` } as React.CSSProperties}
            >
              <div className="eti-card-img">
                {p.isIcon ? (
                  <div className="w-full h-full bg-neutral-950 flex flex-col items-center justify-center p-6 space-y-3">
                    {p.iconName === 'insurance' ? (
                      <div className="w-16 h-16 rounded-full border border-neutral-800 bg-neutral-900/60 flex items-center justify-center text-[#9cce00] shadow-[0_0_15px_rgba(156,206,0,0.1)]">
                        <ShieldCheck className="w-8 h-8" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full border border-neutral-800 bg-neutral-900/60 flex items-center justify-center text-white">
                        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M7 3h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                          <path d="M5 10h14" />
                          <path d="M8 17v4" />
                          <path d="M16 17v4" />
                        </svg>
                      </div>
                    )}
                    <span className="text-[8px] font-mono tracking-widest text-neutral-500 uppercase">
                      VALTARI RACING GLYPH
                    </span>
                  </div>
                ) : (
                  <img 
                    src={p.image} 
                    alt={p.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/350z-hero-0.jpg';
                    }}
                  />
                )}
                
                {p.isSale && <span className="eti-card-tag">Sale</span>}
                
                <div className="eti-card-ov">
                  <p className="eti-card-eyebrow">
                    {p.eyebrow}
                  </p>
                  <h3 className="eti-card-title">{p.title}</h3>
                  <div className="eti-card-foot">
                    <span className="eti-card-price">
                      ${p.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    {p.isConfigurable && (
                      <span className="eti-card-options">Configurable</span>
                    )}
                  </div>
                </div>
              </div>
            </a>
          );
        };

        return (
          <div className="eti-collection eti-surface select-none">
            
            {/* 1. Breadcrumb navigation */}
            <nav className="eti-breadcrumb" aria-label="Breadcrumb">
              <a href="/" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>Home</a>
              <span aria-hidden="true" className="mx-2">/</span>
              <a href="/collections/all" onClick={(e) => { e.preventDefault(); setCurrentPage('catalog'); }}>Catalog</a>
              <span aria-hidden="true" className="mx-2">/</span>
              <span aria-current="page">All Products</span>
            </nav>

            {/* 2. Collection Hero Section */}
            <header className="eti-collection-hero">
              <p className="eti-eyebrow">Made to Order · Bespoke Carbon · Titanium</p>
              <h1 className="eti-collection-title">All Products</h1>
              <p className="eti-collection-subtitle">
                Precision fit. Real carbon & exotic titanium. Built for high performance standards.
              </p>

            </header>

            {/* ModelFinder Component */}
            <div style={{ maxWidth: 'var(--eti-page-max, 1500px)', margin: '0 auto', padding: '0 var(--eti-page-gutter, 40px) 24px' }}>
              <ModelFinder 
                onSearch={(query, message) => {
                  setSearchQuery(query);
                  if (message) {
                    triggerToast(message);
                  }
                }} 
              />
            </div>

            {/* 3. Sticky Category Navigation Bar */}
            {totalFound > 0 && (
              <nav className="eti-cat-nav" aria-label="Shop by category">
                <div className="eti-cat-nav-inner">
                  {bodyKits.length > 0 && (
                    <a 
                      href="#cat-body-kits" 
                      onClick={(e) => handleNavClick(e, 'cat-body-kits')}
                      className={activeNav === 'cat-body-kits' ? 'is-active' : ''}
                    >
                      Body Kits
                    </a>
                  )}
                  {aeroFiltered.length > 0 && (
                    <a 
                      href="#cat-aero" 
                      onClick={(e) => handleNavClick(e, 'cat-aero')}
                      className={activeNav === 'cat-aero' ? 'is-active' : ''}
                    >
                      Aero &amp; Body Panels
                    </a>
                  )}
                  {interior.length > 0 && (
                    <a 
                      href="#cat-interior" 
                      onClick={(e) => handleNavClick(e, 'cat-interior')}
                      className={activeNav === 'cat-interior' ? 'is-active' : ''}
                    >
                      Interior
                    </a>
                  )}
                  {hoods.length > 0 && (
                    <a 
                      href="#cat-hoods" 
                      onClick={(e) => handleNavClick(e, 'cat-hoods')}
                      className={activeNav === 'cat-hoods' ? 'is-active' : ''}
                    >
                      Hoods, Trunks &amp; Cowls
                    </a>
                  )}
                  {engine.length > 0 && (
                    <a 
                      href="#cat-engine" 
                      onClick={(e) => handleNavClick(e, 'cat-engine')}
                      className={activeNav === 'cat-engine' ? 'is-active' : ''}
                    >
                      Engine Bay
                    </a>
                  )}
                  {titanium.length > 0 && (
                    <a 
                      href="#cat-titanium" 
                      onClick={(e) => handleNavClick(e, 'cat-titanium')}
                      className={activeNav === 'cat-titanium' ? 'is-active' : ''}
                    >
                      Titanium
                    </a>
                  )}
                </div>
              </nav>
            )}

            {/* 4. Grouped Sections */}
            
            {/* Category Section: Body Kits */}
            {bodyKits.length > 0 && (
              <section 
                id="cat-body-kits" 
                className="eti-cat"
                ref={el => { sectionsRef.current['cat-body-kits'] = el; }}
              >
                <header className="eti-cat-head">
                  <p className="eti-eyebrow">Featured Style</p>
                  <h2 className="eti-cat-title">Body Kits</h2>
                  <p className="eti-cat-desc">
                    Full widebody programmes — Top Secret, Ridox, Tamon, TRD 3000GT, Akuma. Buy the kit complete or shop a single panel.
                  </p>
                </header>
                <div className="eti-cat-grid">
                  {bodyKits.slice(0, expandedSections['body-kits'] ? undefined : 8).map((p, idx) => renderProductCard(p, idx))}
                </div>
                {bodyKits.length > 8 && (
                  <button 
                    type="button" 
                    className={`eti-view-all ${expandedSections['body-kits'] ? 'is-expanded' : ''}`}
                    onClick={() => toggleSection('body-kits')}
                  >
                    <span>{expandedSections['body-kits'] ? 'View Less' : `View All ${bodyKits.length} Body Kits`}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform" style={{ transform: expandedSections['body-kits'] ? 'rotate(-90deg)' : 'none' }} />
                  </button>
                )}
              </section>
            )}

            {/* Category Section: Aero & Body Panels */}
            {aeroFiltered.length > 0 && (
              <section 
                id="cat-aero" 
                className="eti-cat"
                ref={el => { sectionsRef.current['cat-aero'] = el; }}
              >
                <header className="eti-cat-head">
                  <p className="eti-eyebrow">Individual Pieces</p>
                  <h2 className="eti-cat-title">Aero &amp; Body Panels</h2>
                  <p className="eti-cat-desc">
                    Front bumpers, rear bumpers, fenders, side skirts, diffusers, canards, wings, spoilers, lips — each available in your finish.
                  </p>
                  
                  {/* Aero Sub-filter matrix */}
                  <div className="eti-subfilter" role="group" aria-label="Filter by part type">
                    <button 
                      type="button" 
                      className={aeroSubFilter === 'all' ? 'is-active' : ''} 
                      onClick={() => setAeroSubFilter('all')}
                    >
                      All
                    </button>
                    <button 
                      type="button" 
                      className={aeroSubFilter === 'front-bumper' ? 'is-active' : ''} 
                      onClick={() => setAeroSubFilter('front-bumper')}
                    >
                      Front Bumpers
                    </button>
                    <button 
                      type="button" 
                      className={aeroSubFilter === 'rear-bumper' ? 'is-active' : ''} 
                      onClick={() => setAeroSubFilter('rear-bumper')}
                    >
                      Rear Bumpers
                    </button>
                    <button 
                      type="button" 
                      className={aeroSubFilter === 'side-skirt' ? 'is-active' : ''} 
                      onClick={() => setAeroSubFilter('side-skirt')}
                    >
                      Side Skirts
                    </button>
                    <button 
                      type="button" 
                      className={aeroSubFilter === 'lip' ? 'is-active' : ''} 
                      onClick={() => setAeroSubFilter('lip')}
                    >
                      Lips &amp; Splitters
                    </button>
                    <button 
                      type="button" 
                      className={aeroSubFilter === 'detail' ? 'is-active' : ''} 
                      onClick={() => setAeroSubFilter('detail')}
                    >
                      Details
                    </button>
                  </div>
                </header>
                
                <div className="eti-cat-grid">
                  {aeroFiltered.slice(0, expandedSections['aero'] ? undefined : 8).map((p, idx) => renderProductCard(p, idx))}
                </div>
                {aeroFiltered.length > 8 && (
                  <button 
                    type="button" 
                    className={`eti-view-all ${expandedSections['aero'] ? 'is-expanded' : ''}`}
                    onClick={() => toggleSection('aero')}
                  >
                    <span>{expandedSections['aero'] ? 'View Less' : `View All ${aeroFiltered.length} Aero Pieces`}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform" style={{ transform: expandedSections['aero'] ? 'rotate(-90deg)' : 'none' }} />
                  </button>
                )}
              </section>
            )}

            {/* Category Section: Interior */}
            {interior.length > 0 && (
              <section 
                id="cat-interior" 
                className="eti-cat"
                ref={el => { sectionsRef.current['cat-interior'] = el; }}
              >
                <header className="eti-cat-head">
                  <p className="eti-eyebrow">Cabin</p>
                  <h2 className="eti-cat-title">Interior</h2>
                  <p className="eti-cat-desc">
                    Center consoles, dash panels, gauge pods, armrests, door cards, shift frames — finished in carbon, Kevlar, or your spec.
                  </p>
                </header>
                <div className="eti-cat-grid">
                  {interior.slice(0, expandedSections['interior'] ? undefined : 8).map((p, idx) => renderProductCard(p, idx))}
                </div>
                {interior.length > 8 && (
                  <button 
                    type="button" 
                    className={`eti-view-all ${expandedSections['interior'] ? 'is-expanded' : ''}`}
                    onClick={() => toggleSection('interior')}
                  >
                    <span>{expandedSections['interior'] ? 'View Less' : `View All ${interior.length} Interior Pieces`}</span>
                    <ArrowRight className="w-3.5 h-3.5" style={{ transform: expandedSections['interior'] ? 'rotate(-90deg)' : 'none' }} />
                  </button>
                )}
              </section>
            )}

            {/* Category Section: Hoods, Trunks & Cowls */}
            {hoods.length > 0 && (
              <section 
                id="cat-hoods" 
                className="eti-cat"
                ref={el => { sectionsRef.current['cat-hoods'] = el; }}
              >
                <header className="eti-cat-head">
                  <p className="eti-eyebrow">Large Panels</p>
                  <h2 className="eti-cat-title">Hoods, Trunks &amp; Cowls</h2>
                  <p className="eti-cat-desc">
                    Carbon hoods (Top Secret, Varis, V8 swap), rear hatches, cowl panels — the panels that change the silhouette.
                  </p>
                </header>
                <div className="eti-cat-grid">
                  {hoods.slice(0, expandedSections['hoods'] ? undefined : 8).map((p, idx) => renderProductCard(p, idx))}
                </div>
                {hoods.length > 8 && (
                  <button 
                    type="button" 
                    className={`eti-view-all ${expandedSections['hoods'] ? 'is-expanded' : ''}`}
                    onClick={() => toggleSection('hoods')}
                  >
                    <span>{expandedSections['hoods'] ? 'View Less' : `View All ${hoods.length} Large Panels`}</span>
                    <ArrowRight className="w-3.5 h-3.5" style={{ transform: expandedSections['hoods'] ? 'rotate(-90deg)' : 'none' }} />
                  </button>
                )}
              </section>
            )}

            {/* Category Section: Engine Bay */}
            {engine.length > 0 && (
              <section 
                id="cat-engine" 
                className="eti-cat"
                ref={el => { sectionsRef.current['cat-engine'] = el; }}
              >
                <header className="eti-cat-head">
                  <p className="eti-eyebrow">Under the Hood</p>
                  <h2 className="eti-cat-title">Engine Bay</h2>
                  <p className="eti-cat-desc">
                    Cooling panels, coil pack covers, fuse box covers, manifold covers — dress-up that earns its place beside a forged 2JZ.
                  </p>
                </header>
                <div className="eti-cat-grid">
                  {engine.slice(0, expandedSections['engine'] ? undefined : 8).map((p, idx) => renderProductCard(p, idx))}
                </div>
                {engine.length > 8 && (
                  <button 
                    type="button" 
                    className={`eti-view-all ${expandedSections['engine'] ? 'is-expanded' : ''}`}
                    onClick={() => toggleSection('engine')}
                  >
                    <span>{expandedSections['engine'] ? 'View Less' : `View All ${engine.length} Engine Bay Accessories`}</span>
                    <ArrowRight className="w-3.5 h-3.5" style={{ transform: expandedSections['engine'] ? 'rotate(-90deg)' : 'none' }} />
                  </button>
                )}
              </section>
            )}

            {/* Category Section: Titanium */}
            {titanium.length > 0 && (
              <section 
                id="cat-titanium" 
                className="eti-cat"
                ref={el => { sectionsRef.current['cat-titanium'] = el; }}
              >
                <header className="eti-cat-head">
                  <p className="eti-eyebrow eti-eyebrow-luxury">ETi Signature</p>
                  <h2 className="eti-cat-title">Titanium</h2>
                  <p className="eti-cat-desc">
                    Gr5 Ti hardware, manifolds, dress fasteners — the ETi original line.
                  </p>
                </header>
                <div className="eti-cat-grid">
                  {titanium.slice(0, expandedSections['titanium'] ? undefined : 8).map((p, idx) => renderProductCard(p, idx))}
                </div>
                {titanium.length > 8 && (
                  <button 
                    type="button" 
                    className={`eti-view-all ${expandedSections['titanium'] ? 'is-expanded' : ''}`}
                    onClick={() => toggleSection('titanium')}
                  >
                    <span>{expandedSections['titanium'] ? 'View Less' : `View All ${titanium.length} Titanium Fasteners`}</span>
                    <ArrowRight className="w-3.5 h-3.5" style={{ transform: expandedSections['titanium'] ? 'rotate(-90deg)' : 'none' }} />
                  </button>
                )}
              </section>
            )}

            {totalFound === 0 && (
              <div className="text-center py-20 px-6 border border-neutral-900 bg-neutral-950/40 my-8 max-w-[1500px] mx-auto">
                <p className="text-neutral-400 font-mono text-xs uppercase tracking-widest mb-6">
                  No products found matching your customization query "{searchQuery}"
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-8 py-4 bg-[#c0f20c] hover:bg-[#aacc00] text-black font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-none cursor-pointer border border-[#c0f20c]"
                >
                  Clear Filter
                </button>
              </div>
            )}

            {/* 5. Editorial description at bottom */}
            <section className="eti-story" aria-labelledby="eti-story-heading">
              <h2 id="eti-story-heading" className="eti-story-heading">About the All Products catalogue</h2>
              <div className="eti-story-body">
                <p>
                  Welcome to the official Elite Ti atelier parts catalogue. Each panel, lip, splitter, and fastener represented here is designed, built, and finished to high performance standards. 
                </p>
                <p>
                  We run a complete made-to-order manufacturing process. Orders are queued immediately upon check-out. Raw carbon fiber layout, autoclave curing, ultraviolet-resistant clearcoat application, and precision CNC hardware finishing take between six to eight weeks.
                </p>
              </div>
            </section>

          </div>
        );
      })()}

      {/* TITANIUM PAGE VIEW */}
      {currentPage === 'titanium' && (
        <TitaniumCatalog 
          onAddToCart={(item) => {
            setCart(prev => [...prev, item]);
            setIsCartOpen(true);
          }}
          triggerToast={triggerToast}
          onNavigate={(path) => {
            if (path === '/') {
              setCurrentPage('home');
            } else if (path === '/collections/all') {
              setCurrentPage('catalog');
            } else if (path.startsWith('/products/')) {
              const prodId = path.split('/products/')[1];
              const titaniumProductsList = [
                {
                  id: 'ti_turbo_guard',
                  title: 'ETI UNIVERSAL TITANIUM TURBO GUARD',
                  price: 289,
                  image: '/images/prod_ti_turbo_guard.jpg',
                  eyebrow: 'Universal Fitment',
                  fitment: 'Universal'
                },
                {
                  id: 'ti_rb26_manifold',
                  title: 'ETI RB25/RB26 TURBO MANIFOLD',
                  price: 1250,
                  image: '/images/prod_rb26_manifold.jpg',
                  eyebrow: 'Skyline GTR R32/R33/R34',
                  fitment: 'Nissan'
                },
                {
                  id: 'ti_ek_manifold',
                  title: 'ETI EK/EG TURBO MANIFOLD',
                  price: 1350,
                  image: '/images/prod_ek_manifold.jpg',
                  eyebrow: 'Civic EG/EK B-Series',
                  fitment: 'Honda'
                },
                {
                  id: 'ti_1jz_ge_manifold',
                  title: 'ETI 1JZ GE TURBO MANIFOLD',
                  price: 1250,
                  image: '/images/prod_1jz_ge_manifold.jpg',
                  eyebrow: 'Chaser/Cresta/Mark II',
                  fitment: 'Toyota'
                },
                {
                  id: 'ti_1jz_gte_manifold',
                  title: 'ETI 1JZ GTE TURBO MANIFOLD',
                  price: 1250,
                  image: '/images/prod_1jz_gte_manifold.jpg',
                  eyebrow: 'Supra MK3 / Chaser R154',
                  fitment: 'Toyota'
                },
                {
                  id: 'ti_2jz_ge_mid_manifold',
                  title: 'ETI 2JZ GE MID MOUNT TURBO MANIFOLD',
                  price: 1250,
                  image: '/images/prod_2jz_ge_mid_manifold.jpg',
                  eyebrow: 'Supra MK4 / Altezza JJZ',
                  fitment: 'Toyota'
                },
                {
                  id: 'ti_2jz_ge_long_manifold',
                  title: 'ETI 2JZ GE LONG RUNNER TURBO MANIFOLD',
                  price: 1350,
                  image: '/images/prod_2jz_ge_long_manifold.jpg',
                  eyebrow: 'Supra MK4 / Aristo',
                  fitment: 'Toyota'
                },
                {
                  id: 'ti_rb20_manifold',
                  title: 'ETI RB20/RB25/RB26 TURBO MANIFOLD',
                  price: 1250,
                  image: '/images/prod_rb20_manifold.jpg',
                  eyebrow: 'Nissan Skyline R32/R33/R34',
                  fitment: 'Nissan'
                },
                {
                  id: 'ti_mr2_stud_kit',
                  title: 'MR2 TITANIUM MANIFOLD STUD KIT',
                  price: 85,
                  image: '/images/prod_mr2_stud_kit.jpg',
                  eyebrow: 'MR2 SW20 3S-GTE',
                  fitment: 'Toyota'
                },
                {
                  id: 'ti_supra_bolt_kit',
                  title: 'MKIV SUPRA TITANIUM BOLT KIT',
                  price: 189,
                  image: '/images/prod_supra_bolt_kit.jpg',
                  eyebrow: 'Supra MK4 (JZA80)',
                  fitment: 'Toyota'
                },
                {
                  id: 'ti_rx7_pulley_kit',
                  title: 'ETI RX-7 TITANIUM PULLEY HARDWARE',
                  price: 145,
                  image: '/images/prod_rx7_pulley_kit.jpg',
                  eyebrow: 'Mazda RX-7 FD3S',
                  fitment: 'Mazda'
                },
                {
                  id: 'ti_rx7_key',
                  title: 'ETI RX-7 TITANIUM KEY',
                  price: 125,
                  image: '/images/prod_rx7_key.jpg',
                  eyebrow: 'Mazda RX-7 FD3S',
                  fitment: 'Mazda'
                },
                {
                  id: 'ti_fk_exhaust',
                  title: 'ETI TITANIUM FULL EXHAUST FK CIVIC',
                  price: 2450,
                  image: '/images/prod_fk_exhaust.jpg',
                  eyebrow: 'Civic Type R FK8',
                  fitment: 'Honda'
                },
                {
                  id: 'ti_rx7_wheel_studs',
                  title: 'ETI RX-7 TITANIUM WHEEL STUDS 55MM',
                  price: 90,
                  image: '/images/prod_rx7_wheel_studs.jpg',
                  eyebrow: 'Mazda RX-7 FD3S',
                  fitment: 'Mazda'
                },
                {
                  id: 'ti_rx7_key_fd',
                  title: 'ETI RX-7 TITANIUM KEY (FB/FC/FD)',
                  price: 125,
                  image: '/images/prod_rx7_ti_key.jpg',
                  eyebrow: 'Mazda RX-7 All Generations',
                  fitment: 'Mazda'
                },
                {
                  id: 'ti_350z_hw_kit',
                  title: 'ETI 350Z TITANIUM HARDWARE KIT',
                  price: 250,
                  image: '/images/prod_350z_ti_hardware_kit.png',
                  eyebrow: 'Nissan 350Z (Z33)',
                  fitment: 'Nissan'
                },
                {
                  id: 'ti_supra_bolt_kit_v2',
                  title: 'MKIV SUPRA TITANIUM FULL BOLT KIT',
                  price: 560,
                  image: '/images/prod_supra_bolt_kit.jpg',
                  eyebrow: 'Supra MK4 (JZA80) Stage 2',
                  fitment: 'Toyota'
                },
                {
                  id: 'ti_evo_manifold',
                  title: 'ETI EVO 9 4G63 TURBO MANIFOLD',
                  price: 2650,
                  image: '/images/prod_evo_manifold.jpg',
                  eyebrow: 'Mitsubishi Lancer Evo 9',
                  fitment: 'Mitsubishi'
                },
                {
                  id: 'ti_ek_strut_bar',
                  title: 'ETI EK CIVIC TITANIUM STRUT BAR',
                  price: 1100,
                  image: '/images/prod_ek_strut_bar.png',
                  eyebrow: 'Civic EK (96–00) B-Series',
                  fitment: 'Honda'
                }
              ];
              const found = titaniumProductsList.find(p => p.id === prodId);
              if (found) {
                setSelectedProductDetail(found);
                setCurrentPage('product-detail');
              }
            }
          }}
        />
      )}

      {/* DETAILED PRODUCT PAGE VIEW */}
      {currentPage === 'product-detail' && selectedProductDetail && (
        <ProductDetail 
          product={selectedProductDetail}
          onAddToCart={(item) => {
            setCart(prev => [...prev, item]);
            setIsCartOpen(true);
          }}
          onNavigate={(path) => {
            if (path === '/') {
              setCurrentPage('home');
            } else if (path === '/collections/all') {
              setCurrentPage('titanium');
            } else {
              setCurrentPage('titanium');
            }
          }}
          triggerToast={triggerToast}
        />
      )}

      {/* SWAG PAGE VIEW */}
      {currentPage === 'swag' && (
        <section className="px-6 md:px-12 lg:px-20 py-12 max-w-[1200px] mx-auto space-y-12 min-h-[75vh]">
          {/* Header */}
          <div className="border-b border-neutral-900 pb-6 text-center space-y-2">
            <span className="text-xs font-mono text-[#c0f20c] uppercase tracking-widest font-bold">ATELIER APPAREL & ACCESSORIES</span>
            <h1 className="text-4xl font-bold text-white tracking-tight uppercase">OFFICIAL SWAG</h1>
            <p className="text-xs font-mono text-neutral-400 max-w-xl mx-auto uppercase">
              Heavyweight garments and track caps customized to represent the Manufaktur. Shipped worldwide.
            </p>
          </div>

          {/* Clothing sizes selector widget */}
          <div className="bg-[#080809] border border-neutral-900 rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-3xl mx-auto">
            <div>
              <span className="text-xs font-mono text-white font-bold uppercase tracking-wider block">CLOTHING SIZE SPECIFICATION:</span>
              <span className="text-[10px] font-mono text-neutral-500 uppercase">Applies to all T-shirts and Hoodies added below.</span>
            </div>

            <div className="flex gap-2">
              {(['S', 'M', 'L', 'XL'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSwagSize(size);
                    triggerToast(`Apparel size configured to: Size ${size}`);
                  }}
                  className={`w-10 h-10 border rounded font-mono text-xs uppercase tracking-wider flex items-center justify-center transition-colors cursor-pointer ${
                    swagSize === size 
                      ? 'bg-[#c0f20c] text-black border-[#c0f20c] font-bold' 
                      : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Swag grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: "sw-tee-green", title: "ETI OFFICIAL ATELIER GREEN LOGO TEE", price: 35, image: "https://cdn.shopify.com/s/files/1/0842/8362/1657/files/Mask_group.png?v=1760445002", requiresSize: true },
              { id: "sw-hoodie-zip", title: "ETI MOTORSPORTS TRACK ZIP HOODIE", price: 65, image: "https://cdn.shopify.com/s/files/1/0842/8362/1657/files/Mask_group_2.png?v=1760683834", requiresSize: true },
              { id: "sw-cap-track", title: "ETI MASTER TRACK CAP (BLACK)", price: 28, image: "https://cdn.shopify.com/s/files/1/0842/8362/1657/collections/toyota-supra-mkv-a90-5805566.jpg?v=1765735301", requiresSize: false },
              { id: "sw-keychain-ti", title: "GRADE 5 TITANIUM LOGO KEYCHAIN", price: 18, image: "https://cdn.shopify.com/s/files/1/0842/8362/1657/collections/toyota-supra-mkiv-2961889.png?v=1765735300", requiresSize: false }
            ].map((p) => (
              <div 
                key={p.id}
                className="bg-neutral-950 border border-neutral-900 rounded-lg overflow-hidden group hover:border-neutral-850 transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-square bg-neutral-900 overflow-hidden">
                  <img 
                    src={p.image} 
                    alt={p.title} 
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wide leading-tight group-hover:text-[#c0f20c] transition-colors">
                      {p.title}
                    </h3>
                    {p.requiresSize && (
                      <span className="inline-block text-[8px] font-mono text-neutral-500 uppercase">
                        Size: {swagSize}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold text-[#c0f20c] block">${p.price.toFixed(2)} USD</span>
                    <button
                      onClick={() => handleAddSimpleProductToCart({ 
                        id: p.id, 
                        title: p.requiresSize ? `${p.title} (SIZE ${swagSize})` : p.title, 
                        price: p.price, 
                        category: 'swag',
                        imageType: 'tier2' 
                      })}
                      className="w-full py-2 bg-neutral-900 border border-neutral-800 text-white rounded text-[10px] font-mono uppercase tracking-widest hover:bg-[#c0f20c] hover:text-black hover:border-[#c0f20c] transition-colors cursor-pointer"
                    >
                      + ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {currentPage === 'product' && (
        <main className="w-full px-6 md:px-10 lg:px-16 mt-8 space-y-20">
          
          {/* =========================================================================
              TIER 1 SECTION — NISSAN 350Z TOP SECRET STYLE WIDEBODY BODY KIT
              ========================================================================= */}
          <section className="space-y-6">
            <div className="border-b border-neutral-900 pb-5">
              {/* Breadcrumb matching layout */}
              <div className="text-[10px] font-mono tracking-[0.2em] text-neutral-500 uppercase flex items-center gap-1.5 mb-1.5">
                <span>VEHICLES</span>
                <span className="text-neutral-700">/</span>
                <span>{activeConfigProduct.eyebrow.split(' ')[0].toUpperCase()}</span>
                <span className="text-neutral-700">/</span>
                <span className="text-[#c0f20c] font-medium">{activeConfigProduct.eyebrow.split(' ').slice(1).join(' ').toUpperCase()}</span>
              </div>

              {/* Accent badge text */}
              <span className="text-xs font-mono font-extrabold tracking-widest text-[#c0f20c] uppercase">
                {activeConfigProduct.eyebrow.toUpperCase()} SPECIFICATION
              </span>

              {/* Header titles */}
              <h1 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mt-1 leading-none">
                {activeConfigProduct.title}
              </h1>
              <p className="text-[10px] font-mono tracking-widest text-neutral-400 mt-2 uppercase">
                BESPOKE CARBON • BUILT TO ORDER • ${activeConfigProduct.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD COMPLETE KIT (FRP)
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* LEFT COLUMN: Product image gallery */}
              <div className="lg:col-span-5 space-y-3">
                
                {/* Main product image */}
                <div className="relative rounded-lg overflow-hidden bg-[#0a0a0a] border border-neutral-900 aspect-square">
                  <img 
                    src={recolouredImages[activeImageIndex] || (recolourCustomImage && activeImageIndex === 0 ? recolourCustomImage : productImages[activeImageIndex])} 
                    alt={`${activeConfigProduct.title} - View ${activeImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* ETI Badge overlay */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-[#c0f20c] bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded border border-[#c0f20c]/20 uppercase">
                      ETI ATELIER SPEC
                    </span>
                  </div>
                  {/* Image counter */}
                  <div className="absolute bottom-4 right-4 text-[9px] font-mono font-bold text-white/70 bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
                    {activeImageIndex + 1} / {productImages.length}
                  </div>
                </div>

                {/* Thumbnail strip */}
                <div className="grid grid-cols-4 gap-2">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`aspect-square rounded-md overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                        activeImageIndex === idx 
                          ? 'border-[#c0f20c] shadow-[0_0_10px_rgba(192,242,12,0.2)]' 
                          : 'border-neutral-800 hover:border-neutral-600 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={recolouredImages[idx] || (recolourCustomImage && idx === 0 ? recolourCustomImage : img)} 
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                {/* Fitment badge */}
                <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#c0f20c]" />
                    <span>FITMENT: {activeConfigProduct.eyebrow.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#c0f20c]" />
                    <span>7 COMPONENTS</span>
                  </div>
                </div>

                {/* ETI ACTIVE RECOLOUR SYSTEM PANEL */}
                <div className="bg-black/60 border border-neutral-900 rounded-lg p-5 mt-4 space-y-4 backdrop-blur-md relative overflow-hidden">
                  
                  {/* Glowing header */}
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#c0f20c] animate-pulse" />
                      <span className="text-[10px] font-mono font-bold tracking-widest text-[#c0f20c] uppercase">
                        ETI ACTIVE RECOLOUR SYSTEM
                      </span>
                    </div>
                    
                    {/* Status Pill */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] font-mono tracking-widest text-neutral-500 uppercase">SERVER:</span>
                      {isRecolourServerConnected === null ? (
                        <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest">PINGING...</span>
                      ) : isRecolourServerConnected ? (
                        <span className="text-[8px] font-mono text-[#c0f20c] uppercase tracking-widest font-bold flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-[#c0f20c]" /> ONLINE
                        </span>
                      ) : (
                        <span className="text-[8px] font-mono text-red-500 uppercase tracking-widest font-bold flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-red-500" /> OFFLINE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body description */}
                  <p className="text-[10px] font-mono text-neutral-450 uppercase leading-relaxed">
                    Use our offline computer vision engine (OpenCV) or Photoroom AI endpoint to customize the car's color scheme in real-time.
                  </p>

                  {/* Preset Colors Grid */}
                  <div className="space-y-2">
                    <label className="block text-[9px] font-mono text-neutral-450 uppercase tracking-widest font-bold">PRESET SWATCHES</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { hex: '#ef4444', name: 'CANDY RED' },
                        { hex: '#ef5da8', name: 'HOT PINK' },
                        { hex: '#f97316', name: 'SUNSET ORANGE' },
                        { hex: '#eab308', name: 'CHROME YELLOW' },
                        { hex: '#22c55e', name: 'MIDORI GREEN' },
                        { hex: '#06b6d4', name: 'TOKYO CYAN' },
                        { hex: '#3b82f6', name: 'WANGAN BLUE' },
                        { hex: '#8b5cf6', name: 'ANODIZED PURPLE' },
                        { hex: '#ffffff', name: 'PEARL WHITE' },
                        { hex: '#1a1a1a', name: 'STEALTH BLACK' },
                        { hex: '#6b7280', name: 'GUNMETAL GREY' }
                      ].map((preset) => (
                        <button
                          key={preset.hex}
                          onClick={() => {
                            setRecolourColor(preset.hex);
                            handleApplyRecolour({ color: preset.hex });
                          }}
                          className={`w-7 h-7 rounded border transition-transform cursor-pointer relative ${
                            recolourColor === preset.hex ? 'border-[#c0f20c] scale-110 shadow-[0_0_8px_rgba(192,242,12,0.4)]' : 'border-neutral-800 hover:border-neutral-500'
                          }`}
                          style={{ backgroundColor: preset.hex }}
                          title={preset.name}
                        >
                          {recolourColor === preset.hex && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-white mix-blend-difference" />
                            </div>
                          )}
                        </button>
                      ))}

                      {/* Custom color picker */}
                      <div className="relative w-7 h-7 rounded border border-neutral-850 hover:border-neutral-500 overflow-hidden cursor-pointer flex items-center justify-center bg-neutral-950">
                        <input
                          type="color"
                          value={recolourColor}
                          onChange={(e) => {
                            const val = e.target.value;
                            setRecolourColor(val);
                            handleApplyRecolour({ color: val });
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <div className="text-[10px] font-mono font-bold text-neutral-400">+</div>
                      </div>
                    </div>
                  </div>

                  {/* Grid for parameters */}
                  <div className="grid grid-cols-1 gap-3 text-xs font-mono">
                    
                    {/* Target Component */}
                    <div className="space-y-1.5">
                      <label className="block text-[9px] text-neutral-400 uppercase tracking-widest font-bold">RECOLOUR TARGET</label>
                      <select
                        value={recolourPart}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRecolourPart(val);
                          if (Object.keys(recolouredImages).length > 0 || recolourCustomImage) {
                            handleApplyRecolour({ part: val });
                          }
                        }}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white font-mono text-[10px] focus:border-[#c0f20c] outline-none cursor-pointer uppercase text-left"
                      >
                        <option value="">ENTIRE VEHICLE</option>
                        <option value="bumper">BUMPERS / SPOILERS</option>
                        <option value="fender">FRONT / REAR FENDERS</option>
                        <option value="skirt">SIDE SKIRTS</option>
                        <option value="wing">LOWER WING LEGS</option>
                      </select>
                    </div>
                  </div>

                  {/* Secondary settings */}
                  <div className="grid grid-cols-2 gap-y-2 text-[9px] font-mono text-neutral-500 border-t border-neutral-900 pt-3">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={recolourKeepBg}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setRecolourKeepBg(val);
                          if (Object.keys(recolouredImages).length > 0 || recolourCustomImage) {
                            handleApplyRecolour({ keepBg: val });
                          }
                        }}
                        className="accent-[#c0f20c]"
                      />
                      <span className="uppercase tracking-wider">PRESERVE SHADOWS</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={recolourAllViews}
                        onChange={(e) => setRecolourAllViews(e.target.checked)}
                        className="accent-[#c0f20c]"
                      />
                      <span className="uppercase tracking-wider">APPLY TO ALL VIEWS</span>
                    </label>

                    {recolourEngine === 'local' && (
                      <label className="flex items-center gap-2 cursor-pointer select-none col-span-2">
                        <input
                          type="checkbox"
                          checked={recolourColorize}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setRecolourColorize(val);
                            if (Object.keys(recolouredImages).length > 0 || recolourCustomImage) {
                              handleApplyRecolour({ colorize: val });
                            }
                          }}
                          className="accent-[#c0f20c]"
                        />
                        <span className="uppercase tracking-wider">FORCE COLORIZE (GREY/CARBON PARTS)</span>
                      </label>
                    )}
                  </div>

                  {/* Custom upload area */}
                  <div className="border border-dashed border-neutral-800 hover:border-[#c0f20c]/30 rounded-lg p-3 text-center transition-colors relative cursor-pointer bg-neutral-950/20">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setRecolourCustomImage(event.target?.result as string);
                            setRecolourCustomImageName(file.name);
                            setRecolouredImages({}); // clear old recolours
                            setActiveImageIndex(0); // select the custom slot
                            triggerToast(`📷 Loaded custom image: ${file.name}`);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="space-y-1">
                      <span className="block text-[9px] font-mono text-neutral-450 uppercase tracking-widest font-bold">
                        {recolourCustomImage ? `CUSTOM: ${recolourCustomImageName.toUpperCase()}` : 'UPLOAD CUSTOM VEHICLE PHOTO'}
                      </span>
                      <span className="block text-[8px] font-mono text-neutral-600 uppercase tracking-wider">
                        DRAG & DROP OR BROWSE (PNG/JPG)
                      </span>
                    </div>
                  </div>

                  {/* Action triggers */}
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={handleApplyRecolour}
                      disabled={isRecolourLoading}
                      className="flex-1 h-10 bg-neutral-900 hover:bg-[#c0f20c] hover:text-black border border-neutral-800 hover:border-[#c0f20c] text-white font-mono text-[9px] font-bold uppercase tracking-widest transition-all cursor-pointer rounded flex items-center justify-center gap-2 disabled:opacity-40"
                    >
                      {isRecolourLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                          <span>PROCESSING...</span>
                        </>
                      ) : (
                        <span>APPLY COLOUR SCHEME</span>
                      )}
                    </button>

                    {(Object.keys(recolouredImages).length > 0 || recolourCustomImage) && (
                      <button
                        onClick={() => {
                          setRecolouredImages({});
                          setRecolourCustomImage(null);
                          setRecolourCustomImageName('');
                          triggerToast('🎨 Color scheme restored to factory default!');
                        }}
                        className="h-10 px-4 bg-transparent border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-950 text-neutral-400 hover:text-white font-mono text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer rounded"
                      >
                        RESET
                      </button>
                    )}
                  </div>

                </div>

              </div>

              {/* RIGHT COLUMN: SELECT COMPONENTS builder config */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Header select */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold tracking-widest text-[#c0f20c]">01</span>
                    <span className="text-xs font-mono font-bold tracking-widest text-white uppercase">SELECT COMPONENTS</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Interactive Configurator</span>
                </div>

                {/* COMPLETE KIT TOGGLE SWITCH */}
                <div 
                  onClick={handleCompleteKitToggle}
                  className={`p-4 rounded-lg border transition-all duration-300 flex items-center justify-between cursor-pointer select-none relative overflow-hidden ${
                    isCompleteKit 
                      ? 'bg-[#c0f20c]/10 border-[#c0f20c] shadow-[0_0_15px_rgba(192,242,12,0.15)]' 
                      : 'bg-[#121212]/40 border-neutral-900 hover:border-neutral-800'
                  }`}
                >
                  {/* Visual side glow accent on selective complete kit */}
                  {isCompleteKit && (
                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#c0f20c]" />
                  )}

                  <div className="flex items-center gap-3.5">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300 shrink-0 ${
                      isCompleteKit 
                        ? 'border-[#c0f20c] bg-[#c0f20c] shadow-[0_0_8px_rgba(192,242,12,0.4)]' 
                        : 'border-neutral-700 bg-neutral-950'
                    }`}>
                      {isCompleteKit && <Check className="w-3.5 h-3.5 text-black stroke-[3.5]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-medium text-xs text-white uppercase tracking-widest">
                          COMPLETE KIT — ALL 7 PIECES
                        </h4>
                        <span className="relative flex h-2 w-2">
                          {isCompleteKit && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c0f20c] opacity-75"></span>
                          )}
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${isCompleteKit ? 'bg-[#c0f20c]' : 'bg-neutral-800'}`}></span>
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-neutral-400 uppercase mt-0.5">
                        Includes matched autoclave fiber casting & factory crating
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <span className="text-[9.5px] font-mono font-extrabold px-2.5 py-1 rounded text-black bg-[#c0f20c] tracking-wider shadow-sm">
                      SAVE 10%
                    </span>
                  </div>
                </div>

                {/* COMPONENT ROWS LIST */}
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                  {tier1Components.map((item) => {
                    const currentPrice = getComponentPrice(item, priceScalingFactor);
                    const isCarbon = item.material === 'carbon';
                    const isFRP = item.material === 'frp';
                    const activeFinish = item.finish || 'matte';
                    
                    return (
                      <div 
                        key={item.id}
                        className={`p-4 rounded-lg border transition-all duration-300 relative overflow-hidden ${
                          item.isSelected 
                            ? 'bg-neutral-900/60 border-neutral-700/60 shadow-lg shadow-black/40' 
                            : 'bg-[#0a0a0a]/30 border-neutral-900/60 opacity-60 hover:opacity-95 hover:border-neutral-800 hover:bg-neutral-950/40'
                        }`}
                      >
                        {/* Active indicator top bar glow */}
                        {item.isSelected && (
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c0f20c]/60 to-transparent" />
                        )}

                        <div className="flex items-start justify-between gap-4">
                          {/* Left: Checkbox + Title + material selectors */}
                          <div className="flex-1 flex gap-4">
                            {/* custom checkbox with premium ripple */}
                            <button 
                              onClick={() => handleComponentSelectToggle(item.id)}
                              className={`w-5 h-5 rounded-md border shrink-0 flex items-center justify-center transition-all duration-300 mt-1 cursor-pointer ${
                                item.isSelected 
                                  ? 'border-[#c0f20c] bg-gradient-to-br from-[#c0f20c] to-[#aacc00] shadow-[0_0_10px_rgba(192,242,12,0.3)]' 
                                  : 'border-neutral-800 bg-neutral-950 hover:border-neutral-600'
                              }`}
                            >
                              {item.isSelected && <Check className="w-3.5 h-3.5 text-black stroke-[3.5]" />}
                            </button>

                            {/* Title & togglers */}
                            <div className="space-y-3 w-full">
                              <div className="flex flex-wrap items-center gap-2">
                                <span 
                                  onClick={() => handleComponentSelectToggle(item.id)}
                                  className={`font-display text-[13px] font-semibold tracking-wider uppercase cursor-pointer select-none block hover:text-white transition-colors duration-200 ${
                                    item.isSelected ? 'text-white font-bold' : 'text-neutral-500 line-through'
                                  }`}
                                >
                                  {item.name}
                                </span>
                                
                                {/* Small status indicators */}
                                {item.isSelected && (
                                  <span className={`text-[8px] font-mono tracking-widest px-1.5 py-0.5 rounded leading-none ${
                                    isCarbon 
                                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                                      : 'bg-neutral-800 text-neutral-400'
                                  }`}>
                                    {isCarbon ? 'BESPOKE WEAVE' : 'STANDARD GELCOAT'}
                                  </span>
                                )}
                              </div>

                              {/* FRP vs CARBON materials buttons */}
                              {item.isSelected && (
                                <div className="space-y-3">
                                  <div className="flex flex-wrap items-center gap-2.5">
                                    {item.canFRP ? (
                                      <div className="flex bg-neutral-950 p-[3px] rounded-md border border-neutral-850/80">
                                        <button
                                          onClick={() => handleComponentMaterialChange(item.id, 'frp')}
                                          className={`px-3.5 py-1 text-[9px] font-mono font-bold tracking-widest rounded-sm transition-all duration-200 cursor-pointer ${
                                            isFRP
                                              ? 'bg-neutral-800 text-white font-extrabold shadow-sm'
                                              : 'text-neutral-500 hover:text-neutral-300'
                                          }`}
                                        >
                                          FRP
                                        </button>
                                        <button
                                          onClick={() => handleComponentMaterialChange(item.id, 'carbon')}
                                          className={`px-3.5 py-1 text-[9px] font-mono font-bold tracking-widest rounded-sm transition-all duration-200 relative cursor-pointer ${
                                            isCarbon
                                              ? 'bg-gradient-to-r from-neutral-900 to-black text-[#c0f20c] font-extrabold border border-neutral-800'
                                              : 'text-neutral-500 hover:text-neutral-300'
                                          }`}
                                        >
                                          {isCarbon && (
                                            <span className="absolute inset-0 bg-neutral-900 carbon-weave opacity-20 rounded-sm" />
                                          )}
                                          <span className="relative z-10">CARBON</span>
                                        </button>
                                      </div>
                                    ) : (
                                      <span className="text-[8.5px] font-mono font-extrabold text-[#c0f20c]/85 bg-[#c0f20c]/5 border border-[#c0f20c]/20 px-2 py-0.5 rounded tracking-widest uppercase">
                                        CARBON ONLY
                                      </span>
                                    )}
                                  </div>

                                  {/* Custom Finish Selection with real visual weave previews */}
                                  <AnimatePresence>
                                    {isCarbon && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2 pt-1.5 overflow-hidden"
                                      >
                                        <span className="text-[9px] font-mono text-neutral-500 tracking-wider uppercase block">
                                          FIBER SPECIFICATION & FINISH
                                        </span>
                                        <div className="grid grid-cols-4 gap-1.5">
                                          {[
                                            { id: 'matte', name: 'MATTE', info: 'Satin Twill', cost: 'Standard', isPremium: false },
                                            { id: 'gloss', name: 'GLOSS', info: 'Deep Shine', cost: 'Standard', isPremium: false },
                                            { id: 'forged', name: 'FORGED', info: 'Carbon Marble', cost: '+10%', isPremium: true },
                                            { id: 'kevlar', name: 'KEVLAR', info: 'Core Strength', cost: '+12%', isPremium: true }
                                          ].map((fin) => {
                                            const isFinSelected = activeFinish === fin.id;
                                            return (
                                              <button
                                                key={fin.id}
                                                onClick={() => handleComponentFinishChange(item.id, fin.id as FinishType)}
                                                title={`${fin.name} - ${fin.info}`}
                                                className={`relative h-11 rounded-md transition-all duration-300 border flex flex-col justify-center px-2 text-left cursor-pointer overflow-hidden group select-none ${
                                                  isFinSelected
                                                    ? 'border-[#c0f20c] text-white shadow-[0_0_12px_rgba(192,242,12,0.1)]'
                                                    : 'border-neutral-900 bg-neutral-950/50 hover:border-neutral-800 text-neutral-400 hover:text-white'
                                                }`}
                                              >
                                                {fin.id === 'forged' && (
                                                  <div className="absolute inset-0 forged-weave opacity-25 group-hover:opacity-40 transition-opacity" />
                                                )}
                                                {fin.id === 'kevlar' && (
                                                  <div className="absolute inset-0 kevlar-weave opacity-20 group-hover:opacity-35 transition-opacity" />
                                                )}
                                                {fin.id === 'gloss' && (
                                                  <div className="absolute inset-0 carbon-weave shiny-overlay opacity-20 group-hover:opacity-45 transition-opacity" />
                                                )}
                                                {fin.id === 'matte' && (
                                                  <div className="absolute inset-0 carbon-weave opacity-[0.18] group-hover:opacity-30 transition-opacity" />
                                                )}

                                                <span className="relative z-10 text-[9px] font-mono tracking-widest font-bold leading-none uppercase">
                                                  {fin.name}
                                                </span>
                                                <span className="relative z-10 text-[7.5px] font-mono text-neutral-500 mt-0.5 leading-none">
                                                  {fin.cost}
                                                </span>
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right: Dynamic configured pricing */}
                          <div className="text-right shrink-0">
                            <span className={`font-mono text-xs font-bold transition-all ${item.isSelected ? 'text-[#c0f20c]' : 'text-neutral-600'}`}>
                              ${currentPrice.toLocaleString()}
                            </span>
                            {item.isSelected && (
                              <div className="text-[8px] font-mono text-neutral-500 uppercase mt-1">
                                {isFRP ? '-$180 GELCOAT' : activeFinish === 'forged' ? '+10% FORGED' : activeFinish === 'kevlar' ? '+12% KEVLAR' : 'STAND-WEAVE'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 02 REVIEW BUILD */}
                <div className="space-y-4 pt-4 border-t border-neutral-900">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold tracking-widest text-[#c0f20c]">02</span>
                      <span className="text-xs font-mono font-bold tracking-widest text-white uppercase">REVIEW BUILD SPECS</span>
                    </div>
                    <span className="text-[9px] font-mono text-neutral-500 uppercase">ATELIER ORDER SLIP SV01</span>
                  </div>

                  {/* Subtotal Box Panel */}
                  <div className="p-6 rounded-lg bg-neutral-950 border border-neutral-900 shadow-2xl relative overflow-hidden space-y-5">
                    
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-neutral-800" />
                    
                    {/* Detailed Specs List */}
                    <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                      <div className="text-[9px] font-mono tracking-widest text-[#c0f20c] font-bold uppercase mb-1.5 flex items-center justify-between pb-1 border-b border-neutral-900/60">
                        <span>SPECS MANIFEST</span>
                        <span>PRICE</span>
                      </div>
                      {selectedTier1Count === 0 ? (
                        <div className="text-[10px] font-mono text-neutral-600 uppercase text-center py-4">
                          — NO COMPONENTS SELECTED —
                        </div>
                      ) : (
                        tier1Components.filter(c => c.isSelected).map((comp) => {
                          const finalPrice = getComponentPrice(comp, priceScalingFactor);
                          const label = comp.material === 'frp' ? 'FRP Standard' : `${(comp.finish || 'matte').toUpperCase()} Carbon`;
                          return (
                            <div key={comp.id} className="flex justify-between items-baseline text-[10px] font-mono">
                              <span className="text-neutral-400 uppercase truncate max-w-[180px]">{comp.name.replace(' +50MM', '')}</span>
                              <span className="mx-2 flex-grow border-b border-dotted border-neutral-900" />
                              <span className="text-[#c0f20c]/85 uppercase mr-3 text-[9px] font-bold shrink-0">{label}</span>
                              <span className="text-white font-medium shrink-0">${finalPrice.toLocaleString()}</span>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="border-t border-neutral-900" />
                    
                    <div className="grid grid-cols-2 gap-y-3.5 text-xs font-mono text-neutral-400">
                      
                      <div>SELECTIONS</div>
                      <div className="text-right text-white font-bold uppercase">{selectedTier1Count} OF 7 PANELS</div>

                      <div className="border-t border-neutral-900 pt-3.5">SUBTOTAL</div>
                      <div className="text-right text-white font-bold border-t border-neutral-900 pt-3.5">
                        ${tier1Subtotal.toLocaleString()}
                      </div>

                      {isCompleteKit && (
                        <>
                          <div className="text-[#c0f20c] flex items-center gap-1.5 font-bold uppercase text-[11px]">
                            <Sparkles className="w-3 w-3 animate-pulse text-[#c0f20c]" />
                            KIT SAVE (-10%)
                          </div>
                          <div className="text-right text-[#c0f20c] font-extrabold font-mono text-[11px]">
                            -${tier1Discount.toLocaleString()}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="border-t border-neutral-900/60" />

                    {/* Final Pricing */}
                    <div className="flex justify-between items-baseline pt-2">
                      <div>
                        <span className="font-display font-semibold text-[11px] text-neutral-400 tracking-wider block uppercase">TOTAL CONFIGURED SPEC</span>
                        <span className="text-[9px] font-mono text-neutral-500 uppercase mt-0.5 block">Sea Freight calculated at dispatch</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-3xl font-extrabold text-[#c0f20c] tracking-tight glow-text drop-shadow-[0_0_12px_rgba(192,242,12,0.15)]">
                          ${tier1Total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Kit Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                      <button
                        onClick={handleAddTier1ToCart}
                        id="tier1-add-to-cart"
                        className="py-4 bg-[#c0f20c] text-black hover:bg-[#aacc00] font-display font-extrabold text-[11px] uppercase tracking-widest rounded-md transition-all duration-300 shadow-[0_4px_20px_rgba(192,242,12,0.25)] flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-[1px]"
                      >
                        <ShoppingBag className="w-4 h-4 stroke-[3]" /> ADD BUILD TO CART
                      </button>
                      <button
                        onClick={() => triggerToast("Our bespoke specialist team has been notified of your interest. Check your dashboard messages shortly!")}
                        className="py-4 bg-transparent border border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:text-white font-display font-bold text-[11px] uppercase tracking-widest rounded-md transition-all cursor-pointer hover:bg-neutral-900/30"
                      >
                        Want a Custom Finish
                      </button>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          </section>



          {/* =========================================================================
              TIER 3 SECTION — SIMPLE PART (ETI TITANIUM HARDWARE KIT)
              ========================================================================= */}
          <section className="pt-8 border-t border-neutral-950 space-y-6">
            <div className="text-[10px] font-mono tracking-widest text-[#c0f20c] uppercase">
              TIER 3 — SIMPLE PART (TITANIUM, MANIFOLDS): NO BUILDER, JUST FINISH AND GO
            </div>

            <div className="bg-[#050505] rounded border border-neutral-900 p-5 md:p-6 flex flex-col md:flex-row items-stretch justify-between gap-6">
              
              <div className="flex-1 flex gap-4 items-start">
                
                <div className="w-12 h-12 shrink-0 rounded bg-neutral-950 border border-neutral-900 flex items-center justify-center text-[#c0f20c]">
                  <Cpu className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                      ETI TITANIUM HARDWARE KIT
                    </h3>
                    <span className="text-[8px] font-mono text-[#c0f20c] uppercase tracking-widest px-1.5 py-0.5 border border-[#c0f20c]/35 rounded bg-[#c0f20c]/5 font-bold">
                      ETI ORIGINAL • IN-HOUSE
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                    GRADE 5 TITANIUM • M10 × 1.25 SEAT-RAIL SPEC • SHIPS BY COURIER
                  </p>
                </div>

              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 shrink-0 min-w-0">
                
                <div className="flex border border-neutral-800 rounded bg-black h-9 p-0.5">
                  <button
                    onClick={() => {
                      setTier3(prev => ({ ...prev, finish: 'raw_ti' }));
                      triggerToast("Titanium Finish configured to RAW METALLIC TI");
                    }}
                    className={`px-3 py-1.5 text-[9px] font-mono font-bold tracking-widest rounded uppercase transition-all cursor-pointer ${
                      tier3.finish === 'raw_ti'
                        ? 'bg-neutral-800 text-white'
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    RAW TI
                  </button>
                  <button
                    onClick={() => {
                      setTier3(prev => ({ ...prev, finish: 'burnt_blue' }));
                      triggerToast("Titanium Finish configured to BURNT BLUE dynamic spectrum");
                    }}
                    className={`px-3 py-1.5 text-[9px] font-mono font-bold tracking-widest rounded uppercase transition-all cursor-pointer ${
                      tier3.finish === 'burnt_blue'
                        ? 'bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30'
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    BURNT BLUE
                  </button>
                </div>

                <div className="flex items-center border border-neutral-800 rounded bg-black h-9">
                  <button
                    onClick={() => setTier3(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                    className="px-2.5 h-full text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-mono font-bold text-white min-w-[20px] text-center">
                    {tier3.quantity}
                  </span>
                  <button
                    onClick={() => setTier3(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                    className="px-2.5 h-full text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-neutral-500 block uppercase">SUBTOTAL</span>
                    <span className="font-mono text-base font-bold text-[#c0f20c]">${tier3Total.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={handleAddTier3ToCart}
                    id="tier3-add-to-cart"
                    className="px-6 py-2.5 bg-neutral-900 border border-neutral-800 text-white hover:text-black hover:bg-[#c0f20c] hover:border-transparent font-display font-bold text-xs uppercase tracking-widest rounded transition-all cursor-pointer"
                  >
                    ADD TO CART
                  </button>
                </div>

              </div>

            </div>
          </section>

          {/* Animated Description Section */}
          <section className="pt-16 border-t border-neutral-900 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-neutral-900 pb-6">
              <div>
                <span className="font-mono text-[9px] tracking-[0.3em] text-[#c0f20c] uppercase font-bold block mb-1">ATELIER ARCHIVES</span>
                <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-white">Product Description</h2>
              </div>
              <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">SPECIFICATION SPEC-ID: TS-350Z-01</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left sidebar: Tab List Triggers */}
              <div className="lg:col-span-4 flex flex-col gap-2 font-mono text-[10px] tracking-widest uppercase">
                {[
                  { id: 'overview', label: '01 / OVERVIEW' },
                  { id: 'panels', label: '02 / INCLUDED PANELS' },
                  { id: 'features', label: '03 / KEY FEATURES' },
                  { id: 'materials', label: '04 / MATERIALS AVAILABLE' },
                  { id: 'leadtime', label: '05 / LEAD TIME & DISPATCH' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveProductTab(tab.id as any)}
                    className={`h-11 px-4 text-left border flex items-center justify-between transition-all duration-300 cursor-pointer ${
                      activeProductTab === tab.id
                        ? 'bg-[#c0f20c] border-[#c0f20c] text-black font-extrabold shadow-[0_0_12px_rgba(192,242,12,0.1)]'
                        : 'border-neutral-900 hover:border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-950/40'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform ${activeProductTab === tab.id ? 'translate-x-1' : 'opacity-0'}`} />
                  </button>
                ))}
              </div>

              {/* Right area: Tab Content Details */}
              <div className="lg:col-span-8 bg-neutral-950/50 border border-neutral-900 p-6 md:p-8 min-h-[260px] relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#c0f20c]/60 to-transparent" />
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProductTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4 text-left"
                  >
                    {activeProductTab === 'overview' && (
                      <div className="space-y-4">
                        <span className="font-mono text-[9px] tracking-widest text-[#c0f20c] uppercase font-bold block">CHASSIS OUTLINE</span>
                        <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">NISSAN 350Z TOP SECRET WIDEBODY BODY KIT</h3>
                        <p className="text-neutral-300 text-xs leading-relaxed font-sans">
                          The TOP SECRET wide body kit for the Nissan 350Z is a complete exterior conversion engineered for maximum stance, wide-fender presence, and aggressive aerodynamic styling. Each panel is precision designed to fit factory mounting points for a seamless OEM+ transformation.
                        </p>
                        <div className="pt-2">
                          <span className="text-[10px] font-mono text-neutral-500 uppercase block">VEHICLE COMPATIBILITY</span>
                          <span className="text-white text-xs font-mono font-bold uppercase mt-0.5 inline-block bg-neutral-900 border border-neutral-800 px-2 py-0.5">NISSAN 350Z (Z33 CHASSIS)</span>
                        </div>
                      </div>
                    )}

                    {activeProductTab === 'panels' && (
                      <div className="space-y-4">
                        <span className="font-mono text-[9px] tracking-widest text-[#c0f20c] uppercase font-bold block">CHASSIS INVENTORY</span>
                        <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">PARTS INCLUDED IN SPEC</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 font-mono text-[11px] text-neutral-400">
                          {[
                            'FRONT BUMPER', 'FRONT FENDER (+50MM)', 'FUEL COVER', 
                            'LOWER WING TOP LEGS (CARBON)', 'REAR BUMPER', 
                            'REAR FENDER (+60MM)', 'SIDE SKIRT'
                          ].map((part, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-[#c0f20c] rounded-full" />
                              <span>{part}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-neutral-500 text-[10px] italic font-sans pt-2 border-t border-neutral-900">
                          *Complete Body Kit option includes all of the above panels at a bundled, discounted package price.
                        </p>
                      </div>
                    )}

                    {activeProductTab === 'features' && (
                      <div className="space-y-4">
                        <span className="font-mono text-[9px] tracking-widest text-[#c0f20c] uppercase font-bold block">ENGINEERING SPECIFICATIONS</span>
                        <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">KEY AERODYNAMIC FEATURES</h3>
                        <div className="space-y-3 font-mono text-[11px] text-neutral-400">
                          {[
                            { title: 'WIDEBODY STANCE', desc: 'Lower, wider, and meaner posture optimizing general vehicle track widths.' },
                            { title: 'FENDER CLEARANCE', desc: 'Extended fender flares permitting wider performance wheel/tire compounds.' },
                            { title: 'FLOW CONGRUENCE', desc: 'Designed meticulously to glide seamlessly with natural Nissan 350Z profile lines.' },
                            { title: 'DOWNFORCE PROFILE', desc: 'Drag-reduction profiles optimized for track, drift, and high-performance setups.' }
                          ].map((feat, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <span className="text-[#c0f20c] font-bold">✔️</span>
                              <div>
                                <span className="text-white block font-bold uppercase">{feat.title}</span>
                                <span className="text-neutral-400 block text-[10px] font-sans mt-0.5 leading-relaxed">{feat.desc}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeProductTab === 'materials' && (
                      <div className="space-y-4">
                        <span className="font-mono text-[9px] tracking-widest text-[#c0f20c] uppercase font-bold block">COMPOSITE COMPOSITIONS</span>
                        <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">MATERIALS AVAILABLE</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { name: 'FIBERGLASS (FRP)', desc: 'Lightweight structural composite base, shipped ready to paint to any color.' },
                            { name: 'MATTE / GLOSS CARBON', desc: 'Premium vacuum-infused autoclave carbon fiber. Ready to bolt-on, no paint needed.' },
                            { name: 'FORGED CARBON', desc: 'High-rigidity marbled carbon layout giving a premium structured finish.' },
                            { name: 'KEVLAR COMPOSITE', desc: 'Ultra-lightweight aramid-weave core featuring maximum impact resistance.' }
                          ].map((mat, i) => (
                            <div key={i} className="p-3.5 bg-neutral-900/60 border border-neutral-900 rounded-sm space-y-1">
                              <span className="text-white text-[10px] font-mono font-bold tracking-widest block">{mat.name}</span>
                              <span className="text-neutral-400 text-[10.5px] font-sans leading-relaxed block">{mat.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeProductTab === 'leadtime' && (
                      <div className="space-y-4">
                        <span className="font-mono text-[9px] tracking-widest text-[#c0f20c] uppercase font-bold block">PRODUCTION CALENDAR</span>
                        <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">LEAD TIME & SHIPMENT</h3>
                        <p className="text-neutral-300 text-xs leading-relaxed font-sans">
                          Most ETI components are built to order to ensure weave consistency and quality. Estimated production timeline is 3–5 weeks depending on your selected configuration, chassis spec, and weave finish.
                        </p>
                        <div className="p-4 bg-[#c0f20c]/5 border border-[#c0f20c]/25 rounded-md">
                          <p className="text-white text-xs font-sans leading-relaxed">
                            🔥 Transform your Nissan 350Z into a true showstopper with the ETi TOP SECRET Wide Body Kit — built for those who demand maximum presence on the street and the track. Order today and take your Nissan 350Z to the next level!
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </section>

          {/* Hood Material Visualiser (Inserted as requested) */}
          <div className="w-full max-w-[1200px] mx-auto py-12">
            <MaterialVisualizer type="hood" />
          </div>

          {/* Verified Customer Reviews Section */}
          <section className="pt-16 border-t border-neutral-900 space-y-10">
            <div className="flex justify-between items-end border-b border-neutral-900 pb-6">
              <div>
                <span className="font-mono text-[9px] tracking-[0.3em] text-[#c0f20c] uppercase font-bold block mb-1">ATELIER PROOFS</span>
                <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-white">THE FEEDBACK SYNDICATE</h2>
              </div>
              <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">VERIFIED CHASSIS OWNERS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: 'MARCUS V. (JAPAN)',
                  chassis: 'NISSAN 350Z (Z33)',
                  review: 'The carbon weave alignment on the rear flares is absolute perfection. Bolted directly onto OEM mounts with 0.5mm tolerance. The gloss finish catches streetlights beautifully.',
                  stars: 5
                },
                {
                  name: 'NATE K. (UNITED STATES)',
                  chassis: 'TOYOTA SUPRA (A90)',
                  review: 'Tested at Road America at 240km/h. Downforce is real, chassis feels rock solid. The autoclave prepreg holds up under track heat.',
                  stars: 5
                },
                {
                  name: 'SOMCHAI P. (THAILAND)',
                  chassis: 'NISSAN 350Z (Z33)',
                  review: 'Wide fenders allowed me to run 11J -25 offsets in the back. Best widebody quality on the market, hands down. Forged carbon finish gets compliments everywhere.',
                  stars: 5
                }
              ].map((rev, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-neutral-950/40 border border-neutral-900 hover:border-neutral-800 p-6 flex flex-col justify-between space-y-6 text-left relative overflow-hidden group transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1">
                        {[...Array(rev.stars)].map((_, s) => (
                          <span key={s} className="text-[#c0f20c] font-bold text-xs tracking-tighter">★</span>
                        ))}
                      </div>
                      <span className="text-[8px] font-mono tracking-widest text-neutral-500 bg-neutral-900 border border-neutral-850 px-1.5 py-0.5 rounded uppercase">VERIFIED</span>
                    </div>
                    
                    <p className="text-neutral-400 font-mono text-[11px] leading-relaxed italic">
                      "{rev.review}"
                    </p>
                  </div>

                  <div className="border-t border-neutral-900/60 pt-4 space-y-1">
                    <span className="text-white text-[10px] font-mono tracking-wider font-bold block">{rev.name}</span>
                    <span className="text-[#c0f20c] text-[8.5px] font-mono tracking-widest block">{rev.chassis}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Related Products Carousel Upgrades */}
          <section className="pt-16 border-t border-neutral-900 space-y-10 pb-12">
            <div className="flex justify-between items-end border-b border-neutral-900 pb-6">
              <div>
                <span className="font-mono text-[9px] tracking-[0.3em] text-[#c0f20c] uppercase font-bold block mb-1">ATELIER PLUGS</span>
                <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-white">RECOMMENDED CHASSIS UPGRADES</h2>
              </div>
              <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">COMPATIBLE CHASSIS ADDITIONS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: 'mirrors-350z',
                  title: 'AUTOCLAVE CARBON GANADOR STYLE MIRRORS',
                  price: 895,
                  image: '/images/NK7_5352.jpg',
                  chassis: 'NISSAN 350Z / GENERAL'
                },
                {
                  id: 'exhaust-ti-tips',
                  title: 'ELITE TITANIUM EXHAUST CATBACK SYSTEM',
                  price: 2495,
                  image: '/images/Supra Grey5.jpg',
                  chassis: 'NISSAN 350Z (Z33)'
                },
                {
                  id: 'bolts-spec-ti',
                  title: 'BURNT TITANIUM LOCK BOLTS SET (AEROSPACE GRADE 5)',
                  price: 185,
                  image: '/images/world-map.svg', 
                  chassis: 'GENERAL JDM FITTINGS'
                }
              ].map((prod) => (
                <div
                  key={prod.id}
                  className="bg-neutral-950/40 border border-neutral-900 hover:border-[#c0f20c]/40 p-4 flex flex-col justify-between text-left relative overflow-hidden group transition-all rounded-none"
                >
                  <div className="space-y-4">
                    {/* Visual Photo Block */}
                    <div className="aspect-video relative overflow-hidden bg-neutral-900 border border-neutral-900/60 rounded-none">
                      {prod.image.endsWith('.svg') ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 p-4">
                          <svg viewBox="0 0 100 80" className="w-16 h-auto text-neutral-800 opacity-60">
                            <rect x="10" y="10" width="80" height="60" fill="none" stroke="currentColor" strokeWidth="1" />
                            <circle cx="50" cy="40" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
                          </svg>
                        </div>
                      ) : (
                        <img 
                          src={prod.image} 
                          alt={prod.title} 
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-all duration-500"
                        />
                      )}
                      
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm border border-neutral-850 text-neutral-500 font-mono text-[7px] tracking-widest uppercase">
                        {prod.chassis}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-[11px] font-mono tracking-wider font-bold text-white uppercase group-hover:text-[#c0f20c] transition-colors leading-snug h-8 overflow-hidden">
                        {prod.title}
                      </h4>
                      <span className="text-[12px] font-mono font-bold text-[#c0f20c] block">
                        ${prod.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleAddSimpleProductToCart({ id: prod.id, title: prod.title, price: prod.price, category: 'upgrade' });
                      triggerToast(`Added ${prod.title.substring(0, 20)}... to Cart!`);
                    }}
                    className="w-full h-9 bg-neutral-900 border border-neutral-850 hover:bg-[#c0f20c] text-neutral-350 hover:text-black font-mono text-[9px] tracking-widest uppercase transition-all duration-300 font-bold mt-4 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> QUICK ALLOCATE
                  </button>

                </div>
              ))}
            </div>
          </section>

        </main>
      )}

      {currentPage === 'story' && (
        <AboutUs triggerToast={triggerToast} onAddToCart={handleAddSimpleProductToCart} />
      )}

      {currentPage === 'showroom' && (
        <div className="pt-24 min-h-screen bg-[#0a0a0c] text-white">
          <div className="w-full text-center py-12 border-b border-white/5">
            <span className="font-mono text-[10px] tracking-[0.3em] text-[#c0f20c] uppercase font-bold block mb-2">ETI TUNING SECTOR</span>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-wider uppercase text-white animate-pulse" style={{ fontFamily: 'Teko, sans-serif' }}>
              SHOWROOM &amp; TUNER
            </h1>
            <p className="text-neutral-400 text-xs md:text-sm max-w-xl mx-auto mt-3 font-sans px-6 uppercase tracking-wider leading-relaxed">
              Interactive WebGL upgrade simulators and chassis telemetry configurations.
            </p>
          </div>
          <ForzaShowroom triggerToast={triggerToast} onAddToCart={handleAddSimpleProductToCart} />
        </div>
      )}

      {currentPage === 'blog' && (
        <BlogPage />
      )}

      {currentPage === 'resources' && (
        <Resources onNavigate={(page) => setCurrentPage(page as any)} />
      )}

      {currentPage === 'contact' && (
        <ContactPage triggerToast={triggerToast} setCurrentPage={setCurrentPage} />
      )}

      {/* Slide Drawer Cart */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCart([])}
      />

      {/* Global Interactive Store Map (Only shown on homepage, contact page renders its own) */}
      {currentPage === 'home' && <StoreMap />}

      {/* 008 — JOIN VORTEX (Moved below OUR LOCATIONS) */}
      <JoinVortex triggerToast={triggerToast} />

      {/* DETAILED STORE FOOTER — Styled identically to the theme export */}
      <footer className="mt-20 border-t border-neutral-900 bg-[#070708] pt-16 pb-8 text-neutral-400">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 border-b border-neutral-900 pb-12">
          
          {/* Brand block (logo + description + social links) */}
          <div className="lg:col-span-2 space-y-6">
            <img src="/images/logo.png" alt="Elite TI Logo" className="h-40 w-auto object-contain" />
            <p className="text-xs font-mono uppercase tracking-wide leading-relaxed text-neutral-400 max-w-sm">
              ENGINEERING SUPERIORITY FOR THE MODERN CHASSIS. FORGED TITANIUM AND DRY CARBON EXCELLENCE.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded border border-neutral-800 flex items-center justify-center hover:border-[#c0f20c] hover:text-[#c0f20c] transition-colors text-neutral-400">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-10 h-10 rounded border border-neutral-800 flex items-center justify-center hover:border-[#c0f20c] hover:text-[#c0f20c] transition-colors text-neutral-400">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Menu links */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest border-b border-neutral-900 pb-2">MENU LINKS</h4>
            <ul className="space-y-2 font-mono text-[11px]">
              <li><button onClick={() => setCurrentPage('home')} className="hover:text-white transition-colors cursor-pointer uppercase">HOME</button></li>
              <li><button onClick={() => setCurrentPage('story')} className="hover:text-white transition-colors cursor-pointer uppercase">ABOUT US</button></li>
              <li><button className="hover:text-white transition-colors cursor-pointer uppercase">TRACK ORDER</button></li>
            </ul>
          </div>

          {/* Shop by vehicle */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest border-b border-neutral-900 pb-2">SHOP BY VEHICLE</h4>
            <ul className="space-y-2 font-mono text-[11px]">
              <li><button onClick={() => setCurrentPage('catalog')} className="hover:text-white transition-colors cursor-pointer uppercase">RX7 / FD3S</button></li>
              <li><button onClick={() => setCurrentPage('catalog')} className="hover:text-white transition-colors cursor-pointer uppercase">SUPRA MK4</button></li>
              <li><button onClick={() => setCurrentPage('catalog')} className="hover:text-white transition-colors cursor-pointer uppercase">SUPRA MK5</button></li>
              <li><button onClick={() => setCurrentPage('catalog')} className="hover:text-white transition-colors cursor-pointer uppercase">NISSAN R34 GTR</button></li>
              <li><button onClick={() => setCurrentPage('catalog')} className="hover:text-white transition-colors cursor-pointer uppercase">SHOP ALL</button></li>
            </ul>
          </div>

          {/* Quick links & supports */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest border-b border-neutral-900 pb-2">QUICK LINKS</h4>
            <ul className="space-y-2 font-mono text-[11px]">
              <li><button onClick={() => setCurrentPage('blog')} className="hover:text-white transition-colors cursor-pointer uppercase">BLOG</button></li>
              <li><button className="hover:text-white transition-colors cursor-pointer uppercase">SEARCH</button></li>
              <li><button onClick={() => setCurrentPage('catalog')} className="hover:text-white transition-colors cursor-pointer uppercase">CATALOG</button></li>
              <li><button className="hover:text-white transition-colors cursor-pointer uppercase">WHOLESALE</button></li>
            </ul>
          </div>

        </div>

        {/* OFFICES/LOCATIONS GRID */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-neutral-900 text-xs font-mono uppercase tracking-wider text-neutral-400">
          <div>
            <span className="text-white font-bold block mb-2">UNITED STATES</span>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              41W972 Compton Hills Rd<br />Elburn, IL 60119<br />United States
            </p>
          </div>
          <div>
            <span className="text-white font-bold block mb-2">THAILAND</span>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              136/5 Charoen Suk Alley<br />Thung Khru, Bangkok<br />10140
            </p>
          </div>
          <div>
            <span className="text-white font-bold block mb-2">HONG KONG</span>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Suite C, Level 7, World Trust Tower<br />58 Stanley Street, Central<br />Hong Kong
            </p>
          </div>
          <div>
            <span className="text-white font-bold block mb-2">CONTACT</span>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              +1 682 332 2322<br />+66 8624484553 (WhatsApp)<br />NATE@MYELITETI.COM
            </p>
          </div>
        </div>

        {/* BOTTOM METADATA & COPYRIGHT */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-mono tracking-widest uppercase text-neutral-600">
          <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
            <span>&copy; {new Date().getFullYear()} ELITE TI. All rights reserved.</span>
            <a href="#" className="hover:text-white transition-colors">Refund policy</a>
            <a href="#" className="hover:text-white transition-colors">Privacy policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of service</a>
            <a href="#" className="hover:text-white transition-colors">Shipping policy</a>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[9px] text-neutral-550">SECURE CHECKOUT</span>
            <div className="flex gap-2 items-center">
              {/* Amex */}
              <div className="w-10 h-6 border border-neutral-900 rounded bg-[#0b0b0d] flex items-center justify-center text-neutral-400">
                <svg role="img" viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <title>American Express</title>
                  <path d="M16.015 14.378c0-.32-.135-.496-.344-.622-.21-.12-.464-.135-.81-.135h-1.543v2.82h.675v-1.027h.72c.24 0 .39.024.478.125.12.13.104.38.104.55v.35h.66v-.555c-.002-.25-.017-.376-.108-.516-.06-.08-.18-.18-.33-.234l.02-.008c.18-.072.48-.297.48-.747zm-.87.407l-.028-.002c-.09.053-.195.058-.33.058h-.81v-.63h.824c.12 0 .24 0 .33.05.098.048.156.147.15.255 0 .12-.045.215-.134.27zM20.297 15.837H19v.6h1.304c.676 0 1.05-.278 1.05-.884 0-.28-.066-.448-.187-.582-.153-.133-.392-.193-.73-.207l-.376-.015c-.104 0-.18 0-.255-.03-.09-.03-.15-.105-.15-.21 0-.09.017-.166.09-.21.083-.046.177-.066.272-.06h1.23v-.602h-1.35c-.704 0-.958.437-.958.84 0 .9.776.855 1.407.87.104 0 .18.015.225.06.046.03.082.106.082.18 0 .077-.035.15-.08.18-.06.053-.15.07-.277.07zM0 0v10.096L.81 8.22h1.75l.225.464V8.22h2.043l.45 1.02.437-1.013h6.502c.295 0 .56.057.756.236v-.23h1.787v.23c.307-.17.686-.23 1.12-.23h2.606l.24.466v-.466h1.918l.254.465v-.466h1.858v3.948H20.87l-.36-.6v.585h-2.353l-.256-.63h-.583l-.27.614h-1.213c-.48 0-.84-.104-1.08-.24v.24h-2.89v-.884c0-.12-.03-.12-.105-.135h-.105v1.036H6.067v-.48l-.21.48H4.69l-.202-.48v.465H2.235l-.256-.624H1.4l-.256.624H0V24h23.786v-7.108c-.27.135-.613.18-.973.18H21.09v-.255c-.21.165-.57.255-.914.255H14.71v-.9c0-.12-.018-.12-.12-.12h-.075v1.022h-1.8v-1.066c-.298.136-.643.15-.928.136h-.214v.915h-2.18l-.54-.617-.57.6H4.742v-3.93h3.61l.518.602.554-.6h2.412c.28 0 .74.03.942.225v-.24h2.177c.202 0 .644.045.903.225v-.24h3.265v.24c.163-.164.508-.24.803-.24h1.89v.24c.194-.15.464-.24.84-.24h1.176V0H0zM21.156 14.955c.004.005.006.012.01.016.01.01.024.01.032.02l-.042-.035zM23.828 13.082h.065v.555h-.065zM23.865 15.03v-.005c-.03-.025-.046-.048-.075-.07-.15-.153-.39-.215-.764-.225l-.36-.012c-.12 0-.194-.007-.27-.03-.09-.03-.15-.105-.15-.21 0-.09.03-.16.09-.204.076-.045.15-.05.27-.05h1.223v-.588h-1.283c-.69 0-.96.437-.96.84 0 .9.78.855 1.41.87.104 0 .18.015.224.06.046.03.076.106.076.18 0 .07-.034.138-.09.18-.045.056-.136.07-.27.07h-1.288v.605h1.287c.42 0 .734-.118.9-.36h.03c.09-.134.135-.3.135-.523 0-.24-.045-.39-.135-.526zM18.597 14.208v-.583h-2.235V16.458h2.235v-.585h-1.57v-.57h1.533v-.584h-1.532v-.51M13.51 8.787h.685V11.6h-.684zM13.126 9.543l-.007.006c0-.314-.13-.5-.34-.624-.217-.125-.47-.135-.81-.135H10.43v2.82h.674v-1.034h.72c.24 0 .39.03.487.12.122.136.107.378.107.548v.354h.677v-.553c0-.25-.016-.375-.11-.516-.09-.107-.202-.19-.33-.237.172-.07.472-.3.472-.75zm-.855.396h-.015c-.09.054-.195.056-.33.056H11.1v-.623h.825c.12 0 .24.004.33.05.09.04.15.128.15.25s-.047.22-.134.266zM15.92 9.373h.632v-.6h-.644c-.464 0-.804.105-1.02.33-.286.3-.362.69-.362 1.11 0 .512.123.833.36 1.074.232.238.645.31.97.31h.78l.255-.627h1.39l.262.627h1.36v-2.11l1.272 2.11h.95l.002.002V8.786h-.684v1.963l-1.18-1.96h-1.02V11.4L18.11 8.744h-1.004l-.943 2.22h-.3c-.177 0-.362-.03-.468-.134-.125-.15-.186-.36-.186-.662 0-.285.08-.51.194-.63.133-.135.272-.165.516-.165zm1.668-.108l.464 1.118v.002h-.93l.466-1.12zM2.38 10.97l.254.628H4V9.393l.972 2.205h.584l.973-2.202.015 2.202h.69v-2.81H6.118l-.807 1.904-.876-1.905H3.343v2.663L2.205 8.787h-.997L.01 11.597h.72l.26-.626h1.39zm-.688-1.705l.46 1.118-.003.002h-.915l.457-1.12zM11.856 13.62H9.714l-.85.923-.825-.922H5.346v2.82H8l.855-.932.824.93h1.302v-.94h.838c.6 0 1.17-.164 1.17-.945l-.006-.003c0-.78-.598-.93-1.128-.93zM7.67 15.853l-.014-.002H6.02v-.557h1.47v-.574H6.02v-.51H7.7l.733.82-.764.824zm2.642.33l-1.03-1.147 1.03-1.108v2.253zm1.553-1.258h-.885v-.717h.885c.24 0 .42.098.42.344 0 .243-.15.372-.42.372zM9.967 9.373v-.586H7.73V11.6h2.237v-.58H8.4v-.564h1.527V9.88H8.4v-.507"/>
                </svg>
              </div>
              {/* Visa */}
              <div className="w-10 h-6 border border-neutral-900 rounded bg-[#0b0b0d] flex items-center justify-center text-neutral-400">
                <svg role="img" viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <title>Visa</title>
                  <path d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z"/>
                </svg>
              </div>
              {/* Apple Pay */}
              <div className="w-10 h-6 border border-neutral-900 rounded bg-[#0b0b0d] flex items-center justify-center text-neutral-400">
                <svg role="img" viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <title>Apple Pay</title>
                  <path d="M2.15 4.318a42.16 42.16 0 0 0-.454.003c-.15.005-.303.013-.452.04a1.44 1.44 0 0 0-1.06.772c-.07.138-.114.278-.14.43-.028.148-.037.3-.04.45A10.2 10.2 0 0 0 0 6.222v11.557c0 .07.002.138.003.207.004.15.013.303.04.452.027.15.072.291.142.429a1.436 1.436 0 0 0 .63.63c.138.07.278.115.43.142.148.027.3.036.45.04l.208.003h20.194l.207-.003c.15-.004.303-.013.452-.04.15-.027.291-.071.428-.141a1.432 1.432 0 0 0 .631-.631c.07-.138.115-.278.141-.43.027-.148.036-.3.04-.45.002-.07.003-.138.003-.208l.001-.246V6.221c0-.07-.002-.138-.004-.207a2.995 2.995 0 0 0-.04-.452 1.446 1.446 0 0 0-1.2-1.201 3.022 3.022 0 0 0-.452-.04 10.448 10.448 0 0 0-.453-.003zm0 .512h19.942c.066 0 .131.002.197.003.115.004.25.01.375.032.109.02.2.05.287.094a.927.927 0 0 1 .407.407.997.997 0 0 1 .094.288c.022.123.028.258.031.374.002.065.003.13.003.197v11.552c0 .065 0 .13-.003.196-.003.115-.009.25-.032.375a.927.927 0 0 1-.5.693 1.002 1.002 0 0 1-.286.094 2.598 2.598 0 0 1-.373.032l-.2.003H1.906c-.066 0-.133-.002-.196-.003a2.61 2.61 0 0 1-.375-.032c-.109-.02-.2-.05-.288-.094a.918.918 0 0 1-.406-.407 1.006 1.006 0 0 1-.094-.288 2.531 2.531 0 0 1-.032-.373 9.588 9.588 0 0 1-.002-.197V6.224c0-.065 0-.131.002-.197.004-.114.01-.248.032-.375.02-.108.05-.199.094-.287a.925.925 0 0 1 .407-.406 1.03 1.03 0 0 1 .287-.094c.125-.022.26-.029.375-.032.065-.002.131-.002.196-.003zm4.71 3.7c-.3.016-.668.199-.88.456-.191.22-.36.58-.316.918.338.03.675-.169.888-.418.205-.258.345-.603.308-.955zm2.207.42v5.493h.852v-1.877h1.18c1.078 0 1.835-.739 1.835-1.812 0-1.07-.742-1.805-1.808-1.805zm.852.719h.982c.739 0 1.161.396 1.161 1.089 0 .692-.422 1.092-1.164 1.092h-.979zm-3.154.3c-.45.01-.83.28-1.05.28-.235 0-.593-.264-.981-.257a1.446 1.446 0 0 0-1.23.747c-.527.908-.139 2.255.374 2.995.249.366.549.769.944.754.373-.014.52-.242.973-.242.454 0 .586.242.98.235.41-.007.667-.366.915-.733.286-.417.403-.82.41-.841-.007-.008-.79-.308-.797-1.209-.008-.754.615-1.113.644-1.135-.352-.52-.9-.578-1.09-.593a1.123 1.123 0 0 0-.092-.002zm8.204.397c-.99 0-1.606.533-1.652 1.256h.777c.072-.358.369-.586.845-.586.502 0 .803.266.803.711v.309l-1.097.064c-.951.054-1.488.484-1.488 1.184 0 .72.548 1.207 1.332 1.207.526 0 1.032-.281 1.264-.727h.019v.659h.788v-2.76c0-.803-.62-1.317-1.591-1.317zm1.94.072l1.446 4.009c0 .003-.073.24-.073.247-.125.41-.33.571-.711.571-.069 0-.206 0-.267-.015v.666c.06.011.267.019.335.019.83 0 1.226-.312 1.568-1.283l1.5-4.214h-.868l-1.012 3.259h-.015l-1.013-3.26zm-1.167 2.189v.316c0 .521-.45.917-1.024.917-.442 0-.731-.228-.731-.579 0-.342.278-.56.769-.593z"/>
                </svg>
              </div>
              {/* Google Pay */}
              <div className="w-10 h-6 border border-neutral-900 rounded bg-[#0b0b0d] flex items-center justify-center text-neutral-400">
                <svg role="img" viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <title>Google Pay</title>
                  <path d="M3.963 7.235A3.963 3.963 0 00.422 9.419a3.963 3.963 0 000 3.559 3.963 3.963 0 003.541 2.184c1.07 0 1.97-.352 2.627-.957.748-.69 1.18-1.71 1.18-2.916a4.722 4.722 0 00-.07-.806H3.964v1.526h2.14a1.835 1.835 0 01-.79 1.205c-.356.241-.814.379-1.35.379-1.034 0-1.911-.697-2.225-1.636a2.375 2.375 0 010-1.517c.314-.94 1.191-1.636 2.225-1.636a2.152 2.152 0 011.52.594l1.132-1.13a3.808 3.808 0 00-2.652-1.033zm6.501.55v6.9h.886V11.89h1.465c.603 0 1.11-.196 1.522-.588a1.911 1.911 0 00.635-1.464 1.92 1.92 0 00-.635-1.456 2.125 2.125 0 00-1.522-.598zm2.427.85a1.156 1.156 0 01.823.365 1.176 1.176 0 010 1.686 1.171 1.171 0 01-.877.357H11.35V8.635h1.487a1.156 1.156 0 01.054 0zm4.124 1.175c-.842 0-1.477.308-1.907.925l.781.491c.288-.417.68-.626 1.175-.626a1.255 1.255 0 01.856.323 1.009 1.009 0 01.366.785v.202c-.34-.193-.774-.289-1.3-.289-.617 0-1.11.145-1.479.434-.37.288-.554.677-.554 1.165a1.476 1.476 0 00.525 1.156c.35.308.785.463 1.305.463.61 0 1.098-.27 1.465-.81h.038v.655h.848v-2.909c0-.61-.19-1.09-.568-1.44-.38-.35-.896-.525-1.551-.525zm2.263.154l1.946 4.422-1.098 2.38h.915L24 9.963h-.965l-1.368 3.391h-.02l-1.406-3.39zm-2.146 2.368c.494 0 .88.11 1.156.33 0 .372-.147.696-.44.973a1.413 1.413 0 01-.997.414 1.081 1.081 0 01-.69-.232.708.708 0 01-.293-.578c0-.257.12-.47.363-.647.24-.173.54-.26.9-.26Z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* WATERMARK */}
      <div className="bg-[#030303] py-6 border-t border-neutral-950 text-center select-none pointer-events-none">
        <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-neutral-800">
          designed by <a href="https://shopifydevstudio.com" target="_blank" rel="noopener noreferrer" className="text-neutral-750 hover:text-[#9cce00] transition-colors pointer-events-auto">shopifydevstudio.com</a> &mdash; copying is restricted
        </span>
      </div>

    </div>
  );
}
