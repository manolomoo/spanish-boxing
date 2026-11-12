/* 西班牙文・拳王系統（全站共用）— 需先載入 rw.js。練習紀錄與💵仍由 rw.js 負責。 */
(function(){
const K="esBoxerRPG1";let MEM=null;
const ld=()=>{try{const v=localStorage.getItem(K);if(v)return JSON.parse(v)}catch(e){}return MEM||{}};
const sv=d=>{MEM=d;try{localStorage.setItem(K,JSON.stringify(d))}catch(e){}};
const TITLES=[["Novato","拳擊學員"],["Aprendiz","見習拳手"],["Aficionado","業餘拳手"],["Boxeador","拳手"],["Sparring","對打拳手"],["Competidor","出賽拳手"],["Púgil","職業拳手"],["Contendiente","挑戰者"],["Finalista","決賽拳手"],["Campeón","冠軍"],["Gran Campeón","大冠軍"],["Rey del Ring","拳王"],["Rey Invicto","不敗拳王"],["Campeón Nacional","全國拳王"],["Campeón Continental","洲際拳王"],["Campeón Mundial","世界拳王"],["Campeón Unificado","統一拳王"],["Campeón Indiscutido","無爭議拳王"],["Rey de Reyes","王中之王"],["Leyenda del Ring","傳奇拳王"],["Salón de la Fama","名人堂拳王"],["Mito del Boxeo","神話拳王"],["Inmortal del Boxeo","不朽拳王"],["Rey Eterno","永恆拳王"]];
const MAXLV=24;
const need=L=>Math.round(190*Math.pow(L,0.60));            // Lv L → L+1 所需 XP
function lvOf(xp){let L=1,r=xp;while(L<MAXLV&&r>=need(L)){r-=need(L);L++}return L>=MAXLV?{L,cur:1,nx:1,max:true}:{L,cur:r,nx:need(L)}}   // 24 級滿級：經驗條 100%
const title=L=>TITLES[Math.min(L,TITLES.length)-1];
const ABIL=[
 {lv:2,id:"daily",name:"早訓加倍",desc:"每天前 10 次練習 XP ×2"},
 {lv:3,id:"hint1",name:"教練提示 ×1",desc:"小測驗每天可用 1 次「💡 提示」刪掉一個錯誤選項"},
 {lv:4,id:"combo1",name:"組合拳 I",desc:"連續答對 3 題起，答題 XP ×1.2"},
 {lv:5,id:"bronze",name:"銅腰帶",desc:"腰帶與頭像框解鎖：銅"},
 {lv:6,id:"hint2",name:"教練提示 ×2",desc:"每天提示增為 2 次"},
 {lv:6,id:"xp10",name:"出拳 +10%",desc:"所有 XP +10%"},
 {lv:8,id:"combo2",name:"組合拳 II",desc:"連續答對 5 題起，答題 XP ×1.5"},
 {lv:8,id:"silver",name:"銀腰帶",desc:"腰帶與頭像框解鎖：銀"},
 {lv:10,id:"hint3",name:"教練提示 ×3",desc:"每天提示增為 3 次"},
 {lv:10,id:"xp20",name:"出拳 +20%",desc:"所有 XP +20%（取代 +10%）"},
 {lv:10,id:"cool",name:"墨鏡上場",desc:"頭像造型解鎖：墨鏡"},
 {lv:10,id:"gold",name:"金腰帶",desc:"腰帶與頭像框解鎖：金"},
 {lv:12,id:"combo3",name:"組合拳 III",desc:"連續答對 10 題起，答題 XP ×2"},
 {lv:12,id:"crown",name:"拳王金冠",desc:"頭像造型解鎖：金冠"},
 {lv:13,id:"guard",name:"護齒",desc:"頭像造型解鎖：護齒"},
 {lv:14,id:"band",name:"紅色頭帶",desc:"頭像造型解鎖：頭帶"},
 {lv:15,id:"trim",name:"金邊拳套與冠軍短褲",desc:"頭像造型解鎖：金邊紅拳套、金邊紅短褲"},
 {lv:16,id:"wraps",name:"白色手綁帶",desc:"頭像造型解鎖：手綁帶"},
 {lv:17,id:"cape",name:"冠軍披風",desc:"頭像造型解鎖：肩上的紅色冠軍披風"},
 {lv:18,id:"crown2",name:"寶石金冠",desc:"頭像造型解鎖：更高、寶石更多的拳王金冠"},
 {lv:19,id:"wbc",name:"WBC 綠腰帶",desc:"頭像造型解鎖：世界冠軍綠腰帶"},
 {lv:20,id:"goldglove",name:"黃金拳套與紫金框",desc:"頭像造型解鎖：黃金拳套、紫金頭像框"},
 {lv:21,id:"legend",name:"傳奇戰袍",desc:"頭像造型解鎖：最大金冠、紫金披風、紫金短褲、華麗頭像框"},
 {lv:22,id:"spot",name:"聚光燈光環",desc:"頭像造型解鎖：擂台聚光燈光環與光芒"},
 {lv:23,id:"platinum",name:"白金拳套與星光",desc:"頭像造型解鎖：白金拳套、星光點綴、銀白頭像框"},
 {lv:24,id:"eternal",name:"鑽石拳套與極光框",desc:"頭像造型解鎖：鑽石金冠、鑽石拳套、虹彩披風與腰帶、極光頭像框、最強光環（滿級）"}];
const has=(L,id)=>ABIL.some(a=>a.id===id&&L>=a.lv);
const ATTR={lis:"聽力",spk:"口說",voc:"詞彙"};
const attrOf=(t,uid)=>t==="story"?"lis":t==="speak"?"spk":t==="cards"||t==="quiz"||t==="hang"?"voc":null;
const BASE={cards:[10,3],story:[8,3],speak:[12,5],hang:[25,15],quizOk:[15,8],quizBad:[3,3],crown:[50,50],king:[150,150]};
const today=()=>new Date().toLocaleDateString("sv");
const attrLv=p=>Math.floor(Math.sqrt((p||0)/10));          // 屬性等級
const attrBonus=p=>Math.min(attrLv(p)*2,30);                 // 每屬性等級 +2% 該類 XP，上限 30%
function st(){const d=ld();d.xp=d.xp||0;d.at=d.at||{};d.day=d.day||{};if(d.day.d!==today())d.day={d:today(),n:0,h:0};d.combo=d.combo||0;d.best=d.best||0;return d}
function migrate(){const d=ld();if(d.mig)return;const r=window.RW?RW.ld():{};let xp=0;const at={lis:0,spk:0,voc:0};
 Object.entries(r.pm||{}).forEach(([k,n])=>{const[u,t]=k.split("|");const b=t==="quiz"?BASE.quizOk:BASE[t]||[5,2];const g=b[0]+(n-1)*b[1];xp+=g;const a=attrOf(t,u);if(a)at[a]+=g});
 (RW?RW.UNITS:[]).forEach(U=>{U.types.forEach(t=>{if(RW.tst(U.id,t)===2)xp+=BASE.crown[0]});if(RW.ust(U)===2)xp+=BASE.king[0]});
 const s=st();s.xp+=xp;Object.keys(at).forEach(a=>s.at[a]=(s.at[a]||0)+at[a]);s.mig=1;s.migXP=xp;sv(s)}
/* ===== 拳王藏品：累計 XP 到了就自動開箱（沒有商店、XP 不會被花掉）===== */
const CATS=[["glove","拳套","🥊"],["shoe","拳擊鞋","👟"],["gear","護具／戰袍","⛑️"],["train","訓練器材","🏋️"],["belt","冠軍腰帶","🏅"],["trophy","獎盃","🏆"],["memo","名戰紀念品","🎟️"],["stock","贊助／股票","📈"],["gym","拳擊館","🏛️"],["ring","擂台／賽事","🏟️"]];
const W=1e4,Y=1e8;                                         // 萬、億（新台幣）
// 依 xp 由小到大排列；id 一旦上線就不要改。grow:1 = 股票／贊助合約，身價會隨累計 XP 增值（value 為基準價）
const TREASURES=[
 {id:"train-rope",xp:60,cat:"train",name:"速度跳繩",value:800,ico:"➰"},
 {id:"gear-wraps",xp:120,cat:"gear",name:"手綁帶一副",value:500,ico:"🩹"},
 {id:"gear-mouthguard",xp:200,cat:"gear",name:"護齒",value:1200,ico:"🦷"},
 {id:"gl-starter",xp:300,cat:"glove",name:"入門訓練拳套",value:2500,ico:"🥊"},
 {id:"shoe-starter",xp:400,cat:"shoe",name:"入門拳擊鞋",value:3500,ico:"👟"},
 {id:"train-mitts",xp:520,cat:"train",name:"教練手靶一對",value:3000,ico:"🎯"},
 {id:"gear-headgear",xp:630,cat:"gear",name:"訓練頭盔",value:4500,ico:"⛑️"},
 {id:"train-bell",xp:760,cat:"train",name:"回合計時鈴",value:2000,ico:"🔔"},
 {id:"train-heavybag",xp:880,cat:"train",name:"懸吊重沙袋",value:8000,ico:"🏋️"},
 {id:"gl-reyes",xp:1010,cat:"glove",name:"Cleto Reyes 墨西哥手工拳套",value:1.2*W,ico:"🥊"},
 {id:"shoe-hyperko",xp:1140,cat:"shoe",name:"Nike HyperKO 拳擊鞋",value:6000,ico:"👟"},
 {id:"memo-poster",xp:1282,cat:"memo",name:"冠軍戰親筆簽名海報",value:1.5*W,ico:"🖼️"},
 {id:"gear-winning-head",xp:1322,cat:"gear",name:"Winning 日製頭盔",value:1.8*W,ico:"⛑️"},
 {id:"stock-nike",xp:1440,cat:"stock",name:"Nike 股票 100 股",value:25*W,ico:"📈",grow:1},
 {id:"gl-winning",xp:1610,cat:"glove",name:"Winning 日製比賽拳套",value:2*W,ico:"🥊"},
 {id:"trophy-rookie",xp:1800,cat:"trophy",name:"新人賽獎盃",value:5000,ico:"🏆"},
 {id:"shoe-boxhog",xp:2000,cat:"shoe",name:"Adidas Box Hog 拳擊鞋",value:5000,ico:"👟"},
 {id:"stock-adidas",xp:2250,cat:"stock",name:"Adidas 股票 100 股",value:70*W,ico:"💹",grow:1},
 {id:"gl-grant",xp:2450,cat:"glove",name:"Grant 職業比賽拳套",value:3*W,ico:"🥊"},
 {id:"train-speedbag",xp:2700,cat:"train",name:"速度球與梨球架",value:1.5*W,ico:"🥎"},
 {id:"belt-city",xp:2949,cat:"belt",name:"縣市錦標賽金牌",value:1*W,ico:"🥇"},
 {id:"gear-robe",xp:2989,cat:"gear",name:"絲質連帽冠軍戰袍",value:5*W,ico:"🧥"},
 {id:"shoe-custom",xp:3150,cat:"shoe",name:"手工訂製拳擊鞋",value:3*W,ico:"👟"},
 {id:"belt-national",xp:3400,cat:"belt",name:"全國冠軍腰帶",value:30*W,ico:"🏅"},
 {id:"train-weights",xp:3700,cat:"train",name:"全套重訓器材",value:25*W,ico:"🏋️"},
 {id:"memo-jungle-ticket",xp:4050,cat:"memo",name:"1974「叢林之戰」原版門票",value:40*W,ico:"🎟️"},
 {id:"belt-opbf",xp:4350,cat:"belt",name:"東洋太平洋冠軍腰帶",value:60*W,ico:"🏅"},
 {id:"stock-underarmour",xp:4700,cat:"stock",name:"Under Armour 股票 1,000 股",value:30*W,ico:"📈",grow:1},
 {id:"gl-signed-gold",xp:5077,cat:"glove",name:"世界冠軍親簽金拳套",value:50*W,ico:"🥊"},
 {id:"ring-own",xp:5117,cat:"ring",name:"標準比賽擂台一座",value:80*W,ico:"🏟️"},
 {id:"gear-trunks",xp:5300,cat:"gear",name:"訂製金邊冠軍短褲",value:8*W,ico:"🩳"},
 {id:"memo-manila-glove",xp:5500,cat:"memo",name:"「馬尼拉顫慄」簽名拳套",value:300*W,ico:"🧤"},
 {id:"gym-local",xp:5800,cat:"gym",name:"社區拳擊館",value:1500*W,ico:"🏠"},
 {id:"train-icebath",xp:6100,cat:"train",name:"冰浴恢復艙",value:60*W,ico:"🧊"},
 {id:"belt-wbo",xp:6400,cat:"belt",name:"WBO 世界冠軍腰帶",value:500*W,ico:"🏅"},
 {id:"ring-vegas-box",xp:6722,cat:"ring",name:"拉斯維加斯冠軍戰場邊包廂",value:300*W,ico:"🎫"},
 {id:"gear-diamond-guard",xp:6762,cat:"gear",name:"鑲鑽護齒",value:100*W,ico:"🦷"},
 {id:"ring-team-bus",xp:7000,cat:"ring",name:"訓練營專屬巴士",value:800*W,ico:"🚌"},
 {id:"gym-taipei",xp:7300,cat:"gym",name:"台北旗艦拳擊館",value:1.2*Y,ico:"🏢"},
 {id:"gl-24k",xp:7700,cat:"glove",name:"24K 鍍金拳套",value:600*W,ico:"🥊"},
 {id:"memo-ali-glove",xp:8100,cat:"memo",name:"阿里親筆簽名拳套",value:1500*W,ico:"🧤"},
 {id:"ring-tv-rights",xp:8533,cat:"ring",name:"冠軍戰單場轉播權",value:3000*W,ico:"📺"},
 {id:"stock-sponsor",xp:8573,cat:"stock",name:"運動品牌贊助合約（年約）",value:2000*W,ico:"📝",grow:1},
 {id:"gym-mexico-camp",xp:8900,cat:"gym",name:"墨西哥城高地訓練營",value:2*Y,ico:"⛰️"},
 {id:"ring-charter-jet",xp:9400,cat:"ring",name:"冠軍出賽專機",value:4500*W,ico:"🛩️"},
 {id:"memo-century-robe",xp:9900,cat:"memo",name:"「世紀之戰」冠軍戰袍",value:1.5*Y,ico:"🧥"},
 {id:"belt-wba",xp:10501,cat:"belt",name:"WBA 超級冠軍腰帶",value:1*Y,ico:"🏅"},
 {id:"gym-hollywood",xp:10541,cat:"gym",name:"洛杉磯好萊塢拳館",value:5*Y,ico:"🏛️"},
 {id:"trophy-fighter-year",xp:10900,cat:"trophy",name:"年度最佳拳手獎座",value:5000*W,ico:"🏆"},
 {id:"memo-ali-1974",xp:11400,cat:"memo",name:"阿里 1974 冠軍戰拳套真品",value:8*Y,ico:"🧤"},
 {id:"gym-newyork",xp:12000,cat:"gym",name:"紐約傳奇拳館",value:9*Y,ico:"🏛️"},
 {id:"ring-fight-night",xp:12617,cat:"ring",name:"自有品牌拳賽之夜主辦權",value:12*Y,ico:"🎤"},
 {id:"ring-garden",xp:12657,cat:"ring",name:"麥迪遜花園冠軍戰主辦權",value:20*Y,ico:"🏟️"},
 {id:"trophy-olympic-gold",xp:13200,cat:"trophy",name:"奧運拳擊金牌",value:8000*W,ico:"🥇"},
 {id:"memo-hof-plaque",xp:14000,cat:"memo",name:"名人堂入選銘牌",value:4*Y,ico:"📜"},
 {id:"belt-ibf",xp:14875,cat:"belt",name:"IBF 世界冠軍腰帶",value:10*Y,ico:"🏅"},
 {id:"gym-vegas-academy",xp:14915,cat:"gym",name:"拉斯維加斯拳擊學院",value:18*Y,ico:"🏛️"},
 {id:"ring-dome",xp:15200,cat:"ring",name:"專屬場館「拳王巨蛋」",value:60*Y,ico:"🏟️"},
 {id:"memo-archive",xp:15600,cat:"memo",name:"百年拳擊史海報與手稿典藏",value:10*Y,ico:"📜"},
 {id:"gym-island",xp:16056,cat:"gym",name:"加勒比海私人訓練島",value:45*Y,ico:"🏝️"},
 {id:"stock-nike-100k",xp:16096,cat:"stock",name:"Nike 股票 10 萬股",value:2.5*Y,ico:"📈",grow:1},
 {id:"belt-wbc",xp:17100,cat:"belt",name:"WBC 鑲鑽綠腰帶",value:25*Y,ico:"🏅"},
 {id:"belt-undisputed",xp:18500,cat:"belt",name:"四大組織統一冠軍金腰帶",value:35*Y,ico:"🏆"}];
const catName=c=>(CATS.find(x=>x[0]===c)||[,""])[1];
const growPct=xp=>Math.round(Math.min(Math.max(xp,0),50000)/50000*80);       // 股票增值：每 625 XP +1%，上限 +80%
const trValue=(t,xp)=>t.grow?Math.round(t.value*(1+growPct(xp)/100)/1000)*1000:t.value;
const num=n=>Math.round(n).toLocaleString("en-US");
function money(n){const w=Math.round(n/W);if(w<1)return num(n)+" 元";const y=Math.floor(w/1e4),r=w%1e4;return y?num(y)+" 億"+(r?" "+num(r)+" 萬":""):num(w)+" 萬"}
const owned=xp=>TREASURES.filter(t=>xp>=t.xp);
const worth=xp=>owned(xp).reduce((a,t)=>a+trValue(t,xp),0);
const SAYINGS=["拳王不是天生的，是每天練出來的。","今天多念一句，腰帶就離你近一點。","真正的拳手，連動詞變位都打得漂亮。","Poco a poco 一步一步來，冠軍也是一拳一拳練出來的。","上擂台之前，先來一輪回音法。","聽、回音、跟讀，就是你的左右直拳加勾拳。","沙袋不會騙人，西班牙文也不會。","El campeón nunca deja de entrenar. 冠軍永遠在訓練。","今天的口說，是明天開口說西班牙文的底氣。","被擊倒沒關係，再念一遍就站起來了。","教練在等你，再練一回合就好。","實力是一回合一回合存出來的，經驗值也是。"];
function saying(){const d=new Date(),n=Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()))/864e5);return SAYINGS[n%SAYINGS.length]}
let AVN=0;
/* 拳擊手頭像（64×64）：隨等級演進——腰帶（銅→銀→金→WBC 綠→虹彩）、墨鏡、金冠（12→18→21→24 越來越大）、護齒、頭帶、
   金邊／黃金／白金／鑽石拳套、手綁帶、披風、聚光燈光環、星光；頭像框 銅→銀→金→Lv20 起漸層。 */
