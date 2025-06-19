# 画像一括生成ツール - Batch Image Generator

## 概要

テキストから画像を一括生成するWebツールです。指定したテキストを画像に描画し、連番やカスタム設定で複数の画像を効率的に作成できます。テスト用途、サンプル画像作成、プロトタイプ開発などの実用的なシーンで活用できます。

## 主要機能

### 基本機能
- **テキスト画像生成**: HTML5 Canvasを使用したベクターベースの高品質テキスト描画
- **大量生成対応**: 最大300枚まで一括生成（段階的生成によるメモリ最適化）
- **連番生成**: 開始番号指定による自動連番テキスト生成
- **リアルタイム編集**: 生成後の個別テキスト編集機能

### 画像カスタマイズ
- **サイズ範囲**: 幅・高さ 16px～2000px（フレキシブル設定）
- **サイズプリセット**: ファビコンサイズからフルHDまで13種類の定型サイズ
- **フォントサイズ**: 8px～200px（ピクセル単位調整）
- **色設定**: RGB値による文字色・背景色の自由選択

### プリセットシステム
- **サイズプリセット**: 64×64（ファビコン）から1920×1080（フルHD）まで
- **色プリセット**: 黒白、グレー系、カラー（青・赤・緑）の統一トーン設定
- **ワンクリック適用**: 設定の瞬時切り替え

### エクスポート機能
- **ZIP一括保存**: JSZipライブラリによる圧縮ダウンロード
- **個別保存**: 右クリックコンテキストメニューによる単体保存
- **自動命名**: 連番付きファイル名の自動生成

## 技術仕様

### 使用技術
- **HTML5 Canvas API**: 高品質なテキスト描画とラスタライズ
- **JavaScript ES6+**: モジュール化されたクラスベース設計
- **JSZip v3.10.1**: ZIP圧縮・アーカイブ機能
- **Bootstrap 5.3.0**: レスポンシブUIフレームワーク
- **CSS3**: グリッドレイアウト・アニメーション

### パフォーマンス最適化

#### 段階的生成システム
20枚超過時の10枚ずつ分割生成により、ブラウザのメモリ負荷を軽減し安定性を確保

```javascript
// 段階的生成の実装例
if (settings.count > 20) {
  this.generateImagesProgressively(settings, container);
} else {
  this.generateImagesAtOnce(settings, container);
}
```

#### CSS最適化
- **contain プロパティ**: レイアウト・ペイント・スタイルの最適化
- **will-change プロパティ**: GPU合成レイヤーでのレンダリング最適化

```css
.generated-images {
  contain: layout style paint;
  will-change: contents;
}
```

#### メモリ管理
- **大量生成警告**: 50枚以上生成時の確認ダイアログ
- **リソース解放**: 不要なCanvas要素の適切なクリーンアップ

### アーキテクチャ設計

#### モジュール構成
```
js/
├── app.js              # メインアプリケーション制御
├── colorPicker.js      # 色選択・プリセット管理
├── canvasRenderer.js   # Canvas描画エンジン
├── imageGenerator.js   # 画像生成・バッチ処理
└── downloadManager.js  # ZIP生成・ダウンロード制御
```

#### クラス設計
```javascript
class BatchImageGeneratorApp {
  // メイン制御クラス
  constructor() {
    this.colorPicker = new ColorPicker();
    this.canvasRenderer = new CanvasRenderer();
    this.imageGenerator = new ImageGenerator();
    this.downloadManager = new DownloadManager();
  }
}
```

## 使用方法

### 基本操作フロー
1. **テキスト入力**: 画像に描画するベーステキストを指定
2. **連番設定**: 開始番号と生成枚数を設定（1～300枚）
3. **サイズ調整**: プリセット選択またはカスタムサイズ指定
4. **色彩設定**: プリセット適用または個別色選択
5. **生成実行**: 段階的生成による画像作成
6. **個別編集**: 生成後のテキスト個別変更
7. **エクスポート**: ZIP一括またはセレクティブ保存

### 効率的な設定パターン

#### テスト用途向け設定
- **サイズ**: 512×512px（標準テストサイズ）
- **色**: 青背景・白文字（高コントラスト）
- **枚数**: 10～50枚（適度なテストボリューム）

