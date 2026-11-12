/* 語音：全部是預錄的自然語音 mp3（西文 es-ES Elvira、英文 en-US Jenny）。對照表 window.UNIT_C（文字→檔案路徑）由 weekNN-audio.js 提供。
   TTS.play(text, rate) → Promise<秒數>；被中斷回傳 null。TTS.cancel() 中斷；TTS.sess() 目前世代。
   rate 用 Audio.playbackRate（preservesPitch）。找不到音檔就在 console 警告並跳過（回傳 0 秒），不使用瀏覽器內建的合成語音。 */
(function(){
let sess=0,pend=null,clip=0,cur=null;const C=()=>window.UNIT_C||{};
const est=(t,r)=>Math.max(.8,t.trim().split(/\s+/).length/(2.5*r)+.3);
function stopAll(){if(cur){try{cur.pause()}catch(e){}cur=null}}
function cancel(){sess++;if(pend){const p=pend;pend=null;p(null)}stopAll()}
function play(text,rate){rate=rate||1;const prev=pend;pend=null;if(prev)prev(null);const id=++clip,s0=sess;stopAll();
 return new Promise(res=>{let done=false,timer=0;
  const fin=d=>{if(done)return;done=true;clearTimeout(timer);if(pend===cm)pend=null;res(id===clip&&s0===sess?d:null)};
  const cm=()=>{if(done)return;done=true;clearTimeout(timer);res(null)};pend=cm;
  const e=est(text,rate),f=C()[text];
  if(!f){console.warn("[TTS] 找不到預錄音檔，跳過：",text);timer=setTimeout(()=>fin(0),60);return}
  const a=new Audio(f);cur=a;a.preservesPitch=true;a.mozPreservesPitch=true;a.webkitPreservesPitch=true;a.playbackRate=rate;
  a.onended=()=>fin(a.duration?a.duration/rate:e);
  a.onerror=()=>{console.warn("[TTS] 音檔載入失敗：",f);fin(e)};
  timer=setTimeout(()=>fin(e),(a.duration||e)*1000*3+8000);
  const p=a.play();if(p&&p.catch)p.catch(err=>{if(id!==clip||s0!==sess)return;console.warn("[TTS] 播放被擋：",err&&err.name);fin(e)})})}
window.TTS={play,cancel,sess:()=>sess,supported:()=>typeof Audio!=="undefined",voiceName:()=>"es-ES-ElviraNeural / en-US-JennyNeural"};
})();
