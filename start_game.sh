#!/bin/bash
# 启动五子棋游戏的脚本

# 检查是否已安装numpy
if ! python3 -c "import numpy" &> /dev/null; then
    echo "正在安装依赖..."
    pip3 install -r requirements.txt
fi

echo "启动五子棋游戏..."
python3 gomoku.py