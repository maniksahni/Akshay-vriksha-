import {
  ACESFilmicToneMapping, AdditiveBlending, DoubleSide, AmbientLight, BackSide, BoxGeometry, BufferGeometry, CanvasTexture, Color, ExtrudeGeometry,
  Float32BufferAttribute, Group, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, Object3D,
  PerspectiveCamera, PlaneGeometry, PMREMGenerator, PointLight, Points, Scene, ShaderMaterial, SRGBColorSpace, Sprite, SpriteMaterial,
  TorusGeometry, WebGLRenderer,
} from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

import { RUPEE_PATH } from './rupeePath';

/** Where the ₹ should be: x across the screen (0..1), y from centre (-1 top .. 1 bottom), size, extra spin, glow 0..1. */
export type RupeePose = { x: number; y: number; s: number; spin: number; glow: number };
export type RupeeHandle = { setPose: (p: RupeePose, immediate?: boolean) => void; setPointer: (x: number, y: number) => void; setVelocity: (v: number) => void; kick: () => void; dispose: () => void };

/**
 * A studio built from the brand's own light: long softboxes in amber, rose and violet plus white strips, so
 * the chrome reflects the palette instead of a grey room.
 */
function brandStudio() {
  const room = new Scene();
  room.add(new Mesh(new BoxGeometry(20, 14, 20), new MeshBasicMaterial({ color: '#07060B', side: BackSide })));
  const panel = (w: number, h: number, color: string, x: number, y: number, z: number, ry = 0, rx = 0, k = 1) => {
    const m = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color: new Color(color).multiplyScalar(k), side: DoubleSide }));
    m.position.set(x, y, z); m.rotation.set(rx, ry, 0);
    room.add(m);
  };
  panel(9, 2.2, '#FF9F0A', -6, 4, 2, Math.PI / 2.4, -0.3, 3.2);   // warm key, upper left
  panel(9, 2.6, '#FF375F', 7, 0, 1, -Math.PI / 2.2, 0, 3.4);       // rose fill, right
  panel(12, 3, '#BF5AF2', 0, -5.5, 2, 0, -Math.PI / 2, 3.4);       // violet floor bounce
  panel(14, 0.35, '#ffffff', 0, 6.5, 3, 0, Math.PI / 2, 6);        // white strips for crisp glints
  panel(0.35, 10, '#ffffff', -8, 0, -3, Math.PI / 3, 0, 5);
  panel(10, 7, '#FFE6F2', 0, 1, 9.5, Math.PI, 0, 2.4);              // soft front so faces never go black
  return room;
}

/** Soft points with per-point size and colour, twinkling, round and additive. */
function glowPoints(pixel: number) {
  return new ShaderMaterial({
    transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPixel: { value: pixel }, uFade: { value: 1 } },
    vertexShader: `
      attribute float aSize; attribute float aSeed; attribute vec3 color;
      uniform float uTime; uniform float uPixel;
      varying vec3 vColor; varying float vTw;
      void main(){
        vColor = color;
        vTw = 0.55 + 0.45 * sin(uTime * (1.2 + aSeed * 2.0) + aSeed * 40.0);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * uPixel * (10.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform float uFade; varying vec3 vColor; varying float vTw;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        a = a * a;
        gl_FragColor = vec4(vColor * (1.0 + a), a * vTw * uFade);
      }`,
  });
}

/**
 * The hero ₹: solid iridescent chrome extruded from the brand outline, wrapped in a fresnel aura, framed by a
 * milled coin edge, circled by a slow galaxy of light and lifted by rising sparks. It arrives spinning out of
 * depth, leans toward the pointer and glides to whatever pose the page asks for as you scroll.
 */
