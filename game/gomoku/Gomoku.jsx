import React, { useState, useEffect } from 'react';
import './gomoku.scss';

const BOARD_SIZE = 15;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

const Gomoku = () => {
  const [board, setBoard] = useState(() => 
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY))
  );
  const [currentPlayer, setCurrentPlayer] = useState(BLACK);
  const [winner, setWinner] = useState(null);
  const [history, setHistory] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);

  const checkWinner = (board, row, col, player) => {
    const directions = [
      [[0, 1], [0, -1]],
      [[1, 0], [-1, 0]],
      [[1, 1], [-1, -1]],
      [[1, -1], [-1, 1]]
    ];

    for (const direction of directions) {
      let count = 1;
      
      for (const [dr, dc] of direction) {
        let r = row + dr;
        let c = col + dc;
        
        while (
          r >= 0 && r < BOARD_SIZE && 
          c >= 0 && c < BOARD_SIZE && 
          board[r][c] === player
        ) {
          count++;
          r += dr;
          c += dc;
        }
      }
      
      if (count >= 5) {
        return true;
      }
    }
    
    return false;
  };

  const handleCellClick = (row, col) => {
    if (board[row][col] !== EMPTY || isGameOver) {
      return;
    }

    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = currentPlayer;
    
    setHistory([...history, { row, col, player: currentPlayer }]);
    setBoard(newBoard);

    if (checkWinner(newBoard, row, col, currentPlayer)) {
      setWinner(currentPlayer);
      setIsGameOver(true);
    } else {
      setCurrentPlayer(currentPlayer === BLACK ? WHITE : BLACK);
    }
  };

  const resetGame = () => {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY)));
    setCurrentPlayer(BLACK);
    setWinner(null);
    setHistory([]);
    setIsGameOver(false);
  };

  const undoMove = () => {
    if (history.length === 0 || isGameOver) return;

    const newHistory = [...history];
    const lastMove = newHistory.pop();
    
    const newBoard = board.map(row => [...row]);
    newBoard[lastMove.row][lastMove.col] = EMPTY;
    
    setBoard(newBoard);
    setHistory(newHistory);
    setCurrentPlayer(lastMove.player);
  };

  const getPlayerName = (player) => {
    return player === BLACK ? '黑棋' : '白棋';
  };

  const getPlayerColor = (player) => {
    return player === BLACK ? 'black' : 'white';
  };

  return (
    <div className="gomoku-container">
      <div className="game-header">
        <h1>五子棋游戏</h1>
        <div className="game-info">
          {!isGameOver ? (
            <div className="current-player">
              当前玩家: <span className={`player-name ${getPlayerColor(currentPlayer)}`}>
                {getPlayerName(currentPlayer)}
              </span>
            </div>
          ) : (
            <div className="winner-message">
              游戏结束! <span className={`player-name ${getPlayerColor(winner)}`}>
                {getPlayerName(winner)}
              </span> 获胜!
            </div>
          )}
        </div>
        <div className="game-controls">
          <button onClick={resetGame} className="btn btn-primary">
            重新开始
          </button>
          <button 
            onClick={undoMove} 
            className="btn btn-secondary"
            disabled={history.length === 0 || isGameOver}
          >
            悔棋
          </button>
        </div>
      </div>
      
      <div className="board-container">
        <div className="board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`board-cell ${cell !== EMPTY ? 'occupied' : ''}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell !== EMPTY && (
                    <div className={`stone ${getPlayerColor(cell)}`}></div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="game-rules">
        <h3>游戏规则</h3>
        <ul>
          <li>黑棋先行，双方轮流落子</li>
          <li>先在横、竖、斜方向连成五子者获胜</li>
          <li>点击棋盘空白处落子</li>
          <li>可使用悔棋功能撤销上一步</li>
        </ul>
      </div>
    </div>
  );
};

export default Gomoku;