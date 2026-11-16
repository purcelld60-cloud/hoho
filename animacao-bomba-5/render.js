// Renderiza os quadros: node render.js test|full <pasta-saida>
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{const [,,mode,outDir]=process.argv;const FPS=30,DUR=60.69;
const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:720,height:1280}});pg.on('pageerror',e=>console.log('ERR',e.message));
await pg.goto('file://'+path.resolve(__dirname,'scene.html'));await pg.waitForFunction('window.ready');await pg.evaluate('document.fonts.ready');
fs.mkdirSync(outDir,{recursive:true});
const idx=mode==='test'?[8.5,11,13.5,15.5,17,19,21.5,23,27,30,33,40,41.5,42.2,43.5,46.8,48.5,50,51.8,53.5,55,57,58.5].map(t=>Math.round(t*FPS)):Array.from({length:Math.floor(DUR*FPS)},(_,i)=>i);
let n=0,st=Date.now();
for(const i of idx){const d=await pg.evaluate(t=>renderAt(t),i/FPS);fs.writeFileSync(path.join(outDir,String(i).padStart(5,'0')+'.jpg'),Buffer.from(d.split(',')[1],'base64'));
 if(++n%100===0)console.log(n,'frames',((Date.now()-st)/n|0)+'ms/frame');}
await b.close();console.log('done',n);})();
