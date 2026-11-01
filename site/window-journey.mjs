export const clamp=value=>Math.max(0,Math.min(1,value));

// Screen-space samples of the balloon figure in the supplied 30 fps reference.
// Video viewport: x=114..1164, y=0..592. Time is the original video time.
// Track the entire figure (balloon included), not just its red torso.
const samples=[
 [1.200,-.055,.82,1],[1.333,-.012,.72,1.05],
 [1.400,.0505,.6444,1.04],[1.467,.0748,.6056,1.01],
 [1.533,.1071,.6166,1.01],[1.600,.1424,.6225,.99],
 [1.667,.1757,.6275,.97],[1.733,.2081,.6309,.93],
 [1.800,.2452,.6309,.91],[1.867,.2938,.6292,.89],
 [1.933,.3667,.6174,.84],[2.000,.4690,.5887,.81],
 [2.067,.5871,.5448,.85],[2.133,.7129,.4907,.93],
 [2.200,.8329,.4400,1.05],[2.267,.8762,.4215,.98],
 [2.333,.7871,.4552,.93],[2.400,.7119,.4856,.87],
 [2.467,.6262,.5177,.83],[2.533,.5362,.5515,.82],
 [2.600,.3295,.5997,.92],[2.667,-.012,.5008,1.02],
 [2.733,-.055,.43,1]
];
export const REFERENCE_START=1.2,REFERENCE_END=2.733;
function makeRoute(ratio,width){
 const track=samples.map(([time,...position])=>[(time-REFERENCE_START)/(REFERENCE_END-REFERENCE_START),...position]);
 track[0][1]=-ratio/2+1/width;track[track.length-1][1]=-ratio/2;
 const slopes=axis=>{
  const d=track.slice(1).map((v,i)=>(v[axis]-track[i][axis])/(v[0]-track[i][0]));
  return track.map((v,i)=>{
   if(i===0)return d[0];if(i===track.length-1)return d[d.length-1];
   if(d[i-1]*d[i]<=0)return 0;
   const h0=v[0]-track[i-1][0],h1=track[i+1][0]-v[0],w1=2*h1+h0,w2=h1+2*h0;
   return (w1+w2)/(w1/d[i-1]+w2/d[i]);
  });
 };
 const tangents=[null,slopes(1),slopes(2),slopes(3)];
 return p=>{
  let i=0;while(i<track.length-2&&p>track[i+1][0])i++;
  const a=track[i],b=track[i+1],dt=b[0]-a[0],t=(p-a[0])/dt,t2=t*t,t3=t2*t;
  const value=k=>(2*t3-3*t2+1)*a[k]+(t3-2*t2+t)*dt*tangents[k][i]+(-2*t3+3*t2)*b[k]+(t3-t2)*dt*tangents[k][i+1];
  return {x:value(1),y:value(2),scale:value(3),r:0};
 };
}

export function prepareJourney({width,height,copyHeight,columnWidth,top=0,windowRatio=.11}){
 const windowWidth=width*windowRatio,windowHeight=windowWidth*870/1025;
 return {width,height,copyHeight,columnWidth,top,windowWidth,windowHeight,
  textTotal:height+copyHeight,route:makeRoute(windowRatio,width)};
}

export function journeyFrame(layout,rawProgress){
 const p=clamp(rawProgress),pos=layout.route(p);
 // One scroll clock. No second speed curve, text collision solver or detour.
 return {progress:p,windowProgress:p,
  x:pos.x*layout.width-layout.windowWidth/2,
  y:pos.y*(layout.height+layout.top)-layout.top-layout.windowHeight/2,
  rotation:pos.r,scale:pos.scale,textY:layout.height-layout.textTotal*p,opacity:1};
}
