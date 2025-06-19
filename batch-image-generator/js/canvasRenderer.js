/**
 * Canvas描画管理クラス
 */
class CanvasRenderer {
  constructor(colorPicker) {
    this.colorPicker = colorPicker;
  }

  /**
   * Canvasにテキストを描画
   * @param {HTMLCanvasElement} canvas - 描画対象のCanvas
   * @param {string} text - 描画するテキスト
   */
  drawCanvas(canvas, text) {
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    // 背景クリア
    ctx.clearRect(0, 0, width, height);
    
    // 透明背景でない場合のみ背景を塗りつぶし
    const bgColor = this.colorPicker.getBackgroundColor();
    if (bgColor !== 'transparent') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
    }
    
    // 文字設定
    ctx.fillStyle = this.colorPicker.getTextColor();
    const fontSize = parseInt(document.getElementById('fontSizeInput').value);
    ctx.font = `${fontSize}px Arial, 'Noto Sans JP', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // テキスト折返し処理
    const lines = this.wrapText(ctx, text, width * 0.9);
    const lineHeight = fontSize * 1.2;
    
    // 中央揃えで描画
    const startY = (height - lines.length * lineHeight) / 2 + lineHeight / 2;
    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight);
    });
  }

  /**
   * テキストを指定幅で折り返し
   * @param {CanvasRenderingContext2D} ctx - Canvas描画コンテキスト
   * @param {string} text - 折り返し対象のテキスト
   * @param {number} maxWidth - 最大幅
   * @returns {string[]} 折り返されたテキストの配列
   */
  wrapText(ctx, text, maxWidth) {
    const lines = [];
    let line = '';
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const testLine = line + char;
      
      if (ctx.measureText(testLine).width > maxWidth && line.length > 0) {
        lines.push(line);
        line = char;
      } else {
        line = testLine;
      }
    }
    
    if (line) {
      lines.push(line);
    }
    
    return lines;
  }

  /**
   * CanvasからDataURLを取得
   * @param {HTMLCanvasElement} canvas - 対象のCanvas
   * @returns {string} DataURL
   */
  getDataURL(canvas) {
    return canvas.toDataURL('image/png');
  }
}
