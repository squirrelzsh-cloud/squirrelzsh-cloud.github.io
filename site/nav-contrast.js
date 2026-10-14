(() => {
 const nav=document.querySelector('nav.nav');if(!nav)return;
 let pending=0;
 function update(){
  pending=0;
  const rect=nav.getBoundingClientRect(),x=innerWidth/2,y=Math.max(1,Math.min(innerHeight-1,rect.top+rect.height/2));
  const layers=document.elementsFromPoint(x,y).filter(el=>!nav.contains(el));
  let dark=false;
  // The studio's live camera is dark after its cream opening header exits.
  if(document.documentElement.classList.contains('studio-active'))dark=!document.documentElement.classList.contains('studio-header-visible');
  else {
   for(const el of layers){
    const style=getComputedStyle(el);if(Number(style.opacity)<.1)continue;
    const rgb=style.backgroundColor.match(/[\d.]+/g);
    if(rgb&&rgb.length>=3&&(rgb.length<4||Number(rgb[3])>.85)){
     dark=.2126*Number(rgb[0])+.7152*Number(rgb[1])+.0722*Number(rgb[2])<145;break;
    }
   }
  }
  nav.dataset.tone=dark?'light':'dark';
 }
 function schedule(){if(!pending)pending=requestAnimationFrame(update)}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});
 new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
 update();
})();
