import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, Send, Shield, Target, Eye, Users, Trophy, Twitter, Linkedin } from 'lucide-react';
import gsap from 'gsap';
import { Timeline } from './Timeline';
import { AnimatedTestimonials } from './AnimatedTestimonials';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ForzaShowroom from './ForzaShowroom';
import MaterialVisualizer from './MaterialVisualizer';
import GlareCard from './GlareCard';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Milestone {
  year: string;
  title: string;
  desc: string;
}

const milestones: Milestone[] = [
  { year: '1992', title: 'EVOLUTION I', desc: 'The rally legend is born. 247hp. AWD. The foundation.' },
  { year: '1998', title: 'EVOLUTION V', desc: 'The widebody era begins. Adjustable aluminum wing. Active Yaw Control.' },
  { year: '2005', title: 'EVOLUTION IX', desc: 'MIVEC variable valve timing. The ultimate 4G63 platform.' },
  { year: '2024', title: 'ELITE Ti', desc: 'The future of heritage. Dry carbon and titanium restoration program.' },
];

interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  desc: string;
  image: string;
  aspectRatio: string;
  socials: { twitter?: string; linkedin?: string };
}

const teamMembers: TeamMember[] = [
  {
    id: 'nate',
    name: 'NATE',
    role: 'FOUNDER & BUILDER',
    specialty: 'SEMA BUILDER & COMPOSITE SPECIALIST',
    desc: "Before ETi was a company, it was just me wrenching on SEMA builds, FDs, a Supra, and whatever else I could get my hands on. One project turned into five, five turned into a garage full of carbon and titanium parts, and eventually this brand took on a life of its own. I've always cared about clean fitment, real performance, and building things the right way. That mindset shaped ETi from day one. It's been a wild ride going from late-night projects to running a full operation, but I wouldn't trade it for anything. This is the life I always wanted to build.",
    image: '/images/about/nate_updated.jpeg',
    aspectRatio: '3/4',
    socials: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com' }
  },
  {
    id: 'peter',
    name: 'PETER',
    role: 'PRODUCTION MANAGER',
    specialty: 'RACE FABRICATION & AUTOCLAVE COMPOSITES',
    desc: "I've been in the fabrication and motorsports world for a long time, building custom cars, race setups, and composite parts for just about every platform that matters. When Nate and I linked up, the workflow clicked immediately. My role is keeping production tight, making sure every piece is consistent, and making sure the final fit and finish is something we're proud to put our name on. I've seen a lot of shops and builds over the years, and ETi is the kind of project that keeps things exciting.",
    image: '/images/about/peter_updated.jpeg',
    aspectRatio: '1/1',
    socials: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com' }
  },
  {
    id: 'lita',
    name: 'LITA',
    role: 'BRAND VISUALS',
    specialty: 'CREATIVE DIRECTOR & CAMPAIGN LEADER',
    desc: "I take care of the brand's visuals and media. Photos, videos, campaigns, the look and feel of ETi. That's my world. I've always had a good eye for aesthetics, and working with carbon and high-performance builds makes it even more fun. I make sure everything looks clean, sharp, and consistent. Sometimes I'm behind the camera, sometimes in front of it, but always making sure the brand shows up the way it should.",
    image: '/images/about/lita_updated.jpeg',
    aspectRatio: '3/4',
    socials: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com' }
  },
  {
    id: 'aldwin',
    name: 'ALDWIN',
    role: 'SALES & CUSTOMER SUPPORT',
    specialty: 'CLIENT RELATION COORDINATOR',
    desc: "I help handle sales and customer support here at Elite Ti. If you ever have any questions, concerns, need updates on an order, or want to learn more about any of our products, feel free to reach out anytime. I'm always happy to help and do my best to get you the information you need. Whether you're planning a build, looking for a specific part, or just want to bounce around some ideas, don't hesitate to send me a message. Looking forward to helping more fellow enthusiasts along the way!",
    image: '/images/about/aldwin_updated.jpeg',
    aspectRatio: '3/4',
    socials: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com' }
  }
];


