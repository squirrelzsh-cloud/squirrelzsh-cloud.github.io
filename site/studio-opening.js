import * as T from './vendor/three.module.js';
import { tactile, bevelBox, studioReflections, loadSurface, contactShadow, batchStatic } from './studio-materials.js';
const root=document.querySelector('#studio-opening');
const canvas=root.querySelector('canvas'), stage=root.querySelector('.studio-stage');
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
let renderer;
try { renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'}); }
catch(e){root.classList.add('studio-fallback');console.warn('Studio WebGL unavailable',e);}
if(renderer) { const face=new FontFace('Studio Sans',"url('./assets/studio-sans.woff')"); face.load().then(f=>document.fonts.add(f)).catch(()=>{}).finally(initialize); }
function initialize(){
renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<=800?1.25:1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.93;
const scene=new T.Scene();scene.background=new T.Color('#c8b89c');scene.fog=new T.Fog('#c8b89c',22,46);
scene.environment=studioReflections(renderer);scene.environmentIntensity=.72;
const camera=new T.PerspectiveCamera(45,1,.04,65);
const material=(color,roughness=.75,metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness});
const plaster=tactile(material('#ded5c4',.94),'plaster'),white=tactile(material('#eee9df',.7)),ink=tactile(material('#202321',.46),'metal'),steel=new T.MeshPhysicalMaterial({color:'#c1c3c2',roughness:.29,metalness:.95,anisotropy:.6,clearcoat:.2,clearcoatRoughness:.35}),brown=tactile(material('#713e27',.58)),soil=material('#38352b');
const oak=material('#ffffff',.62);
const oakSurface=loadSurface('./assets/studio-oak-real.webp',{repeat:[1,1],relief:.012,roughness:.62},wake);oakSurface(oak);
const wallSurface=loadSurface('./assets/studio-plaster-real.webp',{repeat:[3,2],relief:.014,roughness:.95},wake);wallSurface(plaster);plaster.color.set('#ffffff');
const paperSurface=loadSurface('./assets/studio-paper-real.webp',{repeat:[1,1],relief:.0012,roughness:.96,color:false},wake);
const floorOak=material('#bdab92',.82);loadSurface('./assets/studio-oak-real.webp',{repeat:[7,9],relief:.009,roughness:.84},wake)(floorOak);

function mesh(g,m,p=[0,0,0],parent=scene){const o=new T.Mesh(g,m);o.position.set(...p);o.castShadow=o.receiveShadow=true;parent.add(o);return o}
const box=(w,h,d,m,x,y,z,parent)=>mesh(new T.BoxGeometry(w,h,d),m,[x,y,z],parent);
const cyl=(r1,r2,h,m,x,y,z,parent)=>mesh(new T.CylinderGeometry(r1,r2,h,32),m,[x,y,z],parent);
const ell=(x,y,z,sx,sy,sz,m,parent)=>{const o=mesh(new T.SphereGeometry(1,32,20),m,[x,y,z],parent);o.scale.set(sx,sy,sz);return o};
function rod(a,b,r,m,parent=scene){const va=new T.Vector3(...a),vb=new T.Vector3(...b),d=vb.clone().sub(va);const o=mesh(new T.CylinderGeometry(r,r,d.length(),12),m,va.add(vb).multiplyScalar(.5).toArray(),parent);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return o}
const ambient=new T.HemisphereLight('#e9f2ff','#5d4935',.48);scene.add(ambient);
const sun=new T.DirectionalLight('#fff1d9',4.2);sun.position.set(-6,10,5);sun.target.position.set(0,1,-1);sun.castShadow=true;sun.shadow.mapSize.set(innerWidth<=800?1024:2048,innerWidth<=800?1024:2048);Object.assign(sun.shadow.camera,{left:-7,right:7,top:7,bottom:-7,near:1,far:32});sun.shadow.bias=-.00015;sun.shadow.normalBias=.003;sun.shadow.radius=3;scene.add(sun,sun.target);
// Architecture in a single shared coordinate space.
box(22,.18,24,floorOak,0,-.11,2);box(8,7,.25,plaster,0,3.5,-4.2);
box(.25,7,8,plaster,-6.6,3.5,.5);box(.25,7,12,oak,7,3.5,1);
box(2.2,6.5,.24,material('#a39880'),-4.8,3.25,2);
box(2.7,.5,11,ink,-4.6,6.8,0);box(3,.5,11,ink,5.3,6.8,0);
for(let i=0;i<28;i++){box(.055,.12,11,oak,-5.85+i*.095,6.48,0);box(.055,.12,11,oak,3.9+i*.095,6.48,0)}
for(let i=0;i<35;i++)box(.045,6.8,.07,oak,4.0+i*.085,3.4,-4.0);
for(let i=0;i<6;i++)box(2.1,.08,.08,white,-4.3,6.5,-3+i*1.7);
const blue=new T.MeshBasicMaterial({color:'#c1dce5'});box(20,.05,24,blue,0,8,1);
const rug=material('#777164',1);loadSurface('./assets/studio-paper-real.webp',{repeat:[16,14],relief:.012,roughness:1},wake)(rug);box(8.8,.02,7.7,rug,.65,.006,2.2);
box(2.3,.43,.68,oak,-4.8,.25,2.35);box(2.05,.15,.03,ink,-4.8,.29,2.71);
box(1.78,1.35,.07,ink,-4.8,2.15,2.17);
for(let i=0;i<5;i++)box(6.1,.09,.12,white,0,6.9,-3.8+i*1.3);
// Desk, brushed-metal frame and apron.
// Pin-up wall, flat-file storage and drafting equipment identify this as a working studio.
const cork=tactile(material('#a7835c',1),'plaster',2);
mesh(bevelBox(4.7,2.5,.12,.025),oak,[.1,3.15,-4.01]);
box(4.55,2.35,.035,cork,.1,3.15,-3.93);
for(let i=0;i<7;i++){
  const sheet=box(.48,.68,.008,white,-1.76+(i%4)*1.03,3.65-Math.floor(i/4)*1.05,-3.901);
  sheet.rotation.z=(i%3-1)*.065;
  for(let j=0;j<4;j++)box(.32,.013,.008,material('#a9a69b'),sheet.position.x,sheet.position.y+.2-j*.1,-3.893);
  ell(sheet.position.x,sheet.position.y+.3,-3.877,.015,.015,.018,steel);
}
box(2.3,1.1,.9,white,3.95,.58,-2.95);
for(let i=0;i<5;i++){
  box(2.22,.015,.012,material('#8f9188'),3.95,.21+i*.2,-2.492);
  mesh(bevelBox(.42,.033,.045,.01),steel,[3.95,.29+i*.2,-2.46]);
}
// Large daylight window: real opening, mullions and deep sill, outside the camera path.
box(.08,3.6,4.6,white,-6.43,3.5,-.3);
box(.025,3.25,4.25,new T.MeshBasicMaterial({color:'#d5e4e6'}),-6.375,3.5,-.3);
for(const z of [-2.46,-.3,1.86])box(.075,3.4,.065,oak,-6.33,3.5,z);
box(.45,.12,4.65,oak,-6.29,1.76,-.3);
box(.06,.065,4.35,oak,-6.32,3.45,-.3);
mesh(bevelBox(5.2,.115,3.35,.035),oak,[0,1.49,0]);box(4.5,.36,.045,oak,0,1.25,-1.35);
const mat=tactile(material('#40584b',.94),'paper');
mesh(bevelBox(3.4,.008,2.35,.003),mat,[-.12,1.552,.39]);

// A steel straightedge with engraved ticks and a pencil at the free edge.
mesh(bevelBox(.12,.013,2.25,.004),steel,[-2.15,1.558,.23]);
for(let i=0;i<44;i++)box(i%5===0?.071:.035,.001,.005,ink,-2.17,1.565,-.84+i*.05);
rod([-1.99,1.565,-.62],[-1.94,1.565,.25],.013,brown);
rod([-1.94,1.565,.25],[-1.936,1.565,.32],.006,ink);
// Paper pad edges, tape roll and clips have actual thickness and contact shadows.
for(let i=0;i<6;i++)box(.55,.003,.7,white,2.04,1.57+i*.004,1.14);
const tape=mesh(new T.TorusGeometry(.115,.038,16,36),tactile(material('#c5af7b',.88)),[1.93,1.59,-.05]);tape.rotation.x=Math.PI/2;
for(let i=0;i<2;i++){mesh(bevelBox(.1,.026,.055,.005),ink,[1.73+i*.16,1.58,-.52]);rod([1.69+i*.16,1.6,-.52],[1.77+i*.16,1.65,-.52],.006,steel);}
for(const x of [-2.4,2.4]){box(.13,1.42,.14,white,x,.72,-1.37);box(.13,1.42,.14,white,x,.72,1.37);box(.13,.08,2.86,white,x,.08,0)}
function chair(x,z,angle,scale=1){const g=new T.Group();g.position.set(x,0,z);g.rotation.y=angle;g.scale.setScalar(scale);scene.add(g);ell(0,.68,0,.43,.12,.44,brown,g);const back=ell(0,1.09,-.31,.44,.43,.11,brown,g);back.rotation.x=-.18;cyl(.033,.04,.55,steel,0,.35,0,g);for(let i=0;i<5;i++){let a=i*2*Math.PI/5;rod([0,.11,0],[Math.sin(a)*.53,.055,Math.cos(a)*.53],.025,steel,g);ell(Math.sin(a)*.53,.045,Math.cos(a)*.53,.05,.045,.03,ink,g)}}
chair(-2.85,.4,.65);chair(3.35,5.1,-.7,1.5);
function plant(x,y,z,scale=1){const g=new T.Group();g.position.set(x,y,z);g.scale.setScalar(scale);scene.add(g);cyl(.22,.16,.43,plaster,0,.215,0,g);cyl(.195,.195,.01,soil,0,.432,0,g);for(let i=0;i<24;i++){const a=i*2.399,h=.65+(i%8)*.14,r=.12+(i%4)*.04;rod([0,.4,0],[Math.cos(a)*r,h,Math.sin(a)*r],.008,soil,g);let leaf=ell(Math.cos(a)*r,h,Math.sin(a)*r,.06,.22,.022,material(i%2?'#5b6930':'#384c24'),g);leaf.rotation.set(.5*Math.sin(a),a,.5*Math.cos(a))}}
plant(2.12,1.55,-1.18,.65);plant(4.85,0,-2.8,1.7);plant(-5.4,0,-3.3,2.6);
// Folded pendant and photography softbox.
const shade=new T.Mesh(new T.SphereGeometry(.85,48,24,0,Math.PI*2,0,Math.PI*.55),new T.MeshStandardMaterial({color:'#f4efe3',roughness:.7,side:T.DoubleSide}));shade.position.set(0,5.15,-.5);shade.scale.set(1.3,.28,1);shade.rotation.z=-.32;scene.add(shade);rod([0,5.3,-.5],[0,7,-.5],.009,steel);
rod([4.5,.1,2],[4.5,5,2],.023,steel);for(let i=0;i<3;i++){const a=i*2.09;rod([4.5,.6,2],[4.5+Math.cos(a)*.7,.04,2+Math.sin(a)*.7],.015,steel)}
const softbox=new T.Group();softbox.position.set(4.5,4.6,2);softbox.rotation.set(-.2,-.6,.4);scene.add(softbox);const shell=cyl(.85,.53,.35,ink,0,0,0,softbox);shell.rotation.x=Math.PI/2;const diffuser=cyl(.83,.83,.015,white,0,0,.185,softbox);diffuser.rotation.x=Math.PI/2;
// Screen and fixed desk objects.
mesh(bevelBox(1.96,1.22,.095,.03),steel,[-.7,2.28,-1.24]);mesh(bevelBox(1.92,1.18,.024,.012),ink,[-.7,2.28,-1.18]);mesh(bevelBox(.115,.43,.08,.018),steel,[-.7,1.74,-1.23]);mesh(bevelBox(.67,.035,.4,.011),steel,[-.7,1.568,-1.11]);
const screenC=document.createElement('canvas');screenC.width=1400;screenC.height=840;const sc=screenC.getContext('2d');const screenT=new T.CanvasTexture(screenC);screenT.colorSpace=T.SRGBColorSpace;
const screen=mesh(new T.PlaneGeometry(1.84,1.08),new T.MeshPhysicalMaterial({map:screenT,emissive:'#ffffff',emissiveMap:screenT,emissiveIntensity:.38,roughness:.2,metalness:.05,clearcoat:1,clearcoatRoughness:.16}),[-.7,2.29,-1.155]);screen.castShadow=false;
const keyboard=box(1.5,.045,.43,ink,-.7,1.57,-.66);for(let row=0;row<4;row++)for(let col=0;col<16;col++){box(.077,.032,.078,col>13?material('#99332b'):white,-1.37+col*.087,1.608,-.8+row*.096)}
cyl(.115,.10,.23,white,2.08,1.67,.54);cyl(.098,.098,.006,material('#312014'),2.08,1.79,.54);const handle=mesh(new T.TorusGeometry(.075,.017,12,24),white,[2.22,1.67,.54]);
cyl(.09,.085,.21,steel,.75,1.65,-1.15);for(let i=0;i<5;i++)rod([.72+i*.014,1.61,-1.15],[.65+i*.04,2.03,-1.13],.009,i%2?ink:brown);
box(.64,.038,.78,material('#415a6c'),2.05,1.58,1.15);box(.58,.023,.72,white,2.05,1.588,1.15);
const projects=[{name:'友趣派对直播改版',desc:'把热闹的直播变成可以建立关系的社交体验',image:'pdf-youqu-cover.webp',index:0},{name:'传承行动',desc:'让传统文化被看见，也被真正参与',image:'pdf-heritage-cover.webp',index:1},{name:'龙舟竞渡运营',desc:'让节日活动有记忆点，也有参与路径',image:'pdf-dragon-cover.webp',index:2},{name:'AIGC 赋能礼物设计',desc:'用 AI 加快探索，让情绪拥有可见的形状',image:'pdf-aigc-cover.webp',index:3}];
// Use the existing project's actual thumbnails, never stock placeholders.
const existing=Array.from(document.querySelectorAll('[data-project] img, .project-card img, .work-card img'));
const images=[];let screenKey=-1;
const paths=['./assets/pdf-youqu-cover.webp','./assets/pdf-heritage-cover.webp','./assets/pdf-dragon-cover.webp','./assets/pdf-aigc-cover.webp'];
projects.forEach((p,i)=>{const image=new Image();image.src=window.__mobileImageURL?.(existing[i]?.src||paths[i])||(existing[i]?.src||paths[i]);image.onload=()=>{screenKey=-1;wake()};images.push(image)});
const screenCards=projects.map((p,i)=>({x:300+(i%2)*440,y:185+Math.floor(i/2)*315,w:360,h:270}));
function drawScreen(progress){const key=Math.round(progress*120);if(key===screenKey)return;screenKey=key;sc.fillStyle='#080908';sc.fillRect(0,0,1400,840);sc.save();sc.globalAlpha=progress;sc.fillStyle='#fcf8f1';sc.fillRect(0,0,1400,840);sc.fillStyle='#2c190f';sc.textAlign='center';sc.font='700 76px "PingFang SC", "Microsoft YaHei", sans-serif';sc.fillText('WORKS',700,100);sc.font='28px "PingFang SC", "Microsoft YaHei", sans-serif';sc.fillText('从作品，看见思考与实践。',700,150);projects.forEach((p,i)=>{const {x,y,w,h}=screenCards[i];sc.save();sc.beginPath();sc.roundRect(x,y,w,h,20);sc.clip();sc.fillStyle='#e7ded0';sc.fillRect(x,y,w,h);const im=images[i];if(im.complete&&im.naturalWidth){const a=im.naturalWidth/im.naturalHeight,b=w/h;let sw=im.naturalWidth,sh=im.naturalHeight;if(a>b)sw=sh*b;else sh=sw/b;sc.drawImage(im,(im.naturalWidth-sw)/2,(im.naturalHeight-sh)/2,sw,sh,x,y,w,h)}sc.restore();sc.fillStyle='#2c190f';sc.textAlign='left';sc.font='500 25px "PingFang SC", "Microsoft YaHei", sans-serif';sc.fillText(p.name+' ↗',x,y+h+32)});sc.restore();screen.material.emissiveIntensity=.38*progress;screenT.needsUpdate=true}
drawScreen(1);
const paperCases=[
 {title:'YOUQU / LIVE',cn:'友趣派对直播改版',slug:'youqu',image:'youqu',accent:'#466784',lead:'从直播浏览，到关系建立。',scope:'界面改版 / 交互路径 / 情绪表达',flow:['发现直播','进入派对','互动交友'],notes:[['入口重组','梳理直播与消息入口','让核心操作更易发现'],['互动体验','串联匹配、聊天与送礼','用明确反馈承接操作'],['视觉表达','统一卡片与界面层级','呈现轻松的社交氛围']]},
 {title:'HERITAGE',cn:'传承行动',slug:'heritage',image:'heritage',accent:'#ae5930',lead:'让文化内容与购物体验相连接。',scope:'用户调研 / 信息架构 / 品牌视觉',flow:['发现非遗','了解故事','浏览商品'],notes:[['调研与定义','结合问卷与用户访谈','归纳分类和查找问题'],['结构与路径','区分非遗、文创入口','连接内容与商品详情'],['品牌与界面','延展非遗纹样与 IP','统一暖色与图标风格']]},
 {title:'DRAGON BOAT',cn:'龙舟竞渡运营',slug:'dragon-boat',image:'dragon-boat',accent:'#168b9a',lead:'把节日氛围，变成清楚的参与路径。',scope:'活动主视觉 / IP 延展 / 运营体验',flow:['进入会场','参与任务','奖励分享'],notes:[['主题识别','龙舟 IP 与端午主视觉','建立统一的活动记忆'],['参与路径','组织任务、进度与奖励','让活动规则清楚可见'],['物料延展','奖励弹窗与分享海报','保持角色和色彩一致']]}
];
const paperPositions=[{x:-1.3,z:.08,r:-.07},{x:-.15,z:.35,r:.04},{x:1.04,z:.17,r:-.05},{x:.5,z:1.02,r:.06}];
const papers=paperPositions.map((position,i)=>({...paperCases[i===3?0:i],...position,href:'#project-'+paperCases[i===3?0:i].slug}));
const hits=[];
papers.forEach((p,i)=>{
 const c=document.createElement('canvas');c.width=1100;c.height=1350;
 const ctx=c.getContext('2d'),cover=new Image();
 const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
 const font=(size,weight=400)=>{ctx.font=weight+' '+size+'px "Portfolio SC", "PingFang SC", "Microsoft YaHei", sans-serif'};
 function drawPaper(){
  ctx.fillStyle='#f7f4ec';ctx.fillRect(0,0,1100,1350);
  ctx.fillStyle=p.accent;ctx.beginPath();ctx.roundRect(55,56,8,192,4);ctx.fill();
  font(24,600);ctx.fillText(p.title,85,85);
  ctx.fillStyle='#2c190f';font(54,900);ctx.fillText(p.cn,85,160);
  font(29);ctx.fillText(p.lead,85,216);
  font(23);ctx.fillStyle='#75654e';ctx.fillText(p.scope,55,275);
  // Fit the authentic case cover without cropping or altering its artwork.
  if(cover.complete&&cover.naturalWidth){const scale=Math.min(990/cover.naturalWidth,557/cover.naturalHeight);const w=cover.naturalWidth*scale,h=cover.naturalHeight*scale;ctx.save();ctx.beginPath();ctx.roundRect(55+(990-w)/2,310+(557-h)/2,w,h,32);ctx.clip();ctx.drawImage(cover,55+(990-w)/2,310+(557-h)/2,w,h);ctx.restore()}
  ctx.fillStyle=p.accent;font(22,600);ctx.fillText('DESIGN PATH / 关键体验路径',55,908);
  p.flow.forEach((label,n)=>{const x=55+n*340;ctx.fillStyle='#eae3d6';ctx.beginPath();ctx.roundRect(x,931,310,64,20);ctx.fill();ctx.fillStyle='#2c190f';font(28,600);ctx.fillText(label,x+35,974);if(n<2){font(25);ctx.fillText('→',x+314,973)}});
  p.notes.forEach((note,n)=>{const x=55+n*340;ctx.fillStyle=p.accent;font(30,600);ctx.fillText(note[0],x,1051);ctx.fillStyle='#463721';font(24);ctx.fillText(note[1],x,1102);ctx.fillText(note[2],x,1146)});
  ctx.fillStyle='#c8bead';ctx.fillRect(55,1200,990,2);ctx.fillStyle='#75654e';font(23,600);ctx.fillText('SONGHAO / SELECTED WORK',55,1255);ctx.fillText(i===3?'01':'0'+(i+1),996,1255);
  tex.needsUpdate=true;
 }
 drawPaper();cover.onload=()=>{drawPaper();wake()};cover.src='./assets/mobile/'+p.image+'-1-1280.webp';
 document.fonts?.ready.then(()=>{drawPaper();wake()});
 const w=.98,h=.92,r=.035,shape=new T.Shape();
 shape.moveTo(-w/2+r,-h/2);shape.lineTo(w/2-r,-h/2);shape.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);shape.lineTo(w/2,h/2-r);shape.quadraticCurveTo(w/2,h/2,w/2-r,h/2);shape.lineTo(-w/2+r,h/2);shape.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);shape.lineTo(-w/2,-h/2+r);shape.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
 const geometry=new T.ShapeGeometry(shape,12),pos=geometry.attributes.position,uv=geometry.attributes.uv;
 for(let j=0;j<pos.count;j++)uv.setXY(j,pos.getX(j)/w+.5,pos.getY(j)/h+.5);
 geometry.rotateX(-Math.PI/2);
 const paper=mesh(geometry,paperSurface(new T.MeshStandardMaterial({map:tex,roughness:.96,side:T.DoubleSide})),[p.x,1.559+i*.008,p.z+(i===3?.13:0)]);
 paper.rotation.y=p.r;paper.userData.href=p.href;paper.userData.projectIndex=i===3?0:i;hits.push(paper);
});
rod([-1.9,1.568,.78],[-1.5,1.568,1.13],.014,material('#bbaa43'));rod([1.32,1.568,.94],[1.73,1.568,1.29],.014,ink);
contactShadow(scene,0,.023,0,5.8,4.1,.3);
contactShadow(scene,-.7,1.55,-1.1,.95,.65,.3);
contactShadow(scene,2.08,1.552,.54,.36,.36,.34);
contactShadow(scene,2.12,1.552,-1.18,.42,.42,.3);
batchStatic(scene,[screen,...hits]);
// The camera moves continuously; no image swaps or scene crossfades.
const keys=[
[0,[0,2.85,10.3],[0,2.85,-.5],48],[.09,[0,2.85,10.3],[0,2.85,-.5],48],
[.24,[3.7,3.55,3.25],[0,1.55,-.15],46],
[.36,[-1.3,3.10,.38],[-1.3,1.58,.08],43],
[.47,[-.15,3.1,.65],[-.15,1.58,.35],43],
[.57,[1.04,3.1,.47],[1.04,1.58,.17],43],
[.67,[.5,3.1,1.32],[.5,1.58,1.02],43],
[.79,[-.7,2.39,1.4],[-.7,2.29,-1.18],43],
[.96,[-.7,2.29,-.66],[-.7,2.29,-1.18],43],
[1,[-.7,2.29,-.78],[-.7,2.29,-1.18],43]];
const positions=new T.CatmullRomCurve3(keys.map(k=>new T.Vector3(...k[1])),false,'catmullrom',.12),targets=new T.CatmullRomCurve3(keys.map(k=>new T.Vector3(...k[2])),false,'catmullrom',.12);
const label=root.querySelector('.studio-caption'),heading=root.querySelector('.studio-heading');
let active=false,raf=0,current=0,last=0,screenProgress=1;
function frame(now){raf=0;const dt=Math.min(50,now-last||16);last=now;const bounds=root.getBoundingClientRect();let target=T.MathUtils.clamp(-bounds.top/(root.offsetHeight-(window.__portfolioHeight||innerHeight)),0,1);current+= (target-current)*(1-Math.exp(-dt/75));if(reduce.matches)current=target;let n=0;while(n<keys.length-2&&current>keys[n+1][0])n++;let a=T.MathUtils.clamp((current-keys[n][0])/(keys[n+1][0]-keys[n][0]),0,1);a=a*a*(3-2*a);let u=(n+a)/(keys.length-1);camera.position.copy(positions.getPoint(u));camera.lookAt(targets.getPoint(u));camera.fov=keys[n][3]+(keys[n+1][3]-keys[n][3])*a;if(innerWidth<=800)camera.fov=Math.min(100,2*Math.atan(Math.tan(camera.fov*Math.PI/360)*Math.max(1,1.2/camera.aspect))*180/Math.PI);camera.updateProjectionMatrix();screenProgress=1;drawScreen(1);const crossfade=T.MathUtils.smoothstep(target,.87,.99);canvas.style.opacity='1';document.documentElement.classList.toggle('studio-screen-push',target>.79&&target<1);document.documentElement.style.setProperty('--studio-crossfade',String(crossfade));document.documentElement.classList.toggle('studio-crossfade',target>.87&&target<1);root.querySelector('.studio-footer').style.opacity=String(1-T.MathUtils.smoothstep(current,.85,.93));const reveal=T.MathUtils.smoothstep(current,0,.09);stage.style.setProperty('--scene-top',((innerWidth<=800?Math.max(48,heading.offsetHeight/(window.__portfolioHeight||innerHeight)*100):43)*(1-reveal))+'%');stage.style.setProperty('--scene-edge',((innerWidth<=700?20:Math.min(innerWidth*.06,92))*(1-reveal))+'px');stage.style.setProperty('--scene-bottom',(24*(1-reveal))+'px');stage.style.setProperty('--scene-radius',(14*(1-reveal))+'px');heading.style.opacity=String(1-T.MathUtils.smoothstep(current,0,.045));heading.style.transform='translateY('+(-100*reveal)+'px)';heading.inert=current>.035;document.documentElement.classList.toggle('studio-header-visible',current<.045&&bounds.bottom>(window.__portfolioHeight||innerHeight)*.8);label.textContent=current<.27?'滚动，走近小浩的工作台':current<.73?papers[Math.min(3,Math.max(0,n-2))].cn:'走近屏幕，进入作品';document.documentElement.classList.toggle('studio-active',bounds.top<=1&&bounds.bottom>(window.__portfolioHeight||innerHeight)*.8);renderer.render(scene,camera);if(!window.__studioFirstFrame){window.__studioFirstFrame=true;dispatchEvent(new Event("portfolio-scene-ready"));}if(active&&Math.abs(target-current)>.00002)raf=requestAnimationFrame(frame)}
addEventListener('scroll',()=>{if(active)wake()},{passive:true});
function wake(){if(active&&!raf){last=performance.now();raf=requestAnimationFrame(frame)}}
new IntersectionObserver(([e])=>{active=e.isIntersecting;if(active)wake();else{cancelAnimationFrame(raf);raf=0;document.documentElement.classList.remove('studio-active','studio-header-visible')}},{rootMargin:'50px'}).observe(root);
new ResizeObserver(()=>{renderer.setSize(stage.clientWidth,stage.clientHeight,false);camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();wake()}).observe(stage);
const ray=new T.Raycaster(),pointer=new T.Vector2();function intersect(e){const r=canvas.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2);ray.setFromCamera(pointer,camera);return ray.intersectObjects([...hits,screen])[0]}
canvas.addEventListener('pointermove',e=>canvas.style.cursor=intersect(e)?'pointer':'default');canvas.addEventListener('click',e=>{const hit=intersect(e);if(!hit)return;if(hit.object===screen){if(screenProgress<.95)return;const uv=hit.uv;const x=uv.x*1400,y=(1-uv.y)*840;const index=screenCards.findIndex(r=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h+36);if(index>=0&&window.openPortfolioProject){window.openPortfolioProject(index)}else document.getElementById('selected-work')?.scrollIntoView({behavior:'smooth'})}else if(window.openPortfolioProject){window.openPortfolioProject(hit.object.userData.projectIndex)}else{location.hash=hit.object.userData.href}});canvas.addEventListener('webglcontextlost',()=>root.classList.add('studio-fallback'));
}
