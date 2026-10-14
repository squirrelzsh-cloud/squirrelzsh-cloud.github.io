(() => {
 const trigger=document.querySelector('.wechat-trigger'),panel=document.getElementById('wechat-contact');if(!trigger||!panel)return;
 function close(){panel.hidden=true;trigger.setAttribute('aria-expanded','false')}
 function position(){if(innerWidth<=800){panel.style.transform='none';panel.style.left=Math.max(20,(innerWidth-panel.offsetWidth)/2)+'px';panel.style.top=Math.max(110,(innerHeight-panel.offsetHeight)/2)+'px';return}const r=trigger.getBoundingClientRect(),w=panel.offsetWidth,h=panel.offsetHeight,scale=Math.min(1,Math.max(.45,(r.top-24)/h));const x=Math.max(12,Math.min(innerWidth-w*scale-12,r.left+r.width/2-w*scale/2));panel.style.transformOrigin='top left';panel.style.transform='scale('+scale+')';panel.style.left=x+'px';panel.style.top=Math.max(8,r.top-h*scale-12)+'px';panel.style.setProperty('--arrow-left',((r.left+r.width/2-x)/scale)+'px')}
 trigger.addEventListener('click',()=>{if(!panel.hidden){close();return}panel.hidden=false;trigger.setAttribute('aria-expanded','true');position()});
 document.addEventListener('click',e=>{if(!panel.hidden&&!panel.contains(e.target)&&!trigger.contains(e.target))close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){close();trigger.focus()}});
 addEventListener('scroll',close,{passive:true});addEventListener('resize',()=>{if(!panel.hidden)position()});
})();
