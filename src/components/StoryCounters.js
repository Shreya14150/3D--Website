import { BRAND_CONFIG } from '../config.js';

/**
 * Story Storytelling & Animated Stats Component
 */
export class StoryCounters {
  constructor(container) {
    this.container = container;
    this.hasAnimated = false;

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="story-wrapper">
        <!-- Story Hero Header -->
        <div class="story-header text-center">
          <span class="section-kicker">Pure Botanical Alchemistry</span>
          <h2 class="section-title">The Anatomy of Wet-Look Luxury</h2>
          <p class="section-lead">
            Formulated in Paris, perfected in New York. GLOSSÉ merges high-viscosity peptide cushion technology
            with biocompatible botanical oils to deliver intense glass reflections without a micro-gram of stickiness.
          </p>
        </div>

        <!-- 3D Ingredients Cards Grid -->
        <div class="ingredients-grid">
          ${BRAND_CONFIG.ingredients.map((ing) => `
            <div class="ingredient-card glass-panel magnetic" data-ing-id="${ing.id}">
              <div class="ing-icon-wrapper" style="box-shadow: 0 0 25px ${ing.color}33;">
                <span class="ing-icon">${ing.icon}</span>
              </div>
              <div class="ing-meta">
                <span class="ing-type">${ing.type}</span>
                <h3 class="ing-name">${ing.name}</h3>
                <p class="ing-desc">${ing.description}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Animated "Why Our Gloss" Counters Section -->
        <div class="why-us-section glass-panel">
          <div class="why-us-header">
            <span class="section-kicker">Clinical & Consumer Metrics</span>
            <h3 class="why-us-title">Why GLOSSÉ Outshines Everything Else</h3>
          </div>

          <div class="counters-grid">
            ${BRAND_CONFIG.stats.map((stat, idx) => `
              <div class="counter-card" data-idx="${idx}">
                <div class="counter-number-row">
                  <span class="counter-val" data-target="${stat.value}">0</span>
                  <span class="counter-suffix">${stat.suffix}</span>
                </div>
                <p class="counter-label">${stat.label}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  animateCounters() {
    const counterEls = this.container.querySelectorAll('.counter-val');

    counterEls.forEach((el) => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1.0);
        // Ease out quad
        const easeVal = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeVal * target);

        el.textContent = current;

        if (progress < 1.0) {
          requestAnimationFrame(updateCount);
        } else {
          el.textContent = target;
        }
      };

      requestAnimationFrame(updateCount);
    });
  }
}
