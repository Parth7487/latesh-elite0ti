import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface Upgrade {
  id: string;
  type: string;
  name: string;
  price: string;
  img: string;
  boost: {
    speed?: number;
    handling?: number;
    acceleration?: number;
    aero?: number;
  };
}

interface CarData {
  id: string;
  class: string;
  rating: string;
  make: string;
  model: string;
  year: string;
  colorHex: string;
  heroImg: string;
  baseStats: {
    speed: number;
    handling: number;
    acceleration: number;
    aero: number;
  };
  upgrades: Upgrade[];
}

const catalogData: Record<string, CarData> = {
  rx7: {
    id: 'rx7',
    class: 'S1',
    rating: '842',
    make: 'MAZDA',
    model: 'Mazda RX-7 (FD3S) Minor Change 2000',
    year: '2000',
    colorHex: '#39ff14', 
    heroImg: '/images/upgrades/upgrade_1.webp',
    baseStats: { speed: 6.8, handling: 7.5, acceleration: 6.2, aero: 6.0 },
    upgrades: [
      { id: 'u1', type: 'AERO', name: 'FRONT BUMPER', price: '1,450 USD', img: '/images/upgrades/upgrade_1.webp', boost: { aero: 1.2, handling: 0.5, speed: -0.1 } },
      { id: 'u2', type: 'AERO', name: 'SIDE SKIRTS (PAIR)', price: '850 USD', img: '/images/upgrades/upgrade_2.webp', boost: { handling: 0.3, aero: 0.4 } },
      { id: 'u3', type: 'AERO', name: 'REAR SPOILER', price: '1,200 USD', img: '/images/upgrades/upgrade_3.webp', boost: { aero: 1.8, handling: 0.8, speed: -0.4 } },
      { id: 'u4', type: 'AERO', name: 'REAR DIFFUSER', price: '950 USD', img: '/images/upgrades/upgrade_3.webp', boost: { handling: 1.0, aero: 1.5 } },
    ]
  },
  supra: {
    id: 'supra',
    class: 'S1',
    rating: '865',
    make: 'TOYOTA',
    model: 'ETi Toyota Supra MKIV TRD 3000GT Body Kit',
    year: '1998',
    colorHex: '#b026ff', 
    heroImg: '/images/cars/supra_trd_main.webp',
    baseStats: { speed: 8.2, handling: 6.1, acceleration: 7.8, aero: 5.2 },
    upgrades: [
      { id: 'u5', type: 'AERO', name: 'FRONT BUMPER', price: '1,200 USD', img: '/images/upgrades/supra_1.webp', boost: { speed: 1.5, handling: 1.6 } },
      { id: 'u6', type: 'AERO', name: 'FRONT BUMPER LIP', price: '450 USD', img: '/images/upgrades/supra_2.webp', boost: { aero: 1.0, handling: 0.5 } },
      { id: 'u7', type: 'AERO', name: 'FRONT DIFFUSER', price: '650 USD', img: '/images/upgrades/supra_3.webp', boost: { handling: 1.2, aero: 1.0 } },
      { id: 'u8', type: 'AERO', name: 'REAR BUMPER', price: '1,100 USD', img: '/images/upgrades/supra_4.webp', boost: { handling: 0.8, aero: 1.2 } },
      { id: 'u9', type: 'AERO', name: 'SIDE SKIRT', price: '700 USD', img: '/images/upgrades/supra_1.webp', boost: { handling: 0.5, aero: 0.5 } },
      { id: 'u10', type: 'AERO', name: 'FRONT FENDER', price: '850 USD', img: '/images/upgrades/supra_2.webp', boost: { handling: 1.0 } },
      { id: 'u11', type: 'AERO', name: 'REAR FENDER', price: '950 USD', img: '/images/upgrades/supra_3.webp', boost: { aero: 0.5 } },
    ]
  }
};

interface ForzaShowroomProps {
  triggerToast: (msg: string) => void;
  onAddToCart?: (product: { id: string; title: string; price: number; category: string }) => void;
}

