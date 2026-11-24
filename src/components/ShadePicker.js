import { BRAND_CONFIG } from '../config.js';

/**
 * 3D Shade Picker & Product Details Component
 */
export class ShadePicker {
  constructor(container, onShadeChange, onAddToCart) {
    this.container = container;
    this.onShadeChange = onShadeChange;
    this.onAddToCart = onAddToCart;
    this.activeShade = BRAND_CONFIG.shades[0];

    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="shop-grid">
        <!-- Left 3D space with Realistic Finish Preview Card -->
        <div class="shop-3d-anchor">
          <div class="inspect-hint">
            <span class="hint-pulse"></span>
            <span>Live 3D Bottle • 360° Refraction</span>
          </div>

          <!-- Real Lip Finish Preview Floating Card -->
          <div class="shade-photo-preview-card glass-panel magnetic">
            <div class="preview-photo-wrap">
              <img src="${this.activeShade.image}" alt="${this.activeShade.name} Lip Look" class="shade-lip-photo" id="shade-lip-preview-img" />
              <div class="preview-glare"></div>
              <span class="preview-tag">Realistic Pout Finish</span>
            </div>
            <div class="preview-caption">
              <div>
                <span class="preview-shade-name" id="preview-shade-name">${this.activeShade.name}</span>
                <span class="preview-shade-tone" id="preview-shade-tone">${this.activeShade.toneName}</span>
              </div>
              <span class="preview-sparkle">✦</span>
            </div>
          </div>
        </div>

        <!-- Right Product Detail Card (Glassmorphism) -->
        <div class="product-glass-card">
          <div class="product-meta-header">
            <span class="product-badge" id="shade-badge">${this.activeShade.badge}</span>
            <span class="product-finish" id="shade-finish">${this.activeShade.finish}</span>
          </div>

          <h2 class="product-title" id="shade-name">${this.activeShade.name}</h2>
          <p class="product-subtitle" id="shade-tone">${this.activeShade.toneName}</p>

          <div class="price-row">
            <span class="price-val" id="shade-price">${BRAND_CONFIG.currency}${this.activeShade.price}</span>
            <span class="price-sub">Free worldwide luxury delivery over $50</span>
          </div>

          <p class="product-description" id="shade-desc">${this.activeShade.description}</p>

          <!-- Interactive 3D Shade Swatches -->
          <div class="swatches-section">
            <div class="swatches-label-row">
              <span class="swatches-label">Select Luxe Shade</span>
              <span class="selected-shade-indicator" id="selected-shade-indicator">${this.activeShade.name}</span>
            </div>
            
            <div class="swatch-list" role="radiogroup" aria-label="Shade Selector">
              ${BRAND_CONFIG.shades.map((shade, idx) => `
                <button 
                  class="shade-pill ${idx === 0 ? 'active' : ''} magnetic"
                  data-shade-id="${shade.id}"
                  role="radio"
                  aria-checked="${idx === 0 ? 'true' : 'false'}"
                  aria-label="${shade.name} - ${shade.finish}"
                  title="${shade.name}"
                >
                  <span class="swatch-dot" style="background: radial-gradient(circle at 35% 35%, #fff 0%, ${shade.hex} 60%, ${shade.liquidHex} 100%);"></span>
                  <span class="swatch-name-mobile">${shade.name}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Product CTAs -->
          <div class="product-actions">
            <button class="btn btn-primary btn-add-bag magnetic" id="btn-add-bag">
              <span class="btn-text">Add to Bag • ${BRAND_CONFIG.currency}${this.activeShade.price}</span>
              <span class="btn-sparkle">✦</span>
            </button>
            <button class="btn btn-secondary magnetic" id="btn-formula-info" title="Formula Details">
              <span>Formula Guide</span>
            </button>
          </div>

          <!-- Formula highlights -->
          <div class="product-perks">
            <div class="perk-item">
              <span class="perk-icon">💎</span>
              <span class="perk-text">Diamond Micro-Pearl Refraction</span>
            </div>
            <div class="perk-item">
              <span class="perk-icon">🌿</span>
              <span class="perk-text">Organic Botanical Oils</span>
            </div>
            <div class="perk-item">
              <span class="perk-icon">✨</span>
              <span class="perk-text">12-Hour Non-Sticky Shield</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const swatches = this.container.querySelectorAll('.shade-pill');
    swatches.forEach((swatch) => {
      swatch.addEventListener('click', () => {
        const id = swatch.dataset.shadeId;
        const shade = BRAND_CONFIG.shades.find(s => s.id === id);
        if (!shade) return;

        this.selectShade(shade);
      });
    });

    const addBtn = this.container.querySelector('#btn-add-bag');
    addBtn.addEventListener('click', () => {
      this.onAddToCart(this.activeShade);
      
      // Button feedback animation
      const originalText = addBtn.querySelector('.btn-text').textContent;
      addBtn.querySelector('.btn-text').textContent = 'Added to Bag! ✨';
      addBtn.classList.add('btn-success');
      setTimeout(() => {
        addBtn.querySelector('.btn-text').textContent = originalText;
        addBtn.classList.remove('btn-success');
      }, 1400);
    });

    const formulaBtn = this.container.querySelector('#btn-formula-info');
    formulaBtn.addEventListener('click', () => {
      window.location.hash = '#story';
    });
  }

  selectShade(shade) {
    this.activeShade = shade;

    // Update active swatch state
    const swatches = this.container.querySelectorAll('.shade-pill');
    swatches.forEach((s) => {
      const isCur = s.dataset.shadeId === shade.id;
      s.classList.toggle('active', isCur);
      s.setAttribute('aria-checked', isCur ? 'true' : 'false');
    });

    // Update text with soft transition
    const badge = this.container.querySelector('#shade-badge');
    const finish = this.container.querySelector('#shade-finish');
    const name = this.container.querySelector('#shade-name');
    const tone = this.container.querySelector('#shade-tone');
    const price = this.container.querySelector('#shade-price');
    const desc = this.container.querySelector('#shade-desc');
    const indicator = this.container.querySelector('#selected-shade-indicator');
    const addBtnText = this.container.querySelector('#btn-add-bag .btn-text');

    if (badge) badge.textContent = shade.badge;
    if (finish) finish.textContent = shade.finish;
    if (name) name.textContent = shade.name;
    if (tone) tone.textContent = shade.toneName;
    if (price) price.textContent = `${BRAND_CONFIG.currency}${shade.price}`;
    if (desc) desc.textContent = shade.description;
    if (indicator) indicator.textContent = shade.name;
    if (addBtnText) addBtnText.textContent = `Add to Bag • ${BRAND_CONFIG.currency}${shade.price}`;

    // Update real photo finish preview card
    const previewImg = this.container.querySelector('#shade-lip-preview-img');
    const previewName = this.container.querySelector('#preview-shade-name');
    const previewTone = this.container.querySelector('#preview-shade-tone');
    if (previewImg && shade.image) {
      previewImg.src = shade.image;
      previewImg.alt = `${shade.name} Lip Look`;
    }
    if (previewName) previewName.textContent = shade.name;
    if (previewTone) previewTone.textContent = shade.toneName;

    // Live update 3D scene
    this.onShadeChange(shade);
  }
}
