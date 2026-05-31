"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Stars } from "@react-three/drei";
import { useAppStore, CartItem } from "@/store/useAppStore";
import { useRef } from "react";
import * as THREE from "three";

function AbstractItem({ item, index, total }: { item: CartItem, index: number, total: number }) {
  const meshRef = useRef<THREE.Group>(null);
  
  // Calculate vertical position to stack items
  const spacing = 1.5;
  const yOffset = (total * spacing) / 2 - (index * spacing) - (spacing / 2);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime + index) * 0.1;
    }
  });

  const getGeometryAndMaterial = () => {
    switch (item.category) {
      case "Sneakers":
        return (
          <mesh>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshPhysicalMaterial color="#00f0ff" metalness={0.8} roughness={0.2} clearcoat={1} transmission={0.9} thickness={0.5} />
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(0.8, 0.8, 0.8)]} />
              <lineBasicMaterial color="#00f0ff" />
            </lineSegments>
          </mesh>
        );
      case "Watches":
        return (
          <mesh>
            <torusGeometry args={[0.6, 0.15, 16, 100]} />
            <meshPhysicalMaterial color="#ffd700" metalness={1} roughness={0.1} emissive="#ffd700" emissiveIntensity={0.2} />
          </mesh>
        );
      case "Gaming":
        return (
          <mesh>
            <cylinderGeometry args={[0.6, 0.6, 0.8, 6]} />
            <meshPhysicalMaterial color="#9d00ff" metalness={0.5} roughness={0.2} clearcoat={1} />
            <lineSegments>
              <edgesGeometry args={[new THREE.CylinderGeometry(0.6, 0.6, 0.8, 6)]} />
              <lineBasicMaterial color="#9d00ff" />
            </lineSegments>
          </mesh>
        );
      case "Electronics":
        return (
          <mesh>
            <sphereGeometry args={[0.6, 32, 32]} />
            <meshPhysicalMaterial color="#00f0ff" metalness={0.9} roughness={0.1} transmission={1} ior={1.5} thickness={2} />
          </mesh>
        );
      case "Fashion":
        return (
          <mesh>
            <octahedronGeometry args={[0.7, 0]} />
            <meshPhysicalMaterial color="#ff00aa" metalness={0.2} roughness={0.1} transmission={1} clearcoat={1} thickness={1.5} />
          </mesh>
        );
      case "Accessories":
        return (
          <mesh>
            <tetrahedronGeometry args={[0.8]} />
            <meshPhysicalMaterial color="#00ff9d" metalness={0.8} roughness={0.2} emissive="#00ff9d" emissiveIntensity={0.5} />
            <lineSegments>
              <edgesGeometry args={[new THREE.TetrahedronGeometry(0.8)]} />
              <lineBasicMaterial color="#00ff9d" />
            </lineSegments>
          </mesh>
        );
      default:
        return (
          <mesh>
            <icosahedronGeometry args={[0.6]} />
            <meshPhysicalMaterial color="#ffffff" metalness={1} roughness={0.1} clearcoat={1} />
          </mesh>
        );
    }
  };

  return (
    <group ref={meshRef} position={[0, yOffset, 0]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {getGeometryAndMaterial()}
      </Float>
    </group>
  );
}

export function CartScene() {
  const { cartItems } = useAppStore();

  return (
    <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-60">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <fog attach="fog" args={["#030014", 3, 10]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[5, 5, 5]} angle={0.2} penumbra={1} intensity={2} color="#00f0ff" />
        <spotLight position={[-5, -5, -5]} angle={0.2} penumbra={1} intensity={2} color="#9d00ff" />
        
        <Stars radius={50} depth={10} count={1000} factor={2} saturation={1} fade speed={1} />

        <group position={[0, 0, -1]}>
          {cartItems.map((item, idx) => (
            <AbstractItem key={`${item.id}-${idx}`} item={item} index={idx} total={cartItems.length} />
          ))}
        </group>
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
