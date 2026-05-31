"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Icosahedron } from "@react-three/drei";
import * as THREE from "three";
import { useAppStore } from "@/store/useAppStore";

export function FloatingProduct() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mousePosition } = useAppStore();
  const { viewport } = useThree();

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smoothly interpolate towards mouse position for magnetic effect
    const targetX = (mousePosition.x * viewport.width) / 4;
    const targetY = (-mousePosition.y * viewport.height) / 4;

    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 2 * delta;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 2 * delta;

    // Additional rotation based on time
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;
  });

  return (
    <Float
      speed={2} // Animation speed
      rotationIntensity={1} // XYZ rotation intensity
      floatIntensity={2} // Up/down float intensity
      floatingRange={[-0.5, 0.5]} // Range of y-axis values the object will float within
    >
      <Icosahedron ref={meshRef} args={[1, 4]} position={[2, 0, 0]}>
        <MeshDistortMaterial
          color="#030014"
          emissive="#9d00ff"
          emissiveIntensity={0.2}
          roughness={0.1}
          metalness={0.8}
          distort={0.4}
          speed={2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Icosahedron>
      
      {/* Secondary accent object */}
      <Icosahedron args={[0.3, 1]} position={[3.5, 1.5, -1]}>
        <meshPhysicalMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={1.5}
          roughness={0.2}
          metalness={1}
          wireframe
        />
      </Icosahedron>
    </Float>
  );
}
