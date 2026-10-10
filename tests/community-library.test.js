import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createCommunityLibrary,filterCommunityTracks} from '../src/community-library.js';
import {communityMapPreview} from '../src/library-ui.js';
const root=new URL('../vendor/community-tracks/',import.meta.url);
const catalog=JSON.parse(readFileSync(new URL('catalog.json',root),'utf8'));
const hash=raw=>createHash('sha256').update(raw).digest('hex');
const base=new URL('http://localhost/community-tracks/');
function fixture(overrides={}){
 const calls=[];
 const library=createCommunityLibrary(base,async url=>{
  assert.equal(url.origin,base.origin);assert.ok(url.pathname.startsWith(base.pathname));calls.push(url.pathname);
  if(overrides.request)return overrides.request(url,calls.length);
  const name=url.pathname.slice(base.pathname.length);
  return new Response(name==='catalog.json'?JSON.stringify(overrides.catalog??catalog):readFileSync(new URL(name,root)));
 });
 return {library,calls};
}

test('archive catalog keeps every usable source, groups duplicate bytes and retains Bliss metadata',()=>{
 assert.equal(catalog.tracks.length,4287);assert.equal(catalog.provenance.trackFiles,7111);
 assert.equal(catalog.provenance.duplicateFiles,2819);assert.equal(catalog.provenance.skipped.length,5);
 assert.equal(catalog.tracks.reduce((n,t)=>n+t.sources.length,0),7106);
 assert.equal(catalog.tracks.filter(t=>t.valid).length,4000);
 assert.ok(catalog.tracks.some(t=>t.sources.some(s=>s.author&&s.bytes>1802)));
 assert.equal(new Set(catalog.tracks.map(t=>t.id)).size,4287);
 assert.equal(new Set(catalog.tracks.map(t=>t.name)).size,4287);
 for(const pack of catalog.packs){const bytes=readFileSync(new URL(pack.file,root));assert.equal(bytes.length,pack.bytes);assert.equal(hash(bytes),pack.sha256);}
});

test('search finds original names, subarchives and authors and combines collection and route filters',()=>{
 const track=catalog.tracks.find(t=>t.sources.some(s=>s.author==='Overdrijf'));
 assert.ok(filterCommunityTracks(catalog.tracks,{query:'overdrijf'}).some(t=>t.id===track.id));
 assert.ok(filterCommunityTracks(catalog.tracks,{query:track.name.toLowerCase()}).some(t=>t.id===track.id));
 const collection=track.collections[0];
 const results=filterCommunityTracks(catalog.tracks,{collection,state:'valid'});
 assert.ok(results.length);assert.ok(results.every(t=>t.valid&&t.collections.includes(collection)));
 assert.equal(filterCommunityTracks(catalog.tracks,{state:'repair'}).length,287);
 assert.deepEqual(filterCommunityTracks(catalog.tracks,{query:'no-such-track-xyzabc'}),[]);
});

test('lazy reads verify bytes, isolate returned drafts and keep at most two packs',async()=>{
 const {library,calls}=fixture();await library.catalog();assert.equal(calls.length,1);
 for(const pack of catalog.packs.slice(0,5)){
  const entry=catalog.tracks.find(t=>t.pack===pack.file),raw=await library.read(entry.id);
  assert.equal(raw.length,1802);assert.equal(hash(Uint8Array.from(raw)),entry.id);
  raw.fill(0);assert.equal(hash(Uint8Array.from(await library.read(entry.id))),entry.id);
  assert.ok(library.cachedPacks()<=2);
 }
 assert.equal(calls.length,6);assert.equal(library.cachedPacks(),2);
 const sample=await library.read(catalog.tracks[0].id);
 assert.match(communityMapPreview(sample),/viewBox="0 0 1920 1920"/);
 assert.doesNotMatch(communityMapPreview(sample),/<script|href="https:/);
});

test('corrupted pack is rejected without changing a draft, then can be retried',async()=>{
 let damaged=true;const entry=catalog.tracks[0];
 const {library}=fixture({request:async url=>{
  const name=url.pathname.slice(base.pathname.length);if(name==='catalog.json')return new Response(JSON.stringify(catalog));
  const bytes=Uint8Array.from(readFileSync(new URL(name,root)));if(damaged)bytes[0]^=1;return new Response(bytes);
 }});
 await assert.rejects(library.read(entry.id),/Prüfsumme/);damaged=false;
 assert.equal(hash(Uint8Array.from(await library.read(entry.id))),entry.id);
});

test('invalid catalog cannot request files outside the library, and a failed catalog can retry',async()=>{
 const invalid=structuredClone(catalog);invalid.packs[0].file='../outside.bin';
 const bad=fixture({catalog:invalid});await assert.rejects(bad.library.catalog(),/Ungültige/);assert.equal(bad.calls.length,1);
 const retry=fixture({request:async(url,n)=>n===1?new Response('missing',{status:404}):new Response(JSON.stringify(catalog))});
 await assert.rejects(retry.library.catalog());assert.equal((await retry.library.catalog()).tracks.length,4287);
 await assert.rejects(retry.library.read('unknown'),/Unbekannte/);
});
