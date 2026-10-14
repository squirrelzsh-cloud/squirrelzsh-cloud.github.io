(()=>{
 'use strict';const scene=document.querySelector('.desk-scene'),base=scene?.querySelector('img');if(!base)return;
 const still=document.createElement('div');still.className='desk-still';scene.append(still);still.append(base);const plane=document.createElement('div');plane.className='desk-layer-plane';still.append(plane);
 // Source-image crops are clipped to the actual object contours, never rectangular picture cards.
 const defs=[
 {name:'触控笔',box:[1285,380,61,350],path:'polygon(15% 0,26% 1%,41% 9%,97% 93%,98% 97%,87% 99%,70% 99%,58% 95%,1% 10%)'},
 {name:'金属直尺',box:[1522,523,150,101],path:'polygon(22% 0,100% 50%,100% 100%,0 55%)'},
 {name:'照片卡片',box:[1472,652,200,272],path:'polygon(36% 0,100% 8%,100% 100%,0 74%)'},
 {name:'棕色笔记本',box:[446,773,328,168],path:'polygon(2% 29%,72% 0,90% 2%,100% 100%,6% 100%,0 35%)'},
 {name:'速写本与钢笔',box:[0,655,415,286],path:'polygon(0 30%,80% 0,100% 100%,0 100%)'},
 {name:'铅笔',box:[1397,355,80,270],path:'polygon(7% 0,25% 9%,97% 95%,92% 99%,76% 100%,0 15%)'},
 {name:'胶带',box:[349,125,91,83],mask:'radial-gradient(ellipse closest-side,transparent 0 50%,#000 54% 95%,transparent 100%)'}
 ];
 const objects=defs.map(d=>{const [x,y,w,h]=d.box,[sw,sh]=d.size||[1672,941],pos=d.place||[x,y,w];const el=document.createElement('button');el.className='desk-object';el.type='button';el.setAttribute('aria-label','轻推'+d.name);el.style.cssText=`left:${pos[0]/1672*100}%;top:${pos[1]/941*100}%;width:${pos[2]/1672*100}%;aspect-ratio:${w}/${h}`;
 const clip=document.createElement('span');clip.className='desk-sprite';if(d.path)clip.style.clipPath=d.path;if(d.mask){clip.style.maskImage=d.mask;clip.style.webkitMaskImage=d.mask;}
 const img=new Image();img.src='./assets/'+(d.source||'home-render-reference.png');img.alt='';img.draggable=false;img.style.cssText=`width:${sw/w*100}%;height:${sh/h*100}%;left:${-x/w*100}%;top:${-y/h*100}%`;clip.append(img);el.append(clip);plane.append(el);return {el,x:0,y:0,r:0,vx:0,vy:0,vr:0};});
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');let raf=0,last=0,active=true;
 function fit(){const w=scene.clientWidth,h=scene.clientHeight,k=Math.max(w/1672,h/941);Object.assign(plane.style,{width:1672*k+'px',height:941*k+'px',left:(w-1672*k)/2+'px',top:(h-941*k)/2+'px'});}
 new ResizeObserver(fit).observe(scene);fit();
 function frame(t){raf=0;if(!active||reduce.matches)return;const dt=Math.min(2,(t-last)/16.67||1);last=t;let moving=false;
 objects.forEach(o=>{for(const [p,v] of [['x','vx'],['y','vy'],['r','vr']]){o[v]+=(-o[p]*.025-o[v]*.19)*dt;o[p]+=o[v]*dt;o[p]=Math.max(p==='r'?-2:-12,Math.min(p==='r'?2:12,o[p]));}if(Math.abs(o.x)+Math.abs(o.y)+Math.abs(o.r)+Math.abs(o.vx)+Math.abs(o.vy)>.035)moving=true;else o.x=o.y=o.r=o.vx=o.vy=o.vr=0;o.el.style.setProperty('--push-x',o.x+'px');o.el.style.setProperty('--push-y',o.y+'px');o.el.style.setProperty('--push-r',o.r+'deg');});if(moving)raf=requestAnimationFrame(frame);}
 function push(o,e,strong){if(!active||reduce.matches)return;const b=o.el.getBoundingClientRect(),x=e.detail===0?-1:e.clientX-b.left-b.width/2,y=e.detail===0?-1:e.clientY-b.top-b.height/2,len=Math.hypot(x,y)||1,f=strong?2.3:.95;o.vx-=x/len*f;o.vy-=y/len*f;o.vr+=x>0?-.25:.25;if(!raf){last=performance.now();raf=requestAnimationFrame(frame);}}
 objects.forEach(o=>{o.el.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')push(o,e,false)});o.el.addEventListener('click',e=>push(o,e,true));});
 function gate(){const p=Number(getComputedStyle(document.documentElement).getPropertyValue('--chapter'));active=p<.12&&!document.hidden;const dir=document.querySelector('#directory');if(!document.querySelector('.desk-story')){dir.inert=p<.42;dir.style.pointerEvents=p<.42?'none':'';}plane.inert=!active;document.querySelector('.hero-copy-layer').inert=p>.22;if(!active||reduce.matches){cancelAnimationFrame(raf);raf=0;objects.forEach(o=>{o.x=o.y=o.r=o.vx=o.vy=o.vr=0;o.el.style.setProperty('--push-x','0px');o.el.style.setProperty('--push-y','0px');o.el.style.setProperty('--push-r','0deg');});}}
 addEventListener('scroll',gate,{passive:true});document.addEventListener('visibilitychange',gate);reduce.addEventListener('change',gate);gate();
})();
