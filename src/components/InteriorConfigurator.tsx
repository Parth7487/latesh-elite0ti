import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sliders,
  ChevronRight,
} from 'lucide-react';
import gsap from 'gsap';

interface OptionItem {
  name: string;
  img: string;
  relImg: string;
  price: number;
  weight: number;
}

interface ZoneItem {
  title: string;
  desc: string;
  options: OptionItem[];
}

interface ChassisConfig {
  chassisName: string;
  defaultImg: string;
  relativeImg: string;
  hotspots: {
    [key: string]: { left: string; top: string };
  };
  zones: {
    [key: string]: ZoneItem;
  };
}

const CONFIGS_DATA: { [key: string]: ChassisConfig } = {
  supra: {
    chassisName: "TOYOTA SUPRA JZA80",
    defaultImg: "/content/blogs/Interior/WhatsApp Image 2026-06-26 at 13.32.42.jpeg",
    relativeImg: "/content/blogs/Interior/WhatsApp Image 2026-06-26 at 13.32.42.jpeg",
    hotspots: {
      steering: { left: "60.6%", top: "31.1%" },
      dashboard: { left: "36.4%", top: "17.7%" },
      upperGloveBox: { left: "22.1%", top: "28.0%" },
      lowerGloveBox: { left: "18.0%", top: "39.5%" }
    },
    zones: {
      steering: {
        title: "T3 Carbon Steering Wheel",
        desc: "Bespoke JDM sports wheel crafted with dry carbon fiber and Alcantara hand grips.",
        options: [
          { name: "Dry Carbon & Alcantara", img: "/content/blogs/Interrior/Supra/WhatsApp Image 2026-06-26 at 13.33.07 (1).jpeg", relImg: "/content/blogs/Interrior/Supra/WhatsApp Image 2026-06-26 at 13.33.07 (1).jpeg", price: 1895, weight: 1.8 },
          { name: "Gloss Carbon & Perforated Leather", img: "/content/blogs/Interrior/Supra/WhatsApp Image 2026-06-26 at 13.33.08.jpeg", relImg: "/content/blogs/Interrior/Supra/WhatsApp Image 2026-06-26 at 13.33.08.jpeg", price: 2195, weight: 1.5 },
        ]
      },
      dashboard: {
        title: "Pre-preg Carbon Dashboard",
        desc: "Full faceplate replacement dashboard crafted with aerospace dry carbon fiber.",
        options: [
          { name: "Dry Carbon Faceplate", img: "/content/blogs/Interrior/New Folder With Items/WhatsApp Image 2026-06-26 at 13.32.42 (3).jpeg", relImg: "/content/blogs/Interrior/New Folder With Items/WhatsApp Image 2026-06-26 at 13.32.42 (3).jpeg", price: 2450, weight: 3.2 },
          { name: "OEM Matte Black Console", img: "/content/blogs/Interrior/New Folder With Items/WhatsApp Image 2026-06-26 at 13.32.42.jpeg", relImg: "/content/blogs/Interrior/New Folder With Items/WhatsApp Image 2026-06-26 at 13.32.42.jpeg", price: 0, weight: 0 }
        ]
      },
      upperGloveBox: {
        title: "Satin Carbon Upper Glove Box",
        desc: "Pre-preg carbon fiber upper glove box cover for full dash continuity.",
        options: [
          { name: "Satin Carbon Lid", img: "/content/blogs/Interrior/Supra/WhatsApp Image 2026-06-26 at 13.33.05 (1).jpeg", relImg: "/content/blogs/Interrior/Supra/WhatsApp Image 2026-06-26 at 13.33.05 (1).jpeg", price: 750, weight: 0.8 },
          { name: "Gloss Carbon Lid", img: "/content/blogs/Interrior/Supra/WhatsApp Image 2026-06-26 at 13.33.06.jpeg", relImg: "/content/blogs/Interrior/Supra/WhatsApp Image 2026-06-26 at 13.33.06.jpeg", price: 850, weight: 0.7 }
        ]
      },
      lowerGloveBox: {
        title: "Satin Carbon Lower Glove Box",
        desc: "Lower glove box compartment wrapped in autoclave carbon structure.",
        options: [
          { name: "Satin Carbon Lower Panel", img: "/content/blogs/Interrior/Supra/WhatsApp Image 2026-06-26 at 13.33.05.jpeg", relImg: "/content/blogs/Interrior/Supra/WhatsApp Image 2026-06-26 at 13.33.05.jpeg", price: 950, weight: 1.2 },
          { name: "Gloss Carbon Lower Panel", img: "/content/blogs/Interrior/Supra/WhatsApp Image 2026-06-26 at 13.33.06.jpeg", relImg: "/content/blogs/Interrior/Supra/WhatsApp Image 2026-06-26 at 13.33.06.jpeg", price: 1050, weight: 1.0 }
        ]
      }
    }
  },
  rx7: {
    chassisName: "MAZDA RX-7 FD3S",
    defaultImg: "/content/blogs/Interior/WhatsApp Image 2026-06-26 at 13.32.42.jpeg",
    relativeImg: "/content/blogs/Interior/WhatsApp Image 2026-06-26 at 13.32.42.jpeg",
    hotspots: {
      steering: { left: "60.6%", top: "31.1%" },
      dashboard: { left: "36.4%", top: "17.7%" },
      upperGloveBox: { left: "22.1%", top: "28.0%" },
      lowerGloveBox: { left: "18.0%", top: "39.5%" }
    },
    zones: {
      steering: {
        title: "Spirit R Carbon Steering Wheel",
        desc: "Classic rotary steering wheel upgraded with dry carbon fiber and Alcantara hand grips.",
        options: [
          { name: "Carbon Fiber & Perforated Leather", img: "/content/blogs/Interrior/New Folder With Items/WhatsApp Image 2026-06-26 at 13.32.42 (1).jpeg", relImg: "/content/blogs/Interrior/New Folder With Items/WhatsApp Image 2026-06-26 at 13.32.42 (1).jpeg", price: 1750, weight: 1.6 },
          { name: "Alcantara Weave & Burnt Center", img: "/content/blogs/Interrior/New Folder With Items/WhatsApp Image 2026-06-26 at 13.32.42 (2).jpeg", relImg: "/content/blogs/Interrior/New Folder With Items/WhatsApp Image 2026-06-26 at 13.32.42 (2).jpeg", price: 1950, weight: 1.8 }
        ]
      },
      dashboard: {
        title: "Autoclave Carbon Dashboard",
        desc: "Premium grade carbon console faceplate protecting standard trim surfaces.",
        options: [
          { name: "Carbon Faceplate Upgrade", img: "/content/blogs/Interrior/New Folder With Items/WhatsApp Image 2026-06-26 at 13.32.42 (3).jpeg", relImg: "/content/blogs/Interrior/New Folder With Items/WhatsApp Image 2026-06-26 at 13.32.42 (3).jpeg", price: 1250, weight: 1.9 },
          { name: "OEM Matte Black Faceplate", img: "/content/blogs/Interrior/New Folder With Items/WhatsApp Image 2026-06-26 at 13.32.42.jpeg", relImg: "/content/blogs/Interrior/New Folder With Items/WhatsApp Image 2026-06-26 at 13.32.42.jpeg", price: 0, weight: 0 }
        ]
      },
      upperGloveBox: {
        title: "Autoclave Carbon Upper Glove Box",
        desc: "Lightweight aramid-kevlar/carbon hybrid weave panel lid replacement.",
        options: [
          { name: "Dry Carbon Lid", img: "/content/blogs/Interrior/New Folder With Items/WhatsApp Image 2026-06-26 at 13.32.42 (3).jpeg", relImg: "/content/blogs/Interrior/New Folder With Items/WhatsApp Image 2026-06-26 at 13.32.42 (3).jpeg", price: 680, weight: 0.7 },
          { name: "OEM Black Lid", img: "/content/blogs/Interrior/New Folder With Items/WhatsApp Image 2026-06-26 at 13.32.42.jpeg", relImg: "/content/blogs/Interrior/New Folder With Items/WhatsApp Image 2026-06-26 at 13.32.42.jpeg", price: 0, weight: 0 }
        ]
      },
      lowerGloveBox: {
        title: "Autoclave Carbon Lower Glove Box",
        desc: "Superlight aramid-kevlar lower console component for passenger kickplate protection.",
        options: [
          { name: "Dry Carbon Lower Panel", img: "/content/blogs/Interrior/New Folder With Items/WhatsApp Image 2026-06-26 at 13.32.42 (3).jpeg", relImg: "/content/blogs/Interrior/New Folder With Items/WhatsApp Image 2026-06-26 at 13.32.42 (3).jpeg", price: 820, weight: 1.1 },
          { name: "OEM Black Lower Panel", img: "/content/blogs/Interrior/New Folder With Items/WhatsApp Image 2026-06-26 at 13.32.42.jpeg", relImg: "/content/blogs/Interrior/New Folder With Items/WhatsApp Image 2026-06-26 at 13.32.42.jpeg", price: 0, weight: 0 }
        ]
      }
    }
  }
};

