/* 語音：全部是預錄的自然語音 mp3（西文 es-ES Elvira、英文 en-US Jenny）。對照表 window.UNIT_C（文字→檔案路徑）由 weekNN-audio.js 提供。
   TTS.play(text, rate) → Promise<秒數>；被中斷回傳 null。TTS.cancel() 中斷；TTS.sess() 目前世代。
   TTS.unlock()：在使用者點擊當下呼叫，用靜音 wav 把共用音訊解鎖。
   同一個 <audio playsinline> 重複使用（手機在回音法的靜音間隔之後，新的 Audio() 可能被自動播放政策擋住，導致只聽到第一段）。
   rate 用 playbackRate（preservesPitch）。找不到音檔就在 console 警告並跳過（回傳 0 秒），不使用瀏覽器內建的合成語音。 */
(function(){
let sess=0,pend=null,clip=0,cur=null,shared=null;const C=()=>window.UNIT_C||{};
const SILENT="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
const est=(t,r)=>Math.max(.8,t.trim().split(/\s+/).length/(2.5*r)+.3);
function ensure(){
  if(shared)return shared;
  const a=document.createElement("audio");
  a.setAttribute("playsinline","");a.setAttribute("webkit-playsinline","");a.playsInline=true;a.preload="auto";
  a.style.cssText="position:absolute;width:0;height:0;opacity:0;pointer-events:none";
  (document.body||document.documentElement).appendChild(a);
  return shared=a;
}
/* 正在出聲時不動它（否則會打斷／重播目前這一段）；其餘時候（還沒播過、兩段之間的靜音間隔、播完）換成靜音 wav 播一下。 */
function unlock(){
  try{
    const a=ensure();
    if(cur&&!a.paused&&!a.ended)return;
    cur=null;a.onended=null;a.onerror=null;
    a.src=SILENT;
    const p=a.play();
    if(p&&p.then)p.then(()=>{try{if(!cur&&a.src===SILENT)a.pause()}catch(e){}}).catch(()=>{});
  }catch(e){}
}
function stopAll(){
  if(cur){try{cur.onended=null;cur.onerror=null;cur.pause()}catch(e){}}
  cur=null;
}
function cancel(){sess++;if(pend){const p=pend;pend=null;p(null)}stopAll()}
function play(text,rate){rate=rate||1;const prev=pend;pend=null;if(prev)prev(null);const id=++clip,s0=sess;stopAll();
 return new Promise(res=>{let done=false,timer=0;
  const fin=d=>{if(done)return;done=true;clearTimeout(timer);if(pend===cm)pend=null;res(id===clip&&s0===sess?d:null)};
  const cm=()=>{if(done)return;done=true;clearTimeout(timer);res(null)};pend=cm;
  const e=est(text,rate),f=C()[text];
  if(!f){console.warn("[TTS] 找不到預錄音檔，跳過：",text);timer=setTimeout(()=>fin(0),60);return}
  const a=ensure();cur=a;
  a.preservesPitch=true;a.mozPreservesPitch=true;a.webkitPreservesPitch=true;
  a.onended=()=>{if(a.src===SILENT)return;fin(a.duration&&isFinite(a.duration)?a.duration/rate:e)};   // 解鎖用的靜音 wav 結束不算
  a.onerror=()=>{console.warn("[TTS] 音檔載入失敗：",f);fin(e)};
  timer=setTimeout(()=>fin(e),e*1000*3+8000);
  let abs;try{abs=new URL(f,location.href).href}catch(err){abs=f}
  if(a.src===abs&&a.readyState>=2){try{if(a.currentTime)a.currentTime=0}catch(err){}}
  else a.src=f;
  try{a.playbackRate=rate}catch(err){}          // 換 src 會把 playbackRate 重設成 defaultPlaybackRate，所以要在設 src 之後
  const p=a.play();
  if(p&&p.catch)p.catch(err=>{if(id!==clip||s0!==sess)return;console.warn("[TTS] 播放被擋：",err&&err.name);fin(e)})})}
window.TTS={play,cancel,unlock,sess:()=>sess,supported:()=>typeof Audio!=="undefined",voiceName:()=>"es-ES-ElviraNeural / en-US-JennyNeural"};
})();
