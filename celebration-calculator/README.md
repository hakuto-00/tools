# 演出電卓 - Calculator with Celebration Animations

## 概要

計算結果をアニメーション効果でお祝いする電卓アプリケーションです。基本的な四則演算の計算実行時に、3D飛び出しエフェクト、パーティクルアニメーション、光の掃引効果、スライドイン表示などの視覚効果が発生します。

## アニメーション概要

### 1. 3D飛び出しエフェクト（popupFlyOut）
計算結果が画面中央に大きく表示される主要なアニメーション。0.2倍から10倍まで段階的にスケールアップし、同時にオパシティとテキストシャドウがダイナミックに変化。2秒間で完了し、視覚的なインパクトが最大の演出効果。sparkle効果の疑似要素も含む。

### 2. 光掃引エフェクト（kiran）
ディスプレイ表面を光の帯が横切る演出。CSS疑似要素::beforeを使用して白色光源を生成し、transform: scaleで光の移動を表現。計算完了1秒後に0.6秒間実行される。

### 3. パーティクルエフェクト（Canvas-Confetti）
外部ライブラリによる物理演算ベースのパーティクルシステム。花火エフェクト（2段階発射）と星エフェクト（ディスプレイ中心から放射状）の2種類を同時実行。重力・速度・色彩・形状をパラメータで制御。

### 4. スライドインエフェクト（slideInFromBelow）
計算結果がディスプレイに下方向からスライドインする演出。段階的なイージングカーブでバウンス効果を実現。アニメーション競合回避のため、no-transitionクラスによる一時的なCSS無効化を実装。

## 主要機能

- **3D飛び出しエフェクト**: 計算結果が画面中央に大きく表示され、拡大・縮小してフェードアウト
- **パーティクルエフェクト**: Canvas-confettiライブラリを使用した花火と星のアニメーション
- **光掃引エフェクト**: ディスプレイ画面を横切る光の演出
- **スライドイン表示**: 計算結果が下からスライドインして表示
- **サウンド機能**: 計算実行時に効果音が再生（ON/OFF切り替え可能）
- **キーボード対応**: テンキーと演算子キーでの操作
- **バックスペース機能**: 最後の文字削除とエラー状態からの復帰
- **レスポンシブデザイン**: モバイルデバイス対応

## 技術仕様

### 使用技術
- HTML5, CSS3, Vanilla JavaScript
- Canvas-Confetti v1.9.3（パーティクルエフェクト）
- Font Awesome（アイコン）
- Web Audio API（音響効果）

### アニメーション実装詳細

#### 1. 3D飛び出しエフェクト（実装詳細）

**動作概要**: 計算結果が画面中央に大きく表示される主要なアニメーション効果

**CSS実装**:
```css
/* ポップアップ結果表示用の固定要素 */
.popup-result {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 8em;
    font-weight: 700;
    color: #f8915a;
    text-shadow: 0 0 10px rgba(255, 107, 53, 0.8);
    opacity: 0;
    z-index: 1000;
    pointer-events: none;
}

/* スパークルエフェクト用疑似要素 */
.popup-result::before {
    content: '';
    position: absolute;
    left: -80px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.5em;
    animation: sparkle 0.3s infinite alternate;
}

.popup-result::after {
    content: '';
    position: absolute;
    right: -80px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.5em;
    animation: sparkle 0.3s infinite alternate 0.15s;
}

/* スパークルアニメーション */
@keyframes sparkle {
    from { transform: translateY(-50%) scale(1); opacity: 0.7; }
    to { transform: translateY(-50%) scale(1.3); opacity: 1; }
}

/* メインアニメーション */
@keyframes popupFlyOut {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.2);
        text-shadow: 0 0 10px rgba(255, 107, 53, 0.3);
    }
    20% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
        text-shadow: 0 0 30px rgba(255, 107, 53, 0.7);
    }
    60% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(5);
        text-shadow: 0 0 60px rgba(255, 107, 53, 0.8);
    }
    100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(10);
        text-shadow: 0 0 10px rgba(255, 107, 53, 0.2);
    }
}

/* アニメーション開始時に追加されるクラス */
.popup-result.animate {
    animation: popupFlyOut 2s ease-in-out forwards;
}
```