interface InteriorConfiguratorProps {
  onAddToCart: (item: { id: string; title: string; price: number; category: string }) => void;
}

export default function InteriorConfigurator({ onAddToCart }: InteriorConfiguratorProps) {
  const [activeChassis, setActiveChassis] = useState<'supra' | 'rx7'>('supra');
  const [focusedZone, setFocusedZone] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: OptionItem | null }>({
    steering: null,
    dashboard: null,
    upperGloveBox: null,
    lowerGloveBox: null
  });
  const [compareMode, setCompareMode] = useState(false);
  const [isEditorModeActive, setIsEditorModeActive] = useState(false);

  const [hotspotsPositions, setHotspotsPositions] = useState<{ [key: string]: { left: string; top: string } }>(
    JSON.parse(JSON.stringify(CONFIGS_DATA.supra.hotspots))
  );

  const fallbackImgRef = useRef<HTMLImageElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const [currentImgX, setCurrentImgX] = useState(0);
  const isDraggingFallback = useRef(false);
  const startX = useRef(0);

  useEffect(() => {
    setHotspotsPositions(JSON.parse(JSON.stringify(CONFIGS_DATA[activeChassis].hotspots)));
    setSelectedOptions({
      steering: null,
      dashboard: null,
      upperGloveBox: null,
      lowerGloveBox: null
    });
    setFocusedZone(null);
    setCurrentImgX(0);
    if (fallbackImgRef.current) {
      fallbackImgRef.current.style.transform = 'translateX(-50%)';
    }
  }, [activeChassis]);



  const handleViewportMouseDown = (e: React.MouseEvent) => {
    if (isEditorModeActive) return;
    isDraggingFallback.current = true;
    startX.current = e.clientX - currentImgX;
    if (viewportRef.current) viewportRef.current.style.cursor = 'grabbing';
  };

  const handleViewportMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingFallback.current || isEditorModeActive || !fallbackImgRef.current || !viewportRef.current) return;
    let newX = e.clientX - startX.current;
    const imgWidth = fallbackImgRef.current.clientWidth;
    const containerWidth = viewportRef.current.clientWidth;
    const limit = (imgWidth - containerWidth) / 2;
    if (limit > 0) {
      newX = Math.max(-limit, Math.min(limit, newX));
    } else {
      newX = 0;
    }
    setCurrentImgX(newX);
    fallbackImgRef.current.style.transform = `translateX(calc(-50% + ${newX}px))`;
  };

  const handleViewportMouseUp = () => {
    isDraggingFallback.current = false;
    if (viewportRef.current && !isEditorModeActive) {
      viewportRef.current.style.cursor = 'grab';
    }
  };

  const handleHotspotMouseDown = (e: React.MouseEvent, hotspotId: string) => {
    if (!isEditorModeActive) return;
    e.preventDefault();
    e.stopPropagation();
    const container = viewportRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const moveHandler = (moveEvent: MouseEvent) => {
      const relX = moveEvent.clientX - containerRect.left;
      const relY = moveEvent.clientY - containerRect.top;
      let leftPercent = Math.max(5, Math.min(95, (relX / containerRect.width) * 100));
      let topPercent = Math.max(5, Math.min(95, (relY / containerRect.height) * 100));
      const drift = currentImgX * 0.18;
      const driftPx = (drift / containerRect.width) * 100;
      setHotspotsPositions(prev => ({
        ...prev,
        [hotspotId]: {
          left: `${(leftPercent - driftPx).toFixed(1)}%`,
          top: `${topPercent.toFixed(1)}%`
        }
      }));
    };
    const upHandler = () => {
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
    };
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
  };

  const handlePartClick = (zoneId: string) => {
    if (isEditorModeActive) return;
    setFocusedZone(zoneId);
    let panOffset = 0;
    if (zoneId === 'steering') panOffset = 180;
    if (zoneId === 'dashboard') panOffset = 0;
    if (zoneId === 'upperGloveBox') panOffset = -150;
    if (zoneId === 'lowerGloveBox') panOffset = -220;
    if (fallbackImgRef.current) {
      gsap.to(fallbackImgRef.current, {
        x: panOffset,
        duration: 0.8,
        ease: "power3.out",
        onUpdate: () => { setCurrentImgX(panOffset); }
      });
    }
  };

  const selectOption = (zoneId: string, option: OptionItem) => {
    setSelectedOptions(prev => ({ ...prev, [zoneId]: option }));
  };

  const handleCheckoutAndAdd = () => {
    let addedAny = false;
    Object.keys(selectedOptions).forEach(zoneId => {
      const opt = selectedOptions[zoneId];
      if (opt) {
        onAddToCart({
          id: `interior-${activeChassis}-${zoneId}-${opt.name.replace(/\s+/g, '-').toLowerCase()}`,
          title: `${CONFIGS_DATA[activeChassis].chassisName} ${opt.name} (${zoneId.toUpperCase()})`,
          price: opt.price,
          category: 'carbon'
        });
        addedAny = true;
      }
    });
    if (!addedAny) alert("Please configure at least one interior part before adding to cart!");
  };

  const getActiveImage = () => {
    if (compareMode) return CONFIGS_DATA[activeChassis].defaultImg;
    const selectedKeys = Object.keys(selectedOptions);
    for (let i = selectedKeys.length - 1; i >= 0; i--) {
      const opt = selectedOptions[selectedKeys[i]];
      if (opt) return opt.img;
    }
    return CONFIGS_DATA[activeChassis].defaultImg;
  };

  const zoomToPreset = (presetId: string) => {
    if (presetId === 'cabin') {
      setFocusedZone(null);
      setCurrentImgX(0);
      if (fallbackImgRef.current) {
        gsap.to(fallbackImgRef.current, { x: 0, duration: 0.8, ease: "power3.out" });
      }
      return;
    }
    handlePartClick(presetId);
  };

  const switchChassis = (chassisId: 'supra' | 'rx7') => {
    if (chassisId === activeChassis) return;
    setActiveChassis(chassisId);
  };

  const totalWeight = Object.values(selectedOptions).reduce((acc, curr) => acc + (curr?.weight || 0), 0);
  const totalPrice = Object.values(selectedOptions).reduce((acc, curr) => acc + (curr?.price || 0), 0);
  const drift = currentImgX * 0.18;

  const hotspotLabel: Record<string, string> = {
    steering: 'ST',
    dashboard: 'DB',
    upperGloveBox: 'UG',
    lowerGloveBox: 'LG',
  };

  return (
    <section className="bg-[#0a0a0b] border-t border-b border-neutral-900 pt-16 pb-20 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-neutral-900 pb-8 mb-10 gap-6">
          <div>
            <span className="font-mono text-[9px] tracking-[0.3em] text-[#c0f20c] uppercase font-bold block mb-2">002.6 — Bespoke Cockpit Configurator</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tight text-white leading-none">
              JDM Bespoke Cabin Configurator
            </h2>
            <p className="text-xs text-neutral-400 font-sans mt-3 max-w-2xl leading-relaxed">
              Configure aerospace dry carbon and titanium console accents. Fully interactive drag-scroll cockpit.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            {/* Coordinate Mode Toggle */}
            <button
              onClick={() => setIsEditorModeActive(!isEditorModeActive)}
              className={`p-2.5 border transition-all duration-300 cursor-pointer text-xs flex items-center gap-2 rounded-sm ${
                isEditorModeActive ? 'border-red-500 text-red-500' : 'border-neutral-800 bg-neutral-900 hover:border-red-500/50 text-neutral-400'
              }`}
            >
              <Sliders className="h-4 w-4" />
              <span className="font-mono text-[9px] uppercase tracking-wider hidden sm:inline">Coord Mode</span>
            </button>
            {/* Chassis Tabs */}
            <div className="flex bg-neutral-900 border border-neutral-800 p-1 rounded-sm">
              {(['supra', 'rx7'] as const).map(chassis => (
                <button
                  key={chassis}
                  onClick={() => switchChassis(chassis)}
                  className={`px-5 py-1.5 transition-all duration-300 font-bold cursor-pointer text-xs tracking-widest uppercase rounded-sm ${
                    activeChassis === chassis ? 'bg-[#c0f20c] text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {chassis === 'supra' ? 'SUPRA' : 'RX-7'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left: Viewport */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div
              ref={viewportRef}
              onMouseDown={handleViewportMouseDown}
              onMouseMove={handleViewportMouseMove}
              onMouseUp={handleViewportMouseUp}
              onMouseLeave={handleViewportMouseUp}
              className={`relative border bg-black overflow-hidden aspect-video shadow-2xl ${
                isEditorModeActive ? 'border-red-500 animate-pulse' : 'border-neutral-900 cursor-grab'
              }`}
            >
              {/* Panorama Image */}
              <div className="absolute inset-0 z-0">
                <img
                  ref={fallbackImgRef}
                  src={getActiveImage()}
                  alt="Cabin Interior"
                  className="h-full max-w-none absolute top-0 left-1/2"
                  style={{ transform: 'translateX(-50%)' }}
                />
              </div>

              {/* Hotspot overlays */}
              {Object.keys(hotspotsPositions).map(key => {
                const pos = hotspotsPositions[key];
                const finalLeft = `calc(${parseFloat(pos.left)}% + ${drift}px)`;
                return (
                  <div
                    key={key}
                    onMouseDown={(e) => handleHotspotMouseDown(e, key)}
                    className="absolute z-20 cursor-pointer transition-all duration-300 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: finalLeft, top: pos.top }}
                  >
                    <div className="relative flex items-center justify-center" onClick={() => handlePartClick(key)}>
                      <div className="absolute w-8 h-8 rounded-full border border-[#c0f20c]/60 animate-ping pointer-events-none" />
                      <div className="w-7 h-7 rounded-full border border-[#c0f20c] bg-black/85 hover:bg-[#c0f20c] flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(192,242,12,0.6)]">
                        <span className="text-[9px] font-bold text-[#c0f20c] group-hover:text-black font-mono">
                          {hotspotLabel[key] ?? key.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute left-9 top-1/2 -translate-y-1/2 bg-black/95 border border-neutral-800 text-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest shadow-2xl whitespace-nowrap font-mono flex items-center gap-1.5">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        {isEditorModeActive && (
                          <span className="text-red-500 font-bold ml-1 text-[8px]">{pos.left} / {pos.top}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Status badge */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md border border-neutral-800 px-3 py-1.5 text-[9px] flex items-center gap-2 pointer-events-none font-mono">
                <span className="w-2 h-2 bg-[#c0f20c] rounded-full animate-pulse" />
                <span>{isEditorModeActive ? "🔧 DRAG SPOTS TO POSITION" : "DRAG COCKPIT TO ROTATE"}</span>
              </div>

              {/* OEM Compare hold button */}
              <button
                onMouseDown={() => { playSynthSound('switch'); setCompareMode(true); }}
                onMouseUp={() => { playSynthSound('switch'); setCompareMode(false); }}
                onMouseLeave={() => setCompareMode(false)}
                className="absolute bottom-4 right-4 bg-black/85 backdrop-blur-md border border-neutral-800 hover:border-[#c0f20c] hover:text-[#c0f20c] transition-all duration-300 px-4 py-2 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer z-30 font-mono"
              >
                Hold to view stock OEM
              </button>
            </div>

            {/* Preset view angle buttons */}
            <div className="grid grid-cols-5 gap-2">
              <button
                onClick={() => zoomToPreset('cabin')}
                className={`border p-2.5 text-left transition-all duration-300 cursor-pointer bg-neutral-900 ${
                  focusedZone === null ? 'border-[#c0f20c]' : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <span className="block text-[8px] text-[#c0f20c] uppercase tracking-widest font-bold font-mono">PRESET 01</span>
                <span className="block text-[10px] font-bold uppercase mt-0.5 truncate font-mono text-white">Full Cabin</span>
              </button>
              {Object.keys(CONFIGS_DATA[activeChassis].zones).map((zoneId, idx) => (
                <button
                  key={zoneId}
                  onClick={() => zoomToPreset(zoneId)}
                  className={`border p-2.5 text-left transition-all duration-300 cursor-pointer bg-neutral-900 ${
                    focusedZone === zoneId ? 'border-[#c0f20c]' : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <span className="block text-[8px] text-neutral-500 uppercase tracking-widest font-bold font-mono">PRESET 0{idx + 2}</span>
                  <span className="block text-[10px] font-bold uppercase mt-0.5 truncate font-mono text-white capitalize">{zoneId.replace(/([A-Z])/g, ' $1')}</span>
                </button>
              ))}
            </div>

            {/* Coordinate output (only in editor mode) */}
            {isEditorModeActive && (
              <div className="border border-red-900/60 bg-red-950/5 p-4 flex flex-col gap-2 font-mono text-[11px] text-left">
                <div className="flex justify-between items-center border-b border-red-950 pb-2">
                  <span className="text-[9px] text-red-500 font-bold uppercase">🔧 HOTSPOT POSITION CONFIG</span>
                  <button
                    onClick={() => { navigator.clipboard.writeText(JSON.stringify({ hotspots: hotspotsPositions }, null, 2)); alert("Copied!"); }}
                    className="bg-red-900/20 border border-red-500/30 text-red-400 hover:bg-red-950 font-bold px-2 py-0.5 text-[9px] uppercase rounded transition-colors duration-200"
                  >
                    Copy Schema
                  </button>
                </div>
                <pre className="bg-black/60 p-3 max-h-40 overflow-y-auto text-neutral-400 select-text cursor-text">
                  {JSON.stringify({ chassis: activeChassis, hotspots: hotspotsPositions }, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Right: Catalog Panel */}
          <div className="flex flex-col gap-4 text-left">
            <div className="border border-neutral-900 bg-neutral-950/60 p-5 flex flex-col gap-4">
              <div>
                <span className="font-mono text-[9px] tracking-widest text-[#c0f20c] uppercase font-bold block mb-1">CATALOGUE</span>
                <h3 className="text-xl font-display font-bold uppercase text-white mt-1 tracking-tight">
                  Interior Upgrade Parts
                </h3>
                <p className="text-[11px] text-neutral-400 font-sans mt-2 leading-relaxed">
                  Select a cockpit zone below or click interactive hotspots to configure.
                </p>
              </div>

              <div className="flex flex-col gap-2 border-t border-neutral-900 pt-3">
                {Object.keys(CONFIGS_DATA[activeChassis].zones).map(zoneId => {
                  const zone = CONFIGS_DATA[activeChassis].zones[zoneId];
                  const selectedOpt = selectedOptions[zoneId];
                  const isFocused = focusedZone === zoneId;
                  return (
                    <div key={zoneId} className="flex flex-col">
                      <div
                        onClick={() => handlePartClick(zoneId)}
                        className={`border p-3.5 cursor-pointer transition-all duration-300 flex items-center justify-between ${
                          isFocused ? 'bg-[#c0f20c]/5 border-[#c0f20c]' : 'bg-neutral-950 border-neutral-900 hover:border-neutral-700'
                        }`}
                      >
                        <div>
                          <span className="block text-[8px] text-neutral-500 font-mono uppercase tracking-wider">ZONE: {zoneId.toUpperCase()}</span>
                          <span className="block text-xs font-bold text-white uppercase mt-0.5 font-mono">{zone.title}</span>
                          <span className="block text-[9px] text-[#c0f20c] uppercase mt-1 font-mono">
                            {selectedOpt ? `Upgrade: ${selectedOpt.name}` : 'OEM Standard (Included)'}
                          </span>
                        </div>
                        <ChevronRight className={`h-4 w-4 text-neutral-500 transition-transform duration-300 ${isFocused ? 'rotate-90 text-[#c0f20c]' : ''}`} />
                      </div>

                      <AnimatePresence>
                        {isFocused && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden bg-neutral-950/40 border border-t-0 border-neutral-900 p-3 flex flex-col gap-2"
                          >
                            <span className="text-[9px] text-neutral-500 font-mono block mb-1">CHOOSE MATERIAL SPECIFICATION:</span>
                            {zone.options.map((opt) => {
                              const isSelected = selectedOptions[zoneId] === opt;
                              return (
                                <div
                                  key={opt.name}
                                  onClick={() => selectOption(zoneId, opt)}
                                  className={`p-3 border cursor-pointer transition-all duration-200 flex flex-col gap-2 ${
                                    isSelected ? 'border-[#c0f20c] bg-[#c0f20c]/5' : 'border-neutral-900 bg-neutral-950 hover:border-neutral-800'
                                  }`}
                                >
                                  <div className="flex justify-between items-center text-[11px] font-bold font-mono">
                                    <span className="text-white">{opt.name}</span>
                                    <span className="text-[#c0f20c]">-{opt.weight} KG</span>
                                  </div>
                                  <div className="flex justify-between items-center text-[9px] text-neutral-500 border-t border-neutral-900/50 pt-2 font-mono">
                                    <span>Upgrade Price: ${opt.price.toLocaleString()} USD</span>
                                    <span className={`px-2 py-0.5 rounded-sm ${isSelected ? 'bg-[#c0f20c] text-black font-bold' : 'bg-neutral-800 text-neutral-400'}`}>
                                      {isSelected ? 'SELECTED' : 'CONFIGURE'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary + Checkout */}
            <div className="border border-neutral-900 bg-neutral-950/60 p-5 flex flex-col gap-3 font-mono text-[11px]">
              <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
                <span className="font-mono text-[9px] tracking-widest text-[#c0f20c] uppercase font-bold">CABIN CONFIG SUMMARY</span>
                <span className="text-[8px] bg-[#c0f20c]/10 border border-[#c0f20c]/20 text-[#c0f20c] px-2 py-0.5 rounded-sm uppercase tracking-wider font-bold">Autoclave Carbon</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-left">
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase">TOTAL PRICE</span>
                  <span className="text-[#c0f20c] block uppercase font-bold mt-0.5">${totalPrice.toLocaleString()} USD</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase">WEIGHT SAVED</span>
                  <span className="text-white block uppercase font-bold mt-0.5">-{totalWeight.toFixed(1)} KG</span>
                </div>
              </div>
              <button
                onClick={handleCheckoutAndAdd}
                className="w-full h-11 bg-[#c0f20c] hover:bg-[#9cce00] text-black font-bold uppercase tracking-widest text-[10px] transition-colors duration-300 cursor-pointer flex items-center justify-center gap-2 border-0 mt-2"
              >
                ADD PARTS TO CART
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
