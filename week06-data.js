/* 單元 6｜指示詞 Demostrativos（內容來自課堂講義 Demostrativos；音檔由 tools/gen_week06_audio.js 用 edge-tts 產生）
   卡片欄位：w 顯示的字、say 這張卡的音檔 key（預設同 w；也是練習紀錄的 key）、lang "en"＝英文卡（Jenny），其餘西文（Elvira）、
   zh 中文、pos 標籤、tg 小卡標籤（預設同 pos）、parts 回音法要分開各走一輪的每一段（預設只有 say）、exs 顯示用的例字、
   alt「只念名詞」等第二顆按鈕念的字（不進回音週期）、ex 例句、exen 例句英文翻譯、en 這張卡本身的英文翻譯（英文翻譯只顯示＋單次念，不進回音週期）
   quiz 是講義的練習題（教學內容，勿刪）；autoQuiz＝另外自動出「西文↔中文」題。decks 口說練習；texts 課文分頁的跟讀（paras＝可跟讀的句子，[[…]]＝只顯示不念）；lab 課文分頁的解說／表格／遊戲（week06-extra.js）。
   v4 起課文分頁改用新講義（Demostrativos 新版：Ejercicio 16 題）；單字卡、小測驗、口說仍是舊講義內容。 */
window.WEEK=(function(){
const LAB=(function(){
 const forms={c:{m:["Este","Estos"],f:["Esta","Estas"],neu:"Esto"},m:{m:["Ese","Esos"],f:["Esa","Esas"],neu:"Eso"}};
 const nouns=[["perro","perros","m","狗","1f415"],["niño","niños","m","男孩","1f466"],["teléfono","teléfonos","m","電話","1f4f1"],["profesor","profesores","m","男老師","1f468-200d-1f3eb"],
  ["fruta","frutas","f","水果","1f34e"],["niña","niñas","f","女孩","1f467"],["verdura","verduras","f","蔬菜","1f966"],["profesora","profesoras","f","女老師","1f469-200d-1f3eb"]];
 const E=(q,a,o,say,zh,d,g,n,noun,art)=>({q,a,o,say,zh,d,g,n,noun,art});
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
 return {forms,nouns,ej,table,ex,say};
})();
const C=[
 /* A. 近處 0–4 */
 {"w":"Este","zh":"這個（陽性單數・近）","en":"This","pos":"指示詞・陽性・單數・近","ex":"Este perro (el que está al lado de Sara).","exen":"This dog (the one next to Sara)."},
 {"w":"Esta","zh":"這個（陰性單數・近）","en":"This","pos":"指示詞・陰性・單數・近","ex":"Esta manzana (está en su mochila).","exen":"This apple (it's in her backpack)."},
 {"w":"Estos","zh":"這些（陽性複數・近）","en":"These","pos":"指示詞・陽性・複數・近","ex":"Estos perros son muy divertidos.","exen":"These dogs are a lot of fun."},
 {"w":"Estas","zh":"這些（陰性複數・近）","en":"These","pos":"指示詞・陰性・複數・近","ex":"Estas mesas.","exen":"These tables."},
 /* B. 中距離 4–8 */
 {"w":"Ese","zh":"那個（陽性單數・中距離）","en":"That","pos":"指示詞・陽性・單數・中距離","ex":"Ese gato (el que está en la roca, Peter lo ve pero no lo toca).","exen":"That cat (the one on the rock; Peter sees it but doesn't touch it)."},
 {"w":"Esa","zh":"那個（陰性單數・中距離）","en":"That","pos":"指示詞・陰性・單數・中距離","ex":"Esa ventana (la de la escuela que Peter ve desde la calle).","exen":"That window (the school window that Peter sees from the street)."},
 {"w":"Esos","zh":"那些（陽性複數・中距離）","en":"Those","pos":"指示詞・陽性・複數・中距離","ex":"Esos zapatos son nuevos.","exen":"Those shoes are new."},
 {"w":"Esas","zh":"那些（陰性複數・中距離）","en":"Those","pos":"指示詞・陰性・複數・中距離","ex":"Esas mesas.","exen":"Those tables."},
 /* C. 中性 8–10 */
 {"w":"Esto","zh":"這個（中性）","en":"this","pos":"指示詞・中性・近","ex":"¿Qué es esto?","exen":"What is this?"},
 {"w":"Eso","zh":"那個（中性）","en":"that","pos":"指示詞・中性・中距離","ex":"Eso es muy divertido.","exen":"That is a lot of fun."},
 /* D. 英文卡 10–16 */
 {"w":"This","lang":"en","zh":"這個（英文・近，對應 este / esta）","pos":"英文｜近"},
 {"w":"These","lang":"en","zh":"這些（英文・近，對應 estos / estas）","pos":"英文｜近"},
 {"w":"That","lang":"en","zh":"那個（英文・中距離，對應 ese / esa）","pos":"英文｜中距離"},
 {"w":"Those","lang":"en","zh":"那些（英文・中距離，對應 esos / esas）","pos":"英文｜中距離"},
 {"w":"this","lang":"en","zh":"這個（英文・中性，對應 esto）","pos":"英文｜中性"},
 {"w":"that","lang":"en","zh":"那個（英文・中性，對應 eso）","pos":"英文｜中性"},
 /* E1. 名詞片語・近 16–21 */
 {"w":"Este perro","zh":"這隻狗（近）","en":"This dog","pos":"名詞片語・陽性・單數・近","ex":"Este perro (el que está al lado de Sara).","exen":"This dog (the one next to Sara)."},
 {"w":"Estos perros","zh":"這些狗（近）","en":"These dogs","pos":"名詞片語・陽性・複數・近","ex":"Estos perros son muy divertidos.","exen":"These dogs are a lot of fun."},
 {"w":"Esta mesa","zh":"這張桌子（近）","en":"This table","pos":"名詞片語・陰性・單數・近"},
 {"w":"Estas mesas","zh":"這些桌子（近）","en":"These tables","pos":"名詞片語・陰性・複數・近"},
 {"w":"Esta manzana","zh":"這個蘋果（近）","en":"This apple","pos":"名詞片語・陰性・單數・近","ex":"Esta manzana es roja.","exen":"This apple is red."},
 /* E2. 名詞片語・中距離 21–29 */
 {"w":"Ese perro","zh":"那隻狗（中距離）","en":"That dog","pos":"名詞片語・陽性・單數・中距離"},
 {"w":"Esos perros","zh":"那些狗（中距離）","en":"Those dogs","pos":"名詞片語・陽性・複數・中距離"},
 {"w":"Esa mesa","zh":"那張桌子（中距離）","en":"That table","pos":"名詞片語・陰性・單數・中距離"},
 {"w":"Esas mesas","zh":"那些桌子（中距離）","en":"Those tables","pos":"名詞片語・陰性・複數・中距離"},
 {"w":"Ese gato","zh":"那隻貓（中距離）","en":"That cat","pos":"名詞片語・陽性・單數・中距離","ex":"Ese gato (el que está en la roca, Peter lo ve pero no lo toca).","exen":"That cat (the one on the rock; Peter sees it but doesn't touch it)."},
 {"w":"Esa ventana","zh":"那扇窗戶（中距離）","en":"That window","pos":"名詞片語・陰性・單數・中距離","ex":"Esa ventana (la de la escuela que Peter ve desde la calle).","exen":"That window (the school window that Peter sees from the street)."},
 {"w":"Esos zapatos","zh":"那些鞋子（中距離）","en":"Those shoes","pos":"名詞片語・陽性・複數・中距離","ex":"Esos zapatos son nuevos.","exen":"Those shoes are new."},
 {"w":"Esa luna","zh":"那個月亮（中距離）","en":"That moon","pos":"名詞片語・陰性・單數・中距離","ex":"Esa luna brilla mucho.","exen":"That moon shines a lot."}];
return {uid:"u6",n:6,name:"指示詞 Demostrativos",autoQuiz:true,
groups:[
 {name:"近處 este / esta / estos / estas",short:"近處",cards:C.slice(0,4)},
 {name:"中距離 ese / esa / esos / esas",short:"中距離",cards:C.slice(4,8)},
 {name:"中性 esto / eso",short:"中性",cards:C.slice(8,10)},
 {name:"英文 This / That",short:"英文",cards:C.slice(10,16)},
 {name:"名詞片語・近",short:"片語・近",cards:C.slice(16,21)},
 {name:"名詞片語・中距離",short:"片語・中距離",cards:C.slice(21,29)}],
quiz:[
 {"q":"(Cerca) __________ niño se llama Pedro.","z":"近處・陽性單數｜這個男孩叫 Pedro。","o":["Esta","Este","Estos","Ese"],"a":"Este","say":"Este niño se llama Pedro.","show":"Este niño se llama Pedro."},
 {"q":"(Media distancia) __________ gatos están encima de la mesa.","z":"中距離・陽性複數｜那些貓在桌子上面。","o":["Ese","Estos","Esas","Esos"],"a":"Esos","say":"Esos gatos están encima de la mesa.","show":"Esos gatos están encima de la mesa."},
 {"q":"(Cerca) __________ sombrilla es de mi familia.","z":"近處・陰性單數｜這把陽傘是我家的。","o":["Esta","Este","Esa","Estas"],"a":"Esta","say":"Esta sombrilla es de mi familia.","show":"Esta sombrilla es de mi familia."},
 {"q":"(Media distancia) __________ ventanas de la escuela son grandes.","z":"中距離・陰性複數｜學校的那些窗戶很大。","o":["Esos","Estas","Esas","Esa"],"a":"Esas","say":"Esas ventanas de la escuela son grandes.","show":"Esas ventanas de la escuela son grandes."},
 {"q":"(Cerca) __________ vasos están limpios.","z":"近處・陽性複數｜這些杯子是乾淨的。","o":["Estas","Esos","Este","Estos"],"a":"Estos","say":"Estos vasos están limpios.","show":"Estos vasos están limpios."},
 {"q":"(Media distancia) __________ profesor habla por teléfono.","z":"中距離・陽性單數｜那位男老師在講電話。","o":["Este","Ese","Esa","Esos"],"a":"Ese","say":"Ese profesor habla por teléfono.","show":"Ese profesor habla por teléfono."},
 {"q":"(Desconocido) ¿Qué es __________ que hay en el suelo?","z":"不知道是什麼・中性｜地上的這個是什麼？","o":["este","esta","esto","eso"],"a":"esto","say":"¿Qué es esto que hay en el suelo?","show":"¿Qué es esto que hay en el suelo?"}],
decks:[
 {name:"看情境說指示詞",kind:"say",lab:"看到情境，先自己用西班牙文說說看：",items:[
  {"q":"Pedro 手上拿著一顆蘋果，他說：這顆蘋果是紅色的。","a":["Esta manzana es roja."],"pic":["1f34e",1],"tag":"Práctica rápida 1"},
  {"q":"Marta 指著兩公尺外朋友的鞋子說：那些鞋子是新的。","a":["Esos zapatos son nuevos."],"pic":["1f45e",2],"tag":"Práctica rápida 2"},
  {"q":"Sara 和 Marta 看著天上的月亮說：那個月亮很亮。","a":["Esa luna brilla mucho."],"pic":["1f319",1],"tag":"Práctica rápida 3"},
  {"q":"Manuel 在沙子裡發現怪東西，不知道是什麼，他問：這是什麼？","a":["¿Qué es esto?"],"pic":["1f4a1",1],"tag":"Práctica rápida 4"},
  {"q":"Javier 指著在他身邊玩的狗說：這些狗很有趣。","a":["Estos perros son muy divertidos."],"pic":["1f415",3],"tag":"Práctica rápida 5"},
  {"q":"（近處）這個男孩叫 Pedro。","a":["Este niño se llama Pedro."],"pic":["1f466",1],"tag":"Ejercicio 1"},
  {"q":"（中距離）那些貓在桌子上面。","a":["Esos gatos están encima de la mesa."],"pic":["1f408",2],"tag":"Ejercicio 2"},
  {"q":"（近處）這把陽傘是我家的。","a":["Esta sombrilla es de mi familia."],"pic":["26f1",1],"tag":"Ejercicio 3"},
  {"q":"（中距離）學校的那些窗戶很大。","a":["Esas ventanas de la escuela son grandes."],"pic":["1fa9f",2],"tag":"Ejercicio 4"},
  {"q":"（近處）這些杯子是乾淨的。","a":["Estos vasos están limpios."],"pic":["1f95b",2],"tag":"Ejercicio 5"},
  {"q":"（中距離）那位男老師在講電話。","a":["Ese profesor habla por teléfono."],"pic":["1f468-200d-1f3eb",1],"tag":"Ejercicio 6"},
  {"q":"（不知道是什麼）地上的這個是什麼？","a":["¿Qué es esto que hay en el suelo?"],"pic":["1f4a1",1],"tag":"Ejercicio 7"}]}],
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
