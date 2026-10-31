import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SeasonId, SEASONS } from '../utils/seasonalTheme';

interface MinecraftHeroCanvasProps {
  reducedMotion?: boolean;
  seasonId?: SeasonId;
}

export const MinecraftHeroCanvas: React.FC<MinecraftHeroCanvasProps> = ({
  reducedMotion = false,
  seasonId = 'winter',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const currentSeasonRef = useRef<SeasonId>(seasonId);
  const sceneThemeRef = useRef<{
    fog?: THREE.FogExp2;
    ambientLight?: THREE.AmbientLight;
    sunLight?: THREE.DirectionalLight;
    rimLight?: THREE.DirectionalLight;
    grassTopMat?: THREE.MeshStandardMaterial;
    leavesMat?: THREE.MeshStandardMaterial;
    portalMat?: THREE.MeshStandardMaterial;
    emeraldOreMat?: THREE.MeshStandardMaterial;
    particleMat?: THREE.MeshBasicMaterial;
    particles?: THREE.InstancedMesh;
  }>({});

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const initialPalette = SEASONS.winter.canvas;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(initialPalette.fogColor, 0.04);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 80);
    camera.position.set(0, 4.8, 13.5);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'mediump', // Optimized GPU shader precision
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Optimized lighting
    const ambientLight = new THREE.AmbientLight(initialPalette.ambientColor, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(initialPalette.sunColor, 1.3);
    sunLight.position.set(8, 12, 6);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(initialPalette.rimColor, 0.5);
    rimLight.position.set(-8, 6, -5);
    scene.add(rimLight);

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // Shared geometry & materials
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);

    const deepslateMat = new THREE.MeshStandardMaterial({
      color: initialPalette.deepslateColor || 0x181c20,
      roughness: 0.85,
      metalness: 0.1,
    });
    const grassTopMat = new THREE.MeshStandardMaterial({
      color: initialPalette.grassColor,
      roughness: 0.9,
      metalness: 0.05,
    });
    const emeraldOreMat = new THREE.MeshStandardMaterial({
      color: initialPalette.portalColor,
      roughness: 0.3,
      metalness: 0.2,
      emissive: initialPalette.sunColor,
      emissiveIntensity: 0.7,
    });
    const woodLogMat = new THREE.MeshStandardMaterial({
      color: 0x3e2723,
      roughness: 0.9,
    });
    const leavesMat = new THREE.MeshStandardMaterial({
      color: initialPalette.leavesColor,
      roughness: 0.8,
      transparent: true,
      opacity: 0.92,
    });
    const portalMat = new THREE.MeshStandardMaterial({
      color: initialPalette.portalColor,
      emissive: initialPalette.portalColor,
      emissiveIntensity: 0.85,
      transparent: true,
      opacity: 0.75,
    });

    // 1. Instanced Island generation (Reduces ~350 draw calls to 3 draw calls!)
    const islandSize = 14;
    const deepslateTransforms: THREE.Matrix4[] = [];
    const grassTransforms: THREE.Matrix4[] = [];
    const emeraldTransforms: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();

    for (let x = -islandSize / 2; x <= islandSize / 2; x++) {
      for (let z = -islandSize / 2; z <= islandSize / 2; z++) {
        const dist = Math.sqrt(x * x + z * z);
        if (dist > islandSize / 2 + 0.5) continue;

        const rawHeight = Math.sin(x * 0.45) * Math.cos(z * 0.45) * 1.4 - dist * 0.22;
        const heightLevel = Math.max(0, Math.floor(rawHeight + 1.6));

        for (let y = 0; y <= heightLevel; y++) {
          const isEmerald =
            (x === 2 && y === 1 && z === -1) ||
            (x === -3 && y === 2 && z === 1) ||
            (x === 0 && y === 0 && z === 2) ||
            (Math.abs(x * 3 + z * 5) % 17 === 0 && y > 0 && y < heightLevel);

          dummy.position.set(x, y - 2, z);
          dummy.rotation.set(0, 0, 0);
          dummy.scale.set(1, 1, 1);
          dummy.updateMatrix();

          if (isEmerald) {
            emeraldTransforms.push(dummy.matrix.clone());
          } else if (y === heightLevel) {
            grassTransforms.push(dummy.matrix.clone());
          } else {
            deepslateTransforms.push(dummy.matrix.clone());
          }
        }
      }
    }

    // Create InstancedMeshes
    const deepslateMesh = new THREE.InstancedMesh(boxGeo, deepslateMat, deepslateTransforms.length);
    deepslateTransforms.forEach((mat, i) => deepslateMesh.setMatrixAt(i, mat));
    deepslateMesh.instanceMatrix.needsUpdate = true;
    worldGroup.add(deepslateMesh);

    const grassMesh = new THREE.InstancedMesh(boxGeo, grassTopMat, grassTransforms.length);
    grassTransforms.forEach((mat, i) => grassMesh.setMatrixAt(i, mat));
    grassMesh.instanceMatrix.needsUpdate = true;
    worldGroup.add(grassMesh);

    const emeraldMesh = new THREE.InstancedMesh(boxGeo, emeraldOreMat, emeraldTransforms.length);
    emeraldTransforms.forEach((mat, i) => emeraldMesh.setMatrixAt(i, mat));
    emeraldMesh.instanceMatrix.needsUpdate = true;
    worldGroup.add(emeraldMesh);

    // 2. Instanced Trees
    const trunkTransforms: THREE.Matrix4[] = [];
    const foliageTransforms: THREE.Matrix4[] = [];

    const treeLocations = [
      { x: -3.5, y: 0, z: -2 },
      { x: 4, y: 0.5, z: -2.5 },
      { x: -2, y: 0.5, z: 3 },
    ];

    treeLocations.forEach(({ x, y, z }) => {
      // Trunk (3 blocks)
      for (let ty = 0; ty < 3; ty++) {
        dummy.position.set(x, y + ty, z);
        dummy.scale.set(0.65, 1, 0.65);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        trunkTransforms.push(dummy.matrix.clone());
      }
      // Foliage
      for (let lx = -1; lx <= 1; lx++) {
        for (let lz = -1; lz <= 1; lz++) {
          for (let ly = 2; ly <= 4; ly++) {
            if (ly === 4 && (Math.abs(lx) === 1 || Math.abs(lz) === 1)) continue;
            dummy.position.set(x + lx * 0.85, y + ly, z + lz * 0.85);
            dummy.scale.set(0.9, 0.9, 0.9);
            dummy.rotation.set(0, 0, 0);
            dummy.updateMatrix();
            foliageTransforms.push(dummy.matrix.clone());
          }
        }
      }
      // Top foliage
      dummy.position.set(x, y + 4.8, z);
      dummy.scale.set(0.7, 0.7, 0.7);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      foliageTransforms.push(dummy.matrix.clone());
    });

    const trunkMesh = new THREE.InstancedMesh(boxGeo, woodLogMat, trunkTransforms.length);
    trunkTransforms.forEach((mat, i) => trunkMesh.setMatrixAt(i, mat));
    trunkMesh.instanceMatrix.needsUpdate = true;
    worldGroup.add(trunkMesh);

    const foliageMesh = new THREE.InstancedMesh(boxGeo, leavesMat, foliageTransforms.length);
    foliageTransforms.forEach((mat, i) => foliageMesh.setMatrixAt(i, mat));
    foliageMesh.instanceMatrix.needsUpdate = true;
    worldGroup.add(foliageMesh);

    // 3. Portal Monument Arch
    const portalGroup = new THREE.Group();
    const portalPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 2.8), portalMat);
    portalPlane.position.set(0, 1.8, 0);
    portalGroup.add(portalPlane);
    portalGroup.position.set(0, 0, -1);
    worldGroup.add(portalGroup);

    // 4. Multi-Seasonal Particle System (Snow in Winter, Sakura in Spring, Fireflies in Summer, Leaves in Autumn)
    const particleCount = 48; // Lightweight instanced particles
    const particleGeo = new THREE.DodecahedronGeometry(0.12, 0);
    const particleMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
    });
    const particles = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);

    sceneThemeRef.current = {
      fog: scene.fog as THREE.FogExp2,
      ambientLight,
      sunLight,
      rimLight,
      grassTopMat,
      leavesMat,
      portalMat,
      emeraldOreMat,
      particleMat,
      particles,
    };

    interface ParticleState {
      x: number;
      y: number;
      z: number;
      baseX: number;
      baseY: number;
      baseZ: number;
      fallSpeed: number;
      phase: number;
      scaleBase: number;
      driftSpeed: number;
    }

    const particleStates: ParticleState[] = [];
    const tempColor = new THREE.Color();
    const colors = initialPalette.particleColors || [initialPalette.particleColor];

    for (let i = 0; i < particleCount; i++) {
      const px = (Math.random() - 0.5) * 12;
      const py = Math.random() * 6.5;
      const pz = (Math.random() - 0.5) * 10;
      particleStates.push({
        x: px,
        y: py,
        z: pz,
        baseX: px,
        baseY: py,
        baseZ: pz,
        fallSpeed: 0.008 + Math.random() * 0.012,
        phase: Math.random() * Math.PI * 2,
        scaleBase: 0.65 + Math.random() * 0.45,
        driftSpeed: 0.004 + Math.random() * 0.007,
      });

      tempColor.setHex(colors[i % colors.length]);
      particles.setColorAt(i, tempColor);

      dummy.position.set(px, py, pz);
      dummy.scale.setScalar(0.7);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      particles.setMatrixAt(i, dummy.matrix);
    }
    particles.instanceMatrix.needsUpdate = true;
    if (particles.instanceColor) particles.instanceColor.needsUpdate = true;
    worldGroup.add(particles);

    // Subtle Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 5. Intersection Observer & Visibility Check to completely pause when off-screen
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    let isTabActive = !document.hidden;
    const handleVisibility = () => {
      isTabActive = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // 6. Frame-Rate Capping Render Loop (~35 FPS) to eliminate CPU/GPU lag
    let animationFrameId = 0;
    let clock = new THREE.Clock();
    let lastRenderTime = 0;
    const targetFps = 35;
    const frameInterval = 1000 / targetFps;

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      // Halt rendering if tab hidden or scrolled offscreen
      if (!isVisible || !isTabActive) return;

      const delta = time - lastRenderTime;
      if (delta < frameInterval) return;
      lastRenderTime = time - (delta % frameInterval);

      const elapsedTime = clock.getElapsedTime();

      if (!reducedMotion) {
        // Smooth lerped parallax
        currentMouseX += (targetMouseX - currentMouseX) * 0.04;
        currentMouseY += (targetMouseY - currentMouseY) * 0.04;

        worldGroup.rotation.y = Math.sin(elapsedTime * 0.12) * 0.12 + currentMouseX * 0.06;
        worldGroup.rotation.x = 0.1 + Math.cos(elapsedTime * 0.08) * 0.03 + currentMouseY * 0.04;

        // Animate particles with season-specific physical motion
        const activeSeason = currentSeasonRef.current || 'autumn';

        for (let i = 0; i < particleCount; i++) {
          const p = particleStates[i];

          if (activeSeason === 'winter') {
            // ❄️ Falling Snow: fast, smooth vertical descent with cold horizontal drift
            p.y -= p.fallSpeed * 2.2;
            if (p.y < -1.0) {
              p.y = 7.0;
              p.x = (Math.random() - 0.5) * 12;
              p.z = (Math.random() - 0.5) * 10;
            }
            const posX = p.x + Math.sin(elapsedTime * 0.8 + p.phase) * 0.35;
            const posZ = p.z + Math.cos(elapsedTime * 0.6 + p.phase) * 0.25;

            dummy.position.set(posX, p.y, posZ);
            dummy.rotation.set(elapsedTime * 0.6 + p.phase, elapsedTime * 0.4, p.phase);
            dummy.scale.setScalar(p.scaleBase * 0.55);
          } else if (activeSeason === 'spring') {
            // 🌸 Cherry Blossom (Sakura) Petals: swirling descent drifting on the spring breeze
            p.y -= p.fallSpeed * 0.85;
            p.x += p.driftSpeed + Math.sin(elapsedTime * 1.1 + p.phase) * 0.008;
            if (p.y < -1.0 || p.x > 7.0) {
              p.y = 7.0;
              p.x = -6.5 + Math.random() * 8.5;
              p.z = (Math.random() - 0.5) * 10;
            }
            const posY = p.y;
            const posX = p.x;
            const posZ = p.z + Math.cos(elapsedTime * 0.9 + p.phase) * 0.3;

            dummy.position.set(posX, posY, posZ);
            // Fluttering flat petal tumbling
            dummy.rotation.x = Math.sin(elapsedTime * 2.2 + p.phase) * 0.85;
            dummy.rotation.y = elapsedTime * 1.3 + p.phase;
            dummy.rotation.z = Math.cos(elapsedTime * 1.8 + p.phase) * 0.7;
            dummy.scale.set(p.scaleBase * 1.1, p.scaleBase * 0.38, p.scaleBase * 0.18);
          } else if (activeSeason === 'summer') {
            // ✨ Luminous Fireflies: nocturnal hovering & gentle wandering with pulsing glow
            const hoverY = p.baseY + Math.sin(elapsedTime * 1.2 + p.phase) * 0.65;
            const wanderX = p.baseX + Math.sin(elapsedTime * 0.5 + p.phase) * 0.75;
            const wanderZ = p.baseZ + Math.cos(elapsedTime * 0.6 + p.phase) * 0.75;

            dummy.position.set(wanderX, hoverY, wanderZ);
            dummy.rotation.set(0, elapsedTime * 0.5 + p.phase, 0);

            // Flickering bioluminescence
            const pulse = (Math.sin(elapsedTime * 3.5 + p.phase * 2) + 1) * 0.5;
            dummy.scale.setScalar(p.scaleBase * (0.45 + pulse * 0.55));
          } else {
            // 🍂 Autumn Maple & Golden Leaves: swirling, rocking descent in autumn wind
            p.y -= p.fallSpeed * 1.15;
            p.x += Math.sin(elapsedTime * 1.4 + p.phase) * 0.01;
            p.z += Math.cos(elapsedTime * 1.2 + p.phase) * 0.008;

            if (p.y < -1.0) {
              p.y = 7.0;
              p.x = (Math.random() - 0.5) * 11;
              p.z = (Math.random() - 0.5) * 10;
            }

            dummy.position.set(p.x, p.y, p.z);
            // Leaf tumbling motion
            dummy.rotation.x = elapsedTime * 1.8 + p.phase;
            dummy.rotation.y = Math.sin(elapsedTime * 1.4 + p.phase) * 1.4;
            dummy.rotation.z = Math.cos(elapsedTime * 1.6 + p.phase) * 0.8;
            dummy.scale.set(p.scaleBase * 1.2, p.scaleBase * 0.35, p.scaleBase * 0.5);
          }

          dummy.updateMatrix();
          particles.setMatrixAt(i, dummy.matrix);
        }
        particles.instanceMatrix.needsUpdate = true;

        portalMat.opacity = 0.65 + Math.sin(elapsedTime * 2.5) * 0.18;
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      boxGeo.dispose();
      particleGeo.dispose();
      deepslateMat.dispose();
      grassTopMat.dispose();
      emeraldOreMat.dispose();
      portalMat.dispose();
      woodLogMat.dispose();
      leavesMat.dispose();
      particleMat.dispose();
    };
  }, [reducedMotion]);

  // Dynamically adapt scene materials, lighting, and particle colors when season changes
  useEffect(() => {
    currentSeasonRef.current = seasonId;
    const palette = SEASONS[seasonId]?.canvas;
    if (!palette) return;
    const refs = sceneThemeRef.current;
    if (refs.fog) refs.fog.color.setHex(palette.fogColor);
    if (refs.ambientLight) refs.ambientLight.color.setHex(palette.ambientColor);
    if (refs.sunLight) refs.sunLight.color.setHex(palette.sunColor);
    if (refs.rimLight) refs.rimLight.color.setHex(palette.rimColor);
    if (refs.grassTopMat) refs.grassTopMat.color.setHex(palette.grassColor);
    if (refs.leavesMat) refs.leavesMat.color.setHex(palette.leavesColor);
    if (refs.portalMat) {
      refs.portalMat.color.setHex(palette.portalColor);
      refs.portalMat.emissive.setHex(palette.portalColor);
    }
    if (refs.emeraldOreMat) {
      refs.emeraldOreMat.color.setHex(palette.portalColor);
      refs.emeraldOreMat.emissive.setHex(palette.sunColor);
    }
    if (refs.particleMat) refs.particleMat.color.setHex(palette.particleColor);

    // Update instance colors for distinct multi-hue seasonal particles (sakura pinks, snow, amber leaves, fireflies)
    if (refs.particles) {
      const colors = palette.particleColors || [palette.particleColor];
      const tempCol = new THREE.Color();
      for (let i = 0; i < 48; i++) {
        tempCol.setHex(colors[i % colors.length]);
        refs.particles.setColorAt(i, tempCol);
      }
      if (refs.particles.instanceColor) {
        refs.particles.instanceColor.needsUpdate = true;
      }
    }
  }, [seasonId]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none">
      <div ref={mountRef} className="w-full h-full opacity-65" />
      {/* Cinematic dark scrim gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080B0D] via-transparent to-[#080B0D]/80" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#080B0D]/50 to-[#080B0D]" />
    </div>
  );
};