#### プロトタイプ用設定
- **サイズ**: 300×300px（サムネイル適正）
- **色**: 白背景・黒文字（印刷対応）
- **連番**: 1から開始の順次生成

## 活用例・ユースケース

### 開発・テスト用途
- **UIコンポーネントテスト**: 異なるサイズでの表示確認用画像
- **データベーステスト**: 大量のサンプル画像データ生成
- **API開発**: エンドポイントテスト用のダミー画像作成
- **レスポンシブテスト**: 複数解像度対応確認用画像

### 実用・業務用途
- **プレゼンテーション**: 連番スライド用の番号画像
- **イベント管理**: 席札・番号札・受付番号の画像
- **教育教材**: 問題番号・章番号の統一画像
- **SNS運用**: 統一デザインによるシリーズ投稿画像

### デザイン・制作用途
- **アイコンセット**: 統一スタイルのアイコン画像群
- **プレースホルダー**: 開発中の仮画像・モックアップ
- **ブランディング**: 統一された番号体系の画像素材

## 技術実装詳細

### Canvas描画システム
```javascript
// 高品質テキスト描画の実装
drawText(canvas, text, fontSize, textColor, bgColor) {
  const ctx = canvas.getContext('2d');
  
  // アンチエイリアシング有効化
  ctx.textRenderingOptimization = 'optimizeQuality';
  ctx.font = `${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // 背景描画
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // テキスト描画
  ctx.fillStyle = textColor;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}
```

### 段階的生成アルゴリズム
```javascript
// パフォーマンス最適化された分割生成
async generateImagesProgressively(settings, container) {
  const batchSize = 10;
  const totalBatches = Math.ceil(settings.count / batchSize);
  
  for (let i = 0; i < totalBatches; i++) {
    const start = i * batchSize;
    const end = Math.min(start + batchSize, settings.count);
    
    // バッチ処理
    this.generateBatch(settings, container, start, end);
    
    // UI更新のためのマイクロタスク実行
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
```

### ZIP生成システム
```javascript
// 効率的なZIPアーカイブ生成
async generateZip(images) {
  const zip = new JSZip();
  
  images.forEach((canvas, index) => {
    const filename = `image_${String(index + 1).padStart(3, '0')}.png`;
    const dataUrl = canvas.toDataURL('image/png');
    const base64Data = dataUrl.split(',')[1];
    
    zip.file(filename, base64Data, { base64: true });
  });
  
  return await zip.generateAsync({ type: 'blob' });
}
```

## ブラウザ対応・制限事項

### 対応ブラウザ
- **Chrome 80+**: 完全対応（推奨）
- **Firefox 75+**: 完全対応
- **Safari 13+**: 完全対応
- **Edge 80+**: 完全対応

### 制限事項
- **生成上限**: 一度に300枚まで（メモリ制限考慮）
- **サイズ上限**: 最大2000×2000px（Canvas API制限）
- **ファイル形式**: PNG形式のみ出力
- **メモリ使用量**: 大量生成時はシステムメモリに依存

### パフォーマンス要件
- **推奨メモリ**: 8GB以上（300枚生成時）
- **推奨CPU**: デュアルコア以上（段階的生成最適化）

## ファイル構成

```
batch-image-generator/
├── index.html              # メインHTMLファイル
├── style.css              # 統合スタイルシート
├── README.md              # 技術仕様書（このファイル）
└── js/
    ├── app.js             # アプリケーション制御（BatchImageGeneratorApp）
    ├── colorPicker.js     # 色選択管理（ColorPicker）
    ├── canvasRenderer.js  # Canvas描画エンジン（CanvasRenderer）
    ├── imageGenerator.js  # 画像生成管理（ImageGenerator）
    └── downloadManager.js # ダウンロード制御（DownloadManager）
```
## 更新履歴

### Version 1.0.0
- 基本的な画像生成機能実装
- 最大300枚一括生成対応
- サイズプリセット機能追加（13種類）
- 色プリセット機能追加（統一トーン）
- ZIP一括ダウンロード機能
- 段階的生成によるパフォーマンス最適化
- レスポンシブデザイン対応
- 個別テキスト編集機能

## ライセンス
このツールはMITライセンスの下で公開されています。
