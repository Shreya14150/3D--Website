import * as THREE from 'three';
import { LipGlossTube } from './LipGlossTube.js';
import { GlitterParticles } from './GlitterParticles.js';
import { DropletMesh } from './DropletMesh.js';
import { IngredientOrbs } from './IngredientOrbs.js';
import { lerp } from '../utils/math.js';

/**
 * Three.js 3D Scene Orchestrator
 * Coordinates camera, studio lighting, materials, HDRI studio reflections,
 * page transitions, and cursor tracking.
 */
export class SceneManager {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.isMobile = window.innerWidth <= 768;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mouse tracking
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;
    this.currentPage = 'home';

    // Camera target positions per page
    this.pageConfigs = {
      home: {
        camPos: new THREE.Vector3(0, 0, this.isMobile ? 8.4 : 7.2),
        camLook: new THREE.Vector3(0, 0.1, 0),
        tubePos: new THREE.Vector3(this.isMobile ? 0 : 1.1, -0.65, 0),
        tubeRot: new THREE.Vector3(0.12, -0.3, -0.15),
        tubeScale: this.isMobile ? 0.78 : 0.92,
        unscrewed: false,
        showIngredients: false
      },
      shop: {
        camPos: new THREE.Vector3(0, 0, this.isMobile ? 8.6 : 6.8),
        camLook: new THREE.Vector3(0, 0.1, 0),
        tubePos: new THREE.Vector3(this.isMobile ? 0 : -2.1, -0.55, 0),
        tubeRot: new THREE.Vector3(0.05, 0.45, 0.08),
        tubeScale: this.isMobile ? 0.75 : 0.88,
        unscrewed: true,
        showIngredients: false
      },
      story: {
        camPos: new THREE.Vector3(0, 0, this.isMobile ? 9.0 : 7.4),
        camLook: new THREE.Vector3(0, 0, 0),
        tubePos: new THREE.Vector3(0, -0.55, 0),
        tubeRot: new THREE.Vector3(0.35, 1.2, 0.65), // Dynamic angled showcase
        tubeScale: this.isMobile ? 0.72 : 0.85,
        unscrewed: false,
        showIngredients: true
      },
      lookbook: {
        camPos: new THREE.Vector3(0, 0, this.isMobile ? 9.5 : 7.8),
        camLook: new THREE.Vector3(0, 0, 0),
        tubePos: new THREE.Vector3(this.isMobile ? 0 : 2.2, -0.5, -1.2),
        tubeRot: new THREE.Vector3(-0.2, -0.8, 0.25),
        tubeScale: this.isMobile ? 0.62 : 0.75,
        unscrewed: false,
        showIngredients: false
      }
    };

