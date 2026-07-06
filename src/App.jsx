import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Building2,
  Compass,
  Cpu,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Layers,
  Target,
  Rocket,
  HeartHandshake,
  Phone,
  Mail,
  Star,
  Award,
  Briefcase,
  Globe,
} from "lucide-react";

/* ----------------------------------------------------------------------
   HOOKS
---------------------------------------------------------------------- */

function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, visible];
}

function useTilt(strength = 8) {
  const ref = useRef(null);

  const onMouseMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${x * strength}deg) rotateX(${
        -y * strength
      }deg) translateZ(4px)`;
    },
    [strength]
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform =
      "perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}

function useCountUp(target, visible, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = null;
    let raf;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [visible, target, duration]);
  return value;
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const h = document.documentElement;
        const scrollTop = h.scrollTop || document.body.scrollTop;
        const scrollHeight = h.scrollHeight - h.clientHeight;
        setProgress(scrollHeight > 0 ? scrollTop / scrollHeight : 0);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

/* ----------------------------------------------------------------------
   SMALL UI PARTS
---------------------------------------------------------------------- */

function Eyebrow({ children }) {
  return (
    <div className="eyebrow">
      <span className="eyebrow-chip" />
      {children}
    </div>
  );
}

function Reveal({ as: Tag = "div", className = "", delay = 0, children }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

function StatNumber({ value, suffix = "", decimals = 0 }) {
  const [ref, visible] = useReveal(0.5);
  const count = useCountUp(value, visible);
  return (
    <span ref={ref} className="stat-number">
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ----------------------------------------------------------------------
   DECORATIVE SVG ART
---------------------------------------------------------------------- */

function HeroArtPrimary() {
  return (
    <svg viewBox="0 0 520 620" className="hero-art-svg" aria-hidden="true">
      <defs>
        <linearGradient id="gGoldA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF8C00" />
          <stop offset="100%" stopColor="#E07000" />
        </linearGradient>
        <radialGradient id="gGlow" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="rgba(255,140,0,0.15)" />
          <stop offset="100%" stopColor="rgba(255,140,0,0)" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="520" height="620" rx="18" fill="#F8F6F0" />
      <rect x="0" y="0" width="520" height="620" rx="18" fill="url(#gGlow)" />
      {/* skyline blocks */}
      <g opacity="0.8">
        <rect x="60" y="330" width="60" height="220" fill="#E8E4DC" stroke="url(#gGoldA)" strokeWidth="1.2" />
        <rect x="130" y="260" width="70" height="290" fill="#EDE9E1" stroke="url(#gGoldA)" strokeWidth="1.2" />
        <rect x="210" y="180" width="90" height="370" fill="#F0ECE4" stroke="url(#gGoldA)" strokeWidth="1.4" />
        <rect x="310" y="240" width="66" height="310" fill="#EDE9E1" stroke="url(#gGoldA)" strokeWidth="1.2" />
        <rect x="386" y="300" width="56" height="250" fill="#E8E4DC" stroke="url(#gGoldA)" strokeWidth="1.2" />
      </g>
      {/* window grid on tall tower */}
      <g stroke="rgba(255,140,0,0.25)" strokeWidth="1">
        {Array.from({ length: 9 }).map((_, r) =>
          Array.from({ length: 4 }).map((_, c) => (
            <rect
              key={`${r}-${c}`}
              x={222 + c * 18}
              y={200 + r * 36}
              width="10"
              height="18"
              fill={ (r + c) % 3 === 0 ? "rgba(255,140,0,0.4)" : "rgba(0,0,0,0.04)"}
            />
          ))
        )}
      </g>
      {/* crane */}
      <g stroke="url(#gGoldA)" strokeWidth="2.2" fill="none" strokeLinecap="round">
        <line x1="150" y1="560" x2="150" y2="120" />
        <line x1="150" y1="130" x2="330" y2="130" />
        <line x1="150" y1="130" x2="90" y2="160" />
        <line x1="150" y1="150" x2="215" y2="185" />
        <line x1="300" y1="130" x2="300" y2="175" />
        <circle cx="150" cy="120" r="4" fill="url(#gGoldA)" />
      </g>
      {/* ascending data line */}
      <polyline
        points="40,560 110,520 175,540 235,470 300,495 365,410 430,440 470,360"
        fill="none"
        stroke="#FF8C00"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="hero-line-draw"
      />
      {Array.from({ length: 8 }).map((_, i) => {
        const pts = [
          [40, 560],[110, 520],[175, 540],[235, 470],
          [300, 495],[365, 410],[430, 440],[470, 360],
        ];
        return (
          <circle key={i} cx={pts[i][0]} cy={pts[i][1]} r="4" fill="#F8F6F0" stroke="#FF8C00" strokeWidth="2" />
        );
      })}
    </svg>
  );
}

function HeroArtSecondary() {
  return (
    <svg viewBox="0 0 360 300" className="hero-art-svg-sm" aria-hidden="true">
      <defs>
        <linearGradient id="gGoldB" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF8C00" />
          <stop offset="100%" stopColor="#CC6600" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="360" height="300" rx="16" fill="#EDE9E1" />
      <circle cx="120" cy="130" r="46" fill="none" stroke="url(#gGoldB)" strokeWidth="2" />
      <circle cx="120" cy="130" r="46" fill="none" stroke="url(#gGoldB)" strokeWidth="2"
        strokeDasharray="290" strokeDashoffset="70" className="hero-ring-draw" />
      <circle cx="120" cy="130" r="18" fill="#F8F6F0" stroke="url(#gGoldB)" strokeWidth="1.5" />
      <g stroke="url(#gGoldB)" strokeWidth="1.6" fill="none">
        <line x1="166" y1="130" x2="230" y2="90" />
        <line x1="166" y1="130" x2="230" y2="170" />
        <line x1="166" y1="112" x2="230" y2="60" />
      </g>
      <circle cx="230" cy="90" r="6" fill="#FF8C00" />
      <circle cx="230" cy="170" r="6" fill="#FF8C00" />
      <circle cx="230" cy="60" r="6" fill="#FF8C00" />
      <text x="30" y="250" fill="#1a1a1a" fontFamily="IBM Plex Mono, monospace" fontSize="11" letterSpacing="2">
        AURELIA / EST.
      </text>
      <text x="30" y="268" fill="rgba(0,0,0,0.4)" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        MULTI-DISCIPLINARY GROUP
      </text>
    </svg>
  );
}

function GalleryArt({ variant }) {
  const palette = {
    tower: { a: "#FF8C00", b: "#CC6600" },
    logistics: { a: "#FF8C00", b: "#CC6600" },
    digital: { a: "#FF8C00", b: "#CC6600" },
  }[variant];

  return (
    <svg viewBox="0 0 400 260" className="gallery-art-svg" aria-hidden="true">
      <defs>
        <linearGradient id={`grad-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette.a} />
          <stop offset="100%" stopColor={palette.b} />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="#F5F2EC" />
      {variant === "tower" && (
        <g>
          <rect x="60" y="70" width="50" height="160" fill="#E8E4DC" stroke={`url(#grad-${variant})`} strokeWidth="1.2" />
          <rect x="120" y="40" width="60" height="190" fill="#EDE9E1" stroke={`url(#grad-${variant})`} strokeWidth="1.4" />
          <rect x="190" y="90" width="46" height="140" fill="#E8E4DC" stroke={`url(#grad-${variant})`} strokeWidth="1.2" />
          <rect x="250" y="60" width="54" height="170" fill="#EDE9E1" stroke={`url(#grad-${variant})`} strokeWidth="1.2" />
          <rect x="316" y="100" width="40" height="130" fill="#E8E4DC" stroke={`url(#grad-${variant})`} strokeWidth="1.2" />
        </g>
      )}
      {variant === "logistics" && (
        <g fill="none" stroke={`url(#grad-${variant})`} strokeWidth="1.6">
          <rect x="50" y="150" width="300" height="70" rx="4" />
          <circle cx="100" cy="222" r="14" />
          <circle cx="300" cy="222" r="14" />
          <path d="M50 150 L90 100 L260 100 L300 150" />
          <line x1="150" y1="150" x2="150" y2="100" />
          <line x1="200" y1="150" x2="200" y2="100" />
          <path d="M40 60 L360 60" strokeDasharray="6 8" opacity="0.5" />
        </g>
      )}
      {variant === "digital" && (
        <g>
          <rect x="70" y="50" width="260" height="150" rx="8" fill="#EDE9E1" stroke={`url(#grad-${variant})`} strokeWidth="1.4" />
          <line x1="70" y1="80" x2="330" y2="80" stroke={`url(#grad-${variant})`} strokeWidth="1" opacity="0.5" />
          <polyline points="90,170 140,130 180,150 230,100 270,120 310,90" fill="none" stroke={`url(#grad-${variant})`} strokeWidth="2" />
          <circle cx="90" cy="65" r="4" fill={palette.a} />
          <circle cx="110" cy="65" r="4" fill={palette.a} opacity="0.6" />
          <circle cx="130" cy="65" r="4" fill={palette.a} opacity="0.3" />
        </g>
      )}
    </svg>
  );
}