function avatar(L,sz){sz=sz||56;
 const Lh=id=>has(L,id),u="rg"+(++AVN)+"_";
 const SK="#e9b48d",SD="#c98d68",HR="#2b1d14";
 const star=(x,y,r,f,e)=>`<path d="M${x} ${y-r}Q${x} ${y} ${x+r} ${y}Q${x} ${y} ${x} ${y+r}Q${x} ${y} ${x-r} ${y}Q${x} ${y} ${x} ${y-r}z" fill="${f}" stroke="${e||"none"}" stroke-width=".4" stroke-linejoin="round"/>`;
 const dia=(x,y,s,f,e)=>`<path d="M${x} ${y-s}l${s} ${s} ${-s} ${s} ${-s} ${-s}z" fill="${f}" stroke="${e||"none"}" stroke-width=".5" stroke-linejoin="round"/>`;
 let defs="",back="";
 if(Lh("eternal"))defs+=`<linearGradient id="${u}d" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9ad5"/><stop offset=".35" stop-color="#9ad8ff"/><stop offset=".7" stop-color="#b69cff"/><stop offset="1" stop-color="#8ff0d0"/></linearGradient><linearGradient id="${u}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c9defa"/></linearGradient>`;
 // 聚光燈光環與光芒（22+）
 if(Lh("spot")){const g=Lh("eternal")?["#fff3b8",.95,"#ffd86b",.55]:Lh("platinum")?["#eaf4ff",.9,"#b8cfff",.5]:["#ffe9a0",.8,"#ffd25a",.4];
  defs+=`<radialGradient id="${u}a"><stop offset=".3" stop-color="${g[0]}" stop-opacity="${g[1]}"/><stop offset=".7" stop-color="${g[2]}" stop-opacity="${g[3]}"/><stop offset="1" stop-color="${g[2]}" stop-opacity="0"/></radialGradient>`;
  back+=`<circle cx="32" cy="32" r="31.5" fill="url(#${u}a)"/>`;
  if(!Lh("platinum")||Lh("eternal")){const n=Lh("eternal")?16:12;for(let k=0;k<n;k++){const a=k/n*6.2832,c=Math.cos(a),s=Math.sin(a);back+=`<path d="M${(32+c*21).toFixed(1)} ${(32+s*21).toFixed(1)}L${(32+c*31).toFixed(1)} ${(32+s*31).toFixed(1)}" stroke="${Lh("eternal")&&k%2?"#7fe3ff":"#f5b301"}" stroke-width="${Lh("eternal")?2:1.6}" stroke-linecap="round" opacity=".85"/>`}}}
 // 冠軍披風（17+）：紅 → 紫金（21）→ 虹彩（24）
 if(Lh("cape")){const cf=Lh("eternal")?`url(#${u}d)`:Lh("legend")?"#3b1470":"#b4232c",ce=Lh("eternal")?"#ffffff":"#f5b301";
  back+=`<path d="M7 64C7.500 52 11.500 46 20 44L44 44C52.500 46 56.500 52 57 64z" fill="${cf}" stroke="${ce}" stroke-width="${Lh("legend")?2.2:1.6}" stroke-linejoin="round"/>`}
 // 短褲與腰帶
 const sh=Lh("eternal")?"#16171c":Lh("legend")?"#5b2a9e":Lh("trim")?"#c81e2b":"#1b1d24",shE=Lh("trim")?"#f5b301":"none";
 const bt=Lh("eternal")?{f:`url(#${u}d)`,e:"#ffffff",p:"#ffffff",g:"#7fe3ff"}:Lh("wbc")?{f:"#1a9a5a",e:"#0f6b3d",p:"#f5b301",g:"#e8463a"}:Lh("gold")?{f:"#f5b301",e:"#c78a00",p:"#fff1b0",g:"#e8463a"}:Lh("silver")?{f:"#d5dbe3",e:"#98a1b0",p:"#ffffff",g:"#7aa7ff"}:Lh("bronze")?{f:"#c47b3a",e:"#8f5524",p:"#f0c9a0",g:"#8f5524"}:null;
 const belt=bt?`<rect x="18.500" y="54.500" width="27" height="5" rx="1.800" fill="${bt.f}" stroke="${bt.e}" stroke-width=".8"/><ellipse cx="32" cy="57" rx="5.200" ry="4" fill="${bt.p}" stroke="${bt.e}" stroke-width=".9"/><circle cx="32" cy="57" r="1.600" fill="${bt.g}"/>`:`<rect x="18.500" y="55.500" width="27" height="3" rx="1" fill="#5c6070"/>`;
 // 臉：墨鏡（10+）或眼睛；護齒（13+）；頭帶（14+）
 const eyes=Lh("cool")?`<path d="M23 23.500h8l-.7 3.400q-.5 1.800-2.300 1.800h-2.200q-1.900 0-2.300-1.800zM33 23.500h8l-.5 3.400q-.4 1.800-2.300 1.800h-2.200q-1.800 0-2.300-1.800z" fill="#16171c" stroke="#16171c" stroke-width="1" stroke-linejoin="round"/><path d="M31 24.300h2" stroke="#16171c" stroke-width="1.200"/>`:`<circle cx="28" cy="26" r="1.250" fill="#2a1c16"/><circle cx="36" cy="26" r="1.250" fill="#2a1c16"/><path d="M25.800 23.300q2.200-1 4.200.2M34 23.500q2-1.200 4.200-.2" fill="none" stroke="${HR}" stroke-width="1" stroke-linecap="round"/>`;
 const mouth=Lh("guard")?`<rect x="28.800" y="30.600" width="6.400" height="2.600" rx="1.300" fill="#ffffff" stroke="#3a8de0" stroke-width=".7"/>`:`<path d="M29.300 31.500q2.700 1.700 5.400 0" fill="none" stroke="#9a4a3a" stroke-width="1" stroke-linecap="round"/>`;
 const band=Lh("band")?`<path d="M22.700 20.200q9.300-3.600 18.600 0v2.900q-9.300-3.600-18.600 0z" fill="#e23d45" stroke="#b4232c" stroke-width=".5"/><path d="M41.200 20.800l5-1.800-.8 3.200zM41.200 22.200l4.200 3-3 .6z" fill="#e23d45" stroke="#b4232c" stroke-width=".5" stroke-linejoin="round"/>`:"";
 // 拳套：紅 → 金邊（15）→ 黃金（20）→ 白金（23）→ 鑽石（24）；手綁帶（16+）
 const gv=Lh("eternal")?{f:`url(#${u}c)`,e:"#4f94d6",t:"#dff1ff"}:Lh("platinum")?{f:"#e9ecf7",e:"#98a1b0",t:"#cfd6e6"}:Lh("goldglove")?{f:"#f5b301",e:"#c78a00",t:"#e0a200"}:Lh("trim")?{f:"#e23d45",e:"#f5b301",t:"#c81e2b"}:{f:"#e23d45",e:"#b4232c",t:"#c81e2b"};
 const cuff=Lh("wraps")?"#ffffff":Lh("trim")?"#f5b301":"#f4f6fb";
 const glove=(x,d)=>`<rect x="${x-5.5}" y="49.500" width="11" height="5.500" rx="1.600" fill="${cuff}" stroke="#b9bfd0" stroke-width=".6"/>${Lh("wraps")?`<path d="M${x-5.5} 51.300h11M${x-5.5} 53.200h11" stroke="#b9bfd0" stroke-width=".6"/>`:""}<ellipse cx="${x+d*5.6}" cy="45" rx="3.100" ry="4.300" fill="${gv.t}" stroke="${gv.e}" stroke-width=".9"/><ellipse cx="${x}" cy="42.500" rx="8" ry="8.600" fill="${gv.f}" stroke="${gv.e}" stroke-width="1.100"/><ellipse cx="${x-d*2.5}" cy="38.500" rx="3" ry="1.800" fill="#ffffff" opacity=".35"/>`;
 let gem=Lh("eternal")?dia(15,43,2,"#e6f6ff","#4f94d6")+dia(49,43,2,"#e6f6ff","#4f94d6"):"";
 // 星光（23+）
 let spk="";
 if(Lh("platinum")){const sc=Lh("eternal")?["#fff3b8","#bfe9ff","#ffc2ea","#c9ffe8"]:["#fff3b8"];
  [[9,13,3],[55,11,3.5],[6,30,2.5],[58,29,3],[14,23,1.800],[50,21,2]].forEach((p,i)=>spk+=star(p[0],p[1],p[2],sc[i%sc.length],"#d9a400"))}
 if(Lh("eternal"))[[4,20,1.5],[60,19,1.600],[4,58,1.600],[60,58,1.500],[32,3.500,1.400]].forEach(p=>spk+=star(p[0],p[1],p[2],"#fff","#7fa6d8"));
 // 金冠：12 拳王金冠 → 18 寶石金冠 → 21 最大金冠 → 24 鑽石金冠
 let crown="";
 if(Lh("eternal")){const dm=(x,y,s)=>dia(x,y,s,"#e6f6ff","#4f94d6");
  crown=`<path d="M18.500 16.500L16.500 6.500l7 4.500 2-7.500 6.500 5.500 6.500-5.500 2 7.500 7-4.500-2 10z" fill="url(#${u}c)" stroke="#6f9fd6" stroke-width="1" stroke-linejoin="round"/><path d="M16.500 6.500Q32-4 47.500 6.500" fill="none" stroke="#6f9fd6" stroke-width="1.200"/>`+dm(32,2,2.100)+dm(16.500,6.500,1.500)+dm(47.500,6.500,1.500)+dm(25.500,3.500,1.300)+dm(38.500,3.500,1.300)+dm(32,12,2.800)+dm(22.500,14,1.300)+dm(27,14.500,1.100)+dm(37,14.500,1.100)+dm(41.500,14,1.300)}
 else if(Lh("legend")){const st=(x,y)=>`<circle cx="${x}" cy="${y}" r="1.500" fill="#fff1b0" stroke="#c78a00" stroke-width=".5"/>`;
  crown=`<path d="M18.500 16.500L16.500 6.500l7 4.500 2-7.500 6.500 5.500 6.500-5.500 2 7.500 7-4.500-2 10z" fill="#f5b301" stroke="#c78a00" stroke-width="1" stroke-linejoin="round"/><path d="M16.500 6.500Q32-4 47.500 6.500" fill="none" stroke="#c78a00" stroke-width="1.400"/><circle cx="32" cy="1.900" r="1.900" fill="#e8463a" stroke="#c78a00" stroke-width=".7"/>`+st(16.500,6.500)+st(47.500,6.500)+st(25.500,3.500)+st(38.500,3.500)+`<circle cx="32" cy="12" r="2.200" fill="#b43bff" stroke="#6a1fa8" stroke-width=".6"/><circle cx="22.500" cy="14.200" r="1.100" fill="#e8463a"/><circle cx="27" cy="14.500" r="1" fill="#bfe9ff"/><circle cx="37" cy="14.500" r="1" fill="#bfe9ff"/><circle cx="41.500" cy="14.200" r="1.100" fill="#e8463a"/>`}
 else if(Lh("crown2"))crown=`<path d="M20.500 16L19 7.500l6 4 2-7.500 5 5.500 5-5.500 2 7.500 6-4-1.500 8.500z" fill="#f5b301" stroke="#c78a00" stroke-width="1" stroke-linejoin="round"/><circle cx="32" cy="3" r="1.600" fill="#e8463a" stroke="#c78a00" stroke-width=".5"/><circle cx="19" cy="7.500" r="1.200" fill="#fff1b0"/><circle cx="45" cy="7.500" r="1.200" fill="#fff1b0"/><circle cx="27" cy="4" r="1.100" fill="#bfe9ff"/><circle cx="37" cy="4" r="1.100" fill="#bfe9ff"/><circle cx="32" cy="13" r="1.900" fill="#1a9a5a" stroke="#0f6b3d" stroke-width=".5"/><circle cx="24.500" cy="14.200" r="1.100" fill="#e8463a"/><circle cx="39.500" cy="14.200" r="1.100" fill="#e8463a"/>`;
 else if(Lh("crown"))crown='<path d="M22.5 15.500l1.5-8 4.5 4.500 3.5-7.500 3.500 7.500 4.500-4.500 1.500 8z" fill="#f5b301" stroke="#c78a00" stroke-width="1" stroke-linejoin="round"/><circle cx="32" cy="5" r="1.600" fill="#e8463a"/><circle cx="27.800" cy="13" r="1" fill="#fff"/><circle cx="32" cy="13" r="1" fill="#bfe9ff"/><circle cx="36.200" cy="13" r="1" fill="#fff"/>';
 const svg=`<svg viewBox="0 0 64 64" width="${sz}" height="${sz}" aria-hidden="true">${defs?"<defs>"+defs+"</defs>":""}${back}<path d="M13.500 64c0-12 7.500-18 18.500-18s18.500 6 18.500 18z" fill="${SK}"/><path d="M26 49.500q6 3 12 0" fill="none" stroke="${SD}" stroke-width=".9" stroke-linecap="round"/><path d="M18 58h28l1.500 6h-31z" fill="${sh}" stroke="${shE}" stroke-width=".9"/>${belt}<path d="M28.300 33h7.400v12q-3.700 2.600-7.400 0z" fill="${SK}"/><path d="M28.300 37.500q3.700 2.400 7.400 0" fill="none" stroke="${SD}" stroke-width=".9"/><circle cx="22.600" cy="26.500" r="2" fill="${SK}"/><circle cx="41.400" cy="26.500" r="2" fill="${SK}"/><ellipse cx="32" cy="25.500" rx="9.300" ry="10.300" fill="${SK}"/><path d="M22.500 23.500c0-8 4.500-12 9.500-12s9.500 4 9.500 12c-2.300-3.600-5.300-5.300-9.500-5.300s-7.200 1.700-9.500 5.300z" fill="${HR}"/>${band}${eyes}<path d="M31.300 27.500l-.9 2.200h1.800" fill="none" stroke="${SD}" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"/>${mouth}${crown}${glove(17,1)}${glove(47,-1)}${gem}${spk}</svg>`;
 // 頭像框：銅→銀→金；Lv20 起改成漸層框（紫金→金紫→聚光→銀白→極光）
 const fr=has(L,"gold")?"#f5b301":has(L,"silver")?"#b8c0cc":has(L,"bronze")?"#c47b3a":"var(--ln)";
 const gb=g=>`border-color:transparent;background:linear-gradient(var(--cd,#fff),var(--cd,#fff)) padding-box,${g} border-box;`;
 const fs=Lh("eternal")?gb("conic-gradient(#5ef0d0,#7c9cff,#e66bff,#ff9ad5,#ffd36b,#5ef0d0)")+`box-shadow:0 0 ${Math.round(sz/4)}px #7fe3ffaa,0 0 ${Math.round(sz/8)}px #ff9ad5aa;`:Lh("platinum")?gb("conic-gradient(#fff,#b8c8e8,#fff,#9fb4dc,#fff)")+`box-shadow:0 0 ${Math.round(sz/5)}px #b8cfffcc;`:Lh("spot")?gb("conic-gradient(#f5b301,#7c3fd1,#fff1b0,#f5b301,#7c3fd1,#f5b301)")+`box-shadow:0 0 ${Math.round(sz/5)}px #f5b301bb;`:Lh("legend")?gb("conic-gradient(#f5b301,#7c3fd1,#fff1b0,#f5b301,#7c3fd1,#f5b301)")+"box-shadow:0 0 0 2px #f5b30166;":Lh("goldglove")?gb("linear-gradient(135deg,#7c3fd1,#f5b301 50%,#7c3fd1)"):`border-color:${fr};`;
 return `<span class="rp-av" style="width:${sz+10}px;height:${sz+10}px;${fs}">${svg}</span>`}
