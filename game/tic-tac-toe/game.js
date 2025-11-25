class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.score = { X: 0, O: 0 };
        
        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
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
    }
    
    attachEventListeners() {
        this.cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });
        
        this.resetBtn.addEventListener('click', () => this.resetGame());
    }
    
    handleCellClick(index) {
        if (this.board[index] !== '' || !this.gameActive) {
            return;
        }
        
        this.makeMove(index);
    }
    
    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.updateCellDisplay(index);
        
        if (this.checkWinner()) {
            this.handleWin();
        } else if (this.checkDraw()) {
            this.handleDraw();
        } else {
            this.switchPlayer();
        }
    }
    
    updateCellDisplay(index) {
        const cell = this.cells[index];
        cell.textContent = this.currentPlayer;
        cell.classList.add(this.currentPlayer.toLowerCase());
    }
    
    checkWinner() {
        for (const combination of this.winningCombinations) {
            const [a, b, c] = combination;
            if (this.board[a] && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                this.winningCombination = combination;
                return true;
            }
        }
        return false;
    }
    
    checkDraw() {
        return this.board.every(cell => cell !== '');
    }
    
    handleWin() {
        this.gameActive = false;
        this.score[this.currentPlayer]++;
        this.highlightWinningCells();
        this.gameStatus.textContent = `玩家 ${this.currentPlayer} 获胜！`;
        this.updateScoreDisplay();
    }
    
    handleDraw() {
        this.gameActive = false;
        this.gameStatus.textContent = '平局！';
    }
    
    highlightWinningCells() {
        this.winningCombination.forEach(index => {
            this.cells[index].classList.add('winner');
        });
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateDisplay();
    }
    
    updateDisplay() {
        this.currentPlayerDisplay.textContent = this.currentPlayer;
    }
    
    updateScoreDisplay() {
        this.scoreXDisplay.textContent = this.score.X;
        this.scoreODisplay.textContent = this.score.O;
    }
    
    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.winningCombination = null;
        this.gameStatus.textContent = '';
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winner');
        });
        
        this.updateDisplay();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});