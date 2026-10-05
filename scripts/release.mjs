import {readFileSync,mkdirSync,copyFileSync,writeFileSync,readdirSync,statSync} from 'node:fs';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';import path from 'node:path';import {fileURLToPath} from 'node:url';import {demo,encode} from '../src/core.js';
const root=path.resolve(fileURLToPath(new URL('../',import.meta.url))),version=JSON.parse(readFileSync(path.join(root,'package.json'),'utf8')).version,release=path.join(root,'release'),webName=`stunts-hd-track-editor-v${version}-web`,sourceName=`stunts-hd-track-editor-v${version}-source`;
mkdirSync(release,{recursive:true});
function copy(src,dest){mkdirSync(path.dirname(dest),{recursive:true});copyFileSync(src,dest);}
const web=path.join(release,webName),source=path.join(release,sourceName);mkdirSync(web,{recursive:true});mkdirSync(source,{recursive:true});
for(const f of ['index.html','favicon.svg'])copy(path.join(root,'dist',f),path.join(web,f));
for(const f of ['LICENSE','THIRD_PARTY_NOTICES.md','README.md','README.de.md','UPDATE.de.md'])copy(path.join(root,f),path.join(web,f));
copy(path.join(root,'docs/editor-preview.jpg'),path.join(web,'docs/editor-preview.jpg'));
writeFileSync(path.join(web,'DEMO.TRK'),encode(demo()));
function tree(from,to){for(const f of readdirSync(from)){const a=path.join(from,f),b=path.join(to,f);if(statSync(a).isDirectory()){mkdirSync(b,{recursive:true});tree(a,b);}else copy(a,b);}}
for(const folder of ['src','dist','scripts','tests','docs']){mkdirSync(path.join(source,folder),{recursive:true});tree(path.join(root,folder),path.join(source,folder));}
for(const file of ['README.md','README.de.md','UPDATE.de.md','LICENSE','THIRD_PARTY_NOTICES.md','CHANGELOG.md','RELEASE_NOTES.md','package.json','.gitignore'])copy(path.join(root,file),path.join(source,file));
for(const name of [webName,sourceName])execFileSync('/usr/bin/zip',['-q','-r',name+'.zip',name],{cwd:release});
const checks=[webName,sourceName].map(n=>`${createHash('sha256').update(readFileSync(path.join(release,n+'.zip'))).digest('hex')}  ${n}.zip`).join('\n')+'\n';writeFileSync(path.join(release,'SHA256SUMS.txt'),checks);console.log(checks);
