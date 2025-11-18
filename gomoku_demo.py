#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
五子棋游戏 - 非交互式测试版本
"""


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
        # 使用列表创建棋盘，0表示空位，1表示黑棋，2表示白棋
        self.board = [[0 for _ in range(board_size)] for _ in range(board_size)]
        # 玩家1为黑棋，玩家2为白棋
        self.current_player = 1
        self.game_over = False
        self.winner = None
        
    def display_board(self):
        """
        显示棋盘
        """
        # 打印列号
        print("   ", end="")
        for i in range(min(self.board_size, 10)):  # 限制显示列数以便查看
            print(f"{i:2d}", end=" ")
        print()
        
        for i in range(min(self.board_size, 10)):  # 限制显示行数以便查看
            # 打印行号
            print(f"{i:2d} ", end=" ")
            for j in range(min(self.board_size, 10)):
                if self.board[i][j] == 0:
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
        for row in self.board:
            if 0 in row:
                return False
        return True
    
    def reset_game(self):
        """
        重置游戏
        """
        self.board = [[0 for _ in range(self.board_size)] for _ in range(self.board_size)]
        self.current_player = 1
        self.game_over = False
        self.winner = None


def demo_game():
    """
    演示游戏功能
    """
    print("=== 五子棋游戏演示 ===")
    game = Gomoku()
    
    print("\n初始棋盘:")
    game.display_board()
    
    print("\n开始演示游戏...")
    
    # 演示一些落子
    moves = [
        (4, 4), (4, 5),  # 玩家1和玩家2的前几步
        (5, 4), (5, 5),
        (6, 4), (6, 5),
        (7, 4), (7, 5),
        (8, 4)  # 玩家1在垂直方向连成五子
    ]
    
    for i, (row, col) in enumerate(moves):
        player = 1 if i % 2 == 0 else 2
        print(f"\n玩家 {player} 在 ({row}, {col}) 落子:")
        success = game.make_move(row, col)
        if success:
            game.display_board()
            if game.game_over:
                if game.winner == 0:
                    print("平局！")
                else:
                    print(f"玩家 {game.winner} 获胜！")
                break
        else:
            print(f"落子失败: ({row}, {col})")
    
    print("\n=== 演示完成 ===")


if __name__ == "__main__":
    demo_game()