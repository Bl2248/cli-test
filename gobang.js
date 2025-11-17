document.addEventListener('DOMContentLoaded', () => {
    const BOARD_SIZE = 15;
    const board = [];
    let currentPlayer = 'black'; // 黑子先手
    let gameOver = false;
    let gameBoardElement = document.getElementById('game-board');
    let currentPlayerElement = document.getElementById('current-player');
    let gameStatusElement = document.getElementById('game-status');
    let resetButton = document.getElementById('reset-btn');

    // 初始化棋盘
    function initBoard() {
        // 清空现有棋盘
        gameBoardElement.innerHTML = '';
        gameBoardElement.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;
        
        // 创建二维数组表示棋盘状态
        for (let i = 0; i < BOARD_SIZE; i++) {
            board[i] = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
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
            return; // 游戏结束或该位置已有棋子则不处理
        }

        // 放置棋子
        board[row][col] = currentPlayer;
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add(currentPlayer);

        // 检查胜负
        if (checkWin(row, col)) {
            gameOver = true;
            gameStatusElement.textContent = `${currentPlayer === 'black' ? '黑子' : '白子'} 获胜！`;
            gameStatusElement.className = 'game-status win';
            return;
        }

        // 检查是否平局（棋盘满了）
        if (isBoardFull()) {
            gameOver = true;
            gameStatusElement.textContent = '平局！';
            gameStatusElement.className = 'game-status';
            return;
        }

        // 切换玩家
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
        currentPlayerElement.textContent = currentPlayer === 'black' ? '黑子' : '白子';
    }

    // 检查胜负
    function checkWin(row, col) {
        const directions = [
            [0, 1],   // 水平
            [1, 0],   // 垂直
            [1, 1],   // 对角线 \
            [1, -1]   // 对角线 /
        ];

        for (let [dx, dy] of directions) {
            let count = 1; // 当前棋子
            
            // 正方向计数
            for (let i = 1; i < 5; i++) {
                const newRow = row + i * dx;
                const newCol = col + i * dy;
                if (newRow >= 0 && newRow < BOARD_SIZE && 
                    newCol >= 0 && newCol < BOARD_SIZE && 
                    board[newRow][newCol] === currentPlayer) {
                    count++;
                } else {
                    break;
                }
            }
            
            // 反方向计数
            for (let i = 1; i < 5; i++) {
                const newRow = row - i * dx;
                const newCol = col - i * dy;
                if (newRow >= 0 && newRow < BOARD_SIZE && 
                    newCol >= 0 && newCol < BOARD_SIZE && 
                    board[newRow][newCol] === currentPlayer) {
                    count++;
                } else {
                    break;
                }
            }
            
            if (count >= 5) {
                return true; // 胜利
            }
        }
        
        return false;
    }

    // 检查棋盘是否已满
    function isBoardFull() {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (board[i][j] === null) {
                    return false;
                }
            }
        }
        return true;
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