"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { Environment, ContactShadows, PresentationControls } from "@react-three/drei";
import * as THREE from "three";

function CustomModel() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Extremely slow technical rotation, no bobbing/floating
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Abstract representation of a Headset since we don't have a GLB file */}
      <mesh position={[0, 0.2, 0]}>
        <torusGeometry args={[1.2, 0.3, 32, 100, Math.PI]} />
        <meshPhysicalMaterial 
          color="#15151c" 
          metalness={0.9} 
          roughness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.5}
        />
      </mesh>
      
      {/* Earpieces */}
      <mesh position={[-1.3, -0.3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
        <meshPhysicalMaterial color="#0e0e12" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[-1.4, -0.3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
        <meshStandardMaterial color="#bbf3ff" emissive="#bbf3ff" emissiveIntensity={0.8} />
      </mesh>

      <mesh position={[1.3, -0.3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
        <meshPhysicalMaterial color="#0e0e12" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[1.4, -0.3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export function ProductPreviewScene() {
  return (
    <div className="w-full h-[60vh] md:h-[70vh] relative flex items-center justify-center bg-[#0e0e12]/40 rounded-sm border border-white/5 overflow-hidden">
      <ErrorBoundary fallback={
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/headset.png" alt="Product Preview" className="max-h-[60%] object-contain opacity-80" />
          <p className="text-gray-500 font-mono text-[9px] mt-4 uppercase tracking-widest">3D VIEW OFFLINE // PROCEDURAL MESH ACTIVE</p>
        </div>
      }>
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.4} />
          {/* High contrast technical lighting instead of saturated neon spotlights */}
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} color="#ffffff" castShadow />
          <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={1.5} color="#bbf3ff" />
          
          <Suspense fallback={null}>
            <PresentationControls
              global
              snap={true}
              rotation={[0.1, 0.2, 0]}
              polar={[-Math.PI / 4, Math.PI / 4]}
              azimuth={[-Math.PI / 2, Math.PI / 2]}
            >
              <CustomModel />
            </PresentationControls>
            
            <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={8} blur={3} far={4} color="#08080a" />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
