import { lerp } from '../utils/math.js';

/**
 * Custom Cursor & Interactive Micro-Animations
 * Features:
 * - Glossy glass-droplet main cursor with trailing glitter particles
 * - Magnetic pull on buttons and interactive elements
 * - Cursor scale expanding on hover states
 */
export class CursorController {
  constructor() {
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.cursorPos = { x: this.mouse.x, y: this.mouse.y };
    this.trails = [];
    this.trailCount = 8;
    this.isHoveringInteractive = false;

    this.initDOM();
    this.bindEvents();
    this.animate();
  }

  initDOM() {
    // Custom cursor wrapper
    this.cursorEl = document.createElement('div');
    this.cursorEl.className = 'custom-cursor';
    this.cursorEl.innerHTML = `
      <div class="cursor-blob"></div>
      <div class="cursor-sparkle">✦</div>
    `;
    document.body.appendChild(this.cursorEl);

    // Trail elements
    for (let i = 0; i < this.trailCount; i++) {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail-dot';
      document.body.appendChild(trail);
      this.trails.push({
        el: trail,
        x: this.mouse.x,
        y: this.mouse.y,
        delay: (i + 1) * 0.12,
        scale: 1 - (i / this.trailCount) * 0.7
      });
    }
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // Magnetic buttons setup
    this.setupMagneticElements();

    // Re-bind when DOM mutations happen (e.g. page changes)
    const observer = new MutationObserver(() => this.setupMagneticElements());
    observer.observe(document.body, { childList: true, subtree: true });
  }

  setupMagneticElements() {
    const magneticItems = document.querySelectorAll('.magnetic, button, .nav-link, .shade-pill, .product-card');

    magneticItems.forEach((el) => {
      if (el.dataset.magneticInit) return;
      el.dataset.magneticInit = 'true';

      el.addEventListener('mouseenter', () => {
        this.cursorEl.classList.add('cursor-hover');
      });

      el.addEventListener('mouseleave', () => {
        this.cursorEl.classList.remove('cursor-hover');
        el.style.transform = 'translate3d(0, 0, 0)';
      });

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = (e.clientX - centerX) * 0.28;
        const distanceY = (e.clientY - centerY) * 0.28;

        el.style.transform = `translate3d(${distanceX}px, ${distanceY}px, 0)`;
      });
    });
  }

  animate() {
    // Main cursor smooth lerp
    this.cursorPos.x = lerp(this.cursorPos.x, this.mouse.x, 0.22);
    this.cursorPos.y = lerp(this.cursorPos.y, this.mouse.y, 0.22);

    this.cursorEl.style.transform = `translate3d(${this.cursorPos.x}px, ${this.cursorPos.y}px, 0)`;

    // Glitter trail dot physics
    this.trails.forEach((trail, idx) => {
      const prevX = idx === 0 ? this.cursorPos.x : this.trails[idx - 1].x;
      const prevY = idx === 0 ? this.cursorPos.y : this.trails[idx - 1].y;

      trail.x = lerp(trail.x, prevX, 0.35);
      trail.y = lerp(trail.y, prevY, 0.35);

      trail.el.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0) scale(${trail.scale})`;
      trail.el.style.opacity = `${0.75 - (idx / this.trailCount) * 0.6}`;
    });

    requestAnimationFrame(() => this.animate());
  }
}
