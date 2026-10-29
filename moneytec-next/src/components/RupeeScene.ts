import {
  ACESFilmicToneMapping, AdditiveBlending, AmbientLight, BufferGeometry, CanvasTexture, Color, ExtrudeGeometry, Float32BufferAttribute, Group, InstancedMesh,
  Matrix4, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Object3D, PerspectiveCamera, PMREMGenerator, PointLight, Points, PointsMaterial, Scene,
  SRGBColorSpace, Sprite, SpriteMaterial, TorusGeometry, BoxGeometry, WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

import { RUPEE_PATH } from './rupeePath';

export type RupeeHandle = { setProgress: (p: number) => void; setPointer: (x: number, y: number) => void; dispose: () => void };

/**
 * A solid ₹ in iridescent chrome: extruded from the vector outline, lit by the brand's three colours,
 * framed by a milled coin edge and a field of stars. `centerX` is where the coin sits across the canvas (0..1).
 */
export function mountRupee(canvas: HTMLCanvasElement, { centerX, phone, still }: { centerX: number; phone: boolean; still: boolean }): RupeeHandle {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, phone ? 1.5 : 1.35));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  const pmrem = new PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;

  // ---- the ₹
  const shapes = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${RUPEE_PATH}"/></svg>`).paths[0].toShapes(true);
  const geo = new ExtrudeGeometry(shapes, { depth: 56, bevelEnabled: true, bevelThickness: 8, bevelSize: 5, bevelSegments: phone ? 4 : 8, curveSegments: phone ? 16 : 32 });
  geo.center();
  // phones get plain polished metal (a much cheaper shader); laptops add clearcoat and a thin-film sheen
  const chrome = phone
    ? new MeshStandardMaterial({ color: new Color('#ffcfe6'), metalness: 1, roughness: 0.24, envMapIntensity: 0.7 })
    : new MeshPhysicalMaterial({
      color: new Color('#ffd3e8'), metalness: 1, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.05,
      iridescence: 1, iridescenceIOR: 1.9, iridescenceThicknessRange: [250, 900], envMapIntensity: 0.55,
    });
  const rupee = new Mesh(geo, chrome);
  const s = 3.1 / 255;
  rupee.scale.set(s, -s, s); // SVG y runs down

  // ---- coin edge: a polished ring and milled ticks
  const coin = new Group();
  const ringMat = new MeshStandardMaterial({ color: '#d9c4ff', metalness: 1, roughness: 0.22, envMapIntensity: 1 });
  coin.add(new Mesh(new TorusGeometry(2.55, 0.05, 20, 220), ringMat));
  const inner = new Mesh(new TorusGeometry(2.38, 0.012, 8, 220), new MeshStandardMaterial({ color: '#ff8fbf', emissive: new Color('#ff375f'), emissiveIntensity: 0.9 }));
  coin.add(inner);
  const TICKS = phone ? 90 : 150;
  const ticks = new InstancedMesh(new BoxGeometry(0.018, 0.12, 0.05), new MeshStandardMaterial({ color: '#ffffff', metalness: 1, roughness: 0.3, emissive: new Color('#bf5af2'), emissiveIntensity: 0.25 }), TICKS);
  const m = new Matrix4(), o = new Object3D();
  for (let i = 0; i < TICKS; i++) {
    const a = (i / TICKS) * Math.PI * 2;
    o.position.set(Math.cos(a) * 2.72, Math.sin(a) * 2.72, 0);
    o.rotation.set(0, 0, a - Math.PI / 2);
    o.scale.setScalar(i % 5 === 0 ? 1.6 : 1);
    o.updateMatrix();
    ticks.setMatrixAt(i, m.copy(o.matrix));
  }
  coin.add(ticks);

  // ---- soft halo behind the mark
  const glowCanvas = document.createElement('canvas');
  glowCanvas.width = glowCanvas.height = 256;
  const g = glowCanvas.getContext('2d')!;
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(255,90,140,0.55)'); grad.addColorStop(0.4, 'rgba(191,90,242,0.22)'); grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad; g.fillRect(0, 0, 256, 256);
  const halo = new Sprite(new SpriteMaterial({ map: new CanvasTexture(glowCanvas), blending: AdditiveBlending, depthWrite: false, transparent: true }));
  halo.scale.set(9, 9, 1);
  halo.position.z = -1.5;

  const hero = new Group();
  hero.add(halo, coin, rupee);
  scene.add(hero);

  // ---- stars
  const N = phone ? 700 : 1800;
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const palette = [new Color('#ffb340'), new Color('#ff375f'), new Color('#bf5af2'), new Color('#ffffff')];
  for (let i = 0; i < N; i++) {
    const r = 6 + Math.random() * 26, th = Math.random() * Math.PI * 2, ph = Math.acos(Math.random() * 2 - 1);
    pos.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th) * 0.7, -Math.abs(r * Math.cos(ph)) - 2], i * 3);
    const c = palette[i % 4];
    col.set([c.r, c.g, c.b], i * 3);
  }
  const starGeo = new BufferGeometry();
  starGeo.setAttribute('position', new Float32BufferAttribute(pos, 3));
  starGeo.setAttribute('color', new Float32BufferAttribute(col, 3));
  const stars = new Points(starGeo, new PointsMaterial({ size: phone ? 0.09 : 0.07, vertexColors: true, transparent: true, opacity: 0.85, blending: AdditiveBlending, depthWrite: false }));
  scene.add(stars);

  // ---- light: the brand gradient painted onto chrome
  scene.add(new AmbientLight('#ffffff', 0.25));
  const lights = [new PointLight('#ff9f0a', 160, 30, 2), new PointLight('#ff375f', 190, 30, 2), new PointLight('#bf5af2', 190, 30, 2)];
  lights.forEach((l) => scene.add(l));

  let progress = 0, px = 0, py = 0, sx = 0, sy = 0, raf = 0, running = false, visible = true, w = 1, h = 1;
  const resize = () => {
    const r = canvas.parentElement!.getBoundingClientRect();
    w = Math.max(1, r.width); h = Math.max(1, r.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the coin a steady size on screen whatever the shape of the window
    camera.position.z = phone ? 11.5 : 14 / Math.min(1, camera.aspect);
    camera.updateProjectionMatrix();
    const halfW = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z * camera.aspect;
    hero.userData.x = (centerX - 0.5) * 2 * halfW;
  };
  resize();

  const t0 = performance.now();
  const frame = () => {
    const t = (performance.now() - t0) / 1000;
    sx += (px - sx) * 0.06; sy += (py - sy) * 0.06;
    const e = progress * progress * (3 - 2 * progress);
    const sway = still ? 0 : Math.sin(t * 0.55) * (phone ? 0.28 : 0.4);
    rupee.rotation.y = sway + sx * 0.6 + e * Math.PI * 2;
    rupee.rotation.x = (still ? 0 : Math.sin(t * 0.4) * 0.08) - sy * 0.3;
    coin.rotation.y = rupee.rotation.y * 0.6;
    coin.rotation.x = 0.25 + rupee.rotation.x * 0.6;
    coin.rotation.z = still ? 0 : t * 0.06;
    hero.position.set(hero.userData.x * (1 - e), (still ? 0 : Math.sin(t * 0.9) * 0.08) + e * 7.6, -e * 22);
    stars.rotation.y = t * 0.01 + sx * 0.05 + e * 0.4;
    stars.position.z = e * 6;
    lights.forEach((l, i) => {
      const a = t * 0.5 + (i * Math.PI * 2) / 3;
      l.position.set(hero.position.x + Math.cos(a) * 3.6, Math.sin(a) * 2.6, 2.6 + Math.sin(a * 0.7) * 1);
    });
    renderer.render(scene, camera);
    if (running) raf = requestAnimationFrame(frame);
  };
  const start = () => { if (!running && visible && !document.hidden) { running = true; raf = requestAnimationFrame(frame); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible ? start() : stop(); });
  io.observe(canvas);
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVis);
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement!);
  if (still) frame(); else start();

  return {
    setProgress: (p) => { progress = p; if (still) frame(); },
    setPointer: (x, y) => { px = x; py = y; },
    dispose: () => {
      stop(); io.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      scene.traverse((ob) => { const mesh = ob as Mesh; mesh.geometry?.dispose(); const mat = mesh.material as { dispose?: () => void } | undefined; mat?.dispose?.(); });
      env.dispose(); pmrem.dispose(); renderer.dispose();
    },
  };
}
