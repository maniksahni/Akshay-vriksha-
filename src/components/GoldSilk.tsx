import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/smooth';

/**
 * Liquid gold silk: a domain-warped fbm field rendered in a raw WebGL fragment shader.
 * Rendered at reduced resolution and paused off-screen. The pointer bends the flow.
 */

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uIntensity;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0.,a=.5;
  mat2 r=mat2(.8,.6,-.6,.8);
  for(int i=0;i<5;i++){v+=a*noise(p);p=r*p*2.02;a*=.5;}
  return v;
}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes.xy;
  vec2 p=(gl_FragCoord.xy-.5*uRes.xy)/uRes.y;
  float t=uTime*.045;
  vec2 m=(uMouse-.5)*vec2(uRes.x/uRes.y,1.);
  float md=exp(-3.5*length(p-m));
  vec2 q=vec2(fbm(p*1.6+t),fbm(p*1.6+vec2(5.2,1.3)-t));
  vec2 r=vec2(fbm(p*1.4+3.*q+vec2(1.7,9.2)+t*1.4+md*.6),fbm(p*1.4+3.*q+vec2(8.3,2.8)-t));
  float f=fbm(p*1.2+3.5*r);
  // silk folds: sharpen ridges of the field
  float ridge=pow(1.-abs(sin(f*9.+r.x*4.)),6.);
  vec3 night=vec3(.024,.067,.051);
  vec3 moss=vec3(.06,.15,.11);
  vec3 gold=vec3(.85,.68,.36);
  vec3 col=mix(night,moss,smoothstep(.2,.9,f));
  col+=gold*ridge*(.35+.65*smoothstep(.3,.8,r.y))*uIntensity;
  col+=gold*md*.08;
  // vignette
  col*=mix(.55,1.,smoothstep(1.2,.2,length(uv-.5)*1.6));
  gl_FragColor=vec4(col,1.);
}`;

export function GoldSilk({ className = '', intensity = 0.5 }: { className?: string; intensity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) return;
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uInt = gl.getUniformLocation(prog, 'uIntensity');

    const scale = window.innerWidth < 768 ? 0.35 : 0.5;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * scale));
      canvas.height = Math.max(1, Math.round(r.height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const mouse = { x: 0.7, y: 0.4, tx: 0.7, ty: 0.4 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = 1 - (e.clientY - r.top) / r.height;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const reduced = prefersReducedMotion();
    let visible = true;
    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      raf = 0;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reduced ? 20 : (now - start) / 1000 + 20);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uInt, intensity);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (visible && !document.hidden && !reduced) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);
    const onVis = () => !document.hidden && visible && !raf && (raf = requestAnimationFrame(frame));
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [intensity]);

  return <canvas ref={ref} aria-hidden className={`block h-full w-full ${className}`} />;
}
