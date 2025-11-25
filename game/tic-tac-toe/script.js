class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scoreX = 0;
        this.scoreO = 0;
        this.winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横线
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // 竖线
            [0, 4, 8], [2, 4, 6] // 对角线
        ];
        
        this.initializeElements();
        this.attachEventListeners();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.cells = document.querySelectorAll('.cell');
        this.currentPlayerDisplay = document.getElementById('currentPlayer');
        this.scoreXDisplay = document.getElementById('scoreX');
        this.scoreODisplay = document.getElementById('scoreO');
        this.gameStatus = document.getElementById('gameStatus');
        this.resetBtn = document.getElementById('resetBtn');
        this.clearScoreBtn = document.getElementById('clearScoreBtn');
        this.gameBoard = document.getElementById('gameBoard');
    }
    
    attachEventListeners() {
        this.cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });
        
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.clearScoreBtn.addEventListener('click', () => this.clearScore());
    }
    
    handleCellClick(index) {
        if (this.board[index] !== '' || !this.gameActive) {
            return;
        }
        
        this.board[index] = this.currentPlayer;
        this.updateCellDisplay(index);
        this.checkResult();
        
        if (this.gameActive) {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateDisplay();
        }
    }
    
    updateCellDisplay(index) {
        const cell = this.cells[index];
        cell.textContent = this.board[index];
        cell.classList.add(this.board[index].toLowerCase());
        
        if (!this.gameActive) {
            cell.classList.add('disabled');
        }
    }
    
    checkResult() {
        let roundWon = false;
        let winningCells = [];
        
        for (let i = 0; i < this.winningConditions.length; i++) {
            const [a, b, c] = this.winningConditions[i];
            
            if (this.board[a] && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                roundWon = true;
                winningCells = [a, b, c];
                break;
            }
        }
        
        if (roundWon) {
            this.gameActive = false;
            this.updateScore();
            this.highlightWinningCells(winningCells);
            this.showGameStatus(`玩家 ${this.currentPlayer} 获胜！`, 'win');
            return;
        }
        
        if (!this.board.includes('')) {
            this.gameActive = false;
            this.showGameStatus('游戏平局！', 'draw');
            return;
        }
    }
    
    highlightWinningCells(winningCells) {
        winningCells.forEach(index => {
            this.cells[index].classList.add('winner');
        });
    }
    
    updateScore() {
        if (this.currentPlayer === 'X') {
            this.scoreX++;
        } else {
            this.scoreO++;
        }
        this.updateScoreDisplay();
    }
    
    updateScoreDisplay() {
        this.scoreXDisplay.textContent = this.scoreX;
        this.scoreODisplay.textContent = this.scoreO;
    }
    
    updateDisplay() {
        this.currentPlayerDisplay.textContent = this.currentPlayer;
        this.currentPlayerDisplay.className = this.currentPlayer.toLowerCase();
    }
    
    showGameStatus(message, type) {
        this.gameStatus.textContent = message;
        this.gameStatus.className = `game-status ${type}`;
        this.gameStatus.classList.remove('hidden');
    }
    
    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
        
        this.gameStatus.className = 'game-status hidden';
        this.updateDisplay();
    }
    
    clearScore() {
        this.scoreX = 0;
        this.scoreO = 0;
        this.updateScoreDisplay();
        this.resetGame();
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});

// 添加键盘支持
document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        const cell = document.querySelector(`[data-index="${index}"]`);
        if (cell && !cell.classList.contains('disabled')) {
            cell.click();
        }
    } else if (e.key === 'r' || e.key === 'R') {
        document.getElementById('resetBtn').click();
    } else if (e.key === 'c' || e.key === 'C') {
        document.getElementById('clearScoreBtn').click();
    }
});
