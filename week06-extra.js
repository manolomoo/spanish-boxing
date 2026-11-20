/* 單元 6 課文分頁加強版（v4）：解說＋指示詞表格＋esto／eso＋常見錯誤與口訣＋3 個記憶遊戲，插在 #texts（跟讀）前面。
   只在 week06.html 載入（tools/build_pages.js 的 extra 旗標），CSS 全部限定在 body.u6 #sec-t，不影響其他單元。
   資料：window.WEEK.lab（week06-data.js）；會念到的字都列在 lab.say，由 tools/gen_week06_audio.js 產生 mp3（Elvira）。
   播音：每個按鈕一開頭同步呼叫 TTS.unlock()，再 stop()（unit.js 全域）→ await play1(k)（unit.js 全域、rw.js 包裝過；null＝被中斷）。
   答錯不播音、只顯示中文解釋；答對才播。XP：RW.emit({uid:"u6",t:"quiz",ok,isNew})（同現有小測驗規則），
   「答對過」記在 localStorage esBoxerU6G1（不碰 esBoxerRW1／esBoxerRPG1）。 */
(function(){
const W=window.WEEK,L=W&&W.lab,sec=document.getElementById("sec-t"),texts=document.getElementById("texts");
if(!L||!sec||!texts)return;
document.body.classList.add("u6");
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const F=L.forms,cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const KEYS=new Set();const K=k=>{KEYS.add(k);return k};          // 這支檔會念的字（測試用 window.U6X.keys 核對音檔）

/* ===== 存檔：esBoxerU6G1 ===== */
const SK="esBoxerU6G1";let mem={};
const ld=()=>{try{return JSON.parse(localStorage.getItem(SK))||{}}catch(e){return mem}};
const sv=d=>{mem=d;try{localStorage.setItem(SK,JSON.stringify(d))}catch(e){}};
/* 答題給 XP：同一題第一次答對 isNew=true，之後 false；答錯 ok:false */
function xp(key,ok){let isNew=false;if(ok){const d=ld();d.ok=d.ok||{};isNew=!d.ok[key];d.ok[key]=1;sv(d)}try{RW.emit({uid:"u6",t:"quiz",ok:!!ok,isNew})}catch(e){}}

/* ===== 播音 ===== */
const U=()=>{try{TTS.unlock()}catch(e){}};
async function say(keys,el){if(typeof stop==="function")stop();if(el)el.classList.add("u6-on");
 try{for(const k of keys){const d=await play1(k);if(d==null)break}}finally{if(el)el.classList.remove("u6-on")}}
/* 可點播的西文（data-say＝音檔 key，用 | 分隔多段） */
const sp=(k,txt,cls)=>{String(k).split("|").forEach(K);return `<button type="button" class="u6-say${cls?" "+cls:""}" data-say="${esc(k)}">🔊 ${txt||esc(k)}</button>`};
sec.addEventListener("click",e=>{const b=e.target.closest("[data-say]");if(!b||!sec.contains(b))return;U();say(b.dataset.say.split("|"),b)});

/* ===== 指示詞的屬性與錯誤解釋 ===== */
const AT={};["c","m"].forEach(d=>{["m","f"].forEach(g=>F[d][g].forEach((w,i)=>{AT[w.toLowerCase()]={d,g,n:i?"p":"s"}}));AT[F[d].neu.toLowerCase()]={d,g:"n"}});
const DZ={c:"近處（aquí）→ 有 t 的 est-",m:"中距離（allí）→ 沒有 t 的 es-"};
const GZ={m:"陽性",f:"陰性"},NZ={s:"單數",p:"複數"},nw=x=>`<span class="u6-nw">${x}</span>`,END={m:{s:nw("-e"),p:nw("-os")},f:{s:nw("-a"),p:nw("-as")}};
/* it：{d,g,n,noun,art}（g:"n"＝中性題，n:"unk"／"idea"） */
function whyOk(it,a){if(it.g==="n")return (it.n==="unk"?"不知道是什麼東西":"指一件事／一個想法")+"，後面沒有名詞 → 中性 <b>"+(it.d==="c"?"esto":"eso")+"</b>。"+(it.n==="unk"?"":"（這題 esto／eso 其實都可以。）");
 return DZ[it.d]+"；"+esc(it.art+" "+it.noun)+" 是"+GZ[it.g]+NZ[it.n]+" → "+END[it.g][it.n]+"，所以是 <b>"+esc(a)+"</b>。"}
function whyBad(it,pick){const p=AT[pick.toLowerCase()],out=[];const nn=esc(it.art+" "+it.noun);
 if(!p){out.push("西文沒有 <b>"+esc(pick)+"</b> 這個字！陰性複數是 -as → <b>estas</b>（不是 estes）。");}
 else if(it.g==="n"&&p.g!=="n")out.push("這裡後面沒有名詞（"+(it.n==="unk"?"不知道是什麼東西":"指的是一件事、一個想法")+"），要用中性的 esto／eso，不用 "+esc(pick)+"。");
 else if(it.g!=="n"&&p.g==="n")out.push("esto／eso 後面不能接名詞。這裡有名詞 <b>"+esc(it.noun)+"</b>，要跟著它變。"+(it.g==="m"&&it.n==="s"?"陽性單數結尾是 <b>-e</b>（este／ese），不是 -o。":""));
 else{if(p.d!==it.d)out.push(it.d==="c"?"東西在近處（aquí、摸得到），要用有 t 的 <b>est-</b>（T＝Touch）。":"東西在中距離／靠近對方（allí），要用沒有 t 的 <b>es-</b>。");
  if(it.g!=="n"){if(p.g!==it.g)out.push(it.noun==="nieve"?"nieve 雖然是 -e 結尾，但它是陰性（la nieve），要用 -a。":nn+" 是"+GZ[it.g]+"（看冠詞 "+esc(it.art)+"），結尾要用 "+END[it.g][it.n]+"。");
   if(p.n!==it.n)out.push(it.n==="p"?nn+" 是複數，指示詞也要加 -s（"+END[it.g].p+"）。":nn+" 是單數，指示詞不加 -s。")}}
 return out.join("")}

/* ===== 版面 ===== */
const TOC=[["u6-dist","距離"],["u6-form","變化"],["u6-tbl","表格"],["u6-neu","esto/eso"],["u6-err","錯誤・口訣"],["u6-game","遊戲"],["texts","跟讀"]];
const src=(es,en)=>`<div class="u6-src">${es}<br>${en}</div>`;
const scene=(nearPic,midPic,nl,ml)=>`<div class="u6-scene"><div class="u6-pp">${PIC(["1f64b",1])}<small>我</small></div>
 <div class="u6-z u6-zn">${nearPic||""}<small>${nl||"aquí"}</small></div><div class="u6-z u6-zm">${midPic||""}<small>${ml||"allí"}</small></div>
 <div class="u6-pp">${PIC(["1f9d1",1])}<small>你</small></div></div>`;
function tableHTML(game){const t=L.table;const cell=(w,ph,lab)=>game?`<td class="u6-slot" data-w="${w}"><span class="u6-ph">${lab}</span></td>`
  :`<td>${(K(w),K(ph),"")}<button type="button" class="u6-cell" data-say="${esc(w+"|"+ph)}"><b>${w}</b><small>(${esc(ph.split(" ").slice(1).join(" "))})</small></button></td>`;
 const blk=(d,title)=>`<table class="u6-t u6-t${d}"><caption>${title}</caption><thead><tr><th></th><th>單數</th><th>複數</th></tr></thead><tbody>
  <tr><th>陽性<small>el / los</small></th>${cell(F[d].m[0],F[d].m[0]+" "+t.nm,"陽・單")}${cell(F[d].m[1],F[d].m[1]+" "+t.npl,"陽・複")}</tr>
  <tr><th>陰性<small>la / las</small></th>${cell(F[d].f[0],F[d].f[0]+" "+t.fm,"陰・單")}${cell(F[d].f[1],F[d].f[1]+" "+t.fpl,"陰・複")}</tr></tbody></table>`;
 const neu=d=>{const w=F[d].neu;return game?`<td class="u6-slot" data-w="${w}"><span class="u6-ph">中性・${d==="c"?"近":"中"}</span></td>`:`<td><button type="button" class="u6-cell" data-say="${esc(K(w)+"|"+K(t.neu[w]))}"><b>${w.toLowerCase()}</b><small>${esc(t.neu[w])}</small></button></td>`};
 return blk("c","🟧 近處 est-（aquí・靠近我）")+blk("m","🟦 中距離 es-（allí・靠近你）")+
  `<table class="u6-t u6-tn"><caption>⬜ 中性（不接名詞）</caption><tbody><tr>${neu("c")}${neu("m")}</tr></tbody></table>`}

const html=`
<nav class="u6-toc" aria-label="課文目錄">${TOC.map(([id,t])=>`<button type="button" data-go="${id}">${t}</button>`).join("")}</nav>

<div class="box u6-box" id="u6-dist"><h3>① 兩種距離：這裡 aquí・那裡 allí</h3>
 <p>西班牙文用「東西離我多遠」來選指示詞，講義分成兩種：<b>近處 Cerca</b>、<b>中距離 Media distancia</b>。</p>
 ${src("En español, la distancia de los objetos se expresa en dos categorías (Cerca y Media distancia).","In Spanish, the distance of objects is expressed in two categories (near and middle distance).")}
 ${scene(PIC(["1f4f1",1]),PIC(["1f415",1]),"aquí・este","allí・ese")}
 <div class="u6-k u6-kn"><b>🟧 este 系（est-）＝靠近我（aquí）</b><p>東西在我手上、伸手摸得到、就在我身邊。</p>
  ${src("1. Cerca de mí (Aquí) – Near me. Usamos ESTE / ESTA cuando el elemento está cerca.","We use This when one can reach an object or has it in their hand.")}
  ${sp("Este perro es pequeño.")}<div class="u6-zh">這隻狗很小。</div></div>
 <div class="u6-k u6-km"><b>🟦 ese 系（es-）＝靠近你，或有一段距離（allí）</b><p>東西在對方那邊，或不遠不近、看得到但摸不太到。</p>
  ${src("2. Cerca de ti / Media distancia (Allí) – Near you or Middle Distance. Usamos ESE / ESA cuando el elemento está a una distancia media o cerca de la otra persona.","We use That when the object is at a middle distance or near the person we are talking to.")}
  ${sp("Ese teléfono está allí.")}<div class="u6-zh">那支電話在那裡。</div></div>
 <div class="u6-note">嚴格說，ese 常搭配 ahí（你那裡）；更遠的「那個」用 aquel，之後再學。</div>
</div>

<div class="box u6-box" id="u6-form"><h3>② 跟著名詞變：兩個步驟</h3>
 <p><b>步驟 1｜選距離：</b>近 → <span class="u6-n">est-</span>　中 → <span class="u6-m">es-</span></p>
 <p><b>步驟 2｜看名詞</b>是陽性還是陰性、單數還是複數，接上 <b class="u6-e">-e／-a／-os／-as</b>：</p>
 <div class="u6-formula"><span class="u6-n">est</span>+<i>e</i>／<i>a</i>／<i>os</i>／<i>as</i><br><span class="u6-m">es</span>+<i>e</i>／<i>a</i>／<i>os</i>／<i>as</i></div>
 <p>💡 小撇步：看名詞前面的<b>冠詞尾巴</b>最快 ── el → est<i>e</i>、la → est<i>a</i>、los → est<i>os</i>、las → est<i>as</i>。</p>
 <div class="u6-ex">
  <div>el perro → ${sp("Este perro")}</div><div>la fruta → ${sp("Esta fruta")}</div>
  <div>los niños → ${sp("Estos niños")}</div><div>las verduras → ${sp("Estas verduras")}</div></div>
 <div class="u6-warn">⚠️ 要看名詞本身是陽性還是陰性，<b>不要看字尾猜</b>：
  <div class="u6-ex"><div>la nieve（雪，-e 結尾但陰性）→ ${sp("Esa nieve")}</div><div>el río（河，陽性）→ ${sp("Ese río")}・${sp("Esos ríos")}</div></div></div>
</div>

<div class="box u6-box" id="u6-tbl"><h3>③ 指示詞總表（點格子聽）</h3>
 <p class="u6-s">點一格：先念指示詞，再念例子。左欄單數、右欄複數；上列陽性、下列陰性。</p>
 ${tableHTML(false)}
</div>

<div class="box u6-box" id="u6-neu"><h3>④ esto／eso：不知道是什麼、或指一件事</h3>
 <p>esto／eso 是<b>中性</b>（formas neutras），後面<b>不接名詞</b>。只用在兩種情況：</p>
 <div class="u6-k"><b>1. 不知道那是什麼東西</b>
  <div class="u6-ex"><div>${sp("¿Qué es esto?")}<span class="u6-zh">這是什麼？（在我手上）</span></div><div>${sp("¿Qué es eso?")}<span class="u6-zh">那是什麼？（在你那邊）</span></div></div>
  ${src("1. No sabemos qué es el objeto.","We don't know what the object is.")}</div>
 <div class="u6-k"><b>2. 指一件事、一個情況或想法</b>
  <div class="u6-ex"><div>${sp("Esto es difícil.")}<span class="u6-zh">這（件事）很難。</span></div><div>${sp("Eso es fácil.")}<span class="u6-zh">那（件事）很簡單。</span></div></div>
  ${src("2. Hablamos de una situación o idea.","We talk about a situation or idea.")}</div>
 <div class="u6-k u6-vs"><b>和 este／ese 比一比</b>
  <div>${sp("Este teléfono es pequeño.")}<div class="u6-zh">後面有名詞 teléfono、知道是什麼 → <b>este</b></div></div>
  <div>${sp("¿Qué es esto?")}<div class="u6-zh">後面沒有名詞、不知道是什麼 → <b>esto</b></div></div>
  <p class="u6-s">距離規則一樣：esto 是近的（有 t），eso 是中距離的。</p></div>
 <div class="u6-note">講義寫成 ésto／éso，依 RAE 現行規範，中性的 esto／eso 不加重音，這裡一律寫 esto／eso。</div>
</div>

<div class="box u6-box" id="u6-err"><h3>⑤ 三個常見錯誤＋口訣</h3>
 <div class="u6-bad"><s>estes mesas</s> → ${sp("Estas mesas")}<div class="u6-zh">陰性複數是 -as。西文沒有 estes 這個字。</div></div>
 <div class="u6-bad"><s>esto perro</s> → ${sp("Este perro")}<div class="u6-zh">陽性單數結尾是 -e（este／ese），不是 -o。</div></div>
 <div class="u6-bad"><s>eso familia</s> → ${sp("Esa familia")}<div class="u6-zh">esto／eso 不能放在名詞前面；名詞前面要用 este／esta／ese／esa…</div></div>
 <div class="u6-tip"><b>🅣 This and these have T's</b><p>英文口訣「This and these have T's, that and those don't.」：翻成 this／these（這）的西文有 t（es<u>t</u>e、es<u>t</u>a、es<u>t</u>os、es<u>t</u>as）；翻成 that／those（那）的沒有 t（ese、esa、esos、esas）。</p></div>
 <div class="u6-tip"><b>✋ T＝Touch</b><p>est 的 t 想成 touch：摸得到的、在手上的，就用有 t 的 est-。</p></div>
 <div class="u6-tip"><b>⭕ o 是空圈圈</b><p>esto／eso 的 o 像一個空圈圈：後面空空的，不接名詞，也是「不知道是什麼」的問號圈。所以陽性單數要寫 este／ese（-e），不是 -o。</p></div>
</div>

<div class="box u6-box" id="u6-game"><h3>⑥ 記憶遊戲 🥊</h3>
 <div class="seg u6-gseg"><button type="button" data-g="0" class="on">這個還那個？</button><button type="button" data-g="1">表格拼圖</button><button type="button" data-g="2">Ejercicio 擂台</button></div>
 <div id="u6-g"></div>
</div>`;
const root=document.createElement("div");root.id="u6";root.innerHTML=html;texts.before(root);
root.querySelector(".u6-toc").addEventListener("click",e=>{const b=e.target.closest("[data-go]");if(!b)return;const t=document.getElementById(b.dataset.go);if(t)t.scrollIntoView({behavior:"smooth",block:"start"})});

/* ===== 遊戲共用 ===== */
const shuf=a=>{a=a.slice();for(let k=a.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[a[k],a[j]]=[a[j],a[k]]}return a};
const G=document.getElementById("u6-g");let gi=0;
const GAMES=[g1,g2,g3];
root.querySelector(".u6-gseg").addEventListener("click",e=>{const b=e.target.closest("[data-g]");if(!b)return;if(typeof stop==="function")stop();gi=+b.dataset.g;
 root.querySelectorAll(".u6-gseg button").forEach(x=>x.classList.toggle("on",x===b));clearInterval(t2);GAMES[gi](true)});
const optsHTML=o=>`<div class="u6-opts">${o.map(x=>`<button type="button" class="u6-opt" data-o="${esc(x)}">${esc(x)}</button>`).join("")}</div>`;
function mark(box,pick,ans){box.querySelectorAll(".u6-opt").forEach(b=>{b.disabled=true;if(b.dataset.o===ans)b.classList.add("ok");else if(b.dataset.o===pick)b.classList.add("bad")})}
const fb=(ok,h)=>`<div class="u6-fb ${ok?"ok":"bad"}">${ok?"¡Muy bien! 答對了 👏<br>":"再想想 🤔<br>"}${h}</div>`;

/* ===== 遊戲 1：這個還那個？（距離場景，每局 10 題） ===== */
const P1=[];L.nouns.forEach(N=>["c","m"].forEach(d=>["s","p"].forEach(n=>{const g=N[2],w=F[d][g][n==="s"?0:1],noun=n==="s"?N[0]:N[1];
 P1.push({d,g,n,noun,art:n==="p"?(g==="m"?"los":"las"):(g==="m"?"el":"la"),zh:N[3],ic:N[4],a:w,say:K(w+" "+noun)})})));
let s1=null;
function g1(fresh){if(fresh||!s1)s1={q:shuf(P1).slice(0,10),i:0,ok:0,pick:null};const st=s1;
 if(st.i>=st.q.length){const r=st.ok,c=r===10?"完美！一拳 KO 🥊":r>=8?"很強！距離感抓到了 💪":r>=5?"不錯，再練一局會更穩 🙂":"先回去看一次表格，再來挑戰！";
  G.innerHTML=`<div class="u6-end"><div class="u6-big">答對 ${r} / 10</div><div>${c}</div><button type="button" class="u6-go" id="u6-g1r">再來一局 ›</button></div>`;
  G.querySelector("#u6-g1r").onclick=()=>{U();g1(true)};return}
 const it=st.q[st.i],pic=PIC([it.ic,it.n==="p"?3:1]);
 const o=shuf([it.a,F[it.d==="c"?"m":"c"][it.g][it.n==="s"?0:1],F[it.d][it.g==="m"?"f":"m"][it.n==="s"?0:1],F[it.d][it.g][it.n==="s"?1:0]]);
 G.innerHTML=`<div class="u6-hd"><span>第 ${st.i+1} / 10 題</span><span>答對 ${st.ok}</span></div>
  <div class="u6-mu">東西在誰旁邊？選出正確的指示詞：</div>
  ${it.d==="c"?scene(pic,"","aquí",""):scene("",pic,"","allí")}
  <div class="u6-q">＿＿ ${esc(it.noun)}</div><div class="u6-mu c">${esc(it.art+" "+it.noun)}・${esc(it.zh)}</div>
  ${optsHTML(o)}<div id="u6-f1"></div>`;
 G.querySelectorAll(".u6-opt").forEach(b=>b.onclick=async()=>{U();if(st.pick)return;const pick=b.dataset.o,ok=pick===it.a;st.pick=pick;if(ok)st.ok++;
  mark(G,pick,it.a);xp("g1|"+it.say,ok);
  G.querySelector("#u6-f1").innerHTML=fb(ok,(ok?"":whyBad(it,pick)+"<br>")+(ok?(it.d==="c"?"東西在<b>我身邊</b>，":"東西在<b>你那邊／有段距離</b>，")+whyOk(it,it.a):"正確：<b>"+esc(it.say)+"</b>"))+`<button type="button" class="u6-go" id="u6-n1">${st.i+1<st.q.length?"下一題 ›":"看結果 ›"}</button>`;
  G.querySelector("#u6-n1").onclick=()=>{U();if(typeof stop==="function")stop();st.i++;st.pick=null;g1()};
  if(ok)await say([it.say])})}

/* ===== 遊戲 2：表格拼圖（先點字卡、再點格子；整張完成才給一次 XP） ===== */
const TILES=[F.c.m[0],F.c.m[1],F.c.f[0],F.c.f[1],F.m.m[0],F.m.m[1],F.m.f[0],F.m.f[1],F.c.neu,F.m.neu];TILES.forEach(K);
let s2=null,t2=0;
const tmr=s=>{const x=Math.round(s);return String(Math.floor(x/60)).padStart(2,"0")+":"+String(x%60).padStart(2,"0")};
function slotWhy(w,slot){const a=AT[w.toLowerCase()],b=AT[slot.toLowerCase()],out=[];
 if(a.g==="n"||b.g==="n"){if(a.g==="n"&&b.g!=="n")return w.toLowerCase()+" 是中性、不接名詞，要放最下面的「中性」列。";if(b.g==="n"&&a.g!=="n")return w+" 會接名詞（"+(a.g==="m"?"陽性":"陰性")+"），中性列只放 esto／eso。";}
 if(a.d!==b.d)out.push(w+(a.d==="c"?" 有 t（est-），是近處，放 🟧 那張表。":" 沒有 t（es-），是中距離，放 🟦 那張表。"));
 if(a.g!=="n"){if(a.g!==b.g)out.push(w+" 結尾 "+END[a.g][a.n]+" 是"+GZ[a.g]+"，放「"+GZ[a.g]+"」那一列。");if(a.n!==b.n)out.push(w+(a.n==="p"?" 有 -s，是複數，放右欄。":" 沒有 -s，是單數，放左欄。"))}
 return out.join("")||"位置不對，再看一次表頭。"}
function g2(fresh){if(fresh||!s2)s2={left:shuf(TILES),sel:null,err:0,t0:0,done:{}};const st=s2;clearInterval(t2);
 G.innerHTML=`<div class="u6-hd"><span>⏱ <b id="u6-tm">${tmr(st.t0?(Date.now()-st.t0)/1000:0)}</b></span><span>錯 <b id="u6-er">${st.err}</b> 次</span><span>${best2()}</span></div>
  <div class="u6-mu">先點下面一張字卡，再點它在表格裡的位置。</div>
  <div class="u6-pz">${tableHTML(true)}</div><div class="u6-tiles"></div><div id="u6-f2"></div>`;
 Object.keys(st.done).forEach(w=>fill(w));drawTiles();if(st.t0&&st.left.length)tick();
 G.querySelectorAll(".u6-slot").forEach(td=>td.onclick=async()=>{U();const f=G.querySelector("#u6-f2");if(st.done[td.dataset.w])return;
  if(!st.sel){f.innerHTML=`<div class="u6-fb">先點下面一張字卡 👇</div>`;return}
  const w=st.sel;if(w===td.dataset.w){st.done[w]=1;st.left=st.left.filter(x=>x!==w);st.sel=null;fill(w);drawTiles();
   f.innerHTML=`<div class="u6-fb ok">✔ ${esc(w)} 放對了！</div>`;
   if(!st.left.length){clearInterval(t2);const sec=(Date.now()-st.t0)/1000,d=ld(),b=d.g2best,nb=!b||st.err<b.e||(st.err===b.e&&sec<b.t);if(nb){d.g2best={t:sec,e:st.err};sv(d)}
    xp("g2|table",true);
    f.innerHTML=`<div class="u6-end"><div class="u6-big">完成！🎉</div><div>用時 ${tmr(sec)}・錯 ${st.err} 次${nb?"・🏆 新紀錄！":""}</div><div class="u6-mu">${best2()}</div><button type="button" class="u6-go" id="u6-g2r">再拼一次 ›</button></div>`;
    f.querySelector("#u6-g2r").onclick=()=>{U();if(typeof stop==="function")stop();g2(true)}}
   await say([w],td)}
  else{st.err++;G.querySelector("#u6-er").textContent=st.err;td.classList.remove("u6-shk");void td.offsetWidth;td.classList.add("u6-shk");
   f.innerHTML=`<div class="u6-fb bad">✘ ${slotWhy(w,td.dataset.w)}</div>`}})}
function best2(){const b=ld().g2best;return b?"最佳 "+tmr(b.t)+"・錯 "+b.e:"最佳：—"}
function fill(w){const td=G.querySelector(`.u6-slot[data-w="${w}"]`);if(td){td.classList.add("done");td.innerHTML=`<b>${AT[w.toLowerCase()].g==="n"?w.toLowerCase():w}</b>`}}
function tick(){clearInterval(t2);t2=setInterval(()=>{const e=document.getElementById("u6-tm");if(!e||!s2||!s2.t0){clearInterval(t2);return}e.textContent=tmr((Date.now()-s2.t0)/1000)},500)}
function drawTiles(){const st=s2,box=G.querySelector(".u6-tiles");
 box.innerHTML=st.left.map(w=>`<button type="button" class="u6-tile${st.sel===w?" sel":""}" data-w="${w}">${AT[w.toLowerCase()].g==="n"?w.toLowerCase():w}</button>`).join("");
 box.querySelectorAll(".u6-tile").forEach(b=>b.onclick=()=>{U();if(!st.t0){st.t0=Date.now();tick()}st.sel=st.sel===b.dataset.w?null:b.dataset.w;drawTiles();
  const f=G.querySelector("#u6-f2");if(f&&!f.querySelector(".u6-end"))f.innerHTML=st.sel?`<div class="u6-fb">選了 <b>${esc(b.textContent)}</b>，點它在表格裡的位置 ☝️</div>`:""})}

/* ===== 遊戲 3：Ejercicio 擂台（講義 16 題，打完 KO 畫面） ===== */
let s3=null;L.ej.forEach(q=>K(q.say));
function g3(fresh){if(fresh||!s3)s3={i:0,ok:0,cb:0,best:0,pick:null,o:null};const st=s3,N=L.ej.length;
 if(st.i>=N){const r=st.ok,t=r===N?"完美 KO！🏆":r>=12?"KO 勝！🥊":r>=8?"判定勝 👍":"這場被對手撐過了，再打一場！";
  G.innerHTML=`<div class="u6-end u6-ko"><div class="u6-kot">K.O.</div><div class="u6-big">${t}</div><div>答對 ${r} / ${N}・最佳連擊 ${st.best}</div><button type="button" class="u6-go" id="u6-g3r">再打一場 ›</button></div>`;
  G.querySelector("#u6-g3r").onclick=()=>{U();g3(true)};return}
 const it=L.ej[st.i];if(!st.o)st.o=shuf(it.o);const hp=N-st.ok;
 G.innerHTML=`<div class="u6-hd"><span>第 ${st.i+1} / ${N} 回合</span><span>連擊 ${st.cb}</span></div>
  <div class="u6-hp"><span>🥊 對手 HP</span><div class="u6-bar"><i style="width:${hp/N*100}%"></i></div><b>${hp}</b></div>
  <div class="u6-q u6-ql">${esc(it.q).replace("______",'<span class="u6-blank">＿＿</span>')}</div><div class="u6-mu c">${esc(it.zh)}</div>
  ${it.g==="n"?'<div class="u6-mu c u6-s">（這題 esto／eso 其實都可以；選項裡只有一個中性詞）</div>':""}
  ${optsHTML(st.o)}<div id="u6-f3"></div>`;
 G.querySelectorAll(".u6-opt").forEach(b=>b.onclick=async()=>{U();if(st.pick)return;const pick=b.dataset.o,ok=pick===it.a;st.pick=pick;
  if(ok){st.ok++;st.cb++;st.best=Math.max(st.best,st.cb)}else st.cb=0;mark(G,pick,it.a);xp("g3|"+(st.i+1),ok);
  const bar=G.querySelector(".u6-bar i");if(bar)bar.style.width=(N-st.ok)/N*100+"%";G.querySelector(".u6-hp b").textContent=N-st.ok;
  if(ok)G.querySelector(".u6-blank").textContent=it.a;
  G.querySelector("#u6-f3").innerHTML=fb(ok,ok?(st.cb>=3?"🔥 "+st.cb+" 連擊！<br>":"")+whyOk(it,it.a)+"<br><b>"+esc(it.say)+"</b>":whyBad(it,pick)+"<br>正確：<b>"+esc(it.say)+"</b>")+
   `<button type="button" class="u6-go" id="u6-n3">${st.i+1<N?"下一回合 ›":"看結果 ›"}</button>`;
  G.querySelector("#u6-n3").onclick=()=>{U();if(typeof stop==="function")stop();st.i++;st.pick=null;st.o=null;g3()};
  if(ok)await say([it.say])})}

g1(true);
window.U6X={keys:()=>[...KEYS],P1:P1.length,ej:L.ej.length};

/* ===== scoped CSS（只作用 body.u6 #sec-t） ===== */
const css=document.createElement("style");css.textContent=`
body.u6{--u6n:#d9690b;--u6nb:#fff2e4;--u6m:#2f6fed;--u6mb:#e9f0ff}
@media(prefers-color-scheme:dark){body.u6{--u6n:#ffa04d;--u6nb:#3a2a1b;--u6m:#7fa8ff;--u6mb:#1d2a45}}
body.u6 #sec-t{font-size:18px;line-height:1.6}
body.u6 #u6{display:flex;flex-direction:column;gap:14px;margin-bottom:14px}
body.u6 #sec-t .box{scroll-margin-top:64px}body.u6 #texts{scroll-margin-top:64px}
body.u6 #sec-t h3{font-size:22px;margin:0;line-height:1.35}
body.u6 #sec-t p{margin:0}
body.u6 .u6-toc{display:flex;gap:8px;overflow-x:auto;-webkit-overflow-scrolling:touch;padding:2px 0 4px;scrollbar-width:thin}
body.u6 .u6-toc button{flex:0 0 auto;min-height:48px;padding:8px 16px;font-size:18px;font-weight:700;border-radius:24px;border:1px solid var(--ln);background:var(--cd);color:var(--fg)}
body.u6 .u6-src{font-size:14px;line-height:1.5;color:var(--mu);border-left:3px solid var(--ln);padding-left:8px}
body.u6 .u6-note{font-size:15px;color:var(--mu);line-height:1.55}
body.u6 .u6-s{font-size:15px;color:var(--mu)}
body.u6 .u6-zh{font-size:17px;color:var(--mu);line-height:1.5}
body.u6 .u6-nw{white-space:nowrap}body.u6 .u6-mu{color:var(--mu);font-size:17px}body.u6 .c{text-align:center}
body.u6 .u6-k{display:flex;flex-direction:column;gap:8px;padding:12px;border-radius:12px;background:var(--bg)}
body.u6 .u6-kn{background:var(--u6nb);border-left:5px solid var(--u6n)}body.u6 .u6-km{background:var(--u6mb);border-left:5px solid var(--u6m)}
body.u6 .u6-n{color:var(--u6n);font-weight:800}body.u6 .u6-m{color:var(--u6m);font-weight:800}
body.u6 .u6-say{display:inline-block;max-width:100%;text-align:left;font-size:22px;font-weight:700;line-height:1.35;padding:8px 12px;margin:2px 0;border-radius:10px;border:1px solid var(--ln);background:var(--cd);color:var(--fg);overflow-wrap:anywhere;cursor:pointer}
body.u6 .u6-say.u6-on,body.u6 .u6-cell.u6-on{outline:3px solid var(--ac);background:var(--tint)}
body.u6 .u6-ex{display:flex;flex-direction:column;gap:6px}
body.u6 .u6-formula{font-size:26px;font-weight:800;text-align:center;line-height:1.5;padding:8px;border-radius:12px;background:var(--bg)}
body.u6 .u6-formula i,body.u6 #u6-form p i{font-style:normal;color:#c0392b;font-weight:800}
body.u6 .u6-warn{padding:12px;border-radius:12px;background:#fff6d6;color:#1b1d24;display:flex;flex-direction:column;gap:8px}
@media(prefers-color-scheme:dark){body.u6 .u6-warn{background:#3b3416;color:var(--fg)}}
body.u6 .u6-scene{display:flex;align-items:stretch;gap:6px;padding:10px 6px;border-radius:14px;background:var(--bg)}
body.u6 .u6-pp{flex:0 0 52px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}
body.u6 .u6-pp .im{width:48px;height:48px}body.u6 .u6-pp small,body.u6 .u6-z small{font-size:14px;color:var(--mu);font-weight:700}
body.u6 .u6-z{flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:92px;border-radius:12px;border:2px dashed var(--ln);padding:6px}
body.u6 .u6-zn{background:var(--u6nb);border-color:var(--u6n)}body.u6 .u6-zm{background:var(--u6mb);border-color:var(--u6m)}
body.u6 .u6-z .im{height:52px;width:100%}body.u6 .u6-z .im img{max-width:52px}
body.u6 .u6-t{width:100%;border-collapse:separate;border-spacing:6px;table-layout:fixed}
body.u6 .u6-t caption{text-align:left;font-size:18px;font-weight:800;padding:4px 2px}
body.u6 .u6-tc caption{color:var(--u6n)}body.u6 .u6-tm caption{color:var(--u6m)}
body.u6 .u6-t th{font-size:16px;color:var(--mu);font-weight:700}body.u6 .u6-t thead th:first-child,body.u6 .u6-t tbody th{width:60px}
body.u6 .u6-t tbody th small{display:block;font-size:12px;font-weight:600}
body.u6 .u6-t td{padding:0;height:76px}
body.u6 .u6-cell{width:100%;height:100%;min-height:76px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;border-radius:12px;border:2px solid var(--ln);background:var(--cd);color:var(--fg);padding:6px 4px;cursor:pointer}
body.u6 .u6-tc .u6-cell{border-color:var(--u6n);background:var(--u6nb)}body.u6 .u6-tm .u6-cell{border-color:var(--u6m);background:var(--u6mb)}
body.u6 .u6-cell b{font-size:26px;font-weight:800;line-height:1.1}body.u6 .u6-cell small{font-size:14px;color:var(--mu);overflow-wrap:anywhere;line-height:1.3}
body.u6 .u6-bad{display:flex;flex-direction:column;gap:4px;padding:10px 12px;border-radius:12px;background:var(--bg)}
body.u6 .u6-bad s{color:var(--bad);font-size:22px;font-weight:700}
body.u6 .u6-tip{padding:12px;border-radius:12px;border:2px solid var(--ac);display:flex;flex-direction:column;gap:4px}
body.u6 .u6-tip b{font-size:20px}
body.u6 .u6-gseg button{font-size:16px;font-weight:700;padding:10px 6px;min-height:48px}
body.u6 #u6-g{display:flex;flex-direction:column;gap:12px}body.u6 #u6-g>*{min-width:0}
body.u6 .u6-hd{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;font-size:16px;color:var(--mu);font-weight:700}
body.u6 .u6-q{font-size:30px;font-weight:800;text-align:center;line-height:1.3;overflow-wrap:anywhere}
body.u6 .u6-ql{font-size:26px}
body.u6 .u6-blank{color:var(--ac);border-bottom:3px solid var(--ac);padding:0 4px}
body.u6 .u6-opts{display:grid;grid-template-columns:1fr 1fr;gap:10px}
body.u6 .u6-opt,body.u6 .u6-go{flex:none;min-width:0;min-height:60px;font-size:24px;font-weight:800;border-radius:14px;border:2px solid var(--ln);background:var(--cd);color:var(--fg);overflow-wrap:anywhere;padding:8px}
body.u6 .u6-opt.ok{background:var(--ok);border-color:var(--ok);color:#fff}body.u6 .u6-opt.bad{border-color:var(--bad);color:var(--bad)}
body.u6 .u6-opt:disabled{opacity:1}body.u6 .u6-opt:disabled:not(.ok):not(.bad){opacity:.45}
body.u6 .u6-go{width:100%;background:var(--ac);border-color:var(--ac);color:#fff;font-size:22px}
body.u6 .u6-fb{font-size:18px;line-height:1.6;padding:12px;border-radius:12px;background:var(--bg);margin-bottom:10px}
body.u6 .u6-fb.ok{border-left:5px solid var(--ok)}body.u6 .u6-fb.bad{border-left:5px solid var(--bad)}
body.u6 .u6-end{display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;font-size:19px;padding:12px 0}
body.u6 .u6-big{font-size:32px;font-weight:800}
body.u6 .u6-kot{font-size:64px;font-weight:900;color:var(--bad);letter-spacing:4px;line-height:1;animation:u6ko .6s ease-out}
@keyframes u6ko{0%{transform:scale(2.4) rotate(-12deg);opacity:0}70%{transform:scale(.9)}100%{transform:scale(1);opacity:1}}
body.u6 .u6-hp{display:flex;align-items:center;gap:8px;font-size:16px;font-weight:700}
body.u6 .u6-bar{flex:1;height:14px;border-radius:7px;background:var(--ln);overflow:hidden}body.u6 .u6-bar i{display:block;height:100%;background:linear-gradient(90deg,#d7263d,#f5b301);transition:width .4s}
body.u6 .u6-slot{border-radius:12px;border:2px dashed var(--ln);text-align:center;cursor:pointer;vertical-align:middle}
body.u6 .u6-tc .u6-slot{border-color:var(--u6n)}body.u6 .u6-tm .u6-slot{border-color:var(--u6m)}
body.u6 .u6-ph{font-size:14px;color:var(--mu)}
body.u6 .u6-slot.done{border-style:solid;background:var(--cd)}body.u6 .u6-tc .u6-slot.done{background:var(--u6nb)}body.u6 .u6-tm .u6-slot.done{background:var(--u6mb)}
body.u6 .u6-slot.done b{font-size:26px;font-weight:800}
body.u6 .u6-slot.u6-on{outline:3px solid var(--ok)}
body.u6 .u6-shk{animation:u6shk .4s}@keyframes u6shk{20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
body.u6 .u6-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
body.u6 .u6-tile{min-width:0;min-height:56px;font-size:22px;font-weight:800;border-radius:12px;border:2px solid var(--ln);background:var(--cd);color:var(--fg);padding:4px}
body.u6 .u6-tile.sel{border-color:var(--ac);background:var(--ac);color:#fff;transform:scale(1.05)}
body.u6 #sec-t .tx>b{font-size:22px!important}
body.u6 #sec-t .sn{font-size:22px;line-height:1.5}
body.u6 #sec-t .showzh .zhs{font-size:17px}body.u6 #sec-t .gl{font-size:16px}
body.u6 #sec-t .tx .mu{font-size:15px!important}
`;document.head.appendChild(css);
})();
