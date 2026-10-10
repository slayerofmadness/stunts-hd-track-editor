import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {blank,place,index,BY_ID,CATALOG,inspect,defaultTrack,demo} from '../src/core.js';
import {captureSection,rotateSection,applySection} from '../src/sections.js';
import {piecePorts,trackConnections,terrainHeight,placementConnections,sectionProfile} from '../src/connections.js';
import {connectedTileIcon} from '../src/map-art.js';
import {createTestStart} from '../src/test-start.js';
import {nativeRouteCheck} from '../src/native-route-validation.js';
import {checkTrack} from '../src/validation.js';

test('selection expands recursively to complete intersected multi-cell pieces',()=>{
 let raw=place(blank(),3,4,10);raw=place(raw,5,5,10);
 const s=captureSection(raw,[4,5],[5,5]);assert.deepEqual([s.x,s.y,s.width,s.height],[3,4,4,3]);assert.equal(s.pieces.length,2);
 const broken=blank();broken[index(29,29)]=10;assert.throws(()=>captureSection(broken,[29,29],[29,29]),/Mehrfeldteil/);
 assert.throws(()=>captureSection(raw,[30,0],[30,0]),/Koordinaten/);
});
test('copy and overlapping moves preserve complete footprints and metadata atomically',()=>{
 let raw=place(blank(),3,4,10);raw[900]=4;raw[1801]=167;raw[901+4*30+3]=7;
 const s=captureSection(raw,[4,5],[4,5]),before=[...raw];
 const copied=applySection(raw,s,12,12,{terrain:true});assert.deepEqual(raw,before);assert.equal(copied[index(12,12)],10);assert.equal(copied[901+12*30+12],7);
 const moved=applySection(raw,s,4,4,{move:true,terrain:true});assert.equal(moved[index(3,4)],0);assert.equal(moved[index(4,4)],10);assert.equal(moved[901+4*30+3],0);
 for(const output of[copied,moved]){assert.equal(output[900],4);assert.equal(output[1801],167);assert.deepEqual(inspect(output).issues,['Die Strecke braucht genau eine Start-/Ziellinie (aktuell 0).']);}
 assert.throws(()=>applySection(raw,s,29,29),/passt/);assert.throws(()=>applySection(raw,s,3,4),/Ziel/);assert.deepEqual(raw,before);
 const changed=place(raw,3,4,4);assert.throws(()=>applySection(changed,s,12,12,{move:true}),/geändert/);assert.equal(changed[index(3,4)],4);
});
test('rotation preserves every catalog footprint through four turns and rotates the complete terrain height field',()=>{
 for(const t of CATALOG.filter(t=>t.id&&t.id<182)){
  const raw=place(blank(),5,5,t.id);const s=captureSection(raw,[5,5],[5,5]);let rotated=s;
  for(let i=0;i<4;i++)rotated=rotateSection(rotated);
  assert.deepEqual(rotated.pieces,s.pieces,`${t.id}`);assert.equal(rotated.width,s.width);assert.equal(rotated.height,s.height);
 }
 for(let id=0;id<19;id++){
  const raw=blank();raw[901+5*30+5]=id;const s=rotateSection(captureSection(raw,[5,5],[5,5]));
  for(const[x,y]of[[0,0],[1,0],[1,1],[0,1],[.2,.7]])assert.ok(Math.abs(terrainHeight(s.terrain[0],x,y)-terrainHeight(id,y,1-x))<1e-9,`${id} ${x},${y}`);
 }
});
test('a rotated move clears the original dimensions and supports replacement across large-piece boundaries',()=>{
 let raw=place(blank(),4,4,52);const s=captureSection(raw,[4,4],[4,4]);const rot=rotateSection(s);
 const moved=applySection(raw,rot,10,10,{move:true});assert.equal(moved[index(4,4)],0);assert.equal(moved[index(4,5)],0);assert.equal(moved[index(10,10)],rot.pieces[0].id);
 raw=place(raw,10,10,10);const replacement=applySection(raw,s,11,11,{replace:true});assert.equal(replacement[index(10,10)],0);assert.equal(replacement[index(11,11)],52);assert.ok(!inspect(replacement).issues.some(s=>/Fortsetzungs|überlapp/.test(s)));
});
test('native ports detect multiple independent pipe, height and bank mismatches without changing input',()=>{
 let raw=blank();for(const[x,y,id]of[[2,2,68],[2,3,4],[6,2,34],[6,3,4],[10,2,4],[10,3,4]])raw=place(raw,x,y,id);
 raw[901+3*30+10]=6;const before=[...raw],c=trackConnections(raw);
 assert.ok(c.issues.some(p=>p.reason==='state'));assert.ok(c.issues.some(p=>p.reason==='height'));assert.ok(checkTrack(raw).localIssues.length>=3);
 placementConnections(raw,4,2,2);assert.deepEqual(raw,before);
 for(const raw of[defaultTrack(),demo()])assert.deepEqual(trackConnections(raw).issues,[]);
 for(const t of CATALOG)for(const p of piecePorts(t.id)){assert.ok(p.x>=0&&p.x<=t.width);assert.ok(p.y>=0&&p.y<=t.height,`${t.id}`);}
});
test('continuous pipe artwork keeps portals at exposed ends and removes interior seams in both orientations',()=>{
 for(const[id,dx,dy]of[[68,0,1],[69,1,0]]){
  let raw=blank();for(let n=0;n<3;n++)raw=place(raw,4+n*dx,4+n*dy,id);
  const c=trackConnections(raw),middle=c.ports.filter(p=>p.anchor[0]===4+dx&&p.anchor[1]===4+dy);
  assert.equal(middle.every(p=>p.status==='connected'),true);
  assert.ok(!connectedTileIcon(BY_ID.get(id),middle).includes('Q32'));
  const end=c.ports.filter(p=>p.anchor[0]===4&&p.anchor[1]===4);assert.equal((connectedTileIcon(BY_ID.get(id),end).match(/Q32/g)||[]).length,1);
 }
});
test('height cross-sections show ramp and elevated deck at the matching native heights',()=>{
 let raw=place(blank(),5,5,38);raw=place(raw,5,4,34);raw=place(raw,5,6,4);
 const profile=sectionProfile(raw,[5,4],[5,6]);assert.deepEqual(profile.samples.map(p=>p.height),[[450,450],[450,0],[0,0]]);
});
test('test starts use a valid preceding straight, preserve input and metadata, and keep all original routes valid',()=>{
 const hd=Array.from(readFileSync(new URL('../../playstunts-macos/track-checks/HDFIX.TRK',import.meta.url)));
 let count=0;
 for(const raw of[demo(),defaultTrack(),hd]){
  const before=[...raw],nodes=nativeRouteCheck(raw,true).nodes;
  for(const node of nodes.filter((n,i)=>i%9===0||BY_ID.get(n.tile)?.family==='ssl')){
   const result=createTestStart(raw,[node.x,node.y]);assert.equal(nativeRouteCheck(result.raw).error,0);assert.equal(BY_ID.get(result.raw[index(...result.start)]).family,'sst');assert.deepEqual(result.original,before);assert.deepEqual(result.raw.slice(900),raw.slice(900));count++;
  }
  assert.deepEqual(raw,before);
 }
 assert.ok(count>40);assert.throws(()=>createTestStart(blank(),[0,0]),/Korrigiere/);assert.throws(()=>createTestStart(demo(),[30,0]),/Koordinaten/);
});
