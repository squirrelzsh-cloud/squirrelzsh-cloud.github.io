(()=>{'use strict';
const root=document.querySelector('#studio-opening'),stage=root?.querySelector('.studio-stage');if(!stage)return;
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
const clamp=x=>Math.max(0,Math.min(1,x)),smooth=(x,a,b)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
const word=document.createElement('div');word.className='lift-wordmark';word.setAttribute('aria-hidden','true');word.innerHTML='<span>XIAOHAO</span>';
const person=document.createElement('div');person.className='lift-person';person.setAttribute('aria-hidden','true');
const makeImage=()=>{const image=new Image();image.src='./assets/xiaohao-lift-person.png';image.alt='';image.draggable=false;image.width=1672;image.height=941;image.decoding='async';return image};
const portrait=makeImage();person.append(portrait);
const hands=['left','right'].map(side=>{const layer=document.createElement('div');layer.className='lift-hand';layer.setAttribute('aria-hidden','true');const image=makeImage();image.style.clipPath=side==='left'?'polygon(0 55%, 12% 55%, 12% 77%, 0 77%)':'polygon(88% 55%,100% 55%,100% 77%,88% 77%)';layer.append(image);return {side,layer,image}});
stage.append(word,person,...hands.map(h=>h.layer));
let lastProgress=0,ready=false;portrait.addEventListener('load',()=>{ready=true;render(lastProgress)});if(portrait.complete&&portrait.naturalWidth)ready=true;
function render(progress){lastProgress=progress;
 const show=!reduced.matches&&ready&&progress>.001&&progress<.091;
 const opacity=smooth(progress,.001,.006)*(1-smooth(progress,.065,.09));
 stage.classList.toggle('lift-active',show&&opacity>.01);
 person.style.opacity=show?String(opacity):'0';word.style.opacity=show?String(opacity*(1-smooth(progress,.025,.06))*.65):'0';
 for(const hand of hands)hand.layer.style.opacity=show?String(opacity*smooth(progress,.008,.019)):'0';
 root.dataset.liftPhase=progress<.001?'idle':progress<.012?'peek':progress<.028?'grip':progress<.09?'lift':'original-camera';
 if(!show)return;
 const height=stage.clientHeight,width=stage.clientWidth,style=getComputedStyle(stage);
 const reveal=smooth(progress,0,.09),heading=root.querySelector('.studio-heading');
 const startTop=width<=800?Math.max(48,heading.offsetHeight/height*100):43;
 const top=startTop*(1-reveal)*height/100;
 const edge=(width<=700?20:Math.min(width*.06,92))*(1-reveal);
 // Body and finger layers share one source, with fingers anchored to the actual live canvas edges.
 const actorWidth=Math.min((width-edge*2)*.85,920),actorHeight=actorWidth*941/1672;
 const emerge=(1-smooth(progress,.001,.018))*actorHeight*.60;
 const y=top-actorHeight*.62+emerge;
 person.style.height=top+'px';portrait.style.width=actorWidth+'px';portrait.style.height=actorHeight+'px';portrait.style.left=(width-actorWidth)/2+'px';portrait.style.top=y+'px';
 for(const {side,image} of hands){image.style.width=actorWidth+'px';image.style.height=actorHeight+'px';image.style.left=(side==='left'?edge-actorWidth*.055:width-edge-actorWidth*.945)+'px';image.style.top=(top-actorHeight*.61)+'px'}
}
stage.addEventListener('studio-frame',event=>render(event.detail.progress));
// The normal WebGL path above owns all original timings and camera movement.
// This branch only expands the existing fallback photograph, which has no camera to advance.
let fallbackRaf=0;
function fallback(){fallbackRaf=0;if(!root.classList.contains('studio-fallback'))return;
 const height=window.__portfolioHeight||innerHeight,rect=root.getBoundingClientRect();
 const p=clamp(-(window.__sceneTop?.(rect)??rect.top)/Math.max(1,root.offsetHeight-height))*.16;
 const reveal=smooth(p,0,.09),heading=root.querySelector('.studio-heading');
 const top=(innerWidth<=800?Math.max(48,heading.offsetHeight/height*100):43)*(1-reveal);
 stage.style.setProperty('--scene-top',top+'%');stage.style.setProperty('--scene-edge',((innerWidth<=700?20:Math.min(innerWidth*.06,92))*(1-reveal))+'px');stage.style.setProperty('--scene-bottom',24*(1-reveal)+'px');stage.style.setProperty('--fallback-heading',String(1-smooth(p,0,.045)));
 render(p);
}
function schedule(){if(!fallbackRaf)fallbackRaf=requestAnimationFrame(fallback)}
for(const event of ['scroll','portfolio-motion','resize','portfolio-loader-complete'])addEventListener(event,schedule,{passive:true});
new MutationObserver(schedule).observe(root,{attributes:true,attributeFilter:['class']});
reduced.addEventListener('change',()=>{render(lastProgress);schedule()});schedule();
})();
