import * as THREE from 'three';
import { lerp } from '../utils/math.js';

/**
 * Real Glitter Sparkles System
 * 1. Internal Diamond Micro-Glitter: InstancedMesh inside the gloss liquid that catches light
 * 2. Ambient Floating Sparkle Cloud: Twinkling starlight dust around the scene with cursor interaction
 */
export class GlitterParticles {
  constructor(scene, isMobile = false) {
    this.scene = scene;
    this.isMobile = isMobile;

    this.internalCount = isMobile ? 600 : 1400;
    this.ambientCount = isMobile ? 800 : 2000;

    this.targetGlitterColor = new THREE.Color(0xFFC2D1); // Wine Red diamond sparkle
    this.cursorPos = new THREE.Vector2(0, 0);

    this.initInternalGlitter();
    this.initAmbientSparkles();
  }

  initInternalGlitter() {
    // Octahedron geometry for diamond-cut facets
    const facetGeo = new THREE.OctahedronGeometry(0.024, 0);

    this.facetMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: this.targetGlitterColor,
      emissiveIntensity: 0.65,
      metalness: 0.95,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      iridescence: 0.85,
      iridescenceIOR: 1.6
    });

    this.internalMesh = new THREE.InstancedMesh(facetGeo, this.facetMaterial, this.internalCount);
    this.internalMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    this.internalData = [];
    const dummy = new THREE.Object3D();

    // Distribute within inner liquid cylinder (radius 0.60, height 2.8)
    for (let i = 0; i < this.internalCount; i++) {
      const radius = Math.sqrt(Math.random()) * 0.58;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 2.8 - 0.15;

      const scale = 0.5 + Math.random() * 0.9;
      dummy.position.set(x, y, z);
      dummy.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();

      this.internalMesh.setMatrixAt(i, dummy.matrix);

      this.internalData.push({
        basePos: new THREE.Vector3(x, y, z),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5
        ),
        phase: Math.random() * Math.PI * 2,
        scale: scale
      });
    }

    this.internalMesh.instanceMatrix.needsUpdate = true;
    this.scene.add(this.internalMesh);
  }

  initAmbientSparkles() {
    const ambientGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.ambientCount * 3);
    const colors = new Float32Array(this.ambientCount * 3);
    const sizes = new Float32Array(this.ambientCount);
    const phases = new Float32Array(this.ambientCount);

    this.ambientOriginalPos = [];

    const baseColor = new THREE.Color(0xFFE5EC);
    const goldColor = new THREE.Color(0xFFE4A0);

    for (let i = 0; i < this.ambientCount; i++) {
      const radius = 2.0 + Math.random() * 9.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      const x = radius * Math.cos(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi);
      const z = radius * Math.cos(phi) * Math.sin(theta);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      this.ambientOriginalPos.push(new THREE.Vector3(x, y, z));

      // Alternate between pearly pink and champagne gold micro-sparkle
      const c = Math.random() > 0.4 ? baseColor : goldColor;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = 18 + Math.random() * 26;
      phases[i] = Math.random() * Math.PI * 2;
    }

    ambientGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    ambientGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    ambientGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom twinkling Points shader
    const ambientMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uColor: { value: this.targetGlitterColor }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;
          vec3 pos = position;

          // Gentle ambient drift
          float twinkle = sin(uTime * 3.0 + pos.x * 2.0 + pos.y * 2.5);
          vAlpha = 0.45 + 0.55 * twinkle;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * uPixelRatio * (1.0 / -mvPosition.z) * (0.8 + 0.3 * twinkle);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        uniform vec3 uColor;

        void main() {
          // Circular point with soft halo and cross sparkle
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;

          // Core flare highlight
          float intensity = pow(1.0 - (dist * 2.0), 2.2);
          float flare = max(1.0 - abs(coord.x) * 6.0, 0.0) * max(1.0 - abs(coord.y) * 1.5, 0.0) +
                        max(1.0 - abs(coord.y) * 6.0, 0.0) * max(1.0 - abs(coord.x) * 1.5, 0.0);
          intensity += flare * 0.6;

          vec3 finalColor = mix(vColor, uColor, 0.45);
          gl_FragColor = vec4(finalColor, vAlpha * intensity * 0.95);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.ambientPoints = new THREE.Points(ambientGeo, ambientMat);
    this.scene.add(this.ambientPoints);
  }

  setShade(shade) {
    this.targetGlitterColor = new THREE.Color(shade.glitterColor || 0xFFF0F5);
    if (this.ambientPoints) {
      this.ambientPoints.material.uniforms.uColor.value.copy(this.targetGlitterColor);
    }
  }

  setCursor(normX, normY) {
    this.cursorPos.set(normX, normY);
  }

  update(time, tubeGroupMatrix) {
    // 1. Update internal glitter relative to tube movement
    if (this.internalMesh) {
      const dummy = new THREE.Object3D();
      this.facetMaterial.emissive.lerp(this.targetGlitterColor, 0.08);

      for (let i = 0; i < this.internalCount; i++) {
        const item = this.internalData[i];
        const t = time + item.phase;

        // Micro float & tumble inside the gloss fluid
        const curY = item.basePos.y + Math.sin(t * 1.5) * 0.06;
        const curX = item.basePos.x + Math.cos(t * 1.2) * 0.03;
        const curZ = item.basePos.z + Math.sin(t * 1.8) * 0.03;

        dummy.position.set(curX, curY, curZ);
        dummy.rotation.x = t * item.rotSpeed.x;
        dummy.rotation.y = t * item.rotSpeed.y;
        dummy.rotation.z = t * item.rotSpeed.z;

        // Twinkle scale pulse
        const twinkleScale = item.scale * (0.85 + 0.3 * Math.sin(t * 4.0));
        dummy.scale.set(twinkleScale, twinkleScale, twinkleScale);

        dummy.updateMatrix();
        this.internalMesh.setMatrixAt(i, dummy.matrix);
      }

      // Attach internal mesh transform to the tube group
      this.internalMesh.position.copy(tubeGroupMatrix.position);
      this.internalMesh.rotation.copy(tubeGroupMatrix.rotation);
      this.internalMesh.scale.copy(tubeGroupMatrix.scale);
      this.internalMesh.instanceMatrix.needsUpdate = true;
    }

    // 2. Update ambient sparkles
    if (this.ambientPoints) {
      this.ambientPoints.material.uniforms.uTime.value = time;
      this.ambientPoints.rotation.y = time * 0.025;

      const positions = this.ambientPoints.geometry.attributes.position.array;
      const targetMouseX = this.cursorPos.x * 5.0;
      const targetMouseY = this.cursorPos.y * 3.5;

      // Subtle cursor attraction / repulsion field
      for (let i = 0; i < this.ambientCount; i += 6) { // Optimized stride
        const orig = this.ambientOriginalPos[i];
        const dx = positions[i * 3] - targetMouseX;
        const dy = positions[i * 3 + 1] - targetMouseY;
        const distSq = dx * dx + dy * dy;

        if (distSq < 16.0 && distSq > 0.01) {
          const force = (4.0 - Math.sqrt(distSq)) * 0.012;
          positions[i * 3] += dx * force;
          positions[i * 3 + 1] += dy * force;
        } else {
          positions[i * 3] = lerp(positions[i * 3], orig.x, 0.04);
          positions[i * 3 + 1] = lerp(positions[i * 3 + 1], orig.y, 0.04);
        }
      }
      this.ambientPoints.geometry.attributes.position.needsUpdate = true;
    }
  }
}
