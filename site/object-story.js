(()=>{'use strict';
const following=document.getElementById('approach');if(!following||document.getElementById('object-story'))return;
const resume=document.querySelector('.designer-resume');
if(resume){
 const set=(selector,value)=>{const el=resume.querySelector(selector);if(el)el.innerHTML=value};
 set('.designer-eyebrow','你好，我是');
 set('#designer-name','赵松浩<span>ZHAO SONG HAO</span>');
 set('.designer-lead','关注产品体验<br>与视觉表达的设计师。');
 set('.designer-summary','视觉传达设计专业本科生，求职方向为 UI/UX 设计与运营设计。关注用户调研、信息架构、交互原型与视觉表达，持续探索从高保真设计到前端落地的完整流程。');
 set('.designer-status','求职方向 · UI/UX 设计实习生');
 set('.designer-personal','设计之外 / 街舞 · 吉他<br>在动作与音乐中，感受节奏与表达。');
 const education=resume.querySelectorAll('.designer-details>section');
 if(education[0]){const p=education[0].querySelector('p');if(p)p.textContent='河南财经政法大学 · 视觉传达设计 · 本科大四。';}
 if(education[1]){const p=education[1].querySelector('p');if(p)p.textContent='熟练使用 Figma、PS、AI、Midjourney、Gemini、即梦、Atypica AI 与 Claude Code，覆盖视觉探索、原型设计和前端落地练习。';}
 const projects=resume.querySelectorAll('.designer-project');
 [['友趣派对直播改版','直播社交 / UX/UI 改版','用户调研、直播卡片、等级体系与关系复访路径。'],['传承行动','微信小程序 / 非遗电商体验','首页信息架构、非遗氛围、商品分类与购买路径改版。'],['龙舟竞渡运营','节日运营 / IP 与活动视觉','龙舟 IP、主会场、互动任务、奖励与分享物料设计。']].forEach((item,i)=>{const el=projects[i];if(!el)return;const h=el.querySelector('h4'),s=el.querySelector('span'),p=el.querySelector('p');if(h)h.textContent=item[0];if(s)s.textContent=item[1];if(p)p.textContent=item[2]});
}
const editorial=document.querySelector('.editorial-page');
if(editorial){
 const set=(selector,value)=>{const el=editorial.querySelector(selector);if(el)el.innerHTML=value};
 set('.editorial-masthead>span:nth-of-type(2)','简历与设计实践');
 set('.editorial-title>p','ABOUT XIAOHAO');
 set('.editorial-title h2','视觉传达出发，<br><em>把体验做得更清楚。</em>');
 set('.editorial-title>div>span:first-child','河南财经政法大学 · 视觉传达设计');
 set('.editorial-title>div>span:last-child','赵松浩 / UI · UX · 运营设计');
 const practice=editorial.querySelector('.editorial-practice');
 if(practice){const h=practice.querySelector('.editorial-practice-grid>h3');if(h)h.innerHTML='从问题出发。<br><em>让设计落地。</em>';const rows=practice.querySelectorAll('article');[['用户调研与定义','通过问卷、访谈和竞品分析，找到用户真正卡住的步骤。'],['信息架构与视觉','把首页、卡片、分类和反馈整理成可以理解的路径。'],['AIGC 与前端探索','用 Figma、即梦、Atypica AI 与 Claude Code 加快探索并验证实现。']].forEach((v,i)=>{const row=rows[i];if(!row)return;const title=row.querySelector('h4'),p=row.querySelector('p');if(title)title.textContent=v[0];if(p)p.textContent=v[1]})}
 const personal=editorial.querySelector('.editorial-personal-grid');if(personal){const h=personal.querySelector('h3');if(h)h.innerHTML='保持好奇。<br>保持练习。';const ps=personal.querySelectorAll('p');if(ps[0])ps[0].textContent='我关注产品体验、交互逻辑与视觉表达，也持续练习把设计从高保真画面推进到真实页面。';if(ps[1])ps[1].textContent='街舞和吉他让我对节奏、停顿与留白保持敏感；这些感受也会回到我的转场、反馈和信息层级里。'}
}
const next=document.querySelector('.chapter-next');if(next)next.href='#selected-work';
})();

