#!/usr/bin/env node
/* node tools/build_data.js [原版西班牙文站目錄]
   從原版 weekNN.html 讀出每一張卡、分組、測驗題、口說題、短文與 Twemoji 圖示，
   轉成新站的 weekNN-data.js（window.WEEK）與 weekNN-icons.js（window.ICONS／window.PIC）。可重跑。
   課文分頁（texts）的文法說明取自原版每單元頂部的「本單元重點」說明框。 */
const {fs,path,ROOT,WEEKS,readConst,readRef,mapKeys}=require("./lib.js");
const J=x=>JSON.stringify(x);
const keyMap=(wk,keys)=>mapKeys(wk,keys);
const k1=(wk,k)=>mapKeys(wk,[k])[0].key;
/* 原版 pic [code, 張數]／色塊 col → 新站 pic */
const picOf=c=>c.col||(c.pic&&c.pic[0]==="sw")?["sw",1,c.col||"#ccc"]:[c.pic[0],Math.min(c.pic[1]||1,3)];
const tagOf=a=>(/^un/i.test(a)?"不定冠詞":"定冠詞")+"・"+(/^(la|las|una|unas)$/i.test(a)?"陰性":"陽性")+"・"+(/s$/i.test(a)?"複數":"單數");
const INTRO={title:"本單元重點",tag:"文法說明（只顯示、不念）"};

/* ---------- 單元 1、2：冠詞＋名詞 ---------- */
function articles(wk,n){
 const src=readRef(wk+".html"),W=readConst(src,"W"),G=readConst(src,"G"),IM=readConst(src,"IM"),S=readConst(src,"S"),SV=readConst(src,"SV");
 const cards=W.map(([a,nn,zh])=>({w:a+" "+nn,zh,pos:tagOf(a),alt:[nn],pic:[IM[nn][0],Math.min(IM[nn][1],3)]}));
 const SH={"定冠詞 el/la/los/las":"定冠詞","不定冠詞 un/una/unos/unas":"不定冠詞","全部":"全部"};
 const groups=G.map(([name,a,b])=>({name,short:SH[name]||name,o:["念單字","只念名詞"],range:[a,b]}));
 const quiz=W.map(([a,nn,zh])=>({q:"___ "+nn,z:zh,o:/^un/i.test(a)?["un","una","unos","unas"]:["el","la","los","las"],a:a.toLowerCase(),say:a+" "+nn,show:a+" "+nn}));
 const items=[];
 if(wk==="week01")items.push({q:"照片裡有一隻狗。",a:["Hay un perro en la foto."],pic:[IM["perro"][0],1]});
 W.forEach(([a,nn,zh],k)=>{if(/^un/i.test(a))items.push({q:"照片裡有"+zh+"。",a:["Hay "+a.toLowerCase()+" "+nn+" en la foto."],pic:cards[k].pic})});
 const texts=[{id:"key",title:"本單元重點：冠詞 Artículos",tag:INTRO.tag,html:[
  "<b>定冠詞 Definidos</b>（這個／那個）：陽性單數 <b>el</b>、陰性單數 <b>la</b>、陽性複數 <b>los</b>、陰性複數 <b>las</b>",
  "<b>不定冠詞 Indefinidos</b>（一個／一些）：陽性單數 <b>un</b>、陰性單數 <b>una</b>、陽性複數 <b>unos</b>、陰性複數 <b>unas</b>",
  "<span class=\"mu\">小撇步：名詞多半 -o 結尾是陽性、-a 結尾是陰性；複數加 -s。</span>",
  "口說句型：<b>Hay ________ en la foto.</b>（照片裡有 ____。）用不定冠詞造句。"],paras:[]}];
 const o={uid:"u"+n,n,name:n===1?"冠詞":"冠詞＋單字",autoQuiz:true,cards,groups,quiz,
  decks:[{name:"Hay ___ en la foto.",kind:"say",lab:"看提示，用不定冠詞說「Hay ________ en la foto.」：",items}],texts};
 if(S){o.hang=true;texts.push({id:"pepe",title:"短文：Un día de playa con Pepe",tag:"短文跟讀・點每一句聽發音，跟著念",paras:[S.map(s=>s[0])],zh:[S.map(s=>s[1])],
  note:"「全文連播」會一句接一句；「回音法逐句」每句後留回音與跟讀時間。"})}
 return{o,SV}}

