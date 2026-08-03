/* eslint-disable react/no-unknown-property */
import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree, invalidate } from "@react-three/fiber";
import * as THREE from "three";
import { createDijkstraField } from "./dijkstraField";

import "./Dither.css";

const waveVertexShader = `
precision highp float;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
}
`;

const waveFragmentShader = `
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform vec2 mousePos;
uniform int enableMouseInteraction;
uniform float mouseRadius;
uniform float interactionStrength;
uniform vec2 blastOriginA;
uniform vec2 blastOriginB;
uniform float blastAgeA;
uniform float blastAgeB;
uniform sampler2D algorithmField;
uniform float algorithmAge;
uniform int algorithmActive;
uniform float colorNum;

const float bayerMatrix8x8[64] = float[64](
  0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0,  3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
  32.0/64.0,16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0,19.0/64.0, 47.0/64.0, 31.0/64.0,
  8.0/64.0, 56.0/64.0,  4.0/64.0, 52.0/64.0, 11.0/64.0,59.0/64.0,  7.0/64.0, 55.0/64.0,
  40.0/64.0,24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0,27.0/64.0, 39.0/64.0, 23.0/64.0,
  2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0,  1.0/64.0,49.0/64.0, 13.0/64.0, 61.0/64.0,
  34.0/64.0,18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0,17.0/64.0, 45.0/64.0, 29.0/64.0,
  10.0/64.0,58.0/64.0,  6.0/64.0, 54.0/64.0,  9.0/64.0,57.0/64.0,  5.0/64.0, 53.0/64.0,
  42.0/64.0,26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0,25.0/64.0, 37.0/64.0, 21.0/64.0
);

vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

const int OCTAVES = 4;
float fbm(vec2 p) {
  float value = 0.0;
  float amp = 1.0;
  float freq = waveFrequency;
  for (int i = 0; i < OCTAVES; i++) {
    value += amp * abs(cnoise(p));
    p *= freq;
    amp *= waveAmplitude;
  }
  return value;
}

float pattern(vec2 p) {
  vec2 p2 = p - time * waveSpeed;
  return fbm(p + fbm(p2)); 
}

vec3 applyDither(vec2 uv, vec3 color) {
  vec2 scaledCoord = floor(uv * resolution);
  int x = int(mod(scaledCoord.x, 8.0));
  int y = int(mod(scaledCoord.y, 8.0));
  float threshold = bayerMatrix8x8[y * 8 + x] - 0.25;
  float step = 1.0 / (colorNum - 1.0);
  color += threshold * step;
  float bias = 0.2;
  color = clamp(color - bias, 0.0, 1.0);
  return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
}

float pixelBlast(vec2 uv, vec2 origin, float age) {
  if (age >= 1.0) return 0.0;

  vec2 blastUv = origin - 0.5;
  blastUv.y *= -1.0;
  blastUv.x *= resolution.x / resolution.y;
  float blastDistance = length(uv - blastUv);
  float blastRadius = mix(0.0, 0.12, age);
  float blastWidth = mix(0.12, 0.035, age);
  float ring = exp(-pow((blastDistance - blastRadius) / blastWidth, 2.0));
  float core = exp(-blastDistance * 10.0) * (1.0 - smoothstep(0.0, 0.38, age));
  float decay = pow(1.0 - age, 1.35);
  float breakup = 0.42 + 0.28 * cnoise(uv * 9.0 - age * 2.0);
  return (ring * breakup * 0.56 + core * 0.88) * decay;
}

void main() {
  vec2 screenUv = gl_FragCoord.xy / resolution.xy;
  vec2 uv = screenUv;
  uv -= 0.5;
  uv.x *= resolution.x / resolution.y;
  float f = pattern(uv);

  if (algorithmActive == 1) {
    vec4 field = texture2D(algorithmField, vec2(screenUv.x, 1.0 - screenUv.y));
    float rankedFromStart = step(0.001, field.r);
    float rankedFromEnd = step(0.001, field.b);
    float pathCell = step(0.001, field.g);
    float frontierProgress = clamp(algorithmAge / 0.9, 0.0, 1.0);
    float settledFromStart = rankedFromStart * (1.0 - smoothstep(frontierProgress, frontierProgress + 0.018, field.r));
    float settledFromEnd = rankedFromEnd * (1.0 - smoothstep(frontierProgress, frontierProgress + 0.018, field.b));
    float frontierFromStart = rankedFromStart * (1.0 - smoothstep(0.018, 0.065, abs(field.r - frontierProgress)));
    float frontierFromEnd = rankedFromEnd * (1.0 - smoothstep(0.018, 0.065, abs(field.b - frontierProgress)));
    float settled = max(settledFromStart, settledFromEnd);
    float frontier = max(frontierFromStart, frontierFromEnd);
    float routeProgress = clamp((algorithmAge - 0.9) / 0.25, 0.0, 1.0);
    float route = pathCell * (1.0 - smoothstep(routeProgress, routeProgress + 0.025, field.g));
    float trailOpacity = 1.0 - smoothstep(0.9, 1.15, algorithmAge);
    float dissolve = 1.0 - smoothstep(2.05, 2.5, algorithmAge);
    float terrainTexture = mix(0.62, 1.0, field.a);

    f = mix(f, f * 0.72, settled * trailOpacity * dissolve * 0.42);
    f += settled * trailOpacity * terrainTexture * dissolve * 0.18;
    f += frontier * terrainTexture * dissolve * 0.82;
    f = max(f, route * (1.12 + 0.08 * sin(time * 5.0)) * dissolve);
  }

  f += pixelBlast(uv, blastOriginA, blastAgeA);
  f += pixelBlast(uv, blastOriginB, blastAgeB);

  if (enableMouseInteraction == 1) {
    vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
    mouseNDC.x *= resolution.x / resolution.y;
    float dist = length(uv - mouseNDC);
    float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
    f -= (0.5 + interactionStrength * 1.25) * effect;
  }
  vec3 col = mix(vec3(0.0), waveColor, f);
  col = applyDither(gl_FragCoord.xy / resolution.xy, col);
  gl_FragColor = vec4(col, 1.0);
}
`;

