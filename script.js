// 游戏状态
let currentPlayer = 'black'; // 当前玩家
const boardSize = 15;
let board = Array(boardSize).fill().map(() => Array(boardSize).fill(null));
let gameOver = false;

// 初始化棋盘
function initChessboard() {
    const chessboard = document.getElementById('chessboard');
    chessboard.innerHTML = '';
    
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            cell.addEventListener('click', () => handleCellClick(row, col));
            
            chessboard.appendChild(cell);
        }
    }
}

// 处理点击事件
function handleCellClick(row, col) {
    if (gameOver || board[row][col] !== null) {
        return; // 游戏结束或已有棋子，不处理
    }
    
    // 放置棋子
    board[row][col] = currentPlayer;
    updateCell(row, col);
    
    // 检查是否获胜
    if (checkWin(row, col)) {
        document.getElementById('game-status').textContent = `游戏结束: ${currentPlayer} 获胜!`;
        gameOver = true;
        return;
    }
    
    // 切换玩家
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    document.getElementById('game-status').textContent = `当前玩家: ${currentPlayer}`;
}

// 更新单元格显示
function updateCell(row, col) {
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    const piece = document.createElement('div');
    piece.className = `piece ${currentPlayer}`;
    cell.appendChild(piece);
}

// 检查是否获胜
function checkWin(row, col) {
    const player = board[row][col];
    
    // 检查四个方向：水平、垂直、左上到右下、右上到左下
    const directions = [
        [[0, 1], [0, -1]], // 水平
        [[1, 0], [-1, 0]], // 垂直
        [[1, 1], [-1, -1]], // 右下-左上
        [[1, -1], [-1, 1]]  // 左下-右上
    ];
    
    for (const [dir1, dir2] of directions) {
        let count = 1; // 当前棋子
        
        // 沿着第一个方向检查
        let r = row + dir1[0];
        let c = col + dir1[1];
        while (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === player) {
            count++;
            r += dir1[0];
            c += dir1[1];
        }
        
        // 沿着第二个方向检查
        r = row + dir2[0];
        c = col + dir2[1];
        while (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === player) {
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

// 重新开始游戏
function restartGame() {
    currentPlayer = 'black';
    board = Array(boardSize).fill().map(() => Array(boardSize).fill(null));
    gameOver = false;
    document.getElementById('game-status').textContent = `当前玩家: ${currentPlayer}`;
    initChessboard();
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    initChessboard();
    
    // 添加重新开始按钮事件
    document.getElementById('restart-btn').addEventListener('click', restartGame);
});