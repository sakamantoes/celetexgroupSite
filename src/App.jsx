import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Building2,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Users,
  ShieldCheck,
  Layers,
  Target,
  Rocket,
  HeartHandshake,
  Phone,
  Mail,
  Award,
  Smartphone,
  Download,
  Store,
  ShoppingCart,
  CreditCard,
  Truck,
  BadgeCheck,
  Package,
  MapPin,
} from "lucide-react";
import images from "./assets/image";

/* ----------------------------------------------------------------------
   HOOKS — plain IntersectionObserver + CSS transitions.
---------------------------------------------------------------------- */

function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

function useScrollState() {
  const [y, setY] = useState(0);
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
        setY(scrollTop);
        setProgress(scrollHeight > 0 ? scrollTop / scrollHeight : 0);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { y, progress, scrolled: y > 24 };
}

function usePointerFine() {
  const [isFine, setIsFine] = useState(true);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsFine(mq.matches);
    const listener = (e) => setIsFine(e.matches);
    mq.addEventListener ? mq.addEventListener("change", listener) : mq.addListener(listener);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", listener) : mq.removeListener(listener);
    };
  }, []);
  return isFine;
}

function useTilt(strength = 8, enabled = true) {
  const ref = useRef(null);

  const onMouseMove = useCallback(
    (e) => {
      if (!enabled) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${x * strength}deg) rotateX(${
        -y * strength
      }deg) translateZ(4px)`;
    },
    [strength, enabled],
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
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

/* ----------------------------------------------------------------------
   PRIMITIVES
---------------------------------------------------------------------- */

function Reveal({ as: Tag = "div", className = "", delay = 0, children, ...rest }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function Eyebrow({ children }) {
  return (
    <div className="eyebrow">
      <span className="eyebrow-chip" />
      {children}
    </div>
  );
}

function StatNumber({ value, suffix = "", decimals = 0, delay = 0 }) {
  const [ref, visible] = useReveal(0.5);
  const count = useCountUp(value, visible);
  return (
    <span
      ref={ref}
      className={`stat-number reveal-scale ${visible ? "reveal-scale-visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ----------------------------------------------------------------------
   NAVIGATION
---------------------------------------------------------------------- */

function NavBar({ scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Our Brands", href: "#brands" },
    { label: "Cybermall", href: "#cybermall-app" },
    { label: "Process", href: "#process" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <span className="nav-logo-mark-hover">
              <img src={images.logo01Png} alt="Celetex Group Logo" className="nav-logo-img" />
            </span>
          </div>

          <div className="nav-links-desktop">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </div>

          <div className="nav-cta">
            <a href="#contact" className="btn btn-gold nav-cta-btn">
              Get in Touch <ArrowRight size={16} />
            </a>
            <button
              className="menu-toggle"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu-overlay ${menuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <div className="nav-logo">
            <span className="nav-logo-mark">
              <img src={images.Logo1} alt="Celetex Group Logo" className="w-full h-full object-cover rounded-lg" />
            </span>
            <span className="nav-logo-text">
              Celetex <span>Group</span>
            </span>
          </div>
          <button className="mobile-menu-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={28} />
          </button>
        </div>

        <div className="mobile-menu-body">
          <div className="mobile-menu-links">
            {navLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                className="mobile-menu-link"
                style={{ transitionDelay: menuOpen ? `${80 + index * 60}ms` : "0ms" }}
                onClick={() => setMenuOpen(false)}
              >
                <span className="mobile-menu-link-number">0{index + 1}</span>
                <span className="mobile-menu-link-label">{link.label}</span>
                <ArrowUpRight size={20} className="mobile-menu-link-arrow" />
              </a>
            ))}

            <a
              href="#contact"
              className="mobile-menu-cta"
              style={{ transitionDelay: menuOpen ? `${80 + navLinks.length * 60}ms` : "0ms" }}
              onClick={() => setMenuOpen(false)}
            >
              <span>Get in Touch</span>
              <ArrowRight size={20} />
            </a>
          </div>

          <div className="mobile-menu-footer">
            <div className="mobile-menu-contact">
              <a href="mailto:Celetexgroup@gmail.com" className="mobile-menu-email">
                <Mail size={18} /> Celetexgroup@gmail.com
              </a>
              <a href="tel:08140784286" className="mobile-menu-phone">
                <Phone size={18} /> 0814 078 4286
              </a>
            </div>
            <div className="mobile-menu-social">
              <span className="mobile-menu-rc">RC: 9341015</span>
              <div className="mobile-menu-social-icons">
                <a href="#" aria-label="Facebook">FB</a>
                <a href="#" aria-label="Instagram">IG</a>
                <a href="#" aria-label="Twitter">TW</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .nav-container {
          max-width: 1360px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0;
        }

        .nav-links-desktop {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-link {
          color: rgba(255, 255, 255, 0.65);
          font-size: 14px;
          font-weight: 500;
          position: relative;
          padding: 4px 0;
          transition: color 0.25s ease;
          text-decoration: none;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0; bottom: -2px; width: 0; height: 2px;
          background: var(--gold);
          transition: width 0.3s ease;
        }
        .nav-link:hover { color: var(--white); }
        .nav-link:hover::after { width: 100%; }

        .mobile-menu-overlay {
          position: fixed; inset: 0; background: var(--black); z-index: 100;
          display: flex; flex-direction: column; overflow-y: auto;
          opacity: 0; pointer-events: none;
          transition: opacity 0.35s ease;
        }
        .mobile-menu-overlay.open { opacity: 1; pointer-events: auto; }

        .mobile-menu-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); flex-shrink: 0;
        }
        .mobile-menu-close {
          background: none; border: none; color: #fff; cursor: pointer; padding: 8px;
          display: flex; align-items: center; justify-content: center; border-radius: 8px;
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .mobile-menu-close:hover { background: rgba(255,255,255,0.06); transform: rotate(90deg); }

        .mobile-menu-body { flex: 1; display: flex; flex-direction: column; justify-content: space-between; padding: 40px 24px 32px; }

        .mobile-menu-link {
          display: flex; align-items: center; gap: 16px; padding: 16px 20px; border-radius: 12px;
          color: #fff; text-decoration: none; font-family: 'Space Grotesk', sans-serif;
          font-size: 20px; font-weight: 500; letter-spacing: -0.02em; position: relative;
          border: 1px solid transparent;
          opacity: 0; transform: translateX(-16px);
          transition: background 0.3s ease, opacity 0.4s ease, transform 0.4s ease;
        }
        .mobile-menu-overlay.open .mobile-menu-link { opacity: 1; transform: translateX(0); }
        .mobile-menu-link:hover { background: rgba(255,255,255,0.04); border-color: rgba(201,162,39,0.2); }
        .mobile-menu-link-number {
          font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--gold);
          font-weight: 400; letter-spacing: 0.04em; opacity: 0.6; min-width: 28px;
        }
        .mobile-menu-link-label { flex: 1; }
        .mobile-menu-link-arrow { opacity: 0; transform: translateX(-10px); transition: all 0.3s ease; color: var(--gold); }
        .mobile-menu-link:hover .mobile-menu-link-arrow { opacity: 1; transform: translateX(0); }

        .mobile-menu-cta {
          display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; margin-top: 8px;
          border-radius: 12px; background: linear-gradient(135deg, var(--gold-bright), var(--gold));
          color: #0a0a0a; text-decoration: none; font-family: 'Space Grotesk', sans-serif;
          font-size: 18px; font-weight: 600; border: none;
          opacity: 0; transform: translateX(-16px);
          transition: box-shadow 0.3s ease, opacity 0.4s ease, transform 0.4s ease;
        }
        .mobile-menu-overlay.open .mobile-menu-cta { opacity: 1; transform: translateX(0); }
        .mobile-menu-cta:hover { box-shadow: 0 8px 24px rgba(201,162,39,0.25); }

        .mobile-menu-footer { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 24px; margin-top: 32px; }
        .mobile-menu-contact a {
          display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.7);
          text-decoration: none; font-size: 14px; transition: color 0.3s ease; padding: 8px 0;
        }
        .mobile-menu-contact a:hover { color: var(--gold-bright); }
        .mobile-menu-rc { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--gold); letter-spacing: 0.06em; }
        .mobile-menu-social-icons a {
          color: rgba(255,255,255,0.5); text-decoration: none; font-size: 13px; font-weight: 500;
          padding: 6px 12px; border-radius: 6px; transition: all 0.3s ease;
          border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02);
        }
        .mobile-menu-social-icons a:hover { color: var(--gold-bright); border-color: var(--gold); background: rgba(201,162,39,0.08); }

        @media (max-width: 980px) {
          .nav-cta-btn { display: none !important; }
          .menu-toggle { display: flex !important; align-items: center; justify-content: center; }
          .nav { padding: 16px 24px !important; }
          .nav.scrolled { padding: 12px 24px !important; }
          .nav-links-desktop { display: none; }
        }
        @media (min-width: 981px) {
          .nav-cta-btn { display: inline-flex !important; }
          .menu-toggle { display: none !important; }
        }
        @media (max-width: 480px) {
          .mobile-menu-body { padding: 24px 16px 24px; }
          .mobile-menu-link { font-size: 17px; padding: 14px 16px; }
          .mobile-menu-header { padding: 16px 16px; }
          .mobile-menu-cta { font-size: 16px; padding: 14px 20px; }
        }

        .nav {
          position: sticky; top: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 48px; background: rgba(10,10,10,0);
          transition: background-color 0.4s ease, padding 0.4s ease, border-color 0.4s ease;
          border-bottom: 1px solid transparent;
        }
        .nav.scrolled {
          background: rgba(8, 8, 8, 0.98);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 14px 48px;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .nav-logo-mark-hover {
          display: inline-block;
          width: 200px;
          height: 50px;
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          transition: transform 0.3s ease;
        }
        .nav-logo-mark-hover:hover { transform: scale(1.05) rotate(-3deg); }
        .nav-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        .nav-logo-mark {
          width: 42px; height: 42px; border-radius: 10px;
          background: linear-gradient(135deg, var(--gold-bright), var(--gold-deep));
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; border: 2px solid rgba(201,162,39,0.3);
          box-shadow: 0 0 20px rgba(201,162,39,0.15); transition: transform 0.3s ease;
          flex-shrink: 0;
        }
        .nav-logo-mark:hover { transform: scale(1.1) rotate(-5deg); }
        .nav-logo-mark img { width: 100%; height: 100%; object-fit: cover; }
        .nav-logo-text {
          font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 18px;
          letter-spacing: 0.02em; white-space: nowrap; color: var(--white);
        }
        .nav-logo-text span { color: var(--gold); }

        .btn {
          display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px;
          border-radius: 999px; font-size: 13.5px; font-weight: 600; border: 1px solid transparent;
          transition: all 0.3s cubic-bezier(0.2,0.8,0.2,1); white-space: nowrap; text-decoration: none;
        }
        .btn:active { transform: scale(0.97); }
        .btn-gold { background: linear-gradient(135deg, var(--gold-bright), var(--gold)); color: #0a0a0a; }
        .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(201,162,39,0.35); }
        .btn-ghost-dark { background: transparent; border: 1px solid rgba(255,255,255,0.15); color: var(--white); }
        .btn-ghost-dark:hover { border-color: var(--gold); color: var(--gold-bright); }

        .menu-toggle {
          background: none; border: none; color: var(--white); cursor: pointer; padding: 4px;
          display: flex; align-items: center; justify-content: center; transition: transform 0.15s ease;
        }
        .menu-toggle:active { transform: scale(0.9); }

        @media (max-width: 600px) {
          .nav-logo-text { font-size: 15px; }
          .nav-logo-mark { width: 34px; height: 34px; }
          .nav-logo-mark-hover { width: 140px; height: 40px; }
          .nav { padding: 14px 16px !important; }
          .nav.scrolled { padding: 10px 16px !important; }
        }
      `}</style>
    </>
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
          <stop offset="0%" stopColor="#C9A227" />
          <stop offset="100%" stopColor="#B8862F" />
        </linearGradient>
        <radialGradient id="gGlow" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="rgba(201,162,39,0.15)" />
          <stop offset="100%" stopColor="rgba(201,162,39,0)" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="520" height="620" rx="18" fill="#0a0a0a" />
      <rect x="0" y="0" width="520" height="620" rx="18" fill="url(#gGlow)" />
      <g opacity="0.6">
        <rect x="60" y="330" width="60" height="220" fill="#1a1a1a" stroke="url(#gGoldA)" strokeWidth="1.2" />
        <rect x="130" y="260" width="70" height="290" fill="#1a1a1a" stroke="url(#gGoldA)" strokeWidth="1.2" />
        <rect x="210" y="180" width="90" height="370" fill="#1a1a1a" stroke="url(#gGoldA)" strokeWidth="1.4" />
        <rect x="310" y="240" width="66" height="310" fill="#1a1a1a" stroke="url(#gGoldA)" strokeWidth="1.2" />
        <rect x="386" y="300" width="56" height="250" fill="#1a1a1a" stroke="url(#gGoldA)" strokeWidth="1.2" />
      </g>
      <g stroke="rgba(201,162,39,0.2)" strokeWidth="1">
        {Array.from({ length: 9 }).map((_, r) =>
          Array.from({ length: 4 }).map((_, c) => (
            <rect
              key={`${r}-${c}`}
              x={222 + c * 18}
              y={200 + r * 36}
              width="10"
              height="18"
              fill={(r + c) % 3 === 0 ? "rgba(201,162,39,0.3)" : "rgba(255,255,255,0.02)"}
            />
          )),
        )}
      </g>
      <g stroke="url(#gGoldA)" strokeWidth="2.2" fill="none" strokeLinecap="round">
        <line x1="150" y1="560" x2="150" y2="120" />
        <line x1="150" y1="130" x2="330" y2="130" />
        <line x1="150" y1="130" x2="90" y2="160" />
        <line x1="150" y1="150" x2="215" y2="185" />
        <line x1="300" y1="130" x2="300" y2="175" />
        <circle cx="150" cy="120" r="4" fill="url(#gGoldA)" />
      </g>
      <polyline
        points="40,560 110,520 175,540 235,470 300,495 365,410 430,440 470,360"
        fill="none"
        stroke="#C9A227"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="hero-line-draw"
      />
      {[
        [40, 560], [110, 520], [175, 540], [235, 470],
        [300, 495], [365, 410], [430, 440], [470, 360],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="4" fill="#0a0a0a" stroke="#C9A227" strokeWidth="2" />
      ))}
    </svg>
  );
}

function HeroArtSecondary() {
  return (
    <svg viewBox="0 0 360 300" className="hero-art-svg-sm" aria-hidden="true">
      <defs>
        <linearGradient id="gGoldB" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C9A227" />
          <stop offset="100%" stopColor="#8C6A22" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="360" height="300" rx="16" fill="#1a1a1a" />
      <circle cx="120" cy="130" r="46" fill="none" stroke="url(#gGoldB)" strokeWidth="2" />
      <circle
        cx="120" cy="130" r="46" fill="none" stroke="url(#gGoldB)" strokeWidth="2"
        strokeDasharray="290" strokeDashoffset="70" className="hero-ring-draw"
      />
      <circle cx="120" cy="130" r="18" fill="#0a0a0a" stroke="url(#gGoldB)" strokeWidth="1.5" />
      <g stroke="url(#gGoldB)" strokeWidth="1.6" fill="none">
        <line x1="166" y1="130" x2="230" y2="90" />
        <line x1="166" y1="130" x2="230" y2="170" />
        <line x1="166" y1="112" x2="230" y2="60" />
      </g>
      <circle cx="230" cy="90" r="6" fill="#C9A227" />
      <circle cx="230" cy="170" r="6" fill="#C9A227" />
      <circle cx="230" cy="60" r="6" fill="#C9A227" />
      <text x="30" y="250" fill="rgba(255,255,255,0.7)" fontFamily="IBM Plex Mono, monospace" fontSize="11" letterSpacing="2">
        CELETEX / EST. 2022
      </text>
      <text x="30" y="268" fill="rgba(255,255,255,0.3)" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        DIVERSE VENTURES, UNIFIED VISION
      </text>
    </svg>
  );
}

function GalleryArt({ variant }) {
  const palette = { media: { a: "#C9A227", b: "#8C6A22" }, travels: { a: "#C9A227", b: "#8C6A22" }, homes: { a: "#C9A227", b: "#8C6A22" }, cybermall: { a: "#C9A227", b: "#8C6A22" } }[variant];

  return (
    <svg viewBox="0 0 400 260" className="gallery-art-svg" aria-hidden="true">
      <defs>
        <linearGradient id={`grad-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette.a} />
          <stop offset="100%" stopColor={palette.b} />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="#1a1a1a" />
      {variant === "media" && (
        <g>
          <rect x="50" y="40" width="300" height="180" rx="8" fill="#222" stroke={`url(#grad-${variant})`} strokeWidth="1.4" />
          <circle cx="100" cy="130" r="36" fill="#2a2a2a" stroke={`url(#grad-${variant})`} strokeWidth="1.2" />
          <circle cx="100" cy="130" r="18" fill="#333" stroke={`url(#grad-${variant})`} strokeWidth="1" />
          <rect x="150" y="90" width="30" height="80" rx="2" fill="#333" stroke={`url(#grad-${variant})`} strokeWidth="1" />
          <rect x="190" y="70" width="30" height="100" rx="2" fill="#333" stroke={`url(#grad-${variant})`} strokeWidth="1" />
          <rect x="230" y="100" width="30" height="70" rx="2" fill="#333" stroke={`url(#grad-${variant})`} strokeWidth="1" />
          <rect x="270" y="85" width="30" height="85" rx="2" fill="#333" stroke={`url(#grad-${variant})`} strokeWidth="1" />
          <path d="M60 220 L340 220" stroke={`url(#grad-${variant})`} strokeWidth="1.5" strokeDasharray="4 6" opacity="0.3" />
        </g>
      )}
      {variant === "travels" && (
        <g>
          <path d="M60 140 L140 60 L280 60 L340 140 L280 220 L140 220 Z" fill="#222" stroke={`url(#grad-${variant})`} strokeWidth="1.4" />
          <circle cx="170" cy="140" r="30" fill="none" stroke={`url(#grad-${variant})`} strokeWidth="1.2" />
          <circle cx="230" cy="140" r="30" fill="none" stroke={`url(#grad-${variant})`} strokeWidth="1.2" />
          <path d="M170 110 L230 110 L230 170 L170 170 Z" fill="none" stroke={`url(#grad-${variant})`} strokeWidth="1.2" />
          <line x1="200" y1="90" x2="200" y2="60" stroke={`url(#grad-${variant})`} strokeWidth="1.2" />
          <line x1="185" y1="60" x2="215" y2="60" stroke={`url(#grad-${variant})`} strokeWidth="1.2" />
          <line x1="140" y1="80" x2="140" y2="120" stroke={`url(#grad-${variant})`} strokeWidth="1" opacity="0.4" />
        </g>
      )}
      {variant === "homes" && (
        <g>
          <rect x="60" y="100" width="280" height="130" fill="#222" stroke={`url(#grad-${variant})`} strokeWidth="1.4" rx="4" />
          <polygon points="60,100 200,40 340,100" fill="#333" stroke={`url(#grad-${variant})`} strokeWidth="1.4" />
          <rect x="120" y="150" width="40" height="80" fill="#333" stroke={`url(#grad-${variant})`} strokeWidth="1" />
          <rect x="240" y="150" width="40" height="80" fill="#333" stroke={`url(#grad-${variant})`} strokeWidth="1" />
          <rect x="175" y="140" width="50" height="40" fill="#333" stroke={`url(#grad-${variant})`} strokeWidth="1" />
          <rect x="185" y="150" width="30" height="30" fill="#2a2a2a" stroke={`url(#grad-${variant})`} strokeWidth="0.8" />
        </g>
      )}
      {variant === "cybermall" && (
        <g>
          <rect x="60" y="50" width="280" height="160" rx="8" fill="#222" stroke={`url(#grad-${variant})`} strokeWidth="1.4" />
          <rect x="80" y="70" width="60" height="40" rx="4" fill="#333" stroke={`url(#grad-${variant})`} strokeWidth="1" />
          <rect x="155" y="70" width="60" height="40" rx="4" fill="#333" stroke={`url(#grad-${variant})`} strokeWidth="1" />
          <rect x="230" y="70" width="60" height="40" rx="4" fill="#333" stroke={`url(#grad-${variant})`} strokeWidth="1" />
          <rect x="80" y="125" width="60" height="40" rx="4" fill="#333" stroke={`url(#grad-${variant})`} strokeWidth="1" />
          <rect x="155" y="125" width="60" height="40" rx="4" fill="#333" stroke={`url(#grad-${variant})`} strokeWidth="1" />
          <rect x="230" y="125" width="60" height="40" rx="4" fill="#333" stroke={`url(#grad-${variant})`} strokeWidth="1" />
          <circle cx="310" cy="90" r="12" fill="none" stroke={`url(#grad-${variant})`} strokeWidth="1.5" />
          <circle cx="310" cy="150" r="12" fill="none" stroke={`url(#grad-${variant})`} strokeWidth="1.5" />
        </g>
      )}
    </svg>
  );
}

