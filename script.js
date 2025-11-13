// 游戏变量
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

// 游戏状态
let score = 0;
let lives = 3;
let gameRunning = true;

// 玩家飞机
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 40,
    speed: 5
};

// 子弹数组
const bullets = [];

// 敌机数组
const enemies = [];

// 键盘状态
const keys = {};

// 初始化游戏
function init() {
    // 事件监听
    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
    });
    
    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });
    
    restartButton.addEventListener('click', restartGame);
    
    // 开始游戏循环
    gameLoop();
}

// 游戏循环
function gameLoop() {
    if (gameRunning) {
        update();
        render();
        requestAnimationFrame(gameLoop);
    }
}

// 更新游戏状态
function update() {
    // 更新玩家
    updatePlayer();
    
    // 更新子弹
    updateBullets();
    
    // 更新敌机
    updateEnemies();
    
    // 生成敌机
    spawnEnemies();
    
    // 检查碰撞
    checkCollisions();
}

// 更新玩家
function updatePlayer() {
    if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
    if (keys['ArrowUp'] && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys['ArrowDown'] && player.y < canvas.height - player.height) {
        player.y += player.speed;
    }
    if (keys[' '] || keys['Spacebar']) {
        shoot();
        // 防止连续射击
        keys[' '] = false;
        keys['Spacebar'] = false;
    }
}

// 发射子弹
function shoot() {
    bullets.push({
        x: player.x + player.width / 2 - 2.5,
        y: player.y,
        width: 5,
        height: 15,
        speed: 7
    });
}

// 更新子弹
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;
        
        // 移除超出屏幕的子弹
        if (bullets[i].y + bullets[i].height < 0) {
            bullets.splice(i, 1);
        }
    }
}

// 更新敌机
function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].y += enemies[i].speed;
        
        // 移除超出屏幕的敌机
        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
            // 扣除生命值
            lives--;
            livesElement.textContent = lives;
            
            // 检查游戏是否结束
            if (lives <= 0) {
                gameOver();
            }
        }
    }
}

// 生成敌机
function spawnEnemies() {
    if (Math.random() < 0.02) {
        enemies.push({
            x: Math.random() * (canvas.width - 40),
            y: -40,
            width: 40,
            height: 30,
            speed: 2 + Math.random() * 2
        });
    }
}

// 检查碰撞
function checkCollisions() {
    // 子弹与敌机碰撞
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (isColliding(bullets[i], enemies[j])) {
                // 增加得分
                score += 10;
                scoreElement.textContent = score;
                
                // 移除子弹和敌机
                bullets.splice(i, 1);
                enemies.splice(j, 1);
                break;
            }
        }
    }
    
    // 玩家与敌机碰撞
    for (let i = enemies.length - 1; i >= 0; i--) {
        if (isColliding(player, enemies[i])) {
            // 扣除生命值
            lives--;
            livesElement.textContent = lives;
            
            // 移除敌机
            enemies.splice(i, 1);
            
            // 检查游戏是否结束
            if (lives <= 0) {
                gameOver();
            }
            break;
        }
    }
}

// 碰撞检测
function isColliding(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// 渲染游戏
function render() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制玩家飞机
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // 绘制子弹
    ctx.fillStyle = '#ffff00';
    for (const bullet of bullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
    
    // 绘制敌机
    ctx.fillStyle = '#ff0000';
    for (const enemy of enemies) {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
}

// 游戏结束
function gameOver() {
    gameRunning = false;
    finalScoreElement.textContent = score;
    gameOverElement.classList.remove('hidden');
}

// 重新开始游戏
function restartGame() {
    // 重置游戏状态
    score = 0;
    lives = 3;
    gameRunning = true;
    
    // 更新UI
    scoreElement.textContent = score;
    livesElement.textContent = lives;
    gameOverElement.classList.add('hidden');
    
    // 清空子弹和敌机
    bullets.length = 0;
    enemies.length = 0;
    
    // 重置玩家位置
    player.x = canvas.width / 2 - 25;
    player.y = canvas.height - 60;
    
    // 重新开始游戏循环
    gameLoop();
}

// 启动游戏
init();