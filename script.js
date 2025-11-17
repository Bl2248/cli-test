class GomokuGame {
    constructor() {
        this.boardSize = 15;
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0));
        this.currentPlayer = 1; // 1代表黑子，2代表白子
        this.gameOver = false;
        this.gameBoard = document.getElementById('game-board');
        this.currentPlayerSpan = document.getElementById('current-player');
        this.resetBtn = document.getElementById('reset-btn');
        
        this.initBoard();
        this.bindEvents();
    }
    
    initBoard() {
        // 创建棋盘网格容器
        const grid = document.createElement('div');
        grid.className = 'game-board-grid';
        
        // 创建15x15的格子
        for (let i = 0; i < this.boardSize * this.boardSize; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            grid.appendChild(cell);
        }
        
        this.gameBoard.innerHTML = '';
        this.gameBoard.appendChild(grid);
    }
    
    bindEvents() {
        // 点击放置棋子
        this.gameBoard.addEventListener('click', (e) => {
            if (this.gameOver) return;
            
            const cell = e.target.closest('.cell');
            if (!cell) return;
            
            const index = parseInt(cell.dataset.index);
            const row = Math.floor(index / this.boardSize);
            const col = index % this.boardSize;
            
            this.placeStone(row, col);
        });
        
        // 重新开始游戏
        this.resetBtn.addEventListener('click', () => {
            this.resetGame();
        });
    }
    
    placeStone(row, col) {
        // 检查位置是否为空
        if (this.board[row][col] !== 0) return;
        
        // 放置棋子
        this.board[row][col] = this.currentPlayer;
        
        // 创建棋子元素
        const stone = document.createElement('div');
        stone.className = `stone ${this.currentPlayer === 1 ? 'black' : 'white'}`;
        
        // 找到对应的格子并添加棋子
        const index = row * this.boardSize + col;
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        cell.appendChild(stone);
        
        // 检查是否获胜
        if (this.checkWin(row, col)) {
            this.gameOver = true;
            setTimeout(() => {
                alert(`${this.currentPlayer === 1 ? '黑子' : '白子'}获胜！`);
            }, 100);
            return;
        }
        
        // 检查是否平局
        if (this.isBoardFull()) {
            this.gameOver = true;
            setTimeout(() => {
                alert('平局！');
            }, 100);
            return;
        }
        
        // 切换玩家
        this.switchPlayer();
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.currentPlayerSpan.textContent = this.currentPlayer === 1 ? '黑子' : '白子';
    }
    
    checkWin(row, col) {
        const player = this.board[row][col];
        const directions = [
            [0, 1],  // 水平
            [1, 0],  // 垂直
            [1, 1],  // 对角线
            [1, -1]  // 反对角线
        ];
        
        for (let [dx, dy] of directions) {
            let count = 1; // 包含当前棋子
            
            // 正方向检查
            for (let i = 1; i < 5; i++) {
                const r = row + dx * i;
                const c = col + dy * i;
                if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize && this.board[r][c] === player) {
                    count++;
                } else {
                    break;
                }
            }
            
            // 反方向检查
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
    
    isBoardFull() {
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === 0) {
                    return false;
                }
            }
        }
        return true;
    }
    
    resetGame() {
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0));
        this.currentPlayer = 1;
        this.gameOver = false;
        this.currentPlayerSpan.textContent = '黑子';
        this.initBoard();
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new GomokuGame();
});