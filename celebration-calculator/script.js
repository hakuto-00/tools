const display = document.getElementById('display');
const displayText = document.querySelector('.display-text');
const celebrationSound = document.getElementById('celebration-sound');
const buttons = document.querySelectorAll('.buttons button');
const soundToggle = document.getElementById('sound-toggle');
const popupResult = document.getElementById('popup-result');

let isResultDisplayed = false; // 結果が表示されているかどうかのフラグ
let isSoundEnabled = true; // 音声が有効かどうかのフラグ

// 音声切り替えボタンの処理
soundToggle.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    if (isSoundEnabled) {
        soundToggle.textContent = '🔊 音声ON';
        soundToggle.classList.remove('muted');
    } else {
        soundToggle.textContent = '🔇 音声OFF';
        soundToggle.classList.add('muted');
    }
});

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        // data-operator属性がある場合はその値を使用、なければtextContentを使用
        const value = btn.dataset.operator || btn.textContent;
        handleClick(value);
    });
});

function handleClick(value, displayValue = value) {
    if (value === 'C') {
        displayText.textContent = '';
        popupResult.classList.remove('animate');
        popupResult.textContent = '';
        isResultDisplayed = false;
        return;
    }

    if (value === '=') {
        // 空の場合や無効な式の場合はエラー処理
        if (!displayText.textContent.trim()) {
            displayText.textContent = 'Error';
            isResultDisplayed = true;
            return;
        }
        
        try {
            // ディスプレイ表示を計算用の文字列に変換
            const calculationString = displayText.textContent
                .replace(/÷/g, '/')
                .replace(/×/g, '*')
                .replace(/−/g, '-');
            
            const result = eval(calculationString);
            if (result !== undefined && result !== null && !isNaN(result)) {
                // 音楽を再生
                celebrationSound.currentTime = 0;
                if (isSoundEnabled) {
                    celebrationSound.play().catch(e => console.log('音楽再生エラー:', e));
                }
                
                // 3D飛び出しエフェクトを開始
                trigger3DPopupEffect(result);
                
                // 短縮された花火エフェクト
                triggerFireworksEffect();
                
                // スターエフェクトを追加
                triggerStarEffect();
                
                // ディスプレイキラン演出（遅延実行）
                setTimeout(() => {
                    triggerDisplayKiran();
                }, 1000);
                
            } else {
                displayText.textContent = 'Error';
                isResultDisplayed = true;
            }
        } catch (e) {
            displayText.textContent = 'Error';
            isResultDisplayed = true;
        }
        return;
    }
    
    // 数値入力時の処理
    if (isResultDisplayed) {
        // 結果表示後の数値入力は新しい計算の開始
        displayText.classList.add('no-transition');
        displayText.textContent = '';
        popupResult.classList.remove('animate');
        popupResult.textContent = '';
        
        // 即座に色をリセット
        setTimeout(() => {
            displayText.classList.remove('no-transition');
        }, 10);
        
        isResultDisplayed = false;
    }
    
    // 演算子の表示値を設定
    let displayValueToShow = displayValue;
    if (value === '*') {
        displayValueToShow = '×';
    } else if (value === '/') {
        displayValueToShow = '÷';
    } else if (value === '-') {
        displayValueToShow = '−';
    }
    
    displayText.textContent += displayValueToShow;
}

// 文字飛び出しエフェクト（画面全体→フェードアウト→ディスプレイ表示）
function trigger3DPopupEffect(result) {
    // ポップアップ要素に結果をセット
    popupResult.textContent = result;
    
    // 既存のアニメーションクラスをリセット
    popupResult.classList.remove('animate');
    
    // アニメーションを開始（画面全体にフェードイン）
    setTimeout(() => {
        popupResult.classList.add('animate');
    }, 50);
    
    // 0.1秒後に結果をディスプレイに表示（もっとゆっくり）
    setTimeout(() => {
        // 最初から下の位置で非表示状態にしてテキストを設定
        displayText.classList.add('no-transition');
        displayText.style.transform = 'translateY(60px)';
        displayText.style.opacity = '0';
        displayText.textContent = result;
        
        // 少し待ってからスライドインアニメーションを開始
        setTimeout(() => {
            displayText.classList.remove('no-transition');
            displayText.style.transform = '';
            displayText.style.opacity = '';
            displayText.classList.add('slide-in');
            isResultDisplayed = true;

            // アニメーション完了後にクラスを削除（1.5秒後）
            setTimeout(() => {
                displayText.classList.remove('slide-in');
            }, 1500);
        }, 50);
    }, 100);

    // アニメーション終了後にクリーンアップ
    setTimeout(() => {
        popupResult.classList.remove('animate');
        popupResult.textContent = '';
    }, 2000);
}

// 短縮された花火エフェクト
function triggerFireworksEffect() {
    // 1回目の花火
    setTimeout(() => {
        confetti({
            particleCount: 25,
            angle: 60,
            spread: 55,
            origin: { x: 0.3, y: 0.6 },
            colors: ['#ff6b35', '#f7931e', '#ffd23f'],
            gravity: 0.3,
            ticks: 150
        });
    }, 200);
    
    // 2回目の花火
    setTimeout(() => {
        confetti({
            particleCount: 25,
            angle: 120,
            spread: 55,
            origin: { x: 0.7, y: 0.6 },
            colors: ['#ff6b35', '#f7931e', '#ffd23f'],
            gravity: 0.3,
            ticks: 150
        });
    }, 400);
}

// ディスプレイキラン演出
function triggerDisplayKiran() {
    display.classList.add('display-light-sweep', 'animate');
    
    setTimeout(() => {
        display.classList.remove('display-light-sweep', 'animate');
    }, 600);
}

// スターエフェクト
function triggerStarEffect() {
    // ディスプレイの位置を取得
    const displayRect = display.getBoundingClientRect();
    const displayCenterX = (displayRect.left + displayRect.right) / 2;
    const displayCenterY = (displayRect.top + displayRect.bottom) / 2;
    
    // 画面全体に対する相対位置を計算
    const originX = displayCenterX / window.innerWidth;
    const originY = displayCenterY / window.innerHeight;
    
    var defaults = {
        spread: 360,
        ticks: 50,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
        origin: { x: originX, y: originY }
    };

    function shoot() {
        confetti({
            ...defaults,
            particleCount: 40,
            scalar: 1.2,
            shapes: ['star']
        });

        confetti({
            ...defaults,
            particleCount: 10,
            scalar: 0.75,
            shapes: ['circle']
        });
    }

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
}

// キーボード入力対応
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    // 数字キー（0-9）
    if (key >= '0' && key <= '9') {
        handleClick(key);
        return;
    }
    
    // 演算子キー
    switch (key) {
        case '+':
            handleClick('+');
            break;
        case '-':
            handleClick('-', '−');
            break;
        case '*':
            handleClick('*', '×');
            break;
        case '/':
            event.preventDefault();
            handleClick('/', '÷');
            break;
        case '.':
            handleClick('.');
            break;
        case 'Enter':
        case '=':
            event.preventDefault();
            handleClick('=');
            break;
        case 'Escape':
        case 'c':
        case 'C':
            handleClick('C');
            break;
        case 'Backspace':
            event.preventDefault();
            handleBackspace();
            break;
    }
});

// バックスペース処理
function handleBackspace() {
    if (isResultDisplayed) {
        handleClick('C');
    } else {
        const currentText = displayText.textContent;
        if (currentText.length > 0) {
            displayText.textContent = currentText.slice(0, -1);
        }
    }
}
