#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
五子棋游戏实现
"""
import numpy as np
from typing import Optional, Tuple, List


class Gomoku:
    """
    五子棋游戏类
    """
    def __init__(self, board_size: int = 15):
        """
        初始化五子棋游戏
        :param board_size: 棋盘大小，默认为15x15
        """
        self.board_size = board_size
        self.board = np.zeros((board_size, board_size), dtype=int)
        # 玩家1为黑棋，玩家2为白棋
        self.current_player = 1
        self.game_over = False
        self.winner = None
        
    def display_board(self):
        """
        显示棋盘
        """
        print("  ", end="")
        for i in range(self.board_size):
            print(f"{i:2d}", end=" ")
        print()
        
        for i in range(self.board_size):
            print(f"{i:2d}", end=" ")
            for j in range(self.board_size):
                if self.board[i][j] == 0:
                    if i == 0 and j == 0:
                        print("┌─", end="")
                    elif i == 0 and j == self.board_size - 1:
                        print("┐ ", end="")
                    elif i == self.board_size - 1 and j == 0:
                        print("└─", end="")
                    elif i == self.board_size - 1 and j == self.board_size - 1:
                        print("┘ ", end="")
                    elif i == 0:
                        print("┬─", end="")
                    elif i == self.board_size - 1:
                        print("┴─", end="")
                    elif j == 0:
                        print("├─", end="")
                    elif j == self.board_size - 1:
                        print("┤ ", end="")
                    else:
                        print("┼─", end="")
                elif self.board[i][j] == 1:
                    print("● ", end="")  # 黑棋
                else:
                    print("○ ", end="")  # 白棋
            print()
    
    def is_valid_move(self, row: int, col: int) -> bool:
        """
        检查落子是否有效
        :param row: 行坐标
        :param col: 列坐标
        :return: 是否有效
        """
        if row < 0 or row >= self.board_size or col < 0 or col >= self.board_size:
            return False
        return self.board[row][col] == 0
    
    def make_move(self, row: int, col: int) -> bool:
        """
        落子
        :param row: 行坐标
        :param col: 列坐标
        :return: 是否成功落子
        """
        if not self.is_valid_move(row, col) or self.game_over:
            return False
            
        self.board[row][col] = self.current_player
        
        if self.check_winner(row, col):
            self.game_over = True
            self.winner = self.current_player
        elif self.is_board_full():
            self.game_over = True
            self.winner = 0  # 平局
            
        self.current_player = 3 - self.current_player  # 切换玩家 (1->2, 2->1)
        return True
    
    def check_winner(self, row: int, col: int) -> bool:
        """
        检查是否有玩家获胜
        :param row: 最后落子的行坐标
        :param col: 最后落子的列坐标
        :return: 是否有玩家获胜
        """
        player = self.board[row][col]
        if player == 0:
            return False
            
        # 检查四个方向：水平、垂直、左上-右下、右上-左下
        directions = [
            [(0, 1), (0, -1)],   # 水平
            [(1, 0), (-1, 0)],   # 垂直
            [(1, 1), (-1, -1)], # 对角线1
            [(1, -1), (-1, 1)]  # 对角线2
        ]
        
        for direction_pair in directions:
            count = 1  # 当前棋子本身算一个
            
            for dr, dc in direction_pair:
                r, c = row + dr, col + dc
                while (0 <= r < self.board_size and 0 <= c < self.board_size and 
                       self.board[r][c] == player):
                    count += 1
                    r, c = r + dr, c + dc
                    
            if count >= 5:
                return True
                
        return False
    
    def is_board_full(self) -> bool:
        """
        检查棋盘是否已满
        :return: 是否已满
        """
        return not (self.board == 0).any()
    
    def reset_game(self):
        """
        重置游戏
        """
        self.board = np.zeros((self.board_size, self.board_size), dtype=int)
        self.current_player = 1
        self.game_over = False
        self.winner = None


def main():
    """
    主函数 - 游戏入口
    """
    game = Gomoku()
    
    print("欢迎来到五子棋游戏！")
    print("玩家1: 黑棋 (●), 玩家2: 白棋 (○)")
    print("输入格式: 行 列 (例如: 7 7 表示第7行第7列)")
    print("输入 'q' 退出游戏")
    
    while not game.game_over:
        game.display_board()
        print(f"轮到玩家 {game.current_player} {'黑棋' if game.current_player == 1 else '白棋'}")
        
        try:
            user_input = input("请输入坐标 (行 列): ").strip()
            if user_input.lower() == 'q':
                print("游戏退出！")
                return
                
            row, col = map(int, user_input.split())
            
            if game.make_move(row, col):
                if game.game_over:
                    game.display_board()
                    if game.winner == 0:
                        print("平局！")
                    else:
                        print(f"玩家 {game.winner} {'黑棋' if game.winner == 1 else '白棋'} 获胜！")
                    break
            else:
                print("无效的落子位置，请重新输入！")
                
        except ValueError:
            print("输入格式错误，请输入两个数字，例如: 7 7")
        except KeyboardInterrupt:
            print("\n游戏退出！")
            return
    
    # 询问是否再来一局
    play_again = input("是否再来一局？(y/n): ").strip().lower()
    if play_again == 'y':
        game.reset_game()
        main()


if __name__ == "__main__":
    main()
