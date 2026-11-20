#!/usr/bin/env node
/* node tools/gen_week06_audio.js
   單元 6 的音檔不是從原版站解出來的，而是用 edge-tts 產生：西文 es-ES-ElviraNeural → week06-audio/es_<sha16>.mp3、
   英文 en-US-JennyNeural → week06-audio/en_<sha16>.mp3（sha16＝實際念出的文字的 sha1 前 16 位，和 tools/lib.js 相同）。
   讀 week06-data.js，列出所有會被念到的文字（和 tools/check_audio.js 同一套規則），缺的才產生（檔已存在且 ≥ 500 bytes 就跳過，可重跑），
   最後重寫 week06-audio.js（文字 → mp3 對照表）。需要本機有 edge-tts（pip install edge-tts；可用環境變數 EDGE_TTS 指定路徑）。
   語言：lang:"en" 的卡（say／w）與所有 en／exen 欄位＝英文 Jenny；其餘（西文單字、例句、課文、測驗 say、口說答案）＝西文 Elvira。 */
const fs=require("fs"),path=require("path"),vm=require("vm"),crypto=require("crypto"),{execFile}=require("child_process");
const ROOT=path.resolve(__dirname,".."),WK="week06",DIR=path.join(ROOT,WK+"-audio");
const HOME=process.env.HOME||"";const LOCAL=path.join(HOME,".local","bin","edge-tts");
const BIN=process.env.EDGE_TTS||(fs.existsSync(LOCAL)?LOCAL:"edge-tts");
const VOICE={es:"es-ES-ElviraNeural",en:"en-US-JennyNeural"},PAR=4,TRIES=4,MIN=500;
const sha16=t=>crypto.createHash("sha1").update(t,"utf8").digest("hex").slice(0,16);
const plain=s=>s.replace(/\{\d+\|([^}]+)\}/g,"$1").replace(/\s*\[\[[^\]]*\]\]/g,"").replace(/\s+/g," ").trim();
const ctx=vm.createContext({});ctx.window=ctx;vm.runInContext(fs.readFileSync(path.join(ROOT,WK+"-data.js"),"utf8"),ctx,{filename:WK+"-data.js"});
const W=ctx.WEEK,L=new Map();   // key（TTS.play 會拿到的字）→ 語言
const add=(k,lang)=>{if(!k||typeof k!=="string")return;const o=L.get(k);if(o&&o!==lang)throw new Error("同一個 key 兩種語言："+k);L.set(k,lang)};
[...new Set(W.groups.flatMap(g=>g.cards))].forEach(c=>{const lang=c.lang==="en"?"en":"es";
 add(c.say||c.w,lang);(c.parts||[]).forEach(p=>add(p,lang));(c.alt||[]).forEach(p=>add(p,lang));add(c.ex,lang);add(c.exen,"en");add(c.en,"en")});
(W.quiz||[]).forEach(q=>add(q.say,"es"));
(W.texts||[]).forEach(t=>(t.paras||[]).forEach(p=>p.forEach(s=>add(plain(s),"es"))));
(W.decks||[]).forEach(d=>d.items.forEach(it=>{(it.say||it.a).forEach(a=>add(a,"es"));if(d.kind==="qa")add(it.q.replace(/^(Q\d|Question):\s*/,""),"es")}));
(W.lab&&W.lab.say||[]).forEach(s=>add(s,"es"));   // 課文分頁的解說／表格／遊戲（week06-extra.js）
const text=k=>k.replace(/^en:/,"");                           // "en:xxx" 這種前綴 key，念和 hash 的都是 xxx
const jobs=[...L].map(([k,lang])=>({k,lang,t:text(k),rel:WK+"-audio/"+lang+"_"+sha16(text(k))+".mp3"}));
const okFile=f=>fs.existsSync(f)&&fs.statSync(f).size>=MIN;
const tts=j=>new Promise((res,rej)=>{const out=path.join(ROOT,j.rel),tmp=out+".part";
 execFile(BIN,["--voice",VOICE[j.lang],"--text",j.t,"--write-media",tmp],{timeout:60000},(e,so,se)=>{
  if(e||!okFile(tmp)){try{fs.unlinkSync(tmp)}catch(x){}return rej(new Error((e&&e.message)||("檔案太小 "+se)))}
  fs.renameSync(tmp,out);res()})});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{fs.mkdirSync(DIR,{recursive:true});
 const todo=[...new Map(jobs.filter(j=>!okFile(path.join(ROOT,j.rel))).map(j=>[j.rel,j])).values()];let made=0,fail=0,p=0;
 await Promise.all(Array.from({length:PAR},async()=>{while(p<todo.length){const j=todo[p++];let ok=false;
  for(let n=1;n<=TRIES&&!ok;n++){try{await tts(j);ok=true}catch(e){console.log("重試 "+n+"/"+TRIES+"｜"+j.t+"｜"+String(e.message).split("\n")[0]);await sleep(1500*n)}}
  if(ok){made++;console.log("產生 "+j.rel+"｜"+j.lang+"｜"+j.t)}else{fail++;console.log("失敗 "+j.t)}}}));
 const done=jobs.filter(j=>okFile(path.join(ROOT,j.rel)));
 const map={};done.forEach(j=>{map[j.k]=j.rel});
 fs.writeFileSync(path.join(ROOT,WK+"-audio.js"),`/* 單元 6 音檔對照表：要念的文字 → mp3（由 tools/gen_week06_audio.js 用 edge-tts 產生，不是從原版站解出來的）。
   es_ 開頭＝西班牙文 es-ES-ElviraNeural、en_ 開頭＝英文 en-US-JennyNeural；檔名＝語言_<念出的文字 sha1 前 16 位>.mp3。 */
window.UNIT_C=window.UNIT_C||{};Object.assign(window.UNIT_C,${JSON.stringify(map,null,0).replace(/","/g,'",\n"')});
`);
 console.log(WK+"：要念的文字 "+jobs.length+"・新產生 "+made+"・失敗 "+fail+"・對照 "+done.length+" 筆・mp3 "+new Set(done.map(j=>j.rel)).size+" 個");
 process.exit(fail?1:0)})();
