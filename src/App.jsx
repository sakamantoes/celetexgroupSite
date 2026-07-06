import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useAnimation,
  useInView,
  AnimatePresence,
} from "framer-motion";
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
  Camera,
  Home,
  Plane,
  ShoppingBag,
  Zap,
  Coffee,
  Play,
  Volume2,
  VolumeX,
  ChevronDown,
} from "lucide-react";
import images from "./assets/image";

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
      { threshold },
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
    [strength],
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

// Framer Motion variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] },
  },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] },
  },
};

const mobileMenuVariants = {
  hidden: {
    opacity: 0,
    clipPath: "inset(0 0 100% 0)",
    transition: { duration: 0.4, ease: [0.22, 0.61, 0.36, 1] },
  },
  visible: {
    opacity: 1,
    clipPath: "inset(0 0 0% 0)",
    transition: {
      duration: 0.5,
      ease: [0.22, 0.61, 0.36, 1],
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const mobileMenuItem = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.22, 0.61, 0.36, 1] },
  },
};

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

// Framer Motion version of Reveal
function MotionReveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  ...props
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Tag ref={ref} className={className} {...props}>
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeUp}
        transition={{ delay: delay / 1000 }}
      >
        {children}
      </motion.div>
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

// Framer Motion Stat Number
function MotionStatNumber({ value, suffix = "", decimals = 0, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const count = useCountUp(value, isInView);

  return (
    <motion.span
      ref={ref}
      className="stat-number"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {count.toFixed(decimals)}
      {suffix}
    </motion.span>
  );
}

/* ----------------------------------------------------------------------
   RESPONSIVE NAVIGATION
---------------------------------------------------------------------- */

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Our Brands", href: "#brands" },
    { label: "Process", href: "#process" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <motion.nav
        className={`nav ${scrolled ? "scrolled" : ""}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <div className="nav-container">
          {/* Logo */}
          <div className="nav-logo">
            <motion.span
              className="nav-logo-mark"
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ duration: 0.3 }}
            >
              <img src={images.Logo1} alt="" />
            </motion.span>
            <span className="nav-logo-text">
              Celetex <span>Group</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="nav-links-desktop">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="nav-cta">
            <motion.a
              href="#contact"
              className="btn btn-gold nav-cta-btn"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Get in Touch <ArrowRight size={16} />
            </motion.a>
            <motion.button
              className="menu-toggle"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              whileTap={{ scale: 0.9 }}
            >
              <Menu size={24} />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
          >
            <div className="mobile-menu-header">
              <div className="nav-logo">
                <span className="nav-logo-mark">C</span>
                <span className="nav-logo-text" style={{ color: "#fff" }}>
                  Celetex <span>Group</span>
                </span>
              </div>
              <motion.button
                className="mobile-menu-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={28} />
              </motion.button>
            </div>

            <div className="mobile-menu-body">
              <motion.div
                className="mobile-menu-links"
                variants={staggerChildren}
              >
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    className="mobile-menu-link"
                    variants={mobileMenuItem}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="mobile-menu-link-number">
                      0{index + 1}
                    </span>
                    <span className="mobile-menu-link-label">{link.label}</span>
                    <ArrowUpRight
                      size={20}
                      className="mobile-menu-link-arrow"
                    />
                  </motion.a>
                ))}
              </motion.div>

              <motion.div
                className="mobile-menu-footer"
                variants={fadeUp}
                transition={{ delay: 0.4 }}
              >
                <div className="mobile-menu-contact">
                  <a
                    href="mailto:Celetexgroup@gmail.com"
                    className="mobile-menu-email"
                  >
                    <Mail size={18} /> Celetexgroup@gmail.com
                  </a>
                  <a href="tel:08140784286" className="mobile-menu-phone">
                    <Phone size={18} /> 0814 078 4286
                  </a>
                </div>
                <div className="mobile-menu-social">
                  <span className="mobile-menu-rc">RC: 9341015</span>
                  <div className="mobile-menu-social-icons">
                    <a href="#" aria-label="Facebook">
                      FB
                    </a>
                    <a href="#" aria-label="Instagram">
                      IG
                    </a>
                    <a href="#" aria-label="Twitter">
                      TW
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* Nav Container */
        .nav-container {
          max-width: 1360px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0;
        }

        /* Desktop Navigation */
        .nav-links-desktop {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-link {
          color: rgba(0, 0, 0, 0.65);
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
          left: 0;
          bottom: -2px;
          width: 0;
          height: 2px;
          background: var(--gold);
          transition: width 0.3s ease;
        }

        .nav-link:hover {
          color: var(--black);
        }

        .nav-link:hover::after {
          width: 100%;
        }

        /* Mobile Menu */
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--black);
          z-index: 100;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .mobile-menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          flex-shrink: 0;
        }

        .mobile-menu-close {
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: background 0.3s ease;
        }

        .mobile-menu-close:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .mobile-menu-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px 24px 32px;
        }

        .mobile-menu-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mobile-menu-link {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          border-radius: 12px;
          color: #fff;
          text-decoration: none;
          transition: background 0.3s ease;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 20px;
          font-weight: 500;
          letter-spacing: -0.02em;
          position: relative;
          border: 1px solid transparent;
        }

        .mobile-menu-link:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(201, 162, 39, 0.2);
        }

        .mobile-menu-link-number {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          color: var(--gold);
          font-weight: 400;
          letter-spacing: 0.04em;
          opacity: 0.6;
          min-width: 28px;
        }

        .mobile-menu-link-label {
          flex: 1;
        }

        .mobile-menu-link-arrow {
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s ease;
          color: var(--gold);
        }

        .mobile-menu-link:hover .mobile-menu-link-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .mobile-menu-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 24px;
          margin-top: 32px;
        }

        .mobile-menu-contact {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .mobile-menu-contact a {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s ease;
          padding: 8px 0;
        }

        .mobile-menu-contact a:hover {
          color: var(--gold-bright);
        }

        .mobile-menu-social {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .mobile-menu-rc {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          color: var(--gold);
          letter-spacing: 0.06em;
        }

        .mobile-menu-social-icons {
          display: flex;
          gap: 12px;
        }

        .mobile-menu-social-icons a {
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 6px;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(255, 255, 255, 0.02);
        }

        .mobile-menu-social-icons a:hover {
          color: var(--gold-bright);
          border-color: var(--gold);
          background: rgba(201, 162, 39, 0.08);
        }

        /* Responsive */
        @media (max-width: 980px) {
          .nav-links-desktop {
            display: none;
          }

          .nav-rc {
            display: none;
          }

          .nav-cta-btn {
            display: none;
          }

          .menu-toggle {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }

          .nav {
            padding: 16px 24px !important;
          }

          .nav.scrolled {
            padding: 12px 24px !important;
          }
        }

        @media (max-width: 480px) {
          .mobile-menu-body {
            padding: 24px 16px 24px;
          }

          .mobile-menu-link {
            font-size: 17px;
            padding: 14px 16px;
          }

          .mobile-menu-header {
            padding: 16px 16px;
          }
        }

        @media (min-width: 981px) {
          .menu-toggle {
            display: none !important;
          }
        }

        /* Fix for nav sticky */
        .nav {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 48px;
          background: rgba(250, 249, 246, 0);
          transition: all 0.4s ease;
          border-bottom: 1px solid transparent;
        }

        .nav.scrolled {
          background: rgba(250, 249, 246, 0.95);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--line);
          padding: 14px 48px;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .nav-logo-mark {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--gold-bright), var(--gold-deep));
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          color: #fff;
          font-size: 16px;
          flex-shrink: 0;
        }

        .nav-logo-text {
          color: var(--black);
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 18px;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .nav-logo-text span {
          color: var(--gold);
        }

        .nav-cta {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 999px;
          font-size: 13.5px;
          font-weight: 600;
          border: 1px solid transparent;
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          white-space: nowrap;
          text-decoration: none;
        }

        .btn-gold {
          background: linear-gradient(135deg, var(--gold-bright), var(--gold));
          color: #0a0a0a;
        }

        .btn-gold:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(201, 162, 39, 0.35);
        }

        .btn-ghost-dark {
          background: transparent;
          border: 1px solid rgba(0, 0, 0, 0.15);
          color: var(--black);
        }

        .btn-ghost-dark:hover {
          border-color: var(--gold);
          color: var(--gold-deep);
        }

        .menu-toggle {
          background: none;
          border: none;
          color: var(--black);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 600px) {
          .nav-logo-text {
            font-size: 15px;
          }
          .nav-logo-mark {
            width: 30px;
            height: 30px;
            font-size: 14px;
          }
          .nav {
            padding: 14px 16px !important;
          }
          .nav.scrolled {
            padding: 10px 16px !important;
          }
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
      <rect x="0" y="0" width="520" height="620" rx="18" fill="#F8F6F0" />
      <rect x="0" y="0" width="520" height="620" rx="18" fill="url(#gGlow)" />
      <g opacity="0.8">
        <rect
          x="60"
          y="330"
          width="60"
          height="220"
          fill="#E8E4DC"
          stroke="url(#gGoldA)"
          strokeWidth="1.2"
        />
        <rect
          x="130"
          y="260"
          width="70"
          height="290"
          fill="#EDE9E1"
          stroke="url(#gGoldA)"
          strokeWidth="1.2"
        />
        <rect
          x="210"
          y="180"
          width="90"
          height="370"
          fill="#F0ECE4"
          stroke="url(#gGoldA)"
          strokeWidth="1.4"
        />
        <rect
          x="310"
          y="240"
          width="66"
          height="310"
          fill="#EDE9E1"
          stroke="url(#gGoldA)"
          strokeWidth="1.2"
        />
        <rect
          x="386"
          y="300"
          width="56"
          height="250"
          fill="#E8E4DC"
          stroke="url(#gGoldA)"
          strokeWidth="1.2"
        />
      </g>
      <g stroke="rgba(201,162,39,0.25)" strokeWidth="1">
        {Array.from({ length: 9 }).map((_, r) =>
          Array.from({ length: 4 }).map((_, c) => (
            <rect
              key={`${r}-${c}`}
              x={222 + c * 18}
              y={200 + r * 36}
              width="10"
              height="18"
              fill={
                (r + c) % 3 === 0 ? "rgba(201,162,39,0.4)" : "rgba(0,0,0,0.04)"
              }
            />
          )),
        )}
      </g>
      <g
        stroke="url(#gGoldA)"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      >
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
      {Array.from({ length: 8 }).map((_, i) => {
        const pts = [
          [40, 560],
          [110, 520],
          [175, 540],
          [235, 470],
          [300, 495],
          [365, 410],
          [430, 440],
          [470, 360],
        ];
        return (
          <circle
            key={i}
            cx={pts[i][0]}
            cy={pts[i][1]}
            r="4"
            fill="#F8F6F0"
            stroke="#C9A227"
            strokeWidth="2"
          />
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
          <stop offset="0%" stopColor="#C9A227" />
          <stop offset="100%" stopColor="#8C6A22" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="360" height="300" rx="16" fill="#EDE9E1" />
      <circle
        cx="120"
        cy="130"
        r="46"
        fill="none"
        stroke="url(#gGoldB)"
        strokeWidth="2"
      />
      <circle
        cx="120"
        cy="130"
        r="46"
        fill="none"
        stroke="url(#gGoldB)"
        strokeWidth="2"
        strokeDasharray="290"
        strokeDashoffset="70"
        className="hero-ring-draw"
      />
      <circle
        cx="120"
        cy="130"
        r="18"
        fill="#F8F6F0"
        stroke="url(#gGoldB)"
        strokeWidth="1.5"
      />
      <g stroke="url(#gGoldB)" strokeWidth="1.6" fill="none">
        <line x1="166" y1="130" x2="230" y2="90" />
        <line x1="166" y1="130" x2="230" y2="170" />
        <line x1="166" y1="112" x2="230" y2="60" />
      </g>
      <circle cx="230" cy="90" r="6" fill="#C9A227" />
      <circle cx="230" cy="170" r="6" fill="#C9A227" />
      <circle cx="230" cy="60" r="6" fill="#C9A227" />
      <text
        x="30"
        y="250"
        fill="#1a1a1a"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="11"
        letterSpacing="2"
      >
        CELETEX / EST. 202
      </text>
      <text
        x="30"
        y="268"
        fill="rgba(0,0,0,0.4)"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="11"
      >
        DIVERSE VENTURES, UNIFIED VISION
      </text>
    </svg>
  );
}

function GalleryArt({ variant }) {
  const palette = {
    media: { a: "#C9A227", b: "#8C6A22" },
    travels: { a: "#C9A227", b: "#8C6A22" },
    homes: { a: "#C9A227", b: "#8C6A22" },
    cybermall: { a: "#C9A227", b: "#8C6A22" },
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
      {variant === "media" && (
        <g>
          <rect
            x="50"
            y="40"
            width="300"
            height="180"
            rx="8"
            fill="#EDE9E1"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1.4"
          />
          <circle
            cx="100"
            cy="130"
            r="36"
            fill="#E8E4DC"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1.2"
          />
          <circle
            cx="100"
            cy="130"
            r="18"
            fill="#D8D0C0"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1"
          />
          <rect
            x="150"
            y="90"
            width="30"
            height="80"
            rx="2"
            fill="#D8D0C0"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1"
          />
          <rect
            x="190"
            y="70"
            width="30"
            height="100"
            rx="2"
            fill="#D8D0C0"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1"
          />
          <rect
            x="230"
            y="100"
            width="30"
            height="70"
            rx="2"
            fill="#D8D0C0"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1"
          />
          <rect
            x="270"
            y="85"
            width="30"
            height="85"
            rx="2"
            fill="#D8D0C0"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1"
          />
          <path
            d="M60 220 L340 220"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1.5"
            strokeDasharray="4 6"
            opacity="0.5"
          />
        </g>
      )}
      {variant === "travels" && (
        <g>
          <path
            d="M60 140 L140 60 L280 60 L340 140 L280 220 L140 220 Z"
            fill="#EDE9E1"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1.4"
          />
          <circle
            cx="170"
            cy="140"
            r="30"
            fill="none"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1.2"
          />
          <circle
            cx="230"
            cy="140"
            r="30"
            fill="none"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1.2"
          />
          <path
            d="M170 110 L230 110 L230 170 L170 170 Z"
            fill="none"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1.2"
          />
          <line
            x1="200"
            y1="90"
            x2="200"
            y2="60"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1.2"
          />
          <line
            x1="185"
            y1="60"
            x2="215"
            y2="60"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1.2"
          />
          <line
            x1="140"
            y1="80"
            x2="140"
            y2="120"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1"
            opacity="0.4"
          />
        </g>
      )}
      {variant === "homes" && (
        <g>
          <rect
            x="60"
            y="100"
            width="280"
            height="130"
            fill="#EDE9E1"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1.4"
            rx="4"
          />
          <polygon
            points="60,100 200,40 340,100"
            fill="#D8D0C0"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1.4"
          />
          <rect
            x="120"
            y="150"
            width="40"
            height="80"
            fill="#D8D0C0"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1"
          />
          <rect
            x="240"
            y="150"
            width="40"
            height="80"
            fill="#D8D0C0"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1"
          />
          <rect
            x="175"
            y="140"
            width="50"
            height="40"
            fill="#D8D0C0"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1"
          />
          <rect
            x="185"
            y="150"
            width="30"
            height="30"
            fill="#E8E4DC"
            stroke={`url(#grad-${variant})`}
            strokeWidth="0.8"
          />
        </g>
      )}
      {variant === "cybermall" && (
        <g>
          <rect
            x="60"
            y="50"
            width="280"
            height="160"
            rx="8"
            fill="#EDE9E1"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1.4"
          />
          <rect
            x="80"
            y="70"
            width="60"
            height="40"
            rx="4"
            fill="#D8D0C0"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1"
          />
          <rect
            x="155"
            y="70"
            width="60"
            height="40"
            rx="4"
            fill="#D8D0C0"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1"
          />
          <rect
            x="230"
            y="70"
            width="60"
            height="40"
            rx="4"
            fill="#D8D0C0"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1"
          />
          <rect
            x="80"
            y="125"
            width="60"
            height="40"
            rx="4"
            fill="#D8D0C0"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1"
          />
          <rect
            x="155"
            y="125"
            width="60"
            height="40"
            rx="4"
            fill="#D8D0C0"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1"
          />
          <rect
            x="230"
            y="125"
            width="60"
            height="40"
            rx="4"
            fill="#D8D0C0"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1"
          />
          <circle
            cx="310"
            cy="90"
            r="12"
            fill="none"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1.5"
          />
          <circle
            cx="310"
            cy="150"
            r="12"
            fill="none"
            stroke={`url(#grad-${variant})`}
            strokeWidth="1.5"
          />
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="video-section" ref={ref}>
      <motion.div
        className="video-wrapper"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeUp}
        transition={{ duration: 0.8 }}
      >
        <div className="video-container">
          <video
            ref={videoRef}
            className="video-element"
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg?auto=compress&cs=tinysrgb&w=1200"
          >
            <source
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          <motion.div
            className="video-overlay"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <div className="video-overlay-content">
              <motion.div
                className="video-brand-icon"
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.3,
                  ease: [0.22, 0.61, 0.36, 1],
                }}
              >
                C
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Celetex Group
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                Diverse Ventures, Unified Vision
              </motion.p>
            </div>
          </motion.div>

          <div className="video-controls">
            <motion.button
              className="video-control-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              )}
            </motion.button>
            <motion.button
              className="video-control-btn"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMuted ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </motion.button>
            <span className="video-loop-indicator">⟳ Loop</span>
          </div>

          <div className="video-accent-line" />
        </div>
      </motion.div>

      <style>{`
        .video-section {
          max-width: 1360px;
          margin: 0 auto;
          padding: 40px 48px 60px;
        }

        .video-wrapper {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.8s cubic-bezier(0.2, 0.7, 0.2, 1), 
                      transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
        }

        .video-wrapper.reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .video-container {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          background: var(--black);
          border: 1px solid var(--line);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
          aspect-ratio: 16/9;
        }

        .video-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(10, 10, 10, 0.3) 0%,
            rgba(10, 10, 10, 0.1) 50%,
            rgba(10, 10, 10, 0.3) 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .video-overlay-content {
          text-align: center;
          color: white;
          padding: 20px;
        }

        .video-brand-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 16px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--gold-bright), var(--gold));
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #0a0a0a;
          box-shadow: 0 8px 30px rgba(201, 162, 39, 0.3);
        }

        .video-overlay-content h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 6px;
          letter-spacing: -0.02em;
          text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
        }

        .video-overlay-content p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
          letter-spacing: 0.1em;
          font-weight: 300;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .video-controls {
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 2;
          pointer-events: none;
        }

        .video-control-btn {
          pointer-events: auto;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .video-control-btn:hover {
          background: rgba(201, 162, 39, 0.4);
          border-color: var(--gold-bright);
          transform: scale(1.05);
        }

        .video-loop-indicator {
          pointer-events: none;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          font-family: 'IBM Plex Mono', monospace;
          letter-spacing: 0.06em;
          margin-left: auto;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(4px);
          padding: 4px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .video-accent-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--gold-bright), var(--gold), var(--gold-deep));
          z-index: 1;
          opacity: 0.6;
        }

        @media (max-width: 768px) {
          .video-section {
            padding: 20px 20px 40px;
          }
          
          .video-overlay-content h3 {
            font-size: 20px;
          }
          
          .video-brand-icon {
            width: 44px;
            height: 44px;
            font-size: 20px;
          }
          
          .video-controls {
            bottom: 12px;
            left: 12px;
            right: 12px;
          }
          
          .video-control-btn {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </section>
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
  const tiltD = useTilt(8);
  const tiltG1 = useTilt(6);
  const tiltG2 = useTilt(6);
  const tiltG3 = useTilt(6);
  const tiltG4 = useTilt(6);

  const brands = [
    {
      icon: Camera,
      title: "Celetex Multimedia",
      desc: "Full-service multimedia and creative agency specializing in branding, graphic design, website development, cinematography, photography, digital marketing, content creation, and strategic communications.",
      tilt: tiltA,
      variant: "media",
    },
    {
      icon: Plane,
      title: "Celetex Travels and Tours",
      desc: "Travel solutions company providing reliable travel consultancy, tour planning, visa assistance, vacation packages, and corporate travel management for local and international destinations.",
      tilt: tiltB,
      variant: "travels",
    },
    {
      icon: Home,
      title: "Celetex Signature Homes",
      desc: "Premium real estate brand focused on property development, real estate consultancy, construction, property management, interior design, and investment advisory services.",
      tilt: tiltC,
      variant: "homes",
    },
    {
      icon: ShoppingBag,
      title: "Cybermall",
      desc: "Innovative digital commerce platform connecting buyers and sellers through a seamless online marketplace experience, integrating e-commerce, logistics, and product discovery.",
      tilt: tiltD,
      variant: "cybermall",
    },
  ];

  const process = [
    {
      n: "01",
      title: "Discovery & Assessment",
      desc: "We study your goals, constraints, and market to define what success looks like.",
      icon: Target,
    },
    {
      n: "02",
      title: "Strategy & Design",
      desc: "Every plan is mapped in detail — budgets, timelines, and risk built in from day one.",
      icon: Layers,
    },
    {
      n: "03",
      title: "Execution & Delivery",
      desc: "Our teams build, implement, and manage with precision and constant communication.",
      icon: Rocket,
    },
    {
      n: "04",
      title: "Support & Optimization",
      desc: "We stay engaged after delivery, refining performance long after launch.",
      icon: HeartHandshake,
    },
  ];

  // Refs for Framer Motion
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const brandsRef = useRef(null);
  const founderRef = useRef(null);
  const processRef = useRef(null);
  const ctaRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, amount: 0.2 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.2 });
  const brandsInView = useInView(brandsRef, { once: true, amount: 0.2 });
  const founderInView = useInView(founderRef, { once: true, amount: 0.2 });
  const processInView = useInView(processRef, { once: true, amount: 0.2 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.2 });

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
          --gold:#C9A227;
          --gold-bright:#F3D27A;
          --gold-deep:#8C6A22;
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
          background:linear-gradient(180deg, var(--gold-bright), var(--gold) 40%, transparent 100%);
          transform-origin:top; pointer-events:none;
        }

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
          text-transform:uppercase; color:var(--gold); margin-bottom:20px;
        }
        .eyebrow-chip{ width:8px; height:8px; background:var(--gold); border-radius:2px; display:inline-block; }
        .hero h1{
          font-size:56px; line-height:1.08; font-weight:700; margin:0 0 22px;
        }
        .hero h1 .accent{
          background:linear-gradient(90deg, var(--gold-bright), var(--gold));
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
          display:flex; align-items:center; justify-content:center; font-size:11px; color:var(--gold-deep); font-weight:600;
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
          width:36px; height:36px; border-radius:10px; background:rgba(201,162,39,0.1);
          display:flex; align-items:center; justify-content:center; color:var(--gold);
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
        .stat-brand{ display:flex; align-items:center; gap:10px; font-family:'Space Grotesk'; font-weight:600; font-size:16px; color:var(--gold-bright); }
        .stat-number{ font-family:'Space Grotesk'; font-weight:700; font-size:52px; display:block; margin:24px 0 8px; }
        .stat-card-main .stat-number{ font-size:64px; }
        .stat-desc{ font-size:14px; color:rgba(255,255,255,0.6); line-height:1.6; max-width:260px; }
        .stat-icon-row{ display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
        .stat-icon-box{ width:38px; height:38px; border-radius:10px; background:rgba(201,162,39,0.08); display:flex; align-items:center; justify-content:center; color:var(--gold); }
        .stat-label{ font-size:13px; color:rgba(0,0,0,0.5); margin-top:8px; }
        .stat-card.dark .stat-label{ color:rgba(255,255,255,0.5); }

        /* BRANDS / SERVICES */
        .brands-grid{ display:grid; grid-template-columns:repeat(2, 1fr); gap:24px; }
        .brand-card{
          background:var(--white); border:1px solid var(--line); border-radius:18px; padding:36px;
          transition:box-shadow .4s ease, border-color .4s ease; will-change:transform;
        }
        .brand-card:hover{ box-shadow:0 24px 50px rgba(0,0,0,0.06); border-color:rgba(201,162,39,0.3); }
        .brand-card-full{ grid-column:span 2; }
        .brand-icon{
          width:52px; height:52px; border-radius:14px; margin-bottom:26px;
          background:linear-gradient(135deg, var(--off), var(--cream));
          display:flex; align-items:center; justify-content:center; color:var(--gold);
        }
        .brand-card h3{ font-size:20px; font-weight:600; margin:0 0 12px; }
        .brand-card h3 span{ color:var(--gold); }
        .brand-card p{ font-size:14.5px; color:rgba(0,0,0,0.6); line-height:1.7; margin:0 0 20px; }
        .brand-link{ display:inline-flex; align-items:center; gap:6px; font-size:14px; font-weight:600; color:var(--gold-deep); }
        .brand-link svg{ transition:transform .3s ease; }
        .brand-card:hover .brand-link svg{ transform:translateX(4px); }

        /* GALLERY / PROJECTS */
        .gallery-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:24px; }
        .gallery-card{ border-radius:18px; overflow:hidden; background:var(--white); border:1px solid var(--line); }
        .gallery-art-wrap{ overflow:hidden; height:180px; }
        .gallery-art-svg{ width:100%; height:100%; display:block; transition:transform .6s ease; }
        .gallery-card:hover .gallery-art-svg{ transform:scale(1.08); }
        .gallery-body{ padding:22px; }
        .gallery-body h4{ font-size:15px; font-weight:600; margin:0 0 6px; }
        .gallery-body p{ font-size:13px; color:rgba(0,0,0,0.6); line-height:1.5; margin:0; }

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
        .process-line-fill{ height:100%; background:linear-gradient(90deg, var(--gold-bright), var(--gold)); width:0%; transition:width 1.4s cubic-bezier(.2,.7,.2,1); }
        .process-step{ padding:0 24px 0 0; position:relative; }
        .process-num{ font-family:'Space Grotesk'; font-size:44px; font-weight:700; color:rgba(255,255,255,0.14); margin-bottom:18px; }
        .process-icon{
          width:44px; height:44px; border-radius:12px; background:rgba(201,162,39,0.12); color:var(--gold-bright);
          display:flex; align-items:center; justify-content:center; margin-bottom:18px; position:relative; z-index:2;
        }
        .process-step h3{ font-size:17px; font-weight:600; margin:0 0 10px; }
        .process-step p{ font-size:13.5px; color:rgba(255,255,255,0.55); line-height:1.6; margin:0; max-width:240px; }

        /* ABOUT FOUNDER */
        .founder-grid{ display:grid; grid-template-columns:1fr 1.2fr; gap:60px; align-items:start; }
        .founder-image-wrap{
          border-radius:20px; overflow:hidden; border:1px solid var(--line);
          background:var(--cream); position:relative;
        }
        .founder-placeholder{
          width:100%; aspect-ratio:3/4; background:linear-gradient(135deg, var(--cream), var(--off));
          display:flex; align-items:center; justify-content:center; flex-direction:column;
          padding:40px; text-align:center;
        }
        .founder-placeholder .initial{
          font-family:'Space Grotesk'; font-size:80px; font-weight:700; color:var(--gold); opacity:0.3;
        }
        .founder-placeholder .label{
          font-size:14px; color:rgba(0,0,0,0.4); margin-top:12px;
        }
        .founder-tag{
          position:absolute; bottom:20px; left:20px;
          background:var(--gold); color:#fff; padding:6px 16px; border-radius:999px;
          font-size:12px; font-weight:600; letter-spacing:0.06em;
        }
        .founder-content h3{ font-size:28px; font-weight:700; margin:0 0 4px; }
        .founder-content .title{ font-size:15px; color:var(--gold); font-weight:500; margin-bottom:16px; }
        .founder-content p{ font-size:15px; color:rgba(0,0,0,0.65); line-height:1.7; margin-bottom:14px; }
        .founder-stats{ display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:20px; }
        .founder-stat{ background:var(--off); padding:14px 18px; border-radius:12px; border:1px solid var(--line); }
        .founder-stat .num{ font-family:'Space Grotesk'; font-size:20px; font-weight:700; color:var(--gold); }
        .founder-stat .lbl{ font-size:12px; color:rgba(0,0,0,0.5); }

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
          background:radial-gradient(circle, rgba(201,162,39,0.1), transparent 70%);
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
        .footer-col a:hover{ color:var(--gold-bright); }
        .footer-bottom{ display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.08); padding-top:28px; font-size:12.5px; }
        .footer-bottom .rc{ color:var(--gold-bright); }

        /* RESPONSIVE */
        @media (max-width:980px){
          .hero-inner{ grid-template-columns:1fr; }
          .hero h1{ font-size:40px; }
          .hero-visual{ height:420px; margin-top:40px; }
          .stats-grid{ grid-template-columns:1fr 1fr; }
          .stat-card-main{ grid-column:span 2; grid-row:auto; }
          .brands-grid{ grid-template-columns:1fr; }
          .brand-card-full{ grid-column:span 1; }
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
        }
        @media (prefers-reduced-motion: reduce){
          .reveal, .hero-line-draw, .hero-ring-draw, .stat-card, .gallery-art-svg{ transition:none !important; animation:none !important; }
        }
      `}</style>

      <motion.div
        className="progress-thread"
        style={{ transform: `scaleY(${progress})` }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: progress }}
        transition={{ duration: 0.1 }}
      />

      {/* NAVIGATION */}
      <NavBar />

      {/* HERO */}
      <section className="hero" id="home" ref={heroRef}>
        <div className="hero-inner">
          <motion.div
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={fadeUp}
            transition={{ duration: 0.7 }}
          >
            <Eyebrow>Diverse Ventures, Unified Vision</Eyebrow>
            <h1>
              Building a legacy of innovation{" "}
              <span className="accent">across Africa.</span>
            </h1>
            <p className="lead">
              Celetex Group is a diversified business conglomerate delivering
              innovative solutions across media, real estate, travel, and
              digital commerce — empowering individuals, businesses, and
              communities.
            </p>
            <div className="hero-ctas">
              <motion.a
                href="#contact"
                className="btn btn-gold"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Explore Our Brands <ArrowRight size={16} />
              </motion.a>
              <motion.a
                href="#about"
                className="btn btn-ghost-dark"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                About Us
              </motion.a>
            </div>
            <div className="hero-meta">
              <div className="hero-avatars">
                <span>CK</span>
                <span>CO</span>
                <span>CE</span>
              </div>
              <div className="hero-meta-text">
                Founded <b>2022</b> · RC: <b>9341015</b>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={scaleUp}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="hero-art-primary">
              <HeroArtPrimary />
            </div>
            <motion.div
              className="hero-art-secondary"
              initial={{ x: -30, opacity: 0 }}
              animate={heroInView ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <HeroArtSecondary />
            </motion.div>
            <motion.div
              className="hero-badge hero-badge-1"
              initial={{ x: -40, opacity: 0 }}
              animate={heroInView ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="hero-badge-icon">
                <ShieldCheck size={18} />
              </div>
              <div>
                <div className="hero-badge-num">3+ Yrs</div>
                <div className="hero-badge-label">Building Excellence</div>
              </div>
            </motion.div>
            <motion.div
              className="hero-badge hero-badge-2"
              initial={{ x: 40, opacity: 0 }}
              animate={heroInView ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <div className="hero-badge-icon">
                <Users size={18} />
              </div>
              <div>
                <div className="hero-badge-num">4+</div>
                <div className="hero-badge-label">Brands Under One Roof</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT / STATS */}
      <section className="stats-wrap" id="about" ref={statsRef}>
        <div className="section">
          <motion.div
            className="section-head"
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={fadeUp}
          >
            <h2>About Celetex Group</h2>
            <motion.p
              initial="hidden"
              animate={statsInView ? "visible" : "hidden"}
              variants={fadeUp}
              transition={{ delay: 0.15 }}
            >
              Founded on 9th March 2022 by Rtr. Onyekachi Uchechukwu Celestine,
              a visionary entrepreneur committed to innovation, excellence, and
              sustainable business growth.
              <a href="#contact" className="btn btn-ghost-dark nav-rc">
                RC: 9341015
              </a>
            </motion.p>
          </motion.div>

          <motion.div
            className="stats-grid"
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={staggerChildren}
          >
            <motion.div
              variants={staggerItem}
              className="stat-card stat-card-main"
            >
              <div className="stat-brand">
                <span
                  className="nav-logo-mark"
                  style={{ width: 30, height: 30, fontSize: 14 }}
                >
                  C
                </span>
                Celetex Group
              </div>
              <div>
                <MotionStatNumber
                  value={2022}
                  suffix=""
                  decimals={0}
                  delay={0.2}
                />
                <div className="stat-desc">
                  Founded with a vision to create impactful solutions across
                  multiple industries.
                </div>
              </div>
            </motion.div>

            <motion.div variants={staggerItem} className="stat-card">
              <div className="stat-icon-row">
                <div className="stat-icon-box">
                  <Building2 size={18} />
                </div>
              </div>
              <div className="stat-label">Portfolio</div>
              <p
                style={{
                  fontSize: 13.5,
                  color: "rgba(0,0,0,0.55)",
                  marginTop: 8,
                  lineHeight: 1.6,
                }}
              >
                4 distinct brands delivering value across media, real estate,
                travel, and e-commerce.
              </p>
            </motion.div>

            <motion.div variants={staggerItem} className="stat-card dark">
              <MotionStatNumber value={100} suffix="+" delay={0.4} />
              <div
                className="stat-label"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Clients Served
              </div>
            </motion.div>

            <motion.div variants={staggerItem} className="stat-card dark">
              <MotionStatNumber value={5} suffix="+" delay={0.6} />
              <div
                className="stat-label"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Industry Sectors
              </div>
            </motion.div>

            <motion.div variants={staggerItem} className="stat-card">
              <div className="stat-icon-row">
                <div className="stat-icon-box">
                  <Award size={18} />
                </div>
              </div>
              <div className="stat-label">Recognition</div>
              <p
                style={{
                  fontSize: 13.5,
                  color: "rgba(0,0,0,0.55)",
                  marginTop: 8,
                  lineHeight: 1.6,
                }}
              >
                Award-winning entrepreneur with merit honors from various
                organizations.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* VIDEO SECTION */}
      <VideoSection />

      {/* BRANDS */}
      <section className="section" id="brands" ref={brandsRef}>
        <motion.div
          initial="hidden"
          animate={brandsInView ? "visible" : "hidden"}
          variants={fadeUp}
        >
          <Eyebrow>Our Brands</Eyebrow>
        </motion.div>
        <motion.div
          className="section-head"
          initial="hidden"
          animate={brandsInView ? "visible" : "hidden"}
          variants={fadeUp}
          transition={{ delay: 0.1 }}
        >
          <h2>Diverse Ventures, Unified Vision.</h2>
          <p>
            From creative media to real estate, travel, and digital commerce —
            our brands deliver innovative solutions across multiple sectors.
          </p>
        </motion.div>

        <motion.div
          className="brands-grid"
          initial="hidden"
          animate={brandsInView ? "visible" : "hidden"}
          variants={staggerChildren}
        >
          {brands.map((b, i) => (
            <motion.div
              key={b.title}
              variants={staggerItem}
              className={i === 0 ? "brand-card-full" : ""}
            >
              <div
                className="brand-card"
                ref={b.tilt.ref}
                onMouseMove={b.tilt.onMouseMove}
                onMouseLeave={b.tilt.onMouseLeave}
              >
                <motion.div
                  className="brand-icon"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <b.icon size={22} />
                </motion.div>
                <h3>
                  <span>{b.title.split(" ")[0]}</span>{" "}
                  {b.title.split(" ").slice(1).join(" ")}
                </h3>
                <p>{b.desc}</p>
                <motion.a
                  href="#contact"
                  className="brand-link"
                  whileHover={{ x: 4 }}
                >
                  Learn More <ArrowUpRight size={15} />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* GALLERY / BRAND SNAPSHOTS */}
      <section className="section" style={{ paddingTop: 0 }}>
        <motion.div
          className="gallery-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerChildren}
        >
          {brands.map((b, i) => (
            <motion.div
              key={`gallery-${i}`}
              variants={staggerItem}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
            >
              <div className="gallery-card">
                <div className="gallery-art-wrap">
                  <GalleryArt variant={b.variant} />
                </div>
                <div className="gallery-body">
                  <h4>{b.title}</h4>
                  <p>{b.desc.slice(0, 70)}...</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FOUNDER */}
      <motion.section
        className="section"
        style={{
          background: "var(--off)",
          borderRadius: "24px",
          padding: "80px 48px",
        }}
        ref={founderRef}
        initial="hidden"
        animate={founderInView ? "visible" : "hidden"}
        variants={fadeUp}
      >
        <motion.div
          className="text-center"
          style={{ marginBottom: 48 }}
          variants={fadeUp}
        >
          <Eyebrow>Meet the Founder</Eyebrow>
          <h2 style={{ fontSize: 38, fontWeight: 700, marginTop: 8 }}>
            Rtr. Onyekachi Uchechukwu Celestine
          </h2>
          <p style={{ fontSize: 16, color: "rgba(0,0,0,0.55)" }}>
            Visionary Entrepreneur · Founder, Celetex Group
          </p>
        </motion.div>

        <motion.div className="founder-grid" variants={staggerChildren}>
          <motion.div variants={staggerItem}>
            <div className="founder-image-wrap group relative">
              <motion.div
                className="founder-placeholder relative overflow-hidden rounded-2xl shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
              >
                {/* Main Image */}
                <img
                  src={images.Agu}
                  alt="Onyekachi Celestine - Founder of Celetex Group"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient Overlay - Modern Multi-layer */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#C9A227]/10 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-transparent to-[#C9A227]/5" />

                {/* Gold Glow Effect */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl" />
                <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#F3D27A]/5 rounded-full blur-2xl" />

                {/* Corner Accents */}
                <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-[#C9A227]/40 rounded-tl-lg" />
                <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-[#C9A227]/40 rounded-br-lg" />

                {/* Gold Line - Animated */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#C9A227] to-transparent" />

                {/* Floating Badge - Year Established */}
                <div className="absolute top-6 right-6 z-20 bg-black/60 backdrop-blur-md border border-[#C9A227]/30 rounded-xl px-4 py-2 shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#C9A227] rounded-full animate-pulse" />
                    <span className="text-white/80 text-[10px] font-mono tracking-widest">
                      Celetex Group
                    </span>
                  </div>
                </div>

                {/* Main Title Overlay - Bottom Left */}
                <div className="absolute bottom-8 left-8 right-8 z-20">
                  <div className="flex flex-col gap-1">
                    <span className="text-[#F3D27A] text-xs font-mono tracking-[0.2em] uppercase mb-2">
                      Founder & CEO
                    </span>
                    <h3 className="text-white text-2xl md:text-3xl font-display font-bold leading-tight">
                      Onyekachi Celestine
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="w-8 h-[2px] bg-[#C9A227]" />
                      <span className="text-white/60 text-xs font-mono tracking-wider">
                        Diverse Ventures, Unified Vision
                      </span>
                    </div>
                  </div>
                </div>

                {/* Social Badges - Bottom Right */}
                <div className="absolute bottom-8 right-8 z-20 flex gap-2">
                  <motion.a
                    href="#"
                    className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-[#C9A227] hover:border-[#C9A227]/50 transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </motion.a>
                  <motion.a
                    href="#"
                    className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-[#C9A227] hover:border-[#C9A227]/50 transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                    </svg>
                  </motion.a>
                  <motion.a
                    href="#"
                    className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-[#C9A227] hover:border-[#C9A227]/50 transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.634-12.227c.002-.017.002-.034.002-.051.004-.053.004-.106.004-.16A9.86 9.86 0 0024 4.557a9.716 9.716 0 01-2.047.563z" />
                    </svg>
                  </motion.a>
                  <motion.a
                    href="#"
                    className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-[#C9A227] hover:border-[#C9A227]/50 transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </motion.a>
                </div>

                {/* Trust Badge - Bottom Center */}
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 bg-black/50 backdrop-blur-md border mt-2 border-white/10 rounded-full px-5 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#F3D27A] text-xs font-mono tracking-wider">
                      ✦
                    </span>
                    <span className="text-white/70 text-[10px] font-mono tracking-[0.15em] uppercase">
                      Trusted · Innovative · Excellent
                    </span>
                    <span className="text-[#F3D27A] text-xs font-mono tracking-wider">
                      ✦
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Elements - Outside the card */}
              <div className="absolute -top-4 -left-4 w-20 h-20 border-t-2 border-l-2 border-[#C9A227]/20 rounded-tl-xl hidden lg:block" />
              <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-2 border-r-2 border-[#C9A227]/20 rounded-br-xl hidden lg:block" />

              {/* Floating Dot Pattern */}
              <div className="absolute -top-8 -right-8 grid grid-cols-3 gap-1 opacity-20 hidden lg:grid">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#C9A227]"
                  />
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={staggerItem}>
            <div className="founder-content">
              <h3>Rtr. Onyekachi Uchechukwu Celestine</h3>
              <div className="title">
                Founder, Celetex Group of Company Limited
              </div>
              <p>
                Rtr. Onyekachi Uchechukwu Celestine is a visionary entrepreneur,
                media professional, technology enthusiast, and business
                strategist. He is the Founder of <strong>Celetex Group</strong>{" "}
                — a growing conglomerate driven by the motto,{" "}
                <em>"Diverse Ventures, Unified Vision."</em>
              </p>
              <p>
                A native of Odenkume, Obowo LGA, Imo State, he was raised in
                Anambra State, where he developed his entrepreneurial mindset
                and business network. He holds a degree in
                <strong> Computer Science</strong> from Abia State University.
              </p>
              <p>
                Through Celetex Group, he oversees brands including{" "}
                <strong>Celetex Media</strong>,
                <strong> Celetex Travels and Tours</strong>,{" "}
                <strong> Celetex Signature Homes</strong>, and{" "}
                <strong>Cybermall</strong>, delivering innovative solutions
                across media, technology, real estate, travel, and commerce.
              </p>
              <p>
                Recognized with several awards and merit honors from various
                organizations and institutions, he is also committed to youth
                development, mentorship, innovation, and entrepreneurship,
                inspiring others through leadership, resilience, and service.
              </p>

              <div className="founder-stats">
                {[
                  { num: "2022", lbl: "Year Founded" },
                  { num: "4", lbl: "Group Companies" },
                  { num: "CS", lbl: "Computer Science Degree" },
                  { num: "Imo", lbl: "State of Origin" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    className="founder-stat"
                    initial={{ opacity: 0, y: 10 }}
                    animate={founderInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    <div className="num">{stat.num}</div>
                    <div className="lbl">{stat.lbl}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* PROCESS */}
      <section className="process-wrap" id="process" ref={processRef}>
        <div className="section">
          <motion.div
            className="process-head"
            initial="hidden"
            animate={processInView ? "visible" : "hidden"}
            variants={fadeUp}
          >
            <div>
              <Eyebrow>Our Process</Eyebrow>
              <h2>How We Build Brands That Last.</h2>
            </div>
            <p>
              Every brand under the Celetex umbrella follows a proven framework
              — from vision to execution, we ensure excellence at every step.
            </p>
          </motion.div>

          <motion.div
            className="process-grid"
            initial="hidden"
            animate={processInView ? "visible" : "hidden"}
            variants={staggerChildren}
          >
            <ProcessLine />
            {process.map((step, i) => (
              <motion.div
                key={step.n}
                variants={staggerItem}
                className="process-step"
              >
                <div className="process-num">{step.n}</div>
                <motion.div
                  className="process-icon"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <step.icon size={20} />
                </motion.div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA BANNER */}
      <motion.div
        ref={ctaRef}
        initial="hidden"
        animate={ctaInView ? "visible" : "hidden"}
        variants={scaleUp}
        transition={{ duration: 0.7 }}
      >
        <div className="cta-banner" id="contact">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              Ready to partner with Celetex Group?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={ctaInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
            >
              Connect with us today and let's build something extraordinary
              together.
            </motion.p>
          </div>
          <motion.div
            className="cta-actions"
            initial={{ opacity: 0, x: 20 }}
            animate={ctaInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
          >
            <motion.a
              href="mailto:Celetexgroup@gmail.com"
              className="btn btn-gold"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Mail size={16} /> Email Us
            </motion.a>
            <motion.a
              href="tel:08140784286"
              className="btn btn-ghost-dark"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Phone size={16} /> Call Now
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      {/* FOOTER */}
      <motion.footer
        className="footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="footer-top">
          <div>
            <div className="nav-logo">
              <motion.span
                className="nav-logo-mark"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ duration: 0.3 }}
              >
                C
              </motion.span>
              <span className="nav-logo-text" style={{ color: "#fff" }}>
                Celetex <span>Group</span>
              </span>
            </div>
            <p className="footer-brand-text">
              A diversified business conglomerate delivering innovative
              solutions across media, real estate, travel, and digital commerce.
            </p>
            <p
              style={{
                fontSize: 12,
                marginTop: 12,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              RC: <span className="rc">9341015</span>
            </p>
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
            <a href="#process">Our Process</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © 2026 Celetex Group of Company Limited. All rights reserved.
          </span>
          <span className="mono">Black · Gold · White</span>
        </div>
      </motion.footer>
    </div>
  );
}

function ProcessLine() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div className="process-line" ref={ref}>
      <motion.div
        className="process-line-fill"
        initial={{ width: "0%" }}
        animate={isInView ? { width: "100%" } : { width: "0%" }}
        transition={{ duration: 1.4, ease: [0.22, 0.61, 0.36, 1] }}
      />
    </div>
  );
}
