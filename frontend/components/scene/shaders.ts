// GLSL shader sources as template strings. Kept in one file for clarity.

// Ashima Arts 3D simplex noise (public domain / MIT). Compact, battle-tested.
export const SIMPLEX_3D = /* glsl */ `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

// ---------- Particle field ----------
export const FIELD_VERT = /* glsl */ `
uniform float uTime;
uniform float uPull;      // 0 -> dispersed, 1 -> collapsed to singularity
uniform float uSize;
uniform float uPixelRatio;
uniform float uTravel;    // hero -> inward dive amount
attribute float aScale;
attribute float aSeed;
attribute float aHue;     // 0 amber .. 1 steel
varying float vHue;
varying float vAlpha;
varying float vSeed;

${SIMPLEX_3D}

void main(){
  vHue = aHue;
  vSeed = aSeed;
  vec3 pos = position;

  // gentle organic drift
  float t = uTime * 0.06;
  vec3 drift = vec3(
    snoise(pos * 0.12 + vec3(t, 0.0, 0.0)),
    snoise(pos * 0.12 + vec3(0.0, t, 10.0)),
    snoise(pos * 0.12 + vec3(20.0, 0.0, t))
  );
  pos += drift * 0.6;

  // swirl around Y, stronger near center, accelerates during pull
  float r = length(pos.xz) + 0.001;
  float swirl = (0.25 + uPull * 1.6) / r;
  float ang = swirl * (0.6 + 0.4 * sin(aSeed * 6.2831));
  float c = cos(ang), s = sin(ang);
  pos.xz = mat2(c, -s, s, c) * pos.xz;

  // collapse toward a small glowing core when pulled
  vec3 core = normalize(pos + 0.0001) * mix(length(pos), 0.18, uPull);
  pos = mix(pos, core, uPull);

  // inward dive stretches the field toward the camera a touch
  pos.z += uTravel * (4.0 + aSeed * 3.0);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  float twinkle = 0.6 + 0.4 * sin(uTime * (0.6 + aSeed) + aSeed * 30.0);
  float dist = -mv.z;
  gl_PointSize = uSize * aScale * uPixelRatio * (1.0 + uPull * 1.5) * (8.0 / max(dist, 0.1));

  // fade far points and very-pulled points glow brighter
  vAlpha = clamp(1.2 - dist * 0.04, 0.0, 1.0) * twinkle * (0.7 + uPull * 0.6);
}
`;

export const FIELD_FRAG = /* glsl */ `
precision highp float;
uniform vec3 uAmber;
uniform vec3 uSteel;
uniform vec3 uBone;
varying float vHue;
varying float vAlpha;
varying float vSeed;

void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  // soft round sprite with a hot core
  float core = smoothstep(0.5, 0.0, d);
  float glow = pow(core, 2.2);

  vec3 col = mix(uAmber, uSteel, smoothstep(0.0, 1.0, vHue));
  // a few points pull toward bone white for sparkle
  col = mix(col, uBone, step(0.93, vSeed) * core);

  gl_FragColor = vec4(col, glow * vAlpha * 0.8);
}
`;

// ---------- Signal core (the "me" object) ----------
export const CORE_VERT = /* glsl */ `
uniform float uTime;
uniform float uEnergy;   // breathing / activity
uniform float uPull;
varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;

${SIMPLEX_3D}

void main(){
  vNormal = normalize(normalMatrix * normal);

  float t = uTime * 0.35;
  float n = snoise(normal * 1.6 + vec3(t));
  float n2 = snoise(normal * 3.4 - vec3(t * 0.7));
  float disp = (n * 0.6 + n2 * 0.25) * (0.22 + uEnergy * 0.22);
  // a sharp pulse outward during the singularity
  disp += uPull * 0.12 * sin(uTime * 6.0 + n * 6.0);
  vDisp = disp;

  vec3 pos = position + normal * disp;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

export const CORE_FRAG = /* glsl */ `
precision highp float;
uniform vec3 uColor;
uniform vec3 uColor2;
uniform float uEnergy;
varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;

void main(){
  float fres = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0), 2.4);
  vec3 base = mix(uColor * 0.12, uColor2, smoothstep(-0.2, 0.3, vDisp));
  vec3 rim = uColor * (0.9 + uEnergy * 0.7);
  vec3 col = base + rim * fres;
  // keep it emissive enough that bloom catches the rim, but not so bright it veils the text
  float a = 0.12 + fres * 0.6;
  gl_FragColor = vec4(col, a);
}
`;
