// 游戏状态变量
let board = [];
let currentPlayer = 'black';
let gameActive = true;

// 初始化棋盘
function initializeBoard() {
    const chessboard = document.getElementById('chessboard');
    chessboard.innerHTML = '';
    board = [];
    
    // 创建15x15的棋盘
    for (let i = 0; i < 15; i++) {
        board[i] = [];
        for (let j = 0; j < 15; j++) {
            board[i][j] = null;
            
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            
            cell.addEventListener('click', () => handleCellClick(i, j));
            chessboard.appendChild(cell);
        }
    }
}

// 处理单元格点击
function handleCellClick(row, col) {
    // 如果游戏结束或该位置已有棋子，则不处理
    if (!gameActive || board[row][col] !== null) {
        return;
    }
    
    // 放置棋子
    board[row][col] = currentPlayer;
    
    // 在界面上显示棋子
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    const piece = document.createElement('div');
    piece.className = `piece ${currentPlayer}`;
    cell.appendChild(piece);
    
    // 检查是否获胜
    if (checkWin(row, col)) {
        gameActive = false;
        alert(`${currentPlayer === 'black' ? '黑子' : '白子'}获胜！`);
        return;
    }
    
    // 切换玩家
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    document.getElementById('player').textContent = currentPlayer === 'black' ? '黑子' : '白子';
}

// 检查是否获胜
function checkWin(row, col) {
    const directions = [
        [0, 1],   // 水平
        [1, 0],   // 垂直
        [1, 1],   // 对角线 \
        [1, -1]   // 对角线 /
    ];
    
    for (let [dx, dy] of directions) {
        let count = 1;  // 包含当前棋子
        
        // 向一个方向检查
        for (let i = 1; i < 5; i++) {
            const r = row + dx * i;
            const c = col + dy * i;
            if (r >= 0 && r < 15 && c >= 0 && c < 15 && board[r][c] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        
        // 向相反方向检查
        for (let i = 1; i < 5; i++) {
            const r = row - dx * i;
            const c = col - dy * i;
            if (r >= 0 && r < 15 && c >= 0 && c < 15 && board[r][c] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        
        // 如果连续5个棋子，则获胜
        if (count >= 5) {
            return true;
        }
    }
    
    return false;
}

// 重新开始游戏
function restartGame() {
    currentPlayer = 'black';
    gameActive = true;
    document.getElementById('player').textContent = '黑子';
    initializeBoard();
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    // 绑定重新开始按钮事件
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    
    // 初始化棋盘
    initializeBoard();
});