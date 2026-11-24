# GLOSSÉ ✦ Luxury 3D Interactive Website

An interactive 3D website built for **GLOSSÉ**, a high-end luxury lip gloss and cosmetic glaze brand. Built with a "wet-look, glassy, shimmery, glittery, dreamy" visual language combining Y2K glam with modern luxury aesthetics.

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
