(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('.cursor-grid-card').forEach(container=>{
  const canvas=container.querySelector('canvas'),ctx=canvas.getContext('2d');if(!ctx)return;
  const size=70,radius=140,hold=400,fade=800,speed=600;
  let w=0,h=0,cols=0,rows=0,ox=0,oy=0,alphas=[],touched=[],pulses=[],raf=0,last=0;
  const center=i=>[ox+(i%cols)*size+size/2,oy+Math.floor(i/cols)*size+size/2];
  function energize(x,y){const now=performance.now();for(let i=0;i<alphas.length;i++){const [cx,cy]=center(i),t=Math.max(0,1-Math.hypot(cx-x,cy-y)/radius);if(t>0){alphas[i]=Math.max(alphas[i],t*t*(3-2*t));touched[i]=now}}}
  function draw(now){raf=0;const dt=Math.min(now-last,50);last=now;ctx.clearRect(0,0,w,h);
   pulses=pulses.filter(p=>(now-p.time)/1000*speed<Math.hypot(w,h));
   for(const p of pulses){const r=(now-p.time)/1000*speed;for(let i=0;i<alphas.length;i++){const [x,y]=center(i);if(Math.abs(Math.hypot(x-p.x,y-p.y)-r)<size/2){alphas[i]=1;touched[i]=now}}}
   let active=pulses.length>0;
   for(let i=0;i<alphas.length;i++){if(now-touched[i]>hold)alphas[i]=Math.max(0,alphas[i]-dt/fade);const a=alphas[i];if(a<=0)continue;active=true;const [x,y]=center(i),g=ctx.createRadialGradient(x,y,size*.05,x,y,size);g.addColorStop(0,`rgba(217,70,239,${a})`);g.addColorStop(1,'rgba(217,70,239,0)');ctx.beginPath();ctx.rect(x-size/2+.5,y-size/2+.5,size-1,size-1);ctx.strokeStyle=g;ctx.lineWidth=1.2;ctx.stroke()}
   if(active)raf=requestAnimationFrame(draw);
  }
  function wake(){if(!raf&&!reduced.matches){last=performance.now();raf=requestAnimationFrame(draw)}}
  function rebuild(){cancelAnimationFrame(raf);raf=0;w=container.clientWidth;h=container.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);cols=Math.ceil(w/size)+1;rows=Math.ceil(h/size)+1;ox=(w-cols*size)/2;oy=(h-rows*size)/2;alphas=new Float32Array(cols*rows);touched=new Float64Array(cols*rows);pulses=[]}
  const local=e=>{const r=canvas.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};
  container.addEventListener('pointermove',e=>{if(reduced.matches)return;energize(...local(e));wake()},{passive:true});
  function pulse(x,y){if(reduced.matches)return;pulses.push({x,y,time:performance.now()});pulses=pulses.slice(-8);wake()}
  container.addEventListener('pointerdown',e=>pulse(...local(e)),{passive:true});container.addEventListener('focus',()=>{energize(w/2,h/2);wake()});container.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pulse(w/2,h/2)}});
  new ResizeObserver(rebuild).observe(container);reduced.addEventListener('change',rebuild);rebuild();
 });
})();
