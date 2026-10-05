import { NativeOverview } from './native-overview.js';
import { OVERVIEW_RESOURCE_GZIP } from './overview-resources.js';
import { BY_ID, decode } from './core.js';

function base64Bytes(text){return Uint8Array.from(atob(text),c=>c.charCodeAt(0));}
let resourcePromise;
async function overviewResources(){
 if(!resourcePromise)resourcePromise=(async()=>{
  const stream=new Blob([base64Bytes(OVERVIEW_RESOURCE_GZIP)]).stream().pipeThrough(new DecompressionStream('gzip'));
  return JSON.parse(await new Response(stream).text());
 })().catch(error=>{resourcePromise=undefined;throw error;});
 return resourcePromise;
}

// Repair a preview copy only. Keep unknown/original bytes intact for TRK export.
export function overviewTrack(input){
 const track=decode(input);let adjusted=false;
 for(let i=0;i<900;i++){
  const id=track[i],piece=BY_ID.get(id),x=i%30,y=Math.floor(i/30);
  if(id&&id<253&&(!piece||x+piece.width>30||y+piece.height>30)){track[i]=0;adjusted=true;}
  if(track[901+i]>18){track[901+i]=0;adjusted=true;}
 }
 if(track[900]>4){track[900]=1;adjusted=true;}
 return {track,adjusted};
}

export async function createGameOverview(){
 const resources=await overviewResources(),baseline=base64Bytes(resources.baseline),pixels=new Uint8Array(65536);
 return {render(input){
  const {track,adjusted}=overviewTrack(input);
  NativeOverview.installOriginalMenuPanorama(baseline,0x2d1a0,track[900],resources.panoramas[track[900]].resources);
  NativeOverview.drawOriginalTrackOverview(pixels,baseline,track,resources.ground);
  const rgba=new Uint8ClampedArray(320*200*4);
  for(let i=0;i<64000;i++){
   const color=pixels[i]*3,at=i*4;
   rgba[at]=resources.palette[color];rgba[at+1]=resources.palette[color+1];rgba[at+2]=resources.palette[color+2];rgba[at+3]=255;
  }
  return {rgba,adjusted};
 }};
}
