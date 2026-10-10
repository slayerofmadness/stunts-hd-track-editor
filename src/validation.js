import {inspect,decode,BY_ID,index} from './core.js';
import {canonicalTrackBytes} from './track-format.js';
import {nativeRouteCheck} from './native-route-validation.js';
import {trackConnections,portLabel} from './connections.js';
import {tr} from './i18n.js';
const routeMessages={
 1:'Start-/Ziellinie fehlt.',2:'Das Bauteil ist aus dieser Richtung nicht verbunden.',
 3:'Mehrere Start-/Ziellinien: Verwende genau eine.',
 4:'Die Anschlüsse passen nicht zusammen. Prüfe Höhe und Ausrichtung der Übergangsstücke.',
 5:'Die Strecke erlaubt eine Fahrt in Gegenrichtung. Prüfe die Verzweigungen.',
 6:'Zu viele Bauteile im Streckenverlauf.',
 7:'Die Fahrbahn endet hier. Verbinde sie zu einer vollständigen Runde bis zum Ziel.',
 8:'Zu viele Verzweigungen. Vereinfache den Streckenverlauf.',
 9:'Die Gerade vor dem Sprung ist zu kurz.',
 10:'Die Sprunglücke ist zu lang. Es darf nur ein Feld übersprungen werden.',
 11:'Benachbarte Geländekanten passen nicht zusammen. Prüfe die angrenzenden Hügel und Hänge.',
};
export function checkTrack(input){
 const raw=decode(input),structure=inspect(raw);
 const errors=structure.issues.map((message,i)=>({message,location:structure.locations[i],kind:'structure'}));
 const warnings=[];
 const canonical=canonicalTrackBytes(raw);
 const adjusted=raw.slice(0,900).filter((n,i)=>n!==canonical[i]).length;
 if(adjusted)warnings.push({message:tr('{count} ältere Hangstücke werden beim Speichern automatisch ins originale TRK-Format umgewandelt.',{count:adjusted}),location:null});
 let native=null;
 if(!errors.length){
  native=nativeRouteCheck(canonical);
  if(native.error){
   let message=routeMessages[native.error]||'Die Spielprüfung konnte keinen gültigen Streckenverlauf finden.';
   const tile=native.location?BY_ID.get(canonical[index(...native.location)]):null;
   const terrain=native.location?canonical[901+native.location[1]*30+native.location[0]]:0;
   if(native.error===4&&native.previous?.state===4)message='Röhrenausfahrt fehlt oder ist falsch gedreht. Setze ein Übergangsstück zwischen Röhre und normaler Straße.';
   else if(native.error===4&&tile?.family==='sra')message='Die Brückenrampe ist falsch angeschlossen. Ihr hohes Ende muss zur Hochstraße zeigen; drehe sie bei Bedarf um 180°.';
   else if(native.error===4&&tile?.family==='spi')message='Röhren-Einfahrt fehlt oder ist falsch gedreht. Normale Straße darf nicht direkt an eine geschlossene Röhre anschließen.';
   else if(native.error===7&&terrain>=7&&terrain<=10)message='Dieses Bauteil passt nicht zum Gelände-Hang. Verwende eine Gerade oder passende Rampe entlang der Steigung.';
   else if(native.error===7&&tile?.category==='Landschaft')message='Ein Landschaftsobjekt unterbricht die Fahrbahn. Setze hier Straße oder baue einen gültigen Sprung darüber.';
   errors.push({message:tr(message),location:native.location,kind:native.kind,code:native.error});
  }
 }
 if(raw[900]>4)errors.push({message:tr('Wähle eine der fünf Landschaften, bevor du die Strecke im Spiel fährst.'),location:null,kind:'horizon'});
 const localIssues=trackConnections(canonical).issues.map(p=>({
  ...p,kind:'local',message:p.reason==='terrain'
   ?tr('Benachbarte Geländekanten passen nicht zusammen. Prüfe die angrenzenden Hügel und Hänge.')
   :p.reason==='height'?tr('Die Fahrbahnhöhen an diesem Anschluss passen nicht zusammen.')
   :p.states.every(state=>state===2||state===3)?tr('Die Steilwand liegt auf unterschiedlichen Fahrbahnseiten.')
   :tr('Unpassende Anschlüsse: {first} und {second}.',{first:tr(portLabel(p.states[0])),second:tr(portLabel(p.states[1]))})
 }));
 return {valid:errors.length===0,errors,warnings,native,adjusted,localIssues};
}
