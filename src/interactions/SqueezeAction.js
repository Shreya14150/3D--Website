/**
 * Squeeze Interaction Controller
 * Handles click/hold on the 3D tube to squeeze out a gloss droplet
 */
export class SqueezeAction {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.isPressing = false;
    this.pressTimer = null;

    this.initDOM();
    this.bindEvents();
  }

  initDOM() {
    this.badge = document.createElement('div');
    this.badge.className = 'squeeze-badge magnetic';
    this.badge.innerHTML = `
      <span class="squeeze-icon">💧</span>
      <span class="squeeze-label">Hold to Squeeze Droplet</span>
      <div class="squeeze-progress-bar"></div>
    `;
    document.body.appendChild(this.badge);
  }

  bindEvents() {
    const handleStart = (e) => {
      // Don't trigger if clicking buttons, links, or drawer
      if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.cart-drawer') || e.target.closest('.shade-pill')) {
        return;
      }
      this.startSqueeze();
    };

    const handleEnd = () => {
      if (this.isPressing) {
        this.endSqueeze();
      }
    };

    // Canvas click or badge click
    window.addEventListener('mousedown', handleStart);
    window.addEventListener('mouseup', handleEnd);

    window.addEventListener('touchstart', (e) => {
      if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.cart-drawer')) return;
      this.startSqueeze();
    }, { passive: true });

    window.addEventListener('touchend', handleEnd, { passive: true });

    // Also explicit click on the badge
    this.badge.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      this.startSqueeze();
    });
  }

  startSqueeze() {
    this.isPressing = true;
    this.sceneManager.triggerSqueeze();
    this.badge.classList.add('is-squeezing');
    this.badge.querySelector('.squeeze-label').textContent = 'Squeezing Nectar... ✨';

    // Spawn tiny glitter burst at cursor
    this.spawnGlitterBurst();
  }

  endSqueeze() {
    this.isPressing = false;
    this.sceneManager.releaseSqueeze();
    this.badge.classList.remove('is-squeezing');
    this.badge.querySelector('.squeeze-label').textContent = 'Droplet Released! 💧';

    setTimeout(() => {
      if (!this.isPressing) {
        this.badge.querySelector('.squeeze-label').textContent = 'Hold to Squeeze Droplet';
      }
    }, 1800);
  }

  spawnGlitterBurst() {
    const burst = document.createElement('div');
    burst.className = 'glitter-burst';
    burst.style.left = `${window.innerWidth * 0.5}px`;
    burst.style.top = `${window.innerHeight * 0.65}px`;

    for (let i = 0; i < 12; i++) {
      const sparkle = document.createElement('span');
      sparkle.textContent = '✦';
      const angle = (i / 12) * Math.PI * 2;
      const dist = 40 + Math.random() * 50;
      sparkle.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
      sparkle.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
      burst.appendChild(sparkle);
    }

    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 900);
  }
}
