import * as THREE from 'three';
import { lerp } from '../utils/math.js';

/**
 * Organic Morphing Gloss Droplet
 * Simulates high-viscosity, ultra-reflective lip gloss droplet with
 * organic noise wave displacement, surface tension, and interactive squeeze release.
 */
export class DropletMesh {
  constructor(scene) {
    this.scene = scene;
    this.targetColor = new THREE.Color(0x5C0C25); // Default Wine Red

    // Initial state
    this.isSqueezing = false;
    this.squeezeProgress = 0;
    this.dropY = 0;
    this.dropVelocity = 0;
    this.isFalling = false;
    this.onLanding = null;

    this.initMesh();
  }

  initMesh() {
    this.group = new THREE.Group();

    // High subdivision sphere for organic fluid deformation
    this.baseRadius = 0.32;
    this.geometry = new THREE.SphereGeometry(this.baseRadius, 48, 36);
    this.origPositions = this.geometry.attributes.position.clone();

    this.material = new THREE.MeshPhysicalMaterial({
      color: this.targetColor,
      transmission: 0.85,
      roughness: 0.04,
      ior: 1.48,
      thickness: 1.4,
      specularIntensity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      sheen: 0.9,
      sheenColor: new THREE.Color(0x99183C),
      attenuationDistance: 1.2,
      attenuationColor: this.targetColor,
      transparent: true,
      opacity: 0.95
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.castShadow = true;
    this.group.add(this.mesh);

    // Place near wand tip
    this.group.position.set(0.12, -2.4, 0.1);
    this.scene.add(this.group);
  }

  setShade(shade) {
    this.targetColor = new THREE.Color(shade.liquidHex || shade.hex);
    this.material.attenuationColor.copy(this.targetColor);
    if (shade.sheenColor) {
      this.material.sheenColor.set(shade.sheenColor);
    }
  }

  triggerSqueeze() {
    this.isSqueezing = true;
    this.squeezeProgress = 0;
    this.isFalling = false;
    this.dropY = 0;
    this.dropVelocity = 0;
  }

  releaseSqueeze() {
    if (this.squeezeProgress > 0.4 && !this.isFalling) {
      this.isFalling = true;
      this.dropVelocity = 0.02;
    }
    this.isSqueezing = false;
  }

  update(time, delta, tubePosition, tubeRotation, wandTipPos = null) {
    this.material.color.lerp(this.targetColor, 0.08);

    // 1. Organic noise morphing on vertices
    const posAttr = this.geometry.attributes.position;
    const orig = this.origPositions;

    for (let i = 0; i < posAttr.count; i++) {
      const ox = orig.getX(i);
      const oy = orig.getY(i);
      const oz = orig.getZ(i);

      // Spherical harmonic noise approximation
      const wave = Math.sin(ox * 5.0 + time * 2.0) * 0.025 +
                   Math.cos(oy * 6.0 + time * 2.5) * 0.025 +
                   Math.sin(oz * 5.0 + time * 1.8) * 0.025;

      // Squeeze elongation: tear-drop shape
      let stretchY = 1.0;
      let pinchX = 1.0;

      if (this.squeezeProgress > 0) {
        // Taper upper half like a dripping droplet
        const yNorm = (oy / this.baseRadius);
        stretchY = 1.0 + this.squeezeProgress * 1.4;
        pinchX = 1.0 - Math.max(0, yNorm) * this.squeezeProgress * 0.45;
      }

      posAttr.setXYZ(
        i,
        ox * pinchX * (1 + wave),
        oy * stretchY * (1 + wave),
        oz * pinchX * (1 + wave)
      );
    }
    posAttr.needsUpdate = true;
    this.geometry.computeVertexNormals();

    // 2. Squeeze animation state
    if (this.isSqueezing) {
      this.squeezeProgress = Math.min(1.0, this.squeezeProgress + delta * 1.8);
    } else if (!this.isFalling) {
      this.squeezeProgress = Math.max(0.0, this.squeezeProgress - delta * 2.5);
    }

    // 3. Falling droplet physics
    if (this.isFalling) {
      this.dropVelocity += 9.8 * delta * 0.16; // Gravity
      this.dropY -= this.dropVelocity;

      if (this.dropY < -3.6) {
        if (typeof this.onLanding === 'function') {
          this.onLanding();
        }
        // Reset after fall
        this.isFalling = false;
        this.dropY = 0;
        this.squeezeProgress = 0;
      }
    }

    // Anchor relative to wand tip or tube
    let targetPos;
    if (wandTipPos) {
      targetPos = new THREE.Vector3(
        wandTipPos.x,
        wandTipPos.y + this.dropY - 0.15 - (this.squeezeProgress * 0.35),
        wandTipPos.z + 0.05
      );
    } else {
      const anchorY = -2.3 + this.dropY - (this.squeezeProgress * 0.35);
      targetPos = new THREE.Vector3(
        tubePosition.x + 0.08,
        tubePosition.y + anchorY,
        tubePosition.z + 0.1
      );
    }

    this.group.position.lerp(targetPos, 0.25);
    this.group.rotation.x = tubeRotation.x * 0.5;
    this.group.rotation.z = tubeRotation.z * 0.5;

    // Scale dynamically
    const baseScale = 0.85 + Math.sin(time * 2.0) * 0.05 + (this.squeezeProgress * 0.55);
    this.group.scale.set(baseScale, baseScale, baseScale);
  }
}
