import { tr, pieceName, translatedError } from './i18n.js';
import { TERRAIN_PRESETS } from './terrain.js';
import { CATALOG } from './catalog.js';
import { DEFAULT_TRACK_BYTES } from './default-track.js';
import { canonicalTrackBytes } from './track-format.js';
export { CATALOG };
export const SIZE = 30, BY_ID = new Map(CATALOG.map(t => [t.id,t]));
export { TERRAIN, COLORS, TERRAIN_PRESETS } from './terrain.js';
export const index = (x,y) => (29-y)*30+x;
export function decode(bytes) {
 if (bytes.length !== 1802 || [...bytes].some(n => !Number.isInteger(n)||n<0||n>255)) throw translatedError('Eine Stunts-TRK-Datei muss genau 1.802 Bytes enthalten.');
 return Array.from(bytes);
}
export function encode(raw) { return Uint8Array.from(canonicalTrackBytes(decode(raw))); }
export function blank() { return new Array(1802).fill(0); }
export function safeName(value) { return value.replace(/\.trk$/i,'').toUpperCase().replace(/[^A-Z0-9_-]/g,'').slice(0,8)||'HDTRACK'; }
export function cells(tile,x,y) { return Array.from({length:tile.width*tile.height},(_,i) => [x+i%tile.width,y+Math.floor(i/tile.width)]); }
export function owner(raw,x,y) {
 const id=raw[index(x,y)]; if(id<253) return [x,y];
 for(let dy=0;dy<2;dy++) for(let dx=0;dx<2;dx++) {
  const ax=x-dx,ay=y-dy;if(ax<0||ay<0)continue;
  const t=BY_ID.get(raw[index(ax,ay)]);if(t&&t.id&&t.width>dx&&t.height>dy)return [ax,ay];
 }
 return [x,y];
}
export function place(raw,x,y,id,layer='track') {
 if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||x>29||y<0||y>29)throw translatedError('Koordinaten müssen zwischen 0 und 29 liegen.');
 const next=[...raw];
 if(layer==='terrain') {if(!Number.isInteger(id)||id<0||id>18)throw translatedError('Unbekanntes Gelände.'); next[901+y*30+x]=id;return next;}
 if(layer!=='track')throw translatedError('Unbekannte Ebene.');
 const t=BY_ID.get(id);if(!t)throw translatedError('Unbekanntes Bauteil.');
 if(x+t.width>30||y+t.height>30)throw translatedError('{piece} benötigt {width} × {height} Felder und passt hier nicht.',{piece:pieceName(t),pieceId:id,width:t.width,height:t.height});
 const targets=cells(t,x,y),anchors=new Map();
 for(const [cx,cy]of targets) {const a=owner(next,cx,cy);anchors.set(a.join(','),a);}
 for(const [ax,ay]of anchors.values()) {
  const old=BY_ID.get(next[index(ax,ay)])||{width:1,height:1};
  for(const [cx,cy]of cells(old,ax,ay))if(cx<30&&cy<30)next[index(cx,cy)]=0;
 }
 next[index(x,y)]=id>=182&&id<=185?(id%2===0?4:5):id;
 if(id)for(const [cx,cy]of targets)if(cx!==x||cy!==y)next[index(cx,cy)]=cx===x?254:cy===y?255:253;
 return next;
}
export function rotate(id) {
 const t=BY_ID.get(id);if(!t)return id;
 const family=CATALOG.filter(p=>p.family===t.family&&p.variant===t.variant&&p.surface===t.surface);
 // Symmetric pieces may store only two orientations. Skip unavailable angles
 // clockwise without changing the underlying type or surface.
 for(let step=1;step<=4;step++){
  const target=family.find(p=>p.rotation===(t.rotation+step)%4);
  if(target)return target.id;
 }
 return id;
}
export function inspect(raw) {
 const issues=[],locations=[],expected=new Map();let start=0,tiles=0;
 const add=(message,x=null,y=null)=>{issues.push(message);locations.push(x===null?null:[x,y]);};
 for(let y=0;y<30;y++)for(let x=0;x<30;x++) {
  const id=raw[index(x,y)],t=BY_ID.get(id);if(!id||id>=253)continue;tiles++;
  if(!t){add(tr('X {x}, Y {y}: unbekanntes Bauteil {id}.',{x:x+1,y:y+1,id}),x,y);continue;}
  if(t.family==='sst')start++;
  if(x+t.width>30||y+t.height>30){add(tr('X {x}, Y {y}: Bauteil ragt über den Rand.',{x:x+1,y:y+1}),x,y);continue;}
  for(const [cx,cy]of cells(t,x,y))if(cx!==x||cy!==y) {
   const at=index(cx,cy),marker=cx===x?254:cy===y?255:253;
   if(expected.has(at))add(tr('X {x}, Y {y}: überlappende Bauteile.',{x:cx+1,y:cy+1}),cx,cy);
   expected.set(at,marker);if(raw[at]!==marker)add(tr('X {x}, Y {y}: Fortsetzungsfeld fehlt.',{x:cx+1,y:cy+1}),cx,cy);
  }
 }
 for(let i=0;i<900;i++)if(raw[i]>=253&&!expected.has(i))add(tr('X {x}, Y {y}: verwaistes Fortsetzungsfeld.',{x:i%30+1,y:30-Math.floor(i/30)}),i%30,29-Math.floor(i/30));
 for(let i=901;i<1801;i++)if(raw[i]>18)add(tr('Unbekanntes Gelände {id} auf Feld {cell}.',{id:raw[i],cell:i-900}),(i-901)%30,Math.floor((i-901)/30));
 if(start!==1)add(tr('Die Strecke braucht genau eine Start-/Ziellinie (aktuell {count}).',{count:start}));
 return {tiles,start,issues,locations};
}
export function defaultTrack() { return [...DEFAULT_TRACK_BYTES]; }
export function demo() {
 let raw=blank();
 for(let y=8;y<=20;y++)for(const x of[8,21])raw=place(raw,x,y,4);
 for(let x=9;x<=20;x++)for(const y of[7,21])raw=place(raw,x,y,5);
 for(const [x,y,id]of[[8,7,6],[21,7,7],[8,21,8],[21,21,9],[8,13,1],[21,13,64],[12,7,116]])raw=place(raw,x,y,id);
 return raw;
}

export function applyTerrainPreset(raw,id,clearTrack=false) {
 const next=decode(raw);
 if(!Number.isInteger(id)||id<0||id>=TERRAIN_PRESETS.length)throw translatedError('Unbekannte Gelände-Vorlage.');
 if(typeof clearTrack!=='boolean')throw translatedError('Ungültiger Gelände-Modus.');
 if(clearTrack)next.fill(0,0,900);
 next.splice(901,900,...TERRAIN_PRESETS[id].terrain);
 return next;
}
