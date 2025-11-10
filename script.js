// 五子棋游戏逻辑
document.addEventListener('DOMContentLoaded', () => {
    const BOARD_SIZE = 15;
    const board = [];
    let currentPlayer = 'black'; // 黑棋先行
    let gameOver = false;
    let gameBoard = document.getElementById('game-board');
    let currentPlayerDisplay = document.getElementById('current-player');
    let gameStatus = document.getElementById('game-status');
    let resetBtn = document.getElementById('reset-btn');

    // 初始化棋盘
    function initBoard() {
        gameBoard.innerHTML = '';
        gameBoard.style.width = BOARD_SIZE * 30 + 'px';
        gameBoard.style.height = BOARD_SIZE * 30 + 'px';

        for (let i = 0; i < BOARD_SIZE; i++) {
            board[i] = new Array(BOARD_SIZE).fill(null);
            let row = document.createElement('div');
            row.className = 'row';
            
            for (let j = 0; j < BOARD_SIZE; j++) {
                let cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                cell.addEventListener('click', () => handleCellClick(i, j));
                
                row.appendChild(cell);
            }
            
            gameBoard.appendChild(row);
        }
    }

    // 处理单元格点击事件
    function handleCellClick(row, col) {
        if (gameOver || board[row][col] !== null) {
            return; // 游戏结束或已有棋子时返回
        }

        // 放置棋子
        placePiece(row, col, currentPlayer);

        // 检查胜负
        if (checkWin(row, col, currentPlayer)) {
            gameOver = true;
            gameStatus.textContent = `${currentPlayer === 'black' ? '黑棋' : '白棋'} 获胜！`;
            gameStatus.className = 'game-status win';
        } else {
            // 切换玩家
            currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
            currentPlayerDisplay.textContent = currentPlayer === 'black' ? '黑棋' : '白棋';
        }
    }

    // 放置棋子
    function placePiece(row, col, player) {
        board[row][col] = player;
        
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        const piece = document.createElement('div');
        piece.className = `piece ${player}-piece`;
        cell.appendChild(piece);
    }

    // 检查胜负
    function checkWin(row, col, player) {
        // 四个方向：水平、垂直、左上-右下、右上-左下
        const directions = [
            [0, 1],   // 水平
            [1, 0],   // 垂直
            [1, 1],   // 左上到右下
            [1, -1]   // 右上到左下
        ];

        for (let [dx, dy] of directions) {
            let count = 1; // 当前棋子

            // 正方向计数
            count += countDirection(row, col, dx, dy, player);
            // 反方向计数
            count += countDirection(row, col, -dx, -dy, player);

            if (count >= 5) {
                return true;
            }
        }

        return false;
    }

    // 在某个方向上计数
    function countDirection(row, col, dx, dy, player) {
        let count = 0;
        let r = row + dx;
        let c = col + dy;

        while (
            r >= 0 &&
            r < BOARD_SIZE &&
            c >= 0 &&
            c < BOARD_SIZE &&
            board[r][c] === player
        ) {
            count++;
            r += dx;
            c += dy;
        }

        return count;
    }

    // 重新开始游戏
    function resetGame() {
        gameOver = false;
        currentPlayer = 'black';
        currentPlayerDisplay.textContent = '黑棋';
        gameStatus.textContent = '';
        gameStatus.className = 'game-status';
        initBoard();
    }

    // 事件监听器
    resetBtn.addEventListener('click', resetGame);

    // 初始化游戏
    initBoard();
});