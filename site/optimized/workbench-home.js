/* Registers content to the existing photographic screen, without changing camera motion. */
(()=>{
 const scene=document.querySelector('.desk-scene'),photo=scene?.querySelector('img');if(!photo)return;
 const camera=document.createElement('div');camera.className='desk-camera';scene.append(camera);camera.append(photo);
 const plane=document.createElement('div');plane.className='desk-screen-plane';
 plane.innerHTML='<div class="desk-screen" aria-label="SoYii 任务详情，AI 辅助设计探索稿"><div class="desk-screen-copy"><small>SELECTED DESIGN / 01</small><strong>SoYii</strong><p>任务详情<br>让操作与下一步更清楚</p><small>AI 辅助设计探索稿</small></div><img src="./assets/soyii-task-design.png" alt="SoYii 任务详情设计探索稿，展示商品、任务说明与接取步骤"></div>';
 camera.append(plane);const screen=plane.firstElementChild;
 function fit(){const w=scene.clientWidth,h=scene.clientHeight,nw=photo.naturalWidth||1672,nh=photo.naturalHeight||941,scale=Math.max(w/nw,h/nh),iw=nw*scale,ih=nh*scale;camera.style.width=iw+'px';camera.style.height=ih+'px';camera.style.left=(w-iw)/2+'px';camera.style.top=(h-ih)/2+'px';camera.style.setProperty('--camera-shift',-(ih*.772+(h-ih)/2-h*.5)+'px');screen.style.left='42.1%';screen.style.top='72.1%';screen.style.width='16.1%';screen.style.height='10.1%';screen.style.padding=iw*.004+'px';}
 photo.addEventListener('load',fit);new ResizeObserver(fit).observe(scene);fit();
 const copy=document.querySelector('.hero-copy-layer');
 // A faded-out entry must not catch clicks over the directory.
 function gate(){copy.inert=Number(getComputedStyle(document.documentElement).getPropertyValue('--hero-exit'))>=.99;}
 addEventListener('scroll',gate,{passive:true});gate();
})();
