import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {checkTrack} from '../src/validation.js';
const root=new URL('../vendor/community-tracks/',import.meta.url);
const catalog=JSON.parse(readFileSync(new URL('catalog.json',root),'utf8'));
const packs=new Map(catalog.packs.map(p=>{
 const bytes=readFileSync(new URL(p.file,root));
 if(bytes.length!==p.bytes||createHash('sha256').update(bytes).digest('hex')!==p.sha256)throw Error('Pack checksum mismatch: '+p.file);
 return [p.file,bytes];
}));
let valid=0,failed=0;
for(const entry of catalog.tracks){
 const raw=Array.from(packs.get(entry.pack).subarray(entry.offset,entry.offset+1802));
 if(raw.length!==1802||createHash('sha256').update(Uint8Array.from(raw)).digest('hex')!==entry.id)throw Error('Track checksum mismatch: '+entry.name);
 const checked=checkTrack(raw);entry.valid=checked.valid;entry.adjusted=checked.adjusted;
 entry.problem=checked.errors[0]??null;
 if(checked.valid)valid++;else failed++;
}
catalog.provenance.validation={valid,needsRepair:failed,engine:'Same native route and structure check used by the web editor. This does not guarantee a clean opponent lap.'};
writeFileSync(new URL('catalog.json',root),JSON.stringify(catalog)+'\n');
console.log(JSON.stringify({tracks:catalog.tracks.length,valid,needsRepair:failed,packs:packs.size}));
