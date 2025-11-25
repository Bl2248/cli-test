class TicTacToe {
    constructor() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scores = {
            X: 0,
            O: 0,
            draw: 0
        };
        
        this.winningConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        
        this.initializeElements();
        this.attachEventListeners();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.cells = document.querySelectorAll('.cell');
        this.statusDisplay = document.getElementById('status');
        this.restartBtn = document.getElementById('restartBtn');
        this.scoreXDisplay = document.getElementById('scoreX');
        this.scoreODisplay = document.getElementById('scoreO');
        this.scoreDrawDisplay = document.getElementById('scoreDraw');
    }
    
    attachEventListeners() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });
        
        this.restartBtn.addEventListener('click', () => this.restartGame());
    }
    
    handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        if (this.board[clickedCellIndex] !== '' || !this.gameActive) {
            return;
        }
        
        this.handleCellPlayed(clickedCell, clickedCellIndex);
        this.handleResultValidation();
    }
    
    handleCellPlayed(clickedCell, clickedCellIndex) {
        this.board[clickedCellIndex] = this.currentPlayer;
        clickedCell.textContent = this.currentPlayer;
        clickedCell.classList.add(this.currentPlayer.toLowerCase(), 'taken');
    }
    
    handleResultValidation() {
        let roundWon = false;
        let winningCells = [];
        
        for (let i = 0; i < this.winningConditions.length; i++) {
            const winCondition = this.winningConditions[i];
            const a = this.board[winCondition[0]];
            const b = this.board[winCondition[1]];
            const c = this.board[winCondition[2]];
            
            if (a === '' || b === '' || c === '') {
                continue;
            }
            
            if (a === b && b === c) {
                roundWon = true;
                winningCells = winCondition;
                break;
            }
        }
        
        if (roundWon) {
            this.handleWin(winningCells);
            return;
        }
        
        const roundDraw = !this.board.includes('');
        if (roundDraw) {
            this.handleDraw();
            return;
        }
        
        this.handlePlayerChange();
    }
    
    handleWin(winningCells) {
        this.gameActive = false;
        this.scores[this.currentPlayer]++;
        
        winningCells.forEach(index => {
            this.cells[index].classList.add('winner');
        });
        
        this.statusDisplay.textContent = `玩家 ${this.currentPlayer} 获胜！`;
        this.updateScoreDisplay();
    }
    
    handleDraw() {
        this.gameActive = false;
        this.scores.draw++;
        this.statusDisplay.textContent = '平局！';
        this.updateScoreDisplay();
    }
    
    handlePlayerChange() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateDisplay();
    }
    
    updateDisplay() {
        this.statusDisplay.textContent = `玩家 ${this.currentPlayer} 的回合`;
    }
    
    updateScoreDisplay() {
        this.scoreXDisplay.textContent = this.scores.X;
        this.scoreODisplay.textContent = this.scores.O;
        this.scoreDrawDisplay.textContent = this.scores.draw;
    }
    
    restartGame() {
        this.gameActive = true;
        this.currentPlayer = 'X';
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.statusDisplay.textContent = `玩家 ${this.currentPlayer} 的回合`;
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'taken', 'winner');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});