import { BRAND_CONFIG } from '../config.js';

/**
 * Slide-in Luxury Cart Drawer
 */
export class CartDrawer {
  constructor(onCountChange) {
    this.onCountChange = onCountChange;
    this.items = []; // [{ shade, quantity }]
    this.isOpen = false;

    this.initDOM();
    this.bindEvents();
  }

  initDOM() {
    this.drawerEl = document.createElement('div');
    this.drawerEl.className = 'cart-drawer-wrapper';
    this.drawerEl.innerHTML = `
      <div class="cart-backdrop"></div>
      <aside class="cart-drawer" aria-label="Shopping Bag">
        <div class="cart-header">
          <div class="cart-title-row">
            <h3 class="cart-title">Your Bag</h3>
            <span class="cart-count-pill" id="drawer-count-pill">0 items</span>
          </div>
          <button class="cart-close-btn magnetic" aria-label="Close Shopping Bag">✕</button>
        </div>

        <!-- Free shipping progress bar -->
        <div class="shipping-perk-box">
          <div class="shipping-text-row">
            <span class="shipping-msg" id="shipping-msg">Complimentary shipping on orders over $50</span>
            <span class="shipping-percent" id="shipping-percent">0%</span>
          </div>
          <div class="shipping-bar-track">
            <div class="shipping-bar-fill" id="shipping-bar-fill" style="width: 0%;"></div>
          </div>
        </div>

        <!-- Item list -->
        <div class="cart-items-container" id="cart-items-list">
          <div class="cart-empty-state">
            <span class="empty-icon">✨</span>
            <p class="empty-title">Your bag is glistening and empty</p>
            <p class="empty-desc">Select one of our 6 multi-dimensional gloss shades to begin.</p>
          </div>
        </div>

        <!-- Footer / Checkout -->
        <div class="cart-footer">
          <div class="cart-subtotal-row">
            <span class="subtotal-label">Subtotal</span>
            <span class="subtotal-value" id="cart-subtotal">$0.00</span>
          </div>
          <p class="tax-note">Taxes and luxury gift packaging calculated at checkout.</p>
          <button class="btn btn-checkout magnetic" id="btn-checkout">
            <span>Checkout</span>
            <span class="checkout-arrow">→</span>
          </button>
        </div>
      </aside>
    `;
    document.body.appendChild(this.drawerEl);
  }

  bindEvents() {
    const backdrop = this.drawerEl.querySelector('.cart-backdrop');
    const closeBtn = this.drawerEl.querySelector('.cart-close-btn');

    backdrop.addEventListener('click', () => this.close());
    closeBtn.addEventListener('click', () => this.close());

    // Checkout demo toast
    const checkoutBtn = this.drawerEl.querySelector('#btn-checkout');
    checkoutBtn.addEventListener('click', () => {
      if (this.items.length === 0) return;
      checkoutBtn.textContent = 'Processing VIP Order... ✨';
      setTimeout(() => {
        alert('Thank you for trying GLOSSÉ! This is an interactive portfolio prototype.');
        checkoutBtn.textContent = 'Checkout →';
      }, 700);
    });
  }

  open() {
    this.isOpen = true;
    this.drawerEl.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen = false;
    this.drawerEl.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  addItem(shade) {
    const existing = this.items.find((i) => i.shade.id === shade.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({ shade, quantity: 1 });
    }

    this.renderItems();
    this.open();
  }

  updateQuantity(shadeId, delta) {
    const item = this.items.find((i) => i.shade.id === shadeId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.items = this.items.filter((i) => i.shade.id !== shadeId);
    }

    this.renderItems();
  }

  removeItem(shadeId) {
    this.items = this.items.filter((i) => i.shade.id !== shadeId);
    this.renderItems();
  }

  renderItems() {
    const list = this.drawerEl.querySelector('#cart-items-list');
    const totalCount = this.items.reduce((acc, cur) => acc + cur.quantity, 0);
    const subtotal = this.items.reduce((acc, cur) => acc + cur.shade.price * cur.quantity, 0);

    // Update counter pill
    this.drawerEl.querySelector('#drawer-count-pill').textContent = `${totalCount} item${totalCount === 1 ? '' : 's'}`;
    this.drawerEl.querySelector('#cart-subtotal').textContent = `${BRAND_CONFIG.currency}${subtotal.toFixed(2)}`;

    // Free shipping bar ($50 goal)
    const threshold = 50;
    const progress = Math.min(100, Math.round((subtotal / threshold) * 100));
    const fill = this.drawerEl.querySelector('#shipping-bar-fill');
    const percent = this.drawerEl.querySelector('#shipping-percent');
    const msg = this.drawerEl.querySelector('#shipping-msg');

    fill.style.width = `${progress}%`;
    percent.textContent = `${progress}%`;
    if (subtotal >= threshold) {
      msg.textContent = '🎉 You unlocked Complimentary Luxury Shipping!';
    } else {
      msg.textContent = `Add ${BRAND_CONFIG.currency}${(threshold - subtotal).toFixed(2)} more for free luxury delivery`;
    }

    if (this.items.length === 0) {
      list.innerHTML = `
        <div class="cart-empty-state">
          <span class="empty-icon">✨</span>
          <p class="empty-title">Your bag is glistening and empty</p>
          <p class="empty-desc">Select one of our 6 multi-dimensional gloss shades to begin.</p>
        </div>
      `;
    } else {
      list.innerHTML = this.items.map((item) => `
        <div class="cart-item-row" data-id="${item.shade.id}">
          <div class="cart-item-swatch" style="background: radial-gradient(circle at 35% 35%, #fff 0%, ${item.shade.hex} 60%, ${item.shade.liquidHex} 100%);">
            <span class="cart-swatch-glitter">✦</span>
          </div>

          <div class="cart-item-details">
            <div class="cart-item-top">
              <h4 class="cart-item-name">${item.shade.name}</h4>
              <button class="cart-remove-item magnetic" data-remove="${item.shade.id}" aria-label="Remove ${item.shade.name}">✕</button>
            </div>
            <p class="cart-item-tone">${item.shade.toneName}</p>

            <div class="cart-item-bottom">
              <div class="cart-qty-stepper">
                <button class="qty-btn" data-step="-1" data-id="${item.shade.id}">−</button>
                <span class="qty-num">${item.quantity}</span>
                <button class="qty-btn" data-step="1" data-id="${item.shade.id}">+</button>
              </div>
              <span class="cart-item-price">${BRAND_CONFIG.currency}${(item.shade.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
        </div>
      `).join('');

      // Stepper events
      list.querySelectorAll('.qty-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const step = parseInt(btn.dataset.step, 10);
          this.updateQuantity(id, step);
        });
      });

      // Remove events
      list.querySelectorAll('.cart-remove-item').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.removeItem(btn.dataset.remove);
        });
      });
    }

    // Notify navigation badge
    this.onCountChange(totalCount);
  }
}
