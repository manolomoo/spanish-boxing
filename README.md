# 西班牙文-拳王之路

西班牙文課的練習網站（單元 0–6）：單字圖卡、回音法跟讀、課文與文法重點、小測驗、口說練習、吊人遊戲，加上「拳王系統」（等級、稱號、藏品）。純靜態、無框架，直接用 GitHub Pages 或任何靜態主機就能跑。

- 發音全部是預錄 mp3：西班牙文 Elvira（es-ES）、英文 Jenny（en-US）。找不到音檔只會在 console 警告並跳過。
- 每個單元：`weekNN.html` ＋ `weekNN-data.js`（`window.WEEK`）＋ `weekNN-audio.js`（文字→mp3）＋ `weekNN-icons.js`；共用 `unit.js`、`speech.js`、`rw.js`、`rpg.js`、`style.css`。
- 單元 0–5 的音檔取自原版站；單元 6 的音檔用 edge-tts（Elvira／Jenny）產生，檔名 `es_<sha1 16 位>.mp3`／`en_<sha1 16 位>.mp3`。
- 圖示：Twemoji（CC-BY 4.0）。

## 工具（node，無相依套件）

```
node tools/build_pages.js    # 依 version.txt 重新產生 index.html 與 weekNN.html（升版：先改 version.txt）
node tools/check_audio.js    # 檢查所有要念的文字都有 mp3（目標 0 缺漏）
node tools/gen_week06_audio.js  # 用 edge-tts 產生單元 6 缺的 mp3 並重寫 week06-audio.js（可重跑）
node tools/extract_audio.js <原版站目錄>   # 從原版內嵌音檔解出 mp3（bytes 不變）
node tools/build_data.js <原版站目錄>      # 從原版課程資料轉出 weekNN-data.js / weekNN-icons.js
```

本機預覽：`python3 -m http.server 8000`，開 http://localhost:8000/
