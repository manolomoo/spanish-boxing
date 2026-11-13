/* 單元 6｜指示詞 Demostrativos（內容來自課堂講義 Demostrativos；音檔由 tools/gen_week06_audio.js 用 edge-tts 產生）
   卡片欄位：w 顯示的字、say 這張卡的音檔 key（預設同 w；也是練習紀錄的 key）、lang "en"＝英文卡（Jenny），其餘西文（Elvira）、
   zh 中文、pos 標籤、tg 小卡標籤（預設同 pos）、parts 回音法要分開各走一輪的每一段（預設只有 say）、exs 顯示用的例字、
   alt「只念名詞」等第二顆按鈕念的字（不進回音週期）、ex 例句、exen 例句英文翻譯、en 這張卡本身的英文翻譯（英文翻譯只顯示＋單次念，不進回音週期）
   quiz 是講義的練習題（教學內容，勿刪）；autoQuiz＝另外自動出「西文↔中文」題。decks 口說練習；texts 課文分頁（html＝只顯示的文法說明、paras＝可跟讀的句子，[[…]]＝只顯示不念） */
window.WEEK=(function(){
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
 {id:"key",
  title:"本單元重點：指示詞 Demostrativos",
  tag:"文法說明（只顯示、不念）",
  html:[
   "En español, la distancia se expresa en dos categorías (<b>Cerca</b> y <b>Media distancia</b>).<br><span class=\"mu\">In Spanish, the distance is expressed in two categories (near and middle distance).<br>西班牙文用兩種距離來分：<b>近處</b>和<b>中距離</b>。</span>",
   "<b>1. Cerca de mí (Aquí)</b>　Near me｜靠近我（這裡）<br>Usamos <b>ESTE / ESTA</b> cuando alguien puede tocar el objeto o lo tiene en la mano.<br><span class=\"mu\">We use This when one can reach an object or has it in its hand.<br>伸手摸得到、或拿在手上的東西，用 <b>este / esta</b>。</span>",
   "<b>2. Cerca de ti / Un poco lejos (Allí)</b>｜靠近你／有點遠（那裡）<br>Usamos <b>ESE / ESA</b> cuando el objeto está a una distancia media o cerca de la persona con la que hablamos.<br><span class=\"mu\">We use That when the object is at a middle distance or near the person we are talking to.<br>東西在中等距離、或靠近對話的對方，用 <b>ese / esa</b>。</span>",
   "<b>性數變化</b>（跟著名詞的陰陽性、單複數變）<br>Masculino 陽性：<b>Este</b> (perro)・<b>Estos</b> (perros)｜<b>Ese</b> (perro)・<b>Esos</b> (perros)<br>Femenino 陰性：<b>Esta</b> (mesa)・<b>Estas</b> (mesas)｜<b>Esa</b> (mesa)・<b>Esas</b> (mesas)<br><span class=\"mu\">左邊是近處 Cerca（單數・複數），右邊是中距離 Media（單數・複數）。</span>",
   "<b>¿Y qué pasa con \"ESTO\" y \"ESO\"?</b><br>Estas son las formas neutras. Se usan solo cuando:<br>1. No sabemos qué es el objeto: \"<b>¿Qué es esto?</b>\" (tienes algo raro en la mano).<br>2. Hablamos de una situación o idea: \"<b>Eso es muy divertido</b>\" (ir a la playa).<br><span class=\"mu\">esto／eso 是中性形式，只用在：① 不知道那是什麼東西（手上拿著怪東西：「這是什麼？」）；② 指一個情境或想法（去海灘：「那很好玩」）。</span>"],
  paras:[]},
 {id:"ej",
  title:"講義例句：近處・中距離・中性",
  tag:"可跟讀・括號裡的西文也要念（灰字是中文／英文翻譯）",
  paras:[
   ["Este perro (el que está al lado de Sara). [[這隻狗（在 Sara 旁邊的那隻）｜This dog (the one next to Sara).]]",
    "Esta manzana (está en su mochila). [[這個蘋果（在她的背包裡）｜This apple (it's in her backpack).]]"],
   ["Ese gato (el que está en la roca, Peter lo ve pero no lo toca). [[那隻貓（在岩石上的那隻，Peter 看得到但摸不到）｜That cat (the one on the rock; Peter sees it but doesn't touch it).]]",
    "Esa ventana (la de la escuela que Peter ve desde la calle). [[那扇窗戶（Peter 從街上看到的學校窗戶）｜That window (the school window that Peter sees from the street).]]"],
   ["¿Qué es esto? [[這是什麼？（手上拿著怪東西）｜What is this?]]",
    "Eso es muy divertido. [[那很好玩。（指「去海灘」這件事）｜That is a lot of fun.]]"]]},
 {id:"pr",
  title:"Práctica rápida",
  tag:"可跟讀・只念引號裡的那一句（灰字是情境）",
  paras:[[
   "Esta manzana es roja. [[1. Pedro 手上拿著一顆蘋果]]",
   "Esos zapatos son nuevos. [[2. Marta 指著兩公尺外朋友的鞋子]]",
   "Esa luna brilla mucho. [[3. Sara 和 Marta 看著天上的月亮]]",
   "¿Qué es esto? [[4. Manuel 在沙子裡發現怪東西，不知道是什麼]]",
   "Estos perros son muy divertidos. [[5. Javier 指著在他身邊玩的狗]]"]],
  zh:[["這顆蘋果是紅色的。","那些鞋子是新的。","那個月亮很亮。","這是什麼？","這些狗很有趣。"]]}]};
})();
