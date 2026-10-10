import {createCommunityLibrary,filterCommunityTracks} from './community-library.js';
import {tr} from './i18n.js';
import {BY_ID,index} from './core.js';
import {terrainTileIcon} from './terrain.js';
import {connectedTileIcon} from './map-art.js';
import {trackConnections} from './connections.js';
const libraryEscape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const communityLibrary=createCommunityLibrary(new URL('community-tracks/',typeof location==='undefined'?'http://localhost/':location.href));

export function communityMapPreview(raw){
 const ports=new Map();for(const p of trackConnections(raw).ports){const key=p.anchor.join(',');if(!ports.has(key))ports.set(key,[]);ports.get(key).push(p);}
 let ground='',pieces='';
 for(let y=0;y<30;y++)for(let x=0;x<30;x++){
  ground+=`<svg x="${x*64}" y="${y*64}" width="64" height="64" viewBox="0 0 64 64">${terrainTileIcon(raw[901+y*30+x]).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg>`;
  const id=raw[index(x,y)],tile=BY_ID.get(id);
  if(tile&&id)pieces+=`<svg x="${x*64}" y="${y*64}" width="${tile.width*64}" height="${tile.height*64}" viewBox="0 0 ${tile.width*64} ${tile.height*64}">${connectedTileIcon(tile,ports.get(`${x},${y}`)||[]).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg>`;
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1920" role="img" aria-label="${tr('Streckenvorschau')}">${ground}${pieces}</svg>`;
}

export async function openCommunityLibrary(openDialog,onLoad){
 openDialog('Streckenbibliothek',`<p>${tr('Streckenbibliothek wird geladen…')}</p>`);
 const dialog=document.getElementById('dialog'),content=document.getElementById('dialog-content');
 dialog.classList.add('library-dialog');
 let closed=false,revision=0,selected=null,selectedRaw=null,page=0;
 dialog.addEventListener('close',()=>{closed=true;revision++;},{once:true});
 const current=()=>!closed&&dialog.open&&dialog.classList.contains('library-dialog');
 try{
  const catalog=await communityLibrary.catalog();if(!current())return;
  const tracks=[...catalog.tracks].sort((a,b)=>a.title.localeCompare(b.title,undefined,{numeric:true})||a.name.localeCompare(b.name));
  const collections=[...new Set(tracks.flatMap(t=>t.collections))].sort((a,b)=>a.localeCompare(b));
  content.innerHTML=`<p class="library-note">${tr('Archivstrecken werden nur als Editor-Entwurf geladen. Im Spiel musst du sie anschließend selbst speichern.')}</p><div class="library-filters"><label>${tr('Strecke suchen')}<input id="library-search" type="search" placeholder="${tr('Name, Autor oder Sammlung')}" autocomplete="off"></label><label>${tr('Sammlung')}<select id="library-collection"><option value="">${tr('Alle Sammlungen')}</option>${collections.map(c=>`<option value="${libraryEscape(c)}">${libraryEscape(c)}</option>`).join('')}</select></label><label>${tr('Spielprüfung')}<select id="library-state"><option value="all">${tr('Alle Strecken')}</option><option value="valid">${tr('Spielprüfung bestanden')}</option><option value="repair">${tr('Reparatur nötig')}</option></select></label></div><div class="library-layout"><section class="library-browser"><output id="library-count" role="status"></output><div id="library-list" role="group" aria-label="${tr('Archivstrecken')}"></div><nav class="library-pages" aria-label="${tr('Seiten')}" ><button id="library-prev">${tr('Zurück')}</button><output id="library-page"></output><button id="library-next">${tr('Weiter')}</button></nav></section><section id="library-detail" class="library-detail"><p>${tr('Wähle eine Strecke für die Vorschau.')}</p></section></div><div class="library-actions"><button id="library-load" class="primary" disabled>${tr('In den Editor laden')}</button><a href="https://archive.org/details/hugestuntstrackarchive" target="_blank" rel="noopener noreferrer">${tr('Quelle: Internet Archive')}</a></div>`;
  const el=id=>document.getElementById(id);
  let filtered=tracks;
  function drawList(){
   const pages=Math.max(1,Math.ceil(filtered.length/40));page=Math.max(0,Math.min(page,pages-1));
   el('library-count').textContent=tr('{count} Treffer · {total} Strecken',{count:filtered.length,total:tracks.length});
   el('library-list').innerHTML=filtered.slice(page*40,(page+1)*40).map(entry=>`<button class="library-track" data-track="${entry.id}" aria-pressed="${selected?.id===entry.id}"><strong>${libraryEscape(entry.title)}</strong><span>${libraryEscape(entry.collections.join(' · '))}</span><small class="${entry.valid?'library-valid':'library-repair'}">${tr(entry.valid?'Spielprüfung bestanden':'Reparatur nötig')}</small></button>`).join('')||`<p>${tr('Keine passenden Strecken.')}</p>`;
   el('library-page').textContent=tr('Seite {page} von {pages}',{page:page+1,pages});el('library-prev').disabled=page===0;el('library-next').disabled=page>=pages-1;
  }
  async function select(entry){
   const token=++revision;selected=entry;selectedRaw=null;el('library-load').disabled=true;drawList();
   el('library-detail').innerHTML=`<h3>${libraryEscape(entry.title)}</h3><p>${tr('Streckenvorschau wird geladen…')}</p>`;
   try{
    const bytes=await communityLibrary.read(entry.id);if(!current()||token!==revision)return;
    selectedRaw=bytes;const authors=[...new Set(entry.sources.map(s=>s.author).filter(Boolean))];
    el('library-detail').innerHTML=`<h3>${libraryEscape(entry.title)}</h3><img class="library-preview" src="data:image/svg+xml,${encodeURIComponent(communityMapPreview(bytes))}" alt="${tr('Streckenvorschau')}"><p class="${entry.valid?'library-valid':'library-repair'}">${tr(entry.valid?'Spielprüfung bestanden':'Reparatur nötig')}</p>${entry.problem?`<p>${libraryEscape(tr(entry.problem.message))}${entry.problem.location?` · X ${entry.problem.location[0]+1}, Y ${entry.problem.location[1]+1}`:''}</p>`:''}${authors.length?`<p>${tr('Autor')}: ${libraryEscape(authors.join(', '))}</p>`:''}<p>${tr('Spielname: {name}.TRK',{name:entry.name})}</p><details><summary>${tr('Herkunft · {count} Fundstellen',{count:entry.sources.length})}</summary><ul>${entry.sources.map(s=>`<li>${libraryEscape(s.path)}</li>`).join('')}</ul></details>`;
    el('library-load').disabled=false;
   }catch(error){if(current()&&token===revision)el('library-detail').textContent=tr(error.message);}
  }
  function filter(){
   filtered=filterCommunityTracks(tracks,{query:el('library-search').value,collection:el('library-collection').value,state:el('library-state').value});page=0;
   if(selected&&!filtered.some(t=>t.id===selected.id)){revision++;selected=null;selectedRaw=null;el('library-load').disabled=true;el('library-detail').textContent=tr('Wähle eine Strecke für die Vorschau.');}
   drawList();
  }
  el('library-search').oninput=filter;el('library-collection').onchange=filter;el('library-state').onchange=filter;
  el('library-list').onclick=event=>{const button=event.target.closest('button[data-track]');if(button)select(catalog.tracks.find(t=>t.id===button.dataset.track));};
  el('library-prev').onclick=()=>{page--;drawList();};el('library-next').onclick=()=>{page++;drawList();};
  el('library-load').onclick=()=>{if(!selectedRaw||!current())return;const bytes=[...selectedRaw],entry=selected;dialog.close();onLoad(bytes,entry);};
  drawList();el('library-search').focus();
 }catch(error){if(current())content.innerHTML=`<p>${libraryEscape(tr(error.message))}</p><p>${tr('Die Bibliothek benötigt die mitgelieferten Dateien und einen lokalen Webserver. In der macOS-App ist sie direkt verfügbar.')}</p>`;}
}
