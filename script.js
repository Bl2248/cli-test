// 获取canvas元素和上下文
const canvas = document.getElementById('chessboard');
const ctx = canvas.getContext('2d');

// 棋盘设置
const BOARD_SIZE = 15;
const CELL_SIZE = canvas.width / (BOARD_SIZE - 1);
let board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
let currentPlayer = 1; // 1为黑子，2为白子
let gameOver = false;

// 绘制棋盘
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制棋盘背景
    ctx.fillStyle = '#dcb35c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制网格线
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < BOARD_SIZE; i++) {
        // 水平线
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
        
        // 垂直线
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.stroke();
    }
}

// 绘制棋子
function drawPiece(x, y, color) {
    ctx.beginPath();
    ctx.arc(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
    
    // 创建渐变效果
    const gradient = ctx.createRadialGradient(
        x * CELL_SIZE - 2,
        y * CELL_SIZE - 2,
        2,
        x * CELL_SIZE,
        y * CELL_SIZE,
        CELL_SIZE / 2
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
    
    // 添加边框
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();
}

// 检查胜负
function checkWin(x, y, player) {
    const directions = [
        [1, 0],   // 水平
        [0, 1],   // 垂直
        [1, 1],   // 对角线 \
        [1, -1]   // 对角线 /
    ];
    
    for (let [dx, dy] of directions) {
        let count = 1; // 当前位置的棋子
        
        // 正方向计数
        for (let i = 1; i < 5; i++) {
            const newX = x + i * dx;
            const newY = y + i * dy;
            
            if (newX >= 0 && newX < BOARD_SIZE && 
                newY >= 0 && newY < BOARD_SIZE && 
                board[newX][newY] === player) {
                count++;
            } else {
                break;
            }
        }
        
        // 反方向计数
        for (let i = 1; i < 5; i++) {
            const newX = x - i * dx;
            const newY = y - i * dy;
            
            if (newX >= 0 && newX < BOARD_SIZE && 
                newY >= 0 && newY < BOARD_SIZE && 
                board[newX][newY] === player) {
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
canvas.addEventListener('click', function(event) {
    if (gameOver) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.round((event.clientX - rect.left) / CELL_SIZE);
    const y = Math.round((event.clientY - rect.top) / CELL_SIZE);
    
    // 检查位置是否有效
    if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && board[x][y] === 0) {
        // 落子
        board[x][y] = currentPlayer;
        drawPiece(x, y, currentPlayer === 1 ? 'black' : 'white');
        
        // 检查胜负
        if (checkWin(x, y, currentPlayer)) {
            gameOver = true;
            setTimeout(() => {
                alert(currentPlayer === 1 ? '黑子获胜!' : '白子获胜!');
            }, 10);
        } else {
            // 切换玩家
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            document.getElementById('current-player').textContent = 
                currentPlayer === 1 ? '黑子' : '白子';
        }
    }
});

// 重新开始游戏
document.getElementById('restart-btn').addEventListener('click', function() {
    board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
    currentPlayer = 1;
    gameOver = false;
    document.getElementById('current-player').textContent = '黑子';
    drawBoard();
});

// 初始化游戏
drawBoard();