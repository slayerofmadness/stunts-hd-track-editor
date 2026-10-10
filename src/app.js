import {openCommunityLibrary} from './library-ui.js';
import { tr, LANGUAGES, LANGUAGE_KEY, chooseLanguage, setLanguage, getLanguage, normalizeSearch, pieceName } from './i18n.js';
import { terrainTileIcon, terrainSymbols, terrainPreview } from './terrain.js';
import { classicTileIcon } from './graphics.js';
import { createGameOverview } from './overview.js';
import { CATALOG, BY_ID, TERRAIN, COLORS, TERRAIN_PRESETS, applyTerrainPreset, index, blank, decode, encode, safeName, cells, place, rotate, inspect, demo, defaultTrack, owner } from './core.js';
import { canonicalTrackBytes } from './track-format.js';
import {trackConnections,placementConnections,portLabel,sectionProfile} from './connections.js';
import {captureSection,rotateSection,applySection} from './sections.js';
import {connectedTileIcon,connectionOverlay} from './map-art.js';
import {createTestStart} from './test-start.js';
import { checkTrack } from './validation.js';
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
let raw=defaultTrack(),piece=4,layer='track',category='Alle',cursor=[8,13],zoom=1,undo=[],redo=[],stroke=null,panMode=false,panDrag=null,versions=[],storageAvailable=true;
let cursorCells=[],lastPointerPosition=null;
let validationTimer=null,latestValidation=null,connectionState={ports:[],issues:[]},showConnections=false;
let sectionMode=null,sectionDrag=null,selectedSection=null;
const constructionBar=document.createElement('div');constructionBar.className='construction-toolbar';
constructionBar.innerHTML=`<button id="connections" aria-pressed="false" data-i18n="Anschlüsse">${tr('Anschlüsse')}</button><button id="select-section" aria-pressed="false" data-i18n="Abschnitt wählen">${tr('Abschnitt wählen')}</button><button id="height-profile" data-i18n="Höhenansicht">${tr('Höhenansicht')}</button><button id="test-drive" data-i18n="Teststart exportieren">${tr('Teststart exportieren')}</button><span class="connection-legend" id="connection-legend" hidden>${tr('Grün: verbunden · Rot: unpassend · Blau: offen · H: hoch · R: Röhre · S: Steilwand')}</span>`;
document.querySelector('.project-toolbar').after(constructionBar);
const sectionBar=document.createElement('div');sectionBar.className='section-toolbar';sectionBar.hidden=true;
sectionBar.innerHTML=`<output id="section-info"></output><button id="section-copy" data-i18n="Kopieren">${tr('Kopieren')}</button><button id="section-move" data-i18n="Abschnitt verschieben">${tr('Abschnitt verschieben')}</button><button id="section-rotate" data-i18n="Abschnitt drehen">${tr('Abschnitt drehen')}</button><label><input type="checkbox" id="section-terrain"> <span data-i18n="Gelände mitnehmen">${tr('Gelände mitnehmen')}</span></label><label><input type="checkbox" id="section-replace"> <span data-i18n="Ziel ersetzen">${tr('Ziel ersetzen')}</span></label><button id="section-cancel" data-i18n="Auswahl aufheben">${tr('Auswahl aufheben')}</button>`;
constructionBar.after(sectionBar);
const validationBar=document.createElement('div');validationBar.className='validation-bar';validationBar.dataset.state='pending';
validationBar.innerHTML='<output id="validation-status" role="status"></output><button id="validation-details"></button>';
document.querySelector('.project-toolbar').after(validationBar);
function markValidation(result){
 const locations=[...result.errors,...result.localIssues].map(e=>e.location).filter(p=>p&&p.every(n=>Number.isInteger(n)&&n>=0&&n<30));
 const group=$('board-errors');if(group)group.innerHTML=locations.map(([x,y])=>`<rect x="${x*48+2}" y="${y*48+2}" width="44" height="44" fill="none" stroke="#ff7373" stroke-width="3" vector-effect="non-scaling-stroke"/>`).join('');
}
function runTrackCheck(){
 clearTimeout(validationTimer);validationTimer=null;
 latestValidation=checkTrack(raw);const result=latestValidation;
 validationBar.dataset.state=result.valid?'valid':'error';
 $('validation-status').textContent=tr(result.valid?'Spielprüfung bestanden · vollständige Runde.':'Die Strecke kann noch nicht gestartet werden.');
 $('validation-details').textContent=tr(result.valid?'Prüfergebnis':'Fehler anzeigen');
 markValidation(result);return result;
}
function scheduleTrackCheck(){
 clearTimeout(validationTimer);validationBar.dataset.state='pending';
 $('validation-status').textContent=tr('Strecke wird geprüft…');$('validation-details').textContent=tr('Prüfergebnis');
 validationTimer=setTimeout(runTrackCheck,400);
}
function showTrackCheck(result=runTrackCheck(),allowDraft=false){
 const row=(e,i)=>`<li>${e.location?`<button class="validation-location" data-error="${i}">X ${e.location[0]+1}, Y ${e.location[1]+1}</button> `:''}${escapeText(e.message)}</li>`;
 const allIssues=[...result.errors,...result.localIssues];
 openDialog('Strecke prüfen',`<p>${tr(result.valid?'Spielprüfung bestanden · vollständige Runde.':'Die Strecke kann noch nicht gestartet werden.')}</p>${result.errors.length?'<ul>'+result.errors.map(row).join('')+'</ul>':''}${result.localIssues.length?`<h3>${tr('Weitere Anschlussprobleme')}</h3><p class="muted">${tr('Lokale Hinweise prüfen auch unbefahrene Abschnitte. Die Spielprüfung entscheidet, ob der Rundkurs startbar ist.')}</p><ul>${result.localIssues.map((e,i)=>row(e,result.errors.length+i)).join('')}</ul>`:''}${result.warnings.length?'<p>'+result.warnings.map(e=>escapeText(e.message)).join('<br>')+'</p>':''}${result.errors.length?`<p class="muted">${tr('Klicke auf die Koordinaten, um die Fehlerstelle auf der Karte zu zeigen. Die Spielprüfung meldet den ersten Fehler im Streckenverlauf; prüfe nach der Korrektur erneut.')}</p>`:''}${allowDraft?`<button id="validation-save-draft">${tr('Als Entwurf im Spiel speichern')}</button>`:''}`);
 for(const button of $('dialog-content').querySelectorAll('[data-error]'))button.onclick=()=>{
  const location=allIssues[Number(button.dataset.error)].location;
  $('dialog').close();panMode=false;$('pan').setAttribute('aria-pressed','false');$('board').style.cursor='crosshair';cursor=[...location];renderCursor();
  $('board').children[location[1]*30+location[0]].scrollIntoView({block:'center',inline:'center'});$('board').focus({preventScroll:true});
  status('X {x}, Y {y} · {message}',{x:location[0]+1,y:location[1]+1,message:allIssues[Number(button.dataset.error)].message});
 };
 return result;
}
$('validation-details').onclick=()=>showTrackCheck();
let gameOverview=null,gameOverviewLoading=null,gamePreviewFrame=null,lastGamePreviewKey=null,gamePreviewMessage='Die Vorschau folgt deinen Änderungen live.';
function queueGamePreview(){
 $('game-preview-name').textContent=safeName($('name').value)+'.TRK';
 $('game-preview-note').textContent=tr(gamePreviewMessage);
 if($('game-preview').hidden||gamePreviewFrame!==null)return;
 gamePreviewFrame=requestAnimationFrame(async()=>{
  gamePreviewFrame=null;
  if($('game-preview').hidden)return;
  try{
   if(!gameOverview){
    gamePreviewMessage='Spielgrafik wird geladen…';$('game-preview-note').textContent=tr(gamePreviewMessage);
    if(!gameOverviewLoading)gameOverviewLoading=createGameOverview().finally(()=>{gameOverviewLoading=null;});
    gameOverview=await gameOverviewLoading;
   }
   if($('game-preview').hidden)return;
   const key=raw.join(',');
   if(key!==lastGamePreviewKey){
    const result=gameOverview.render(raw),canvas=$('game-preview-canvas');
    canvas.getContext('2d').putImageData(new ImageData(result.rgba,320,200),0,0);
    canvas.dataset.renderCount=String(Number(canvas.dataset.renderCount||0)+1);
    lastGamePreviewKey=key;
    gamePreviewMessage=result.adjusted?'Unbekannte oder ungültige Felder werden nur in der Vorschau vereinfacht.':'Die Vorschau folgt deinen Änderungen live.';
   }
  }catch(error){
   gamePreviewMessage='Spielansicht nicht verfügbar. Bitte einen aktuellen Browser verwenden.';
   console.error('Stunts overview:',error);
  }
  $('game-preview-note').textContent=tr(gamePreviewMessage);
 });
}
function setGamePreview(open){
 $('game-preview').hidden=!open;$('editor-view').classList.toggle('preview-open',open);
 document.querySelector('.editor').classList.toggle('preview-open',open);
 $('game-preview-toggle').setAttribute('aria-pressed',String(open));
 if(!open)$('game-preview-toggle').focus();
 fit();queueGamePreview();
}
let restored=false,storageError=false;
try {const saved=JSON.parse(localStorage.getItem(DRAFT_KEY)||'null');if(saved){raw=decode(saved.raw);$('name').value=safeName(saved.name);restored=true;}
 const savedVersions=JSON.parse(localStorage.getItem(VERSIONS_KEY)||'[]');if(Array.isArray(savedVersions))versions=savedVersions.filter(v=>{try{decode(v.raw);return typeof v.name==='string'&&typeof v.date==='string';}catch{return false;}}).slice(0,10);
}catch {storageError=true;}
function persist(){try{localStorage.setItem(DRAFT_KEY,JSON.stringify(snapshot()));setDraftStatus('Automatisch in diesem Browser gespeichert');storageAvailable=true;return true;}catch{setDraftStatus('Browsersicherung nicht verfügbar · TRK exportieren');storageAvailable=false;return false;}}
function escapeText(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function renderVersions(){$('drafts').innerHTML=`<option value="">${tr('Sicherung laden…')}</option>`+versions.map((v,i)=>`<option value="${i}">${escapeText(v.name)} · ${escapeText(new Date(v.date).toLocaleString(getLanguage()))}</option>`).join('');$('drafts').disabled=!versions.length;}
function complete(before,message,values={}){remember(before);render();persist();if(message)status(message,values);}
function openDialog(title,html){$('dialog').classList.remove('terrain-dialog','library-dialog');$('dialog-title').textContent=tr(title);$('dialog-content').innerHTML=html;$('dialog').showModal();}

function icon(t,view='palette'){return classicTileIcon(t,view);}
function rampHint(t){return ['sra','ssr','sbr'].includes(t?.family)?tr('Hohes Ende: {direction}',{direction:tr(['Nord','Ost','Süd','West'][t.rotation])}):'';}
function pieceHint(t){
 if(t?.variant==='rdup')return tr('Gerade auf einem Gelände-Hang. Die Höhe kommt vom Gelände; gespeichert wird normale Asphaltstraße.');
 if(t?.family==='sps')return tr('Übergang zwischen normaler Straße und Röhre. Zum Ausfahren um 180° drehen.');
 if(t?.family==='spi')return tr('An beiden Enden mit einem Röhren-Übergang anschließen.');
 const hint=rampHint(t);return hint?hint+(t.family==='sra'?' · '+tr('Hohes Ende zur Hochstraße, niedriges Ende zur normalen Straße.'):''):'';
}
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
 if(sectionMode==='select'){renderSection();return;}
 if(sectionMode==='copy'||sectionMode==='move'){renderSection();return;}
 const id=stroke?.id??piece,t=layer==='track'?BY_ID.get(id):{width:1,height:1};if(!t)return;
 const [x,y]=cursor,width=t.width*48,height=t.height*48,valid=x+t.width<=30&&y+t.height<=30;
 const targets=cells(t,x,y).filter(([cx,cy])=>cx<30&&cy<30);
 let ground='';for(const [cx,cy]of targets){
  const cell=board.children[cy*30+cx],land=raw[901+cy*30+cx];cell.setAttribute('aria-selected','true');cursorCells.push(cell);
  ground+=`<rect x="${cx*48}" y="${cy*48}" width="48" height="48" fill="${COLORS[land]||'#986578'}"/>`;
  if(land>0&&land<TERRAIN.length)ground+=`<use href="#map-terrain-${land}" x="${cx*48}" y="${cy*48}" width="48" height="48"/>`;
 }
 const candidatePorts=layer==='track'?placementConnections(raw,id,x,y,connectionState.ports):[];
 const graphic=(layer==='track'?connectedTileIcon(t,candidatePorts):terrainTileIcon(id)).replace(/^<svg[^>]*>|<\/svg>$/g,'');
 overlay.dataset.id=id;overlay.dataset.width=t.width;overlay.dataset.height=t.height;overlay.dataset.valid=valid;
 overlay.innerHTML=`<g clip-path="url(#cursor-map-bounds)"><g opacity=".9">${ground}<svg class="cursor-piece" x="${x*48}" y="${y*48}" width="${width}" height="${height}" viewBox="0 0 ${t.width*64} ${t.height*64}">${graphic}</svg>${layer==='track'&&showConnections?connectionOverlay(candidatePorts,true):''}</g><rect class="cursor-frame" x="${x*48+1}" y="${y*48+1}" width="${width-2}" height="${height-2}" fill="none" stroke="${valid?'#fff47a':'#fc5454'}" stroke-width="2" vector-effect="non-scaling-stroke"/></g>`;
}
function renderSection(){
 const overlay=$('board-section');if(!overlay)return;overlay.innerHTML='';
 const rect=sectionDrag?{x:Math.min(sectionDrag.start[0],cursor[0]),y:Math.min(sectionDrag.start[1],cursor[1]),width:Math.abs(sectionDrag.start[0]-cursor[0])+1,height:Math.abs(sectionDrag.start[1]-cursor[1])+1}:selectedSection?.source??selectedSection;
 if(rect)overlay.innerHTML=`<rect x="${rect.x*48+1}" y="${rect.y*48+1}" width="${rect.width*48-2}" height="${rect.height*48-2}" fill="#ad8cff" fill-opacity=".13" stroke="#c6a7ff" stroke-width="2" stroke-dasharray="6 4" vector-effect="non-scaling-stroke"/>`;
 if(selectedSection&&(sectionMode==='copy'||sectionMode==='move')){
  let valid=true;try{applySection(raw,selectedSection,...cursor,{move:sectionMode==='move',terrain:$('section-terrain').checked,replace:$('section-replace').checked});}catch{valid=false;}
  const s=selectedSection;
  const groundGhost=$('section-terrain').checked?s.terrain.map((id,i)=>`<svg x="${(cursor[0]+i%s.width)*48}" y="${(cursor[1]+Math.floor(i/s.width))*48}" width="48" height="48" viewBox="0 0 64 64">${terrainTileIcon(id).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg>`).join(''):'';
  const ghost=s.pieces.map(p=>{const t=BY_ID.get(p.id);return `<svg x="${(cursor[0]+p.x)*48}" y="${(cursor[1]+p.y)*48}" width="${t.width*48}" height="${t.height*48}" viewBox="0 0 ${t.width*64} ${t.height*64}">${classicTileIcon(t,'map').replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg>`;}).join('');
  overlay.innerHTML+=`<g clip-path="url(#cursor-map-bounds)" opacity=".85">${groundGhost}${ghost}<rect x="${cursor[0]*48+1}" y="${cursor[1]*48+1}" width="${s.width*48-2}" height="${s.height*48-2}" fill="${valid?'#9de57a':'#ff7373'}" fill-opacity=".18" stroke="${valid?'#9de57a':'#ff7373'}" stroke-width="2" vector-effect="non-scaling-stroke"/></g>`;
 }
 sectionBar.hidden=!selectedSection;if(selectedSection)$('section-info').textContent=tr('Abschnitt: {width} × {height} Felder · {count} Bauteile',{width:selectedSection.width,height:selectedSection.height,count:selectedSection.pieces.length});
}
function cancelSection(){const active=!!sectionMode||!!selectedSection;sectionMode=null;sectionDrag=null;selectedSection=null;$('select-section').setAttribute('aria-pressed','false');renderSection();renderCursor();return active;}
$('connections').onclick=()=>{showConnections=!showConnections;$('connections').setAttribute('aria-pressed',String(showConnections));$('connection-legend').hidden=!showConnections;render();};
$('select-section').onclick=()=>{finishStroke();panMode=false;$('pan').setAttribute('aria-pressed','false');sectionMode=sectionMode==='select'?null:'select';$('select-section').setAttribute('aria-pressed',String(sectionMode==='select'));renderCursor();status('Ziehe einen Rahmen um den Abschnitt.');};
for(const mode of ['copy','move'])$('section-'+mode).onclick=()=>{sectionMode=mode;renderCursor();status('Ziel auf der Karte wählen · Escape bricht ab.');};
$('section-rotate').onclick=()=>{try{selectedSection=rotateSection(selectedSection);sectionMode=sectionMode==='move'?'move':'copy';renderSection();}catch(e){status(e.translation?.key??e.message,e.translation?.values);}};
$('section-cancel').onclick=cancelSection;for(const id of ['section-terrain','section-replace'])$(id).onchange=renderSection;
$('test-drive').onclick=()=>{
 try{finishStroke();const test=createTestStart(raw,cursor),url=URL.createObjectURL(new Blob([encode(test.raw)],{type:'application/octet-stream'})),a=document.createElement('a');a.href=url;a.download='TESTDRV.TRK';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status('Teststart X {x}, Y {y} exportiert · Originalstrecke bleibt erhalten.',{x:test.start[0]+1,y:test.start[1]+1});}catch(e){status(e.translation?.key??e.message,e.translation?.values);}
};
$('height-profile').onclick=()=>{
 finishStroke();const s=selectedSection,from=s?[s.x,s.y]:[Math.max(0,cursor[0]-3),cursor[1]],to=s?[s.x+s.width-1,s.y+s.height-1]:[Math.min(29,cursor[0]+3),cursor[1]];
 openDialog('Höhenansicht',`<p>${tr('Gerader Schnitt durch die Auswahl oder das markierte Feld. Höhen sind schematisch; eine Testfahrt prüft das Fahrverhalten.')}</p><label>${tr('Schnitt')} <select id="profile-direction"><option value="east">${tr('West → Ost')}</option><option value="south">${tr('Nord → Süd')}</option></select></label><label>${tr('Zeile / Spalte')} <select id="profile-line"></select></label><div id="profile-chart"></div>`);
 const update=()=>{const vertical=$('profile-direction').value==='south',offset=Number($('profile-line').value||0),a=s?vertical?[s.x+offset,s.y]:[s.x,s.y+offset]:vertical?[cursor[0],Math.max(0,cursor[1]-3)]:from,b=s?vertical?[s.x+offset,s.y+s.height-1]:[s.x+s.width-1,s.y+offset]:vertical?[cursor[0],Math.min(29,cursor[1]+3)]:to;const profile=sectionProfile(raw,a,b),W=profile.samples.length*70,base=Math.max(145,...profile.samples.flatMap(p=>p.height.map(h=>h/5+35))),H=base+45;
  $('profile-chart').innerHTML=`<svg role="img" aria-label="${tr('Höhenansicht')}" viewBox="0 0 ${W} ${H}" class="profile-chart"><path d="M0 ${base}H${W}" stroke="#6e897c"/>${profile.samples.map((p,i)=>`<path d="M${i*70} ${base}V${base-p.ground[0]/5}L${(i+1)*70} ${base-p.ground[1]/5}V${base}Z" fill="#385b39"/>${p.road?`<path d="M${i*70} ${base-p.height[0]/5}L${(i+1)*70} ${base-p.height[1]/5}" stroke="#e3eabd" stroke-width="5"/>`:''}<path d="M${i*70} 10V${base}" stroke="#42605a" stroke-dasharray="2 4"/><text x="${i*70+35}" y="${base+25}" text-anchor="middle" fill="#c9dbd0" font-size="12">${p.x+1}/${p.y+1}</text>`).join('')}</svg><p>${tr('Fahrbahn hell · Gelände grün · Koordinaten X/Y')}</p>`;};$('profile-direction').value=s&&s.height>s.width?'south':'east';const lines=()=>{const vertical=$('profile-direction').value==='south',count=s?(vertical?s.width:s.height):1,first=s?(vertical?s.x:s.y):cursor[vertical?0:1];$('profile-line').innerHTML=Array.from({length:count},(_,i)=>`<option value="${i}">${vertical?'X':'Y'} ${first+i+1}</option>`).join('');$('profile-line').value=Math.floor(count/2);$('profile-line').disabled=count===1;update();};$('profile-direction').onchange=lines;$('profile-line').onchange=update;lines();
};
function moveCursor(position){if(position.some((n,i)=>n!==cursor[i])){cursor=position;renderCursor();renderSection();}}
function render(){
 const board=$('board');let drawings='',grounds=terrainSymbols('map-terrain');connectionState=trackConnections(raw);const portsByAnchor=new Map();for(const p of connectionState.ports){const key=p.anchor.join(',');if(!portsByAnchor.has(key))portsByAnchor.set(key,[]);portsByAnchor.get(key).push(p);}
 if(!board.children.length){for(let i=0;i<900;i++){const c=document.createElement('button');c.className='cell';c.setAttribute('role','gridcell');c.tabIndex=-1;c.dataset.x=i%30;c.dataset.y=Math.floor(i/30);board.append(c);}board.insertAdjacentHTML('beforeend','<svg viewBox="0 0 1440 1440" aria-hidden="true"></svg>');}
 $('landscape').innerHTML=Array.from({length:5},(_,i)=>`<option value="${i}">${tr(['Wüste','Tropen','Alpen','Stadt','Land'][i])}</option>`).join('')+(raw[900]>4?`<option value="${raw[900]}">${tr('Originalwert {value}',{value:raw[900]})}</option>`:'');$('landscape').value=raw[900];
 for(let y=0;y<30;y++)for(let x=0;x<30;x++) {
  const id=raw[index(x,y)],land=raw[901+y*30+x],t=BY_ID.get(id),cell=board.children[y*30+x];cell.setAttribute('aria-label',`X ${x+1}, Y ${y+1}: ${id===0?tr('Leer'):t?pieceName(t):(id>=253?tr('Fortsetzung'):tr('Bauteil {id}',{id}))}, ${terrainName(land)}`);cell.setAttribute('aria-selected','false');cell.style.background=COLORS[land]||'#986578';cell.style.backgroundImage='none';
  if(land>0&&land<TERRAIN.length)grounds+=`<use href="#map-terrain-${land}" x="${x*48}" y="${y*48}" width="48" height="48"/>`;
  if(t&&id)drawings+=`<svg x="${x*48}" y="${y*48}" width="${t.width*48}" height="${t.height*48}" viewBox="0 0 ${t.width*64} ${t.height*64}">${connectedTileIcon(t,portsByAnchor.get(`${x},${y}`)||[]).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg>`;
  else if(id&&id<253)drawings+=`<text x="${x*48+24}" y="${y*48+30}" text-anchor="middle" fill="#fff" font-size="20">${id}</text>`;
 }
 board.lastElementChild.innerHTML=`<defs><clipPath id="cursor-map-bounds"><rect width="1440" height="1440"/></clipPath></defs><g id="map-content">${grounds+drawings}</g><g id="board-ports">${showConnections?connectionOverlay(connectionState.ports):''}</g><g id="board-section"></g><g id="board-cursor"></g><g id="board-errors"></g>`;renderCursor();renderSection();scheduleTrackCheck();
 const details=inspect(raw);$('stats').textContent=tr('{count} Bauteile · 1.802 Bytes',{count:details.tiles});$('undo').disabled=!undo.length;$('redo').disabled=!redo.length;fit();queueGamePreview();
}
function palette(){
 const query=normalizeSearch($('search').value),items=layer==='track'?CATALOG.filter(t=>(category==='Alle'||t.category===category)&&(normalizeSearch(`${pieceName(t)} ${t.name} ${t.id}`).includes(query))):TERRAIN.map((name,id)=>({id,name:tr(name)})).filter(t=>(normalizeSearch(`${pieceName(t)} ${t.name} ${t.id}`).includes(query)));
 $('palette').innerHTML=items.map(t=>`<button class="piece${rampHint(t)?' ramp-piece':''}" data-id="${t.id}" aria-pressed="${t.id===piece}" title="${layer==='track'?pieceName(t):t.name} · ID ${t.id}">${layer==='track'?icon(t):terrainTileIcon(t.id)}<span>${layer==='track'?pieceName(t):t.name}</span><small>ID ${t.id}${t.width?` · ${t.width} × ${t.height}`:''}</small>${layer==='track'&&['sra','ssr','sbr'].includes(t.family)?`<small class="view-hint">${tr('Seitenansicht')}</small>`:''}${layer==='track'&&pieceHint(t)?`<small class="ramp-hint">${pieceHint(t)}</small>`:''}</button>`).join('')||`<p>${tr('Keine passenden Bauteile.')}</p>`;
 const t=BY_ID.get(piece);$('selected-icon').innerHTML=layer==='track'?icon(t):terrainTileIcon(piece);$('selected-icon').style.background=layer==='terrain'?COLORS[piece]:COLORS[0];$('selected-name').textContent=layer==='track'?pieceName(t):terrainName(piece);$('selected-meta').textContent=layer==='track'?`ID ${piece} · ${t.width} × ${t.height} · ${t.rotation*90}°${pieceHint(t)?` · ${pieceHint(t)}`:''}`:tr('Gelände {id}',{id:piece});$('rotate').disabled=layer==='terrain'||rotate(piece)===piece;
 renderCursor();
}
function fit(){const rect=$('map-scroll').getBoundingClientRect(),size=Math.max(280,Math.min(rect.width-24,rect.height-20))*zoom;$('board').style.width=`${size}px`;$('zoom-value').textContent=`${Math.round(zoom*100)} %`;}
function paint(x,y,id=piece,defer=false){let changed=false;try{const next=place(raw,x,y,id,layer);if(next.some((n,i)=>n!==raw[i])){raw=next;cursor=[x,y];changed=true;if(!defer)render();}status('X {x}, Y {y} · {piece}',{x:x+1,y:y+1,...(layer==='track'?{pieceId:id}:{terrainId:id})});}catch(e){status(e.translation?.key??e.message,e.translation?.values);}}
function history(forward){cancelSection();const from=forward?redo:undo,to=forward?undo:redo;if(!from.length)return;to.push(snapshot());const next=from.pop();raw=next.raw;$('name').value=next.name;render();persist();status(forward?'Änderung wiederholt.':'Änderung rückgängig gemacht.');}
$('palette').onclick=e=>{const button=e.target.closest('[data-id]');if(button){piece=Number(button.dataset.id);palette();}};
$('filters').onclick=e=>{const b=e.target.closest('[data-category]');if(b){category=b.dataset.category;for(const el of $('filters').children)el.setAttribute('aria-pressed',String(el===b));palette();}};
$('search').oninput=palette;$('rotate').onclick=rotateSelection;
for(const mode of ['track','terrain'])$(mode+'-layer').onclick=()=>{layer=mode;piece=mode==='track'?4:0;for(const m of ['track','terrain'])$(m+'-layer').setAttribute('aria-pressed',String(m===mode));$('filters').hidden=mode==='terrain';palette();};
$('board').oncontextmenu=e=>e.preventDefault();
function point(e){const rect=$('board').getBoundingClientRect(),x=Math.floor((e.clientX-rect.left)/rect.width*30),y=Math.floor((e.clientY-rect.top)/rect.height*30);return x>=0&&y>=0&&x<30&&y<30?[x,y]:null;}
function continueStroke(e){if(panDrag){$('map-scroll').scrollLeft=panDrag.left+panDrag.x-e.clientX;$('map-scroll').scrollTop=panDrag.top+panDrag.y-e.clientY;return;}if(panMode)return;const moved=!lastPointerPosition||lastPointerPosition[0]!==e.clientX||lastPointerPosition[1]!==e.clientY;lastPointerPosition=[e.clientX,e.clientY];if(!stroke&&!moved)return;const p=point(e);if(!p)return;moveCursor(p);if(sectionMode)return;if(!stroke)return;if(stroke.last&&p.every((n,i)=>n===stroke.last[i]))return;
 const t=BY_ID.get(stroke.id),interpolate=stroke.last&&(layer==='terrain'||t?.width===1&&t?.height===1),from=interpolate?stroke.last:p,steps=Math.max(Math.abs(p[0]-from[0]),Math.abs(p[1]-from[1]));
 for(let i=interpolate?1:0;i<=steps;i++){const amount=steps?i/steps:0;paint(Math.round(from[0]+(p[0]-from[0])*amount),Math.round(from[1]+(p[1]-from[1])*amount),stroke.id,true);}stroke.last=p;render();}