    this.init();
  }

  init() {
    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.webglSupported = false;

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.copy(this.pageConfigs.home.camPos);

    try {
      // 2. WebGL Renderer
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.15;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      this.container.appendChild(this.renderer.domElement);

      // 3. Studio Environment Map
      this.setupStudioEnvironment();

      // 4. Lighting Rig
      this.setupLights();

      // 5. 3D Hero Objects
      this.tube = new LipGlossTube(this.scene);
      this.glitter = new GlitterParticles(this.scene, this.isMobile);
      this.droplet = new DropletMesh(this.scene);
      this.ingredients = new IngredientOrbs(this.scene);

      this.currentCamPos = this.camera.position.clone();
      this.currentCamLook = new THREE.Vector3(0, 0, 0);
      this.currentTubePos = this.tube.group.position.clone();
      this.currentTubeRot = this.tube.group.rotation.clone();

      this.webglSupported = true;
    } catch (err) {
      console.warn('WebGL initialization failed, running in fallback mode:', err);
      this.webglSupported = false;
    }

    // Events
    this.bindEvents();

    // Clock
    this.clock = new THREE.Clock();
  }

  setupStudioEnvironment() {
    try {
      // Procedural 6-face studio cubemap (Zero shader compilation overhead, universal compatibility)
      const faces = [];
      for (let i = 0; i < 6; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Studio warm pearl gradient
        const grad = ctx.createLinearGradient(0, 0, 0, 256);
        grad.addColorStop(0, '#FFF5FA');
        grad.addColorStop(0.4, '#FBE8F0');
        grad.addColorStop(1, '#3B122A');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 256);

        // Softbox lights
        if (i === 0 || i === 1) { // Left & Right key softboxes
          ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
          ctx.beginPath();
          ctx.ellipse(128, 120, 75, 100, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (i === 2) { // Top overhead strip light
          ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
          ctx.fillRect(30, 30, 196, 196);
        } else if (i === 4 || i === 5) { // Front & Back champagne fill
          ctx.fillStyle = 'rgba(255, 242, 220, 0.8)';
          ctx.beginPath();
          ctx.ellipse(128, 130, 85, 90, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        faces.push(canvas);
      }

      const cubeTexture = new THREE.CubeTexture(faces);
      cubeTexture.needsUpdate = true;
      this.scene.environment = cubeTexture;
    } catch (err) {
      console.warn('Studio environment fallback warning:', err);
    }
  }

  setupLights() {
    // 1. Ambient Light (Soft Pearly glow)
    this.ambientLight = new THREE.AmbientLight(0xFFF0F5, 1.2);
    this.scene.add(this.ambientLight);

    // 2. Key Directional Light
    this.keyLight = new THREE.DirectionalLight(0xFFFFFF, 2.2);
    this.keyLight.position.set(4, 6, 5);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 20;
    this.keyLight.shadow.bias = -0.0005;
    this.scene.add(this.keyLight);

    // 3. Interactive Cursor Spotlight (Highlights glide across glass surface)
    this.cursorLight = new THREE.PointLight(0xFFD6E7, 3.2, 12, 1.2);
    this.cursorLight.position.set(0, 0, 4);
    this.scene.add(this.cursorLight);

    // 4. Rim / Accent Light (Deep Berry contrast for edge drama)
    this.rimLight = new THREE.DirectionalLight(0x8A184A, 1.8);
    this.rimLight.position.set(-5, -3, -4);
    this.scene.add(this.rimLight);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize());

    // Mouse tracking for desktop
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Touch / Gyroscope fallback for mobile
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.targetX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        this.mouse.targetY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    }, { passive: true });

    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
          this.mouse.targetX = (e.gamma / 45); // Tilt left/right
          this.mouse.targetY = ((e.beta - 45) / 45); // Tilt forward/back
        }
      }, { passive: true });
    }
  }

  onResize() {
    this.isMobile = window.innerWidth <= 768;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    if (this.renderer) {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    // Update page config responsiveness
    this.pageConfigs.home.camPos.z = this.isMobile ? 8.2 : 6.2;
    this.pageConfigs.home.tubePos.x = this.isMobile ? 0 : 0.8;
    this.pageConfigs.shop.camPos.z = this.isMobile ? 8.4 : 6.0;
    this.pageConfigs.shop.tubePos.x = this.isMobile ? 0 : -1.85;
    this.pageConfigs.story.camPos.z = this.isMobile ? 8.8 : 6.8;
  }

  setPage(pageName) {
    if (!this.pageConfigs[pageName]) return;
    this.currentPage = pageName;
    const cfg = this.pageConfigs[pageName];

    if (this.tube) this.tube.setUnscrewed(cfg.unscrewed);
    if (this.ingredients) this.ingredients.setVisible(cfg.showIngredients);
  }

  setShade(shade) {
    if (!this.webglSupported) return;
    if (this.tube) this.tube.setShade(shade);
    if (this.glitter) this.glitter.setShade(shade);
    if (this.droplet) this.droplet.setShade(shade);

    if (this.cursorLight) {
      const shadeColor = new THREE.Color(shade.hex);
      this.cursorLight.color.lerp(shadeColor, 0.4);
    }
  }

  triggerSqueeze() {
    if (!this.webglSupported) return;
    if (this.tube) this.tube.setSquish(1.0);
    if (this.droplet) this.droplet.triggerSqueeze();
  }

  releaseSqueeze() {
    if (!this.webglSupported) return;
    if (this.tube) this.tube.setSquish(0.0);
    if (this.droplet) this.droplet.releaseSqueeze();
  }

  setScrollProgress(progress) {
    this.scrollProgress = progress;
  }

  triggerGlazeDropSequence(onDropLand) {
    if (!this.webglSupported) {
      if (onDropLand) onDropLand();
      return;
    }

    // 1. Unscrew and extract wand upwards
    this.tube.setWandExtraction(1.0);
    this.tube.setSquish(0.5);

    setTimeout(() => {
      // 2. Swell shimmery wine droplet at wand tip
      this.droplet.triggerSqueeze();
      this.droplet.onLanding = onDropLand;

      setTimeout(() => {
        // 3. Release gravity drip
        this.droplet.releaseSqueeze();
        this.tube.setSquish(0.0);

        // 4. Return wand back into tube after animation
        setTimeout(() => {
          this.tube.setWandExtraction(0.0);
        }, 2200);
      }, 650);
    }, 800);
  }

  render() {
    if (!this.webglSupported || !this.renderer) return;

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // 1. Mouse Lerp
    this.mouse.x = lerp(this.mouse.x, this.mouse.targetX, 0.08);
    this.mouse.y = lerp(this.mouse.y, this.mouse.targetY, 0.08);

    // 2. Cursor Light Glide
    this.cursorLight.position.x = this.mouse.x * 4.5;
    this.cursorLight.position.y = this.mouse.y * 3.5;
    this.cursorLight.position.z = 3.5 + Math.sin(time) * 0.3;

    // 3. Camera & Tube Target Lerping based on current page
    const cfg = this.pageConfigs[this.currentPage] || this.pageConfigs.home;

    // Idle floating sinewaves
    const idleY = Math.sin(time * 1.4) * 0.08;
    const idleRotX = Math.cos(time * 1.2) * 0.04;
    const idleRotY = Math.sin(time * 0.9) * 0.05;

    // Tube tilt from cursor
    const mouseTiltX = this.prefersReducedMotion ? 0 : -this.mouse.y * 0.35;
    const mouseTiltY = this.prefersReducedMotion ? 0 : this.mouse.x * 0.45;

    // Camera follow
    this.currentCamPos.lerp(cfg.camPos, 0.06);
    this.camera.position.copy(this.currentCamPos);
    this.camera.lookAt(cfg.camLook);

    // Tube position & rotation
    const targetTubePos = new THREE.Vector3(
      cfg.tubePos.x + (this.mouse.x * 0.2),
      cfg.tubePos.y + idleY - (this.scrollProgress * 0.4),
      cfg.tubePos.z
    );

    const targetTubeRot = new THREE.Vector3(
      cfg.tubeRot.x + idleRotX + mouseTiltX,
      cfg.tubeRot.y + idleRotY + mouseTiltY,
      cfg.tubeRot.z
    );

    this.tube.group.position.lerp(targetTubePos, 0.07);
    this.tube.group.rotation.x = lerp(this.tube.group.rotation.x, targetTubeRot.x, 0.07);
    this.tube.group.rotation.y = lerp(this.tube.group.rotation.y, targetTubeRot.y, 0.07);
    this.tube.group.rotation.z = lerp(this.tube.group.rotation.z, targetTubeRot.z, 0.07);

    const curScale = lerp(this.tube.group.scale.x, cfg.tubeScale, 0.07);
    this.tube.group.scale.set(curScale, curScale, curScale);

    // 4. Update child systems with exact wand tip anchor
    const wandTipWorld = new THREE.Vector3();
    if (this.tube) {
      this.tube.getWandTipWorldPosition(wandTipWorld);
    }

    this.tube.update(delta);
    this.glitter.setCursor(this.mouse.x, this.mouse.y);
    this.glitter.update(time, this.tube.group);
    this.droplet.update(time, delta, this.tube.group.position, this.tube.group.rotation, wandTipWorld);
    this.ingredients.update(time, this.scrollProgress, this.mouse);

    // 5. Render
    this.renderer.render(this.scene, this.camera);
  }
}
