#!/usr/bin/env node
/* node tools/build_pages.js
   依 version.txt 產生 index.html 與 week00–06.html（頁面殼）。升版：改 version.txt 後重跑，PAGEVER／version.txt／所有 ?v= 就會一致。 */
const fs=require("fs"),path=require("path"),ROOT=path.resolve(__dirname,"..");
const V=fs.readFileSync(path.join(ROOT,"version.txt"),"utf8").trim();
const SITE="西班牙文-拳王之路";
const ICON=`<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🥊%3C/text%3E%3C/svg%3E">`;
const HEAD=`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta http-equiv="Cache-Control" content="no-cache"><meta name="viewport" content="width=device-width,initial-scale=1">`;
/* 每單元：名稱、小測驗標題、口說標題、是否有吊人遊戲、extra＝多載 weekNN-extra.js（並在 body 加 class uN） */
const U=[
 {n:0,name:"文法術語 Gramática",quiz:"小測驗：西 ↔ 中 ↔ 英・判斷詞類",speak:"口說練習：術語與例句"},
 {n:1,name:"冠詞",quiz:"小測驗：選出正確的冠詞・單字中文",speak:"口說練習：Hay ________ en la foto."},
 {n:2,name:"冠詞＋單字",quiz:"小測驗：選出正確的冠詞・單字中文",speak:"口說練習：Hay ________ en la foto.",hang:1},
 {n:3,name:"動詞 Verbos 1",quiz:"小測驗：選出正確的動詞變化",speak:"口說練習：替換主詞說動詞"},
 {n:4,name:"Estar + Gerundio",quiz:"小測驗：填入 estar 或現在分詞",speak:"口說練習：看圖說兩句"},
 {n:5,name:"Ser + 形容詞・顏色",quiz:"小測驗：性數一致・Ser 變位・Escribe",speak:"口說練習：Ser + 形容詞"},
 {n:6,name:"指示詞 Demostrativos",quiz:"小測驗：選出正確的指示詞",speak:"口說練習：看情境說指示詞",extra:1}];
