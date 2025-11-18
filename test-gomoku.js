#!/usr/bin/env node

// 测试五子棋游戏功能
const GomokuCLI = require('./gomoku-cli.js');

console.log('Testing Gomoku game functionality...\n');

// Create a test instance but don't start the interactive game
const game = new GomokuCLI();

// Test the board initialization
console.log('1. Testing board initialization...');
console.log('Board size:', game.boardSize);
console.log('Initial board empty:', game.board.every(row => row.every(cell => cell === 0)));
console.log('Current player:', game.currentPlayer);

// Test win detection - horizontal win
console.log('\n2. Testing win detection (horizontal)...');
game.board[7][5] = 1; // Place stones for player 1
game.board[7][6] = 1;
game.board[7][7] = 1;
game.board[7][8] = 1;
game.board[7][9] = 1; // 5 in a row horizontally

const winResult1 = game.checkWin(7, 9);
console.log('Horizontal win detected:', winResult1);

// Reset the board
game.board = Array(game.boardSize).fill().map(() => Array(game.boardSize).fill(0));

// Test win detection - vertical win
console.log('\n3. Testing win detection (vertical)...');
game.board[5][7] = 1;
game.board[6][7] = 1;
game.board[7][7] = 1;
game.board[8][7] = 1;
game.board[9][7] = 1; // 5 in a row vertically

const winResult2 = game.checkWin(9, 7);
console.log('Vertical win detected:', winResult2);

// Reset the board
game.board = Array(game.boardSize).fill().map(() => Array(game.boardSize).fill(0));

// Test win detection - diagonal win
console.log('\n4. Testing win detection (diagonal)...');
game.board[5][5] = 1;
game.board[6][6] = 1;
game.board[7][7] = 1;
game.board[8][8] = 1;
game.board[9][9] = 1; // 5 in a row diagonally

const winResult3 = game.checkWin(9, 9);
console.log('Diagonal win detected:', winResult3);

// Reset the board
game.board = Array(game.boardSize).fill().map(() => Array(game.boardSize).fill(0));

// Test board display functionality
console.log('\n5. Testing board display...');
console.log('Sample board display:');
game.displayBoard();

console.log('\n✅ All tests completed!');