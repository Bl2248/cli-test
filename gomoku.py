import numpy as np

class Gomoku:
    def __init__(self, size=15):
        self.size = size
        self.board = np.zeros((size, size), dtype=int)
        self.current_player = 1  # Player 1 is 1, Player 2 is -1

    def display_board(self):
        print("   ", end="")
        for i in range(self.size):
            print(f"{i:2d}", end=" ")
        print()
        
        for i in range(self.size):
            print(f"{i:2d} ", end="")
            for j in range(self.size):
                if self.board[i][j] == 0:
                    print(". ", end=" ")
                elif self.board[i][j] == 1:
                    print("● ", end=" ")  # Black stone
                else:
                    print("○ ", end=" ")  # White stone
            print()
        print()

    def is_valid_move(self, row, col):
        if row < 0 or row >= self.size or col < 0 or col >= self.size:
            return False
        return self.board[row][col] == 0

    def make_move(self, row, col):
        if not self.is_valid_move(row, col):
            return False
        
        self.board[row][col] = self.current_player
        return True

    def check_winner(self, row, col):
        directions = [(1, 0), (0, 1), (1, 1), (1, -1)]
        player = self.board[row][col]
        
        for dx, dy in directions:
            count = 1  # Include the current stone
            
            # Check in positive direction
            r, c = row + dx, col + dy
            while 0 <= r < self.size and 0 <= c < self.size and self.board[r][c] == player:
                count += 1
                r += dx
                c += dy
            
            # Check in negative direction
            r, c = row - dx, col - dy
            while 0 <= r < self.size and 0 <= c < self.size and self.board[r][c] == player:
                count += 1
                r -= dx
                c -= dy
            
            if count >= 5:
                return player
        
        return 0  # No winner yet

    def is_board_full(self):
        return not np.any(self.board == 0)

    def play(self):
        print("Welcome to Gomoku!")
        print("Player 1: ● (Black), Player 2: ○ (White)")
        print("Enter moves as 'row col' (0-14 for a 15x15 board)")
        print("Type 'quit' to exit the game")
        
        while True:
            self.display_board()
            print(f"Player {1 if self.current_player == 1 else 2}'s turn ({'●' if self.current_player == 1 else '○'})")
            
            try:
                user_input = input("Enter your move (row col): ").strip()
                if user_input.lower() == 'quit':
                    print("Game ended by user.")
                    break
                
                parts = user_input.split()
                if len(parts) != 2:
                    print("Please enter two numbers separated by space (e.g., '7 7')")
                    continue
                
                row, col = map(int, parts)
                
                if not self.make_move(row, col):
                    print("Invalid move! The position is already occupied or out of bounds. Try again.")
                    continue
                
                winner = self.check_winner(row, col)
                if winner != 0:
                    self.display_board()
                    print(f"Player {1 if winner == 1 else 2} wins! ({'●' if winner == 1 else '○'})")
                    break
                
                if self.is_board_full():
                    self.display_board()
                    print("It's a draw!")
                    break
                
                # Switch player
                self.current_player *= -1
                
            except ValueError:
                print("Please enter valid numbers for row and column.")
            except KeyboardInterrupt:
                print("\nGame interrupted by user.")
                break

if __name__ == "__main__":
    game = Gomoku()
    game.play()