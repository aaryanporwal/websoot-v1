/* eslint-disable react/no-unknown-property */
import { useRef, useEffect, forwardRef } from "react";
import { Canvas, useFrame, useThree, invalidate } from "@react-three/fiber";
import { EffectComposer, wrapEffect } from "@react-three/postprocessing";
import { Effect } from "postprocessing";
import * as THREE from "three";

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
uniform vec2 blastOrigin;
uniform float blastAge;
uniform float catPhase;

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

float sdTriangle(vec2 p, vec2 p0, vec2 p1, vec2 p2) {
  vec2 e0 = p1 - p0;
  vec2 e1 = p2 - p1;
  vec2 e2 = p0 - p2;
  vec2 v0 = p - p0;
  vec2 v1 = p - p1;
  vec2 v2 = p - p2;
  vec2 pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
  vec2 pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
  vec2 pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);
  float s = sign(e0.x * e2.y - e0.y * e2.x);
  vec2 d = min(
    min(vec2(dot(pq0, pq0), s * (v0.x * e0.y - v0.y * e0.x)),
        vec2(dot(pq1, pq1), s * (v1.x * e1.y - v1.y * e1.x))),
    vec2(dot(pq2, pq2), s * (v2.x * e2.y - v2.y * e2.x))
  );
  return -sqrt(d.x) * sign(d.y);
}

float lineMask(vec2 p, vec2 a, vec2 b, float width) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return 1.0 - smoothstep(width, width + 0.004, length(pa - ba * h));
}

float ditherCat(vec2 screenUv, float aspect) {
  vec2 p = screenUv - vec2(aspect > 1.0 ? 0.76 : 0.62, 0.48);
  p.x *= aspect;
  p /= aspect > 1.0 ? 0.34 : 0.31;

  float head = 1.0 - smoothstep(0.96, 1.04, length(vec2(p.x / 0.29, (p.y + 0.01) / 0.25)));
  float cheekL = 1.0 - smoothstep(0.96, 1.04, length(vec2((p.x + 0.13) / 0.20, (p.y + 0.09) / 0.17)));
  float cheekR = 1.0 - smoothstep(0.96, 1.04, length(vec2((p.x - 0.13) / 0.20, (p.y + 0.09) / 0.17)));
  float earL = 1.0 - smoothstep(
    -0.026,
    0.026,
    sdTriangle(p, vec2(-0.26, 0.13), vec2(-0.19, 0.39), vec2(-0.04, 0.21))
  );
  float earR = 1.0 - smoothstep(
    -0.026,
    0.026,
    sdTriangle(p, vec2(0.26, 0.13), vec2(0.19, 0.39), vec2(0.04, 0.21))
  );
  float silhouette = max(max(head, max(cheekL, cheekR)), max(earL, earR));

  float eyeL = 1.0 - smoothstep(0.94, 1.08, length(vec2((p.x + 0.105) / 0.060, (p.y - 0.035) / 0.025)));
  float eyeR = 1.0 - smoothstep(0.94, 1.08, length(vec2((p.x - 0.105) / 0.060, (p.y - 0.035) / 0.025)));
  float pupilL = 1.0 - smoothstep(0.86, 1.08, length(vec2((p.x + 0.105) / 0.008, (p.y - 0.035) / 0.020)));
  float pupilR = 1.0 - smoothstep(0.86, 1.08, length(vec2((p.x - 0.105) / 0.008, (p.y - 0.035) / 0.020)));
  float nose = 1.0 - smoothstep(0.92, 1.08, length(vec2(p.x / 0.022, (p.y + 0.045) / 0.014)));
  float muzzleL = lineMask(p, vec2(0.0, -0.057), vec2(-0.028, -0.082), 0.004);
  float muzzleR = lineMask(p, vec2(0.0, -0.057), vec2(0.028, -0.082), 0.004);

  float whiskers = 0.0;
  whiskers += lineMask(p, vec2(-0.035, -0.075), vec2(-0.18, -0.065), 0.004);
  whiskers += lineMask(p, vec2(-0.18, -0.065), vec2(-0.31, -0.035), 0.004);
  whiskers += lineMask(p, vec2(-0.035, -0.10), vec2(-0.19, -0.115), 0.004);
  whiskers += lineMask(p, vec2(-0.19, -0.115), vec2(-0.31, -0.145), 0.004);
  whiskers += lineMask(p, vec2(0.035, -0.075), vec2(0.18, -0.065), 0.004);
  whiskers += lineMask(p, vec2(0.18, -0.065), vec2(0.31, -0.035), 0.004);
  whiskers += lineMask(p, vec2(0.035, -0.10), vec2(0.19, -0.115), 0.004);
  whiskers += lineMask(p, vec2(0.19, -0.115), vec2(0.31, -0.145), 0.004);

  float faceCuts = max(max(eyeL, eyeR), nose);
  float faceMarks = max(max(pupilL, pupilR), max(max(muzzleL, muzzleR), whiskers));
  float livingTexture = 0.60 + 0.34 * cnoise(p * 11.0 + time * 0.08);
  return max((silhouette * livingTexture) - faceCuts, faceMarks);
}

