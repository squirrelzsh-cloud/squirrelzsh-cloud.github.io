(()=>{
 'use strict';const scene=document.querySelector('.desk-scene'),base=scene?.querySelector('img');if(!base)return;
 const still=document.createElement('div');still.className='desk-still';scene.append(still);still.append(base);const plane=document.createElement('div');plane.className='desk-layer-plane';still.append(plane);
 // Source-image crops are clipped to the actual object contours, never rectangular picture cards.
 const defs=[
 {name:'触控笔',box:[1233,374,67,325],path:'polygon(9% 0,25% 2%,36% 11%,98% 94%,96% 98%,81% 99%,68% 96%,4% 11%)'},
 {name:'金属直尺',box:[1442,538,230,175],path:'polygon(13% 0,100% 49%,100% 92%,0 25%)'},
 {name:'照片卡片',box:[1392,646,275,244],path:'polygon(20% 0,88% 16%,93% 30%,100% 37%,77% 98%,0 70%,5% 60%)'},
 {name:'棕色笔记本',box:[509,760,275,181],path:'polygon(0 23%,70% 0,87% 1%,100% 100%,5% 100%)'},
 {name:'速写本',box:[64,670,406,271],path:'polygon(0 29%,82% 0,100% 100%,7% 100%)'},
 {name:'铅笔',box:[1160,52,134,442],source:'tool-source.png',size:[1536,1024],place:[1342,365,65],path:'polygon(3% 0,18% 7%,25% 13%,99% 97%,96% 99%,81% 100%,7% 15%)'},
 {name:'胶带',box:[1152,614,252,266],source:'tool-source.png',size:[1536,1024],place:[435,145,69],mask:'radial-gradient(ellipse closest-side,transparent 0 63%,#000 64% 96%,transparent 98%)'}
 ];
 const objects=defs.map(d=>{const [x,y,w,h]=d.box,[sw,sh]=d.size||[1672,941],pos=d.place||[x,y,w];const el=document.createElement('button');el.className='desk-object';el.type='button';el.setAttribute('aria-label','轻推'+d.name);el.style.cssText=`left:${pos[0]/1672*100}%;top:${pos[1]/941*100}%;width:${pos[2]/1672*100}%;aspect-ratio:${w}/${h}`;
 const clip=document.createElement('span');clip.className='desk-sprite';if(d.path)clip.style.clipPath=d.path;if(d.mask){clip.style.maskImage=d.mask;clip.style.webkitMaskImage=d.mask;}
 const img=new Image();img.src='../../assets/'+(d.source||'home-reference.png');img.alt='';img.draggable=false;img.style.cssText=`width:${sw/w*100}%;height:${sh/h*100}%;left:${-x/w*100}%;top:${-y/h*100}%`;clip.append(img);el.append(clip);plane.append(el);return {el,x:0,y:0,r:0,vx:0,vy:0,vr:0};});
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');let raf=0,last=0,active=true;
 function fit(){const w=scene.clientWidth,h=scene.clientHeight,k=Math.max(w/1672,h/941);Object.assign(plane.style,{width:1672*k+'px',height:941*k+'px',left:(w-1672*k)/2+'px',top:(h-941*k)/2+'px'});}
 new ResizeObserver(fit).observe(scene);fit();
 function frame(t){raf=0;if(!active||reduce.matches)return;const dt=Math.min(2,(t-last)/16.67||1);last=t;let moving=false;
 objects.forEach(o=>{for(const [p,v] of [['x','vx'],['y','vy'],['r','vr']]){o[v]+=(-o[p]*.025-o[v]*.19)*dt;o[p]+=o[v]*dt;o[p]=Math.max(p==='r'?-2:-12,Math.min(p==='r'?2:12,o[p]));}if(Math.abs(o.x)+Math.abs(o.y)+Math.abs(o.r)+Math.abs(o.vx)+Math.abs(o.vy)>.035)moving=true;else o.x=o.y=o.r=o.vx=o.vy=o.vr=0;o.el.style.setProperty('--push-x',o.x+'px');o.el.style.setProperty('--push-y',o.y+'px');o.el.style.setProperty('--push-r',o.r+'deg');});if(moving)raf=requestAnimationFrame(frame);}
 function push(o,e,strong){if(!active||reduce.matches)return;const b=o.el.getBoundingClientRect(),x=e.detail===0?-1:e.clientX-b.left-b.width/2,y=e.detail===0?-1:e.clientY-b.top-b.height/2,len=Math.hypot(x,y)||1,f=strong?2.3:.95;o.vx-=x/len*f;o.vy-=y/len*f;o.vr+=x>0?-.25:.25;if(!raf){last=performance.now();raf=requestAnimationFrame(frame);}}
 objects.forEach(o=>{o.el.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')push(o,e,false)});o.el.addEventListener('click',e=>push(o,e,true));});
 function gate(){const p=Number(getComputedStyle(document.documentElement).getPropertyValue('--chapter'));active=p<.3&&!document.hidden;const dir=document.querySelector('#directory');dir.inert=p<.42;dir.style.pointerEvents=p<.42?'none':'';plane.inert=!active;document.querySelector('.hero-copy-layer').inert=p>.22;if(!active||reduce.matches){cancelAnimationFrame(raf);raf=0;objects.forEach(o=>{o.x=o.y=o.r=o.vx=o.vy=o.vr=0;o.el.style.setProperty('--push-x','0px');o.el.style.setProperty('--push-y','0px');o.el.style.setProperty('--push-r','0deg');});}}
 addEventListener('scroll',gate,{passive:true});document.addEventListener('visibilitychange',gate);reduce.addEventListener('change',gate);gate();
})();
