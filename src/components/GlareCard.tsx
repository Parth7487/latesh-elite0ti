import React, { useRef } from 'react';

interface GlareCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlareCard({ children, className = '' }: GlareCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isPointerInside = useRef(false);

  const state = useRef({
    glare: { x: 50, y: 50 },
    background: { x: 50, y: 50 },
    rotate: { x: 0, y: 0 }
  });

  const updateStyles = () => {
    if (ref.current) {
      ref.current.style.setProperty("--mx", `${state.current.glare.x}%`);
      ref.current.style.setProperty("--my", `${state.current.glare.y}%`);
      ref.current.style.setProperty("--r-x", `${state.current.rotate.x}deg`);
      ref.current.style.setProperty("--r-y", `${state.current.rotate.y}deg`);
      ref.current.style.setProperty("--bg-x", `${state.current.background.x}%`);
      ref.current.style.setProperty("--bg-y", `${state.current.background.y}%`);
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;
    
    state.current.glare = { x: px, y: py };
    state.current.background = { x: px, y: py };
    state.current.rotate = {
      x: (py - 50) * 0.12, // subtle tilt x
      y: (px - 50) * -0.12 // subtle tilt y
    };
    updateStyles();
  };

  const handlePointerEnter = () => {
    isPointerInside.current = true;
    if (ref.current) {
      ref.current.style.setProperty("--opacity", "0.65");
      ref.current.style.transition = "none";
    }
  };

  const handlePointerLeave = () => {
    isPointerInside.current = false;
    if (ref.current) {
      ref.current.style.setProperty("--opacity", "0");
      ref.current.style.setProperty("--r-x", "0deg");
      ref.current.style.setProperty("--r-y", "0deg");
      ref.current.style.transition = "transform 0.5s ease, box-shadow 0.5s ease";
    }
  };

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`relative isolate [perspective:800px] [transform-style:preserve-3d] [contain:layout_style] [transition:transform_0.5s_ease,box-shadow_0.5s_ease] [will-change:transform,filter] hover:[transform:rotateX(var(--r-x))_rotateY(var(--r-y))] hover:[box-shadow:0_30px_60px_-15px_rgba(255,255,255,0.1),0_20px_40px_-20px_rgba(0,0,0,0.8),inset_0_-2px_15px_0_rgba(255,255,255,0.15)] border border-neutral-800 rounded-[30px] overflow-hidden ${className}`}
      style={{
        // @ts-ignore
        "--mx": "50%",
        "--my": "50%",
        "--r-x": "0deg",
        "--r-y": "0deg",
        "--bg-x": "50%",
        "--bg-y": "50%",
        "--opacity": "0",
      }}
    >
      {/* Background silver-titanium brushed metal gradient */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundImage: `linear-gradient(135deg, #101114 0%, #2c3035 25%, #59616a 50%, #2c3035 75%, #101114 100%)`,
        }}
      />

      {/* Dynamic reflective titanium sheen that follows mouse */}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-80"
        style={{
          backgroundImage: `radial-gradient(circle at var(--mx) var(--my), rgba(255, 255, 255, 0.45) 0%, rgba(180, 190, 200, 0.15) 30%, transparent 65%)`,
        }}
      />

      {/* Brushed metal grain simulation */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay bg-[repeating-linear-gradient(0deg,#fff,#fff_1px,transparent_1px,transparent_2px)]"
      />

      {/* Glossy highlight line reflection */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-color-dodge transition-opacity duration-500"
        style={{
          backgroundImage: `linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.5) 45%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.5) 55%, transparent 65%)`,
          backgroundPosition: `calc(var(--mx) * 1.5) calc(var(--my) * 1.5)`,
        }}
      />

      {/* Card Content wrapper */}
      <div className="h-full w-full flex flex-col justify-between bg-neutral-950/20 text-white overflow-hidden p-6 relative z-10 [transform-style:preserve-3d]">
        {children}
      </div>

      {/* Iridescent / burned titanium heat reflection overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-50 mix-blend-color-dodge transition-opacity duration-500 [background-image:radial-gradient(circle_at_var(--mx)_var(--my),rgba(255,255,255,0.35)_0%,rgba(147,197,253,0.22)_20%,rgba(167,139,250,0.15)_40%,transparent_75%)] [opacity:var(--opacity)]"
      />
    </div>
  );
}
