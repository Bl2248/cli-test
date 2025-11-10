// 获取画布和上下文
const canvas = document.getElementById('chessboard');
const ctx = canvas.getContext('2d');

// 棋盘设置
const ROWS = 15;
const COLS = 15;
const CELL_SIZE = canvas.width / (COLS - 1);
const BOARD_PADDING = CELL_SIZE / 2;

// 游戏状态
let board = Array(ROWS).fill().map(() => Array(COLS).fill(0)); // 0: 空, 1: 黑, 2: 白
let currentPlayer = 1; // 1: 黑子, 2: 白子
let gameOver = false;
let winner = null;

// 绘制棋盘
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制背景
    ctx.fillStyle = '#e6cfa5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制网格线
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < ROWS; i++) {
        // 水平线
        ctx.beginPath();
        ctx.moveTo(BOARD_PADDING, i * CELL_SIZE + BOARD_PADDING);
        ctx.lineTo(canvas.width - BOARD_PADDING, i * CELL_SIZE + BOARD_PADDING);
        ctx.stroke();
        
        // 垂直线
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE + BOARD_PADDING, BOARD_PADDING);
        ctx.lineTo(i * CELL_SIZE + BOARD_PADDING, canvas.height - BOARD_PADDING);
        ctx.stroke();
    }
    
    // 绘制天元和星位
    const starPoints = [3, 7, 11];
    ctx.fillStyle = '#333';
    for (let i of starPoints) {
        for (let j of starPoints) {
            if (!(i === 7 && j === 7)) continue; // 天元单独处理
            ctx.beginPath();
            ctx.arc(i * CELL_SIZE + BOARD_PADDING, j * CELL_SIZE + BOARD_PADDING, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // 绘制天元
    ctx.beginPath();
    ctx.arc(7 * CELL_SIZE + BOARD_PADDING, 7 * CELL_SIZE + BOARD_PADDING, 5, 0, Math.PI * 2);
    ctx.fill();
}

// 绘制棋子
function drawPiece(row, col, player) {
    const x = col * CELL_SIZE + BOARD_PADDING;
    const y = row * CELL_SIZE + BOARD_PADDING;
    
    ctx.beginPath();
    ctx.arc(x, y, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
    
    if (player === 1) { // 黑子
        ctx.fillStyle = '#000';
    } else { // 白子
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    
    ctx.fill();
}

// 检查胜负
function checkWin(row, col, player) {
    const directions = [
        [0, 1],  // 水平
        [1, 0],  // 垂直
        [1, 1],  // 对角线 \
        [1, -1]  // 对角线 /
    ];
    
    for (let [dx, dy] of directions) {
        let count = 1; // 当前棋子
        
        // 正方向计数
        for (let i = 1; i < 5; i++) {
            const newRow = row + i * dx;
            const newCol = col + i * dy;
            if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS && 
                board[newRow][newCol] === player) {
                count++;
            } else {
                break;
            }
        }
        
        // 反方向计数
        for (let i = 1; i < 5; i++) {
            const newRow = row - i * dx;
            const newCol = col - i * dy;
            if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS && 
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
canvas.addEventListener('click', function(e) {
    if (gameOver) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 找到最近的交叉点
    const col = Math.round((x - BOARD_PADDING) / CELL_SIZE);
    const row = Math.round((y - BOARD_PADDING) / CELL_SIZE);
    
    if (row >= 0 && row < ROWS && col >= 0 && col < COLS && board[row][col] === 0) {
        // 放置棋子
        board[row][col] = currentPlayer;
        drawPiece(row, col, currentPlayer);
        
        // 检查胜负
        if (checkWin(row, col, currentPlayer)) {
            gameOver = true;
            winner = currentPlayer;
            document.getElementById('message').textContent = `游戏结束！${currentPlayer === 1 ? '黑子' : '白子'}获胜！`;
            document.getElementById('current-player').textContent = '游戏结束';
        } else {
            // 切换玩家
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            document.getElementById('current-player').textContent = currentPlayer === 1 ? '黑子' : '白子';
        }
    }
});

// 重新开始游戏
document.getElementById('restart-btn').addEventListener('click', function() {
    board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    currentPlayer = 1;
    gameOver = false;
    winner = null;
    document.getElementById('current-player').textContent = '黑子';
    document.getElementById('message').textContent = '';
    drawBoard();
});

// 初始化游戏
drawBoard();