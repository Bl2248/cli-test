import React, { useState } from 'react';
import './Gomoku.css';

const BOARD_SIZE = 15;

const createBoard = () => {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
};

const Gomoku = () => {
  const [board, setBoard] = useState(createBoard());
  const [currentPlayer, setCurrentPlayer] = useState('black');
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const checkWinner = (board, row, col, player) => {
    // 检查四个方向：水平、垂直、对角线（正反）
    const directions = [
      [0, 1],   // 水平
      [1, 0],   // 垂直
      [1, 1],   // 对角线（右下）
      [1, -1]   // 对角线（左下）
    ];

    for (let [dx, dy] of directions) {
      let count = 1; // 当前位置的棋子

      // 正方向计数
      for (let i = 1; i < 5; i++) {
        const newRow = row + dx * i;
        const newCol = col + dy * i;
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

      // 反方向计数
      for (let i = 1; i < 5; i++) {
        const newRow = row - dx * i;
        const newCol = col - dy * i;
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
  };

  const handleCellClick = (row, col) => {
    if (board[row][col] || winner || gameOver) return;

    const newBoard = [...board];
    newBoard[row] = [...newBoard[row]];
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    if (checkWinner(newBoard, row, col, currentPlayer)) {
      setWinner(currentPlayer);
      setGameOver(true);
    } else {
      setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
    }
  };

  const resetGame = () => {
    setBoard(createBoard());
    setCurrentPlayer('black');
    setWinner(null);
    setGameOver(false);
  };

  return (
    <div className="gomoku-game">
      <h1>五子棋游戏</h1>
      <div className="game-info">
        <div className="current-player">
          当前玩家: <span className={currentPlayer}>{currentPlayer}</span>
        </div>
        {winner && <div className="winner">获胜者: <span className={winner}>{winner}</span></div>}
        <button onClick={resetGame} className="reset-button">重新开始</button>
      </div>
      <div className="board">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="cell"
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell && <div className={`stone ${cell}`} />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Gomoku;