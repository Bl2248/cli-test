const BOARD_SIZE = 15;
let currentPlayer = 'black';
let gameBoard = [];
let gameActive = true;
let moveHistory = []; // 记录走棋历史

// 初始化游戏
function initGame() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    
    // 初始化游戏板数据
    gameBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
    moveHistory = [];
    
    // 创建棋盘
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', () => handleCellClick(i, j));
            board.appendChild(cell);
        }
    }
    
    // 更新状态显示
    updateStatus();
}

// 处理点击事件
function handleCellClick(row, col) {
    // 如果游戏结束或该位置已有棋子，则不处理
    if (!gameActive || gameBoard[row][col]) return;
    
    // 在游戏板上放置棋子
    gameBoard[row][col] = currentPlayer;
    moveHistory.push({row, col, player: currentPlayer});
    
    // 更新UI
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    cell.classList.add(currentPlayer);
    
    // 检查是否获胜
    if (checkWin(row, col)) {
        gameActive = false;
        document.getElementById('current-player').textContent = `${currentPlayer === 'black' ? '黑子' : '白子'}获胜！`;
        return;
    }
    
    // 检查是否平局（棋盘满了）
    if (moveHistory.length === BOARD_SIZE * BOARD_SIZE) {
        gameActive = false;
        document.getElementById('current-player').textContent = '平局！';
        return;
    }
    
    // 切换玩家
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    updateStatus();
}

// 更新状态显示
function updateStatus() {
    document.getElementById('current-player').textContent = currentPlayer === 'black' ? '黑子' : '白子';
}

// 检查是否获胜
function checkWin(row, col) {
    const directions = [
        [0, 1],   // 水平
        [1, 0],   // 垂直
        [1, 1],   // 对角线 \\
        [1, -1]   // 对角线 /
    ];
    
    for (let [dx, dy] of directions) {
        let count = 1;  // 包括当前棋子
        
        // 向一个方向检查
        for (let i = 1; i < 5; i++) {
            const r = row + dx * i;
            const c = col + dy * i;
            if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && gameBoard[r][c] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        
        // 向相反方向检查
        for (let i = 1; i < 5; i++) {
            const r = row - dx * i;
            const c = col - dy * i;
            if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && gameBoard[r][c] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        
        // 如果连成5子，则获胜
        if (count >= 5) {
            return true;
        }
    }
    
    return false;
}

// 重置游戏
document.getElementById('reset-btn').addEventListener('click', () => {
    currentPlayer = 'black';
    gameActive = true;
    initGame();
});

// 初始化游戏
initGame();