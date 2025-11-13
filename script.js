const canvas = document.getElementById('chessboard');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('restartBtn');
const gameStatus = document.getElementById('gameStatus');

// 棋盘参数
const GRID_SIZE = 15; // 15x15棋盘
const CELL_SIZE = canvas.width / (GRID_SIZE - 1); // 每格大小
let board = [];
let currentPlayer = 'black'; // black or white
let gameActive = true;

// 初始化棋盘
function initBoard() {
    board = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null));
    drawBoard();
    gameActive = true;
    currentPlayer = 'black';
    updateGameStatus();
}

// 绘制棋盘
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制网格线
    ctx.strokeStyle = '#000';
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
}

// 绘制棋子
function drawChess(x, y, color) {
    ctx.beginPath();
    ctx.arc(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fillStyle = color === 'black' ? '#000' : '#fff';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.stroke();
}

// 处理点击事件
canvas.addEventListener('click', (e) => {
    if (!gameActive) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) / CELL_SIZE);
    const y = Math.round((e.clientY - rect.top) / CELL_SIZE);
    
    // 检查位置是否有效且未被占用
    if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE && !board[y][x]) {
        board[y][x] = currentPlayer;
        drawChess(x, y, currentPlayer);
        
        // 检查是否获胜
        if (checkWin(x, y)) {
            gameActive = false;
            gameStatus.textContent = `游戏结束! ${currentPlayer === 'black' ? '黑棋' : '白棋'} 获胜!`;
            return;
        }
        
        // 切换玩家
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
        updateGameStatus();
    }
});

// 更新游戏状态显示
function updateGameStatus() {
    gameStatus.textContent = `当前玩家: ${currentPlayer === 'black' ? '黑棋' : '白棋'}`;
}

// 检查是否获胜
function checkWin(x, y) {
    const directions = [
        [1, 0],   // 水平
        [0, 1],   // 垂直
        [1, 1],   // 对角线 \\\n        [1, -1]   // 对角线 /
    ];
    
    for (let [dx, dy] of directions) {
        let count = 1; // 包含当前棋子
        
        // 正方向计数
        for (let i = 1; i < 5; i++) {
            const nx = x + dx * i;
            const ny = y + dy * i;
            if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && board[ny][nx] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        
        // 反方向计数
        for (let i = 1; i < 5; i++) {
            const nx = x - dx * i;
            const ny = y - dy * i;
            if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && board[ny][nx] === currentPlayer) {
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