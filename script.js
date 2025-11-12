class Gomoku {
    constructor() {
        this.boardSize = 15;
        this.board = [];
        this.currentPlayer = 'black';
        this.gameOver = false;
        this.initBoard();
        this.renderBoard();
        this.bindEvents();
    }

    initBoard() {
        for (let i = 0; i < this.boardSize; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.boardSize; j++) {
                this.board[i][j] = null;
            }
        }
    }

    renderBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        gameBoard.style.width = `${this.boardSize * 30}px`;
        gameBoard.style.height = `${this.boardSize * 30}px`;

        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.style.left = `${j * 30}px`;
                cell.style.top = `${i * 30}px`;
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                if (this.board[i][j] === 'black') {
                    const piece = document.createElement('div');
                    piece.className = 'black-piece';
                    cell.appendChild(piece);
                } else if (this.board[i][j] === 'white') {
                    const piece = document.createElement('div');
                    piece.className = 'white-piece';
                    cell.appendChild(piece);
                }
                
                gameBoard.appendChild(cell);
            }
        }
    }

    bindEvents() {
        document.getElementById('game-board').addEventListener('click', (e) => {
            if (this.gameOver) return;
            
            const cell = e.target.closest('.cell');
            if (!cell) return;
            
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            
            if (this.board[row][col] !== null) return;
            
            this.placePiece(row, col);
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restart();
        });
    }

    placePiece(row, col) {
        this.board[row][col] = this.currentPlayer;
        this.renderBoard();
        
        if (this.checkWin(row, col)) {
            this.gameOver = true;
            document.getElementById('game-status').textContent = `${this.currentPlayer === 'black' ? '黑棋' : '白棋'}获胜！`;
        } else {
            this.switchPlayer();
        }
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        document.getElementById('current-player').textContent = this.currentPlayer === 'black' ? '黑棋' : '白棋';
    }

    checkWin(row, col) {
        const directions = [
            [0, 1],  // 水平
            [1, 0],  // 垂直
            [1, 1],  // 对角线 \\
            [1, -1]  // 对角线 /
        ];

        const player = this.board[row][col];
        
        for (let [dx, dy] of directions) {
            let count = 1; // 包括当前棋子
            
            // 向一个方向检查
            for (let i = 1; i < 5; i++) {
                const r = row + dx * i;
                const c = col + dy * i;
                if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize && this.board[r][c] === player) {
                    count++;
                } else {
                    break;
                }
            }
            
            // 向相反方向检查
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

    restart() {
        this.initBoard();
        this.currentPlayer = 'black';
        this.gameOver = false;
        document.getElementById('current-player').textContent = '黑棋';
        document.getElementById('game-status').textContent = '';
        this.renderBoard();
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new Gomoku();
});