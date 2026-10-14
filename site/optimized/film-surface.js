/* One continuous parameterized surface; frames and perforations share its UVs. */
(()=>{
 const board=document.querySelector('.cylindrical-gallery');if(!board)return;
 const links=[...board.querySelectorAll('a')];
 const canvas=document.createElement('canvas');canvas.className='film-surface';canvas.setAttribute('aria-hidden','true');board.append(canvas);
 const access=document.createElement('div');access.className='film-access';links.forEach(a=>{const l=document.createElement('a');l.href=a.getAttribute('href');l.textContent=a.querySelector('strong').textContent;access.append(l)});board.append(access);
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const dots=[...document.querySelectorAll('.film-dot')];
 const textures=links.map((a,i)=>{const c=document.createElement('canvas');c.width=1000;c.height=700;return {c,title:a.querySelector('strong').textContent,en:a.querySelector('em').textContent,href:a.getAttribute('href'),image:null,index:i}});
 let auto=0,manual=0,raf=0,drag=null,moved=false,width=1,height=1,hits=[];
 const mod=(n,m)=>((n%m)+m)%m;
 function texture(t){const g=t.c.getContext('2d');g.clearRect(0,0,1000,700);g.fillStyle='#070908';g.fillRect(0,0,1000,700);
  if(t.image){const im=t.image,scale=Math.max(968/im.width,588/im.height);g.save();g.beginPath();g.rect(16,56,968,588);g.clip();g.drawImage(im,500-im.width*scale/2,350-im.height*scale/2,im.width*scale,im.height*scale);g.restore()}
  const shade=g.createLinearGradient(0,330,0,644);shade.addColorStop(0,'#0000');shade.addColorStop(1,'#000d');g.fillStyle=shade;g.fillRect(16,56,968,588);
  g.fillStyle='#fff2';g.fillRect(0,3,1000,2);g.fillRect(0,695,1000,2);
  // Actual transparent perforations, not a separate floating border.
  for(let x=12;x<1000;x+=40){g.clearRect(x,14,23,25);g.clearRect(x,661,23,25)}
  g.fillStyle='#f9edd7';g.font='24px Arial';g.fillText(String(t.index+1).padStart(2,'0')+' / 04',54,468);g.font='600 66px "Songti SC", "STSong", Georgia, serif';g.fillText(t.title,50,555);g.font='22px Arial';g.fillText(t.en,54,599);
 }
 textures.forEach(t=>texture(t));
 ['hero-designer-desk-light.png','directory-workspace-real.png','dark-studio-v28.png','studio-desk-v28.png'].forEach((name,i)=>{const im=new Image();im.onload=()=>{textures[i].image=im;texture(textures[i]);render()};im.src='../assets/'+name});
 // Continuous cylindrical front arc tilted upward to the right. No independent planes.
 function point(u){const angle=u*1.4,x=.5+.468*Math.sin(angle)/Math.sin(1.4);const depth=Math.cos(angle);const top=.23-.20*Math.sin(angle)+.07*(1-depth);const h=.64*(.75+.25*depth);return {x:x*width,y:top*height,h:h*height}}
 function render(){const dpr=Math.min(devicePixelRatio||1,2);width=board.clientWidth;height=board.clientHeight;if(!width||!height)return;if(canvas.width!==Math.round(width*dpr)||canvas.height!==Math.round(height*dpr)){canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr)}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);hits=[];
  const position=auto+manual;const slices=440;
  for(let s=0;s<slices;s++){const u=-1+2*s/slices,un=-1+2*(s+1)/slices,p=point(u),q=point(un);const uv=position+.5+u*1.55,index=Math.floor(uv),t=textures[mod(index,4)],sx=mod(uv,1)*1000,sw=Math.min(1000-sx,3100/slices);const dw=q.x-p.x+.6;
   ctx.save();ctx.transform(1,(q.y-p.y)/Math.max(.01,q.x-p.x),0,1,p.x,p.y);ctx.drawImage(t.c,sx,0,Math.max(.1,sw),700,0,0,dw,p.h);ctx.globalCompositeOperation='source-atop';ctx.fillStyle='rgba(0,0,0,'+(Math.abs(u)**3*.38)+')';ctx.fillRect(0,0,dw,p.h);ctx.restore();hits.push({x:p.x,end:q.x,top:p.y,bottom:p.y+p.h,index:mod(index,4)})
  }
  const active=mod(Math.round(position),4);dots.forEach((d,i)=>{d.classList.toggle('is-active',i===active);d.setAttribute('aria-pressed',String(i===active))});
 }
 function snap(target){cancelAnimationFrame(raf);const from=manual,to=target-auto,start=performance.now(),duration=matchMedia('(prefers-reduced-motion: reduce)').matches?0:440;function tick(now){const t=duration?Math.min(1,(now-start)/duration):1;manual=from+(to-from)*(1-(1-t)**3);render();if(t<1)raf=requestAnimationFrame(tick)}raf=requestAnimationFrame(tick)}
 window.__setDirectoryCarousel=v=>{auto=v;render()};
 board.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('.film-access'))return;cancelAnimationFrame(raf);moved=false;drag={x:e.clientX,start:manual,id:e.pointerId};board.setPointerCapture(e.pointerId);board.classList.add('is-dragging')});
 board.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>6)moved=true;manual=drag.start-dx/Math.max(140,width*.32);render()});
 board.addEventListener('pointerup',e=>{if(!drag)return;drag=null;board.classList.remove('is-dragging');if(moved){snap(Math.round(auto+manual));return}const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,hit=hits.find(h=>x>=h.x&&x<=h.end&&y>=h.top&&y<=h.bottom);if(hit)location.hash=textures[hit.index].href});
 board.addEventListener('pointercancel',()=>{drag=null;board.classList.remove('is-dragging');snap(Math.round(auto+manual))});
 board.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();snap(Math.round(auto+manual)+(e.key==='ArrowRight'?1:-1))}else if(e.key==='Enter'&&e.target===board)location.hash=textures[mod(Math.round(auto+manual),4)].href});
 dots.forEach((dot,i)=>dot.addEventListener('click',()=>{const p=auto+manual;let delta=mod(i-p+2,4)-2;snap(p+delta)}));
 addEventListener('resize',render);render();window.dispatchEvent(new Event('scroll'));
})();
