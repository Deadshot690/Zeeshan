'use client';

import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}

export default function CameraController({ pointer }: CameraControllerProps) {
  const { camera, size } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 5.5));

  useEffect(() => {
    const isMobile = size.width < 768;
    const isTablet = size.width >= 768 && size.width < 1024;
    const distance = isMobile ? 8.2 : isTablet ? 6.2 : 5.4;
    targetPos.current.set(0, 0, distance);
  }, [size]);

  useFrame((_, delta) => {
    // Parallax sway
    const camX = pointer.current.x * 0.45;
    const camY = pointer.current.y * 0.3;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, camX, 2.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, camY, 2.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPos.current.z, 2.5, delta);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
