const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const messageElement = document.getElementById('message');
const currentPlayerElement = document.getElementById('current-player');
const restartButton = document.getElementById('restart');

// 棋盘设置
const GRID_SIZE = 15;
const CELL_SIZE = canvas.width / (GRID_SIZE - 1);
const BLACK = 'black';
const WHITE = 'white';

// 游戏状态
let board = [];
let currentPlayer = BLACK;
let gameOver = false;

// 初始化棋盘
function initializeBoard() {
    board = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null));
    currentPlayer = BLACK;
    gameOver = false;
    currentPlayerElement.textContent = '黑子';
    messageElement.textContent = '';
    messageElement.className = 'message';
    drawBoard();
}

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
    
    // 绘制现有棋子
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (board[row][col]) {
                drawPiece(row, col, board[row][col]);
            }
        }
    }
}

// 绘制棋子
function drawPiece(row, col, color) {
    const x = col * CELL_SIZE;
    const y = row * CELL_SIZE;
    const radius = CELL_SIZE / 2 - 2;
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.stroke();
    
    // 添加高光效果
    if (color === BLACK) {
        ctx.beginPath();
        ctx.arc(x - radius/3, y - radius/3, radius/4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.arc(x - radius/3, y - radius/3, radius/4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
    }
}

// 处理点击事件
canvas.addEventListener('click', (e) => {
    if (gameOver) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const col = Math.round(x / CELL_SIZE);
    const row = Math.round(y / CELL_SIZE);
    
    // 检查位置是否有效
    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE && !board[row][col]) {
        // 放置棋子
        board[row][col] = currentPlayer;
        drawBoard();
        
        // 检查胜利条件
        if (checkWin(row, col)) {
            gameOver = true;
            messageElement.textContent = `${currentPlayer === BLACK ? '黑子' : '白子'} 获胜!`;
            messageElement.className = 'message win';
            return;
        }
        
        // 检查是否平局
        if (isBoardFull()) {
            gameOver = true;
            messageElement.textContent = '平局!';
            messageElement.className = 'message draw';
            return;
        }
        
        // 切换玩家
        currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
        currentPlayerElement.textContent = currentPlayer === BLACK ? '黑子' : '白子';
    }
});

// 检查胜利条件
function checkWin(row, col) {
    const directions = [
        [0, 1],   // 水平
        [1, 0],   // 垂直
        [1, 1],   // 对角线 \
        [1, -1]   // 对角线 /
    ];
    
    for (let [dx, dy] of directions) {
        let count = 1;  // 包含当前棋子
        
        // 正方向检查
        for (let i = 1; i < 5; i++) {
            const r = row + dx * i;
            const c = col + dy * i;
            if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && board[r][c] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        
        // 反方向检查
        for (let i = 1; i < 5; i++) {
            const r = row - dx * i;
            const c = col - dy * i;
            if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && board[r][c] === currentPlayer) {
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

// 检查棋盘是否已满
function isBoardFull() {
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (!board[row][col]) {
                return false;
            }
        }
    }
    return true;
}

// 重新开始游戏
restartButton.addEventListener('click', initializeBoard);

// 初始化游戏
initializeBoard();