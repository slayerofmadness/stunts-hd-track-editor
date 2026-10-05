import { tr, LANGUAGES, LANGUAGE_KEY, chooseLanguage, setLanguage, getLanguage, normalizeSearch, pieceName } from './i18n.js';
import { terrainTileIcon, terrainSymbols, terrainPreview } from './terrain.js';
import { classicTileIcon } from './graphics.js';
import { CATALOG, BY_ID, TERRAIN, COLORS, TERRAIN_PRESETS, applyTerrainPreset, index, blank, decode, encode, safeName, cells, place, rotate, inspect, demo, owner } from './core.js';
const $=id=>document.getElementById(id);
let languagePreference='auto',currentStatus={key:'Bereit',values:{}},draftStatus='Entwurf nur in diesem Browser';
try{const saved=localStorage.getItem(LANGUAGE_KEY);if(saved==='auto'||Object.hasOwn(LANGUAGES,saved))languagePreference=saved;}catch{}
setLanguage(chooseLanguage(languagePreference,navigator.languages?.length?navigator.languages:[navigator.language]));
function localizeStatic(){
 document.documentElement.lang=getLanguage();
 for(const el of document.querySelectorAll('[data-i18n]'))el.textContent=tr(el.dataset.i18n);
 for(const attr of ['aria-label','title','placeholder','content'])for(const el of document.querySelectorAll(`[data-i18n-${attr}]`))el.setAttribute(attr,tr(el.getAttribute(`data-i18n-${attr}`)));
 $('language').value=languagePreference;
 $('language').querySelector('[value="auto"]').textContent=tr('Automatisch ({language})',{language:LANGUAGES[getLanguage()]});
}
function terrainName(id){return TERRAIN[id]===undefined?tr('Gelände {id}',{id}):tr(TERRAIN[id]);}
function presetName(id){return tr('Terrain {number}',{number:id+1});}
function setDraftStatus(key){draftStatus=key;$('draft-status').textContent=tr(key);}
localizeStatic();
const DRAFT_KEY='stunts-hd-draft-v1', VERSIONS_KEY='stunts-hd-versions-v1';
let raw=demo(),piece=4,layer='track',category='Alle',cursor=[8,13],zoom=1,undo=[],redo=[],stroke=null,panMode=false,panDrag=null,versions=[],storageAvailable=true;
let cursorCells=[],lastPointerPosition=null;
let restored=false,storageError=false;
try {const saved=JSON.parse(localStorage.getItem(DRAFT_KEY)||'null');if(saved){raw=decode(saved.raw);$('name').value=safeName(saved.name);restored=true;}
 const savedVersions=JSON.parse(localStorage.getItem(VERSIONS_KEY)||'[]');if(Array.isArray(savedVersions))versions=savedVersions.filter(v=>{try{decode(v.raw);return typeof v.name==='string'&&typeof v.date==='string';}catch{return false;}}).slice(0,10);
}catch {storageError=true;}
function persist(){try{localStorage.setItem(DRAFT_KEY,JSON.stringify(snapshot()));setDraftStatus('Automatisch in diesem Browser gespeichert');storageAvailable=true;return true;}catch{setDraftStatus('Browsersicherung nicht verfügbar · TRK exportieren');storageAvailable=false;return false;}}
function escapeText(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function renderVersions(){$('drafts').innerHTML=`<option value="">${tr('Sicherung laden…')}</option>`+versions.map((v,i)=>`<option value="${i}">${escapeText(v.name)} · ${escapeText(new Date(v.date).toLocaleString(getLanguage()))}</option>`).join('');$('drafts').disabled=!versions.length;}
function complete(before,message,values={}){remember(before);render();persist();if(message)status(message,values);}
function openDialog(title,html){$('dialog').classList.remove('terrain-dialog');$('dialog-title').textContent=tr(title);$('dialog-content').innerHTML=html;$('dialog').showModal();}

function icon(t,view='palette'){return classicTileIcon(t,view);}
function rampHint(t){return ['sra','ssr','sbr'].includes(t?.family)?tr('Hohes Ende: {direction}',{direction:tr(['Nord','Ost','Süd','West'][t.rotation])}):'';}
function pieceHint(t){return t?.variant==='rdup'?tr('Normale Asphaltstraße auf einem Gelände-Hang (Original-IDs 182–185).'):rampHint(t);}
function rotateSelection(){
 if(layer!=='track'){status('Gelände wird nicht gedreht.');return;}
 const next=rotate(piece);if(next===piece){status('Dieses Bauteil hat keine weitere Ausrichtung.');return;}
 piece=next;palette();status('{piece} · Ausrichtung {angle}°',{pieceId:piece,angle:BY_ID.get(piece).rotation*90});
}
function status(key,values={}){
 currentStatus={key,values};const resolved={...values};
 if(Number.isInteger(values.pieceId))resolved.piece=pieceName(BY_ID.get(values.pieceId));
 if(Number.isInteger(values.terrainId))resolved.piece=terrainName(values.terrainId);
 if(Number.isInteger(values.presetId)){resolved.preset=presetName(values.presetId);resolved.mode=tr(values.clearTrack?'neue Strecke':'Bauteile erhalten');}
 $('status').textContent=tr(key,resolved);
}
function snapshot(){return {raw:[...raw],name:$('name').value};}
function remember(before){if(before.raw.every((n,i)=>n===raw[i])&&before.name===$('name').value)return;undo.push(before);if(undo.length>100)undo.shift();redo=[];}
function renderCursor(){
 const board=$('board'),overlay=$('board-cursor');if(!overlay)return;
 for(const cell of cursorCells)cell.setAttribute('aria-selected','false');cursorCells=[];
 overlay.innerHTML='';if(panMode)return;
 const id=stroke?.id??piece,t=layer==='track'?BY_ID.get(id):{width:1,height:1};if(!t)return;
 const [x,y]=cursor,width=t.width*48,height=t.height*48,valid=x+t.width<=30&&y+t.height<=30;
 const targets=cells(t,x,y).filter(([cx,cy])=>cx<30&&cy<30);
 let ground='';for(const [cx,cy]of targets){
  const cell=board.children[cy*30+cx],land=raw[901+cy*30+cx];cell.setAttribute('aria-selected','true');cursorCells.push(cell);
  ground+=`<rect x="${cx*48}" y="${cy*48}" width="48" height="48" fill="${COLORS[land]||'#986578'}"/>`;
  if(land>0&&land<TERRAIN.length)ground+=`<use href="#map-terrain-${land}" x="${cx*48}" y="${cy*48}" width="48" height="48"/>`;
 }
 const graphic=(layer==='track'?icon(t,'map'):terrainTileIcon(id)).replace(/^<svg[^>]*>|<\/svg>$/g,'');
 overlay.dataset.id=id;overlay.dataset.width=t.width;overlay.dataset.height=t.height;overlay.dataset.valid=valid;
 overlay.innerHTML=`<g clip-path="url(#cursor-map-bounds)"><g opacity=".9">${ground}<svg class="cursor-piece" x="${x*48}" y="${y*48}" width="${width}" height="${height}" viewBox="0 0 ${t.width*64} ${t.height*64}">${graphic}</svg></g><rect class="cursor-frame" x="${x*48+1}" y="${y*48+1}" width="${width-2}" height="${height-2}" fill="none" stroke="${valid?'#fff47a':'#fc5454'}" stroke-width="2" vector-effect="non-scaling-stroke"/></g>`;
}
function moveCursor(position){if(position.some((n,i)=>n!==cursor[i])){cursor=position;renderCursor();}}
function render(){
 const board=$('board');let drawings='',grounds=terrainSymbols('map-terrain');
 if(!board.children.length){for(let i=0;i<900;i++){const c=document.createElement('button');c.className='cell';c.setAttribute('role','gridcell');c.tabIndex=-1;c.dataset.x=i%30;c.dataset.y=Math.floor(i/30);board.append(c);}board.insertAdjacentHTML('beforeend','<svg viewBox="0 0 1440 1440" aria-hidden="true"></svg>');}
 $('landscape').innerHTML=Array.from({length:5},(_,i)=>`<option value="${i}">${tr(['Wüste','Tropen','Alpen','Stadt','Land'][i])}</option>`).join('')+(raw[900]>4?`<option value="${raw[900]}">${tr('Originalwert {value}',{value:raw[900]})}</option>`:'');$('landscape').value=raw[900];
 for(let y=0;y<30;y++)for(let x=0;x<30;x++) {
  const id=raw[index(x,y)],land=raw[901+y*30+x],t=BY_ID.get(id),cell=board.children[y*30+x];cell.setAttribute('aria-label',`X ${x+1}, Y ${y+1}: ${id===0?tr('Leer'):t?pieceName(t):(id>=253?tr('Fortsetzung'):tr('Bauteil {id}',{id}))}, ${terrainName(land)}`);cell.setAttribute('aria-selected','false');cell.style.background=COLORS[land]||'#986578';cell.style.backgroundImage='none';
  if(land>0&&land<TERRAIN.length)grounds+=`<use href="#map-terrain-${land}" x="${x*48}" y="${y*48}" width="48" height="48"/>`;
  if(t&&id)drawings+=`<svg x="${x*48}" y="${y*48}" width="${t.width*48}" height="${t.height*48}" viewBox="0 0 ${t.width*64} ${t.height*64}">${icon(t,'map').replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg>`;
  else if(id&&id<253)drawings+=`<text x="${x*48+24}" y="${y*48+30}" text-anchor="middle" fill="#fff" font-size="20">${id}</text>`;
 }
 board.lastElementChild.innerHTML=`<defs><clipPath id="cursor-map-bounds"><rect width="1440" height="1440"/></clipPath></defs><g id="map-content">${grounds+drawings}</g><g id="board-cursor"></g>`;renderCursor();
 const details=inspect(raw);$('stats').textContent=tr('{count} Bauteile · 1.802 Bytes',{count:details.tiles});$('undo').disabled=!undo.length;$('redo').disabled=!redo.length;fit();
}
function palette(){
 const query=normalizeSearch($('search').value),items=layer==='track'?CATALOG.filter(t=>(category==='Alle'||t.category===category)&&(normalizeSearch(`${pieceName(t)} ${t.name} ${t.id}`).includes(query))):TERRAIN.map((name,id)=>({id,name:tr(name)})).filter(t=>(normalizeSearch(`${pieceName(t)} ${t.name} ${t.id}`).includes(query)));
 $('palette').innerHTML=items.map(t=>`<button class="piece${rampHint(t)?' ramp-piece':''}" data-id="${t.id}" aria-pressed="${t.id===piece}" title="${layer==='track'?pieceName(t):t.name} · ID ${t.id}">${layer==='track'?icon(t):terrainTileIcon(t.id)}<span>${layer==='track'?pieceName(t):t.name}</span><small>ID ${t.id}${t.width?` · ${t.width} × ${t.height}`:''}</small>${layer==='track'&&['sra','ssr','sbr'].includes(t.family)?`<small class="view-hint">${tr('Seitenansicht')}</small>`:''}${layer==='track'&&pieceHint(t)?`<small class="ramp-hint">${pieceHint(t)}</small>`:''}</button>`).join('')||`<p>${tr('Keine passenden Bauteile.')}</p>`;
 const t=BY_ID.get(piece);$('selected-icon').innerHTML=layer==='track'?icon(t):terrainTileIcon(piece);$('selected-icon').style.background=layer==='terrain'?COLORS[piece]:COLORS[0];$('selected-name').textContent=layer==='track'?pieceName(t):terrainName(piece);$('selected-meta').textContent=layer==='track'?`ID ${piece} · ${t.width} × ${t.height} · ${t.rotation*90}°${pieceHint(t)?` · ${pieceHint(t)}`:''}`:tr('Gelände {id}',{id:piece});$('rotate').disabled=layer==='terrain'||rotate(piece)===piece;
 renderCursor();
}
function fit(){const rect=$('map-scroll').getBoundingClientRect(),size=Math.max(280,Math.min(rect.width-24,rect.height-20))*zoom;$('board').style.width=`${size}px`;$('zoom-value').textContent=`${Math.round(zoom*100)} %`;}
function paint(x,y,id=piece){try{const next=place(raw,x,y,id,layer);if(next.some((n,i)=>n!==raw[i])){raw=next;cursor=[x,y];render();}status('X {x}, Y {y} · {piece}',{x:x+1,y:y+1,...(layer==='track'?{pieceId:id}:{terrainId:id})});}catch(e){status(e.translation?.key??e.message,e.translation?.values);}}
function history(forward){const from=forward?redo:undo,to=forward?undo:redo;if(!from.length)return;to.push(snapshot());const next=from.pop();raw=next.raw;$('name').value=next.name;render();persist();status(forward?'Änderung wiederholt.':'Änderung rückgängig gemacht.');}
$('palette').onclick=e=>{const button=e.target.closest('[data-id]');if(button){piece=Number(button.dataset.id);palette();}};
$('filters').onclick=e=>{const b=e.target.closest('[data-category]');if(b){category=b.dataset.category;for(const el of $('filters').children)el.setAttribute('aria-pressed',String(el===b));palette();}};
$('search').oninput=palette;$('rotate').onclick=rotateSelection;
for(const mode of ['track','terrain'])$(mode+'-layer').onclick=()=>{layer=mode;piece=mode==='track'?4:0;for(const m of ['track','terrain'])$(m+'-layer').setAttribute('aria-pressed',String(m===mode));$('filters').hidden=mode==='terrain';palette();};
$('board').oncontextmenu=e=>e.preventDefault();
function point(e){const rect=$('board').getBoundingClientRect(),x=Math.floor((e.clientX-rect.left)/rect.width*30),y=Math.floor((e.clientY-rect.top)/rect.height*30);return x>=0&&y>=0&&x<30&&y<30?[x,y]:null;}
function continueStroke(e){if(panDrag){$('map-scroll').scrollLeft=panDrag.left+panDrag.x-e.clientX;$('map-scroll').scrollTop=panDrag.top+panDrag.y-e.clientY;return;}if(panMode)return;const moved=!lastPointerPosition||lastPointerPosition[0]!==e.clientX||lastPointerPosition[1]!==e.clientY;lastPointerPosition=[e.clientX,e.clientY];if(!stroke&&!moved)return;const p=point(e);if(!p)return;moveCursor(p);if(!stroke)return;if(stroke.last&&p.every((n,i)=>n===stroke.last[i]))return;
 const t=BY_ID.get(stroke.id),interpolate=stroke.last&&(layer==='terrain'||t?.width===1&&t?.height===1),from=interpolate?stroke.last:p,steps=Math.max(Math.abs(p[0]-from[0]),Math.abs(p[1]-from[1]));
 for(let i=interpolate?1:0;i<=steps;i++){const amount=steps?i/steps:0;paint(Math.round(from[0]+(p[0]-from[0])*amount),Math.round(from[1]+(p[1]-from[1])*amount),stroke.id);}stroke.last=p;}
function finishStroke(){panDrag=null;if(stroke){const before=stroke.before;stroke=null;complete(before);}}
$('board').onpointerdown=e=>{if(![0,2].includes(e.button))return;const p=point(e);if(!p)return;e.preventDefault();$('board').focus({preventScroll:true});if(e.button===2&&!e.shiftKey){finishStroke();cursor=p;rotateSelection();renderCursor();return;}if(panMode){panDrag={x:e.clientX,y:e.clientY,left:$('map-scroll').scrollLeft,top:$('map-scroll').scrollTop};$('board').setPointerCapture(e.pointerId);return;}if(e.altKey&&layer==='track'){const [ax,ay]=owner(raw,...p),id=raw[index(ax,ay)];if(BY_ID.has(id)){piece=id;cursor=[ax,ay];palette();status('Bauteil von der Karte übernommen.');}return;}stroke={before:snapshot(),id:e.button===2?0:piece,last:null};renderCursor();$('board').setPointerCapture(e.pointerId);continueStroke(e);};
$('board').onpointermove=continueStroke;
window.addEventListener('pointerup',finishStroke);window.addEventListener('pointercancel',finishStroke);window.addEventListener('blur',finishStroke);
$('pan').onclick=()=>{panMode=!panMode;$('pan').setAttribute('aria-pressed',String(panMode));$('board').style.cursor=panMode?'grab':'crosshair';renderCursor();status(panMode?'Karte ziehen zum Verschieben.':'Zeichenmodus.');};
$('undo').onclick=()=>history(false);$('redo').onclick=()=>history(true);$('zoom-in').onclick=()=>{zoom=Math.min(4,zoom+.25);fit();};$('zoom-out').onclick=()=>{zoom=Math.max(.5,zoom-.25);fit();};$('fit').onclick=()=>{zoom=1;fit();};new ResizeObserver(fit).observe($('map-scroll'));
$('import').onclick=()=>$('file').click();$('file').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const next=decode(new Uint8Array(await f.arrayBuffer())),before=snapshot();raw=next;$('name').value=safeName(f.name);complete(before,'{file} geöffnet.',{file:f.name});}catch(e){status(e.translation?.key??e.message,e.translation?.values);}finally{$('file').value='';}};
let lastExportUrl=null;
$('export').onclick=()=>{const name=safeName($('name').value);$('name').value=name;const url=URL.createObjectURL(new Blob([encode(raw)],{type:'application/octet-stream'})),a=document.createElement('a');a.href=url;a.download=name+'.TRK';document.body.append(a);a.click();a.remove();if(lastExportUrl)URL.revokeObjectURL(lastExportUrl);lastExportUrl=url;$('last-export').href=url;$('last-export').download=name+'.TRK';$('last-export').textContent=name+'.TRK';$('last-export').hidden=false;persist();status('{file} exportiert · 1.802 Bytes.',{file:name+'.TRK'});};
$('board').onkeydown=e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' ','Delete','Backspace'].includes(e.key))e.preventDefault();const delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(delta)moveCursor(cursor.map((n,i)=>Math.max(0,Math.min(29,n+delta[i]))));if([' ','Delete','Backspace'].includes(e.key)){const before=snapshot();paint(...cursor,e.key===' '?piece:0);complete(before);}};
document.addEventListener('keydown',e=>{if(e.target.matches('input,select,textarea'))return;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();history(e.shiftKey);}else if(e.key.toLowerCase()==='r'&&layer==='track')$('rotate').click();});
$('name').oninput=()=>{$('name').value=$('name').value.toUpperCase().replace(/[^A-Z0-9_-]/g,'');persist();};
$('landscape').onchange=()=>{const before=snapshot();raw=[...raw];raw[900]=Number($('landscape').value);complete(before,'Horizont-Landschaft geändert.');};
$('new').onclick=()=>{const before=snapshot();raw=blank();$('name').value='HDTRACK';complete(before,'Leere Strecke · mit Rückgängig zurück zum bisherigen Entwurf.');};
$('example').onclick=()=>{const before=snapshot();raw=demo();$('name').value='DEMO';complete(before,'Beispielstrecke geladen · bisherige Strecke bleibt in Rückgängig.');};

