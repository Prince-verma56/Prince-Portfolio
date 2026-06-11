/// <reference types="@react-three/fiber" />
// @ts-nocheck
'use client';
import { FC, Suspense, useRef, useLayoutEffect, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree, invalidate } from '@react-three/fiber';
import {
  OrbitControls,
  useGLTF,
  useProgress,
  Html,
  Environment,
  ContactShadows,
} from '@react-three/drei';
import * as THREE from 'three';

export interface ViewerProps {
  url: string;
  width?: number | string;
  height?: number | string;
  modelXOffset?: number;
  modelYOffset?: number;
  defaultRotationX?: number;
  defaultRotationY?: number;
  defaultZoom?: number;
  minZoomDistance?: number;
  maxZoomDistance?: number;
  enableMouseParallax?: boolean;
  enableManualRotation?: boolean;
  enableHoverRotation?: boolean;
  enableManualZoom?: boolean;
  ambientIntensity?: number;
  keyLightIntensity?: number;
  fillLightIntensity?: number;
  rimLightIntensity?: number;
  environmentPreset?:
    | 'city'
    | 'sunset'
    | 'night'
    | 'dawn'
    | 'studio'
    | 'apartment'
    | 'forest'
    | 'park'
    | 'none';
  autoFrame?: boolean;
  placeholderSrc?: string;
  showScreenshotButton?: boolean;
  fadeIn?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  onModelLoaded?: () => void;
  modelScale?: number;
  cameraFov?: number;
}

const isTouch =
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);
const deg2rad = (d: number) => (d * Math.PI) / 180;
const DECIDE = 8;
const ROTATE_SPEED = 0.005;
const INERTIA = 0.925;
const PARALLAX_MAG = 0.05;
const PARALLAX_EASE = 0.12;
const HOVER_MAG = deg2rad(6);
const HOVER_EASE = 0.15;

/* ─── Loader overlay ─── */
const Loader: FC<{ placeholderSrc?: string }> = ({ placeholderSrc }) => {
  const { progress } = useProgress();
  return (
    <Html center>
      {placeholderSrc ? (
        <img src={placeholderSrc} width={128} height={128} className="blur-lg rounded-lg" />
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span className="font-mono text-xs text-white/60">{Math.round(progress)}%</span>
        </div>
      )}
    </Html>
  );
};

/* ─── Desktop orbit controls ─── */
const DesktopControls: FC<{
  pivot: THREE.Vector3;
  min: number;
  max: number;
  zoomEnabled: boolean;
}> = ({ pivot, min, max, zoomEnabled }) => {
  const ref = useRef<any>(null);
  useFrame(() => ref.current?.target.copy(pivot));
  return (
    <OrbitControls
      ref={ref}
      makeDefault
      enablePan={false}
      enableRotate={false}
      enableZoom={zoomEnabled}
      minDistance={min}
      maxDistance={max}
    />
  );
};

/* ─── Inner model (GLTF only; extend for FBX/OBJ if needed) ─── */
interface ModelInnerProps {
  url: string;
  xOff: number;
  yOff: number;
  pivot: THREE.Vector3;
  initYaw: number;
  initPitch: number;
  minZoom: number;
  maxZoom: number;
  enableMouseParallax: boolean;
  enableManualRotation: boolean;
  enableHoverRotation: boolean;
  enableManualZoom: boolean;
  fadeIn: boolean;
  autoRotate: boolean;
  autoRotateSpeed: number;
  onLoaded?: () => void;
  modelScale: number;
  defaultZoom: number;
}

