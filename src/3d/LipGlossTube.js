import * as THREE from 'three';
import { lerp } from '../utils/math.js';

/**
 * Detailed 3D Luxury Lip Gloss Tube
 * Features:
 * - Thick-walled glass barrel with physical transmission, IOR, clearcoat, and attenuation
 * - Rich gloss liquid core with sheen, iridescence, and dynamic shade coloring
 * - Doe-foot applicator wand with acrylic stem and angled velour tip
 * - Champagne gold metallic cap with brushed reflections and beveled crown
 * - Smooth squish/squeeze deformation and cap unscrew animation
 */
export class LipGlossTube {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Initial configuration - Luxury Deep Bordeaux Wine Red
    this.currentShade = {
      hex: 0x5C0C25,
      sheen: 0x99183C,
      glitter: 0xFFC2D1,
      opacity: 0.92,
      ior: 1.50
    };

    this.targetColor = new THREE.Color(this.currentShade.hex);
    this.targetSheen = new THREE.Color(this.currentShade.sheen);

    this.isUnscrewed = false;
    this.squishAmount = 0;
    this.wandExtractionProgress = 0;
    this.targetWandExtraction = 0;
    this.capTargetY = 2.4;
    this.capCurrentY = 2.4;
    this.capRotationY = 0;

    this.initMeshes();
  }

  initMeshes() {
    // 1. OUTER GLASS BARREL (Thick luxury cosmetic flacon)
    // Barrel height: 3.6, Outer radius: 0.85
    const glassGeometry = new THREE.CylinderGeometry(0.85, 0.82, 3.6, 64, 1, false);
    
    this.glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.96,
      opacity: 1,
      transparent: true,
      roughness: 0.04,
      ior: 1.52,
      thickness: 1.25,
      specularIntensity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      attenuationDistance: 2.0,
      attenuationColor: new THREE.Color(0xfff0f5)
    });

    this.glassBarrel = new THREE.Mesh(glassGeometry, this.glassMaterial);
    this.glassBarrel.position.y = 0;
    this.glassBarrel.castShadow = true;
    this.glassBarrel.receiveShadow = true;
    this.group.add(this.glassBarrel);

    // Heavy glass base (solid disc at the bottom for high-end optical weight)
    const glassBaseGeo = new THREE.CylinderGeometry(0.82, 0.78, 0.35, 64);
    const glassBase = new THREE.Mesh(glassBaseGeo, this.glassMaterial);
    glassBase.position.y = -1.88;
    this.group.add(glassBase);

    // 2. INNER GLOSS LIQUID CORE
    const liquidGeo = new THREE.CylinderGeometry(0.68, 0.65, 3.1, 48, 1, false);
    this.liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: this.targetColor,
      transmission: 0.55,
      roughness: 0.15,
      ior: 1.44,
      sheen: 0.85,
      sheenColor: this.targetSheen,
      sheenRoughness: 0.25,
      iridescence: 0.65,
      iridescenceIOR: 1.35,
      clearcoat: 0.7,
      clearcoatRoughness: 0.08,
      transparent: true,
      opacity: 0.88,
      attenuationDistance: 1.1,
      attenuationColor: this.targetColor
    });

    this.liquidCore = new THREE.Mesh(liquidGeo, this.liquidMaterial);
    this.liquidCore.position.y = -0.15;
    this.group.add(this.liquidCore);

    // Top liquid meniscus (concave curvature)
    const meniscusGeo = new THREE.SphereGeometry(0.68, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.45);
    const meniscus = new THREE.Mesh(meniscusGeo, this.liquidMaterial);
    meniscus.rotation.x = Math.PI;
    meniscus.position.y = 1.39;
    this.group.add(meniscus);

    // 3. METALLIC COLLAR / SCREW THREAD
    const collarGeo = new THREE.CylinderGeometry(0.72, 0.75, 0.35, 48);
    this.goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xF6E8D6,
      metalness: 0.96,
      roughness: 0.18
    });
    const collar = new THREE.Mesh(collarGeo, this.goldMaterial);
    collar.position.y = 1.9;
    this.group.add(collar);

    // 4. UPPER CAP ASSEMBLY (Holds wand and rotates/lifts)
    this.capGroup = new THREE.Group();
    this.capGroup.position.y = this.capCurrentY;

    // Metallic main cap
    const capGeo = new THREE.CylinderGeometry(0.86, 0.85, 2.3, 64);
    this.capMesh = new THREE.Mesh(capGeo, this.goldMaterial);
    this.capMesh.position.y = 1.15;
    this.capMesh.castShadow = true;
    this.capGroup.add(this.capMesh);

    // Cap crown bevel (top dome)
    const crownGeo = new THREE.CylinderGeometry(0.80, 0.86, 0.15, 64);
    const crown = new THREE.Mesh(crownGeo, this.goldMaterial);
    crown.position.y = 2.34;
    this.capGroup.add(crown);

    // Rose gold accent ring around bottom of cap
    const accentRingGeo = new THREE.TorusGeometry(0.865, 0.025, 16, 64);
    const roseGoldMat = new THREE.MeshStandardMaterial({
      color: 0xF4B3A8,
      metalness: 0.98,
      roughness: 0.12
    });
    const accentRing = new THREE.Mesh(accentRingGeo, roseGoldMat);
    accentRing.rotation.x = Math.PI / 2;
    accentRing.position.y = 0.08;
    this.capGroup.add(accentRing);

    // 5. DOE-FOOT APPLICATOR WAND
    // Acrylic central stem rod
    const stemGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.7, 24);
    const stemMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      roughness: 0.08,
      ior: 1.49,
      transparent: true,
      opacity: 0.9
    });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = -1.2;
    this.capGroup.add(stem);

    // Doe-foot flocked velour tip (angled cushion)
    const tipGeo = new THREE.ConeGeometry(0.18, 0.55, 32);
    this.tipMaterial = new THREE.MeshStandardMaterial({
      color: this.targetColor,
      roughness: 0.75,
      metalness: 0.05
    });
    this.tipMesh = new THREE.Mesh(tipGeo, this.tipMaterial);
    this.tipMesh.rotation.z = 0.28; // Angled doe-foot slant
    this.tipMesh.position.set(0.05, -2.55, 0);
    this.capGroup.add(this.tipMesh);

    this.group.add(this.capGroup);

    // Overall tube placement & scale
    this.group.position.set(0, 0, 0);
    this.group.rotation.set(0.1, -0.2, -0.15); // Classy initial slant
  }

  setShade(shade) {
    this.currentShade = shade;
    this.targetColor = new THREE.Color(shade.liquidHex || shade.hex);
    this.targetSheen = new THREE.Color(shade.sheenColor || shade.hex);
  }

  setUnscrewed(unscrewed) {
    this.isUnscrewed = unscrewed;
    if (!this.targetWandExtraction) {
      this.capTargetY = unscrewed ? 3.6 : 2.4;
    }
  }

  setWandExtraction(amount) {
    this.targetWandExtraction = amount;
  }

  getWandTipWorldPosition(target) {
    if (this.tipMesh) {
      this.tipMesh.getWorldPosition(target);
    }
  }

  setSquish(amount) {
    this.squishAmount = amount;
  }

  update(delta) {
    // Smooth color lerp for liquid and doe-foot tip
    this.liquidMaterial.color.lerp(this.targetColor, 0.08);
    this.liquidMaterial.sheenColor.lerp(this.targetSheen, 0.08);
    this.liquidMaterial.attenuationColor.lerp(this.targetColor, 0.08);
    this.tipMaterial.color.lerp(this.targetColor, 0.08);

    // Wand extraction animation (smooth lift & twist out of bottle)
    this.wandExtractionProgress = lerp(this.wandExtractionProgress, this.targetWandExtraction, 0.08);

    if (this.wandExtractionProgress > 0.001) {
      this.capGroup.position.y = 2.4 + this.wandExtractionProgress * 2.3;
      this.capGroup.rotation.y = this.wandExtractionProgress * Math.PI * 4;
      this.capGroup.rotation.z = this.wandExtractionProgress * 0.26;
      this.capGroup.position.x = -this.wandExtractionProgress * 0.25;
    } else {
      // Standard page unscrew mode
      this.capCurrentY = lerp(this.capCurrentY, this.capTargetY, 0.08);
      this.capGroup.position.y = this.capCurrentY;
      this.capGroup.position.x = 0;
      this.capGroup.rotation.z = 0;

      if (this.isUnscrewed) {
        this.capGroup.rotation.y = lerp(this.capGroup.rotation.y, Math.PI * 0.75, 0.08);
      } else {
        this.capGroup.rotation.y = lerp(this.capGroup.rotation.y, 0, 0.08);
      }
    }

    // Squish deform during squeeze interaction
    if (this.squishAmount > 0.001) {
      const sx = 1 + this.squishAmount * 0.22;
      const sy = 1 - this.squishAmount * 0.16;
      const sz = 1 + this.squishAmount * 0.22;
      this.glassBarrel.scale.set(sx, sy, sz);
      this.liquidCore.scale.set(sx, sy, sz);
    } else {
      this.glassBarrel.scale.set(1, 1, 1);
      this.liquidCore.scale.set(1, 1, 1);
    }
  }
}
