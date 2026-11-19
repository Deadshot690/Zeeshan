'use client';

import React, { useRef, useMemo, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import { ProjectMediaItem } from '@/types';
import { RotateCw, ZoomIn, Film, Sparkles, Play, Maximize2 } from 'lucide-react';

// Default curated local video editing & portfolio textures
const DEFAULT_TEXTURES = [
  '/assets/videos/video-editing/travel-hook-thumb.webp',
  '/assets/videos/video-editing/hiking-hook-thumb.webp',
  '/assets/videos/video-editing/ski-hook-thumb.webp',
  '/assets/videos/video-editing/keya-chicken-tortilla-thumb.webp',
  '/assets/videos/video-editing/reel-39-thumb.webp',
  '/assets/videos/video-editing/reel-63-thumb.webp',
  '/assets/videos/video-editing/reel-5-03-thumb.webp',
  '/assets/projects/video-editing/thumbnail.webp',
  '/assets/videos/motion-graphics/airbnb-thumb.webp',
  '/assets/videos/motion-graphics/animation-2-thumb.webp',
  '/assets/videos/visual-effects/elley-duhe-velocity-thumb.webp',
  '/assets/videos/visual-effects/xxxtentacion-velocity-thumb.webp',
  '/assets/videos/color-grading/colorgrade-thumb.webp',
  '/assets/projects/motion-graphics/thumbnail.webp',
  '/assets/projects/color-grading/thumbnail.webp',
  '/assets/projects/visual-effects/thumbnail.webp',
  '/assets/behind-the-edit/thumb_1.webp',
  '/assets/behind-the-edit/thumb_2.webp',
  '/assets/behind-the-edit/thumb_3.webp',
  '/assets/behind-the-edit/thumb_4.webp',
  '/assets/behind-the-edit/thumb_5.webp',
  '/assets/behind-the-edit/final.webp',
  '/assets/behind-the-edit/raw.webp',
  '/assets/branding/portrait.jpg',
];

interface ParticleSphereProps {
  items?: ProjectMediaItem[];
  onSelectVideo?: (item: ProjectMediaItem, index: number) => void;
  radius?: number;
  particleCount?: number;
  autoRotateSpeed?: number;
}

export function ParticleSphere({
  items,
  onSelectVideo,
  radius = 8.5,
  particleCount = 1400,
  autoRotateSpeed = 0.0006,
}: ParticleSphereProps) {
  const PARTICLE_COUNT = particleCount;
  const PARTICLE_SIZE_MIN = 0.006;
  const PARTICLE_SIZE_MAX = 0.014;
  const SPHERE_RADIUS = radius;
  const POSITION_RANDOMNESS = 3.8;
  const ROTATION_SPEED_X = 0.0;
  const ROTATION_SPEED_Y = autoRotateSpeed;
  const PARTICLE_OPACITY = 0.9;

  // Determine textures to use: prefer items thumbnails, falling back to full curated palette
  const textureUrls = useMemo(() => {
    if (items && items.length > 0) {
      const urls: string[] = [];
      while (urls.length < 24) {
        items.forEach((it) => {
          if (it.thumbnailSrc) urls.push(it.thumbnailSrc);
        });
        if (urls.length === 0) break;
      }
      return urls.slice(0, 24);
    }
    return DEFAULT_TEXTURES;
  }, [items]);

  const IMAGE_COUNT = textureUrls.length;
  const IMAGE_WIDTH = 1.35;
  const IMAGE_HEIGHT = 2.4; // 9:16 vertical short-form reel aspect ratio

  const groupRef = useRef<THREE.Group>(null);
  const downPosRef = useRef<{ x: number; y: number } | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Load textures through Drei hook
  const loadedTextures = useTexture(textureUrls);

  // Ensure textures fit correctly
  useMemo(() => {
    const texArray = Array.isArray(loadedTextures) ? loadedTextures : [loadedTextures];
    texArray.forEach((texture) => {
      if (texture) {
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;
      }
    });
  }, [loadedTextures]);

  // Luxury monochrome stardust particle cloud (silver, platinum, titanium, subtle emerald embers)
  const particles = useMemo(() => {
    const list = [];
    const colorChoices = ['#F0F0ED', '#D4D4D0', '#A1A1A1', '#777777', '#FFFFFF', '#34D399'];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT);
      const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi;
      const radiusVariation = SPHERE_RADIUS + (Math.random() - 0.5) * POSITION_RANDOMNESS;

      const x = radiusVariation * Math.cos(theta) * Math.sin(phi);
      const y = radiusVariation * Math.cos(phi);
      const z = radiusVariation * Math.sin(theta) * Math.sin(phi);

      const chosenColor =
        Math.random() > 0.08
          ? new THREE.Color().setHSL(0, 0, 0.45 + Math.random() * 0.5) // Sleek silver / platinum
          : new THREE.Color('#34D399'); // Rare emerald pulse ember

      list.push({
        position: [x, y, z] as [number, number, number],
        scale: Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN) + PARTICLE_SIZE_MIN,
        color: chosenColor,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
      });
    }

    return list;
  }, [PARTICLE_COUNT, SPHERE_RADIUS, POSITION_RANDOMNESS, PARTICLE_SIZE_MIN, PARTICLE_SIZE_MAX]);

  // Orbiting video frames arranged spherically
  const orbitingImages = useMemo(() => {
    const images = [];

    for (let i = 0; i < IMAGE_COUNT; i++) {
      const angle = (i / IMAGE_COUNT) * Math.PI * 2;
      // Slight vertical wave offset to give dynamic volumetric orbit
      const yOffset = Math.sin(i * 1.5) * 1.2;
      const x = SPHERE_RADIUS * Math.cos(angle);
      const y = yOffset;
      const z = SPHERE_RADIUS * Math.sin(angle);

      const position = new THREE.Vector3(x, y, z);
      const center = new THREE.Vector3(0, 0, 0);
      const outwardDirection = position.clone().sub(center).normalize();

      const euler = new THREE.Euler();
      const matrix = new THREE.Matrix4();
      matrix.lookAt(position, position.clone().add(outwardDirection), new THREE.Vector3(0, 1, 0));
      euler.setFromRotationMatrix(matrix);
      euler.z += Math.PI;

      images.push({
        position: [x, y, z] as [number, number, number],
        rotation: [euler.x, euler.y, euler.z] as [number, number, number],
        textureIndex: i % textureUrls.length,
        itemIndex: items && items.length > 0 ? i % items.length : null,
      });
    }

    return images;
  }, [IMAGE_COUNT, SPHERE_RADIUS, textureUrls.length, items]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += ROTATION_SPEED_Y;
      groupRef.current.rotation.x += ROTATION_SPEED_X;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Luxury Silver Stardust Particles */}
      {particles.map((particle, index) => (
        <mesh key={index} position={particle.position} scale={particle.scale}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial color={particle.color} transparent opacity={PARTICLE_OPACITY} />
        </mesh>
      ))}

      {/* Orbiting Video Frames with Titanium Bevel Highlights */}
      {orbitingImages.map((image, index) => {
        const isHovered = hoveredIndex === index;
        const currentItem =
          image.itemIndex !== null && items && items[image.itemIndex]
            ? items[image.itemIndex]
            : null;

        const texturesList = Array.isArray(loadedTextures) ? loadedTextures : [loadedTextures];
        const texture = texturesList[image.textureIndex];

        return (
          <group
            key={`image-${index}`}
            position={image.position}
            rotation={image.rotation}
            scale={isHovered ? 1.15 : 1}
          >
            {/* Main Video Frame Mesh */}
            <mesh
              onPointerDown={(e: ThreeEvent<PointerEvent>) => {
                downPosRef.current = { x: e.clientX, y: e.clientY };
              }}
              onPointerUp={(e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                if (downPosRef.current) {
                  const dist = Math.hypot(
                    e.clientX - downPosRef.current.x,
                    e.clientY - downPosRef.current.y
                  );
                  if (dist < 12) {
                    if (currentItem && onSelectVideo) {
                      onSelectVideo(currentItem, image.itemIndex || 0);
                    }
                  }
                }
              }}
              onClick={(e: ThreeEvent<MouseEvent>) => {
                e.stopPropagation();
                if (currentItem && onSelectVideo) {
                  onSelectVideo(currentItem, image.itemIndex || 0);
                }
              }}
              onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                setHoveredIndex(index);
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                setHoveredIndex(null);
                document.body.style.cursor = 'auto';
              }}
            >
              <planeGeometry args={[IMAGE_WIDTH, IMAGE_HEIGHT]} />
              <meshBasicMaterial
                map={texture}
                opacity={isHovered ? 1 : 0.88}
                transparent
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Subtle Metallic Titanium Framing Border */}
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(IMAGE_WIDTH, IMAGE_HEIGHT)]} />
              <lineBasicMaterial
                color={isHovered ? '#34D399' : '#ffffff'}
                opacity={isHovered ? 0.9 : 0.25}
                transparent
                linewidth={isHovered ? 2 : 1}
              />
            </lineSegments>

            {/* Floating Title Tooltip on Hover */}
            {isHovered && currentItem && (
              <Html distanceFactor={14} position={[0, -IMAGE_HEIGHT / 2 - 0.25, 0]} center>
                <div className="pointer-events-none px-3 py-1.5 rounded bg-[#080808]/90 border border-white/20 backdrop-blur-md text-center whitespace-nowrap shadow-2xl animate-fade-in select-none">
                  <div className="font-mono-tech text-[9px] text-emerald-400 uppercase tracking-widest">
                    {currentItem.tag || 'VIDEO EDIT'} • {currentItem.duration}
                  </div>
                  <div className="font-sans-body font-bold text-xs text-[#F0F0ED] tracking-wide">
                    {currentItem.title}
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

// Minimal Loading Fallback inside Canvas
function CanvasLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 text-center pointer-events-none select-none">
        <div className="w-8 h-8 rounded-full border border-white/20 border-t-white animate-spin" />
        <span className="font-mono-tech text-[10px] uppercase tracking-[0.25em] text-[#A1A1A1]">
          GENERATING 3D SPATIAL ORBIT...
        </span>
      </div>
    </Html>
  );
}

