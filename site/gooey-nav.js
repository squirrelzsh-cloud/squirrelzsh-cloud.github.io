(() => {
 const nav=document.querySelector('.top-links');if(!nav)return;
 const links=[...nav.querySelectorAll('a')],reduce=matchMedia('(prefers-reduced-motion: reduce)');
 nav.classList.add('gooey-nav');
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('aria-hidden','true');svg.style.cssText='position:absolute;width:0;height:0;pointer-events:none';
 svg.innerHTML='<defs><filter id="xh-goo" x="-150%" y="-300%" width="400%" height="700%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur"/><feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="goo"/><feBlend in="SourceGraphic" in2="goo"/></filter></defs>';nav.append(svg);
 const effect=document.createElement('span');effect.className='gooey-effect';effect.setAttribute('aria-hidden','true');effect.innerHTML='<i class="gooey-pill"></i>';nav.prepend(effect);
 let active=-1,lock=0,frame=0;
 function position(){if(active<0)return;const r=links[active].getBoundingClientRect(),n=nav.getBoundingClientRect();Object.assign(effect.style,{left:(r.left-n.left)+'px',top:(r.top-n.top)+'px',width:r.width+'px',height:r.height+'px'})}
 function select(index,animate=false){if(index<0||index===active){position();return}active=index;links.forEach((a,i)=>{a.classList.toggle('gooey-selected',i===index);if(i===index)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});position();effect.querySelectorAll('.gooey-particle').forEach(p=>p.remove());
  if(!animate||reduce.matches)return;
  for(let i=0;i<15;i++){const point=document.createElement('i');point.className='gooey-particle';effect.append(point);const angle=((360+(Math.random()-.5)*8)/15)*i*Math.PI/180,x=Math.cos(angle),y=Math.sin(angle),end=10+(Math.random()-.5)*7,duration=1200+(Math.random()-.5)*600;point.style.background=['#f2e7d2','#dbbf91','#c0d38c','#ffffff'][i%4];
   const a=point.animate([{transform:`translate(${x*90}px,${y*90}px) scale(0)`,opacity:0},{transform:`translate(${x*60}px,${y*60}px) scale(${.9+Math.random()*.2})`,opacity:1,offset:.2},{transform:`translate(${x*end}px,${y*end}px) scale(.3)`,opacity:1,offset:.8},{transform:`translate(${x*end}px,${y*end}px) scale(0)`,opacity:0}],{duration,easing:'cubic-bezier(.2,.6,.3,1)'});a.onfinish=()=>point.remove();
  }
 }
 links.forEach((a,i)=>{a.addEventListener('click',()=>{lock=performance.now()+1600;select(i,true)});a.addEventListener('keydown',e=>{if(e.key===' '){e.preventDefault();a.click()}})});
 function sync(){frame=0;if(performance.now()<lock)return;let index=0;for(let i=1;i<links.length;i++){const target=document.querySelector(links[i].getAttribute('href'));if(target&&target.getBoundingClientRect().top<=innerHeight*.4)index=i}select(index)}
 addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(sync)},{passive:true});addEventListener('hashchange',()=>{const index=links.findIndex(a=>a.hash===location.hash);if(index>=0)select(index)});new ResizeObserver(position).observe(nav);document.fonts?.ready.then(position);reduce.addEventListener('change',()=>effect.querySelectorAll('.gooey-particle').forEach(p=>p.remove()));select(Math.max(0,links.findIndex(a=>a.hash===location.hash)));sync();
})();
