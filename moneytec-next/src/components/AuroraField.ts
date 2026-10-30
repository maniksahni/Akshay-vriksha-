/**
 * A full-bleed liquid light field in raw WebGL (no three.js): domain-warped noise painted in warm black,
 * bronze and champagne gold, with a soft lens of light that follows the pointer. Cheap enough for laptops; phones
 * render it at a lower resolution and frame rate.
 */
export type AuroraHandle = { setPointer: (x: number, y: number) => void; setScroll: (p: number) => void; dispose: () => void };

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uScroll;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++){ v += a * noise(p); p = r * p * 2.02; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.045;

  // pointer lens: space bends gently toward the cursor
  vec2 m = (uMouse * vec2(uRes.x / uRes.y, 1.0)) * 0.5;
  float d = length(p - m);
  p += (p - m) * 0.18 * exp(-d * 3.0);

  vec2 q = vec2(fbm(p * 1.4 + t), fbm(p * 1.4 - t + 3.1));
  vec2 r = vec2(fbm(p * 1.6 + 2.2 * q + vec2(1.7, 9.2) + t * 1.3), fbm(p * 1.6 + 2.2 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p * 1.2 + 2.6 * r);

  vec3 ink = vec3(0.043, 0.039, 0.035);
  vec3 amber = vec3(0.91, 0.81, 0.63);
  vec3 rose = vec3(0.79, 0.63, 0.42);
  vec3 violet = vec3(0.36, 0.27, 0.18);

  vec3 col = mix(ink, violet * 0.55, smoothstep(0.25, 0.85, f));
  col = mix(col, rose * 0.85, smoothstep(0.45, 0.95, length(q) * f));
  col = mix(col, amber, smoothstep(0.72, 1.08, r.x * f * 1.35) * 0.8);

  // silk ribbons: thin bright contours through the field
  float bands = abs(sin(f * 18.0 + t * 6.0));
  col += vec3(1.0, 0.9, 0.75) * pow(1.0 - bands, 22.0) * 0.08 * smoothstep(0.35, 0.8, f);

  col += rose * 0.22 * exp(-d * 4.5);                      // light under the pointer
  col *= 1.0 - smoothstep(0.35, 1.25, length((uv - vec2(0.5, 0.45)) * vec2(1.35, 1.0))); // vignette
  col *= 0.5 - uScroll * 0.32;                            // dims as you leave the hero
  col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.025;     // film grain to break banding
  gl_FragColor = vec4(col, 1.0);
}`;

export function mountAurora(canvas: HTMLCanvasElement, { phone, still }: { phone: boolean; still: boolean }): AuroraHandle {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: 'high-performance' });
  if (!gl) throw new Error('no webgl');
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uRes = gl.getUniformLocation(prog, 'uRes'), uTime = gl.getUniformLocation(prog, 'uTime');
  const uMouse = gl.getUniformLocation(prog, 'uMouse'), uScroll = gl.getUniformLocation(prog, 'uScroll');

  // the field is soft by nature, so it renders below native resolution and is scaled up by CSS
  const scale = phone ? 0.35 : 0.5;
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(r.width * scale));
    canvas.height = Math.max(1, Math.round(r.height * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
  };
  resize();

  let mx = 0.25, my = 0, tx = 0.25, ty = 0, scroll = 0, raf = 0, running = false, visible = true, last = 0;
  const t0 = performance.now();
  const frame = (now: number) => {
    if (running) raf = requestAnimationFrame(frame);
    if (phone && now - last < 33) return; // ~30fps on phones
    last = now;
    mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
    gl.uniform1f(uTime, still ? 12 : (now - t0) / 1000 + 12);
    gl.uniform2f(uMouse, mx, my);
    gl.uniform1f(uScroll, scroll);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const start = () => {
    if (still) { frame(performance.now()); return; }
    if (!running && visible && !document.hidden) { running = true; raf = requestAnimationFrame(frame); }
  };
  const stop = () => { running = false; cancelAnimationFrame(raf); };
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); });
  io.observe(canvas);
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVis);
  const ro = new ResizeObserver(() => { resize(); if (still) frame(performance.now()); });
  ro.observe(canvas);
  start();

  return {
    setPointer: (x, y) => { tx = x; ty = -y; },
    setScroll: (p) => { scroll = p; if (still) frame(performance.now()); },
    dispose: () => {
      stop(); io.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      gl.deleteBuffer(buf); gl.deleteProgram(prog);
    },
  };
}
