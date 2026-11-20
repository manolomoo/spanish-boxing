/* 單元 6｜指示詞 Demostrativos（內容來自課堂講義 Demostrativos；音檔由 tools/gen_week06_audio.js 用 edge-tts 產生）
   卡片欄位：w 顯示的字、say 這張卡的音檔 key（預設同 w；也是練習紀錄的 key）、lang "en"＝英文卡（Jenny），其餘西文（Elvira）、
   zh 中文、pos 標籤、tg 小卡標籤（預設同 pos）、parts 回音法要分開各走一輪的每一段（預設只有 say）、exs 顯示用的例字、
   alt「只念名詞」等第二顆按鈕念的字（不進回音週期）、ex 例句、exen 例句英文翻譯、en 這張卡本身的英文翻譯（英文翻譯只顯示＋單次念，不進回音週期）
   quiz＝新講義 Ejercicio 16 題（由 lab.ej 產生，和課文遊戲同一份）；autoQuiz＝另外自動出「西文↔中文」題。decks 口說練習；texts 課文分頁的跟讀（paras＝可跟讀的句子，[[…]]＝只顯示不念）；lab 課文分頁的解說／表格／遊戲（week06-extra.js）。
   v5 起單字卡、小測驗、口說、課文全部依新講義（Demostrativos 新版）。 */
