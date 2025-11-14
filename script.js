document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 15;
    const gameBoard = document.getElementById('gameBoard');
    const currentPlayerDisplay = document.getElementById('currentPlayer');
    const resetButton = document.getElementById('resetButton');
    
    let board = Array(boardSize).fill().map(() => Array(boardSize).fill(0));
    let currentPlayer = 1; // 1 for black, 2 for white
    let gameOver = false;
    
    // 创建棋盘
    function createBoard() {
        gameBoard.innerHTML = '';
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                cell.addEventListener('click', () => handleCellClick(row, col));
                
                gameBoard.appendChild(cell);
            }
        }
    }
    
    // 处理点击事件
    function handleCellClick(row, col) {
        if (gameOver || board[row][col] !== 0) return; // 游戏结束或已有棋子则返回
        
        // 放置棋子
        board[row][col] = currentPlayer;
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        const stone = document.createElement('div');
        stone.className = `stone ${currentPlayer === 1 ? 'black' : 'white'}`;
        cell.appendChild(stone);
        
        // 检查胜负
        if (checkWin(row, col)) {
            gameOver = true;
            const winner = currentPlayer === 1 ? '黑子' : '白子';
            setTimeout(() => {
                alert(`${winner} 获胜！`);
            }, 100);
            return;
        }
        
        // 切换玩家
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        currentPlayerDisplay.textContent = currentPlayer === 1 ? '黑子' : '白子';
    }
    
    // 检查胜负
    function checkWin(row, col) {
        const directions = [
            [0, 1],   // 水平
            [1, 0],   // 垂直
            [1, 1],   // 对角线 \\
            [1, -1]   // 对角线 /
        ];
        
        for (const [dx, dy] of directions) {
            let count = 1; // 当前棋子
            
            // 正向计数
            for (let i = 1; i < 5; i++) {
                const newRow = row + i * dx;
                const newCol = col + i * dy;
                if (newRow >= 0 && newRow < boardSize && 
                    newCol >= 0 && newCol < boardSize && 
                    board[newRow][newCol] === currentPlayer) {
                    count++;
                } else {
                    break;
                }
            }
            
            // 反向计数
            for (let i = 1; i < 5; i++) {
                const newRow = row - i * dx;
                const newCol = col - i * dy;
                if (newRow >= 0 && newRow < boardSize && 
                    newCol >= 0 && newCol < boardSize && 
                    board[newRow][newCol] === currentPlayer) {
                    count++;
                } else {
                    break;
                }
            }
            
            if (count >= 5) return true;
        }
        
        return false;
    }
    
    // 重置游戏
    resetButton.addEventListener('click', () => {
        board = Array(boardSize).fill().map(() => Array(boardSize).fill(0));
        currentPlayer = 1;
        gameOver = false;
        currentPlayerDisplay.textContent = '黑子';
        createBoard();
    });
    
    // 初始化游戏
    createBoard();
});