**JavaScript制御**:
```javascript
/**
 * 3D飛び出しエフェクトの実行
 * @param {number} result - 計算結果の数値
 */
function trigger3DPopupEffect(result) {
    // ポップアップ要素に結果をセット
    popupResult.textContent = result;
    
    // 既存のアニメーションクラスをリセット（再実行対応）
    popupResult.classList.remove('animate');
    
    // 50ms後にアニメーション開始（DOM更新待ち）
    setTimeout(() => {
        popupResult.classList.add('animate');
    }, 50);
    
    // 0.1秒後に結果をディスプレイ表示（スライドイン準備）
    setTimeout(() => {
        // アニメーション競合回避のため一時的にCSS無効化
        displayText.classList.add('no-transition');
        displayText.style.transform = 'translateY(60px)';
        displayText.style.opacity = '0';
        displayText.textContent = result;
        
        // スライドインアニメーション開始
        setTimeout(() => {
            displayText.classList.remove('no-transition');
            displayText.style.transform = '';
            displayText.style.opacity = '';
            displayText.classList.add('slide-in');
            isResultDisplayed = true;

            // アニメーション完了後にクラス削除
            setTimeout(() => {
                displayText.classList.remove('slide-in');
            }, 1500);
        }, 50);
    }, 100);

    // 2秒後にクリーンアップ実行
    setTimeout(() => {
        popupResult.classList.remove('animate');
        popupResult.textContent = '';
    }, 2000);
}
```
#### 2. 光掃引エフェクト（実装詳細）

**動作概要**: ディスプレイ表面を光の帯が横切る演出効果（計算完了1秒後に実行）

**CSS実装**:
```css
/* 光掃引アニメーション用のコンテナ */
.display-light-sweep {
    overflow: hidden;
    position: relative;
}

/* 光掃引用の疑似要素定義 */
.display-light-sweep::before {
    background: #fff;               /* 白色の光源 */
    content: "";
    display: block;
    position: absolute;
    top: 0px;
    left: -100px;                   /* 初期位置は画面外左側 */
    width: 30px;                    /* 光の帯の幅 */
    height: 100%;                   /* ディスプレイ全高 */
    opacity: 0;                     /* 初期状態は透明 */
    rotate: 45deg;                  /* 45度回転 */
}

/* 光掃引アニメーション中に追加されるクラス */
.display-light-sweep.animate::before {
    animation: kiran 0.6s ease-out;
}

/* キーフレーム定義：scaleによる光の移動と拡大表現 */
@keyframes kiran {
  0% {
    transform: scale(2);
    opacity: 0;
  }
  20% {
    transform: scale(20);
    opacity: 0.4;
  }
  40% {
    transform: scale(30);
    opacity: 0.6;
  }
  80% {
    transform: scale(45);
    opacity: 0.2;
  }
  100% {
    transform: scale(50);
    opacity: 0;
  }
}
```

**JavaScript制御**:
```javascript
/**
 * ディスプレイ光掃引エフェクトの実行
 * 計算完了から1秒後に自動実行される
 */
function triggerDisplayKiran() {
    // 光掃引クラスを追加してアニメーション開始
    display.classList.add('display-light-sweep', 'animate');
    
    // 0.6秒後にクラス削除（アニメーション終了後のクリーンアップ）
    setTimeout(() => {
        display.classList.remove('display-light-sweep', 'animate');
    }, 600);
}

// メイン計算処理内での呼び出し（1秒遅延）
setTimeout(() => {
    triggerDisplayKiran();
}, 1000);
```

#### 3. パーティクルエフェクト（実装詳細）

**動作概要**: Canvas-confettiライブラリによる物理演算ベースのパーティクル生成

**花火エフェクト実装**:
```javascript
/**
 * 短縮花火エフェクトの実行
 * 左右2箇所から時間差で花火を発射
 */
function triggerFireworksEffect() {
    // 1回目の花火（左側から右上方向）
    setTimeout(() => {
        confetti({
            particleCount: 25,          // パーティクル数
            angle: 60,                  // 発射角度（度）
            spread: 55,                 // 拡散範囲（度）
            origin: { x: 0.3, y: 0.6 }, // 発射位置（画面比率）
            colors: ['#ff6b35', '#f7931e', '#ffd23f'], // 暖色系
            gravity: 0.3,               // 重力係数
            ticks: 150                  // 持続時間（フレーム数）
        });
    }, 200);
    
    // 2回目の花火（右側から左上方向）
    setTimeout(() => {
        confetti({
            particleCount: 25,
            angle: 120,                 // 左上方向
            spread: 55,
            origin: { x: 0.7, y: 0.6 },
            colors: ['#ff6b35', '#f7931e', '#ffd23f'],
            gravity: 0.3,
            ticks: 150
        });
    }, 400);
}
```

