/* The about section uses document scrolling; its directory stays in sync. */
(()=>{
  const root=document.querySelector('#approach.about-editorial');
  if(!root)return;
  const flow=root.querySelector('.ab-flow');
  const chapters=[...root.querySelectorAll('[data-section]')];
  const links=[...root.querySelectorAll('.ab-jump')];
  let queued=false;
  function measure(){
    const offset=chapters[0].getBoundingClientRect().top-flow.getBoundingClientRect().top;
    root.style.setProperty('--about-overview-offset',Math.max(0,offset)+'px');
  }
  function update(){
    queued=false;
    const bounds=root.getBoundingClientRect();
    document.body.classList.toggle('about-reading',bounds.top<=74&&bounds.bottom>74);
    const threshold=innerWidth<=680?190:180;
    let active=0;
    chapters.forEach((section,i)=>{if(section.getBoundingClientRect().top<=threshold)active=i;});
    links.forEach((link,i)=>{
      if(i===active)link.setAttribute('aria-current','true');
      else link.removeAttribute('aria-current');
    });
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(update);}}
  addEventListener('scroll',schedule,{passive:true});
  const resize=new ResizeObserver(()=>{measure();schedule();});
  resize.observe(flow);
  addEventListener('resize',()=>{measure();schedule();});
  document.fonts?.ready.then(()=>{measure();schedule();});
  measure();update();
})();
