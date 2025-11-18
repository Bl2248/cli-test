#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
五子棋游戏实现
"""
import numpy as np
from typing import Optional, Tuple


class Gomoku:
    def __init__(self, size: int = 15):
        """
        初始化五子棋游戏
        :param size: 棋盘大小，默认15x15
        """
        self.size = size
        self.board = np.zeros((size, size), dtype=int)
        self.current_player = 1  # 1为黑子，2为白子
        self.game_over = False
        self.winner = None

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
                    print("+ ", end=" ")
                elif self.board[i][j] == 1:
                    print("●", end=" ")  # 黑子
                else:
                    print("○", end=" ")  # 白子
            print()
        print()

    def is_valid_move(self, row: int, col: int) -> bool:
        """
        检查落子是否有效
        :param row: 行坐标
        :param col: 列坐标
        :return: 是否有效
        """
        if row < 0 or row >= self.size or col < 0 or col >= self.size:
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
        
        if self.check_win(row, col):
            self.game_over = True
            self.winner = self.current_player
        elif self.is_board_full():
            self.game_over = True
            self.winner = 0  # 平局

        # 切换玩家
        self.current_player = 3 - self.current_player  # 1->2, 2->1
        
        return True

    def check_win(self, row: int, col: int) -> bool:
        """
        检查是否获胜
        :param row: 最后落子的行坐标
        :param col: 最后落子的列坐标
        :return: 是否获胜
        """
        player = self.board[row][col]
        if player == 0:
            return False

        # 检查四个方向：水平、垂直、对角线（左上到右下、右上到左下）
        directions = [
            [(0, 1), (0, -1)],   # 水平
            [(1, 0), (-1, 0)],   # 垂直
            [(1, 1), (-1, -1)],  # 对角线1
            [(1, -1), (-1, 1)]   # 对角线2
        ]

        for direction_pair in directions:
            count = 1  # 包含当前落子
            
            for direction in direction_pair:
                dr, dc = direction
                r, c = row + dr, col + dc
                
                # 向一个方向延伸计数
                while 0 <= r < self.size and 0 <= c < self.size and self.board[r][c] == player:
                    count += 1
                    r += dr
                    c += dc

            if count >= 5:
                return True

        return False

    def is_board_full(self) -> bool:
        """检查棋盘是否已满"""
        return not (0 in self.board)

    def reset_game(self):
        """重置游戏"""
        self.board = np.zeros((self.size, self.size), dtype=int)
        self.current_player = 1
        self.game_over = False
        self.winner = None

    def get_game_status(self) -> str:
        """获取游戏状态"""
        if not self.game_over:
            return f"当前玩家: {'黑子' if self.current_player == 1 else '白子'}"
        elif self.winner == 0:
            return "平局!"
        else:
            return f"获胜者: {'黑子' if self.winner == 1 else '白子'}"


def main():
    """主函数，运行五子棋游戏"""
    print("欢迎来到五子棋游戏！")
    print("输入格式: 行 列 (例如: 7 7 表示第7行第7列)")
    print("输入 'quit' 或 'exit' 退出游戏")
    print("输入 'restart' 重新开始游戏")
    
    game = Gomoku()
    
    while True:
        print("\n当前棋盘状态:")
        game.display_board()
        print(game.get_game_status())
        
        if game.game_over:
            play_again = input("游戏结束！是否再来一局？(y/n): ")
            if play_again.lower() in ['y', 'yes']:
                game.reset_game()
                continue
            else:
                print("谢谢游戏！再见！")
                break
        
        user_input = input("请输入您的落子位置 (行 列): ").strip()
        
        if user_input.lower() in ['quit', 'exit']:
            print("游戏结束！")
            break
        elif user_input.lower() == 'restart':
            game.reset_game()
            print("游戏已重新开始！")
            continue
        
        try:
            parts = user_input.split()
            if len(parts) != 2:
                print("输入格式错误！请输入 行 列 两个数字，例如: 7 7")
                continue
            
            row = int(parts[0])
            col = int(parts[1])
            
            if game.make_move(row, col):
                print(f"落子成功: ({row}, {col})")
            else:
                print("无效的落子位置，请重新输入！")
        except ValueError:
            print("请输入有效的数字！")
        except Exception as e:
            print(f"发生错误: {e}")


if __name__ == "__main__":
    main()