type DitheredWavesProps = {
  waveSpeed: number;
  waveFrequency: number;
  waveAmplitude: number;
  waveColor: [number, number, number];
  colorNum: number;
  disableAnimation: boolean;
  enableMouseInteraction: boolean;
  mouseRadius: number;
  interactionToken: number;
  pathStart: [number, number] | null;
  pathEnd: [number, number] | null;
  active: boolean;
  maxFps: number;
};

function DitheredWaves({
  waveSpeed,
  waveFrequency,
  waveAmplitude,
  waveColor,
  colorNum,
  disableAnimation,
  enableMouseInteraction,
  mouseRadius,
  interactionToken,
  pathStart,
  pathEnd,
  active,
  maxFps,
}: DitheredWavesProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const previousInteractionToken = useRef(-1);
  const { viewport, size, gl } = useThree();

  const waveUniformsRef = useRef({
    time: new THREE.Uniform(0),
    resolution: new THREE.Uniform(new THREE.Vector2(0, 0)),
    waveSpeed: new THREE.Uniform(waveSpeed),
    waveFrequency: new THREE.Uniform(waveFrequency),
    waveAmplitude: new THREE.Uniform(waveAmplitude),
    waveColor: new THREE.Uniform(new THREE.Color(...waveColor)),
    mousePos: new THREE.Uniform(new THREE.Vector2(0, 0)),
    enableMouseInteraction: new THREE.Uniform(enableMouseInteraction ? 1 : 0),
    mouseRadius: new THREE.Uniform(mouseRadius),
    interactionStrength: new THREE.Uniform(0),
    blastOriginA: new THREE.Uniform(new THREE.Vector2(0.5, 0.5)),
    blastOriginB: new THREE.Uniform(new THREE.Vector2(0.5, 0.5)),
    blastAgeA: new THREE.Uniform(2),
    blastAgeB: new THREE.Uniform(2),
    algorithmField: new THREE.Uniform(null),
    algorithmAge: new THREE.Uniform(3),
    algorithmActive: new THREE.Uniform(0),
    colorNum: new THREE.Uniform(colorNum),
  });
  const algorithmTextureRef = useRef<THREE.DataTexture | null>(null);

  useEffect(() => {
    invalidate();
  }, []);

  useEffect(() => {
    if (!active) return;

    let raf = 0;
    let last = 0;
    const interval = 1000 / maxFps;

    const tick = (now: number) => {
      if (now - last >= interval) {
        last = now;
        invalidate();
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, maxFps]);

  useEffect(() => {
    if (
      interactionToken <= 0 ||
      !pathStart ||
      size.width <= 0 ||
      size.height <= 0
    ) {
      return;
    }

    const uniforms = waveUniformsRef.current;
    const interactionChanged =
      interactionToken !== previousInteractionToken.current;
    if (interactionChanged) {
      previousInteractionToken.current = interactionToken;
      uniforms.blastOriginA.value.set(...pathStart);
      uniforms.blastAgeA.value = 0;
    }

    if (!pathEnd) {
      uniforms.blastAgeB.value = 2;
      uniforms.algorithmActive.value = 0;
      invalidate();
      return;
    }

    if (interactionChanged) {
      uniforms.blastOriginA.value.set(...pathStart);
      uniforms.blastOriginB.value.set(...pathEnd);
      uniforms.blastAgeA.value = 0;
      uniforms.blastAgeB.value = 0;
    }

    const landscape = size.width >= size.height;
    const width = landscape ? 140 : 90;
    const height = landscape ? 90 : 140;
    const field = createDijkstraField(
      width,
      height,
      { x: pathEnd[0], y: pathEnd[1] },
      { x: pathStart[0], y: pathStart[1] },
    );
    const texture = new THREE.DataTexture(
      field.data,
      field.width,
      field.height,
      THREE.RGBAFormat,
      THREE.UnsignedByteType,
    );
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;

    algorithmTextureRef.current?.dispose();
    algorithmTextureRef.current = texture;
    uniforms.algorithmField.value = texture;
    uniforms.algorithmAge.value = 0;
    uniforms.algorithmActive.value = 1;
    invalidate();
  }, [
    interactionToken,
    pathStart?.[0],
    pathStart?.[1],
    pathEnd?.[0],
    pathEnd?.[1],
    size.width,
    size.height,
  ]);

  useEffect(
    () => () => {
      algorithmTextureRef.current?.dispose();
    },
    [],
  );

  useEffect(() => {
    const dpr = gl.getPixelRatio();
    const w = Math.floor(size.width * dpr);
    const h = Math.floor(size.height * dpr);
    const res = waveUniformsRef.current.resolution.value;
    if (res.x !== w || res.y !== h) {
      res.set(w, h);
      invalidate();
    }
  }, [size, gl]);

  const prevColor = useRef([...waveColor]);
  useFrame(({ clock }, delta) => {
    if (!active) return;

    const u = waveUniformsRef.current;

    if (!disableAnimation) {
      u.time.value = clock.getElapsedTime();
    }

    if (u.waveSpeed.value !== waveSpeed) u.waveSpeed.value = waveSpeed;
    if (u.waveFrequency.value !== waveFrequency)
      u.waveFrequency.value = waveFrequency;
    if (u.waveAmplitude.value !== waveAmplitude)
      u.waveAmplitude.value = waveAmplitude;

    if (!prevColor.current.every((v, i) => v === waveColor[i])) {
      u.waveColor.value.set(...waveColor);
      prevColor.current = [...waveColor];
    }

    u.enableMouseInteraction.value = enableMouseInteraction ? 1 : 0;
    u.mouseRadius.value = mouseRadius;
    u.colorNum.value = colorNum;

    if (u.algorithmActive.value === 1) {
      u.algorithmAge.value = Math.min(2.5, u.algorithmAge.value + delta);
      if (u.algorithmAge.value >= 2.5) u.algorithmActive.value = 0;
    }

    if (u.interactionStrength.value > 0) {
      u.interactionStrength.value = Math.max(
        0,
        u.interactionStrength.value - delta * 2.5,
      );
    }

    if (u.blastAgeA.value < 1)
      u.blastAgeA.value = Math.min(1, u.blastAgeA.value + delta / 0.9);
    if (u.blastAgeB.value < 1)
      u.blastAgeB.value = Math.min(1, u.blastAgeB.value + delta / 0.9);

  });

  return (
    <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={waveVertexShader}
        fragmentShader={waveFragmentShader}
        uniforms={waveUniformsRef.current}
      />
    </mesh>
  );
}

export type DitherProps = {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: [number, number, number];
  colorNum?: number;
  disableAnimation?: boolean;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
  interactionToken?: number;
  pathStart?: [number, number] | null;
  pathEnd?: [number, number] | null;
  active?: boolean;
  maxFps?: number;
};

export default function Dither({
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.3,
  waveColor = [0.5, 0.5, 0.5],
  colorNum = 4,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1,
  interactionToken = 0,
  pathStart = null,
  pathEnd = null,
  active = true,
  maxFps = 30,
}: DitherProps) {
  return (
    <Canvas
      className="dither-container"
      camera={{ position: [0, 0, 6] }}
      dpr={1}
      frameloop="demand"
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <DitheredWaves
        waveSpeed={waveSpeed}
        waveFrequency={waveFrequency}
        waveAmplitude={waveAmplitude}
        waveColor={waveColor}
        colorNum={colorNum}
        disableAnimation={disableAnimation}
        enableMouseInteraction={enableMouseInteraction}
        mouseRadius={mouseRadius}
        interactionToken={interactionToken}
        pathStart={pathStart}
        pathEnd={pathEnd}
        active={active}
        maxFps={maxFps}
      />
    </Canvas>
  );
}
