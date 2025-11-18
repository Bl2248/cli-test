# cli-test
提供cli测试的库

## 五子棋游戏

我们实现了一个命令行版本的五子棋游戏，包含以下特性：

- 15x15标准棋盘
- 两名玩家轮流下棋（黑棋和白棋）
- 自动检测胜负（横、竖、对角线连成五子）
- 界面清晰的命令行显示

### 文件说明

- `gomoku.py` - 完整版五子棋游戏（使用numpy）
- `gomoku_simple.py` - 简化版五子棋游戏（不使用numpy）
- `gomoku_demo.py` - 游戏演示版本
- `requirements.txt` - 项目依赖
- `start_game.sh` - 启动脚本
- `GOMOKU.md` - 游戏说明文档