**星エフェクト実装**:
```javascript
/**
 * ディスプレイ中心からの星エフェクト
 * 動的にディスプレイ位置を取得して発射位置を計算
 */
function triggerStarEffect() {
    // ディスプレイ要素の画面上位置を取得
    const displayRect = display.getBoundingClientRect();
    const displayCenterX = (displayRect.left + displayRect.right) / 2;
    const displayCenterY = (displayRect.top + displayRect.bottom) / 2;
    
    // 画面全体に対する相対位置を計算（0-1の範囲）
    const originX = displayCenterX / window.innerWidth;
    const originY = displayCenterY / window.innerHeight;
    
    // 共通設定オブジェクト
    var defaults = {
        spread: 360,                    // 全方向拡散
        ticks: 50,                      // 短い持続時間
        gravity: 0,                     // 重力無効
        decay: 0.94,                    // 減衰率
        startVelocity: 30,              // 初期速度
        colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
        origin: { x: originX, y: originY }
    };

    // 星発射関数
    function shoot() {
        // 大きな星パーティクル
        confetti({
            ...defaults,
            particleCount: 40,
            scalar: 1.2,                // サイズ倍率
            shapes: ['star']
        });

        // 小さな円パーティクル
        confetti({
            ...defaults,
            particleCount: 10,
            scalar: 0.75,
            shapes: ['circle']
        });
    }

    // 100ms間隔で3回発射
    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
}
```
#### 4. スライドインエフェクト（実装詳細）

**動作概要**: 計算結果がディスプレイに下方向からスライドインする演出

**CSS実装**:
```css
/* スライドイン中に追加されるクラス */
.slide-in {
    animation: slideInFromBelow 1.5s ease-out forwards;
}

/* キーフレーム定義：下から上へのバウンシングモーション */
@keyframes slideInFromBelow {
    0% {
        transform: translateY(60px);    /* 下方60px位置から開始 */
        opacity: 0;
    }
    30% {
        transform: translateY(15px);    /* オーバーシュート */
        opacity: 0.6;
    }
    60% {
        transform: translateY(-3px);    /* 軽い跳ね上がり */
        opacity: 0.9;
    }
    80% {
        transform: translateY(1px);     /* 微細な戻り */
        opacity: 1;
    }
    100% {
        transform: translateY(0);       /* 最終位置に着地 */
        opacity: 1;
    }
}

/* アニメーション競合回避用の一時無効化クラス */
.no-transition {
    transition: none !important;
}

.display-text.no-transition {
    transition: none;
    animation: none !important; /* アニメーションも完全に無効化 */
}
```

**JavaScript制御** (3D飛び出しエフェクト内で実行):
```javascript
// 0.1秒後にスライドイン開始（3D効果との連携）
setTimeout(() => {
    // Step 1: CSS遷移を一時的に無効化してポジション設定
    displayText.classList.add('no-transition');
    displayText.style.transform = 'translateY(60px)';
    displayText.style.opacity = '0';
    displayText.textContent = result;
    
    // Step 2: 50ms後にスライドインアニメーション開始
    setTimeout(() => {
        displayText.classList.remove('no-transition');
        displayText.style.transform = '';          // CSS keyframeに制御移行
        displayText.style.opacity = '';
        displayText.classList.add('slide-in');     // アニメーション開始
        isResultDisplayed = true;

        // Step 3: 1.5秒後にアニメーションクラス削除
        setTimeout(() => {
            displayText.classList.remove('slide-in');
        }, 1500);
    }, 50);
}, 100);
```

**アニメーション競合回避の仕組み**:
1. `no-transition`クラスで既存のCSS transitionを無効化
2. JavaScriptで初期位置を強制設定
3. 短時間でクラス削除後、CSS keyframeアニメーションに制御移行
4. この手法により、複数アニメーションの干渉を防止

### キーボード入力対応（実装詳細）

**動作概要**: 物理キーボードからの入力を電卓操作に変換

**JavaScript実装**:
```javascript
/**
 * キーボードイベントリスナー
 * 数字・演算子・制御キーを電卓操作にマッピング
 */
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    // 数字キー処理（0-9）
    if (key >= '0' && key <= '9') {
        handleClick(key);
        return;
    }
    
    // 演算子・制御キー処理
    switch (key) {
        case '+':
            handleClick('+');
            break;
        case '-':
            handleClick('-', '−');     // 表示用マイナス記号に変換
            break;
        case '*':
            handleClick('*', '×');     // 表示用乗算記号に変換
            break;
        case '/':
            event.preventDefault();    // ブラウザ検索機能無効化
            handleClick('/', '÷');     // 表示用除算記号に変換
            break;
        case '.':
            handleClick('.');
            break;
        case 'Enter':
        case '=':
            event.preventDefault();    // フォーム送信防止
            handleClick('=');
            break;
        case 'Escape':
        case 'c':
        case 'C':
            handleClick('C');
            break;
        case 'Backspace':
            event.preventDefault();    // ブラウザ戻る機能無効化
            handleBackspace();
            break;
    }
});

/**
 * バックスペース処理
 * 結果表示中：全クリア / 入力中：最後の文字削除
 */
function handleBackspace() {
    if (isResultDisplayed) {
        // 結果表示中は全クリアと同等
        handleClick('C');
    } else {
        // 入力中は最後の文字を削除
        const currentText = displayText.textContent;
        if (currentText.length > 0) {
            displayText.textContent = currentText.slice(0, -1);
        }
    }
}
```

