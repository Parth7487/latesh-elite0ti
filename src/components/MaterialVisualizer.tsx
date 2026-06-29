import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

interface MaterialItem {
  title: string;
  badge: string;
  desc: string;
  weight: string;
  weaveCode: string;
  finishSpec: string;
  colorHex: string;
  img: string;
}

const MATERIALS_DATA: MaterialItem[] = [
  {
    title: "Fiberglass",
    badge: "OEM Prime",
    desc: "White primer-coated aerodynamic hood. Represents the baseline composite body structure before carbon weaving. Ideal for custom body paint applications.",
    weight: "Stock Equivalent",
    weaveCode: "GFRP Composite",
    finishSpec: "Base Primer",
    colorHex: "#e4e5e7",
    img: "/images/materials/Fiberglass_Hood_202606250419.jpeg"
  },
  {
    title: "Matte Carbon",
    badge: "Dry Carbon",
    desc: "Dry carbon look with an autoclave-cured 2x2 twill weave. The matte clear coat reduces glare and reflections, focusing strictly on the raw carbon texture.",
    weight: "-65% vs stock",
    weaveCode: "Pre-preg 2x2",
    finishSpec: "Satin Matte",
    colorHex: "#1d1d1f",
    img: "/images/materials/Matte_Carbon_Hood_202606250419.jpeg"
  },
  {
    title: "Gloss Carbon",
    badge: "Wet Carbon",
    desc: "Wet-lay carbon look protected by a high-gloss, UV-resistant gel coat. Reflects the garage spotlights and horizon lines sharply for a deep, metallic shimmer.",
    weight: "-55% vs stock",
    weaveCode: "3K Twill Weave",
    finishSpec: "High-Gloss UV",
    colorHex: "#09090b",
    img: "/images/materials/Gloss_Carbon_Hood_202606250419.jpeg"
  },
  {
    title: "Forged Carbon",
    badge: "Compounded",
    desc: "Constructed using chopped carbon fibers mixed with resin. Gives a randomized, marbled metallic flake aesthetic. Stronger than traditional weaves in complex curves.",
    weight: "-70% vs stock",
    weaveCode: "Chopped Filament",
    finishSpec: "Marbled Polish",
    colorHex: "#3d3d44",
    img: "/images/materials/Forged_Carbon_Hood_202606250419.jpeg"
  },
  {
    title: "Carbon Kevlar",
    badge: "Aramid Weave",
    desc: "Aramid-infused fiber hybrid woven with carbon. The distinctive yellow basket-weave pattern adds extreme impact resistance, high heat protection, and a classic JDM race-car accent.",
    weight: "-60% vs stock",
    weaveCode: "Aramid-Carbon",
    finishSpec: "Yellow hybrid",
    colorHex: "#d4af37",
    img: "/images/materials/Kevlar_Carbon_Hood_(Fixed)_202606250419.jpeg"
  }
];

interface MaterialVisualizerProps {
  type?: 'both' | 'hood' | 'accordion';
}

