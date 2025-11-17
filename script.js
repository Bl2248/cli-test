class Gomoku {
    constructor() {
        this.boardSize = 15;
        this.board = [];
        this.currentPlayer = 'black';
        this.gameOver = false;
        this.cells = [];
        
        this.initializeBoard();
        this.createBoard();
        this.bindEvents();
    }
    
    initializeBoard() {
        for (let i = 0; i < this.boardSize; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.boardSize; j++) {
                this.board[i][j] = null;
            }
        }
    }
    
    createBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        
        // 设置棋盘尺寸
        const cellSize = 30;
        gameBoard.style.width = `${this.boardSize * cellSize}px`;
        gameBoard.style.height = `${this.boardSize * cellSize}px`;
        
        // 创建格子
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.style.width = `${cellSize}px`;
                cell.style.height = `${cellSize}px`;
                cell.style.left = `${j * cellSize}px`;
                cell.style.top = `${i * cellSize}px`;
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                gameBoard.appendChild(cell);
                this.cells.push(cell);
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
            
            this.makeMove(row, col);
        });
        
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetGame();
        });
    }
    
    makeMove(row, col) {
        // 检查位置是否为空
        if (this.board[row][col] !== null) return;
        
        // 放置棋子
        this.board[row][col] = this.currentPlayer;
        
        // 创建棋子元素
        const stone = document.createElement('div');
        stone.className = `stone ${this.currentPlayer}`;
        stone.dataset.row = row;
        stone.dataset.col = col;
        
        // 找到对应的格子并添加棋子
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.appendChild(stone);
        
        // 检查是否获胜
        if (this.checkWin(row, col)) {
            this.gameOver = true;
            document.getElementById('result').textContent = `${this.currentPlayer === 'black' ? '黑子' : '白子'}获胜！`;
            this.highlightWinningStones(row, col);
            return;
        }
        
        // 检查是否平局
        if (this.isBoardFull()) {
            this.gameOver = true;
            document.getElementById('result').textContent = '平局！';
            return;
        }
        
        // 切换玩家
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        document.getElementById('current-player').textContent = this.currentPlayer === 'black' ? '黑子' : '白子';
    }
    
    checkWin(row, col) {
        const player = this.board[row][col];
        if (!player) return false;
        
        // 检查四个方向：水平、垂直、两个对角线
        const directions = [
            [0, 1],   // 水平
            [1, 0],   // 垂直
            [1, 1],   // 主对角线
            [1, -1]   // 副对角线
        ];
        
        for (const [dx, dy] of directions) {
            let count = 1; // 包括当前棋子
            
            // 正向检查
            for (let i = 1; i < 5; i++) {
                const r = row + dx * i;
                const c = col + dy * i;
                if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize && this.board[r][c] === player) {
                    count++;
                } else {
                    break;
                }
            }
            
            // 反向检查
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
    
    getWinningStones(row, col) {
        const player = this.board[row][col];
        if (!player) return [];
        
        // 检查四个方向：水平、垂直、两个对角线
        const directions = [
            [0, 1],   // 水平
            [1, 0],   // 垂直
            [1, 1],   // 主对角线
            [1, -1]   // 副对角线
        ];
        
        for (const [dx, dy] of directions) {
            let winningStones = [{row, col}];
            
            // 正向检查
            for (let i = 1; i < 5; i++) {
                const r = row + dx * i;
                const c = col + dy * i;
                if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize && this.board[r][c] === player) {
                    winningStones.push({row: r, col: c});
                } else {
                    break;
                }
            }
            
            // 反向检查
            for (let i = 1; i < 5; i++) {
                const r = row - dx * i;
                const c = col - dy * i;
                if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize && this.board[r][c] === player) {
                    winningStones.push({row: r, col: c});
                } else {
                    break;
                }
            }
            
            // 如果连成5子则返回获胜棋子坐标
            if (winningStones.length >= 5) {
                // 只取连续的5个棋子
                return winningStones.slice(0, 5);
            }
        }
        
        return [];
    }
    
    highlightWinningStones(row, col) {
        const winningStones = this.getWinningStones(row, col);
        winningStones.forEach(({row, col}) => {
            const stone = document.querySelector(`.stone[data-row="${row}"][data-col="${col}"]`);
            if (stone) {
                stone.classList.add('winning-stone');
            }
        });
    }
    
    isBoardFull() {
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
        document.getElementById('result').textContent = '';
        
        this.initializeBoard();
        this.createBoard();
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new Gomoku();
});