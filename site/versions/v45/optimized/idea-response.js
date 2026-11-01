/* A bounded click response, independent of the original scroll timeline. */
(()=>{
 'use strict';
 const section=document.querySelector('#object-story'),stage=section?.querySelector('.os-stage');
 if(!stage)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const canvas=document.createElement('canvas');canvas.className='idea-response';canvas.setAttribute('aria-hidden','true');
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const button=document.createElement('button');button.type='button';button.className='idea-trigger';button.textContent='点亮一个想法';button.setAttribute('aria-label','播放一次灵感光点效果');button.hidden=true;
 stage.append(canvas,button);
 let raf=0,visible=false,width=0,height=0;
 function clear(){cancelAnimationFrame(raf);raf=0;ctx.clearRect(0,0,width,height);}
 function update(){
  const r=section.getBoundingClientRect();
  const progress=Math.max(0,Math.min(1,-r.top/Math.max(1,section.offsetHeight-innerHeight)))*12;
  visible=!reduced.matches&&r.top<=0&&r.bottom>innerHeight&&progress<1.7&&!document.hidden;
  button.hidden=!visible;if(!visible)clear();
 }
 button.addEventListener('click',()=>{
  if(!visible)return;clear();
  width=stage.clientWidth;height=stage.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);
  canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);canvas.style.width=width+'px';canvas.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
  const start=performance.now(),radius=Math.min(width,height)*.16;
  // Fixed upper bound: no persistent emitters and no cursor tracking.
  const dots=Array.from({length:32},(_,i)=>({a:i/32*Math.PI*2,s:20+Math.random()*35,r:.8+Math.random()*1.3}));
  function frame(now){
   if(!visible)return clear();const t=Math.min(1,(now-start)/1050);ctx.clearRect(0,0,width,height);
   dots.forEach(d=>{const radial=radius+d.s*(1-(1-t)**3);ctx.globalAlpha=(1-t)**1.8;ctx.fillStyle='#f2e7d2';ctx.beginPath();ctx.arc(width/2+Math.cos(d.a)*radial,height/2+Math.sin(d.a)*radial,d.r,0,Math.PI*2);ctx.fill();});ctx.globalAlpha=1;
   if(t<1)raf=requestAnimationFrame(frame);else clear();
  }raf=requestAnimationFrame(frame);
 });
 addEventListener('scroll',update,{passive:true});addEventListener('resize',()=>{clear();update()});document.addEventListener('visibilitychange',update);reduced.addEventListener('change',update);update();
})();
