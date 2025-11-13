// 五子棋游戏逻辑
class Gomoku {
  constructor() {
    this.boardSize = 15;
    this.board = [];
    this.currentPlayer = 'black';
    this.gameOver = false;
    this.initializeBoard();
  }

  // 初始化棋盘
  initializeBoard() {
    for (let i = 0; i < this.boardSize; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.boardSize; j++) {
        this.board[i][j] = null;
      }
    }
  }

  // 落子
  placeStone(row, col) {
    if (this.gameOver || this.board[row][col] !== null) {
      return false;
    }

    this.board[row][col] = this.currentPlayer;
    if (this.checkWin(row, col)) {
      this.gameOver = true;
      return 'win';
    }

    this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
    return true;
  }

  // 检查是否获胜
  checkWin(row, col) {
    const player = this.board[row][col];
    const directions = [
      [0, 1],  // 水平
      [1, 0],  // 垂直
      [1, 1],  // 对角线 \
      [1, -1]  // 对角线 /
    ];

    for (let [dx, dy] of directions) {
      let count = 1;

      // 向一个方向检查
      for (let i = 1; i < 5; i++) {
        const r = row + dx * i;
        const c = col + dy * i;
        if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize && this.board[r][c] === player) {
          count++;
        } else {
          break;
        }
      }

      // 向相反方向检查
      for (let i = 1; i < 5; i++) {
        const r = row - dx * i;
        const c = col - dy * i;
        if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize && this.board[r][c] === player) {
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
  reset() {
    this.initializeBoard();
    this.currentPlayer = 'black';
    this.gameOver = false;
  }
}

// 页面加载完成后初始化游戏

document.addEventListener('DOMContentLoaded', () => {
  const game = new Gomoku();
  const boardElement = document.getElementById('board');
  const statusElement = document.getElementById('status');
  const restartButton = document.getElementById('restart');

  // 创建棋盘
  function createBoard() {
    boardElement.innerHTML = '';
    for (let i = 0; i < game.boardSize; i++) {
      const row = document.createElement('tr');
      for (let j = 0; j < game.boardSize; j++) {
        const cell = document.createElement('td');
        cell.addEventListener('click', () => handleCellClick(i, j));
        row.appendChild(cell);
      }
      boardElement.appendChild(row);
    }
  }

  // 处理单元格点击
  function handleCellClick(row, col) {
    if (game.gameOver) return;

    const result = game.placeStone(row, col);
    if (result) {
      updateBoard();
      if (result === 'win') {
        statusElement.textContent = `玩家 ${game.currentPlayer === 'black' ? '黑子' : '白子'} 获胜!`;
      } else {
        statusElement.textContent = `当前玩家: ${game.currentPlayer === 'black' ? '黑子' : '白子'}`;
      }
    }
  }

  // 更新棋盘显示
  function updateBoard() {
    const cells = boardElement.querySelectorAll('td');
    for (let i = 0; i < game.boardSize; i++) {
      for (let j = 0; j < game.boardSize; j++) {
        const cell = cells[i * game.boardSize + j];
        cell.className = '';
        if (game.board[i][j] === 'black') {
          cell.classList.add('black');
        } else if (game.board[i][j] === 'white') {
          cell.classList.add('white');
        }
      }
    }
  }

  // 重新开始游戏
  restartButton.addEventListener('click', () => {
    game.reset();
    createBoard();
    updateBoard();
    statusElement.textContent = '当前玩家: 黑子';
  });

  // 初始化游戏
  createBoard();
  statusElement.textContent = '当前玩家: 黑子';
});
