---
name: PRISM design system
description: Light cream editorial theme matching v0-modern-agentic.vercel.app — key tokens and patterns
---

## Design System

**Background:** `#F5F4F0` (warm cream, not pure white)  
**Card surfaces:** `#fff` or `#faf9f7`  
**Text:** `#111` (near black)  
**Muted text:** `text-black/45`, `text-black/55`

**Typography:** `font-light tracking-tight` for ALL headings — this is the defining visual choice  
**Labels:** `text-[11px] tracking-widest uppercase text-black/40`  
**Mono accents:** `font-mono text-[11px] text-black/50 bg-black/[0.04] rounded-lg`

**Nav:** floating pill `fixed top-4 inset-x-0 z-50`, centered, `rounded-2xl border border-black/[0.06] bg-[#F5F4F0]/90 backdrop-blur-sm`  
**Cards:** `bg-white rounded-2xl border border-black/[0.07]`, hover: `border-black/20 shadow-sm`  
**Borders:** `border-black/[0.06]`, `border-black/[0.07]`, `border-black/10`  
**Hover:** `hover:bg-black/[0.03]` or `hover:bg-black/[0.04]`

**Persona accent colors (light theme):**
- Contrarian: `#DC2626` (red-600)
- Expansionist: `#2563EB` (blue-600)
- Executionist: `#16A34A` (green-600)
- Analyst: `#7C3AED` (violet-600)

**Why:** User requested redesign matching v0-modern-agentic.vercel.app — cream/editorial/minimal SaaS aesthetic, NOT dark glassmorphism.

**How to apply:** All dark classes (`bg-[#070A12]`, `text-white`, `border-white/10`, `bg-white/5`) must be replaced with light equivalents. The `.glass-card` CSS class is redefined to `bg-white border border-black/[0.07]` for backward compat.