function finishStroke(){panDrag=null;if(sectionDrag){try{selectedSection=captureSection(raw,sectionDrag.start,cursor);selectedSection.originalWidth=selectedSection.width;selectedSection.originalHeight=selectedSection.height;}catch(e){status(e.message);}sectionDrag=null;sectionMode=null;$('select-section').setAttribute('aria-pressed','false');renderSection();renderCursor();}if(stroke){const before=stroke.before;stroke=null;complete(before);}}
$('board').onpointerdown=e=>{if(![0,2].includes(e.button))return;const p=point(e);if(!p)return;e.preventDefault();$('board').focus({preventScroll:true});if(e.button===2&&!e.shiftKey){finishStroke();cursor=p;rotateSelection();renderCursor();return;}if(sectionMode){if(e.button!==0)return;if(sectionMode==='select'){sectionDrag={start:p};cursor=p;renderSection();$('board').setPointerCapture(e.pointerId);return;}try{const before=snapshot();raw=applySection(raw,selectedSection,...p,{move:sectionMode==='move',terrain:$('section-terrain').checked,replace:$('section-replace').checked});cancelSection();complete(before,'Abschnitt eingesetzt.');}catch(e){status(e.translation?.key??e.message,e.translation?.values);}return;}if(panMode){panDrag={x:e.clientX,y:e.clientY,left:$('map-scroll').scrollLeft,top:$('map-scroll').scrollTop};$('board').setPointerCapture(e.pointerId);return;}if(e.altKey&&layer==='track'){const [ax,ay]=owner(raw,...p),id=raw[index(ax,ay)];if(BY_ID.has(id)){piece=id;cursor=[ax,ay];palette();status('Bauteil von der Karte übernommen.');}return;}stroke={before:snapshot(),id:e.button===2?0:piece,last:null};renderCursor();$('board').setPointerCapture(e.pointerId);continueStroke(e);};
$('board').onpointermove=continueStroke;
window.addEventListener('pointerup',finishStroke);window.addEventListener('pointercancel',finishStroke);window.addEventListener('blur',finishStroke);
$('pan').onclick=()=>{panMode=!panMode;$('pan').setAttribute('aria-pressed',String(panMode));$('board').style.cursor=panMode?'grab':'crosshair';renderCursor();status(panMode?'Karte ziehen zum Verschieben.':'Zeichenmodus.');};
$('undo').onclick=()=>history(false);$('redo').onclick=()=>history(true);$('zoom-in').onclick=()=>{zoom=Math.min(4,zoom+.25);fit();};$('zoom-out').onclick=()=>{zoom=Math.max(.5,zoom-.25);fit();};$('fit').onclick=()=>{zoom=1;fit();};new ResizeObserver(fit).observe($('map-scroll'));
$('import').onclick=()=>$('file').click();$('file').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const next=decode(new Uint8Array(await f.arrayBuffer())),before=snapshot();cancelSection();raw=next;$('name').value=safeName(f.name);complete(before,'{file} geöffnet.',{file:f.name});}catch(e){status(e.translation?.key??e.message,e.translation?.values);}finally{$('file').value='';}};
let lastExportUrl=null;
$('export').onclick=()=>{const name=safeName($('name').value);$('name').value=name;const url=URL.createObjectURL(new Blob([encode(raw)],{type:'application/octet-stream'})),a=document.createElement('a');a.href=url;a.download=name+'.TRK';document.body.append(a);a.click();a.remove();if(lastExportUrl)URL.revokeObjectURL(lastExportUrl);lastExportUrl=url;$('last-export').href=url;$('last-export').download=name+'.TRK';$('last-export').textContent=name+'.TRK';$('last-export').hidden=false;persist();status('{file} exportiert · 1.802 Bytes.',{file:name+'.TRK'});};
$('board').onkeydown=e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' ','Delete','Backspace'].includes(e.key))e.preventDefault();const delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(delta)moveCursor(cursor.map((n,i)=>Math.max(0,Math.min(29,n+delta[i]))));if(sectionMode)return;if([' ','Delete','Backspace'].includes(e.key)){const before=snapshot();paint(...cursor,e.key===' '?piece:0);complete(before);}};
document.addEventListener('keydown',e=>{if(e.target.matches('input,select,textarea'))return;if(e.key==='Escape'&&cancelSection()){e.preventDefault();return;}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();history(e.shiftKey);}else if(e.key.toLowerCase()==='r'&&layer==='track')$('rotate').click();});
$('name').oninput=()=>{$('name').value=$('name').value.toUpperCase().replace(/[^A-Z0-9_-]/g,'');persist();queueGamePreview();};
$('game-preview-toggle').onclick=()=>setGamePreview($('game-preview').hidden);
$('game-preview-close').onclick=()=>setGamePreview(false);
$('landscape').onchange=()=>{const before=snapshot();raw=[...raw];raw[900]=Number($('landscape').value);complete(before,'Horizont-Landschaft geändert.');};
$('new').onclick=()=>{cancelSection();const before=snapshot();raw=blank();$('name').value='HDTRACK';complete(before,'Leere Strecke · mit Rückgängig zurück zum bisherigen Entwurf.');};
$('default').onclick=()=>{cancelSection();const before=snapshot();raw=defaultTrack();$('name').value='DEFAULT';complete(before,'Originalstrecke DEFAULT geladen · bisherige Strecke bleibt in Rückgängig.');};
$('example').onclick=()=>{cancelSection();const before=snapshot();raw=demo();$('name').value='DEMO';complete(before,'Beispielstrecke geladen · bisherige Strecke bleibt in Rückgängig.');};

