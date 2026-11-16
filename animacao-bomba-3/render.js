// Renderiza os quadros: node render.js test|full <pasta-saida>
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{const [,,mode,outDir]=process.argv;const FPS=30,DUR=27.6;
const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:720,height:1280}});pg.on('pageerror',e=>console.log('ERR',e.message));
await pg.goto('file://'+path.resolve(__dirname,'scene.html'));await pg.waitForFunction('window.ready');await pg.evaluate('document.fonts.ready');
fs.mkdirSync(outDir,{recursive:true});
const idx=mode==='test'?[1,3,4.5,6,7,8,10,12.5,13.6,15,18,20.2,22,24,25.3,26.5,27.3].map(t=>Math.round(t*FPS)):Array.from({length:Math.floor(DUR*FPS)},(_,i)=>i);
let n=0,st=Date.now();
for(const i of idx){const d=await pg.evaluate(([t,i])=>renderAt(t,i),[i/FPS,i]);fs.writeFileSync(path.join(outDir,String(i).padStart(5,'0')+'.jpg'),Buffer.from(d.split(',')[1],'base64'));
 if(++n%100===0)console.log(n,'frames',((Date.now()-st)/n|0)+'ms/frame');}
await b.close();console.log('done',n);})();
