document.addEventListener('DOMContentLoaded', () => {
    // 游戏常量
    const BOARD_SIZE = 15;
    const CELL_SIZE = 30; // 每个格子的像素大小
    const EMPTY = 0;
    const BLACK = 1;
    const WHITE = 2;
    
    // 游戏状态
    let board = [];
    let currentPlayer = BLACK;
    let gameOver = false;
    let gameBoardElement = null;
    let currentPlayerElement = null;
    let gameStatusElement = null;
    
    // 初始化游戏
    function initGame() {
        gameBoardElement = document.getElementById('game-board');
        currentPlayerElement = document.getElementById('current-player');
        gameStatusElement = document.getElementById('game-status');
        
        // 创建棋盘数据结构
        createBoard();
        
        // 创建棋盘DOM元素
        createBoardDOM();
        
        // 添加重新开始按钮事件
        document.getElementById('restart-btn').addEventListener('click', restartGame);
    }
    
    // 创建棋盘数据结构
    function createBoard() {
        board = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
            board[i] = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                board[i][j] = EMPTY;
            }
        }
    }
    
    // 创建棋盘DOM元素
    function createBoardDOM() {
        gameBoardElement.innerHTML = '';
        gameBoardElement.style.width = `${BOARD_SIZE * CELL_SIZE}px`;
        gameBoardElement.style.height = `${BOARD_SIZE * CELL_SIZE}px`;
        
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                // 设置格子位置
                cell.style.left = `${j * CELL_SIZE}px`;
                cell.style.top = `${i * CELL_SIZE}px`;
                cell.style.width = `${CELL_SIZE}px`;
                cell.style.height = `${CELL_SIZE}px`;
                
                // 添加点击事件
                cell.addEventListener('click', handleCellClick);
                
                gameBoardElement.appendChild(cell);
            }
        }
    }
    
    // 处理格子点击事件
    function handleCellClick(event) {
        if (gameOver) return;
        
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);
        
        // 如果该位置已经有棋子，则不执行任何操作
        if (board[row][col] !== EMPTY) return;
        
        // 放置棋子
        board[row][col] = currentPlayer;
        
        // 更新UI
        event.target.classList.add(currentPlayer === BLACK ? 'black' : 'white');
        
        // 检查是否获胜
        if (checkWin(row, col)) {
            gameOver = true;
            const winner = currentPlayer === BLACK ? '黑棋' : '白棋';
            gameStatusElement.textContent = `游戏结束！${winner}获胜！`;
            gameStatusElement.className = 'game-status winner';
            return;
        }
        
        // 检查是否平局
        if (isBoardFull()) {
            gameOver = true;
            gameStatusElement.textContent = '游戏结束！平局！';
            return;
        }
        
        // 切换玩家
        currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
        currentPlayerElement.textContent = currentPlayer === BLACK ? '黑棋' : '白棋';
    }
    
    // 检查是否获胜
    function checkWin(row, col) {
        const player = board[row][col];
        
        // 检查四个方向：水平、垂直、左上-右下、右上-左下
        const directions = [
            [0, 1],   // 水平
            [1, 0],   // 垂直
            [1, 1],   // 左上-右下
            [1, -1]   // 右上-左下
        ];
        
        for (const [dx, dy] of directions) {
            let count = 1; // 当前位置的棋子
            
            // 正向检查
            for (let i = 1; i < 5; i++) {
                const newRow = row + i * dx;
                const newCol = col + i * dy;
                
                if (
                    newRow >= 0 && 
                    newRow < BOARD_SIZE && 
                    newCol >= 0 && 
                    newCol < BOARD_SIZE && 
                    board[newRow][newCol] === player
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
                    newRow >= 0 && 
                    newRow < BOARD_SIZE && 
                    newCol >= 0 && 
                    newCol < BOARD_SIZE && 
                    board[newRow][newCol] === player
                ) {
                    count++;
                } else {
                    break;
                }
            }
            
            // 如果连成5个，则获胜
            if (count >= 5) {
                return true;
            }
        }
        
        return false;
    }
    
    // 检查棋盘是否已满
    function isBoardFull() {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (board[i][j] === EMPTY) {
                    return false;
                }
            }
        }
        return true;
    }
    
    // 重新开始游戏
    function restartGame() {
        gameOver = false;
        currentPlayer = BLACK;
        gameStatusElement.textContent = '';
        gameStatusElement.className = 'game-status';
        currentPlayerElement.textContent = '黑棋';
        
        // 重新创建棋盘
        createBoard();
        
        // 更新UI
        const cells = gameBoardElement.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('black', 'white');
        });
    }
    
    // 启动游戏
    initGame();
});