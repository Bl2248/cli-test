// 游戏配置
const BOARD_SIZE = 15;
const CELL_SIZE = 30; // 每个格子的像素大小

// 游戏状态
let board = [];
let currentPlayer = 'black'; // 'black' 或 'white'
let gameOver = false;
let gameBoardElement = null;
let currentPlayerElement = null;
let gameStatusElement = null;

// 初始化棋盘
function initializeBoard() {
    board = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        board[i] = new Array(BOARD_SIZE).fill(null);
    }
}

// 创建游戏棋盘
function createGameBoard() {
    gameBoardElement = document.getElementById('game-board');
    gameBoardElement.innerHTML = '';
    
    // 设置棋盘尺寸
    gameBoardElement.style.width = (BOARD_SIZE * CELL_SIZE) + 'px';
    gameBoardElement.style.height = (BOARD_SIZE * CELL_SIZE) + 'px';
    
    // 创建棋盘格子
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.style.left = (col * CELL_SIZE) + 'px';
            cell.style.top = (row * CELL_SIZE) + 'px';
            cell.style.width = CELL_SIZE + 'px';
            cell.style.height = CELL_SIZE + 'px';
            
            cell.addEventListener('click', () => handleCellClick(row, col));
            
            gameBoardElement.appendChild(cell);
        }
    }
}

// 处理点击事件
function handleCellClick(row, col) {
    if (gameOver || board[row][col] !== null) {
        return; // 游戏结束或格子已被占用
    }
    
    // 放置棋子
    placeStone(row, col, currentPlayer);
    
    // 检查胜负
    if (checkWin(row, col, currentPlayer)) {
        gameOver = true;
        gameStatusElement.textContent = `${currentPlayer === 'black' ? '黑棋' : '白棋'} 获胜！`;
        gameStatusElement.className = 'game-status winner';
    } else if (isBoardFull()) {
        gameOver = true;
        gameStatusElement.textContent = '平局！';
        gameStatusElement.className = 'game-status draw';
    } else {
        // 切换玩家
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
        updateCurrentPlayerDisplay();
    }
}

// 放置棋子
function placeStone(row, col, player) {
    board[row][col] = player;
    
    // 创建棋子元素
    const stone = document.createElement('div');
    stone.className = `stone ${player}`;
    stone.style.left = (col * CELL_SIZE + CELL_SIZE / 2) + 'px';
    stone.style.top = (row * CELL_SIZE + CELL_SIZE / 2) + 'px';
    stone.style.width = (CELL_SIZE * 0.8) + 'px';
    stone.style.height = (CELL_SIZE * 0.8) + 'px';
    
    gameBoardElement.appendChild(stone);
}

// 检查胜负
function checkWin(row, col, player) {
    // 检查四个方向：水平、垂直、两个对角线
    const directions = [
        [0, 1],   // 水平
        [1, 0],   // 垂直
        [1, 1],   // 对角线1
        [1, -1]   // 对角线2
    ];
    
    for (const [dx, dy] of directions) {
        let count = 1; // 当前棋子
        
        // 正向检查
        for (let i = 1; i < 5; i++) {
            const newRow = row + i * dx;
            const newCol = col + i * dy;
            
            if (
                newRow >= 0 && newRow < BOARD_SIZE &&
                newCol >= 0 && newCol < BOARD_SIZE &&
                board[newRow][newCol] === player
            ) {
                count++;
            } else {
                break;
            }
        }
        
        // 反向检查
        for (let i = 1; i < 5; i++) {
            const newRow = row - i * dx;
            const newCol = col - i * dy;
            
            if (
                newRow >= 0 && newRow < BOARD_SIZE &&
                newCol >= 0 && newCol < BOARD_SIZE &&
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

// 检查棋盘是否已满
function isBoardFull() {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === null) {
                return false;
            }
        }
    }
    return true;
}

// 更新当前玩家显示
function updateCurrentPlayerDisplay() {
    currentPlayerElement.textContent = currentPlayer === 'black' ? '黑棋' : '白棋';
}

// 重新开始游戏
function restartGame() {
    initializeBoard();
    createGameBoard();
    currentPlayer = 'black';
    gameOver = false;
    updateCurrentPlayerDisplay();
    gameStatusElement.textContent = '';
    gameStatusElement.className = 'game-status';
}

// 初始化游戏
function initGame() {
    initializeBoard();
    createGameBoard();
    
    currentPlayerElement = document.getElementById('current-player');
    gameStatusElement = document.getElementById('game-status');
    
    updateCurrentPlayerDisplay();
    
    // 绑定重新开始按钮事件
    document.getElementById('restart-btn').addEventListener('click', restartGame);
}

// 页面加载完成后初始化游戏
window.addEventListener('DOMContentLoaded', initGame);