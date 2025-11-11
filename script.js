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
            gameBoard.appendChild(row);
        }
    }

    bindEvents() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.addEventListener('click', (e) => {
            if (this.gameOver) return;
            
            const cell = e.target.closest('.cell');
            if (!cell) return;
            
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            
            this.placeStone(row, col);
        });

        const resetBtn = document.getElementById('reset-btn');
        resetBtn.addEventListener('click', () => {
            this.resetGame();
        });
    }

    placeStone(row, col) {
        if (this.board[row][col] !== null) return;
        if (this.gameOver) return;

        // 在棋盘上放置棋子
        this.board[row][col] = this.currentPlayer;
        
        // 在界面上显示棋子
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        const stone = document.createElement('div');
        stone.className = `stone ${this.currentPlayer}`;
        cell.appendChild(stone);

        // 检查是否获胜
        if (this.checkWin(row, col)) {
            this.gameOver = true;
            document.getElementById('result').textContent = `${this.currentPlayer === 'black' ? '黑子' : '白子'}获胜！`;
            document.getElementById('result').className = 'result win';
            return;
        }

        // 检查是否平局
        if (this.checkDraw()) {
            this.gameOver = true;
            document.getElementById('result').textContent = '平局！';
            document.getElementById('result').className = 'result';
            return;
        }

        // 切换玩家
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        document.getElementById('current-player').textContent = this.currentPlayer === 'black' ? '黑子' : '白子';
        document.getElementById('current-player').className = this.currentPlayer;
    }

    checkWin(row, col) {
        const directions = [
            [0, 1],   // 水平
            [1, 0],   // 垂直
            [1, 1],   // 对角线 \
            [1, -1]   // 对角线 /
        ];

        const player = this.board[row][col];

        for (let [dx, dy] of directions) {
            let count = 1; // 包含当前棋子

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

            // 如果连成5子则获胜
            if (count >= 5) {
                return true;
            }
        }

        return false;
    }

    checkDraw() {
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (this.board[i][j] === null) {
                    return false;
                }
            }
        }
        return true;
    }

    resetGame() {
        this.board = [];
        this.currentPlayer = 'black';
        this.gameOver = false;
        document.getElementById('current-player').textContent = '黑子';
        document.getElementById('current-player').className = 'black';
        document.getElementById('result').textContent = '';
        document.getElementById('result').className = 'result';
        this.initBoard();
        this.renderBoard();
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new Gomoku();
});