"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { SpaceEnvironment } from "./Environment";
import { FloatingProduct } from "./FloatingProduct";
import { Preload } from "@react-three/drei";

export function Scene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <SpaceEnvironment />
          <FloatingProduct />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