/* ---------- 單元 0、3、4、5：原版 G / Q / D 結構 ---------- */
function generic(wk,n){
 const src=readRef(wk+".html"),G=readConst(src,"G"),Q=readConst(src,"Q"),D=readConst(src,"D"),SV=readConst(src,"SV"),EXEN=readConst(src,"EXEN")||{};
 const cards=[],groups=[];
 const SH={"術語卡（西文）":"西文術語","術語卡（英文）":"英文術語","例句標詞性":"例句詞性","10 個動詞":"動詞","陰性 vs 陽性":"陰陽性","Pronuncia 短語":"Pronuncia","更多形容詞":"形容詞","Ser + 形容詞":"Ser+形容詞"};
 G.forEach(([name,L])=>{const a=cards.length;
  L.forEach(c=>{const mk=keyMap(wk,c.keys),card={w:c.es};
   if(wk==="week00"){                                         // 卡的 key＝第一段；西文術語卡後面的 ex: 是例字，各自一個回音週期
    if(mk[0].key!==c.es)card.say=mk[0].key;if(mk[0].lang==="en")card.lang="en";
    card.zh=c.zh;card.pos=c.tag;
    const ps=[...new Set(mk.map(x=>x.key))];if(ps.length>1){card.parts=ps;card.exs=ps.slice(1)}
    if(name==="例句標詞性")card.tg="例句・標詞性"}
   else if(wk==="week05"){                                     // 卡的 key＝第一段；第二段是例句（ex），英文翻譯另列（exen／en）
    if(mk[0].key!==c.es)card.say=mk[0].key;if(mk[0].lang==="en")card.lang="en";
    card.zh=c.zh;card.pos=c.tag;const tag=c.tag||"";
    if(c.keys.length>1)card.ex=c.keys[1];
    if(tag.startsWith("例：")){card.pos="形容詞";if(tag.slice(2)!==card.ex)throw new Error("例句不一致 "+c.es)}
    else if(tag==="例句｜西文"){if(EXEN[c.es])card.en=EXEN[c.es]}
    else{const i=tag.lastIndexOf("｜");if(i>=0&&/[.!?]/.test(tag.slice(i+1))){card.pos=tag.slice(0,i);if(tag.slice(i+1).trim()!==card.ex)throw new Error("例句不一致 "+c.es)}}
    if(card.ex&&EXEN[card.ex])card.exen=EXEN[card.ex]}
   else{                                                       // week03／04：卡的 key＝最後一段（同原版），每一段各自一個回音週期
    const last=mk[mk.length-1].key,two=c.keys.length>1&&c.keys[0]!==c.es&&!c.es.includes("→");
    if(two)card.w=c.keys[0]+" "+c.es;
    if(last!==card.w)card.say=last;
    card.zh=c.zh;card.pos=c.tag;
    if(two){card.pos="照片造句"+(/講義例句/.test(c.tag)?"・講義例句":"");card.tg=card.pos}
    if(mk.length>1)card.parts=mk.map(x=>x.key)}
   card.pic=picOf(c);cards.push(card)});
  const g={name,short:SH[name]||name,range:[a,cards.length]};
  if(name==="10 個動詞"||name==="現在分詞")g.o=["念動詞","念現在分詞"];
  if(name==="照片造句")g.o=["念第一句","念第二句"];
  groups.push(g)});
 const quiz=Q.map(q=>{const r={q:q.q,z:q.z,o:q.o,a:q.a,say:k1(wk,q.say)};if(wk!=="week00")r.show=q.say;return r});
 const item=d=>{const r={q:d.q};
  if(d.keys){const mk=keyMap(wk,d.keys);r.a=[d.show||mk[0].text];if(mk.some((x,i)=>x.key!==r.a[i]))r.say=mk.map(x=>x.key)}
  else r.a=d.pre?[d.pre,d.a]:[d.a];
  r.pic=picOf(d);return r};
 let decks,texts,name;
 if(wk==="week00"){name="文法術語 Gramática";
  const es=D.filter(d=>/（西）$/.test(d.q)),en=D.filter(d=>/（英）$/.test(d.q)),se=D.filter(d=>/^跟讀並想詞性/.test(d.q));
  if(es.length+en.length+se.length!==D.length)throw new Error("week00 口說題分類不完整");
  decks=[{name:"術語（西文）",kind:"say",lab:"看到中文，先自己用西班牙文說說看：",items:es.map(item)},
         {name:"術語（英文）",kind:"say",lab:"看到中文，先自己用英文說說看：",items:en.map(item)},
         {name:"例句詞性",kind:"say",lab:"先大聲念這句，再想每個字的詞性：",items:se.map(item)}];
  const S=G[2][1];
  texts=[{id:"key",title:"本單元是工具單元：文法術語 Gramática",tag:INTRO.tag,html:[
   "學語言時會一直碰到這些「講文法的詞」。西文卡與英文卡<b>已分開</b>：西文卡（Elvira＋例子）、英文卡（Jenny）各自回音法，並附重音提示與繁中。",
   "建議先用「術語卡（西文）」再練「術語卡（英文）」，最後看「例句標詞性」；小測驗有西↔中↔英與詞性判斷。",
   "<span class=\"mu\">註：frase 在課堂上有時等同 oración（句子），有時指片語；這裡兩種都列。acento 可指重音符號（él）或重讀位置（fácil）。</span>"],paras:[]},
   {id:"pos",title:"例句標詞性",tag:"可跟讀・每句後面是逐字的詞性",paras:S.map(c=>[c.es+" [["+c.tag+"]]"]),zh:S.map(c=>[c.zh])}]}
 if(wk==="week03"){name="動詞 Verbos 1";
  decks=[{name:"替換主詞說動詞",kind:"say",lab:"換一個主詞，先自己大聲說：",items:D.map(item)}];
  texts=[{id:"key",title:"本單元重點：現在式動詞變化＋現在分詞",tag:INTRO.tag,html:[
   "西班牙文動詞會依「誰在做」改變字尾。規則動詞：<br>-ar（hablar）：-o, -as, -a, -amos, -áis, -an<br>-er（leer）：-o, -es, -e, -emos, -éis, -en",
   "不規則要背：estar → estoy；hacer → hago；jugar → juego（u→ue）；vestir → visto（e→i）；coger → cojo（g→j 保持發音）。",
   "現在分詞（Gerundio，＝英文 -ing）：-ar → -ando；-er/-ir → -iendo；leer → leyendo、vestir → vistiendo。",
   "<span class=\"mu\">註：講義寫 vosotros「véis」，標準拼法是 veis（單音節不加重音），這裡用 veis。Ella / Él 的發音示範會念「ella…, él…」。</span>"],paras:[]}]}
 if(wk==="week04"){name="Estar + Gerundio";
  decks=[{name:"看圖說兩句",kind:"say",join:" ",lab:"看圖，先自己大聲說兩句：",items:D.map(item)}];
  const P=G[2][1],sp=z=>{const i=z.indexOf("。");return[z.slice(0,i+1),z.slice(i+1)]};
  texts=[{id:"key",title:"本單元重點：Estar + Gerundio（正在做…）",tag:INTRO.tag,html:[
   "公式：主詞 + <b>estar</b>（依人稱變化）+ <b>現在分詞</b>，＝英文 be + -ing。",
   "例：Hay un niño en la foto. El niño <b>está cogiendo</b> la pelota.（照片裡有一個男孩。男孩正在拿球。）",
   "單數主詞用 está，複數用 están；現在分詞不隨主詞變化。",
   "<span class=\"mu\">造句練習用的名詞都來自第一、二單元的單字。</span>"],paras:[]},
   {id:"foto",title:"照片造句：Hay … en la foto. … está / están …",tag:"可跟讀・每組兩句",paras:P.map(c=>c.keys.slice()),zh:P.map(c=>sp(c.zh))}]}
 if(wk==="week05"){name="Ser + 形容詞・顏色";
  const by=re=>D.filter(d=>re.test(d.q)),a=by(/^大聲說/),b=by(/^用 Ser 說/),c=D.filter((d,i)=>/^跟讀/.test(d.q)&&i<28),e=D.slice(28);
  if(a.length+b.length+c.length+e.length!==D.length)throw new Error("week05 口說題分類不完整");
  decks=[{name:"顏色短語",kind:"say",lab:"看到中文，先自己用西班牙文說說看：",items:a.map(item)},
         {name:"Ser 變位",kind:"say",lab:"用 Ser 造一句，先自己說說看：",items:b.map(item)},
         {name:"Ser + 形容詞",kind:"say",lab:"看到中文，先自己用西班牙文說說看：",items:c.map(item)},
         {name:"陰性 vs 陽性",kind:"say",lab:"先自己說說看：",items:e.map(item)}];
  const SER=G[5][1];
  texts=[{id:"key",title:"本單元重點：Ser + 形容詞・顏色（性數一致）",tag:INTRO.tag,html:[
   "形容詞必須和修飾的名詞在<b>性別</b>（陽／陰）和<b>數量</b>（單／複）上一致。",
   "顏色：rojo/a/os/as、azul/azules、verde/s、amarillo/a/os/as、rosa/s、naranja/s、negro/a/os/as、blanco/a/os/as。",
   "另有「陰性 vs 陽性」：masculino/femenino（西）與 masculine/feminine（英）及例句。",
   "動詞 <b>Ser</b>（表示身分、本質、固定特徵）：yo <b>soy</b>、tú <b>eres</b>、él/ella <b>es</b>、nosotros/as <b>somos</b>、vosotros/as <b>sois</b>、ellos/as <b>son</b>。",
   "<span class=\"mu\">註：講義「El es bueno」標準寫法是 <b>Él</b> es bueno（人稱代詞加重音）。「el agua」雖用陽性冠詞，但 agua 是陰性，形容詞仍用陰性（el agua fría）。</span>"],paras:[]},
   {id:"conc",title:"性數一致：講義例句",tag:"可跟讀",paras:[["Los profesores buenos leen unos libros malos. [[buenos 配 profesores、malos 配 libros（陽性複數）]]","Hay una niña buena en la playa blanca. [[buena 配 niña、blanca 配 playa（陰性單數）]]"]]},
   {id:"ser",title:"動詞 Ser 變位表",tag:"可跟讀・每個人稱一句變位＋一句例句（括號是英文翻譯）",
    paras:SER.map(c=>{const ex=c.keys[1];return[c.es+" [["+c.zh+"｜"+c.tag.split("｜")[0]+"]]",ex+(EXEN[ex]?" [["+EXEN[ex]+"]]":"")]})}]}
 return{o:{uid:"u"+n,n,name,cards,groups,quiz,decks,texts},SV}}

