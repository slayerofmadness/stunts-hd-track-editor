import {readFileSync,writeFileSync} from 'node:fs';
const source=JSON.parse(readFileSync(new URL('../vendor/playstunts/public/game/route-records.json',import.meta.url)));
writeFileSync(new URL('../src/connection-data.js',import.meta.url),'// Generated from the unchanged pinned native route records. GPL-3.0-only.\nexport const CONNECTION_RECORDS = '+JSON.stringify(source.map(p=>p.records.map(r=>[r[1],r[2],r[3],r[4]])))+';\n');
