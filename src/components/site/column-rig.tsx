"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges, Grid, Line } from "@react-three/drei";
import * as THREE from "three";

/**
 * Live state handed down from the DOM scroll loop. It is a mutable ref rather
 * than props so scrolling never re-renders the React tree — `useFrame` just
 * reads the latest numbers each frame.
 */
export type RigState = {
  progress: number;
  yaw: number;
  pitch: number;
};

/** Passed down as the ref object itself so nothing dereferences it at render. */
export type RigStateRef = RefObject<RigState>;

const W = 1;
const D = 1;
const H = 3.2;
const HALF = H / 2;

const CONCRETE = "#9AA3B2";
const REBAR = "#5B96F5";
const STEEL = "#2E3E58";
const CARBON = "#111A2B";

const CORNERS: [number, number][] = [
  [-W / 2 + 0.11, -D / 2 + 0.11],
  [W / 2 - 0.11, -D / 2 + 0.11],
  [W / 2 - 0.11, D / 2 - 0.11],
  [-W / 2 + 0.11, D / 2 - 0.11],
];

const TIE_COUNT = 9;
const STRAP_COUNT = 5;
const WRAP_COUNT = 10;

const { lerp, clamp } = THREE.MathUtils;

/** Progress of `v` through [a, b], clamped. */
function span(v: number, a: number, b: number) {
  return clamp((v - a) / (b - a), 0, 1);
}

function setOpacity(object: THREE.Object3D | null, opacity: number) {
  if (!object) return;
  object.visible = opacity > 0.004;
  if (!object.visible) return;
  object.traverse((child) => {
    const material = (child as THREE.Mesh).material as THREE.Material | undefined;
    if (material && "opacity" in material) {
      (material as THREE.Material & { opacity: number }).opacity = opacity;
    }
  });
}

/** Concrete shell — solid at first, then dissolving to reveal what's inside. */
function Concrete({ stateRef }: { stateRef: RigStateRef }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    // Solid through stage 1, then fades to a ghost so the cage reads through it.
    // Blending stays off until it is actually needed — an always-transparent
    // material let the column's own back faces show through and read as glass.
    const material = mesh.material as THREE.MeshStandardMaterial;
    const opacity = lerp(1, 0.16, span(stateRef.current.progress, 0.22, 0.46));
    material.opacity = opacity;
    material.transparent = opacity < 0.99;
    material.depthWrite = opacity > 0.6;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[W, H, D]} />
      <meshStandardMaterial color={CONCRETE} roughness={0.95} metalness={0} opacity={1} />
      <Edges color="#9DB4DA" scale={1.001} />
    </mesh>
  );
}

