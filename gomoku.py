#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
五子棋游戏实现
"""

class Gomoku:
    def __init__(self, size=15):
        self.size = size
        self.board = [[0 for _ in range(size)] for _ in range(size)]
        self.current_player = 1  # 1为黑子，2为白子
        
    def display_board(self):
        """显示棋盘"""
        print("  ", end="")
        for i in range(self.size):
            print(f"{i:2d}", end=" ")
        print()
        
        for i in range(self.size):
            print(f"{i:2d}", end=" ")
            for j in range(self.size):
                if self.board[i][j] == 0:
                    print(" +", end=" ")
                elif self.board[i][j] == 1:
                    print(" ●", end=" ")  # 黑子
                else:
                    print(" ○", end=" ")  # 白子
            print()
    
    def place_stone(self, row, col):
        """在指定位置放置棋子"""
        if 0 <= row < self.size and 0 <= col < self.size and self.board[row][col] == 0:
            self.board[row][col] = self.current_player
            return True
        return False
    
    def check_winner(self, row, col):
        """检查是否有玩家获胜"""
        player = self.board[row][col]
        if player == 0:
            return False
            
        # 检查四个方向：水平、垂直、左上到右下、右上到左下
        directions = [
            [(0, 1), (0, -1)],   # 水平
            [(1, 0), (-1, 0)],   # 垂直
            [(1, 1), (-1, -1)],  # 左上到右下
            [(1, -1), (-1, 1)]   # 右上到左下
        ]
        
        for direction_pair in directions:
            count = 1  # 包括当前棋子
            for dx, dy in direction_pair:
                r, c = row + dx, col + dy
                while 0 <= r < self.size and 0 <= c < self.size and self.board[r][c] == player:
                    count += 1
                    r += dx
                    c += dy
            
            if count >= 5:
                return True
        return False
    
    def is_board_full(self):
        """检查棋盘是否已满"""
        for i in range(self.size):
            for j in range(self.size):
                if self.board[i][j] == 0:
                    return False
        return True
    
    def switch_player(self):
        """切换当前玩家"""
        self.current_player = 3 - self.current_player  # 1变2，2变1
    
    def get_player_name(self):
        """获取当前玩家名称"""
        return "黑子" if self.current_player == 1 else "白子"
    
    def start_game(self):
        """开始游戏"""
        print("欢迎来到五子棋游戏！")
        print("黑子为 ●，白子为 ○")
        print("输入格式：行 列 (例如: 7 7 表示第7行第7列，从0开始计数)")
        
        while True:
            self.display_board()
            print(f"\n当前轮到: {self.get_player_name()}")
            
            try:
                user_input = input("请输入要放置棋子的位置(行 列)，或输入'quit'退出: ").strip()
                if user_input.lower() == 'quit':
                    print("游戏结束！")
                    break
                
                row, col = map(int, user_input.split())
                
                if self.place_stone(row, col):
                    if self.check_winner(row, col):
                        self.display_board()
                        print(f"\n恭喜！{self.get_player_name()} 获胜！")
                        break
                    elif self.is_board_full():
                        print("\n平局！棋盘已满。")
                        break
                    else:
                        self.switch_player()
                else:
                    print("该位置已被占用或位置无效，请重新选择！")
                    
            except (ValueError, IndexError):
                print("输入格式错误，请输入两个数字(行 列)，例如: 7 7")


if __name__ == "__main__":
    game = Gomoku()
    game.start_game()