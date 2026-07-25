"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges, Grid, Line } from "@react-three/drei";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";

const COLUMN_W = 1;
const COLUMN_D = 1;
const COLUMN_H = 3.1;
const HALF_H = COLUMN_H / 2;

const WRAP_RING_COUNT = 9;
const WRAP_START = 0.56;
const WRAP_SPAN = 0.4 / WRAP_RING_COUNT;

const CORNER_OFFSETS: [number, number][] = [
  [-COLUMN_W / 2 + 0.08, -COLUMN_D / 2 + 0.08],
  [COLUMN_W / 2 - 0.08, -COLUMN_D / 2 + 0.08],
  [COLUMN_W / 2 - 0.08, COLUMN_D / 2 - 0.08],
  [-COLUMN_W / 2 + 0.08, COLUMN_D / 2 - 0.08],
];

function Rebar() {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();

  const tiePositions = useMemo(() => {
    const rows = 8;
    return Array.from({ length: rows }, (_, i) => -HALF_H + 0.22 + (i * (COLUMN_H - 0.44)) / (rows - 1));
  }, []);

  const tieLoops = useMemo(
    () =>
      tiePositions.map((y) => [
        [CORNER_OFFSETS[0][0], y, CORNER_OFFSETS[0][1]],
        [CORNER_OFFSETS[1][0], y, CORNER_OFFSETS[1][1]],
        [CORNER_OFFSETS[2][0], y, CORNER_OFFSETS[2][1]],
        [CORNER_OFFSETS[3][0], y, CORNER_OFFSETS[3][1]],
        [CORNER_OFFSETS[0][0], y, CORNER_OFFSETS[0][1]],
      ] as [number, number, number][]),
    [tiePositions],
  );

  useFrame(() => {
    const reveal = scroll.range(0.14, 0.26);
    if (groupRef.current) {
      groupRef.current.visible = reveal > 0.01;
      groupRef.current.traverse((child) => {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.Material & { opacity?: number };
        if (mat && "opacity" in mat) mat.opacity = reveal * 0.85;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {CORNER_OFFSETS.map(([x, z], i) => (
        <mesh key={i} position={[x, 0, z]}>
          <cylinderGeometry args={[0.026, 0.026, COLUMN_H - 0.3, 8]} />
          <meshBasicMaterial color="#5B96F5" transparent opacity={0} />
        </mesh>
      ))}
      {tieLoops.map((points, i) => (
        <Line key={i} points={points} color="#5B96F5" lineWidth={1} transparent opacity={0} />
      ))}
    </group>
  );
}

function WrapRings() {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const scroll = useScroll();

  useFrame(() => {
    for (let i = 0; i < WRAP_RING_COUNT; i++) {
      const mesh = refs.current[i];
      if (!mesh) continue;
      const reveal = scroll.range(WRAP_START + i * WRAP_SPAN, WRAP_SPAN);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = reveal * 0.9;
      const s = 0.82 + reveal * 0.18;
      mesh.scale.set(s, 1, s);
    }
  });

  return (
    <group>
      {Array.from({ length: WRAP_RING_COUNT }).map((_, i) => {
        const y = -HALF_H + 0.25 + (i * (COLUMN_H - 0.5)) / (WRAP_RING_COUNT - 1);
        return (
          <mesh
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            position={[0, y, 0]}
            rotation={[0, Math.PI / 4, 0]}
          >
            <cylinderGeometry args={[0.64, 0.64, 0.09, 4, 1, true]} />
            <meshBasicMaterial color="#1D5FD6" transparent opacity={0} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
}

function ScanPlane() {
  const ref = useRef<THREE.Mesh>(null);
  const scroll = useScroll();

  useFrame(() => {
    const t = scroll.range(0.1, 0.32);
    if (!ref.current) return;
    ref.current.visible = t > 0.005 && t < 0.995;
    ref.current.position.y = THREE.MathUtils.lerp(-HALF_H, HALF_H, t);
    (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.28;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
      <planeGeometry args={[COLUMN_W + 0.5, COLUMN_D + 0.5]} />
      <meshBasicMaterial color="#5B96F5" transparent opacity={0} side={THREE.DoubleSide} />
    </mesh>
  );
}

function ColumnRig() {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useFrame((state, delta) => {
    const offset = scroll.offset;
    const camera = state.camera;

    if (groupRef.current) {
      const idle = reducedMotion ? 0 : state.clock.elapsedTime * 0.045;
      groupRef.current.rotation.y = idle + offset * Math.PI * 0.85 - 0.3;
    }

    const targetZ = THREE.MathUtils.lerp(6.4, 4.6, offset);
    const targetY = THREE.MathUtils.lerp(0.35, 1.0, Math.sin(offset * Math.PI));
    const targetX = THREE.MathUtils.lerp(0, 0.6, offset);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 4, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 4, delta);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 5]} intensity={0.6} color="#EAF1FD" />

      <Grid
        position={[0, -HALF_H - 0.02, 0]}
        args={[10, 10]}
        cellSize={0.4}
        cellThickness={0.6}
        cellColor="#233252"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#3A5A8C"
        fadeDistance={9}
        fadeStrength={1.4}
        infiniteGrid
      />

      <group ref={groupRef}>
        <mesh>
          <boxGeometry args={[COLUMN_W, COLUMN_H, COLUMN_D]} />
          <meshBasicMaterial color="#5B96F5" transparent opacity={0.035} />
          <Edges color="#EAF1FD" />
        </mesh>
        <Rebar />
        <WrapRings />
        <ScanPlane />
      </group>
    </>
  );
}

export default ColumnRig;
