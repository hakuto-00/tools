/**
 * カラーピッカーの管理クラス
 */
class ColorPicker {
  constructor() {
    this.initializeColorPickers();
  }

  /**
   * カラーピッカーの初期化
   */
  initializeColorPickers() {
    // 背景色の同期
    const bgColorPicker = document.getElementById('bgColorPicker');
    const bgColorText = document.getElementById('bgColorText');
    
    bgColorPicker.addEventListener('input', () => {
      bgColorText.value = bgColorPicker.value;
    });
    
    bgColorText.addEventListener('input', () => {
      if (this.isValidHexColor(bgColorText.value)) {
        bgColorPicker.value = bgColorText.value;
      }
    });

    // 文字色の同期
    const textColorPicker = document.getElementById('textColorPicker');
    const textColorText = document.getElementById('textColorText');
    
    textColorPicker.addEventListener('input', () => {
      textColorText.value = textColorPicker.value;
    });
    
    textColorText.addEventListener('input', () => {
      if (this.isValidHexColor(textColorText.value)) {
        textColorPicker.value = textColorText.value;
      }
    });
  }

  /**
   * 有効なHEX色コードかチェック
   * @param {string} color - チェックする色コード
   * @returns {boolean} 有効かどうか
   */
  isValidHexColor(color) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  }

  /**
   * 背景色を取得
   * @returns {string} 背景色
   */
  getBackgroundColor() {
    return document.getElementById('bgColorPicker').value;
  }

  /**
   * 文字色を取得
   * @returns {string} 文字色
   */
  getTextColor() {
    return document.getElementById('textColorPicker').value;
  }

  /**
   * 背景色を設定
   * @param {string} color - 背景色
   */
  setBackgroundColor(color) {
    document.getElementById('bgColorPicker').value = color;
    document.getElementById('bgColorText').value = color;
  }

  /**
   * 文字色を設定
   * @param {string} color - 文字色
   */
  setTextColor(color) {
    document.getElementById('textColorPicker').value = color;
    document.getElementById('textColorText').value = color;
  }
}
