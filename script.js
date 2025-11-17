document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 15;
    const board = [];
    let currentPlayer = 'black';
    let gameOver = false;
    let winningStones = [];
    let gameBoardElement = document.getElementById('game-board');
    let currentPlayerElement = document.getElementById('current-player');
    let gameStatusElement = document.getElementById('game-status');
    let resetButton = document.getElementById('reset-btn');

    // 初始化棋盘
    function initBoard() {
        gameBoardElement.innerHTML = '';
        gameBoardElement.style.gridTemplateColumns = `repeat(${boardSize}, 30px)`;
        
        // 重置游戏状态
        winningStones = [];
        gameOver = false;
        gameStatusElement.textContent = '';
        gameStatusElement.className = 'game-status';
        
        for (let i = 0; i < boardSize; i++) {
            board[i] = [];
            for (let j = 0; j < boardSize; j++) {
                board[i][j] = null;
                
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                cell.addEventListener('click', () => handleCellClick(i, j));
                
                gameBoardElement.appendChild(cell);
            }
        }
    }

    // 处理点击事件
    function handleCellClick(row, col) {
        if (gameOver || board[row][col] !== null) {
            return;
        }
        
        // 放置棋子
        board[row][col] = currentPlayer;
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        const piece = document.createElement('div');
        piece.className = `piece ${currentPlayer}-piece`;
        cell.appendChild(piece);
        
        // 检查胜利条件
        const winResult = checkWin(row, col);
        if (winResult.isWin) {
            gameOver = true;
            winningStones = winResult.stones;
            highlightWinningStones();
            gameStatusElement.textContent = `${currentPlayer === 'black' ? '黑子' : '白子'} 获胜！`;
            gameStatusElement.className = 'game-status win';
            return;
        }
        
        // 检查平局
        if (checkDraw()) {
            gameOver = true;
            gameStatusElement.textContent = '平局！';
            return;
        }
        
        // 切换玩家
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
        currentPlayerElement.textContent = currentPlayer === 'black' ? '黑子' : '白子';
    }

    // 检查胜利条件
    function checkWin(row, col) {
        const directions = [
            [0, 1],   // 水平
            [1, 0],   // 垂直
            [1, 1],   // 对角线 \
            [1, -1]   // 对角线 /
        ];
        
        for (const [dx, dy] of directions) {
            let count = 1; // 当前位置算一个
            let stones = [[row, col]]; // 记录获胜棋子
            
            // 正向计数
            for (let i = 1; i < 5; i++) {
                const newRow = row + i * dx;
                const newCol = col + i * dy;
                
                if (
                    newRow >= 0 && newRow < boardSize &&
                    newCol >= 0 && newCol < boardSize &&
                    board[newRow][newCol] === currentPlayer
                ) {
                    count++;
                    stones.push([newRow, newCol]);
                } else {
                    break;
                }
            }
            
            // 反向计数
            for (let i = 1; i < 5; i++) {
                const newRow = row - i * dx;
                const newCol = col - i * dy;
                
                if (
                    newRow >= 0 && newRow < boardSize &&
                    newCol >= 0 && newCol < boardSize &&
                    board[newRow][newCol] === currentPlayer
                ) {
                    count++;
                    stones.push([newRow, newCol]);
                } else {
                    break;
                }
            }
            
            if (count >= 5) {
                return { isWin: true, stones: stones };
            }
        }
        
        return { isWin: false, stones: [] };
    }

    // 检查平局
    function checkDraw() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j] === null) {
                    return false;
                }
            }
        }
        return true;
    }

    // 高亮获胜棋子
    function highlightWinningStones() {
        winningStones.forEach(([row, col]) => {
            const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
            const piece = cell.querySelector('.piece');
            if (piece) {
                piece.style.boxShadow = '0 0 10px 3px gold';
                piece.style.zIndex = '2';
            }
        });
    }

    // 重置游戏
    function resetGame() {
        currentPlayer = 'black';
        gameOver = false;
        currentPlayerElement.textContent = '黑子';
        gameStatusElement.textContent = '';
        gameStatusElement.className = 'game-status';
        initBoard();
    }

    // 绑定重置按钮事件
    resetButton.addEventListener('click', resetGame);

    // 初始化游戏
    initBoard();
});