# 五子棋游戏

这是一个使用Python实现的命令行五子棋游戏。

## 游戏规则

五子棋是一种两人对弈的纯策略型棋类游戏，通常使用黑白两色的棋子在棋盘上进行对战。当一方棋子在横、竖或斜方向上形成连续的五子时，该方获胜。

## 运行游戏

### 方法1：使用启动脚本
```bash
chmod +x start_game.sh
./start_game.sh
```

### 方法2：直接运行Python文件
```bash
pip3 install -r requirements.txt
python3 gomoku.py
```

## 游戏操作

- 玩家1（黑棋）：●
- 玩家2（白棋）：○
- 输入格式：`行 列`，例如 `7 7` 表示第7行第7列
- 输入 `q` 退出游戏

## 依赖

- Python 3.x
- NumPy

## 文件说明

- `gomoku.py` - 五子棋游戏的主代码
- `requirements.txt` - 项目依赖
- `start_game.sh` - 启动脚本