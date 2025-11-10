// 游戏常量
const BOARD_SIZE = 15;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

// 游戏状态
let board = [];
let currentPlayer = BLACK;
let gameOver = false;
let gameBoardElement = document.getElementById('gameBoard');
let gameStatusElement = document.getElementById('gameStatus');
let resetButton = document.getElementById('resetButton');

// 初始化游戏
function initGame() {
    board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(EMPTY));
    currentPlayer = BLACK;
    gameOver = false;
    renderBoard();
    updateGameStatus();
}

// 渲染棋盘
function renderBoard() {
    gameBoardElement.innerHTML = '';
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // 添加点击事件
            cell.addEventListener('click', () => handleCellClick(row, col));
            
            gameBoardElement.appendChild(cell);
        }
    }
}

// 处理单元格点击
function handleCellClick(row, col) {
    if (gameOver || board[row][col] !== EMPTY) {
        return;
    }
    
    // 放置棋子
    board[row][col] = currentPlayer;
    
    // 更新UI
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    const piece = document.createElement('div');
    piece.className = `piece ${currentPlayer === BLACK ? 'black' : 'white'}`;
    cell.appendChild(piece);
    
    // 检查胜负
    if (checkWin(row, col)) {
        gameOver = true;
        gameStatusElement.textContent = `游戏结束: ${currentPlayer === BLACK ? '黑棋' : '白棋'} 获胜!`;
        return;
    }
    
    // 切换玩家
    currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
    updateGameStatus();
}

// 检查胜负
function checkWin(row, col) {
    const player = board[row][col];
    
    // 检查四个方向：水平、垂直、对角线（左上-右下，右上-左下）
    const directions = [
        [0, 1],  // 水平
        [1, 0],  // 垂直
        [1, 1],  // 左上到右下对角线
        [1, -1]  // 右上到左下对角线
    ];
    
    for (const [dx, dy] of directions) {
        let count = 1; // 包含当前棋子
        
        // 正向检查
        for (let i = 1; i < 5; i++) {
            const newRow = row + i * dx;
            const newCol = col + i * dy;
            
            if (
                newRow >= 0 && newRow < BOARD_SIZE &&
                newCol >= 0 && newCol < BOARD_SIZE &&
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
                newRow >= 0 && newRow < BOARD_SIZE &&
                newCol >= 0 && newCol < BOARD_SIZE &&
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

// 更新游戏状态显示
function updateGameStatus() {
    if (!gameOver) {
        gameStatusElement.textContent = `当前玩家: ${currentPlayer === BLACK ? '黑棋' : '白棋'}`;
    }
}

// 重置游戏
resetButton.addEventListener('click', initGame);

// 启动游戏
initGame();