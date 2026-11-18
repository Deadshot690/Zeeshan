'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface HeroObjectProps {
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  scrollProgress?: number;
}

export default function HeroObject({ pointer, scrollProgress = 0 }: HeroObjectProps) {
  const { size } = useThree();
  const isDesktop = size.width >= 1024;
  const isMobile = size.width < 768;

  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const dropletsRef = useRef<THREE.InstancedMesh>(null);

  // Create a complex organic spline for the liquid metal ribbon
  const { geometry, dropletPositions } = useMemo(() => {
    // Generate an undulating 3D curve inspired by liquid metal ribbons
    const curvePoints: THREE.Vector3[] = [];
    const segments = 120;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 4;
      const x = Math.sin(t) * (2.4 + Math.cos(t * 1.5) * 0.8);
      const y = Math.sin(t * 2) * 0.9 + Math.cos(t) * 0.4;
      const z = Math.cos(t) * (1.8 + Math.sin(t * 0.8) * 0.6);
      curvePoints.push(new THREE.Vector3(x, y, z));
    }
    const path = new THREE.CatmullRomCurve3(curvePoints, true, 'centripetal');

    // Tube with dense radial and tubular subdivisions for silky specular reflections
    const tubeGeo = new THREE.TubeGeometry(path, 160, 0.48, 36, true);

    // Save initial vertex positions for procedural wave deformation
    const posAttr = tubeGeo.attributes.position;
    if (posAttr) {
      tubeGeo.userData = { initialPositions: posAttr.clone() };
    }

    // Spawn 24 floating liquid droplets around the sculpture (matching reference)
    const drops: [number, number, number, number][] = [];
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      const radius = 2.8 + Math.sin(i * 3) * 1.2;
      const dx = Math.cos(angle) * radius;
      const dy = Math.sin(i * 1.8) * 1.6;
      const dz = Math.sin(angle) * radius * 0.8;
      const scale = 0.05 + (i % 5) * 0.035;
      drops.push([dx, dy, dz, scale]);
    }

    return { geometry: tubeGeo, dropletPositions: drops };
  }, []);

  // Material setup for liquid mercury / high-gloss chrome
  const chromeMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xdadad6),
      metalness: 0.98,
      roughness: 0.07,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 1.0,
      envMapIntensity: 2.4,
    });
  }, []);

  // Instanced droplets transformation
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const elapsedTimeRef = useRef(0);

  useFrame((_, delta) => {
    elapsedTimeRef.current += Math.min(delta, 0.1);
    const time = elapsedTimeRef.current;

    if (groupRef.current) {
      // Smooth pointer parallax
      const targetRotX = pointer.current.y * 0.35 + scrollProgress * 0.8;
      const targetRotY = time * 0.15 + pointer.current.x * 0.45;

      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetRotX,
        3.5,
        delta
      );
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetRotY,
        3.5,
        delta
      );

      // Responsive positioning: Desktop places sculpture on the right for editorial balance
      const basePosX = isDesktop ? 1.4 : 0;
      const basePosY = isMobile ? 1.1 : 0.05;
      const basePosZ = isMobile ? -2.2 : 0;
      const baseScale = isMobile ? 0.52 : isDesktop ? 0.95 : 0.8;

      const targetPosX = basePosX + pointer.current.x * (isDesktop ? 0.2 : 0.1);
      const targetPosY = basePosY - scrollProgress * 1.2 + pointer.current.y * 0.15;
      const targetPosZ = basePosZ;
      const targetScale = Math.max(0.4, baseScale - scrollProgress * 0.4);

      groupRef.current.position.x = THREE.MathUtils.damp(
        groupRef.current.position.x,
        targetPosX,
        3.5,
        delta
      );
      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y,
        targetPosY,
        3.5,
        delta
      );
      groupRef.current.position.z = THREE.MathUtils.damp(
        groupRef.current.position.z,
        targetPosZ,
        3.5,
        delta
      );
      groupRef.current.scale.setScalar(
        THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 3.5, delta)
      );
    }

    // Procedural surface liquid shimmer
    if (meshRef.current) {
      const geo = meshRef.current.geometry;
      const pos = geo.attributes.position;
      const initialPos = geo.userData?.initialPositions;

      if (pos && initialPos) {
        const count = pos.count;
        for (let i = 0; i < count; i += 3) {
          const ix = initialPos.getX(i);
          const iy = initialPos.getY(i);
          const iz = initialPos.getZ(i);

          const ripple = Math.sin(ix * 2.2 + time * 1.8) * Math.cos(iy * 2.5 + time * 1.4) * 0.035;

          pos.setXYZ(i, ix + ripple, iy + ripple, iz + ripple);
        }
        pos.needsUpdate = true;
      }
    }

    // Animate floating droplets
    if (dropletsRef.current) {
      dropletPositions.forEach(([dx, dy, dz, scale], i) => {
        const floatY = dy + Math.sin(time * 1.6 + i) * 0.18;
        const orbitAngle = time * 0.1 * ((i % 2 === 0 ? 1 : -1));
        const rotX = dx * Math.cos(orbitAngle) - dz * Math.sin(orbitAngle);
        const rotZ = dx * Math.sin(orbitAngle) + dz * Math.cos(orbitAngle);

        dummy.position.set(rotX, floatY, rotZ);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        dropletsRef.current!.setMatrixAt(i, dummy.matrix);
      });
      dropletsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Primary Organic Chrome Sculpture */}
      <mesh ref={meshRef} geometry={geometry} material={chromeMaterial} castShadow receiveShadow />

      {/* Floating Orbiting Chrome Droplets */}
      <instancedMesh
        ref={dropletsRef}
        args={[undefined, undefined, dropletPositions.length]}
        material={chromeMaterial}
      >
        <sphereGeometry args={[1, 16, 16]} />
      </instancedMesh>
    </group>
  );
}
