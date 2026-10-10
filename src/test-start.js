import {decode,BY_ID,index,owner} from './core.js';
import {nativeRouteCheck} from './native-route-validation.js';
import {canonicalTrackBytes} from './track-format.js';
import {translatedError} from './i18n.js';
export function createTestStart(input,target){
 const raw=canonicalTrackBytes(decode(input)),checked=nativeRouteCheck(raw,true);
 if(checked.error)throw translatedError('Korrigiere die Strecke vor dem Teststart.');
 if(!Array.isArray(target)||target.length!==2||target.some(n=>!Number.isInteger(n)||n<0||n>29))throw translatedError('Koordinaten müssen zwischen 0 und 29 liegen.');
 const [tx,ty]=owner(raw,...target),nodes=checked.nodes??[];
 let nearest=0;for(let i=1;i<nodes.length;i++)if(Math.abs(nodes[i].x-tx)+Math.abs(nodes[i].y-ty)<Math.abs(nodes[nearest].x-tx)+Math.abs(nodes[nearest].y-ty))nearest=i;
 const starts={1:[1,180,179,181],2:[134,136,135,137],3:[147,149,148,150]};
 for(let step=1;step<=Math.min(nodes.length,60);step++){
  const node=nodes[(nearest-step+nodes.length)%nodes.length],id=raw[index(node.x,node.y)],t=BY_ID.get(id),land=raw[901+node.y*30+node.x];
  if(!t||!['srp','srd','sri'].includes(t.family)||t.variant!=='road'||t.width!==1||t.height!==1||![0,6].includes(land))continue;
  const test=[...raw];for(let y=0;y<30;y++)for(let x=0;x<30;x++){
   const st=BY_ID.get(test[index(x,y)]);if(st?.family==='sst')test[index(x,y)]=({1:[4,5],2:[14,15],3:[24,25]})[st.surface][st.rotation%2];
  }
  test[index(node.x,node.y)]=starts[t.surface][node.heading/256];
  if(nativeRouteCheck(test).error)continue;
  return {raw:test,start:[node.x,node.y],target:[tx,ty],heading:node.heading,original:raw};
 }
 throw translatedError('Vor dieser Stelle wurde keine geeignete Gerade für den Teststart gefunden.');
}
