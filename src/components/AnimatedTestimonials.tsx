import * as React from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
  stats?: { label: string; val: string }[];
}

interface AnimatedTestimonialsProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
}

export function AnimatedTestimonials({
  testimonials,
  autoplay = false,
}: AnimatedTestimonialsProps) {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-12 font-sans antialiased md:max-w-5xl md:px-8 lg:px-12 bg-[#0a0a0b]">
      <div className="relative grid grid-cols-1 gap-12 md:gap-20 md:grid-cols-2 items-center">
        {/* Left Side: Animated Image Stack */}
        <div className="relative h-96 w-full max-w-md mx-auto">
          <AnimatePresence>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.src}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  z: -100,
                  rotate: randomRotateY(),
                }}
                animate={{
                  opacity: isActive(index) ? 1 : 0.7,
                  scale: isActive(index) ? 1 : 0.95,
                  z: isActive(index) ? 0 : -100,
                  rotate: isActive(index) ? 0 : randomRotateY(),
                  zIndex: isActive(index)
                    ? 40
                    : testimonials.length + 2 - index,
                  y: isActive(index) ? [0, -80, 0] : 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  z: 100,
                  rotate: randomRotateY(),
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
                drag={isActive(index) ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(e, info) => {
                  const threshold = 50; // threshold in pixels
                  if (info.offset.x > threshold) {
                    handlePrev();
                  } else if (info.offset.x < -threshold) {
                    handleNext();
                  }
                }}
                className="absolute inset-0 origin-bottom touch-pan-y"
              >
                <img
                  src={testimonial.src}
                  alt={testimonial.name}
                  draggable={false}
                  className="h-full w-full rounded-3xl object-cover object-center shadow-2xl border border-neutral-900 cursor-grab active:cursor-grabbing"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Right Side: Driver Info & Spec Grid */}
        <div className="flex flex-col justify-between py-4 text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{
                y: 20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -20,
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
            >
              {/* Driver Name */}
              <h3 className="text-2xl font-bold font-display tracking-wide text-white uppercase">
                {testimonials[active].name}
              </h3>
              
              {/* Driver Designation (Discipline) */}
              <p className="text-xs font-mono font-bold text-[#c0f20c] tracking-widest uppercase mt-1">
                {testimonials[active].designation}
              </p>
              
              {/* Bio Description with word reveal effect */}
              <motion.p className="mt-6 text-sm text-neutral-400 font-sans leading-relaxed">
                {testimonials[active].quote.split(" ").map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{
                      filter: "blur(10px)",
                      opacity: 0,
                      y: 5,
                    }}
                    animate={{
                      filter: "blur(0px)",
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      delay: 0.01 * index,
                    }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>

              {/* Driver Specs Grid */}
              {testimonials[active].stats && (
                <div className="mt-8 grid grid-cols-2 gap-4 border-t border-neutral-900 pt-6">
                  {testimonials[active].stats.map((stat, idx) => (
                    <div key={idx} className="space-y-1">
                      <span className="text-[9px] text-neutral-500 font-mono tracking-widest block uppercase">
                        {stat.label}
                      </span>
                      <span className="text-xs text-[#fafaf7] font-mono tracking-wider font-bold block uppercase">
                        {stat.val}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="hidden md:flex gap-4 pt-10">
            <button
              onClick={handlePrev}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-black hover:bg-[#c0f20c] hover:border-transparent transition-all duration-300 cursor-pointer"
              aria-label="Previous driver"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-black hover:bg-[#c0f20c] hover:border-transparent transition-all duration-300 cursor-pointer"
              aria-label="Next driver"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
