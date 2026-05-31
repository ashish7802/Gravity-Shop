"use client";

import { Stars, Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function SpaceEnvironment() {
  const starsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y -= delta * 0.02;
      starsRef.current.rotation.x -= delta * 0.01;
    }
  });

  return (
    <>
      <color attach="background" args={["#030014"]} />
      <fog attach="fog" args={["#030014", 5, 20]} />
      
      {/* Cinematic Lighting */}
      <ambientLight intensity={0.2} color="#ffffff" />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#00f0ff" />
      <spotLight position={[-10, -10, -5]} intensity={2} color="#ff003c" />
      <pointLight position={[0, 0, 5]} intensity={0.5} color="#9d00ff" />

      {/* Deep Space Background */}
      <Stars
        ref={starsRef}
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={1}
        fade
        speed={1}
      />
      
      {/* Floating Magic Dust */}
      <Sparkles
        count={200}
        scale={12}
        size={2}
        speed={0.4}
        opacity={0.3}
        color="#00f0ff"
      />
    </>
  );
}
