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
