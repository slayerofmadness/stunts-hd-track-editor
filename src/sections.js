import {decode,BY_ID,index,owner,place,CATALOG} from './core.js';
import {translatedError} from './i18n.js';
export function captureSection(raw,a,b){
 raw=decode(raw);
 if([...a,...b].length!==4||[...a,...b].some(n=>!Number.isInteger(n)||n<0||n>29))throw translatedError('Koordinaten müssen zwischen 0 und 29 liegen.');
 const rect={x:Math.min(a[0],b[0]),y:Math.min(a[1],b[1]),width:Math.abs(a[0]-b[0])+1,height:Math.abs(a[1]-b[1])+1};
 let changed=true;
 while(changed){changed=false;for(let y=rect.y;y<rect.y+rect.height;y++)for(let x=rect.x;x<rect.x+rect.width;x++){
  const id=raw[index(x,y)],[ax,ay]=owner(raw,x,y),t=BY_ID.get(raw[index(ax,ay)]);
  if(id>=253&&!t?.id)throw translatedError('Dieser Abschnitt enthält ein fehlerhaftes Mehrfeldteil.');
  if(id>0&&id<253&&!t)throw translatedError('Unbekanntes Bauteil.');
  if(!t?.id)continue;
  if(ax+t.width>30||ay+t.height>30)throw translatedError('Dieser Abschnitt enthält ein fehlerhaftes Mehrfeldteil.');
  const left=Math.min(rect.x,ax),top=Math.min(rect.y,ay),right=Math.max(rect.x+rect.width,ax+t.width),bottom=Math.max(rect.y+rect.height,ay+t.height);
  if(left!==rect.x||top!==rect.y||right!==rect.x+rect.width||bottom!==rect.y+rect.height){Object.assign(rect,{x:left,y:top,width:right-left,height:bottom-top});changed=true;}
 }}
 const pieces=[],terrain=[];
 for(let y=0;y<rect.height;y++)for(let x=0;x<rect.width;x++){
  const id=raw[index(rect.x+x,rect.y+y)];if(id>0&&id<253)pieces.push({x,y,id});terrain.push(raw[901+(rect.y+y)*30+rect.x+x]);
 }
 return {...rect,pieces,terrain,source:{...rect,pieces:pieces.map(p=>({...p})),terrain:[...terrain]}};
}
export function rotateSection(section){
 const pieces=section.pieces.map(p=>{
  const t=BY_ID.get(p.id),angle=(t.rotation+1)%4;
  let next=CATALOG.find(q=>q.family===t.family&&q.variant===t.variant&&q.surface===t.surface&&q.rotation===angle);
  // Half turns of symmetric straight pieces are represented by their equivalent orientation.
  next??=CATALOG.find(q=>q.family===t.family&&q.variant===t.variant&&q.surface===t.surface&&q.rotation===(angle+2)%4);
  if(!next&&t.variant==='inte')next=t;
  if(!next&&t.category==='Landschaft'&&CATALOG.filter(q=>q.family===t.family&&q.variant===t.variant).length===1)next=t;
  if(!next)throw translatedError('Dieser Abschnitt enthält ein Bauteil ohne passende Drehrichtung.');
  return {x:section.height-p.y-t.height,y:p.x,id:next.id};
 });
 const terrain=new Array(section.width*section.height);
 // Original terrain IDs rotate clockwise as a complete height field.
 const rotated=[0,1,5,2,3,4,6,10,7,8,9,14,11,12,13,18,15,16,17];
 for(let y=0;y<section.height;y++)for(let x=0;x<section.width;x++)terrain[x*section.height+section.height-1-y]=rotated[section.terrain[y*section.width+x]]??section.terrain[y*section.width+x];
 return {...section,width:section.height,height:section.width,pieces,terrain};
}
export function applySection(input,section,x,y,{move=false,terrain=false,replace=false}={}){
 let raw=decode(input);
 if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x+section.width>30||y+section.height>30)throw translatedError('Der Abschnitt passt hier nicht auf die Karte.');
 if(move){
  const original=section.source??section,current=captureSection(raw,[original.x,original.y],[original.x+original.width-1,original.y+original.height-1]);
  if(current.x!==original.x||current.y!==original.y||current.width!==original.width||current.height!==original.height||JSON.stringify(current.pieces)!==JSON.stringify(original.pieces)||(terrain&&JSON.stringify(current.terrain)!==JSON.stringify(original.terrain)))throw translatedError('Der ursprüngliche Abschnitt wurde geändert. Wähle ihn erneut aus.');
  for(const p of original.pieces)raw=place(raw,original.x+p.x,original.y+p.y,0);
  if(terrain)for(let cy=original.y;cy<original.y+original.height;cy++)for(let cx=original.x;cx<original.x+original.width;cx++)raw[901+cy*30+cx]=0;
 }
 const targetOwners=new Map();for(let cy=y;cy<y+section.height;cy++)for(let cx=x;cx<x+section.width;cx++){
  const a=owner(raw,cx,cy),id=raw[index(...a)];if(id)targetOwners.set(a.join(','),a);
 }
 if(targetOwners.size&&!replace)throw translatedError('Das Ziel enthält Bauteile. Aktiviere Ersetzen oder wähle eine freie Stelle.');
 for(const a of targetOwners.values())raw=place(raw,...a,0);
 for(const p of section.pieces)raw=place(raw,x+p.x,y+p.y,p.id);
 if(terrain)for(let cy=0;cy<section.height;cy++)for(let cx=0;cx<section.width;cx++)raw[901+(y+cy)*30+x+cx]=section.terrain[cy*section.width+cx];
 return raw;
}
