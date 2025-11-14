const canvas = document.getElementById('chessboard');
const ctx = canvas.getContext('2d');
const statusDisplay = document.getElementById('game-status');
const restartBtn = document.getElementById('restart-btn');

// 棋盘设置
const GRID_SIZE = 15;
const CELL_SIZE = canvas.width / (GRID_SIZE - 1);
const board = new Array(GRID_SIZE).fill(0).map(() => new Array(GRID_SIZE).fill(0));
let currentPlayer = 1; // 1 代表黑棋，2 代表白棋
let gameActive = true;

// 绘制棋盘
function drawBoard() {
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
    
    // 绘制棋子
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (board[row][col] !== 0) {
                drawPiece(row, col, board[row][col]);
            }
        }
    }
}

// 绘制棋子
function drawPiece(row, col, player) {
    const x = col * CELL_SIZE;
    const y = row * CELL_SIZE;
    const radius = CELL_SIZE / 2 - 2;
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    
    if (player === 1) {
        // 黑棋
        ctx.fillStyle = 'black';
    } else {
        // 白棋
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
    }
    
    ctx.fill();
    
    if (player === 2) {
        ctx.stroke();
    }
}

// 检查是否获胜
function checkWin(row, col, player) {
    // 检查四个方向：水平、垂直、两个对角线
    const directions = [
        [0, 1],  // 水平
        [1, 0],  // 垂直
        [1, 1],  // 对角线 \
        [1, -1]  // 对角线 /
    ];
    
    for (const [dx, dy] of directions) {
        let count = 1; // 包括当前棋子
        
        // 向一个方向检查
        for (let i = 1; i < 5; i++) {
            const newRow = row + dx * i;
            const newCol = col + dy * i;
            
            if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE && 
                board[newRow][newCol] === player) {
                count++;
            } else {
                break;
            }
        }
        
        // 向相反方向检查
        for (let i = 1; i < 5; i++) {
            const newRow = row - dx * i;
            const newCol = col - dy * i;
            
            if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE && 
                board[newRow][newCol] === player) {
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

// 处理点击事件
canvas.addEventListener('click', (e) => {
    if (!gameActive) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 计算点击的网格位置
    const col = Math.round(x / CELL_SIZE);
    const row = Math.round(y / CELL_SIZE);
    
    // 检查位置是否有效且未被占用
    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE && board[row][col] === 0) {
        // 放置棋子
        board[row][col] = currentPlayer;
        drawBoard();
        
        // 检查是否获胜
        if (checkWin(row, col, currentPlayer)) {
            gameActive = false;
            statusDisplay.textContent = `玩家 ${currentPlayer === 1 ? '黑棋' : '白棋'} 获胜!`;
            return;
        }
        
        // 切换玩家
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        statusDisplay.textContent = `当前玩家: ${currentPlayer === 1 ? '黑棋' : '白棋'}`;
    }
});

// 重新开始游戏
restartBtn.addEventListener('click', () => {
    // 重置棋盘状态
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            board[row][col] = 0;
        }
    }
    
    currentPlayer = 1;
    gameActive = true;
    statusDisplay.textContent = '当前玩家: 黑棋';
    drawBoard();
});

// 初始化棋盘
drawBoard();