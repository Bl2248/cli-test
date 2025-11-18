#!/usr/bin/env python3
"""
井字棋游戏实现
"""

class TicTacToe:
    def __init__(self):
        self.board = [[' ' for _ in range(3)] for _ in range(3)]
        self.current_player = 'X'

    def display_board(self):
        print("  0   1   2")
        for i, row in enumerate(self.board):
            print(f"{i} {row[0]} | {row[1]} | {row[2]}")
            if i < 2:
                print("  ---------")

    def make_move(self, row, col):
        if self.board[row][col] == ' ':
            self.board[row][col] = self.current_player
            return True
        return False

    def check_winner(self):
        # 检查行
        for row in self.board:
            if row[0] == row[1] == row[2] != ' ':
                return row[0]

        # 检查列
        for col in range(3):
            if self.board[0][col] == self.board[1][col] == self.board[2][col] != ' ':
                return self.board[0][col]

        # 检查对角线
        if self.board[0][0] == self.board[1][1] == self.board[2][2] != ' ':
            return self.board[0][0]
        if self.board[0][2] == self.board[1][1] == self.board[2][0] != ' ':
            return self.board[0][2]

        return None

    def is_board_full(self):
        for row in self.board:
            if ' ' in row:
                return False
        return True

    def switch_player(self):
        self.current_player = 'O' if self.current_player == 'X' else 'X'

    def play(self):
        print("欢迎来到井字棋游戏！")
        print("玩家1使用 X，玩家2使用 O")
        print("输入格式: 行 列 (例如: 0 1 表示第0行第1列)")

        while True:
            self.display_board()

            print(f"当前玩家: {self.current_player}")
            try:
                row, col = map(int, input("请输入行和列 (用空格分隔): ").split())
                
                if row < 0 or row > 2 or col < 0 or col > 2:
                    print("输入无效！行和列必须在0-2之间。")
                    continue

                if not self.make_move(row, col):
                    print("该位置已被占用，请选择其他位置。")
                    continue

                winner = self.check_winner()
                if winner:
                    self.display_board()
                    print(f"恭喜！玩家 {winner} 获胜！")
                    break

                if self.is_board_full():
                    self.display_board()
                    print("平局！棋盘已满。")
                    break

                self.switch_player()

            except ValueError:
                print("输入格式错误！请输入两个用空格分隔的数字。")
            except KeyboardInterrupt:
                print("\n游戏已退出。")
                break


if __name__ == "__main__":
    game = TicTacToe()
    game.play()