void main() {
  vec2 screenUv = gl_FragCoord.xy / resolution.xy;
  vec2 uv = screenUv;
  uv -= 0.5;
  uv.x *= resolution.x / resolution.y;
  float f = pattern(uv);

  if (catPhase > 0.001) {
    float dissolve = max(catPhase - 1.0, 0.0);
    float backgroundKeep = catPhase <= 1.0 ? 1.0 - catPhase : dissolve;
    f *= backgroundKeep;

    vec2 pixelCell = floor(gl_FragCoord.xy / 3.0);
    float pixelNoise = fract(sin(dot(pixelCell, vec2(12.9898, 78.233))) * 43758.5453);
    vec2 dustUv = screenUv;
    dustUv.x -= (pixelNoise - 0.5) * dissolve * 0.055;
    dustUv.y -= dissolve * (0.025 + pixelNoise * 0.085);

    float cat = ditherCat(dustUv, resolution.x / resolution.y);
    float particleKeep = 1.0 - smoothstep(
      pixelNoise - 0.12,
      pixelNoise + 0.12,
      dissolve
    );
    float catOpacity = catPhase <= 1.0 ? catPhase : particleKeep;
    float catMix = catOpacity * smoothstep(0.02, 0.18, cat) * 0.88;
    f = mix(f, max(f * 0.28, cat), catMix);
  }

  if (blastAge < 1.0) {
    vec2 blastUv = blastOrigin - 0.5;
    blastUv.y *= -1.0;
    blastUv.x *= resolution.x / resolution.y;

    float blastDistance = length(uv - blastUv);
    float blastRadius = mix(0.0, 0.12, blastAge);
    float blastWidth = mix(0.12, 0.035, blastAge);
    float ring = exp(-pow((blastDistance - blastRadius) / blastWidth, 2.0));
    float core = exp(-blastDistance * 10.0) * (1.0 - smoothstep(0.0, 0.38, blastAge));
    float decay = pow(1.0 - blastAge, 1.35);

    // Break the otherwise-perfect circle with the same living noise as the field.
    float breakup = 0.42 + 0.28 * cnoise(uv * 9.0 - blastAge * 2.0);
    f += (ring * breakup * 0.56 + core * 0.88) * decay;
  }

  if (enableMouseInteraction == 1) {
    vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
    mouseNDC.x *= resolution.x / resolution.y;
    float dist = length(uv - mouseNDC);
    float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
    f -= (0.5 + interactionStrength * 1.25) * effect;
  }
  vec3 col = mix(vec3(0.0), waveColor, f);
  gl_FragColor = vec4(col, 1.0);
}
`;

const ditherFragmentShader = `
precision highp float;
uniform float colorNum;
uniform float pixelSize;
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

vec3 dither(vec2 uv, vec3 color) {
  vec2 scaledCoord = floor(uv * resolution / pixelSize);
  int x = int(mod(scaledCoord.x, 8.0));
  int y = int(mod(scaledCoord.y, 8.0));
  float threshold = bayerMatrix8x8[y * 8 + x] - 0.25;
  float step = 1.0 / (colorNum - 1.0);
  color += threshold * step;
  float bias = 0.2;
  color = clamp(color - bias, 0.0, 1.0);
  return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
}

