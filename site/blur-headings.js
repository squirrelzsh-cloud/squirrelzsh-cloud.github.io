(() => {
  'use strict';
  const groups=new Map(),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const block='h1,h2,h3,h4,h5,h6,p,button,a,li,dt,dd,label,blockquote,small,.os-ai,.os-poster-title,.os-label,.os-chapter';
  const clamp=x=>Math.max(0,Math.min(1,x)),range=(v,a,b)=>clamp((v-a)/(b-a));
  let queued=false;
  const visibleOwners=new Set();
  const visibility=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting)visibleOwners.add(entry.target);else visibleOwners.delete(entry.target)}schedule()},{rootMargin:'100px'});
  function scan(root){
    const nodes=[];
    if(root.nodeType===3)nodes.push(root);
    else if(root.nodeType===1){const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(walker.nextNode())nodes.push(walker.currentNode)}
    for(const node of nodes){
      const parent=node.parentElement;
      if(!parent||!node.textContent.trim()||parent.closest('blur-glyph,script,style,svg,canvas,textarea,select,option,[data-motion-owned],[contenteditable="true"]'))continue;
      const owner=parent.closest(block)||parent;
      let group=groups.get(owner);if(!group){group={glyphs:[],last:-1};groups.set(owner,group);visibleOwners.add(owner);visibility.observe(owner)}
      const fragment=document.createDocumentFragment();
      for(const part of node.textContent.match(/\s+|[A-Za-z0-9]+(?:[’'-][A-Za-z0-9]+)*|[^\s]/gu)||[]){
        if(/^\s+$/.test(part)){fragment.append(document.createTextNode(part));continue}
        const glyph=document.createElement('blur-glyph');glyph.dataset.blurGlyph='';glyph.textContent=part;group.glyphs.push(glyph);fragment.append(glyph);
      }
      node.replaceWith(fragment);group.last=-1;
    }
  }
  function chapterProgress(el){const r=el.getBoundingClientRect();return clamp(-(window.__sceneTop?.(r)??r.top)/Math.max(1,el.offsetHeight-innerHeight))}
  function progress(el,objectP,introP){
    if(reduced.matches)return 1;
    // Persistent navigation is already at its completed state, keeping it usable everywhere.
    if(el.closest('.nav,.case-nav,.case-toc,.menu-overlay,button,[role="button"],.case-next,.home-actions'))return 1;
    if(el.closest('.resume-portal'))return range(introP,0,.10);if(el.closest('#top'))return 1;
    if(el.closest('#design-intro')){
      if(el.closest('.intro-opening'))return range(introP,0,.10);
      const ranges=[['.intro-beat-one',.20,.29],['.intro-beat-two',.40,.50],['.intro-beat-three',.63,.72]];
      for(const [sel,a,b] of ranges)if(el.closest(sel))return range(introP,a,b);
    }
    if(el.closest('#object-story')){
      const timings=[['.os-left',2.6,2.92],['.os-right',2.85,3.2],['.os-ai',4.1,4.95],['.os-portable',6.7,7.02],['.os-detail',6.85,7.12],['.os-poster-title',11.35,11.9],['.os-portrait',6.7,7]];
      for(const [sel,a,b] of timings)if(el.closest(sel))return range(objectP,a,b);
      const card=el.closest('.os-media');if(card)return range(objectP,7.52+Number(card.dataset.project)*1.02,7.80+Number(card.dataset.project)*1.02);
      if(el.closest('.os-label'))return range(objectP%1,0,.18);
      return range(objectP,0,.18);
    }
    const environment=el.closest('.environment-scroll');if(environment)return range(chapterProgress(environment),.12,.44);
    const scroll=el.closest('.case-scroll'),rect=el.getBoundingClientRect();
    const viewport=scroll?scroll.getBoundingClientRect():{top:0,height:innerHeight};
    // End the reveal within the scroll distance that is actually available.
    const scroller=scroll||document.scrollingElement;
    const remaining=Math.max(0,scroller.scrollHeight-scroller.clientHeight-scroller.scrollTop);
    const distance=viewport.top+viewport.height-rect.top;
    if(remaining<=2&&rect.bottom>viewport.top&&distance>0)return 1;
    const end=Math.min(viewport.height*.38,Math.max(1,distance+remaining-24));
    const start=Math.min(viewport.height*.08,end*.25);
    return range(distance,start,end);
  }
  function paint(){
    queued=false;
    const object=document.getElementById('object-story'),intro=document.getElementById('design-intro');
    const objectP=object?chapterProgress(object)*12:0,introP=intro?chapterProgress(intro)*.74:0;
    const updates=[];
    for(const [el,group] of groups){
      if(!el.isConnected){groups.delete(el);visibleOwners.delete(el);visibility.unobserve(el);continue}
      if(!visibleOwners.has(el))continue;
      group.glyphs=group.glyphs.filter(g=>g.isConnected);
      if(!group.glyphs.length){groups.delete(el);continue}
      const bounds=el.getBoundingClientRect();if(bounds.bottom < -100 || bounds.top > innerHeight+100)continue;
      const t=progress(el,objectP,introP);if(Math.abs(t-group.last)<.0001)continue;group.last=t;
      const total=.7+(group.glyphs.length-1)*.2;
      updates.push(()=>group.glyphs.forEach((glyph,i)=>{
        const q=clamp((t*total-i*.2)/.7),y=q<.5?-50+110*q:10*(1-q);
        if(glyph._blurQ===q)return;glyph._blurQ=q;glyph.style.opacity=String(q);glyph.style.filter=q===1?'none':`blur(${10*(1-q)}px)`;glyph.style.transform=q===1?'none':`translateY(${y}px)`;
      }));
    }
    updates.forEach(write=>write());
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(paint)}}
  scan(document.body);paint();
  new MutationObserver(records=>{let changed=false;for(const r of records)for(const n of r.addedNodes){if(n.nodeType===1&&n.matches('blur-glyph'))continue;if(n.parentElement?.closest('blur-glyph'))continue;scan(n);changed=true}if(changed)schedule()}).observe(document.body,{childList:true,subtree:true});
  new ResizeObserver(schedule).observe(document.body);
  document.addEventListener('load',schedule,true);
  addEventListener('scroll',schedule,{passive:true,capture:true});addEventListener('portfolio-motion',schedule);addEventListener('resize',schedule);addEventListener('click',schedule);reduced.addEventListener('change',()=>{for(const g of groups.values())g.last=-1;schedule()});
})();
