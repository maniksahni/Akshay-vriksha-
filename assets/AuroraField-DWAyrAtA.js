const U="attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }",q=`
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

  vec3 ink = vec3(0.027, 0.024, 0.043);
  vec3 amber = vec3(1.0, 0.62, 0.04);
  vec3 rose = vec3(1.0, 0.216, 0.373);
  vec3 violet = vec3(0.75, 0.35, 0.95);

  vec3 col = mix(ink, violet * 0.55, smoothstep(0.25, 0.85, f));
  col = mix(col, rose * 0.85, smoothstep(0.45, 0.95, length(q) * f));
  col = mix(col, amber, smoothstep(0.72, 1.08, r.x * f * 1.35) * 0.8);

  // silk ribbons: thin bright contours through the field
  float bands = abs(sin(f * 18.0 + t * 6.0));
  col += vec3(1.0, 0.75, 0.85) * pow(1.0 - bands, 22.0) * 0.1 * smoothstep(0.35, 0.8, f);

  col += rose * 0.22 * exp(-d * 4.5);                      // light under the pointer
  col *= 1.0 - smoothstep(0.35, 1.25, length((uv - vec2(0.5, 0.45)) * vec2(1.35, 1.0))); // vignette
  col *= 0.62 - uScroll * 0.38;                            // dims as you leave the hero
  col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.025;     // film grain to break banding
  gl_FragColor = vec4(col, 1.0);
}`;function B(o,{phone:v,still:c}){const e=o.getContext("webgl",{antialias:!1,alpha:!1,premultipliedAlpha:!1,powerPreference:"high-performance"});if(!e)throw new Error("no webgl");const p=(t,d)=>{const n=e.createShader(t);if(e.shaderSource(n,d),e.compileShader(n),!e.getShaderParameter(n,e.COMPILE_STATUS))throw new Error(e.getShaderInfoLog(n)||"shader");return n},r=e.createProgram();e.attachShader(r,p(e.VERTEX_SHADER,U)),e.attachShader(r,p(e.FRAGMENT_SHADER,q)),e.linkProgram(r),e.useProgram(r);const g=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,g),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);const b=e.getAttribLocation(r,"p");e.enableVertexAttribArray(b),e.vertexAttribPointer(b,2,e.FLOAT,!1,0,0);const L=e.getUniformLocation(r,"uRes"),_=e.getUniformLocation(r,"uTime"),M=e.getUniformLocation(r,"uMouse"),P=e.getUniformLocation(r,"uScroll"),A=v?.35:.5,R=()=>{const t=o.getBoundingClientRect();o.width=Math.max(1,Math.round(t.width*A)),o.height=Math.max(1,Math.round(t.height*A)),e.viewport(0,0,o.width,o.height),e.uniform2f(L,o.width,o.height)};R();let s=.25,f=0,x=.25,w=0,S=0,l=0,a=!1,u=!0,y=0;const C=performance.now(),i=t=>{a&&(l=requestAnimationFrame(i)),!(v&&t-y<33)&&(y=t,s+=(x-s)*.05,f+=(w-f)*.05,e.uniform1f(_,c?12:(t-C)/1e3+12),e.uniform2f(M,s,f),e.uniform1f(P,S),e.drawArrays(e.TRIANGLES,0,3))},m=()=>{if(c){i(performance.now());return}!a&&u&&!document.hidden&&(a=!0,l=requestAnimationFrame(i))},h=()=>{a=!1,cancelAnimationFrame(l)},F=new IntersectionObserver(([t])=>{u=t.isIntersecting,u?m():h()});F.observe(o);const E=()=>document.hidden?h():m();document.addEventListener("visibilitychange",E);const T=new ResizeObserver(()=>{R(),c&&i(performance.now())});return T.observe(o),m(),{setPointer:(t,d)=>{x=t,w=-d},setScroll:t=>{S=t,c&&i(performance.now())},dispose:()=>{h(),F.disconnect(),T.disconnect(),document.removeEventListener("visibilitychange",E),e.deleteBuffer(g),e.deleteProgram(r)}}}export{B as mountAurora};
