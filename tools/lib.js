/* tools 共用：從原版西班牙文站（唯讀參考）讀出 inline 的 JSON 常數。 */
const fs=require("fs"),path=require("path"),crypto=require("crypto");
const ROOT=path.resolve(__dirname,"..");
const REF=path.resolve(process.argv[2]||process.env.SB_REF||path.join(ROOT,"..","sb-ref","spanish"));
const WEEKS=["week00","week01","week02","week03","week04","week05"];
const sha16=t=>crypto.createHash("sha1").update(t,"utf8").digest("hex").slice(0,16);
/* 在 src 裡找 `const NAME=` 或 `window.NAME =`，用括號配對切出後面的 JSON 字面值並解析 */
function readConst(src,name){
 const m=new RegExp("(?:const\\s+"+name+"|window\\."+name+")\\s*=\\s*").exec(src);if(!m)return undefined;
 let p=m.index+m[0].length;const open=src[p];if(open!=="{"&&open!=="[")return undefined;
 let depth=0,inStr=false,q=p;
 for(;q<src.length;q++){const ch=src[q];
  if(inStr){if(ch==="\\"){q++;continue}if(ch==='"')inStr=false;continue}
  if(ch==='"'){inStr=true;continue}
  if(ch==="{"||ch==="[")depth++;else if(ch==="}"||ch==="]"){depth--;if(!depth){q++;break}}}
 return JSON.parse(src.slice(p,q))}
const readRef=f=>fs.readFileSync(path.join(REF,f),"utf8");
/* 原版每單元的音檔表：key → data URI（week01/02 在 html 的 const C，其餘在 weekNN-audio.js 的 window.UNIT_C） */
function refAudio(wk){const f=path.join(REF,wk+"-audio.js");
 return fs.existsSync(f)?readConst(fs.readFileSync(f,"utf8"),"UNIT_C"):readConst(readRef(wk+".html"),"C")}
/* 原版 key → 新站 {key 對照表用的文字, text 實際念的文字, lang}。
   西文一律用純文字當 key；英文也用純文字，只有和同單元西文撞字（singular／plural）時 key 加 "en:" 前綴。 */
const classify=(wk,k)=>{
 if(k.startsWith("en:"))return{k,text:k.slice(3),lang:"en"};
 if(k.startsWith("ex:"))return{k,text:k.slice(3),lang:"es"};
 if(/_en$/.test(k))return{k,text:k.slice(0,-3),lang:"en"};
 if(wk==="week05"&&(/^(masculine|feminine)$/.test(k)||/^The /.test(k)))return{k,text:k,lang:"en"};
 return{k,text:k,lang:"es"}};
const ES={};
function mapKeys(wk,keys){
 if(!ES[wk])ES[wk]=new Set(Object.keys(refAudio(wk)).map(k=>classify(wk,k)).filter(x=>x.lang==="es").map(x=>x.text));
 return keys.map(k=>{const x=classify(wk,k);x.key=x.lang==="en"&&ES[wk].has(x.text)?"en:"+x.text:x.text;return x})}
module.exports={fs,path,ROOT,REF,WEEKS,sha16,readConst,readRef,refAudio,mapKeys};