/* Resume content is taken from the supplied October resume. */
(()=>{
 const resume=document.querySelector('#approach.designer-resume');
 if(resume){
 resume.querySelector('.designer-summary').textContent='河南财经政法大学视觉传达设计专业本科生，求职方向为 UX / 产品体验设计实习生、UI / 交互设计。以需求分析、信息架构、用户流程与高保真界面为基础，结合 AI 工具与前端 Demo 验证设计。';
 resume.querySelector('.designer-status').textContent='求职方向 · UX / 产品体验 · UI / 交互设计';
 resume.querySelector('.designer-details').innerHTML=`
 <section><h3><span>01</span>企业实习经历</h3><div class="designer-row"><strong>杭州鲲动利智能科技有限公司</strong><span>2026.07—2026.10</span></div><p><strong>UI 设计实习生</strong></p><p><strong>设计范围 · </strong>参与 SoYii 品牌官网、TikMe AI 工具下载页、SaaS 后台与商城移动端的设计优化，围绕信息层级、下载引导与品牌一致性推进方案。</p><p><strong>我的职责 · </strong>协作完成官网首页；独立负责 TikMe 下载页与 About Us 页面设计。完成多端适配、中文与印尼语内容适配、图标探索及视觉规范整理。</p><p><strong>落地验证 · </strong>结合 Figma、Codex 等工具辅助生成前端 Demo，检查布局与响应式效果，让设计在真实页面中得到验证。</p></section>
 <section><h3><span>02</span>工作室项目经历</h3><div class="designer-row"><strong>河南财经政法大学文化遗产研究与实践工作室</strong><span>2025.09—2026.05</span></div>
 <article class="designer-project"><div><h4>友趣派对直播社交改版</h4><span>校企合作项目</span></div><p>参与广场页向交友匹配站升级，负责用户卡片信息重构、等级名片体系、情绪礼物与动态页设计。借助 Figma、Atypica AI、Claude Code 制作高保真交互原型与动态效果，梳理社交路径与视觉规范。</p></article>
 <article class="designer-project"><div><h4>龙舟竞渡端午运营活动</h4><span>全案视觉设计</span></div><p>负责节日 IP、主会场、粽子雨互动界面、奖励弹窗与分享海报。使用 Gemini、Liblib 探索素材，再以 Figma、PS 统一视觉与物料规范，兼顾节日氛围与活动参与。</p></article>
 <article class="designer-project"><div><h4>传承行动小程序改版</h4><span>非遗电商 · 全链路 UI</span></div><p>梳理品牌色彩、首页非遗氛围、商品分类、搜索引导与消息中心，回应用户路径不清晰与品牌感知弱的问题。结合即梦、Figma AI 迭代方案，输出高保真界面与组件库。</p></article></section>
 <section><h3><span>03</span>专业能力与工具</h3><div class="designer-tags"><span>需求分析</span><span>信息架构</span><span>用户流程</span><span>交互原型</span><span>响应式设计</span><span>组件规范</span></div><p>设计：Figma、Photoshop、Illustrator。<br>AI 与验证：Codex、Claude Code、Gemini、Midjourney、即梦、Atypica AI。</p><p>将用户洞察与业务目标转化为设计判断，结合创意探索、素材生成、原型制作与多语言适配，推进从构思到验证的完整过程。</p></section>
 <section><h3><span>04</span>教育与校园经历</h3><div class="designer-row"><strong>河南财经政法大学 · 视觉传达设计</strong><span>本科 · 大四</span></div><p>担任班级组织委员、校园团办成员、街舞社团团支书及安全卫生委员，积累跨角色协作与活动推进经验。</p><p>2023—2024 学年校级二等奖学金；2024 年度优秀团员。<br>2025 年河南省第十二届学生健美操啦啦操比赛：本科甲组单人街舞 BREAKING 第四名。<br>2024 年河南省第十一届学生健美操啦啦操比赛：大学本科甲组小集体街舞自选动作第一名。</p></section>
 <section><h3><span>05</span>个人优势</h3><p>重视项目落地，愿意反复打磨细节；能够并行推进任务，持续学习新工具。在设计表达、团队协作与实现验证之间建立连接。</p></section>`;
 }
 const practice=document.querySelector('#skills');if(!practice)return;
 practice.id='reviews';
 practice.classList.add('feedback-section');
 // First-person collaboration strengths, grounded in resume experience.
 const reviews=[
  {quote:'面对 TikMe 下载页需求，我主动梳理产品定位、信息层级和下载引导，兼顾多端与多语言适配，再用前端演示检查方案，把设计推进到可以体验的页面。',role:'独立推进',company:'鲲动利 · 官网设计',avatar:'策',context:'企业实习'},
  {quote:'在官网、后台和商城项目中，我重视页面、图标与规范的一致性，愿意反复核对细节、主动对齐分工。面对不同任务，保持认真推进和稳定交付的习惯。',role:'细节与协作',company:'鲲动利 · 后台与商城',avatar:'细',context:'企业实习'},
  {quote:'从非遗小程序改版到端午运营活动，我关注文化表达、信息结构与使用体验之间的关系，结合新工具探索素材、完善原型，让创意与完整的设计逻辑相互支撑。',role:'设计思考',company:'非遗小程序 · 运营活动',avatar:'思',context:'项目实践'},
  {quote:'班级、校园团办和街舞社团的经历，让我更愿意承担责任、沟通协作。做项目时既保持想法，也投入时间打磨细节，努力成为让伙伴放心的合作者。',role:'担当与执行',company:'班级 · 校园团办 · 街舞社团',avatar:'行',context:'校园经历'}
 ];
 const cards=reviews.map((review,i)=>`<button class="feedback-card" type="button" data-review="${i}" aria-pressed="false" aria-label="${review.role}，点击暂停或继续滚动"><span class="feedback-card-top"><span class="feedback-quote-mark" aria-hidden="true">“</span><span class="feedback-sample">${review.context}</span></span><span class="feedback-quote">${review.quote}</span><span class="feedback-person"><span class="feedback-avatar" aria-hidden="true">${review.avatar}</span><span class="feedback-identity"><span class="feedback-role">${review.role}</span><span class="feedback-company">${review.company}</span></span></span></button>`).join('');
 practice.setAttribute('aria-labelledby','feedback-title');
 practice.innerHTML=`<header class="feedback-heading"><p class="feedback-eyebrow">协作优势</p><h3 id="feedback-title">协作中的我。</h3><p class="feedback-subtitle">在企业实习与校园实践中，积累思考、执行与协作的力量</p></header><div class="feedback-track" tabindex="0" aria-label="协作优势卡片，向左无缝循环，可滑动或点击暂停"><div class="feedback-group">${cards}</div></div>`;
 const track=practice.querySelector('.feedback-track'),group=track.querySelector('.feedback-group');
 const duplicate=group.cloneNode(true);duplicate.setAttribute('aria-hidden','true');
 duplicate.querySelectorAll('button').forEach(card=>card.tabIndex=-1);track.append(duplicate);
 let paused=false,hover=false,touching=false,last=0,cycle=0,carry=0;
 function measure(){cycle=duplicate.offsetLeft-group.offsetLeft;normalize()}
 function normalize(){if(cycle>0&&track.scrollLeft>=cycle)track.scrollLeft%=cycle}
 track.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')hover=true});
 track.addEventListener('pointerleave',()=>hover=false);
 track.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&duplicate.contains(e.target))e.preventDefault()});
 track.addEventListener('click',e=>{
  const card=e.target.closest('.feedback-card');if(!card)return;
  paused=!paused;
  track.querySelectorAll('.feedback-card').forEach(item=>{
   const selected=paused&&item.dataset.review===card.dataset.review;
   item.classList.toggle('feedback-selected',selected);item.setAttribute('aria-pressed',String(selected));
  });
 });
 track.addEventListener('touchstart',()=>touching=true,{passive:true});
 track.addEventListener('touchend',()=>touching=false,{passive:true});
 track.addEventListener('touchcancel',()=>touching=false,{passive:true});
 track.addEventListener('scroll',normalize,{passive:true});
 new ResizeObserver(measure).observe(group);document.fonts?.ready.then(measure);measure();
 const reduce=matchMedia('(prefers-reduced-motion:reduce)');let visible=false;
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting},{rootMargin:'100px'}).observe(track);
 function tick(now){
  const dt=Math.min(50,now-last||16);last=now;
  const keyboardFocus=track.matches(':focus-visible')||track.querySelector('.feedback-card:focus-visible');
  if(visible&&!paused&&!hover&&!touching&&!keyboardFocus&&!reduce.matches&&!document.hidden&&cycle>0){
   carry+=dt*.028;const step=Math.floor(carry);carry-=step;
   track.scrollLeft=(track.scrollLeft+step)%cycle;
  }
  requestAnimationFrame(tick);
 }
 requestAnimationFrame(tick);
 document.querySelectorAll('a[href="#skills"]').forEach(link=>link.href='#tech-stack');
 // Resolve only this section's direct link after the dynamic section exists.
 const routeFeedback=()=>{if(location.hash==='#reviews')requestAnimationFrame(()=>practice.scrollIntoView({block:'start',behavior:'instant'}))};
 addEventListener('hashchange',routeFeedback);addEventListener('load',routeFeedback);routeFeedback();
})();
