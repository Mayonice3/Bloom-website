# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Single-file React landing page for **Bloom Electrical Ltd** — an Auckland, NZ electrical and property services company. The entire site is contained in `BloomElectrical.jsx` and exported as the default component.

## Architecture

Everything lives in one file, structured in layers from top to bottom:

1. **CSS & Font injection** (lines 10–311) — All styles are injected into `document.head` at module load time via a `<style>` element. No external CSS file. Google Fonts (Barlow Condensed + DM Sans) are also appended to `document.head` dynamically.

2. **Data constants** (lines 313–389) — All page content (nav links, services lists, stats, steps, projects, testimonials, clients, brands, footer links) is defined as plain arrays/objects here. Edit these to update copy.

3. **Shared sub-components** (lines 392–420) — `Stars`, `SectionLabel`, `SectionHeading` are small reusable primitives used across sections.

4. **Section components** (lines 422–1003) — Each page section is its own function: `Navbar`, `Hero`, `Services`, `StatsStrip`, `HowItWorks`, `Projects`, `Testimonials`, `WhoWeWorkWith`, `BrandsStrip`, `CTABanner`, `Footer`.

5. **Root component** `BloomElectrical` (lines 1006–1030) — Composes all sections in order. Manages the `scrolled` state passed to `Navbar` for the shadow effect.

## Styling Conventions

- **Primary colors**: `#F59E0B` (amber/brand), `#0F1117` (dark bg), `#1A1D27` (card bg), `#F5F5F0` (off-white text), `#9CA3AF` (muted text), `#2A2D3A` (borders)
- **Display font**: `'Barlow Condensed'` — used for headings, labels, buttons (apply via `className="font-display"` or inline `fontFamily`)
- **Body font**: `'DM Sans'` — default body text
- All styling uses inline `style` props for layout/spacing and CSS class names (defined in the injected `<style>` block) for reusable visual patterns
- CSS utility classes: `btn-amber`, `btn-ghost`, `btn-dark-outline`, `card-hover`, `section-label`, `pill`, `cat-tag`, `step-circle`, `stat-value`, `noise`, `cut-bottom`, `cut-top`, `hero-pattern`, `brands-mask`, `brands-track`, `img-placeholder`, `footer-link`, `mobile-menu`, `mobile-link`, `brand-chip`, `client-pill`

## Mobile Responsiveness

Mobile nav is handled with a CSS `@media (max-width: 900px)` block injected inside the `Navbar` component itself (not in the global style block). The hamburger button toggles a full-screen `mobile-menu` overlay.

## Contact Details

- Phone: `0800 2 BLOOM` / `0800 225 666`
- Email: `info@bloomelectrical.co.nz`
- Address: 82B Spartan Road, Takanini, Auckland

## Image Placeholders

Project cards currently use `.img-placeholder` divs with placeholder text. Replace the `<div className="img-placeholder" style={{ height: 220 }}>` divs with `<img>` tags when real photos are available.
