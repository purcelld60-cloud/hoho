const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{const [,,mode,outDir]=process.argv;
const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:720,height:1280}});pg.on('pageerror',e=>console.log('ERR',e.message));pg.on('console',m=>m.type()==='error'&&console.log('CONSOLE',m.text()));
await pg.goto('file://'+path.resolve(__dirname,'scene.html'));await pg.waitForFunction('window.ready');await pg.evaluate('document.fonts.ready');
fs.mkdirSync(outDir,{recursive:true});
const times=mode==='test'?[1,3,5,7.6,9.6,11.5,15,16,18,21,24.5,27.6,30.5,33.5,35.6,37.2,39,41.8,44,46.5,50.5]:Array.from({length:Math.ceil(52.09*30)},(_,i)=>i/30);
let n=0,st=Date.now();
for(const t of times){const d=await pg.evaluate(t=>renderAt(t),t);fs.writeFileSync(path.join(outDir,(mode==='test'?'t'+t:String(n).padStart(5,'0'))+'.jpg'),Buffer.from(d.split(',')[1],'base64'));n++;
 if(n%100===0)console.log(n,'frames',((Date.now()-st)/n|0)+'ms/frame');}
await b.close();console.log('done',n);})();
