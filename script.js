class ChessGame {
    constructor() {
        this.boardSize = 15;
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0));
        this.currentPlayer = 1; // 1 for black, 2 for white
        this.gameOver = false;
        this.chessboard = document.getElementById('chessboard');
        this.playerDisplay = document.getElementById('player');
        this.gameResult = document.getElementById('game-result');
        this.restartBtn = document.getElementById('restart-btn');
        
        this.initBoard();
        this.bindEvents();
    }
    
    initBoard() {
        this.chessboard.innerHTML = '';
        for (let i = 0; i < this.boardSize * this.boardSize; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            this.chessboard.appendChild(cell);
        }
    }
    
    bindEvents() {
        this.chessboard.addEventListener('click', (e) => {
            if (this.gameOver) return;
            const cell = e.target;
            if (cell.classList.contains('cell') && !cell.querySelector('.chess-piece')) {
                this.placePiece(cell);
            }
        });
        
        this.restartBtn.addEventListener('click', () => {
            this.restart();
        });
    }
    
    placePiece(cell) {
        const index = parseInt(cell.dataset.index);
        const row = Math.floor(index / this.boardSize);
        const col = index % this.boardSize;
        
        // Place piece on board data
        this.board[row][col] = this.currentPlayer;
        
        // Create visual piece
        const piece = document.createElement('div');
        piece.className = `chess-piece ${this.currentPlayer === 1 ? 'black' : 'white'}`;
        cell.appendChild(piece);
        
        // Check game result
        if (this.checkWin(row, col)) {
            this.gameOver = true;
            this.gameResult.textContent = `${this.currentPlayer === 1 ? '黑子' : '白子'}获胜！`;
            this.gameResult.className = 'win';
            return;
        }
        
        if (this.checkDraw()) {
            this.gameOver = true;
            this.gameResult.textContent = '平局！';
            this.gameResult.className = 'draw';
            return;
        }
        
        // Switch player
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.playerDisplay.textContent = this.currentPlayer === 1 ? '黑子' : '白子';
    }
    
    checkWin(row, col) {
        const player = this.board[row][col];
        const directions = [
            [0, 1],  // horizontal
            [1, 0],  // vertical
            [1, 1],  // diagonal \
            [1, -1]  // diagonal /
        ];
        
        for (let [dx, dy] of directions) {
            let count = 1; // current piece
            
            // Check positive direction
            for (let i = 1; i < 5; i++) {
                const r = row + dx * i;
                const c = col + dy * i;
                if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize && this.board[r][c] === player) {
                    count++;
                } else {
                    break;
                }
            }
            
            // Check negative direction
            for (let i = 1; i < 5; i++) {
                const r = row - dx * i;
                const c = col - dy * i;
                if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize && this.board[r][c] === player) {
                    count++;
                } else {
                    break;
                }
            }
            
            if (count >= 5) {
                return true;
            }
        }
        
        return false;
    }
    
    checkDraw() {
        // Check if board is full
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === 0) {
                    return false;
                }
            }
        }
        return true;
    }
    
    restart() {
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0));
        this.currentPlayer = 1;
        this.gameOver = false;
        this.playerDisplay.textContent = '黑子';
        this.gameResult.textContent = '';
        this.gameResult.className = '';
        this.initBoard();
    }
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChessGame();
});