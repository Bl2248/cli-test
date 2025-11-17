document.addEventListener('DOMContentLoaded', () => {
    const BOARD_SIZE = 15;
    const board = [];
    let currentPlayer = 'black'; // 'black' or 'white'
    let gameOver = false;
    let lastMove = null; // 记录最后一步的位置

    const gameBoard = document.getElementById('game-board');
    const currentPlayerDisplay = document.getElementById('current-player');
    const gameStatus = document.getElementById('game-status');
    const restartBtn = document.getElementById('restart-btn');

    // 初始化棋盘
    function initBoard() {
        gameBoard.innerHTML = '';
        gameBoard.style.width = `${BOARD_SIZE * 30}px`;
        gameBoard.style.height = `${BOARD_SIZE * 30}px`;

        for (let row = 0; row < BOARD_SIZE; row++) {
            board[row] = [];
            for (let col = 0; col < BOARD_SIZE; col++) {
                board[row][col] = null;
                
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
        if (gameOver || board[row][col] !== null) {
            return; // 游戏结束或位置已被占用
        }

        // 放置棋子
        board[row][col] = currentPlayer;
        updateCellDisplay(row, col);

        // 更新最后一步的位置
        if (lastMove) {
            const lastCell = document.querySelector(`.cell[data-row="${lastMove.row}"][data-col="${lastMove.col}"]`);
            lastCell.classList.remove('last-move');
        }
        const currentCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        currentCell.classList.add('last-move');
        lastMove = { row, col };

        // 检查胜负
        if (checkWin(row, col)) {
            gameOver = true;
            gameStatus.textContent = `${currentPlayer === 'black' ? '黑棋' : '白棋'} 获胜！`;
            gameStatus.className = 'game-status win-message';
            return;
        }

        // 检查是否平局（棋盘满了）
        if (checkDraw()) {
            gameOver = true;
            gameStatus.textContent = '平局！';
            return;
        }

        // 切换玩家
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
        currentPlayerDisplay.textContent = currentPlayer === 'black' ? '黑棋' : '白棋';
    }

    // 更新单元格显示
    function updateCellDisplay(row, col) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.innerHTML = ''; // 清空内容
        
        if (board[row][col] === 'black') {
            const blackPiece = document.createElement('div');
            blackPiece.className = 'black-piece';
            cell.appendChild(blackPiece);
        } else if (board[row][col] === 'white') {
            const whitePiece = document.createElement('div');
            whitePiece.className = 'white-piece';
            cell.appendChild(whitePiece);
        }
    }

    // 检查胜负
    function checkWin(row, col) {
        const player = board[row][col];
        
        // 四个方向：水平、垂直、对角线（左上到右下、右上到左下）
        const directions = [
            [0, 1],  // 水平
            [1, 0],  // 垂直
            [1, 1],  // 对角线1
            [1, -1]  // 对角线2
        ];

        for (const [dx, dy] of directions) {
            let count = 1; // 当前棋子
            
            // 正向检查
            let r = row + dx;
            let c = col + dy;
            while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
                count++;
                r += dx;
                c += dy;
            }
            
            // 反向检查
            r = row - dx;
            c = col - dy;
            while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
                count++;
                r -= dx;
                c -= dy;
            }
            
            if (count >= 5) {
                return true;
            }
        }
        
        return false;
    }

    // 检查平局
    function checkDraw() {
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if (board[row][col] === null) {
                    return false;
                }
            }
        }
        return true;
    }

    // 重新开始游戏
    function restartGame() {
        currentPlayer = 'black';
        gameOver = false;
        lastMove = null;
        
        currentPlayerDisplay.textContent = '黑棋';
        gameStatus.textContent = '';
        gameStatus.className = 'game-status';
        
        initBoard();
    }

    // 初始化游戏
    initBoard();
    
    // 重新开始按钮事件
    restartBtn.addEventListener('click', restartGame);
});