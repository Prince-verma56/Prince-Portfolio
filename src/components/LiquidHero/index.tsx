"use client";

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

// ==========================================
// LIQUID HERO CONFIGURATION
// ==========================================

type LiquidHeroProps = {
  imageUrl?: string;
  videoUrl?: string;
  strength?: number; // Not used in Three.js mode but kept for signature safety
  brushRadius?: number; // Not used in Three.js mode but kept for signature safety
  dissipation?: number; // Not used in Three.js mode but kept for signature safety
  isPlaying?: boolean; // Added to accept isPlaying from parent
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

type ShaderTunables = {
  waveIntensity: number;
  rippleIntensity: number;
  animationSpeed: number;
  waveFrequency: number;
  rippleFrequency: number;
  distortionAmount: number;
};

// Pushes prop tunables into the live material without recompiling the shader.
// Kept outside the component so the React Compiler lint doesn't treat the
// uniform writes as mutation of effect-captured state.
function applyShaderTunables(material: THREE.ShaderMaterial | null, t: ShaderTunables) {
  const u = material?.uniforms;
  if (!u) return;
  u.waveIntensity.value = t.waveIntensity;
  u.rippleIntensity.value = t.rippleIntensity;
  u.animationSpeed.value = t.animationSpeed;
  u.waveFrequency.value = t.waveFrequency;
  u.rippleFrequency.value = t.rippleFrequency;
  u.distortionAmount.value = t.distortionAmount;
}

export default function LiquidHero({
  imageUrl,
  videoUrl,
  strength,
  brushRadius,
  dissipation,
  isPlaying = true,
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

  // Touch detection lives in a ref because it is read inside the render loop.
  const isTouchRef = useRef(false);

  // Three.js instances refs for animation and resize handlers
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const timeRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isPlayingRef = useRef(isPlaying);
  // Hover tunables are read per frame; refs keep them current without
  // rebuilding the GL scene when the props change.
  const hoverRippleRef = useRef(hoverRippleMultiplier);
  const transitionSpeedRef = useRef(transitionSpeed);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoReady, setVideoReady] = useState(false);

  // Initialize isTouch IMMEDIATELY before any other effects
  useEffect(() => {
    isTouchRef.current = window.matchMedia("(pointer: coarse)").matches;
  }, []);

  // Initialize video element when component mounts
  useEffect(() => {
    if (!videoUrl) return;

    const video = document.createElement('video');
    video.src = videoUrl;
    video.loop = true;
    video.muted = true;
    video.crossOrigin = "anonymous";
    video.playsInline = true;
    video.preload = "auto";
    videoRef.current = video;

    // Play video as soon as it's ready
    const onCanPlay = () => {
      setVideoReady(true);
      if (isPlaying) {
        video.play().catch(err => console.log("Video autoplay blocked:", err));
      }
    };

    video.addEventListener('canplay', onCanPlay);
    video.load();

    return () => {
      video.removeEventListener('canplay', onCanPlay);
      video.pause();
      video.src = "";
      videoRef.current = null;
    };
  }, [videoUrl]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    const video = videoRef.current;
    if (video && videoReady) {
      if (isPlaying) {
        video.play().catch(err => console.log("Video play failed:", err));
      } else {
        video.pause();
      }
    }
  }, [isPlaying, videoReady]);



  useEffect(() => {
    const mountElement = mountRef.current;
    if ((!imageUrl && !videoUrl) || !mountElement) return;

    const width = mountElement.offsetWidth || window.innerWidth;
    const height = mountElement.offsetHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    // A full-screen textured quad has no geometry edges, so MSAA buys nothing.
    // Fragment cost scales with DPR², so cap lower on coarse-pointer devices.
    const maxDpr = isTouchRef.current ? 1 : 1.5;
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
      precision: "highp",
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.pointerEvents = "none"; // This is the KEY fix for mobile scrolling!
    mountElement.appendChild(renderer.domElement);

    let texture: THREE.Texture;
    let videoElement: HTMLVideoElement | null = null;
    let updateImageRes: (() => void) | null = null;

    if (videoUrl && videoRef.current) {
      videoElement = videoRef.current;
      texture = new THREE.VideoTexture(videoElement);
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.generateMipmaps = false;
      texture.needsUpdate = true;

      updateImageRes = () => {
        if (materialRef.current?.uniforms?.uImageResolution && videoElement) {
          materialRef.current.uniforms.uImageResolution.value.set(
            videoElement.videoWidth || 1920,
            videoElement.videoHeight || 1080
          );
        }
      };

      videoElement.addEventListener('loadedmetadata', updateImageRes);
      videoElement.addEventListener('loadeddata', updateImageRes);
    } else if (imageUrl) {
      const textureLoader = new THREE.TextureLoader();
      texture = textureLoader.load(imageUrl, (loadedTexture) => {
        loadedTexture.magFilter = THREE.LinearFilter;
        loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
        loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
        loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
        loadedTexture.generateMipmaps = true;
        loadedTexture.needsUpdate = true;

        setTimeout(() => {
          if (materialRef.current?.uniforms?.uImageResolution) {
            materialRef.current.uniforms.uImageResolution.value.set(
              loadedTexture.image.width || 1920,
              loadedTexture.image.height || 1080
            );
          }
        }, 0);
      });
    } else {
      return;
    }

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

    // Resize: coalesced to one frame; also refreshes the cached canvas rect.
    let cachedRect = renderer.domElement.getBoundingClientRect();
    let resizeFrame = 0;
    const handleResize = () => {
      if (resizeFrame) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        const w = mountElement.offsetWidth;
        const h = mountElement.offsetHeight;
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
        material.uniforms.uResolution.value.set(w, h);
        cachedRect = renderer.domElement.getBoundingClientRect();
      });
    };

    window.addEventListener("resize", handleResize);

    // Pointer handlers only on fine-pointer devices. The rect is cached (refreshed
    // on enter, on resize and every 30 frames) so mousemove never forces layout.
    const pointerTarget = renderer.domElement.parentElement || renderer.domElement;
    const handleMouseMove = (event: MouseEvent) => {
      const rect = cachedRect;
      if (!rect.width || !rect.height) return;
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      mouseRef.current = { x, y };
    };
    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      cachedRect = renderer.domElement.getBoundingClientRect();
    };
    const handleMouseLeave = () => {
      isHoveredRef.current = false;
    };
    const hasPointerHandlers = !isTouchRef.current;
    if (hasPointerHandlers) {
      pointerTarget.addEventListener("mousemove", handleMouseMove, { passive: true });
      pointerTarget.addEventListener("mouseenter", handleMouseEnter);
      pointerTarget.addEventListener("mouseleave", handleMouseLeave);
    }

    // The loop only schedules itself while the hero is on screen; the observer
    // restarts it when the section scrolls back into view.
    let isVisible = true;
    let animFrameId = 0;
    let lastFrameTime = 0;
    let frameCount = 0;
    let renderedPausedFrame = false;

    const animate = (now: number) => {
      animFrameId = 0;
      if (!isVisible) return;
      animFrameId = requestAnimationFrame(animate);

      const mat = materialRef.current;
      const rend = rendererRef.current;
      const scn = sceneRef.current;
      if (!mat || !rend || !scn) return;

      // While the preloader covers the page, draw one frame and stop: a full-screen
      // shader pass during hydration is the most expensive thing on the page.
      if (!isPlayingRef.current) {
        if (!renderedPausedFrame) {
          renderedPausedFrame = true;
          rend.render(scn, camera);
        }
        return;
      }
      renderedPausedFrame = false;

      // Real frame delta (clamped) so motion speed is independent of refresh rate.
      const dt = lastFrameTime ? Math.min(now - lastFrameTime, 48) / 1000 : 0.016;
      lastFrameTime = now;
      timeRef.current += dt;

      if (hasPointerHandlers && ++frameCount % 30 === 0) {
        cachedRect = renderer.domElement.getBoundingClientRect();
      }

      mat.uniforms.time.value = timeRef.current;
      mat.uniforms.mouse.value.set(mouseRef.current.x, mouseRef.current.y);
      const targetIntensity = isHoveredRef.current && !isTouchRef.current
        ? hoverRippleRef.current
        : 0.3;
      const currentIntensity = mat.uniforms.hoverIntensity.value;
      mat.uniforms.hoverIntensity.value += (targetIntensity - currentIntensity) * transitionSpeedRef.current;
      // VideoTexture uploads new frames itself; forcing needsUpdate here re-uploaded
      // the texture every frame (and re-uploaded a static image forever).

      rend.render(scn, camera);
    };

    const startLoop = () => {
      if (!animFrameId) animFrameId = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        lastFrameTime = 0;
        if (hasPointerHandlers) cachedRect = renderer.domElement.getBoundingClientRect();
        startLoop();
      }
    }, { rootMargin: '200px' });
    observer.observe(mountElement);
    startLoop();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      if (hasPointerHandlers) {
        pointerTarget.removeEventListener("mousemove", handleMouseMove);
        pointerTarget.removeEventListener("mouseenter", handleMouseEnter);
        pointerTarget.removeEventListener("mouseleave", handleMouseLeave);
      }
      observer.disconnect();
      isVisible = false;
      if (animFrameId) cancelAnimationFrame(animFrameId);

      if (videoElement) {
        if (updateImageRes) {
          videoElement.removeEventListener('loadedmetadata', updateImageRes);
          videoElement.removeEventListener('loadeddata', updateImageRes);
        }
        videoElement.pause();
        videoElement.removeAttribute('src');
        videoElement.load();
        videoRef.current = null;
      }

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
    // Only a new media source justifies rebuilding the GL scene; the tunables
    // are pushed into uniforms by the effect below without recompiling shaders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, videoUrl]);

  useEffect(() => {
    hoverRippleRef.current = hoverRippleMultiplier;
    transitionSpeedRef.current = transitionSpeed;
    applyShaderTunables(materialRef.current, {
      waveIntensity, rippleIntensity, animationSpeed, waveFrequency, rippleFrequency, distortionAmount,
    });
  }, [waveIntensity, rippleIntensity, animationSpeed, waveFrequency, rippleFrequency, distortionAmount, hoverRippleMultiplier, transitionSpeed]);

  // Pointer state is driven by the DOM listeners inside the GL effect; the
  // React handlers that used to mirror it into unused state are gone.
  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black select-none"
      style={{ touchAction: 'auto' }} // Full touch action allowed on mobile
    >
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Overlay content */}
      <div className="relative z-10 flex flex-col items-start justify-end h-full p-8 md:p-16 pointer-events-none select-none">
        {children}
      </div>
    </section>
  );
}
