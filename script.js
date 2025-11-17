class Gomoku {
    constructor() {
        this.boardSize = 15;
        this.cellSize = 32;
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0));
        this.currentPlayer = 1; // 1为黑子，2为白子
        this.gameOver = false;
        
        this.canvas = document.getElementById('chessboard');
        this.ctx = this.canvas.getContext('2d');
        this.currentPlayerSpan = document.getElementById('current-player');
        this.restartBtn = document.getElementById('restart-btn');
        
        this.drawBoard();
        this.addEventListeners();
    }
    
    drawBoard() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制棋盘网格
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.boardSize; i++) {
            // 垂直线
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.cellSize + this.cellSize/2, this.cellSize/2);
            this.ctx.lineTo(i * this.cellSize + this.cellSize/2, this.canvas.height - this.cellSize/2);
            this.ctx.stroke();
            
            // 水平线
            this.ctx.beginPath();
            this.ctx.moveTo(this.cellSize/2, i * this.cellSize + this.cellSize/2);
            this.ctx.lineTo(this.canvas.width - this.cellSize/2, i * this.cellSize + this.cellSize/2);
            this.ctx.stroke();
        }
        
        // 绘制已有棋子
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] !== 0) {
                    this.drawPiece(row, col, this.board[row][col]);
                }
            }
        }
    }
    
    drawPiece(row, col, player) {
        const x = col * this.cellSize + this.cellSize/2;
        const y = row * this.cellSize + this.cellSize/2;
        const radius = this.cellSize/2 - 2;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = player === 1 ? '#000' : '#fff';
        this.ctx.fill();
        this.ctx.strokeStyle = '#000';
        this.ctx.stroke();
    }
    
    addEventListeners() {
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        this.restartBtn.addEventListener('click', () => this.restartGame());
    }
    
    handleCanvasClick(e) {
        if (this.gameOver) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const col = Math.round((x - this.cellSize/2) / this.cellSize);
        const row = Math.round((y - this.cellSize/2) / this.cellSize);
        
        if (row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize) {
            if (this.board[row][col] === 0) {
                this.board[row][col] = this.currentPlayer;
                this.drawPiece(row, col, this.currentPlayer);
                
                if (this.checkWin(row, col)) {
                    this.gameOver = true;
                    const winner = this.currentPlayer === 1 ? '黑子' : '白子';
                    setTimeout(() => alert(`游戏结束，${winner}获胜！`), 100);
                    return;
                }
                
                this.switchPlayer();
            }
        }
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
            [1, 1],  // 对角线 \
            [1, -1]  // 对角线 /
        ];
        
        for (let [dx, dy] of directions) {
            let count = 1; // 包含当前棋子
            
            // 正方向计数
            for (let i = 1; i < 5; i++) {
                const r = row + dx * i;
                const c = col + dy * i;
                if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize && this.board[r][c] === player) {
                    count++;
                } else {
                    break;
                }
            }
            
            // 反方向计数
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
    
    restartGame() {
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0));
        this.currentPlayer = 1;
        this.gameOver = false;
        this.currentPlayerSpan.textContent = '黑子';
        this.drawBoard();
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new Gomoku();
});