export default function MaterialVisualizer({ type = 'both' }: MaterialVisualizerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [accordionIndex, setAccordionIndex] = useState(0);
  const [showSchema, setShowSchema] = useState(false);

  // Schema Config Options for Material Accordion Explorer
  const [sectionPadding, setSectionPadding] = useState(0); // vertical padding
  const [maxWidthDesktop, setMaxWidthDesktop] = useState(1800);
  const maxWidthTablet = "768px";
  const maxWidthMobile = "100%";
  const [containerHeightDesktop, setContainerHeightDesktop] = useState(800); // px
  const [cardGap, setCardGap] = useState(4); // px
  const [borderRadius, setBorderRadius] = useState(4); // px
  
  // Wipe transitions
  const [bgImg, setBgImg] = useState(MATERIALS_DATA[0].img);
  const [fgImg, setFgImg] = useState(MATERIALS_DATA[0].img);
  const [wipeProgress, setWipeProgress] = useState(100);

  const viewerBoxRef = useRef<HTMLDivElement>(null);
  const mainLensRef = useRef<HTMLDivElement>(null);
  const mainLensBgRef = useRef<HTMLDivElement>(null);
  
  const accordionContainerRef = useRef<HTMLDivElement>(null);
  const detailCardRef = useRef<HTMLDivElement>(null);

  // Transition tween ref
  const transitionTween = useRef<gsap.core.Tween | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle material selection with cross-fade wipe
  const selectMaterial = (index: number) => {
    if (index === activeIndex) return;

    // Fade active detail text card using GSAP
    if (detailCardRef.current) {
      gsap.to(detailCardRef.current, {
        opacity: 0,
        y: 8,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setActiveIndex(index);
          gsap.to(detailCardRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power3.out"
          });
        }
      });
    } else {
      setActiveIndex(index);
    }

    // Set background image to current foreground
    setBgImg(fgImg);
    // Set foreground to new image
    setFgImg(MATERIALS_DATA[index].img);
    // Restart progress from 0 to 100
    setWipeProgress(0);

    if (transitionTween.current) transitionTween.current.kill();

    const obj = { val: 0 };
    transitionTween.current = gsap.to(obj, {
      val: 100,
      duration: 1.5,
      ease: "power3.out",
      onUpdate: () => {
        setWipeProgress(Math.round(obj.val));
      }
    });
  };

  // Main Visualizer Lens Magnifier logic
  useEffect(() => {
    const box = viewerBoxRef.current;
    const lens = mainLensRef.current;
    const zoomBg = mainLensBgRef.current;
    if (!box || !lens || !zoomBg) return;

    const zoomFactor = 2.4;
    let activeTween: gsap.core.Tween | null = null;
    const coords = { x: 0, y: 0 };

    const handleMouseEnter = (e: MouseEvent) => {
      const rect = box.getBoundingClientRect();
      zoomBg.style.width = `${rect.width}px`;
      zoomBg.style.height = `${rect.height}px`;

      gsap.killTweensOf(lens);
      gsap.to(lens, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "back.out(1.2)"
      });

      coords.x = e.clientX - rect.left;
      coords.y = e.clientY - rect.top;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = box.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (activeTween) activeTween.kill();
      activeTween = gsap.to(coords, {
        x: x,
        y: y,
        duration: 0.12,
        ease: "power2.out",
        onUpdate: () => {
          const cx = coords.x;
          const cy = coords.y;
          const halfLens = 90;
          const px = cx - halfLens;
          const py = cy - halfLens;

          lens.style.left = `${px}px`;
          lens.style.top = `${py}px`;

          zoomBg.style.left = `${-px}px`;
          zoomBg.style.top = `${-py}px`;
          zoomBg.style.transform = `scale(${zoomFactor})`;
          zoomBg.style.transformOrigin = `${cx}px ${cy}px`;
        }
      });
    };

    const handleMouseLeave = () => {
      if (activeTween) activeTween.kill();
      gsap.killTweensOf(lens);
      gsap.to(lens, {
        opacity: 0,
        scale: 0,
        duration: 0.25,
        ease: "power2.in"
      });
    };

    box.addEventListener("mouseenter", handleMouseEnter);
    box.addEventListener("mousemove", handleMouseMove);
    box.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      box.removeEventListener("mouseenter", handleMouseEnter);
      box.removeEventListener("mousemove", handleMouseMove);
      box.removeEventListener("mouseleave", handleMouseLeave);
      if (activeTween) activeTween.kill();
    };
  }, [fgImg]);

  // Accordion Expand animations
  const handleAccordionExpand = (index: number) => {
    if (index === accordionIndex) return;
    setAccordionIndex(index);

    const wrapper = accordionContainerRef.current;
    if (!wrapper) return;
    
    // Select elements within the card
    const card = wrapper.children[index] as HTMLElement;
    const desc = card.querySelector(".card-desc");
    const specs = card.querySelectorAll(".spec-item");
    const title = card.querySelector(".card-title");
    const badge = card.querySelector(".card-badge");

    gsap.fromTo([badge, title], 
      { opacity: 0, x: -10 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" }
    );

    gsap.fromTo(desc, 
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, delay: 0.15, ease: "power2.out" }
    );
    
    gsap.fromTo(specs,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, delay: 0.25, ease: "power3.out" }
    );
  };

  // Accordion Card Lens Magnifier Hook
  const accordionCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    accordionCardRefs.current.forEach((card, idx) => {
      if (!card) return;
      const lens = card.querySelector(".lens-magnifier") as HTMLElement;
      const zoomBg = card.querySelector(".lens-zoom-bg") as HTMLElement;
      if (!lens || !zoomBg) return;

      let activeTween: gsap.core.Tween | null = null;
      const coords = { x: 0, y: 0 };
      const zoomFactor = 2.0;

      const onEnter = (e: MouseEvent) => {
        if (idx !== accordionIndex) return;

        const rect = card.getBoundingClientRect();
        zoomBg.style.width = `${rect.width}px`;
        zoomBg.style.height = `${rect.height}px`;

        gsap.killTweensOf(lens);
        gsap.to(lens, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "back.out(1.2)"
        });

        coords.x = e.clientX - rect.left;
        coords.y = e.clientY - rect.top;
      };

      const onMove = (e: MouseEvent) => {
        if (idx !== accordionIndex) {
          if (lens.style.opacity !== "0") {
            gsap.to(lens, { opacity: 0, scale: 0, duration: 0.2 });
          }
          return;
        }

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (activeTween) activeTween.kill();
        activeTween = gsap.to(coords, {
          x: x,
          y: y,
          duration: 0.12,
          onUpdate: () => {
            const cx = coords.x;
            const cy = coords.y;
            const halfLens = 90;
            const px = cx - halfLens;
            const py = cy - halfLens;

            lens.style.left = `${px}px`;
            lens.style.top = `${py}px`;
            zoomBg.style.left = `${-px}px`;
            zoomBg.style.top = `${-py}px`;
            zoomBg.style.transform = `scale(${zoomFactor})`;
            zoomBg.style.transformOrigin = `${cx}px ${cy}px`;
          }
        });
      };

      const onLeave = () => {
        if (activeTween) activeTween.kill();
        gsap.killTweensOf(lens);
        gsap.to(lens, {
          opacity: 0,
          scale: 0,
          duration: 0.25,
          ease: "power2.in"
        });
      };

      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);

      return () => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
        if (activeTween) activeTween.kill();
      };
    });
  }, [accordionIndex]);

  return (
    <div 
      className="w-full mx-auto px-6 font-mono text-left bg-[#0a0a0c] transition-all duration-300"
      style={{
        paddingTop: `${sectionPadding}px`,
        paddingBottom: `${sectionPadding}px`,
        maxWidth: `${maxWidthDesktop}px` // using desktop width by default; can be driven by media queries if extended
      }}
    >
      
      {/* SECTION 1: Hood Material Visualiser */}
      {(type === 'both' || type === 'hood') && (
      <div className="w-full bg-[#0d0d0e] border border-neutral-900 rounded-2xl p-6 md:p-10 shadow-2xl flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-neutral-900 pb-5">
          <div className="text-left">
            <h2 className="text-2xl md:text-3xl font-black italic tracking-wider text-white uppercase" style={{ fontFamily: 'Teko, sans-serif' }}>
              Hood Material Visualiser
            </h2>
            <p className="text-[10px] text-neutral-400 font-sans tracking-wide uppercase mt-1 leading-relaxed">
              Interactive transformations between 5 JDM spec carbon &amp; weave hoods.
            </p>
          </div>
          <a 
            href="https://labs.google/fx/tools/flow/project/c4d70d3c-a745-49b4-a1f2-6442ac1d8ff2" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-mono text-[9px] bg-[#c0f20c]/10 border border-[#c0f20c]/20 text-[#c0f20c] px-3 py-1 uppercase tracking-widest font-bold hover:bg-[#c0f20c] hover:text-black transition-colors duration-300 rounded-full"
          >
            ⚡ Google Flow
          </a>
        </div>

        {/* Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Viewer Frame Box */}
          <div className="lg:col-span-2 relative aspect-square bg-neutral-950 border border-neutral-900 overflow-hidden" ref={viewerBoxRef} id="viewerBox">
            <img className="absolute inset-0 w-full h-full object-cover pointer-events-none" src={bgImg} alt="Background" />
            <img 
              className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-75" 
              src={fgImg} 
              alt="Foreground" 
              style={{ opacity: wipeProgress / 100 }}
            />
            
            {/* Visual Divider (Wipe Line) - Disabled for dissolve-only transition */}
            <div 
              className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#c0f20c] to-transparent pointer-events-none"
              style={{ 
                left: `${wipeProgress}%`,
                boxShadow: '0 0 10px #c0f20c, 0 0 20px #c0f20c',
                opacity: 0
              }}
            />

            {/* Lens Magnifier */}
            <div 
              ref={mainLensRef}
              className="absolute w-[180px] h-[180px] rounded-full border-2 border-[#c0f20c] pointer-events-none opacity-0 scale-0 overflow-hidden z-50"
              style={{ boxShadow: '0 0 30px rgba(0,0,0,0.9), inset 0 0 20px rgba(0,0,0,0.7), 0 0 20px rgba(192,242,12,0.3)' }}
            >
              <div 
                ref={mainLensBgRef}
                className="absolute bg-cover bg-center pointer-events-none"
                style={{ backgroundImage: `url("${fgImg}")` }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6 text-left">
            
            {/* Selection */}
            <div>
              <div className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Select Material</div>
              <div className="flex flex-col gap-2">
                {MATERIALS_DATA.map((mat, i) => (
                  <button 
                    key={mat.title}
                    className={`w-full py-3 px-4 bg-transparent border text-left cursor-pointer transition-all duration-300 flex items-center justify-between text-[11px] font-bold tracking-wider ${
                      i === activeIndex 
                        ? 'border-[#c0f20c] text-white bg-[#c0f20c]/5' 
                        : 'border-neutral-900 text-neutral-400 hover:border-neutral-700 hover:text-white'
                    }`}
                    onClick={() => selectMaterial(i)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full border border-white/10" style={{ background: mat.colorHex }} />
                      <span>{mat.title}</span>
                    </div>
                    <span className="text-[8px] font-mono tracking-widest text-neutral-500 uppercase border border-neutral-900 px-1.5 py-0.5 rounded-sm">
                      {mat.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Details Info Card */}
            <div ref={detailCardRef} className="border border-neutral-900 bg-neutral-950 p-5 rounded-none text-left min-h-[120px]">
              <div className="text-[9px] text-[#c0f20c] font-bold tracking-widest uppercase mb-1">
                {MATERIALS_DATA[activeIndex].title}
              </div>
              <p className="text-neutral-400 text-xs font-sans leading-relaxed">
                {MATERIALS_DATA[activeIndex].desc}
              </p>
            </div>

          </div>
        </div>

      </div>

      )}

      {/* SECTION 2: Material Accordion Explorer */}
      {(type === 'both' || type === 'accordion') && (
      <>
      <div className="w-full bg-[#0d0d0e] border border-neutral-900 rounded-2xl p-6 md:p-10 shadow-2xl flex flex-col gap-8">
        
        <div className="flex justify-between items-start border-b border-neutral-900 pb-5">
          <div className="text-left">
            <h2 className="text-2xl md:text-3xl font-black italic tracking-wider text-white uppercase" style={{ fontFamily: 'Teko, sans-serif' }}>
              OUR CARBON CATALOG
            </h2>
          </div>
          <div className="flex gap-3">
            <div className="font-mono text-[9px] bg-[#c0f20c]/10 border border-[#c0f20c]/20 text-[#c0f20c] px-3 py-1 uppercase tracking-widest font-bold">
              🔍 Zoom Details
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full h-auto" style={{ gap: `${cardGap}px`, minHeight: isMobile ? '450px' : `${containerHeightDesktop}px` }} ref={accordionContainerRef}>
          {MATERIALS_DATA.map((mat, i) => {
            const isActive = i === accordionIndex;
            return (
              <div 
                key={mat.title}
                ref={(el) => { accordionCardRefs.current[i] = el; }}
                onClick={() => handleAccordionExpand(i)}
                style={{ borderRadius: `${borderRadius}px` }}
                className={`relative overflow-hidden cursor-pointer border transition-all duration-500 ease-out flex-shrink-0 flex flex-col justify-end p-5 min-h-[120px] md:min-h-0 ${
                  isActive 
                    ? 'flex-grow-[4] md:flex-[4.5] border-[#c0f20c] shadow-[0_0_25px_rgba(192,242,12,0.15)]' 
                    : 'flex-grow-[1] md:flex-[1] border-neutral-900 hover:border-neutral-700'
                }`}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-out hover:scale-105"
                  style={{ backgroundImage: `url("${mat.img}")` }}
                />

                {/* Lens Magnifier overlay */}
                <div 
                  className="absolute w-[180px] h-[180px] rounded-full border-2 border-[#c0f20c] pointer-events-none opacity-0 scale-0 overflow-hidden z-50"
                  style={{ boxShadow: '0 0 30px rgba(0,0,0,0.9), inset 0 0 20px rgba(0,0,0,0.7), 0 0 20px rgba(192,242,12,0.3)' }}
                >
                  <div className="absolute bg-cover bg-center pointer-events-none lens-zoom-bg" style={{ backgroundImage: `url("${mat.img}")` }} />
                </div>

                {/* Dark Vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

                {/* Index number */}
                <div className={`absolute top-4 right-4 text-2xl font-black italic tracking-widest transition-colors duration-300 z-20 ${isActive ? 'text-[#c0f20c]/30' : 'text-white/5'}`}>
                  {`0${i + 1}`}
                </div>

                {/* Card Title Header */}
                <div 
                  className={`z-20 transition-all duration-500 origin-left-bottom whitespace-nowrap absolute bottom-6 left-6 ${
                    isActive 
                      ? '-translate-y-[170px] translate-x-0 rotate-0 text-left' 
                      : 'md:-rotate-90 md:translate-y-0 md:left-7 md:bottom-20'
                  }`}
                >
                  {isActive && (
                    <span className="card-badge text-[8px] font-bold text-[#c0f20c] bg-[#c0f20c]/10 border border-[#c0f20c]/20 px-2 py-0.5 uppercase tracking-widest block w-max mb-2">
                      {mat.badge}
                    </span>
                  )}
                  <h3 className="card-title text-base font-black italic tracking-wide uppercase text-white leading-none">
                    {mat.title}
                  </h3>
                </div>

                {/* Card Expanded Content */}
                <div className={`z-20 text-left transition-all duration-500 absolute bottom-5 left-5 right-5 ${
                  isActive ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto delay-150' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                }`}>
                  <p className="card-desc text-[11px] text-neutral-400 font-sans leading-relaxed mb-4 max-w-[90%]">
                    {mat.desc}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-3 border-t border-neutral-900 pt-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] font-bold tracking-widest uppercase text-neutral-500">Weight</span>
                      <span className="text-[11px] font-bold text-white uppercase">{mat.weight}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] font-bold tracking-widest uppercase text-neutral-500">Weave Code</span>
                      <span className="text-[11px] font-bold text-white uppercase">{mat.weaveCode}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] font-bold tracking-widest uppercase text-neutral-500">Finish Spec</span>
                      <span className="text-[11px] font-bold text-white uppercase">{mat.finishSpec}</span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Global Specifications Grid */}
      <div className="w-full bg-[#0d0d0e] border border-neutral-900 p-6 md:p-10 shadow-2xl flex flex-col gap-6 text-left">
        <div>
          <div className="font-mono text-[9px] text-[#c0f20c] font-bold tracking-[0.2em] uppercase">SYS.SPECIFICATION_MATRIX</div>
          <h3 className="text-lg md:text-xl font-black italic tracking-wider uppercase text-white mt-1" style={{ fontFamily: 'Teko, sans-serif' }}>
            Precision. Power. Performance &mdash; Carbon for the Driven
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-neutral-900 bg-neutral-950 p-4 transition-colors hover:border-[#c0f20c]/40 group">
            <div className="font-mono text-[8px] text-[#c0f20c] font-bold tracking-widest mb-1.5">[01] ACCELERATION</div>
            <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-2">Lightweight Strength</h4>
            <p className="text-[11px] text-neutral-500 font-sans leading-relaxed group-hover:text-neutral-400 transition-colors">
              Carbon cuts weight while keeping serious rigidity. Better speed and sharper handling.
            </p>
          </div>

          <div className="border border-neutral-900 bg-neutral-950 p-4 transition-colors hover:border-[#c0f20c]/40 group">
            <div className="font-mono text-[8px] text-[#c0f20c] font-bold tracking-widest mb-1.5">[02] TELEMETRY</div>
            <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-2">Enhanced Aerodynamics</h4>
            <p className="text-[11px] text-neutral-500 font-sans leading-relaxed group-hover:text-neutral-400 transition-colors">
              Shaped to move air clean. Less drag, more downforce, more stability at speed.
            </p>
          </div>

          <div className="border border-neutral-900 bg-neutral-950 p-4 transition-colors hover:border-[#c0f20c]/40 group">
            <div className="font-mono text-[8px] text-[#c0f20c] font-bold tracking-widest mb-1.5">[03] CHASSIS</div>
            <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-2">Long Lasting Durability</h4>
            <p className="text-[11px] text-neutral-500 font-sans leading-relaxed group-hover:text-neutral-400 transition-colors">
              Carbon stands up to UV, heat, moisture, and daily abuse. Built to hold its finish and performance.
            </p>
          </div>

          <div className="border border-neutral-900 bg-neutral-950 p-4 transition-colors hover:border-[#c0f20c]/40 group">
            <div className="font-mono text-[8px] text-[#c0f20c] font-bold tracking-widest mb-1.5">[04] FITMENT</div>
            <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-2">Easy Installation</h4>
            <p className="text-[11px] text-neutral-500 font-sans leading-relaxed group-hover:text-neutral-400 transition-colors">
              Designed for true fitment. Install ready upgrades that improve both function and style.
            </p>
          </div>
        </div>
      </div>
      </>
      )}

    </div>
  );
}
