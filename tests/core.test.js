import test from 'node:test';import assert from 'node:assert/strict';
import {CATALOG,blank,place,index,decode,encode,inspect,rotate,demo,defaultTrack,applyTerrainPreset,TERRAIN_PRESETS,TERRAIN} from '../src/core.js';
test('every byte survives a TRK round trip, including unknown identifiers and metadata',()=>{const bytes=Uint8Array.from({length:1802},(_,i)=>(i*73+11)%256);assert.deepEqual(encode(decode(bytes)),bytes);});
test('malformed imports are rejected before editing state',()=>{assert.throws(()=>decode(new Uint8Array(1801)));assert.throws(()=>decode([...blank().slice(0,1801),256]));assert.throws(()=>decode([...blank().slice(0,1801),1.5]));});
test('all catalog pieces place, replace and erase their complete footprint from every continuation cell',()=>{for(const t of CATALOG.filter(t=>t.id)){const raw=place(blank(),12,12,t.id);assert.equal(raw[index(12,12)],t.id);for(let dy=0;dy<t.height;dy++)for(let dx=0;dx<t.width;dx++){const erased=place(raw,12+dx,12+dy,0);assert.deepEqual(erased,blank(),`erase ID ${t.id} from ${dx},${dy}`);const next=place(raw,12+dx,12+dy,4);assert.equal(next[index(12+dx,12+dy)],4);assert.equal(next.filter(n=>n>=253).length,0);}}});
test('edge placement fails atomically and keeps horizon and trailing byte intact',()=>{const raw=blank();raw[900]=211;raw[1801]=173;for(const t of CATALOG.filter(t=>t.width>1||t.height>1))assert.throws(()=>place(raw,29,29,t.id));assert.equal(raw[900],211);assert.equal(raw[1801],173);const next=place(raw,29,29,4);assert.equal(next[900],211);assert.equal(next[1801],173);});
test('overlapping large pieces remove entire previous pieces without orphaning markers',()=>{let raw=place(blank(),10,10,10);raw=place(raw,11,11,11);assert.equal(raw[index(10,10)],0);assert.equal(raw[index(11,11)],11);assert.deepEqual(inspect(raw).issues.filter(s=>!s.includes('Start-')),[]);});
test('terrain uses the opposite row orientation and does not change track or metadata',()=>{const raw=demo();raw[900]=4;raw[1801]=92;const next=place(raw,2,3,5,'terrain');assert.equal(next[901+3*30+2],5);assert.deepEqual(next.slice(0,901),raw.slice(0,901));assert.equal(next[1801],92);});
test('structure check catches orphan markers, incomplete anchors and extra starts',()=>{const raw=demo();assert.deepEqual(inspect(raw).issues,[]);raw[index(0,0)]=253;raw[index(4,4)]=10;raw[index(15,15)]=1;const result=inspect(raw);assert.ok(result.issues.some(s=>s.includes('verwaistes')));assert.ok(result.issues.some(s=>s.includes('Fortsetzungsfeld fehlt')));assert.ok(result.issues.some(s=>s.includes('aktuell 2')));});
test('rotation stays within the same surface and shape family',()=>{for(const t of CATALOG){const next=CATALOG.find(p=>p.id===rotate(t.id));assert.equal(next.family,t.family);assert.equal(next.variant,t.variant);assert.equal(next.surface,t.surface);}assert.equal(rotate(4),5);assert.equal(rotate(64),65);});

test('original five terrain layouts retain all 900 bytes and original order',async()=>{
 const {createHash}=await import('node:crypto');
 const hashes=['36a2ed03c11673cc82d416be18e49d6dab3ae2f5f0504e2b4f43227887b21d68','ce53a09cd79085442ba7295ddb5ac08830db0b699430df003e2974d601ba15b0','42e0419fa062dce622b5ef15cf78b3e0ac7e9ef281bac34488d57e48beac9ee4','919c4cb1a535c4ff6a112fa846541a71ef94104cac68b4b1eae3f406848ab9fc','09b35a66fa56658a6575504e637eb2278547cf004d0e10ecb6a9dffea0aa6334'];
 assert.equal(TERRAIN_PRESETS.length,5);
 for(const p of TERRAIN_PRESETS){assert.equal(p.terrain.length,900);assert.equal(createHash('sha256').update(Uint8Array.from(p.terrain)).digest('hex'),hashes[p.id]);}
});
test('applying terrain preserves the complete track, horizon and trailing metadata atomically',()=>{
 const raw=demo();raw[900]=211;raw[1801]=173;const original=[...raw];
 for(const p of TERRAIN_PRESETS){
  const next=applyTerrainPreset(raw,p.id);
  assert.deepEqual(next.slice(0,901),original.slice(0,901));assert.equal(next[1801],173);
  assert.deepEqual(next.slice(901,1801),p.terrain);assert.deepEqual(raw,original);assert.equal(encode(next).length,1802);
 }
});
test('new track on a preset clears anchors and continuation cells while preserving metadata',()=>{
 let raw=place(demo(),0,0,10);raw[900]=4;raw[1801]=88;
 const next=applyTerrainPreset(raw,4,true);
 assert.deepEqual(next.slice(0,900),new Array(900).fill(0));assert.equal(next[900],4);assert.equal(next[1801],88);
 assert.deepEqual(next.slice(901,1801),TERRAIN_PRESETS[4].terrain);assert.ok(raw.slice(0,900).some(n=>n>=253));
});
test('all 19 original terrain types are supported with water at ID 1 and plateau at ID 6',()=>{
 assert.equal(TERRAIN.length,19);assert.equal(TERRAIN[1],'Wasser');assert.equal(TERRAIN[6],'Hochebene');
 for(let id=0;id<19;id++){const raw=place(demo(),3,5,id,'terrain');assert.equal(raw[901+5*30+3],id);assert.deepEqual(inspect(raw).issues,[]);}
 assert.throws(()=>place(demo(),0,0,19,'terrain'));
 const unknown=demo();unknown[901]=19;assert.ok(inspect(unknown).issues.some(s=>s.includes('Unbekanntes Gelände 19')));
});
test('invalid preset, mode or TRK cannot partially change the input',()=>{
 const raw=demo(),original=[...raw];
 for(const id of [-1,5,1.5,'0',undefined])assert.throws(()=>applyTerrainPreset(raw,id));
 assert.throws(()=>applyTerrainPreset(raw,0,'new_track'));assert.throws(()=>applyTerrainPreset(raw.slice(1),0));assert.deepEqual(raw,original);
});

test('rotation cycles clockwise through available orientations without swapping bridge types',()=>{
 for(const cycle of [[38,36,39,37],[11,13,12,10],[64,65],[101,102],[103,104],[182,185,184,183],[0]]){
  for(let i=0;i<cycle.length;i++)assert.equal(rotate(cycle[i]),cycle[(i+1)%cycle.length]);
 }
});

test('original DEFAULT track retains all bytes, terrain and metadata and returns independent copies',async()=>{
 const {createHash}=await import('node:crypto');
 const raw=defaultTrack();assert.equal(raw.length,1802);
 assert.equal(createHash('sha256').update(encode(raw)).digest('hex'),'4111e30379c39020d10f30eef15b7e46aca87a7716e499cde2e89c7c545388fd');
 assert.equal(raw[900],1);assert.equal(raw[1801],0);assert.equal(inspect(raw).start,1);
 assert.deepEqual(inspect(raw).issues,[]);
 raw.fill(0);assert.notDeepEqual(raw,defaultTrack());
});
