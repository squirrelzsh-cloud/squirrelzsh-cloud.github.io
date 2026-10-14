(() => {
  'use strict';
  const following = document.getElementById('approach');
  if (!following || document.getElementById('object-story')) return;
  const sheet = document.querySelector('link[href="./css/object-story.css"]');
  const section = document.createElement('section'); section.id = 'object-story'; section.className = 'object-story'; section.setAttribute('aria-label', '交互与动效实验：从想法、形态到使用情境');
  const cards = [
    ['SoYii','任务与进度体验','让任务要求、当前进度与下一步更清楚。','story-portrait.png'],
    ['非遗传承行动','小程序 / 交互与视觉','让文化内容成为可以参与的体验。','directory-workspace-real.png'],
    ['TikMe','跨设备下载体验','在不同设备上，找到清楚的下载路径。','story-desk.png'],
    ['运营视觉合集','活动页面 / 品牌表达','让规则、奖励与品牌表达各有重点。','studio-desk-v28.png']
  ];
  section.innerHTML = `<div class="os-stage">
    <div class="os-dark" aria-hidden="true"></div><div class="os-backdrop" aria-hidden="true"></div><div class="os-blueprint" aria-hidden="true"></div>
    <div class="os-wire" aria-hidden="true"><i class="os-handle"></i><i class="os-handle"></i><i class="os-handle"></i><i class="os-handle"></i></div>
    <div class="os-ai" aria-hidden="true"><span>Powered</span><span>by AI.</span></div>
    <img class="os-hand" src="../assets/story-hand.png" alt="托起圆形设备的手掌">
    <div class="os-portrait"><img src="../assets/story-portrait.png" alt="佩戴圆形设备的日常穿搭场景"><small>情境实验 / 非硬件项目成果</small></div>
    <canvas class="os-product" aria-label="随滚动连续翻转的圆形产品"></canvas>
    <div class="os-copy os-left"><small>01 / DESIGN EXPERIMENT</small><h2>看得见，<br>也看得懂。</h2></div>
    <div class="os-copy os-right"><p>形态吸引注意，层级建立重点。<br>我关心画面如何被看见，<br>也关心功能如何被理解。</p></div>
    <div class="os-copy os-portable"><small>02 / DESIGN IN CONTEXT</small><h2>回到人的<br>情境里。</h2></div>
    <div class="os-copy os-detail"><p>同一个设计，进入不同场景，<br>就会面对不同的操作与需求。</p></div>
    <div class="os-queue" aria-label="项目展示队列">${cards.map((c,i)=>`<figure class="os-media" data-project="${i}"><img src="../assets/${c[3]}" alt="${c[0]}概念封面"><figcaption><small>${String(i+1).padStart(2,'0')} / ${c[1]}</small><h3>${c[0]}</h3><p>${c[2]}</p><button type="button">查看详细 ↗</button></figcaption></figure>`).join('')}</div>
    <div class="os-poster-title"><span>SELECTED PRACTICE / XIAOHAO</span>让表达有重点，<br>让体验有依据。</div>
    <div class="os-chapter">交互与动效探索 / 小浩</div><div class="os-label">从一个圆开始</div><a class="os-skip" href="#approach">继续阅读 ↓</a>
  </div>`;
  following.before(section);
  const workAnchor=document.createElement('div');workAnchor.id='selected-work';workAnchor.style.cssText='position:absolute;top:64.1%;left:0;width:1px;height:1px;pointer-events:none';section.append(workAnchor);
  const jumpToWorks=()=>{if(location.hash==='#selected-work'||location.hash==='#gateway'){requestAnimationFrame(()=>{const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const y=reduced?section.offsetTop:section.offsetTop+(section.offsetHeight-innerHeight)*(7.7/12);scrollTo({top:y,behavior:'instant'});});}};
  addEventListener('hashchange',jumpToWorks);sheet.addEventListener('load',jumpToWorks);addEventListener('load',jumpToWorks);if(document.readyState==='complete')jumpToWorks();
  const next = document.querySelector('.chapter-next'); if (next) next.href = '#object-story';
  const $ = s => section.querySelector(s), all = s => [...section.querySelectorAll(s)];
  const clamp = x => Math.max(0, Math.min(1, x));
  const ease = x => {x=clamp(x);return x*x*(3-2*x)};
  const phase = (p,a,b) => ease((p-a)/(b-a));
  const mix = (a,b,t) => a+(b-a)*t;
  const show = (el,v) => { el.style.opacity=clamp(v); el.style.visibility=v>.001?'visible':'hidden'; };
  const canvas = $('.os-product');
  const gl = canvas.getContext('webgl', {alpha:true,antialias:true,premultipliedAlpha:false});
  let drawProduct = () => {};
  if (gl) {
    const compile = (type,source) => {const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader));return shader};
    const program=gl.createProgram();
    gl.attachShader(program,compile(gl.VERTEX_SHADER,`attribute vec3 aPos;attribute vec3 aNormal;attribute vec2 aUV;uniform mat3 rotation;uniform vec2 viewport;uniform vec2 center;uniform float radius;varying vec3 normal;varying vec2 uv;varying vec3 local;void main(){vec3 p=rotation*aPos;float perspective=1.0/(1.0-p.z*.24);vec2 pixel=center+p.xy*radius*perspective;gl_Position=vec4(pixel.x/viewport.x*2.0-1.0,1.0-pixel.y/viewport.y*2.0,-p.z*.25,1.0);normal=rotation*aNormal;uv=aUV;local=aPos;}`));
    gl.attachShader(program,compile(gl.FRAGMENT_SHADER,`precision mediump float;varying vec3 normal;varying vec2 uv;varying vec3 local;uniform sampler2D material;uniform float opacity;uniform float lightAngle;uniform float shadow;void main(){if(shadow>.5){float a=(1.0-smoothstep(.55,1.0,length(local.xy)))*opacity;gl_FragColor=vec4(.015,.03,.015,a);return;}vec3 n=normalize(normal);vec3 l=normalize(vec3(sin(lightAngle)*.7,-.65,1.25));float diffuse=max(dot(n,l),0.0);float shine=pow(max(dot(reflect(-l,n),vec3(0.,0.,1.)),0.0),38.);vec3 tex=texture2D(material,uv).rgb;float front=step(.055,local.z);vec3 metal=mix(vec3(.29,.36,.21),tex,front);gl_FragColor=vec4(metal*(.48+.65*diffuse)+shine*.32,opacity);}`));
    gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Product shader could not link');gl.useProgram(program);
    const vertices=[];
    function vertex(x,y,z,nx,ny,nz){vertices.push(x,y,z,nx,ny,nz,.5+x*.455,.5+y*.455)}
    for(let i=0;i<128;i++){const a=i/128*Math.PI*2,b=(i+1)/128*Math.PI*2,x=Math.cos(a),y=Math.sin(a),xx=Math.cos(b),yy=Math.sin(b);
      vertex(0,0,.065,0,0,1);vertex(x,y,.065,0,0,1);vertex(xx,yy,.065,0,0,1);
      vertex(0,0,-.065,0,0,-1);vertex(xx,yy,-.065,0,0,-1);vertex(x,y,-.065,0,0,-1);
      vertex(x,y,.065,x,y,0);vertex(x,y,-.065,x,y,0);vertex(xx,yy,.065,xx,yy,0);
      vertex(xx,yy,.065,xx,yy,0);vertex(x,y,-.065,x,y,0);vertex(xx,yy,-.065,xx,yy,0);
    }
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
    [['aPos',3,0],['aNormal',3,12],['aUV',2,24]].forEach(([name,n,offset])=>{const a=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,n,gl.FLOAT,false,32,offset)});
    const names=['rotation','viewport','center','radius','opacity','lightAngle','shadow'];const u=Object.fromEntries(names.map(n=>[n,gl.getUniformLocation(program,n)]));
    const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([139,163,90,255]));gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    const textureImage=new Image();textureImage.onload=()=>{gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,textureImage);schedule()};textureImage.src='../assets/story-disc.png';
    const rotation=(x,y,z)=>{const cx=Math.cos(x),sx=Math.sin(x),cy=Math.cos(y),sy=Math.sin(y),cz=Math.cos(z),sz=Math.sin(z);return new Float32Array([cy*cz,cy*sz,-sy,sx*sy*cz-cx*sz,sx*sy*sz+cx*cz,sx*cy,cx*sy*cz+sx*sz,cx*sy*sz-sx*cz,cx*cy])};
    drawProduct=(w,h,state)=>{const dpr=Math.min(devicePixelRatio||1,2);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr)}gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);if(state.alpha<.001)return;gl.uniform2f(u.viewport,w,h);gl.uniform1f(u.lightAngle,state.ry*.7-.5);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
      gl.disable(gl.DEPTH_TEST);gl.uniform1f(u.shadow,1);gl.uniform1f(u.opacity,state.alpha*state.contact*.55);gl.uniform2f(u.center,state.x+state.r*.04,state.y+state.r*.10);gl.uniform1f(u.radius,state.r*1.15);gl.uniformMatrix3fv(u.rotation,false,rotation(state.rx,state.ry,state.rz));gl.drawArrays(gl.TRIANGLES,0,vertices.length/8);
      gl.clear(gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.uniform1f(u.shadow,0);gl.uniform1f(u.opacity,state.alpha);gl.uniform2f(u.center,state.x,state.y);gl.uniform1f(u.radius,state.r);gl.uniformMatrix3fv(u.rotation,false,rotation(state.rx,state.ry,state.rz));gl.drawArrays(gl.TRIANGLES,0,vertices.length/8);
    };
  } else {
    const fallback=document.createElement('img');fallback.src='../assets/story-disc.png';fallback.alt='圆形产品';fallback.style.cssText='position:absolute;z-index:5;width:32vmin;height:32vmin;object-fit:contain';canvas.replaceWith(fallback);
    drawProduct=(w,h,s)=>{fallback.style.left=s.x+'px';fallback.style.top=s.y+'px';fallback.style.width=s.r*2+'px';fallback.style.height=s.r*2+'px';fallback.style.transform=`translate(-50%,-50%) perspective(800px) rotateX(${s.rx}rad) rotateY(${s.ry}rad) rotateZ(${s.rz}rad)`;fallback.style.opacity=s.alpha};
  }
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const labels=['一个想法，如何变得具体？','从轮廓、比例和关系开始','看得见，也要看得懂','换一个角度，继续推敲','由我判断，与 AI 一起推进','设计的下一步，是被使用','回到人的情境里','把这些关注，带进具体项目','项目实践 / 非遗传承行动','项目实践 / TikMe','项目实践 / 运营视觉','让表达有重点，让体验有依据'];
  function render(){
    const rect=section.getBoundingClientRect(),w=innerWidth,h=$('.os-stage').clientHeight;
    if(rect.bottom<0||rect.top>innerHeight)return;
    const p=clamp(-rect.top/Math.max(1,section.offsetHeight-innerHeight))*12;
    const real=phase(p,.2,1.25),isolated=phase(p,1.7,2.65),turn=phase(p,3.1,4.2),ai=phase(p,4.1,4.95),hand=phase(p,4.8,5.8),wear=phase(p,6,7),gallery=phase(p,7.05,7.6),expand=phase(p,10.9,11.9);
    show($('.os-blueprint'),1-real);show($('.os-backdrop'),real*(1-isolated));$('.os-backdrop').style.transform=`scale(${mix(1.2,1,real)+isolated*.13})`;
    show($('.os-wire'),1-phase(p,.5,1.3));show($('.os-left'),phase(p,2.6,2.9)*(1-phase(p,3.9,4.25)));show($('.os-right'),phase(p,2.85,3.15)*(1-phase(p,3.9,4.25)));
    for(const [sel,a,b] of [['.os-left',2.6,2.9],['.os-right',2.85,3.15]])$(sel).style.transform=`translateY(${(1-phase(p,a,b))*26}px)`;
    show($('.os-ai'),ai*(1-wear));$('.os-ai').style.clipPath=`inset(0 ${(1-ai)*100}% 0 0)`;
    show($('.os-hand'),phase(p,4.8,5.35)*(1-wear));$('.os-hand').style.transform=`translate(-50%,${mix(95,-28,hand)}%)`;
    show($('.os-portrait'),wear*(1-gallery));$('.os-portrait').style.clipPath=`inset(${(1-wear)*50}% 0)`;
    show($('.os-portable'),phase(p,6.7,7)*(1-gallery));show($('.os-detail'),phase(p,6.85,7.1)*(1-gallery));
    const base=Math.min(w,h)*.16,handWidth=Math.min(w*(w<700?.9:.55),650),palmY=h*.5+handWidth*.21,portraitWidth=Math.min(w*(w<700?.62:.36),430);
    const state={x:mix(w*.5+handWidth*.04*hand,w*.5+portraitWidth*.16,wear),y:mix(mix(h*.5,palmY,hand),h*.41,wear),r:mix(mix(base,base*1.38,isolated),base*.64,hand),rx:mix(0,.92,turn)*(1-hand)+hand*.38*(1-wear),ry:Math.sin(turn*Math.PI*2)*.8*(1-hand)+wear*.08,rz:turn*.28*(1-wear),alpha:real*(1-gallery),contact:Math.max(1-isolated,hand)};
    state.r=mix(state.r,Math.min(w*(w<700?.62:.36),430)*.10,wear);drawProduct(w,h,state);
    show($('.os-queue'),gallery);const sequence=Math.max(0,Math.min(3,(p-7.65)/1.02));
    const frames=all('.os-media');frames.forEach((frame,i)=>{const delta=i-sequence,active=Math.abs(delta)<.2,caption=clamp(1-Math.abs(delta)*3);let x=delta>=0?delta*w*.18:delta*w*.57,y=Math.max(0,delta)*h*.025,z=-Math.abs(delta)*170,scale=1-Math.min(3,Math.abs(delta))*.09,angle=delta* -13;
      if(i===3){const bw=Math.min(w*(w<700?.66:.34),430),bh=h*.66;frame.style.width=mix(bw,w,expand)+'px';frame.style.height=mix(bh,h,expand)+'px';x*=1-expand;y*=1-expand;z*=1-expand;angle*=1-expand;scale=mix(scale,1,expand);frame.style.borderColor=`rgba(232,236,217,${.44*(1-expand)})`;}
      frame.style.transform=`translate(calc(-50% + ${x}px),calc(-50% + ${y}px)) translateZ(${z}px) rotateY(${angle}deg) scale(${scale})`;
      show(frame,(delta<-.8?clamp(1+(delta+.8)*3):1)*(i===3?1:1-expand));frame.style.filter=`brightness(${mix(1,Math.max(.38,1-Math.abs(delta)*.22),1-expand)}) blur(${Math.max(0,Math.abs(delta)-.2)*1.2*(1-expand)}px)`;frame.style.zIndex=String(10-Math.round(Math.abs(delta)*2));frame.querySelector('figcaption').style.opacity=caption*(1-expand);
      const button=frame.querySelector('button');button.disabled=!active||gallery<.99||expand>.05;frame.inert=button.disabled;
    });
    show($('.os-poster-title'),phase(p,11.35,11.9));$('.os-label').textContent=labels[Math.min(11,Math.floor(p))];show($('.os-label'),1-expand);show($('.os-chapter'),1-expand);
    if(reduce.matches){show($('.os-queue'),1);frames.forEach(f=>{f.inert=false;f.querySelector('button').disabled=false;show(f,1)})}
  }
  let queued=false;
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render()})}
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduce.addEventListener('change',schedule);sheet.onload=schedule;
  all('.os-media button').forEach((button,i)=>button.addEventListener('click',()=>{window.openPortfolioProject?.(i);const dialog=document.querySelector('.offline-case');if(!dialog)return;dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label',cards[i][0]);const close=dialog.querySelector('.offline-close');close.focus();const key=e=>{if(e.key==='Escape')close.click();if(e.key==='Tab'){e.preventDefault();close.focus()}};dialog.addEventListener('keydown',key);close.addEventListener('click',()=>button.focus(),{once:true});}));
  schedule();
})();
