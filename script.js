// 获取canvas元素和上下文
const canvas = document.getElementById('chessboard');
const ctx = canvas.getContext('2d');

// 棋盘参数
const ROWS = 15;
const COLS = 15;
const CELL_SIZE = canvas.width / (COLS - 1);
const BOARD_SIZE = canvas.width;

// 游戏状态
let board = Array(ROWS).fill().map(() => Array(COLS).fill(0)); // 0: 空, 1: 黑, 2: 白
let currentPlayer = 1; // 1: 黑, 2: 白
let gameOver = false;
let winner = null;

// 绘制棋盘
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制棋盘背景
    ctx.fillStyle = '#dcb35c';
    ctx.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);
    
    // 绘制网格线
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    
    // 垂直线
    for (let i = 0; i < COLS; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, BOARD_SIZE - 1);
        ctx.stroke();
    }
    
    // 水平线
    for (let i = 0; i < ROWS; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(BOARD_SIZE - 1, i * CELL_SIZE);
        ctx.stroke();
    }
    
    // 绘制天元和星位
    ctx.fillStyle = '#333';
    
    // 天元 (中心)
    ctx.beginPath();
    ctx.arc(7 * CELL_SIZE, 7 * CELL_SIZE, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // 四个星位
    const stars = [
        {x: 3, y: 3}, {x: 11, y: 3},
        {x: 3, y: 11}, {x: 11, y: 11}
    ];
    
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x * CELL_SIZE, star.y * CELL_SIZE, 4, 0, Math.PI * 2);
        ctx.fill();
    });
}

// 绘制棋子
function drawPiece(row, col, player) {
    ctx.beginPath();
    ctx.arc(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE / 2 - 3, 0, Math.PI * 2);
    
    // 创建渐变效果
    const gradient = ctx.createRadialGradient(
        col * CELL_SIZE - 2,
        row * CELL_SIZE - 2,
        1,
        col * CELL_SIZE,
        row * CELL_SIZE,
        CELL_SIZE / 2 - 3
    );
    
    if (player === 1) { // 黑子
        gradient.addColorStop(0, '#000');
        gradient.addColorStop(1, '#666');
    } else { // 白子
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(1, '#ccc');
    }
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // 添加边框
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();
}

// 检查是否获胜
function checkWin(row, col, player) {
    // 检查四个方向: 水平、垂直、对角线(左上-右下、右上-左下)
    const directions = [
        [0, 1],   // 水平
        [1, 0],   // 垂直
        [1, 1],   // 对角线(左上-右下)
        [1, -1]   // 对角线(右上-左下)
    ];
    
    for (let [dx, dy] of directions) {
        let count = 1; // 当前棋子本身
        
        // 正方向计数
        for (let i = 1; i <= 5; i++) {
            const newRow = row + i * dx;
            const newCol = col + i * dy;
            
            if (
                newRow >= 0 && newRow < ROWS &&
                newCol >= 0 && newCol < COLS &&
                board[newRow][newCol] === player
            ) {
                count++;
            } else {
                break;
            }
        }
        
        // 反方向计数
        for (let i = 1; i <= 5; i++) {
            const newRow = row - i * dx;
            const newCol = col - i * dy;
            
            if (
                newRow >= 0 && newRow < ROWS &&
                newCol >= 0 && newCol < COLS &&
                board[newRow][newCol] === player
            ) {
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
function handleCanvasClick(e) {
    if (gameOver) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 找到最近的交叉点
    const col = Math.round(x / CELL_SIZE);
    const row = Math.round(y / CELL_SIZE);
    
    // 检查是否在棋盘范围内且该位置为空
    if (
        row >= 0 && row < ROWS &&
        col >= 0 && col < COLS &&
        board[row][col] === 0
    ) {
        // 放置棋子
        board[row][col] = currentPlayer;
        drawPiece(row, col, currentPlayer);
        
        // 检查是否获胜
        if (checkWin(row, col, currentPlayer)) {
            gameOver = true;
            winner = currentPlayer;
            
            setTimeout(() => {
                const playerText = currentPlayer === 1 ? '黑子' : '白子';
                alert(`${playerText}获胜！`);
            }, 100);
        } else {
            // 切换玩家
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updatePlayerDisplay();
        }
    }
}

// 更新当前玩家显示
function updatePlayerDisplay() {
    const playerText = currentPlayer === 1 ? '黑子' : '白子';
    document.getElementById('current-player').textContent = playerText;
}

// 重新开始游戏
function restartGame() {
    // 清空棋盘
    board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    currentPlayer = 1;
    gameOver = false;
    winner = null;
    
    // 重新绘制棋盘
    drawBoard();
    updatePlayerDisplay();
}

// 初始化事件监听器
canvas.addEventListener('click', handleCanvasClick);
document.getElementById('restart-btn').addEventListener('click', restartGame);

// 初始化游戏
drawBoard();
updatePlayerDisplay();