function applyPreset(id,clearTrack=false){
 const before=snapshot(),next=applyTerrainPreset(raw,id,clearTrack);raw=next;
 if(clearTrack)$('name').value=`TERRAIN${id+1}`;
 complete(before,'{preset} angewendet · {mode} · mit Rückgängig zurück.',{presetId:id,clearTrack});
}
const libraryButton=document.createElement('button');libraryButton.id='track-library';libraryButton.dataset.i18n='Streckenbibliothek';libraryButton.textContent=tr('Streckenbibliothek');
document.querySelector('.project-toolbar').insertBefore(libraryButton,$('help'));
libraryButton.onclick=()=>{finishStroke();openCommunityLibrary(openDialog,(bytes,entry)=>{cancelSection();const before=snapshot();raw=decode(bytes);$('name').value=entry.name;complete(before,'{file} als Editor-Entwurf geladen.',{file:entry.title+'.TRK'});});};
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
$('check').onclick=()=>{finishStroke();showTrackCheck();};
const helpParagraphs=[
 'Wähle ein Bauteil und zeichne auf der Karte. Rechtsklick oder R dreht die Auswahl zur nächsten verfügbaren Ausrichtung. Umschalt + Rechtsklick oder der Radierer entfernt ganze Bauteile. Mit Alt + Klick übernimmst du ein Bauteil von der Karte.',
 'Pfeiltasten bewegen das markierte Feld. Leertaste platziert, Entf radiert. Strg/⌘ Z nimmt einen Zeichenstrich zurück; mit Umschalt wiederholst du ihn.',
 '„Terrain-Vorlagen“ enthält die fünf Original-Gelände mit Vorschau. Wende nur das Gelände auf deine Strecke an oder beginne eine neue Strecke damit; Rückgängig stellt den bisherigen Entwurf wieder her.',
 'Auf dem Handy kannst du zeichnen oder mit „Verschieben“ die vergrößerte Karte ziehen. Einpassen zeigt die gesamte Strecke.',
 'Entwürfe werden lokal in diesem Browser gespeichert. Exportiere eine .TRK, um sie im Spiel zu benutzen oder dauerhaft aufzubewahren. Originaldateien werden beim Import nicht verändert. Mehrfeld-Bauteile brauchen den angegebenen Platz.',
 'Die Karte bleibt in fester Draufsicht. Brücke und Rampen zeigen in der Palette eine Seitenansicht; der Pfeil zeigt ihre Richtung auf der Karte. Die Symbole sind als scharfe Vektorgrafiken nach dem Original neu gezeichnet.',
 '„Spielansicht“ zeigt deine Strecke mit der Originalgrafik aus der Streckenauswahl. Bauteile, Höhen und Landschaft aktualisieren sich beim Bearbeiten automatisch. Die Vorschau funktioniert auch offline.',
 'Die Spielprüfung kontrolliert Gelände, Start/Ziel und den vollständigen Streckenverlauf automatisch. Fehler sind rot markiert. Klicke im Prüfergebnis auf die Koordinaten, um zur Stelle zu springen. Unfertige Strecken kannst du als Entwurf speichern.',
 'Röhren brauchen Übergangsstücke zur normalen Straße. Bei Brückenrampen muss das hohe Ende zur Hochstraße zeigen. Eine Hangstraße erhält ihre Höhe vom Gelände und wird als normale Gerade gespeichert.'
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
if(restored){setDraftStatus('Lokalen Entwurf wiederhergestellt');status('Letzten Entwurf aus diesem Browser wiederhergestellt.');}else status(storageError?'Gesicherter Entwurf nicht lesbar · DEFAULT geöffnet.':'Originalstrecke DEFAULT · eigene TRK öffnen oder direkt weiterbauen.');


// Optional browser-native tools use exactly the same model and history as the UI.
const modelContext=document.modelContext;
if(modelContext?.registerTool){
 const lifetime=new AbortController();window.addEventListener('pagehide',()=>lifetime.abort(),{once:true});
 function object(input,keys){if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!keys.includes(k)))throw Error('Invalid tool input.');return input;}
 const summary=()=>({name:safeName($('name').value),landscape:raw[900],...inspect(raw),validation:checkTrack(raw)});
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
