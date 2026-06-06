"use client";
import { useEffect, useRef } from "react";
import {
  fluidFragShader,
  fluidVertShader,
  renderFragShader,
  renderVertShader,
} from "./shaders";

type FluidSimOptions = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  imageUrl?: string;
  videoEl?: HTMLVideoElement | null;
  strength?: number;
  brushRadius?: number;
  dissipation?: number;
};

export function useFluidSim({
  canvasRef,
  imageUrl,
  videoEl,
  strength = 0.12,
  brushRadius = 0.08,
  dissipation = 0.97,
}: FluidSimOptions) {
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const velocityRef = useRef({ x: 0.0, y: 0.0 });
  const isDownRef = useRef(false);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // --- Compile helpers ---
    const compileShader = (type: number, src: string): WebGLShader => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
      }
      return shader;
    };

    const createProgram = (vert: string, frag: string): WebGLProgram => {
      const prog = gl.createProgram()!;
      gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vert));
      gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, frag));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error("Program link error:", gl.getProgramInfoLog(prog));
      }
      return prog;
    };

    // --- Full-screen quad ---
    const quadBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1, 0, 0,
         1, -1, 1, 0,
        -1,  1, 0, 1,
         1,  1, 1, 1,
      ]),
      gl.STATIC_DRAW
    );

    const bindQuad = (prog: WebGLProgram) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      const pos = gl.getAttribLocation(prog, "position");
      const uvLoc = gl.getAttribLocation(prog, "uv");
      gl.enableVertexAttribArray(pos);
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 16, 0);
      gl.enableVertexAttribArray(uvLoc);
      gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 16, 8);
    };

    // --- Programs ---
    const fluidProgram = createProgram(fluidVertShader, fluidFragShader);
    const renderProgram = createProgram(renderVertShader, renderFragShader);

    // --- FBO creation (size-aware) ---
    type FBO = { tex: WebGLTexture; fbo: WebGLFramebuffer };

    const createFBO = (w: number, h: number): FBO => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return { tex, fbo };
    };

    let W = 0, H = 0;
    let read: FBO, write: FBO;

    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (w === W && h === H) return;
      W = w; H = h;
      canvas.width = W;
      canvas.height = H;
      gl.viewport(0, 0, W, H);
      read = createFBO(W, H);
      write = createFBO(W, H);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // --- Image / video texture ---
    const imageTex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, imageTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0,0,0,255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    let mediaReady = false;

    if (imageUrl) {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, imageTex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        mediaReady = true;
      };
      img.onerror = (e) => console.error("Image load error:", e);
      img.src = imageUrl;
    }

    // --- Render loop ---
    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);

      // Video frame update
      if (videoEl && videoEl.readyState >= 2) {
        gl.bindTexture(gl.TEXTURE_2D, imageTex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, videoEl);
        mediaReady = true;
      }

      // Decay velocity each frame
      velocityRef.current.x *= 0.85;
      velocityRef.current.y *= 0.85;

      // Dynamic adjustments based on mouse click / drag
      let currentBrushRadius = brushRadius;
      let currentDissipation = dissipation;
      if (isDownRef.current) {
        currentBrushRadius = brushRadius * 1.5;
        currentDissipation = Math.min(0.99, dissipation + 0.015);
      }

      // --- Pass 1: fluid update ---
      gl.bindFramebuffer(gl.FRAMEBUFFER, write.fbo);
      gl.viewport(0, 0, W, H);
      gl.useProgram(fluidProgram);
      bindQuad(fluidProgram);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, read.tex);
      gl.uniform1i(gl.getUniformLocation(fluidProgram, "tMap"), 0);
      gl.uniform2f(gl.getUniformLocation(fluidProgram, "uMouse"), mouseRef.current.x, mouseRef.current.y);
      gl.uniform2f(gl.getUniformLocation(fluidProgram, "uVelocity"), velocityRef.current.x, velocityRef.current.y);
      gl.uniform1f(gl.getUniformLocation(fluidProgram, "uBrushRadius"), currentBrushRadius);
      gl.uniform1f(gl.getUniformLocation(fluidProgram, "uDissipation"), currentDissipation);
      gl.uniform2f(gl.getUniformLocation(fluidProgram, "uTexelSize"), 1.0 / W, 1.0 / H);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      // Swap ping-pong buffers
      const temp = read;
      read = write;
      write = temp;

      if (!mediaReady) return;

      // --- Pass 2: render distorted image ---
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, W, H);
      gl.useProgram(renderProgram);
      bindQuad(renderProgram);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, imageTex);
      gl.uniform1i(gl.getUniformLocation(renderProgram, "tImage"), 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, read.tex);
      gl.uniform1i(gl.getUniformLocation(renderProgram, "tFluid"), 1);

      gl.uniform1f(gl.getUniformLocation(renderProgram, "uStrength"), strength);
      gl.uniform2f(gl.getUniformLocation(renderProgram, "uTexelSize"), 1.0 / W, 1.0 / H);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    render();

    // --- Mouse / touch input ---
    let lastX = 0.5, lastY = 0.5;
    let initialized = false;

    const updateMouse = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = 1.0 - (clientY - rect.top) / rect.height;

      if (!initialized) {
        lastX = x;
        lastY = y;
        initialized = true;
      }

      const forceScale = isDownRef.current ? 12.0 : 6.0;
      velocityRef.current.x = (x - lastX) * forceScale;
      velocityRef.current.y = (y - lastY) * forceScale;
      lastX = x;
      lastY = y;
      mouseRef.current = { x, y };
    };

    const onMouseMove = (e: MouseEvent) => updateMouse(e.clientX, e.clientY);
    const onMouseDown = (e: MouseEvent) => {
      isDownRef.current = true;
      updateMouse(e.clientX, e.clientY);
    };
    const onMouseUp = () => { isDownRef.current = false; };
    const onMouseLeave = () => { isDownRef.current = false; };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      updateMouse(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchStart = (e: TouchEvent) => {
      isDownRef.current = true;
      updateMouse(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => { isDownRef.current = false; };

    const eventTarget = canvas.parentElement || canvas;

    eventTarget.addEventListener("mousemove", onMouseMove);
    eventTarget.addEventListener("mousedown", onMouseDown);
    eventTarget.addEventListener("mouseup", onMouseUp);
    eventTarget.addEventListener("mouseleave", onMouseLeave);
    eventTarget.addEventListener("touchmove", onTouchMove, { passive: false });
    eventTarget.addEventListener("touchstart", onTouchStart);
    eventTarget.addEventListener("touchend", onTouchEnd);
    eventTarget.addEventListener("touchcancel", onTouchEnd);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      ro.disconnect();
      eventTarget.removeEventListener("mousemove", onMouseMove);
      eventTarget.removeEventListener("mousedown", onMouseDown);
      eventTarget.removeEventListener("mouseup", onMouseUp);
      eventTarget.removeEventListener("mouseleave", onMouseLeave);
      eventTarget.removeEventListener("touchmove", onTouchMove);
      eventTarget.removeEventListener("touchstart", onTouchStart);
      eventTarget.removeEventListener("touchend", onTouchEnd);
      eventTarget.removeEventListener("touchcancel", onTouchEnd);
      gl.deleteTexture(imageTex);
      gl.deleteBuffer(quadBuffer);
    };
  }, [imageUrl, videoEl, strength, brushRadius, dissipation]);
}
