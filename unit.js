/* 單元頁引擎：單字圖卡（回音法）→ 課文（文法重點＋跟讀）→ 其他（小測驗、口說練習、吊人遊戲）。資料來自 window.WEEK。
   注意：render / quiz / drill / play1 / hang 必須是全域函式（rw.js 會包裝它們來記錄💵與XP）。
   西文＝Elvira、英文＝Jenny，全部是預錄 mp3。英文翻譯（en／exen）只顯示＋單次念，不進回音週期。 */
const W=window.WEEK,$=id=>document.getElementById(id);
const G=W.groups,R=[0.7,0.85,1.0];
let g=0,i=0,rate=0.85,run=0,playing=false,score=0,done=0,qi=0,pk=null,dk=0,di=0,cc=null;
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const plain=s=>s.replace(/\{\d+\|([^}]+)\}/g,"$1").replace(/\s*\[\[[^\]]*\]\]/g,"").replace(/\s+/g," ").trim();
const fmt=s=>esc(s).replace(/\{(\d+)\|([^}]+)\}/g,'<mark class="kw"><sup>$1</sup>$2</mark>').replace(/\[\[([^\]]*)\]\]/g,'<span class="gl">$1</span>');
const key=c=>c.say||c.w;
const lbl=k=>String(k).replace(/^en:/,"");                   // 音檔 key → 顯示用文字
const list=()=>G[g].cards;
const ALL=[...new Set(G.flatMap(x=>x.cards))];               // 「全部」分組和其他分組共用同一批卡，不重複算
const icon=c=>(window.ICONS&&(window.ICONS[key(c)]||window.ICONS[c.w]))||"";
/* 一張卡會念到的字：parts＝各自走一輪回音週期的每一段（單字、動詞／現在分詞、兩句照片造句…），ex＝例句。 */
const partsOf=c=>c.parts||[key(c)];
const o1Keys=c=>[partsOf(c)[0]].concat(c.en?[c.en]:[]);                                         // 念單字（順便念這張卡的英文翻譯）
const o2Keys=c=>(c.alt||partsOf(c).slice(1)).concat(c.ex?[c.ex]:[],c.exen?[c.exen]:[]);          // 念例句／第二段（順便念例句英文翻譯）
const allKeys=c=>partsOf(c).concat(c.en?[c.en]:[],c.ex?[c.ex]:[],c.exen?[c.exen]:[]);          // 點小卡：整張念一次
const ownKeys=c=>partsOf(c).concat(c.alt||[],c.ex?[c.ex]:[]);                                   // 算在這張卡💵上的字（不含英文翻譯）
/* 回音週期：每一段各自「聽→回音→跟讀」；單字／分段各兩輪、例句一輪。例句的英文翻譯不進回音週期。 */
function cycles(c){const P=partsOf(c),n=P.length;const a=P.map((k,j)=>({k,rounds:2,lb:n>1?"【"+(j+1)+"/"+n+"】"+lbl(k)+"｜":c.ex?"單字｜":""}));if(c.ex)a.push({k:c.ex,rounds:1,lb:"例句｜"});return a}
/* 起始卡：該組 pget 最小者（同分取原順序最前），不重排卡片 */
function startIdx(k=g){const L=G[k].cards;let b=0,m=Infinity;for(let k=0;k<L.length;k++){const n=RW.pget(W.uid+"|cards|"+key(L[k]))||0;if(n<m){m=n;b=k}}return b}
function pickStart(){if(playing)return;i=startIdx();render()}
function play1(k){return TTS.play(k,rate)}
/* 手機：每個會開始播音的點擊，當下先解鎖共用的 <audio>（之後回音法靜音間隔後的下一段才不會被自動播放政策擋住）。 */
const unlock=()=>{try{TTS.unlock&&TTS.unlock()}catch(e){}};
const wait=s=>{const t=TTS.sess();return new Promise(r=>setTimeout(()=>r(TTS.sess()===t),s*1000))};
async function seq(keys){let t=0;for(const k of keys){const d=await play1(k);if(d==null)return t;t+=d}return t}
function seg(el,opts,sel,on){el.innerHTML="";opts.forEach((o,k)=>{const b=document.createElement("button");b.textContent=o;if(k===sel)b.className="on";b.onclick=()=>{on(k);seg(el,opts,k,on)};el.appendChild(b)})}
function cueEl(el,p,lb){el.textContent=(p?lb||"":"")+({listen:"聽",echo:"回音・心裡默念",shadow:"跟讀・大聲說出來"}[p]||"");el.style.color=p==="shadow"?"var(--ac)":""}
const setCue=(p,lb)=>cueEl($("cue"),p,lb);
function clearHl(){document.querySelectorAll(".sn.hl").forEach(e=>e.classList.remove("hl"));document.querySelectorAll(".tx .cue").forEach(e=>{e.textContent="";})}
/* 回音法節奏（史嘉琳 Echo Method）：聽完短句 → 腦中「重播」一次（≈原速，故等於語音長度 d）→ 再大聲跟讀（略長於 d，給開口時間）。
   d 是實際音檔秒數，短的停短、長的停長；另設下限避免單字太倉促。 */
