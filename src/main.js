import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BRAND_CONFIG } from './config.js';
import { SceneManager } from './3d/SceneManager.js';
import { CursorController } from './interactions/CursorController.js';
import { SqueezeAction } from './interactions/SqueezeAction.js';
import { Navigation } from './components/Navigation.js';
import { ShadePicker } from './components/ShadePicker.js';
import { CartDrawer } from './components/CartDrawer.js';
import { StoryCounters } from './components/StoryCounters.js';
import { ContactForm } from './components/ContactForm.js';

gsap.registerPlugin(ScrollTrigger);

class GlosseApp {
  constructor() {
    this.currentPage = 'home';
    this.init();
  }

  init() {
    // 1. Initialize Lenis Smooth Scroll
    this.initLenis();

    // 2. Initialize 3D WebGL Scene
    const canvasContainer = document.getElementById('webgl-canvas-container');
    this.sceneManager = new SceneManager(canvasContainer);

    // 3. Initialize Interactive Systems
    this.cursorController = new CursorController();
    this.squeezeAction = new SqueezeAction(this.sceneManager);

    // 4. Initialize Cart Drawer
    this.cartDrawer = new CartDrawer((count) => {
      this.navigation.updateCartCount(count);
    });

    // 5. Initialize Navigation
    this.navigation = new Navigation(
      (page) => this.navigateTo(page),
      () => this.cartDrawer.toggle()
    );

    // 6. Initialize Page Components
    const shopContainer = document.getElementById('shop-container');
    this.shadePicker = new ShadePicker(
      shopContainer,
      (shade) => this.sceneManager.setShade(shade),
      (shade) => this.cartDrawer.addItem(shade)
    );

    const storyContainer = document.getElementById('story-container');
    this.storyCounters = new StoryCounters(storyContainer);

    const lookbookContainer = document.getElementById('lookbook-container');
    this.contactForm = new ContactForm(lookbookContainer);

    // 7. Bind In-page Navigation Links
    this.bindPageLinks();

    // 8. Start Global Animation & Render Loop
    this.startLoop();

    // 9. Dismiss Preloader Screen
    this.dismissPreloader();

    // Handle initial route
    const initialHash = window.location.hash.replace('#', '') || 'home';
    if (['home', 'shop', 'story', 'lookbook'].includes(initialHash)) {
      this.navigateTo(initialHash, true);
    }
  }

  initLenis() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0
    });

    this.lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? e.scroll / maxScroll : 0;
      this.sceneManager.setScrollProgress(progress);
    });
  }

  bindPageLinks() {
    // Hero CTA buttons with data-nav
    document.querySelectorAll('[data-nav]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.dataset.nav;
        this.navigateTo(target);
      });
    });

    // Hero teaser swatches
    document.querySelectorAll('.mini-swatch').forEach((swatch) => {
      swatch.addEventListener('click', () => {
        const shadeId = swatch.dataset.shade;
        const shade = BRAND_CONFIG.shades.find((s) => s.id === shadeId);
        if (shade) {
          this.shadePicker.selectShade(shade);
          this.navigateTo('shop');
        }
      });
    });

    // Interactive Wine Red Glaze Drop sequence
    const dropBtn = document.getElementById('btn-drop-glaze');
    const ripple = document.getElementById('lip-ripple-wave');
    const shine = document.getElementById('lip-shine-layer');
    const flash = document.getElementById('glaze-flare-flash');
    const card = document.getElementById('hero-glaze-card');

    if (dropBtn) {
      dropBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.triggerGlazeDemo(dropBtn, ripple, shine, flash, card);
      });
    }
    if (card) {
      card.addEventListener('click', () => {
        if (dropBtn) this.triggerGlazeDemo(dropBtn, ripple, shine, flash, card);
      });
    }
  }

  triggerGlazeDemo(dropBtn, ripple, shine, flash, card) {
    if (this.isGlazeAnimating) return;
    this.isGlazeAnimating = true;

    dropBtn.innerHTML = '<span>Unscrewing Cabernet Wand...</span> <span>✨</span>';
    dropBtn.classList.add('loading');

    this.sceneManager.triggerGlazeDropSequence(() => {
      // When droplet lands on the lip visual
      if (ripple) {
        ripple.classList.remove('active');
        void ripple.offsetWidth;
        ripple.classList.add('active');
      }
      if (shine) {
        shine.classList.add('active');
      }
      if (flash) {
        flash.classList.remove('active');
        void flash.offsetWidth;
        flash.classList.add('active');
      }

      // Radiant glitter particles burst
      this.spawnLipGlitter(card);

      dropBtn.innerHTML = '<span>Lips Drenched in Wine Gloss!</span> <span>✦</span>';
      dropBtn.classList.remove('loading');
      dropBtn.classList.add('btn-success');

      setTimeout(() => {
        dropBtn.innerHTML = '<span>Drop Wine Glaze Again</span> <span>💧</span>';
        dropBtn.classList.remove('btn-success');
        this.isGlazeAnimating = false;
      }, 3000);
    });
  }

  spawnLipGlitter(container) {
    if (!container) return;
    const burst = document.createElement('div');
    burst.className = 'lip-glitter-burst';
    const sparkles = ['✦', '✨', '💎', '✦', '✧', '✦'];

    for (let i = 0; i < 16; i++) {
      const sp = document.createElement('span');
      sp.textContent = sparkles[i % sparkles.length];
      const angle = (i / 16) * Math.PI * 2;
      const dist = 50 + Math.random() * 80;
      sp.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
      sp.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
      burst.appendChild(sp);
    }
    container.appendChild(burst);
    setTimeout(() => burst.remove(), 1200);
  }

  navigateTo(pageName, immediate = false) {
    if (this.currentPage === pageName && !immediate) return;

    this.currentPage = pageName;
    const nextSection = document.getElementById(`page-${pageName}`);

    if (!nextSection) return;

    window.location.hash = pageName;
    this.navigation.setActivePage(pageName);
    this.sceneManager.setPage(pageName);

    // Scroll to top
    this.lenis.scrollTo(0, { immediate: true });

    // Hide all other sections cleanly
    document.querySelectorAll('.page-section').forEach((sec) => {
      if (sec !== nextSection) {
        sec.classList.remove('active-page');
        sec.style.display = 'none';
        sec.style.opacity = '0';
      }
    });

    // Reveal next section
    nextSection.style.display = 'flex';
    nextSection.classList.add('active-page');

    if (immediate) {
      nextSection.style.opacity = '1';
      nextSection.style.transform = 'none';
      if (pageName === 'story') {
        this.storyCounters.animateCounters();
      }
      return;
    }

    gsap.fromTo(
      nextSection,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.38,
        ease: 'power2.out',
        onComplete: () => {
          if (pageName === 'story') {
            this.storyCounters.animateCounters();
          }
        }
      }
    );
  }

  startLoop() {
    const loop = (time) => {
      this.lenis.raf(time);
      this.sceneManager.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  dismissPreloader() {
    const preloader = document.getElementById('glosse-preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add('loaded');
      }, 1200);
    }
  }
}

// Instantiate on DOM ready or immediately if already loaded
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => {
    new GlosseApp();
  });
} else {
  new GlosseApp();
}

