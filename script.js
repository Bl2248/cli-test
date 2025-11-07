const canvas = document.getElementById('chessboard');
const ctx = canvas.getContext('2d');
const statusDiv = document.getElementById('game-status');
const restartBtn = document.getElementById('restart-btn');

// 棋盘配置
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
    statusDiv.textContent = '当前玩家: 黑子';
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
function drawPiece(x, y, color) {
    const centerX = x * CELL_SIZE;
    const centerY = y * CELL_SIZE;
    const radius = CELL_SIZE / 2 - 2;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    
    if (color === BLACK) {
        ctx.fillStyle = 'black';
    } else {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
    }
    
    ctx.fill();
    if (color === WHITE) {
        ctx.stroke();
    }
}

// 处理点击事件
canvas.addEventListener('click', function(e) {
    if (gameover) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 计算点击的网格坐标
    const gridX = Math.round(x / CELL_SIZE);
    const gridY = Math.round(y / CELL_SIZE);
    
    // 检查坐标是否有效
    if (gridX >= 0 && gridX < GRID_SIZE && gridY >= 0 && gridY < GRID_SIZE) {
        // 检查该位置是否为空
        if (board[gridX][gridY] === EMPTY) {
            // 放置棋子
            board[gridX][gridY] = currentPlayer;
            drawBoard();
            
            // 检查是否获胜
            if (checkWin(gridX, gridY)) {
                gameover = true;
                statusDiv.textContent = `游戏结束! ${currentPlayer === BLACK ? '黑子' : '白子'} 获胜!`;
                return;
            }
            
            // 切换玩家
            currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
            statusDiv.textContent = `当前玩家: ${currentPlayer === BLACK ? '黑子' : '白子'}`;
        }
    }
});

// 检查是否获胜
function checkWin(x, y) {
    const color = board[x][y];
    if (color === EMPTY) return false;
    
    // 检查四个方向: 水平、垂直、对角线(两种)
    const directions = [
        [1, 0],   // 水平
        [0, 1],   // 垂直
        [1, 1],   // 对角线 \
        [1, -1]   // 对角线 /
    ];
    
    for (let [dx, dy] of directions) {
        let count = 1; // 包括当前棋子
        
        // 正向检查
        for (let i = 1; i < 5; i++) {
            const nx = x + dx * i;
            const ny = y + dy * i;
            if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && board[nx][ny] === color) {
                count++;
            } else {
                break;
            }
        }
        
        // 反向检查
        for (let i = 1; i < 5; i++) {
            const nx = x - dx * i;
            const ny = y - dy * i;
            if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && board[nx][ny] === color) {
                count++;
            } else {
                break;
            }
        }
        
        // 如果连成5子则获胜
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