(() => {
 const overlay=document.getElementById('site-loader');if(!overlay)return;
 const html=document.documentElement, main=document.querySelector('body > main');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const started=performance.now();let dismissed=false;
 const previousInert=main?.inert;if(main)main.inert=true;
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 const pageReady=new Promise(resolve=>document.readyState==='complete'?resolve():addEventListener('load',resolve,{once:true}));
 const sceneReady=new Promise(resolve=>{if(window.__studioFirstFrame)return resolve();addEventListener('portfolio-scene-ready',resolve,{once:true});setTimeout(resolve,6500);});
 const clean=()=>{if(dismissed)return;dismissed=true;html.classList.remove('portfolio-loading');if(main)main.inert=previousInert;overlay.remove();clearTimeout(window.__loaderRescue);dispatchEvent(new Event('portfolio-loader-complete'));};
 window.__closePortfolioLoader=clean;
 async function run(){
  await wait(reduced?0:1000);if(dismissed)return;overlay.classList.add('loader-light');
  await Promise.race([Promise.all([pageReady,sceneReady,document.fonts?.ready||Promise.resolve()]),wait(6500)]);
  await wait(Math.max(0,(reduced?250:3300)-(performance.now()-started)));if(dismissed)return;
  overlay.classList.add('loader-content-out');
  await wait(reduced?0:600);if(dismissed)return;
  overlay.classList.add('loader-reveal');
  await wait(reduced?100:1000);clean();
 }
 run().catch(clean);
 addEventListener('pageshow',e=>{if(e.persisted)clean();});
})();