// Interactive TechInput component for JDM cockpit HUD styling
interface TechInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const TechInput: React.FC<TechInputProps> = ({ label, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = !!props.value;

  const statusTag = isFocused 
    ? ' [SYS.INPUT]' 
    : hasValue 
      ? ' [SYS.READY]' 
      : ' [SYS.WAIT]';
  const statusColorClass = isFocused 
    ? 'text-[#c0f20c]' 
    : hasValue 
      ? 'text-cyan-400 font-bold' 
      : 'text-neutral-600';

  return (
    <div className="relative w-full space-y-1 group">
      <motion.label 
        initial={false}
        animate={{
          y: isFocused || hasValue ? -22 : 0,
          scale: isFocused || hasValue ? 0.85 : 1,
          color: isFocused ? '#c0f20c' : '#888888'
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="absolute left-3 top-3.5 pointer-events-none font-mono text-[9px] uppercase tracking-widest origin-left flex items-center justify-between w-[92%]"
      >
        <span>{label}</span>
        <span className={`text-[7.5px] tracking-normal font-mono font-bold ${statusColorClass} transition-colors duration-250`}>
          {statusTag}
        </span>
      </motion.label>
      <input
        {...props}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        className="w-full bg-neutral-950/80 border border-neutral-900 focus:border-[#c0f20c]/60 p-4 pt-5 text-sm md:text-base text-white font-mono placeholder-transparent outline-none transition-all duration-300 rounded"
      />
      {/* Laser line effect */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-neutral-900 overflow-hidden rounded-b">
        <motion.div 
          initial={false}
          animate={{
            x: isFocused ? '0%' : '-100%'
          }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="w-full h-full bg-gradient-to-r from-transparent via-[#c0f20c] to-transparent"
        />
      </div>
    </div>
  );
};

// Interactive TechTextarea component
interface TechTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const TechTextarea: React.FC<TechTextareaProps> = ({ label, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = !!props.value;

  const statusTag = isFocused 
    ? ' [SYS.INPUT]' 
    : hasValue 
      ? ' [SYS.READY]' 
      : ' [SYS.WAIT]';
  const statusColorClass = isFocused 
    ? 'text-[#c0f20c]' 
    : hasValue 
      ? 'text-cyan-400 font-bold' 
      : 'text-neutral-600';

  return (
    <div className="relative w-full space-y-1 group">
      <motion.label 
        initial={false}
        animate={{
          y: isFocused || hasValue ? -22 : 0,
          scale: isFocused || hasValue ? 0.85 : 1,
          color: isFocused ? '#c0f20c' : '#888888'
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="absolute left-3 top-3.5 pointer-events-none font-mono text-[9px] uppercase tracking-widest origin-left flex items-center justify-between w-[92%]"
      >
        <span>{label}</span>
        <span className={`text-[7.5px] tracking-normal font-mono font-bold ${statusColorClass} transition-colors duration-250`}>
          {statusTag}
        </span>
      </motion.label>
      <textarea
        {...props}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        className="w-full bg-neutral-950/80 border border-neutral-900 focus:border-[#c0f20c]/60 p-3.5 text-xs text-white font-mono placeholder-transparent outline-none resize-none transition-all duration-300 rounded"
      />
      {/* Laser line effect */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-neutral-900 overflow-hidden rounded-b">
        <motion.div 
          initial={false}
          animate={{
            x: isFocused ? '0%' : '-100%'
          }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="w-full h-full bg-gradient-to-r from-transparent via-[#c0f20c] to-transparent"
        />
      </div>
    </div>
  );
};

// Sponsored Driver Card Component with Telemetry HUD Overlay
interface DriverCardProps {
  name: string;
  image: string;
  bio: string;
  stats: { label: string; val: string }[];
}

const DriverCard: React.FC<DriverCardProps> = ({ name, image, bio, stats }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="driver-card border border-neutral-900 bg-neutral-950 p-5 space-y-4 hover:border-[#c0f20c]/40 transition-all duration-500 rounded relative group overflow-hidden flex flex-col justify-between"
    >
      <div className="space-y-4">
        {/* Image Container with Telemetry Overlay */}
        <div className="h-64 w-full overflow-hidden relative rounded bg-neutral-900 border border-neutral-900 flex items-center justify-center">
          <motion.img 
            src={image} 
            alt={name} 
            animate={{ 
              scale: isHovered ? 1.05 : 1,
              filter: isHovered ? 'grayscale(0%)' : 'grayscale(80%)'
            }}
            transition={{ duration: 0.6 }}
            className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity duration-500" 
          />
          
          {/* Neon border lines */}
          <div className="absolute inset-0 border border-transparent group-hover:border-[#c0f20c]/20 transition-colors duration-500 rounded pointer-events-none" />


        </div>

        {/* Text Area */}
        <div className="space-y-2 text-left">
          <h3 className="font-display font-bold text-white uppercase text-base tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#c0f20c] shrink-0" />
            <span>{name}</span>
          </h3>
          <p className="text-neutral-450 text-[10.5px] leading-relaxed font-sans uppercase tracking-wide">
            {bio}
          </p>
        </div>
      </div>
      
      {/* Subtle carbon bottom line decoration */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#c0f20c]/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 mt-2" />
    </div>
  );
};

const PlatformIcons: Record<string, React.ReactNode> = {
  Youtube: (
    <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  Facebook: (
    <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  Instagram: (
    <svg className="w-3.5 h-3.5 stroke-current fill-none stroke-[2] shrink-0" viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  Tiktok: (
    <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.03 2.61-.01 3.91-.02.08 1.53.63 3.02 1.62 4.2 1.23 1.39 2.97 2.25 4.82 2.45v3.64c-1.8-.07-3.55-.74-4.96-1.88v7.4c.03 2.05-.75 4.12-2.19 5.56-1.74 1.77-4.4 2.45-6.79 1.74-2.58-.73-4.57-2.97-5.06-5.63-.67-3.32 1.34-6.66 4.6-7.58 1.13-.33 2.33-.28 3.43.12v3.7c-.7-.34-1.5-.44-2.27-.26-1.39.29-2.4 1.53-2.46 2.95-.08 1.83 1.56 3.42 3.39 3.34 1.61.02 3.03-1.18 3.19-2.79.02-1.34.01-8.52.01-11.23-.01-1.62-.01-3.23-.01-4.85z" />
    </svg>
  ),
  Threads: (
    <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
      <path d="M22.5 12c0-5.799-4.701-10.5-10.5-10.5S1.5 6.201 1.5 12s4.701 10.5 10.5 10.5c2.476 0 4.747-.859 6.536-2.298l-1.328-1.328A8.618 8.618 0 0 1 12 20.625c-4.757 0-8.625-3.868-8.625-8.625S7.243 3.375 12 3.375s8.625 3.868 8.625 8.625c0 1.258-.225 2.404-.633 3.412-.42 1.037-1.077 1.828-1.921 2.308-.857.488-1.895.735-3.086.735-1.579 0-2.883-.541-3.69-1.528-.809-.988-1.222-2.39-1.222-3.957v-1.94c0-.986-.316-1.748-.948-2.288-.633-.539-1.464-.808-2.493-.808-1.185 0-2.128.411-2.83 1.232-.702.822-1.053 1.93-1.053 3.327 0 1.488.375 2.628 1.125 3.42.75.793 1.761 1.188 3.033 1.188.94 0 1.777-.247 2.508-.742.274-.186.531-.413.771-.68.423.633.992 1.134 1.706 1.504.714.369 1.542.554 2.484.554 1.636 0 3.056-.376 4.26-1.127 1.205-.75 2.148-1.834 2.83-3.253.682-1.419 1.023-3.155 1.023-5.207zm-10.5 2.19c0 .762.164 1.341.492 1.737.328.396.76.594 1.296.594.469 0 .848-.152 1.138-.458.29-.305.435-.769.435-1.39v-1.884c0-.756-.16-1.328-.48-1.716-.32-.388-.748-.582-1.284-.582-.464 0-.841.157-1.131.472-.29.315-.436.782-.436 1.402v1.827z" />
    </svg>
  ),
  Others: (
    <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[2] shrink-0" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  ),
};

interface AboutUsProps {
  triggerToast?: (msg: string) => void;
  onAddToCart?: (product: { id: string; title: string; price: number; category: string }) => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ triggerToast, onAddToCart }) => {
  const toast = triggerToast || ((msg: string) => console.log(msg));
  // Form submission state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);



  const driverTestimonials = [
    {
      name: "ROB DAHM",
      designation: "ROTARY BUILDER / OFF-GRID ENGINEER",
      src: "/images/about/driver_15.jpeg",
      quote: "Rob is a legend in the rotary world and the creator of one of the most extreme RX-7s ever built. His Pikes Peak program is all about pushing boundaries in a way only he can. Working with him lets us test our parts in real abuse conditions and be part of a build that represents pure innovation."
    },
    {
      name: "MAD MIKE WHIDDETT",
      designation: "DRIFT ICON / ROTARY FANATIC",
      src: "/images/about/driver_16.jpeg",
      quote: "Mad Mike needs no introduction. Drift icon, rotary fanatic, and the mind behind some of the wildest RX-7 builds on the planet. We support his Formula Drift program with the same mindset he brings to every car — to go harder than anyone else and make it look effortless."
    },
    {
      name: "JON WONG",
      designation: "JDM BUILDER / PRECISION CULTURE",
      src: "/images/about/driver_17.jpeg",
      quote: "Jon is a high-end builder, enthusiast, and long-time supporter of precision JDM culture. His FD RX-7, MK4 Supra, MR2, and other show cars reflect the exact values we care about — clean work, thoughtful mods, and builds that stand out without trying too hard."
    }
  ];
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    socialLink: '',
    followers: '',
    vehicle: '',
    contentTypes: [] as string[],
    platforms: [] as string[],
    statement: '',
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    '[SYS] CONNECTED TO CORE.ETI_ATELIER',
    '[SYS] READY FOR PILOT BUILD DATA'
  ]);

  // MFD Application Panel — screen tabs
  const [activeScreen, setActiveScreen] = useState<'status' | 'tier' | 'network'>('status');


  // 4. Capture keyboard keypress events to display inside JDM monospace log console
  const handleFormKeyDown = (e: React.KeyboardEvent) => {
    if (e.key.length === 1) { // Alpha-numeric character keys
      const hex = e.key.charCodeAt(0).toString(16).toUpperCase();
      const randAddr = Math.floor(0x7FFF0000 + Math.random() * 0xFFFF).toString(16).toUpperCase();
      const newLog = `[KEYIN: 0x${hex} '${e.key.toUpperCase()}'] REG. ADDR: 0x${randAddr}`;
      setTelemetryLogs(prev => {
        if (prev[0] === newLog) return prev;
        return [newLog, ...prev.slice(0, 4)];
      });
    }
  };

  useEffect(() => {
    const activeFields = [
      formData.firstName && 'NAME',
      formData.email && 'EMAIL',
      formData.vehicle && 'VEHICLE',
      formData.followers && 'AUDIENCE',
      formData.platforms.length > 0 && 'CHANNELS',
      formData.contentTypes.length > 0 && 'CONTENT'
    ].filter(Boolean) as string[];

    if (activeFields.length > 0) {
      const lastField = activeFields[activeFields.length - 1];
      const newLog = `[TELEMETRY] ACQUIRED DATA POINT: ${lastField}`;
      setTelemetryLogs(prev => {
        if (prev[0] === newLog) return prev;
        return [newLog, ...prev.slice(0, 4)];
      });
    }
  }, [formData.firstName, formData.lastName, formData.email, formData.vehicle, formData.followers, formData.platforms, formData.contentTypes]);

  // Application completion metrics
  const totalChars = (
    formData.firstName.length +
    formData.lastName.length +
    formData.email.length +
    formData.socialLink.length +
    formData.followers.length +
    formData.vehicle.length +
    formData.statement.length
  );
  const completedFieldsCount = [
    formData.firstName,
    formData.lastName,
    formData.email,
    formData.socialLink,
    formData.followers,
    formData.vehicle,
    formData.statement
  ].filter(Boolean).length +
  (formData.contentTypes.length > 0 ? 1 : 0) +
  (formData.platforms.length > 0 ? 1 : 0);
  const progressPercent = Math.round((completedFieldsCount / 9) * 100);

  // Collab tier calculation from follower count
  const followerCount = parseInt(formData.followers.replace(/[^0-9]/g, '')) || 0;
  const collabTier = followerCount >= 200000 ? 'ELITE' : followerCount >= 50000 ? 'PARTNER' : followerCount >= 10000 ? 'CREATOR' : 'AMBASSADOR';
  const tierColors: Record<string, string> = { ELITE: '#c0f20c', PARTNER: '#00f0ff', CREATOR: '#ff6b35', AMBASSADOR: '#a78bfa' };
  const tierDiscounts: Record<string, string> = { ELITE: '40%', PARTNER: '30%', CREATOR: '20%', AMBASSADOR: '15%' };
  const tierThresholds: Record<string, number> = { AMBASSADOR: 0, CREATOR: 10000, PARTNER: 50000, ELITE: 200000 };
  const tierOrder = ['AMBASSADOR', 'CREATOR', 'PARTNER', 'ELITE'];
  const tierIdx = tierOrder.indexOf(collabTier);
  const nextTier = tierOrder[tierIdx + 1];
  const nextThreshold = nextTier ? tierThresholds[nextTier] : null;
  const tierProgress = nextThreshold ? Math.min(100, (followerCount / nextThreshold) * 100) : 100;
  const tierColor = tierColors[collabTier];

  const driversSectionRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);
  const teamSectionRef = useRef<HTMLDivElement>(null);
  const teamMemberRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const teamPhotoRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // GSAP scroll trigger for driver cards
    const drivers = driversSectionRef.current?.querySelectorAll('.driver-card');
    if (drivers && drivers.length > 0) {
      gsap.fromTo(drivers, 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.15, 
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: driversSectionRef.current,
            start: 'top 80%',
          }
        }
      );
    }

    // GSAP scroll trigger for form container
    if (formSectionRef.current) {
      gsap.fromTo(formSectionRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: formSectionRef.current,
            start: 'top 85%',
          }
        }
      );
    }

    // ScrollTrigger: each team member row reveals individually on scroll
    teamMemberRowRefs.current.forEach((row) => {
      if (!row) return;
      gsap.fromTo(
        row,
        { opacity: 0, y: 28, filter: 'blur(4px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: row,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // ScrollTrigger: subtle parallax shift on each photo column
    teamPhotoRefs.current.forEach((photo) => {
      if (!photo) return;
      gsap.fromTo(
        photo,
        { y: 24 },
        {
          y: -24,
          ease: 'none',
          scrollTrigger: {
            trigger: photo,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const handleContentTypeToggle = (type: string) => {
    setFormData(prev => {
      const active = prev.contentTypes.includes(type)
        ? prev.contentTypes.filter(t => t !== type)
        : [...prev.contentTypes, type];
      return { ...prev, contentTypes: active };
    });
  };

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => {
      const active = prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform];
      return { ...prev, platforms: active };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitProgress(0);

    const interval = setInterval(() => {
      setSubmitProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsSubmitting(false);
            setFormSubmitted(true);
          }, 400);
          return 100;
        }
        return prev + 5;
      });
    }, 80);
  };

  return (
    <div className="eti-page bg-[#0a0a0b] text-[#fafaf7] min-h-[85vh] overflow-x-hidden">
      
      {/* 1. HERO TITLE BLOCK & INTRO */}
      <section className="relative w-full h-[60vh] min-h-[500px] max-h-[700px] overflow-hidden flex items-end justify-start border-b border-neutral-900">
        {/* Real photo background with premium look */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img 
            src="/images/about/571358377_10161486980150684_4356990159724431223_n.jpg" 
            alt="Elite Ti Atelier" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/50 to-transparent" />
        </div>

        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12 relative z-20 pb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold uppercase tracking-[0.2em] text-white italic drop-shadow-lg mb-4">
            ABOUT US
          </h1>

          <div className="max-w-3xl">
            <p className="text-white text-xs md:text-sm leading-relaxed font-display uppercase tracking-wider font-bold drop-shadow-md">
              Elite Ti started with a simple goal: build parts we would trust on our own cars. 
              What began in a small garage has evolved into a global brand known for uncompromising 
              carbon fiber and titanium craftsmanship. Founded by a Marine veteran and lifelong automotive 
              enthusiast, Elite Ti blends discipline, engineering, and artistry to push the limits of performance and design.
              We specialize in custom carbon fiber and titanium upgrades for JDM, time attack, and 
              high-performance builds. From concept to final fitment, every piece is designed with one 
              mindset: make it lighter, make it stronger, make it perfect.
            </p>
          </div>
        </div>
      </section>

      {/* 2. CORE PHILOSOPHY, MISSION, & VISION */}
      <Timeline
        heading={
          <div className="max-w-7xl mx-auto py-20 px-6 md:px-8 lg:px-10 text-center md:text-left">
            <span className="font-mono text-[9px] text-[#c0f20c] tracking-[0.25em] uppercase font-bold block mb-3">CORE VALUES</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-[0.2em] text-white">
              THE ETI <span className="text-[#c0f20c]">PROTOCOL</span>
            </h2>
            <p className="text-neutral-500 font-mono text-[9px] tracking-widest uppercase mt-2">
              Respecting the past. Engineering the future.
            </p>
          </div>
        }
        data={[
          {
            title: "PHILOSOPHY",
            content: (
              <div className="border border-neutral-900 bg-neutral-950/60 hover:border-[#c0f20c]/30 transition-all duration-300 relative group flex flex-col overflow-hidden rounded max-w-3xl">
                <div className="absolute top-0 left-0 w-[2.5px] h-0 bg-[#c0f20c] group-hover:h-full transition-all duration-300 z-20" />
                <div className="h-72 w-full relative overflow-hidden bg-neutral-900 border-b border-neutral-900">
                  <img
                    src="/images/about/Gemini_Generated_Image_4luxtr4luxtr4lux.png"
                    alt="Philosophy"
                    className="w-full h-full object-cover opacity-85 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent" />
                  <div className="absolute top-3 left-3 font-mono text-[8px] text-neutral-500 uppercase tracking-widest pointer-events-none select-none">
                    LOC // PHI_VAL.01
                  </div>
                </div>
                <div className="p-8 space-y-5 text-left flex-grow">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#c0f20c]" />
                    <h3 className="font-display font-bold uppercase text-white tracking-widest text-sm">OUR PHILOSOPHY</h3>
                  </div>
                  <p className="text-neutral-300 text-sm leading-relaxed font-sans tracking-wide">
                    Every weave, curve, and bolt we create reflects our pursuit of functional beauty.
                    Performance parts should not only look right but fit right, feel right, and perform under pressure.
                    We work closely with fabricators, tuners, and sponsored drivers who share the same passion.
                    Their input drives our innovation and keeps our standards relentless.
                  </p>
                </div>
              </div>
            ),
          },
          {
            title: "MISSION",
            content: (
              <div className="border border-neutral-900 bg-neutral-950/60 hover:border-[#c0f20c]/30 transition-all duration-300 relative group flex flex-col overflow-hidden rounded max-w-3xl">
                <div className="absolute top-0 left-0 w-[2.5px] h-0 bg-[#c0f20c] group-hover:h-full transition-all duration-300 z-20" />
                <div className="h-72 w-full relative overflow-hidden bg-neutral-900 border-b border-neutral-900">
                  <img
                    src="/images/about/9_a3293c81-c0e9-4567-8f49-a269000daba6.png"
                    alt="Mission"
                    className="w-full h-full object-cover opacity-85 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent" />
                  <div className="absolute top-3 left-3 font-mono text-[8px] text-neutral-500 uppercase tracking-widest pointer-events-none select-none">
                    LOC // MSN_VAL.02
                  </div>
                </div>
                <div className="p-8 space-y-5 text-left flex-grow">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-[#c0f20c]" />
                    <h3 className="font-display font-bold uppercase text-white tracking-widest text-sm">OUR MISSION</h3>
                  </div>
                  <p className="text-neutral-300 text-sm leading-relaxed font-sans tracking-wide">
                    To deliver personalized, high-quality performance components through expert craftsmanship and
                    advanced technology. Every customer should experience exceptional fitment, function, and finish.
                  </p>
                </div>
              </div>
            ),
          },
          {
            title: "VISION",
            content: (
              <div className="border border-neutral-900 bg-neutral-950/60 hover:border-[#c0f20c]/30 transition-all duration-300 relative group flex flex-col overflow-hidden rounded max-w-3xl">
                <div className="absolute top-0 left-0 w-[2.5px] h-0 bg-[#c0f20c] group-hover:h-full transition-all duration-300 z-20" />
                <div className="h-72 w-full relative overflow-hidden bg-neutral-900 border-b border-neutral-900">
                  <img
                    src="/images/about/19_0f5095c1-3a32-4745-97ba-2f9ccd979a70.png"
                    alt="Vision"
                    className="w-full h-full object-cover opacity-85 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent" />
                  <div className="absolute top-3 left-3 font-mono text-[8px] text-neutral-500 uppercase tracking-widest pointer-events-none select-none">
                    LOC // VSN_VAL.03
                  </div>
                </div>
                <div className="p-8 space-y-5 text-left flex-grow">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-[#c0f20c]" />
                    <h3 className="font-display font-bold uppercase text-white tracking-widest text-sm">OUR VISION</h3>
                  </div>
                  <p className="text-neutral-300 text-sm leading-relaxed font-sans tracking-wide">
                    To lead the global stage in custom automotive design by staying true to innovation, precision,
                    and individuality. We don't follow trends. We create them.
                  </p>
                </div>
              </div>
            ),
          },
        ]}
      />


      {/* 4. MEET THE CREW (OUR TEAM SHOWCASE - Staggered Grid & List Layout) */}
      <section className="py-24 border-b border-neutral-900 bg-[#080809] overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          
          <div className="text-center mb-20 space-y-2">
            <span className="font-mono text-[9px] text-[#c0f20c] tracking-[0.25em] uppercase font-bold">ATELIER CORE</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-wider text-white">TEAM SHOWCASE</h2>
            <p className="text-neutral-500 font-mono text-[10px] uppercase max-w-xl mx-auto">
              A staggering photo grid paired with an interactive crew roster. Hover coordinates to reveal details.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: 2-Column Staggered Photo Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                
                {/* Column 1 — parallax wrapper ref [0] */}
                <div
                  ref={el => { teamPhotoRefs.current[0] = el; }}
                  className="flex flex-col gap-4 md:gap-6"
                >
                  {/* Nate */}
                  <div 
                    onMouseEnter={() => setActiveMemberId('nate')}
                    onMouseLeave={() => setActiveMemberId(null)}
                    className={`relative overflow-hidden rounded-2xl cursor-pointer border-2 transition-all duration-500 ${
                      activeMemberId === 'nate' 
                        ? 'border-[#c0f20c] scale-[1.02] shadow-[0_0_20px_rgba(192,242,12,0.2)]' 
                        : 'border-transparent'
                    }`}
                  >
                    <img src={teamMembers[0].image} alt={teamMembers[0].name} className="w-full h-auto object-cover rounded-2xl" style={{ aspectRatio: '3/4' }} />
                    <div className={`absolute inset-0 bg-black transition-opacity duration-500 pointer-events-none ${activeMemberId === 'nate' ? 'opacity-0' : 'opacity-40'}`} />
                  </div>
                  {/* Peter */}
                  <div 
                    onMouseEnter={() => setActiveMemberId('peter')}
                    onMouseLeave={() => setActiveMemberId(null)}
                    className={`relative overflow-hidden rounded-2xl cursor-pointer border-2 transition-all duration-500 ${
                      activeMemberId === 'peter' 
                        ? 'border-[#c0f20c] scale-[1.02] shadow-[0_0_20px_rgba(192,242,12,0.2)]' 
                        : 'border-transparent'
                    }`}
                  >
                    <img src={teamMembers[1].image} alt={teamMembers[1].name} className="w-full h-auto object-cover rounded-2xl" style={{ aspectRatio: '1/1' }} />
                    <div className={`absolute inset-0 bg-black transition-opacity duration-500 pointer-events-none ${activeMemberId === 'peter' ? 'opacity-0' : 'opacity-40'}`} />
                  </div>
                </div>

                {/* Column 2 — parallax wrapper ref [1] */}
                <div
                  ref={el => { teamPhotoRefs.current[1] = el; }}
                  className="flex flex-col gap-4 md:gap-6 mt-8 md:mt-12"
                >
                  {/* Lita */}
                  <div 
                    onMouseEnter={() => setActiveMemberId('lita')}
                    onMouseLeave={() => setActiveMemberId(null)}
                    className={`relative overflow-hidden rounded-2xl cursor-pointer border-2 transition-all duration-500 ${
                      activeMemberId === 'lita' 
                        ? 'border-[#c0f20c] scale-[1.02] shadow-[0_0_20px_rgba(192,242,12,0.2)]' 
                        : 'border-transparent'
                    }`}
                  >
                    <img src={teamMembers[2].image} alt={teamMembers[2].name} className="w-full h-auto object-cover rounded-2xl" style={{ aspectRatio: '3/4' }} />
                    <div className={`absolute inset-0 bg-black transition-opacity duration-500 pointer-events-none ${activeMemberId === 'lita' ? 'opacity-0' : 'opacity-40'}`} />
                  </div>
                  {/* Aldwin */}
                  <div 
                    onMouseEnter={() => setActiveMemberId('aldwin')}
                    onMouseLeave={() => setActiveMemberId(null)}
                    className={`relative overflow-hidden rounded-2xl cursor-pointer border-2 transition-all duration-500 ${
                      activeMemberId === 'aldwin' 
                        ? 'border-[#c0f20c] scale-[1.02] shadow-[0_0_20px_rgba(192,242,12,0.2)]' 
                        : 'border-transparent'
                    }`}
                  >
                    {teamMembers[3] && (
                      <>
                        <img src={teamMembers[3].image} alt={teamMembers[3].name} className="w-full h-auto object-cover rounded-2xl" style={{ aspectRatio: '3/4' }} />
                        <div className={`absolute inset-0 bg-black transition-opacity duration-500 pointer-events-none ${activeMemberId === 'aldwin' ? 'opacity-0' : 'opacity-40'}`} />
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Interactive Member List */}
            <div className="lg:col-span-1 text-left space-y-6">
              <div className="space-y-4">
                {teamMembers.map((member, idx) => {
                  const isActive = activeMemberId === member.id;
                  return (
                      <div
                        key={member.id}
                        ref={el => { teamMemberRowRefs.current[idx] = el; }}
                        onMouseEnter={() => setActiveMemberId(member.id)}
                        onMouseLeave={() => setActiveMemberId(null)}
                        onClick={() => setActiveMemberId(isActive ? null : member.id)}
                        className={`flex flex-col border-b border-neutral-900 pb-4 cursor-pointer transition-all duration-300 group ${isActive ? 'bg-white/5 p-4 rounded-xl border-transparent' : 'p-2 mt-2'}`}
                        style={{ opacity: 0 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* Status/Active Bullet */}
                            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shrink-0 ${
                              isActive 
                                ? 'bg-[#c0f20c] shadow-[0_0_8px_rgba(192,242,12,0.8)] scale-110' 
                                : 'bg-neutral-800 group-hover:bg-neutral-600'
                            }`} />
                            
                            {/* Member Details */}
                            <div className="space-y-1">
                              <h4 className={`font-display font-bold text-base md:text-lg tracking-wider uppercase transition-colors duration-300 ${
                                isActive ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'
                              }`}>
                                {member.name}
                              </h4>
                              <p className={`font-mono text-[9px] uppercase tracking-widest transition-colors duration-300 ${
                                isActive ? 'text-[#c0f20c] font-bold' : 'text-neutral-600'
                              }`}>
                                {member.role}
                              </p>
                            </div>
                          </div>

                          {/* Socials & Chevron */}
                          <div className="flex items-center gap-3">
                            <div className={`flex items-center gap-2 transition-all duration-300 shrink-0 ${
                              isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3 pointer-events-none'
                            }`}>
                              {member.socials.twitter && (
                                <a href={member.socials.twitter} target="_blank" rel="noreferrer" className="w-7 h-7 rounded border border-neutral-800 flex items-center justify-center text-neutral-400 hover:border-[#c0f20c] hover:text-[#c0f20c] transition-colors">
                                  <Twitter className="w-3 h-3" />
                                </a>
                              )}
                              {member.socials.linkedin && (
                                <a href={member.socials.linkedin} target="_blank" rel="noreferrer" className="w-7 h-7 rounded border border-neutral-800 flex items-center justify-center text-neutral-400 hover:border-[#c0f20c] hover:text-[#c0f20c] transition-colors">
                                  <Linkedin className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                            {/* Chevron Icon */}
                            <div className={`text-neutral-600 transition-transform duration-300 transform ${isActive ? 'rotate-180 text-white' : 'group-hover:text-white'}`}>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className="overflow-hidden pl-7 pr-2"
                            >
                              <div className="w-10 h-[1px] bg-neutral-800 my-4" />
                              <p className="text-neutral-400 font-display italic font-bold uppercase text-[11px] md:text-xs leading-relaxed md:leading-loose tracking-widest pb-4">
                                {member.desc}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. SPONSORED DRIVERS */}
      <section ref={driversSectionRef} className="py-24 border-b border-neutral-900 bg-[#0a0a0b] relative overflow-hidden">
        {/* Tech Grid Background Lines */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 30px, #fff 30px, #fff 31px), repeating-linear-gradient(90deg, transparent, transparent 30px, #fff 30px, #fff 31px)' }} />
        </div>
        
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <span className="font-mono text-[9px] text-[#c0f20c] tracking-[0.25em] uppercase font-bold block">
              SPONSORED DRIVERS
            </span>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-display font-bold uppercase tracking-wider text-white max-w-2xl mx-auto leading-snug">
              Our sponsored drivers represent the best in JDM, drift, and time attack culture.
            </h2>
            <p className="text-neutral-400 font-sans text-sm max-w-xl mx-auto leading-relaxed">
              They test, push, and prove the quality of every Elite Ti product.
            </p>
          </div>

          <div className="mt-8 border border-neutral-900 bg-[#0a0a0b] rounded-3xl p-2 md:p-6 relative overflow-hidden">
            <AnimatedTestimonials testimonials={driverTestimonials} autoplay={false} />
          </div>

          <p className="text-center font-sans text-sm text-neutral-400 mt-16 leading-relaxed max-w-xl mx-auto">
            Every partnership reflects our dedication to performance, craftsmanship, and authenticity.
          </p>
        </div>
      </section>

      {/* 6. SPONSORSHIP FORM */}
      <section ref={formSectionRef} className="py-24 bg-[#080809] relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 30px, #fff 30px, #fff 31px), repeating-linear-gradient(90deg, transparent, transparent 30px, #fff 30px, #fff 31px)' }} />
        </div>

        <div className="max-w-[1100px] mx-auto px-6 relative z-10">
          <div className="text-center mb-16 space-y-3">
            <span className="font-mono text-[9px] text-[#c0f20c] tracking-[0.25em] uppercase font-bold block">COLLABORATION PROGRAM</span>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-display font-bold uppercase tracking-wider text-white leading-tight">
              ELITE TI SPONSORSHIP / COLLABORATION FORM
            </h2>
            <p className="text-neutral-400 text-[10.5px] max-w-2xl mx-auto leading-relaxed uppercase tracking-wider font-mono">
              WE'RE EXCITED TO WORK WITH PASSIONATE CREATORS, RACERS, AND BUILDERS WHO LIVE AND BREATHE CAR CULTURE. IF YOU'VE GOT A STRONG FAN BASE AND WANT TO REP ELITE TI, FILL OUT THIS FORM TO GET A 30% DISCOUNT AS PART OF OUR COLLAB PROGRAM.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isSubmitting ? (
              <motion.div 
                key="submitting"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="border border-neutral-900 bg-neutral-950 p-8 md:p-12 text-center space-y-6 relative overflow-hidden rounded"
              >
                <div className="absolute top-0 left-0 w-full h-[2.5px] bg-[#c0f20c]" />
                
                <div className="space-y-4">
                  <span className="font-mono text-[9px] text-[#c0f20c] tracking-[0.25em] uppercase font-bold block animate-pulse">TRANSMITTING TELEMETRY DATA</span>
                  
                  <div className="relative w-full h-2 bg-neutral-900 border border-neutral-850 rounded overflow-hidden">
                    <motion.div 
                      className="h-full bg-[#c0f20c] rounded"
                      animate={{ width: `${submitProgress}%` }}
                      transition={{ ease: 'easeOut' }}
                    />
                  </div>

                  <div className="flex justify-between font-mono text-[9px] text-neutral-600">
                    <span>PACKETS: {Math.round(submitProgress * 2.4)}/240</span>
                    <span>{submitProgress}% COMPLETE</span>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest leading-relaxed max-w-sm mx-auto">
                  Uploading build specs, verifying social credentials, and generating allocation hash key...
                </div>
              </motion.div>
            ) : formSubmitted ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="border border-[#c0f20c]/40 bg-neutral-950/90 p-8 md:p-12 text-center space-y-6 relative overflow-hidden rounded max-w-md mx-auto"
              >
                {/* Burnt Titanium Accent Line */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#3d2a4f] via-[#2a4f6b] via-[#6b4f8a] via-[#b89254] to-[#c66a3a]" />
                
                <div className="w-14 h-14 bg-[#c0f20c]/10 border border-[#c0f20c]/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(192,242,12,0.15)]">
                  <Check className="w-7 h-7 text-[#c0f20c]" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-display font-bold text-white text-xl uppercase tracking-wider">COLLAB CONTRACT ISSUED</h3>
                  <p className="text-neutral-450 text-[11px] leading-relaxed max-w-sm mx-auto font-sans">
                    ALLOCATION REF: <span className="text-white font-mono font-bold tracking-wider">#ETI-{(Math.random() * 1000000).toFixed(0)}</span>
                    <br />
                    YOUR BUILD PROFILE HAS BEEN TRANSMITTED TO THE SPONSORED ALLOCATIONS TEAM. A RESPONSE WILL BE SENT TO <span className="text-[#c0f20c] font-mono font-bold">{formData.email.toUpperCase()}</span> WITHIN 72 HOURS.
                  </p>
                </div>

                {/* Decorative ticket notch borders */}
                <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#080809] border-r border-neutral-900 rounded-full -translate-y-1/2" />
                <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#080809] border-l border-neutral-900 rounded-full -translate-y-1/2" />

                <div className="border-t border-dashed border-neutral-850 pt-6">
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        socialLink: '',
                        followers: '',
                        vehicle: '',
                        contentTypes: [],
                        platforms: [],
                        statement: '',
                      });
                    }}
                    className="font-mono text-[9px] text-[#c0f20c] hover:underline uppercase tracking-widest cursor-pointer font-bold"
                  >
                    &larr; SUBMIT ANOTHER APPLICATION
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                {/* Form column */}
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit} 
                  onKeyDown={handleFormKeyDown}
                  className="lg:col-span-2 border border-neutral-900 bg-neutral-950/80 p-6 md:p-8 space-y-6 text-left relative rounded shadow-[0_0_30px_rgba(192,242,12,0.02)]"
                >
                  {/* Neon vertical corner lines */}
                  <div className="absolute top-0 left-0 w-[1px] h-6 bg-[#c0f20c]" />
                  <div className="absolute top-0 left-0 w-6 h-[1px] bg-[#c0f20c]" />
                  <div className="absolute bottom-0 right-0 w-[1px] h-6 bg-[#c0f20c]" />
                  <div className="absolute bottom-0 right-0 w-6 h-[1px] bg-[#c0f20c]" />

                  {/* Row 1: Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TechInput 
                      label="FIRST NAME [VAL: STRING]"
                      type="text" 
                      required 
                      value={formData.firstName}
                      onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                      onFocus={() => setFocusedField('firstName')}
                      onBlur={() => setFocusedField(null)}
                    />
                    <TechInput 
                      label="LAST NAME [VAL: STRING]"
                      type="text" 
                      required 
                      value={formData.lastName}
                      onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>

                  {/* Row 2: Email & Social */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TechInput 
                      label="EMAIL ADDRESS [NET: SMTP]*"
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                    />
                    <TechInput 
                      label="SOCIAL MEDIA LINK [NET: URL]*"
                      type="url" 
                      required 
                      value={formData.socialLink}
                      onChange={e => setFormData({ ...formData, socialLink: e.target.value })}
                      onFocus={() => setFocusedField('socialLink')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>

                  {/* Row 3: Followers & Vehicle */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TechInput 
                      label="TOTAL FOLLOWERS [VAL: INT]*"
                      type="text" 
                      required 
                      value={formData.followers}
                      onChange={e => setFormData({ ...formData, followers: e.target.value })}
                      onFocus={() => setFocusedField('followers')}
                      onBlur={() => setFocusedField(null)}
                    />
                    <TechInput 
                      label="CHASSIS SPEC [VAL: VEHICLE]*"
                      type="text" 
                      required 
                      value={formData.vehicle}
                      onChange={e => setFormData({ ...formData, vehicle: e.target.value })}
                      onFocus={() => setFocusedField('vehicle')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>

                  {/* Content Type Toggles */}
                  <div className="space-y-2">
                    <label className="font-mono text-[9px] text-neutral-500 block uppercase tracking-widest font-bold">WHAT KIND OF CONTENT DO YOU CREATE?</label>
                    <div className="flex flex-wrap gap-2.5">
                      {['Youtube Vlogs', 'Shorts/Reels Video', 'Build and Install', 'Product Reviews', 'Show/Car Meets', 'Others'].map(type => {
                        const isSelected = formData.contentTypes.includes(type);
                        return (
                          <motion.button
                            key={type}
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleContentTypeToggle(type)}
                            className={`relative px-4 py-2.5 text-[9px] font-mono border uppercase tracking-widest transition-all duration-200 cursor-pointer flex items-center gap-2 overflow-hidden rounded ${
                              isSelected 
                                ? 'bg-[#c0f20c] border-[#c0f20c] text-black font-bold shadow-[0_0_15px_rgba(192,242,12,0.25)]' 
                                : 'bg-neutral-900/60 border-neutral-850 text-neutral-400 hover:text-white hover:border-neutral-700'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3px]" />}
                            <span>{type}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Platforms Toggles */}
                  <div className="space-y-2">
                    <label className="font-mono text-[9px] text-neutral-500 block uppercase tracking-widest font-bold">WHERE DO YOU USUALLY POST YOUR CONTENT?*</label>
                    <div className="flex flex-wrap gap-2.5">
                      {['Youtube', 'Facebook', 'Instagram', 'Tiktok', 'Threads', 'Others'].map(platform => {
                        const isSelected = formData.platforms.includes(platform);
                        return (
                          <motion.button
                            key={platform}
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handlePlatformToggle(platform)}
                            className={`relative px-4 py-2.5 text-[9px] font-mono border uppercase tracking-widest transition-all duration-200 cursor-pointer flex items-center gap-2 overflow-hidden rounded ${
                              isSelected 
                                ? 'bg-[#c0f20c] border-[#c0f20c] text-black font-bold shadow-[0_0_15px_rgba(192,242,12,0.25)]' 
                                : 'bg-neutral-900/60 border-neutral-850 text-neutral-400 hover:text-white hover:border-neutral-700'
                            }`}
                          >
                            {PlatformIcons[platform]}
                            <span>{platform}</span>
                            {isSelected && <Check className="w-3 h-3 stroke-[3px]" />}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Textarea */}
                  <div className="space-y-1">
                    <TechTextarea 
                      label="COLLAB COLLATERAL [VAL: TEXT]*"
                      required 
                      rows={4}
                      value={formData.statement}
                      onChange={e => setFormData({ ...formData, statement: e.target.value })}
                      onFocus={() => setFocusedField('statement')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>

                  {/* Submit button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01, boxShadow: '0 0 20px rgba(192,242,12,0.3)' }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-4 bg-[#c0f20c] hover:bg-[#a6d107] text-black font-display font-bold text-xs uppercase tracking-widest transition-all duration-250 cursor-pointer flex items-center justify-center gap-2 rounded"
                  >
                    <Send className="w-3.5 h-3.5" /> SUBMIT APPLICATION
                  </motion.button>

                  {/* hCaptcha placeholder / Terms */}
                  <div className="text-center font-mono text-[7px] text-neutral-600 tracking-wider uppercase pt-2">
                    THIS SITE IS PROTECTED BY HCAPTCHA AND THE HCAPTCHA PRIVACY POLICY AND TERMS OF SERVICE APPLY.
                  </div>
                </motion.form>

                {/* ETi Pilot Application MFD Panel */}
                <div className="lg:col-span-1 border border-neutral-900 bg-[#0b0b0d] rounded-sm overflow-hidden font-mono text-[9px] text-neutral-400 select-none shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] flex flex-col">

                  {/* MFD Header */}
                  <div className="px-4 py-3 border-b border-neutral-900 bg-black/50 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c0f20c] animate-pulse" />
                      <span className="text-[9px] text-neutral-400 uppercase tracking-[0.2em] font-bold">ETi COLLAB SYSTEM</span>
                    </div>
                    <div className="flex border border-neutral-900 rounded-sm bg-neutral-950 p-[1.5px]">
                      {(['status', 'tier', 'network'] as const).map(screen => (
                        <button key={screen} type="button" onClick={() => setActiveScreen(screen)}
                          className={`px-3 py-1.5 text-[8px] font-mono uppercase tracking-widest rounded-sm cursor-pointer transition-all duration-200 ${
                            activeScreen === screen ? 'bg-[#c0f20c] text-black font-bold' : 'text-neutral-500 hover:text-white'
                          }`}>
                          {screen === 'status' ? 'APP' : screen === 'tier' ? 'TIER' : 'NET'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 overflow-y-auto flex-grow space-y-4 flex flex-col">

                  {/* ── SCREEN 1: APPLICATION STATUS ── */}
                  {activeScreen === 'status' && (
                    <div className="space-y-4">
                      {/* Completion ring */}
                      <div className="flex items-center gap-4 border border-neutral-900 bg-black/30 rounded-sm p-3">
                        <div className="relative w-14 h-14 shrink-0">
                          <svg viewBox="0 0 60 60" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="30" cy="30" r="24" fill="none" stroke="#1a1a1e" strokeWidth="5" />
                            <circle cx="30" cy="30" r="24" fill="none" stroke="#c0f20c" strokeWidth="5"
                              strokeLinecap="round" strokeDasharray="150.8"
                              strokeDashoffset={150.8 - (150.8 * progressPercent / 100)}
                              style={{ transition: 'stroke-dashoffset 0.5s ease', filter: 'drop-shadow(0 0 4px #c0f20c)' }} />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[12px] font-bold text-white">{progressPercent}%</span>
                          </div>
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <div className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold">APPLICATION COMPLETION</div>
                          <div className={`text-[10px] font-bold uppercase tracking-wide ${
                            progressPercent === 100 ? 'text-[#c0f20c]' : progressPercent >= 60 ? 'text-amber-400' : 'text-neutral-500'
                          }`}>
                            {progressPercent === 100 ? '✓ READY TO SUBMIT' : progressPercent >= 60 ? '⚠ REVIEW NEEDED' : '○ IN PROGRESS'}
                          </div>
                          <div className="h-1 bg-neutral-900 rounded overflow-hidden">
                            <motion.div className="h-full bg-[#c0f20c] rounded" animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.5 }} />
                          </div>
                          <div className="text-[8px] text-neutral-600 uppercase tracking-widest">{completedFieldsCount}/9 FIELDS VERIFIED</div>
                        </div>
                      </div>

                      {/* Field checklist */}
                      <div className="border border-neutral-900 bg-black/30 rounded-sm overflow-hidden">
                        <div className="px-3 py-2.5 border-b border-neutral-900 text-[9px] text-neutral-400 uppercase tracking-widest font-bold">FIELD VERIFICATION</div>
                        <div className="divide-y divide-neutral-900/40">
                          {([
                            { label: 'FIRST NAME', val: formData.firstName, field: 'firstName' },
                            { label: 'LAST NAME', val: formData.lastName, field: 'lastName' },
                            { label: 'EMAIL ADDRESS', val: formData.email, field: 'email' },
                            { label: 'SOCIAL LINK', val: formData.socialLink, field: 'socialLink' },
                            { label: 'FOLLOWERS', val: formData.followers, field: 'followers' },
                            { label: 'CHASSIS', val: formData.vehicle, field: 'vehicle' },
                            { label: 'PLATFORMS', val: formData.platforms.length > 0 ? `${formData.platforms.length} selected` : '', field: 'platforms' },
                            { label: 'CONTENT TYPES', val: formData.contentTypes.length > 0 ? `${formData.contentTypes.length} selected` : '', field: 'contentTypes' },
                            { label: 'STATEMENT', val: formData.statement, field: 'statement' },
                          ] as { label: string; val: string; field: string }[]).map(({ label, val, field }) => {
                            const filled = !!val;
                            const isActive = focusedField === field;
                            return (
                              <div key={label} className={`flex items-center justify-between px-3 py-2 transition-all duration-200 ${
                                isActive ? 'bg-[#c0f20c]/5 border-l-2 border-[#c0f20c] pl-2' : ''
                              }`}>
                                <span className={`text-[9px] uppercase tracking-wide font-medium ${
                                  isActive ? 'text-[#c0f20c] font-bold' : filled ? 'text-neutral-300' : 'text-neutral-600'
                                }`}>{label}</span>
                                {filled ? (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] text-neutral-500 truncate max-w-[60px]">
                                      {val.substring(0, 10)}{val.length > 10 ? '…' : ''}
                                    </span>
                                    <span className="text-[10px] font-bold text-[#c0f20c]">✓</span>
                                  </div>
                                ) : (
                                  <span className="text-[8px] text-neutral-700 uppercase tracking-wider">PENDING</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Live log */}
                      <div className="border border-neutral-900 bg-black/80 rounded-sm p-2.5 h-12 overflow-hidden flex flex-col justify-end space-y-0.5">
                        {telemetryLogs.map((log, i) => (
                          <div key={i} className={`truncate text-[6.5px] uppercase tracking-wider ${
                            i === 0 ? 'text-[#c0f20c] font-bold' : 'text-neutral-800'
                          }`}>{log}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── SCREEN 2: COLLAB TIER ── */}
                  {activeScreen === 'tier' && (
                    <div className="space-y-4">
                      {/* Tier hero */}
                      <div className="border rounded-sm p-4 text-center space-y-1.5 relative overflow-hidden" style={{ borderColor: `${tierColor}40`, background: `${tierColor}07` }}>
                        <div className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold">DETECTED COLLAB TIER</div>
                        <div className="text-3xl font-bold font-display uppercase tracking-wider" style={{ color: tierColor }}>{collabTier}</div>
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wide">
                          {collabTier === 'AMBASSADOR' ? '0 – 10K' : collabTier === 'CREATOR' ? '10K – 50K' : collabTier === 'PARTNER' ? '50K – 200K' : '200K+'} FOLLOWERS
                        </div>
                        <div className="absolute top-2 right-2 text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm" style={{ background: `${tierColor}20`, color: tierColor, border: `1px solid ${tierColor}40` }}>
                          {tierDiscounts[collabTier]} OFF
                        </div>
                      </div>

                      {/* Tier ladder */}
                      <div className="border border-neutral-900 bg-black/30 rounded-sm overflow-hidden">
                        <div className="px-3 py-2.5 border-b border-neutral-900 text-[9px] text-neutral-400 uppercase tracking-widest font-bold">TIER PROGRESSION</div>
                        <div className="p-3 space-y-2.5">
                          {tierOrder.map((t) => {
                            const isCurrentTier = t === collabTier;
                            const isPastTier = tierOrder.indexOf(t) < tierOrder.indexOf(collabTier);
                            const tc = tierColors[t];
                            return (
                              <div key={t} className="flex items-center gap-2.5">
                                <div className="w-2 h-2 rounded-full shrink-0 transition-all duration-300" style={{
                                  background: isCurrentTier || isPastTier ? tc : '#1e1e22',
                                  boxShadow: isCurrentTier ? `0 0 8px ${tc}` : 'none'
                                }} />
                                <div className="flex-1 flex items-center justify-between">
                                  <span className={`text-[10px] uppercase tracking-wide font-bold ${
                                    isCurrentTier ? '' : isPastTier ? 'text-neutral-600' : 'text-neutral-800'
                                  }`} style={isCurrentTier ? { color: tc } : {}}>{t}</span>
                                  <span className={`text-[8px] ${ isCurrentTier ? 'font-bold' : 'text-neutral-700'}`} style={isCurrentTier ? { color: tc } : {}}>
                                    {tierDiscounts[t]} DISC.
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {nextTier && (
                          <div className="px-3 pb-3 space-y-1.5">
                            <div className="h-1 bg-neutral-900 rounded overflow-hidden">
                              <motion.div className="h-full rounded" animate={{ width: `${tierProgress}%` }} transition={{ duration: 0.5 }} style={{ background: tierColor }} />
                            </div>
                            <div className="flex justify-between text-[8px] text-neutral-600 uppercase tracking-widest">
                              <span>{followerCount.toLocaleString()}</span>
                              <span>→ {nextTier}: {tierThresholds[nextTier].toLocaleString()}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Benefits */}
                      <div className="border border-neutral-900 bg-black/30 rounded-sm overflow-hidden">
                        <div className="px-3 py-2.5 border-b border-neutral-900 text-[9px] text-neutral-400 uppercase tracking-widest font-bold">BENEFITS — {collabTier}</div>
                        <div className="p-3 space-y-2">
                          {[
                            `${tierDiscounts[collabTier]} discount on all ETi products`,
                            ...(collabTier === 'PARTNER' || collabTier === 'ELITE' ? ['Featured social mention on ETi accounts'] : []),
                            ...(collabTier === 'CREATOR' || collabTier === 'PARTNER' || collabTier === 'ELITE' ? ['Early access to new releases'] : []),
                            ...(collabTier === 'ELITE' ? ['Dedicated campaign', 'R&D consultation access'] : []),
                            'Community badge & recognition',
                            'Priority support',
                          ].map((benefit, i) => (
                            <div key={i} className="flex items-start gap-2 text-[9.5px] text-neutral-400">
                              <span className="shrink-0 mt-0.5" style={{ color: tierColor }}>›</span>
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {!formData.followers && (
                        <div className="text-center text-[9px] text-neutral-600 uppercase tracking-widest border border-neutral-900 rounded-sm py-2.5">
                          Enter follower count to calculate your tier
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── SCREEN 3: PLATFORM NETWORK ── */}
                  {activeScreen === 'network' && (
                    <div className="space-y-4">
                      {/* Platform grid */}
                      <div className="border border-neutral-900 bg-black/30 rounded-sm overflow-hidden">
                        <div className="px-3 py-2.5 border-b border-neutral-900 text-[9px] text-neutral-400 uppercase tracking-widest font-bold">
                          PLATFORMS — {formData.platforms.length}/6 ACTIVE
                        </div>
                        <div className="p-3 grid grid-cols-2 gap-1.5">
                          {(['Youtube', 'Instagram', 'Tiktok', 'Facebook', 'Threads', 'Others'] as string[]).map(p => {
                            const isActive = formData.platforms.includes(p);
                            return (
                              <div key={p} className={`flex items-center gap-2 px-2.5 py-2 rounded-sm border transition-all duration-300 ${
                                isActive ? 'border-[#c0f20c]/40 bg-[#c0f20c]/5' : 'border-neutral-900 bg-neutral-950/40'
                              }`}>
                                <div className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300 ${
                                  isActive ? 'bg-[#c0f20c] shadow-[0_0_5px_#c0f20c]' : 'bg-neutral-800'
                                }`} />
                                <span className={`text-[7px] uppercase tracking-widest font-bold ${
                                  isActive ? 'text-white' : 'text-neutral-700'
                                }`}>{p}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Content types */}
                      <div className="border border-neutral-900 bg-black/30 rounded-sm overflow-hidden">
                        <div className="px-3 py-2 border-b border-neutral-900 text-[6.5px] text-neutral-600 uppercase tracking-widest font-bold">
                          CONTENT TYPES — {formData.contentTypes.length} SELECTED
                        </div>
                        <div className="p-3 space-y-1.5">
                          {(['Youtube Vlogs', 'Shorts/Reels Video', 'Build and Install', 'Product Reviews', 'Show/Car Meets', 'Others'] as string[]).map(type => {
                            const isActive = formData.contentTypes.includes(type);
                            return (
                              <div key={type} className="flex items-center justify-between">
                                <span className={`text-[7px] uppercase tracking-wide ${
                                  isActive ? 'text-neutral-300' : 'text-neutral-700'
                                }`}>{type}</span>
                                {isActive
                                  ? <span className="text-[7px] text-[#c0f20c] font-bold">✓ ON</span>
                                  : <span className="text-[6.5px] text-neutral-800 uppercase">—</span>
                                }
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Network score ring */}
                      <div className="border border-neutral-900 bg-black/30 rounded-sm p-3 flex items-center gap-4">
                        <div className="relative w-12 h-12 shrink-0">
                          <svg viewBox="0 0 48 48" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="24" cy="24" r="19" fill="none" stroke="#1a1a1e" strokeWidth="4" />
                            <circle cx="24" cy="24" r="19" fill="none" stroke="#00f0ff" strokeWidth="4"
                              strokeLinecap="round"
                              strokeDasharray="119.4"
                              strokeDashoffset={119.4 - (119.4 * Math.min(100, formData.platforms.length * 16 + formData.contentTypes.length * 8) / 100)}
                              style={{ transition: 'stroke-dashoffset 0.5s ease', filter: 'drop-shadow(0 0 3px #00f0ff)' }} />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[7.5px] font-bold text-cyan-400">
                              {Math.min(100, formData.platforms.length * 16 + formData.contentTypes.length * 8)}%
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="text-[6.5px] text-neutral-600 uppercase tracking-widest font-bold">NETWORK SCORE</div>
                          <div className="text-[9px] font-bold text-white uppercase">
                            {formData.platforms.length === 0 ? 'NO PLATFORMS' :
                              formData.platforms.length <= 2 ? 'FOCUSED' :
                              formData.platforms.length <= 4 ? 'DIVERSE' : 'OMNICHANNEL'}
                          </div>
                          <div className="text-[6px] text-neutral-700 uppercase tracking-widest">COVERAGE PROFILE</div>
                        </div>
                      </div>
                    </div>
                  )}

                    {/* Interactive Collab Pass GlareCard */}
                    <div className="pt-2 mt-auto shrink-0">
                      <GlareCard className="w-full h-[225px] rounded-[24px] border border-neutral-850">
                        <div className="flex flex-col justify-between h-full w-full font-mono text-left relative z-10 select-none">
                          {/* Header info */}
                          <div className="flex justify-between items-start border-b border-neutral-900 pb-2">
                            <div>
                              <div className="text-[10px] font-black italic tracking-wider text-[#c0f20c]">ELITE TI // ATELIER</div>
                              <div className="text-[7px] text-neutral-500 uppercase tracking-widest mt-0.5">PILOT MEMBERSHIP PASS</div>
                            </div>
                            <div className="w-5 h-5 border border-[#c0f20c]/40 rounded-sm flex items-center justify-center text-[7.5px] font-bold text-[#c0f20c] bg-[#c0f20c]/5 shadow-[0_0_8px_rgba(192,242,12,0.1)]">
                              ETi
                            </div>
                          </div>

                          {/* Member details body */}
                          <div className="space-y-2.5 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-[6.5px] text-neutral-600 block uppercase tracking-widest">MEMBER IDENT</span>
                                <span className="text-[9.5px] font-bold text-white uppercase tracking-wider truncate block">
                                  {formData.firstName || formData.lastName 
                                    ? `${formData.firstName} ${formData.lastName}`.trim() 
                                    : 'PENDING IDENT'}
                                </span>
                              </div>
                              <div>
                                <span className="text-[6.5px] text-neutral-600 block uppercase tracking-widest">VEHICLE CLASS</span>
                                <span className="text-[9.5px] font-bold text-neutral-300 uppercase tracking-wider truncate block">
                                  {formData.vehicle || 'PENDING ASSIGN'}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-[6.5px] text-neutral-600 block uppercase tracking-widest">COLLAB TIER</span>
                                <span className="text-[9.5px] font-bold uppercase tracking-wider block" style={{ color: tierColor }}>
                                  {formData.followers ? collabTier : 'PENDING EVAL'}
                                </span>
                              </div>
                              <div>
                                <span className="text-[6.5px] text-neutral-600 block uppercase tracking-widest">NETWORK ACCESS</span>
                                <span className="text-[9.5px] font-bold text-neutral-300 uppercase tracking-wider block">
                                  {formData.platforms.length > 0 ? `${formData.platforms.length} CHANNELS` : 'PENDING'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Footer barcodes */}
                          <div className="flex justify-between items-end border-t border-neutral-900 pt-2.5">
                            <div className="space-y-0.5">
                              <span className="text-[6px] text-neutral-600 block uppercase tracking-widest">PASS SECURE HASH</span>
                              <span className="text-[7.5px] text-neutral-400 font-bold uppercase tracking-wide">
                                #ETI-{formData.lastName ? formData.lastName.substring(0, 4).toUpperCase() : 'PILOT'}-{(Math.floor(totalChars * 99) + 10000)}
                              </span>
                            </div>
                            {/* Fake bar code lines */}
                            <div className="flex gap-[1.5px] h-6 items-end pb-0.5 opacity-60">
                              {[1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2].map((w, idx) => (
                                <div key={idx} className="bg-white h-full" style={{ width: `${w * 0.8}px` }} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </GlareCard>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Hood Material Visualiser removed */}


    </div>
  );
};
