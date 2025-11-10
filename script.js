const canvas = document.getElementById('chessboard');
const ctx = canvas.getContext('2d');
const currentPlayerDisplay = document.getElementById('current-player');
const restartBtn = document.getElementById('restart-btn');

// 棋盘设置
const GRID_SIZE = 15;
const CELL_SIZE = canvas.width / (GRID_SIZE - 1);
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

// 游戏状态
let board = [];
let currentPlayer = BLACK;
let gameover = false;

// 初始化棋盘
function initBoard() {
    board = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        board[i] = [];
        for (let j = 0; j < GRID_SIZE; j++) {
            board[i][j] = EMPTY;
        }
    }
    currentPlayer = BLACK;
    gameover = false;
    currentPlayerDisplay.textContent = '黑子';
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
    
    // 绘制棋子
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (board[i][j] !== EMPTY) {
                drawPiece(i, j, board[i][j]);
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
    
    if (color === BLACK) {
        ctx.fillStyle = '#000';
    } else {
        ctx.fillStyle = '#fff';
    }
    
    ctx.fill();
    ctx.stroke();
}

// 处理点击事件
canvas.addEventListener('click', function(e) {
    if (gameover) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const col = Math.round(x / CELL_SIZE);
    const row = Math.round(y / CELL_SIZE);
    
    // 检查位置是否有效
    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE && board[row][col] === EMPTY) {
        board[row][col] = currentPlayer;
        drawBoard();
        
        // 检查是否获胜
        if (checkWin(row, col)) {
            gameover = true;
            const winner = currentPlayer === BLACK ? '黑子' : '白子';
            setTimeout(() => {
                alert(winner + ' 获胜！');
            }, 100);
            return;
        }
        
        // 切换玩家
        currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
        currentPlayerDisplay.textContent = currentPlayer === BLACK ? '黑子' : '白子';
    }
});

// 检查是否获胜
function checkWin(row, col) {
    const color = board[row][col];
    if (color === EMPTY) return false;
    
    // 四个方向：水平、垂直、两个对角线
    const directions = [
        [0, 1],  // 水平
        [1, 0],  // 垂直
        [1, 1],  // 对角线 \\
        [1, -1]  // 对角线 /
    ];
    
    for (let [dx, dy] of directions) {
        let count = 1; // 包含当前棋子
        
        // 正方向
        for (let i = 1; i < 5; i++) {
            const r = row + dx * i;
            const c = col + dy * i;
            if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && board[r][c] === color) {
                count++;
            } else {
                break;
            }
        }
        
        // 反方向
        for (let i = 1; i < 5; i++) {
            const r = row - dx * i;
            const c = col - dy * i;
            if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && board[r][c] === color) {
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
restartBtn.addEventListener('click', initBoard);

// 初始化游戏
initBoard();