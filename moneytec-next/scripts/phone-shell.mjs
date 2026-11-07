// Needs Playwright (npx playwright install webkit). Run after `vite build`: node moneytec-next/scripts/phone-shell.mjs, then build again.
// Copies the phone opening (menu bar + hero) exactly as React draws it into index.html, so phones show it
// from the HTML itself before any JavaScript runs. Re-run after changing the hero or the menu bar.
import { webkit } from 'playwright'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const ROOT=new URL('..', import.meta.url).pathname.replace(/\/$/, ''); const DIST=ROOT+'/dist';
const T={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2'};
const sv=http.createServer((q,r)=>{let p=q.url.split('?')[0];if(p==='/')p='/index.html';let f=path.join(DIST,p);if(!path.extname(f))f+='.html';if(!fs.existsSync(f)){r.writeHead(404);return r.end()}r.writeHead(200,{'content-type':T[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r)}).listen(0);
const w=await webkit.launch();const c=await w.newContext({viewport:{width:390,height:844},hasTouch:true});const p=await c.newPage();
await p.goto('http://localhost:'+sv.address().port+'/');await p.waitForTimeout(1500);
const html=await p.evaluate(()=>{
  const clean=(el)=>{const n=el.cloneNode(true);
    n.querySelectorAll('[style]').forEach(e=>{const st=e.getAttribute('style');if(/width:/.test(st)&&e.classList.contains('goal-slot'))return;e.removeAttribute('style')});
    if(n.hasAttribute('style'))n.removeAttribute('style');
    n.querySelectorAll('.goal-word').forEach((g,i)=>g.setAttribute('data-state',i===0?'in':'wait'));
    n.removeAttribute('id');n.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));
    n.querySelectorAll('h1').forEach(h=>{const d=document.createElement('div');[...h.attributes].forEach(a=>d.setAttribute(a.name,a.value));d.innerHTML=h.innerHTML;h.replaceWith(d)});
    return n.outerHTML;};
  return clean(document.querySelector('header'))+clean(document.querySelector('#top'));
});
await w.close();sv.close();
const rupee=fs.readFileSync(ROOT+'/src/components/rupeePath.ts','utf8').match(/RUPEE_PATH = '([^']+)'/)[1];
const coin=`<svg viewBox="118 68 186 275" class="boot-coin" aria-hidden="true"><defs><linearGradient id="boot-rupee" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFB340"/><stop offset=".45" stop-color="#FF375F"/><stop offset="1" stop-color="#BF5AF2"/></linearGradient></defs><path d="${rupee}" fill="url(#boot-rupee)"/></svg>`;
const shell=html.replace('<div class="coin-slot" aria-hidden="true"></div>',`<div class="coin-slot" aria-hidden="true">${coin}</div>`);
if(!shell.includes('boot-coin'))throw new Error('coin slot not found');
const f=ROOT+'/index.html';let s=fs.readFileSync(f,'utf8');
const block=`<!--shell--><div class="boot-shell" aria-hidden="true" inert>${shell}</div><!--/shell-->`;
s=/<!--shell-->[\s\S]*<!--\/shell-->/.test(s)?s.replace(/<!--shell-->[\s\S]*<!--\/shell-->/,block):s.replace('<img class="boot-mark"',block+'\n      <img class="boot-mark"');
fs.writeFileSync(f,s);console.log('shell bytes',block.length);