function applyPreset(id,clearTrack=false){
 const before=snapshot(),next=applyTerrainPreset(raw,id,clearTrack);raw=next;
 if(clearTrack)$('name').value=`TERRAIN${id+1}`;
 complete(before,'{preset} angewendet · {mode} · mit Rückgängig zurück.',{presetId:id,clearTrack});
}
$('terrain-presets').onclick=()=>{
 let selected=0;
 openDialog('Originale Terrain-Vorlagen',`<p class="muted">${tr('Die fünf Gelände aus dem originalen Stunts-Editor. Wähle eine Vorlage; die Vorschau zeigt Norden oben.')}</p><div class="terrain-presets">${TERRAIN_PRESETS.map(p=>`<button class="terrain-preset" data-preset="${p.id}" aria-label="${presetName(p.id)} · ${tr(p.description)}" aria-pressed="${p.id===selected}">${terrainPreview(p)}<strong>${presetName(p.id)}</strong><span>${tr(p.description)}</span></button>`).join('')}</div><p id="preset-selection">${presetName(0)} · ${tr(TERRAIN_PRESETS[0].description)}</p><p class="muted terrain-note">${tr('„Nur Gelände anwenden“ erhält alle Bauteile. „Neue Strecke damit“ entfernt alle Bauteile. Beide Aktionen lassen sich rückgängig machen; den Horizont behältst du bei.')}</p><div class="terrain-actions"><button id="apply-terrain" class="primary">${tr('Nur Gelände anwenden')}</button><button id="new-terrain-track">${tr('Neue Strecke damit')}</button></div>`);
 $('dialog').classList.add('terrain-dialog');
 $('dialog-content').querySelector('.terrain-presets').onclick=e=>{
  const button=e.target.closest('[data-preset]');if(!button)return;
  selected=Number(button.dataset.preset);
  for(const b of $('dialog-content').querySelectorAll('[data-preset]'))b.setAttribute('aria-pressed',String(Number(b.dataset.preset)===selected));
  $('preset-selection').textContent=`${presetName(selected)} · ${tr(TERRAIN_PRESETS[selected].description)}`;
 };
 $('apply-terrain').onclick=()=>{applyPreset(selected);$('dialog').close();};
 $('new-terrain-track').onclick=()=>{applyPreset(selected,true);$('dialog').close();};
};

