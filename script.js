const canvas = document.getElementById('chessboard');
const ctx = canvas.getContext('2d');
const currentPlayerSpan = document.getElementById('current-player');
const restartBtn = document.getElementById('restart-btn');

// 棋盘设置
const GRID_SIZE = 15;
const CELL_SIZE = canvas.width / (GRID_SIZE - 1);
const BOARD_COLOR = '#D2B48C';
const LINE_COLOR = '#8B4513';

// 游戏状态
let board = [];
let currentPlayer = 'black'; // black 或 white
let gameOver = false;

// 初始化棋盘
function initializeBoard() {
    board = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null));
    currentPlayer = 'black';
    gameOver = false;
    currentPlayerSpan.textContent = '黑子';
    drawBoard();
}

// 绘制棋盘
function drawBoard() {
    // 清空画布
    ctx.fillStyle = BOARD_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制网格线
    ctx.strokeStyle = LINE_COLOR;
    ctx.lineWidth = 1;
    
    // 垂直线
    for (let i = 0; i < GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.stroke();
    }
    
    // 水平线
    for (let i = 0; i < GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
    }
    
    // 绘制已有的棋子
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
    
    // 设置渐变效果
    const gradient = ctx.createRadialGradient(
        x - radius/3, y - radius/3, radius/8,
        x, y, radius
    );
    
    if (color === 'black') {
        gradient.addColorStop(0, '#000');
        gradient.addColorStop(1, '#666');
    } else {
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(1, '#ccc');
    }
    
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = '#444';
    ctx.stroke();
}

// 处理点击事件
canvas.addEventListener('click', (e) => {
    if (gameOver) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 计算点击的网格位置
    const col = Math.round(x / CELL_SIZE);
    const row = Math.round(y / CELL_SIZE);
    
    // 检查位置是否有效
    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE && !board[row][col]) {
        // 放置棋子
        board[row][col] = currentPlayer;
        drawPiece(row, col, currentPlayer);
        
        // 检查是否获胜
        if (checkWin(row, col)) {
            alert(`${currentPlayer === 'black' ? '黑子' : '白子'} 获胜！`);
            gameOver = true;
            return;
        }
        
        // 切换玩家
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
        currentPlayerSpan.textContent = currentPlayer === 'black' ? '黑子' : '白子';
    }
});

// 检查是否获胜
function checkWin(row, col) {
    const color = board[row][col];
    if (!color) return false;
    
    // 四个方向：水平、垂直、两个对角线
    const directions = [
        [0, 1],  // 水平
        [1, 0],  // 垂直
        [1, 1],  // 主对角线
        [1, -1]  // 反对角线
    ];
    
    for (const [dx, dy] of directions) {
        let count = 1; // 包含当前棋子
        
        // 正向检查
        for (let i = 1; i < 5; i++) {
            const r = row + dx * i;
            const c = col + dy * i;
            if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && board[r][c] === color) {
                count++;
            } else {
                break;
            }
        }
        
        // 反向检查
        for (let i = 1; i < 5; i++) {
            const r = row - dx * i;
            const c = col - dy * i;
            if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && board[r][c] === color) {
                count++;
            } else {
                break;
            }
        }
        
        // 如果连成五子则获胜
        if (count >= 5) {
            return true;
        }
    }
    
    return false;
}

// 重新开始游戏
restartBtn.addEventListener('click', () => {
    initializeBoard();
});

// 初始化游戏
initializeBoard();