/* ----------------------------------------------------------------------
   VIDEO SECTION
---------------------------------------------------------------------- */

function VideoSection() {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [ref, visible] = useReveal(0.3);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="video-section" ref={ref}>
      <div className={`video-wrapper ${visible ? "reveal-visible" : ""}`}>
        <div className="video-grid">
          <div className="video-container">
            <video
              ref={videoRef}
              className="video-element"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster={images.videoPoster || "https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg?auto=compress&cs=tinysrgb&w=1200"}
            >
              <source src={images.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div className="video-overlay">
              <div className="video-overlay-content">
                <div className="video-brand-icon">
                  <img src={images.Logo1} alt="Celetex Group" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <div className="video-controls">
              <button className="video-control-btn" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg>
                )}
              </button>
              <button className="video-control-btn" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
                {isMuted ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>
              <span className="video-loop-indicator">⟳ Loop</span>
            </div>

            <div className="video-accent-line" />
          </div>

          <div className="video-text-content">
            <div className={`reveal-slide-right ${visible ? "reveal-slide-right-visible" : ""}`}>
              <div className="video-text-badge">
                <span className="video-text-badge-dot" />
                Celetex Group
              </div>

              <h2 className="video-text-title">
                Building a Legacy of
                <span className="video-text-highlight"> Innovation</span>
              </h2>

              <p className="video-text-description">
                Celetex Group is a diversified business conglomerate delivering innovative
                solutions across media, real estate, travel, and digital commerce —
                empowering individuals, businesses, and communities.
              </p>

              <div className="video-text-stats">
                <div className="video-text-stat"><span className="video-text-stat-number">2022</span><span className="video-text-stat-label">Founded</span></div>
                <div className="video-text-stat-divider" />
                <div className="video-text-stat"><span className="video-text-stat-number">4+</span><span className="video-text-stat-label">Brands</span></div>
                <div className="video-text-stat-divider" />
                <div className="video-text-stat"><span className="video-text-stat-number">100+</span><span className="video-text-stat-label">Clients</span></div>
              </div>

              <div className="video-text-features">
                <div className="video-text-feature">
                  <svg className="video-text-feature-icon" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                  <span>100% Trusted</span>
                </div>
                <div className="video-text-feature">
                  <svg className="video-text-feature-icon" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
                  <span>Certified</span>
                </div>
                <div className="video-text-feature">
                  <svg className="video-text-feature-icon" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  <span>Excellence</span>
                </div>
              </div>

              <a href="#contact" className="video-text-cta">
                Learn More About Us
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .video-section { max-width: 1360px; margin: 0 auto; padding: 40px 48px 60px; }
        .video-wrapper { opacity: 0; transform: translateY(28px); transition: opacity 0.8s cubic-bezier(.2,.7,.2,1), transform 0.8s cubic-bezier(.2,.7,.2,1); }
        .video-wrapper.reveal-visible { opacity: 1; transform: translateY(0); }
        .video-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }

        .video-container { position: relative; border-radius: 20px; overflow: hidden; background: var(--black); border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 20px 60px rgba(0,0,0,0.4); aspect-ratio: 16/10; contain: layout paint; }
        .video-element { width: 100%; height: 100%; object-fit: cover; display: block; }
        .video-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.1) 50%, rgba(10,10,10,0.3) 100%); display: flex; align-items: center; justify-content: center; pointer-events: none; }
        .video-overlay-content { text-align: center; color: white; padding: 20px; }
        .video-brand-icon { width: 60px; height: 60px; border-radius: 14px; background: linear-gradient(135deg, var(--gold-bright), var(--gold)); display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 30px rgba(201,162,39,0.3); overflow: hidden; }
        .video-brand-icon img { width: 100%; height: 100%; object-fit: cover; }

        .video-controls { position: absolute; bottom: 20px; left: 20px; right: 20px; display: flex; align-items: center; gap: 12px; z-index: 2; pointer-events: none; }
        .video-control-btn { pointer-events: auto; width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: rgba(15,15,15,0.75); color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.3s ease, transform 0.15s ease, border-color 0.3s ease; }
        .video-control-btn:hover { background: rgba(201,162,39,0.55); border-color: var(--gold-bright); transform: scale(1.05); }
        .video-control-btn:active { transform: scale(0.95); }
        .video-loop-indicator { pointer-events: none; font-size: 11px; color: rgba(255,255,255,0.5); font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.06em; margin-left: auto; background: rgba(10,10,10,0.6); padding: 4px 12px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.06); }
        .video-accent-line { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--gold-bright), var(--gold), var(--gold-deep)); z-index: 1; opacity: 0.6; }

        .video-text-content { padding: 20px 0; }
        .reveal-slide-right { opacity: 0; transform: translateX(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal-slide-right-visible { opacity: 1; transform: translateX(0); }

        .video-text-badge { display: inline-flex; align-items: center; gap: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); margin-bottom: 16px; }
        .video-text-badge-dot { width: 8px; height: 8px; background: var(--gold); border-radius: 2px; display: inline-block; }
        .video-text-title { font-family: 'Space Grotesk', sans-serif; font-size: 36px; font-weight: 700; line-height: 1.12; letter-spacing: -0.02em; color: var(--white); margin: 0 0 16px; }
        .video-text-highlight { background: linear-gradient(90deg, var(--gold-bright), var(--gold)); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .video-text-description { font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.6); margin: 0 0 24px; max-width: 460px; }
        .video-text-stats { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; padding: 16px 20px; background: rgba(255,255,255,0.04); border-radius: 12px; border: 1px solid rgba(255,255,255,0.06); }
        .video-text-stat { display: flex; flex-direction: column; }
        .video-text-stat-number { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; color: var(--white); }
        .video-text-stat-label { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em; }
        .video-text-stat-divider { width: 1px; height: 30px; background: rgba(255,255,255,0.06); }
        .video-text-features { display: flex; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }
        .video-text-feature { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; color: var(--white); }
        .video-text-feature-icon { width: 18px; height: 18px; flex-shrink: 0; }
        .video-text-cta { display: inline-flex; align-items: center; gap: 10px; padding: 14px 28px; background: linear-gradient(135deg, var(--gold-bright), var(--gold)); color: #0a0a0a; border: none; border-radius: 999px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.3s ease; text-decoration: none; box-shadow: 0 8px 24px rgba(201,162,39,0.25); }
        .video-text-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(201,162,39,0.35); }
        .video-text-cta:active { transform: translateY(0) scale(0.98); }

        @media (max-width: 1024px) {
          .video-grid { grid-template-columns: 1fr; gap: 32px; }
          .video-container { aspect-ratio: 16/9; }
          .video-text-content { padding: 0; }
          .video-text-title { font-size: 30px; }
        }
        @media (max-width: 768px) {
          .video-section { padding: 20px 20px 40px; }
          .video-text-title { font-size: 26px; }
          .video-text-stats { flex-wrap: wrap; gap: 12px; }
          .video-text-stat-divider { display: none; }
          .video-brand-icon { width: 44px; height: 44px; }
          .video-controls { bottom: 12px; left: 12px; right: 12px; }
          .video-control-btn { width: 32px; height: 32px; }
          .video-text-features { gap: 12px; }
        }
        @media (max-width: 480px) {
          .video-text-title { font-size: 22px; }
          .video-text-description { font-size: 14px; }
          .video-text-stats { padding: 12px 16px; }
          .video-text-stat-number { font-size: 17px; }
        }
      `}</style>
    </section>
  );
}

/* ----------------------------------------------------------------------
   CYBERMALL APP SHOWCASE SECTION — UPDATED with Tracking Logistics
---------------------------------------------------------------------- */

function CybermallAppSection() {
  const [ref, visible] = useReveal(0.2);

  const features = [
    { icon: ShoppingCart, label: "Easy Shopping" },
    { icon: CreditCard, label: "Secure Payments" },
    { icon: Truck, label: "Fast Delivery" },
    { icon: Package, label: "Tracking Logistics" },
    { icon: BadgeCheck, label: "Verified Sellers" },
  ];

  return (
    <section className="cybermall-section" id="cybermall-app" ref={ref}>
      <div className={`cybermall-wrapper ${visible ? "reveal-visible" : ""}`}>
        <div className="cybermall-grid">
          <div className="cybermall-content">
            <div className={`reveal-slide-left ${visible ? "reveal-slide-left-visible" : ""}`}>
              <div className="cybermall-badge">
                <Smartphone size={16} />
                <span>Coming Soon</span>
              </div>

              <h2 className="cybermall-title">
                Cybermall App
                <span className="cybermall-highlight"> Coming Soon</span>
              </h2>

              <p className="cybermall-description">
                Experience seamless shopping with the Cybermall mobile app.
                Browse products, make secure payments, track deliveries, and
                manage your logistics all from the palm of your hand.
              </p>

              <div className="cybermall-features">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`cybermall-feature reveal-fade-up ${visible ? "reveal-fade-up-visible" : ""}`}
                    style={{ transitionDelay: `${180 + index * 70}ms` }}
                  >
                    <div className="cybermall-feature-icon">
                      <feature.icon size={18} />
                    </div>
                    <span className="cybermall-feature-label">{feature.label}</span>
                  </div>
                ))}
              </div>

              <div className="cybermall-cta-group">
                <a href="#contact" className="cybermall-cta-primary">
                  <Download size={18} />
                  Get Notified
                </a>
                <a href="#contact" className="cybermall-cta-secondary">
                  Learn More
                  <ArrowRight size={16} />
                </a>
              </div>

              <div className="cybermall-store-badges">
                <div className="cybermall-store-badge"><Store size={20} /><span>App Store</span></div>
                <div className="cybermall-store-badge"><Store size={20} /><span>Google Play</span></div>
              </div>
            </div>
          </div>

          <div
            className={`cybermall-mockup-wrapper reveal-scale-in ${visible ? "reveal-scale-in-visible" : ""}`}
          >
            <div className="cybermall-mockup-container">
              <img src={images.mockup} alt="Cybermall App Mockup" className="cybermall-mockup-image" loading="lazy" />
              <div className="cybermall-mockup-glow" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cybermall-section { max-width: 1360px; margin: 0 auto; padding: 60px 48px 80px; }
        .cybermall-wrapper { opacity: 0; transform: translateY(28px); transition: opacity 0.8s cubic-bezier(.2,.7,.2,1), transform 0.8s cubic-bezier(.2,.7,.2,1); }
        .cybermall-wrapper.reveal-visible { opacity: 1; transform: translateY(0); }

        .reveal-slide-left { opacity: 0; transform: translateX(-30px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal-slide-left-visible { opacity: 1; transform: translateX(0); }
        .reveal-fade-up { opacity: 0; transform: translateY(10px); transition: opacity 0.5s ease, transform 0.5s ease; }
        .reveal-fade-up-visible { opacity: 1; transform: translateY(0); }
        .reveal-scale-in { opacity: 0; transform: scale(0.95) translateX(30px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .reveal-scale-in-visible { opacity: 1; transform: scale(1) translateX(0); }

        .cybermall-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; background: var(--charcoal); border-radius: 28px; padding: 60px; border: 1px solid var(--line); min-height: 500px; }
        .cybermall-content { padding-right: 20px; }
        .cybermall-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; background: rgba(201,162,39,0.15); border: 1px solid rgba(201,162,39,0.25); border-radius: 999px; color: var(--gold-bright); font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 20px; font-family: 'IBM Plex Mono', monospace; }
        .cybermall-title { font-family: 'Space Grotesk', sans-serif; font-size: 40px; font-weight: 700; line-height: 1.12; letter-spacing: -0.02em; color: var(--white); margin: 0 0 16px; }
        .cybermall-highlight { background: linear-gradient(90deg, var(--gold-bright), var(--gold)); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .cybermall-description { font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.6); margin: 0 0 28px; max-width: 480px; }
        .cybermall-features { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 32px; }
        .cybermall-feature { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: rgba(255,255,255,0.04); border-radius: 10px; border: 1px solid rgba(255,255,255,0.06); transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, opacity 0.5s ease; }
        .cybermall-feature:hover { border-color: var(--gold); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(201,162,39,0.1); background: rgba(255,255,255,0.06); }
        .cybermall-feature-icon { width: 32px; height: 32px; border-radius: 8px; background: rgba(201,162,39,0.12); display: flex; align-items: center; justify-content: center; color: var(--gold-bright); flex-shrink: 0; }
        .cybermall-feature-label { font-size: 13px; font-weight: 500; color: var(--white); }
        .cybermall-cta-group { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
        .cybermall-cta-primary { display: inline-flex; align-items: center; gap: 10px; padding: 14px 28px; background: linear-gradient(135deg, var(--gold-bright), var(--gold)); color: #0a0a0a; border: none; border-radius: 999px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.3s ease; text-decoration: none; box-shadow: 0 8px 24px rgba(201,162,39,0.25); }
        .cybermall-cta-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(201,162,39,0.35); }
        .cybermall-cta-primary:active, .cybermall-cta-secondary:active { transform: scale(0.97); }
        .cybermall-cta-secondary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: transparent; color: var(--white); border: 1px solid rgba(255,255,255,0.15); border-radius: 999px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.3s ease; text-decoration: none; }
        .cybermall-cta-secondary:hover { border-color: var(--gold); color: var(--gold-bright); transform: translateY(-2px); }
        .cybermall-store-badges { display: flex; gap: 12px; }
        .cybermall-store-badge { display: flex; align-items: center; gap: 8px; padding: 10px 18px; background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.5); border-radius: 10px; font-size: 12px; font-weight: 500; border: 1px solid rgba(255,255,255,0.06); transition: all 0.3s ease; }
        .cybermall-store-badge:hover { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); }

        .cybermall-mockup-wrapper { display: flex; justify-content: center; align-items: center; position: relative; }
        .cybermall-mockup-container { position: relative; width: 100%; max-width: 550px; border-radius: 24px; overflow: hidden; border: 1px solid var(--line); box-shadow: 0 30px 80px rgba(0,0,0,0.4); transition: transform 0.4s ease, box-shadow 0.4s ease; }
        .cybermall-mockup-container:hover { transform: translateY(-6px) scale(1.01); box-shadow: 0 40px 100px rgba(0,0,0,0.5); }
        .cybermall-mockup-image { width: 100%; height: auto; display: block; object-fit: cover; }
        .cybermall-mockup-glow { position: absolute; inset: -50%; background: radial-gradient(circle at 50% 50%, rgba(201,162,39,0.08), transparent 70%); pointer-events: none; z-index: 0; }

        @media (max-width: 1024px) {
          .cybermall-grid { grid-template-columns: 1fr; gap: 40px; padding: 40px; min-height: 400px; }
          .cybermall-content { padding-right: 0; }
          .cybermall-title { font-size: 32px; }
          .cybermall-mockup-container { max-width: 400px; }
        }
        @media (max-width: 768px) {
          .cybermall-section { padding: 30px 20px 50px; }
          .cybermall-grid { padding: 28px; }
          .cybermall-title { font-size: 28px; }
          .cybermall-features { grid-template-columns: 1fr 1fr; }
          .cybermall-mockup-container { max-width: 320px; }
        }
        @media (max-width: 480px) {
          .cybermall-grid { padding: 20px; min-height: 350px; }
          .cybermall-title { font-size: 24px; }
          .cybermall-features { grid-template-columns: 1fr; }
          .cybermall-cta-group { flex-direction: column; }
          .cybermall-cta-primary, .cybermall-cta-secondary { justify-content: center; }
          .cybermall-store-badges { flex-direction: column; }
          .cybermall-mockup-container { max-width: 250px; }
        }
      `}</style>
    </section>
  );
}

