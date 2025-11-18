#!/usr/bin/env node

// 五子棋 CLI 版本 (Five in a Row CLI Version)
class GomokuCLI {
    constructor() {
        this.boardSize = 15;
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0));
        this.currentPlayer = 1; // 1 for black, 2 for white
        this.gameOver = false;
        this.playerNames = ['Black (●)', 'White (○)'];
    }
    
    // Initialize and start the game
    startGame() {
        console.log('\n=== 五子棋 (Five in a Row) ===');
        console.log('输入格式: 行 列 (例如: 7 7 表示中心位置)');
        console.log('退出游戏: 输入 "quit" 或 "exit"\n');
        this.displayBoard();
        
        this.playTurn();
    }
    
    // Display the current board
    displayBoard() {
        const size = this.boardSize;
        
        // Print column headers
        let header = '    ';
        for (let j = 0; j < size; j++) {
            header += j.toString().padStart(3, ' ');
        }
        console.log(header);
        
        // Print each row with row number
        for (let i = 0; i < size; i++) {
            let row = i.toString().padStart(2, ' ') + ' ';
            for (let j = 0; j < size; j++) {
                if (this.board[i][j] === 0) {
                    // Display crosshairs for empty positions
                    if (i === 0 && j === 0) row += '┌ '; // top-left corner
                    else if (i === 0 && j === size - 1) row += '┐ '; // top-right corner
                    else if (i === size - 1 && j === 0) row += '└ '; // bottom-left corner
                    else if (i === size - 1 && j === size - 1) row += '┘ '; // bottom-right corner
                    else if (i === 0) row += '┬ '; // top edge
                    else if (i === size - 1) row += '┴ '; // bottom edge
                    else if (j === 0) row += '├ '; // left edge
                    else if (j === size - 1) row += '┤ '; // right edge
                    else row += '┼ '; // intersection
                } else if (this.board[i][j] === 1) {
                    row += '● '; // Black stone
                } else {
                    row += '○ '; // White stone
                }
            }
            console.log(row);
        }
        console.log('');
    }
    
    // Handle a player's turn
    playTurn() {
        if (this.gameOver) return;
        
        const playerName = this.playerNames[this.currentPlayer - 1];
        process.stdout.write(`Player ${playerName}, enter your move (row col): `);
        
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        rl.on('line', (input) => {
            rl.close();
            
            // Check for quit command
            const command = input.trim().toLowerCase();
            if (command === 'quit' || command === 'exit') {
                console.log('Game exited.');
                process.exit(0);
            }
            
            // Parse coordinates
            const coords = input.trim().split(/\s+/).map(Number);
            if (coords.length !== 2) {
                console.log('Invalid input. Please enter two numbers separated by space (e.g. 7 7)');
                this.playTurn();
                return;
            }
            
            const [row, col] = coords;
            
            // Validate coordinates
            if (isNaN(row) || isNaN(col) || row < 0 || row >= this.boardSize || col < 0 || col >= this.boardSize) {
                console.log(`Invalid coordinates. Please enter numbers between 0 and ${this.boardSize - 1}`);
                this.playTurn();
                return;
            }
            
            // Check if position is already occupied
            if (this.board[row][col] !== 0) {
                console.log('Position already occupied. Try again.');
                this.playTurn();
                return;
            }
            
            // Make the move
            this.board[row][col] = this.currentPlayer;
            
            // Check for win
            if (this.checkWin(row, col)) {
                this.gameOver = true;
                this.displayBoard();
                console.log(`\n🎉 Player ${playerName} wins! 🎉`);
                return;
            }
            
            // Check for draw (board full)
            if (this.isBoardFull()) {
                this.gameOver = true;
                this.displayBoard();
                console.log('\nIt\'s a draw!');
                return;
            }
            
            // Switch player and continue
            this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
            this.displayBoard();
            this.playTurn();
        });
    }
    
    // Check if a player has won
    checkWin(row, col) {
        const player = this.board[row][col];
        
        // Check all four directions: horizontal, vertical, diagonal1, diagonal2
        const directions = [
            [[0, 1], [0, -1]],   // horizontal
            [[1, 0], [-1, 0]],   // vertical
            [[1, 1], [-1, -1]],  // diagonal \
            [[1, -1], [-1, 1]]   // diagonal /
        ];
        
        for (const [dir1, dir2] of directions) {
            let count = 1; // Count the current stone
            
            // Check in direction 1
            let r = row + dir1[0];
            let c = col + dir1[1];
            while (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize && this.board[r][c] === player) {
                count++;
                r += dir1[0];
                c += dir1[1];
            }
            
            // Check in direction 2
            r = row + dir2[0];
            c = col + dir2[1];
            while (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize && this.board[r][c] === player) {
                count++;
                r += dir2[0];
                c += dir2[1];
            }
            
            if (count >= 5) {
                return true;
            }
        }
        
        return false;
    }
    
    // Check if the board is full (for draw condition)
    isBoardFull() {
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (this.board[i][j] === 0) {
                    return false;
                }
            }
        }
        return true;
    }
}

// Start the game if this file is run directly
if (require.main === module) {
    const game = new GomokuCLI();
    game.startGame();
}

module.exports = GomokuCLI;