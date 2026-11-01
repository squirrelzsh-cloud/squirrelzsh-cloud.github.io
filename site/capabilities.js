(() => {
  'use strict';
  const following = document.getElementById('approach');
  if (!following || document.getElementById('capabilities')) return;
  const skills = [
    {
      title: '需求梳理',
      subtitle: '从用户调研出发，把模糊目标变成清楚的设计任务',
      sections: [
        ['我的理解', '我会从具体的使用场景出发，理解用户想完成什么、在哪一步犹豫，再把这些发现与业务目标、实现条件放在一起，确定要解决的问题及优先级。用户调研帮助我找到依据，需求梳理则把这些依据转化为明确的设计任务。'],
        ['我会怎样推进', '先明确目标用户与关键任务，围绕问题选择访谈、问卷、行为观察或竞品分析，区分用户反馈、观察到的行为和自己的推测。再整理内容结构、操作路径、状态与异常反馈，列出待确认的问题，与产品和开发对齐范围，并通过原型继续验证。'],
        ['项目实践', '在智能创作工具下载页中，面对“需要一个下载页”的需求，我独立组织产品定位、能力说明与安卓下载入口，并结合仅支持安卓、中文与印尼语、多端适配等条件确定页面结构。']
      ]
    },
    {
      title: '移动端与网页改版升级',
      subtitle: '围绕使用目标，梳理信息、操作路径与多端体验',
      sections: [
        ['我的理解', '我会围绕用户目标检查现有体验，找出信息层级、操作路径和状态反馈中的问题，再确定改版重点。移动端与网页有不同的阅读方式和操作条件，需要分别考虑内容密度、导航和关键入口。'],
        ['我会怎样推进', '先对照原页面与目标任务，调整内容顺序和关键流程，再统一视觉表达。在移动端重排模块、简化导航、检查点击区域，并关注长文案、多语言和不同屏幕下的布局。'],
        ['项目实践', '在品牌官网中协作完成首页，独立负责智能创作工具下载页与关于我们页面，结合移动端设计稿说明多端取舍。在直播社交改版中，通过卡片信息与社交入口的调整表达设计判断。']
      ]
    },
    {
      title: '设计规范',
      subtitle: '让组件、状态与团队协作保持一致',
      sections: [
        ['我的理解', '设计规范是团队共同使用的设计语言。颜色、字体、间距、圆角、图标与组件状态需要有清楚的使用规则，让页面在持续增加和多人协作时依然保持一致。'],
        ['我会怎样推进', '从真实页面中整理重复元素与差异，确定哪些适合复用、哪些需要保留场景特征。组件除了默认样式，还要考虑点击、禁用、加载与异常状态，并说明使用边界与交付方式。'],
        ['项目实践', '结合管理后台的组件调整、商城任务与商品卡片、图标体系等工作，展示从多版方案到统一规则的过程，并解释规范解决了什么具体问题。']
      ]
    },
    {
      title: '人工智能创作探索',
      subtitle: '智能体与工作流、广告短片、电影感视频、电商视频、品牌形象与图像',
      sections: [
        ['我的理解', '我把人工智能用在内容创作、设计探索与任务协作中。先明确目标、受众和风格，再选择工具与流程；生成之后，还需要由我判断内容是否准确、表达是否清楚，以及能否融入真实场景。'],
        ['智能体与工作流', '我理解智能体中任务拆解、上下文组织、工具调用、多步骤执行与结果检查之间的关系，也关注关键节点的人工确认。我会尝试把重复任务组织成可复用的工作流，保留设计判断与质量检查。'],
        ['图像与视频创作', '我的探索方向涵盖广告短片、电影感叙事、电商产品视频，以及品牌角色、图标和场景图像。视频创作会考虑脚本、分镜、镜头运动、节奏与衔接；图像创作则关注构图、材质、光影和系列风格的一致性。'],
        ['我关注的质量', '电商内容要准确保留产品结构、比例与卖点，品牌角色要保持人物形象和动作的一致性。我会通过参考约束、多轮筛选、局部修正与后期整合，把生成素材推进到可以使用的成品。']
      ]
    },
    {
      title: '前端设计',
      subtitle: '让界面、交互与动效在真实页面中成立',
      sections: [
        ['我的理解', '我希望把设计推进到可以操作的页面，在真实设备里检查信息层级、交互状态、滚动节奏和响应式布局。实现过程也能帮助我发现设计稿中没有覆盖的细节与约束。'],
        ['我会怎样推进', '先整理页面结构、组件关系、跳转逻辑和状态，再用人工智能编程工具辅助生成网页结构、样式与交互代码。我负责描述交互规则、核对还原效果，并检查多端布局、文字换行和操作反馈。'],
        ['项目实践', '通过品牌官网页面交互与个人作品集的实现，展示从高保真设计到前端验证的过程：人工智能参与了什么、我发现并修正了什么，以及当前完成到哪一步。']
      ]
    }
  ];
  const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  const root = document.createElement('section');
  root.id = 'capabilities';
  root.setAttribute('aria-labelledby', 'capabilities-title');
  root.innerHTML = `<div class="cap-inner"><header class="cap-heading"><p class="cap-eyebrow">这些思考，体现在五项设计能力中。</p><h2 id="capabilities-title">我的能力展示</h2><p class="cap-intro">展开一项，看看我的思考与实践。</p></header><div class="cap-list">${skills.map((skill, index) => `<article class="cap-item"><button class="cap-trigger" type="button" id="cap-trigger-${index}" aria-expanded="false" aria-controls="cap-panel-${index}"><span class="cap-label"><span class="cap-title">${escape(skill.title)}</span><span class="cap-subtitle">${escape(skill.subtitle)}</span></span><span class="cap-toggle" aria-hidden="true">+</span></button><div class="cap-panel" id="cap-panel-${index}" role="region" aria-labelledby="cap-trigger-${index}" aria-hidden="true" inert><div class="cap-panel-inner"><div class="cap-copy">${skill.sections.map(([title, text]) => `<h3>${escape(title)}</h3><p>${escape(text)}</p>`).join('')}</div></div></div></article>`).join('')}</div></div>`;
  following.before(root);
  const items = [...root.querySelectorAll('.cap-item')];
  function setOpen(item, open) {
    item.classList.toggle('is-open', open);
    item.querySelector('.cap-trigger').setAttribute('aria-expanded', String(open));
    const panel = item.querySelector('.cap-panel');
    panel.setAttribute('aria-hidden', String(!open));
    panel.inert = !open;
  }
  items.forEach(item => {
    item.querySelector('.cap-trigger').addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      items.forEach(other => setOpen(other, other === item && open));
    });
  });
  root.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const item = items.find(item => item.classList.contains('is-open'));
    if (!item) return;
    setOpen(item, false);
    item.querySelector('.cap-trigger').focus();
  });
  const route = () => {
    if (location.hash === '#capabilities') requestAnimationFrame(() => root.scrollIntoView({block: 'start', behavior: 'instant'}));
  };
  addEventListener('hashchange', route);
  addEventListener('load', route);
  route();
})();
