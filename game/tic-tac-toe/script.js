class TicTacToe {
    constructor() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.statusDisplay = document.getElementById('status');
        this.resetButton = document.getElementById('resetBtn');
        this.cells = document.querySelectorAll('.cell');
        
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
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });
        
        this.resetButton.addEventListener('click', () => this.resetGame());
        
        this.updateStatus();
    }
    
    handleCellClick(event) {
        const clickedCell = event.target;
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
        clickedCell.classList.add('taken', this.currentPlayer.toLowerCase());
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
            this.statusDisplay.textContent = `玩家 ${this.currentPlayer} 获胜！`;
            this.statusDisplay.style.color = '#28a745';
            this.gameActive = false;
            
            winningCells.forEach(index => {
                this.cells[index].classList.add('winner');
            });
            
            return;
        }
        
        const roundDraw = !this.board.includes('');
        if (roundDraw) {
            this.statusDisplay.textContent = '平局！';
            this.statusDisplay.style.color = '#ffc107';
            this.gameActive = false;
            return;
        }
        
        this.handlePlayerChange();
    }
    
    handlePlayerChange() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateStatus();
    }
    
    updateStatus() {
        if (this.gameActive) {
            this.statusDisplay.textContent = `玩家 ${this.currentPlayer} 的回合`;
            this.statusDisplay.style.color = this.currentPlayer === 'X' ? '#667eea' : '#764ba2';
        }
    }
    
    resetGame() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.statusDisplay.style.color = '#555';
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('taken', 'x', 'o', 'winner');
        });
        
        this.updateStatus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});