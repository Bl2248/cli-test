document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 15;
    const board = [];
    let currentPlayer = 'black'; // 黑棋先行
    let gameOver = false;
    let gameBoardElement = document.getElementById('game-board');
    let currentPlayerElement = document.getElementById('current-player');
    let gameStatusElement = document.getElementById('game-status');
    let resetButton = document.getElementById('reset-btn');

    // 初始化棋盘数据
    function initializeBoard() {
        for (let i = 0; i < boardSize; i++) {
            board[i] = [];
            for (let j = 0; j < boardSize; j++) {
                board[i][j] = null;
            }
        }
    }

    // 创建棋盘UI
    function createBoard() {
        gameBoardElement.innerHTML = '';
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
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
            return; // 游戏结束或已有棋子则返回
        }

        // 放置棋子
        board[row][col] = currentPlayer;
        updateBoardUI();

        // 检查胜负
        if (checkWin(row, col)) {
            gameOver = true;
            gameStatusElement.textContent = `${currentPlayer === 'black' ? '黑棋' : '白棋'} 获胜！`;
            gameStatusElement.classList.add('winner-message');
        } else if (isBoardFull()) {
            gameOver = true;
            gameStatusElement.textContent = '平局！';
            gameStatusElement.classList.add('draw-message');
        } else {
            // 切换玩家
            currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
            currentPlayerElement.textContent = currentPlayer === 'black' ? '黑棋' : '白棋';
        }
    }

    // 更新棋盘UI
    function updateBoardUI() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            cell.innerHTML = ''; // 清空当前格子

            if (board[row][col] !== null) {
                const piece = document.createElement('div');
                piece.classList.add('piece', board[row][col]);
                cell.appendChild(piece);
            }
        });
    }

    // 检查胜负
    function checkWin(row, col) {
        const color = board[row][col];
        if (!color) return false;

        // 检查四个方向：水平、垂直、左上到右下、右上到左下
        const directions = [
            [[0, 1], [0, -1]],   // 水平
            [[1, 0], [-1, 0]],   // 垂直
            [[1, 1], [-1, -1]],  // 对角线1
            [[1, -1], [-1, 1]]   // 对角线2
        ];

        for (const [dir1, dir2] of directions) {
            let count = 1; // 当前棋子算一个

            // 沿着第一个方向检查
            let r = row + dir1[0];
            let c = col + dir1[1];
            while (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === color) {
                count++;
                r += dir1[0];
                c += dir1[1];
            }

            // 沿着第二个方向检查
            r = row + dir2[0];
            c = col + dir2[1];
            while (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === color) {
                count++;
                r += dir2[0];
                c += dir2[1];
            }

            if (count >= 5) {
                return true;
            }
        }

        return false;
    }

    // 检查棋盘是否已满
    function isBoardFull() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j] === null) {
                    return false;
                }
            }
        }
        return true;
    }

    // 重置游戏
    function resetGame() {
        initializeBoard();
        currentPlayer = 'black';
        gameOver = false;
        currentPlayerElement.textContent = '黑棋';
        gameStatusElement.textContent = '';
        gameStatusElement.classList.remove('winner-message', 'draw-message');
        updateBoardUI();
    }

    // 事件监听器
    resetButton.addEventListener('click', resetGame);

    // 初始化游戏
    initializeBoard();
    createBoard();
});