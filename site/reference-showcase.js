(() => {
 const gallery=document.getElementById('approach');
 if(!gallery||document.getElementById('design-practice'))return;
 const skills=[
 ['用户调研','从使用场景与真实需求出发，找到体验中值得解决的问题。'],
 ['需求梳理','整理目标、任务与使用路径，让设计有清晰的起点。'],
 ['信息架构','组织内容层级与导航关系，让信息更容易理解和找到。'],
 ['交互原型','把流程转化为可操作的原型，推敲状态、反馈与关键细节。'],
 ['UI 视觉设计','结合视觉传达背景，让界面语言与产品目标保持一致。'],
 ['运营活动设计','围绕活动主题组织视觉、规则与反馈，让参与过程更清楚。'],
 ['设计规范','梳理组件与样式，保持多页面体验的一致性。'],
 ['AIGC 探索','探索生成工具在概念发散、素材制作与设计表达中的应用。'],
 ['前端落地','通过代码与动效探索，让静态方案成为可以使用的体验。']
 ];
 const projects=[
 {title:'友趣派对',rest:'直播改版',tag:'01 / 产品体验 · UI 设计',desc:'从直播场景出发，梳理信息层级与互动入口，让内容展示和用户参与更清晰。',image:'assets/youqu/1.png',slug:'youqu'},
 {title:'传承行动',rest:'连接文化与日常',tag:'02 / 微信小程序 · 文化体验',desc:'用探索与参与连接传统文化，将内容、活动与视觉表达组织成连贯的小程序体验。',image:'assets/heritage/1.png',slug:'heritage'},
 {title:'龙舟竞渡',rest:'让节日更有参与感',tag:'03 / 运营活动 · 视觉设计',desc:'围绕端午龙舟主题，把活动规则、礼物与页面视觉串联起来，营造完整的节日体验。',image:'assets/dragon-boat/1.png',slug:'dragon-boat'}
 ];
 const section=document.createElement('section');section.id='design-practice';section.className='reference-showcase';
 section.innerHTML=`<div class="rs-inner"><header class="rs-heading"><p>DESIGN IN PRACTICE</p><h2>把想法，做成<br>可以使用的体验。</h2></header><div class="rs-skills">${[0,1,2].map(row=>`<div class="rs-skill-row">${skills.slice(row*3,row*3+3).map(([title,desc],i)=>`<button class="rs-skill" type="button" aria-expanded="false" aria-controls="rs-description-${row*3+i}"><span class="rs-skill-title">${title}</span><span class="rs-description" id="rs-description-${row*3+i}">${desc}</span><span class="rs-plus" aria-hidden="true">+</span></button>`).join('')}</div>`).join('')}</div><header class="rs-project-heading"><h2>从作品中，<br>看见思考与实践。</h2><p>围绕产品、文化与运营场景，<br>探索不同问题的设计解法。</p></header><div class="rs-projects">${projects.map((p,i)=>`<a class="rs-project rs-project-${i}" href="#project-${p.slug}" data-project="${i}"><div class="rs-image"><img src="${p.image}" alt="${p.title}${p.rest}项目封面" width="1200" height="900" loading="lazy" decoding="async"></div><div class="rs-copy"><p class="rs-tag">${p.tag}</p><h3><span>${p.title}</span><br>${p.rest}</h3><p class="rs-project-description">${p.desc}</p><span class="rs-cta">查看完整项目 <span aria-hidden="true">↗</span></span></div></a>`).join('')}</div></div>`;
 gallery.before(section);
 const buttons=[...section.querySelectorAll('.rs-skill')];
 function activate(button){buttons.forEach(b=>{const active=b===button;b.classList.toggle('is-active',active);b.setAttribute('aria-expanded',String(active));b.closest('.rs-skill-row').classList.toggle('has-active',!!button&&b.closest('.rs-skill-row')===button.closest('.rs-skill-row'));});}
 buttons.forEach(button=>{
 button.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')activate(button);});
 button.addEventListener('focus',()=>{if(button.matches(':focus-visible'))activate(button);});
 button.addEventListener('click',e=>{if(e.detail!==0)activate(button.classList.contains('is-active')&&e.pointerType!=='mouse'?null:button);});
 });
 section.querySelector('.rs-skills').addEventListener('pointerleave',()=>{if(!section.querySelector('.rs-skill:focus-visible'))activate(null);});
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
