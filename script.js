document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 15;
    const board = [];
    let currentPlayer = 'black';
    let gameOver = false;
    let gameBoardElement = document.getElementById('game-board');
    let currentPlayerElement = document.getElementById('current-player');
    let gameStatusElement = document.getElementById('game-status');
    let restartBtn = document.getElementById('restart-btn');

    // 初始化棋盘数据
    function initBoard() {
        for (let i = 0; i < boardSize; i++) {
            board[i] = [];
            for (let j = 0; j < boardSize; j++) {
                board[i][j] = null;
            }
        }
    }

    // 创建棋盘界面
    function createBoard() {
        gameBoardElement.innerHTML = '';
        const boardGrid = document.createElement('div');
        boardGrid.className = 'board-grid';

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                cell.addEventListener('click', () => handleCellClick(i, j));
                
                boardGrid.appendChild(cell);
            }
        }

        gameBoardElement.appendChild(boardGrid);
    }

    // 处理单元格点击事件
    function handleCellClick(row, col) {
        if (gameOver || board[row][col] !== null) {
            return;
        }

        // 放置棋子
        board[row][col] = currentPlayer;
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add(currentPlayer);

        // 检查胜负
        if (checkWin(row, col)) {
            gameOver = true;
            gameStatusElement.textContent = `${currentPlayer === 'black' ? '黑棋' : '白棋'} 获胜！`;
            gameStatusElement.style.color = currentPlayer === 'black' ? '#000' : '#000';
            highlightWinningStones(row, col);
            return;
        }

        // 检查是否平局（棋盘满了）
        if (isBoardFull()) {
            gameOver = true;
            gameStatusElement.textContent = '平局！';
            return;
        }

        // 切换玩家
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
        currentPlayerElement.textContent = currentPlayer === 'black' ? '黑棋' : '白棋';
        currentPlayerElement.style.color = currentPlayer === 'black' ? '#000' : '#000';
    }

    // 检查胜负
    function checkWin(row, col) {
        const player = board[row][col];
        const directions = [
            [0, 1],   // 水平
            [1, 0],   // 垂直
            [1, 1],   // 对角线 \
            [1, -1]   // 对角线 /
        ];

        for (let [dx, dy] of directions) {
            let count = 1; // 当前位置的棋子

            // 正方向计数
            for (let i = 1; i < 5; i++) {
                const newRow = row + i * dx;
                const newCol = col + i * dy;
                if (
                    newRow >= 0 && 
                    newRow < boardSize && 
                    newCol >= 0 && 
                    newCol < boardSize && 
                    board[newRow][newCol] === player
                ) {
                    count++;
                } else {
                    break;
                }
            }

            // 反方向计数
            for (let i = 1; i < 5; i++) {
                const newRow = row - i * dx;
                const newCol = col - i * dy;
                if (
                    newRow >= 0 && 
                    newRow < boardSize && 
                    newCol >= 0 && 
                    newCol < boardSize && 
                    board[newRow][newCol] === player
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

    // 高亮显示获胜棋子
    function highlightWinningStones(row, col) {
        const player = board[row][col];
        const directions = [
            [0, 1],   // 水平
            [1, 0],   // 垂直
            [1, 1],   // 对角线 \
            [1, -1]   // 对角线 /
        ];

        for (let [dx, dy] of directions) {
            let winningStones = [[row, col]];
            let tempStones = [];

            // 正方向查找
            for (let i = 1; i < 5; i++) {
                const newRow = row + i * dx;
                const newCol = col + i * dy;
                if (
                    newRow >= 0 && 
                    newRow < boardSize && 
                    newCol >= 0 && 
                    newCol < boardSize && 
                    board[newRow][newCol] === player
                ) {
                    tempStones.push([newRow, newCol]);
                } else {
                    break;
                }
            }

            // 反方向查找
            for (let i = 1; i < 5; i++) {
                const newRow = row - i * dx;
                const newCol = col - i * dy;
                if (
                    newRow >= 0 && 
                    newRow < boardSize && 
                    newCol >= 0 && 
                    newCol < boardSize && 
                    board[newRow][newCol] === player
                ) {
                    tempStones.push([newRow, newCol]);
                } else {
                    break;
                }
            }

            // 如果连续棋子数量达到5个，则标记为获胜棋子
            if (1 + tempStones.length >= 5) {
                winningStones = winningStones.concat(tempStones);
                for (let [r, c] of winningStones) {
                    const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
                    cell.classList.add('winning-stone');
                }
                return;
            }
        }
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

    // 重新开始游戏
    function restartGame() {
        initBoard();
        gameOver = false;
        currentPlayer = 'black';
        currentPlayerElement.textContent = '黑棋';
        currentPlayerElement.style.color = '#000';
        gameStatusElement.textContent = '';
        createBoard();
    }

    // 初始化游戏
    initBoard();
    createBoard();

    // 添加重新开始按钮事件
    restartBtn.addEventListener('click', restartGame);
});