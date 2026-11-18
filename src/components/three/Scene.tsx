'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import HeroObject from './HeroObject';
import CameraController from './CameraController';

interface SceneProps {
  className?: string;
  scrollProgress?: number;
}

export default function Scene({ className = '', scrollProgress = 0 }: SceneProps) {
  const pointer = useRef({ x: 0, y: 0 });
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    // Detect WebGL capability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }

    const handlePointerMove = (e: PointerEvent) => {
      // Normalized coordinates (-1 to 1)
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  if (!hasWebGL) {
    // Elegant fallback poster if WebGL is unsupported
    return (
      <div className={`relative overflow-hidden flex items-center justify-center ${className}`}>
        <div
          className="w-full h-full bg-cover bg-center opacity-60 filter contrast-125"
          style={{ backgroundImage: "url('/assets/textures/media_1794989685800_e2f4d3ca.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]" />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <CameraController pointer={pointer} />

        {/* Studio Lighting Environment */}
        <ambientLight intensity={0.4} />

        {/* Directional Key Light with sharp highlights */}
        <directionalLight position={[5, 8, 4]} intensity={2.2} color="#ffffff" castShadow />

        {/* Rim Light for dramatic edge illumination */}
        <directionalLight position={[-6, -3, -4]} intensity={1.8} color="#e0e0ff" />

        {/* Subtle Warm Fill */}
        <pointLight position={[0, -4, 2]} intensity={0.6} color="#d4cbb8" />

        {/* Drei Studio Environment Map for metallic reflections */}
        <Suspense fallback={null}>
          <Environment preset="studio" />
        </Suspense>

        {/* Atmospheric Floating Sparkles / Dust Field */}
        <Sparkles count={40} scale={8} size={1.8} speed={0.3} opacity={0.35} color="#F0F0ED" />

        {/* Liquid Chrome Hero Sculpture */}
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <HeroObject pointer={pointer} scrollProgress={scrollProgress} />
        </Float>
      </Canvas>
    </div>
  );
}
