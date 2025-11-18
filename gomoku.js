document.addEventListener('DOMContentLoaded', () => {
    const BOARD_SIZE = 15;
    const board = [];
    let currentPlayer = 'black';
    let gameOver = false;
    let gameBoardElement = document.getElementById('game-board');
    let currentPlayerElement = document.getElementById('current-player');
    let gameStatusElement = document.getElementById('game-status');
    let restartBtn = document.getElementById('restart-btn');

    // 初始化棋盘数据
    function initializeBoard() {
        for (let i = 0; i < BOARD_SIZE; i++) {
            board[i] = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                board[i][j] = null;
            }
        }
    }

    // 创建棋盘UI
    function createBoard() {
        gameBoardElement.innerHTML = '';
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
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
        const stone = document.createElement('div');
        stone.classList.add('stone', currentPlayer);
        cell.appendChild(stone);

        // 检查胜负
        if (checkWin(row, col)) {
            gameStatusElement.textContent = `${currentPlayer === 'black' ? '黑子' : '白子'} 获胜！`;
            gameOver = true;
        } else {
            // 切换玩家
            currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
            currentPlayerElement.textContent = currentPlayer === 'black' ? '黑子' : '白子';
        }
    }

    // 检查胜负
    function checkWin(row, col) {
        const directions = [
            [0, 1],   // 水平
            [1, 0],   // 垂直
            [1, 1],   // 对角线（右下）
            [1, -1]   // 对角线（左下）
        ];

        for (let [dx, dy] of directions) {
            let count = 1; // 包含当前棋子

            // 正向检查
            for (let i = 1; i < 5; i++) {
                const newRow = row + i * dx;
                const newCol = col + i * dy;
                if (
                    newRow >= 0 && newRow < BOARD_SIZE &&
                    newCol >= 0 && newCol < BOARD_SIZE &&
                    board[newRow][newCol] === currentPlayer
                ) {
                    count++;
                } else {
                    break;
                }
            }

            // 反向检查
            for (let i = 1; i < 5; i++) {
                const newRow = row - i * dx;
                const newCol = col - i * dy;
                if (
                    newRow >= 0 && newRow < BOARD_SIZE &&
                    newCol >= 0 && newCol < BOARD_SIZE &&
                    board[newRow][newCol] === currentPlayer
                ) {
                    count++;
                } else {
                    break;
                }
            }

            // 如果连成五子，则胜利
            if (count >= 5) {
                return true;
            }
        }

        return false;
    }

    // 重新开始游戏
    function restartGame() {
        initializeBoard();
        createBoard();
        currentPlayer = 'black';
        gameOver = false;
        currentPlayerElement.textContent = '黑子';
        gameStatusElement.textContent = '';
    }

    // 初始化游戏
    initializeBoard();
    createBoard();
    restartBtn.addEventListener('click', restartGame);
});