const index=`${HEAD}
<title>${SITE}</title>${ICON}<style>
:root{--bg:#f6f7fb;--fg:#1b1d24;--mu:#6b7080;--cd:#fff;--ln:#e3e5ec;--ac:#2f6fed}
@media(prefers-color-scheme:dark){:root{--bg:#121318;--fg:#eceef4;--mu:#9aa0b0;--cd:#1d1f27;--ln:#2c2f3a;--ac:#6ea0ff}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font-family:-apple-system,"PingFang TC","Noto Sans TC",sans-serif;padding-bottom:70px}
.w{max-width:560px;margin:0 auto;padding:28px 16px 40px}h1{font-size:28px;margin:0 0 6px}.sub{color:var(--mu);font-size:16px;margin:0 0 22px;line-height:1.5}
a.card,.card{display:block;background:var(--cd);border:1px solid var(--ln);border-radius:16px;padding:20px;margin-bottom:14px;color:inherit;text-decoration:none;min-height:88px}
a.card:active{transform:scale(.98)}.t{display:flex;justify-content:space-between;align-items:center}.wk{font-size:22px;font-weight:800}.s{color:var(--mu);margin-top:10px;font-size:16px}.go{color:var(--ac);margin-top:10px;font-weight:600}
</style></head><body><div class="w"><h1 style="margin-top:12px">🥊 ${SITE}</h1><p class="sub">依學習順序的單元（新的在上）｜單字 → 課文 → 其他｜自然語音（西文 Elvira／英文 Jenny）＋回音法：先聽、心裡回音、再大聲跟讀</p><div id="rpgc"></div><div id="list"></div></div>
<script>window.PAGEVER="${V}"</script><script src="rw.js?v=${V}"></script><script src="rpg.js?v=${V}"></script><script>RW.home(document.getElementById("list"));RPG.home(document.getElementById("rpgc"))</script></body></html>
`;
const week=u=>{const wk="week0"+u.n;return `${HEAD}<title>單元 ${u.n}｜${u.name}・${SITE}</title>${ICON}<link rel="stylesheet" href="style.css?v=${V}"></head><body${u.extra?` class="u${u.n}"`:""}><div class="w">
<header class="wk">
<div class="wk-top"><a class="nav" href="index.html">← 西班牙文首頁</a>
<h1>單元 ${u.n}<span class="wk-date">${u.name}</span></h1></div>
<nav class="jump" id="jump" aria-label="本單元內容">
<div class="jump-bar">
<button type="button" class="on" data-sec="v">單字</button>
<button type="button" data-sec="t">課文</button>
<button type="button" data-sec="o">其他</button>
</div>
</nav>
</header>
<div id="nov" style="display:none;color:var(--bad);font-size:14px">⚠️ 這個瀏覽器不支援音訊播放，請改用 Chrome／Safari／Edge。</div>

<section id="sec-v" class="panel">
<div class="seg" id="grp"></div>
<div class="box c bc"><div class="ic" id="ic"></div><div class="big" id="w"></div><div style="font-size:22px;font-weight:700;color:var(--ac)" id="zh"></div><div class="mu" id="tag"></div><div id="en"></div><div id="ex"></div><div class="cue" id="cue"></div></div>
<div class="row" style="flex-wrap:nowrap"><button class="b" id="o1">念單字</button><button class="b" id="o2">念例句</button></div>
<div class="row"><button class="b" id="pv">‹ 上一個</button><button class="b p" id="pl">▶ 回音法播放</button><button class="b" id="nx">下一個 ›</button></div>
<div class="mu">語速</div><div class="seg" id="rate"></div>
<div class="box"><b>單字卡</b><div class="mu" style="font-size:14px">點卡聽發音（單字→例句），並切換到這張卡練習。</div><div class="ga" id="ga"></div></div>
</section>

<section id="sec-t" class="panel" hidden>
<div id="texts" style="display:flex;flex-direction:column;gap:14px"></div>
</section>

<section id="sec-o" class="panel" hidden>
<div class="box c"><b>${u.quiz}</b><div class="mu" id="sc"></div><div class="sen" id="qw"></div><div class="mu" id="qz"></div><div class="row" id="qo"></div><div id="qr" style="font-weight:700;font-size:18px"></div><button class="b p" id="qn" style="display:none">下一題 ›</button></div>
<div class="box c"><b>${u.speak}</b><div class="seg" id="dkseg"></div><div class="mu" id="dpos"></div><div class="mu" id="dlab"></div><div class="dic" id="dic"></div><div class="sen" id="dq" style="cursor:pointer"></div><div class="sen hl" id="da" style="visibility:hidden"></div><div class="mu" id="dnote" style="font-size:14px"></div><div class="mu" style="font-size:13px">先大聲說，再按「看答案＋聽」聽示範、跟讀。</div><div class="row"><button class="b p" id="dr">看答案＋聽</button><button class="b" id="dn">換一題 ›</button></div></div>
${u.hang?`<div class="box"><b class="c">吊人遊戲 Ahorcado：猜單字</b><div class="mu c" id="hz"></div><div class="big c" style="font-size:30px;letter-spacing:4px" id="hw"></div><div class="mu c" id="hm"></div><div class="row" id="hk"></div><div class="c" id="hr" style="font-weight:700;font-size:18px"></div><div class="row"><button class="b" id="hh">聽提示</button><button class="b p" id="hn">換一個字</button></div></div>
`:""}<div id="rw"></div>
<div class="ft">發音：西班牙文 Elvira（es-ES）、英文 Jenny（en-US），皆為預錄自然語音。圖示：Twemoji（CC-BY 4.0）；顏色用色塊。</div>
</section>
</div>
<script>window.PAGEVER="${V}"</script><script src="rw.js?v=${V}"></script><script src="rpg.js?v=${V}"></script><script src="${wk}-audio.js?v=${V}"></script><script src="speech.js?v=${V}"></script><script src="${wk}-data.js?v=${V}"></script><script src="${wk}-icons.js?v=${V}"></script><script src="unit.js?v=${V}"></script>${u.extra?`<script src="${wk}-extra.js?v=${V}"></script>`:""}
<script>
(function(){
  const nav=document.getElementById("jump");
  if(!nav)return;
  function show(id,scroll){
    ["v","t","o"].forEach(s=>{
      const el=document.getElementById("sec-"+s);
      if(el)el.hidden=s!==id;
    });
    nav.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.dataset.sec===id));
    try{TTS&&TTS.cancel&&TTS.cancel()}catch(e){}
    if(id==="v"&&typeof pickStart==="function")pickStart();
    if(scroll)window.scrollTo({top:0,behavior:"instant"});
  }
  nav.addEventListener("click",e=>{
    const b=e.target.closest("button[data-sec]");
    if(!b)return;
    history.replaceState(null,"","#"+b.dataset.sec);
    show(b.dataset.sec,true);
  });
  const init=(location.hash||"").replace("#","").replace("sec-","");
  if(["v","t","o"].includes(init))show(init,false);
})();
</script>
</body></html>
`};
fs.writeFileSync(path.join(ROOT,"index.html"),index);
U.forEach(u=>fs.writeFileSync(path.join(ROOT,"week0"+u.n+".html"),week(u)));
console.log("version "+V+"：index.html + "+U.length+" 個單元頁");