const ModelInner: FC<ModelInnerProps> = ({
  url,
  xOff,
  yOff,
  pivot,
  initYaw,
  initPitch,
  minZoom,
  maxZoom,
  enableMouseParallax,
  enableManualRotation,
  enableHoverRotation,
  enableManualZoom,
  fadeIn,
  autoRotate,
  autoRotateSpeed,
  onLoaded,
  modelScale,
  defaultZoom,
}) => {
  const outer = useRef<THREE.Group>(null!);
  const inner = useRef<THREE.Group>(null!);
  const { camera, gl } = useThree();

  const vel = useRef({ x: 0, y: 0 });
  const tPar = useRef({ x: 0, y: 0 });
  const cPar = useRef({ x: 0, y: 0 });
  const tHov = useRef({ x: 0, y: 0 });
  const cHov = useRef({ x: 0, y: 0 });

  // ── Load the GLTF at the top level (rules of hooks compliant) ──
  const { scene: gltfScene } = useGLTF(url);
  const content = gltfScene.clone(true);

  const pivotW = useRef(new THREE.Vector3());

  useLayoutEffect(() => {
    if (!content || !inner.current) return;
    const g = inner.current;

    // Compute bounding sphere and normalize model to unit size
    const box = new THREE.Box3().setFromObject(content);
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const s = (1 / (sphere.radius * 2)) * modelScale;

    // Center and scale the model
    g.position.set(-sphere.center.x * s, -sphere.center.y * s, -sphere.center.z * s);
    g.scale.setScalar(s);

    // Enable shadows and set up fade-in
    g.traverse((o: any) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        if (fadeIn) {
          if (Array.isArray(o.material)) {
            o.material = o.material.map((m: THREE.Material) => m.clone());
            o.material.forEach((m: any) => { m.transparent = true; m.opacity = 0; });
          } else {
            o.material = o.material.clone();
            o.material.transparent = true;
            o.material.opacity = 0;
          }
        }
      }
    });

    // Set rotation
    outer.current.rotation.set(initPitch, initYaw, 0);

    // Use user-specified defaultZoom instead of auto-framing
    if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const persp = camera as THREE.PerspectiveCamera;
      persp.position.set(0, 0, defaultZoom);
      persp.near = defaultZoom / 100;
      persp.far = defaultZoom * 100;
      persp.updateProjectionMatrix();
    }

    // Update pivot point for orbit controls
    g.updateWorldMatrix(true, true);
    g.getWorldPosition(pivotW.current);
    pivot.copy(pivotW.current);

    // Fade-in animation
    if (fadeIn) {
      let t = 0;
      const id = setInterval(() => {
        t += 0.04;
        const v = Math.min(t, 1);
        g.traverse((o: any) => {
          if (o.isMesh) {
            if (Array.isArray(o.material)) o.material.forEach((m: any) => { m.opacity = v; });
            else o.material.opacity = v;
          }
        });
        invalidate();
        if (v >= 1) { clearInterval(id); onLoaded?.(); }
      }, 16);
      return () => clearInterval(id);
    } else {
      onLoaded?.();
    }
  }, [url]); // re-run when url changes

  /* ─── Desktop drag rotation ─── */
  useEffect(() => {
    if (!enableManualRotation || isTouch) return;
    const el = gl.domElement;
    let drag = false, lx = 0;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      drag = true; lx = e.clientX;
      window.addEventListener('pointerup', up);
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - lx;
      lx = e.clientX;
      outer.current.rotation.y += dx * ROTATE_SPEED;
      vel.current = { x: dx * ROTATE_SPEED, y: 0 };
      invalidate();
    };
    const up = () => { drag = false; };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [gl, enableManualRotation]);

  /* ─── Touch rotation only (no pinch-zoom) ─── */
  useEffect(() => {
    if (!isTouch) return;
    const el = gl.domElement;
    const pts = new Map<number, { x: number; y: number }>();
    let sx = 0, lx = 0;

    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 1) { sx = lx = e.clientX; }
      invalidate();
    };
    const move = (e: PointerEvent) => {
      const p = pts.get(e.pointerId);
      if (!p || pts.size !== 1) return;
      p.x = e.clientX; p.y = e.clientY;
      const dx = e.clientX - lx;
      lx = e.clientX;
      outer.current.rotation.y += dx * ROTATE_SPEED;
      vel.current = { x: dx * ROTATE_SPEED, y: 0 };
      invalidate();
    };
    const up = (e: PointerEvent) => {
      pts.delete(e.pointerId);
    };
    el.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', up, { passive: true });
    window.addEventListener('pointercancel', up, { passive: true });
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [gl, enableManualRotation]);

  /* ─── Mouse parallax / hover tilt ─── */
  useEffect(() => {
    if (isTouch) return;
    const mm = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      if (enableMouseParallax) tPar.current = { x: -nx * PARALLAX_MAG, y: -ny * PARALLAX_MAG };
      if (enableHoverRotation) tHov.current = { x: ny * HOVER_MAG, y: nx * HOVER_MAG };
      invalidate();
    };
    window.addEventListener('pointermove', mm);
    return () => window.removeEventListener('pointermove', mm);
  }, [enableMouseParallax, enableHoverRotation]);

  /* ─── Animation frame ─── */
  useFrame((_, dt) => {
    let need = false;
    cPar.current.x += (tPar.current.x - cPar.current.x) * PARALLAX_EASE;
    cPar.current.y += (tPar.current.y - cPar.current.y) * PARALLAX_EASE;

    const ndc = pivotW.current.clone().project(camera);
    ndc.x += xOff + cPar.current.x;
    ndc.y += yOff + cPar.current.y;
    outer.current.position.copy(ndc.unproject(camera));

    if (autoRotate) { outer.current.rotation.y += autoRotateSpeed * dt; need = true; }
    outer.current.rotation.y += vel.current.x;
    vel.current.x *= INERTIA;
    if (Math.abs(vel.current.x) > 1e-4) need = true;
    if (
      Math.abs(cPar.current.x - tPar.current.x) > 1e-4 ||
      Math.abs(cPar.current.y - tPar.current.y) > 1e-4
    ) need = true;

    if (need) invalidate();
  });

  return (
    <group ref={outer}>
      <group ref={inner}>
        <primitive object={content} />
      </group>
    </group>
  );
};

