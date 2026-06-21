import { useState, useEffect, useRef } from "react";
import { initParticleBuilding } from "./ParticleBuilding.js";
import {
  Zap, Wrench, Phone, Mail, MapPin, Clock, Shield, Star,
  ArrowRight, Menu, X, Facebook, Instagram,
  ChevronRight, Home, Building2, Users, Briefcase, Layers,
} from "lucide-react";

/* ─── Google Fonts ─────────────────────────────────────────────── */
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap";
document.head.appendChild(fontLink);

/* ─── CSS injection ─────────────────────────────────────────────── */
const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #FFFFFF; color: #111111; font-family: 'DM Sans', sans-serif; }

  .font-display { font-family: 'Poppins', sans-serif; }
  .amber { color: #F59E0B; }
  .amber-bg { background: #F59E0B; }
  .cyan { color: #01f9c6; }
  .cyan-bg { background: #01f9c6; }

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
    font-family: 'Poppins', sans-serif;
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
    color: #111111;
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 13px 28px;
    border: 2px solid rgba(0,0,0,0.25);
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
    font-family: 'Poppins', sans-serif;
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
    border: 1px solid #E2E2E8;
    border-left: 3px solid #E2E2E8;
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  }
  .card-hover:hover {
    border-left-color: #F59E0B;
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.1), 0 0 0 1px rgba(245,158,11,0.2);
  }

  /* section label */
  .section-label {
    font-family: 'Poppins', sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #01f9c6;
    display: flex; align-items: center; gap: 8px;
  }
  .section-label::before {
    content: '';
    display: inline-block;
    width: 24px; height: 2px;
    background: #01f9c6;
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
    font-family: 'Poppins', sans-serif;
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
    background: #01f9c6;
    color: #111111;
    font-family: 'Poppins', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  /* process step card */
  .process-card {
    background: #111111;
    border: 1px solid #222222;
    border-left: 3px solid #F59E0B;
    border-radius: 3px;
    padding: 36px 30px;
    height: 100%;
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  }
  .process-card:hover {
    border-left-color: #01f9c6;
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(1,249,198,0.2);
  }
  .process-card .step-circle {
    background: #F59E0B;
    transition: background-color 0.25s, color 0.25s;
  }
  .process-card:hover .step-circle {
    background: #01f9c6;
  }

  /* stat item */
  .stat-value {
    font-family: 'Poppins', sans-serif;
    font-size: 2.4rem;
    font-weight: 800;
    color: #F59E0B;
    line-height: 1;
  }

  /* stats grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    width: 80%;
    margin: 0 auto;
  }
  @media (max-width: 900px) {
    .stats-grid {
      grid-template-columns: 1fr;
      width: 90%;
    }
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

  @keyframes slideDownFade {
    from { transform: translateY(-10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  /* mobile menu */
  .mobile-menu {
    position: fixed; inset: 0; top: 64px;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    z-index: 90;
    border-top: 1px solid #E2E2E8;
    padding: 24px;
    display: flex; flex-direction: column; gap: 4px;
    animation: slideDownFade 0.25s ease-out forwards;
  }
  .mobile-link {
    font-family: 'Poppins', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #111111;
    padding: 14px 20px;
    border-bottom: 1px solid #E2E2E8;
    text-decoration: none;
    transition: color 0.2s;
  }
  .mobile-link:hover { color: #F59E0B; }

  /* services split responsive */
  .services-split {
    display: flex;
    height: 72vh;
    min-height: 500px;
    max-height: 700px;
    overflow: hidden;
  }
  .service-panel-wrap {
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: 0%;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    min-width: 0;
  }
  @media (max-width: 768px) {
    .services-split {
      flex-direction: column !important;
      height: auto !important;
      max-height: none !important;
      min-height: auto !important;
    }
    .service-panel-wrap {
      flex-basis: auto !important;
      flex-grow: 1 !important;
      height: 320px !important;
      width: 100% !important;
    }
  }

  /* step process arrow responsive */
  .step-arrow {
    position: absolute;
    right: -13px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    display: flex;
  }
  @media (max-width: 768px) {
    .step-arrow {
      right: auto !important;
      left: 50% !important;
      top: auto !important;
      bottom: -22px !important;
      transform: translateX(-50%) rotate(90deg) !important;
    }
  }

  /* contact form responsive */
  .contact-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  @media (max-width: 600px) {
    .contact-form {
      grid-template-columns: 1fr !important;
    }
  }

  /* service divider responsive */
  .service-divider {
    width: 1px;
    background: #E2E2E8;
    flex-shrink: 0;
    z-index: 5;
  }
  @media (max-width: 768px) {
    .service-divider {
      display: none !important;
    }
  }

  .brand-chip {
    display: inline-block;
    padding: 8px 18px;
    border: 1px solid #E2E2E8;
    border-radius: 2px;
    font-family: 'Poppins', sans-serif;
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
    border: 1px solid #E2E2E8;
    border-radius: 3px;
    font-size: 0.9rem;
    font-weight: 500;
    color: #9CA3AF;
    transition: border-color 0.2s, color 0.2s;
    white-space: nowrap;
  }
  .client-pill:hover { border-color: #F59E0B; color: #111111; }

  /* scrolling brands */
  .brands-track {
    display: flex; gap: 64px;
    align-items: center;
    animation: scrollBrands 55s linear infinite;
    width: max-content;
  }
  .brands-track-reverse {
    display: flex; gap: 64px;
    align-items: center;
    animation: scrollBrandsReverse 55s linear infinite;
    width: max-content;
  }
  @keyframes scrollBrands {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes scrollBrandsReverse {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }
  .brands-mask {
    overflow: hidden;
    -webkit-mask-image: linear-gradient(to right, transparent 0, black 80px, black calc(100% - 80px), transparent 100%);
    mask-image: linear-gradient(to right, transparent 0, black 80px, black calc(100% - 80px), transparent 100%);
  }

  /* image placeholder */
  .img-placeholder {
    background: #1A1D27;
    border: 1px dashed #E2E2E8;
    display: flex; align-items: center; justify-content: center;
    color: rgba(245,158,11,0.35);
    font-family: 'Poppins', sans-serif;
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
    padding: 0; height: 64px;
    background: transparent;
    border: none;
    cursor: default;
    white-space: nowrap;
  }
  .brand-logo {
    height: 36px; max-width: 130px;
    object-fit: contain;
    filter: brightness(0);
  }
  .brand-text-fallback {
    font-family: 'Poppins', sans-serif;
    font-size: 1.1rem; font-weight: 800;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: #000000;
  }

  @media (max-width: 768px) {
    .cut-bottom { clip-path: polygon(0 0, 100% 0, 100% 96%, 0 100%); padding-bottom: 60px; }
    .cut-top { clip-path: polygon(0 2%, 100% 0, 100% 100%, 0 100%); }
  }
`;
document.head.appendChild(style);

/* ─── Data ──────────────────────────────────────────────────────── */
// ─── Hero background mode ────────────────────────────────────────────────────
// 'particles' → animated particle field built from the image below
// 'image'     → plain background image, no canvas overhead
const HERO_BG_MODE = 'image';
const HERO_BG_IMAGE = `${import.meta.env.BASE_URL}Particle-building-7.png`;
// ─────────────────────────────────────────────────────────────────────────────

const navLinks = ["Home", "About", "Services", "Projects", "Testimonials", "Contact"];

const electricalServices = [
  "General Electrical", "Lighting", "Switchboards & Upgrades", "Fault Finding",
  "EV Charging", "Heat Pumps & HVAC", "Ventilation", "Solar Installation",
  "Battery Storage", "CCTV", "Security & Alarms", "Smart Home"
];
const buildingServices = [
  "Full Renovations", "Bathroom Renos", "Kitchen Renos", "Interior Upgrades",
  "Interior & Exterior Painting", "Plumbing", "Leak Repairs", "Waterproofing",
  "Tiling", "Kitchen Splashbacks", "Handyman", "Landlord Maintenance"
];

const stats = [
  { Icon: Home, value: "200+", label: "Homes Serviced Every Month" },
  { Icon: Users, value: "50+", label: "Happy Clients" },
  { Icon: Shield, value: "5", label: "Years of Dedicated Service" },
];

const steps = [
  { n: "1", title: "Send Enquiry", desc: "Send us an online enquiry or give us a call. We'll answer your questions and give you an estimate." },
  { n: "2", title: "Meet Your Expert", desc: "A friendly member of our team will arrive at your door at the arranged time." },
  { n: "3", title: "Get Sorted", desc: "Sit back and let us handle the rest. You can rely on us to get the job done." },
];

const projects = [
  { tag: "Electrical", title: "Commercial Kitchen Fit-Out", sub: "Charcoal Chicken, Auckland", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80" },
  { tag: "Solar & EV", title: "Solar + EV Charger Installation", sub: "Residential, Takanini", img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80" },
  { tag: "Renovation", title: "Bathroom Renovation", sub: "Rental Property, Manukau", img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=80" },
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
    text: "We have used Bloom Electrical for all our electrical and heat pump installation over the last 3 years. The team are true professionals. Projects were well managed and delivered on time and to budget. Highly recommended",
  },
];

const workedForClients = [
  { name: "Brave The Crave", logo: `${import.meta.env.BASE_URL}worked%20for%20logos/Brave_The_Crave_res.png` },
  { name: "Dosa Plaza Takapuna", logo: `${import.meta.env.BASE_URL}worked%20for%20logos/Dosa_Plaza___Takapuna_res.png` },
  { name: "Flame Pizza", logo: `${import.meta.env.BASE_URL}worked%20for%20logos/Flame___Pizza_res.png` },
  { name: "Yogiji New Zealand Limited", logo: `${import.meta.env.BASE_URL}worked%20for%20logos/Yogiji_New_Zealand_Limited_res.png` },
  { name: "Charcoal Chicken", logo: `${import.meta.env.BASE_URL}worked%20for%20logos/charcoal_chicken.png` },
  { name: "Charcoal Chicken Takanini", logo: `${import.meta.env.BASE_URL}worked%20for%20logos/charcoal_chicken_takanini-res.png` },
  { name: "Real Zea Property Management", logo: `${import.meta.env.BASE_URL}worked%20for%20logos/relzea-res.png` },
];

const brands = [
  { name: "Rinnai", logo: `${import.meta.env.BASE_URL}worked%20with%20logos/rinnai-res.png` },
  { name: "Haier", logo: `${import.meta.env.BASE_URL}worked%20with%20logos/Haier-resized.png` },
  { name: "ABB", logo: `${import.meta.env.BASE_URL}worked%20with%20logos/abb-res.png` },
  { name: "Panasonic", logo: `${import.meta.env.BASE_URL}worked%20with%20logos/panasonic-res.png` },
  { name: "PDL", logo: `${import.meta.env.BASE_URL}worked%20with%20logos/pdl-res.png` },
  { name: "Daikin", logo: `${import.meta.env.BASE_URL}worked%20with%20logos/daikin-res.png` },
  { name: "Schneider", logo: `${import.meta.env.BASE_URL}worked%20with%20logos/Schneider-res.png` },
  { name: "Prolux", logo: `${import.meta.env.BASE_URL}worked%20with%20logos/prolux-res.png` },
  { name: "Superlux", logo: `${import.meta.env.BASE_URL}worked%20with%20logos/superlux-res.png` },
  { name: "G-Light", logo: `${import.meta.env.BASE_URL}worked%20with%20logos/g-light-res.png` },
  { name: "Provision", logo: `${import.meta.env.BASE_URL}worked%20with%20logos/provision-res.png` },
  { name: "Parmaco", logo: `${import.meta.env.BASE_URL}worked%20with%20logos/parmaco-res.png` },
  { name: "AAP", logo: `${import.meta.env.BASE_URL}worked%20with%20logos/AAP-res.png` },
  { name: "Clipsal", logo: `${import.meta.env.BASE_URL}worked%20with%20logos/clipsal-res.png` },
];

const footerElec = [
  "General Electrical", "Lighting & Fit-outs", "Switchboards & Upgrades",
  "Fault Finding", "EV Charging", "Heat Pumps & HVAC", "Solar Installation",
  "Battery Storage", "CCTV & Security", "Smart Home"
];
const footerBuild = [
  "Full Renovations", "Bathroom & Kitchen Renos", "Painting (Interior & Exterior)",
  "Plumbing & Leak Repairs", "Waterproofing", "Tiling & Splashbacks",
  "Handyman Services", "Landlord Maintenance"
];
const quickLinks = ["Home", "About Us", "Services", "Projects", "Contact"];

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

function SectionHeading({ children }) {
  return (
    <h2 className="font-display" style={{
      fontSize: "clamp(2rem, 4vw, 3rem)",
      fontWeight: 800,
      textTransform: "uppercase",
      lineHeight: 1.05,
      color: "#111111",
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
        background: "#FFFFFF",
        borderBottom: "1px solid #E2E2E8",
        transition: "box-shadow 0.3s",
        boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.08)" : "none",
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Logo */}
          <a href="#home" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img 
              src={`${import.meta.env.BASE_URL}bloom_logo_orange.png`} 
              alt="Bloom Electrical" 
              style={{ height: "40px", objectFit: "contain" }} 
            />
          </a>

          {/* Desktop nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="desktop-nav" data-hide-mobile>
            {navLinks.map(link => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                style={{
                  color: "#111111", textDecoration: "none",
                  fontSize: "0.85rem", fontWeight: 500,
                  letterSpacing: "0.05em", textTransform: "uppercase",
                  fontFamily: "'Poppins', sans-serif",
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
            style={{ background: "none", border: "none", cursor: "pointer", color: "#111111", display: "none" }}
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
  useEffect(() => {
    if (HERO_BG_MODE !== 'particles') return;
    const effect = initParticleBuilding("home", HERO_BG_IMAGE, {
      particleSize: 4,   // orange particles render at 2px (0.5×), others at 4px
      shape: 'square',   // 'square' | 'circle' | 'diamond' | 'spark'
      sampleStep: 10,
      noiseIntensity: 2.5,
      speed: 0.032,
      damping: 0.91,
      scatterMode: "radial",
      repulsionRadius: 60,
      repulsionStrength: 3,
      minBrightness: 30,
      maxBrightness: 220,
      tintColor: "#F59E0B",
    });
    const cv = document.getElementById("home").lastElementChild;
    if (cv?.tagName === "CANVAS") cv.style.zIndex = "1";
    return () => effect.destroy();
  }, []);

  return (
    <section id="home" className="noise cut-bottom" style={{
      minHeight: "100vh",
      background: "#FFFFFF",
      position: "relative",
      overflow: "hidden",
      display: "flex", alignItems: "center",
      paddingTop: 64,
    }}>
      {/* diagonal pattern */}
      <div className="hero-pattern" style={{ position: "absolute", inset: 0, zIndex: 0 }} />

      {/* static background image mode */}
      {HERO_BG_MODE === 'image' && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          backgroundImage: `url(${HERO_BG_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center 65%",
          opacity: 0.85,
        }} />
      )}

      {/* amber accent line top-right */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: "35%", height: 3,
        background: "linear-gradient(to left, #F59E0B, transparent)",
        zIndex: 2,
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px 40px", width: "100%", position: "relative", zIndex: 3 }}>
        <div style={{ maxWidth: 760 }}>
          <SectionLabel>Auckland, NZ</SectionLabel>

          <h1 className="font-display" style={{
            fontSize: "clamp(3.2rem, 7vw, 6rem)",
            fontWeight: 800,
            textTransform: "uppercase",
            lineHeight: 1,
            color: "#111111",
            marginBottom: 24,
            marginTop: 16,
          }}>
            Powering Your<br />
            <span style={{ color: "#F59E0B" }}>Home & Business.</span>
          </h1>

          <p style={{
            fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
            color: "#111111",
            lineHeight: 1.7,
            maxWidth: 600,
            marginBottom: 40,
          }}>
            Tired of juggling tradespeople? Bloom Electrical and Hardware Services is your one-stop shop for electrical, solar, CCTV, renovations, plumbing, and more — all under one trusted team.
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
      className="service-panel-wrap"
      style={{
        flexGrow: active ? 7 : inactive ? 3 : 1,
        transition: "flex-grow 0.65s cubic-bezier(0.4,0,0.2,1), filter 0.55s ease",
        filter: inactive ? "saturate(0.12) brightness(0.5)" : "none",
      }}
    >
      {/* Background image — swap url() with your own photo */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundColor: side === "elec" ? "#D6E4F0" : "#E8E8EC",
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
        background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.05) 100%)",
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
            color: "#F59E0B",
          }}>
            {title}
          </div>

          <div style={{
            maxHeight: active ? 110 : 0,
            opacity: active ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.65s cubic-bezier(0.4,0,0.2,1), opacity 0.45s ease",
          }}>
            <div style={{ height: 1, background: "#E2E2E8", margin: "20px 0 14px" }} />
            <p style={{ color: "#F59E0B", lineHeight: 1.75, fontSize: "0.9rem", maxWidth: 520 }}>
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
              background: "#111111", color: "#FFFFFF",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700, fontSize: "1rem",
              letterSpacing: "0.08em", textTransform: "uppercase",
              textDecoration: "none",
              padding: "18px 24px",
              borderTop: "1px solid #1A1D27",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#222222"; e.currentTarget.style.color = "#F59E0B"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#111111"; e.currentTarget.style.color = "#FFFFFF"; }}
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
    <section id="services" style={{ background: "#FFFFFF" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(48px, 8vw, 96px) 24px clamp(24px, 4vw, 48px)", textAlign: "left" }}>
        <SectionLabel>Our Services</SectionLabel>
        <SectionHeading>Two Specialisms. One Company.</SectionHeading>
      </div>

      <div className="services-split">
        <ServicePanel
          side="elec" Icon={Zap}
          title="Electrical"
          desc="Licensed electrical work for homes and businesses — from new builds and switchboards to solar, EV chargers, CCTV, and smart security systems."
          services={electricalServices}
          hovered={hovered} setHovered={setHovered}
        />
        <div className="service-divider" />
        <ServicePanel
          side="build" Icon={Wrench}
          title="Hardware"
          desc="End-to-end hardware, renovation, and maintenance — from switchboards to renovations, we handle it all under one trusted team."
          services={buildingServices}
          hovered={hovered} setHovered={setHovered}
        />
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="about" style={{ background: "#FFFFFF" }}>
      {/* Process steps */}
      <div style={{ padding: "clamp(48px, 8vw, 96px) 24px clamp(32px, 5vw, 56px)" }}>
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
                <div className="process-card">
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 18, marginBottom: 20 }}>
                    <div className="step-circle">{step.n}</div>
                    <div>
                      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'Poppins', sans-serif", marginBottom: 4 }}>
                        Step {step.n}
                      </div>
                      <h3 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 800, textTransform: "uppercase", color: "#FFFFFF" }}>
                        {step.title}
                      </h3>
                    </div>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7, fontSize: "0.93rem" }}>{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="step-arrow">
                    <ChevronRight size={22} color="#01f9c6" style={{ filter: "drop-shadow(0 0 6px #01f9c6)" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ padding: "24px 0" }}>
        <div className="stats-grid">
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
    <section id="projects" style={{ background: "#FFFFFF", padding: "clamp(48px, 8vw, 96px) 24px" }}>
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
            <div key={i} className="process-card" style={{ padding: 0, overflow: "hidden" }}>
              <img
                src={p.img}
                alt={p.title}
                style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
              />
              <div style={{ padding: "24px 24px 28px" }}>
                <span className="cat-tag" style={{ marginBottom: 12, display: "inline-block" }}>{p.tag}</span>
                <h4 className="font-display" style={{ fontSize: "1.35rem", fontWeight: 800, textTransform: "uppercase", color: "#FFFFFF", marginBottom: 4 }}>
                  {p.title}
                </h4>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>{p.sub}</p>
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
    <section id="testimonials" style={{ background: "#FFFFFF", padding: "clamp(48px, 8vw, 96px) 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "left", marginBottom: 48 }}>
          <SectionLabel>Client Feedback</SectionLabel>
          <SectionHeading>Trusted by homeowners, landlords, and businesses.</SectionHeading>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {testimonials.map((t, i) => (
            <div key={i} className="process-card" style={{ padding: "32px 28px" }}>
              <Stars />
              <p style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.7, fontSize: "0.93rem", marginBottom: 24, fontStyle: "italic" }}>
                "{t.text}"
              </p>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16 }}>
                <div style={{ fontWeight: 600, color: "#FFFFFF", fontSize: "0.93rem" }}>{t.name}</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", marginTop: 2 }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhoWeWorkWith() {
  const quadrupled = [
    ...workedForClients,
    ...workedForClients,
    ...workedForClients,
    ...workedForClients
  ];
  return (
    <section style={{ background: "#FFFFFF", padding: "clamp(36px, 6vw, 64px) 0" }}>
      <div style={{ textAlign: "left", marginBottom: 28, padding: "0 24px", maxWidth: 1280, margin: "0 auto" }}>
        <SectionHeading>Our Clients</SectionHeading>
      </div>
      <div style={{ background: "#F59E0B", padding: "20px 0" }}>
        <div className="brands-mask">
          <div className="brands-track">
            {quadrupled.map((c, i) => (
              <BrandLogo key={i} name={c.name} logo={c.logo} />
            ))}
          </div>
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
    <section style={{ background: "#FFFFFF", padding: "clamp(36px, 6vw, 64px) 0" }}>
      <div style={{ textAlign: "left", marginBottom: 28, padding: "0 24px", maxWidth: 1280, margin: "0 auto" }}>
        <SectionHeading>Industry Partners</SectionHeading>
      </div>
      <div style={{ background: "#F59E0B", padding: "20px 0" }}>
        <div className="brands-mask">
          <div className="brands-track-reverse">
            {doubled.map((b, i) => (
              <BrandLogo key={i} name={b.name} logo={b.logo} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTABanner() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // 'idle' | 'sending' | 'sent'

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    // Opens the user's mail client pre-filled — swap for a real API endpoint when ready
    const subject = encodeURIComponent(`Quote Request from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:info@bloomelectrical.co.nz?subject=${subject}&body=${body}`;
    setStatus("sent");
  }

  const inputStyle = {
    width: "100%", padding: "13px 16px",
    background: "rgba(0,0,0,0.18)", border: "1.5px solid rgba(15,17,23,0.35)",
    borderRadius: 3, color: "#0F1117", fontSize: "16px",
    fontFamily: "'DM Sans', sans-serif", outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <section id="contact" style={{ background: "#F59E0B", padding: "clamp(48px, 8vw, 96px) 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 className="font-display" style={{
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            fontWeight: 800, textTransform: "uppercase",
            color: "#0F1117", lineHeight: 1.05, marginBottom: 16,
          }}>
            Got an electrical or property job that needs doing?
          </h2>
          <p style={{ color: "#1A1D27", fontSize: "1rem", lineHeight: 1.6, maxWidth: 520, margin: "0 auto" }}>
            Fill in the form and we'll get back to you with a no-obligation quote.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="contact-form">
          <input
            name="name" type="text" placeholder="Your Name" required
            value={form.name} onChange={handleChange}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "rgba(15,17,23,0.7)"}
            onBlur={e => e.target.style.borderColor = "rgba(15,17,23,0.35)"}
          />
          <input
            name="phone" type="tel" placeholder="Phone Number"
            value={form.phone} onChange={handleChange}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "rgba(15,17,23,0.7)"}
            onBlur={e => e.target.style.borderColor = "rgba(15,17,23,0.35)"}
          />
          <input
            name="email" type="email" placeholder="Email Address" required
            value={form.email} onChange={handleChange}
            style={{ ...inputStyle, gridColumn: "1 / -1" }}
            onFocus={e => e.target.style.borderColor = "rgba(15,17,23,0.7)"}
            onBlur={e => e.target.style.borderColor = "rgba(15,17,23,0.35)"}
          />
          <textarea
            name="message" placeholder="Tell us about your job…" rows={4} required
            value={form.message} onChange={handleChange}
            style={{ ...inputStyle, gridColumn: "1 / -1", resize: "vertical" }}
            onFocus={e => e.target.style.borderColor = "rgba(15,17,23,0.7)"}
            onBlur={e => e.target.style.borderColor = "rgba(15,17,23,0.35)"}
          />
          <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginTop: 4 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <a href="tel:0800225666" className="btn-dark-outline" style={{ borderColor: "#0F1117" }}>
                <Phone size={16} /> Call 0800 225 666
              </a>
            </div>
            <button type="submit" disabled={status === "sending"} style={{
              background: "#111111", color: "#FFFFFF",
              fontFamily: "'Poppins', sans-serif", fontWeight: 700,
              fontSize: "1rem", letterSpacing: "0.05em", textTransform: "uppercase",
              padding: "14px 32px", border: "none", borderRadius: 3, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 8, transition: "background 0.2s",
              opacity: status === "sending" ? 0.7 : 1,
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#222222"}
              onMouseLeave={e => e.currentTarget.style.background = "#111111"}
            >
              {status === "sent" ? "Request Sent ✓" : <><Mail size={16} /> Send Enquiry</>}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#111111", position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 48,
          paddingTop: 56,
          paddingBottom: 48,
        }}>
          {/* Col 1 */}
          <div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
              <img 
                src={`${import.meta.env.BASE_URL}Bloom_Electrical_logo_white.png`} 
                alt="Bloom Electrical" 
                style={{ height: "36px", objectFit: "contain" }} 
              />
            </div>
            <p style={{ color: "#CCCCCC", fontSize: "0.88rem", lineHeight: 1.7, maxWidth: 360 }}>
              Bloom Electrical, based in Takanini, Auckland, offers expert electrical services including solar installations, EV charging, air conditioning, and ventilation. Our team of registered electricians serves clients in Takanini, Auckland Central, Manukau, Papakura, and surrounding suburbs.
            </p>
          </div>

          {/* Col 2: Contact */}
          <div>
            <h5 className="font-display" style={{
              fontSize: "1.1rem",
              fontWeight: 500,
              textTransform: "uppercase",
              color: "#FFFFFF",
              marginBottom: 20,
              letterSpacing: "0.08em",
            }}>
              Contact
            </h5>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <MapPin size={16} color="#FFFFFF" style={{ flexShrink: 0 }} />
                <span style={{ color: "#E2E2E8", fontSize: "0.93rem" }}>82B Spartan Road, Takanini</span>
              </div>
              <a href="tel:0800225666" style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                color: "#E2E2E8",
                textDecoration: "none",
                fontSize: "0.93rem",
                transition: "color 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.color = "#F59E0B"}
                onMouseLeave={e => e.currentTarget.style.color = "#E2E2E8"}
              >
                <Phone size={16} color="#FFFFFF" style={{ flexShrink: 0 }} />
                <span>0800 2 BLOOM (0800 22 5 666)</span>
              </a>
              <a href="mailto:info@bloomelectrical.co.nz" style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                color: "#E2E2E8",
                textDecoration: "none",
                fontSize: "0.93rem",
                transition: "color 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.color = "#F59E0B"}
                onMouseLeave={e => e.currentTarget.style.color = "#E2E2E8"}
              >
                <Mail size={16} color="#FFFFFF" style={{ flexShrink: 0 }} />
                <span>info@bloomelectrical.co.nz</span>
              </a>
            </div>
          </div>

          {/* Col 3: Opening Hours & Follow Us */}
          <div>
            <h5 className="font-display" style={{
              fontSize: "1.1rem",
              fontWeight: 500,
              textTransform: "uppercase",
              color: "#FFFFFF",
              marginBottom: 16,
              letterSpacing: "0.08em",
            }}>
              Opening Hours
            </h5>
            <div style={{ color: "#E2E2E8", fontSize: "0.93rem", display: "flex", flexDirection: "column", gap: 4, marginBottom: 24 }}>
              <span>Mondays - Fridays:</span>
              <span style={{ fontWeight: 500 }}>8:00 AM - 5:00 PM</span>
            </div>

            <h5 className="font-display" style={{
              fontSize: "1.1rem",
              fontWeight: 500,
              textTransform: "uppercase",
              color: "#FFFFFF",
              marginBottom: 16,
              letterSpacing: "0.08em",
            }}>
              Follow Us
            </h5>
            <div style={{ display: "flex", gap: 20 }}>
              <a href="https://www.facebook.com/people/Bloom-Electrical/61557538537767/" target="_blank" rel="noopener noreferrer" style={{
                color: "#FFFFFF", transition: "color 0.2s", display: "flex", alignItems: "center"
              }}
                onMouseEnter={e => e.currentTarget.style.color = "#F59E0B"}
                onMouseLeave={e => e.currentTarget.style.color = "#FFFFFF"}
              >
                <Facebook size={20} strokeWidth={1.5} />
              </a>
              <a href="https://www.instagram.com/bloomelectricalnz" target="_blank" rel="noopener noreferrer" style={{
                color: "#FFFFFF", transition: "color 0.2s", display: "flex", alignItems: "center"
              }}
                onMouseEnter={e => e.currentTarget.style.color = "#F59E0B"}
                onMouseLeave={e => e.currentTarget.style.color = "#FFFFFF"}
              >
                <Instagram size={20} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "20px 0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 8,
        }}>
          <p style={{ color: "#AAAAAA", fontSize: "0.78rem" }}>
            © 2026 Bloom Electrical and Hardware Services Ltd. Licensed Electrical Inspectors — Auckland, NZ.
          </p>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Shield size={12} color="#01f9c6" />
            <span style={{ color: "#AAAAAA", fontSize: "0.78rem" }}>Licensed & Insured</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Map() {
  const mapRef = useRef(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayTimeoutRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    let script = document.getElementById("leaflet-js");
    if (!script) {
      script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      document.head.appendChild(script);
    }

    const initMap = () => {
      if (!window.L) return;
      if (mapRef.current) {
        mapRef.current.remove();
      }

      const center = [-36.8485, 174.7633];
      const map = window.L.map("map-container", {
        center: center,
        zoom: 10.5,
        zoomSnap: 0.5,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false
      });
      mapRef.current = map;

      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);

      window.L.circle(center, {
        radius: 15000,
        color: '#F59E0B',
        weight: 1.5,
        fillColor: '#F59E0B',
        fillOpacity: 0.25
      }).addTo(map);
    };

    if (window.L) {
      initMap();
    } else {
      script.addEventListener("load", initMap);
    }

    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && mapRef.current) {
        mapRef.current.scrollWheelZoom.enable();
      }
    };

    const handleKeyUp = (e) => {
      if (!(e.metaKey || e.ctrlKey) && mapRef.current) {
        mapRef.current.scrollWheelZoom.disable();
      }
    };

    const mapContainer = document.getElementById("map-container");
    const handleWheel = (e) => {
      if (!(e.metaKey || e.ctrlKey)) {
        setShowOverlay(true);
        if (overlayTimeoutRef.current) clearTimeout(overlayTimeoutRef.current);
        overlayTimeoutRef.current = setTimeout(() => {
          setShowOverlay(false);
        }, 1500);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    mapContainer?.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      if (script) {
        script.removeEventListener("load", initMap);
      }
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      mapContainer?.removeEventListener("wheel", handleWheel);
      if (overlayTimeoutRef.current) {
        clearTimeout(overlayTimeoutRef.current);
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const isMac = typeof window !== "undefined" && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const overlayMessage = isMac ? "Use ⌘ + scroll to zoom the map" : "Use Ctrl + scroll to zoom the map";

  return (
    <section id="service-area" style={{ background: "#FFFFFF", paddingTop: "clamp(48px, 8vw, 96px)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto 40px", padding: "0 24px" }}>
        <SectionLabel>Service Area</SectionLabel>
        <SectionHeading>Where We Operate</SectionHeading>
      </div>
      <div style={{ position: "relative", width: "100%", height: 380, background: "#FFFFFF" }}>
        <div id="map-container" style={{ width: "100%", height: "100%" }} />
        {showOverlay && (
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.1rem",
            fontWeight: 500,
            fontFamily: "system-ui, sans-serif",
            zIndex: 9999,
            pointerEvents: "none",
          }}>
            {overlayMessage}
          </div>
        )}
      </div>
    </section>
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
      <Testimonials />
      <WhoWeWorkWith />
      <BrandsStrip />
      <Projects />
      <Map />
      <CTABanner />
      <Footer />
    </div>
  );
}
