/**
 * テキストピクセルアートジェネレーター
 * Google Fonts対応でテキストをピクセルアート化
 */
class TextPixelArt {
    constructor() {
        this.canvas = document.getElementById('pixel-canvas');
        if (!this.canvas) {
            console.error('Canvas element not found!');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Canvas context not available!');
            return;
        }
        
        // ピクセルアート用の設定
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
        
        this.pixelSize = 50;
        this.textColor = '#000000';
        this.bgColor = '#ffffff';
        this.fontStyle = 'normal';
        this.fontFamily = 'Noto Sans JP';
        this.textAlign = 'center';
        this.showGrid = true;
        this.selectedGradient = 'red';
        this.gradientAngle = 45;
        this.useGradient = false;
        
        // グラデーション定義（基本色とカラフルに分類）
        this.gradients = {
            // 基本色（HSL基準グラデーション）20種類 - H値0-331度を等間隔
            'red': ['hsl(0, 35%, 95%)', 'hsl(0, 95%, 50%)'], // 赤系
            'orange-red': ['hsl(17, 35%, 95%)', 'hsl(17, 95%, 50%)'], // オレンジ赤系
            'orange': ['hsl(35, 35%, 95%)', 'hsl(35, 95%, 50%)'], // オレンジ系
            'amber': ['hsl(52, 35%, 95%)', 'hsl(52, 95%, 50%)'], // アンバー系
            'yellow': ['hsl(70, 35%, 95%)', 'hsl(70, 95%, 50%)'], // 黄色系
            'lime': ['hsl(87, 35%, 95%)', 'hsl(87, 95%, 50%)'], // ライム系
            'green': ['hsl(105, 35%, 95%)', 'hsl(105, 95%, 50%)'], // 緑系
            'emerald': ['hsl(122, 35%, 95%)', 'hsl(122, 95%, 50%)'], // エメラルド系
            'teal': ['hsl(140, 35%, 95%)', 'hsl(140, 95%, 50%)'], // ティール系
            'cyan': ['hsl(157, 35%, 95%)', 'hsl(157, 95%, 50%)'], // シアン系
            'sky': ['hsl(175, 35%, 95%)', 'hsl(175, 95%, 50%)'], // スカイ系
            'blue': ['hsl(192, 35%, 95%)', 'hsl(192, 95%, 50%)'], // ブルー系
            'indigo': ['hsl(210, 35%, 95%)', 'hsl(210, 95%, 50%)'], // インディゴ系
            'violet': ['hsl(227, 35%, 95%)', 'hsl(227, 95%, 50%)'], // バイオレット系
            'purple': ['hsl(245, 35%, 95%)', 'hsl(245, 95%, 50%)'], // パープル系
            'fuchsia': ['hsl(262, 35%, 95%)', 'hsl(262, 95%, 50%)'], // フューシャ系
            'magenta': ['hsl(280, 35%, 95%)', 'hsl(280, 95%, 50%)'], // マゼンタ系
            'pink': ['hsl(297, 35%, 95%)', 'hsl(297, 95%, 50%)'], // ピンク系
            'rose': ['hsl(315, 35%, 95%)', 'hsl(315, 95%, 50%)'], // ローズ系
            'crimson': ['hsl(331, 35%, 95%)', 'hsl(331, 95%, 50%)'], // クリムゾン系

            // カラフル（複雑なグラデーション）20種類
            'rainbow': ['#ff0000', '#ff8c00', '#ffd700', '#32cd32', '#00bfff', '#8a2be2'],
            'galaxy': ['#2c3e50', '#8e44ad', '#e74c3c'],
            'autumn': ['#ff8c00', '#ff4500', '#dc143c'],
            'cyber': ['#00ffff', '#ff00ff'],
            'cosmic': ['rgba(80,12,139,0.87)', 'rgba(161,10,144,0.72)'],
            'dream': ['rgba(112,246,255,0.33)', 'rgba(221,108,241,0.26)', 'rgba(229,106,253,0.71)', 'rgba(123,183,253,1)'],
            'soft': ['rgba(254,253,205,1)', 'rgba(163,230,255,1)'],
            'deep': ['rgba(2,37,78,1)', 'rgba(4,56,126,1)', 'rgba(85,245,221,1)'],
            'aqua': ['rgba(37,249,245,1)', 'rgba(8,70,218,1)'],
            'passion': ['rgba(252,37,103,1)', 'rgba(250,38,151,1)', 'rgba(186,8,181,1)'],
            'spring': ['rgba(249,255,182,1)', 'rgba(226,255,172,1)'],
            'sky-peach': ['rgba(135,206,235,1)', 'rgba(255,154,139,1)', 'rgba(255,195,160,1)', 'rgba(255,215,0,1)'],
            'prism': ['rgba(255,0,128,1)', 'rgba(255,140,0,1)', 'rgba(64,224,208,1)', 'rgba(147,112,219,1)'],
            'sunset': ['rgba(255,254,171,1)','rgba(252, 163, 111,1)','rgba(255,64,175,1)'],
            'bubble': ['rgba(242,250,124,1)', 'rgba(252,128,132,0.96)', 'rgba(243,121,180,1)', 'rgba(240,193,248,1)'],
            'ocean-deep': ['rgba(83,113,245,1)', 'rgba(107,228,184,1)'],
            'sunset-dream': ['rgba(254,122,152,0.81)', 'rgba(255,206,134,1)', 'rgba(172,253,163,0.64)'],
            'fairy-tale': ['rgba(255,253,218,1)', 'rgba(246,210,255,1)', 'rgba(152,222,254,1)', 'rgba(251,255,210,1)'],
            'neon-wave': ['rgba(247,253,166,1)', 'rgba(128,255,221,1)', 'rgba(255,128,249,1)'],
            'golden-peach': ['rgba(255,220,163,1)', 'rgba(129,255,239,1)']
        };
        
        // グラデーションカテゴリ
        this.gradientCategories = {
            basic: ['red', 'orange-red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'magenta', 'pink', 'rose', 'crimson'],
            colorful: ['rainbow', 'galaxy', 'autumn', 'cyber', 'cosmic', 'dream', 'soft', 'deep', 'aqua', 'passion', 'spring', 'sky-peach', 'prism', 'sunset', 'bubble', 'ocean-deep', 'sunset-dream', 'fairy-tale', 'neon-wave', 'golden-peach']
        };
        
        // メモリ管理設定
        this.maxPixelSize = 300;
        this.tempCanvases = [];
        this.inputTimeout = null;
        
        // 表示制御フラグ
        this.shouldDisplayResult = true;
        this.pendingImageData = null;
        
        this.initEventListeners();
        this.initResponsiveCanvas();
    }
    
    /**
     * レスポンシブキャンバスの初期化
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
            
            // キャンバスのCSSサイズを更新
            this.canvas.style.width = canvasSize + 'px';
            this.canvas.style.height = canvasSize + 'px';
        };
        
        // 初期化時に設定
        updateCanvasSize();
        
        // ウィンドウリサイズ時に更新
        window.addEventListener('resize', updateCanvasSize);
    }
    
    /**
     * イベントリスナーの初期化
     */
    initEventListeners() {
        const textInput = document.getElementById('text-input');
        const generateBtn = document.getElementById('generate-btn');
        const downloadBtn = document.getElementById('download-btn');
        const textColorPicker = document.getElementById('text-color');
        const bgColorPicker = document.getElementById('bg-color');
        const pixelSizeInput = document.getElementById('pixel-size');
        const fontStyleSelect = document.getElementById('font-style');
        const fontFamilySelect = document.getElementById('font-family');
        const textAlignBtns = document.querySelectorAll('.align-btn');
        const showGridBtn = document.getElementById('show-grid');
        const exampleBtns = document.querySelectorAll('.example-btn');
        const gradientCheckbox = document.getElementById('use-gradient');
        const gradientPanel = document.getElementById('gradient-panel');
        const gradientAngleSelect = document.getElementById('gradient-angle');
        const gradientOptions = document.querySelectorAll('.gradient-option');
        const singleColorPicker = document.getElementById('text-color');
        
        // タブ機能の初期化（最初に実行）
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.gradient-tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // 全てのタブボタンとコンテンツから active クラスを削除
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // クリックされたタブとコンテンツに active クラスを追加
                button.classList.add('active');
                document.getElementById(`${tabId}-gradients`).classList.add('active');
                
                // タブ切り替え後にグラデーション選択を再初期化
                setTimeout(() => {
                    this.initGradientSelection();
                }, 50);
            });
        });
        
        // グラデーション選択の初期化（タブ初期化後）
        this.initGradientSelection();
        
        // グラデーションチェックボックスのイベント
        if (gradientCheckbox) {
            gradientCheckbox.addEventListener('change', (e) => {
                this.useGradient = e.target.checked;
                if (gradientPanel) {
                    gradientPanel.classList.toggle('expanded', this.useGradient);
                }
                
                // 単色カラーピッカーの表示制御
                if (singleColorPicker) {
                    singleColorPicker.classList.toggle('hidden', this.useGradient);
                }
                
                // テキストが入力されている場合は再生成
                if (textInput && textInput.value.trim()) {
                    this.generatePixelArt();
                }
            });
        }
        
        // グラデーション角度選択のイベント
        if (gradientAngleSelect) {
            gradientAngleSelect.addEventListener('change', (e) => {
                this.gradientAngle = parseInt(e.target.value);
                
                // グラデーションが有効で、テキストが入力されている場合は再生成
                if (this.useGradient && textInput && textInput.value.trim()) {
                    this.generatePixelArt();
                }
            });
        }
        
        // テキスト入力時の自動生成
        textInput.addEventListener('input', (e) => {
            // テキストが空の場合はキャンバスをクリア
            if (!e.target.value.trim()) {
                this.clearCanvas();
            } else {
                this.generatePixelArt();
            }
        });
        
        // Enterキーでの生成
        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && textInput.value.trim()) {
                this.generatePixelArt();
            }
        });
        
        // 生成ボタン
        generateBtn.addEventListener('click', () => {
            this.generatePixelArt();
            
            // モバイル時（768px以下）の場合、キャンバスセクションまでスクロール
            if (window.innerWidth <= 768) {
                const canvasSection = document.querySelector('.canvas-section');
                if (canvasSection) {
                    canvasSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
        
        // ダウンロードボタン
        downloadBtn.addEventListener('click', () => {
            this.downloadPixelArt();
        });
        
        // カラーピッカー
        textColorPicker.addEventListener('change', (e) => {
            this.textColor = e.target.value;
            if (document.getElementById('text-input').value.trim()) {
                this.generatePixelArt();
            }
        });
        
        bgColorPicker.addEventListener('change', (e) => {
            this.bgColor = e.target.value;
            if (document.getElementById('text-input').value.trim()) {
                this.generatePixelArt();
            }
        });
        
        // ピクセルサイズ入力
        pixelSizeInput.addEventListener('change', (e) => {
            const newPixelSize = parseInt(e.target.value);
            
            // 最小値チェック
            if (newPixelSize < 1 || isNaN(newPixelSize)) {
                e.target.value = 1;
                this.pixelSize = 1;
            }
            // 最大値チェック
            else if (newPixelSize > this.maxPixelSize) {
                e.target.value = this.maxPixelSize;
                this.pixelSize = this.maxPixelSize;
            } else {
                this.pixelSize = newPixelSize;
            }
            
            // メモリクリーンアップ
            this.cleanupTempCanvases();
            
            if (document.getElementById('text-input').value.trim()) {
                this.generatePixelArt();
            }
        });
        
        // デバウンス付きのinputイベント（リアルタイム反応用）
        pixelSizeInput.addEventListener('input', (e) => {
            // 前のタイマーをクリア
            if (this.inputTimeout) {
                clearTimeout(this.inputTimeout);
            }
            
            // 500ms後に処理を実行
            this.inputTimeout = setTimeout(() => {
                const newPixelSize = parseInt(e.target.value);
                
                // 有効な値の場合のみ処理
                if (!isNaN(newPixelSize) && newPixelSize >= 1 && newPixelSize <= this.maxPixelSize) {
                    this.pixelSize = newPixelSize;
                    
                    if (document.getElementById('text-input').value.trim()) {
                        this.generatePixelArt();
                    }
                }
            }, 500);
        });
        
        // フォントスタイル選択
        fontStyleSelect.addEventListener('change', async (e) => {
            const newFontStyle = e.target.value;
            
            if (document.getElementById('text-input').value.trim()) {
                this.fontStyle = newFontStyle;
                
                // 1回目：非表示で生成（フォント読み込み）
                await this.generatePixelArt(false);
                
                // 2回目：表示で生成（時間差をつけて確実なフォント適用）
                setTimeout(async () => {
                    await this.generatePixelArt(true);
                }, 200);
            } else {
                this.fontStyle = newFontStyle;
            }
        });
        
        // フォントファミリー選択
        fontFamilySelect.addEventListener('change', async (e) => {
            const newFontFamily = e.target.value;
            
            if (document.getElementById('text-input').value.trim()) {
                this.fontFamily = newFontFamily;
                
                // 1回目：非表示で生成（フォント読み込み）
                await this.generatePixelArt(false);
                
                // 2回目：表示で生成（時間差をつけて確実なフォント適用）
                setTimeout(async () => {
                    await this.generatePixelArt(true);
                }, 200);
            } else {
                this.fontFamily = newFontFamily;
            }
        });
        
        // テキスト配置ボタン
        textAlignBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // アクティブ状態を切り替え
                textAlignBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // 配置設定を更新
                this.textAlign = btn.dataset.align;
                
                if (document.getElementById('text-input').value.trim()) {
                    this.generatePixelArt();
                }
            });
        });
        
        // サンプルボタン（改行対応）
        exampleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.dataset.text;
                // HTMLエンティティの改行文字を実際の改行文字に変換
                const decodedText = text.replace(/&#10;/g, '\n');
                textInput.value = decodedText;
                this.generatePixelArt();
            });
        });
        
        // グリッド線表示切り替え（トグルボタン）
        const toggleElement = showGridBtn.parentElement;
        
        // チェックボックスの変更イベント
        showGridBtn.addEventListener('change', () => {
            this.showGrid = showGridBtn.checked;
            
            // トグルボタンの外観を更新
            if (this.showGrid) {
                toggleElement.classList.add('checked');
            } else {
                toggleElement.classList.remove('checked');
            }
            
            if (document.getElementById('text-input').value.trim()) {
                this.generatePixelArt();
            } else {
                this.clearCanvas();
            }
        });
        
        // トグルボタン全体をクリック可能にする
        toggleElement.addEventListener('click', () => {
            showGridBtn.checked = !showGridBtn.checked;
            showGridBtn.dispatchEvent(new Event('change'));
        });
    }
    
    /**
     * ピクセルアート生成メイン処理
     * @param {boolean} displayResult - 結果をキャンバスに表示するかどうか（デフォルト: true）
     */
    async generatePixelArt(displayResult = true) {
        const text = document.getElementById('text-input').value.trim();
        if (!text) return;
        
        // ピクセルサイズの検証
        if (this.pixelSize <= 0 || !isFinite(this.pixelSize)) {
            this.pixelSize = 50;
            document.getElementById('pixel-size').value = 50;
        }

        // 表示制御フラグを設定
        this.shouldDisplayResult = displayResult;

        // 通常フォントでテキストを描画してピクセル化
        this.generatePixelArtFromFont(text);

        // ダウンロードボタンを有効化
        document.getElementById('download-btn').disabled = false;
    }
    
    /**
     * 通常フォントからピクセルアートを生成
     * @param {string} text - 描画するテキスト
     */
    generatePixelArtFromFont(text) {
        // メモリクリーンアップ
        this.cleanupTempCanvases();
        
        // 一時的なキャンバスを作成してフォントで文字を描画
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        // 一時キャンバスを管理配列に追加
        this.tempCanvases.push(tempCanvas);
        
        // フォント設定（漢字対応のためより大きく）
        const fontSize = Math.max(64, this.pixelSize * 8);
        const fontWeight = this.fontStyle;
        const fontString = `${fontWeight} ${fontSize}px "${this.fontFamily}", sans-serif`;
        
        tempCtx.font = fontString;
        tempCtx.textAlign = 'left'; // 幅測定時も左寄せに統一
        tempCtx.textBaseline = 'middle';
        
        // アンチエイリアスを無効にしてくっきりとした文字にする
        tempCtx.imageSmoothingEnabled = false;
        
        // 複数行テキストの処理
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        if (lines.length === 0) return;
        
        // 各行のサイズを測定して全体のサイズを計算
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
        
        const lineHeight = fontSize * 1.2; // 行間を考慮
        const totalHeight = lines.length * lineHeight;
        
        // 一時キャンバスのサイズ設定（上下左右の余白を均等に）
        const padding = Math.floor(fontSize * 0.3);
        tempCanvas.width = maxWidth + padding * 2;
        tempCanvas.height = totalHeight + padding * 2;
        
        // 背景を白で塗りつぶし
        tempCtx.fillStyle = '#FFFFFF';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // フォント設定を再適用（キャンバスサイズ変更後）
        tempCtx.font = fontString;
        tempCtx.textAlign = 'left'; // 常に左寄せに固定してX座標で制御
        tempCtx.textBaseline = 'middle';
        tempCtx.imageSmoothingEnabled = false;
        
        // 各行を描画（配置に応じてX座標を調整）
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
                    x = padding + (maxWidth - lineWidth) / 2; // デフォルトは中央寄せ
            }
            
            tempCtx.fillText(line, x, y);
        });
        
        // 画像データを取得
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        
        // ピクセル化処理
        this.pixelizeImage(imageData, tempCanvas.width, tempCanvas.height);
        
        // 使用後すぐにクリーンアップ
        setTimeout(() => this.cleanupTempCanvases(), 100);
    }
    
    /**
     * 画像データをピクセル化してメインキャンバスに描画
     * @param {ImageData} imageData - 元の画像データ
     * @param {number} width - 元の幅
     * @param {number} height - 元の高さ
     */
    pixelizeImage(imageData, width, height) {
        const data = imageData.data;
        
        // キャンバスサイズを600x600に固定
        const canvasSize = 600;
        
        // グリッドサイズ = マス目の数
        const gridSize = this.pixelSize;
        
        // 安全性チェック：グリッドサイズが0以下の場合は処理を中止
        if (gridSize <= 0 || !isFinite(gridSize)) {
            console.error('Invalid grid size:', gridSize);
            return;
        }
        
        // 各マスのサイズ
        const cellSize = canvasSize / gridSize;
        
        // セルサイズが0以下の場合も処理を中止
        if (cellSize <= 0 || !isFinite(cellSize)) {
            console.error('Invalid cell size:', cellSize);
            return;
        }
        
        // ピクセル化データを準備（実際の描画とは分離）
        const pixelData = this.generatePixelData(data, width, height, gridSize);
        
        // フラグに応じて表示制御
        if (this.shouldDisplayResult) {
            this.renderToCanvas(pixelData, canvasSize, gridSize, cellSize);
        } else {
            // 表示しない場合は、データを保存しておく
            this.pendingImageData = { pixelData, canvasSize, gridSize, cellSize };
        }
    }
    
    /**
     * ピクセルデータを生成（描画とは分離）
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
                
                // 黒ピクセルの密度が一定以上なら描画対象
                if (totalPixels > 0 && (blackPixels / totalPixels) > 0.2) {
                    pixelData.push({ px, py });
                }
            }
        }
        
        return pixelData;
    }
    
    /**
     * ピクセルデータをキャンバスにレンダリング
     */
    renderToCanvas(pixelData, canvasSize, gridSize, cellSize) {
        // メインキャンバスのサイズを600x600に固定
        this.canvas.width = canvasSize;
        this.canvas.height = canvasSize;
        
        // 高DPI対応のための設定
        this.canvas.style.width = canvasSize + 'px';
        this.canvas.style.height = canvasSize + 'px';
        
        // キャンバスコンテキストの設定を再適用
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
        
        // 背景塗りつぶし
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, canvasSize, canvasSize);
        
        // グラデーションが有効な場合は全体用のグラデーションを作成
        if (this.useGradient) {
            this.setupGradient(canvasSize);
        } else {
            this.ctx.fillStyle = this.textColor;
        }
        
        // ピクセルデータを描画
        pixelData.forEach(({ px, py }) => {
            const drawX = px * cellSize;
            const drawY = py * cellSize;
            this.ctx.fillRect(drawX, drawY, cellSize, cellSize);
        });
        
        // グリッド線を描画（設定に応じて）
        if (this.showGrid) {
            this.drawGrid(gridSize, cellSize);
        }
    }
    
    /**
     * グラデーションを設定
     * @param {number} canvasSize - キャンバスサイズ
     */
    setupGradient(canvasSize) {
        const gradientColors = this.gradients[this.selectedGradient];
        if (!gradientColors) {
            this.ctx.fillStyle = this.textColor;
            return;
        }
        
        // 複雑なグラデーション（rgba形式）の場合は簡略化して線形グラデーションとして扱う
        let colors = gradientColors;
        if (typeof gradientColors[0] === 'string' && gradientColors[0].includes('rgba')) {
            // rgba形式の色を簡略化
            colors = gradientColors.map(color => {
                if (color.includes('rgba')) {
                    // rgba値から基本的な色を抽出（簡略化）
                    const rgbaMatch = color.match(/rgba\((\d+),(\d+),(\d+),[\d.]+\)/);
                    if (rgbaMatch) {
                        const [, r, g, b] = rgbaMatch;
                        return `rgb(${r},${g},${b})`;
                    }
                }
                return color;
            });
        }
        
        // 角度に応じたグラデーション方向を計算
        const angleRad = (this.gradientAngle * Math.PI) / 180;
        
        // 角度に基づいた開始点と終点座標を計算
        let startX, startY, endX, endY;
        
        switch (this.gradientAngle) {
            case 0: // 0° →
                startX = 0; startY = canvasSize / 2;
                endX = canvasSize; endY = canvasSize / 2;
                break;
            case 45: // 45° ↗
                startX = 0; startY = canvasSize;
                endX = canvasSize; endY = 0;
                break;
            case 90: // 90° ↑
                startX = canvasSize / 2; startY = canvasSize;
                endX = canvasSize / 2; endY = 0;
                break;
            case 135: // 135° ↖
                startX = canvasSize; startY = canvasSize;
                endX = 0; endY = 0;
                break;
            case 180: // 180° ←
                startX = canvasSize; startY = canvasSize / 2;
                endX = 0; endY = canvasSize / 2;
                break;
            case 225: // 225° ↙
                startX = canvasSize; startY = 0;
                endX = 0; endY = canvasSize;
                break;
            case 270: // 270° ↓
                startX = canvasSize / 2; startY = 0;
                endX = canvasSize / 2; endY = canvasSize;
                break;
            case 315: // 315° ↘
                startX = 0; startY = 0;
                endX = canvasSize; endY = canvasSize;
                break;
            default:
                // フォールバック：従来の計算方法
                startX = 0; startY = 0;
                endX = Math.cos(angleRad) * canvasSize;
                endY = Math.sin(angleRad) * canvasSize;
        }
        
        const gradient = this.ctx.createLinearGradient(startX, startY, endX, endY);
        
        // グラデーションの色を設定
        if (colors.length === 2) {
            gradient.addColorStop(0, colors[0]);
            gradient.addColorStop(1, colors[1]);
        } else {
            // 3色以上の場合は均等に配置
            colors.forEach((color, index) => {
                gradient.addColorStop(index / (colors.length - 1), color);
            });
        }
        
        this.ctx.fillStyle = gradient;
    }
    
    /**
     * グリッド線を描画
     * @param {number} gridSize - グリッドのマス数
     * @param {number} cellSize - 各マスのサイズ
     */
    drawGrid(gridSize, cellSize) {
        const canvasSize = 600;
        
        // 薄いグレーのグリッド線
        this.ctx.strokeStyle = '#d0d0d0';
        this.ctx.lineWidth = 0.3;
        
        // 縦線を描画
        for (let i = 1; i < gridSize; i++) {
            const x = i * cellSize;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, canvasSize);
            this.ctx.stroke();
        }
        
        // 横線を描画
        for (let i = 1; i < gridSize; i++) {
            const y = i * cellSize;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(canvasSize, y);
            this.ctx.stroke();
        }
        
        // 外枠を描画
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, canvasSize, canvasSize);
    }
    
    /**
     * ピクセルアートダウンロード
     */
    downloadPixelArt() {
        const text = document.getElementById('text-input').value.trim();
        if (!text) return;
        
        // ファイル名生成（タイムスタンプのみ）
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `pixel-art-${timestamp}.png`;
        
        // ダウンロード実行
        this.canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
    
    /**
     * 一時キャンバスのクリーンアップ
     */
    cleanupTempCanvases() {
        // 一時キャンバスの参照を削除
        this.tempCanvases.forEach(canvas => {
            if (canvas && canvas.getContext) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
                canvas.width = 0;
                canvas.height = 0;
            }
        });
        
        this.tempCanvases = [];
        
        // ガベージコレクションを促す
        if (window.gc) {
            window.gc();
        }
    }
    
    /**
     * キャンバスをクリア（グリッドは表示）
     */
    clearCanvas() {
        // キャンバス全体をクリア
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 背景色で塗りつぶし
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // グリッドのみ表示（設定に応じて）
        const canvasSize = 600;
        const gridSize = this.pixelSize;
        const cellSize = canvasSize / gridSize;
        
        if (this.showGrid) {
            // グリッド線を描画（白い背景部分用のグリッド線）
            this.ctx.strokeStyle = '#d0d0d0';
            this.ctx.lineWidth = 0.3;
            
            // 縦線を描画
            for (let i = 1; i < gridSize; i++) {
                const x = i * cellSize;
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, canvasSize);
                this.ctx.stroke();
            }
            
            // 横線を描画
            for (let i = 1; i < gridSize; i++) {
                const y = i * cellSize;
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(canvasSize, y);
                this.ctx.stroke();
            }
            
            // 外枠を描画（グリッド表示時のみ）
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(0, 0, canvasSize, canvasSize);
        }
        
        // ダウンロードボタンを無効化
        document.getElementById('download-btn').disabled = true;
    }
    
    /**
     * グラデーション選択機能の初期化
     */
    initGradientSelection() {
        // 両方のタブから全てのグラデーションオプションを取得
        const gradientOptions = document.querySelectorAll('.gradient-option');
        
        // 既存のイベントリスナーをクリア（重複回避）
        gradientOptions.forEach(option => {
            const newOption = option.cloneNode(true);
            option.parentNode.replaceChild(newOption, option);
        });
        
        // 新しく取得したオプションにイベントリスナーを追加
        const newGradientOptions = document.querySelectorAll('.gradient-option');
        
        // 初期選択（red）をアクティブに設定
        const defaultOption = document.querySelector('.gradient-option[data-gradient="red"]');
        if (defaultOption) {
            defaultOption.classList.add('active');
            this.selectedGradient = 'red';
        }
        
        // 各グラデーションオプションにクリックイベントを追加
        newGradientOptions.forEach(option => {
            option.addEventListener('click', () => {
                // 全ての選択を解除
                newGradientOptions.forEach(opt => opt.classList.remove('active'));
                
                // クリックされたオプションをアクティブに設定
                option.classList.add('active');
                
                // 選択されたグラデーションを保存
                this.selectedGradient = option.dataset.gradient;
                
                // グラデーションが有効で、テキストが入力されている場合は再生成
                if (this.useGradient && document.getElementById('text-input').value.trim()) {
                    this.generatePixelArt();
                }
            });
        });
    }
    
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    const app = new TextPixelArt();
    
    // トグルボタンの初期状態を設定
    const showGridBtn = document.getElementById('show-grid');
    const toggleElement = showGridBtn.parentElement;
    if (showGridBtn.checked) {
        toggleElement.classList.add('checked');
    }
    
    // 初期テキストを設定して表示
    const textInput = document.getElementById('text-input');
    textInput.value = 'こんにちは\n世界';
    app.generatePixelArt();
    
    // フォント読み込み待機後に再描画
    setTimeout(() => {
        app.generatePixelArt();
    }, 100);
});
