(() => {
window.enhancePortfolioCase=(dialog,p,index)=>{
 dialog.classList.add('reference-reader');
 const main=dialog.querySelector('.case-main'), hero=dialog.querySelector('.case-hero'), layout=dialog.querySelector('.case-layout'),toc=dialog.querySelector('.case-toc');
 const sidebar=document.createElement('aside');sidebar.className='reference-info';
 sidebar.append(hero);layout.prepend(sidebar);sidebar.append(toc);
 const summary=document.createElement('p');summary.className='reference-summary';summary.textContent=index<3?p.overview:'';hero.append(summary);
 const tags=document.createElement('div');tags.className='reference-tags';[p.role,p.label].forEach(t=>{const span=document.createElement('span');span.textContent=t;tags.append(span)});hero.append(tags);
 main.querySelectorAll('[data-chapter]').forEach(section=>{
  const figures=[...section.querySelectorAll('figure')];
  const info=document.createElement('details');info.className='reference-notes';
  const label=document.createElement('summary');label.textContent=section.querySelector('h2')?.textContent||'设计说明';info.append(label);
  figures.forEach(f=>f.remove());while(section.firstChild)info.append(section.firstChild);
  section.append(...figures);if(info.children.length>1)section.append(info);
 });
 const close=document.createElement('button');close.className='reference-close';close.setAttribute('data-exit','');close.setAttribute('aria-label','关闭项目详情');close.textContent='×';dialog.append(close);
 const rect=window.__caseOrigin;window.__caseOrigin=null;
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
 const end=dialog.getBoundingClientRect();dialog.animate([{opacity:.3,transform:rect?`translate(${rect.x+rect.width/2-end.x-end.width/2}px,${rect.y+rect.height/2-end.y-end.height/2}px) scale(${rect.width/end.width},${rect.height/end.height})`:'scale(.94)'},{opacity:1,transform:'none'}],{duration:650,easing:'cubic-bezier(.22,1,.36,1)'});
 }
};
})();
