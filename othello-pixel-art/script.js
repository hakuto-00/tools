class OthelloGame {
    constructor() {
        this.boardSize = 8;
        this.board = Array.from({ length: this.boardSize }, () => Array(this.boardSize).fill(null));
        this.currentPlayer = 'black';
        this.gameOver = false;
        this.isPlayerTurn = true;
        this.originalBoard = null; // 元のボード状態を保持
        this.initializeBoard();
        this.setupEventListeners();
        this.renderBoard();
        this.updateScore();
        this.updateTurn();
    }

    initializeBoard() {
        // 初期配置
        this.board[3][3] = 'white';
        this.board[3][4] = 'black';
        this.board[4][3] = 'black';
        this.board[4][4] = 'white';
    }

    setupEventListeners() {
        document.getElementById('restart').addEventListener('click', () => {
            this.restart();
        });
        
        document.getElementById('download').addEventListener('click', () => {
            this.downloadPixelArt();
        });
        
        // ゲーム終了時の選択肢
        document.getElementById('convert-to-pixel').addEventListener('click', () => {
            this.convertToPixelArt();
        });
        
        document.getElementById('restart-from-end').addEventListener('click', () => {
            this.restart();
        });
        
        // ピクセルアート変換後の選択肢
        document.getElementById('download-pixel').addEventListener('click', () => {
            this.downloadPixelArt();
        });
        
        document.getElementById('restart-after-convert').addEventListener('click', () => {
            this.closeDialog();
            this.restart();
        });
        
        // ダイアログの閉じるボタン
        document.getElementById('close-dialog').addEventListener('click', () => {
            this.closeDialog();
        });
        
        // ダイアログの背景クリックで閉じる
        document.getElementById('pixel-art-dialog').addEventListener('click', (e) => {
            if (e.target.id === 'pixel-art-dialog') {
                this.closeDialog();
            }
        });
        
        // 色適用ボタン
        document.getElementById('apply-colors').addEventListener('click', () => {
            this.applyCustomColors();
        });
    }

    renderBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const cellElement = document.createElement('div');
                cellElement.className = 'cell';
                cellElement.dataset.row = row;
                cellElement.dataset.col = col;
                
                if (this.board[row][col]) {
                    const pieceElement = document.createElement('div');
                    pieceElement.className = `piece ${this.board[row][col]}`;
                    cellElement.appendChild(pieceElement);
                } else if (this.isValidMove(row, col, this.currentPlayer) && this.isPlayerTurn) {
                    cellElement.classList.add('valid-move');
                }
                
                cellElement.addEventListener('click', () => this.handleCellClick(row, col));
                boardElement.appendChild(cellElement);
            }
        }
        
        // プレイヤーのターンで有効な手がない場合の処理
        if (this.isPlayerTurn && !this.gameOver) {
            const validMoves = this.getValidMoves(this.currentPlayer);
            if (validMoves.length === 0) {
                document.getElementById('message').textContent = '黒（あなた）はパスします。';
                setTimeout(() => {
                    this.switchPlayer();
                    if (!this.gameOver) {
                        this.cpuMove();
                    }
                }, 1500);
            }
        }
    }

    handleCellClick(row, col) {
        if (this.gameOver || !this.isPlayerTurn || this.board[row][col] || !this.isValidMove(row, col, this.currentPlayer)) {
            return;
        }
        
        // メッセージをクリア
        document.getElementById('message').textContent = '';
        
        this.makeMove(row, col, this.currentPlayer);
        this.switchPlayer();
        this.renderBoard();
        this.updateScore();
        this.updateTurn();
        
        if (!this.gameOver) {
            setTimeout(() => {
                this.cpuMove();
            }, 500);
        }
    }

    isValidMove(row, col, player) {
        if (this.board[row][col] !== null) return false;
        
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
        
        for (let [dr, dc] of directions) {
            if (this.canFlipInDirection(row, col, dr, dc, player)) {
                return true;
            }
        }
        
        return false;
    }

    canFlipInDirection(row, col, dr, dc, player) {
        const opponent = player === 'black' ? 'white' : 'black';
        let r = row + dr;
        let c = col + dc;
        let hasOpponentPiece = false;
        
        while (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize) {
            if (this.board[r][c] === null) {
                return false;
            } else if (this.board[r][c] === opponent) {
                hasOpponentPiece = true;
            } else if (this.board[r][c] === player) {
                return hasOpponentPiece;
            }
            r += dr;
            c += dc;
        }
        
        return false;
    }

    makeMove(row, col, player) {
        if (this.gameOver) {
            return;
        }
        
        this.board[row][col] = player;
        
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
        
        for (let [dr, dc] of directions) {
            if (this.canFlipInDirection(row, col, dr, dc, player)) {
                this.flipPiecesInDirection(row, col, dr, dc, player);
            }
        }
    }

    flipPiecesInDirection(row, col, dr, dc, player) {
        const opponent = player === 'black' ? 'white' : 'black';
        let r = row + dr;
        let c = col + dc;
        
        while (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize && this.board[r][c] === opponent) {
            this.board[r][c] = player;
            r += dr;
            c += dc;
        }
    }

    getValidMoves(player) {
        const moves = [];
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.isValidMove(row, col, player)) {
                    moves.push([row, col]);
                }
            }
        }
        return moves;
    }

    switchPlayer() {
        const nextPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        const validMoves = this.getValidMoves(nextPlayer);
        
        // 総駒数をチェック
        let totalPieces = 0;
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col]) totalPieces++;
            }
        }
        
        if (validMoves.length > 0) {
            // 次のプレイヤーに交代
            this.currentPlayer = nextPlayer;
            this.isPlayerTurn = this.currentPlayer === 'black';
        } else {
            // 次のプレイヤーが動けない場合、現在のプレイヤーが続行できるかチェック
            const currentValidMoves = this.getValidMoves(this.currentPlayer);
            
            if (currentValidMoves.length === 0) {
                // 両方のプレイヤーが動けない場合、ゲーム終了
                this.endGame();
                return;
            } else {
                // 次のプレイヤーはパス、現在のプレイヤーが続行
                const passedPlayer = nextPlayer === 'black' ? '黒（あなた）' : '白（CPU）';
                document.getElementById('message').textContent = `${passedPlayer}はパスしました。`;
                // 現在のプレイヤーはそのまま（プレイヤーのターンの値を維持）
                this.isPlayerTurn = this.currentPlayer === 'black';
            }
        }
        
        // ボードが満杯の場合は、有効手がなくてもゲーム終了
        if (totalPieces === 64) {
            this.endGame();
            return;
        }
        
        this.renderBoard();
        this.updateTurn();
        
        // CPUのターンで有効手がある場合、CPUに手を打たせる
        if (!this.gameOver && !this.isPlayerTurn && this.getValidMoves(this.currentPlayer).length > 0) {
            setTimeout(() => {
                this.cpuMove();
            }, 500);
        }
    }

    cpuMove() {
        if (this.gameOver || this.isPlayerTurn) return;
        
        const validMoves = this.getValidMoves(this.currentPlayer);
        if (validMoves.length === 0) {
            // CPUがパスする場合
            document.getElementById('message').textContent = '白（CPU）はパスしました。';
            this.switchPlayer();
            return;
        }
        
        // 簡単なAI: ランダムに有効な手を選択
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        this.makeMove(randomMove[0], randomMove[1], this.currentPlayer);
        this.switchPlayer();
        this.updateScore();
        this.renderBoard(); // ← 画面更新を追加
    }

    updateScore() {
        let blackCount = 0;
        let whiteCount = 0;
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === 'black') {
                    blackCount++;
                } else if (this.board[row][col] === 'white') {
                    whiteCount++;
                }
            }
        }
        
        // ゲーム終了後はスコア表示を変更しない
        if (!this.gameOver) {
            document.getElementById('black-score').textContent = blackCount;
            document.getElementById('white-score').textContent = whiteCount;
        }
    }

    updateTurn() {
        const turnElement = document.getElementById('current-turn');
        turnElement.textContent = this.currentPlayer === 'black' ? '黒（あなた）' : '白（CPU）';
    }

    endGame() {
        this.gameOver = true;
        
        // 最終的なスコア計算（確実に）
        let blackCount = 0;
        let whiteCount = 0;
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === 'black') blackCount++;
                else if (this.board[row][col] === 'white') whiteCount++;
            }
        }
        
        // スコア表示を更新
        document.getElementById('black-score').textContent = blackCount;
        document.getElementById('white-score').textContent = whiteCount;
        
        let message = '';
        if (blackCount > whiteCount) {
            message = `ゲーム終了！ あなた（黒）の勝利です！ ${blackCount} - ${whiteCount}`;
        } else if (whiteCount > blackCount) {
            message = `ゲーム終了！ CPU（白）の勝利です！ ${whiteCount} - ${blackCount}`;
        } else {
            message = `ゲーム終了！ 引き分けです！ ${blackCount} - ${whiteCount}`;
        }
        
        document.getElementById('message').textContent = message;
        document.getElementById('message').classList.add('game-over');
        
        // ゲーム中のコントロールを隠す
        document.querySelector('.controls').style.display = 'none';
        
        // ゲーム終了時の選択肢を表示
        document.getElementById('game-end-options').style.display = 'flex';
    }

    convertToPixelArt() {
        // ゲーム終了時の選択肢を隠す
        document.getElementById('game-end-options').style.display = 'none';
        
        // 元のボード状態を保存（色変更用）
        this.originalBoard = this.board.map(row => [...row]);
        
        // ボードの駒数をカウント
        let blackCount = 0;
        let whiteCount = 0;
        let totalPieces = 0;
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === 'black') blackCount++;
                else if (this.board[row][col] === 'white') whiteCount++;
                if (this.board[row][col]) totalPieces++;
            }
        }
        
        const isBoardFull = totalPieces === 64;
        const isBlackOnly = blackCount > 0 && whiteCount === 0;
        const isWhiteOnly = whiteCount > 0 && blackCount === 0;
        
        // カラーピッカーの表示/非表示を制御
        const blackColorGroup = document.querySelector('#black-color-picker').parentElement;
        const whiteColorGroup = document.querySelector('#white-color-picker').parentElement;
        const greenColorGroup = document.querySelector('#green-color-picker').parentElement;
        
        // 黒駒のカラーピッカー：白一色の場合は非表示
        if (isWhiteOnly) {
            blackColorGroup.style.display = 'none';
        } else {
            blackColorGroup.style.display = 'flex';
        }
        
        // 白駒のカラーピッカー：黒一色の場合は非表示
        if (isBlackOnly) {
            whiteColorGroup.style.display = 'none';
        } else {
            whiteColorGroup.style.display = 'flex';
        }
        
        // 空白マスのカラーピッカー：満杯の場合は非表示
        if (isBoardFull) {
            greenColorGroup.style.display = 'none';
        } else {
            greenColorGroup.style.display = 'flex';
        }
        
        // デフォルト色を設定
        document.getElementById('black-color-picker').value = '#1e1e2e';
        document.getElementById('white-color-picker').value = '#f0f0f0';
        document.getElementById('green-color-picker').value = '#4ade80';
        
        // ピクセルアートを生成
        this.generatePixelArt();
        
        // ダイアログを表示
        document.getElementById('pixel-art-dialog').style.display = 'flex';
    }

    closeDialog() {
        document.getElementById('pixel-art-dialog').style.display = 'none';
        // ダイアログを閉じた後、ゲーム終了時の選択肢を再表示
        if (this.gameOver) {
            document.getElementById('game-end-options').style.display = 'flex';
        }
    }

    applyCustomColors() {
        const blackColor = document.getElementById('black-color-picker').value;
        const whiteColor = document.getElementById('white-color-picker').value;
        
        // ボードが満杯でない場合のみ緑色の値を取得
        const boardToUse = this.originalBoard || this.board;
        let totalPieces = 0;
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (boardToUse[row][col]) totalPieces++;
            }
        }
        const isBoardFull = totalPieces === 64;
        
        const greenColor = isBoardFull ? '#4ade80' : document.getElementById('green-color-picker').value;
        
        this.generatePixelArtWithColors(blackColor, whiteColor, greenColor);
    }

    generatePixelArt() {
        // デフォルト色でアート生成
        this.generatePixelArtWithColors('#1e1e2e', '#f0f0f0', '#4ade80');
    }
    
    generatePixelArtWithColors(blackColor, whiteColor, greenColor = '#4ade80') {
        const canvas = document.getElementById('pixel-canvas');
        const ctx = canvas.getContext('2d');
        const pixelSize = 16; // 128/8 = 16ピクセル
        
        // キャンバスサイズを128x128に設定
        canvas.width = 128;
        canvas.height = 128;
        
        // キャンバスをクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 元のボード状態を使用してアートを生成
        const boardToUse = this.originalBoard || this.board;
        
        // ボードが満杯かどうかをチェック
        let totalPieces = 0;
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (boardToUse[row][col]) totalPieces++;
            }
        }
        const isBoardFull = totalPieces === 64;
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const x = col * pixelSize;
                const y = row * pixelSize;
                
                if (boardToUse[row][col] === 'black') {
                    // 黒駒は指定された黒色で塗りつぶし
                    ctx.fillStyle = blackColor;
                    ctx.fillRect(x, y, pixelSize, pixelSize);
                } else if (boardToUse[row][col] === 'white') {
                    // 白駒は指定された白色で塗りつぶし
                    ctx.fillStyle = whiteColor;
                    ctx.fillRect(x, y, pixelSize, pixelSize);
                } else {
                    // 空白マスの処理：ボードが満杯でない場合のみ緑色で塗りつぶし
                    if (!isBoardFull) {
                        ctx.fillStyle = greenColor;
                        ctx.fillRect(x, y, pixelSize, pixelSize);
                    }
                    // ボードが満杯の場合は何も描画しない（透明のまま）
                }
            }
        }
    }
    
    downloadPixelArt() {
        const canvas = document.getElementById('pixel-canvas');
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `othello-modern-art-${timestamp}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    restart() {
        this.board = Array.from({ length: this.boardSize }, () => Array(this.boardSize).fill(null));
        this.currentPlayer = 'black';
        this.gameOver = false;
        this.isPlayerTurn = true;
        
        document.getElementById('message').textContent = '';
        document.getElementById('message').classList.remove('game-over');
        
        // 全てのコントロールパネルをリセット
        document.querySelector('.controls').style.display = 'flex';
        document.getElementById('game-end-options').style.display = 'none';
        document.getElementById('download').style.display = 'none';
        document.getElementById('pixel-art-dialog').style.display = 'none';
        
        this.initializeBoard();
        this.renderBoard();
        this.updateScore();
        this.updateTurn();
    }
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    new OthelloGame();
});