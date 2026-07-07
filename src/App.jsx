 import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Building2,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  ShieldCheck,
  Users,
  Target,
  ClipboardList,
  Hammer,
  BadgeCheck,
  Camera,
  Plane,
  Landmark,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
} from "lucide-react";

/* ----------------------------------------------------------------------
   IMAGES — sourced stock photography (business / city / office themed
   to reflect a diversified, multi-sector company rather than a single
   construction-rental brand).
---------------------------------------------------------------------- */

const img = {
  skyline: "https://images.pexels.com/photos/1398003/pexels-photo-1398003.jpeg?auto=compress&cs=tinysrgb&w=1200",
  meeting: "https://images.pexels.com/photos/36733315/pexels-photo-36733315.jpeg?auto=compress&cs=tinysrgb&w=1200",
  strategy: "https://images.pexels.com/photos/36733322/pexels-photo-36733322.jpeg?auto=compress&cs=tinysrgb&w=1200",
  laptops: "https://images.pexels.com/photos/23496879/pexels-photo-23496879.jpeg?auto=compress&cs=tinysrgb&w=1200",
  tablet: "https://images.pexels.com/photos/36765717/pexels-photo-36765717.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

/* ----------------------------------------------------------------------
   HOOKS
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

function useTilt(strength = 7, enabled = true) {
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
    const handleEscape = (e) => e.key === "Escape" && setMenuOpen(false);
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
    { label: "Services", href: "#services" },
    { label: "Projects", href: "#projects" },
    { label: "Process", href: "#process" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          <a href="#home" className="nav-logo">
            <span className="nav-logo-mark">
              <Building2 size={20} strokeWidth={2.4} />
            </span>
            <span className="nav-logo-text">
              Vantara <span>Group</span>
            </span>
          </a>

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
            <button className="menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu-overlay ${menuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <div className="nav-logo">
            <span className="nav-logo-mark">
              <Building2 size={20} strokeWidth={2.4} />
            </span>
            <span className="nav-logo-text">
              Vantara <span>Group</span>
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
              <a href="mailto:hello@vantaragroup.com"><Mail size={18} /> hello@vantaragroup.com</a>
              <a href="tel:+2348140784286"><Phone size={18} /> +234 814 078 4286</a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .nav-container{ max-width:1360px; width:100%; margin:0 auto; display:flex; align-items:center; justify-content:space-between; }
        .nav-links-desktop{ display:flex; align-items:center; gap:32px; }
        .nav-link{ color:rgba(255,255,255,0.65); font-size:14px; font-weight:500; position:relative; padding:4px 0; transition:color .25s ease; text-decoration:none; }
        .nav-link::after{ content:''; position:absolute; left:0; bottom:-2px; width:0; height:2px; background:var(--gold); transition:width .3s ease; }
        .nav-link:hover{ color:var(--white); }
        .nav-link:hover::after{ width:100%; }

        .mobile-menu-overlay{ position:fixed; inset:0; background:var(--black); z-index:100; display:flex; flex-direction:column; overflow-y:auto; opacity:0; pointer-events:none; transition:opacity .35s ease; }
        .mobile-menu-overlay.open{ opacity:1; pointer-events:auto; }
        .mobile-menu-header{ display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-bottom:1px solid rgba(255,255,255,0.06); flex-shrink:0; }
        .mobile-menu-close{ background:none; border:none; color:#fff; cursor:pointer; padding:8px; display:flex; align-items:center; justify-content:center; border-radius:8px; transition:background .3s ease, transform .2s ease; }
        .mobile-menu-close:hover{ background:rgba(255,255,255,0.06); transform:rotate(90deg); }
        .mobile-menu-body{ flex:1; display:flex; flex-direction:column; justify-content:space-between; padding:40px 24px 32px; }
        .mobile-menu-link{ display:flex; align-items:center; gap:16px; padding:16px 20px; border-radius:12px; color:#fff; text-decoration:none; font-family:'Space Grotesk',sans-serif; font-size:20px; font-weight:500; letter-spacing:-0.02em; border:1px solid transparent; opacity:0; transform:translateX(-16px); transition:background .3s ease, opacity .4s ease, transform .4s ease; }
        .mobile-menu-overlay.open .mobile-menu-link{ opacity:1; transform:translateX(0); }
        .mobile-menu-link:hover{ background:rgba(255,255,255,0.04); border-color:rgba(201,162,39,0.2); }
        .mobile-menu-link-number{ font-family:'IBM Plex Mono',monospace; font-size:12px; color:var(--gold); opacity:.6; min-width:28px; }
        .mobile-menu-link-label{ flex:1; }
        .mobile-menu-link-arrow{ opacity:0; transform:translateX(-10px); transition:all .3s ease; color:var(--gold); }
        .mobile-menu-link:hover .mobile-menu-link-arrow{ opacity:1; transform:translateX(0); }
        .mobile-menu-cta{ display:flex; align-items:center; justify-content:space-between; padding:16px 24px; margin-top:8px; border-radius:12px; background:linear-gradient(135deg,var(--gold-bright),var(--gold)); color:#0a0a0a; text-decoration:none; font-family:'Space Grotesk',sans-serif; font-size:18px; font-weight:600; opacity:0; transform:translateX(-16px); transition:box-shadow .3s ease, opacity .4s ease, transform .4s ease; }
        .mobile-menu-overlay.open .mobile-menu-cta{ opacity:1; transform:translateX(0); }
        .mobile-menu-cta:hover{ box-shadow:0 8px 24px rgba(201,162,39,0.25); }
        .mobile-menu-footer{ border-top:1px solid rgba(255,255,255,0.06); padding-top:24px; margin-top:32px; }
        .mobile-menu-contact a{ display:flex; align-items:center; gap:12px; color:rgba(255,255,255,0.7); text-decoration:none; font-size:14px; transition:color .3s ease; padding:8px 0; }
        .mobile-menu-contact a:hover{ color:var(--gold-bright); }

        @media (max-width:980px){
          .nav-cta-btn{ display:none !important; }
          .menu-toggle{ display:flex !important; align-items:center; justify-content:center; }
          .nav{ padding:16px 24px !important; }
          .nav.scrolled{ padding:12px 24px !important; }
          .nav-links-desktop{ display:none; }
        }
        @media (min-width:981px){
          .nav-cta-btn{ display:inline-flex !important; }
          .menu-toggle{ display:none !important; }
        }

        .nav{ position:sticky; top:0; z-index:50; display:flex; align-items:center; justify-content:space-between; padding:20px 48px; background:rgba(10,10,10,0); transition:background-color .4s ease, padding .4s ease, border-color .4s ease; border-bottom:1px solid transparent; }
        .nav.scrolled{ background:rgba(8,8,8,0.98); border-bottom:1px solid rgba(255,255,255,0.06); padding:14px 48px; }
        .nav-logo{ display:flex; align-items:center; gap:10px; flex-shrink:0; text-decoration:none; }
        .nav-logo-mark{ width:38px; height:38px; border-radius:10px; background:linear-gradient(135deg,var(--gold-bright),var(--gold-deep)); display:flex; align-items:center; justify-content:center; color:#0a0a0a; border:2px solid rgba(201,162,39,0.3); box-shadow:0 0 20px rgba(201,162,39,0.15); transition:transform .3s ease; flex-shrink:0; }
        .nav-logo-mark:hover{ transform:scale(1.1) rotate(-5deg); }
        .nav-logo-text{ font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:18px; letter-spacing:0.02em; white-space:nowrap; color:var(--white); }
        .nav-logo-text span{ color:var(--gold); }

        .btn{ display:inline-flex; align-items:center; gap:8px; padding:10px 20px; border-radius:999px; font-size:13.5px; font-weight:600; border:1px solid transparent; transition:all .3s cubic-bezier(.2,.8,.2,1); white-space:nowrap; text-decoration:none; }
        .btn:active{ transform:scale(0.97); }
        .btn-gold{ background:linear-gradient(135deg,var(--gold-bright),var(--gold)); color:#0a0a0a; }
        .btn-gold:hover{ transform:translateY(-2px); box-shadow:0 10px 30px rgba(201,162,39,0.35); }
        .btn-ghost-dark{ background:transparent; border:1px solid rgba(255,255,255,0.15); color:var(--white); }
        .btn-ghost-dark:hover{ border-color:var(--gold); color:var(--gold-bright); }
        .menu-toggle{ background:none; border:none; color:var(--white); cursor:pointer; padding:4px; display:flex; align-items:center; justify-content:center; transition:transform .15s ease; }
        .menu-toggle:active{ transform:scale(0.9); }

        @media (max-width:600px){
          .nav-logo-text{ font-size:15px; }
          .nav-logo-mark{ width:34px; height:34px; }
          .nav{ padding:14px 16px !important; }
          .nav.scrolled{ padding:10px 16px !important; }
        }
      `}</style>
    </>
  );
}

/* ----------------------------------------------------------------------
   HERO SECTION — two-image composition mirroring the reference layout
---------------------------------------------------------------------- */

function HeroSection() {
  const [ref, visible] = useReveal(0.2);
  const tiltImg = useTilt(4, true);

  return (
    <section className="hero" id="home" ref={ref}>
      <div className="hero-inner">
        <div className={`reveal ${visible ? "reveal-visible" : ""}`}>
          <Eyebrow>Trusted Multi-Sector Enterprise</Eyebrow>
          <h1>
            Focused on delivering thoughtful strategy and
            <br />
            <span className="accent">flawless execution.</span>
          </h1>
          <p className="lead">
            We take pride in transforming ambition into results through a meticulous approach across
            every venture we run. Each project is guided by careful planning, skilled specialists, and
            a deep understanding of the sectors we serve.
          </p>
          <div className="hero-ctas">
            <a href="#contact" className="btn btn-gold">Request a Consultation <ArrowRight size={16} /></a>
            <a href="#services" className="btn btn-ghost-dark">Our Services</a>
          </div>
        </div>

        <div className={`hero-visual ${visible ? "reveal-visible" : ""}`} ref={tiltImg.ref} onMouseMove={tiltImg.onMouseMove} onMouseLeave={tiltImg.onMouseLeave}>
          <div className="hero-img-main">
            <img src={img.skyline} alt="City skyline representing our reach" loading="eager" />
            <div className="hero-img-glow" />
          </div>
          <div className="hero-img-sub">
            <img src={img.meeting} alt="Team collaborating on strategy" loading="eager" />
          </div>
          <div className="hero-badge hero-badge-1">
            <div className="hero-badge-icon"><ShieldCheck size={18} /></div>
            <div>
              <div className="hero-badge-num">3+ Yrs</div>
              <div className="hero-badge-label">Proven Track Record</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------
   ABOUT / STATS SECTION
---------------------------------------------------------------------- */

function AboutSection() {
  const [ref, visible] = useReveal(0.2);

  return (
    <section className="about-wrap" id="about" ref={ref}>
      <div className="section">
        <div className={`about-head reveal ${visible ? "reveal-visible" : ""}`}>
          <Eyebrow>About Our Company</Eyebrow>
          <h2>Built on Vision. Driven by Excellence.</h2>
          <p>
            With years in the field, we bring a hands-on, client-first approach to every venture.
            Our teams blend strategy, craftsmanship, and trust to deliver results that last.
          </p>
        </div>

        <div className="stats-grid">
          <div className={`stat-card stat-card-main reveal ${visible ? "reveal-visible" : ""}`}>
            <div className="stat-brand">
              <span className="stat-brand-mark"><Building2 size={16} /></span>
              Vantara Group
            </div>
            <div>
              <StatNumber value={100} suffix="+" delay={200} />
              <div className="stat-desc">Proven track record across media, property, travel, and commerce sectors.</div>
            </div>
            <div className="stat-avatars">
              <span>OA</span><span>MK</span><span>TR</span>
              <span className="stat-avatars-more">+12</span>
            </div>
          </div>

          <div className={`stat-card reveal ${visible ? "reveal-visible" : ""}`} style={{ transitionDelay: "120ms" }}>
            <div className="stat-icon-row"><div className="stat-icon-box"><Target size={18} /></div></div>
            <div className="stat-label">Modern Strategy</div>
            <p className="stat-body">We integrate current market intelligence and technology to ensure faster, sharper results.</p>
          </div>

          <div className={`stat-card dark reveal ${visible ? "reveal-visible" : ""}`} style={{ transitionDelay: "240ms" }}>
            <StatNumber value={98} suffix="%" delay={400} />
            <div className="stat-label">Client Satisfaction Rate</div>
          </div>

          <div className={`stat-card dark reveal ${visible ? "reveal-visible" : ""}`} style={{ transitionDelay: "360ms" }}>
            <StatNumber value={4} suffix="" delay={600} />
            <div className="stat-label">Business Divisions</div>
          </div>

          <div className={`stat-card reveal ${visible ? "reveal-visible" : ""}`} style={{ transitionDelay: "480ms" }}>
            <div className="stat-icon-row"><div className="stat-icon-box"><Users size={18} /></div></div>
            <div className="stat-label">Experienced Specialists</div>
            <p className="stat-body">Our team brings decades of combined, cross-sector, hands-on experience.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------
   SERVICES SECTION
---------------------------------------------------------------------- */

function ServicesSection() {
  const [ref, visible] = useReveal(0.2);
  const tiltA = useTilt(6, true);
  const tiltB = useTilt(6, true);
  const tiltC = useTilt(6, true);

  const services = [
    {
      icon: Camera,
      title: "Media & Creative Services",
      desc: "Branding, content production, digital marketing, and strategic communications built to grow your presence.",
      tilt: tiltA,
    },
    {
      icon: Landmark,
      title: "Property & Real Estate",
      desc: "Development, consultancy, and investment advisory for residential and commercial real estate ventures.",
      tilt: tiltB,
    },
    {
      icon: Plane,
      title: "Travel & Corporate Logistics",
      desc: "Consultancy, planning, and management for individual, corporate, and international travel needs.",
      tilt: tiltC,
    },
  ];

  return (
    <section className="services-wrap" id="services" ref={ref}>
      <div className="section">
        <div className="services-head">
          <div className={`reveal ${visible ? "reveal-visible" : ""}`}>
            <Eyebrow>Our Services</Eyebrow>
            <h2>End-to-End Solutions You Can Rely On.</h2>
          </div>
          <p className={`reveal ${visible ? "reveal-visible" : ""}`} style={{ transitionDelay: "120ms" }}>
            From creative direction to property development and travel logistics — we offer comprehensive
            solutions tailored to your needs across every sector we operate in.
          </p>
        </div>

        <div className="services-grid">
          {services.map((s, i) => (
            <div
              key={s.title}
              className={`reveal ${visible ? "reveal-visible" : ""}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="service-card" ref={s.tilt.ref} onMouseMove={s.tilt.onMouseMove} onMouseLeave={s.tilt.onMouseLeave}>
                <div className="service-icon"><s.icon size={22} /></div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <a href="#contact" className="service-link">Read More <ArrowUpRight size={15} /></a>
              </div>
            </div>
          ))}
        </div>

        <Reveal delay={200} className="services-cta-wrap">
          <a href="#contact" className="btn btn-ghost-dark">Explore All Services <ArrowRight size={16} /></a>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------
   PROJECTS SECTION
---------------------------------------------------------------------- */

function ProjectsSection() {
  const [ref, visible] = useReveal(0.15);

  const projects = [
    {
      img: img.strategy,
      title: "Metro Wellness Media Campaign",
      desc: "A full brand relaunch with integrated content strategy for a regional healthcare client.",
      loc: "Lagos, Nigeria",
      date: "2025 / 2026",
    },
    {
      img: img.laptops,
      title: "Skyline Business District Advisory",
      desc: "Investment advisory and planning support for a mixed-use commercial development.",
      loc: "Abuja, Nigeria",
      date: "2024 / 2025",
    },
    {
      img: img.tablet,
      title: "Corporate Travel Framework Rollout",
      desc: "A managed travel program covering logistics, visas, and vendor coordination for enterprise clients.",
      loc: "Port Harcourt, Nigeria",
      date: "2024 / 2025",
    },
  ];

  return (
    <section className="section" id="projects" ref={ref}>
      <div className={`section-head-center reveal ${visible ? "reveal-visible" : ""}`}>
        <Eyebrow>Our Projects</Eyebrow>
        <h2>Crafted Ventures, Proven Results.</h2>
        <p>We don't just deliver — we craft. Every engagement reflects thoughtful planning, expert execution, and precise delivery.</p>
      </div>

      <div className="projects-grid">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={i * 120}>
            <div className="project-card">
              <div className="project-img-wrap">
                <img src={p.img} alt={p.title} loading="lazy" />
                <div className="project-img-overlay" />
              </div>
              <div className="project-body">
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
                <div className="project-meta">
                  <span><MapPin size={13} /> {p.loc}</span>
                  <span><Clock size={13} /> {p.date}</span>
                </div>
                <a href="#contact" className="project-link">View More <ArrowUpRight size={14} /></a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={300} className="services-cta-wrap">
        <a href="#contact" className="btn btn-ghost-dark">Explore All Projects <ArrowRight size={16} /></a>
      </Reveal>
    </section>
  );
}

/* ----------------------------------------------------------------------
   PROCESS SECTION
---------------------------------------------------------------------- */

function ProcessLine() {
  const [ref, visible] = useReveal(0.4);
  return (
    <div className="process-line" ref={ref}>
      <div className="process-line-fill" style={{ width: visible ? "100%" : "0%" }} />
    </div>
  );
}

function ProcessSection() {
  const [ref, visible] = useReveal(0.2);

  const steps = [
    { n: "01", title: "Understanding Your Needs", desc: "We study your goals, constraints, and market to define what success looks like.", icon: ClipboardList },
    { n: "02", title: "Detailed Timeline & Quote", desc: "Every plan is mapped in detail — budgets, timelines, and risk built in from day one.", icon: Target },
    { n: "03", title: "Expertly Built With Care", desc: "Our teams execute with precision, discipline, and constant communication.", icon: Hammer },
    { n: "04", title: "Final Check & Handover", desc: "We verify every detail before handover, then stay engaged for ongoing support.", icon: BadgeCheck },
  ];

  return (
    <section className="process-wrap" id="process" ref={ref}>
      <div className="section">
        <div className="process-head">
          <div className={`reveal ${visible ? "reveal-visible" : ""}`}>
            <Eyebrow>Our Process</Eyebrow>
            <h2>Our 4-Step Process to Sustainable Growth.</h2>
          </div>
          <p className={`reveal ${visible ? "reveal-visible" : ""}`} style={{ transitionDelay: "120ms" }}>
            We don't just deliver — we partner. Every engagement reflects thoughtful planning,
            expert execution, and precise follow-through.
          </p>
        </div>

        <div className="process-grid">
          <ProcessLine />
          {steps.map((step, i) => (
            <div key={step.n} className={`process-step reveal ${visible ? "reveal-visible" : ""}`} style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="process-num">{step.n}</div>
              <div className="process-icon"><step.icon size={20} /></div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------
   TESTIMONIAL STRIP
---------------------------------------------------------------------- */

function TestimonialStrip() {
  const [ref, visible] = useReveal(0.3);
  return (
    <section className="section" ref={ref}>
      <div className={`testimonial-card reveal ${visible ? "reveal-visible" : ""}`}>
        <div className="testimonial-stars">
          {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="#C9A227" stroke="#C9A227" />)}
        </div>
        <p className="testimonial-quote">
          Working across media, property, and logistics with one partner has simplified everything.
          The team plans meticulously and delivers exactly what was promised, on schedule.
        </p>
        <div className="testimonial-author">
          <span className="testimonial-avatar">DK</span>
          <div>
            <div className="testimonial-name">Dara Kalu</div>
            <div className="testimonial-role">Operations Director, Northbridge Retail</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------
   MAIN APP
---------------------------------------------------------------------- */

export default function App() {
  const { progress, scrolled } = useScrollState();
  const [ctaRef, ctaVisible] = useReveal(0.2);

  return (
    <div className="ag-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

        :root{
          --white:#faf9f6; --off:#f5f2ec; --black:#0a0a0a; --charcoal:#1a1a1a; --charcoal-2:#141414;
          --gold:#C9A227; --gold-bright:#F3D27A; --gold-deep:#8C6A22;
          --line:rgba(255,255,255,0.06); --line-strong:rgba(255,255,255,0.12);
        }
        *{ box-sizing:border-box; margin:0; padding:0; }
        .ag-root{ font-family:'Inter', sans-serif; background:var(--black); color:var(--white); overflow-x:hidden; -webkit-font-smoothing:antialiased; }
        .ag-root h1, .ag-root h2, .ag-root h3, .ag-root .display{ font-family:'Space Grotesk', sans-serif; letter-spacing:-0.02em; }
        a{ color:inherit; }
        button{ font-family:inherit; cursor:pointer; }

        .progress-thread{ position:fixed; top:0; left:0; width:3px; height:100vh; z-index:60; background:linear-gradient(180deg,var(--gold-bright),var(--gold) 40%, transparent 100%); transform-origin:top; pointer-events:none; transition:transform .1s linear; }

        .reveal{ opacity:0; transform:translateY(28px); transition:opacity .8s cubic-bezier(.2,.7,.2,1), transform .8s cubic-bezier(.2,.7,.2,1); }
        .reveal-visible{ opacity:1; transform:translateY(0); }
        .reveal-scale{ opacity:0; transform:scale(0.85); transition:opacity .6s cubic-bezier(.22,.61,.36,1), transform .6s cubic-bezier(.22,.61,.36,1); display:inline-block; }
        .reveal-scale-visible{ opacity:1; transform:scale(1); }

        .eyebrow{ display:inline-flex; align-items:center; gap:10px; font-family:'IBM Plex Mono', monospace; font-size:12.5px; letter-spacing:0.12em; text-transform:uppercase; color:var(--gold); margin-bottom:20px; }
        .eyebrow-chip{ width:8px; height:8px; background:var(--gold); border-radius:2px; display:inline-block; }

        /* HERO */
        .hero{ padding:64px 48px 100px; position:relative; }
        .hero-inner{ display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; max-width:1360px; margin:0 auto; }
        .hero h1{ font-size:52px; line-height:1.1; font-weight:700; margin:0 0 22px; }
        .hero h1 .accent{ background:linear-gradient(90deg,var(--gold-bright),var(--gold)); -webkit-background-clip:text; background-clip:text; color:transparent; }
        .hero p.lead{ font-size:17px; line-height:1.7; color:rgba(255,255,255,0.6); max-width:480px; margin-bottom:36px; }
        .hero-ctas{ display:flex; gap:14px; flex-wrap:wrap; }
        .hero-ctas a{ transition:transform .2s ease; }
        .hero-ctas a:active{ transform:scale(0.97); }

        .hero-visual{ position:relative; height:520px; opacity:0; transform:scale(0.94); transition:opacity .8s cubic-bezier(.22,.61,.36,1) .15s, transform .8s cubic-bezier(.22,.61,.36,1) .15s; }
        .hero-visual.reveal-visible{ opacity:1; transform:scale(1); }
        .hero-img-main{ position:absolute; top:0; right:0; width:70%; height:80%; border-radius:20px; overflow:hidden; box-shadow:0 30px 80px rgba(0,0,0,0.5); border:1px solid var(--line); }
        .hero-img-main img{ width:100%; height:100%; object-fit:cover; display:block; }
        .hero-img-glow{ position:absolute; inset:0; background:linear-gradient(180deg, rgba(10,10,10,0) 40%, rgba(10,10,10,0.55) 100%); }
        .hero-img-sub{ position:absolute; bottom:0; left:0; width:44%; height:52%; border-radius:16px; overflow:hidden; box-shadow:0 25px 60px rgba(0,0,0,0.5); border:1px solid var(--line); }
        .hero-img-sub img{ width:100%; height:100%; object-fit:cover; display:block; }
        .hero-badge{ position:absolute; top:24px; left:-10px; background:rgba(12,12,12,0.94); border:1px solid var(--line); border-radius:14px; padding:14px 18px; display:flex; align-items:center; gap:12px; box-shadow:0 20px 40px rgba(0,0,0,0.4); }
        .hero-badge-icon{ width:36px; height:36px; border-radius:10px; background:rgba(201,162,39,0.12); display:flex; align-items:center; justify-content:center; color:var(--gold-bright); }
        .hero-badge-num{ font-family:'Space Grotesk'; font-weight:700; font-size:17px; color:var(--white); line-height:1.1; }
        .hero-badge-label{ font-size:11px; color:rgba(255,255,255,0.55); }

        /* SECTION GENERIC */
        .section{ padding:100px 48px; max-width:1360px; margin:0 auto; }
        .section-head-center{ text-align:center; max-width:640px; margin:0 auto 56px; }
        .section-head-center h2{ font-size:36px; font-weight:700; margin:8px 0 14px; }
        .section-head-center p{ font-size:15px; color:rgba(255,255,255,0.55); line-height:1.7; }

        /* ABOUT */
        .about-wrap{ background:var(--charcoal-2); }
        .about-head{ max-width:680px; margin-bottom:48px; }
        .about-head h2{ font-size:36px; font-weight:700; margin:8px 0 14px; }
        .about-head p{ font-size:15px; color:rgba(255,255,255,0.55); line-height:1.7; }
        .stats-grid{ display:grid; grid-template-columns:1.4fr 1fr 1fr; grid-template-rows:auto auto; gap:20px; }
        .stat-card{ background:var(--black); color:var(--white); border-radius:18px; padding:32px; position:relative; overflow:hidden; transition:transform .4s ease, box-shadow .4s ease; border:1px solid var(--line); }
        .stat-card:hover{ transform:translateY(-6px); box-shadow:0 12px 30px rgba(0,0,0,0.3); }
        .stat-card.dark{ background:var(--charcoal); border-color:var(--line); }
        .stat-card-main{ grid-row:span 2; background:linear-gradient(135deg,var(--charcoal),var(--black)); }
        .stat-brand{ display:flex; align-items:center; gap:10px; font-family:'Space Grotesk'; font-weight:600; font-size:16px; color:var(--gold-bright); }
        .stat-brand-mark{ width:26px; height:26px; border-radius:8px; background:rgba(201,162,39,0.15); display:flex; align-items:center; justify-content:center; color:var(--gold-bright); }
        .stat-number{ font-family:'Space Grotesk'; font-weight:700; font-size:52px; display:block; margin:24px 0 8px; }
        .stat-card-main .stat-number{ font-size:60px; }
        .stat-desc{ font-size:14px; color:rgba(255,255,255,0.6); line-height:1.6; max-width:260px; }
        .stat-avatars{ display:flex; margin-top:24px; }
        .stat-avatars span{ width:32px; height:32px; border-radius:50%; border:2px solid var(--charcoal); background:linear-gradient(135deg,#333,#222); margin-left:-10px; display:flex; align-items:center; justify-content:center; font-size:10.5px; color:var(--gold); font-weight:600; }
        .stat-avatars span:first-child{ margin-left:0; }
        .stat-avatars-more{ background:rgba(201,162,39,0.15) !important; color:var(--gold-bright) !important; }
        .stat-icon-row{ display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
        .stat-icon-box{ width:38px; height:38px; border-radius:10px; background:rgba(201,162,39,0.08); display:flex; align-items:center; justify-content:center; color:var(--gold); }
        .stat-label{ font-size:13.5px; color:rgba(255,255,255,0.55); margin-top:8px; font-weight:500; }
        .stat-body{ font-size:13.5px; color:rgba(255,255,255,0.55); margin-top:8px; line-height:1.6; }

        /* SERVICES */
        .services-wrap{ background:var(--black); }
        .services-head{ display:grid; grid-template-columns:1.3fr 1fr; gap:40px; align-items:flex-end; margin-bottom:56px; }
        .services-head h2{ font-size:36px; font-weight:700; max-width:520px; }
        .services-head p{ font-size:15px; color:rgba(255,255,255,0.55); line-height:1.7; max-width:340px; }
        .services-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:28px; }
        .service-card{ background:var(--charcoal); border:1px solid var(--line); border-radius:20px; padding:32px; transition:border-color .4s ease, box-shadow .4s ease; }
        .service-card:hover{ border-color:var(--gold); box-shadow:0 20px 50px rgba(0,0,0,0.35); }
        .service-icon{ width:52px; height:52px; border-radius:14px; background:rgba(201,162,39,0.12); color:var(--gold-bright); display:flex; align-items:center; justify-content:center; margin-bottom:22px; transition:transform .3s ease; }
        .service-card:hover .service-icon{ transform:scale(1.1) rotate(-4deg); }
        .service-card h3{ font-size:19px; font-weight:600; margin:0 0 12px; }
        .service-card p{ font-size:14px; color:rgba(255,255,255,0.6); line-height:1.7; margin-bottom:18px; }
        .service-link{ display:inline-flex; align-items:center; gap:8px; font-size:13.5px; font-weight:600; color:var(--gold-bright); text-decoration:none; }
        .service-link svg{ transition:transform .3s ease; }
        .service-link:hover svg{ transform:translateX(4px); }
        .services-cta-wrap{ display:flex; justify-content:center; margin-top:48px; }

        /* PROJECTS */
        .projects-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:28px; }
        .project-card{ background:var(--charcoal); border:1px solid var(--line); border-radius:20px; overflow:hidden; transition:transform .4s ease, box-shadow .4s ease; }
        .project-card:hover{ transform:translateY(-6px); box-shadow:0 24px 60px rgba(0,0,0,0.4); }
        .project-img-wrap{ position:relative; height:190px; overflow:hidden; }
        .project-img-wrap img{ width:100%; height:100%; object-fit:cover; transition:transform .6s ease; display:block; }
        .project-card:hover .project-img-wrap img{ transform:scale(1.08); }
        .project-img-overlay{ position:absolute; inset:0; background:linear-gradient(135deg, rgba(201,162,39,0.08), rgba(0,0,0,0.35)); }
        .project-body{ padding:24px 26px 26px; }
        .project-body h4{ font-size:17px; font-weight:600; margin:0 0 8px; font-family:'Space Grotesk'; }
        .project-body p{ font-size:13.5px; color:rgba(255,255,255,0.6); line-height:1.6; margin-bottom:16px; }
        .project-meta{ display:flex; gap:16px; margin-bottom:16px; flex-wrap:wrap; }
        .project-meta span{ display:flex; align-items:center; gap:6px; font-size:12px; color:rgba(255,255,255,0.5); }
        .project-link{ display:inline-flex; align-items:center; gap:6px; font-size:13px; font-weight:600; color:var(--gold-bright); text-decoration:none; }

        /* PROCESS */
        .process-wrap{ background:var(--charcoal-2); }
        .process-head{ display:grid; grid-template-columns:1.3fr 1fr; gap:40px; align-items:flex-end; margin-bottom:64px; }
        .process-head h2{ font-size:36px; font-weight:700; max-width:520px; }
        .process-head p{ font-size:15px; color:rgba(255,255,255,0.55); line-height:1.7; max-width:340px; }
        .process-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:0; position:relative; }
        .process-line{ position:absolute; top:44px; left:0; right:0; height:1px; background:rgba(255,255,255,0.06); overflow:hidden; }
        .process-line-fill{ height:100%; background:linear-gradient(90deg,var(--gold-bright),var(--gold)); width:0%; transition:width 1.4s cubic-bezier(.2,.7,.2,1); }
        .process-step{ padding:0 24px 0 0; position:relative; }
        .process-num{ font-family:'Space Grotesk'; font-size:44px; font-weight:700; color:rgba(255,255,255,0.06); margin-bottom:18px; }
        .process-icon{ width:44px; height:44px; border-radius:12px; background:rgba(201,162,39,0.12); color:var(--gold-bright); display:flex; align-items:center; justify-content:center; margin-bottom:18px; position:relative; z-index:2; transition:transform .3s ease; }
        .process-step:hover .process-icon{ transform:scale(1.1) rotate(-5deg); }
        .process-step h3{ font-size:16.5px; font-weight:600; margin:0 0 10px; }
        .process-step p{ font-size:13.5px; color:rgba(255,255,255,0.55); line-height:1.6; margin:0; max-width:240px; }

        /* TESTIMONIAL */
        .testimonial-card{ background:var(--charcoal); border:1px solid var(--line); border-radius:24px; padding:56px; max-width:760px; margin:0 auto; text-align:center; }
        .testimonial-stars{ display:flex; justify-content:center; gap:4px; margin-bottom:22px; }
        .testimonial-quote{ font-size:19px; line-height:1.6; color:var(--white); font-family:'Space Grotesk'; font-weight:500; margin-bottom:26px; }
        .testimonial-author{ display:flex; align-items:center; justify-content:center; gap:12px; }
        .testimonial-avatar{ width:40px; height:40px; border-radius:50%; background:rgba(201,162,39,0.15); color:var(--gold-bright); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:600; }
        .testimonial-name{ font-size:14px; font-weight:600; color:var(--white); text-align:left; }
        .testimonial-role{ font-size:12.5px; color:rgba(255,255,255,0.5); text-align:left; }

        /* CTA */
        .cta-banner{ margin:0 48px 100px; border-radius:24px; padding:64px; background:linear-gradient(120deg,#1a1a1a 0%,#0a0a0a 60%,#1a1a1a 100%); position:relative; overflow:hidden; display:flex; align-items:center; justify-content:space-between; gap:40px; border:1px solid var(--line); opacity:0; transform:scale(0.94); transition:opacity .7s cubic-bezier(.22,.61,.36,1), transform .7s cubic-bezier(.22,.61,.36,1); }
        .cta-banner.reveal-visible{ opacity:1; transform:scale(1); }
        .cta-banner::after{ content:''; position:absolute; width:400px; height:400px; border-radius:50%; background:radial-gradient(circle, rgba(201,162,39,0.08), transparent 70%); top:-160px; right:-100px; }
        .cta-banner h2{ font-size:30px; max-width:460px; margin:0 0 8px; position:relative; z-index:1; }
        .cta-banner p{ color:rgba(255,255,255,0.6); max-width:420px; margin:0; position:relative; z-index:1; }
        .cta-actions{ position:relative; z-index:1; display:flex; gap:14px; flex-shrink:0; flex-wrap:wrap; }

        /* FOOTER */
        .footer{ background:var(--black); color:rgba(255,255,255,0.6); padding:64px 48px 32px; border-top:1px solid var(--line); }
        .footer-top{ display:grid; grid-template-columns:1.4fr 1fr 1fr 1fr; gap:40px; margin-bottom:56px; }
        .footer-brand-text{ font-size:13.5px; line-height:1.7; margin-top:16px; max-width:280px; }
        .footer-col h4{ color:var(--white); font-size:13.5px; margin:0 0 18px; letter-spacing:0.04em; text-transform:uppercase; font-family:'IBM Plex Mono', monospace; }
        .footer-col a{ display:block; font-size:14px; margin-bottom:12px; color:rgba(255,255,255,0.6); text-decoration:none; transition:color .25s ease; }
        .footer-col a:hover{ color:var(--gold-bright); }
        .footer-bottom{ display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--line); padding-top:28px; font-size:12.5px; flex-wrap:wrap; gap:12px; }

        @media (max-width:980px){
          .hero-inner{ grid-template-columns:1fr; }
          .hero h1{ font-size:38px; }
          .hero-visual{ height:400px; margin-top:40px; }
          .stats-grid{ grid-template-columns:1fr 1fr; }
          .stat-card-main{ grid-column:span 2; grid-row:auto; }
          .services-head, .process-head{ grid-template-columns:1fr; }
          .services-grid, .projects-grid{ grid-template-columns:1fr; }
          .process-grid{ grid-template-columns:1fr 1fr; row-gap:40px; }
          .process-line{ display:none; }
          .cta-banner{ flex-direction:column; align-items:flex-start; padding:40px; margin:0 20px 60px; }
          .footer-top{ grid-template-columns:1fr 1fr; }
          .section{ padding:72px 24px; }
          .hero{ padding:32px 24px 72px; }
          .testimonial-card{ padding:36px 28px; }
        }
        @media (max-width:600px){
          .process-grid{ grid-template-columns:1fr; }
          .hero-badge{ left:0; top:12px; }
        }
        @media (prefers-reduced-motion: reduce){
          .reveal, .reveal-scale, .hero-visual, .hero-badge, .cta-banner, .stat-card{ transition:none !important; opacity:1 !important; transform:none !important; }
        }
      `}</style>

      <div className="progress-thread" style={{ transform: `scaleY(${progress})` }} />

      <NavBar scrolled={scrolled} />

      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ProcessSection />
      <TestimonialStrip />

      <div ref={ctaRef}>
        <div className={`cta-banner ${ctaVisible ? "reveal-visible" : ""}`} id="contact">
          <div>
            <h2>Ready to partner with Vantara Group?</h2>
            <p>Connect with our team today and let's build something extraordinary across every sector we serve.</p>
          </div>
          <div className="cta-actions">
            <a href="mailto:hello@vantaragroup.com" className="btn btn-gold"><Mail size={16} /> Email Us</a>
            <a href="tel:+2348140784286" className="btn btn-ghost-dark"><Phone size={16} /> Call Now</a>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-top">
          <div>
            <a href="#home" className="nav-logo">
              <span className="nav-logo-mark"><Building2 size={20} strokeWidth={2.4} /></span>
              <span className="nav-logo-text" style={{ color: "#fff" }}>Vantara <span>Group</span></span>
            </a>
            <p className="footer-brand-text">
              A multi-sector enterprise delivering strategic solutions across media, real estate,
              travel, and digital commerce.
            </p>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <a href="#services">Media & Creative</a>
            <a href="#services">Real Estate</a>
            <a href="#services">Travel & Logistics</a>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a href="mailto:hello@vantaragroup.com">hello@vantaragroup.com</a>
            <a href="tel:+2348140784286">+234 814 078 4286</a>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <a href="#about">About Us</a>
            <a href="#projects">Projects</a>
            <a href="#process">Our Process</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Vantara Group. All rights reserved.</span>
          <span>Black · Gold · White</span>
        </div>
      </footer>
    </div>
  );
}