/**
 * メインアプリケーション
 */
class BatchImageGeneratorApp {
  constructor() {
    this.colorPicker = new ColorPicker();
    this.canvasRenderer = new CanvasRenderer(this.colorPicker);
    this.imageGenerator = new ImageGenerator(this.canvasRenderer);
    this.downloadManager = new DownloadManager(this.imageGenerator);
    
    this.initializeEventListeners();
    this.initializePresets();
  }

  /**
   * イベントリスナーの初期化
   */
  initializeEventListeners() {
    // 画像生成ボタン
    document.getElementById('generateBtn').addEventListener('click', () => {
      this.imageGenerator.generateImages();
    });

    // 一括ダウンロードボタン
    document.getElementById('downloadAllBtn').addEventListener('click', () => {
      this.downloadManager.downloadAllImages();
    });

    // Enterキーで画像生成
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && event.target.tagName !== 'BUTTON') {
        this.imageGenerator.generateImages();
      }
    });

    // 入力値の変更時にリアルタイムプレビュー（オプション）
    this.setupRealtimePreview();
  }

  /**
   * リアルタイムプレビューの設定
   */
  setupRealtimePreview() {
    const inputs = [
      'fontSizeInput',
      'textColorPicker',
      'bgColorPicker'
    ];

    inputs.forEach(inputId => {
      const input = document.getElementById(inputId);
      if (input) {
        input.addEventListener('input', () => {
          this.updateExistingImages();
        });
      }
    });
  }

  /**
   * 既存画像の更新
   */
  updateExistingImages() {
    if (this.imageGenerator.generatedImages.length === 0) return;

    this.imageGenerator.generatedImages.forEach(imageData => {
      this.canvasRenderer.drawCanvas(imageData.canvas, imageData.input.value);
      imageData.link.href = this.canvasRenderer.getDataURL(imageData.canvas);
    });
  }

  /**
   * プリセット機能の初期化
   */
  initializePresets() {
    // サイズプリセット
    document.getElementById('sizePresetSelect').addEventListener('change', (event) => {
      const preset = event.target.value;
      if (preset !== 'custom') {
        const [width, height] = preset.split('x').map(Number);
        document.getElementById('widthInput').value = width;
        document.getElementById('heightInput').value = height;
        this.updateExistingImages();
      }
    });

    // 色プリセット
    document.getElementById('colorPresetSelect').addEventListener('change', (event) => {
      const preset = event.target.value;
      const presets = {
        'white-black': { bg: '#ffffff', text: '#000000' },
        'black-white': { bg: '#000000', text: '#ffffff' },
        'gray-black': { bg: '#f0f0f0', text: '#000000' },
        'dark-gray-white': { bg: '#555555', text: '#ffffff' },
        'blue-white': { bg: '#3e4970', text: '#ffffff' },
        'red-white': { bg: '#703e49', text: '#ffffff' },
        'green-white': { bg: '#3e7049', text: '#ffffff' }
      };

      if (presets[preset]) {
        const { bg, text } = presets[preset];
        this.colorPicker.setBackgroundColor(bg);
        this.colorPicker.setTextColor(text);
        this.updateExistingImages();
      }
    });
  }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
  const app = new BatchImageGeneratorApp();
  
  // デフォルトで青背景プリセットを適用
  const colorPresetSelect = document.getElementById('colorPresetSelect');
  const changeEvent = new Event('change');
  colorPresetSelect.dispatchEvent(changeEvent);
});