/** Longitudinal bars + tie loops, revealed by the scan. */
function RebarCage({ stateRef }: { stateRef: RigStateRef }) {
  const groupRef = useRef<THREE.Group>(null);

  const ties = useMemo(
    () =>
      Array.from({ length: TIE_COUNT }, (_, i) => {
        const y = -HALF + 0.24 + (i * (H - 0.48)) / (TIE_COUNT - 1);
        return [...CORNERS, CORNERS[0]].map(
          ([x, z]) => [x, y, z] as [number, number, number],
        );
      }),
    [],
  );

  useFrame(() => setOpacity(groupRef.current, span(stateRef.current.progress, 0.24, 0.42)));

  return (
    <group ref={groupRef} visible={false}>
      {CORNERS.map(([x, z], i) => (
        <mesh key={i} position={[x, 0, z]}>
          <cylinderGeometry args={[0.038, 0.038, H - 0.26, 10]} />
          <meshStandardMaterial
            color={REBAR}
            emissive={REBAR}
            emissiveIntensity={0.6}
            roughness={0.4}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
      {ties.map((points, i) => (
        <Line key={i} points={points} color={REBAR} lineWidth={1.6} transparent opacity={0} />
      ))}
    </group>
  );
}

/** The analysis sweep: a plane that travels the column's height once. */
function ScanPlane({ stateRef }: { stateRef: RigStateRef }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    const t = span(stateRef.current.progress, 0.18, 0.46);
    group.visible = t > 0.01 && t < 0.99;
    group.position.y = lerp(-HALF, HALF, t);
    // Brightest mid-sweep, so it reads as a pass rather than a hard cut.
    setOpacity(group, Math.sin(t * Math.PI) * 0.85);
  });

  return (
    <group ref={groupRef} visible={false}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W + 0.7, D + 0.7]} />
        <meshBasicMaterial
          color={REBAR}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <cylinderGeometry args={[0.78, 0.78, 0.03, 4, 1, true]} />
        <meshBasicMaterial
          color="#EAF1FD"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/** Steel jacket: face plates plus horizontal straps. */
function SteelJacket({ stateRef }: { stateRef: RigStateRef }) {
  const groupRef = useRef<THREE.Group>(null);

  const plates = useMemo<
    { position: [number, number, number]; rotation: [number, number, number] }[]
  >(
    () => [
      { position: [0, 0, D / 2 + 0.035], rotation: [0, 0, 0] },
      { position: [0, 0, -D / 2 - 0.035], rotation: [0, Math.PI, 0] },
      { position: [W / 2 + 0.035, 0, 0], rotation: [0, Math.PI / 2, 0] },
      { position: [-W / 2 - 0.035, 0, 0], rotation: [0, -Math.PI / 2, 0] },
    ],
    [],
  );

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    const t = span(stateRef.current.progress, 0.48, 0.66);
    setOpacity(group, t * 0.92);
    group.scale.setScalar(lerp(1.12, 1, t));
  });

  return (
    <group ref={groupRef} visible={false}>
      {plates.map((plate, i) => (
        <mesh key={i} position={plate.position} rotation={plate.rotation}>
          <boxGeometry args={[W - 0.16, H - 0.5, 0.05]} />
          <meshStandardMaterial
            color={STEEL}
            roughness={0.35}
            metalness={0.8}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
      {Array.from({ length: STRAP_COUNT }).map((_, i) => {
        const y = -HALF + 0.35 + (i * (H - 0.7)) / (STRAP_COUNT - 1);
        return (
          <mesh key={`strap-${i}`} position={[0, y, 0]} rotation={[0, Math.PI / 4, 0]}>
            <cylinderGeometry args={[0.79, 0.79, 0.1, 4, 1, true]} />
            <meshStandardMaterial
              color="#455A7E"
              roughness={0.3}
              metalness={0.9}
              side={THREE.DoubleSide}
              transparent
              opacity={0}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/** CFRP wrap — rings arriving bottom-to-top, one per scroll beat. */
function CarbonWrap({ stateRef }: { stateRef: RigStateRef }) {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(() => {
    const start = 0.66;
    const step = 0.3 / WRAP_COUNT;
    for (let i = 0; i < WRAP_COUNT; i++) {
      const mesh = meshRefs.current[i];
      if (!mesh) continue;
      const t = span(stateRef.current.progress, start + i * step, start + i * step + step * 1.6);
      mesh.visible = t > 0.004;
      if (!mesh.visible) continue;
      const material = mesh.material as THREE.MeshStandardMaterial;
      material.opacity = t * 0.96;
      material.emissiveIntensity = (1 - t) * 1.6;
      const s = lerp(1.35, 1, t);
      mesh.scale.set(s, 1, s);
      mesh.rotation.y = Math.PI / 4 + (1 - t) * 0.6;
    }
  });

  return (
    <group>
      {Array.from({ length: WRAP_COUNT }).map((_, i) => {
        const y = -HALF + 0.26 + (i * (H - 0.52)) / (WRAP_COUNT - 1);
        return (
          <mesh
            key={i}
            ref={(el) => {
              meshRefs.current[i] = el;
            }}
            position={[0, y, 0]}
            rotation={[0, Math.PI / 4, 0]}
            visible={false}
          >
            <cylinderGeometry args={[0.86, 0.86, 0.19, 4, 1, true]} />
            <meshStandardMaterial
              color={CARBON}
              emissive={REBAR}
              emissiveIntensity={0}
              roughness={0.45}
              metalness={0.25}
              side={THREE.DoubleSide}
              transparent
              opacity={0}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export function ColumnRig({ stateRef }: { stateRef: RigStateRef }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ camera, clock }, delta) => {
    const { progress, yaw, pitch } = stateRef.current;

    if (groupRef.current) {
      // A slow idle turn plus the scroll sweep, offset by whatever the visitor
      // has dragged. Damped so a flick eases out instead of snapping.
      const target = clock.elapsedTime * 0.06 + progress * Math.PI * 1.15 - 0.5 + yaw;
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        target,
        6,
        delta,
      );
    }

    // Push in for the analysis beat, pull back out for the finished wrap. Kept
    // far enough back that the full 3.2m column and a little of the grid stay
    // inside frame at the shortest viewport we render at.
    const dolly = lerp(7.4, 6.2, Math.sin(clamp(progress, 0, 1) * Math.PI));
    camera.position.x = THREE.MathUtils.damp(camera.position.x, lerp(-0.3, 0.8, progress), 4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.5 + pitch * 2.2, 4, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, dolly, 4, delta);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 4]} intensity={1.2} color="#EAF1FD" />
      <directionalLight position={[-5, 2, -3]} intensity={0.5} color={REBAR} />
      <pointLight position={[0, -2, 3]} intensity={5} distance={9} color="#1D5FD6" />

      <Grid
        position={[0, -HALF - 0.02, 0]}
        args={[12, 12]}
        cellSize={0.4}
        cellThickness={0.6}
        cellColor="#22314F"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#3A5A8C"
        fadeDistance={11}
        fadeStrength={1.3}
        infiniteGrid
      />

      <group ref={groupRef}>
        <Concrete stateRef={stateRef} />
        <RebarCage stateRef={stateRef} />
        <SteelJacket stateRef={stateRef} />
        <CarbonWrap stateRef={stateRef} />
        <ScanPlane stateRef={stateRef} />
      </group>
    </>
  );
}

export default ColumnRig;
