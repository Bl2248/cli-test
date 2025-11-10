const canvas = document.getElementById('chessboard');
const ctx = canvas.getContext('2d');
const gridSize = 30;
const boardSize = 15;
let board = [];
let currentPlayer = 'black';
let gameover = false;

// 初始化棋盘
function initBoard() {
    board = [];
    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            board[i][j] = null;
        }
    }
    gameover = false;
    currentPlayer = 'black';
    document.getElementById('player').textContent = '黑子';
    document.getElementById('winMessage').classList.remove('show');
    drawBoard();
}

// 绘制棋盘
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制网格线
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < boardSize; i++) {
        // 垂直线
        ctx.beginPath();
        ctx.moveTo(gridSize * i + gridSize/2, gridSize/2);
        ctx.lineTo(gridSize * i + gridSize/2, gridSize * (boardSize-1) + gridSize/2);
        ctx.stroke();
        
        // 水平线
        ctx.beginPath();
        ctx.moveTo(gridSize/2, gridSize * i + gridSize/2);
        ctx.lineTo(gridSize * (boardSize-1) + gridSize/2, gridSize * i + gridSize/2);
        ctx.stroke();
    }
    
    // 绘制棋子
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j]) {
                drawChessman(i, j, board[i][j]);
            }
        }
    }
}

// 绘制棋子
function drawChessman(x, y, color) {
    ctx.beginPath();
    ctx.arc(
        y * gridSize + gridSize/2,
        x * gridSize + gridSize/2,
        gridSize/2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fillStyle = color === 'black' ? '#000' : '#fff';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.stroke();
}

// 处理点击事件
canvas.addEventListener('click', function(e) {
    if (gameover) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const gridX = Math.round((y - gridSize/2) / gridSize);
    const gridY = Math.round((x - gridSize/2) / gridSize);
    
    if (gridX >= 0 && gridX < boardSize && gridY >= 0 && gridY < boardSize && !board[gridX][gridY]) {
        board[gridX][gridY] = currentPlayer;
        drawBoard();
        
        if (checkWin(gridX, gridY)) {
            gameover = true;
            document.getElementById('winner').textContent = currentPlayer === 'black' ? '黑子获胜!' : '白子获胜!';
            document.getElementById('winMessage').classList.add('show');
        } else {
            // 切换玩家
            currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
            document.getElementById('player').textContent = currentPlayer === 'black' ? '黑子' : '白子';
        }
    }
});

// 检查是否获胜
function checkWin(x, y) {
    const color = board[x][y];
    if (!color) return false;
    
    // 检查四个方向: 水平、垂直、两个对角线
    const directions = [
        [0, 1],  // 水平
        [1, 0],  // 垂直
        [1, 1],  // 对角线 \
        [1, -1]  // 对角线 /
    ];
    
    for (let [dx, dy] of directions) {
        let count = 1; // 包含当前棋子
        
        // 正方向检查
        for (let i = 1; i < 5; i++) {
            const nx = x + dx * i;
            const ny = y + dy * i;
            if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && board[nx][ny] === color) {
                count++;
            } else {
                break;
            }
        }
        
        // 反方向检查
        for (let i = 1; i < 5; i++) {
            const nx = x - dx * i;
            const ny = y - dy * i;
            if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && board[nx][ny] === color) {
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
document.getElementById('restart').addEventListener('click', initBoard);

// 关闭获胜消息
document.getElementById('closeWinMessage').addEventListener('click', function() {
    document.getElementById('winMessage').classList.remove('show');
});

// 初始化游戏
initBoard();