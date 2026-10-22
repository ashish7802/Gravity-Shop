"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PresentationControls, ContactShadows, useGLTF } from "@react-three/drei";

function ModelRenderer({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={2} position={[0, -1, 0]} />;
}

function CategoryGeometry({ category }: { category: string }) {
  switch (category) {
    case "Audio":
      return <torusGeometry args={[0.85, 0.28, 24, 100]} />;
    case "Displays":
      return <boxGeometry args={[1.8, 1.1, 0.1]} />;
    case "Accessories":
      return <dodecahedronGeometry args={[0.9, 0]} />;
    case "Peripherals":
      return <boxGeometry args={[1.5, 0.25, 0.8]} />;
    case "Eyewear":
      return <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />;
    case "Hardware":
      return <octahedronGeometry args={[1.1]} />;
    case "Electronics":
      return <sphereGeometry args={[0.9, 32, 32]} />;
    case "Sneakers":
      return <boxGeometry args={[1.2, 0.7, 1.6]} />;
    case "Wearables":
      return <torusGeometry args={[0.75, 0.2, 16, 100]} />;
    default:
      return <icosahedronGeometry args={[0.9, 0]} />;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductCanvas({ product }: { product: any }) {
  useEffect(() => {
    if (product?.modelPath) {
      useGLTF.preload(product.modelPath);
    }
  }, [product?.modelPath]);

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.4} />
      {/* Sleek white and ice-blue technical lighting spotlights */}
      <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1.5} color="#ffffff" />
      <spotLight position={[-5, -5, -5]} angle={0.15} penumbra={1} intensity={1.5} color="#bbf3ff" />
      
      <PresentationControls
        global
        snap={true}
        rotation={[0, 0.3, 0]}
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Math.PI / 2, Math.PI / 2]}
      >
        {product?.modelPath ? (
          <Suspense fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial wireframe color="#bbf3ff" />
            </mesh>
          }>
            <ModelRenderer url={product.modelPath} />
          </Suspense>
        ) : (
          <mesh>
            <CategoryGeometry category={product?.category || "Hardware"} />
            <meshPhysicalMaterial 
              color="#15151c" 
              metalness={0.9} 
              roughness={0.15} 
              clearcoat={1} 
              emissive="#bbf3ff"
              emissiveIntensity={0.25}
            />
          </mesh>
        )}
      </PresentationControls>
      
      <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#08080a" />
      <Environment preset="city" />
    </Canvas>
  );
}
