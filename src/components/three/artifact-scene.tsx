"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, PerformanceMonitor, RoundedBox } from "@react-three/drei";
import type { MotionValue } from "motion/react";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { createGlowTexture, createPaneTexture, PANE_COUNT } from "./textures";

export interface ArtifactSceneProps {
  /** 0 → 1 scroll progress through the About section. */
  progress: MotionValue<number>;
  /** Normalised pointer, -1 → 1 on both axes. */
  pointer: RefObject<{ x: number; y: number }>;
  /** Render loop on/off (off-screen sections stop rendering entirely). */
  active: boolean;
  /** Phones / low-power: fewer layers, no transmission, lower DPR. */
  lite: boolean;
  /** Static final pose, no scroll or pointer choreography. */
  still: boolean;
  /** Where the artifact sits in frame. */
  layout: "side" | "center";
  onReady?: () => void;
}

const smoothstep = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const damp = THREE.MathUtils.damp;

/** Deterministic PRNG (mulberry32) — keeps render pure and the ring identical across renders. */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * "Exploded interface" — a stack of etched glass layers (grid, layout, type, components,
 * code) orbited by a ring of light. Scroll separates the layers and turns the object;
 * the cursor steers the camera.
 */
function Artifact({ progress, pointer, lite, still, layout }: Omit<ArtifactSceneProps, "active" | "onReady">) {
  const count = lite ? 4 : PANE_COUNT;
  const root = useRef<THREE.Group>(null);
  const panes = useRef<(THREE.Group | null)[]>([]);
  const etchMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const ring = useRef<THREE.Points>(null);
  const core = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  const textures = useMemo(() => Array.from({ length: count }, (_, i) => createPaneTexture(i)), [count]);
  const glow = useMemo(() => createGlowTexture(), []);

  const glass = useMemo(
    () =>
      lite
        ? new THREE.MeshPhysicalMaterial({
            color: "#dfe6f2",
            metalness: 0.1,
            roughness: 0.12,
            transparent: true,
            opacity: 0.16,
            clearcoat: 1,
            clearcoatRoughness: 0.1,
            iridescence: 0.5,
            envMapIntensity: 1.6,
            side: THREE.DoubleSide,
            depthWrite: false,
          })
        : new THREE.MeshPhysicalMaterial({
            color: "#ffffff",
            metalness: 0,
            roughness: 0.14,
            transmission: 1,
            thickness: 0.35,
            ior: 1.45,
            clearcoat: 1,
            clearcoatRoughness: 0.08,
            iridescence: 0.55,
            iridescenceIOR: 1.3,
            attenuationColor: new THREE.Color("#cfe0ff"),
            attenuationDistance: 3,
            envMapIntensity: 1.8,
            specularIntensity: 1,
          }),
    [lite],
  );

  const ringGeometry = useMemo(() => {
    const n = lite ? 700 : 1600;
    const positions = new Float32Array(n * 3);
    const colors = new Float32Array(n * 3);
    const cool = new THREE.Color("#cfe4ff");
    const white = new THREE.Color("#ffffff");
    const amber = new THREE.Color("#f2a33a");
    const rand = seeded(8);
    const gauss = () => (rand() + rand() + rand() - 1.5) / 1.5;
    for (let i = 0; i < n; i++) {
      const a = rand() * Math.PI * 2;
      const r = 2.05 + gauss() * 0.09;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = gauss() * 0.06;
      positions[i * 3 + 2] = Math.sin(a) * r;
      const c = rand() < 0.14 ? amber : rand() < 0.5 ? cool : white;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [lite]);

  useEffect(
    () => () => {
      textures.forEach((t) => t.dispose());
      glow.dispose();
      glass.dispose();
      ringGeometry.dispose();
    },
    [textures, glow, glass, ringGeometry],
  );

  // Framing is derived from the canvas aspect so the object never crops, at any window size.
  const TAN_HALF_FOV = Math.tan(THREE.MathUtils.degToRad(15));
  const frameFor = (aspect: number) => {
    const halfH = TAN_HALF_FOV * 8;
    const halfW = halfH * aspect;
    if (layout === "side") {
      return { x: halfW * 0.5, y: 0, scale: THREE.MathUtils.clamp((halfW * 0.44) / 2.1, 0.5, 0.9) };
    }
    return { x: 0, y: halfH * 0.36, scale: THREE.MathUtils.clamp((halfW * 0.82) / 2.1, 0.4, 0.8) };
  };

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 20);
    // Reduced motion renders on demand: snap straight to the pose instead of easing toward it.
    const ease = (current: number, target: number, lambda: number) =>
      still ? target : damp(current, target, lambda, dt);
    const frame = frameFor(state.size.width / Math.max(1, state.size.height));
    const p = still ? 0.55 : progress.get();
    const px = still ? 0 : pointer.current.x;
    const py = still ? 0 : pointer.current.y;

    const enter = smoothstep(0, 0.34, p);
    const open = smoothstep(0.3, 0.6, p);
    const close = smoothstep(0.74, 0.98, p);
    const explode = open * (1 - close * 0.8);

    // Layers: compact → exploded along depth with a slight fan → recomposed.
    const mid = (count - 1) / 2;
    const spacing = 0.14 + explode * 0.62;
    panes.current.forEach((pane, i) => {
      if (!pane) return;
      const k = i - mid;
      pane.position.z = ease(pane.position.z, k * spacing, 6);
      pane.position.x = ease(pane.position.x, -k * explode * 0.18, 6);
      pane.position.y = ease(pane.position.y, -k * explode * 0.1, 6);
      const mat = etchMats.current[i];
      if (mat) mat.opacity = ease(mat.opacity, 0.5 + explode * 0.45, 5);
    });

    if (root.current) {
      const g = root.current;
      // Turn to reveal depth while exploded, then face the viewer as the layers recompose.
      const ry = THREE.MathUtils.lerp(-1.0, -0.5, enter) - explode * 0.38 + close * 0.46 + px * 0.14;
      const rx = THREE.MathUtils.lerp(0.42, 0.16, enter) + explode * 0.16 - close * 0.08 - py * 0.1;
      g.rotation.y = ease(g.rotation.y, ry, 4);
      g.rotation.x = ease(g.rotation.x, rx, 4);
      g.position.x = ease(g.position.x, frame.x, 4);
      g.position.y = ease(g.position.y, frame.y, 4);
      g.scale.setScalar(ease(g.scale.x, frame.scale, 4));
    }

    if (ring.current) {
      ring.current.rotation.y += dt * (still ? 0 : 0.06 + explode * 0.12);
      const s = 0.88 + enter * 0.12 + explode * 0.14;
      ring.current.scale.setScalar(ease(ring.current.scale.x, s, 4));
    }

    if (core.current) {
      core.current.position.z = ease(core.current.position.z, (0.5 - mid) * spacing + 0.02, 6);
    }

    // Camera: dolly in on enter, drift with cursor, always look at the object.
    const cam = state.camera;
    const tz = THREE.MathUtils.lerp(10.5, 8.2, enter) - explode * 0.5;
    cam.position.x = ease(cam.position.x, px * 0.55, 3);
    cam.position.y = ease(cam.position.y, py * 0.35 + 0.15, 3);
    cam.position.z = ease(cam.position.z, tz, 3);
    cam.lookAt(0, 0, 0);
  });

  // Initial camera placement so the first frame isn't a jump.
  useEffect(() => {
    camera.position.set(0, 0.15, 10.5);
  }, [camera]);

  return (
    <group ref={root} scale={0.7}>
      <Float speed={still ? 0 : 1.1} rotationIntensity={0.12} floatIntensity={0.28} floatingRange={[-0.06, 0.06]}>
        {textures.map((texture, i) => (
          <group key={i} ref={(el) => void (panes.current[i] = el)}>
            <RoundedBox args={[2.8, 1.75, 0.05]} radius={0.04} smoothness={3} material={glass} />
            <mesh position={[0, 0, 0.032]}>
              <planeGeometry args={[2.7, 1.6875]} />
              <meshBasicMaterial
                ref={(m) => void (etchMats.current[i] = m)}
                map={texture}
                transparent
                opacity={0.3}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                toneMapped={false}
              />
            </mesh>
          </group>
        ))}

        {/* The one warm element: a call-to-action pill living between the layers. */}
        <RoundedBox ref={core} args={[0.74, 0.23, 0.23]} radius={0.115} smoothness={4} position={[0.55, -0.34, 0]}>
          <meshStandardMaterial color="#f2a33a" emissive="#f2a33a" emissiveIntensity={1.6} toneMapped={false} />
        </RoundedBox>
      </Float>

      <group rotation={[0.42, 0, -0.2]}>
        <points ref={ring} geometry={ringGeometry}>
          <pointsMaterial
            map={glow}
            size={lite ? 0.09 : 0.075}
            sizeAttenuation
            vertexColors
            transparent
            opacity={0.9}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </points>
      </group>
    </group>
  );
}

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <group rotation={[-Math.PI / 3, 0, 1]}>
        <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
        <Lightformer form="rect" intensity={2.2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 0.4, 1]} />
        <Lightformer form="rect" intensity={2.2} rotation-y={-Math.PI / 2} position={[5, 1, -1]} scale={[20, 0.4, 1]} />
        <Lightformer form="rect" intensity={1.2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[20, 0.3, 1]} />
        <Lightformer form="ring" color="#f2a33a" intensity={3} position={[6, -2, 6]} scale={3} />
        <Lightformer form="rect" color="#9cc2ff" intensity={1.8} position={[-8, -3, 5]} scale={[12, 1.2, 1]} />
      </group>
    </Environment>
  );
}

export default function ArtifactScene(props: ArtifactSceneProps) {
  const { active, lite, onReady } = props;
  const [dpr, setDpr] = useState(lite ? 1.25 : 1.6);

  return (
    <Canvas
      frameloop={!active ? "never" : props.still ? "demand" : "always"}
      dpr={dpr}
      camera={{ position: [0, 0.15, 10.5], fov: 30, near: 0.1, far: 50 }}
      gl={{ antialias: !lite, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        // Opaque clear: three.js clears the transmission buffer to translucent white when the
        // canvas is transparent, which washes out the glass. Match the page ink instead.
        gl.setClearColor("#050505", 1);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        onReady?.();
      }}
      aria-hidden="true"
    >
      <PerformanceMonitor
        onDecline={() => setDpr((d) => Math.max(1, d - 0.35))}
        onIncline={() => setDpr((d) => Math.min(lite ? 1.5 : 1.75, d + 0.2))}
        flipflops={3}
        onFallback={() => setDpr(1)}
      />
      <Studio />
      <Artifact {...props} />
    </Canvas>
  );
}
