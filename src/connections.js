import {BY_ID,index,owner} from './core.js';
import {CONNECTION_RECORDS} from './connection-data.js';
// Native entry/exit codes locate ports on the exact 1x1 / 1x2 / 2x2 footprint.
const PORT_CODES=[null,[.5,0,0],[.5,1,2],[1,.5,1],[0,.5,3],[1.5,0,0],[0,1.5,3],[1,1.5,1],[2,.5,1],[2,1.5,1],[1.5,1,2],[.5,2,2],[1.5,2,2]];
export function terrainHeight(id,x=.5,y=.5){
 const fn=[()=>0,()=>0,()=>0,()=>0,()=>0,()=>0,()=>1,()=>1-y,()=>1-x,()=>y,()=>x,()=>1-x-y,()=>y-x,()=>x+y-1,()=>x-y,()=>2-x-y,()=>1+y-x,()=>x+y,()=>1+x-y][id];
 return Math.max(0,Math.min(1,fn?.()??0))*450;
}
export function piecePorts(id){
 const seen=new Set(),ports=[];
 for(const [a,b,sa,sb]of CONNECTION_RECORDS[id]??[])for(const [code,state]of[[a,sa],[b,sb]]){
  const p=PORT_CODES[code];if(!p)continue;const key=[...p,state].join(',');if(seen.has(key))continue;seen.add(key);ports.push({x:p[0],y:p[1],side:p[2],state});
 }
 return ports;
}
export function portLabel(state){return state===1?'Hochstraße':state===4?'Röhre':state===2||state===3?'Steilwand':'Straße';}
export function trackConnections(raw){
 const ports=[],lookup=new Map(),issues=[];
 for(let y=0;y<30;y++)for(let x=0;x<30;x++){
  const id=raw[index(x,y)],t=BY_ID.get(id);if(!t?.id)continue;
  for(const p of piecePorts(id)){
   const px=x+p.x,py=y+p.y;
   const cx=Math.min(29,x+Math.min(t.width-1,Math.floor(p.x))),cy=Math.min(29,y+Math.min(t.height-1,Math.floor(p.y)));
   const height=terrainHeight(raw[901+cy*30+cx],px-cx,py-cy)+(p.state===1?450:0);
   const port={...p,px,py,height,anchor:[x,y],id,status:'open'};ports.push(port);
   const key=`${px},${py}`;if(!lookup.has(key))lookup.set(key,[]);lookup.get(key).push(port);
  }
 }
 const seen=new Set();
 for(const p of ports){
  const other=(lookup.get(`${p.px},${p.py}`)||[]).filter(q=>q.anchor.join(',')!==p.anchor.join(',')&&(q.side+2)%4===p.side);
  p.status=other.some(q=>q.state===p.state&&Math.abs(q.height-p.height)<1)?'connected':other.length?'mismatch':'open';
  if(p.status==='mismatch'){
   const key=`${p.px},${p.py}`;if(seen.has(key))continue;seen.add(key);
   const q=other[0];issues.push({location:p.anchor,other:q.anchor,port:[p.px,p.py],reason:p.state!==q.state?'state':'height',states:[p.state,q.state],heights:[p.height,q.height]});
  }
 }
 for(let y=0;y<30;y++)for(let x=0;x<30;x++)for(const [dx,dy]of[[1,0],[0,1]]){
  if(x+dx>=30||y+dy>=30)continue;
  const a=raw[901+y*30+x],b=raw[901+(y+dy)*30+x+dx];
  const mismatch=[0,1].some(k=>Math.abs(terrainHeight(a,dx?1:k,dy?1:k)-terrainHeight(b,dx?0:k,dy?0:k))>1);
  if(mismatch)issues.push({location:[x+dx,y+dy],other:[x,y],reason:'terrain',states:[],heights:[]});
 }
 return {ports,issues};
}
export function placementConnections(raw,id,x,y,live=trackConnections(raw).ports){
 // Overlay reports candidate ports only; it never changes the caller's draft.
 const t=BY_ID.get(id);if(!t)return [];
 return piecePorts(id).map(p=>{
  const px=x+p.x,py=y+p.y,cx=x+Math.min(t.width-1,Math.floor(p.x)),cy=y+Math.min(t.height-1,Math.floor(p.y));
  const height=terrainHeight(raw[901+cy*30+cx],px-cx,py-cy)+(p.state===1?450:0);
  const neighbours=live.filter(q=>q.px===px&&q.py===py&&(q.side+2)%4===p.side&&!(q.anchor[0]>=x&&q.anchor[0]<x+t.width&&q.anchor[1]>=y&&q.anchor[1]<y+t.height));
  return {...p,px,py,height,status:neighbours.some(q=>q.state===p.state&&Math.abs(q.height-height)<1)?'connected':neighbours.length?'mismatch':'open'};
 });
}
export function sectionProfile(raw,from,to){
 const horizontal=Math.abs(to[0]-from[0])>=Math.abs(to[1]-from[1]),fixed=horizontal?from[1]:from[0],a=Math.min(from[horizontal?0:1],to[horizontal?0:1]),b=Math.max(from[horizontal?0:1],to[horizontal?0:1]);
 const samples=[];
 for(let n=a;n<=b;n++){
  const x=horizontal?n:fixed,y=horizontal?fixed:n,[ax,ay]=owner(raw,x,y),t=BY_ID.get(raw[index(ax,ay)]),land=raw[901+y*30+x];
  const relevant=piecePorts(t?.id).filter(p=>p.side===(horizontal?3:0)||p.side===(horizontal?1:2));
  const heightAt=f=>{
   const ground=terrainHeight(land,horizontal?f:.5,horizontal?.5:f);
   if(['sra','ssr','sbr'].includes(t?.family)){
    const px=horizontal?f:.5,py=horizontal?.5:f,high=[1-py,px,py,1-px][t.rotation];return ground+450*high;
   }
   return ground+(relevant.some(p=>p.state===1)&&!relevant.some(p=>p.state===0)?450:0);
  };
  samples.push({x,y,id:t?.id??0,name:t?.name??'',ground:[terrainHeight(land,horizontal?0:.5,horizontal?.5:0),terrainHeight(land,horizontal?1:.5,horizontal?.5:1)],height:[heightAt(0),heightAt(1)],road:!!relevant.length});
 }
 return {horizontal,samples};
}
