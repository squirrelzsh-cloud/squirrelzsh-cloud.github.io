(() => {
 const trigger=document.querySelector('.wechat-trigger'),previous=document.getElementById('wechat-contact');if(!trigger||!previous)return;
 const modal=document.createElement('dialog');modal.id=previous.id;modal.className='wechat-contact wechat-modal';
 modal.setAttribute('aria-labelledby','wechat-modal-title');modal.setAttribute('aria-describedby','wechat-modal-help');
 const heading=document.createElement('header');heading.className='wechat-modal-heading';
 heading.innerHTML='<div><h2 id="wechat-modal-title">微信联系我</h2><p>赵松浩 · UI/UX 设计</p></div><button type="button" class="wechat-modal-close" aria-label="关闭微信二维码"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>';
 const code=previous.querySelector('.wechat-code'),help=document.createElement('p'),tip=document.createElement('p');
 help.id='wechat-modal-help';help.className='wechat-modal-help';help.textContent='扫一扫添加微信';
 tip.className='wechat-modal-tip';tip.textContent='手机上可长按二维码保存图片';
 modal.append(heading,code,help,tip);previous.replaceWith(modal);
 trigger.setAttribute('aria-haspopup','dialog');trigger.setAttribute('aria-controls',modal.id);trigger.setAttribute('aria-expanded','false');
 let previousOverflow='';
 function close(){if(modal.open)modal.close()}
 trigger.addEventListener('click',()=>{if(modal.open){close();return}previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';modal.showModal();trigger.setAttribute('aria-expanded','true')});
 heading.querySelector('button').addEventListener('click',close);
 modal.addEventListener('click',e=>{const r=modal.getBoundingClientRect();if(e.target===modal&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))close()});
 modal.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;trigger.setAttribute('aria-expanded','false');trigger.focus({preventScroll:true})});
})();
