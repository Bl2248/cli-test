// 游戏状态变量
let currentPlayer = 'black';
let gameBoard = [];
let gameOver = false;
const BOARD_SIZE = 15;

// DOM元素
const gameBoardElement = document.getElementById('game-board');
const currentPlayerElement = document.getElementById('current-player');
const blackCountElement = document.getElementById('black-count');
const whiteCountElement = document.getElementById('white-count');
const resetButton = document.getElementById('reset-btn');
const winnerMessageElement = document.getElementById('winner-message');

// 初始化游戏
function initGame() {
    // 初始化游戏板数组
    gameBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
    
    // 创建棋盘
    createBoard();
    
    // 重置游戏状态
    currentPlayer = 'black';
    gameOver = false;
    updatePlayerDisplay();
    updatePieceCount();
    winnerMessageElement.classList.add('hidden');
}

// 创建棋盘
function createBoard() {
    gameBoardElement.innerHTML = '';
    const board = document.createElement('div');
    board.className = 'board';
    board.style.width = `${BOARD_SIZE * 30}px`;
    board.style.height = `${BOARD_SIZE * 30}px`;
    
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.style.left = `${col * 30}px`;
            cell.style.top = `${row * 30}px`;
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            cell.addEventListener('click', () => handleCellClick(row, col));
            board.appendChild(cell);
        }
    }
    
    gameBoardElement.appendChild(board);
}

// 处理单元格点击
function handleCellClick(row, col) {
    // 如果游戏结束或该位置已有棋子，则不处理
    if (gameOver || gameBoard[row][col] !== null) {
        return;
    }
    
    // 放置棋子
    placePiece(row, col);
    
    // 检查是否获胜
    if (checkWin(row, col)) {
        gameOver = true;
        showWinner();
        return;
    }
    
    // 检查是否平局
    if (isBoardFull()) {
        gameOver = true;
        showDraw();
        return;
    }
    
    // 切换玩家
    switchPlayer();
}

// 放置棋子
function placePiece(row, col) {
    gameBoard[row][col] = currentPlayer;
    
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    const piece = document.createElement('div');
    piece.className = `${currentPlayer}-piece`;
    cell.appendChild(piece);
    
    updatePieceCount();
}

// 切换玩家
function switchPlayer() {
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    updatePlayerDisplay();
}

// 更新玩家显示
function updatePlayerDisplay() {
    currentPlayerElement.textContent = currentPlayer === 'black' ? '黑子' : '白子';
    currentPlayerElement.style.color = currentPlayer === 'black' ? '#000' : '#666';
}

// 更新棋子计数
function updatePieceCount() {
    let blackCount = 0;
    let whiteCount = 0;
    
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (gameBoard[row][col] === 'black') {
                blackCount++;
            } else if (gameBoard[row][col] === 'white') {
                whiteCount++;
            }
        }
    }
    
    blackCountElement.textContent = blackCount;
    whiteCountElement.textContent = whiteCount;
}

// 检查是否获胜
function checkWin(row, col) {
    const directions = [
        [0, 1],   // 水平
        [1, 0],   // 垂直
        [1, 1],   // 对角线
        [1, -1]   // 反对角线
    ];
    
    for (const [dx, dy] of directions) {
        let count = 1; // 包括当前棋子
        
        // 正方向检查
        for (let i = 1; i < 5; i++) {
            const newRow = row + dx * i;
            const newCol = col + dy * i;
            
            if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE && 
                gameBoard[newRow][newCol] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        
        // 反方向检查
        for (let i = 1; i < 5; i++) {
            const newRow = row - dx * i;
            const newCol = col - dy * i;
            
            if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE && 
                gameBoard[newRow][newCol] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        
        // 如果连成5子，则获胜
        if (count >= 5) {
            return true;
        }
    }
    
    return false;
}

// 检查棋盘是否已满
function isBoardFull() {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (gameBoard[row][col] === null) {
                return false;
            }
        }
    }
    return true;
}

// 显示获胜者
function showWinner() {
    winnerMessageElement.textContent = `${currentPlayer === 'black' ? '黑子' : '白子'} 获胜！`;
    winnerMessageElement.classList.remove('hidden');
    winnerMessageElement.classList.add('win');
}

// 显示平局
function showDraw() {
    winnerMessageElement.textContent = '平局！';
    winnerMessageElement.classList.remove('hidden');
    winnerMessageElement.classList.add('win');
}

// 重置游戏
function resetGame() {
    initGame();
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    
    // 重置按钮事件监听
    resetButton.addEventListener('click', resetGame);
});