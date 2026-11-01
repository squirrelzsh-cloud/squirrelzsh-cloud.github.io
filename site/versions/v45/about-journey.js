(()=>{
 'use strict';
 const section=document.querySelector('.environment-scroll');if(!section)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),get=s=>section.querySelector(s),clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x)},phase=(p,a,b)=>smooth((p-a)/(b-a));
 const back=get('.environment-back'),front=get('.environment-front'),title=get('.environment-title'),paper=get('.environment-paper'),shade=get('.environment-shade'),caption=get('.environment-caption'),nav=document.querySelector('.nav'),editorial=document.querySelector('.editorial-page');
 let queued=false;
 function render(){
  const rect=section.getBoundingClientRect(),p=clamp(-rect.top/Math.max(1,section.offsetHeight-innerHeight));
  if(!reduced.matches){
   const move=phase(p,.06,.95),arrival=phase(p,.12,.44),pass=phase(p,.57,.90);
   back.style.transform=`scale(${1+move*.85})`;back.style.filter=`sepia(.72) hue-rotate(48deg) saturate(.55) brightness(${1.15-move*.25})`;
   front.style.transform=`translateY(${move*12}%) scale(${.82+move*2.3})`;front.style.opacity=String(phase(p,.04,.2)*(1-phase(p,.7,.96)));
   shade.style.opacity=String(move*.2);
   title.style.transform=`perspective(1000px) translateZ(${-500*(1-arrival)+pass*950}px)`;title.style.opacity=String(arrival*(1-phase(p,.76,.89)));
   paper.style.opacity=String(phase(p,.84,1));caption.style.opacity=String(1-phase(p,.66,.88));
  }
  nav?.classList.toggle('editorial-nav',editorial.getBoundingClientRect().top<80&&editorial.getBoundingClientRect().bottom>70);
 }
 const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render()})};
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduced.addEventListener('change',schedule);render();
 const oldTargets={workflow:'skills',reviews:'about',resume:'approach',contact:'about'};
 const resolve=()=>{const dest=oldTargets[location.hash.slice(1)];if(dest)document.getElementById(dest)?.scrollIntoView({behavior:'instant'})};addEventListener('hashchange',resolve);resolve();
})();