const css=document.createElement("style");css.textContent=`
.rp-av{display:inline-flex;align-items:center;justify-content:center;border:4px solid;border-radius:50%;background:var(--cd,#fff);flex:0 0 auto}
.rp-bar{height:10px;border-radius:99px;background:var(--ln);overflow:hidden}.rp-bar i{display:block;height:100%;background:linear-gradient(90deg,#d7263d,#f5b301);border-radius:99px;transition:width .6s}
.rp-mini{position:fixed;right:12px;top:12px;z-index:96;background:var(--cd,#fff);border:1px solid var(--ln);border-radius:16px;padding:6px;display:flex;align-items:center;gap:6px;box-shadow:0 4px 14px #0003;color:var(--fg);width:176px}body:has(.rp-mini) .wk-top{padding-right:188px;min-height:58px;align-items:center}body:has(.rp-mini) .wk h1{white-space:normal;flex-wrap:wrap}
.rp-go{display:flex;align-items:center;gap:6px;flex:1 1 auto;min-width:0;color:inherit;text-decoration:none}
.rp-mini .rp-av{border-width:3px}.rp-mini b{font-size:13px}.rp-mini .rp-bar{height:7px;margin-top:3px}
.rp-xp{position:fixed;right:40px;top:64px;z-index:97;font-weight:900;font-size:20px;color:#d7263d;pointer-events:none;animation:rpx 1.3s ease forwards;text-shadow:0 1px 0 #fff}
@keyframes rpx{0%{opacity:0;transform:translateY(-8px) scale(.7)}20%{opacity:1;transform:translateY(0) scale(1.15)}100%{opacity:0;transform:translateY(40px)}}
.rp-up{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;background:#0008;animation:rpf 3.2s ease forwards}
.rp-up>div{background:var(--cd,#fff);color:var(--fg);border-radius:22px;padding:22px 26px;text-align:center;border:3px solid #d7263d;max-width:86vw;animation:rpz .5s cubic-bezier(.2,1.6,.4,1)}
.rp-up h2{margin:6px 0;font-size:30px;background:linear-gradient(90deg,#d7263d,#f5b301);-webkit-background-clip:text;color:transparent}
@keyframes rpz{from{transform:scale(.2) rotate(-8deg)}to{transform:scale(1)}}@keyframes rpf{0%,85%{opacity:1}100%{opacity:0;visibility:hidden}}
.rp-card{background:var(--cd);border:1px solid var(--ln);border-radius:18px;padding:16px;margin-bottom:16px}
.rp-row{display:flex;gap:12px;align-items:center}.rp-at{display:grid;grid-template-columns:44px 1fr 64px;gap:6px 8px;align-items:center;font-size:14px;margin-top:12px}
.rp-ab{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.rp-ab span{font-size:12px;padding:4px 8px;border-radius:99px;border:1px solid var(--ln)}.rp-ab .on{background:#d7263d;color:#fff;border-color:#d7263d}.rp-ab .off{color:var(--mu);opacity:.75}
.rp-hint{margin:4px auto 0;padding:6px 12px;border-radius:99px;border:1px dashed #d7263d;background:transparent;color:#d7263d;font-weight:700;font-size:14px}
.rp-as-h{display:flex;justify-content:space-between;align-items:baseline;gap:8px}.rp-as-h b{font-size:18px}.rp-as-h span{font-size:13px;color:var(--mu);white-space:nowrap}
.rp-as-v{font-size:22px;font-weight:900;line-height:1.3;min-width:0;overflow-wrap:anywhere;background:linear-gradient(90deg,#d7263d,#f5b301);-webkit-background-clip:text;background-clip:text;color:transparent}
.rp-as-v small{font-size:13px;font-weight:700;color:var(--mu);margin-right:6px}
.rp-as-n{font-size:13px;color:var(--mu);margin-top:6px;overflow-wrap:anywhere}.rp-as-q{font-size:13px;margin-top:8px;padding:8px 10px;border-radius:12px;border:1px dashed var(--ln);color:var(--fg)}
.rp-card.rp-as{padding:0;overflow:hidden}
#rpg #assets{margin-top:12px;padding-top:10px;border-top:1px solid var(--ln)}
#rpg #assets .rp-as-t{padding:6px 2px;min-height:40px;border-radius:10px}
#rpg #assets .rp-as-h b{font-size:15px}
#rpg #assets .rp-as-v{font-size:20px}
#rpg #assets .rp-as-p{padding:0 0 4px}

.rp-as-t{display:flex;align-items:center;gap:10px;width:100%;min-height:44px;margin:0;padding:12px 16px;border:0;border-radius:17px;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.rp-as-t:active{background:#d7263d1f}.rp-as-t:focus{outline:none}.rp-as-t:focus-visible{outline:3px solid #d7263d;outline-offset:-3px}
@media(hover:hover){.rp-as-t:hover{background:#d7263d12}}
.rp-as-x{display:block;flex:1 1 auto;min-width:0}.rp-as-h{flex-wrap:wrap}.rp-as-h b{overflow-wrap:anywhere}
.rp-as-l{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0 10px;margin-top:2px}
.rp-as-s{font-size:12px;color:var(--mu);overflow-wrap:anywhere}.rp-as.open .rp-as-s{display:none}
.rp-as-c{flex:0 0 auto;width:32px;height:32px;border-radius:50%;border:1px solid var(--ln);display:flex;align-items:center;justify-content:center;font-style:normal;font-size:16px;line-height:1;color:#d7263d}
.rp-as-c::before{content:"▸"}.rp-as.open .rp-as-c::before{content:"▾"}
.rp-as-b{display:grid;grid-template-rows:0fr;opacity:0;visibility:hidden;transition:grid-template-rows .25s ease,opacity .25s ease,visibility 0s .25s}
.rp-as.open .rp-as-b{grid-template-rows:1fr;opacity:1;visibility:visible;transition:grid-template-rows .25s ease,opacity .25s ease,visibility 0s}
.rp-as-bi{min-height:0;min-width:0;overflow:hidden}.rp-as-p{padding:0 16px 16px}
@media(prefers-reduced-motion:reduce){.rp-as-b,.rp-as.open .rp-as-b{transition:none}}
.rp-tabs{display:flex;gap:6px;overflow-x:auto;margin:12px -4px 10px;padding:0 4px 4px;-webkit-overflow-scrolling:touch;scrollbar-width:thin}
.rp-tabs button{flex:0 0 auto;min-height:44px;min-width:44px;padding:0 12px;border-radius:99px;border:1px solid var(--ln);background:var(--cd);color:var(--fg);font:inherit;font-size:13px;font-weight:700;white-space:nowrap;cursor:pointer}
.rp-tabs button i{font-style:normal;font-weight:400;color:var(--mu);margin-left:4px;font-size:12px}.rp-tabs button.on{background:#d7263d;border-color:#d7263d;color:#fff}.rp-tabs button.on i{color:#fffc}
.rp-tg{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px}
.rp-ti{border:1px solid var(--ln);border-radius:14px;padding:10px 6px 8px;text-align:center;min-width:0;position:relative}
.rp-ti .e{font-size:30px;line-height:1.2}.rp-ti .n{font-size:12px;font-weight:700;line-height:1.35;margin-top:4px;overflow-wrap:anywhere}.rp-ti .v{font-size:12px;color:#b07d00;font-weight:800;margin-top:3px}
.rp-ti .c{font-size:11px;color:var(--mu);margin-top:2px}.rp-ti .g{font-size:11px;color:#1a9a5a;font-weight:700}
.rp-ti.on{border-color:#f5b30188;background:linear-gradient(180deg,#f5b30114,transparent)}
.rp-ti.off{border-style:dashed}.rp-ti.off .e{filter:grayscale(1) contrast(0);opacity:.45}.rp-ti.off .n,.rp-ti.off .v{color:var(--mu);font-weight:600}
.rp-ti.nx{border-color:#d7263d;border-style:solid}.rp-ti.nx .v{color:#d7263d;font-weight:800}
@media(prefers-color-scheme:dark){.rp-ti .v{color:#f5c542}}
.rp-box{position:fixed;inset:0;z-index:102;display:flex;align-items:center;justify-content:center;background:#0009;padding:16px;animation:rpbf .25s ease}
.rp-box>div{background:var(--cd,#fff);color:var(--fg);border-radius:22px;padding:20px 22px 16px;text-align:center;border:3px solid #f5b301;box-shadow:0 0 0 4px #d7263d55,0 12px 40px #0006;width:min(340px,100%);max-height:90vh;overflow:auto;animation:rpz .5s cubic-bezier(.2,1.6,.4,1)}
.rp-box .k{font-weight:900;font-size:22px;background:linear-gradient(90deg,#d7263d,#f5b301);-webkit-background-clip:text;background-clip:text;color:transparent}
.rp-box .e{font-size:64px;line-height:1.2;margin:6px 0 2px}.rp-box .es{font-size:34px;line-height:1.3;margin:8px 0 4px;letter-spacing:2px}
.rp-box .n{font-size:19px;font-weight:900;line-height:1.35}.rp-box .c{font-size:13px;color:var(--mu);margin-top:4px}.rp-box .v{font-size:17px;font-weight:800;color:#b07d00;margin-top:6px}
.rp-box .l{font-size:13px;line-height:1.6;margin-top:6px;text-align:left}
.rp-box .bt{display:flex;gap:8px;justify-content:center;margin-top:14px}.rp-box button{min-height:44px;padding:0 18px;border-radius:99px;border:1px solid var(--ln);background:transparent;color:var(--fg);font:inherit;font-size:15px;font-weight:700;cursor:pointer}
.rp-box button.go{background:#d7263d;border-color:#d7263d;color:#fff}
@media(prefers-color-scheme:dark){.rp-box .v{color:#f5c542}}
@keyframes rpbf{from{opacity:0}to{opacity:1}}
.rp-toast{position:fixed;right:12px;top:78px;z-index:101;display:flex;align-items:center;gap:8px;min-height:48px;max-width:min(300px,calc(100vw - 24px));padding:7px 14px 7px 10px;border-radius:16px;background:var(--cd,#fff);color:var(--fg);border:2px solid #f5b301;box-shadow:0 4px 16px #0004;cursor:pointer;animation:rptn .35s cubic-bezier(.2,1.5,.4,1)}
.rp-toast .e{font-size:28px;line-height:1;flex:0 0 auto}.rp-toast .x{min-width:0}.rp-toast small{display:block;font-size:11px;font-weight:800;color:#d7263d}.rp-toast b{display:block;font-size:14px;line-height:1.3}.rp-toast em{display:block;font-style:normal;font-size:11px;color:var(--mu)}
.rp-toast.out{opacity:0;transform:translateY(8px);transition:opacity .3s,transform .3s}
@keyframes rptn{from{opacity:0;transform:translateY(14px) scale(.8)}to{opacity:1;transform:none}}`;
document.head.appendChild(css);
function beep(){try{const A=window.AudioContext||window.webkitAudioContext;const c=new A();[523,659,784,1047].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.type="triangle";o.frequency.value=f;g.gain.setValueAtTime(.0001,c.currentTime+i*.12);g.gain.exponentialRampToValueAtTime(.18,c.currentTime+i*.12+.02);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+i*.12+.3);o.connect(g).connect(c.destination);o.start(c.currentTime+i*.12);o.stop(c.currentTime+i*.12+.32)});setTimeout(()=>c.close(),1500)}catch(e){}}
function levelUp(L){const t=title(L),nw=ABIL.filter(a=>a.lv===L);const d=document.createElement("div");d.className="rp-up";
 d.innerHTML=`<div>${avatar(L,L>12?96:80)}<div style="font-weight:800;color:#d7263d;margin-top:6px">晉級！</div><h2>Lv ${L}</h2><div style="font-size:20px;font-weight:800">${t[0]}｜${t[1]}</div>${nw.length?'<div style="margin-top:8px">解鎖：'+nw.map(a=>"<b>"+a.name+"</b>").join("、")+"</div>":""}</div>`;
 d.onclick=()=>d.remove();document.body.appendChild(d);setTimeout(()=>d.remove(),3300);beep();
 for(let k=0;k<20;k++){const c=document.createElement("span");c.className="rw-cf";c.textContent=["⭐","✨","🥊","🏆"][k%4];c.style.left=Math.random()*100+"vw";c.style.animationDelay=Math.random()*.5+"s";document.body.appendChild(c);setTimeout(()=>c.remove(),2600)}}