interface OrbitGalleryProps {
  items?: ProjectMediaItem[];
  onSelectVideo?: (item: ProjectMediaItem, index: number) => void;
  className?: string;
  categoryTitle?: string;
}

export function OrbitGallery({
  items,
  onSelectVideo,
  className = '',
  categoryTitle = 'VIDEO EDITING',
}: OrbitGalleryProps) {
  const [mounted, setMounted] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-full h-[520px] sm:h-[620px] bg-[#070707] rounded-xl border border-white/10 flex items-center justify-center ${className}`}>
        <div className="flex items-center gap-3 font-mono-tech text-xs text-[#777777] uppercase tracking-[0.2em]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>INITIALIZING 3D ORBIT ENGINE...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-[520px] sm:h-[620px] md:h-[680px] bg-[#070707] rounded-xl border border-white/[0.08] overflow-hidden select-none group shadow-2xl ${className}`}
    >
      {/* Top Left Telemetry HUD */}
      <div className="absolute top-5 left-5 z-10 flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-2 font-mono-tech text-[10px] text-[#A1A1A1] uppercase tracking-[0.25em]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>3D SPATIAL GALAXY // {categoryTitle.toUpperCase()}</span>
        </div>
        <div className="font-mono-tech text-[9px] text-[#777777] tracking-wider uppercase">
          INTERACTIVE 3D ORBITAL VIEW • 360° REEL ARCHIVE
        </div>
      </div>

      {/* Top Right Controls & Interaction Guide */}
      <div className="absolute top-5 right-5 z-10 flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 font-mono-tech text-[9px] text-[#777777] uppercase tracking-wider px-3 py-1.5 rounded bg-black/60 border border-white/10 backdrop-blur-sm pointer-events-none">
          <ZoomIn className="w-3 h-3 text-[#A1A1A1]" />
          <span>DRAG TO ROTATE • SCROLL TO ZOOM</span>
        </div>

        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          className="flex items-center gap-2 px-3 py-1.5 rounded border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30 text-[#F0F0ED] font-mono-tech text-[10px] tracking-wider uppercase transition-all backdrop-blur-sm cursor-pointer"
        >
          <RotateCw className={`w-3 h-3 ${autoRotate ? 'text-emerald-400 animate-spin-slow' : 'text-[#777777]'}`} />
          <span>{autoRotate ? 'AUTO-SPIN ON' : 'AUTO-SPIN OFF'}</span>
        </button>
      </div>

      {/* Viewfinder Corner Reticles */}
      <div className="corner-bracket corner-tl !top-3 !left-3 !w-3 !h-3 !border-white/20" />
      <div className="corner-bracket corner-tr !top-3 !right-3 !w-3 !h-3 !border-white/20" />
      <div className="corner-bracket corner-bl !bottom-3 !left-3 !w-3 !h-3 !border-white/20" />
      <div className="corner-bracket corner-br !bottom-3 !right-3 !w-3 !h-3 !border-white/20" />

      {/* Three.js Canvas */}
      <Canvas
        camera={{ position: [0, 1.2, 14], fov: 46 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -5, -10]} intensity={0.8} color="#e0e0ff" />
        <pointLight position={[0, 0, 0]} intensity={1.2} color="#ffffff" />

        <Suspense fallback={<CanvasLoader />}>
          <ParticleSphere
            items={items}
            onSelectVideo={onSelectVideo}
            autoRotateSpeed={autoRotate ? 0.0007 : 0.0}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={6}
          maxDistance={22}
          rotateSpeed={0.65}
          zoomSpeed={0.8}
          dampingFactor={0.06}
          enableDamping={true}
        />
      </Canvas>

      {/* Bottom Telemetry Bar */}
      <div className="absolute bottom-4 inset-x-6 z-10 flex flex-col sm:flex-row items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 font-mono-tech text-[9px] text-[#777777] uppercase tracking-wider">
          <Film className="w-3 h-3 text-[#A1A1A1]" />
          <span>CLICK ANY 3D CARD TO LAUNCH SCREENING PLAYER</span>
        </div>
        <div className="font-mono-tech text-[9px] text-[#A1A1A1] uppercase tracking-wider">
          COORDINATES: [0, 0, 0] • THREE.JS WEBGL MASTER
        </div>
      </div>
    </div>
  );
}

// Exact drop-in DemoOne compatibility as specified in the prompt
export default function DemoOne() {
  return (
    <div className="w-full h-screen bg-black relative">
      <Canvas camera={{ position: [-10, 1.5, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={<CanvasLoader />}>
          <ParticleSphere />
        </Suspense>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
}
