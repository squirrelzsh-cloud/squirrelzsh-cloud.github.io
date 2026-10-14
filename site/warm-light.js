(() => {
  const start=document.getElementById('design-intro'),end=document.getElementById('approach');
  if(!start||!end)return;
  let queued=false;
  const update=()=>{queued=false;document.body.classList.toggle('warm-reading',start.getBoundingClientRect().top<=80&&end.getBoundingClientRect().top>80)};
  const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(update)}};
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);update();
})();