function pop(txt){const e=document.createElement("div");e.className="rp-xp";e.textContent=txt;document.body.appendChild(e);setTimeout(()=>e.remove(),1300)}
let homeEl=null;                                           // 首頁才有；單元頁用 mini
function confetti(n,z){for(let k=0;k<n;k++){const c=document.createElement("span");c.className="rw-cf";c.textContent=["🥊","✨","🏆","🥇","🎁"][k%5];c.style.left=Math.random()*100+"vw";c.style.animationDelay=Math.random()*.5+"s";if(z)c.style.zIndex=z;document.body.appendChild(c);setTimeout(()=>c.remove(),3000)}}
function seeAll(){asSet(true);if(homeEl){const a=document.getElementById("assets");asApply(a,true);if(a&&a.scrollIntoView)a.scrollIntoView({behavior:"smooth",block:"start"})}else location.href="index.html#assets"}
// 開箱視窗（首頁、補開摘要）：點任何地方或「關閉」都會關，時間到自動關；一定移除節點，不鎖捲動、不碰音訊
function openBox(items,sum){document.querySelectorAll(".rp-box").forEach(x=>x.remove());if(!items.length)return;const xp=st().xp,d=document.createElement("div");d.className="rp-box";d.setAttribute("role","dialog");let h;
 if(items.length===1&&!sum){const t=items[0];h=`<div class="k">🎁 開箱！</div><div class="e">${t.ico}</div><div class="n">${t.name}</div><div class="c">${catName(t.cat)}${t.grow?"・會隨 XP 增值":""}</div><div class="v">身價 ${money(trValue(t,xp))}</div><div class="bt"><button type="button">關閉</button></div>`}
 else{const top=items.slice(-6),tot=items.reduce((a,t)=>a+trValue(t,xp),0);
  h=`<div class="k">🎁 開箱！</div><div class="n" style="margin-top:6px">${sum?"一次補開 "+items.length+" 件拳王藏品":"一次開出 "+items.length+" 件藏品"}</div><div class="es">${top.map(t=>t.ico).join("")}${items.length>top.length?"…":""}</div>${items.length<=4?'<div class="l">'+items.map(t=>t.ico+" "+t.name+"（"+money(trValue(t,xp))+"）").join("<br>")+"</div>":sum?'<div class="c">之前累積的 XP 已自動換成藏品，經驗值不會被花掉</div>':""}<div class="v">合計身價 ${money(tot)}</div><div class="bt"><button type="button" class="go">查看全部</button><button type="button">關閉</button></div>`}
 d.innerHTML="<div>"+h+"</div>";let tm=0;const close=()=>{clearTimeout(tm);d.remove()};d.onclick=close;
 const go=d.querySelector("button.go");if(go)go.onclick=e=>{e.stopPropagation();close();seeAll()};
 document.body.appendChild(d);tm=setTimeout(close,sum?(homeEl?6000:4000):3800);confetti(sum||items.length>1?18:14,103)}
