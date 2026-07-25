"use client";

import { Canvas } from "@react-three/fiber";
import { ColumnRig, type RigStateRef } from "./column-rig";

/**
 * Isolated so `dynamic()` can code-split three.js out of the main bundle — it
 * is only fetched once the anatomy section is actually near the viewport.
 */
export default function AnatomyCanvas({ stateRef }: { stateRef: RigStateRef }) {
  return (
    // `flat` disables ACES tone mapping. The rig is a diagram, not a lit
    // photograph — tone mapping crushed the concrete into the background.
    <Canvas
      flat
      dpr={[1, 1.75]}
      camera={{ position: [-0.3, 0.5, 8 ], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ColumnRig stateRef={stateRef} />
    </Canvas>
  );
}
