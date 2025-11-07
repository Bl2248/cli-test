const canvas = document.getElementById('chessboard');
const ctx = canvas.getContext('2d');
const currentPlayerSpan = document.getElementById('current-player');
const restartBtn = document.getElementById('restart-btn');
const winnerMessage = document.getElementById('winner-message');

// 棋盘配置
const GRID_SIZE = 15;
const CELL_SIZE = canvas.width / (GRID_SIZE - 1);
const chessboard = new Array(GRID_SIZE).fill(0).map(() => new Array(GRID_SIZE).fill(0));
let currentPlayer = 1; // 1 代表黑子，2 代表白子
let gameEnded = false;

// 绘制棋盘
function drawChessboard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制网格线
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < GRID_SIZE; i++) {
        // 垂直线
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.stroke();
        
        // 水平线
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
    }
    
    // 绘制现有棋子
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (chessboard[row][col] !== 0) {
                drawChessPiece(row, col, chessboard[row][col]);
            }
        }
    }
}

// 绘制棋子
function drawChessPiece(row, col, player) {
    const x = col * CELL_SIZE;
    const y = row * CELL_SIZE;
    const radius = CELL_SIZE / 2 - 2;
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    
    if (player === 1) {
        // 黑子
        ctx.fillStyle = '#000';
    } else {
        // 白子
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
    }
    
    ctx.fill();
    
    if (player === 2) {
        ctx.stroke();
    }
}

// 处理点击事件
canvas.addEventListener('click', (e) => {
    if (gameEnded) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const col = Math.round(x / CELL_SIZE);
    const row = Math.round(y / CELL_SIZE);
    
    // 检查位置是否有效且未被占用
    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE && chessboard[row][col] === 0) {
        // 放置棋子
        chessboard[row][col] = currentPlayer;
        drawChessboard();
        
        // 检查是否获胜
        if (checkWin(row, col, currentPlayer)) {
            gameEnded = true;
            const winner = currentPlayer === 1 ? '黑子' : '白子';
            winnerMessage.textContent = `${winner}获胜!`;
            winnerMessage.classList.remove('hidden');
            return;
        }
        
        // 切换玩家
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        currentPlayerSpan.textContent = currentPlayer === 1 ? '黑子' : '白子';
    }
});

// 检查胜利条件
function checkWin(row, col, player) {
    // 检查四个方向: 水平、垂直、两个对角线
    const directions = [
        [0, 1],   // 水平
        [1, 0],   // 垂直
        [1, 1],   // 主对角线
        [1, -1]   // 反对角线
    ];
    
    for (const [dx, dy] of directions) {
        let count = 1; // 包含当前棋子
        
        // 正向检查
        for (let i = 1; i < 5; i++) {
            const r = row + i * dx;
            const c = col + i * dy;
            if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && chessboard[r][c] === player) {
                count++;
            } else {
                break;
            }
        }
        
        // 反向检查
        for (let i = 1; i < 5; i++) {
            const r = row - i * dx;
            const c = col - i * dy;
            if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && chessboard[r][c] === player) {
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

// 重新开始游戏
restartBtn.addEventListener('click', () => {
    // 重置棋盘状态
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            chessboard[row][col] = 0;
        }
    }
    
    currentPlayer = 1;
    gameEnded = false;
    
    // 更新UI
    currentPlayerSpan.textContent = '黑子';
    winnerMessage.classList.add('hidden');
    
    // 重新绘制棋盘
    drawChessboard();
});

// 初始化棋盘
drawChessboard();