// 游戏状态
let currentPlayer = 'black'; // 黑子先手
let gameOver = false;
const boardSize = 15;
const board = Array(boardSize).fill().map(() => Array(boardSize).fill(null));
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const cellSize = canvas.width / (boardSize - 1);
const statusDisplay = document.getElementById('current-player');

// 绘制棋盘
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制棋盘背景
    ctx.fillStyle = '#dcb35c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制网格线
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < boardSize; i++) {
        // 水平线
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
        
        // 垂直线
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
    }
}

// 绘制棋子
function drawPiece(row, col, color) {
    ctx.beginPath();
    ctx.arc(col * cellSize, row * cellSize, cellSize/2 - 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
    // 添加高光效果
    ctx.beginPath();
    ctx.arc(col * cellSize - cellSize/4, row * cellSize - cellSize/4, cellSize/8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fill();
}

// 检查是否获胜
function checkWin(row, col, color) {
    // 检查四个方向：水平、垂直、两个对角线
    const directions = [
        [0, 1],   // 水平
        [1, 0],   // 垂直
        [1, 1],   // 对角线 \
        [1, -1]   // 对角线 /
    ];
    
    for (const [dx, dy] of directions) {
        let count = 1; // 当前棋子
        
        // 正方向计数
        for (let i = 1; i < 5; i++) {
            const newRow = row + i * dx;
            const newCol = col + i * dy;
            if (newRow >= 0 && newRow < boardSize && 
                newCol >= 0 && newCol < boardSize && 
                board[newRow][newCol] === color) {
                count++;
            } else {
                break;
            }
        }
        
        // 反方向计数
        for (let i = 1; i < 5; i++) {
            const newRow = row - i * dx;
            const newCol = col - i * dy;
            if (newRow >= 0 && newRow < boardSize && 
                newCol >= 0 && newCol < boardSize && 
                board[newRow][newCol] === color) {
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
function handleCanvasClick(event) {
    if (gameOver) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // 找到最近的交叉点
    const col = Math.round(x / cellSize);
    const row = Math.round(y / cellSize);
    
    // 检查是否在棋盘范围内且该位置没有棋子
    if (row >= 0 && row < boardSize && col >= 0 && col < boardSize && board[row][col] === null) {
        // 放置棋子
        board[row][col] = currentPlayer;
        drawPiece(row, col, currentPlayer);
        
        // 检查是否获胜
        if (checkWin(row, col, currentPlayer)) {
            gameOver = true;
            statusDisplay.textContent = `${currentPlayer === 'black' ? '黑子' : '白子'} 获胜！`;
            statusDisplay.style.color = '#d32f2f';
            return;
        }
        
        // 切换玩家
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
        statusDisplay.textContent = currentPlayer === 'black' ? '黑子' : '白子';
    }
}

// 重新开始游戏
function restartGame() {
    board.forEach(row => row.fill(null));
    currentPlayer = 'black';
    gameOver = false;
    statusDisplay.textContent = '黑子';
    statusDisplay.style.color = 'initial';
    drawBoard();
}

// 初始化游戏
canvas.addEventListener('click', handleCanvasClick);
document.getElementById('restart').addEventListener('click', restartGame);
drawBoard();