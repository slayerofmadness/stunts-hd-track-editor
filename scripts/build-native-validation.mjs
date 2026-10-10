import {writeFileSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
// Optional regeneration; the regular standalone build has no npm dependencies.
const {build}=await import('esbuild').catch(()=>import('../../playstunts-upstream/node_modules/esbuild/lib/main.js'));
const root=new URL('../',import.meta.url);
const result=await build({entryPoints:[new URL('scripts/native-validation-entry.ts',root).pathname],bundle:true,write:false,metafile:true,format:'iife',globalName:'StuntsNativeRoute',platform:'browser',target:'safari16'});
writeFileSync(new URL('src/native-route-validation.js',root),'// Generated from pinned PlayStunts by scripts/build-native-validation.mjs; GPL-3.0-only.\n'+result.outputFiles[0].text+'\nexport const nativeRouteCheck=StuntsNativeRoute.check;\n');
writeFileSync(new URL('vendor/native-validation-provenance.json',root),JSON.stringify({repository:'https://github.com/ACatWithEbola/playstunts',commit:'b5180b0a54193974c3b398ec38e6680db99f67cf',license:'GPL-3.0-only',entry:'scripts/native-validation-entry.ts',sources:Object.keys(result.metafile.inputs).filter(p=>p.includes('vendor/playstunts/')).map(p=>({path:p.slice(p.indexOf('vendor/playstunts/')),sha256:createHash('sha256').update(readFileSync(p)).digest('hex')}))},null,2)+'\n');
console.log('Generated offline native route validation.');