// 單元頁：mini-HUD 下方的小吐司（視窗在右上角），不擋回音法按鈕，約 2.5 秒自動消失
function toast(items){document.querySelectorAll(".rp-toast").forEach(x=>x.remove());if(!items.length)return;const xp=st().xp,t=items[items.length-1],n=items.length,d=document.createElement("div");d.className="rp-toast";d.setAttribute("role","status");
 d.innerHTML=`<span class="e">${t.ico}</span><span class="x"><small>🎁 開箱！${n>1?"一次 "+n+" 件":catName(t.cat)}</small><b>${n>1?t.name+" 等 "+n+" 件":t.name}</b><em>身價 ${money(n>1?items.reduce((a,i)=>a+trValue(i,xp),0):trValue(t,xp))}</em></span>`;
 d.onclick=()=>d.remove();document.body.appendChild(d);setTimeout(()=>d.classList.add("out"),2300);setTimeout(()=>d.remove(),2600);confetti(6)}
// 檢查新開箱：第一次執行（既有使用者）把已達標的全部記為看過，只跳一次摘要；之後只對真正新的 id 動畫
function trCheck(delay){const s=st(),got=owned(s.xp);
 if(!s.trInit){s.trInit=1;s.trSeen=got.map(t=>t.id);sv(s);if(got.length)openBox(got,true);return got}
 const seen=Array.isArray(s.trSeen)?s.trSeen:[],nw=got.filter(t=>seen.indexOf(t.id)<0);if(!nw.length)return nw;
 s.trSeen=seen.concat(nw.map(t=>t.id));sv(s);const show=()=>mini?toast(nw):openBox(nw,false);if(delay)setTimeout(show,delay);else show();return nw}
