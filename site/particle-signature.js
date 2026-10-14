(()=>{
'use strict';
const root=document.querySelector('.particle-signature');if(!root)return;
const canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d');if(!ctx)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),toggle=root.querySelector('.particle-toggle');
let w=0,h=0,points=[],mode='text',pointer=null,raf=0,last=0,visible=false,idle=0;
const random=(a,b)=>a+Math.random()*(b-a);
function rebuild(){
 const rect=root.getBoundingClientRect();w=rect.width;h=rect.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
 const mask=document.createElement('canvas');mask.width=Math.ceil(w);mask.height=Math.ceil(h);const m=mask.getContext('2d');
 const title=w<550?'小浩 UI/UX':'小浩 · UI/UX';let size=Math.min(180,w*.16);m.font=`700 ${size}px Arial, sans-serif`;size*=Math.min(1,w*.92/m.measureText(title).width);m.font=`700 ${size}px Arial, sans-serif`;m.textAlign='center';m.textBaseline='middle';m.fillText(title,w/2,h*.48);
 const pixels=m.getImageData(0,0,mask.width,mask.height).data;points=[];const gap=w<550?3:4;
 for(let y=0;y<h;y+=gap)for(let x=0;x<w;x+=gap)if(pixels[(y*mask.width+x)*4+3]>100)points.push({x,y,ox:x,oy:y,vx:0,vy:0,r:random(1.05,1.55),a:random(.85,1),floor:h-79-random(0,14)});
 wake();
}
function draw(now){
 raf=0;const dt=Math.min((now-last)/16.67||1,2);last=now;ctx.clearRect(0,0,w,h);let energy=0;
 for(const p of points){
  if(!reduced.matches){
   if(mode==='text'){p.vx+=(p.ox-p.x)*.026*dt;p.vy+=(p.oy-p.y)*.026*dt;p.vx*=Math.pow(.86,dt);p.vy*=Math.pow(.86,dt)}
   else{p.vy+=.19*dt;p.vx*=Math.pow(.992,dt)}
   if(pointer){const dx=p.x-pointer.x,dy=p.y-pointer.y,d=Math.hypot(dx,dy);if(d<115&&d>.1){const force=(1-d/115)*4.1*dt;p.vx+=dx/d*force;p.vy+=dy/d*force}}
   p.x+=p.vx*dt;p.y+=p.vy*dt;
   if(mode==='fall'){if(p.y>p.floor){p.y=p.floor;p.vy=-Math.abs(p.vy)*.45;if(Math.abs(p.vy)<.35)p.vy=0;p.vx*=.91}if(p.x<2||p.x>w-2){p.x=Math.max(2,Math.min(w-2,p.x));p.vx*=-.6}}
  }else{p.x=p.ox;p.y=p.oy}
  energy+=Math.abs(p.vx)+Math.abs(p.vy);ctx.fillStyle=`rgba(12,48,33,${p.a})`;ctx.fillRect(p.x,p.y,p.r*1.5,p.r*1.5);
 }
 idle=energy<points.length*.04&&!pointer?idle+1:0;if(visible&&!reduced.matches&&idle<30)raf=requestAnimationFrame(draw);
}
function wake(){idle=0;if(visible&&!raf){last=performance.now();raf=requestAnimationFrame(draw)}}
function setMode(next){mode=next;if(next==='fall')points.forEach(p=>{p.vx=random(-4.5,4.5);p.vy=random(-7,1)});toggle.textContent=next==='fall'?'点击重新聚合':'点击散落 · 移动鼠标探索';wake()}
canvas.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=canvas.getBoundingClientRect();pointer={x:e.clientX-r.left,y:e.clientY-r.top};wake()});canvas.addEventListener('pointerleave',()=>{pointer=null;wake()});canvas.addEventListener('click',()=>setMode(mode==='text'?'fall':'text'));toggle.addEventListener('click',()=>setMode(mode==='text'?'fall':'text'));root.querySelector('.particle-reset').addEventListener('click',()=>setMode('text'));
new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)wake();else{cancelAnimationFrame(raf);raf=0;pointer=null}},{rootMargin:'100px'}).observe(root);
new ResizeObserver(rebuild).observe(root);document.fonts?.ready.then(rebuild);reduced.addEventListener('change',()=>{mode='text';rebuild()});rebuild();
})();
