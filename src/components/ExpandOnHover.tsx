import * as React from "react";
import { useState } from "react";

export interface ChassisItem {
  make: string;
  model: string;
  code: string;
  image: string;
}

interface ExpandOnHoverProps {
  items: ChassisItem[];
  onSelect: (item: ChassisItem) => void;
}

export function ExpandOnHover({ items, onSelect }: ExpandOnHoverProps) {
  // Supra MK5 (index 3) is default open (the 4th item in the 7-item list)
  const [expandedIndex, setExpandedIndex] = useState(3);

  // Saved Customizer Styles from user screenshot
  const sectionPadding = 86; // padding bottom (from slider Section Padding: 86px)
  const headerYOffset = 3; // header Y-Offset: 3px
  const headerTopGap = 52; // gap above header: 52px
  const headerBottomGap = 16; // gap below header: 16px
  const cardHeight = 623; // card height: 623px
  const cardGap = 12; // card gap: 12px
  const borderRadius = 9; // corner radius: 9px

  return (
    <div 
      className="w-full flex flex-col items-center justify-center bg-[#0a0a0b] relative"
      style={{
        paddingTop: "0px",
        paddingBottom: `${sectionPadding}px`,
      }}
    >
      {/* Styled Title Header Section with custom JDM Side-label */}
      <div className="w-full max-w-none px-6 md:px-12 transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(${headerYOffset}px)`,
          marginTop: `${headerTopGap}px`,
          marginBottom: `${headerBottomGap}px`,
        }}
      >
        <div className="section-head w-full">
          <div>
            <h2 className="display-l text-[#faf7ed] uppercase font-bold text-3xl md:text-5xl tracking-tight" style={{ color: 'var(--eti-paper)' }}>
              Shop by Vehicle
            </h2>
            <p className="mt-2 text-[9px] uppercase tracking-widest text-neutral-500 font-mono">
              Respecting the past. Engineering the future.
            </p>
          </div>
          <div className="ti-rule"></div>
          <span className="mono uppercase text-[10px] tracking-wider text-right" style={{ color: 'var(--eti-ti-dim)' }}>
            30+ chassis &nbsp;/&nbsp; bespoke fitment
          </span>
        </div>
      </div>

      {/* Hover Cards Container */}
      <div className="w-full max-w-none px-0">
        <div 
          className="flex flex-col md:flex-row w-full items-stretch justify-center"
          style={{ 
            height: `${cardHeight}px`,
            gap: `${cardGap}px`
          }}
        >
          {items.map((item, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className="relative cursor-pointer overflow-hidden transition-all duration-500 ease-out border border-neutral-900 hover:border-[#9cce00]/40 group flex-1 md:flex-none"
                style={{
                  width: "100%", // default for vertical column on mobile
                  flex: isExpanded ? "4 0 0%" : "1 0 0%",
                  borderRadius: `${borderRadius}px`,
                  transition: "all 500ms cubic-bezier(0.25, 0.8, 0.25, 1)",
                }}
                onMouseEnter={() => setExpandedIndex(idx)}
                onClick={() => {
                  if (isExpanded) {
                    onSelect(item);
                  } else {
                    setExpandedIndex(idx);
                  }
                }}
              >
                <img
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={item.image}
                  alt={`${item.make} ${item.model}`}
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent transition-opacity duration-300" />
                
                {/* Glow border line on expanded */}
                <div 
                  className={`absolute inset-0 border border-[#9cce00]/20 transition-opacity duration-300 ${
                    isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  style={{ borderRadius: `${borderRadius}px` }}
                />

                {/* Expanded text content */}
                <div className={`absolute bottom-6 left-6 right-6 transition-all duration-500 text-left ${
                  isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                }`}>
                  <span className="font-mono text-[9px] font-bold text-[#c0f20c] tracking-widest block uppercase">
                    {item.make}
                  </span>
                  <h3 className="font-display font-bold text-white text-xl tracking-wider uppercase mt-1">
                    {item.model}
                  </h3>
                  <span className="font-mono text-[10px] text-neutral-400 tracking-wider block mt-1">
                    {item.code}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[8.5px] font-mono text-[#c0f20c] uppercase tracking-wider mt-4 group-hover:underline">
                    EXPLORE CHASSIS &rarr;
                  </span>
                </div>

                {/* Collapsed vertical title (only on desktop) */}
                <div className={`absolute inset-y-0 right-0 left-0 hidden md:flex items-center justify-center transition-all duration-300 ${
                  isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}>
                  <span 
                    className="font-display font-bold text-[11px] tracking-[0.2em] text-white uppercase select-none pointer-events-none origin-center -rotate-90 whitespace-nowrap"
                    style={{ textShadow: "0 2px 8px rgba(0, 0, 0, 0.95), 0 1px 2px rgba(0, 0, 0, 0.95)" }}
                  >
                    {item.model}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