$('save-draft').onclick=()=>{const next=[{...snapshot(),name:safeName($('name').value),date:new Date().toISOString()},...versions].slice(0,10);try{localStorage.setItem(VERSIONS_KEY,JSON.stringify(next));versions=next;renderVersions();persist();status('Entwurf gesichert · die letzten zehn Sicherungen bleiben erhalten.');}catch{status('Sicherung fehlgeschlagen. Bitte die Strecke als TRK exportieren.');}};
$('drafts').onchange=()=>{if($('drafts').value==='')return;const v=versions[Number($('drafts').value)];if(!v)return;const before=snapshot();raw=decode(v.raw);$('name').value=safeName(v.name);complete(before,'Sicherung geladen · bisheriger Entwurf bleibt in Rückgängig.');$('drafts').value='';};
$('check').onclick=()=>{const result=inspect(raw);openDialog('Strecke prüfen',`<p>${tr(result.issues.length?'Die Strukturprüfung hat Hinweise gefunden.':'Start/Ziel und Mehrfeld-Bauteile sind strukturell korrekt.')}</p>${result.issues.length?'<ul>'+result.issues.map(i=>'<li>'+escapeText(i)+'</li>').join('')+'</ul>':''}<p class="muted">${tr('Diese Prüfung kontrolliert Dateistruktur, Bauteilgrenzen und Fortsetzungsfelder. Den vollständigen Streckenverlauf und die Befahrbarkeit prüfst du im Spiel.')}</p>`);};
const helpParagraphs=[
 'Wähle ein Bauteil und zeichne auf der Karte. Rechtsklick oder R dreht die Auswahl zur nächsten verfügbaren Ausrichtung. Umschalt + Rechtsklick oder der Radierer entfernt ganze Bauteile. Mit Alt + Klick übernimmst du ein Bauteil von der Karte.',
 'Pfeiltasten bewegen das markierte Feld. Leertaste platziert, Entf radiert. Strg/⌘ Z nimmt einen Zeichenstrich zurück; mit Umschalt wiederholst du ihn.',
 '„Terrain-Vorlagen“ enthält die fünf Original-Gelände mit Vorschau. Wende nur das Gelände auf deine Strecke an oder beginne eine neue Strecke damit; Rückgängig stellt den bisherigen Entwurf wieder her.',
 'Auf dem Handy kannst du zeichnen oder mit „Verschieben“ die vergrößerte Karte ziehen. Einpassen zeigt die gesamte Strecke.',
 'Entwürfe werden lokal in diesem Browser gespeichert. Exportiere eine .TRK, um sie im Spiel zu benutzen oder dauerhaft aufzubewahren. Originaldateien werden beim Import nicht verändert. Mehrfeld-Bauteile brauchen den angegebenen Platz.',
 'Die Karte bleibt in fester Draufsicht. Brücke und Rampen zeigen in der Palette eine Seitenansicht; der Pfeil zeigt ihre Richtung auf der Karte. Die Symbole sind als scharfe Vektorgrafiken nach dem Original neu gezeichnet.'
];
$('help').onclick=()=>openDialog('So baust du deine Strecke',helpParagraphs.map(key=>`<p>${escapeText(tr(key))}</p>`).join(''));
function refreshLanguage(){
 const previous=getLanguage();setLanguage(chooseLanguage(languagePreference,navigator.languages?.length?navigator.languages:[navigator.language]));
 localizeStatic();render();palette();renderVersions();setDraftStatus(draftStatus);
 status(currentStatus.key,currentStatus.values);
 if($('dialog').open&&previous!==getLanguage())$('dialog').close();
}
$('language').onchange=()=>{finishStroke();languagePreference=$('language').value;try{localStorage.setItem(LANGUAGE_KEY,languagePreference);}catch{}refreshLanguage();};
window.addEventListener('languagechange',()=>{if(languagePreference==='auto')refreshLanguage();});
$('close-dialog').onclick=()=>$('dialog').close();$('dialog').addEventListener('click',e=>{if(e.target===$('dialog'))$('dialog').close();});
render();palette();renderVersions();
if(restored){setDraftStatus('Lokalen Entwurf wiederhergestellt');status('Letzten Entwurf aus diesem Browser wiederhergestellt.');}else status(storageError?'Gesicherter Entwurf nicht lesbar · Beispiel geöffnet.':'Beispielstrecke · eigene TRK öffnen oder direkt weiterbauen.');