/* ─── Public ModelViewer component ─── */
const ModelViewer: FC<ViewerProps> = ({
  url,
  width = '100%',
  height = '100%',
  modelXOffset = 0,
  modelYOffset = 0,
  defaultRotationX = -15,
  defaultRotationY = 25,
  defaultZoom = 3,
  minZoomDistance = 0.5,
  maxZoomDistance = 20,
  enableMouseParallax = true,
  enableManualRotation = true,
  enableHoverRotation = true,
  enableManualZoom = true,
  ambientIntensity = 1.2,
  keyLightIntensity = 2,
  fillLightIntensity = 1,
  rimLightIntensity = 1,
  environmentPreset = 'studio',
  placeholderSrc,
  showScreenshotButton = false,
  fadeIn = true,
  autoRotate = false,
  autoRotateSpeed = 0.35,
  onModelLoaded,
  modelScale = 1.5,
  cameraFov = 22,
}) => {
  // Preload the GLB so it's in cache before the Canvas mounts
  useEffect(() => { useGLTF.preload(url); }, [url]);

  const pivot = useRef(new THREE.Vector3()).current;
  const rendererRef = useRef<THREE.WebGLRenderer>(null);
  const sceneRef = useRef<THREE.Scene>(null);
  const cameraRef = useRef<THREE.Camera>(null);
  const contactRef = useRef<THREE.Mesh>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        rootMargin: '100px',
      }
    );
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  const initYaw = deg2rad(defaultRotationY);
  const initPitch = deg2rad(defaultRotationX);
  const camZ = Math.min(Math.max(defaultZoom, minZoomDistance), maxZoomDistance);

  const capture = () => {
    const g = rendererRef.current, s = sceneRef.current, c = cameraRef.current;
    if (!g || !s || !c) return;
    g.shadowMap.enabled = false;
    const tmp: { l: THREE.Light; cast: boolean }[] = [];
    s.traverse((o: any) => { if (o.isLight && 'castShadow' in o) { tmp.push({ l: o, cast: o.castShadow }); o.castShadow = false; } });
    if (contactRef.current) contactRef.current.visible = false;
    g.render(s, c);
    const urlPNG = g.domElement.toDataURL('image/png');
    const a = document.createElement('a'); a.download = 'model.png'; a.href = urlPNG; a.click();
    g.shadowMap.enabled = true;
    tmp.forEach(({ l, cast }) => (l.castShadow = cast));
    if (contactRef.current) contactRef.current.visible = true;
    invalidate();
  };

  return (
    <div ref={containerRef} style={{ width, height, touchAction: 'none' }} className="relative">
      {showScreenshotButton && (
        <button
          onClick={capture}
          className="absolute top-4 right-4 z-10 cursor-pointer px-4 py-2 border border-white rounded-xl bg-transparent text-white hover:bg-white hover:text-black transition-colors"
        >
          Take Screenshot
        </button>
      )}

      <Canvas
        shadows
        frameloop={isIntersecting ? "demand" : "never"}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, stencil: false, preserveDrawingBuffer: false }}
        onCreated={({ gl, scene, camera }) => {
          rendererRef.current = gl;
          sceneRef.current = scene;
          cameraRef.current = camera;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.8;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          // Transparent background — let the section's dark bg show through
          gl.setClearColor(0x000000, 0);
          scene.background = null;
        }}
        camera={{ fov: cameraFov, position: [0, 0, camZ], near: 0.1, far: 100 }}
        style={{ touchAction: 'none', background: 'transparent' }}
      >
        {environmentPreset !== 'none' && (
          <Environment preset={environmentPreset as any} background={false} />
        )}

        <ambientLight intensity={ambientIntensity} />
        <directionalLight position={[5, 8, 5]} intensity={keyLightIntensity} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0001} />
        <directionalLight position={[-5, 2, 5]} intensity={fillLightIntensity} />
        <directionalLight position={[0, 4, -5]} intensity={rimLightIntensity} />

        <ContactShadows
          ref={contactRef as any}
          position={[0, -0.5, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={5}
        />

        <Suspense fallback={<Loader placeholderSrc={placeholderSrc} />}>
          <ModelInner
            url={url}
            xOff={modelXOffset}
            yOff={modelYOffset}
            pivot={pivot}
            initYaw={initYaw}
            initPitch={initPitch}
            minZoom={minZoomDistance}
            maxZoom={maxZoomDistance}
            enableMouseParallax={enableMouseParallax}
            enableManualRotation={enableManualRotation}
            enableHoverRotation={enableHoverRotation}
            enableManualZoom={enableManualZoom}
            fadeIn={fadeIn}
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotateSpeed}
            onLoaded={onModelLoaded}
            modelScale={modelScale}
            defaultZoom={defaultZoom}
          />
        </Suspense>

        {!isTouch && (
          <DesktopControls
            pivot={pivot}
            min={minZoomDistance}
            max={maxZoomDistance}
            zoomEnabled={enableManualZoom}
          />
        )}
      </Canvas>
    </div>
  );
};

export default ModelViewer;
