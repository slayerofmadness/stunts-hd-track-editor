import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8');
writeFileSync(new URL('src/overview-resources.js',root),'// Generated from vendor/overview-resources.json.gz by scripts/build.mjs. Original Stunts graphics; see THIRD_PARTY_NOTICES.md.\nexport const OVERVIEW_RESOURCE_GZIP = '+JSON.stringify(readFileSync(new URL('vendor/overview-resources.json.gz',root)).toString('base64'))+';\n');
JSON.parse(gunzipSync(readFileSync(new URL('vendor/overview-resources.json.gz',root))).toString());
mkdirSync(new URL('dist/',root),{recursive:true});
const js=['catalog','i18n','terrain','default-track','core','graphics','native-overview','overview-resources','overview','app'].map(p=>read(`src/${p}.js`).replace(/^import .*?;\s*$/gm,'').replace(/^export \{[^}]*\}(?: from [^;]+)?;\s*$/gm,'').replace(/^export /gm,'')).join('\n');
const html=read('src/index.html').replace('<img class="brand-wordmark" src="logo.svg" alt="STUNTS">',read('src/logo.svg').replace('<svg ', '<svg class="brand-wordmark" aria-hidden="true" ').replace(' role="img" aria-labelledby="stunts-logo-title"','')).replace('<link rel="stylesheet" href="style.css">',`<style>${read('src/style.css')}</style>`).replace('<script type="module" src="app.js"></script>',`<script type="module">${js.replace(/<\/script/gi,'<\\/script')}</script>`);
writeFileSync(new URL('dist/index.html',root),html);copyFileSync(new URL('src/favicon.svg',root),new URL('dist/favicon.svg',root));console.log('Built dist/index.html — fully standalone, no network dependencies.');
