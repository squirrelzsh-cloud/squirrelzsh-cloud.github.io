(() => {
 let current=scrollY,target=scrollY,frame=0,last=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 window.__sceneTop=(rect)=>rect.top+scrollY-current;
 function tick(now){frame=0;const dt=Math.min(50,now-last||16.67);last=now;current=reduced.matches?target:current+(target-current)*(1-Math.exp(-dt/65));if(Math.abs(target-current)<.1)current=target;dispatchEvent(new Event('portfolio-motion'));if(current!==target)frame=requestAnimationFrame(tick)}
 function wake(){target=scrollY;if(!frame){last=performance.now();frame=requestAnimationFrame(tick)}}
 addEventListener('scroll',wake,{passive:true});addEventListener('resize',wake);reduced.addEventListener('change',wake);
})();