const echoGap=d=>Math.max(1,d+.3),shadowGap=d=>Math.max(1.5,d*1.25+.6);
function stop(){TTS.cancel();run++;playing=false;cc=null;setCue("");clearHl();render()}
async function once(keys){unlock();stop();await seq(keys)}
async function cardOnce(c,keys){unlock();stop();cc=c;await seq(keys)}   // cc＝目前在念哪張卡（rw.js 用它把例句／分段記回這張卡）
/* ===== 單字圖卡 ===== */
function grid(){$("ga").innerHTML=list().map((c,k)=>{const ic=icon(c);return `<div class="ca${k===i?" cur":""}" data-k="${k}"><span class="sp">🔊</span>${ic?`<div class="ci">${ic}</div>`:""}<div class="en">${esc(c.w)}</div><div class="zh">${esc(c.zq||c.zh||"")}</div><div class="tg">${esc(c.tg||c.pos||"")}</div></div>`}).join("");
 $("ga").querySelectorAll(".ca").forEach(el=>el.onclick=()=>{unlock();stop();i=+el.dataset.k;render();const c=list()[i];cardOnce(c,allKeys(c))})}
function render(){const L=list();if(i>=L.length)i=0;const c=L[i],o=G[g].o||["念單字","念例句"];$("pl").textContent=playing?"⏸ 暫停":"▶ 回音法播放";grpLabels();
 $("ic").innerHTML=icon(c);const w=$("w");w.textContent=c.w;w.classList.toggle("md",c.w.length>12&&c.w.length<=24);w.classList.toggle("lg",c.w.length>24);
 $("zh").textContent=c.zh||"";$("tag").textContent=c.pos||"";$("en").textContent=c.en||"";
 $("ex").innerHTML=(c.exs?`<div class="mu">例：${c.exs.map(esc).join("・")}</div>`:"")+(c.ex?`<div>${esc(c.ex)}</div>`+(c.exen?`<div class="enx">${esc(c.exen)}</div>`:"")+(c.exzh?`<div class="mu">${esc(c.exzh)}</div>`:""):"");
 $("o1").textContent=o[0];$("o2").textContent=o[1];$("o2").disabled=!o2Keys(c).length;
 grid()}
async function play(){unlock();TTS.cancel();const r=++run,s0=TTS.sess();playing=true;render();const ok=()=>run===r&&TTS.sess()===s0;const L=list();
 while(ok()&&i<L.length){render();const c=L[i],cy=cycles(c);cc=c;
  for(let j=0;j<cy.length;j++){const p=cy[j];for(let k=0;k<p.rounds;k++){setCue("listen",p.lb);$("w").classList.add("hl");const d=await play1(p.k);$("w").classList.remove("hl");if(d==null||!ok())return;
   setCue("echo",p.lb);if(!await wait(echoGap(d))||!ok())return;setCue("shadow",p.lb);if(!await wait(shadowGap(d))||!ok())return}}
  if(!await wait(.5)||!ok())return;if(i+1<L.length)i++;else break}
 if(ok()){playing=false;cc=null;i=startIdx();setCue("");render()}}
