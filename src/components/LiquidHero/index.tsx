"use client";

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

// ==========================================
// CUSTOM CURSOR CONFIGURATION
// You can adjust these values to change the cursor size
// ==========================================
const CURSOR_OUTER_SIZE = "24px";
const CURSOR_INNER_SIZE = "4px";

type LiquidHeroProps = {
  imageUrl?: string;
  videoUrl?: string; // Not used in Three.js mode but kept for signature safety
  strength?: number; // Not used in Three.js mode but kept for signature safety
  brushRadius?: number; // Not used in Three.js mode but kept for signature safety
  dissipation?: number; // Not used in Three.js mode but kept for signature safety
  children?: React.ReactNode;
  showCustomCursor?: boolean;

  // Shader parameters
  waveIntensity?: number;
  rippleIntensity?: number;
  animationSpeed?: number;
  waveFrequency?: number;
  rippleFrequency?: number;
  distortionAmount?: number;
  hoverRippleMultiplier?: number;
  transitionSpeed?: number;
};

export default function LiquidHero({
  imageUrl,
  videoUrl,
  strength,
  brushRadius,
  dissipation,
  children,
  showCustomCursor = true,

  waveIntensity = 0.006,
  rippleIntensity = 0.012,
  animationSpeed = 1.0,
  waveFrequency = 10.0,
  rippleFrequency = 20.0,
  distortionAmount = 0.008,
  hoverRippleMultiplier = 4.0,
  transitionSpeed = 0.08,
}: LiquidHeroProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorOuterRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const mouseCoordsRef = useRef({ x: 0, y: 0 });
  const currentCoordsRef = useRef({ x: 0, y: 0 });
  const isPressedRef = useRef(false);

  // Three.js instances refs for animation and resize handlers
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const timeRef = useRef(0);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    const mountElement = mountRef.current;
    if (!imageUrl || !mountElement) return;

    const width = mountElement.offsetWidth || window.innerWidth;
    const height = mountElement.offsetHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      precision: "highp",
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    mountElement.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imageUrl, (loadedTexture) => {
      loadedTexture.magFilter = THREE.LinearFilter;
      loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
      loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
      loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
      loadedTexture.generateMipmaps = true;
      loadedTexture.needsUpdate = true;

      // Defer updating image dimensions in shader uniforms to prevent ReferenceError if load runs synchronously
      setTimeout(() => {
        if (materialRef.current?.uniforms?.uImageResolution) {
          materialRef.current.uniforms.uImageResolution.value.set(
            loadedTexture.image.width,
            loadedTexture.image.height
          );
        }
      }, 0);
    });

    const vertexShader = `
      varying vec2 vUv;
      varying vec2 vPosition;

      void main() {
        vUv = uv;
        vPosition = position.xy;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D texture1;
      uniform float time;
      uniform vec2 mouse;
      uniform float hoverIntensity;
      uniform float waveIntensity;
      uniform float rippleIntensity;
      uniform float animationSpeed;
      uniform float waveFrequency;
      uniform float rippleFrequency;
      uniform float distortionAmount;
      uniform vec2 uResolution;
      uniform vec2 uImageResolution;
      varying vec2 vUv;
      varying vec2 vPosition;

      // Improved smoothstep for better interpolation
      float smoothwave(float x) {
        return sin(x) * 0.5 + 0.5;
      }

      void main() {
        // Cover-fit UV calculations
        float aspect = uResolution.x / uResolution.y;
        float imgAspect = uImageResolution.x / uImageResolution.y;
        vec2 ratio = vec2(
          min(aspect / imgAspect, 1.0),
          min((1.0 / aspect) / (1.0 / imgAspect), 1.0)
        );
        vec2 uv = vUv * ratio + (1.0 - ratio) * 0.5;
        
        // Reduced intensity for global waves to preserve image quality
        float waveScale = waveIntensity * 0.5;
        
        // More subtle global wavy distortion
        float wave1 = sin(uv.x * waveFrequency + time * animationSpeed * 2.0) * waveScale;
        float wave2 = sin(uv.y * (waveFrequency * 0.8) + time * animationSpeed * 1.5) * (waveScale * 0.8);
        float wave3 = sin((uv.x + uv.y) * (waveFrequency * 1.2) + time * animationSpeed * 2.5) * (waveScale * 0.3);
        
        // Mouse-based ripples with falloff
        float dist = distance(uv, mouse);
        float rippleScale = rippleIntensity * 0.7;
        
        // Improved falloff function for smoother transitions
        float falloff = exp(-dist * 4.0);
        
        float mouseWave1 = sin(dist * rippleFrequency - time * animationSpeed * 4.0) * 
                          falloff * hoverIntensity * rippleScale;
        float mouseWave2 = sin(dist * (rippleFrequency * 0.75) - time * animationSpeed * 3.0) * 
                          falloff * hoverIntensity * (rippleScale * 0.6);
        
        // More controlled expanding ripples
        float ripple1 = sin(dist * (rippleFrequency * 1.25) - time * animationSpeed * 5.0) * 
                       exp(-dist * 5.0) * hoverIntensity * (rippleScale * 0.8);
        float ripple2 = sin(dist * (rippleFrequency * 0.9) - time * animationSpeed * 3.5) * 
                       exp(-dist * 4.0) * hoverIntensity * (rippleScale * 0.6);
        
        // Combine waves with reduced intensity
        float totalWave = (wave1 + wave2 + wave3 + mouseWave1 + mouseWave2 + ripple1 + ripple2) * 0.5;
        
        // More subtle distortion
        float distortScale = distortionAmount * 0.6;
        vec2 distortion = vec2(
          sin(uv.x * (waveFrequency * 0.8) + time * animationSpeed * 1.8) * distortScale * 0.4 + 
          sin(uv.y * (waveFrequency * 0.6) + time * animationSpeed * 2.2) * distortScale * 0.3,
          sin(uv.y * (waveFrequency * 0.7) + time * animationSpeed * 1.6) * distortScale * 0.4 + 
          sin(uv.x * (waveFrequency * 0.9) + time * animationSpeed * 2.0) * distortScale * 0.3
        );
        
        // Reduced mouse-based radial distortion
        vec2 mouseDir = uv - mouse;
        float mouseDist = length(mouseDir);
        vec2 mouseDistortion = vec2(0.0);
        if (mouseDist > 0.0001) {
          mouseDistortion = normalize(mouseDir) * sin(mouseDist * rippleFrequency - time * animationSpeed * 4.0) * 
                                exp(-mouseDist * 4.0) * hoverIntensity * distortScale * 0.5;
        }
        
        // Combine distortions with reduced intensity
        vec2 finalDistortion = (distortion + mouseDistortion) * 0.7 + vec2(totalWave * 0.2, totalWave * 0.2);
        
        // Apply distortion to UV coordinates
        vec2 distortedUv = uv + finalDistortion;
        
        // Clamp UV coordinates to prevent sampling outside texture bounds
        distortedUv = clamp(distortedUv, 0.0, 1.0);
        
        // Sample texture with distorted coordinates
        vec4 color = texture2D(texture1, distortedUv);
        
        gl_FragColor = color;
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        texture1: { value: texture },
        time: { value: 0 },
        mouse: { value: new THREE.Vector2(0.5, 0.5) },
        hoverIntensity: { value: 0.3 },
        waveIntensity: { value: waveIntensity },
        rippleIntensity: { value: rippleIntensity },
        animationSpeed: { value: animationSpeed },
        waveFrequency: { value: waveFrequency },
        rippleFrequency: { value: rippleFrequency },
        distortionAmount: { value: distortionAmount },
        uResolution: { value: new THREE.Vector2(width, height) },
        uImageResolution: { value: new THREE.Vector2(width, height) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    camera.position.z = 1;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    materialRef.current = material;

    // Responsive resize handler
    const handleResize = () => {
      const w = mountElement.offsetWidth;
      const h = mountElement.offsetHeight;
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Update shader uniforms
      material.uniforms.uResolution.value.set(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Event handlers
    const handleMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      mouseRef.current = { x, y };
    };

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
    };

    const targetTarget = renderer.domElement.parentElement || renderer.domElement;
    targetTarget.addEventListener("mousemove", handleMouseMove);
    targetTarget.addEventListener("mouseenter", handleMouseEnter);
    targetTarget.addEventListener("mouseleave", handleMouseLeave);

    let animFrameId: number;
    const animate = () => {
      timeRef.current += 0.016;

      if (materialRef.current) {
        materialRef.current.uniforms.time.value = timeRef.current;
        materialRef.current.uniforms.mouse.value.set(
          mouseRef.current.x,
          mouseRef.current.y
        );
        const targetIntensity = isHoveredRef.current
          ? hoverRippleMultiplier
          : 0.3;
        const currentIntensity =
          materialRef.current.uniforms.hoverIntensity.value;
        materialRef.current.uniforms.hoverIntensity.value +=
          (targetIntensity - currentIntensity) * transitionSpeed;
      }

      if (rendererRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, camera);
      }
      animFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      targetTarget.removeEventListener("mousemove", handleMouseMove);
      targetTarget.removeEventListener("mouseenter", handleMouseEnter);
      targetTarget.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animFrameId);

      if (
        mountElement &&
        renderer.domElement &&
        mountElement.contains(renderer.domElement)
      ) {
        mountElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, [
    imageUrl,
    waveIntensity,
    rippleIntensity,
    animationSpeed,
    hoverRippleMultiplier,
    transitionSpeed,
    waveFrequency,
    rippleFrequency,
    distortionAmount,
  ]);

  // Cursor LERP animation
  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);

    let animId: number;
    const updateCursor = () => {
      const targetX = mouseCoordsRef.current.x;
      const targetY = mouseCoordsRef.current.y;

      currentCoordsRef.current.x += (targetX - currentCoordsRef.current.x) * 0.16;
      currentCoordsRef.current.y += (targetY - currentCoordsRef.current.y) * 0.16;

      if (cursorOuterRef.current) {
        const dx = targetX - currentCoordsRef.current.x;
        const dy = targetY - currentCoordsRef.current.y;
        const speed = Math.sqrt(dx * dx + dy * dy);
        
        const stretch = Math.min(1.5, 1.0 + speed * 0.015);
        const rotate = Math.atan2(dy, dx) * (180 / Math.PI);
        
        const scale = isPressedRef.current ? 1.8 : 1.0;

        cursorOuterRef.current.style.transform = `translate3d(${currentCoordsRef.current.x}px, ${currentCoordsRef.current.y}px, 0) scale(${scale}) scaleX(${stretch}) rotate(${rotate}deg)`;
      }

      if (cursorInnerRef.current) {
        cursorInnerRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }

      animId = requestAnimationFrame(updateCursor);
    };

    updateCursor();
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseCoordsRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovered(true);
    isHoveredRef.current = true;
    mouseCoordsRef.current = { x: e.clientX, y: e.clientY };
    currentCoordsRef.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <section
      ref={containerRef}
      className={`relative w-full h-screen overflow-hidden bg-black select-none ${
        showCustomCursor ? "cursor-none" : ""
      }`}
      onMouseMove={handleMouseMove}
      onMouseDown={() => {
        isPressedRef.current = true;
        setIsPressed(true);
      }}
      onMouseUp={() => {
        isPressedRef.current = false;
        setIsPressed(false);
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => {
        setIsHovered(false);
        isHoveredRef.current = false;
        isPressedRef.current = false;
        setIsPressed(false);
      }}
    >
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Custom interactive cursor */}
      {showCustomCursor && !isTouch && (
        <>
          <div
            ref={cursorOuterRef}
            className="pointer-events-none fixed top-0 left-0 z-50 rounded-full border border-white/60 bg-white/5 backdrop-blur-[1px] -translate-x-1/2 -translate-y-1/2 will-change-transform mix-blend-difference"
            style={{
              width: CURSOR_OUTER_SIZE,
              height: CURSOR_OUTER_SIZE,
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.2s ease, border-color 0.2s ease",
            }}
          />
          <div
            ref={cursorInnerRef}
            className="pointer-events-none fixed top-0 left-0 z-50 rounded-full bg-white -translate-x-1/2 -translate-y-1/2 will-change-transform mix-blend-difference"
            style={{
              width: CURSOR_INNER_SIZE,
              height: CURSOR_INNER_SIZE,
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.2s ease",
            }}
          />
        </>
      )}

      {/* Overlay content */}
      <div className="relative z-10 flex flex-col items-start justify-end h-full p-8 md:p-16 pointer-events-none select-none">
        {children}
      </div>
    </section>
  );
}
