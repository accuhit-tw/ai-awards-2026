# AccuFlow WebChat (AI Frontend)

本專案為 AccuFlow 系統中的 AI 聊天室前端介面 (WebChat / LIFF)，使用 Vue 3 與 Vite 建構，提供與後端 AI Bot 進行即時串流對話的功能。

## 核心技術棧

- **核心框架**: Vue 3 (Composition API)
- **建置工具**: Vite
- **狀態管理**: Pinia
- **路由管理**: Vue Router
- **樣式**: Tailwind CSS, SCSS
- **即時通訊**: WebSocket, Axios (REST API)
- **多語系**: Vue I18n
- **Markdown 解析**: markdown-it, highlight.js

## 主要功能

1. **即時串流對話 (Streaming)**：透過 WebSocket 接收後端 AI 的生成過程，實現打字機效果。支援中斷訊息生成 (Stop Process)。
2. **多媒體格式支援**：除了純文字外，支援解析並顯示 Flex Message 圖卡。
3. **使用者回饋機制**：針對 AI 的回覆，使用者可給予「讚 (Like)」或「倒讚 (Dislike)」並填寫回饋內容。
4. **主題風格客製化**：聊天室背景顏色、漸層角度與文字顏色可透過 API 動態配置套用。
5. **對話點數額度控制**：支援查詢組織發訊用量，當點數耗盡時會有對應防護機制與畫面白板提示。
6. **環境模式**：可透過 Query String (`channel`, `channelHash`, `mode`) 判斷執行環境與身份，支援對話測試模式。
7. **多語系支援**：預設偵測瀏覽器語系自動切換，支援繁體中文 (`zhTw`) 與英文 (`en`)。

## 環境變數配置

請確保根目錄下存在基礎環境變數配置，需具備以下重點變數以連接後端服務：

```env
VITE_APP_API_URL=您的後端_API_網址
VITE_SOCKET_URL=您的_WebSocket_網址
```

## 開發與建置

### 安裝依賴庫

```bash
npm install
```

### 啟動本地開發環境

```bash
npm run dev
```

### 建置正式環境靜態檔

```bash
npm run build
```

### 本地端預覽建置後結果

```bash
npm run preview
```

## 目錄結構重點說明

- `src/api`: Axios Request 封裝與後端 API 請求介面。
- `src/assets`: 靜態資源，包含圖片、圖示等。
- `src/components`: UI 可重用元件 (例如：聊天室 Header、輸入框 MsgInput、訊息卡片 MsgContent、回饋視窗等)。
- `src/composable`: Vue Composition API 邏輯抽離區 (例如：處理時間轉換的 `useTimezone`、動態主題 `useWebChatStyle`)。
- `src/directives`: 專案內自訂 Vue 指令 (如程式碼複製機制)。
- `src/lang`: 多語系配置目錄。
- `src/utils`: 輔助工具函式庫。
