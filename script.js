document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const currentPlayerDisplay = document.getElementById('current-player');
    const resetBtn = document.getElementById('reset-btn');
    
    const BOARD_SIZE = 15;
    let gameBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
    let currentPlayer = 1; // 1 for black, 2 for white
    let gameOver = false;
    
    // Initialize the board
    function initBoard() {
        board.innerHTML = '';
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                cell.addEventListener('click', () => handleCellClick(row, col));
                
                board.appendChild(cell);
            }
        }
    }
    
    // Handle cell click
    function handleCellClick(row, col) {
        if (gameOver || gameBoard[row][col] !== 0) return;
        
        // Update game board
        gameBoard[row][col] = currentPlayer;
        
        // Update UI
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        const piece = document.createElement('div');
        piece.className = `piece ${currentPlayer === 1 ? 'black' : 'white'}`;
        cell.appendChild(piece);
        
        // Check for win
        if (checkWin(row, col)) {
            gameOver = true;
            const winner = currentPlayer === 1 ? '黑子' : '白子';
            setTimeout(() => {
                alert(`${winner} 获胜！`);
            }, 100);
            return;
        }
        
        // Switch player
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        currentPlayerDisplay.textContent = currentPlayer === 1 ? '黑子' : '白子';
    }
    
    // Check for win condition
    function checkWin(row, col) {
        const player = gameBoard[row][col];
        
        // Directions: horizontal, vertical, diagonal (top-left to bottom-right), diagonal (top-right to bottom-left)
        const directions = [
            [0, 1],  // horizontal
            [1, 0],  // vertical
            [1, 1],  // diagonal \
            [1, -1]  // diagonal /
        ];
        
        for (const [dx, dy] of directions) {
            let count = 1; // Current piece
            
            // Check in positive direction
            for (let i = 1; i < 5; i++) {
                const newRow = row + i * dx;
                const newCol = col + i * dy;
                
                if (
                    newRow >= 0 && 
                    newRow < BOARD_SIZE && 
                    newCol >= 0 && 
                    newCol < BOARD_SIZE && 
                    gameBoard[newRow][newCol] === player
                ) {
                    count++;
                } else {
                    break;
                }
            }
            
            // Check in negative direction
            for (let i = 1; i < 5; i++) {
                const newRow = row - i * dx;
                const newCol = col - i * dy;
                
                if (
                    newRow >= 0 && 
                    newRow < BOARD_SIZE && 
                    newCol >= 0 && 
                    newCol < BOARD_SIZE && 
                    gameBoard[newRow][newCol] === player
                ) {
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
    
    // Reset game
    function resetGame() {
        gameBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
        currentPlayer = 1;
        gameOver = false;
        currentPlayerDisplay.textContent = '黑子';
        initBoard();
    }
    
    // Event listeners
    resetBtn.addEventListener('click', resetGame);
    
    // Initialize the game
    initBoard();
});