function gain(o){const s=st();const L0=lvOf(s.xp).L;let b,lab=[];
 if(o.t==="quiz")b=o.ok?BASE.quizOk:BASE.quizBad;else b=BASE[o.t];if(!b)return;let x=o.isNew===false?b[1]:b[0];
 if(o.t==="quiz"){if(o.ok){s.combo++;s.best=Math.max(s.best,s.combo);const m=has(L0,"combo3")&&s.combo>=10?2:has(L0,"combo2")&&s.combo>=5?1.5:has(L0,"combo1")&&s.combo>=3?1.2:1;if(m>1){x*=m;lab.push("組合拳 "+s.combo+" ×"+m)}}else s.combo=0}
 const a=attrOf(o.t,o.uid);if(a){const ab=attrBonus(s.at[a]);if(ab)x*=1+ab/100}
 const xb=has(L0,"xp20")?20:has(L0,"xp10")?10:0;if(xb)x*=1+xb/100;
 if(has(L0,"daily")&&s.day.n<10&&o.t!=="crown"&&o.t!=="king"){x*=2;lab.push("早訓×2")}if(o.t!=="crown"&&o.t!=="king")s.day.n++;
 x=Math.max(1,Math.round(x));s.xp+=x;if(a)s.at[a]=(s.at[a]||0)+x;sv(s);
 pop("+"+x+" XP"+(lab.length?" "+lab.join(" "):""));const L1=lvOf(s.xp).L;if(L1>L0)setTimeout(()=>levelUp(L1),400);trCheck(L1>L0&&!mini?3600:0);drawMini();if(RPG.onChange)RPG.onChange()}