export function mountRupee(canvas: HTMLCanvasElement, { phone, still, pose }: { phone: boolean; still: boolean; pose: RupeePose }): RupeeHandle {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: phone ? 'default' : 'high-performance' });
  const dpr = Math.min(window.devicePixelRatio || 1, phone ? 1.5 : 1.5);
  renderer.setPixelRatio(dpr);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  const pmrem = new PMREMGenerator(renderer);
  const env = pmrem.fromScene(brandStudio(), 0.03).texture;
  scene.environment = env;

  // ---- the ₹
  const shapes = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${RUPEE_PATH}"/></svg>`).paths[0].toShapes(true);
  const geo = new ExtrudeGeometry(shapes, { depth: 60, bevelEnabled: true, bevelThickness: 10, bevelSize: 6, bevelSegments: phone ? 5 : 10, curveSegments: phone ? 18 : 40 });
  geo.center();
  geo.computeVertexNormals();
  // the same iridescent chrome everywhere; phones skip only the clearcoat layer, which costs most per pixel
  const chrome = new MeshPhysicalMaterial({
    color: new Color('#fff0f6'), metalness: 1, roughness: 0.1, clearcoat: phone ? 0 : 1, clearcoatRoughness: 0.03,
    iridescence: 0.85, iridescenceIOR: 1.8, iridescenceThicknessRange: [200, 820], envMapIntensity: 1.35,
  });
  const rupee = new Mesh(geo, chrome);
  const s = 3.1 / 255;
  rupee.scale.set(s, -s, s); // SVG y runs down

  // fresnel aura: the same shape, slightly larger, glowing only at its silhouette
  const aura = new Mesh(geo, new ShaderMaterial({
    transparent: true, depthWrite: false, blending: AdditiveBlending, side: BackSide,
    uniforms: { uTime: { value: 0 }, uPower: { value: 1 } },
    vertexShader: `
      varying vec3 vN; varying vec3 vV; varying float vY;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position + normal * 7.0, 1.0);
        vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); vY = position.y;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform float uTime; uniform float uPower; varying vec3 vN; varying vec3 vV; varying float vY;
      void main(){
        float f = pow(1.0 - abs(dot(vN, vV)), 2.2);
        float k = clamp(vY / 260.0 + 0.5 + 0.15 * sin(uTime * 0.8), 0.0, 1.0);
        vec3 c = mix(vec3(1.0, 0.62, 0.1), vec3(1.0, 0.22, 0.42), smoothstep(0.0, 0.55, k));
        c = mix(c, vec3(0.75, 0.35, 0.95), smoothstep(0.5, 1.0, k));
        gl_FragColor = vec4(c, f * 0.75 * uPower);
      }`,
  }));
  aura.scale.copy(rupee.scale);

  // ---- coin edge: a polished ring, a glowing inner line and milled ticks
  const coin = new Group();
  const ringMat = new MeshStandardMaterial({ color: '#f1e4ff', metalness: 1, roughness: 0.14, envMapIntensity: 1.4 });
  coin.add(new Mesh(new TorusGeometry(2.55, 0.055, 24, 260), ringMat));
  coin.add(new Mesh(new TorusGeometry(2.38, 0.012, 8, 260), new MeshStandardMaterial({ color: '#FF9F0A', emissive: new Color('#FF375F'), emissiveIntensity: 1.2 })));
  coin.add(new Mesh(new TorusGeometry(2.95, 0.006, 6, 260), new MeshBasicMaterial({ color: new Color('#FFB340').multiplyScalar(1.4), transparent: true, opacity: 0.5 })));
  const TICKS = phone ? 90 : 160;
  const ticks = new InstancedMesh(new BoxGeometry(0.018, 0.13, 0.05), new MeshStandardMaterial({ color: '#ffffff', metalness: 1, roughness: 0.25, emissive: new Color('#BF5AF2'), emissiveIntensity: 0.5 }), TICKS);
  const m = new Matrix4(), o = new Object3D();
  for (let i = 0; i < TICKS; i++) {
    const a = (i / TICKS) * Math.PI * 2;
    o.position.set(Math.cos(a) * 2.72, Math.sin(a) * 2.72, 0);
    o.rotation.set(0, 0, a - Math.PI / 2);
    o.scale.setScalar(i % 5 === 0 ? 1.7 : 1);
    o.updateMatrix();
    ticks.setMatrixAt(i, m.copy(o.matrix));
  }
  coin.add(ticks);

  // ---- halo and a lens flare core behind the mark
  const radial = (stops: [number, string][]) => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d')!, gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    stops.forEach(([o2, col]) => gr.addColorStop(o2, col));
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    return new CanvasTexture(c);
  };
  const halo = new Sprite(new SpriteMaterial({ map: radial([[0, 'rgba(255,55,95,0.7)'], [0.35, 'rgba(191,90,242,0.28)'], [1, 'rgba(0,0,0,0)']]), blending: AdditiveBlending, depthWrite: false, transparent: true }));
  halo.scale.set(10, 10, 1);
  halo.position.z = -1.6;
  const core = new Sprite(new SpriteMaterial({ map: radial([[0, 'rgba(255,240,245,0.9)'], [0.15, 'rgba(255,170,90,0.35)'], [1, 'rgba(0,0,0,0)']]), blending: AdditiveBlending, depthWrite: false, transparent: true }));
  core.scale.set(3.6, 3.6, 1);
  core.position.z = -1.1;

  // ---- a galaxy of light orbiting the coin, inner stars faster than outer ones
  const G = 0; // the galaxy is retired for a calmer, more precious mark
  const gPos = new Float32Array(G * 3), gCol = new Float32Array(G * 3), gSize = new Float32Array(G), gSeed = new Float32Array(G);
  const gRad = new Float32Array(G), gAng = new Float32Array(G), gH = new Float32Array(G);
  const warm = [new Color('#FFB340'), new Color('#FF375F'), new Color('#BF5AF2'), new Color('#ffd6f0'), new Color('#ffffff')];
  for (let i = 0; i < G; i++) {
    const arm = i % 3;
    const r = 3.1 + Math.pow(Math.random(), 1.8) * 2.6;
    gRad[i] = r;
    gAng[i] = (arm / 3) * Math.PI * 2 + r * 0.9 + (Math.random() - 0.5) * 0.9;
    gH[i] = (Math.random() - 0.5) * 0.25 * (r - 2.6);
    const c = warm[Math.min(4, Math.floor(Math.random() * 5))];
    gCol.set([c.r, c.g, c.b], i * 3);
    gSize[i] = 0.6 + Math.random() * (Math.random() < 0.06 ? 3.2 : 1.4);
    gSeed[i] = Math.random();
  }
  const galaxyGeo = new BufferGeometry();
  galaxyGeo.setAttribute('position', new Float32BufferAttribute(gPos, 3));
  galaxyGeo.setAttribute('color', new Float32BufferAttribute(gCol, 3));
  galaxyGeo.setAttribute('aSize', new Float32BufferAttribute(gSize, 1));
  galaxyGeo.setAttribute('aSeed', new Float32BufferAttribute(gSeed, 1));
  const pt = phone ? 0.5 : 1; // phones sit the camera closer, so points need less size
  const galaxyMat = glowPoints(dpr * 9 * pt);
  const galaxy = new Points(galaxyGeo, galaxyMat);
  galaxy.rotation.x = -1.18;
  const galaxyPivot = new Group();
  galaxyPivot.add(galaxy);

  // ---- sparks rising past the coin
  const S = phone ? 26 : 60; // a few motes of light
  const sPos = new Float32Array(S * 3), sCol = new Float32Array(S * 3), sSize = new Float32Array(S), sSeed = new Float32Array(S), sVel = new Float32Array(S);
  for (let i = 0; i < S; i++) {
    sPos.set([(Math.random() - 0.5) * 6, -4 + Math.random() * 8, (Math.random() - 0.5) * 3], i * 3);
    const c = warm[i % 3];
    sCol.set([c.r, c.g, c.b], i * 3);
    sSize[i] = 0.8 + Math.random() * 1.8;
    sSeed[i] = Math.random();
    sVel[i] = 0.25 + Math.random() * 0.6;
  }
  const sparkGeo = new BufferGeometry();
  sparkGeo.setAttribute('position', new Float32BufferAttribute(sPos, 3));
  sparkGeo.setAttribute('color', new Float32BufferAttribute(sCol, 3));
  sparkGeo.setAttribute('aSize', new Float32BufferAttribute(sSize, 1));
  sparkGeo.setAttribute('aSeed', new Float32BufferAttribute(sSeed, 1));
  const sparkMat = glowPoints(dpr * 7 * pt);
  const sparks = new Points(sparkGeo, sparkMat);

  const hero = new Group();
  const mark = new Group();
  mark.add(rupee, aura);
  hero.add(halo, core, galaxyPivot, coin, mark, sparks);
  scene.add(hero);

  // ---- deep stars
  const N = phone ? 300 : 700;
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), size = new Float32Array(N), seed = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const r = 6 + Math.random() * 26, th = Math.random() * Math.PI * 2, ph = Math.acos(Math.random() * 2 - 1);
    pos.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th) * 0.7, -Math.abs(r * Math.cos(ph)) - 2], i * 3);
    const c = warm[i % 5];
    col.set([c.r, c.g, c.b], i * 3);
    size[i] = 0.5 + Math.random() * 1.2;
    seed[i] = Math.random();
  }
  const starGeo = new BufferGeometry();
  starGeo.setAttribute('position', new Float32BufferAttribute(pos, 3));
  starGeo.setAttribute('color', new Float32BufferAttribute(col, 3));
  starGeo.setAttribute('aSize', new Float32BufferAttribute(size, 1));
  starGeo.setAttribute('aSeed', new Float32BufferAttribute(seed, 1));
  const starMat = glowPoints(dpr * 8 * pt);
  const stars = new Points(starGeo, starMat);
  scene.add(stars);

  // ---- light: the brand gradient painted onto chrome, plus a white sweep for travelling glints
  scene.add(new AmbientLight('#ffffff', 0.2));
  const lights = [new PointLight('#FF9F0A', 170, 30, 2), new PointLight('#FF375F', 200, 30, 2), new PointLight('#BF5AF2', 200, 30, 2)];
  lights.forEach((l) => scene.add(l));
  const sweep = new PointLight('#ffffff', 120, 12, 2);
  scene.add(sweep);

  const want = { ...pose }, cur = { ...pose };
  // kicks: each click adds one whole extra turn, a shockwave through the galaxy and a gust of sparks
  let kicks = 0, kickAt = -10, vel = 0, sv = 0, spinBoost = 0;
  let halfW = 1, halfH = 1, px = 0, py = 0, sx = 0, sy = 0, raf = 0, running = false, visible = true, w = 1, h = 1;
  const resize = () => {
    const r = canvas.parentElement!.getBoundingClientRect();
    w = Math.max(1, r.width); h = Math.max(1, r.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the coin a steady size on screen whatever the shape of the window
    camera.position.z = phone ? 11.5 : 14 / Math.min(1, camera.aspect);
    camera.updateProjectionMatrix();
    halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    halfW = halfH * camera.aspect;
  };
  resize();

  const t0 = performance.now();
  let last = t0;
  const easeOut = (k: number) => 1 - Math.pow(1 - k, 4);
  const frame = () => {
    const now = performance.now();
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = still ? 0 : (now - t0) / 1000;
    // arrival: spins in out of depth over the first two seconds
    const arrive = still ? 1 : easeOut(Math.min(1, t / 2.2));
    sx += (px - sx) * 0.06; sy += (py - sy) * 0.06;
    // glide toward the requested pose (instantly when motion is reduced)
    const k = still ? 1 : 1 - Math.pow(0.0025, dt);
    (Object.keys(want) as (keyof RupeePose)[]).forEach((key) => { cur[key] += (want[key] - cur[key]) * k; });
    const sway = still ? 0 : Math.sin(t * 0.55) * (phone ? 0.28 : 0.38);
    const since = t - kickAt;
    const kickTurn = (kicks - 1 + (1 - Math.pow(1 - Math.min(1, since / 1.4), 3))) * Math.PI * 2;
    const pulse = Math.exp(-Math.max(0, since) * 2.6);
    sv += (vel - sv) * 0.08;
    mark.rotation.y = sway + sx * 0.35 + cur.spin + (1 - arrive) * Math.PI * 3 + (kicks ? kickTurn : 0);
    mark.rotation.z = -sv * 0.25;
    mark.position.y = pulse * 0.25 * Math.sin(since * 12);
    mark.rotation.x = (still ? 0 : Math.sin(t * 0.4) * 0.08) - sy * 0.35;
    mark.scale.setScalar(0.55 + 0.45 * arrive);
    coin.rotation.y = mark.rotation.y * 0.5;
    coin.rotation.x = 0.25 + mark.rotation.x * 0.6;
    coin.rotation.z = still ? 0 : t * 0.06;
    coin.scale.setScalar(0.3 + 0.7 * easeOut(Math.min(1, Math.max(0, (t - 0.3) / 1.6))));
    galaxyPivot.rotation.y = sx * 0.25;
    galaxyPivot.rotation.z = -sy * 0.15 + 0.12;
    hero.position.set((cur.x - 0.5) * 2 * halfW, -cur.y * halfH + (still ? 0 : Math.sin(t * 0.9) * 0.08), -(1 - arrive) * 10);
    hero.scale.setScalar(Math.max(0.01, cur.s));
    halo.material.opacity = 0.6 + 0.4 * Math.sin(t * 1.4) * 0.5 + 0.2 * arrive;

    // galaxy: differential rotation (inner orbits faster); scrolling winds it faster
    spinBoost += Math.abs(sv) * dt * 1.5 + pulse * dt * 4;
    const gp = galaxyGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < G; i++) {
      const a = gAng[i] + t * (0.9 / gRad[i]) * 0.35 + spinBoost / gRad[i];
      const r = gRad[i] * (0.35 + 0.65 * arrive) * (1 + pulse * 0.45 * (0.5 + gSeed[i]));
      gp[i * 3] = Math.cos(a) * r; gp[i * 3 + 1] = Math.sin(a) * r; gp[i * 3 + 2] = gH[i];
    }
    galaxyGeo.attributes.position.needsUpdate = true;

    // sparks drift upward and wrap
    if (!still) {
      const sp = sparkGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < S; i++) {
        sp[i * 3 + 1] += sVel[i] * dt * (1 + pulse * 6 + Math.abs(sv) * 3);
        sp[i * 3] += Math.sin(t + i) * 0.0015;
        if (sp[i * 3 + 1] > 4.2) { sp[i * 3 + 1] = -4.2; sp[i * 3] = (Math.random() - 0.5) * 6; }
      }
      sparkGeo.attributes.position.needsUpdate = true;
    }
    galaxyMat.uniforms.uTime.value = sparkMat.uniforms.uTime.value = starMat.uniforms.uTime.value = t;
    galaxyMat.uniforms.uFade.value = (0.35 + 0.65 * cur.glow) * arrive;
    sparkMat.uniforms.uFade.value = cur.glow;
    (aura.material as ShaderMaterial).uniforms.uTime.value = t;
    (aura.material as ShaderMaterial).uniforms.uPower.value = 0.7 + 0.3 * Math.sin(t * 1.1);

    stars.rotation.y = t * 0.01 + sx * 0.05 + cur.spin * 0.08;
    lights.forEach((l, i) => {
      const a = t * 0.5 + (i * Math.PI * 2) / 3;
      l.position.set(hero.position.x + Math.cos(a) * 3.6, hero.position.y + Math.sin(a) * 2.6, hero.position.z + 2.6 + Math.sin(a * 0.7) * 1);
    });
    const sw = (t * 0.35) % 1;
    sweep.position.set(hero.position.x - 4 + sw * 8, hero.position.y + 2.5 - sw * 5, hero.position.z + 3);
    sweep.intensity = 160 * Math.sin(sw * Math.PI);
    renderer.render(scene, camera);
    if (running) raf = requestAnimationFrame(frame);
  };
  const start = () => {
    if (still) { if (visible && !document.hidden) frame(); return; }
    if (!running && visible && !document.hidden) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
  };
  const stop = () => { running = false; cancelAnimationFrame(raf); };
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible ? start() : stop(); });
  io.observe(canvas);
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVis);
  const ro = new ResizeObserver(() => { resize(); if (still) frame(); });
  ro.observe(canvas.parentElement!);
  if (still) frame(); else start();

  return {
    // immediate: jump there this frame (phones pin the ₹ to a spot in the page, so it must not trail the scroll)
    setPose: (p, immediate) => { Object.assign(want, p); if (immediate) Object.assign(cur, p); if (still) frame(); },
    setPointer: (x, y) => { if (!still) { px = x; py = y; } },
    setVelocity: (v) => { vel = Math.max(-1.5, Math.min(1.5, v)); },
    kick: () => { if (still) return; const t = (performance.now() - t0) / 1000; if (t - kickAt < 0.5) return; kicks += 1; kickAt = t; },
    dispose: () => {
      stop(); io.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      scene.traverse((ob) => { const mesh = ob as Mesh; mesh.geometry?.dispose(); const mat = mesh.material as { dispose?: () => void; map?: { dispose: () => void } } | undefined; mat?.map?.dispose(); mat?.dispose?.(); });
      env.dispose(); pmrem.dispose(); renderer.dispose();
    },
  };
}
