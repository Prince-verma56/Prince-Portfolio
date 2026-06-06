export const fluidVertShader = `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Pass 1: WebGL Wave Equation Propagation (shallow water ripples) + Velocity field
// rg: Velocity (fluid swirls)
// b: Current Height (h_t)
// a: Previous Height (h_t-1)
export const fluidFragShader = `
  precision highp float;
  uniform sampler2D tMap;
  uniform vec2 uMouse;
  uniform vec2 uVelocity;
  uniform float uBrushRadius;
  uniform float uDissipation;
  uniform vec2 uTexelSize;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec2 texel = uTexelSize;

    // Sample current pixel and neighbors
    vec4 center = texture2D(tMap, uv);
    vec4 top    = texture2D(tMap, uv + vec2(0.0,  texel.y));
    vec4 bottom = texture2D(tMap, uv + vec2(0.0, -texel.y));
    vec4 left   = texture2D(tMap, uv + vec2(-texel.x, 0.0));
    vec4 right  = texture2D(tMap, uv + vec2( texel.x, 0.0));

    // 1. WAVE EQUATION PROPAGATION (for circular waves)
    // h_t-1 is stored in center.a
    float H_prev = center.a;
    
    // Average of neighbors' height (stored in b channel)
    float H_diffused = (top.b + bottom.b + left.b + right.b) * 0.5;
    
    // wave equation: h_t+1 = 2 * h_t_diffused - h_t-1
    float H_new = H_diffused - H_prev;

    // Mouse input creates disturbance (splat / wave)
    float dist = length(uv - uMouse);
    float falloff = smoothstep(uBrushRadius, 0.0, dist);
    float heightForce = falloff * 0.15;
    
    H_new += heightForce;

    // Apply damping/viscosity to height wave propagation
    H_new *= uDissipation;

    // 2. VELOCITY FIELD (for organic swirling/stretching)
    vec4 diffusedVelocity = (top + bottom + left + right) * 0.25;
    vec2 force = uVelocity * falloff * 8.0;
    vec2 nextVelocity = mix(center.rg, diffusedVelocity.rg, 0.1) * uDissipation + force;

    // 3. COMBINE AND WRITE STATE
    vec4 nextState;
    nextState.rg = nextVelocity;
    nextState.b = H_new;        // Store new height in b channel (h_t+1)
    nextState.a = center.b;     // Store current height in a channel (h_t) as h_t-1 for next frame

    gl_FragColor = nextState;
  }
`;

// Pass 2: Render distorted image using refraction gradient from the propagating heightfield
export const renderVertShader = `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

export const renderFragShader = `
  precision highp float;
  uniform sampler2D tImage;
  uniform sampler2D tFluid;
  uniform float uStrength;
  uniform vec2 uTexelSize;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // Sample fluid at center
    vec4 fluid = texture2D(tFluid, uv);

    // Sample height (b) of neighbors to compute surface normals/slope
    float topHeight    = texture2D(tFluid, uv + vec2(0.0,  uTexelSize.y)).b;
    float bottomHeight = texture2D(tFluid, uv + vec2(0.0, -uTexelSize.y)).b;
    float leftHeight   = texture2D(tFluid, uv + vec2(-uTexelSize.x, 0.0)).b;
    float rightHeight  = texture2D(tFluid, uv + vec2( uTexelSize.x, 0.0)).b;

    // Slope of the water ripple (height gradient)
    vec2 heightGradient = vec2(rightHeight - leftHeight, topHeight - bottomHeight);

    // Combine fluid velocity offset (rg) and refractive slope offset (gradient)
    // This gives organic water ripple refraction + flow swirls
    vec2 distortion = fluid.rg * 0.12 + heightGradient * 0.88;

    // Distort UV and clamp
    vec2 distortedUV = uv - distortion * uStrength;
    distortedUV = clamp(distortedUV, 0.001, 0.999);

    gl_FragColor = texture2D(tImage, distortedUV);
  }
`;
