import { BRAND_CONFIG } from '../config.js';

/**
 * Luxury Navigation Bar & Header
 */
export class Navigation {
  constructor(onNavigate, onToggleCart) {
    this.onNavigate = onNavigate;
    this.onToggleCart = onToggleCart;
    this.currentPage = 'home';
    this.cartCount = 0;

    this.initDOM();
    this.bindEvents();
  }

  initDOM() {
    this.header = document.createElement('header');
    this.header.className = 'site-header';
    this.header.innerHTML = `
      <div class="header-inner">
        <!-- Brand Logo -->
        <a href="#home" class="brand-logo magnetic" data-page="home">
          <span class="logo-sparkle">✦</span>
          <span class="logo-text">${BRAND_CONFIG.name}</span>
          <span class="logo-sub">PARIS • NYC</span>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="nav-links">
          <a href="#home" class="nav-link active magnetic" data-page="home">The Hero</a>
          <a href="#shop" class="nav-link magnetic" data-page="shop">Shades & Shop</a>
          <a href="#story" class="nav-link magnetic" data-page="story">Our Story</a>
          <a href="#lookbook" class="nav-link magnetic" data-page="lookbook">Lookbook & Contact</a>
        </nav>

        <!-- Right Utilities -->
        <div class="header-actions">
          <button class="cart-trigger magnetic" aria-label="Open Shopping Bag">
            <span class="cart-label">Bag</span>
            <span class="cart-badge">0</span>
          </button>
          
          <button class="mobile-menu-toggle" aria-label="Toggle navigation menu">
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <!-- Mobile Menu Dropdown -->
      <div class="mobile-menu">
        <a href="#home" class="mobile-nav-link active" data-page="home">The Hero</a>
        <a href="#shop" class="mobile-nav-link" data-page="shop">Shades & Shop</a>
        <a href="#story" class="mobile-nav-link" data-page="story">Our Story</a>
        <a href="#lookbook" class="mobile-nav-link" data-page="lookbook">Lookbook & Contact</a>
      </div>
    `;
    document.body.prepend(this.header);
  }

  bindEvents() {
    // Navigation link clicks
    const links = this.header.querySelectorAll('[data-page]');
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = link.dataset.page;
        this.setActivePage(targetPage);
        this.onNavigate(targetPage);

        // Close mobile menu if open
        this.header.classList.remove('mobile-menu-open');
      });
    });

    // Cart trigger
    const cartBtn = this.header.querySelector('.cart-trigger');
    cartBtn.addEventListener('click', () => {
      this.onToggleCart();
    });

    // Mobile menu toggle
    const toggleBtn = this.header.querySelector('.mobile-menu-toggle');
    toggleBtn.addEventListener('click', () => {
      this.header.classList.toggle('mobile-menu-open');
    });

    // Hash change support
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      if (['home', 'shop', 'story', 'lookbook'].includes(hash)) {
        this.setActivePage(hash);
        this.onNavigate(hash);
      }
    });
  }

  setActivePage(page) {
    this.currentPage = page;
    const links = this.header.querySelectorAll('[data-page]');
    links.forEach((l) => {
      l.classList.toggle('active', l.dataset.page === page);
    });
  }

  updateCartCount(count) {
    this.cartCount = count;
    const badge = this.header.querySelector('.cart-badge');
    badge.textContent = count;
    badge.classList.add('pulse');
    setTimeout(() => badge.classList.remove('pulse'), 400);
  }
}
