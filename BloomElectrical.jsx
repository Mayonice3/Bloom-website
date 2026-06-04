import { useState, useEffect, useRef } from "react";
import {
  Zap, Wrench, Phone, Mail, MapPin, Clock, Shield, Star,
  ArrowRight, Menu, X, Facebook, Instagram,
  ChevronRight, Flame, Home, Building2, Users, Briefcase,
  Battery, Camera, Wifi, Paintbrush, Droplets, Layers,
  PlugZap, Sun, Car, ThumbsUp
} from "lucide-react";

/* ─── Google Fonts ─────────────────────────────────────────────── */
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap";
document.head.appendChild(fontLink);

/* ─── CSS injection ─────────────────────────────────────────────── */
const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #0F1117; color: #F5F5F0; font-family: 'DM Sans', sans-serif; }

  .font-display { font-family: 'Barlow Condensed', sans-serif; }
  .amber { color: #F59E0B; }
  .amber-bg { background: #F59E0B; }

  /* noise texture overlay */
  .noise::after {
    content: '';
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 1;
  }
  .noise > * { position: relative; z-index: 2; }

  /* diagonal cuts */
  .cut-bottom {
    clip-path: polygon(0 0, 100% 0, 100% 92%, 0 100%);
    padding-bottom: 80px;
  }
  .cut-top {
    clip-path: polygon(0 4%, 100% 0, 100% 100%, 0 100%);
    padding-top: 80px;
    margin-top: -40px;
  }

  /* amber glow button */
  .btn-amber {
    background: #F59E0B;
    color: #0F1117;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 14px 28px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex; align-items: center; gap: 8px;
    text-decoration: none;
    box-shadow: 0 0 0 0 rgba(245,158,11,0);
  }
  .btn-amber:hover {
    background: #FBBF24;
    box-shadow: 0 0 24px rgba(245,158,11,0.5);
    transform: translateY(-1px);
  }

  /* ghost button */
  .btn-ghost {
    background: transparent;
    color: #F5F5F0;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 13px 28px;
    border: 2px solid rgba(245,245,240,0.4);
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex; align-items: center; gap: 8px;
    text-decoration: none;
  }
  .btn-ghost:hover {
    border-color: #F59E0B;
    color: #F59E0B;
  }

  /* dark outlined button */
  .btn-dark-outline {
    background: transparent;
    color: #0F1117;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 13px 28px;
    border: 2px solid #0F1117;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex; align-items: center; gap: 8px;
    text-decoration: none;
  }
  .btn-dark-outline:hover { background: rgba(0,0,0,0.1); }

  /* card hover */
  .card-hover {
    border: 1px solid #2A2D3A;
    border-left: 3px solid #2A2D3A;
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  }
  .card-hover:hover {
    border-left-color: #F59E0B;
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(245,158,11,0.1);
  }

  /* section label */
  .section-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #F59E0B;
    display: flex; align-items: center; gap: 8px;
  }
  .section-label::before {
    content: '';
    display: inline-block;
    width: 24px; height: 2px;
    background: #F59E0B;
  }

  /* pill tag */
  .pill {
    display: inline-block;
    font-size: 0.78rem;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    padding: 4px 12px;
    border-radius: 2px;
    background: rgba(245,158,11,0.1);
    border: 1px solid rgba(245,158,11,0.25);
    color: #F59E0B;
    margin: 3px;
  }

  /* category tag on project card */
  .cat-tag {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 3px 10px;
    background: #F59E0B;
    color: #0F1117;
    border-radius: 2px;
    display: inline-block;
  }

  /* step circle */
  .step-circle {
    width: 52px; height: 52px;
    border-radius: 50%;
    background: #F59E0B;
    color: #0F1117;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  /* stat item */
  .stat-value {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 2.4rem;
    font-weight: 800;
    color: #F59E0B;
    line-height: 1;
  }

  /* diagonal hero pattern */
  .hero-pattern {
    background-image:
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 60px,
        rgba(245,158,11,0.025) 60px,
        rgba(245,158,11,0.025) 61px
      );
  }

  /* nav scroll shadow */
  .nav-scrolled {
    box-shadow: 0 4px 24px rgba(0,0,0,0.5);
  }

  /* mobile menu */
  .mobile-menu {
    position: fixed; inset: 0; top: 64px;
    background: #0F1117;
    z-index: 90;
    border-top: 1px solid #2A2D3A;
    padding: 24px;
    display: flex; flex-direction: column; gap: 4px;
  }
  .mobile-link {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #F5F5F0;
    padding: 14px 0;
    border-bottom: 1px solid #2A2D3A;
    text-decoration: none;
    transition: color 0.2s;
  }
  .mobile-link:hover { color: #F59E0B; }

  /* brand chip */
  .brand-chip {
    display: inline-block;
    padding: 8px 18px;
    border: 1px solid #2A2D3A;
    border-radius: 2px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #9CA3AF;
    white-space: nowrap;
    background: #1A1D27;
    transition: border-color 0.2s, color 0.2s;
  }
  .brand-chip:hover { border-color: #F59E0B; color: #F59E0B; }

  /* client pill */
  .client-pill {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 20px;
    background: #1A1D27;
    border: 1px solid #2A2D3A;
    border-radius: 3px;
    font-size: 0.9rem;
    font-weight: 500;
    color: #9CA3AF;
    transition: border-color 0.2s, color 0.2s;
    white-space: nowrap;
  }
  .client-pill:hover { border-color: #F59E0B; color: #F5F5F0; }

  /* scrolling brands */
  .brands-track {
    display: flex; gap: 12px;
    animation: scrollBrands 28s linear infinite;
    width: max-content;
  }
  @keyframes scrollBrands {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .brands-mask {
    overflow: hidden;
    -webkit-mask-image: linear-gradient(to right, transparent 0, black 80px, black calc(100% - 80px), transparent 100%);
    mask-image: linear-gradient(to right, transparent 0, black 80px, black calc(100% - 80px), transparent 100%);
  }

  /* image placeholder */
  .img-placeholder {
    background: #1A1D27;
    border: 1px dashed #2A2D3A;
    display: flex; align-items: center; justify-content: center;
    color: rgba(245,158,11,0.35);
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.8rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  /* footer link */
  .footer-link {
    color: #9CA3AF;
    text-decoration: none;
    font-size: 0.88rem;
    transition: color 0.2s;
    display: block; padding: 3px 0;
  }
  .footer-link:hover { color: #F59E0B; }

  /* star row */
  .stars { display: flex; gap: 2px; margin-bottom: 12px; }

  /* brand logo chips */
  .brand-logo-wrap {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 14px 32px; height: 64px;
    background: #1A1D27;
    border: 1px solid #2A2D3A;
    border-radius: 2px;
    cursor: default;
    transition: border-color 0.35s ease;
    white-space: nowrap;
  }
  .brand-logo-wrap:hover { border-color: rgba(245,158,11,0.35); }
  .brand-logo {
    height: 24px; max-width: 110px;
    object-fit: contain;
    filter: grayscale(1) brightness(2.2);
    transition: filter 0.35s ease;
  }
  .brand-logo-wrap:hover .brand-logo {
    filter: sepia(1) saturate(4) hue-rotate(5deg) brightness(1.1);
  }
  .brand-text-fallback {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1rem; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: #6B7280;
    transition: color 0.35s ease;
  }
  .brand-logo-wrap:hover .brand-text-fallback { color: #F59E0B; }

  @media (max-width: 768px) {
    .cut-bottom { clip-path: polygon(0 0, 100% 0, 100% 96%, 0 100%); padding-bottom: 60px; }
    .cut-top { clip-path: polygon(0 2%, 100% 0, 100% 100%, 0 100%); }
  }
`;
document.head.appendChild(style);

/* ─── Data ──────────────────────────────────────────────────────── */
const navLinks = ["Home", "About", "Services", "Projects", "Testimonials", "Contact"];

const electricalServices = [
  "General Electrical","Lighting","Switchboards & Upgrades","Fault Finding",
  "EV Charging","Heat Pumps & HVAC","Ventilation","Solar Installation",
  "Battery Storage","CCTV","Security & Alarms","Smart Home"
];
const buildingServices = [
  "Full Renovations","Bathroom Renos","Kitchen Renos","Interior Upgrades",
  "Interior & Exterior Painting","Plumbing","Leak Repairs","Waterproofing",
  "Tiling","Kitchen Splashbacks","Handyman","Landlord Maintenance"
];

const stats = [
  { Icon: Clock,   value: "24/7",   label: "Emergency Response Available" },
  { Icon: Layers,  value: "8+",     label: "Services — One Team, Every Trade" },
  { Icon: Shield,  value: "100%",   label: "Licensed & Insured" },
  { Icon: Phone,   value: "1 Call", label: "To Get Everything Sorted" },
];

const steps = [
  { n: "1", title: "Send Enquiry", desc: "Send us an online enquiry or give us a call. We'll answer your questions and give you an estimate." },
  { n: "2", title: "Meet Your Expert", desc: "A friendly member of our team will arrive at your door at the arranged time." },
  { n: "3", title: "Get Sorted", desc: "Sit back and let us handle the rest. You can rely on us to get the job done." },
];

const projects = [
  { tag: "Electrical", title: "Commercial Kitchen Fit-Out",       sub: "Charcoal Chicken, Auckland", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80" },
  { tag: "Solar & EV", title: "Solar + EV Charger Installation",  sub: "Residential, Takanini",      img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80" },
  { tag: "Renovation", title: "Bathroom Renovation",              sub: "Rental Property, Manukau",   img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=80" },
];

const testimonials = [
  {
    name: "Prince Negi",
    role: "Real Zea Property Management",
    text: "They are experts in their field — focused on ethics, compliance, and workmanship. We've never had a single complaint from our clients. Their pricing is affordable and the standards are always pleasing.",
  },
  {
    name: "Saif Obaidi",
    role: "Business Consultant Manager, Charcoal Chicken NZ Group",
    text: "The foundation of our relationship is built on trust — through transparency, integrity, and mutual respect. Anup and Ravi have always ensured open communication, making the process smooth and reassuring.",
  },
  {
    name: "Tajouj",
    role: "Founder, Brave the Crave Limited",
    text: "We've used Bloom Electrical for all our electrical and heat pump work over three years. True professionals — projects delivered on time and to budget. Highly recommended.",
  },
];

const clients = [
  { icon: <Home size={18} />, label: "Homeowners" },
  { icon: <Users size={18} />, label: "Landlords" },
  { icon: <Building2 size={18} />, label: "Property Managers" },
  { icon: <Layers size={18} />, label: "Developers" },
  { icon: <Briefcase size={18} />, label: "Small Businesses" },
  { icon: <Building2 size={18} />, label: "Commercial Owners" },
];

const brands = [
  { name: "Rinnai",    logo: "https://logo.clearbit.com/rinnai.com" },
  { name: "Haier",     logo: "https://logo.clearbit.com/haier.com" },
  { name: "ABB",       logo: "https://logo.clearbit.com/abb.com" },
  { name: "Panasonic", logo: "https://logo.clearbit.com/panasonic.com" },
  { name: "PDL",       logo: "https://logo.clearbit.com/pdl.co.nz" },
  { name: "Daikin",    logo: "https://logo.clearbit.com/daikin.com" },
  { name: "Schneider", logo: "https://logo.clearbit.com/se.com" },
  { name: "Prolux",    logo: "https://logo.clearbit.com/prolux.co.nz" },
  { name: "Superlux",  logo: "https://logo.clearbit.com/superlux.co.nz" },
  { name: "G-Light",   logo: "https://logo.clearbit.com/g-light.co.nz" },
  { name: "Provision", logo: "https://logo.clearbit.com/provision-isr.com" },
  { name: "Parmaco",   logo: "https://logo.clearbit.com/parmaco.co.nz" },
];

const footerElec = [
  "General Electrical","Lighting & Fit-outs","Switchboards & Upgrades",
  "Fault Finding","EV Charging","Heat Pumps & HVAC","Solar Installation",
  "Battery Storage","CCTV & Security","Smart Home"
];
const footerBuild = [
  "Full Renovations","Bathroom & Kitchen Renos","Painting (Interior & Exterior)",
  "Plumbing & Leak Repairs","Waterproofing","Tiling & Splashbacks",
  "Handyman Services","Landlord Maintenance"
];
const quickLinks = ["Home","About Us","Services","Projects","Contact"];

/* ─── Sub-components ─────────────────────────────────────────────── */

function Stars() {
  return (
    <div className="stars">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
      ))}
    </div>
  );
}

function SectionLabel({ children }) {
  return <p className="section-label" style={{ marginBottom: 12 }}>{children}</p>;
}

function SectionHeading({ children, dark = false }) {
  return (
    <h2 className="font-display" style={{
      fontSize: "clamp(2rem, 4vw, 3rem)",
      fontWeight: 800,
      textTransform: "uppercase",
      lineHeight: 1.05,
      color: dark ? "#0F1117" : "#F5F5F0",
      marginBottom: 16,
    }}>
      {children}
    </h2>
  );
}

/* ─── Sections ───────────────────────────────────────────────────── */

function Navbar({ scrolled }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "#0F1117",
        borderBottom: "1px solid #2A2D3A",
        transition: "box-shadow 0.3s",
        boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.5)" : "none",
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Logo */}
          <a href="#home" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <Zap size={22} color="#F59E0B" fill="#F59E0B" />
            <span className="font-display" style={{ fontSize: "1.35rem", fontWeight: 800, color: "#F5F5F0", letterSpacing: "0.03em" }}>
              BLOOM <span style={{ color: "#F59E0B" }}>ELECTRICAL</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="desktop-nav" data-hide-mobile>
            {navLinks.map(link => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                style={{
                  color: "#9CA3AF", textDecoration: "none",
                  fontSize: "0.85rem", fontWeight: 500,
                  letterSpacing: "0.05em", textTransform: "uppercase",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => e.target.style.color = "#F59E0B"}
                onMouseLeave={e => e.target.style.color = "#9CA3AF"}
              >
                {link}
              </a>
            ))}
            <a href="#contact" className="btn-amber" style={{ padding: "10px 20px", fontSize: "0.85rem" }}>
              Get a Free Quote
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#F5F5F0", display: "none" }}
            className="hamburger"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="mobile-menu">
          {navLinks.map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} className="mobile-link" onClick={() => setOpen(false)}>
              {link}
            </a>
          ))}
          <a href="#contact" className="btn-amber" style={{ marginTop: 16, justifyContent: "center" }} onClick={() => setOpen(false)}>
            Get a Free Quote
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          [data-hide-mobile] { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </>
  );
}

function Hero() {
  return (
    <section id="home" className="noise cut-bottom" style={{
      minHeight: "100vh",
      background: "#0F1117",
      position: "relative",
      display: "flex", alignItems: "center",
      paddingTop: 64,
    }}>
      {/* diagonal pattern */}
      <div className="hero-pattern" style={{ position: "absolute", inset: 0, zIndex: 0 }} />

      {/* amber accent line top-right */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: "35%", height: 3,
        background: "linear-gradient(to left, #F59E0B, transparent)",
        zIndex: 2,
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px 40px", width: "100%", position: "relative", zIndex: 3 }}>
        <div style={{ maxWidth: 760 }}>
          <SectionLabel>Auckland · Takanini · New Zealand</SectionLabel>

          <h1 className="font-display" style={{
            fontSize: "clamp(3.2rem, 7vw, 6rem)",
            fontWeight: 800,
            textTransform: "uppercase",
            lineHeight: 1,
            color: "#F5F5F0",
            marginBottom: 24,
            marginTop: 16,
          }}>
            Powering Your<br />
            <span style={{ color: "#F59E0B" }}>Home & Business.</span>
          </h1>

          <p style={{
            fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
            color: "#9CA3AF",
            lineHeight: 1.7,
            maxWidth: 600,
            marginBottom: 40,
          }}>
            Tired of juggling tradespeople? Bloom Electrical is your one-stop shop for electrical, solar, CCTV, renovations, plumbing, and more — all under one trusted team.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 56 }}>
            <a href="#contact" className="btn-amber">
              Get a Free Quote <ArrowRight size={16} />
            </a>
            <a href="tel:0800225666" className="btn-ghost">
              <Phone size={16} /> Call 0800 225 666
            </a>
          </div>
        </div>
      </div>

      {/* amber bottom accent */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 3,
        background: "linear-gradient(to right, #F59E0B, #F97316, transparent)",
        zIndex: 4,
      }} />
    </section>
  );
}

function ServicePanel({ side, Icon, title, desc, services, hovered, setHovered }) {
  const active = hovered === side;
  const inactive = hovered !== null && !active;
  const doubled = [...services, ...services];

  return (
    <div
      onMouseEnter={() => setHovered(side)}
      onMouseLeave={() => setHovered(null)}
      style={{
        flexGrow: active ? 7 : inactive ? 3 : 1,
        flexShrink: 0,
        flexBasis: "0%",
        transition: "flex-grow 0.65s cubic-bezier(0.4,0,0.2,1), filter 0.55s ease",
        filter: inactive ? "saturate(0.12) brightness(0.5)" : "none",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        minWidth: 0,
      }}
    >
      {/* Background image — swap url() with your own photo */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundColor: side === "elec" ? "#0D1526" : "#141820",
        backgroundImage: side === "elec"
          ? `url('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1400&auto=format&fit=crop&q=80')`
          : `url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&auto=format&fit=crop&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transform: active ? "scale(1.04)" : "scale(1)",
        transition: "transform 0.7s ease",
      }} />

      {/* Dark gradient */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(15,17,23,0.97) 0%, rgba(15,17,23,0.55) 50%, rgba(15,17,23,0.1) 100%)",
      }} />

      {/* Large icon — faint background decoration */}
      <div style={{
        position: "absolute", right: "-4%", bottom: "-4%",
        opacity: 0.08, color: "#F59E0B",
        zIndex: 1, pointerEvents: "none", lineHeight: 0,
      }}>
        <Icon size={320} strokeWidth={0.8} />
      </div>

      {/* Amber top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: "#F59E0B",
        transform: `scaleX(${active ? 1 : 0})`,
        transformOrigin: "left",
        transition: "transform 0.45s ease",
        zIndex: 3,
      }} />

      {/* Content — flex column, no outer padding so marquee+CTA bleed to edges */}
      <div style={{
        position: "relative", zIndex: 2,
        height: "100%",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        overflow: "hidden",
      }}>
        {/* Padded text zone */}
        <div style={{
          padding: "clamp(20px, 3.5vw, 48px)",
          paddingBottom: active ? "22px" : "clamp(28px, 4vw, 56px)",
          transition: "padding-bottom 0.65s cubic-bezier(0.4,0,0.2,1)",
        }}>
          <div className="font-display" style={{
            fontWeight: 800,
            textTransform: "uppercase",
            lineHeight: 0.9,
            fontSize: active ? "10.5vw" : inactive ? "4.5vw" : "7.5vw",
            transition: "font-size 0.65s cubic-bezier(0.4,0,0.2,1)",
            letterSpacing: "-0.02em",
            whiteSpace: "nowrap",
            color: "#F5F5F0",
          }}>
            {title}
          </div>

          <div style={{
            maxHeight: active ? 110 : 0,
            opacity: active ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.65s cubic-bezier(0.4,0,0.2,1), opacity 0.45s ease",
          }}>
            <div style={{ height: 1, background: "#2A2D3A", margin: "20px 0 14px" }} />
            <p style={{ color: "#9CA3AF", lineHeight: 1.75, fontSize: "0.9rem", maxWidth: 520 }}>
              {desc}
            </p>
          </div>
        </div>

        {/* Amber scrolling marquee — full bleed */}
        <div style={{
          maxHeight: active ? 38 : 0,
          opacity: active ? 1 : 0,
          overflow: "hidden",
          flexShrink: 0,
          transition: "max-height 0.65s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease",
        }}>
          <div style={{ background: "#F59E0B", height: 38, overflow: "hidden", display: "flex", alignItems: "center" }}>
            <div style={{
              display: "flex", alignItems: "center",
              animation: "scrollBrands 24s linear infinite",
              width: "max-content",
            }}>
              {doubled.map((s, i) => (
                <span key={i} style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: "0.7rem",
                  color: "#0F1117",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  whiteSpace: "nowrap",
                  padding: "0 18px",
                  borderRight: "1px solid rgba(0,0,0,0.15)",
                  lineHeight: "38px",
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA — full bleed dark button */}
        <div style={{
          maxHeight: active ? 56 : 0,
          opacity: active ? 1 : 0,
          overflow: "hidden",
          flexShrink: 0,
          transition: "max-height 0.65s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease",
        }}>
          <a
            href="#contact"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              background: "#0F1117", color: "#F5F5F0",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700, fontSize: "1rem",
              letterSpacing: "0.08em", textTransform: "uppercase",
              textDecoration: "none",
              padding: "18px 24px",
              borderTop: "1px solid #1A1D27",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#1A1D27"; e.currentTarget.style.color = "#F59E0B"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#0F1117"; e.currentTarget.style.color = "#F5F5F0"; }}
          >
            Get a Free Quote <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}

function Services() {
  const [hovered, setHovered] = useState(null);

  return (
    <section id="services" style={{ background: "#0F1117" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px 52px", textAlign: "center" }}>
        <SectionLabel>Our Services</SectionLabel>
        <SectionHeading>Two Specialisms. One Company.</SectionHeading>
        <p style={{ color: "#9CA3AF", maxWidth: 520, margin: "0 auto" }}>
          From switchboards to bathroom renos — we do it all, and we do it right.
        </p>
      </div>

      <div style={{
        display: "flex",
        height: "72vh",
        minHeight: 500,
        maxHeight: 700,
        overflow: "hidden",
      }}>
        <ServicePanel
          side="elec" Icon={Zap}
          title="Electrical"
          desc="Licensed electrical work for homes and businesses — from new builds and switchboards to solar, EV chargers, CCTV, and smart security systems."
          services={electricalServices}
          hovered={hovered} setHovered={setHovered}
        />
        <div style={{ width: 1, background: "#2A2D3A", flexShrink: 0, zIndex: 5 }} />
        <ServicePanel
          side="build" Icon={Wrench}
          title="Building"
          desc="End-to-end building, renovation, and maintenance — bathrooms, kitchens, painting, plumbing, tiling, waterproofing, and ongoing property upkeep."
          services={buildingServices}
          hovered={hovered} setHovered={setHovered}
        />
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="about" style={{ background: "#0F1117" }}>
      {/* Process steps */}
      <div style={{ padding: "80px 24px 56px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <SectionLabel>The Process</SectionLabel>
            <SectionHeading>Simple from start to finish.</SectionHeading>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
            position: "relative",
          }}>
            {steps.map((step, i) => (
              <div key={i} style={{ position: "relative" }}>
                <div className="card-hover" style={{
                  background: "#1A1D27",
                  borderRadius: 3,
                  padding: "36px 30px",
                  height: "100%",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 18, marginBottom: 20 }}>
                    <div className="step-circle">{step.n}</div>
                    <div>
                      <div style={{ color: "#9CA3AF", fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 4 }}>
                        Step {step.n}
                      </div>
                      <h3 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 800, textTransform: "uppercase", color: "#F5F5F0" }}>
                        {step.title}
                      </h3>
                    </div>
                  </div>
                  <p style={{ color: "#9CA3AF", lineHeight: 1.7, fontSize: "0.93rem" }}>{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div style={{
                    position: "absolute", right: -13, top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 2, display: "flex",
                  }}>
                    <ChevronRight size={22} color="#F59E0B" style={{ filter: "drop-shadow(0 0 6px #F59E0B)" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ padding: "24px 0" }}>
        <div style={{
          width: "80%",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
          gap: 12,
        }}>
          {stats.map(({ Icon, value, label }, i) => (
            <div key={i} style={{
              position: "relative",
              background: "#F59E0B",
              clipPath: "polygon(0 0, calc(100% - 52px) 0, 100% 52px, 100% 100%, 0 100%)",
              minHeight: 340,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "36px 32px",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute",
                right: "-4%",
                top: "50%",
                transform: "translateY(-55%)",
                opacity: 0.12,
                color: "#0F1117",
                pointerEvents: "none",
                lineHeight: 0,
              }}>
                <Icon size={240} strokeWidth={0.7} />
              </div>

              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontSize: "clamp(3.5rem, 4.5vw, 5.5rem)",
                color: "#0F1117",
                lineHeight: 1,
                marginBottom: 12,
                letterSpacing: "-0.03em",
                textAlign: "left",
              }}>
                {value}
              </div>

              <div style={{
                color: "rgba(15,17,23,0.65)",
                fontSize: "0.85rem",
                fontWeight: 400,
                lineHeight: 1.5,
                textAlign: "left",
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" style={{ background: "#0F1117", padding: "80px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 40 }}>
          <div>
            <SectionLabel>Recent Work</SectionLabel>
            <SectionHeading>Work we're proud of.</SectionHeading>
          </div>
          <a href="#contact" className="btn-ghost" style={{ padding: "10px 20px", fontSize: "0.85rem" }}>
            View All Projects <ArrowRight size={14} />
          </a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {projects.map((p, i) => (
            <div key={i} className="card-hover" style={{ background: "#12151E", borderRadius: 3, overflow: "hidden" }}>
              <img
                src={p.img}
                alt={p.title}
                style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
              />
              <div style={{ padding: "24px 24px 28px" }}>
                <span className="cat-tag" style={{ marginBottom: 12, display: "inline-block" }}>{p.tag}</span>
                <h4 className="font-display" style={{ fontSize: "1.35rem", fontWeight: 800, textTransform: "uppercase", color: "#F5F5F0", marginBottom: 4 }}>
                  {p.title}
                </h4>
                <p style={{ color: "#9CA3AF", fontSize: "0.85rem" }}>{p.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimonials" style={{ background: "#0F1117", padding: "80px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <SectionLabel>Client Feedback</SectionLabel>
          <SectionHeading>Trusted by homeowners, landlords, and businesses.</SectionHeading>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {testimonials.map((t, i) => (
            <div key={i} className="card-hover" style={{ background: "#1A1D27", borderRadius: 3, padding: "32px 28px" }}>
              <Stars />
              <p style={{ color: "#F5F5F0", lineHeight: 1.7, fontSize: "0.93rem", marginBottom: 24, fontStyle: "italic" }}>
                "{t.text}"
              </p>
              <div style={{ borderTop: "1px solid #2A2D3A", paddingTop: 16 }}>
                <div style={{ fontWeight: 600, color: "#F5F5F0", fontSize: "0.93rem" }}>{t.name}</div>
                <div style={{ color: "#9CA3AF", fontSize: "0.8rem", marginTop: 2 }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhoWeWorkWith() {
  return (
    <section style={{ background: "#0F1117", padding: "60px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <SectionLabel>Our Clients</SectionLabel>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          {clients.map((c, i) => (
            <div key={i} className="client-pill">
              <span style={{ color: "#F59E0B" }}>{c.icon}</span>
              <span>{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandLogo({ name, logo }) {
  const [err, setErr] = useState(false);
  return (
    <div className="brand-logo-wrap">
      {logo && !err
        ? <img src={logo} alt={name} className="brand-logo" onError={() => setErr(true)} />
        : <span className="brand-text-fallback">{name}</span>
      }
    </div>
  );
}

function BrandsStrip() {
  const doubled = [...brands, ...brands];
  return (
    <section style={{ background: "#0F1117", padding: "60px 0" }}>
      <div style={{ textAlign: "center", marginBottom: 28, padding: "0 24px" }}>
        <SectionLabel>Industry Partners</SectionLabel>
        <p style={{ color: "#9CA3AF", fontSize: "0.88rem", marginTop: 4 }}>Our installations feature top-tier brands.</p>
      </div>
      <div className="brands-mask">
        <div className="brands-track">
          {doubled.map((b, i) => (
            <BrandLogo key={i} name={b.name} logo={b.logo} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABanner() {
  return (
    <section id="contact" style={{ background: "#F59E0B", padding: "72px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <h2 className="font-display" style={{
          fontSize: "clamp(2rem, 4vw, 3.2rem)",
          fontWeight: 800,
          textTransform: "uppercase",
          color: "#0F1117",
          lineHeight: 1.05,
          marginBottom: 16,
        }}>
          Got an electrical or property job that needs doing?
        </h2>
        <p style={{ color: "#1A1D27", fontSize: "1rem", lineHeight: 1.6, marginBottom: 36, maxWidth: 560, margin: "0 auto 36px" }}>
          Get in touch with Bloom Electrical today — no obligation quote, transparent pricing, quality guaranteed.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="mailto:info@bloomelectrical.co.nz" style={{
            background: "#0F1117", color: "#F5F5F0",
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
            fontSize: "1rem", letterSpacing: "0.05em", textTransform: "uppercase",
            padding: "14px 28px", border: "none", borderRadius: 3, cursor: "pointer",
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
            transition: "background 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#1A1D27"}
            onMouseLeave={e => e.currentTarget.style.background = "#0F1117"}
          >
            <Mail size={16} /> Get a Free Quote
          </a>
          <a href="tel:0800225666" className="btn-dark-outline" style={{ borderColor: "#0F1117" }}>
            <Phone size={16} /> Call 0800 225 666
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#0F1117" }}>
      {/* Map — full width, no text, top fade into dark bg */}
      <div style={{ position: "relative", width: "100%", height: 380, overflow: "hidden" }}>
        <iframe
          title="Bloom Electrical Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3192.4!2d174.9021!3d-37.0647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s82B+Spartan+Road%2C+Takanini%2C+Auckland!5e0!3m2!1sen!2snz!4v1"
          width="100%"
          height="100%"
          style={{ border: 0, display: "block", filter: "grayscale(1) invert(0.92) contrast(0.88) brightness(0.7) hue-rotate(180deg)" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        {/* Top fade into footer background */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 120,
          background: "linear-gradient(to bottom, #0F1117 0%, transparent 100%)",
          pointerEvents: "none",
        }} />
        {/* Amber location pin */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#F59E0B", boxShadow: "0 0 0 5px rgba(245,158,11,0.2), 0 0 20px rgba(245,158,11,0.5)" }} />
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 40,
          paddingTop: 56,
          paddingBottom: 48,
        }}>
          {/* Col 1 */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Zap size={20} color="#F59E0B" fill="#F59E0B" />
              <span className="font-display" style={{ fontSize: "1.2rem", fontWeight: 800, color: "#F5F5F0" }}>
                BLOOM <span style={{ color: "#F59E0B" }}>ELECTRICAL</span>
              </span>
            </div>
            <p style={{ color: "#9CA3AF", fontSize: "0.85rem", lineHeight: 1.7, maxWidth: 240 }}>
              Your one-stop shop for electrical and property services across Auckland and NZ.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {[Facebook, Instagram].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: 36, height: 36, borderRadius: 3,
                  background: "#1A1D27", border: "1px solid #2A2D3A",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#9CA3AF", transition: "color 0.2s, border-color 0.2s",
                  textDecoration: "none",
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#F59E0B"; e.currentTarget.style.borderColor = "#F59E0B"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#9CA3AF"; e.currentTarget.style.borderColor = "#2A2D3A"; }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h5 className="font-display" style={{ fontSize: "1rem", fontWeight: 700, textTransform: "uppercase", color: "#F5F5F0", marginBottom: 14, letterSpacing: "0.05em" }}>
              Electrical & Technology
            </h5>
            {footerElec.map(s => <a key={s} href="#services" className="footer-link">{s}</a>)}
          </div>

          {/* Col 3 */}
          <div>
            <h5 className="font-display" style={{ fontSize: "1rem", fontWeight: 700, textTransform: "uppercase", color: "#F5F5F0", marginBottom: 14, letterSpacing: "0.05em" }}>
              Building & Property
            </h5>
            {footerBuild.map(s => <a key={s} href="#services" className="footer-link">{s}</a>)}
            <h5 className="font-display" style={{ fontSize: "1rem", fontWeight: 700, textTransform: "uppercase", color: "#F5F5F0", margin: "18px 0 10px", letterSpacing: "0.05em" }}>
              Quick Links
            </h5>
            {quickLinks.map(l => <a key={l} href={`#${l.toLowerCase().replace(" ", "")}`} className="footer-link">{l}</a>)}
          </div>

          {/* Col 4 */}
          <div>
            <h5 className="font-display" style={{ fontSize: "1rem", fontWeight: 700, textTransform: "uppercase", color: "#F5F5F0", marginBottom: 14, letterSpacing: "0.05em" }}>
              Contact Us
            </h5>
            {[
              { icon: <MapPin size={14} />, text: "82B Spartan Road, Takanini, Auckland" },
              { icon: <Phone size={14} />, text: "0800 2 BLOOM (0800 225 666)", href: "tel:0800225666" },
              { icon: <Mail size={14} />, text: "info@bloomelectrical.co.nz", href: "mailto:info@bloomelectrical.co.nz" },
              { icon: <Clock size={14} />, text: "Mon–Fri 8am–5pm" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10 }}>
                <span style={{ color: "#F59E0B", marginTop: 2, flexShrink: 0 }}>{item.icon}</span>
                {item.href ? (
                  <a href={item.href} style={{ color: "#9CA3AF", fontSize: "0.85rem", lineHeight: 1.5, textDecoration: "none" }}
                    onMouseEnter={e => e.target.style.color = "#F59E0B"}
                    onMouseLeave={e => e.target.style.color = "#9CA3AF"}
                  >{item.text}</a>
                ) : (
                  <span style={{ color: "#9CA3AF", fontSize: "0.85rem", lineHeight: 1.5 }}>{item.text}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid #2A2D3A",
          padding: "20px 0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 8,
        }}>
          <p style={{ color: "#9CA3AF", fontSize: "0.78rem" }}>
            © 2025 Bloom Electrical Ltd. Licensed Electrical Inspectors — Auckland, New Zealand.
          </p>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Shield size={12} color="#F59E0B" />
            <span style={{ color: "#9CA3AF", fontSize: "0.78rem" }}>Licensed & Insured</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── App ────────────────────────────────────────────────────────── */
export default function BloomElectrical() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar scrolled={scrolled} />
      <Hero />
      <Services />
      <HowItWorks />
      <Projects />
      <Testimonials />
      <WhoWeWorkWith />
      <BrandsStrip />
      <CTABanner />
      <Footer />
    </div>
  );
}
