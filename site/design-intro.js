import {clamp,prepareJourney} from './window-journey.mjs';
const section=document.querySelector('#design-intro');
if(section){
 const content=section.querySelector('.intro-journey-content');
 const viewport=section.querySelector('.intro-text-viewport');
 const copy=section.querySelector('.intro-text-stream');
 const device=section.querySelector('.intro-window'),image=device.querySelector('img');
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let geometry=null,frame=0,needsMeasure=true;
 function measure(){
  needsMeasure=false;
  if(reduced.matches){geometry=null;return;}
  const height=window.__portfolioHeight||innerHeight,width=content.clientWidth;
  if(!width||!height)return;
  section.style.setProperty('--intro-screen',height+'px');
  const bottom=parseFloat(getComputedStyle(viewport).paddingBottom)||0;
  const flowHeight=height+copy.offsetHeight+bottom;
  const property=flowHeight+'px';
  if(section.style.getPropertyValue('--intro-flow-height')!==property)section.style.setProperty('--intro-flow-height',property);
  const next=document.getElementById('capabilities');
  const nextPadding=next?parseFloat(getComputedStyle(next).paddingTop)||0:72;
  const nav=document.querySelector('nav.nav');
  const top=Math.max(64,nav?.getBoundingClientRect().bottom||0)+12;
  const travel=Math.max(1,flowHeight+nextPadding-top);
  const nextAreaEntry=clamp((flowHeight-height)/travel);
  const windowFinish=Math.min(.48,Math.max(.2,nextAreaEntry-.08));
  geometry={...prepareJourney({width,height,top:0,copyHeight:copy.offsetHeight,columnWidth:viewport.clientWidth,windowRatio:width<=800?.19:.11}),travel,windowFinish};
  device.style.width=geometry.windowWidth+'px';
  device.style.height=geometry.windowHeight+'px';
 }
 function paint(){
  frame=0;
  const rect=section.getBoundingClientRect(),height=window.__portfolioHeight||innerHeight;
  document.documentElement.classList.toggle('intro-reading',rect.top<height*.8&&rect.bottom>64);
  if(needsMeasure)measure();
  if(reduced.matches){copy.style.transform='none';section.dataset.windowProgress='reduced';return;}
  if(!geometry||rect.bottom<0||rect.top>height)return;
  // Text and the following chapter share native flow, with no empty pinned tail.
  const progress=clamp(-rect.top/geometry.travel);
  const windowProgress=clamp(progress/geometry.windowFinish);
  const point=geometry.route(.14+.86*windowProgress);
  const exit=clamp((windowProgress-.9)/.1);
  const rawX=point.x*geometry.width-geometry.windowWidth/2;
  const x=rawX*(1-exit)+(-geometry.windowWidth-1)*exit;
  const y=56+point.y*(geometry.height-56)-geometry.windowHeight/2;
  device.style.transform=`translate3d(${x}px,${y}px,0) scale(${point.scale})`;
  section.dataset.introProgress=progress.toFixed(4);
  section.dataset.windowProgress=windowProgress.toFixed(4);
  section.dataset.windowPhase=windowProgress>=1?'complete':windowProgress<.65?'drift-right':'return-left';
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(paint);}
 function remeasure(){needsMeasure=true;schedule();}
 for(const event of ['scroll','portfolio-motion','load','portfolio-loader-complete'])addEventListener(event,schedule,{passive:true});
 addEventListener('resize',remeasure,{passive:true});
 reduced.addEventListener('change',remeasure);
 new ResizeObserver(remeasure).observe(copy);
 new ResizeObserver(remeasure).observe(viewport);
 image.addEventListener('load',remeasure);
 document.fonts?.ready.then(remeasure);
 paint();
}
