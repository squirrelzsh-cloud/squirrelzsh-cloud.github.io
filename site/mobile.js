(()=>{
 const phone=matchMedia('(max-width:800px)');
 // Stable scene height: Safari's collapsing toolbar must not jump the timeline.
 const measure=document.createElement('div');measure.style.cssText='position:fixed;top:0;width:0;height:100svh;visibility:hidden;pointer-events:none';document.body.append(measure);
 function viewport(){window.__portfolioHeight=phone.matches?measure.offsetHeight:innerHeight;}viewport();addEventListener('resize',viewport,{passive:true});
 const apply=img=>{if(img.dataset.mobileReady)return;img.dataset.mobileReady='1';const key=new URL(img.getAttribute('src')||'',document.baseURI).pathname.replace(/^\//,'');const list=window.__mobileImages?.[key];if(!list)return;img.srcset=[...list.filter(x=>x[1]<(window.__mobileImageWidths[key]||2048)).map(([u,w])=>'./'+u+' '+w+'w'),img.src+' '+(window.__mobileImageWidths[key]||2048)+'w'].join(', ');img.sizes='(max-width:800px) calc(100vw - 40px), 100vw';};
 document.querySelectorAll('img').forEach(apply);new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes){if(node.nodeType!==1)continue;if(node.matches('img'))apply(node);node.querySelectorAll('img').forEach(apply);}}).observe(document.body,{childList:true,subtree:true});
 const nav=document.querySelector('.nav'),links=nav?.querySelector('.top-links'),toggle=nav?.querySelector('.menu-button');
 document.querySelector('.menu-overlay')?.remove();
 if(nav&&links&&toggle){
 links.id='primary-navigation';toggle.setAttribute('aria-controls',links.id);
 const compact=matchMedia('(max-width:800px)');let open=false;
 function render(){nav.classList.toggle('nav-expanded',compact.matches&&open);toggle.setAttribute('aria-expanded',String(compact.matches&&open));toggle.setAttribute('aria-label',open?'收起目录':'打开目录');links.inert=compact.matches&&!open;}
 toggle.addEventListener('click',()=>{open=!open;render()});
 links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{open=false;render()}));
 compact.addEventListener('change',()=>{open=false;render()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&open){open=false;render();toggle.focus()}});
 render();
 }
})();

// Use the same vector family on iOS and desktop; never render arrow emoji.
(()=>{
 const paths={
  '↗':'M6 18 18 6M6 6h12v12',
  '↓':'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
  '↑':'M12 20V4m-6 6 6-6 6 6',
  '→':'M4 12h16m-6-6 6 6-6 6'
 };
 const ns='http://www.w3.org/2000/svg';
 function update(root){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];
  while(walker.nextNode()){
   const n=walker.currentNode,p=n.parentElement;
   if(p&&!p.closest('svg,script,style,textarea')&&p.closest('a,button,.rs-cta,.studio-footer')&&/[↗↓↑→]/u.test(n.textContent))nodes.push(n);
  }
  nodes.forEach(n=>{
   const fragment=document.createDocumentFragment();
   n.textContent.split(/([↗↓↑→][\uFE0E\uFE0F]?)/u).forEach(part=>{
    const d=paths[part[0]];
    if(!d){fragment.append(document.createTextNode(part));return}
    const svg=document.createElementNS(ns,'svg'),path=document.createElementNS(ns,'path');
    svg.classList.add('ui-action-icon');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');path.setAttribute('d',d);svg.append(path);fragment.append(svg);
   });
   n.replaceWith(fragment);
  });
 }
 update(document.body);
 new MutationObserver(records=>{for(const r of records)for(const n of r.addedNodes)if(n.nodeType===1&&!n.matches('svg,.ui-action-icon'))update(n)}).observe(document.body,{childList:true,subtree:true});
})();
