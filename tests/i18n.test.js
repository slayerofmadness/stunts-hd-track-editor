import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LANGUAGES,MESSAGES,chooseLanguage,setLanguage,getLanguage,t,pieceName,normalizeSearch} from '../src/i18n.js';
import {CATALOG,TERRAIN,TERRAIN_PRESETS,demo,encode,place,inspect} from '../src/core.js';

test('browser language matches regional tags in preference order with English fallback',()=>{
 for(const [locales,expected] of [[['es-MX','en-US'],'es'],[['it-CH'],'it'],[['fr-CA'],'fr'],[['DE-at'],'de'],[['en-GB'],'en'],[['ja-JP','fr-FR'],'fr'],[['pt-BR'],'en'],[[],'en']])assert.equal(chooseLanguage('auto',locales),expected);
 assert.equal(chooseLanguage('fr',['de-DE']),'fr');
 assert.equal(chooseLanguage('invalid',['it-IT']),'it');
 assert.equal(chooseLanguage(null,[undefined,'es_AR']),'es');
 assert.equal(chooseLanguage('auto','fr-CH'),'fr');
});

test('all five dictionaries have identical interpolation fields and complete UI, piece and terrain coverage',()=>{
 const fields=s=>[...s.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort();
 for(const [key,row] of Object.entries(MESSAGES))for(const code of Object.keys(LANGUAGES)){
  assert.ok(row[code],`${code}: ${key}`);assert.deepEqual(fields(row[code]),fields(key),`${code}: ${key}`);
 }
 const keys=[...CATALOG.flatMap(p=>p.name.split(' · ')),...TERRAIN,...TERRAIN_PRESETS.map(p=>p.description)];
 const html=readFileSync(new URL('../src/index.html',import.meta.url),'utf8');
 keys.push(...[...html.matchAll(/data-i18n(?:-[\w-]+)?="([^"]+)"/g)].map(m=>m[1]));
 for(const file of ['app','core']){
  const source=readFileSync(new URL(`../src/${file}.js`,import.meta.url),'utf8');
  keys.push(...[...source.matchAll(/(?:tr|translatedError)\('([^']+)'/g)].map(m=>m[1]));
 }
 for(const key of keys)assert.ok(MESSAGES[key],`Missing translation: ${key}`);
});

test('language switching translates pieces, errors and structure checks without changing TRK bytes',()=>{
 const raw=demo(),bytes=encode(raw),empty=new Array(1802).fill(0);
 try{
  for(const code of Object.keys(LANGUAGES)){
   setLanguage(code);assert.equal(getLanguage(),code);
   assert.equal(pieceName(CATALOG.find(p=>p.id===36)),MESSAGES.Brückenrampe[code]);
   assert.equal(inspect(empty).issues[0],t('Die Strecke braucht genau eine Start-/Ziellinie (aktuell {count}).',{count:0}));
   assert.throws(()=>place(raw,30,0,4),e=>e.message===MESSAGES['Koordinaten müssen zwischen 0 und 29 liegen.'][code]);
   assert.deepEqual(encode(raw),bytes);
  }
  assert.throws(()=>setLanguage('xx'));assert.equal(getLanguage(),'fr');
 }finally{setLanguage('de');}
});

test('translated piece variants retain identifiers and accent-insensitive search',()=>{
 try{
  setLanguage('es');assert.equal(normalizeSearch('ÁRBOL'),'arbol');
  assert.equal(pieceName(CATALOG.find(p=>p.id===75)),'Recta de asfalto · Desplazamiento a la izquierda');
  assert.equal(t('Terrain {number}',{number:5}),'Terreno 5');
 }finally{setLanguage('de');}
});
