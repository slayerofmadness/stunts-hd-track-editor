import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createGameOverview,overviewTrack} from '../src/overview.js';
import {defaultTrack,blank,place,CATALOG,index} from '../src/core.js';
const hash=rgba=>createHash('sha256').update(rgba).digest('hex');

test('original DEFAULT overview retains native raster pixels and never alters TRK bytes',async()=>{
 const renderer=await createGameOverview(),raw=defaultTrack(),before=[...raw],frame=renderer.render(raw);
 assert.equal(frame.rgba.length,320*200*4);assert.equal(frame.adjusted,false);
 assert.equal(hash(frame.rgba),'6d19bb122690fcb3073c967034222aeeb046d2ddbab63415f5cb87c316964a9e');
 assert.deepEqual(raw,before);
 for(let i=3;i<frame.rgba.length;i+=4)assert.equal(frame.rgba[i],255);
});

test('five original panoramas render independently and repeated frames do not retain older terrain',async()=>{
 const renderer=await createGameOverview(),other=await createGameOverview(),raw=defaultTrack(),frames=[];
 for(let i=0;i<5;i++){raw[900]=i;frames.push(hash(renderer.render(raw).rgba));}
 assert.equal(new Set(frames).size,5);
 const base=defaultTrack(),savedFrame=renderer.render(base),savedHash=hash(savedFrame.rgba);
 renderer.render(blank());assert.equal(hash(renderer.render(base).rgba),savedHash);
 assert.equal(hash(savedFrame.rgba),savedHash);assert.equal(hash(other.render(base).rgba),savedHash);
});

test('native overview accepts every editor piece and terrain type, including ramps on elevated ground',async()=>{
 const renderer=await createGameOverview();
 for(const piece of CATALOG){
  let raw=place(blank(),14,14,piece.id,'track');raw=place(raw,14,14,6,'terrain');
  const before=[...raw];assert.equal(renderer.render(raw).adjusted,false);assert.deepEqual(raw,before);
 }
 const frames=new Set();
 for(let id=0;id<19;id++){const raw=place(blank(),15,15,id,'terrain');frames.add(hash(renderer.render(raw).rgba));}
 assert.ok(frames.size>10,'different original terrain models must produce different images');
});

test('painting, rotation, heights and replacement change the native preview',async()=>{
 const renderer=await createGameOverview(),empty=blank(),road=place(empty,15,15,4,'track');
 const images=[empty,road,place(empty,15,15,56,'track'),place(empty,15,15,36,'track'),place(empty,15,15,37,'track'),place(road,15,15,6,'terrain')].map(raw=>hash(renderer.render(raw).rgba));
 assert.equal(new Set(images).size,images.length);
});

test('unsupported imported fields are simplified only in the preview copy; malformed input is rejected',async()=>{
 const renderer=await createGameOverview(),raw=defaultTrack();raw[index(29,29)]=CATALOG.find(p=>p.width===2&&p.height===2).id;
 raw[0]=252;raw[901]=250;raw[900]=250;raw[1801]=123;const before=[...raw],view=overviewTrack(raw);
 assert.equal(view.adjusted,true);assert.equal(view.track[0],0);assert.equal(view.track[901],0);assert.equal(view.track[900],1);assert.equal(view.track[1801],123);
 assert.equal(renderer.render(raw).adjusted,true);assert.deepEqual(raw,before);
 assert.throws(()=>renderer.render([0,1,2]));
});