let mini=null;function drawMini(){if(!mini)return;const s=st(),v=lvOf(s.xp),t=title(v.L);mini.innerHTML=`<a class="rp-go" href="index.html#rpg">${avatar(v.L,30)}<div style="flex:1;min-width:0"><b>Lv ${v.L}</b> <span style="font-size:11px;color:var(--mu)">${t[1]}</span><div class="rp-bar"><i style="width:${Math.round(v.cur/v.nx*100)}%"></i></div></div></a>`}
function hints(){const s=st(),L=lvOf(s.xp).L;const max=has(L,"hint3")?3:has(L,"hint2")?2:has(L,"hint1")?1:0;return[max,Math.max(0,max-(s.day.h||0))]}
function hintUI(){const cfg=RW.cfg;if(!cfg||!cfg.qans)return;const qo=document.getElementById("qo");if(!qo)return;let b=document.getElementById("rphint");
 if(!b){b=document.createElement("button");b.id="rphint";b.className="rp-hint";qo.after(b);b.onclick=()=>{const[mx,left]=hints();if(!left)return;const s=st();const ans=cfg.qans();const bs=[...qo.querySelectorAll("button")].filter(x=>!x.disabled&&x.textContent!==ans);if(bs.length<2)return;const x=bs[Math.floor(Math.random()*bs.length)];x.disabled=true;x.style.opacity=.25;x.style.textDecoration="line-through";s.day.h++;sv(s);hintUI()}}
 const[mx,left]=hints();let answered=false;try{answered=!!eval("typeof pk!==\"undefined\"&&pk")}catch(e){}
 b.style.display=mx&&!answered?"":"none";b.disabled=!left;b.textContent="💡 提示（今天剩 "+left+"/"+mx+"）"}