void mainImage(in vec4 inputColor, in vec2 uv, out vec4 outputColor) {
  vec2 normalizedPixelSize = pixelSize / resolution;
  vec2 uvPixel = normalizedPixelSize * floor(uv / normalizedPixelSize);
  vec4 color = texture2D(inputBuffer, uvPixel);
  color.rgb = dither(uv, color.rgb);
  outputColor = color;
}
`;

class RetroEffectImpl extends Effect {
  uniforms: Map<string, THREE.Uniform<number>>;

  constructor() {
    const uniforms = new Map([
      ["colorNum", new THREE.Uniform(4.0)],
      ["pixelSize", new THREE.Uniform(2.0)],
    ]);
    super("RetroEffect", ditherFragmentShader, { uniforms });
    this.uniforms = uniforms;
  }

  set colorNum(v: number) {
    this.uniforms.get("colorNum")!.value = v;
  }

  get colorNum() {
    return this.uniforms.get("colorNum")!.value;
  }

  set pixelSize(v: number) {
    this.uniforms.get("pixelSize")!.value = v;
  }

  get pixelSize() {
    return this.uniforms.get("pixelSize")!.value;
  }
}

const WrappedRetro = wrapEffect(RetroEffectImpl);

const RetroEffect = forwardRef<
  RetroEffectImpl,
  { colorNum: number; pixelSize: number }
>(({ colorNum, pixelSize }, ref) => {
  return (
    <WrappedRetro ref={ref} colorNum={colorNum} pixelSize={pixelSize} />
  );
});
RetroEffect.displayName = "RetroEffect";

type DitheredWavesProps = {
  waveSpeed: number;
  waveFrequency: number;
  waveAmplitude: number;
  waveColor: [number, number, number];
  colorNum: number;
  pixelSize: number;
  disableAnimation: boolean;
  enableMouseInteraction: boolean;
  mouseRadius: number;
  externalPointer: { clientX: number; clientY: number } | null;
  clickToken: number;
  blastOrigin: [number, number];
  catVisible: boolean;
  active: boolean;
};

function DitheredWaves({
  waveSpeed,
  waveFrequency,
  waveAmplitude,
  waveColor,
  colorNum,
  pixelSize,
  disableAnimation,
  enableMouseInteraction,
  mouseRadius,
  externalPointer,
  clickToken,
  blastOrigin,
  catVisible,
  active,
}: DitheredWavesProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const retroRef = useRef<RetroEffectImpl>(null);
  const previousClickToken = useRef(clickToken);
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
    blastOrigin: new THREE.Uniform(new THREE.Vector2(...blastOrigin)),
    blastAge: new THREE.Uniform(2),
    catPhase: new THREE.Uniform(0),
  });

  useEffect(() => {
    if (retroRef.current) {
      retroRef.current.pixelSize = 1;
    }
    invalidate();
  }, []);

  useEffect(() => {
    if (clickToken === previousClickToken.current) return;
    previousClickToken.current = clickToken;

    const uniforms = waveUniformsRef.current;
    uniforms.blastOrigin.value.set(...blastOrigin);
    uniforms.blastAge.value = 0;
    invalidate();
  }, [blastOrigin[0], blastOrigin[1], clickToken]);

  useEffect(() => {
    const dpr = gl.getPixelRatio();
    const w = Math.floor(size.width * dpr);
    const h = Math.floor(size.height * dpr);
    const res = waveUniformsRef.current.resolution.value;
    if (res.x !== w || res.y !== h) {
      res.set(w, h);
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
    if (catVisible) {
      u.catPhase.value = THREE.MathUtils.damp(
        u.catPhase.value,
        1,
        7,
        delta,
      );
    } else if (u.catPhase.value > 0) {
      u.catPhase.value += delta / 0.85;
      if (u.catPhase.value >= 2) u.catPhase.value = 0;
    }

    if (u.interactionStrength.value > 0) {
      u.interactionStrength.value = Math.max(
        0,
        u.interactionStrength.value - delta * 2.5,
      );
    }

    if (u.blastAge.value < 1) {
      u.blastAge.value = Math.min(1, u.blastAge.value + delta / 0.9);
    }

    if (retroRef.current && retroRef.current.pixelSize < pixelSize) {
      retroRef.current.pixelSize = Math.min(
        pixelSize,
        retroRef.current.pixelSize + delta * 2.5,
      );
    }
  });

  return (
    <>
      <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          vertexShader={waveVertexShader}
          fragmentShader={waveFragmentShader}
          uniforms={waveUniformsRef.current}
        />
      </mesh>

      <EffectComposer>
        <RetroEffect
          ref={retroRef}
          colorNum={colorNum}
          pixelSize={pixelSize}
        />
      </EffectComposer>
    </>
  );
}

export type DitherProps = {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: [number, number, number];
  colorNum?: number;
  pixelSize?: number;
  disableAnimation?: boolean;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
  externalPointer?: { clientX: number; clientY: number } | null;
  clickToken?: number;
  blastOrigin?: [number, number];
  catVisible?: boolean;
  active?: boolean;
};

export default function Dither({
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.3,
  waveColor = [0.5, 0.5, 0.5],
  colorNum = 4,
  pixelSize = 2,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1,
  externalPointer = null,
  clickToken = 0,
  blastOrigin = [0.5, 0.5],
  catVisible = false,
  active = true,
}: DitherProps) {
  return (
    <Canvas
      className="dither-container"
      camera={{ position: [0, 0, 6] }}
      dpr={1}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <DitheredWaves
        waveSpeed={waveSpeed}
        waveFrequency={waveFrequency}
        waveAmplitude={waveAmplitude}
        waveColor={waveColor}
        colorNum={colorNum}
        pixelSize={pixelSize}
        disableAnimation={disableAnimation}
        enableMouseInteraction={enableMouseInteraction}
        mouseRadius={mouseRadius}
        externalPointer={externalPointer}
        clickToken={clickToken}
        blastOrigin={blastOrigin}
        catVisible={catVisible}
        active={active}
      />
    </Canvas>
  );
}
