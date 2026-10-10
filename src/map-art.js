import {BY_ID} from './core.js';
import {classicTileIcon} from './graphics.js';
import {piecePorts} from './connections.js';
export function connectedTileIcon(t,ports=[]){
 if(!['spi','sps','stu','sph'].includes(t?.family))return classicTileIcon(t,'map');
 let art='';
 const tube=t.family==='spi',transition=t.family==='sps',half=t.family==='sph';
 if(tube||half){
  art='<path d="M16 0H48V64H16Z" fill="#a8a8a8"/><path d="M21 0H43V64H21Z" fill="#545454"/><path d="M18 0V64M46 0V64" stroke="#fcfcfc" stroke-width="2"/><path d="M25 0V64M39 0V64" stroke="#777" stroke-width="2"/>';
  if(half)art+='<path d="M28 0V64M36 0V64" stroke="#a85400" stroke-width="2"/>';
 }else if(transition){
  art='<path d="M16 0H48L42 64H22Z" fill="#a8a8a8"/><path d="M21 0H43L42 64H22Z" fill="#545454"/><path d="M18 0L22 62M46 0L42 62" stroke="#fcfcfc" stroke-width="2"/>';
 }else art='<path d="M15 0H49V64H15Z" fill="#a8a8a8"/><path d="M22 0H42V64H22Z" fill="#545454"/><path d="M17 0V64M47 0V64" stroke="#fcfcfc" stroke-width="2"/>';
 // Draw exposed ends only. Adjacent pipe/tunnel sections form one uninterrupted body.
 for(const p of piecePorts(t.id)){
  const live=ports.find(q=>q.side===p.side&&q.state===p.state);
  if(transition&&p.state===0||live?.status==='connected')continue;
  const baseSide=(p.side-t.rotation+4)%4;
  if(baseSide===0)art+='<path d="M16 6Q32 18 48 6" fill="none" stroke="#fcfcfc" stroke-width="3"/>';
  if(baseSide===2)art+='<path d="M16 58Q32 46 48 58" fill="none" stroke="#fcfcfc" stroke-width="3"/>';
 }
 return `<svg viewBox="0 0 64 64" aria-hidden="true"><g transform="rotate(${t.rotation*90} 32 32)">${art}</g></svg>`;
}
export function connectionOverlay(ports,labels=false){
 const colours={connected:'#9de57a',mismatch:'#ff7373',open:'#7dc6ff'};
 return ports.map(p=>{
  const x=p.px*48,y=p.py*48,fill=colours[p.status];
  const type=p.state===1?'H':p.state===4?'R':p.state===2||p.state===3?'S':'0';
  return `<g class="connection-port"><circle cx="${x}" cy="${y}" r="4" fill="${fill}" stroke="#132124" stroke-width=".4" vector-effect="non-scaling-stroke"/>${labels?`<text x="${x+6}" y="${y-5}" fill="${fill}" font-size="10" font-family="system-ui" paint-order="stroke" stroke="#132124" stroke-width="2">${type}</text>`:''}</g>`;
 }).join('');
}