/* ----------------------------------------------------------------------
   MAIN APP
---------------------------------------------------------------------- */

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const progress = useScrollProgress();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tiltA = useTilt(8);
  const tiltB = useTilt(8);
  const tiltC = useTilt(8);
  const tiltG1 = useTilt(6);
  const tiltG2 = useTilt(6);
  const tiltG3 = useTilt(6);

  const services = [
    {
      icon: Building2,
      title: "Construction & Development",
      desc: "From ground-up builds to large-scale infrastructure, engineered for durability, precision, and long-term value.",
      tilt: tiltA,
    },
    {
      icon: Compass,
      title: "Strategic Consulting",
      desc: "Data-backed guidance through growth, restructuring, and market expansion for organizations at every stage.",
      tilt: tiltB,
    },
    {
      icon: Cpu,
      title: "Technology & Digital",
      desc: "Custom software, automation, and digital infrastructure designed to scale alongside your ambitions.",
      tilt: tiltC,
    },
  ];

  const projects = [
    {
      variant: "tower",
      title: "Meridian Tower Development",
      desc: "A 32-storey mixed-use commercial tower engineered with sustainable systems and smart building infrastructure.",
      loc: "Victoria Island, Lagos",
      date: "2024 — 2025",
      tilt: tiltG1,
    },
    {
      variant: "logistics",
      title: "Northbridge Logistics Hub",
      desc: "A regional supply-chain and distribution facility built to streamline freight movement across three states.",
      loc: "Lekki Free Zone, Lagos",
      date: "2023 — 2024",
      tilt: tiltG2,
    },
    {
      variant: "digital",
      title: "Vantage Digital Platform",
      desc: "An enterprise SaaS platform unifying operations, analytics, and client management under one dashboard.",
      loc: "Remote / Cloud-native",
      date: "2025",
      tilt: tiltG3,
    },
  ];

  const process = [
    { n: "01", title: "Discovery & Assessment", desc: "We study your goals, constraints, and market to define what success looks like.", icon: Target },
    { n: "02", title: "Strategy & Design", desc: "Every plan is mapped in detail — budgets, timelines, and risk built in from day one.", icon: Layers },
    { n: "03", title: "Execution & Delivery", desc: "Our teams build, implement, and manage with precision and constant communication.", icon: Rocket },
    { n: "04", title: "Support & Optimization", desc: "We stay engaged after delivery, refining performance long after launch.", icon: HeartHandshake },
  ];

  return (
    <div className="ag-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

        :root{
          --white:#faf9f6;
          --off:#f5f2ec;
          --cream:#ede9e1;
          --black:#0a0a0a;
          --charcoal:#1a1a1a;
          --orange:#FF8C00;
          --orange-bright:#FFA333;
          --orange-deep:#CC6600;
          --line:rgba(0,0,0,0.08);
          --line-strong:rgba(0,0,0,0.15);
        }

        *{ box-sizing:border-box; margin:0; padding:0; }
        .ag-root{
          font-family:'Inter', sans-serif;
          background:var(--white);
          color:var(--black);
          overflow-x:hidden;
          -webkit-font-smoothing:antialiased;
        }
        .ag-root h1, .ag-root h2, .ag-root h3, .ag-root .display{
          font-family:'Space Grotesk', sans-serif;
          letter-spacing:-0.02em;
        }
        .mono{ font-family:'IBM Plex Mono', monospace; }

        a{ color:inherit; text-decoration:none; }
        button{ font-family:inherit; cursor:pointer; }

        .progress-thread{
          position:fixed; top:0; left:0; width:3px; height:100vh; z-index:60;
          background:linear-gradient(180deg, var(--orange-bright), var(--orange) 40%, transparent 100%);
          transform-origin:top; pointer-events:none;
        }

        /* NAV */
        .nav{
          position:sticky; top:0; z-index:50;
          display:flex; align-items:center; justify-content:space-between;
          padding:20px 48px;
          background:rgba(250,249,246,0.0);
          transition:all .4s ease;
          border-bottom:1px solid transparent;
        }
        .nav.scrolled{
          background:rgba(250,249,246,0.95);
          backdrop-filter:blur(14px);
          border-bottom:1px solid var(--line);
          padding:14px 48px;
        }
        .nav-logo{ display:flex; align-items:center; gap:10px; }
        .nav-logo-mark{
          width:34px; height:34px; border-radius:8px;
          background:linear-gradient(135deg, var(--orange-bright), var(--orange-deep));
          display:flex; align-items:center; justify-content:center;
          font-family:'Space Grotesk'; font-weight:700; color:#fff; font-size:16px;
        }
        .nav-logo-text{ color:var(--black); font-family:'Space Grotesk'; font-weight:600; font-size:18px; letter-spacing:0.02em; }
        .nav-links{ display:flex; gap:36px; }
        .nav-links a{
          color:rgba(0,0,0,0.65); font-size:14.5px; font-weight:500; position:relative; padding:4px 0;
          transition:color .25s ease;
        }
        .nav-links a::after{
          content:''; position:absolute; left:0; bottom:-2px; width:0; height:1.5px; background:var(--orange);
          transition:width .3s ease;
        }
        .nav-links a:hover{ color:var(--black); }
        .nav-links a:hover::after{ width:100%; }
        .nav-cta{ display:flex; align-items:center; gap:16px; }
        .btn{
          display:inline-flex; align-items:center; gap:8px;
          padding:12px 24px; border-radius:999px; font-size:14px; font-weight:600;
          border:1px solid transparent; transition:all .3s cubic-bezier(.2,.8,.2,1);
          white-space:nowrap;
        }
        .btn-orange{
          background:linear-gradient(135deg, var(--orange-bright), var(--orange));
          color:#fff;
        }
        .btn-orange:hover{ transform:translateY(-2px); box-shadow:0 10px 30px rgba(255,140,0,0.35); }
        .btn-ghost-dark{
          background:transparent; border:1px solid rgba(0,0,0,0.15); color:var(--black);
        }
        .btn-ghost-dark:hover{ border-color:var(--orange); color:var(--orange-deep); }
        .btn-ghost-light{
          background:transparent; border:1px solid rgba(255,255,255,0.25); color:#fff;
        }
        .btn-ghost-light:hover{ border-color:var(--orange-bright); color:var(--orange-bright); }
        .menu-toggle{ display:none; background:none; border:none; color:var(--black); }

        /* HERO */
        .hero{
          background:var(--white); color:var(--black);
          padding:64px 48px 100px;
          position:relative;
        }
        .hero-inner{
          display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center;
          max-width:1360px; margin:0 auto;
        }
        .eyebrow{
          display:inline-flex; align-items:center; gap:10px;
          font-family:'IBM Plex Mono', monospace; font-size:12.5px; letter-spacing:0.12em;
          text-transform:uppercase; color:var(--orange); margin-bottom:20px;
        }
        .eyebrow-chip{ width:8px; height:8px; background:var(--orange); border-radius:2px; display:inline-block; }
        .hero h1{
          font-size:56px; line-height:1.08; font-weight:700; margin:0 0 22px;
        }
        .hero h1 .accent{
          background:linear-gradient(90deg, var(--orange-bright), var(--orange));
          -webkit-background-clip:text; background-clip:text; color:transparent;
        }
        .hero p.lead{
          font-size:17px; line-height:1.7; color:rgba(0,0,0,0.6); max-width:480px; margin-bottom:36px;
        }
        .hero-ctas{ display:flex; gap:14px; margin-bottom:56px; }
        .hero-meta{ display:flex; align-items:center; gap:18px; }
        .hero-avatars{ display:flex; }
        .hero-avatars span{
          width:34px; height:34px; border-radius:50%; border:2px solid var(--white);
          background:linear-gradient(135deg, #ddd, #bbb); margin-left:-10px;
          display:flex; align-items:center; justify-content:center; font-size:11px; color:var(--orange-deep); font-weight:600;
        }
        .hero-avatars span:first-child{ margin-left:0; }
        .hero-meta-text{ font-size:13px; color:rgba(0,0,0,0.5); }
        .hero-meta-text b{ color:var(--black); }

        .hero-visual{ position:relative; height:560px; }
        .hero-art-primary{
          position:absolute; top:0; right:0; width:78%; height:100%;
          border-radius:20px; overflow:hidden; box-shadow:0 30px 80px rgba(0,0,0,0.08);
          border:1px solid var(--line);
        }
        .hero-art-svg{ width:100%; height:100%; display:block; }
        .hero-line-draw{
          stroke-dasharray:900; stroke-dashoffset:900;
          animation:drawLine 2.4s ease forwards 0.4s;
        }
        @keyframes drawLine{ to{ stroke-dashoffset:0; } }
        .hero-ring-draw{ animation:ringSpin 6s linear infinite; transform-origin:120px 130px; }
        @keyframes ringSpin{ to{ transform:rotate(360deg); } }

        .hero-art-secondary{
          position:absolute; bottom:-30px; left:-10px; width:280px;
          border-radius:16px; overflow:hidden; box-shadow:0 25px 60px rgba(0,0,0,0.1);
          border:1px solid var(--line);
        }
        .hero-art-svg-sm{ width:100%; height:100%; display:block; }

        .hero-badge{
          position:absolute; background:rgba(255,255,255,0.95); backdrop-filter:blur(8px);
          border:1px solid var(--line); border-radius:14px; padding:14px 18px;
          display:flex; align-items:center; gap:12px; box-shadow:0 20px 40px rgba(0,0,0,0.06);
        }
        .hero-badge-1{ top:40px; left:-40px; }
        .hero-badge-2{ bottom:60px; right:-20px; }
        .hero-badge-icon{
          width:36px; height:36px; border-radius:10px; background:rgba(255,140,0,0.1);
          display:flex; align-items:center; justify-content:center; color:var(--orange);
        }
        .hero-badge-num{ font-family:'Space Grotesk'; font-weight:700; font-size:18px; color:var(--black); line-height:1.1; }
        .hero-badge-label{ font-size:11.5px; color:rgba(0,0,0,0.5); }

        /* REVEAL */
        .reveal{ opacity:0; transform:translateY(28px); transition:opacity .8s cubic-bezier(.2,.7,.2,1), transform .8s cubic-bezier(.2,.7,.2,1); }
        .reveal-visible{ opacity:1; transform:translateY(0); }

        /* SECTION shared */
        .section{ padding:100px 48px; max-width:1360px; margin:0 auto; }
        .section-head{ display:flex; justify-content:space-between; align-items:flex-end; gap:40px; margin-bottom:56px; }
        .section-head h2{ font-size:38px; font-weight:700; line-height:1.15; max-width:640px; margin:0; }
        .section-head p{ font-size:15px; color:rgba(0,0,0,0.55); max-width:340px; line-height:1.65; }

        /* STATS MOSAIC */
        .stats-wrap{ background:var(--off); }
        .stats-grid{
          display:grid; grid-template-columns:1.4fr 1fr 1fr; grid-template-rows:auto auto; gap:20px;
        }
        .stat-card{
          background:var(--white); color:var(--black); border-radius:18px; padding:32px;
          position:relative; overflow:hidden; transition:transform .4s ease; border:1px solid var(--line);
        }
        .stat-card:hover{ transform:translateY(-6px); box-shadow:0 12px 30px rgba(0,0,0,0.05); }
        .stat-card.dark{ background:var(--black); color:var(--white); border-color:var(--charcoal); }
        .stat-card-main{ grid-row:span 2; background:var(--black); color:var(--white); border-color:var(--charcoal); }
        .stat-brand{ display:flex; align-items:center; gap:10px; font-family:'Space Grotesk'; font-weight:600; font-size:16px; color:var(--orange-bright); }
        .stat-number{ font-family:'Space Grotesk'; font-weight:700; font-size:52px; display:block; margin:24px 0 8px; }
        .stat-card-main .stat-number{ font-size:64px; }
        .stat-desc{ font-size:14px; color:rgba(255,255,255,0.6); line-height:1.6; max-width:260px; }
        .stat-icon-row{ display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
        .stat-icon-box{ width:38px; height:38px; border-radius:10px; background:rgba(255,140,0,0.08); display:flex; align-items:center; justify-content:center; color:var(--orange); }
        .stat-label{ font-size:13px; color:rgba(0,0,0,0.5); margin-top:8px; }
        .stat-card.dark .stat-label{ color:rgba(255,255,255,0.5); }

        /* SERVICES */
        .services-grid{ display:grid; grid-template-columns:repeat(3, 1fr); gap:24px; }
        .service-card{
          background:var(--white); border:1px solid var(--line); border-radius:18px; padding:36px;
          transition:box-shadow .4s ease, border-color .4s ease; will-change:transform;
        }
        .service-card:hover{ box-shadow:0 24px 50px rgba(0,0,0,0.06); border-color:rgba(255,140,0,0.3); }
        .service-icon{
          width:52px; height:52px; border-radius:14px; margin-bottom:26px;
          background:linear-gradient(135deg, var(--off), var(--cream));
          display:flex; align-items:center; justify-content:center; color:var(--orange);
        }
        .service-card h3{ font-size:20px; font-weight:600; margin:0 0 12px; }
        .service-card p{ font-size:14.5px; color:rgba(0,0,0,0.6); line-height:1.7; margin:0 0 20px; }
        .service-link{ display:inline-flex; align-items:center; gap:6px; font-size:14px; font-weight:600; color:var(--orange-deep); }
        .service-link svg{ transition:transform .3s ease; }
        .service-card:hover .service-link svg{ transform:translateX(4px); }

        /* GALLERY */
        .gallery-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
        .gallery-card{ border-radius:18px; overflow:hidden; background:var(--white); border:1px solid var(--line); }
        .gallery-art-wrap{ overflow:hidden; height:200px; }
        .gallery-art-svg{ width:100%; height:100%; display:block; transition:transform .6s ease; }
        .gallery-card:hover .gallery-art-svg{ transform:scale(1.08); }
        .gallery-body{ padding:26px; }
        .gallery-body h3{ font-size:18px; font-weight:600; margin:0 0 10px; }
        .gallery-body p{ font-size:14px; color:rgba(0,0,0,0.6); line-height:1.6; margin:0 0 18px; }
        .gallery-meta{ display:flex; gap:16px; font-size:12.5px; color:rgba(0,0,0,0.5); margin-bottom:16px; }
        .gallery-meta span{ display:flex; align-items:center; gap:6px; }

        /* PROCESS */
        .process-wrap{ background:var(--black); color:var(--white); }
        .process-head{ display:grid; grid-template-columns:1.3fr 1fr; gap:40px; align-items:flex-end; margin-bottom:64px; }
        .process-head h2{ color:var(--white); }
        .process-head p{ color:rgba(255,255,255,0.6); }
        .process-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:0; position:relative; }
        .process-line{
          position:absolute; top:44px; left:0; right:0; height:1px; background:rgba(255,255,255,0.12);
          overflow:hidden;
        }
        .process-line-fill{ height:100%; background:linear-gradient(90deg, var(--orange-bright), var(--orange)); width:0%; transition:width 1.4s cubic-bezier(.2,.7,.2,1); }
        .process-step{ padding:0 24px 0 0; position:relative; }
        .process-num{ font-family:'Space Grotesk'; font-size:44px; font-weight:700; color:rgba(255,255,255,0.14); margin-bottom:18px; }
        .process-icon{
          width:44px; height:44px; border-radius:12px; background:rgba(255,140,0,0.12); color:var(--orange-bright);
          display:flex; align-items:center; justify-content:center; margin-bottom:18px; position:relative; z-index:2;
        }
        .process-step h3{ font-size:17px; font-weight:600; margin:0 0 10px; }
        .process-step p{ font-size:13.5px; color:rgba(255,255,255,0.55); line-height:1.6; margin:0; max-width:240px; }

        /* CTA BANNER */
        .cta-banner{
          margin:0 48px 100px; border-radius:24px; padding:64px;
          background:linear-gradient(120deg, #f8f6f0 0%, #ede9e1 60%, #f5f2ec 100%);
          position:relative; overflow:hidden; color:var(--black);
          display:flex; align-items:center; justify-content:space-between; gap:40px;
          border:1px solid var(--line);
        }
        .cta-banner::after{
          content:''; position:absolute; width:400px; height:400px; border-radius:50%;
          background:radial-gradient(circle, rgba(255,140,0,0.1), transparent 70%);
          top:-160px; right:-100px;
        }
        .cta-banner h2{ font-size:32px; max-width:460px; margin:0 0 8px; position:relative; z-index:1; }
        .cta-banner p{ color:rgba(0,0,0,0.6); max-width:420px; margin:0; position:relative; z-index:1; }
        .cta-actions{ position:relative; z-index:1; display:flex; gap:14px; flex-shrink:0; }

        /* FOOTER */
        .footer{ background:var(--black); color:rgba(255,255,255,0.6); padding:64px 48px 32px; }
        .footer-top{ display:grid; grid-template-columns:1.4fr 1fr 1fr 1fr; gap:40px; margin-bottom:56px; }
        .footer-brand-text{ font-size:13.5px; line-height:1.7; margin-top:16px; max-width:280px; }
        .footer-col h4{ color:var(--white); font-size:13.5px; margin:0 0 18px; letter-spacing:0.04em; text-transform:uppercase; font-family:'IBM Plex Mono', monospace; }
        .footer-col a{ display:block; font-size:14px; margin-bottom:12px; color:rgba(255,255,255,0.6); transition:color .25s ease; }
        .footer-col a:hover{ color:var(--orange-bright); }
        .footer-bottom{ display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.08); padding-top:28px; font-size:12.5px; }

        /* RESPONSIVE */
        @media (max-width:980px){
          .nav-links{ display:none; }
          .menu-toggle{ display:block; }
          .hero-inner{ grid-template-columns:1fr; }
          .hero h1{ font-size:40px; }
          .hero-visual{ height:420px; margin-top:40px; }
          .stats-grid{ grid-template-columns:1fr 1fr; }
          .stat-card-main{ grid-column:span 2; grid-row:auto; }
          .services-grid, .gallery-grid{ grid-template-columns:1fr; }
          .process-grid{ grid-template-columns:1fr 1fr; row-gap:40px; }
          .process-line{ display:none; }
          .process-head{ grid-template-columns:1fr; }
          .cta-banner{ flex-direction:column; align-items:flex-start; padding:40px; margin:0 20px 60px; }
          .footer-top{ grid-template-columns:1fr 1fr; }
          .section{ padding:72px 24px; }
          .hero{ padding:32px 24px 72px; }
          .hero-badge-1{ left:10px; }
          .hero-badge-2{ right:10px; }
        }
        @media (prefers-reduced-motion: reduce){
          .reveal, .hero-line-draw, .hero-ring-draw, .stat-card, .gallery-art-svg{ transition:none !important; animation:none !important; }
        }
      `}</style>

      <div className="progress-thread" style={{ transform: `scaleY(${progress})` }} />

      {/* NAV */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-logo">
          <span className="nav-logo-mark">A</span>
          <span className="nav-logo-text">Aurelia Group</span>
        </div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#projects">Projects</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="nav-cta">
          <a href="#contact" className="btn btn-ghost-dark" style={{ display: menuOpen ? "none" : "inline-flex" }}>
            Log In
          </a>
          <a href="#contact" className="btn btn-orange">
            Request a Quote
          </a>
          <button className="menu-toggle" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-inner">
          <div>
            <Eyebrow>Trusted Multi-Disciplinary Partner</Eyebrow>
            <h1>
              Focused on delivering thoughtful strategy <span className="accent">and flawless execution.</span>
            </h1>
            <p className="lead">
              Aurelia Group brings three decades of combined expertise across construction, consulting,
              and technology — transforming ambitious ideas into measurable results for clients across industries.
            </p>
            <div className="hero-ctas">
              <a href="#contact" className="btn btn-orange">
                Request a Consultation <ArrowRight size={16} />
              </a>
              <a href="#services" className="btn btn-ghost-dark">
                Our Services
              </a>
            </div>
            <div className="hero-meta">
              <div className="hero-avatars">
                <span>JK</span>
                <span>MO</span>
                <span>AT</span>
              </div>
              <div className="hero-meta-text">
                Trusted by <b>120+</b> organizations worldwide
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-art-primary">
              <HeroArtPrimary />
            </div>
            <div className="hero-art-secondary">
              <HeroArtSecondary />
            </div>
            <div className="hero-badge hero-badge-1">
              <div className="hero-badge-icon">
                <ShieldCheck size={18} />
              </div>
              <div>
                <div className="hero-badge-num">18+ Yrs</div>
                <div className="hero-badge-label">Industry Experience</div>
              </div>
            </div>
            <div className="hero-badge hero-badge-2">
              <div className="hero-badge-icon">
                <Users size={18} />
              </div>
              <div>
                <div className="hero-badge-num">240+</div>
                <div className="hero-badge-label">Projects Delivered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT / STATS */}
      <section className="stats-wrap" id="about">
        <div className="section">
          <div className="section-head">
            <Reveal as="h2">Built on Experience. Driven by Quality.</Reveal>
            <Reveal delay={100}>
              <p>
                With nearly two decades in the industry, we bring a hands-on, client-first approach to every
                engagement — blending craftsmanship, strategy, and technology to deliver excellence.
              </p>
            </Reveal>
          </div>

          <div className="stats-grid">
            <Reveal className="stat-card stat-card-main">
              <div className="stat-brand">
                <span className="nav-logo-mark" style={{ width: 30, height: 30, fontSize: 14 }}>A</span>
                Aurelia Group
              </div>
              <div>
                <StatNumber value={240} suffix="+" />
                <div className="stat-desc">
                  Proven track record across construction, consulting, and technology sectors worldwide.
                </div>
              </div>
            </Reveal>

            <Reveal delay={80} className="stat-card">
              <div className="stat-icon-row">
                <div className="stat-icon-box"><Cpu size={18} /></div>
              </div>
              <div className="stat-label">Modern Technology</div>
              <p style={{ fontSize: 13.5, color: "rgba(0,0,0,0.55)", marginTop: 8, lineHeight: 1.6 }}>
                We integrate the latest tools and platforms to ensure faster, smarter delivery.
              </p>
            </Reveal>

            <Reveal delay={140} className="stat-card dark">
              <StatNumber value={98} suffix="%" />
              <div className="stat-label" style={{ color: "rgba(255,255,255,0.6)" }}>Client Retention Rate</div>
            </Reveal>

            <Reveal delay={200} className="stat-card dark">
              <StatNumber value={40} suffix="M+" />
              <div className="stat-label" style={{ color: "rgba(255,255,255,0.6)" }}>Capital Managed ($)</div>
            </Reveal>

            <Reveal delay={260} className="stat-card">
              <div className="stat-icon-row">
                <div className="stat-icon-box"><Users size={18} /></div>
              </div>
              <div className="stat-label">Expert Team</div>
              <p style={{ fontSize: 13.5, color: "rgba(0,0,0,0.55)", marginTop: 8, lineHeight: 1.6 }}>
                Seasoned specialists across every division, bringing decades of hands-on experience.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section" id="services">
        <Reveal as="div">
          <Eyebrow>Our Services</Eyebrow>
        </Reveal>
        <div className="section-head">
          <Reveal as="h2">End-to-End Solutions You Can Rely On.</Reveal>
          <Reveal delay={100}>
            <p>
              From ground-up construction to digital transformation — we offer comprehensive
              solutions tailored to every kind of ambition.
            </p>
          </Reveal>
        </div>

        <div className="services-grid">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 100}>
              <div
                className="service-card"
                ref={s.tilt.ref}
                onMouseMove={s.tilt.onMouseMove}
                onMouseLeave={s.tilt.onMouseLeave}
              >
                <div className="service-icon">
                  <s.icon size={22} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <a href="#contact" className="service-link">
                  Read More <ArrowUpRight size={15} />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PROJECTS / GALLERY */}
      <section className="section" id="projects">
        <Reveal as="div">
          <Eyebrow>Our Projects</Eyebrow>
        </Reveal>
        <div className="section-head">
          <Reveal as="h2">Crafted Solutions, Proven Results.</Reveal>
          <Reveal delay={100}>
            <p>
              We don't just deliver — we build lasting value. Every engagement reflects thoughtful
              planning, expert execution, and measurable impact.
            </p>
          </Reveal>
        </div>

        <div className="gallery-grid">
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
              <div
                className="gallery-card"
                ref={p.tilt.ref}
                onMouseMove={p.tilt.onMouseMove}
                onMouseLeave={p.tilt.onMouseLeave}
              >
                <div className="gallery-art-wrap">
                  <GalleryArt variant={p.variant} />
                </div>
                <div className="gallery-body">
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <div className="gallery-meta">
                    <span><MapPin size={13} /> {p.loc}</span>
                    <span><Calendar size={13} /> {p.date}</span>
                  </div>
                  <a href="#contact" className="service-link">
                    View More <ArrowUpRight size={15} />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300} style={{ textAlign: "center", marginTop: 48 }}>
          <a href="#contact" className="btn btn-ghost-dark">
            Explore All Projects <ChevronRight size={16} />
          </a>
        </Reveal>
      </section>

      {/* PROCESS */}
      <section className="process-wrap" id="process">
        <div className="section">
          <div className="process-head">
            <div>
              <Reveal><Eyebrow>Our Process</Eyebrow></Reveal>
              <Reveal delay={80}><h2>Our 4-Step Process to a Successful Partnership.</h2></Reveal>
            </div>
            <Reveal delay={140}>
              <p>
                We don't just execute — we partner. Every engagement is a reflection of thoughtful
                design, expert planning, and precise delivery.
              </p>
            </Reveal>
          </div>

          <div className="process-grid">
            <ProcessLine />
            {process.map((step, i) => (
              <Reveal key={step.n} delay={i * 120} className="process-step">
                <div className="process-num">{step.n}</div>
                <div className="process-icon">
                  <step.icon size={20} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <Reveal>
        <div className="cta-banner" id="contact">
          <div>
            <h2>Ready to build something exceptional together?</h2>
            <p>Tell us about your project and our team will get back to you within one business day.</p>
          </div>
          <div className="cta-actions">
            <a href="#" className="btn btn-orange">
              Request a Quote <ArrowRight size={16} />
            </a>
            <a href="#" className="btn btn-ghost-dark">
              Contact Us
            </a>
          </div>
        </div>
      </Reveal>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top">
          <div>
            <div className="nav-logo">
              <span className="nav-logo-mark">A</span>
              <span className="nav-logo-text" style={{ color: "#fff" }}>Aurelia Group</span>
            </div>
            <p className="footer-brand-text">
              A multi-disciplinary company delivering construction, consulting, and technology
              solutions engineered for lasting impact.
            </p>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#about">About Us</a>
            <a href="#services">Services</a>
            <a href="#projects">Projects</a>
            <a href="#process">Process</a>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <a href="#services">Construction & Development</a>
            <a href="#services">Strategic Consulting</a>
            <a href="#services">Technology & Digital</a>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a href="#">hello@aureliagroup.com</a>
            <a href="#">+234 (0) 1 234 5678</a>
            <a href="#">Victoria Island, Lagos</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Aurelia Group. All rights reserved.</span>
          <span className="mono">Black · White · Orange</span>
        </div>
      </footer>
    </div>
  );
}

function ProcessLine() {
  const [ref, visible] = useReveal(0.4);
  return (
    <div className="process-line" ref={ref}>
      <div className="process-line-fill" style={{ width: visible ? "100%" : "0%" }} />
    </div>
  );
}