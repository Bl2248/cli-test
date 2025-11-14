document.addEventListener('DOMContentLoaded', () => {
    // 游戏参数
    const BOARD_SIZE = 15;
    const CELL_SIZE = 30;
    let board = [];
    let currentPlayer = 1; // 1: 黑棋, 2: 白棋
    let gameOver = false;
    let lastMove = null; // 记录最后一步棋的位置

    // DOM元素
    const gameBoard = document.getElementById('game-board');
    const currentPlayerDisplay = document.getElementById('current-player');
    const gameStatus = document.getElementById('game-status');
    const restartBtn = document.getElementById('restart-btn');

    // 初始化棋盘
    function initBoard() {
        board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
        gameBoard.innerHTML = '';
        gameBoard.style.width = `${BOARD_SIZE * CELL_SIZE}px`;
        gameBoard.style.height = `${BOARD_SIZE * CELL_SIZE}px`;

        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
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
        if (gameOver || board[row][col] !== 0) {
            return; // 游戏结束或已有棋子，不执行操作
        }

        // 放置棋子
        board[row][col] = currentPlayer;
        
        // 更新UI
        updateBoardUI(row, col);
        
        // 检查胜负
        if (checkWin(row, col)) {
            gameOver = true;
            const winner = currentPlayer === 1 ? '黑棋' : '白棋';
            gameStatus.textContent = `${winner} 获胜！`;
            gameStatus.className = 'game-status win-status';
            return;
        }

        // 检查是否平局
        if (isBoardFull()) {
            gameOver = true;
            gameStatus.textContent = '平局！';
            return;
        }

        // 切换玩家
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateCurrentPlayerDisplay();
        
        // 记录最后一步
        lastMove = {row, col};
    }

    // 更新棋盘UI
    function updateBoardUI(row, col) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        const piece = document.createElement('div');
        piece.className = `piece ${currentPlayer === 1 ? 'black-piece' : 'white-piece'}`;
        cell.appendChild(piece);

        // 清除之前最后一步的标记
        if (lastMove) {
            const lastCell = document.querySelector(`.cell[data-row="${lastMove.row}"][data-col="${lastMove.col}"]`);
            lastCell.classList.remove('last-move');
        }

        // 标记当前最后一步
        cell.classList.add('last-move');
    }

    // 更新当前玩家显示
    function updateCurrentPlayerDisplay() {
        currentPlayerDisplay.textContent = currentPlayer === 1 ? '黑棋' : '白棋';
    }

    // 检查胜负
    function checkWin(row, col) {
        const player = board[row][col];
        const directions = [
            [0, 1],   // 水平
            [1, 0],   // 垂直
            [1, 1],   // 对角线 \\
            [1, -1]   // 对角线 /
        ];

        for (const [dx, dy] of directions) {
            let count = 1; // 当前棋子

            // 正向计数
            let r = row + dx;
            let c = col + dy;
            while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
                count++;
                r += dx;
                c += dy;
            }

            // 反向计数
            r = row - dx;
            c = col - dy;
            while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
                count++;
                r -= dx;
                c -= dy;
            }

            // 五子连珠
            if (count >= 5) {
                return true;
            }
        }

        return false;
    }

    // 检查棋盘是否已满
    function isBoardFull() {
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if (board[row][col] === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    // 重新开始游戏
    function restartGame() {
        gameOver = false;
        currentPlayer = 1;
        lastMove = null;
        gameStatus.textContent = '';
        gameStatus.className = 'game-status';
        updateCurrentPlayerDisplay();
        initBoard();
    }

    // 事件监听器
    restartBtn.addEventListener('click', restartGame);

    // 初始化游戏
    initBoard();
    updateCurrentPlayerDisplay();
});