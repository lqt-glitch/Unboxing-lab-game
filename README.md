# 開箱儀式 · 電腦組件配對

適合中一學生的電腦組件小遊戲。保留原有中央機箱、兩旁配對框、六張實物照片及互動功能。

## 直接試玩

先將 ZIP 完整解壓縮，再用 Chrome、Edge、Firefox 或 Safari 開啟 `index.html`。
遊戲所需的圖片、樣式和程式已全部附上，不需要安裝套件、登入、API key 或後端服務；解壓縮後亦可離線使用。只有按下「圖片來源」中的外部連結時才需要網絡。

## 放上新的 GitHub Pages 網站

1. 在 GitHub 建立一個 public repository，例如 `unboxing-lab`。
2. 選擇 **Add file → Upload files**，上載解壓縮後的所有檔案和 `assets` 資料夾，然後 **Commit changes**。`index.html` 應直接位於 repository 根目錄；不要只上載 ZIP。
3. 開啟 **Settings → Pages**。在 **Build and deployment → Source** 選擇 **Deploy from a branch**。
4. Branch 選擇上載檔案所在的分支（新 repository 通常是 `main`），資料夾選擇 **/(root)**，按 **Save**。
5. 等待 GitHub 完成發布；Pages 設定頁顯示的網址就是學生遊戲連結，通常格式為 `https://你的用戶名.github.io/unboxing-lab/`。

包內的 `.nojekyll` 是供 GitHub Pages 使用的空檔案。若檔案管理器沒有顯示它，可在 repository 根目錄用 **Add file → Create new file** 建立名為 `.nojekyll` 的空檔案。

官方設定說明：
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 加入已有網站

如果已有 GitHub Pages、Cloudflare Pages 或其他靜態網站，把這個遊戲的所有檔案放進該網站的發布目錄下的一個新資料夾，例如 `unboxing-lab/`。保持 `index.html`、`styles.css`、`game.js` 和 `assets/` 的相對位置。

之後連結至 `你的網站網址/unboxing-lab/` 即可。沿用現有網站的發布設定，不需要覆寫原網站的首頁或根目錄設定，也不需要新增 Worker。

## 課堂操作

- 將機箱內的組件拖到相應的名稱框；亦可先點組件，再點名稱框。
- 鍵盤操作：Tab 移動焦點，Enter 或空白鍵選取／配對，Esc 取消選取。
- 答錯可以重試；答對會顯示該組件的功能。
- 「提示已開／提示已關」切換外形提示；「重新開始」及完成後的「再玩一次」會重新洗牌。
- 支援滑鼠及觸控。較窄畫面會把機箱移到名稱框上方。
- 遊戲進度只在當前頁面保留；重新整理會重新開始，不會收集或上傳學生資料，也不會產生教師成績報表。

## 檔案用途

| 檔案 | 用途 |
| --- | --- |
| `index.html` | 網頁入口及圖片來源註明 |
| `styles.css` | 原有版面、配色及不同螢幕尺寸的樣式 |
| `game.js` | 拖放、點選、提示、配對及重新開始 |
| `assets/` | 六張電腦組件照片 |
| `.nojekyll` | GitHub Pages 靜態檔案設定 |

## 圖片來源

原網頁「圖片來源」已保留每張照片的作者、來源頁及授權連結，發布時請一併保留。六張照片沿用原版本，沒有在本次匯出中替換或修改。

本次匯出：2026-09-07。HTML、CSS、JavaScript 及照片均與原有版本逐一比對一致。
