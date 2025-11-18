#!/usr/bin/env python3
"""
五子棋游戏实现
"""

class Gomoku:
    def __init__(self, size=15):
        """
        初始化五子棋游戏
        :param size: 棋盘大小，默认15x15
        """
        self.size = size
        self.board = [[0 for _ in range(size)] for _ in range(size)]
        self.current_player = 1  # 1表示黑棋，2表示白棋
        self.game_over = False
        self.winner = None

    def display_board(self):
        """显示棋盘"""
        print("  ", end="")
        for i in range(self.size):
            print(f"{i:2}", end=" ")
        print()
        
        for i, row in enumerate(self.board):
            print(f"{i:2}", end=" ")
            for cell in row:
                if cell == 0:
                    print("+ ", end=" ")
                elif cell == 1:
                    print("●", end=" ")  # 黑棋
                else:
                    print("○", end=" ")  # 白棋
            print()
        print()

    def is_valid_move(self, row, col):
        """
        检查落子是否有效
        :param row: 行
        :param col: 列
        :return: 是否有效
        """
        if row < 0 or row >= self.size or col < 0 or col >= self.size:
            return False
        return self.board[row][col] == 0

    def make_move(self, row, col):
        """
        落子
        :param row: 行
        :param col: 列
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
        else:
            # 切换玩家
            self.current_player = 3 - self.current_player  # 1变2，2变1
        
        return True

    def check_winner(self, row, col):
        """
        检查是否有人获胜
        :param row: 最后落子的行
        :param col: 最后落子的列
        :return: 是否获胜
        """
        player = self.board[row][col]
        if player == 0:
            return False

        # 检查四个方向：水平、垂直、左上到右下、右上到左下
        directions = [
            [(0, 1), (0, -1)],   # 水平
            [(1, 0), (-1, 0)],   # 垂直
            [(1, 1), (-1, -1)],  # 对角线1
            [(1, -1), (-1, 1)]   # 对角线2
        ]

        for direction_pair in directions:
            count = 1  # 当前位置的棋子算一个
            for dx, dy in direction_pair:
                r, c = row + dx, col + dy
                while (
                    0 <= r < self.size and 
                    0 <= c < self.size and 
                    self.board[r][c] == player
                ):
                    count += 1
                    r += dx
                    c += dy

            if count >= 5:
                return True

        return False

    def is_board_full(self):
        """检查棋盘是否已满"""
        for row in self.board:
            if 0 in row:
                return False
        return True

    def get_player_name(self):
        """获取当前玩家名称"""
        return "黑棋" if self.current_player == 1 else "白棋"

    def reset_game(self):
        """重置游戏"""
        self.__init__(self.size)


def main():
    """主游戏循环"""
    print("欢迎来到五子棋游戏！")
    print("输入格式: row col (例如: 7 7 表示第7行第7列，从0开始计数)")
    print("输入 'quit' 退出游戏")
    
    game = Gomoku()
    
    while not game.game_over:
        game.display_board()
        print(f"轮到 {game.get_player_name()} 落子")
        
        try:
            user_input = input("请输入行和列 (如 '7 7'): ").strip()
            
            if user_input.lower() == 'quit':
                print("游戏退出")
                return
            
            parts = user_input.split()
            if len(parts) != 2:
                print("输入格式错误，请输入两个数字，用空格分隔")
                continue
                
            row, col = map(int, parts)
            
            if not game.make_move(row, col):
                print("无效的落子位置，请重新输入")
                continue
                
        except ValueError:
            print("输入格式错误，请输入两个数字，用空格分隔")
        except KeyboardInterrupt:
            print("\n游戏退出")
            return
    
    # 游戏结束，显示结果
    game.display_board()
    if game.winner == 0:
        print("平局！")
    else:
        winner_name = "黑棋" if game.winner == 1 else "白棋"
        print(f"恭喜！{winner_name} 获胜！")


if __name__ == "__main__":
    main()
