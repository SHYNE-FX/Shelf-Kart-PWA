# Shelf Kart

> Smart order management PWA for shelf-based inventory — v2.4.3

---

## Overview

Shelf Kart streamlines reorder workflows for retail, warehouse, or kitchen shelf stock. Build item lists by category, set quantities with units (kg, box, pcs), generate a printable PDF order sheet, and share or print it — all offline.

---

## Features

- **Item management** — Add items with name, quantity, unit (kg / box / pcs / custom), and category
- **Category tabs** — Switch between categories instantly via tab navigation
- **Order generation** — Compile selected items into a clean, printable order sheet
- **PDF export** — Generate and download order as PDF
- **Print support** — Direct print from browser
- **Dark / Light theme** — Toggle between modes
- **Font options** — Multiple font families (Poppins, Comfortaa, Playfair Display, Roboto Slab, Lora, Kalam)
- **Offline-first** — Cache-first service worker; fonts cached on first load
- **Installable** — Add to home screen on Android and iOS

---

## Tech

| Layer | Detail |
|---|---|
| Stack | Single-file HTML · Vanilla CSS · Vanilla JS |
| Storage | `localStorage` |
| Icons | Material Symbols Rounded (cached via SW) |
| Fonts | Google Fonts — 6 families (cached via SW) |
| PDF | Browser print / PDF generation |
| Offline | Service Worker · Cache-first (v2.4.2 cache key) |
| Install | Web App Manifest · PWA |
| Categories | `productivity`, `utilities` |

---

## Getting Started

```bash
git clone https://github.com/yourusername/Shelf-Kart-PWA.git
cd Shelf-Kart-PWA
npx serve .
```

Serve over **HTTPS** or `localhost` for service worker and install prompt. Google Fonts and Material Symbols load on first visit and cache automatically — subsequent use is fully offline.

---

## File Structure

```
Shelf-Kart-PWA/
├── index.html                # Entire app
├── manifest.json             # PWA manifest
├── sw.js                     # Service worker (cache key: shelf-kart-v2.4.2)
├── CART.svg                  # App icon
└── icons/
    ├── CART.svg              # Standard icon
    ├── CART-maskable.svg     # Maskable icon
    └── Home-Screen-Icon.svg  # Home screen icon
```
