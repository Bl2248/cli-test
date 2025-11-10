// 五子棋游戏逻辑
class GomokuGame {
  constructor() {
    this.boardSize = 15;
    this.board = [];
    this.currentPlayer = 'black'; // 黑棋先手
    this.gameOver = false;
    this.initBoard();
    this.createBoard();
    this.bindEvents();
  }

  // 初始化棋盘数据
  initBoard() {
    this.board = [];
    for (let i = 0; i < this.boardSize; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.boardSize; j++) {
        this.board[i][j] = null;
      }
    }
  }

  // 创建棋盘DOM
  createBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${this.boardSize}, 30px)`;
    
    for (let i = 0; i < this.boardSize; i++) {
      const row = document.createElement('div');
      row.className = 'board-row';
      
      for (let j = 0; j < this.boardSize; j++) {
        const cell = document.createElement('div');
        cell.className = 'board-cell';
        cell.dataset.row = i;
        cell.dataset.col = j;
        row.appendChild(cell);
      }
      
      gameBoard.appendChild(row);
    }
  }

  // 绑定事件
  bindEvents() {
    const gameBoard = document.getElementById('game-board');
    const resetBtn = document.getElementById('reset-btn');
    
    gameBoard.addEventListener('click', (e) => {
      if (e.target.classList.contains('board-cell') && !this.gameOver) {
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        
        this.makeMove(row, col);
      }
    });
    
    resetBtn.addEventListener('click', () => {
      this.resetGame();
    });
  }

  // 下棋
  makeMove(row, col) {
    // 检查位置是否为空
    if (this.board[row][col] !== null || this.gameOver) {
      return;
    }
    
    // 更新棋盘数据
    this.board[row][col] = this.currentPlayer;
    
    // 更新UI
    const cell = document.querySelector(`.board-cell[data-row="${row}"][data-col="${col}"]`);
    cell.classList.add(this.currentPlayer);
    
    // 检查是否获胜
    if (this.checkWin(row, col)) {
      this.gameOver = true;
      document.getElementById('game-status').innerHTML = `<span class="win-message">${this.currentPlayer === 'black' ? '黑棋' : '白棋'} 获胜！</span>`;
      return;
    }
    
    // 检查是否平局
    if (this.checkDraw()) {
      this.gameOver = true;
      document.getElementById('game-status').textContent = '平局！';
      return;
    }
    
    // 切换玩家
    this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
    document.getElementById('current-player').textContent = this.currentPlayer === 'black' ? '黑棋' : '白棋';
  }

  // 检查是否获胜
  checkWin(row, col) {
    const player = this.board[row][col];
    const directions = [
      [0, 1],   // 水平
      [1, 0],   // 垂直
      [1, 1],   // 对角线 \
      [1, -1]   // 对角线 /
    ];
    
    for (const [dx, dy] of directions) {
      let count = 1; // 当前位置的棋子
      const winPieces = [[row, col]]; // 记录获胜的棋子位置
      
      // 往一个方向数
      for (let i = 1; i < 5; i++) {
        const newRow = row + i * dx;
        const newCol = col + i * dy;
        if (this.isValidPosition(newRow, newCol) && this.board[newRow][newCol] === player) {
          count++;
          winPieces.push([newRow, newCol]);
        } else {
          break;
        }
      }
      
      // 往相反方向数
      for (let i = 1; i < 5; i++) {
        const newRow = row - i * dx;
        const newCol = col - i * dy;
        if (this.isValidPosition(newRow, newCol) && this.board[newRow][newCol] === player) {
          count++;
          winPieces.push([newRow, newCol]);
        } else {
          break;
        }
      }
      
      if (count >= 5) {
        // 突出显示获胜的棋子
        this.highlightWinPieces(winPieces);
        return true;
      }
    }
    
    return false;
  }

  // 检查是否平局
  checkDraw() {
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (this.board[i][j] === null) {
          return false;
        }
      }
    }
    return true;
  }

  // 检查位置是否有效
  isValidPosition(row, col) {
    return row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize;
  }

  // 突出显示获胜的棋子
  highlightWinPieces(pieces) {
    for (const [row, col] of pieces) {
      const cell = document.querySelector(`.board-cell[data-row="${row}"][data-col="${col}"]`);
      if (cell) {
        cell.classList.add('win-piece');
      }
    }
  }

  // 重置游戏
  resetGame() {
    this.initBoard();
    this.currentPlayer = 'black';
    this.gameOver = false;
    document.getElementById('current-player').textContent = '黑棋';
    document.getElementById('game-status').textContent = '';
    this.createBoard();
  }
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
  new GomokuGame();
});