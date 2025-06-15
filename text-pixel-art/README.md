入力したテキストをレトロなピクセルアートに変換するWebアプリをHTMLで作成しました。Google Fonts対応で50種類以上の日本語フォントから選択でき、複数行テキストにも対応した高機能なピクセルアート生成ツールです。

[![テキストピクセルアートのスクリーンショット](/tools/text-pixel-art/ogp.png)](https://pa-tu.work/tools/text-pixel-art)

[テキストピクセルアート](https://pa-tu.work/tools/text-pixel-art)

## ファイル構成

```plaintext
text-pixel-art/
├── index.html          # HTMLマークアップ
├── style.css           # CSSスタイル・レスポンシブデザイン
├── script.js           # ピクセルアート生成ロジック
├── README.md           # プロジェクト説明
└── ogp.png            # OGP画像
```

## 技術仕様

- HTML5, CSS3, Vanilla JavaScript
- Google Fonts API（50種類以上の日本語フォント）
- HTML5 Canvas（フォントベースピクセル化）
- Font Awesome（アイコンベースUI）
- レスポンシブデザイン対応

## 使い方

### 基本操作

- **テキスト入力**: 複数行対応のテキストエリアに変換したい文字を入力
- **フォント選択**: 50種類以上のGoogle Fonts日本語フォントから選択
- **スタイル設定**: 標準・太字の選択とテキスト配置（左・中央・右寄せ）
- **カラーカスタマイズ**: 文字色・背景色をカラーピッカーで調整
- **グラデーション**: 8種類の美しいプリセットグラデーションから選択
- **グリッド調整**: 1-300の範囲でピクセル密度を設定
- **プレビュー**: リアルタイムでピクセルアート生成
- **ダウンロード**: 600×600ピクセルのPNG形式で保存

### 対応文字種

- **日本語**: ひらがな・カタカナ・漢字完全対応
- **英語**: 大文字・小文字・数字・記号
- **複数行**: 改行を含む複数行テキスト処理

### グラデーションプリセット

- **サンセット**: オレンジからピンクの夕焼けグラデーション
- **オーシャン**: ブルーからシアンの海洋グラデーション
- **ファイア**: 赤からオレンジの炎グラデーション
- **レインボー**: 虹色の6段階グラデーション
- **ネオン**: グリーンからシアンのネオングラデーション
- **パープル**: 藍色から紫の神秘的グラデーション
- **ゴールド**: 金色から明るいオレンジの豪華グラデーション

## 実装の核心機能解説

### 1. Google Fontsベースピクセル化エンジン

フォントをCanvasに描画してピクセル化する高品質アルゴリズム

**JavaScript実装**:

```javascript
/**
 * フォントベースピクセルアート生成
 * @param {string} text - 変換対象テキスト（複数行対応）
 */
generatePixelArtFromFont(text) {
    // 一時キャンバス作成
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    // フォント設定（漢字対応のため大きなサイズ）
    const fontSize = Math.max(64, this.pixelSize * 8);
    const fontString = `${this.fontStyle} ${fontSize}px "${this.fontFamily}", sans-serif`;
    
    tempCtx.font = fontString;
    tempCtx.textAlign = 'left';
    tempCtx.textBaseline = 'middle';
    tempCtx.imageSmoothingEnabled = false;
    
    // 複数行テキスト処理
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    // 各行のサイズ測定
    let maxWidth = 0;
    const lineMetrics = [];
    
    lines.forEach(line => {
        const metrics = tempCtx.measureText(line);
        lineMetrics.push({
            text: line,
            width: Math.ceil(metrics.width)
        });
        maxWidth = Math.max(maxWidth, metrics.width);
    });
    
    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    const padding = Math.floor(fontSize * 0.3);
    
    // キャンバスサイズ設定
    tempCanvas.width = maxWidth + padding * 2;
    tempCanvas.height = totalHeight + padding * 2;
    
    // 背景描画
    tempCtx.fillStyle = '#FFFFFF';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // フォント設定再適用
    tempCtx.font = fontString;
    tempCtx.textAlign = 'left';
    tempCtx.textBaseline = 'middle';
    tempCtx.imageSmoothingEnabled = false;
    
    // テキスト配置別描画
    tempCtx.fillStyle = '#000000';
    lines.forEach((line, index) => {
        const lineWidth = lineMetrics[index].width;
        const y = padding + (index + 0.5) * lineHeight;
        
        let x;
        switch (this.textAlign) {
            case 'left':
                x = padding;
                break;
            case 'center':
                x = padding + (maxWidth - lineWidth) / 2;
                break;
            case 'right':
                x = padding + maxWidth - lineWidth;
                break;
            default:
                x = padding + (maxWidth - lineWidth) / 2;
        }
        
        tempCtx.fillText(line, x, y);
    });
    
    // 画像データ取得とピクセル化
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    this.pixelizeImage(imageData, tempCanvas.width, tempCanvas.height);
}
```

### 2. インテリジェントピクセル化アルゴリズム

ImageDataを解析してピクセル密度に基づく最適化された描画

**JavaScript実装**:

```javascript
/**
 * 高品質ピクセル化処理
 * @param {ImageData} imageData - 元画像データ
 * @param {number} width - 元画像幅
 * @param {number} height - 元画像高さ
 */
pixelizeImage(imageData, width, height) {
    const data = imageData.data;
    const canvasSize = 600;
    const gridSize = this.pixelSize;
    const cellSize = canvasSize / gridSize;
    
    // ピクセル化データ生成
    const pixelData = this.generatePixelData(data, width, height, gridSize);
    
    // 表示制御フラグに応じて描画
    if (this.shouldDisplayResult) {
        this.renderToCanvas(pixelData, canvasSize, gridSize, cellSize);
    } else {
        this.pendingImageData = { pixelData, canvasSize, gridSize, cellSize };
    }
}

/**
 * ピクセル密度解析によるデータ生成
 */
generatePixelData(data, width, height, gridSize) {
    const pixelData = [];
    const sampleWidth = width / gridSize;
    const sampleHeight = height / gridSize;
    
    for (let py = 0; py < gridSize; py++) {
        for (let px = 0; px < gridSize; px++) {
            let blackPixels = 0;
            let totalPixels = 0;
            
            const startX = Math.floor(px * sampleWidth);
            const endX = Math.floor((px + 1) * sampleWidth);
            const startY = Math.floor(py * sampleHeight);
            const endY = Math.floor((py + 1) * sampleHeight);
            
            // 領域内のピクセル解析
            for (let y = startY; y < endY && y < height; y++) {
                for (let x = startX; x < endX && x < width; x++) {
                    const index = (y * width + x) * 4;
                    const r = data[index];
                    const g = data[index + 1];
                    const b = data[index + 2];
                    
                    const gray = (r + g + b) / 3;
                    if (gray < 180) {
                        blackPixels++;
                    }
                    totalPixels++;
                }
            }
            
            // 黒ピクセル密度が20%以上で描画対象
            if (totalPixels > 0 && (blackPixels / totalPixels) > 0.2) {
                pixelData.push({ px, py });
            }
        }
    }
    
    return pixelData;
}
```

### 3. レスポンシブキャンバスシステム

画面サイズに応じてキャンバスサイズを動的調整

**JavaScript実装**:

```javascript
/**
 * レスポンシブキャンバス初期化
 * 画面幅に応じた最適なキャンバスサイズを計算
 */
initResponsiveCanvas() {
    const updateCanvasSize = () => {
        const viewportWidth = window.innerWidth;
        let canvasSize = 600; // デフォルトサイズ
        
        if (viewportWidth <= 480) {
            canvasSize = Math.min(350, viewportWidth - 70);
        } else if (viewportWidth <= 560) {
            canvasSize = Math.min(450, viewportWidth - 80);
        } else if (viewportWidth <= 600) {
            canvasSize = Math.min(500, viewportWidth - 40);
        }
        
        // CSSサイズを更新（横スクロール防止）
        this.canvas.style.width = canvasSize + 'px';
        this.canvas.style.height = canvasSize + 'px';
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
}
```

**CSS実装**:

```css
/* 段階的レスポンシブ対応 */
@media (max-width: 600px) {
    #pixel-canvas {
        width: calc(100vw - 40px);
        height: calc(100vw - 40px);
        max-width: 500px;
        max-height: 500px;
    }
}

@media (max-width: 560px) {
    #pixel-canvas {
        width: calc(100vw - 80px);
        height: calc(100vw - 80px);
        max-width: 450px;
        max-height: 450px;
    }
    
    .canvas-section,
    .settings-section {
        padding: 15px;
    }
}

@media (max-width: 480px) {
    #pixel-canvas {
        width: calc(100vw - 70px);
        height: calc(100vw - 70px);
        max-width: 350px;
        max-height: 350px;
    }
}
```

### 4. モダンUIコンポーネント

Font Awesomeアイコンによる直感的な操作インターフェース

**テキスト配置ボタン実装**:

```css
/* アイコンベースのテキスト配置ボタン */
.text-align-buttons {
    display: flex;
    gap: 5px;
    background: #f7fafc;
    padding: 3px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}

.align-btn {
    flex: 1;
    padding: 8px 12px;
    background: transparent;
    border: none;
    border-radius: 5px;
    color: #4a5568;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    height: 36px;
}

.align-btn:hover {
    background: rgba(139, 92, 246, 0.1);
    color: #8b5cf6;
}

.align-btn.active {
    background: #8b5cf6;
    color: white;
    box-shadow: 0 2px 4px rgba(139, 92, 246, 0.3);
}

.align-icon svg {
    width: 16px;
    height: 16px;
}
```

**JavaScript UI制御**:

```javascript
// テキスト配置ボタンの制御
textAlignBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // アクティブ状態切り替え
        textAlignBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // 配置設定を更新
        this.textAlign = btn.dataset.align;
        
        if (document.getElementById('text-input').value.trim()) {
            this.generatePixelArt();
        }
    });
});
```

### 5. グラデーションピクセル描画システム

8種類のプリセットグラデーションでピクセルアートを美しく彩る機能

**グラデーション定義**:

```javascript
// グラデーションプリセットの定義
this.gradients = {
    'none': null,
    'sunset': ['#ff9a56', '#ff6b9d'],        // サンセット
    'ocean': ['#4facfe', '#00f2fe'],         // オーシャン
    'fire': ['#ff416c', '#ff4b2b'],          // ファイア
    'rainbow': ['#ff0000', '#ff8c00', '#ffd700', '#32cd32', '#00bfff', '#8a2be2'], // レインボー
    'neon': ['#00ff88', '#00ccff'],          // ネオン
    'purple': ['#667eea', '#764ba2'],        // パープル
    'gold': ['#ffd700', '#ffb347']           // ゴールド
};
```

**グラデーション選択UI**:

```css
/* グラデーションプリセット選択 */
.gradient-presets {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
}

.gradient-option {
    cursor: pointer;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    padding: 3px;
    transition: all 0.2s ease;
}

.gradient-option:hover {
    border-color: #8b5cf6;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
}

.gradient-preview {
    width: 100%;
    height: 32px;
    border-radius: 4px;
}

/* 各グラデーションの視覚プレビュー */
.gradient-sunset { background: linear-gradient(45deg, #ff9a56, #ff6b9d); }
.gradient-ocean { background: linear-gradient(45deg, #4facfe, #00f2fe); }
.gradient-fire { background: linear-gradient(45deg, #ff416c, #ff4b2b); }
```

**グラデーションピクセル描画**:

```javascript
/**
 * グラデーションまたは単色を適用してピクセルを描画
 */
drawPixelWithGradient(ctx, x, y, width, height, totalWidth, totalHeight) {
    if (this.selectedGradient === 'none') {
        // 単色で描画
        ctx.fillStyle = this.textColor;
        ctx.fillRect(x, y, width, height);
    } else {
        // グラデーションで描画
        const gradientColors = this.gradients[this.selectedGradient];
        if (gradientColors) {
            const gradient = ctx.createLinearGradient(0, 0, totalWidth, totalHeight);
            
            // 2色グラデーション
            if (gradientColors.length === 2) {
                gradient.addColorStop(0, gradientColors[0]);
                gradient.addColorStop(1, gradientColors[1]);
            } else {
                // 多色グラデーション（レインボーなど）
                gradientColors.forEach((color, index) => {
                    gradient.addColorStop(index / (gradientColors.length - 1), color);
                });
            }
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, width, height);
        }
    }
}
```

**UI選択制御**:

```javascript
initGradientSelection() {
    const gradientOptions = document.querySelectorAll('.gradient-option');
    
    // 各グラデーションオプションにクリックイベント
    gradientOptions.forEach(option => {
        option.addEventListener('click', () => {
            // 全選択解除 → 新規選択 → 再生成
            gradientOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            this.selectedGradient = option.dataset.gradient;
            
            if (document.getElementById('text-input').value.trim()) {
                this.generatePixelArt();
            }
        });
    });
}
```

### 6. トグルボタンコンポーネント

グリッド線表示切り替え用のカスタムトグルボタン

**CSS実装**:

```css
/* カスタムトグルボタン */
.toggle {
    position: relative;
    width: 80px;
    height: 36px;
    border: 2px solid #e1e5e9;
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
    background: white;
    transition: all 0.3s ease;
}

.toggle:hover {
    border-color: #8b5cf6;
}

.toggle.checked {
    border-color: #8b5cf6;
    background: #f7fafc;
}

.toggle input[type=checkbox] {
    display: none;
}

.toggle:after {
    content: "非表示";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 36px;
    height: 28px;
    display: block;
    border-radius: 4px;
    background: #f7fafc;
    border: 1px solid #e1e5e9;
    transition: all 0.3s ease;
    text-align: center;
    padding: 6px 0 0;
    line-height: 1;
    font-size: 10px;
    font-weight: 500;
    color: #4a5568;
    letter-spacing: .5px;
    box-sizing: border-box;
}

.toggle.checked:after {
    content: "表示";
    left: 38px;
    background: #8b5cf6;
    border-color: #8b5cf6;
    color: white;
}
```

### 7. デュアルフォント読み込みシステム

フォント変更時のちらつき防止とスムーズな描画更新

**JavaScript実装**:

```javascript
// フォント変更時の二段階生成処理
fontFamilySelect.addEventListener('change', async (e) => {
    const newFontFamily = e.target.value;
    
    if (document.getElementById('text-input').value.trim()) {
        this.fontFamily = newFontFamily;
        
        // 1回目：非表示で生成（フォント読み込み）
        await this.generatePixelArt(false);
        
        // 2回目：表示で生成（200ms後に確実な適用）
        setTimeout(async () => {
            await this.generatePixelArt(true);
        }, 200);
    } else {
        this.fontFamily = newFontFamily;
    }
});
```

## 対応フォント一覧

### ゴシック体系（16種）
- Noto Sans JP / M PLUS Rounded 1c / M PLUS 1p / M PLUS 2
- Kosugi / Kosugi Maru / Sawarabi Gothic / Dela Gothic One
- Zen Maru Gothic / Zen Kaku Gothic New / Murecho
- BIZ UDPGothic / BIZ UDGothic / DotGothic16

### 明朝体系（7種）
- Noto Serif JP / Sawarabi Mincho / Zen Old Mincho
- BIZ UDPMincho / BIZ UDMincho
- Shippori Mincho / Shippori Mincho B1

### デザイン・装飾系（15種）
- Hachi Maru Pop / Rampart One / Mochiy Pop P One / Mochiy Pop One
- Train One / Reggae One / Rocknroll One / Stick
- New Tegomin / Yusei Magic / Zen Antique / Zen Antique Soft
- Palette Mosaic / WDXL Lubrifont JP N

### 書道・筆文字系（8種）
- Kaisei Decol / Kaisei Opti / Kaisei HarunoUmi / Kaisei Tokumin
- Kiwi Maru / Klee One / Shippori Antique / Shippori Antique B1

### 変体仮名系（5種）
- Yuji Syuku / Yuji Boku / Yuji Mai
- Yuji Hentaigana Akari / Yuji Hentaigana Akebono

## ピクセルアートの特徴

### レトロゲーム風の仕上がり
- 8-bit/16-bitゲーム時代を彷彿とさせるドット絵テキスト
- ファミコン・ゲームボーイ世代に懐かしい表現
- モダンなWebブラウザで楽しめるレトロ体験

### 芸術的表現の可能性
- 日本語フォントの美しさをピクセルアートで表現
- 筆文字・書道フォントでの和風ピクセルアート
- ポップフォントでのカラフルな作品

### SNS・配信での活用
- プロフィール画像やアイコン作成
- ゲーム配信での装飾素材
- SNS投稿用のユニークなテキストアート

## カスタマイズ例

### ネオングラデーション
- **フォント**: DotGothic16
- **背景色**: 黒 (#000000)
- **グラデーション**: ネオン（グリーン→シアン）
- **用途**: サイバーパンク・ゲーミング風デザイン

### サンセットアート
- **フォント**: Hachi Maru Pop
- **背景色**: 深い紫 (#2d1b69)
- **グラデーション**: サンセット（オレンジ→ピンク）
- **用途**: 夕焼け風の温かみのあるデザイン

### 和風モダン
- **フォント**: Zen Old Mincho
- **背景色**: 和紙色 (#f5f5dc)
- **文字色**: 墨色 (#2f4f4f)
- **用途**: 日本的な美しさを表現

### レインボーポップ
- **フォント**: Rampart One
- **背景色**: 白 (#ffffff)
- **グラデーション**: レインボー（6色虹グラデーション）
- **用途**: 可愛らしい・楽しいデザイン

### ゴールドラグジュアリー
- **フォント**: Kaisei Decol
- **背景色**: 深い青 (#1a1a2e)
- **グラデーション**: ゴールド（金色→明るいオレンジ）
- **用途**: 高級感・豪華なデザイン

### ファイアーエフェクト
- **フォント**: Train One
- **背景色**: 黒 (#000000)
- **グラデーション**: ファイア（赤→オレンジ）
- **用途**: 力強い・情熱的なデザイン

### オーシャンブルー
- **フォント**: M PLUS Rounded 1c
- **背景色**: 深い青 (#0f3460)
- **グラデーション**: オーシャン（ブルー→シアン）
- **用途**: 日本的な美しさを表現

### ポップスタイル
- **フォント**: Hachi Maru Pop
- **背景色**: パステルピンク (#ffc0cb)
- **文字色**: 濃いピンク (#ff1493)
- **用途**: 可愛らしい・親しみやすいデザイン

### レトロゲーム
- **フォント**: BIZ UDPGothic
- **背景色**: ダークグリーン (#006400)
- **文字色**: 白 (#ffffff)
- **用途**: クラシックゲーム風の表現

## まとめ

このテキストピクセルアートツールは、単なる文字変換アプリを超えて、創作表現の新しい可能性を提供します。

**主な特徴**：
- **50種類以上のGoogle Fonts**: 日本語フォントの豊富なバリエーション
- **8種類のグラデーション**: プリセットで美しいカラーエフェクトを簡単適用
- **複数行テキスト対応**: 改行を含む自由なレイアウト
- **レスポンシブデザイン**: 全デバイス対応の快適な操作性

Google Fontsの豊富な日本語フォントリソースと美しいグラデーション機能を組み合わせることで、従来の英数字のみのピクセルアートツールでは実現できなかった、日本語特有の美しさと現代的な視覚表現をピクセルアートで実現できます。

サンセットからレインボーまで、8種類のグラデーションプリセットにより、単色では表現できない豊かな色彩のピクセルアート作品を手軽に創作できます。

レスポンシブデザインにより、デスクトップからスマートフォンまで、どんなデバイスでも快適に創作活動を楽しめる環境を整えました。

クリエイターの皆様が、このツールを使って色鮮やかで美しいピクセルアート作品を生み出していただければ幸いです。
