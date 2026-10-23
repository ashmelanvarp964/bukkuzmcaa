import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface MinecraftHeroCanvasProps {
  reducedMotion?: boolean;
}

export const MinecraftHeroCanvas: React.FC<MinecraftHeroCanvasProps> = ({ reducedMotion = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080b0d, 0.038);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 5, 14);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Studio & Minecraft lighting
    const ambientLight = new THREE.AmbientLight(0x064e3b, 0.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0x10b981, 1.4);
    sunLight.position.set(10, 15, 8);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x34d399, 0.6);
    rimLight.position.set(-10, 8, -6);
    scene.add(rimLight);

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // Materials
    const deepslateMat = new THREE.MeshStandardMaterial({
      color: 0x181c20,
      roughness: 0.85,
      metalness: 0.1,
    });
    const grassTopMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      roughness: 0.9,
      metalness: 0.05,
    });
    const emeraldOreMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.3,
      metalness: 0.2,
      emissive: 0x047857,
      emissiveIntensity: 0.8,
    });
    const portalMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x059669,
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.75,
    });
    const woodLogMat = new THREE.MeshStandardMaterial({
      color: 0x3e2723,
      roughness: 0.9,
    });
    const leavesMat = new THREE.MeshStandardMaterial({
      color: 0x047857,
      roughness: 0.8,
      transparent: true,
      opacity: 0.95,
    });

    const boxGeo = new THREE.BoxGeometry(1, 1, 1);

    // Procedural Voxel Island / Mountain
    const islandSize = 16;
    for (let x = -islandSize / 2; x <= islandSize / 2; x++) {
      for (let z = -islandSize / 2; z <= islandSize / 2; z++) {
        const dist = Math.sqrt(x * x + z * z);
        if (dist > islandSize / 2 + 1) continue;

        // Height based on distance and procedural sine
        const rawHeight = Math.sin(x * 0.45) * Math.cos(z * 0.45) * 1.5 - dist * 0.2;
        const heightLevel = Math.max(0, Math.floor(rawHeight + 1.8));

        for (let y = 0; y <= heightLevel; y++) {
          let mat = deepslateMat;
          // Random emerald ore deposit
          const isEmerald = (x === 2 && y === 1 && z === -1) ||
                            (x === -3 && y === 2 && z === 1) ||
                            (x === 0 && y === 0 && z === 2) ||
                            (Math.random() < 0.03 && y > 0);

          if (isEmerald) {
            mat = emeraldOreMat;
          } else if (y === heightLevel) {
            mat = grassTopMat;
          }

          const cube = new THREE.Mesh(boxGeo, mat);
          cube.position.set(x, y - 2, z);
          worldGroup.add(cube);
        }
      }
    }

    // Procedural Minecraft Pine Trees
    function createTree(px: number, py: number, pz: number) {
      const tree = new THREE.Group();
      // Trunk: 3 blocks
      for (let ty = 0; ty < 3; ty++) {
        const trunk = new THREE.Mesh(boxGeo, woodLogMat);
        trunk.position.set(0, ty, 0);
        trunk.scale.set(0.65, 1, 0.65);
        tree.add(trunk);
      }
      // Pine foliage layers
      for (let lx = -1; lx <= 1; lx++) {
        for (let lz = -1; lz <= 1; lz++) {
          for (let ly = 2; ly <= 4; ly++) {
            if (ly === 4 && (Math.abs(lx) === 1 || Math.abs(lz) === 1)) continue;
            const leaf = new THREE.Mesh(boxGeo, leavesMat);
            leaf.position.set(lx * 0.85, ly, lz * 0.85);
            leaf.scale.set(0.9, 0.9, 0.9);
            tree.add(leaf);
          }
        }
      }
      const topLeaf = new THREE.Mesh(boxGeo, leavesMat);
      topLeaf.position.set(0, 5, 0);
      topLeaf.scale.set(0.7, 0.7, 0.7);
      tree.add(topLeaf);

      tree.position.set(px, py, pz);
      worldGroup.add(tree);
    }

    createTree(-4, 0, -2);
    createTree(4.5, 0.5, -3);
    createTree(-2, 0.5, 3.5);

    // Obsidian / Emerald Monument Archway
    const archGroup = new THREE.Group();
    // Left column
    for (let ay = 0; ay < 4; ay++) {
      const block = new THREE.Mesh(boxGeo, deepslateMat);
      block.position.set(-1.5, ay, 0);
      archGroup.add(block);
    }
    // Right column
    for (let ay = 0; ay < 4; ay++) {
      const block = new THREE.Mesh(boxGeo, deepslateMat);
      block.position.set(1.5, ay, 0);
      archGroup.add(block);
    }
    // Top beam
    for (let ax = -1.5; ax <= 1.5; ax++) {
      const block = new THREE.Mesh(boxGeo, emeraldOreMat);
      block.position.set(ax, 3.8, 0);
      archGroup.add(block);
    }
    // Portal inner field
    const portalPlane = new THREE.Mesh(new THREE.PlaneGeometry(2, 3), portalMat);
    portalPlane.position.set(0, 1.8, 0);
    archGroup.add(portalPlane);

    archGroup.position.set(0, 0, -1);
    worldGroup.add(archGroup);

    // Floating Emerald Experience Orbs / Particles
    const particleCount = 45;
    const particleGeo = new THREE.DodecahedronGeometry(0.12, 0);
    const particleMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      wireframe: false,
    });
    const particles = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    const dummy = new THREE.Object3D();

    const particleSpeeds: { x: number; y: number; z: number; speed: number; phase: number }[] = [];
    for (let i = 0; i < particleCount; i++) {
      const px = (Math.random() - 0.5) * 12;
      const py = Math.random() * 5 + 0.5;
      const pz = (Math.random() - 0.5) * 10;
      particleSpeeds.push({
        x: px,
        y: py,
        z: pz,
        speed: 0.005 + Math.random() * 0.012,
        phase: Math.random() * Math.PI * 2,
      });
      dummy.position.set(px, py, pz);
      dummy.scale.setScalar(0.7 + Math.random() * 0.6);
      dummy.updateMatrix();
      particles.setMatrixAt(i, dummy.matrix);
    }
    particles.instanceMatrix.needsUpdate = true;
    worldGroup.add(particles);

    // Interaction / parallax
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      if (!reducedMotion) {
        // Slow majestic island rotation & sway
        worldGroup.rotation.y = Math.sin(elapsedTime * 0.15) * 0.15 + mouseX * 0.08;
        worldGroup.rotation.x = 0.12 + Math.cos(elapsedTime * 0.1) * 0.04 + mouseY * 0.05;

        // Animate floating XP orbs
        for (let i = 0; i < particleCount; i++) {
          const p = particleSpeeds[i];
          p.y += p.speed;
          if (p.y > 6.5) p.y = 0.5;

          dummy.position.set(
            p.x + Math.sin(elapsedTime * 2 + p.phase) * 0.25,
            p.y,
            p.z + Math.cos(elapsedTime * 1.5 + p.phase) * 0.25
          );
          dummy.rotation.x = elapsedTime + p.phase;
          dummy.rotation.y = elapsedTime * 1.3;
          dummy.updateMatrix();
          particles.setMatrixAt(i, dummy.matrix);
        }
        particles.instanceMatrix.needsUpdate = true;

        // Subtle portal pulse
        portalMat.opacity = 0.65 + Math.sin(elapsedTime * 3) * 0.2;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      boxGeo.dispose();
      deepslateMat.dispose();
      grassTopMat.dispose();
      emeraldOreMat.dispose();
      portalMat.dispose();
      woodLogMat.dispose();
      leavesMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [reducedMotion]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none">
      <div ref={mountRef} className="w-full h-full opacity-70" />
      {/* Cinematic dark scrim gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080B0D] via-transparent to-[#080B0D]/80" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#080B0D]/50 to-[#080B0D]" />
    </div>
  );
};
