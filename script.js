// 游戏状态管理
let currentPlayer = 'black'; // 当前玩家 ('black' 或 'white')
let gameBoard = Array(15).fill().map(() => Array(15).fill(null)); // 15x15的棋盘
let gameOver = false; // 游戏是否结束

// 初始化棋盘
function initBoard() {
    const gameBoardElement = document.getElementById('game-board');
    gameBoardElement.innerHTML = '';
    
    for (let row = 0; row < 15; row++) {
        for (let col = 0; col < 15; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            cell.addEventListener('click', () => handleCellClick(row, col));
            
            gameBoardElement.appendChild(cell);
        }
    }
}

// 处理点击事件
function handleCellClick(row, col) {
    if (gameOver || gameBoard[row][col] !== null) {
        return; // 游戏结束或该位置已有棋子，不作处理
    }
    
    // 放置棋子
    gameBoard[row][col] = currentPlayer;
    
    // 更新界面
    updateBoard();
    
    // 检查胜负
    if (checkWin(row, col)) {
        setTimeout(() => {
            alert(`${currentPlayer === 'black' ? '黑子' : '白子'} 获胜！`);
            gameOver = true;
        }, 10);
        return;
    }
    
    // 切换玩家
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    
    // 更新当前玩家显示
    updateCurrentPlayerDisplay();
}

// 更新棋盘显示
function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const pieceValue = gameBoard[row][col];
        
        // 清除之前的棋子
        const existingPiece = cell.querySelector('.piece');
        if (existingPiece) {
            cell.removeChild(existingPiece);
        }
        
        // 添加新的棋子
        if (pieceValue !== null) {
            const piece = document.createElement('div');
            piece.className = `piece ${pieceValue}-piece`;
            cell.appendChild(piece);
        }
    });
}

// 更新当前玩家显示
function updateCurrentPlayerDisplay() {
    const currentPlayerElement = document.getElementById('current-player');
    currentPlayerElement.textContent = currentPlayer === 'black' ? '黑子' : '白子';
}

// 检查是否获胜
function checkWin(row, col) {
    const player = gameBoard[row][col];
    
    // 检查四个方向：水平、垂直、对角线（左上到右下、右上到左下）
    const directions = [
        [0, 1],  // 水平
        [1, 0],  // 垂直
        [1, 1],  // 左上到右下
        [1, -1]  // 右上到左下
    ];
    
    for (const [dx, dy] of directions) {
        let count = 1; // 当前棋子
        
        // 正向检查
        for (let i = 1; i <= 4; i++) {
            const newRow = row + i * dx;
            const newCol = col + i * dy;
            
            if (
                newRow >= 0 && newRow < 15 && 
                newCol >= 0 && newCol < 15 && 
                gameBoard[newRow][newCol] === player
            ) {
                count++;
            } else {
                break;
            }
        }
        
        // 反向检查
        for (let i = 1; i <= 4; i++) {
            const newRow = row - i * dx;
            const newCol = col - i * dy;
            
            if (
                newRow >= 0 && newRow < 15 && 
                newCol >= 0 && newCol < 15 && 
                gameBoard[newRow][newCol] === player
            ) {
                count++;
            } else {
                break;
            }
        }
        
        if (count >= 5) {
            return true; // 找到获胜条件
        }
    }
    
    return false; // 没有获胜
}

// 重置游戏
function resetGame() {
    gameBoard = Array(15).fill().map(() => Array(15).fill(null));
    currentPlayer = 'black';
    gameOver = false;
    
    updateBoard();
    updateCurrentPlayerDisplay();
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    initBoard();
    updateCurrentPlayerDisplay();
    
    // 绑定重置按钮事件
    document.getElementById('reset-btn').addEventListener('click', resetGame);
});