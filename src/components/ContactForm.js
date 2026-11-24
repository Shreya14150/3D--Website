import { BRAND_CONFIG } from '../config.js';

/**
 * Lookbook Gallery, Instagram Editorial Grid & Validated Concierge Contact Form
 */
export class ContactForm {
  constructor(container) {
    this.container = container;
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="lookbook-contact-wrapper">
        <!-- Lookbook Section -->
        <section class="lookbook-section">
          <div class="section-header text-center">
            <span class="section-kicker">High Gloss Editorial</span>
            <h2 class="section-title">The Glaze Lookbook</h2>
            <p class="section-lead">Explore how GLOSSÉ reflects against natural light, flash photography, and golden hour.</p>
          </div>

          <!-- 3D Hover Tilt Cards Grid (With Real Aesthetic Editorial Photos) -->
          <div class="lookbook-grid">
            ${BRAND_CONFIG.lookbook.map((item, idx) => `
              <div class="lookbook-card glass-panel tilt-card magnetic" data-idx="${idx}" data-shade="${item.shade}">
                <div class="card-inner">
                  <div class="lookbook-visual">
                    <img src="${item.image}" alt="${item.title}" class="lookbook-photo" loading="lazy" />
                    <div class="lookbook-glare"></div>
                    <div class="lookbook-chromatic-sweep"></div>
                    <div class="lookbook-badges-layer">
                      <span class="lookbook-tag">${item.category}</span>
                      <span class="lookbook-sparkle-icon">✦</span>
                    </div>
                  </div>
                  <div class="lookbook-meta">
                    <h3 class="lookbook-title">${item.title}</h3>
                    <p class="lookbook-shade">Shade: <strong>${item.shade}</strong></p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Instagram Aesthetic Strip (Real Campaign Visuals) -->
          <div class="instagram-banner glass-panel">
            <div class="insta-header-row">
              <div class="insta-user-info">
                <span class="insta-avatar">✦</span>
                <div>
                  <span class="insta-handle">@glosse.beauty</span>
                  <span class="insta-sub">Tag #LiquidGlass to be featured in our Paris gallery</span>
                </div>
              </div>
              <a href="https://instagram.com" target="_blank" rel="noopener" class="btn btn-outline btn-sm magnetic">Follow on Instagram ↗</a>
            </div>

            <div class="insta-grid">
              <div class="insta-post post-1">
                <img src="/images/01_kiko_style_tube.png" alt="Crystal Lip Gloss Tube" class="insta-img" />
                <span class="insta-hover-overlay">♥ 14.2k</span>
              </div>
              <div class="insta-post post-2">
                <img src="/images/03_wand_applicator_lips.png" alt="Starlight Wand Gloss" class="insta-img" />
                <span class="insta-hover-overlay">♥ 28.9k</span>
              </div>
              <div class="insta-post post-3">
                <img src="/images/06_lip_bite_duochrome.png" alt="Duo-Chrome Gloss Pout" class="insta-img" />
                <span class="insta-hover-overlay">♥ 19.5k</span>
              </div>
              <div class="insta-post post-4">
                <img src="/images/07_five_shades_collection.png" alt="5 Shade Wardrobe" class="insta-img" />
                <span class="insta-hover-overlay">♥ 31.8k</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Concierge Contact & VIP Inquiries -->
        <section class="contact-section">
          <div class="contact-card glass-panel">
            <div class="contact-header">
              <span class="section-kicker">Concierge & Press</span>
              <h3 class="contact-title">Private Inquiries & Custom Formulations</h3>
              <p class="contact-lead">Need personal shade matching or editorial press samples? Our beauty concierge will respond within 24 hours.</p>
            </div>

            <form class="glosse-form" id="concierge-form" novalidate>
              <div class="form-row">
                <div class="form-group">
                  <label for="contact-name">Your Full Name <span class="required">*</span></label>
                  <input type="text" id="contact-name" name="name" placeholder="e.g. Elena Rostova" required autocomplete="name" />
                  <span class="form-error" id="error-name"></span>
                </div>

                <div class="form-group">
                  <label for="contact-email">Email Address <span class="required">*</span></label>
                  <input type="email" id="contact-email" name="email" placeholder="elena@luxury.com" required autocomplete="email" />
                  <span class="form-error" id="error-email"></span>
                </div>
              </div>

              <div class="form-group">
                <label for="contact-topic">Inquiry Type</label>
                <select id="contact-topic" name="topic">
                  <option value="concierge">Personal Shade Consultation</option>
                  <option value="press">Press & Editorial Gifting</option>
                  <option value="wholesale">Luxury Retail & Stockists</option>
                  <option value="general">Customer Care & Orders</option>
                </select>
              </div>

              <div class="form-group">
                <label for="contact-message">Message <span class="required">*</span></label>
                <textarea id="contact-message" name="message" rows="4" placeholder="How may our beauty concierge assist you today?" required></textarea>
                <span class="form-error" id="error-message"></span>
              </div>

              <div class="form-action-row">
                <button type="submit" class="btn btn-primary magnetic" id="btn-submit-contact">
                  <span class="btn-text">Send Concierge Request</span>
                  <span class="btn-sparkle">✦</span>
                </button>
                <div class="form-feedback" id="form-feedback"></div>
              </div>
            </form>
          </div>
        </section>

        <!-- Luxury Footer -->
        <footer class="site-footer">
          <div class="footer-top">
            <div class="footer-col brand-col">
              <h3 class="footer-brand">${BRAND_CONFIG.name}</h3>
              <p class="footer-tagline">${BRAND_CONFIG.tagline}</p>
              <p class="footer-copy-text">Formulated with pure botanical integrity. Cruelty-free, vegan certified, made without parabens or phthalates.</p>
            </div>

            <div class="footer-col">
              <h4 class="footer-title">Boutique</h4>
              <ul class="footer-links">
                <li><a href="#shop" class="footer-link">All 6 Luxe Shades</a></li>
                <li><a href="#story" class="footer-link">Botanical Ingredients</a></li>
                <li><a href="#lookbook" class="footer-link">Editorial Campaigns</a></li>
                <li><a href="#home" class="footer-link">Gift Cards & Sets</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4 class="footer-title">Client Care</h4>
              <ul class="footer-links">
                <li><a href="#lookbook" class="footer-link">Track Your Order</a></li>
                <li><a href="#lookbook" class="footer-link">Complimentary Shipping</a></li>
                <li><a href="#lookbook" class="footer-link">Returns & Exchanges</a></li>
                <li><a href="#lookbook" class="footer-link">Sustainability Pledge</a></li>
              </ul>
            </div>

            <div class="footer-col newsletter-col">
              <h4 class="footer-title">The Glaze Society</h4>
              <p class="newsletter-desc">Receive secret preview drops, VIP invitations, and private seasonal discounts.</p>
              
              <form class="newsletter-form" id="newsletter-form" novalidate>
                <div class="newsletter-input-group">
                  <input type="email" id="newsletter-email" placeholder="Enter your email" required />
                  <button type="submit" class="btn btn-newsletter magnetic" aria-label="Subscribe to newsletter">Join ✦</button>
                </div>
                <div class="newsletter-feedback" id="newsletter-feedback"></div>
              </form>
            </div>
          </div>

          <div class="footer-bottom">
            <p class="copyright">© 2026 ${BRAND_CONFIG.name} Parfums & Cosmétiques Inc. All rights reserved.</p>
            <div class="footer-legal">
              <a href="#">Privacy Policy</a>
              <span>•</span>
              <a href="#">Terms of Service</a>
              <span>•</span>
              <a href="#">Accessibility</a>
            </div>
          </div>
        </footer>
      </div>
    `;
  }

  bindEvents() {
    // 3D Hover Tilt on Lookbook Cards
    const tiltCards = this.container.querySelectorAll('.tilt-card');
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

        const glare = card.querySelector('.lookbook-glare');
        if (glare) {
          glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 65%)`;
          glare.style.opacity = '1';
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        const glare = card.querySelector('.lookbook-glare');
        if (glare) glare.style.opacity = '0';
      });
    });

    // Form Validation
    const form = this.container.querySelector('#concierge-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const nameInput = form.querySelector('#contact-name');
      const emailInput = form.querySelector('#contact-email');
      const messageInput = form.querySelector('#contact-message');

      const errName = form.querySelector('#error-name');
      const errEmail = form.querySelector('#error-email');
      const errMessage = form.querySelector('#error-message');
      const feedback = form.querySelector('#form-feedback');

      // Clear previous errors
      errName.textContent = '';
      errEmail.textContent = '';
      errMessage.textContent = '';
      feedback.textContent = '';

      if (!nameInput.value.trim()) {
        errName.textContent = 'Please enter your name.';
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        errEmail.textContent = 'Please provide a valid email address.';
        isValid = false;
      }

      if (!messageInput.value.trim() || messageInput.value.trim().length < 8) {
        errMessage.textContent = 'Please include a message (at least 8 characters).';
        isValid = false;
      }

      if (isValid) {
        const btn = form.querySelector('#btn-submit-contact');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="btn-text">Transmitting Request... ✨</span>';
        btn.disabled = true;

        setTimeout(() => {
          form.reset();
          btn.innerHTML = originalText;
          btn.disabled = false;
          feedback.className = 'form-feedback success';
          feedback.textContent = '✦ Message received! A GLOSSÉ beauty concierge will reach out within 24 hours.';
        }, 850);
      }
    });

    // Newsletter Validation
    const newsForm = this.container.querySelector('#newsletter-form');
    newsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newsInput = newsForm.querySelector('#newsletter-email');
      const newsFeedback = newsForm.querySelector('#newsletter-feedback');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!newsInput.value.trim() || !emailRegex.test(newsInput.value.trim())) {
        newsFeedback.className = 'newsletter-feedback error';
        newsFeedback.textContent = 'Please enter a valid email address.';
        return;
      }

      newsFeedback.className = 'newsletter-feedback success';
      newsFeedback.textContent = '✦ Welcome to The Glaze Society. Check your inbox for private perks.';
      newsForm.reset();
    });
  }
}
