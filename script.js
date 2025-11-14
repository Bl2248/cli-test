class GomokuGame {
    constructor() {
        this.boardSize = 15;
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0));
        this.currentPlayer = 1; // 1 for black, 2 for white
        this.gameOver = false;
        this.gameBoardElement = document.getElementById('game-board');
        this.currentPlayerElement = document.getElementById('current-player');
        this.gameStatusElement = document.getElementById('game-status');
        this.restartButton = document.getElementById('restart-btn');
        
        this.initBoard();
        this.bindEvents();
    }
    
    initBoard() {
        this.gameBoardElement.innerHTML = '';
        for (let i = 0; i < this.boardSize; i++) {
            const row = document.createElement('div');
            row.className = 'row';
            for (let j = 0; j < this.boardSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                row.appendChild(cell);
            }
            this.gameBoardElement.appendChild(row);
        }
    }
    
    bindEvents() {
        this.gameBoardElement.addEventListener('click', (e) => {
            if (this.gameOver) return;
            
            const cell = e.target;
            if (cell.classList.contains('cell')) {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                
                if (this.board[row][col] === 0) {
                    this.placePiece(row, col);
                }
            }
        });
        
        this.restartButton.addEventListener('click', () => {
            this.restartGame();
        });
    }
    
    placePiece(row, col) {
        // Place piece on logical board
        this.board[row][col] = this.currentPlayer;
        
        // Place piece on visual board
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        const piece = document.createElement('div');
        piece.className = `piece ${this.currentPlayer === 1 ? 'black-piece' : 'white-piece'}`;
        cell.appendChild(piece);
        
        // Check for win
        if (this.checkWin(row, col)) {
            this.gameOver = true;
            this.gameStatusElement.textContent = `${this.currentPlayer === 1 ? '黑棋' : '白棋'}获胜！`;
            return;
        }
        
        // Check for draw
        if (this.checkDraw()) {
            this.gameOver = true;
            this.gameStatusElement.textContent = '平局！';
            return;
        }
        
        // Switch player
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.currentPlayerElement.textContent = this.currentPlayer === 1 ? '黑棋' : '白棋';
    }
    
    checkWin(row, col) {
        const player = this.board[row][col];
        const directions = [
            [0, 1],  // horizontal
            [1, 0],  // vertical
            [1, 1],  // diagonal down-right
            [1, -1]  // diagonal down-left
        ];
        
        for (const [dx, dy] of directions) {
            let count = 1; // current piece
            
            // Check in positive direction
            for (let i = 1; i < 5; i++) {
                const r = row + dx * i;
                const c = col + dy * i;
                if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize && this.board[r][c] === player) {
                    count++;
                } else {
                    break;
                }
            }
            
            // Check in negative direction
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
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (this.board[i][j] === 0) {
                    return false;
                }
            }
        }
        return true;
    }
    
    restartGame() {
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0));
        this.currentPlayer = 1;
        this.gameOver = false;
        this.gameStatusElement.textContent = '';
        this.currentPlayerElement.textContent = '黑棋';
        this.initBoard();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GomokuGame();
});