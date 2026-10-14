(() => {
  'use strict';
  if(window.__portfolioClickSpark)return;
  window.__portfolioClickSpark=true;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const layers=new Map();
  const duration=400,sparkSize=10,sparkRadius=15,sparkCount=8;
  function layerFor(root){
    let layer=layers.get(root);
    if(layer?.canvas.isConnected)return layer;
    if(layer)cancelAnimationFrame(layer.frame);
    const canvas=document.createElement('canvas');
    canvas.setAttribute('aria-hidden','true');canvas.className='global-click-spark';
    canvas.style.cssText='position:fixed;inset:0;width:100%;height:100%;display:block;pointer-events:none;user-select:none;z-index:2147483647;background:transparent';
    root.append(canvas);
    const ctx=canvas.getContext('2d');
    if(!ctx){canvas.remove();return null}
    layer={canvas,ctx,sparks:[],frame:0};layers.set(root,layer);return layer;
  }
  function draw(layer,time){
    layer.frame=0;
    const {canvas,ctx}=layer;
    if(!canvas.isConnected){layer.sparks=[];return}
    const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
    const width=Math.round(rect.width*dpr),height=Math.round(rect.height*dpr);
    if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,rect.width,rect.height);
    ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.lineCap='round';
    // A fine shadow keeps the supplied white sparks legible on the light chapters.
    ctx.shadowColor='rgba(62,43,25,.65)';ctx.shadowBlur=2;
    layer.sparks=layer.sparks.filter(spark=>{
      const elapsed=time-spark.start;if(elapsed>=duration)return false;
      const t=Math.max(0,elapsed/duration),eased=t*(2-t),distance=eased*sparkRadius,length=sparkSize*(1-eased);
      const x=spark.x-rect.left,y=spark.y-rect.top;
      ctx.beginPath();ctx.moveTo(x+distance*Math.cos(spark.angle),y+distance*Math.sin(spark.angle));
      ctx.lineTo(x+(distance+length)*Math.cos(spark.angle),y+(distance+length)*Math.sin(spark.angle));ctx.stroke();return true;
    });
    if(layer.sparks.length)layer.frame=requestAnimationFrame(t=>draw(layer,t));
  }
  document.addEventListener('click',event=>{
    if(reduced.matches)return;
    let x=event.clientX,y=event.clientY;
    if(event.detail===0&&event.target instanceof Element){const r=event.target.getBoundingClientRect();x=r.left+r.width/2;y=r.top+r.height/2}
    // Resolve after navigation handlers: native modal dialogs occupy a separate top layer.
    requestAnimationFrame(()=>{
      const dialogs=[...document.querySelectorAll('dialog[open]')];
      const root=dialogs.at(-1)||document.body;
      for(const [host,old] of layers)if(!host.isConnected){cancelAnimationFrame(old.frame);layers.delete(host)}
      const layer=layerFor(root);if(!layer)return;
      const start=performance.now();
      layer.sparks.push(...Array.from({length:sparkCount},(_,i)=>({x,y,angle:2*Math.PI*i/sparkCount,start})));
      layer.sparks=layer.sparks.slice(-160);
      if(!layer.frame)layer.frame=requestAnimationFrame(t=>draw(layer,t));
    });
  },{capture:true,passive:true});
  function clear(){for(const layer of layers.values()){cancelAnimationFrame(layer.frame);layer.frame=0;layer.sparks=[];layer.ctx.clearRect(0,0,layer.canvas.width,layer.canvas.height)}}
  reduced.addEventListener('change',clear);document.addEventListener('visibilitychange',()=>{if(document.hidden)clear()});
})();