// Optional browser-native tools use exactly the same model and history as the UI.
const modelContext=document.modelContext;
if(modelContext?.registerTool){
 const lifetime=new AbortController();window.addEventListener('pagehide',()=>lifetime.abort(),{once:true});
 function object(input,keys){if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!keys.includes(k)))throw Error('Invalid tool input.');return input;}
 const summary=()=>({name:safeName($('name').value),landscape:raw[900],...inspect(raw)});
 const tools=[
 {name:'read_track',description:'Read the visible track summary and optionally selected cells. Coordinates are zero-based.',inputSchema:{type:'object',properties:{cells:{type:'array',maxItems:100,items:{type:'object',properties:{x:{type:'integer',minimum:0,maximum:29},y:{type:'integer',minimum:0,maximum:29}},required:['x','y'],additionalProperties:false}}},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:true},execute(input){const v=object(input,['cells']);if(v.cells!==undefined&&(!Array.isArray(v.cells)||v.cells.length>100))throw Error('Invalid cells.');const selected=(v.cells||[]).map(c=>{object(c,['x','y']);if(!Number.isInteger(c.x)||!Number.isInteger(c.y)||c.x<0||c.x>29||c.y<0||c.y>29)throw Error('Invalid coordinates.');return {...c,id:raw[index(c.x,c.y)],terrain:raw[901+c.y*30+c.x]};});return {...summary(),cells:selected};}},
 {name:'list_track_pieces',description:'Find track pieces by current interface language, German name or exact numeric identifier. Read-only.',inputSchema:{type:'object',properties:{query:{type:'string',maxLength:100}},additionalProperties:false},annotations:{readOnlyHint:true},execute(input){const v=object(input,['query']);if(v.query!==undefined&&(typeof v.query!=='string'||v.query.length>100))throw Error('Invalid query.');const q=normalizeSearch(v.query||'');return CATALOG.filter(t=>/^\d+$/.test(q)?t.id===Number(q):normalizeSearch(`${pieceName(t)} ${t.name}`).includes(q)).map(p=>({id:p.id,name:pieceName(p),width:p.width,height:p.height,degrees:p.rotation*90}));}},
 {name:'place_track_pieces',description:'Place a batch of tiles or terrain on the visible track as one undoable edit. Coordinates are zero-based. Existing overlapping pieces are replaced completely.',inputSchema:{type:'object',properties:{layer:{type:'string',enum:['track','terrain']},placements:{type:'array',minItems:1,maxItems:100,items:{type:'object',properties:{x:{type:'integer',minimum:0,maximum:29},y:{type:'integer',minimum:0,maximum:29},id:{type:'integer',minimum:0,maximum:252}},required:['x','y','id'],additionalProperties:false}}},required:['placements'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){const v=object(input,['layer','placements']);if(!Array.isArray(v.placements)||v.placements.length<1||v.placements.length>100)throw Error('One to 100 placements required.');if(v.layer!==undefined&&!['track','terrain'].includes(v.layer))throw Error('Invalid layer.');let next=[...raw];for(const p of v.placements){object(p,['x','y','id']);next=place(next,p.x,p.y,p.id,v.layer||'track');}const before=snapshot();raw=next;cursor=[v.placements.at(-1).x,v.placements.at(-1).y];complete(before,'Bauteile platziert.');return summary();}},
 {name:'list_terrain_presets',description:'List the five original Stunts terrain presets. IDs are zero-based.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute(input){object(input,[]);return TERRAIN_PRESETS.map(p=>({id:p.id,name:presetName(p.id),description:tr(p.description)}));}},
 {name:'apply_terrain_preset',description:'Apply an original terrain preset as one undoable edit. terrain preserves all track pieces; new_track clears all track pieces. Both preserve horizon and trailing metadata.',inputSchema:{type:'object',properties:{id:{type:'integer',minimum:0,maximum:4},mode:{type:'string',enum:['terrain','new_track']}},required:['id'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){const v=object(input,['id','mode']);if(v.mode!==undefined&&!['terrain','new_track'].includes(v.mode))throw Error('Invalid mode.');applyPreset(v.id,v.mode==='new_track');return summary();}},
 {name:'undo_track_edit' ,description:'Undo the most recent edit in the visible track and update its browser draft.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false},execute(input){object(input,[]);if(!undo.length)throw Error('No edit to undo.');history(false);return summary();}}
 ];
 for(const tool of tools){try{Promise.resolve(modelContext.registerTool(tool,{signal:lifetime.signal})).catch(()=>{});}catch{}}
}
