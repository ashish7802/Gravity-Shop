"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { Float, Environment, ContactShadows, PresentationControls } from "@react-three/drei";
import * as THREE from "three";

function CustomModel() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Idle floating animation (slow inertial rotation)
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
        {/* Abstract representation of a Headset since we don't have a GLB file */}
        <mesh position={[0, 0.5, 0]}>
          <torusGeometry args={[1.2, 0.3, 32, 100, Math.PI]} />
          <meshPhysicalMaterial 
            color="#0a0a1f" 
            metalness={0.9} 
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={2}
          />
        </mesh>
        
        {/* Earpieces */}
        <mesh position={[-1.3, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
          <meshPhysicalMaterial color="#030014" metalness={1} roughness={0.2} />
        </mesh>
        <mesh position={[-1.4, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
          <meshStandardMaterial color="#9d00ff" emissive="#9d00ff" emissiveIntensity={2} />
        </mesh>

        <mesh position={[1.3, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
          <meshPhysicalMaterial color="#030014" metalness={1} roughness={0.2} />
        </mesh>
        <mesh position={[1.4, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} />
        </mesh>
      </Float>
    </group>
  );
}

export function ProductPreviewScene() {
  return (
    <div className="w-full h-[60vh] md:h-[80vh] relative cursor-grab active:cursor-grabbing">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#00f0ff" castShadow />
        <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={2} color="#9d00ff" />
        
        <Suspense fallback={null}>
          <PresentationControls
            global
            snap={true}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 2]}
          >
            <CustomModel />
          </PresentationControls>
          
          <ContactShadows position={[0, -1.5, 0]} opacity={0.7} scale={10} blur={2.5} far={4} color="#9d00ff" />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
