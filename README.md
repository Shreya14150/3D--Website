# GLOSSÉ ✦ Luxury 3D Interactive Website

An award-winning, interactive 3D website built for **GLOSSÉ**, a high-end luxury lip gloss and cosmetic glaze brand. Built with a "wet-look, glassy, shimmery, glittery, dreamy" visual language combining Y2K glam with modern luxury aesthetics.

---

## 🌟 Key Features

1. **Persistent 3D Three.js WebGL Canvas**:
   - **Thick-Walled Glass Barrel**: Real-time refraction, physical transmission (`0.96`), IOR (`1.52`), thickness (`1.25`), and clearcoat highlights.
   - **Gloss Liquid Meniscus Core**: `MeshPhysicalMaterial` with sheen, iridescence, attenuation color, and smooth GSAP shade transitions.
   - **Champagne Gold Metallic Cap**: Polished metalness (`0.96`), knurled accent ring, and unscrewing choreography.
   - **Doe-Foot Applicator Wand**: Acrylic clear stem with angled flocked velour tip.
   - **Diamond Micro-Glitter**: 1,400+ instanced octahedral micro-facets inside the liquid that catch light and twinkle in 3D.
   - **Ambient Floating Sparkle Cloud**: Custom twinkling GLSL points with cursor attraction/repulsion fields.
   - **Organic Morphing Droplet**: Viscous noise-displaced droplet with interactive hold-to-squeeze physics and tear-drop drip.
   - **Floating Botanical Ingredients**: 3D orbs for Golden Jojoba, Wild Shea, Vitamin E, and Shimmer Pearl on the Story page.

2. **Fluid Cursor Interactivity**:
   - 3D lip gloss tube tilts and rotates smoothly towards mouse position with damped lerp physics.
   - Interactive PointLight follows cursor across glass facets for realistic glossy specular glides.
   - Custom glossy droplet cursor with trailing glitter particles.
   - Magnetic pull on buttons, swatches, and navigation elements.
   - Hold-to-squeeze interaction that compresses the bottle and extrudes a luscious gloss droplet.

3. **Multi-Page Choreography**:
   - **Home (The Hero)**: Full-screen 3D showcase, brand tagline, hero CTAs, and featured shades teaser.
   - **Shades & Shop**: 3D shade picker with 6 shades (*Rose Quartz, Peach Fizz, Berry Bloom, Lilac Dream, Gold Rush, Clear Glaze*). Real-time gloss liquid color morphing, product perks, and slide-in luxury cart drawer.
   - **Our Story / Ingredients**: Botanical storytelling with floating 3D ingredient orbs and animated clinical metric counters (+340% moisture, 12H wear, 100% vegan).
   - **Lookbook & Contact**: 3D hover-tilt editorial cards, Instagram grid, validated VIP concierge contact form, and newsletter subscription footer.

4. **Performance & Accessibility**:
   - Capped pixel ratio (`Math.min(window.devicePixelRatio, 2)`) for 60fps on mid-range laptops.
   - Reduced particle counts on mobile devices.
   - Touch drag & gyroscope fallback for mobile devices.
   - `prefers-reduced-motion` compliance.
   - Semantic HTML and WCAG contrast standards.

---

## 🛠️ Tech Stack (100% Free & Open-Source)

- **Bundler**: [Vite](https://vitejs.dev/)
- **3D Graphics**: [Three.js](https://threejs.org/)
- **Animation**: [GSAP](https://greensock.com/gsap/) + [ScrollTrigger](https://greensock.com/scrolltrigger/)
- **Smooth Scroll**: [Lenis](https://lenis.darkroom.engineering/)
- **Typography**: Google Fonts (*Playfair Display* + *Plus Jakarta Sans*)

---

## 🚀 How to Run Locally

### 1. Prerequisites
Ensure you have **Node.js 18+** installed:
```bash
node -v
```

### 2. Install Dependencies
```bash
cd 3Dwebsite
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
The optimized production bundle will be output to the `dist/` directory.

---

## 🎨 How to Customize

All brand names, shades, prices, descriptions, ingredients, and color palettes are centralized in a single configuration file:

📁 **`src/config.js`**

### Changing the Brand Name:
```javascript
export const BRAND_CONFIG = {
  name: "YOUR_BRAND",
  tagline: "Your Custom Tagline",
  // ...
};
```

### Adding or Modifying a Shade:
```javascript
{
  id: "celestial-ruby",
  name: "Celestial Ruby",
  toneName: "Deep Crimson Shimmer",
  hex: "#9E1B32",
  liquidHex: "#8B1428",
  glitterColor: "#FFD1DC",
  sheenColor: "#FF69B4",
  price: 28,
  badge: "New",
  finish: "Diamond Prism Glaze",
  description: "A showstopping crimson gloss infused with ruby micro-pearls."
}
```

---

## 🌐 Free Deployment Guide

### Deploying to Vercel (Recommended)
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Set:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Your site will be live on a free SSL domain (e.g., `glosse.vercel.app`).

### Deploying to Netlify
1. Sign in to [Netlify](https://www.netlify.com/).
2. Drag and drop your `dist/` folder directly, or connect your GitHub repository.
3. Set build command `npm run build` and publish directory `dist`.

### Deploying to GitHub Pages
1. In `vite.config.js`, set `base: './'`.
2. Run `npm run build`.
3. Push the contents of `dist` to the `gh-pages` branch or configure GitHub Actions.

---

## 📄 License
MIT License. Free for commercial and portfolio use.
