(()=>{'use strict';
const root=document.querySelector('#design-intro.process-film');if(!root)return;
const get=s=>root.querySelector(s),all=s=>[...root.querySelectorAll(s)];
const stage=get('.process-stage'),manifest=get('.pf-manifesto'),proof=get('.pf-proof'),story=get('.pf-story'),plane=get('.pf-plane'),bin=get('.pf-discard'),orbit=get('.pf-orbit'),globe=get('.pf-globe'),records=get('.pf-records'),docs=get('.pf-documents'),shreds=get('.pf-shreds'),portal=get('.pf-portal'),network=get('.pf-network'),automation=get('.pf-automation');
const cards=all('.pf-proof-card'),tokens=all('.pf-token'),rows=all('.pf-record'),copy=all('.pf-copy article'),pieces=all('.pf-shreds span');
const chars=[];all('.pf-reading p').forEach(p=>{const w=document.createTreeWalker(p,NodeFilter.SHOW_TEXT),nodes=[];while(w.nextNode())nodes.push(w.currentNode);nodes.forEach(n=>{const f=document.createDocumentFragment();for(const c of n.textContent){const s=document.createElement('span');s.textContent=c;chars.push(s);f.append(s)}n.replaceWith(f)})});
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x)},phase=(t,a,b)=>ease((t-a)/(b-a));
// Measured from the 18-second reference. Positions use fractions of the viewport.
function track(t,keys){let i=0;while(i<keys.length-2&&t>keys[i+1][0])i++;const a=keys[i],b=keys[i+1],q=ease((t-a[0])/(b[0]-a[0]));return a.slice(1).map((v,j)=>v+(b[j+1]-v)*q)}
function show(el,n){el.style.opacity=String(n);el.style.visibility=n<.001?'hidden':'visible';el.inert=n<.5}
function blend(a,b,n){return a.map((v,i)=>Math.round(v+(b[i]-v)*n))}
const nodes=Array.from({length:45},(_,i)=>{const y=1-i/22,z=Math.sqrt(Math.max(0,1-y*y)),a=i*2.399963;return[Math.cos(a)*z,y,Math.sin(a)*z]});
const edges=[];nodes.forEach((a,i)=>nodes.forEach((b,j)=>{if(j>i&&Math.hypot(...a.map((v,k)=>v-b[k]))<.65)edges.push([i,j])}));
const ns='http://www.w3.org/2000/svg';const lines=edges.map(()=>{const e=document.createElementNS(ns,'line');globe.append(e);return e});const dots=nodes.map(()=>{const e=document.createElementNS(ns,'circle');e.setAttribute('r','1.5');globe.append(e);return e});
let raf=0;const reduced=matchMedia('(prefers-reduced-motion:reduce)');
function draw(){raf=0;const rect=root.getBoundingClientRect(),height=window.__portfolioHeight||innerHeight;if(rect.bottom<0||rect.top>height)return;const t=clamp(-(window.__sceneTop?.(rect)??rect.top)/(rect.height-height))*18,mobile=innerWidth<=800;
const my=track(t,[[0,.13],[.5,0],[2.6,0],[3,-.12],[3.5,-.84],[4,-1.1]])[0];show(manifest,t<4?1:0);manifest.style.transform=`translateY(${my*height}px)`;
const headingExit=phase(t,1.25,1.9);manifest.querySelector('h2').style.opacity=String(1-headingExit);manifest.querySelector('h2').style.transform=`translate(${headingExit*35}px,${headingExit*-20}px) scale(${1-headingExit*.4})`;
const read=phase(t,.35,3.05);chars.forEach((ch,i)=>{const a=clamp(read*chars.length-i);ch.style.color=`rgba(70,55,33,${.13+.87*a})`});
show(bin,phase(t,1.65,2.1));const py=track(t,[[0,.12,.19,0,0],[1.25,.12,.19,0,0],[1.6,.27,.24,-30,1],[2,.43,.25,-55,1],[2.4,.18,.20,35,1],[2.65,.21,.44,-15,1],[3,.26,.65,70,.2],[3.1,.26,.7,70,0]]);show(plane,py[3]);plane.style.transform=`translate(${py[0]*innerWidth}px,${py[1]*height}px) rotate(${py[2]}deg) scale(${mobile?.75:1})`;
// Local timeline sampled from the user's 5.866-second card recording.
const u=(t-3.2)*1.5;
const proofY=track(u,[[-1,1.1],[0,.46],[.33,.30],[1,.12],[1.67,.02],[2.7,.01],[3.33,-.04],[4.33,-.20],[5.86,-.25],[6.5,-1.2]])[0];
show(proof,t>=3&&u<6.5?1:0);proof.style.transform=`translateY(${proofY*height}px)`;
const fan=phase(u,1.18,2.15),flip=phase(u,1.38,2.08),size=track(u,[[0,.65],[.6,.70],[1,.83],[1.65,1],[6.5,1]])[0];
stage.style.setProperty('--proof-field',t>=3&&t<7.5?'#fcfcfc':'#F8F8F0');
cards.forEach((c,i)=>{
 const gap=mobile?30:20.4;
 const x=(i-1)*gap*fan+(i-1)*.9*(1-fan);
 // Each card is its own depth context. Stable paint order prevents intersecting planes.
 const yaw=reduced.matches?180:180*flip+(i-1)*-5*(1-fan);
 c.style.transform=`translateX(calc(-50% + ${x}vw)) translateY(${(1-i)*-17*(1-fan)}px) rotateY(${yaw}deg) rotateZ(${(i-1)*3*(1-fan)}deg) scale(${size})`;
 c.style.zIndex=String(i+1);
});
const sy=track(t,[[0,1.3],[6,1.3],[6.5,.85],[7,.65],[7.5,.2],[8,0],[15.35,0],[16,-.43],[16.5,-.80],[17,-1.15],[18,-1.15]])[0];
// The final automation field enters underneath the departing rounded writing field.
show(story,t>=6?1:0);story.style.transform=`translateY(${sy*height}px)`;
const qualify=phase(t,11.45,12.05),writing=phase(t,12.55,13.05),auto=phase(t,16.1,16.6);copy.forEach((el,i)=>{const weights=[1-qualify,qualify*(1-writing),writing*(1-auto),auto];show(el,weights[i]);el.style.transform=`translateY(${(1-weights[i])*8}px)`});
let bg=blend([238,237,229],[242,231,216],qualify);bg=blend(bg,[235,228,212],writing);bg=blend(bg,[248,248,240],auto);story.style.setProperty('--film-bg',`rgb(${bg.join(',')})`);story.style.borderRadius=t>16.3?'0':'80px';if(mobile)story.style.borderRadius=t>16.3?'0':'28px';
const shrink=phase(t,8.55,9.4),globeIn=phase(t,9.5,10),globeOut=phase(t,10,10.5),list=phase(t,10.45,11.2);show(orbit,1-list);
const spin=track(t,[[6,0],[7,20],[7.5,105],[8,205],[8.5,300],[9,390]])[0];const rad=(mobile?110:innerWidth*.132)*(1-shrink*.92);
tokens.forEach((token,i)=>{const angle=(i/tokens.length*360+spin)*Math.PI/180,tilt=track(t,[[6,0],[7,15],[7.5,78],[8,0],[8.5,-78],[9,-180]])[0];token.style.transform=`translate(-50%,-50%) translate3d(${Math.cos(angle)*rad}px,${Math.sin(angle)*rad*.98}px,${Math.sin(angle)*35}px) rotateX(${tilt}deg) rotateY(${Math.cos(angle)*32}deg) rotateZ(${-Math.sin(angle)*18}deg) scale(${1-shrink*.9})`;token.style.opacity=String(1-phase(t,9.15,9.55));token.style.zIndex=String(Math.round(100+Math.sin(angle)*40))});
show(globe,globeIn*(1-globeOut));const rotation=t*.4;const projected=nodes.map(([x,y,z])=>{const xx=x*Math.cos(rotation)+z*Math.sin(rotation),zz=z*Math.cos(rotation)-x*Math.sin(rotation);return[200+xx*155,200+y*155,zz]});edges.forEach(([a,b],i)=>{const l=lines[i];l.setAttribute('x1',projected[a][0]);l.setAttribute('y1',projected[a][1]);l.setAttribute('x2',projected[b][0]);l.setAttribute('y2',projected[b][1]);l.style.opacity=String(.2+(projected[a][2]+1)*.25)});dots.forEach((d,i)=>{d.setAttribute('cx',projected[i][0]);d.setAttribute('cy',projected[i][1])});globe.style.transform=`scale(${.15+.85*globeIn*(1-globeOut)})`;
show(records,list*(1-writing));records.style.transform=`translateY(${-qualify*(mobile?25:65)}px)`;rows.forEach((row,i)=>{const entry=phase(t,10.55+i*.09,11+i*.09);row.style.clipPath=`inset(0 ${(1-entry)*100}% 0 0 round 22px)`;const open=i===0?qualify:0;const detail=row.querySelector('.pf-record-detail');detail.style.maxHeight=open*(mobile?150:innerWidth*.145)+'px';detail.style.opacity=String(open);row.style.opacity=String(entry)});
const docScroll=phase(t,13.05,14.5),swirl=phase(t,14.35,15.15);show(docs,writing*(1-phase(t,14.35,14.7)));docs.style.transform=`translateY(${-docScroll*(mobile?35:110)}px)`;
docs.children[1].style.clipPath=`inset(0 ${(1-phase(t,13.4,14.2))*100}% 0 0 round 20px)`;
show(shreds,phase(t,14.3,14.55)*(1-phase(t,14.9,15.2)));pieces.forEach((piece,i)=>{const angle=i/pieces.length*Math.PI*2+swirl*5.5,r=(mobile?110:220)*(1-swirl*.85);piece.style.transform=`translate(-50%,-50%) translate3d(${Math.cos(angle)*r}px,${Math.sin(angle)*r}px,${Math.sin(angle)*80}px) rotateZ(${angle*180/Math.PI}deg) rotateY(${swirl*75}deg) scale(${1-swirl*.7})`;piece.style.opacity=String(1-swirl*.55)});
show(portal,phase(t,14.55,15)*(1-auto));portal.style.rotate='0deg';portal.querySelector('svg').style.transform=`rotate(${-65+(t-14.5)*45}deg)`;
show(network,auto);const ny=track(t,[[16,.6],[16.5,.2],[17,0],[18,0]])[0];show(automation,auto);automation.style.transform=`translateY(${ny*height}px)`;network.style.setProperty('--signal',String(-(t-16)*400));
// Hold the final scene for reading; its CTA participates in normal navigation.
}
function schedule(){if(!raf)raf=requestAnimationFrame(draw)}addEventListener('scroll',schedule,{passive:true});addEventListener('portfolio-motion',schedule);addEventListener('resize',schedule,{passive:true});reduced.addEventListener('change',schedule);draw();
})();
