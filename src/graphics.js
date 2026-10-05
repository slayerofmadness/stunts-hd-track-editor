// Hand-drawn vector symbols based on the original editor's 16/32-pixel vocabulary.
// Fixed overhead map; illustrative side profiles in the palette for raised ramps.
// No original bitmap data.
const GRAPHICS_CACHE = new Map();
const EDITOR = {grass:'#00a800',road:'#545454',light:'#a8a8a8',white:'#fcfcfc',red:'#fc5454',darkRed:'#a80000',brown:'#a85400',green:'#54fc54',blue:'#5454fc',black:'#000000'};
function editorSymbol(t) {
 const w=(t.rotation%2?t.height:t.width)*64,h=(t.rotation%2?t.width:t.height)*64,cx=w/2;
 const parts=[],{road,light,white,red,darkRed,brown,green,blue,black}=EDITOR;
 let fixedOrientation=false;
 const rect=(x,y,width,height,fill)=>parts.push(`<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}"/>`);
 const path=(d,fill,stroke=null,width=1,extra='')=>parts.push(`<path d="${d}" fill="${fill}"${stroke?` stroke="${stroke}" stroke-width="${width}"`:''} ${extra}/>`);
 const line=(d,color,width=2,extra='')=>path(d,'none',color,width,extra);
 const ellipse=(x,y,rx,ry,fill,stroke=null,width=1)=>parts.push(`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}"${stroke?` stroke="${stroke}" stroke-width="${width}"`:''}/>`);
 const surface=t.surface===2?brown:t.surface===3?white:road;
 const lane=(d,width=20,color=surface)=>line(d,color,width,'stroke-linecap="butt" stroke-linejoin="round"');
 const curb=(d,width=5)=>{line(d,darkRed,width);line(d,red,width,'stroke-dasharray="11 11"');};
 const straight=()=>lane(`M${cx} 0V${h}`);
 const elevated=(solid=false,gap=false,cross=false)=>{
  if(cross)lane('M0 32H64');
  fixedOrientation=true;
  const horizontal=t.rotation%2;
  if(horizontal)parts.push('<g transform="matrix(0 1 1 0 0 0)">');
  rect(4,0,28,64,light);rect(8,0,20,64,road);
  if(solid)rect(32,0,12,64,white);
  else if(gap)path('M32 0H44L36 12V52L44 64H32Z',white);
  else for(const y of[6,26,46]){rect(32,y,12,4,light);rect(32,y+4,12,5,white);}
  if(horizontal)parts.push('</g>');
 };
 if(t.category==='Landschaft'){
  // The original overhead editor uses small illustrative signs for scenery.
  switch(t.variant){
   case 'palm':
    path('M27 18H33V45L37 56H31L27 45Z',brown);
    for(let y=20;y<55;y+=9)rect(y>43?31:27,y,6,4,darkRed);
    path('M29 17L19 13L9 21L12 13L25 8L23 3L29 6L35 1L34 7L43 5L41 11L49 22L41 18L36 12L31 13Z',green);break;
   case 'cact':
    path('M26 56V37H17L12 32V21H20V29H26V12H36V25H42V17H50V31L45 36H36V56Z',green,road,4);line('M31 17V51',EDITOR.grass,1.5);break;
   case 'tree':
    rect(29,43,10,13,brown);path('M34 3L42 13L43 18L49 26L55 40L56 46H9L10 34L16 26L21 20L22 14Z',green,road,4);break;
   case 'tenn':
    rect(20,6,28,50,road);rect(24,10,20,42,green);rect(24,30,20,3,white);break;
   case 'gass':
    rect(8,20,48,27,red);path('M8 20L16 9H54V20Z',road);rect(14,25,15,8,light);rect(37,29,14,18,white);rect(29,37,6,10,light);
    rect(56,13,5,29,darkRed);rect(17,50,5,9,blue);rect(28,50,5,9,blue);rect(14,50,4,5,white);rect(25,50,4,5,white);rect(12,59,25,3,'#fcfc54');break;
   case 'barn':
    path('M13 22L31 5L50 22V50H13Z',red);line('M10 24L31 4L53 24',brown,5);rect(20,24,24,24,white);rect(23,27,18,18,red);line('M23 27L41 45M41 27L23 45',white,2.5);break;
   case 'offi':
    rect(12,18,41,38,light);path('M12 18L20 6H58L53 18Z',road);path('M53 18L58 6V50L53 56Z',white);
    for(let y=23;y<48;y+=8)for(let x=17;x<48;x+=8)rect(x,y,3.5,4,road);rect(29,47,11,9,road);break;
   case 'wind':
    path('M16 34L33 3L49 34V55H16Z',brown);rect(27,44,12,11,darkRed);line('M19 7L46 33M46 7L19 33',white,4);line('M19 11L42 33M42 7L19 30',light,1.5);ellipse(32.5,20,3,3,white);break;
   case 'boat':
    rect(22,22,15,16,road);line('M45 6V47',light,2);path('M5 38H63V56H21Z',brown);path('M4 34L9 37L4 38Z',white);rect(53,25,9,9,light);line('M54 26L61 33M61 26L54 33',white,1.5);break;
   case 'rest':
    rect(8,27,45,23,red);path('M8 27L18 15H53V27Z',road);rect(14,34,13,9,light);rect(32,34,13,9,light);rect(48,35,9,15,brown);rect(8,51,52,7,road);rect(55,13,3,43,white);rect(48,8,15,13,white);
    for(let y=10;y<19;y+=4)for(let x=50;x<62;x+=4)rect(x,y,2,2,(x+y)%8===0?'#a800a8':red);break;
  }
  // Building facings change inside the fixed overhead editor, as in the original.
  const scenery=parts.join('');
  return {parts:t.rotation?`<g transform="rotate(${t.rotation*90} 32 32)">${scenery}</g>`:scenery,w,h,rotate:false};
 }
 if(['scp','scd','sci','stp','std','sti','stb','stv'].includes(t.family)){
  const small=w===64,r=small?32:96,d=`M0 ${h-r}A${r} ${r} 0 0 1 ${r} ${h}`;
  if(t.family==='stv'){lane(d,26,light);}
  lane(d);
  if(t.family==='stv')for(let i=1;i<8;i++){
   const angle=i*Math.PI/16,outer=r-12,inner=r-25;
   line(`M${Math.sin(angle)*outer} ${h-Math.cos(angle)*outer}L${Math.sin(angle)*inner} ${h-Math.cos(angle)*inner}`,white,5);
  }
  if(t.family==='stb')curb(`M0 ${h-r-13}A${r+13} ${r+13} 0 0 1 ${r+13} ${h}`,8);
  else if(!small&&t.surface===1){const inner=r-12;line(`M${inner*.38} ${h-inner*.925}A${inner} ${inner} 0 0 1 ${inner*.95} ${h-inner*.312}`,white,3,'stroke-dasharray="6 6"');line(`M${inner*.38} ${h-inner*.925}A${inner} ${inner} 0 0 1 ${inner*.95} ${h-inner*.312}`,red,3,'stroke-dasharray="6 6" stroke-dashoffset="6"');}
 }else if(['offl','offr','sofl','sofr'].includes(t.variant)){
  const left=t.variant.endsWith('l');
  if(w===128){
   if(!left)parts.push('<g transform="translate(128 0) scale(-1 1)">');
   lane('M0 32A96 96 0 0 1 96 128');lane('M96 0V92');
   if(t.surface===1){line('M32 50A84 84 0 0 1 80 102',white,3,'stroke-dasharray="6 6"');line('M32 50A84 84 0 0 1 80 102',red,3,'stroke-dasharray="6 6" stroke-dashoffset="6"');}
   if(!left)parts.push('</g>');
  }else{straight();lane(left?'M12 28L32 48':'M52 28L32 48');}
 }else switch(t.family){
  case 'sch':{
   const sign=t.variant==='chi1'?1:-1;lane(`M${cx-sign*32} 0C${cx-sign*32} 52 ${cx+sign*32} 76 ${cx+sign*32} ${h}`);break;}
  case 'slp':
   lane('M32 0C32 29 49 45 49 61C49 82 24 87 24 96C24 108 32 117 32 128');
   path('M13 39H34L54 89H33Z',light);for(let i=0;i<5;i++)rect(23+i*4,44+i*9,3,3,brown);break;
  case 'sco':{
   const right=t.variant.startsWith('rco'),mirror=right?'translate(128 0) scale(-1 1)':'';
   parts.push(`<g transform="${mirror}">`);
   line('M18 0V59C18 93 38 101 58 101C90 101 93 75 93 64C93 39 79 31 63 31C47 31 38 39 38 51',light,25);
   lane('M18 0V59C18 93 38 101 58 101C90 101 93 75 93 64C93 39 79 31 63 31C47 31 38 39 38 51');
   lane('M30 105V128');line('M31 1V60',light,3);for(const y of[6,26]){rect(33,y,11,4,light);rect(33,y+4,11,4,white);}parts.push('</g>');break;}
  case 'svc':
   straight();path('M20 18H32L46 76V102H35L20 44Z',light);for(let i=0;i<7;i++)rect(25+i*2.4,22+i*12,3,3,i%2?brown:'#fcfc54');break;
  case 'sre':elevated();break;
  case 'ses':elevated(true);break;
  case 'sex':elevated(false,true);break;
  case 'seu':elevated(false,true,true);break;
  case 'sra':case 'ssr':{
   // Straight overhead footprint: north is the raised end before tile rotation.
   // Discrete piers distinguish an open bridge ramp from a filled concrete wedge.
   if(t.family==='ssr'){
    path('M13 0H22V64Z',light);path('M42 0H51L42 64Z',white);
    line('M51 0L42 64',light,1.5);
   }else for(const [y,length]of[[6,8],[28,5]]){
    rect(42,y,length,7,light);rect(42+length-2,y,2,7,white);
   }
   rect(22,0,20,64,road);
   // Rising deck gets lighter towards its raised edge without shifting the road.
   for(let i=0;i<8;i++){
    const value=Math.round(128-i*44/7).toString(16).padStart(2,'0');
    rect(22,i*8,20,8,'#'+value.repeat(3));
   }
   line('M22 0V58M42 0V58',light,1.2);line('M22 2H42',white,2);
   line('M27 34L32 29L37 34',white,1.8,'stroke-linejoin="round"');
   break;}
  case 'sbr':
   // The original brid model is a rising deck with a tall frame at its high end.
   // Straight blue braces replace the misleading hanging-cable curves.
   straight();line('M22 0V64M42 0V64',light,2);
   line('M17 4H47M17 4V22M47 4V22',blue,4);
   line('M17 4L22 35M47 4L42 35',blue,2.5);
   line('M27 40L32 35L37 40',white,1.8,'stroke-linejoin="round"');break;
  case 'sub':{
   const left=t.variant==='rban',d=left?'M43 0C43 26 32 39 32 64':'M21 0C21 26 32 39 32 64';lane(d,22);curb(left?'M29 0C29 24 22 39 22 49':'M35 0C35 24 42 39 42 49',6);break;}
  case 'sbs':
   lane('M21 0V64');curb('M35 0V64',8);break;
  case 'stu':
   rect(25,0,20,64,black);rect(17,5,34,49,light);rect(21,5,26,38,road);rect(51,9,5,40,light);path('M17 43H51V57H43V53Q34 43 25 53V57H17Z',white);path('M25 64V55Q34 43 43 55V64Z',black);break;
  case 'spi':
   straight();rect(16,0,36,46,light);for(const x of[20,29,40,48])rect(x,0,3,46,road);path('M13 58Q13 41 34 40Q55 41 55 58',white,white,3);path('M20 64V54Q20 44 34 44Q48 44 48 54V64Z',black);break;
  case 'sps':
   straight();path('M13 0H55L46 53H22Z',white);path('M19 0H49L41 55H27Z',road);for(const x of[25,34,43])line(`M${x} 0L${32+(x-32)*.55} 54`,light,3);break;
  case 'sph':
   straight();rect(16,0,36,56,light);for(const x of[20,29,40,48])rect(x,0,3,52,road);path('M15 55Q34 42 53 55',white,white,3);path('M21 60V54Q34 46 47 54V60Z',black);rect(21,60,26,4,brown);break;
  case 'srw':
   rect(7,0,20,64,road);rect(39,0,20,64,road);rect(27,0,12,64,green);for(const y of[17,45]){rect(27,y,12,11,EDITOR.grass);path(`M33 ${y+2}L38 ${y+9}H31Z`,green);}break;
  case 'sgw':
   path('M7 0H59V18L42 52V64H22V52L7 18Z',road);path('M27 0H39V15L34 25H32L27 15Z',green);break;
  default:
   straight();
   if(['sip','sid','sii'].includes(t.family))lane('M0 32H64');
   if(t.family==='sst'){
    for(let row=0;row<3;row++)for(let col=0;col<9;col++)if((row+col)%2===0)rect(14+col*4,25+row*4,4,4,white);
    path('M32 40L24 48H29V55H35V48H40Z',white);
   }
   if(t.family==='srb'){rect(22,17,12,4,white);rect(30,41,12,4,white);}
 }
 return {parts:parts.join(''),w,h,rotate:!fixedOrientation};
}
function raisedSideProfile(t){
 const {road,light,white,blue}=EDITOR;
 const solid=t.family==='ssr',bridge=t.family==='sbr';
 // A stable side view explains height; the compass arrow shows the map direction.
 // The high end is always on the right in this illustrative profile.
 const support=solid?`<path d="M7 51L56 26V58H7Z" fill="${light}"/><path d="M46 32L56 26V58H46Z" fill="${white}"/>`:
  `<path d="M30 40H35V58H30ZM51 28H57V58H51Z" fill="${light}"/><path d="M35 40V58M57 28V58" stroke="${white}" stroke-width="2"/>`;
 const frame=bridge?`<path d="M53 6V28M59 6V28M53 6H59M53 6L31 40M59 6L38 40" fill="none" stroke="${blue}" stroke-width="2.5" stroke-linejoin="round"/>`:'';
 return `<path d="M3 59H61" stroke="#54fc54" stroke-width="2"/>${support}<path d="M6 47L52 23H59V29H53L7 53Z" fill="${road}"/><path d="M6 47L52 23H59" fill="none" stroke="${white}" stroke-width="2"/>${frame}<g transform="translate(13 13) rotate(${t.rotation*90})"><path d="M0 8V-7M-5 -2L0 -7L5 -2" fill="none" stroke="#fff47a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></g>`;
}
export function classicTileIcon(t,view='palette'){
 const key=`${t?.id||0}:${view}`;if(GRAPHICS_CACHE.has(key))return GRAPHICS_CACHE.get(key);
 if(!t||!t.id)return '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="m18 42 23-25 13 12-22 25H18L8 44l9-10" fill="none" stroke="#d9ef80" stroke-width="4"/></svg>';
 const model=editorSymbol(t),W=t.width*64,H=t.height*64;
 // Rotation belongs to the selected TRK orientation only. Both views share exact bounds.
 const transform=model.rotate?`translate(${W/2} ${H/2}) rotate(${t.rotation*90}) translate(${-model.w/2} ${-model.h/2})`:'';
 let background='';if(view==='palette'){
  background=`<rect width="${W}" height="${H}" fill="${EDITOR.grass}"/>`;
  for(let x=64;x<W;x+=64)background+=`<path d="M${x} 0V${H}" stroke="#000" stroke-width="1.5"/>`;
  for(let y=64;y<H;y+=64)background+=`<path d="M0 ${y}H${W}" stroke="#000" stroke-width="1.5"/>`;
 }
 const side=view==='palette'&&['sra','ssr','sbr'].includes(t.family);
 const result=`<svg viewBox="0 0 ${W} ${H}" aria-hidden="true" class="classic-tile" data-view="${side?'side':'top'}">${background}<g transform="${side?'':transform}">${side?raisedSideProfile(t):model.parts}</g></svg>`;
 GRAPHICS_CACHE.set(key,result);return result;
}
