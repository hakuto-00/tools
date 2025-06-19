/**
 * 画像生成管理クラス
 */
class ImageGenerator {
  constructor(canvasRenderer) {
    this.canvasRenderer = canvasRenderer;
    this.generatedImages = [];
  }

  /**
   * フォームから設定値を取得
   * @returns {Object} 設定値オブジェクト
   */
  getSettings() {
    return {
      baseText: document.getElementById('baseTextInput').value,
      startNumber: parseInt(document.getElementById('startNumberInput').value) || 1,
      count: parseInt(document.getElementById('countInput').value) || 1,
      width: parseInt(document.getElementById('widthInput').value) || 150,
      height: parseInt(document.getElementById('heightInput').value) || 150,
      fontSize: parseInt(document.getElementById('fontSizeInput').value) || 48
    };
  }

  /**
   * 画像を一括生成
   */
  generateImages() {
    // 既存の画像をクリア
    this.clearImages();
    
    // 結果欄を表示
    const resultsSection = document.getElementById('results');
    resultsSection.classList.add('visible');
    
    const settings = this.getSettings();
    const container = document.getElementById('generatedImages');
    
    // 設定値の検証
    if (!this.validateSettings(settings)) {
      return;
    }
    
    // 大量生成時は段階的に生成（パフォーマンス対策）
    if (settings.count > 20) {
      this.generateImagesProgressively(settings, container);
    } else {
      this.generateImagesAtOnce(settings, container);
    }
    
    // ダウンロードボタンを有効化
    document.getElementById('downloadAllBtn').disabled = false;
  }

  /**
   * 段階的画像生成（大量生成用）
   */
  generateImagesProgressively(settings, container) {
    const batchSize = 10; // 一度に生成する枚数
    let currentIndex = 0;
    
    const generateBatch = () => {
      const remainingCount = settings.count - currentIndex;
      const currentBatchSize = Math.min(batchSize, remainingCount);
      
      for (let i = 0; i < currentBatchSize; i++) {
        const imageData = this.createImage(settings, currentIndex + i);
        this.generatedImages.push(imageData);
        container.appendChild(imageData.wrapper);
      }
      
      currentIndex += currentBatchSize;
      
      // まだ生成が必要な場合は次のバッチを予約
      if (currentIndex < settings.count) {
        // 短い遅延でUIの応答性を保つ
        setTimeout(generateBatch, 10);
      }
    };
    
    generateBatch();
  }

  /**
   * 一括画像生成（少量生成用）
   */
  generateImagesAtOnce(settings, container) {
    for (let i = 0; i < settings.count; i++) {
      const imageData = this.createImage(settings, i);
      this.generatedImages.push(imageData);
      container.appendChild(imageData.wrapper);
    }
  }

  /**
   * 設定値の検証
   * @param {Object} settings - 設定値
   * @returns {boolean} 有効かどうか
   */
  validateSettings(settings) {
    if (!settings.baseText.trim()) {
      alert('テキストを入力してください。');
      return false;
    }
    
    if (settings.count > 300) {
      alert('画像枚数は300枚以下にしてください。');
      return false;
    }
    
    // 大量生成時の警告
    if (settings.count > 50) {
      const proceed = confirm(
        `${settings.count}枚の画像を生成します。\n` +
        '大量生成はブラウザの動作が重くなる可能性があります。\n' +
        '続行しますか？'
      );
      if (!proceed) {
        return false;
      }
    }
    
    if (settings.width < 16 || settings.width > 2000) {
      alert('幅は16px～2000pxの範囲で入力してください。');
      return false;
    }
    
    if (settings.height < 16 || settings.height > 2000) {
      alert('高さは16px～2000pxの範囲で入力してください。');
      return false;
    }
    
    return true;
  }

  /**
   * 単一画像を作成
   * @param {Object} settings - 設定値
   * @param {number} index - インデックス
   * @returns {Object} 画像データオブジェクト
   */
  createImage(settings, index) {
    const num = settings.startNumber + index;
    const text = settings.baseText + num;
    
    // DOM要素の作成
    const wrapper = document.createElement('div');
    wrapper.className = 'image-container';
    
    // テキスト編集用Input
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control mb-2';
    input.value = text;
    
    // Canvas作成
    const canvas = document.createElement('canvas');
    canvas.width = settings.width;
    canvas.height = settings.height;
    
    // ダウンロードリンク
    const link = document.createElement('a');
    link.textContent = 'ダウンロード';
    link.href = '#';
    link.download = text + '.png';
    
    // DOM構築
    wrapper.appendChild(input);
    wrapper.appendChild(canvas);
    wrapper.appendChild(link);
    
    // 初期描画
    this.canvasRenderer.drawCanvas(canvas, text);
    link.href = this.canvasRenderer.getDataURL(canvas);
    
    // イベントリスナー設定
    const imageData = {
      wrapper,
      input,
      canvas,
      link,
      filename: text + '.png'
    };
    
    this.setupImageEvents(imageData);
    
    return imageData;
  }

  /**
   * 画像のイベントリスナーを設定
   * @param {Object} imageData - 画像データオブジェクト
   */
  setupImageEvents(imageData) {
    imageData.input.addEventListener('input', () => {
      const newText = imageData.input.value;
      const newFilename = newText + '.png';
      
      // Canvas再描画
      this.canvasRenderer.drawCanvas(imageData.canvas, newText);
      
      // リンク更新
      imageData.link.href = this.canvasRenderer.getDataURL(imageData.canvas);
      imageData.link.download = newFilename;
      imageData.filename = newFilename;
    });
  }

  /**
   * 生成された画像をクリア
   */
  clearImages() {
    this.generatedImages = [];
    const container = document.getElementById('generatedImages');
    container.innerHTML = '';
    document.getElementById('downloadAllBtn').disabled = true;
  }

  /**
   * 生成された画像データを取得
   * @returns {Array} 画像データ配列
   */
  getGeneratedImages() {
    return this.generatedImages.map(imageData => ({
      filename: imageData.filename,
      data: this.canvasRenderer.getDataURL(imageData.canvas)
    }));
  }
}
