import * as THREE from 'three';
import { lerp } from '../utils/math.js';

/**
 * 3D Floating Botanical Ingredients
 * 1. Golden Jojoba Elixir: Warm amber translucent droplet with inner golden light
 * 2. Whipped Wild Shea: Soft velvety organic cream cushion orb
 * 3. Vitamin E Acetate: Rose-coral antioxidant liquid pearl with refraction
 * 4. Crushed Shimmer Pearls: Multi-faceted holographic crystal prism
 */
export class IngredientOrbs {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.orbs = [];
    this.targetOpacity = 0;
    this.currentOpacity = 0;
    this.visible = false;

    this.initOrbs();
  }

  initOrbs() {
    // 1. GOLDEN JOJOBA ELIXIR
    const jojobaGeo = new THREE.SphereGeometry(0.75, 48, 36);
    const jojobaMat = new THREE.MeshPhysicalMaterial({
      color: 0xE8A028,
      transmission: 0.85,
      roughness: 0.08,
      ior: 1.48,
      thickness: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      attenuationDistance: 1.0,
      attenuationColor: new THREE.Color(0xF5B742),
      transparent: true,
      opacity: 0
    });
    const jojobaMesh = new THREE.Mesh(jojobaGeo, jojobaMat);
    jojobaMesh.position.set(-3.2, 1.2, -1.0);
    this.group.add(jojobaMesh);

    // 2. WHIPPED WILD SHEA
    const sheaGeo = new THREE.IcosahedronGeometry(0.78, 4);
    const sheaMat = new THREE.MeshPhysicalMaterial({
      color: 0xFDFBF7,
      roughness: 0.45,
      metalness: 0.02,
      sheen: 1.0,
      sheenColor: new THREE.Color(0xF6EADB),
      sheenRoughness: 0.3,
      clearcoat: 0.3,
      transparent: true,
      opacity: 0
    });
    const sheaMesh = new THREE.Mesh(sheaGeo, sheaMat);
    sheaMesh.position.set(3.2, 1.8, -1.5);
    this.group.add(sheaMesh);

    // 3. VITAMIN E ACETATE
    const vitEGeo = new THREE.SphereGeometry(0.68, 48, 36);
    const vitEMat = new THREE.MeshPhysicalMaterial({
      color: 0xEE4B6A,
      transmission: 0.78,
      roughness: 0.06,
      ior: 1.52,
      thickness: 1.8,
      clearcoat: 1.0,
      sheen: 0.8,
      sheenColor: new THREE.Color(0xFFA8B8),
      attenuationDistance: 0.9,
      attenuationColor: new THREE.Color(0xFF2E63),
      transparent: true,
      opacity: 0
    });
    const vitEMesh = new THREE.Mesh(vitEGeo, vitEMat);
    vitEMesh.position.set(-2.8, -1.8, -0.8);
    this.group.add(vitEMesh);

    // 4. CRUSHED SHIMMER PEARL
    const pearlGeo = new THREE.DodecahedronGeometry(0.72, 1);
    const pearlMat = new THREE.MeshPhysicalMaterial({
      color: 0xEDE8F8,
      roughness: 0.08,
      metalness: 0.3,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      iridescence: 1.0,
      iridescenceIOR: 1.55,
      transmission: 0.45,
      transparent: true,
      opacity: 0
    });
    const pearlMesh = new THREE.Mesh(pearlGeo, pearlMat);
    pearlMesh.position.set(2.9, -1.6, -1.2);
    this.group.add(pearlMesh);

    this.orbs = [
      { mesh: jojobaMesh, mat: jojobaMat, basePos: jojobaMesh.position.clone(), speed: 1.1, rotSpeed: 0.4 },
      { mesh: sheaMesh, mat: sheaMat, basePos: sheaMesh.position.clone(), speed: 0.9, rotSpeed: 0.3 },
      { mesh: vitEMesh, mat: vitEMat, basePos: vitEMesh.position.clone(), speed: 1.3, rotSpeed: 0.5 },
      { mesh: pearlMesh, mat: pearlMat, basePos: pearlMesh.position.clone(), speed: 1.0, rotSpeed: 0.6 }
    ];

    // Hidden initially
    this.group.scale.set(0.001, 0.001, 0.001);
  }

  setVisible(visible) {
    this.visible = visible;
    this.targetOpacity = visible ? 1 : 0;
  }

  update(time, scrollParallax = 0, cursor = { x: 0, y: 0 }) {
    this.currentOpacity = lerp(this.currentOpacity, this.targetOpacity, 0.08);

    const scale = lerp(this.group.scale.x, this.visible ? 1.0 : 0.001, 0.08);
    this.group.scale.set(scale, scale, scale);

    this.orbs.forEach((orb, idx) => {
      orb.mat.opacity = this.currentOpacity;

      // Floating undulation
      const t = time * orb.speed + idx * 1.5;
      const floatY = Math.sin(t) * 0.25;
      const floatX = Math.cos(t * 0.8) * 0.15;

      // Cursor & scroll parallax
      const parX = cursor.x * 0.5 * (idx % 2 === 0 ? 1 : -1);
      const parY = (cursor.y * 0.4 - scrollParallax * 0.8) * (idx > 1 ? 1 : -1);

      orb.mesh.position.set(
        orb.basePos.x + floatX + parX,
        orb.basePos.y + floatY + parY,
        orb.basePos.z
      );

      orb.mesh.rotation.x = time * orb.rotSpeed;
      orb.mesh.rotation.y = time * orb.rotSpeed * 1.2;
    });
  }
}