/* ===== 課文：html＝只顯示的文法說明；paras＝可跟讀的句子（[[…]] 只顯示不念） ===== */
const SENT=[];let sj=0;
const zhOf=(t,pi,si)=>{const z=t.zh&&t.zh[pi]&&t.zh[pi][si];return z?`<div class="zhs">${esc(z)}</div>`:""};
function textsHTML(){return (W.texts||[]).map(t=>{const ids=[];const body=(t.paras||[]).map((p,pi)=>`<div class="pa">`+p.map((s,si)=>{const j=sj++;const pl=plain(s);SENT.push(pl);ids.push(j);return `<div class="sn" id="s${j}" data-j="${j}">${fmt(s)}${zhOf(t,pi,si)}</div>`}).join("")+`</div>`).join("");
  t.ids=ids;const has=ids.length>0;
  return `<div class="box tx${t.zh?" showzh":""}" id="tx-${t.id}"><b style="font-size:18px">${esc(t.title)}</b><div class="mu" style="font-size:13px">${esc(t.tag||"")}</div>
  ${t.html?`<div class="info">${t.html.map(h=>`<div>${h}</div>`).join("")}</div>`:""}
  ${has?`<div class="row"><button class="b p" data-a="all">▶ 全文連播</button><button class="b" data-a="echo">回音法逐句</button><button class="b" data-a="stop">⏹ 停止</button></div><div class="cue" style="min-height:20px"></div>`:""}
  ${has&&t.zh?`<div class="row"><button class="b" data-a="zh">隱藏中文</button></div>`:""}
  ${has?`<div class="story">${body}</div>`:""}${t.note?`<div class="mu" style="font-size:13px">${esc(t.note)}</div>`:""}${has?`<div class="mu" style="font-size:12px">點任一句可單獨聽。</div>`:""}</div>`}).join("")}
function bindTexts(){(W.texts||[]).forEach(t=>{if(!t.ids.length)return;const box=$("tx-"+t.id),cue=box.querySelector(".cue");
 box.querySelectorAll(".sn").forEach(e=>e.onclick=()=>{unlock();stop();const j=+e.dataset.j;e.classList.add("hl");play1(SENT[j]).then(()=>e.classList.remove("hl"))});
 box.querySelector('[data-a="stop"]').onclick=stop;
 const zb=box.querySelector('[data-a="zh"]');if(zb)zb.onclick=()=>{const on=box.classList.toggle("showzh");zb.textContent=on?"隱藏中文":"顯示中文"};
 box.querySelector('[data-a="all"]').onclick=async()=>{unlock();stop();const r=run,s0=TTS.sess();const ok=()=>run===r&&TTS.sess()===s0;
  for(let n=0;n<t.ids.length&&ok();n++){const j=t.ids[n];const e=$("s"+j);e.classList.add("hl");cueEl(cue,"listen","【"+(n+1)+"/"+t.ids.length+"】");const d=await play1(SENT[j]);e.classList.remove("hl");if(d==null||!ok())return;if(!await wait(.35))return}if(ok())cue.textContent=""};
 box.querySelector('[data-a="echo"]').onclick=async()=>{unlock();stop();const r=run,s0=TTS.sess();const ok=()=>run===r&&TTS.sess()===s0;
  for(let n=0;n<t.ids.length&&ok();n++){const j=t.ids[n],e=$("s"+j),lb="【"+(n+1)+"/"+t.ids.length+"】";e.classList.add("hl");cueEl(cue,"listen",lb);const d=await play1(SENT[j]);if(d==null||!ok()){e.classList.remove("hl");return}
   cueEl(cue,"echo",lb);if(!await wait(echoGap(d))||!ok()){e.classList.remove("hl");return}cueEl(cue,"shadow",lb);if(!await wait(shadowGap(d))||!ok()){e.classList.remove("hl");return}e.classList.remove("hl")}if(ok())cue.textContent="完成 ✔"}})}
/* ===== 小測驗：W.quiz＝原版的教學題（冠詞、動詞變化、estar／現在分詞、性數一致、Ser…），選項順序固定；
   W.autoQuiz（或沒有 W.quiz）時另外自動出題：定義→單字、單字→中文、中文→單字（沒有中文就不出中文題）。 */
