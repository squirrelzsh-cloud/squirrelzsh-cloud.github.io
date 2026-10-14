(()=>{
 'use strict';
 const section=document.querySelector('.environment-scroll');if(!section||!section.querySelector('.journal-switch'))return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),get=s=>section.querySelector(s),clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x)},phase=(p,a,b)=>smooth((p-a)/(b-a));
 const back=get('.environment-back'),depth=get('.environment-depth'),intro=get('.journal-intro'),button=get('.journal-switch'),lines=[...get('.journal-switch').querySelectorAll('.journal-line>span')],nav=document.querySelector('.nav'),editorial=document.querySelector('.editorial-page');
 const copies=[['保持好奇','理解问题','让设计落地'],['视觉表达','交互逻辑','产品体验'],['从一个想法','到一次实践','让体验更清晰']];let index=0,animations=[],queued=false;
 button.addEventListener('click',()=>{index=(index+1)%copies.length;animations.forEach(a=>a.cancel());animations=[];lines.forEach((line,i)=>{if(reduced.matches){line.textContent=copies[index][i];return}const out=line.animate([{opacity:1},{opacity:0}],{duration:240,delay:i*65,fill:'forwards',easing:'cubic-bezier(.5,0,.5,1)'});animations.push(out);out.onfinish=()=>{line.textContent=copies[index][i];out.cancel();animations.push(line.animate([{opacity:0},{opacity:1}],{duration:400,fill:'forwards',easing:'cubic-bezier(.16,1,.3,1)'}))}})});
 function render(){
  const rect=section.getBoundingClientRect(),p=clamp(-(window.__sceneTop?.(rect)??rect.top)/Math.max(1,section.offsetHeight-(window.__portfolioHeight||innerHeight)));
  const wipe=reduced.matches?1:phase(p,.08,.52);
  depth.style.transform=`translate3d(0,${-wipe*100}%,0)`;
  back.style.transform=`scale(${1+wipe*.06})`;
  intro.style.transform=`translate3d(0,${(1-wipe)*100}%,0)`;
  button.style.transform='none';
  const e=editorial?.getBoundingClientRect(),resume=document.getElementById('approach')?.getBoundingClientRect();nav?.classList.toggle('editorial-nav',(rect.top<0&&rect.bottom>70&&wipe>.5)||(e&&e.top<80&&e.bottom>70)||(resume&&resume.top<80&&resume.bottom>70));
 }
 const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render()})};
 addEventListener('scroll',schedule,{passive:true});addEventListener('portfolio-motion',schedule);addEventListener('resize',schedule);reduced.addEventListener('change',schedule);render();
 const oldTargets={workflow:'skills',reviews:'about',resume:'approach',contact:'about'};
 const resolve=()=>{const dest=oldTargets[location.hash.slice(1)];if(dest)document.getElementById(dest)?.scrollIntoView({behavior:'instant'})};addEventListener('hashchange',resolve);resolve();
})();
