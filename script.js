// 获取canvas元素和上下文
const canvas = document.getElementById('chessboard');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('restart-btn');
const statusDisplay = document.getElementById('game-status');

// 设置棋盘参数
const ROWS = 15;
const COLS = 15;
const CELL_SIZE = canvas.width / (COLS - 1);
const RADIUS = CELL_SIZE / 2 - 2;

// 游戏状态
let board = [];
let currentPlayer = 1; // 1为黑棋，2为白棋
let gameOver = false;
let winner = null;

// 初始化棋盘
function initBoard() {
    board = [];
    for (let i = 0; i < ROWS; i++) {
        board[i] = new Array(COLS).fill(0);
    }
}

// 绘制棋盘
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制网格线
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    
    // 绘制竖线
    for (let col = 0; col < COLS; col++) {
        ctx.beginPath();
        ctx.moveTo(col * CELL_SIZE, 0);
        ctx.lineTo(col * CELL_SIZE, canvas.height);
        ctx.stroke();
    }
    
    // 绘制横线
    for (let row = 0; row < ROWS; row++) {
        ctx.beginPath();
        ctx.moveTo(0, row * CELL_SIZE);
        ctx.lineTo(canvas.width, row * CELL_SIZE);
        ctx.stroke();
    }
    
    // 绘制棋子
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col] !== 0) {
                drawPiece(col, row, board[row][col]);
            }
        }
    }
}

// 绘制棋子
function drawPiece(col, row, player) {
    const x = col * CELL_SIZE;
    const y = row * CELL_SIZE;
    
    ctx.beginPath();
    ctx.arc(x, y, RADIUS, 0, Math.PI * 2);
    
    if (player === 1) { // 黑棋
        ctx.fillStyle = '#000';
    } else { // 白棋
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
    }
    
    ctx.fill();
    
    if (player === 2) { // 白棋描边
        ctx.stroke();
    }
}

// 检查胜负
function checkWin(row, col, player) {
    // 检查水平方向
    let count = 1;
    // 向左检查
    for (let c = col - 1; c >= 0 && board[row][c] === player; c--) {
        count++;
    }
    // 向右检查
    for (let c = col + 1; c < COLS && board[row][c] === player; c++) {
        count++;
    }
    if (count >= 5) return true;
    
    // 检查垂直方向
    count = 1;
    // 向上检查
    for (let r = row - 1; r >= 0 && board[r][col] === player; r--) {
        count++;
    }
    // 向下检查
    for (let r = row + 1; r < ROWS && board[r][col] === player; r++) {
        count++;
    }
    if (count >= 5) return true;
    
    // 检查左上到右下对角线
    count = 1;
    // 向左上检查
    for (let r = row - 1, c = col - 1; r >= 0 && c >= 0 && board[r][c] === player; r--, c--) {
        count++;
    }
    // 向右下检查
    for (let r = row + 1, c = col + 1; r < ROWS && c < COLS && board[r][c] === player; r++, c++) {
        count++;
    }
    if (count >= 5) return true;
    
    // 检查右上到左下对角线
    count = 1;
    // 向右上检查
    for (let r = row - 1, c = col + 1; r >= 0 && c < COLS && board[r][c] === player; r--, c++) {
        count++;
    }
    // 向左下检查
    for (let r = row + 1, c = col - 1; r < ROWS && c >= 0 && board[r][c] === player; r++, c--) {
        count++;
    }
    if (count >= 5) return true;
    
    return false;
}

// 处理点击事件
function handleClick(e) {
    if (gameOver) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 找到最近的交叉点
    const col = Math.round(x / CELL_SIZE);
    const row = Math.round(y / CELL_SIZE);
    
    // 检查位置是否有效
    if (row >= 0 && row < ROWS && col >= 0 && col < COLS && board[row][col] === 0) {
        // 放置棋子
        board[row][col] = currentPlayer;
        
        // 检查胜负
        if (checkWin(row, col, currentPlayer)) {
            gameOver = true;
            winner = currentPlayer;
            statusDisplay.textContent = `游戏结束! ${currentPlayer === 1 ? '黑棋' : '白棋'} 获胜!`;
        } else {
            // 切换玩家
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            statusDisplay.textContent = `当前玩家: ${currentPlayer === 1 ? '黑棋' : '白棋'}`;
        }
        
        // 重新绘制棋盘
        drawBoard();
    }
}

// 重新开始游戏
function restartGame() {
    initBoard();
    currentPlayer = 1;
    gameOver = false;
    winner = null;
    statusDisplay.textContent = `当前玩家: 黑棋`;
    drawBoard();
}

// 添加事件监听器
canvas.addEventListener('click', handleClick);
restartBtn.addEventListener('click', restartGame);

// 初始化游戏
initBoard();
drawBoard();