**キーマッピング表**:
- 数字キー `0-9` → 直接入力
- `+` → 加算演算子
- `-` → 減算演算子（表示は`−`）
- `*` → 乗算演算子（表示は`×`）
- `/` → 除算演算子（表示は`÷`）
- `Enter` / `=` → 計算実行
- `Backspace` → 文字削除
- `Escape` / `C` → 全クリア

### 音声制御システム

**動作概要**: Web Audio APIを使用した効果音再生制御

**JavaScript実装**:
```javascript
// 音声切り替えボタンの処理
soundToggle.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;  // 状態切り替え
    
    if (isSoundEnabled) {
        soundToggle.textContent = '🔊 音声ON';
        soundToggle.classList.remove('muted');
    } else {
        soundToggle.textContent = '🔇 音声OFF';
        soundToggle.classList.add('muted');
    }
});

// 計算実行時の音声再生処理
if (isSoundEnabled) {
    celebrationSound.currentTime = 0;  // 再生位置をリセット
    celebrationSound.play().catch(e => {
        console.log('音楽再生エラー:', e);  // エラーハンドリング
    });
}
```

**重要な実装ポイント**:
1. **currentTime リセット**: 連続再生時の音声重複回避
2. **Promise エラーハンドリング**: ブラウザのオートプレイ制限対応
3. **UI状態同期**: ボタン表示とフラグ状態の一致保証

### パフォーマンス最適化

**DOM要素キャッシュ**:
```javascript
// 起動時に一度だけDOM要素を取得してキャッシュ
const display = document.getElementById('display');
const displayText = document.querySelector('.display-text');
// ...他の要素も同様
```

**アニメーション最適化**:
- CSS transform使用によるGPUアクセラレーション活用
- setTimeout()による適切なタイミング制御
- クラス追加/削除による再利用可能なアニメーション実装

**メモリ管理**:
- イベントリスナーの適切な登録
- アニメーション終了後のクラス削除によるメモリリーク防止

## ファイル構成

```
calculator-animation/
├── index.html          # HTMLマークアップ
├── style.css           # CSSスタイル・アニメーション
├── script.js           # JavaScript制御ロジック
├── sound.mp3           # 効果音ファイル
└── README.md           # 説明書
```

## セットアップ方法

### インストール
```bash
# プロジェクトクローン
git clone [repository-url]
cd calculator-animation
```

### 起動
```bash
# 直接ブラウザで開く
open index.html

# ローカルサーバー起動（推奨）
python -m http.server 8000
# または
npx serve .
# ブラウザでhttp://localhost:8000にアクセス
```

## 使い方

### 基本操作

#### 電卓操作手順
1. **数字入力**: 数字ボタンをクリックまたはキーボード入力
2. **演算子選択**: +, −, ×, ÷ ボタンをクリック
3. **計算実行**: = ボタンをクリック（全アニメーション効果が発生）
4. **クリア**: C ボタンで全クリア
5. **削除**: ⌫ ボタンまたはBackspaceキーで最後の文字を削除

#### 計算例
```
入力例: 123+456= 
結果: 579（3D飛び出し+花火+星+光掃引効果）

入力例: 50×2=
結果: 100（全アニメーション効果）
```

### キーボード操作

#### サポートキー一覧
- **数字キー（0-9）**: 数値入力
- **演算子キー**: 
  - `+` → 加算
  - `-` → 減算（表示は−）  
  - `*` → 乗算（表示は×）
  - `/` → 除算（表示は÷）
- **制御キー**:
  - `Enter` または `=` → 計算実行
  - `Backspace` → 文字削除
  - `Escape`, `C`, `c` → 全クリア
  - `.` → 小数点入力

#### キーボード操作メリット
- 高速な連続計算が可能
- マウス操作不要
- ブラウザショートカットキーとの競合回避済み

### サウンド制御

#### 音声機能
- **効果音**: 計算実行時に祝福サウンドが再生
- **切り替え**: 画面右上のON/OFFボタンで制御
- **状態表示**: 🔊（ON）/ 🔇（OFF）アイコンで現在状態を表示
- **エラー対応**: ブラウザのオートプレイ制限に対応済み

#### 推奨設定
計算の達成感を高めるため、音声ONでの使用を推奨します。

## ブラウザ対応

- Chrome88以上
- Firefox85以上  
- Safari14以上
- Edge88以上

---

## ライセンス

MIT License

## 作成者

PA-TU