/* ---------- 輸出 ---------- */
const HEAD=`   卡片欄位：w 顯示的字、say 這張卡的音檔 key（預設同 w；也是練習紀錄的 key）、lang "en"＝英文卡（Jenny），其餘西文（Elvira）、
   zh 中文、pos 標籤、tg 小卡標籤（預設同 pos）、parts 回音法要分開各走一輪的每一段（預設只有 say）、exs 顯示用的例字、
   alt「只念名詞」等第二顆按鈕念的字（不進回音週期）、ex 例句、exen 例句英文翻譯、en 這張卡本身的英文翻譯（英文翻譯只顯示＋單次念，不進回音週期）
   quiz 是原版的測驗題（教學內容，勿刪）；autoQuiz＝另外自動出「西文↔中文」題。decks 口說練習；texts 課文分頁（html＝只顯示的文法說明、paras＝可跟讀的句子，[[…]]＝只顯示不念）`;
function emit(wk,o,SV){
 const used=new Set(),I={};
 const usePic=p=>{if(p[0]!=="sw"){if(!SV[p[0]])throw new Error(wk+" 缺圖示 "+p[0]);used.add(p[0])}return p};
 o.cards.forEach(c=>{const p=usePic(c.pic);delete c.pic;const k=c.w in I&&J(I[c.w])!==J(p)?(c.say||c.w):c.w;I[k]=p});
 o.decks.forEach(d=>d.items.forEach(it=>usePic(it.pic)));
 const keys=o.cards.map(c=>c.say||c.w);if(new Set(keys).size!==keys.length)throw new Error(wk+" 卡片 key 重複："+keys.filter((k,i)=>keys.indexOf(k)!==i));
 const qk=o.quiz.map(q=>q.z+"|"+q.q+"|"+q.a);if(new Set(qk).size!==qk.length)throw new Error(wk+" 測驗題 key 重複");
 let s="/* 單元 "+o.n+"｜"+o.name+"（由 tools/build_data.js 從原版課程資料轉出）\n"+HEAD+" */\n";
 s+="window.WEEK=(function(){\nconst C=[\n"+o.cards.map(c=>" "+J(c)).join(",\n")+"];\nreturn {uid:"+J(o.uid)+",n:"+o.n+",name:"+J(o.name)+(o.autoQuiz?",autoQuiz:true":"")+(o.hang?",hang:true":"")+",\ngroups:[\n"+
  o.groups.map(g=>" {name:"+J(g.name)+",short:"+J(g.short)+(g.o?",o:"+J(g.o):"")+",cards:C.slice("+g.range[0]+","+g.range[1]+")}").join(",\n")+"],\nquiz:[\n"+
  o.quiz.map(q=>" "+J(q)).join(",\n")+"],\ndecks:[\n"+
  o.decks.map(d=>{const{items,...r}=d;return" {"+Object.entries(r).map(([k,v])=>k+":"+J(v)).join(",")+",items:[\n"+items.map(it=>"  "+J(it)).join(",\n")+"]}"}).join(",\n")+"],\ntexts:[\n"+
  o.texts.map(t=>" {"+Object.entries(t).map(([k,v])=>k+":"+(Array.isArray(v)&&v.length>1?"[\n   "+v.map(J).join(",\n   ")+"]":J(v))).join(",\n  ")+"}").join(",\n")+"]}})();\n";
 fs.writeFileSync(path.join(ROOT,wk+"-data.js"),s);
 const S={};[...used].sort().forEach(c=>S[c]=SV[c]);
 let t="/* 單元 "+o.n+" 圖示：Twemoji（© Twitter, Inc. 與其他貢獻者，CC-BY 4.0 https://creativecommons.org/licenses/by/4.0/）的 SVG，取自原版內嵌資料；顏色卡用色塊。\n"+
  "   window.ICONS[卡的 w（撞名時用 say）] = 大卡／小卡插圖 HTML；window.PIC([代碼, 張數]｜[\"sw\",1,色碼]) 給口說練習用。由 tools/build_data.js 產生。 */\n(function(){\nconst S={\n"+
  Object.keys(S).map(c=>J(c)+":"+J(S[c])).join(",\n")+"};\n"+
  "const P=p=>!p?\"\":p[0]===\"sw\"?'<span class=\"sw\" style=\"background:'+p[2]+'\"></span>':S[p[0]]?'<span class=\"im n'+p[1]+'\">'+('<img alt=\"\" src=\"'+S[p[0]]+'\">').repeat(p[1])+\"</span>\":\"\";\n"+
  "const I={\n"+Object.keys(I).map(k=>J(k)+":"+J(I[k])).join(",\n")+"};\n"+
  "window.PIC=P;window.ICONS={};Object.keys(I).forEach(k=>{window.ICONS[k]=P(I[k])});\n})();\n";
 fs.writeFileSync(path.join(ROOT,wk+"-icons.js"),t);
 console.log(wk+"：卡片 "+o.cards.length+"・分組 "+o.groups.length+"・測驗題 "+o.quiz.length+"・口說 "+o.decks.map(d=>d.items.length).join("+")+"・課文 "+o.texts.length+" 則・圖示 "+used.size)}
WEEKS.forEach((wk,n)=>{const r=n===1||n===2?articles(wk,n):generic(wk,n);emit(wk,r.o,r.SV)});
