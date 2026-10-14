(() => {
 'use strict';
 const section=document.querySelector('#top'),home=section.querySelector('.desk-scene'),stage=section.querySelector('.desk-story'),world=stage.querySelector('.desk-world'),carrier=stage.querySelector('.tablet-carrier'),left=stage.querySelector('.story-left-hand'),right=stage.querySelector('.story-right-hand'),copy=section.querySelector('.hero-copy-layer'),directory=stage.querySelector('#directory'),notes=[...directory.querySelectorAll('.paper-note')];
 const still=home.querySelector('.desk-still');still.append(stage);
 const camera=document.createElement('div');camera.className='desk-camera';home.append(camera);camera.append(still);
 const resume=document.querySelector('#design-intro'),portal=document.createElement('div'),preview=resume.querySelector('.intro-opening').cloneNode(true);
 portal.className='resume-portal';portal.setAttribute('aria-hidden','true');portal.inert=true;
 preview.removeAttribute('id');preview.removeAttribute('aria-labelledby');preview.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));preview.classList.add('resume-preview');portal.append(preview);section.querySelector('.hero-sticky').append(portal);
 document.documentElement.classList.add('desk-camera-enabled');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x)},mix=(a,b,t)=>a+(b-a)*t,phase=(p,a,b)=>smooth((p-a)/(b-a));
 const lands=[[682,312,-7],[897,289,-7],[702,498,-6],[919,479,-8]],drops=[[.25,.42],[.47,.56],[.64,.72],[.77,.85]];
 // Continuous poses in a single desktop coordinate system, not image/frame switching.
 const tabletKeys=[[0,0,0,0,1],[.20,0,0,0,1],[.32,-180,5,-5,1.025],[.42,-660,25,-13,1.025],[.48,-700,25,-13,1.025],[.60,-700,25,-13,1.025],[.86,-1500,10,-19,1],[1,-1500,10,-19,1]];
 const handKeys=[[0,1270,1060,7],[.25,1270,1060,7],[.32,1080,340,5],[.42,566,252,-7],[.47,1250,1010,8],[.56,781,229,-7],[.60,781,229,-7],[.64,1250,1010,8],[.72,586,438,-6],[.77,1250,1010,8],[.85,803,419,-8],[.94,1300,1100,10],[1,1300,1100,10]];
 let target=0,current=0,raf=0,last=0,ready=false,compact=false;const hover=notes.map(()=>({value:0,target:0}));
 function interpolate(p,keys){let i=0;while(i<keys.length-2&&p>keys[i+1][0])i++;const a=keys[i],b=keys[i+1],q=phase(p,a[0],b[0]);return a.slice(1).map((v,j)=>mix(v,b[j+1],q));}
 function motionHands(){if(!compact)return handKeys;return handKeys.map(k=>{const i=drops.findIndex(d=>d[1]===k[0]||(d[1]===.56&&k[0]===.60));if(i<0)return k;const x=i%2?851:656;return [k[0],k[1]+x-lands[i][0],k[2],k[3]];});}
 function paint(){const handPoses=motionHands(),p=reduced.matches?(current>.10?1:0):clamp(current/.68),exit=phase(p,.008,.10);section.style.setProperty('--copy-alpha',1-exit);section.style.setProperty('--copy-x',`${-36*exit}px`);copy.inert=exit>.98;
  const [tx,ty,tr,ts]=interpolate(p,tabletKeys);carrier.style.transform=`translate3d(${tx}px,${ty}px,0) rotate(${tr}deg) scale(${ts})`;
  const grip=phase(p,.105,.195);left.style.transform=`translate3d(${-80*(1-grip)}px,${850*(1-grip)}px,0) rotate(${-6*(1-grip)}deg)`;
  const [hx,hy,hr]=interpolate(p,handPoses);right.style.transform=`translate3d(${hx}px,${hy}px,0) rotate(${hr}deg)`;
  notes.forEach((note,i)=>{const [lx,y,r]=lands[i],x=compact?(i%2?851:656):lx,[a,b]=drops[i],land=phase(p,b-.025,b),h=hover[i].value;let nx=x,ny=y,nr=r;
   if(p<b){const held=interpolate(Math.max(a,p),handPoses);nx=held[0]+116;ny=held[1]+60;nr=held[2]+8;nx=mix(nx,x,land);ny=mix(ny,y,land);nr=mix(nr,r,land);}
   if(p<a){nx=1366;ny=1100;nr=15;}
   note.style.transform=`translate3d(${nx}px,${ny-h*5}px,0) rotate(${nr-h*1.2}deg) scale(${(compact?.85:1)*(1+(p<b?.025*(1-land):0))})`;
   const lifted=p<b?1-land:h*.45;note.style.filter=`drop-shadow(${2+lifted*3}px ${4+lifted*9}px ${2+lifted*5}px #21140c60)`;
  });
  // Push toward the note cluster first; hand off only near the end of the move.
  const push=reduced.matches?0:phase(current,.72,.95);
  const reveal=reduced.matches?Number(current>.88):phase(current,.87,.98);
  camera.style.transformOrigin='54% 52%';
  camera.style.transform=`translate3d(0,0,0) scale(${mix(1,1.65,push)})`;camera.style.filter='none';camera.style.opacity=String(1-reveal);
  portal.style.visibility=reveal>0?'visible':'hidden';portal.style.clipPath='none';portal.style.opacity=String(reveal);
  preview.style.transform='none';
  resume.style.visibility=target>=1?'visible':'hidden';resume.inert=target<1;
  directory.inert=p<.94||current>=.76||!ready;directory.setAttribute('aria-hidden',String(p<.94));stage.dataset.phase=p<.105?'home':p<.32?'grip':p<.60?'two-notes':p<.94?'four-notes':'directory';
 }
 function tick(t){raf=0;const dt=Math.min(2,(t-last)/16.67||1);last=t;current+=(target-current)*Math.min(1,.15*dt);if(Math.abs(target-current)<.00002)current=target;let moving=current!==target;hover.forEach(h=>{h.value+=(h.target-h.value)*Math.min(1,.15*dt);if(Math.abs(h.target-h.value)>.002)moving=true;else h.value=h.target;});paint();if(moving)raf=requestAnimationFrame(tick);}
 function schedule(){if(!raf){last=performance.now();raf=requestAnimationFrame(tick);}}
 window.__renderDeskTransition=p=>{target=clamp(p);if(reduced.matches){current=target;paint();}else schedule();};
 notes.forEach((n,i)=>{const set=on=>{hover[i].target=reduced.matches?0:Number(on);schedule();};n.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')set(true)});n.addEventListener('pointerleave',()=>set(false));n.addEventListener('focus',()=>set(true));n.addEventListener('blur',()=>set(false));});
 function fit(){const rs=getComputedStyle(resume);for(const prop of ['paddingTop','paddingRight','paddingBottom','paddingLeft','backgroundColor','color','boxSizing'])preview.style[prop]=rs[prop];const w=home.clientWidth,h=home.clientHeight;compact=w/h<.9;const k=Math.max(w/1672,h/941);world.style.transform=`translate(${(w-1672*k)/2}px,${(h-941*k)/2}px) scale(${k})`;paint();}
 function read(){const r=section.getBoundingClientRect();window.__renderDeskTransition(clamp(-r.top/Math.max(1,r.height-innerHeight)));}
 function jump(){const ratio=location.hash==='#directory'?.70:location.hash==='#design-intro'?1:null;if(ratio!==null)requestAnimationFrame(()=>scrollTo({top:section.offsetTop+(section.offsetHeight-innerHeight)*ratio,behavior:'instant'}));}
 Promise.all([...stage.querySelectorAll('img')].map(im=>im.complete&&im.naturalWidth?Promise.resolve():new Promise((ok,no)=>{im.addEventListener('load',ok,{once:true});im.addEventListener('error',no,{once:true});}))).then(()=>{ready=true;paint();}).catch(()=>{stage.dataset.assetError='true';});
 new ResizeObserver(fit).observe(home);addEventListener('resize',()=>{fit();read()});addEventListener('hashchange',jump);reduced.addEventListener('change',read);fit();paint();read();jump();
})();