function page(){migrate();mini=document.createElement("div");mini.className="rp-mini";document.body.appendChild(mini);drawMini();trCheck();
 window.addEventListener("rwx",e=>gain(e.detail));
 if(window.quiz){const q=window.quiz;window.quiz=function(){q.apply(this,arguments);hintUI()};hintUI()}}
let trTab="all";
const AK="esBoxerAssetsOpen";let asMem=false;              // 資產卡展開狀態：獨立的 key，不放進 esBoxerRPG1；沒有 key ＝ 收合
function asOpen(){try{const v=localStorage.getItem(AK);if(v!==null)return v==="1"}catch(e){}return asMem}
function asSet(o){asMem=!!o;try{localStorage.setItem(AK,o?"1":"0")}catch(e){}}
function asApply(a,o){if(!a)return;a.classList.toggle("open",!!o);const t=a.querySelector(".rp-as-t");if(t)t.setAttribute("aria-expanded",o?"true":"false")}
function assetsHTML(s,op){const xp=s.xp,got=owned(xp),nx=TREASURES.find(t=>xp<t.xp),list=trTab==="all"?TREASURES:TREASURES.filter(t=>t.cat===trTab);
 const tabs=[["all","全部"]].concat(CATS).map(c=>{const a=c[0]==="all"?TREASURES:TREASURES.filter(t=>t.cat===c[0]);return `<button type="button" data-c="${c[0]}" class="${trTab===c[0]?"on":""}" aria-pressed="${trTab===c[0]}">${c[2]?c[2]+" ":""}${c[1]}<i>${a.filter(t=>xp>=t.xp).length}/${a.length}</i></button>`}).join("");
 const tiles=list.map(t=>xp>=t.xp?`<div class="rp-ti on"><div class="e">${t.ico}</div><div class="n">${t.name}</div><div class="v">${money(trValue(t,xp))}</div>${t.grow&&growPct(xp)?'<div class="g">📈 增值 +'+growPct(xp)+"%</div>":""}</div>`
  :`<div class="rp-ti off${t===nx?" nx":""}"><div class="e">${t.ico}</div><div class="n">？？？</div><div class="v">${t===nx?"還差 "+num(t.xp-xp)+" XP":"需 "+num(t.xp)+" XP"}</div><div class="c">${catName(t.cat)}</div></div>`).join("");
 return `<button type="button" class="rp-as-t" aria-expanded="${op?"true":"false"}" aria-controls="rp-as-b"><span class="rp-as-x"><span class="rp-as-h"><b>🏆 我的拳王藏品</b><span>已收藏 ${got.length}/${TREASURES.length}</span></span>
 <span class="rp-as-l"><span class="rp-as-v"><small>總身價</small>${got.length?money(worth(xp)):"0 元"}</span><span class="rp-as-s">${nx?"下一件還差 "+num(nx.xp-xp)+" XP":"全部收藏齊了 🎉"}</span></span></span><i class="rp-as-c" aria-hidden="true"></i></button>
 <div class="rp-as-b" id="rp-as-b"><div class="rp-as-bi"><div class="rp-as-p"><div class="rp-bar"><i style="width:${Math.round(got.length/TREASURES.length*100)}%;background:linear-gradient(90deg,#d7263d,#f5b301)"></i></div>
 <div class="rp-as-n">${nx?"下一件藏品："+catName(nx.cat)+"・還差 "+num(nx.xp-xp)+" XP 自動開箱":"全部藏品都收藏齊了，永恆拳王就是你！"}</div>
 <div class="rp-as-q">💬 今日拳王小語：${saying()}</div>
 <div class="rp-tabs" role="group" aria-label="藏品分類">${tabs}</div><div class="rp-tg">${tiles}</div></div></div></div>`}
function drawAssets(){const a=document.getElementById("assets");if(!a)return;const o=a.querySelector(".rp-tabs"),sl=o?o.scrollLeft:0;const op=asOpen();a.classList.add("rp-as");a.classList.toggle("open",op);a.innerHTML=assetsHTML(st(),op);
 const n=a.querySelector(".rp-tabs");if(n){n.scrollLeft=sl;n.onclick=e=>{const b=e.target.closest?e.target.closest("button[data-c]"):null;if(!b)return;trTab=b.getAttribute("data-c");drawAssets()}}
 const t=a.querySelector(".rp-as-t");if(t)t.onclick=()=>{const o=!asOpen();asSet(o);asApply(a,o)}}
function home(el){migrate();homeEl=el;const draw=()=>{const s=st(),v=lvOf(s.xp),t=title(v.L);const[mx,left]=hints();const mxA=Math.max(1,...Object.keys(ATTR).map(a=>s.at[a]||0));
 el.innerHTML=`<div class="rp-card" id="rpg"><div class="rp-row">${avatar(v.L,64)}<div style="flex:1"><div style="font-size:13px;color:var(--mu)">🥊 拳王系統</div><div style="font-size:22px;font-weight:900">Lv ${v.L}　${t[0]}</div><div style="font-weight:700">${t[1]}</div></div></div>
 <div id="assets"></div>
 <div style="display:flex;justify-content:space-between;font-size:13px;margin-top:10px;color:var(--mu)"><span>${v.max?"經驗值 🏆 滿級 Lv "+MAXLV:"經驗值 "+v.cur+" / "+v.nx}</span><span>總 XP ${s.xp}</span></div><div class="rp-bar"><i style="width:${Math.round(v.cur/v.nx*100)}%"></i></div>
 <div class="rp-at">${Object.entries(ATTR).map(([a,n])=>`<span>${n}</span><div class="rp-bar"><i style="width:${Math.round((s.at[a]||0)/mxA*100)}%;background:linear-gradient(90deg,#1a9a5a,#7ad38f)"></i></div><span style="font-size:12px">Lv${attrLv(s.at[a])} +${attrBonus(s.at[a])}%</span>`).join("")}</div>
 <div style="font-size:13px;margin-top:10px">今日：練習 ${s.day.n} 次${has(v.L,"daily")?"（早訓加倍剩 "+Math.max(0,10-s.day.n)+" 次）":""}・提示 ${left}/${mx}・目前連續答對 ${s.combo}（最佳 ${s.best}）</div>
 <details class="rwr" style="margin-top:8px"><summary>升級規則</summary>
 XP：聽新卡 10（重聽 3）・答對 15（同題再答 8）・答錯 3・口說 12（重複 5）・課文新句 8（重聽 3）・題型全部完成 +50・單元全部完成 +150。<br>
 屬性：課文跟讀→聽力、口說→口說、單字卡和測驗→詞彙（念例句也算單字練習 XP）。屬性每升 1 級，該類 XP +2%（上限 30%）。<br>
 能力：${ABIL.map(a=>"Lv"+a.lv+" "+a.name+"："+a.desc).join("；")}。<br>${s.migXP?"已把之前的💵和練習紀錄換算成 "+s.migXP+" XP。":""}<br>藏品會依累計 XP 自動開箱，經驗值不會被花掉。</details></div>`;drawAssets()};draw();RPG.onChange=draw;trCheck()}
window.RPG={page,home,st,lvOf,need,gain,hints,avatar,TITLES,ABIL,TREASURES,CATS,trValue,money,worth};
})();
