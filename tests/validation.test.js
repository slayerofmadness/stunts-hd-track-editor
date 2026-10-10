import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultTrack,demo,blank,place,index,encode} from '../src/core.js';
import {checkTrack} from '../src/validation.js';

test('native check accepts original DEFAULT and the editor demo',()=>{
 for(const raw of [defaultTrack(),demo()]){const before=[...raw],result=checkTrack(raw);assert.equal(result.valid,true);assert.equal(result.native.error,0);assert.deepEqual(raw,before);}
});
test('a missing pipe entrance is reported at the real editor coordinates',()=>{
 const raw=place(demo(),8,10,68),result=checkTrack(raw);
 assert.equal(result.valid,false);assert.equal(result.native.error,4);assert.deepEqual(result.errors[0].location,[8,10]);assert.match(result.errors[0].message,/Röhren/);
});
test('structure errors have map locations and cannot produce a false route success',()=>{
 const raw=demo();raw[index(3,4)]=253;const result=checkTrack(raw);
 assert.equal(result.valid,false);assert.deepEqual(result.errors[0].location,[3,4]);assert.equal(result.native,null);
});
test('unsupported terrain and horizon return actionable errors without crashing',()=>{
 const raw=demo();raw[901+5*30+2]=255;const result=checkTrack(raw);assert.equal(result.valid,false);assert.deepEqual(result.errors[0].location,[2,5]);
 const badHorizon=demo();badHorizon[900]=255;assert.equal(checkTrack(badHorizon).valid,false);assert.equal(encode(badHorizon)[900],255,'draft export preserves unknown horizon');
 assert.equal(checkTrack(blank()).valid,false);
});
test('engine slope IDs are canonical on placement and on legacy export, preserving metadata',()=>{
 let raw=blank();raw[900]=4;raw[1801]=0xa7;
 for(const [i,id] of [182,183,184,185].entries()){raw=place(raw,i,0,id);assert.equal(raw[index(i,0)],id%2===0?4:5);raw[index(i,0)]=id;}
 const bytes=encode(raw);
 for(const [i,id] of [182,183,184,185].entries())assert.equal(bytes[index(i,0)],id%2===0?4:5);
 assert.deepEqual(Array.from(bytes.slice(900)),raw.slice(900));assert.equal(raw[index(1,0)],183);
 assert.equal(checkTrack(raw).adjusted,4);
});
