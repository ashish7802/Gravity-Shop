"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PresentationControls, ContactShadows, Float, useGLTF } from "@react-three/drei";

function ModelRenderer({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={2} position={[0, -1, 0]} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductCanvas({ product }: { product: any }) {
  useEffect(() => {
    if (product.modelPath) {
      useGLTF.preload(product.modelPath);
    }
  }, [product.modelPath]);

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={2} color="#00f0ff" />
      <spotLight position={[-5, -5, -5]} angle={0.15} penumbra={1} intensity={2} color="#ff00aa" />
      
      <PresentationControls
        global
        snap={true}
        rotation={[0, 0.3, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
      >
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          {product.modelPath ? (
            <Suspense fallback={
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial wireframe color="#00f0ff" />
              </mesh>
            }>
              <ModelRenderer url={product.modelPath} />
            </Suspense>
          ) : (
            <mesh>
              {product.category === "Sneakers" && <boxGeometry args={[1, 1, 1]} />}
              {product.category === "Watches" && <torusGeometry args={[0.7, 0.2, 16, 100]} />}
              {product.category === "Gaming" && <octahedronGeometry args={[1]} />}
              {product.category === "Electronics" && <sphereGeometry args={[1, 32, 32]} />}
              {product.category === "Fashion" && <cylinderGeometry args={[0.5, 0.5, 2, 32]} />}
              {product.category === "Accessories" && <coneGeometry args={[1, 2, 32]} />}
              <meshPhysicalMaterial 
                color="#ffffff" 
                metalness={1} 
                roughness={0.1} 
                clearcoat={1} 
                emissive="#00f0ff"
                emissiveIntensity={0.2}
              />
            </mesh>
          )}
        </Float>
      </PresentationControls>
      
      <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
      <Environment preset="city" />
    </Canvas>
  );
}
