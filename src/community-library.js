import {normalizeSearch} from './i18n.js';

export function filterCommunityTracks(tracks,{query='',collection='',state='all'}={}){
 const terms=normalizeSearch(query).split(/\s+/).filter(Boolean);
 return tracks.filter(track=>(!collection||track.collections.includes(collection))&&
  (state==='all'||(state==='valid'?track.valid:!track.valid))&&
  terms.every(term=>normalizeSearch([track.title,track.name,...track.collections,
   ...track.sources.flatMap(source=>[source.path,source.author||'',source.title||''])].join(' ')).includes(term)));
}

/** Local assets only; keep two verified packs, never all decoded tracks. */
export function createCommunityLibrary(base,request=fetch){
 let pending;const packs=new Map();
 const catalog=()=>pending??=(async()=>{
  try{
   const response=await request(new URL('catalog.json',base));
   if(!response.ok)throw Error('Streckenbibliothek konnte nicht geladen werden.');
   const value=await response.json();
   if(value.format!==1||!Array.isArray(value.tracks)||!Array.isArray(value.packs))throw Error('Ungültige Streckenbibliothek.');
   for(const p of value.packs)if(!/^pack-\d+\.bin$/.test(p.file)||!Number.isSafeInteger(p.bytes)||p.bytes<1802||!Number.isInteger(p.bytes/1802)||!/^([a-f0-9]{64})$/.test(p.sha256))throw Error('Ungültige Streckenbibliothek.');
   const names=new Set(),ids=new Set(),files=new Map(value.packs.map(p=>[p.file,p]));
   for(const entry of value.tracks){
    const pack=files.get(entry.pack);
    if(!/^[A-Z0-9_-]{1,8}$/.test(entry.name)||names.has(entry.name)||!/^([a-f0-9]{64})$/.test(entry.id)||ids.has(entry.id)||
     typeof entry.title!=='string'||!Array.isArray(entry.collections)||entry.collections.some(c=>typeof c!=='string')||
     !Array.isArray(entry.sources)||entry.sources.some(s=>typeof s.path!=='string')||
     typeof entry.valid!=='boolean'||!pack||!Number.isSafeInteger(entry.offset)||entry.offset<0||entry.offset%1802||entry.offset+1802>pack.bytes)throw Error('Ungültige Streckenbibliothek.');
    names.add(entry.name);ids.add(entry.id);
   }
   return value;
  }catch(error){pending=undefined;throw error;}
 })();
 async function digest(bytes){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),n=>n.toString(16).padStart(2,'0')).join('');}
 return {
  catalog,
  async read(id){
   const index=await catalog(),entry=index.tracks.find(t=>t.id===id);
   if(!entry)throw Error('Unbekannte Archivstrecke.');
   const pack=index.packs.find(p=>p.file===entry.pack);
   let promise=packs.get(entry.pack);
   if(promise){packs.delete(entry.pack);packs.set(entry.pack,promise);}
   else{
    promise=(async()=>{const response=await request(new URL(entry.pack,base));if(!response.ok)throw Error('Archivstrecke konnte nicht geladen werden.');
     const bytes=new Uint8Array(await response.arrayBuffer());if(bytes.length!==pack.bytes||await digest(bytes)!==pack.sha256)throw Error('Prüfsumme der Archivstrecke stimmt nicht.');return bytes;
    })();packs.set(entry.pack,promise);while(packs.size>2)packs.delete(packs.keys().next().value);
    promise.catch(()=>{if(packs.get(entry.pack)===promise)packs.delete(entry.pack);});
   }
   const bytes=(await promise).slice(entry.offset,entry.offset+1802);
   if(await digest(bytes)!==entry.id)throw Error('Prüfsumme der Archivstrecke stimmt nicht.');
   return Array.from(bytes);
  },
  cachedPacks(){return packs.size;},
 };
}