const Q=[];(W.quiz||[]).forEach(q=>Q.push(Object.assign({t:"c",fixed:1,k:"c|"+q.z+"|"+q.q+"|"+q.a},q)));
if(W.autoQuiz||!Q.length)ALL.forEach(c=>{if(c.def)Q.push({t:"def",c});if(c.zh){Q.push({t:"w2zh",c});Q.push({t:"zh2w",c})}});
const shuf=a=>{a=a.slice();for(let k=a.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[a[k],a[j]]=[a[j],a[k]]}return a};
const zq=c=>c.zq||c.zh;
function prep(q){const c=q.c;q.say=key(c);q.k=q.t+"|"+key(c);
 if(q.t==="def"){const re=/\s|\//.test(c.w)?null:new RegExp("\\b"+c.w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\w*","gi");q.q=re?c.def.replace(re,"＿＿＿"):c.def;q.z="哪個單字的意思是？";q.a=c.w;q.o=shuf([c,...shuf(ALL.filter(x=>x!==c&&x.w!==c.w)).slice(0,3)]).map(x=>x.w)}
 else if(q.t==="w2zh"){q.q=c.w;q.z="中文意思是？";q.a=zq(c);const d=[];shuf(ALL.filter(x=>x!==c&&x.zh&&zq(x)!==q.a)).forEach(x=>{if(d.length<3&&!d.includes(zq(x)))d.push(zq(x))});q.o=shuf([q.a,...d])}
 else{q.q=zq(c);q.z="哪個西班牙文單字／詞組？";q.a=c.w;const d=[];shuf(ALL.filter(x=>x!==c&&x.zh&&zq(x)!==zq(c)&&x.w!==c.w)).forEach(x=>{if(d.length<3&&!d.includes(x.w))d.push(x.w)});q.o=shuf([c.w,...d])}}
function quiz(){const q=Q[qi];if(!q.o)prep(q);$("sc").textContent="答對 "+score+" / "+done;$("qw").textContent=pk&&q.show?q.show:q.q;$("qz").textContent=q.z;$("qo").innerHTML="";
 q.o.forEach(o=>{const b=document.createElement("button");b.className="b";b.textContent=o;if(pk&&o===q.a){b.style.background="var(--ok)";b.style.color="#fff"}else if(pk===o)b.style.color="var(--bad)";
  b.onclick=()=>{if(pk)return;unlock();pk=o;done++;if(o===q.a)score++;quiz();cc=null;play1(q.say)};$("qo").appendChild(b)});
 $("qr").textContent=pk?(pk===q.a?"¡Muy bien! 答對了 👏":"正確答案是 "+q.a):"";$("qr").style.color=pk===q.a?"var(--ok)":"var(--bad)";$("qn").style.display=pk?"":"none"}
$("qn").onclick=()=>{pk=null;let n=qi;while(Q.length>1&&n===qi)n=Math.floor(Math.random()*Q.length);qi=n;if(!Q[qi].fixed)Q[qi].o=null;quiz()};
/* ===== 口說練習（decks）：kind "say"＝看提示先說、再看答案＋聽；kind "qa"＝問答。item.pic＝提示圖、item.say＝音檔 key（預設同 a） ===== */
const DK=W.decks;
function drill(){const d=DK[dk],it=d.items[di];$("dlab").textContent=d.lab||(d.kind==="say"?"看到提示，先自己用西班牙文說說看：":"先自己說說看（可以點題目聽一次）：");
 $("dic").innerHTML=it.pic&&window.PIC?window.PIC(it.pic):"";
 $("dq").textContent=it.q;$("da").textContent=d.kind==="say"?it.a.join(d.join||" / "):it.a[0];$("da").style.visibility="hidden";
 $("dnote").textContent=(it.note||"")+(it.tag?"（"+it.tag+"）":"")||"";$("dnote").style.display="none";$("dpos").textContent=d.name+"　"+(di+1)+" / "+d.items.length}
$("dr").onclick=()=>{unlock();$("da").style.visibility="visible";$("dnote").style.display="";const d=DK[dk],it=d.items[di],ks=it.say||it.a;once(d.kind==="say"?ks:[ks[0]])};
$("dn").onclick=()=>{stop();const n=DK[dk].items.length;di=n>1?(di+1+Math.floor(Math.random()*(n-1)))%n:0;drill()};
$("dq").onclick=()=>{unlock();if(DK[dk].kind==="qa")once([DK[dk].items[di].q.replace(/^(Q\d|Question):\s*/,"")])};
/* ===== 吊人遊戲 Ahorcado（W.hang 且頁面有 #hk 才啟用）：猜名詞（卡的 alt），提示＝中文＋冠詞 ===== */
const HW=W.hang&&$("hk")?ALL.filter(c=>c.alt&&c.alt[0]&&c.w.includes(" ")):[];
let hi=0,hg=new Set(),hx=0,hsp=0;
const nrm=s=>s==="ñ"?s:s.normalize("NFD").replace(/[\u0300-\u036f]/g,"");
function hang(){if(!HW.length)return;const c=HW[hi],w=c.alt[0],art=c.w.split(" ")[0];const won=[...w].every(ch=>hg.has(nrm(ch))||hg.has(ch)),lost=hx>=6;
 $("hz").textContent="提示："+c.zh+"（冠詞 "+art+"）";$("hw").textContent=[...w].map(ch=>(won||lost||hg.has(nrm(ch))||hg.has(ch))?ch:"_").join(" ");$("hm").textContent="錯誤 "+hx+" / 6";
 $("hk").innerHTML="";"abcdefghijklmnñopqrstuvwxyz".split("").forEach(l=>{const b=document.createElement("button");b.className="b";b.textContent=l;b.disabled=hg.has(l)||won||lost;
  b.onclick=()=>{unlock();hg.add(l);if(![...w].some(ch=>nrm(ch)===l||ch===l))hx++;hang()};$("hk").appendChild(b)});
 $("hr").textContent=won?"¡Muy bien! "+c.w:lost?"答案："+c.w:"";$("hr").style.color=won?"var(--ok)":"var(--bad)";if((won||lost)&&!hsp){hsp=1;cc=null;play1(key(c))}}
function hangNew(){if(!HW.length)return;let n=hi;while(HW.length>1&&n===hi)n=Math.floor(Math.random()*HW.length);hi=n;hg=new Set();hx=0;hsp=0;hang()}
if(HW.length){$("hn").onclick=()=>{stop();hangNew()};$("hh").onclick=()=>{unlock();once([HW[hi].alt[0]])}}
/* ===== 按鈕 ===== */
$("o1").onclick=()=>{unlock();const c=list()[i];cardOnce(c,o1Keys(c))};$("o2").onclick=()=>{unlock();const c=list()[i],ks=o2Keys(c);if(ks.length)cardOnce(c,ks)};
$("pv").onclick=()=>{stop();i=(i-1+list().length)%list().length;render()};$("nx").onclick=()=>{stop();i=(i+1)%list().length;render()};$("pl").onclick=()=>{unlock();playing?stop():play()};
["pl","o1","o2"].forEach(id=>{const el=$(id);if(el)el.addEventListener("pointerdown",unlock,{passive:true})});
$("texts").innerHTML=textsHTML();bindTexts();
const gLast=G.map(()=>-1);
/* 分組按鈕：簡稱＋張數。選中組用目前 i，其他組用上次停留張數（沒去過則該組的起始張，同 startIdx 規則） */
function grpLabels(){gLast[g]=i;G.forEach((x,k)=>{const b=$("grp").children[k];if(!b)return;const n=x.cards.length,cur=k===g?i:(gLast[k]>=0?gLast[k]:startIdx(k));
 b.innerHTML=esc(x.short||x.name)+"<small>"+(cur+1)+"/"+n+"</small>";b.className=k===g?"on":""})}
(function(){const el=$("grp");el.innerHTML="";if(G.length>4)el.classList.add("many");G.forEach((x,k)=>{const b=document.createElement("button");b.onclick=()=>{stop();g=k;i=startIdx();render();if(b.scrollIntoView&&el.classList.contains("many"))b.scrollIntoView({block:"nearest",inline:"center"})};el.appendChild(b)})})();
seg($("rate"),R.map(r=>r+"x"),R.indexOf(rate),k=>{rate=R[k]});
seg($("dkseg"),DK.map(x=>x.name),dk,k=>{stop();dk=k;di=0;drill()});if(DK.length<2)$("dkseg").style.display="none";
if(!TTS.supported())$("nov").style.display="";
try{qi=Math.floor(Math.random()*Q.length);hi=Math.floor(Math.random()*(HW.length||1));setCue("");i=startIdx();render();quiz();drill();hang();window.__unitReady=1}catch(e){console.error(e);document.body.insertAdjacentHTML("afterbegin","<div style='padding:12px;color:#d64545'>載入失敗："+e+"</div>")}
RW.page(W.uid,Object.assign({qans:()=>Q[qi].a,list:()=>list(),idx:()=>i,cardKey:c=>key(c),qkey:()=>Q[qi].k,drillFn:"drill",cards:ALL.map(key),
 exCard:k=>cc&&k!==key(cc)&&ownKeys(cc).includes(k)?key(cc):null,
 story:SENT.length?SENT:null,score:()=>score,done:()=>done,speakBtn:$("dr"),speakText:()=>$("da").textContent},
 HW.length?{hang:()=>$("hr").textContent.startsWith("¡Muy bien")?HW[hi].alt[0]:null,hkey:()=>HW[hi].alt[0]}:{}));RPG.page();
