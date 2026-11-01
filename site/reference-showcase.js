(() => {
 const gallery=document.getElementById('approach');
 if(!gallery||document.getElementById('design-practice'))return;
 const projects=[
 {title:'友趣派对',rest:'直播改版',tag:'01 / 产品体验 · UI 设计',desc:'从直播场景出发，梳理信息层级与互动入口，让内容展示和用户参与更清晰。',image:'assets/youqu/1.png',slug:'youqu'},
 {title:'传承行动',rest:'连接文化与日常',tag:'02 / 微信小程序 · 文化体验',desc:'用探索与参与连接传统文化，将内容、活动与视觉表达组织成连贯的小程序体验。',image:'assets/heritage/1.png',slug:'heritage'},
 {title:'龙舟竞渡',rest:'让节日更有参与感',tag:'03 / 运营活动 · 视觉设计',desc:'围绕端午龙舟主题，把活动规则、礼物与页面视觉串联起来，营造完整的节日体验。',image:'assets/dragon-boat/1.png',slug:'dragon-boat'}
 ];
 projects.push({title:'SoYii',rest:'下载页官网',tag:'04 / 官网设计 · AI 辅助落地',desc:'从品牌价值传达到 TikMe 下载体验，探索移动适配与设计到代码的落地。',image:'assets/soyii-web/1.jpg',slug:'soyii-web'});
 const section=document.createElement('section');section.id='design-practice';section.className='reference-showcase';
 section.innerHTML=`<div class="rs-inner"><header class="rs-project-heading"><h2>从作品中，<br>看见思考与实践。</h2><p>围绕产品、文化与运营场景，<br>探索不同问题的设计解法。</p></header><div class="rs-projects">${projects.map((p,i)=>`<a class="rs-project rs-project-${i}" href="#project-${p.slug}" data-project="${i}"><div class="rs-image"><img src="${p.image}" alt="${p.title}${p.rest}项目封面" width="1200" height="900" loading="lazy" decoding="async"></div><div class="rs-copy"><p class="rs-tag">${p.tag}</p><h3><span>${p.title}</span><br>${p.rest}</h3><p class="rs-project-description">${p.desc}</p><span class="rs-cta">查看完整项目 <span aria-hidden="true">↗</span></span></div></a>`).join('')}</div></div>`;
 gallery.before(section);
 const list=section.querySelector('.rs-projects');
 list.id='selected-work';
 const route=()=>{if(['#selected-work','#gateway'].includes(location.hash))requestAnimationFrame(()=>list.scrollIntoView({block:'start',behavior:'instant'}));};
 addEventListener('hashchange',route);addEventListener('load',route);route();
 list.querySelectorAll('.rs-project').forEach(card=>{
 const activate=()=>{list.classList.add('has-active');list.querySelectorAll('.rs-project').forEach(c=>c.classList.toggle('is-active',c===card));};
 card.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')activate();});card.addEventListener('focus',activate);
 card.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;if(typeof window.openPortfolioProject==='function'){e.preventDefault();window.openPortfolioProject(Number(card.dataset.project));}});
 });
 const clear=()=>{list.classList.remove('has-active');list.querySelectorAll('.rs-project').forEach(c=>c.classList.remove('is-active'));};
 list.addEventListener('pointerleave',clear);list.addEventListener('focusout',e=>{if(!list.contains(e.relatedTarget))clear();});
})();
