#!/usr/bin/env node
/* node tools/extract_audio.js [原版西班牙文站目錄]
   把原版內嵌 base64 的 mp3 原封不動（bytes 不變、不重新編碼）解到 weekNN-audio/，
   檔名 es_<sha1(文字)前16碼>.mp3（西文 Elvira）／en_<…>.mp3（英文 Jenny），並寫出 weekNN-audio.js（文字 → 路徑）。
   week05 的英文翻譯音檔（原版 week05-en/*.mp3）一併搬進 week05-audio/。可重跑；內容相同就不重寫。 */
const {fs,path,ROOT,REF,WEEKS,sha16,readConst,readRef,refAudio,mapKeys}=require("./lib.js");
let total=0,wrote=0;
function put(file,buf){const p=path.join(ROOT,file);
 if(fs.existsSync(p)){if(fs.readFileSync(p).equals(buf))return;}
 fs.writeFileSync(p,buf);wrote++}
for(const wk of WEEKS){
 const C=refAudio(wk);if(!C)throw new Error("找不到 "+wk+" 的音檔表");
 fs.mkdirSync(path.join(ROOT,wk+"-audio"),{recursive:true});
 const out={},seen={};
 for(const x of mapKeys(wk,Object.keys(C))){
  const m=/^data:audio\/mpe?g;base64,(.*)$/.exec(C[x.k]);if(!m)throw new Error(wk+" 不是 mp3 data URI："+x.k);
  const buf=Buffer.from(m[1],"base64");if(buf.toString("base64")!==m[1])throw new Error(wk+" base64 來回不一致："+x.k);
  const file=wk+"-audio/"+x.lang+"_"+sha16(x.text)+".mp3";
  if(seen[file]){if(!seen[file].equals(buf))throw new Error(wk+" 同一文字有兩份不同音檔："+x.k);}
  else{seen[file]=buf;put(file,buf)}
  if(out[x.key]&&out[x.key]!==file)throw new Error(wk+" key 撞名："+x.key);
  out[x.key]=file}
 if(wk==="week05"){                                           // 例句英文翻譯（原版另外放成檔案）
  const E=readConst(readRef("week05-en.js").replace("Object.assign(window.UNIT_C,","window.EN_C="),"EN_C");
  for(const [text,src] of Object.entries(E)){
   const buf=fs.readFileSync(path.join(REF,src)),file=wk+"-audio/en_"+sha16(text)+".mp3";
   put(file,buf);if(out[text]&&out[text]!==file)throw new Error("week05 英文 key 撞名："+text);out[text]=file}}
 const keys=Object.keys(out);total+=keys.length;
 fs.writeFileSync(path.join(ROOT,wk+"-audio.js"),
  "/* "+wk+" 音檔對照（文字 → mp3）。由 tools/extract_audio.js 從原版內嵌音檔解出，bytes 不變。es_＝西文 Elvira、en_＝英文 Jenny。 */\n"+
  "window.UNIT_C=window.UNIT_C||{};\nObject.assign(window.UNIT_C,{\n"+keys.map(k=>"  "+JSON.stringify(k)+": "+JSON.stringify(out[k])).join(",\n")+"\n});\n");
 console.log(wk+"：對照 "+keys.length+" 筆、mp3 "+fs.readdirSync(path.join(ROOT,wk+"-audio")).filter(f=>f.endsWith(".mp3")).length+" 個")}
console.log("合計對照 "+total+" 筆；本次新寫入 mp3 "+wrote+" 個");