window.WEEK=(function(){
const LAB=(function(){
 const forms={c:{m:["Este","Estos"],f:["Esta","Estas"],neu:"Esto"},m:{m:["Ese","Esos"],f:["Esa","Esas"],neu:"Eso"}};
 const nouns=[["perro","perros","m","狗","1f415"],["niño","niños","m","男孩","1f466"],["teléfono","teléfonos","m","電話","1f4f1"],["profesor","profesores","m","男老師","1f468-200d-1f3eb"],
  ["fruta","frutas","f","水果","1f34e"],["niña","niñas","f","女孩","1f467"],["verdura","verduras","f","蔬菜","1f966"],["profesora","profesoras","f","女老師","1f469-200d-1f3eb"]];
 /* qSay＝題目句去掉 (Cerca) 等提示和空格（不含答案），遊戲 3 題目旁 🔊 念這句，例如 "(Cerca) ______ niño es mi amigo." → "niño es mi amigo." */
 const qs=q=>q.replace(/^\([^)]*\)\s*/,"").replace(/_{2,}/g,"").replace(/\s+([?.!,])/g,"$1").replace(/\s+/g," ").trim();
 const E=(q,a,o,say,zh,d,g,n,noun,art)=>({q,a,o,say,zh,d,g,n,noun,art,qSay:qs(q)});
 const ej=[
  E("(Cerca) ______ niño es mi amigo.","Este",["Este","Esto","Esta","Estos"],"Este niño es mi amigo.","這個男孩是我的朋友。","c","m","s","niño","el"),
  E("(Media distancia) ______ perros están allí.","Esos",["Esos","Esas","Ese","Estos"],"Esos perros están allí.","那些狗在那裡。","m","m","p","perros","los"),
  E("(Cerca) ______ fruta es roja.","Esta",["Esta","Este","Estas","Esa"],"Esta fruta es roja.","這個水果是紅色的。","c","f","s","fruta","la"),
  E("(Media distancia) ______ profesores son buenos.","Esos",["Esos","Esas","Estos","Ese"],"Esos profesores son buenos.","那些老師很好。","m","m","p","profesores","los"),
  E("(Cerca) ______ teléfonos son pequeños.","Estos",["Estos","Estas","Esos","Este"],"Estos teléfonos son pequeños.","這些電話很小。","c","m","p","teléfonos","los"),
  E("(Media distancia) ______ nieve es blanca.","Esa",["Esa","Ese","Esas","Esto"],"Esa nieve es blanca.","那片雪是白色的。","m","f","s","nieve","la"),
  E("(Desconocido / Unknown) ¿Qué es ______?","esto",["esto","este","esta","estos"],"¿Qué es esto?","這是什麼？","c","n","unk","",""),
  E("(Idea / Situation) ______ es fácil.","Eso",["Eso","Ese","Esa","Esos"],"Eso es fácil.","那（件事）很簡單。","m","n","idea","",""),
  E("(Cerca) ______ verduras son grandes.","Estas",["Estas","Estos","Estes","Esas"],"Estas verduras son grandes.","這些蔬菜很大。","c","f","p","verduras","las"),
  E("(Media distancia) ______ teléfono es pequeño.","Ese",["Ese","Eso","Esa","Este"],"Ese teléfono es pequeño.","那支電話很小。","m","m","s","teléfono","el"),
  E("(Cerca) ______ amigos están aquí.","Estos",["Estos","Estas","Esos","Esto"],"Estos amigos están aquí.","這些朋友在這裡。","c","m","p","amigos","los"),
  E("(Media distancia) ______ familia es buena.","Esa",["Esa","Ese","Esas","Esta"],"Esa familia es buena.","那個家庭很好。","m","f","s","familia","la"),
  E("(Desconocido / Unknown) ¿Qué es ______?","eso",["eso","ese","esa","esos"],"¿Qué es eso?","那是什麼？","m","n","unk","",""),
  E("(Idea / Situation) ______ es difícil.","Esto",["Esto","Este","Esta","Estos"],"Esto es difícil.","這（件事）很難。","c","n","idea","",""),
  E("(Cerca) ______ niña es mi amiga.","Esta",["Esta","Este","Esa","Estas"],"Esta niña es mi amiga.","這個女孩是我的朋友。","c","f","s","niña","la"),
  E("(Media distancia) ______ ríos son grandes.","Esos",["Esos","Esas","Estos","Ese"],"Esos ríos son grandes.","那些河很大。","m","m","p","ríos","los")];
 /* 表格每格：點了先念單字、再念片語 */
 const table={nm:"perro",npl:"perros",fm:"mesa",fpl:"mesas",neu:{Esto:"¿Qué es esto?",Eso:"Eso es fácil."}};
 /* 解說區可點播的句子／片語 */
 const ex=["Este perro es pequeño.","Ese teléfono está allí.","Esta fruta","Estos niños","Estas verduras","Esa nieve","Ese río","Esos ríos",
  "¿Qué es esto?","¿Qué es eso?","Esto es difícil.","Eso es fácil.","Este teléfono es pequeño.","Estas mesas","Este perro","Esa familia"];
 const say=[];const put=s=>{if(s&&!say.includes(s))say.push(s)};
 ["c","m"].forEach(d=>["m","f"].forEach(g=>forms[d][g].forEach(w=>put(w))));put("Esto");put("Eso");
 ["c","m"].forEach(d=>{put(forms[d].m[0]+" "+table.nm);put(forms[d].m[1]+" "+table.npl);put(forms[d].f[0]+" "+table.fm);put(forms[d].f[1]+" "+table.fpl)});
 Object.values(table.neu).forEach(put);
 nouns.forEach(N=>["c","m"].forEach(d=>{put(forms[d][N[2]][0]+" "+N[0]);put(forms[d][N[2]][1]+" "+N[1])}));
 ej.forEach(q=>put(q.say));ex.forEach(put);
 nouns.forEach(N=>{put(N[0]);put(N[1])});ej.forEach(q=>put(q.qSay));   // v6：遊戲 1 題目念名詞、遊戲 3 題目念不含答案的題幹
 return {forms,nouns,ej,table,ex,say};
})();
/* 單字卡（v5 起全部依新講義）。名詞片語：表格的 perro／mesa 8 張＋新講義的名詞（fruta、niño、niña、teléfono、verdura、amigo、profesor(a)、río、familia、nieve）。 */
const N=(w,zh,en,pos,ex,exen)=>Object.assign({w,zh,en,pos},ex?{ex,exen}:{});
const C=[
 /* A. 近處 0–4 */
 N("Este","這個（陽性單數・近）","This","指示詞・陽性・單數・近","Este perro es pequeño.","This dog is small."),
 N("Esta","這個（陰性單數・近）","This","指示詞・陰性・單數・近","Esta fruta es buena.","This fruit is good."),
 N("Estos","這些（陽性複數・近）","These","指示詞・陽性・複數・近","Estos niños están aquí.","These children are here."),
 N("Estas","這些（陰性複數・近）","These","指示詞・陰性・複數・近","Estas verduras son grandes.","These vegetables are big."),
 /* B. 中距離 4–8 */
 N("Ese","那個（陽性單數・中距離）","That","指示詞・陽性・單數・中距離","Ese teléfono está allí.","That phone is over there."),
 N("Esa","那個（陰性單數・中距離）","That","指示詞・陰性・單數・中距離","Esa profesora es buena.","That teacher is good."),
 N("Esos","那些（陽性複數・中距離）","Those","指示詞・陽性・複數・中距離","Esos ríos son grandes.","Those rivers are big."),
 N("Esas","那些（陰性複數・中距離）","Those","指示詞・陰性・複數・中距離","Esas familias están allí.","Those families are over there."),
 /* C. 中性 8–12：esto／eso＋兩種用法的句子 */
 N("Esto","這個（中性・近，不接名詞）","this","指示詞・中性・近","¿Qué es esto?","What is this?"),
 N("Eso","那個（中性・中距離，不接名詞）","that","指示詞・中性・中距離","Eso es fácil.","That is easy."),
 N("¿Qué es eso?","那是什麼？（不知道是什麼東西）","What is that?","句子・中性・中距離"),
 N("Esto es difícil.","這（件事）很難。（指一件事／想法）","This is difficult.","句子・中性・近"),
 /* D. 英文卡 12–18 */
 {"w":"This","lang":"en","zh":"這個（英文・近，對應 este / esta）","pos":"英文｜近"},
 {"w":"These","lang":"en","zh":"這些（英文・近，對應 estos / estas）","pos":"英文｜近"},
 {"w":"That","lang":"en","zh":"那個（英文・中距離，對應 ese / esa）","pos":"英文｜中距離"},
 {"w":"Those","lang":"en","zh":"那些（英文・中距離，對應 esos / esas）","pos":"英文｜中距離"},
 {"w":"this","lang":"en","zh":"這個（英文・中性，對應 esto）","pos":"英文｜中性"},
 {"w":"that","lang":"en","zh":"那個（英文・中性，對應 eso）","pos":"英文｜中性"},
 /* E1. 名詞片語・近 18–31 */
 N("Este perro","這隻狗（近）","This dog","名詞片語・陽性・單數・近","Este perro es pequeño.","This dog is small."),
 N("Estos perros","這些狗（近）","These dogs","名詞片語・陽性・複數・近"),
 N("Esta mesa","這張桌子（近）","This table","名詞片語・陰性・單數・近"),
 N("Estas mesas","這些桌子（近）","These tables","名詞片語・陰性・複數・近"),
 N("Este niño","這個男孩（近）","This boy","名詞片語・陽性・單數・近","Este niño es mi amigo.","This boy is my friend."),
 N("Esta niña","這個女孩（近）","This girl","名詞片語・陰性・單數・近","Esta niña es mi amiga.","This girl is my friend."),
 N("Estos niños","這些孩子（近）","These children","名詞片語・陽性・複數・近","Estos niños están aquí.","These children are here."),
 N("Este teléfono","這支電話（近）","This phone","名詞片語・陽性・單數・近","Este teléfono es pequeño.","This phone is small."),
 N("Estos teléfonos","這些電話（近）","These phones","名詞片語・陽性・複數・近","Estos teléfonos son pequeños.","These phones are small."),
 N("Esta fruta","這個水果（近）","This fruit","名詞片語・陰性・單數・近","Esta fruta es roja.","This fruit is red."),
 N("Estas frutas","這些水果（近）","These fruits","名詞片語・陰性・複數・近","Estas frutas son buenas.","These fruits are good."),
 N("Estas verduras","這些蔬菜（近）","These vegetables","名詞片語・陰性・複數・近","Estas verduras son grandes.","These vegetables are big."),
 N("Estos amigos","這些朋友（近）","These friends","名詞片語・陽性・複數・近","Estos amigos están aquí.","These friends are here."),
 /* E2. 名詞片語・中距離 31–43 */
 N("Ese perro","那隻狗（中距離）","That dog","名詞片語・陽性・單數・中距離","Ese perro es grande.","That dog is big."),
 N("Esos perros","那些狗（中距離）","Those dogs","名詞片語・陽性・複數・中距離","Esos perros están allí.","Those dogs are over there."),
 N("Esa mesa","那張桌子（中距離）","That table","名詞片語・陰性・單數・中距離"),
 N("Esas mesas","那些桌子（中距離）","Those tables","名詞片語・陰性・複數・中距離"),
 N("Ese teléfono","那支電話（中距離）","That phone","名詞片語・陽性・單數・中距離","Ese teléfono está allí.","That phone is over there."),
 N("Esa profesora","那位女老師（中距離）","That teacher","名詞片語・陰性・單數・中距離","Esa profesora es buena.","That teacher is good."),
 N("Esos profesores","那些老師（中距離）","Those teachers","名詞片語・陽性・複數・中距離","Esos profesores son buenos.","Those teachers are good."),
 N("Ese río","那條河（中距離）","That river","名詞片語・陽性・單數・中距離","Ese río es grande.","That river is big."),
 N("Esos ríos","那些河（中距離）","Those rivers","名詞片語・陽性・複數・中距離","Esos ríos son grandes.","Those rivers are big."),
 N("Esa familia","那個家庭（中距離）","That family","名詞片語・陰性・單數・中距離","Esa familia es buena.","That family is good."),
 N("Esas familias","那些家庭（中距離）","Those families","名詞片語・陰性・複數・中距離","Esas familias están allí.","Those families are over there."),
 N("Esa nieve","那片雪（中距離；nieve 是陰性）","That snow","名詞片語・陰性・單數・中距離","Esa nieve es blanca.","That snow is white.")];
/* 小測驗：直接由 LAB.ej（課文「Ejercicio 擂台」同一份）產生，題目／答案完全一致；選項順序固定但依題號輪轉，答案不會都在第一個 */
const ZL=q=>q.g==="n"?(q.n==="unk"?"不知道是什麼・中性":"指一件事／想法・中性"):(q.d==="c"?"近處":"中距離")+"・"+(q.g==="m"?"陽性":"陰性")+(q.n==="s"?"單數":"複數");
const QZ=LAB.ej.map((q,i)=>{const r=i%4;return {q:q.q,z:ZL(q)+"｜"+q.zh,o:q.o.slice(r).concat(q.o.slice(0,r)),a:q.a,say:q.say,show:q.say}});
/* 口說：講義例句 8 句＋Práctica rápida 5 句＋esto／eso 3 句 */
const D=(q,a,pic,tag)=>({q,a:[a],pic,tag});
const DK=[
 D("（近處）你腳邊有一隻小狗，說：這隻狗很小。","Este perro es pequeño.",["1f415",1],"講義例句 1"),
 D("（近處）你手上拿著一個水果，說：這個水果很好。","Esta fruta es buena.",["1f34e",1],"講義例句 2"),
 D("（近處）孩子們就在你身邊，說：這些孩子在這裡。","Estos niños están aquí.",["1f466",3],"講義例句 3"),
 D("（近處）你面前有一些蔬菜，說：這些蔬菜很大。","Estas verduras son grandes.",["1f966",3],"講義例句 4"),
 D("（中距離）電話在對方那邊，說：那支電話在那裡。","Ese teléfono está allí.",["1f4f1",1],"講義例句 5"),
 D("（中距離）指著那位女老師，說：那位女老師很好。","Esa profesora es buena.",["1f469-200d-1f3eb",1],"講義例句 6"),
 D("（中距離）看著遠一點的河流，說：那些河很大。","Esos ríos son grandes.",["1f3de",2],"講義例句 7"),
 D("（中距離）指著那邊的幾個家庭，說：那些家庭在那裡。","Esas familias están allí.",["1f46a",2],"講義例句 8"),
 D("一個男孩拿著一支電話，他說：這支電話很小。","Este teléfono es pequeño.",["1f4f1",1],"Práctica rápida 1"),
 D("兩公尺外有一隻狗，說：那隻狗很大。","Ese perro es grande.",["1f415",1],"Práctica rápida 2"),
 D("中距離有一條河，說：那條河很大。","Ese río es grande.",["1f3de",1],"Práctica rápida 3"),
 D("Manuel 看到奇怪的東西，不知道是什麼，問：這是什麼？","¿Qué es esto?",["1f440",1],"Práctica rápida 4"),
 D("旁邊有一些水果，說：這些水果很好。","Estas frutas son buenas.",["1f34e",3],"Práctica rápida 5"),
 D("朋友手上拿著怪東西，你不知道是什麼，問：那是什麼？","¿Qué es eso?",["1f440",1],"esto／eso"),
 D("（指一件事）這次的作業很難，說：這很難。","Esto es difícil.",["1f4a1",1],"esto／eso"),
 D("（指一件事）朋友說的方法很簡單，說：那很簡單。","Eso es fácil.",["1f4a1",1],"esto／eso")];
return {uid:"u6",n:6,name:"指示詞 Demostrativos",autoQuiz:true,
groups:[
 {name:"近處 este / esta / estos / estas",short:"近處",cards:C.slice(0,4)},
 {name:"中距離 ese / esa / esos / esas",short:"中距離",cards:C.slice(4,8)},
 {name:"中性 esto / eso",short:"中性",cards:C.slice(8,12)},
 {name:"英文 This / That",short:"英文",cards:C.slice(12,18)},
 {name:"名詞片語・近",short:"片語・近",cards:C.slice(18,31)},
 {name:"名詞片語・中距離",short:"片語・中距離",cards:C.slice(31,43)}],
quiz:QZ,
decks:[{name:"看情境說指示詞",kind:"say",lab:"看到情境，先自己用西班牙文說說看：",items:DK}],
texts:[
 {id:"ej",
  title:"講義例句：近處・中距離",
  tag:"可跟讀・點任一句可單獨聽（灰字是中文翻譯）",
  paras:[
   ["Este perro es pequeño.","Esta fruta es buena.","Estos niños están aquí.","Estas verduras son grandes."],
   ["Ese teléfono está allí.","Esa profesora es buena.","Esos ríos son grandes.","Esas familias están allí."]],
  zh:[["這隻狗很小。","這個水果很好。","這些孩子在這裡。","這些蔬菜很大。"],["那支電話在那裡。","那位女老師很好。","那些河很大。","那些家庭在那裡。"]]},
 {id:"pr",
  title:"Práctica rápida",
  tag:"可跟讀・只念引號裡的那一句（灰字是情境）",
  paras:[[
   "Este teléfono es pequeño. [[1. 一個男孩拿著一支電話]]",
   "Ese perro es grande. [[2. 兩公尺外有一隻狗]]",
   "Ese río es grande. [[3. 中距離有一條河]]",
   "¿Qué es esto? [[4. Manuel 看到奇怪的東西，不知道是什麼]]",
   "Estas frutas son buenas. [[5. 旁邊有一些水果]]"]],
  zh:[["這支電話很小。","那隻狗很大。","那條河很大。","這是什麼？","這些水果很好。"]]}],
/* lab：課文分頁的解說＋表格＋記憶遊戲（week06-extra.js 用）。say＝這些區塊會念到的所有西文（gen_week06_audio.js／check_audio.js 會讀）。
   forms[距離 c 近／m 中][性別 m／f]＝[單數, 複數]、neu＝中性；nouns＝遊戲 1 的名詞 [單數, 複數, 性別, 中文, 圖示]；
   ej＝講義 Ejercicio 16 題（d 距離、g 性別 m／f／n 中性、n 單複數、noun 名詞、art 冠詞、o 選項：第 7／13、8／14 題 esto 與 eso 都對，所以選項只放一個中性詞）。 */
lab:LAB};
})();