export default function ForzaShowroom({ triggerToast, onAddToCart }: ForzaShowroomProps) {
  const [activeCarId, setActiveCarId] = useState<string>('rx7');
  const [hoveredBoost, setHoveredBoost] = useState<Upgrade['boost'] | null>(null);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);
  const statsPanelRef = useRef<HTMLDivElement>(null);
  const carouselPanelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const carouselScrollRef = useRef<HTMLDivElement>(null);

  // References for WebGL cleanup
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const ringMatRef = useRef<THREE.MeshBasicMaterial | null>(null);

  const activeCar = catalogData[activeCarId];

  // Initialize WebGL Podium Floor
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x0a0a0c, 0.04);

    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 2, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    rendererRef.current = renderer;
    renderer.setClearColor(0x0a0a0c);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Reflective garage Floor
    const floorGeo = new THREE.PlaneGeometry(100, 100);
    const floorMat = new THREE.MeshStandardMaterial({ 
      color: 0x15151a,
      roughness: 0.1,
      metalness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1;
    scene.add(floor);

    // Glowing Podium Ring (Matches active car hex color)
    const ringGeo = new THREE.RingGeometry(3.5, 4, 64);
    const ringMat = new THREE.MeshBasicMaterial({ 
      color: new THREE.Color(activeCar.colorHex), 
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    ringMatRef.current = ringMat;
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -0.99;
    // scene.add(ring);


    // Grid helper inside ring
    const gridHelper = new THREE.GridHelper(7, 14, 0xffffff, 0xffffff);
    gridHelper.position.y = -0.99;
    const gridMat = gridHelper.material as THREE.Material;
    gridMat.transparent = true;
    gridMat.opacity = 0.1;
    scene.add(gridHelper);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    const spotLight = new THREE.SpotLight(0xffffff, 2);
    spotLight.position.set(0, 10, 0);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.5;
    scene.add(spotLight);

    let cameraAngle = 0;
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      cameraAngle += 0.002;
      camera.position.x = Math.sin(cameraAngle) * 8;
      camera.position.z = Math.cos(cameraAngle) * 8;
      camera.lookAt(0, 1, 0);

      if (ringMat) {
        ringMat.opacity = 0.5 + Math.sin(Date.now() * 0.002) * 0.3;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container.clientWidth || !container.clientHeight) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);


    // Intro Entrance Animation
    gsap.set(headerRef.current, { y: -50, opacity: 0 });
    gsap.set(heroImgRef.current, { scale: 1.1, opacity: 0, filter: 'blur(10px)' });
    gsap.set(statsPanelRef.current, { x: -50, opacity: 0 });
    gsap.set(carouselPanelRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(headerRef.current, { y: 0, opacity: 1, duration: 0.8 })
      .to(heroImgRef.current, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1 }, "-=0.4")
      .to(statsPanelRef.current, { x: 0, opacity: 1, duration: 0.6 }, "-=0.6")
      .to(carouselPanelRef.current, { y: 0, opacity: 1, duration: 0.5 }, "-=0.4");

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      gridHelper.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update ring color on car change
  useEffect(() => {
    if (ringMatRef.current) {
      const targetColor = new THREE.Color(activeCar.colorHex);
      gsap.to(ringMatRef.current.color, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 0.5
      });
    }
  }, [activeCarId, activeCar.colorHex]);

  const switchCar = (newId: string) => {
    if (newId === activeCarId) return;

    const carImg = heroImgRef.current;
    const statsPanel = statsPanelRef.current;
    const carouselPanel = carouselPanelRef.current;

    // Animate Out
    gsap.to(carImg, { x: -200, opacity: 0, filter: 'blur(10px)', duration: 0.4, ease: 'power2.in' });
    gsap.to(statsPanel, { x: -50, opacity: 0, duration: 0.3, ease: 'power2.in' });
    gsap.to(carouselPanel, { y: 50, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => {
      
      setActiveCarId(newId);
      setHoveredBoost(null);

      // Animate In
      gsap.fromTo(carImg, { x: 200, opacity: 0, filter: 'blur(10px)' }, { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' });
      gsap.fromTo(statsPanel, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.2)' });
      gsap.fromTo(carouselPanel, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
    }});
  };

  const scrollCarousel = (direction: number) => {
    if (carouselScrollRef.current) {
      carouselScrollRef.current.scrollBy({ left: direction * 300, behavior: 'smooth' });
    }
  };

  const handleAllocate = (upgrade: Upgrade) => {
    triggerToast(`🛠️ Allocated upgrade: ${upgrade.name} for ${activeCar.model}`);
    if (onAddToCart) {
      // Calculate numerical value from price (e.g. "1,450 CR" -> 1450)
      const numericPrice = parseInt(upgrade.price.replace(/[^0-9]/g, '')) || 500;
      onAddToCart({
        id: upgrade.id,
        title: `${activeCar.model} - ${upgrade.name}`,
        price: numericPrice,
        category: 'carbon'
      });
    }
  };

  const renderStatValue = (key: keyof CarData['baseStats']) => {
    const base = activeCar.baseStats[key];
    const boost = hoveredBoost ? hoveredBoost[key] : undefined;

    if (boost !== undefined && boost !== 0) {
      const isPositive = boost > 0;
      const boostColor = isPositive ? 'text-[#39ff14]' : 'text-[#ff3939]';
      return (
        <span className="text-sm font-bold">
          {base.toFixed(1)} <span className={`${boostColor} ml-1`}>{isPositive ? '+' : ''}{boost.toFixed(1)}</span>
        </span>
      );
    }
    return <span className="text-sm font-bold">{base.toFixed(1)}</span>;
  };

  const getStatWidths = (key: keyof CarData['baseStats']) => {
    const base = activeCar.baseStats[key];
    const boost = hoveredBoost ? hoveredBoost[key] : undefined;

    let baseWidth = `${base * 10}%`;
    let boostWidth = '0%';
    let showBoost = false;

    if (boost && boost > 0) {
      boostWidth = `${boost * 10}%`;
      showBoost = true;
    }

    return { baseWidth, boostWidth, showBoost };
  };

  return (
    <section className="relative w-full min-h-screen md:h-screen overflow-hidden select-none bg-[#0a0a0c] border-b border-white/5" id="showroom-section" style={{ isolation: 'isolate' }}>
      {/* WebGL Podium Background */}
      <div ref={canvasContainerRef} className="absolute inset-0 z-0" />

      {/* Vignette & Scanlines */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      <div className="absolute inset-0 z-0 pointer-events-none opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }} />

      {/* Interface Content Layer */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-4 sm:p-6 md:p-10 font-mono text-left">
        
        {/* Top header branding */}
        <header ref={headerRef} className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 w-full">
          <div className="flex items-center gap-4 sm:gap-6">
            <div 
              className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] transform -skew-x-12 shrink-0"
            >
              <span className="transform skew-x-12 font-bold text-2xl sm:text-3xl font-sans leading-none -mb-1">{activeCar.rating}</span>
              <span className="transform skew-x-12 text-[9px] sm:text-[10px] font-bold bg-black text-white px-2 mt-1 rounded-sm">{activeCar.class}</span>
            </div>
            
            <div>
              <h2 className="text-sm sm:text-base md:text-2xl font-bold italic tracking-wide text-neutral-400 leading-none">
                {activeCar.make} <span className="text-[10px] sm:text-sm font-normal not-italic ml-2">{activeCar.year}</span>
              </h2>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black italic tracking-wider uppercase text-white drop-shadow-lg leading-tight mt-1" style={{ fontFamily: 'Teko, sans-serif' }}>
                {activeCar.model}
              </h1>
            </div>
          </div>

          {/* Car Switch Tabs */}
          <div className="flex gap-2">
            <button 
              onClick={() => switchCar('rx7')}
              className={`px-4 md:px-6 py-2 transform -skew-x-12 transition-all duration-300 border-b-4 font-bold backdrop-blur-sm cursor-pointer ${
                activeCarId === 'rx7' ? 'bg-white/10 text-white border-[#bdf522]' : 'bg-black/40 text-neutral-500 border-transparent hover:bg-white/5 hover:text-neutral-300'
              }`}
            >
              <span className="block transform skew-x-12 italic tracking-widest uppercase text-xs md:text-sm">RX-7</span>
            </button>
            <button 
              onClick={() => switchCar('supra')}
              className={`px-4 md:px-6 py-2 transform -skew-x-12 transition-all duration-300 border-b-4 font-bold backdrop-blur-sm cursor-pointer ${
                activeCarId === 'supra' ? 'bg-white/10 text-white border-[#bdf522]' : 'bg-black/40 text-neutral-500 border-transparent hover:bg-white/5 hover:text-neutral-300'
              }`}
            >
              <span className="block transform skew-x-12 italic tracking-widest uppercase text-xs md:text-sm">SUPRA</span>
            </button>
          </div>
        </header>

        {/* Center Hero Car Image - placed before z-10 layer to stay contained */}
        <div className="absolute md:inset-0 z-[1] flex items-center justify-center pointer-events-none w-full h-[32vh] md:h-full top-[130px] sm:top-[110px] md:top-0" style={{ overflow: 'hidden' }}>
          <div className="w-[85%] sm:w-[70%] md:w-[80%] max-w-4xl drop-shadow-[0_30px_50px_rgba(0,0,0,0.9)]">
            <img 
              ref={heroImgRef}
              src={activeCar.heroImg} 
              alt={activeCar.model}
              className="w-full object-contain opacity-95 transition-all duration-300"
            />
          </div>
        </div>

        {/* Left stats Telemetry panel */}
        <div 
          ref={statsPanelRef} 
          className="relative z-10 w-full md:w-72 bg-black/60 backdrop-blur-xl border-l-4 border-[#bdf522] p-5 shadow-2xl self-start mt-[33vh] md:mt-20"
        >
          <div className="mb-5 pb-2 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-bold text-sm tracking-widest uppercase italic text-white">Telemetry</h3>
            <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              <path d="M2 12h20"></path>
            </svg>
          </div>

          {/* Speed Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-end mb-1">
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-neutral-300">Speed</span>
              {renderStatValue('speed')}
            </div>
            <div className="h-2 w-full bg-neutral-800 rounded-sm overflow-hidden flex transform -skew-x-12">
              <div className="h-full bg-white transition-all duration-300" style={{ width: getStatWidths('speed').baseWidth }} />
              {getStatWidths('speed').showBoost && (
                <div className="h-full bg-[#bdf522] transition-all duration-300 animate-pulse" style={{ width: getStatWidths('speed').boostWidth }} />
              )}
            </div>
          </div>

          {/* Handling Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-end mb-1">
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-neutral-300">Handling</span>
              {renderStatValue('handling')}
            </div>
            <div className="h-2 w-full bg-neutral-800 rounded-sm overflow-hidden flex transform -skew-x-12">
              <div className="h-full bg-white transition-all duration-300" style={{ width: getStatWidths('handling').baseWidth }} />
              {getStatWidths('handling').showBoost && (
                <div className="h-full bg-[#bdf522] transition-all duration-300 animate-pulse" style={{ width: getStatWidths('handling').boostWidth }} />
              )}
            </div>
          </div>

          {/* Acceleration Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-end mb-1">
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-neutral-300">Acceleration</span>
              {renderStatValue('acceleration')}
            </div>
            <div className="h-2 w-full bg-neutral-800 rounded-sm overflow-hidden flex transform -skew-x-12">
              <div className="h-full bg-white transition-all duration-300" style={{ width: getStatWidths('acceleration').baseWidth }} />
              {getStatWidths('acceleration').showBoost && (
                <div className="h-full bg-[#bdf522] transition-all duration-300 animate-pulse" style={{ width: getStatWidths('acceleration').boostWidth }} />
              )}
            </div>
          </div>

          {/* Aerodynamics Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-end mb-1">
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-neutral-300">Aero</span>
              {renderStatValue('aero')}
            </div>
            <div className="h-2 w-full bg-neutral-800 rounded-sm overflow-hidden flex transform -skew-x-12">
              <div className="h-full bg-white transition-all duration-300" style={{ width: getStatWidths('aero').baseWidth }} />
              {getStatWidths('aero').showBoost && (
                <div className="h-full bg-[#bdf522] transition-all duration-300 animate-pulse" style={{ width: getStatWidths('aero').boostWidth }} />
              )}
            </div>
          </div>
        </div>

        {/* Bottom Upgrade Options Carousel */}
        <div ref={carouselPanelRef} className="relative z-20 w-full mt-auto pt-4 pb-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl md:text-2xl italic font-black tracking-wide uppercase flex items-center gap-2 text-white" style={{ fontFamily: 'Teko, sans-serif' }}>
              Available Upgrades 
              <span className="text-[10px] font-mono not-italic text-neutral-400 bg-white/10 px-2 py-0.5 rounded ml-2">
                {activeCar.upgrades.length}
              </span>
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={() => scrollCarousel(-1)} 
                className="p-1.5 bg-white/5 hover:bg-white/20 rounded backdrop-blur transition-colors cursor-pointer border-0"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <button 
                onClick={() => scrollCarousel(1)} 
                className="p-1.5 bg-white/5 hover:bg-white/20 rounded backdrop-blur transition-colors cursor-pointer border-0"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>

          <div 
            ref={carouselScrollRef} 
            className="flex gap-4 overflow-x-auto pb-4 w-full snap-x hide-scroll"
            style={{ scrollbarWidth: 'none' }}
          >
            {activeCar.upgrades.map((upgrade) => (
              <div 
                key={upgrade.id}
                onMouseEnter={() => setHoveredBoost(upgrade.boost)}
                onMouseLeave={() => setHoveredBoost(null)}
                onClick={() => handleAllocate(upgrade)}
                className="group relative flex-shrink-0 w-64 h-36 transform -skew-x-12 bg-black/50 backdrop-blur-md border border-white/10 cursor-pointer overflow-hidden snap-start transition-all duration-300 hover:border-[#bdf522]/50"
              >
                {/* Upgrade Image */}
                <img 
                  src={upgrade.img} 
                  alt={upgrade.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-35 transform skew-x-12 scale-110 group-hover:scale-125 group-hover:opacity-60 transition-all duration-700 mix-blend-luminosity group-hover:mix-blend-normal"
                />
                
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between transform skew-x-12">
                  <span className="self-start text-[8px] font-bold tracking-widest uppercase bg-white text-black px-1.5 py-0.5">
                    {upgrade.type}
                  </span>
                  
                  <div>
                    <h4 className="font-bold text-xs md:text-sm leading-tight italic uppercase text-white drop-shadow-md group-hover:text-[#bdf522] transition-colors">
                      {upgrade.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold tracking-wider text-white">
                        {upgrade.price}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Focus indicator border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#bdf522]/40 transition-colors duration-200 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
