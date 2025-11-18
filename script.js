// 井字棋游戏逻辑
document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    const winInfo = document.getElementById('win-info');
    
    // 游戏状态变量
    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    
    // 获胜组合
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横向
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // 纵向
        [0, 4, 8], [2, 4, 6]             // 对角线
    ];
    
    // 单元格点击事件处理
    board.addEventListener('click', (e) => {
        if (!gameActive) return;
        
        const cell = e.target;
        const index = parseInt(cell.getAttribute('data-index'));
        
        // 检查是否为空单元格
        if (gameBoard[index] !== '' || isNaN(index)) {
            return;
        }
        
        // 更新游戏板和界面
        makeMove(index, currentPlayer);
        
        // 检查游戏状态
        checkGameStatus();
        
        // 切换玩家
        if (gameActive) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            status.textContent = `当前玩家: ${currentPlayer}`;
        }
    });
    
    // 重置游戏
    resetButton.addEventListener('click', resetGame);
    
    // 执行移动
    function makeMove(index, player) {
        gameBoard[index] = player;
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());
    }
    
    // 检查游戏状态
    function checkGameStatus() {
        // 检查获胜
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                gameActive = false;
                winInfo.textContent = `玩家 ${gameBoard[a]} 获胜！`;
                
                // 高亮获胜单元格
                pattern.forEach(index => {
                    document.querySelector(`.cell[data-index="${index}"]`).classList.add('winning-cell');
                });
                return;
            }
        }
        
        // 检查平局
        if (!gameBoard.includes('')) {
            gameActive = false;
            winInfo.textContent = '平局！';
        }
    }
    
    // 重置游戏
    function resetGame() {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        status.textContent = '当前玩家: X';
        winInfo.textContent = '';
        
        // 清空单元格
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning-cell');
        });
    }
});