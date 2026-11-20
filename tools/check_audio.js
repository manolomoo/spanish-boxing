#!/usr/bin/env node
/* node tools/check_audio.js
   載入每個 weekNN-data.js＋weekNN-audio.js，列出所有「會被念出來」的文字裡沒有對應 mp3 的（目標 0 缺漏），
   並檢查 mp3 檔存在、對照表沒被用到的項目（僅供參考）、有可跟讀課文／吊人遊戲的單元在 rw.js 的 types 是否一致。 */
const fs=require("fs"),path=require("path"),vm=require("vm"),ROOT=path.resolve(__dirname,"..");
const plain=s=>s.replace(/\{\d+\|([^}]+)\}/g,"$1").replace(/\s*\[\[[^\]]*\]\]/g,"").replace(/\s+/g," ").trim();
const run=(ctx,f)=>vm.runInContext(fs.readFileSync(path.join(ROOT,f),"utf8"),ctx,{filename:f});
const rwc=vm.createContext({window:{},document:{createElement:()=>({}),head:{appendChild(){}}},localStorage:{setItem(){},removeItem(){},getItem(){return null}}});
rwc.window=rwc;run(rwc,"rw.js");const UNITS=rwc.RW.UNITS;
let miss=0,bad=0,total=0,files=0;
fs.readdirSync(ROOT).filter(f=>/^week\d\d-data\.js$/.test(f)).sort().forEach(f=>{const wk=f.slice(0,6),ctx=vm.createContext({});ctx.window=ctx;
 run(ctx,wk+"-audio.js");run(ctx,f);const W=ctx.WEEK,C=ctx.UNIT_C,S=new Map();
 const add=(s,why)=>{if(s&&typeof s==="string"&&!S.has(s))S.set(s,why)};
 const cards=[...new Set(W.groups.flatMap(g=>g.cards))];
 cards.forEach(c=>{const k=c.say||c.w;add(k,"卡 "+c.w);(c.parts||[]).forEach(p=>add(p,"卡 "+c.w+" 分段"));(c.alt||[]).forEach(p=>add(p,"卡 "+c.w+" alt"));add(c.ex,"卡 "+c.w+" 例句");add(c.exen,"卡 "+c.w+" 例句英文");add(c.en,"卡 "+c.w+" 英文翻譯")});
 (W.quiz||[]).forEach(q=>add(q.say,"測驗 "+q.q));
 (W.texts||[]).forEach(t=>(t.paras||[]).forEach(p=>p.forEach(s=>add(plain(s),"課文 "+t.id))));
 (W.decks||[]).forEach(d=>d.items.forEach(it=>{(it.say||it.a).forEach(a=>add(a,"口說 "+d.name));if(d.kind==="qa")add(it.q.replace(/^(Q\d|Question):\s*/,""),"口說題目 "+d.name)}));
 (W.lab&&W.lab.say||[]).forEach(s=>add(s,"課文解說／遊戲"));
 const m=[...S].filter(([s])=>!C[s]);m.forEach(([s,why])=>console.log("缺音檔 "+wk+"｜"+why+"｜"+s));miss+=m.length;total+=S.size;
 const paths=[...new Set(Object.values(C))];paths.forEach(p=>{const fp=path.join(ROOT,p);if(!fs.existsSync(fp)||fs.statSync(fp).size<500){console.log("檔案不存在或太小 "+p);bad++}});files+=paths.length;
 const onDisk=fs.readdirSync(path.join(ROOT,wk+"-audio")).filter(x=>x.endsWith(".mp3")).length;
 const unused=Object.keys(C).filter(k=>!S.has(k));
 const U=UNITS.find(u=>u.id===W.uid),hasStory=(W.texts||[]).some(t=>(t.paras||[]).length>0);
 if(!U){console.log("rw.js 沒有單元 "+W.uid);bad++}
 else{if(hasStory!==U.types.includes("story")){console.log(wk+" 課文可跟讀與 types 的 story 不一致");bad++}if(!!W.hang!==U.types.includes("hang")){console.log(wk+" hang 與 types 不一致");bad++}}
 console.log(wk+"：卡片 "+cards.length+"・要念的文字 "+S.size+"・缺 "+m.length+"｜對照 "+Object.keys(C).length+" 筆・mp3 "+onDisk+" 個・未用到 "+unused.length+(unused.length?"（"+unused.slice(0,6).join("、")+(unused.length>6?"…":"")+"）":""))});
console.log("合計：要念的文字 "+total+"・缺漏 "+miss+"・mp3 "+files+" 個・其他問題 "+bad);
process.exit(miss||bad?1:0);