/* ----------------------------------------------------------------------
   HERO SECTION
---------------------------------------------------------------------- */

function HeroSection() {
  const [ref, visible] = useReveal(0.2);

  return (
    <section className="hero" id="home" ref={ref}>
      <div className="hero-inner">
        <div className={`reveal ${visible ? "reveal-visible" : ""}`}>
          <Eyebrow>Diverse Ventures, Unified Vision</Eyebrow>
          <h1>
            Celetex Group of Company Limited
            <br />
            <span className="accent">Building a legacy of innovation across Africa.</span>
          </h1>
          <p className="lead">
            Celetex Group is a diversified business conglomerate delivering innovative solutions across media,
            real estate, travel, and digital commerce — empowering individuals, businesses, and communities.
          </p>
          <div className="hero-ctas">
            <a href="#contact" className="btn btn-gold">Explore Our Brands <ArrowRight size={16} /></a>
            <a href="#about" className="btn btn-ghost-dark">About Us</a>
          </div>
          <div className="hero-meta">
            <div className="hero-avatars"><span>CK</span><span>CO</span><span>CE</span></div>
            <div className="hero-meta-text">Founded <b>2022</b> · RC: <b>9341015</b></div>
          </div>
        </div>

        <div className={`hero-visual ${visible ? "reveal-visible" : ""}`}>
          <div className="hero-art-primary"><HeroArtPrimary /></div>
          <div className="hero-art-secondary"><HeroArtSecondary /></div>
          <div className="hero-badge hero-badge-1">
            <div className="hero-badge-icon"><ShieldCheck size={18} /></div>
            <div><div className="hero-badge-num">3+ Yrs</div><div className="hero-badge-label">Building Excellence</div></div>
          </div>
          <div className="hero-badge hero-badge-2">
            <div className="hero-badge-icon"><Users size={18} /></div>
            <div><div className="hero-badge-num">4+</div><div className="hero-badge-label">Brands Under One Roof</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------
   PROCESS LINE
---------------------------------------------------------------------- */

function ProcessLine() {
  const [ref, visible] = useReveal(0.4);
  return (
    <div className="process-line" ref={ref}>
      <div className="process-line-fill" style={{ width: visible ? "100%" : "0%" }} />
    </div>
  );
}

/* ----------------------------------------------------------------------
   MAIN APP
---------------------------------------------------------------------- */

export default function App() {
  const { progress, scrolled } = useScrollState();
  const pointerFine = usePointerFine();

  const tiltA = useTilt(8, pointerFine);
  const tiltB = useTilt(8, pointerFine);
  const tiltC = useTilt(8, pointerFine);
  const tiltD = useTilt(8, pointerFine);

  const brands = [
    { icon: images.celetexMedia, title: "Celetex Multimedia", desc: "Full-service multimedia and creative agency specializing in branding, graphic design, website development, cinematography, photography, digital marketing, content creation, and strategic communications.", tilt: tiltA, variant: "media" },
    { icon: images.celetexTravelsTours, title: "Celetex Travels and Tours", desc: "Travel solutions company providing reliable travel consultancy, tour planning, visa assistance, vacation packages, and corporate travel management for local and international destinations.", tilt: tiltB, variant: "travels" },
    { icon: images.celetexSignature, title: "Celetex Signature Homes", desc: "Premium real estate brand focused on property development, real estate consultancy, construction, property management, interior design, and investment advisory services.", tilt: tiltC, variant: "homes" },
    { icon: images.cyberMall, title: "Cybermall", desc: "Innovative digital commerce platform connecting buyers and sellers through a seamless online marketplace experience, integrating e-commerce, logistics, and product discovery.", tilt: tiltD, variant: "cybermall" },
  ];

  const process = [
    { n: "01", title: "Discovery & Assessment", desc: "We study your goals, constraints, and market to define what success looks like.", icon: Target },
    { n: "02", title: "Strategy & Design", desc: "Every plan is mapped in detail — budgets, timelines, and risk built in from day one.", icon: Layers },
    { n: "03", title: "Execution & Delivery", desc: "Our teams build, implement, and manage with precision and constant communication.", icon: Rocket },
    { n: "04", title: "Support & Optimization", desc: "We stay engaged after delivery, refining performance long after launch.", icon: HeartHandshake },
  ];

  const [statsRef, statsVisible] = useReveal(0.2);
  const [brandsRef, brandsVisible] = useReveal(0.2);
  const [founderRef, founderVisible] = useReveal(0.2);
  const [processRef, processVisible] = useReveal(0.2);
  const [ctaRef, ctaVisible] = useReveal(0.2);

  return (
    <div className="ag-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

        :root{
          --white:#faf9f6; --off:#f5f2ec; --cream:#ede9e1; --black:#0a0a0a; --charcoal:#1a1a1a;
          --gold:#C9A227; --gold-bright:#F3D27A; --gold-deep:#8C6A22;
          --line:rgba(255,255,255,0.06); --line-strong:rgba(255,255,255,0.12);
        }
        *{ box-sizing:border-box; margin:0; padding:0; }
        .ag-root{ font-family:'Inter', sans-serif; background:var(--black); color:var(--white); overflow-x:hidden; -webkit-font-smoothing:antialiased; }
        .ag-root h1, .ag-root h2, .ag-root h3, .ag-root .display{ font-family:'Space Grotesk', sans-serif; letter-spacing:-0.02em; }
        .mono{ font-family:'IBM Plex Mono', monospace; }
        a{ color:inherit; text-decoration:none; }
        button{ font-family:inherit; cursor:pointer; }

        .progress-thread{
          position:fixed; top:0; left:0; width:3px; height:100vh; z-index:60;
          background:linear-gradient(180deg, var(--gold-bright), var(--gold) 40%, transparent 100%);
          transform-origin:top; pointer-events:none; transition: transform 0.1s linear;
        }

        .reveal{ opacity:0; transform:translateY(28px); transition:opacity .8s cubic-bezier(.2,.7,.2,1), transform .8s cubic-bezier(.2,.7,.2,1); }
        .reveal-visible{ opacity:1; transform:translateY(0); }
        .reveal-scale{ opacity: 0; transform: scale(0.85); transition: opacity 0.6s cubic-bezier(.22,.61,.36,1), transform 0.6s cubic-bezier(.22,.61,.36,1); display: inline-block; }
        .reveal-scale-visible{ opacity: 1; transform: scale(1); }

        .hero{ background:var(--black); color:var(--white); padding:64px 48px 100px; position:relative; }
        .hero-inner{ display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; max-width:1360px; margin:0 auto; }
        .eyebrow{ display:inline-flex; align-items:center; gap:10px; font-family:'IBM Plex Mono', monospace; font-size:12.5px; letter-spacing:0.12em; text-transform:uppercase; color:var(--gold); margin-bottom:20px; }
        .eyebrow-chip{ width:8px; height:8px; background:var(--gold); border-radius:2px; display:inline-block; }
        .hero h1{ font-size:56px; line-height:1.08; font-weight:700; margin:0 0 22px; }
        .hero h1 .accent{ background:linear-gradient(90deg, var(--gold-bright), var(--gold)); -webkit-background-clip:text; background-clip:text; color:transparent; }
        .hero p.lead{ font-size:17px; line-height:1.7; color:rgba(255,255,255,0.6); max-width:480px; margin-bottom:36px; }
        .hero-ctas{ display:flex; gap:14px; margin-bottom:56px; }
        .hero-ctas a{ transition: transform 0.2s ease; }
        .hero-ctas a:active{ transform: scale(0.97); }
        .hero-meta{ display:flex; align-items:center; gap:18px; }
        .hero-avatars{ display:flex; }
        .hero-avatars span{ width:34px; height:34px; border-radius:50%; border:2px solid var(--black); background:linear-gradient(135deg, #333, #222); margin-left:-10px; display:flex; align-items:center; justify-content:center; font-size:11px; color:var(--gold); font-weight:600; }
        .hero-avatars span:first-child{ margin-left:0; }
        .hero-meta-text{ font-size:13px; color:rgba(255,255,255,0.5); }
        .hero-meta-text b{ color:var(--white); }

        .hero-visual{ position:relative; height:560px; opacity: 0; transform: scale(0.92); transition: opacity 0.8s cubic-bezier(.22,.61,.36,1) 0.2s, transform 0.8s cubic-bezier(.22,.61,.36,1) 0.2s; }
        .hero-visual.reveal-visible{ opacity: 1; transform: scale(1); }
        .hero-art-primary{ position:absolute; top:0; right:0; width:78%; height:100%; border-radius:20px; overflow:hidden; box-shadow:0 30px 80px rgba(0,0,0,0.5); border:1px solid var(--line); }
        .hero-art-svg{ width:100%; height:100%; display:block; }
        .hero-line-draw{ stroke-dasharray:900; stroke-dashoffset:900; animation:drawLine 2.4s ease forwards 0.4s; }
        @keyframes drawLine{ to{ stroke-dashoffset:0; } }
        .hero-ring-draw{ animation:ringSpin 6s linear infinite; transform-origin:120px 130px; }
        @keyframes ringSpin{ to{ transform:rotate(360deg); } }

        .hero-art-secondary{
          position:absolute; bottom:-30px; left:-10px; width:280px; border-radius:16px; overflow:hidden;
          box-shadow:0 25px 60px rgba(0,0,0,0.5); border:1px solid var(--line);
          opacity: 0; transform: translateX(-30px); transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }
        .hero-visual.reveal-visible .hero-art-secondary{ opacity: 1; transform: translateX(0); }
        .hero-art-svg-sm{ width:100%; height:100%; display:block; }

        .hero-badge{
          position:absolute; background:rgba(12,12,12,0.94); border:1px solid var(--line); border-radius:14px; padding:14px 18px;
          display:flex; align-items:center; gap:12px; box-shadow:0 20px 40px rgba(0,0,0,0.4);
          opacity: 0; transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .hero-badge-1{ top:40px; left:-40px; transform: translateX(-40px); transition-delay: 0.6s; }
        .hero-badge-2{ bottom:60px; right:-20px; transform: translateX(40px); transition-delay: 0.7s; }
        .hero-visual.reveal-visible .hero-badge{ opacity: 1; transform: translateX(0); }
        .hero-badge-icon{ width:36px; height:36px; border-radius:10px; background:rgba(201,162,39,0.1); display:flex; align-items:center; justify-content:center; color:var(--gold); }
        .hero-badge-num{ font-family:'Space Grotesk'; font-weight:700; font-size:18px; color:var(--white); line-height:1.1; }
        .hero-badge-label{ font-size:11.5px; color:rgba(255,255,255,0.5); }

        .section{ padding:100px 48px; max-width:1360px; margin:0 auto; }
        .section-head{ display:flex; justify-content:space-between; align-items:flex-end; gap:40px; margin-bottom:56px; }
        .section-head h2{ font-size:38px; font-weight:700; line-height:1.15; max-width:640px; margin:0; color:var(--white); }
        .section-head p{ font-size:15px; color:rgba(255,255,255,0.55); max-width:340px; line-height:1.65; }

        .stats-wrap{ background:var(--charcoal); }
        .stats-grid{ display:grid; grid-template-columns:1.4fr 1fr 1fr; grid-template-rows:auto auto; gap:20px; }
        .stat-card{ background:var(--black); color:var(--white); border-radius:18px; padding:32px; position:relative; overflow:hidden; transition:transform .4s ease; border:1px solid var(--line); }
        .stat-card:hover{ transform:translateY(-6px); box-shadow:0 12px 30px rgba(0,0,0,0.3); }
        .stat-card.dark{ background:var(--charcoal); color:var(--white); border-color:var(--line); }
        .stat-card-main{ grid-row:span 2; background:linear-gradient(135deg, var(--charcoal), var(--black)); color:var(--white); border-color:var(--line); }
        .stat-brand{ display:flex; align-items:center; gap:10px; font-family:'Space Grotesk'; font-weight:600; font-size:16px; color:var(--gold-bright); }
        .stat-number{ font-family:'Space Grotesk'; font-weight:700; font-size:52px; display:block; margin:24px 0 8px; }
        .stat-card-main .stat-number{ font-size:64px; }
        .stat-desc{ font-size:14px; color:rgba(255,255,255,0.6); line-height:1.6; max-width:260px; }
        .stat-icon-row{ display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
        .stat-icon-box{ width:38px; height:38px; border-radius:10px; background:rgba(201,162,39,0.08); display:flex; align-items:center; justify-content:center; color:var(--gold); }
        .stat-label{ font-size:13px; color:rgba(255,255,255,0.5); margin-top:8px; }
        .stat-card.dark .stat-label{ color:rgba(255,255,255,0.5); }

        .brands-grid{ display:grid; grid-template-columns:repeat(2, 1fr); gap:28px; }
        .brand-card{ background:var(--charcoal); border:1px solid var(--line); border-radius:24px; padding:0; overflow:hidden; transition:all 0.4s ease; box-shadow:0 4px 20px rgba(0,0,0,0.3); }
        .brand-card:hover{ box-shadow:0 24px 60px rgba(0,0,0,0.4); border-color:var(--gold); transform:translateY(-6px); }
        .brand-card-full{ grid-column:span 2; }
        .brand-card-image-wrapper{ position:relative; height:200px; overflow:hidden; background:var(--charcoal); }
        .brand-card-image-wrapper img{ width:100%; height:100%; object-fit:cover; transition:transform 0.6s ease; }
        .brand-card:hover .brand-card-image-wrapper img{ transform:scale(1.05); }
        .brand-card-image-overlay{ position:absolute; inset:0; background:linear-gradient(135deg, rgba(201,162,39,0.08), rgba(0,0,0,0.4)); pointer-events:none; }
        .brand-card-image-badge{ position:absolute; top:16px; right:16px; background:rgba(10,10,10,0.85); padding:6px 14px; border-radius:999px; font-size:10px; font-weight:600; color:var(--gold-bright); border:1px solid rgba(201,162,39,0.15); letter-spacing:0.04em; text-transform:uppercase; }
        .brand-card-body{ padding:24px 28px 28px; }
        .brand-card-body h3{ font-size:20px; font-weight:700; margin:0 0 10px; font-family:'Space Grotesk', sans-serif; letter-spacing:-0.02em; color:var(--white); }
        .brand-card-body h3 span{ color:var(--gold); }
        .brand-card-body p{ font-size:14.5px; color:rgba(255,255,255,0.6); line-height:1.7; margin:0 0 20px; }
        .brand-link{ display:inline-flex; align-items:center; gap:8px; font-size:14px; font-weight:600; color:var(--gold-bright); transition:all 0.3s ease; text-decoration:none; }
        .brand-link svg{ transition:transform 0.3s ease; }
        .brand-link:hover svg{ transform:translateX(4px); }
        .brand-card-full .brand-card-image-wrapper{ height:240px; }

        .gallery-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:24px; }
        .gallery-card{ border-radius:18px; overflow:hidden; background:var(--charcoal); border:1px solid var(--line); transition: transform 0.3s ease; }
        .gallery-card:hover{ transform: translateY(-6px); }
        .gallery-art-wrap{ overflow:hidden; height:180px; }
        .gallery-art-svg{ width:100%; height:100%; display:block; transition:transform .6s ease; }
        .gallery-card:hover .gallery-art-svg{ transform:scale(1.08); }
        .gallery-body{ padding:22px; }
        .gallery-body h4{ font-size:15px; font-weight:600; margin:0 0 6px; color:var(--white); }
        .gallery-body p{ font-size:13px; color:rgba(255,255,255,0.6); line-height:1.5; margin:0; }

        .process-wrap{ background:var(--charcoal); color:var(--white); }
        .process-head{ display:grid; grid-template-columns:1.3fr 1fr; gap:40px; align-items:flex-end; margin-bottom:64px; }
        .process-head h2{ color:var(--white); }
        .process-head p{ color:rgba(255,255,255,0.6); }
        .process-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:0; position:relative; }
        .process-line{ position:absolute; top:44px; left:0; right:0; height:1px; background:rgba(255,255,255,0.06); overflow:hidden; }
        .process-line-fill{ height:100%; background:linear-gradient(90deg, var(--gold-bright), var(--gold)); width:0%; transition:width 1.4s cubic-bezier(.2,.7,.2,1); }
        .process-step{ padding:0 24px 0 0; position:relative; }
        .process-num{ font-family:'Space Grotesk'; font-size:44px; font-weight:700; color:rgba(255,255,255,0.06); margin-bottom:18px; }
        .process-icon{ width:44px; height:44px; border-radius:12px; background:rgba(201,162,39,0.12); color:var(--gold-bright); display:flex; align-items:center; justify-content:center; margin-bottom:18px; position:relative; z-index:2; transition: transform 0.3s ease; }
        .process-step:hover .process-icon{ transform: scale(1.1) rotate(-5deg); }
        .process-step h3{ font-size:17px; font-weight:600; margin:0 0 10px; color:var(--white); }
        .process-step p{ font-size:13.5px; color:rgba(255,255,255,0.55); line-height:1.6; margin:0; max-width:240px; }

        .founder-grid{ display:grid; grid-template-columns:1fr 1.2fr; gap:60px; align-items:start; }
        .founder-content h3{ font-size:28px; font-weight:700; margin:0 0 4px; color:var(--white); }
        .founder-content .title{ font-size:15px; color:var(--gold); font-weight:500; margin-bottom:16px; }
        .founder-content p{ font-size:15px; color:rgba(255,255,255,0.65); line-height:1.7; margin-bottom:14px; }
        .founder-stats{ display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:20px; }
        .founder-stat{ background:var(--black); padding:14px 18px; border-radius:12px; border:1px solid var(--line); opacity: 0; transform: translateY(10px); transition: opacity 0.5s ease, transform 0.5s ease; }
        .founder-stat.visible{ opacity: 1; transform: translateY(0); }
        .founder-stat .num{ font-family:'Space Grotesk'; font-size:20px; font-weight:700; color:var(--gold); }
        .founder-stat .lbl{ font-size:12px; color:rgba(255,255,255,0.5); }

        .cta-banner{
          margin:0 48px 100px; border-radius:24px; padding:64px;
          background:linear-gradient(120deg, #1a1a1a 0%, #0a0a0a 60%, #1a1a1a 100%);
          position:relative; overflow:hidden; color:var(--white);
          display:flex; align-items:center; justify-content:space-between; gap:40px; border:1px solid var(--line);
          opacity: 0; transform: scale(0.94); transition: opacity 0.7s cubic-bezier(.22,.61,.36,1), transform 0.7s cubic-bezier(.22,.61,.36,1);
        }
        .cta-banner.reveal-visible{ opacity: 1; transform: scale(1); }
        .cta-banner::after{ content:''; position:absolute; width:400px; height:400px; border-radius:50%; background:radial-gradient(circle, rgba(201,162,39,0.08), transparent 70%); top:-160px; right:-100px; }
        .cta-banner h2{ font-size:32px; max-width:460px; margin:0 0 8px; position:relative; z-index:1; }
        .cta-banner p{ color:rgba(255,255,255,0.6); max-width:420px; margin:0; position:relative; z-index:1; }
        .cta-actions{ position:relative; z-index:1; display:flex; gap:14px; flex-shrink:0; }

        .footer{ background:var(--black); color:rgba(255,255,255,0.6); padding:64px 48px 32px; border-top:1px solid var(--line); }
        .footer-top{ display:grid; grid-template-columns:1.4fr 1fr 1fr 1fr; gap:40px; margin-bottom:56px; }
        .footer-brand-text{ font-size:13.5px; line-height:1.7; margin-top:16px; max-width:280px; }
        .footer-col h4{ color:var(--white); font-size:13.5px; margin:0 0 18px; letter-spacing:0.04em; text-transform:uppercase; font-family:'IBM Plex Mono', monospace; }
        .footer-col a{ display:block; font-size:14px; margin-bottom:12px; color:rgba(255,255,255,0.6); transition:color .25s ease; }
        .footer-col a:hover{ color:var(--gold-bright); }
        .footer-bottom{ display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--line); padding-top:28px; font-size:12.5px; }
        .footer-bottom .rc{ color:var(--gold-bright); }
        .footer-logo-mark{ transition: transform 0.3s ease; display:inline-block; }
        .footer-logo-mark:hover{ transform: scale(1.1) rotate(-5deg); }

        @media (max-width:980px){
          .hero-inner{ grid-template-columns:1fr; }
          .hero h1{ font-size:40px; }
          .hero-visual{ height:420px; margin-top:40px; }
          .stats-grid{ grid-template-columns:1fr 1fr; }
          .stat-card-main{ grid-column:span 2; grid-row:auto; }
          .brands-grid{ grid-template-columns:1fr; }
          .brand-card-full{ grid-column:span 1; }
          .brand-card-image-wrapper{ height:180px; }
          .brand-card-full .brand-card-image-wrapper{ height:200px; }
          .gallery-grid{ grid-template-columns:1fr 1fr; }
          .process-grid{ grid-template-columns:1fr 1fr; row-gap:40px; }
          .process-line{ display:none; }
          .process-head{ grid-template-columns:1fr; }
          .cta-banner{ flex-direction:column; align-items:flex-start; padding:40px; margin:0 20px 60px; }
          .footer-top{ grid-template-columns:1fr 1fr; }
          .section{ padding:72px 24px; }
          .hero{ padding:32px 24px 72px; }
          .hero-badge-1{ left:10px; }
          .hero-badge-2{ right:10px; }
          .founder-grid{ grid-template-columns:1fr; }
        }
        @media (max-width:600px){
          .gallery-grid{ grid-template-columns:1fr; }
          .founder-stats{ grid-template-columns:1fr; }
          .brand-card-image-wrapper{ height:160px; }
          .brand-card-body{ padding:20px; }
        }
        @media (prefers-reduced-motion: reduce){
          .reveal, .reveal-scale, .reveal-slide-right, .reveal-slide-left, .reveal-fade-up, .reveal-scale-in,
          .hero-visual, .hero-art-secondary, .hero-badge, .cta-banner, .founder-stat,
          .hero-line-draw, .hero-ring-draw, .stat-card, .gallery-art-svg{ transition:none !important; animation:none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      <div className="progress-thread" style={{ transform: `scaleY(${progress})` }} />

      <NavBar scrolled={scrolled} />

      <HeroSection />

      {/* ABOUT / STATS */}
      <section className="stats-wrap" id="about" ref={statsRef}>
        <div className="section">
          <div className={`section-head reveal ${statsVisible ? "reveal-visible" : ""}`}>
            <h2>About Celetex Group</h2>
            <p style={{ transitionDelay: "150ms" }} className={`reveal ${statsVisible ? "reveal-visible" : ""}`}>
              Founded on 9th March 2022 by Rtr. Onyekachi Uchechukwu Celestine,
              a visionary entrepreneur committed to innovation, excellence, and
              sustainable business growth.
              <a href="#contact" className="btn btn-ghost-dark nav-rc" style={{ marginLeft: 12 }}>
                RC: 9341015
              </a>
            </p>
          </div>

          <div className="stats-grid">
            <div className={`stat-card stat-card-main reveal ${statsVisible ? "reveal-visible" : ""}`}>
              <div className="stat-brand">
                <span className="nav-logo-mark" style={{ width: 30, height: 30, fontSize: 14 }}>C</span>
                Celetex Group
              </div>
              <div>
                <StatNumber value={2022} suffix="" decimals={0} delay={200} />
                <div className="stat-desc">Founded with a vision to create impactful solutions across multiple industries.</div>
              </div>
            </div>

            <div className={`stat-card reveal ${statsVisible ? "reveal-visible" : ""}`} style={{ transitionDelay: "120ms" }}>
              <div className="stat-icon-row"><div className="stat-icon-box"><Building2 size={18} /></div></div>
              <div className="stat-label">Portfolio</div>
              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)", marginTop: 8, lineHeight: 1.6 }}>
                4 distinct brands delivering value across media, real estate, travel, and e-commerce.
              </p>
            </div>

            <div className={`stat-card dark reveal ${statsVisible ? "reveal-visible" : ""}`} style={{ transitionDelay: "240ms" }}>
              <StatNumber value={100} suffix="+" delay={400} />
              <div className="stat-label" style={{ color: "rgba(255,255,255,0.6)" }}>Clients Served</div>
            </div>

            <div className={`stat-card dark reveal ${statsVisible ? "reveal-visible" : ""}`} style={{ transitionDelay: "360ms" }}>
              <StatNumber value={5} suffix="+" delay={600} />
              <div className="stat-label" style={{ color: "rgba(255,255,255,0.6)" }}>Industry Sectors</div>
            </div>

            <div className={`stat-card reveal ${statsVisible ? "reveal-visible" : ""}`} style={{ transitionDelay: "480ms" }}>
              <div className="stat-icon-row"><div className="stat-icon-box"><Award size={18} /></div></div>
              <div className="stat-label">Recognition</div>
              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)", marginTop: 8, lineHeight: 1.6 }}>
                Award-winning entrepreneur with merit honors from various organizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <VideoSection />

      {/* CYBERMALL APP — Updated with Tracking Logistics */}
      <CybermallAppSection />

      {/* BRANDS */}
      <section className="section" id="brands" ref={brandsRef}>
        <div className={`reveal ${brandsVisible ? "reveal-visible" : ""}`}>
          <Eyebrow>Our Brands</Eyebrow>
        </div>
        <div className={`section-head reveal ${brandsVisible ? "reveal-visible" : ""}`} style={{ transitionDelay: "100ms" }}>
          <h2>Diverse Ventures, Unified Vision.</h2>
          <p>From creative media to real estate, travel, and digital commerce — our brands deliver innovative solutions across multiple sectors.</p>
        </div>

        <div className="brands-grid">
          {brands.map((b, i) => (
            <div
              key={b.title}
              className={`reveal ${brandsVisible ? "reveal-visible" : ""} ${i === 0 ? "brand-card-full" : ""}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="brand-card" ref={b.tilt.ref} onMouseMove={b.tilt.onMouseMove} onMouseLeave={b.tilt.onMouseLeave}>
                <div className="brand-card-image-wrapper">
                  <img src={b.icon} alt={b.title} loading="lazy" />
                  <div className="brand-card-image-overlay" />
                  <span className="brand-card-image-badge">{b.title.split(" ")[0]}</span>
                </div>
                <div className="brand-card-body">
                  <h3><span>{b.title.split(" ")[0]}</span> {b.title.split(" ").slice(1).join(" ")}</h3>
                  <p>{b.desc}</p>
                  <a href="#contact" className="brand-link">Learn More <ArrowUpRight size={15} /></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="gallery-grid">
          {brands.map((b, i) => (
            <Reveal key={`gallery-${i}`} delay={i * 90}>
              <div className="gallery-card">
                <div className="gallery-art-wrap"><GalleryArt variant={b.variant} /></div>
                <div className="gallery-body">
                  <h4>{b.title}</h4>
                  <p>{b.desc.slice(0, 70)}...</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FOUNDER */}
      <section
        className="section"
        style={{ background: "var(--charcoal)", borderRadius: "24px", padding: "80px 48px" }}
        ref={founderRef}
      >
        <div className={`text-center reveal ${founderVisible ? "reveal-visible" : ""}`} style={{ marginBottom: 48 }}>
          <Eyebrow>Meet the Founder</Eyebrow>
          <h2 style={{ fontSize: 38, fontWeight: 700, marginTop: 8, color: "var(--white)" }}>
            Rtr. Onyekachi Uchechukwu Celestine
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)" }}>Visionary Entrepreneur · Founder, Celetex Group</p>
        </div>

        <div className="founder-grid">
          <div className={`reveal ${founderVisible ? "reveal-visible" : ""}`}>
            <div className="relative overflow-hidden rounded-2xl bg-[#1a1a1a] shadow-2xl">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#2a2a2a]">
                <img
                  src={images.Agu}
                  alt="Onyekachi Celestine - Founder of Celetex Group"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/95 via-[#1a1a1a]/40 to-transparent" />
                <div className="absolute top-4 right-4 z-20 bg-[#1a1a1a]/90 border border-white/10 rounded-lg px-3 py-1.5 shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#C9A227] rounded-full" />
                    <span className="text-white/70 text-[9px] font-mono tracking-[0.15em] uppercase">Celetex Group</span>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center justify-end pb-10 pt-20 bg-gradient-to-t from-[#1a1a1a]/90 via-[#1a1a1a]/40 to-transparent">
                  <div className="text-center space-y-3 w-full px-6">
                    <div className="w-16 h-[2px] bg-gradient-to-r from-[#C9A227] to-[#F3D27A] mx-auto rounded-full" />
                    <span className="block text-[#F3D27A] text-[11px] font-mono tracking-[0.2em] uppercase">Founder & CEO</span>
                    <h3 className="text-white text-2xl md:text-3xl font-display font-bold leading-tight">Onyekachi Celestine</h3>
                    <div className="flex items-center justify-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]/50" />
                      <span className="text-white/60 text-[11px] font-mono tracking-wider">Diverse Ventures, Unified Vision</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]/50" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A227] to-transparent" />
            </div>
          </div>

          <div className={`reveal ${founderVisible ? "reveal-visible" : ""}`} style={{ transitionDelay: "120ms" }}>
            <div className="founder-content">
              <h3>Rtr. Onyekachi Uchechukwu Celestine</h3>
              <div className="title">Founder, Celetex Group of Company Limited</div>
              <p>
                Rtr. Onyekachi Uchechukwu Celestine is a visionary entrepreneur, media professional, technology
                enthusiast, and business strategist. He is the Founder of <strong>Celetex Group</strong> — a growing
                conglomerate driven by the motto, <em>"Diverse Ventures, Unified Vision."</em>
              </p>
              <p>
                A native of Odenkume, Obowo LGA, Imo State, he was raised in Anambra State, where he developed his
                entrepreneurial mindset and business network. He holds a degree in <strong> Computer Science</strong> from
                Abia State University.
              </p>
              <p>
                Through Celetex Group, he oversees brands including <strong>Celetex Media</strong>,
                <strong> Celetex Travels and Tours</strong>, <strong> Celetex Signature Homes</strong>, and{" "}
                <strong>Cybermall</strong>, delivering innovative solutions across media, technology, real estate,
                travel, and commerce.
              </p>
              <p>
                Recognized with several awards and merit honors from various organizations and institutions, he is
                also committed to youth development, mentorship, innovation, and entrepreneurship, inspiring others
                through leadership, resilience, and service.
              </p>

              <div className="founder-stats">
                {[
                  { num: "2022", lbl: "Year Founded" },
                  { num: "4", lbl: "Group Companies" },
                  { num: "CS", lbl: "Computer Science Degree" },
                  { num: "Imo", lbl: "State of Origin" },
                ].map((stat, i) => (
                  <div key={i} className={`founder-stat ${founderVisible ? "visible" : ""}`} style={{ transitionDelay: `${600 + i * 100}ms` }}>
                    <div className="num">{stat.num}</div>
                    <div className="lbl">{stat.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="process-wrap" id="process" ref={processRef}>
        <div className="section">
          <div className={`process-head reveal ${processVisible ? "reveal-visible" : ""}`}>
            <div>
              <Eyebrow>Our Process</Eyebrow>
              <h2>How We Build Brands That Last.</h2>
            </div>
            <p>Every brand under the Celetex umbrella follows a proven framework — from vision to execution, we ensure excellence at every step.</p>
          </div>

          <div className="process-grid">
            <ProcessLine />
            {process.map((step, i) => (
              <div key={step.n} className={`process-step reveal ${processVisible ? "reveal-visible" : ""}`} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="process-num">{step.n}</div>
                <div className="process-icon"><step.icon size={20} /></div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <div ref={ctaRef}>
        <div className={`cta-banner ${ctaVisible ? "reveal-visible" : ""}`} id="contact">
          <div>
            <h2>Ready to partner with Celetex Group?</h2>
            <p>Connect with us today and let's build something extraordinary together.</p>
          </div>
          <div className="cta-actions">
            <a href="mailto:Celetexgroup@gmail.com" className="btn btn-gold"><Mail size={16} /> Email Us</a>
            <a href="tel:08140784286" className="btn btn-ghost-dark"><Phone size={16} /> Call Now</a>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top">
          <div>
            <div className="nav-logo">
              <span className="nav-logo-mark footer-logo-mark">
                <img src={images.Logo1} alt="Celetex Group Logo" className="w-full h-full object-cover rounded-lg" />
              </span>
              <span className="nav-logo-text" style={{ color: "#fff" }}>Celetex <span>Group</span></span>
            </div>
            <p className="footer-brand-text">
              A diversified business conglomerate delivering innovative solutions across media, real estate, travel, and digital commerce.
            </p>
            <p style={{ fontSize: 12, marginTop: 12, color: "rgba(255,255,255,0.4)" }}>RC: <span className="rc">9341015</span></p>
          </div>
          <div className="footer-col">
            <h4>Our Brands</h4>
            <a href="#">Celetex Multimedia</a>
            <a href="#">Celetex Signature Homes</a>
            <a href="#">Celetex Travels and Tours</a>
            <a href="#">Cybermall</a>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a href="mailto:Celetexgroup@gmail.com">Celetexgroup@gmail.com</a>
            <a href="tel:08140784286">0814 078 4286</a>
            <a href="tel:08123676517">0812 367 6517</a>
            <a href="#">@Celetex_group (FB/IG)</a>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <a href="#about">About Us</a>
            <a href="#brands">Our Brands</a>
            <a href="#cybermall-app">Cybermall App</a>
            <a href="#process">Our Process</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Celetex Group of Company Limited. All rights reserved.</span>
          <span className="mono">Black · Gold · White</span>
        </div>
      </footer>
    </div>
  );
}