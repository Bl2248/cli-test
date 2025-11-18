import pygame
import random
import sys

# 初始化Pygame
pygame.init()

# 游戏窗口尺寸
SCREEN_WIDTH = 480
SCREEN_HEIGHT = 640
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("飞机大战")

# 颜色定义
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)

# 游戏时钟
clock = pygame.time.Clock()

class Player:
    def __init__(self):
        self.x = SCREEN_WIDTH // 2
        self.y = SCREEN_HEIGHT - 60
        self.width = 50
        self.height = 40
        self.speed = 5
        self.color = GREEN

    def draw(self):
        pygame.draw.rect(screen, self.color, (self.x, self.y, self.width, self.height))
        # 绘制飞机形状
        pygame.draw.polygon(screen, self.color, [
            (self.x + self.width//2, self.y),
            (self.x, self.y + self.height),
            (self.x + self.width, self.y + self.height)
        ])

    def move(self, dx, dy):
        self.x += dx
        self.y += dy
        # 边界检查
        if self.x < 0:
            self.x = 0
        if self.x > SCREEN_WIDTH - self.width:
            self.x = SCREEN_WIDTH - self.width
        if self.y < 0:
            self.y = 0
        if self.y > SCREEN_HEIGHT - self.height:
            self.y = SCREEN_HEIGHT - self.height

class Bullet:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.width = 5
        self.height = 10
        self.speed = 7
        self.color = BLUE

    def draw(self):
        pygame.draw.rect(screen, self.color, (self.x, self.y, self.width, self.height))

    def move(self):
        self.y -= self.speed

    def is_off_screen(self):
        return self.y < 0

class Enemy:
    def __init__(self):
        self.width = 40
        self.height = 30
        self.x = random.randint(0, SCREEN_WIDTH - self.width)
        self.y = -self.height
        self.speed = random.randint(2, 5)
        self.color = RED

    def draw(self):
        pygame.draw.rect(screen, self.color, (self.x, self.y, self.width, self.height))
        # 绘制敌机形状
        pygame.draw.polygon(screen, self.color, [
            (self.x + self.width//2, self.y + self.height),
            (self.x, self.y),
            (self.x + self.width, self.y)
        ])

    def move(self):
        self.y += self.speed

    def is_off_screen(self):
        return self.y > SCREEN_HEIGHT

class Game:
    def __init__(self):
        self.player = Player()
        self.bullets = []
        self.enemies = []
        self.score = 0
        self.font = pygame.font.SysFont(None, 36)
        self.enemy_spawn_timer = 0
        self.enemy_spawn_delay = 30  # 帧数
        self.running = True

    def spawn_enemy(self):
        self.enemy_spawn_timer += 1
        if self.enemy_spawn_timer >= self.enemy_spawn_delay:
            self.enemies.append(Enemy())
            self.enemy_spawn_timer = 0
            # 随机调整生成频率
            self.enemy_spawn_delay = random.randint(20, 60)

    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    # 发射子弹
                    bullet_x = self.player.x + self.player.width // 2 - 2
                    bullet_y = self.player.y
                    self.bullets.append(Bullet(bullet_x, bullet_y))

    def update(self):
        # 处理键盘输入
        keys = pygame.key.get_pressed()
        dx, dy = 0, 0
        if keys[pygame.K_LEFT] or keys[pygame.K_a]:
            dx = -self.player.speed
        if keys[pygame.K_RIGHT] or keys[pygame.K_d]:
            dx = self.player.speed
        if keys[pygame.K_UP] or keys[pygame.K_w]:
            dy = -self.player.speed
        if keys[pygame.K_DOWN] or keys[pygame.K_s]:
            dy = self.player.speed
        self.player.move(dx, dy)

        # 更新子弹位置
        for bullet in self.bullets[:]:
            bullet.move()
            if bullet.is_off_screen():
                self.bullets.remove(bullet)

        # 生成敌人
        self.spawn_enemy()

        # 更新敌人位置
        for enemy in self.enemies[:]:
            enemy.move()
            if enemy.is_off_screen():
                self.enemies.remove(enemy)

        # 检测子弹与敌人的碰撞
        for bullet in self.bullets[:]:
            for enemy in self.enemies[:]:
                if (bullet.x < enemy.x + enemy.width and
                    bullet.x + bullet.width > enemy.x and
                    bullet.y < enemy.y + enemy.height and
                    bullet.y + bullet.height > enemy.y):
                    # 发生碰撞
                    if bullet in self.bullets:
                        self.bullets.remove(bullet)
                    if enemy in self.enemies:
                        self.enemies.remove(enemy)
                    self.score += 10

        # 检测玩家与敌人的碰撞
        for enemy in self.enemies[:]:
            if (self.player.x < enemy.x + enemy.width and
                self.player.x + self.player.width > enemy.x and
                self.player.y < enemy.y + enemy.height and
                self.player.y + self.player.height > enemy.y):
                # 游戏结束
                self.running = False

    def draw(self):
        # 清屏
        screen.fill(WHITE)

        # 绘制所有对象
        self.player.draw()
        for bullet in self.bullets:
            bullet.draw()
        for enemy in self.enemies:
            enemy.draw()

        # 绘制分数
        score_text = self.font.render(f"Score: {self.score}", True, BLACK)
        screen.blit(score_text, (10, 10))

        # 更新显示
        pygame.display.flip()

    def run(self):
        while self.running:
            # 处理事件
            self.handle_events()

            # 更新游戏状态
            self.update()

            # 绘制游戏画面
            self.draw()

            # 控制帧率
            clock.tick(60)

        # 游戏结束画面
        screen.fill(WHITE)
        game_over_text = self.font.render(f"Game Over! Final Score: {self.score}", True, BLACK)
        screen.blit(game_over_text, (SCREEN_WIDTH//2 - game_over_text.get_width()//2, SCREEN_HEIGHT//2 - game_over_text.get_height()//2))
        pygame.display.flip()
        pygame.time.wait(3000)  # 等待3秒后退出

# 运行游戏
if __name__ == "__main__":
    game = Game()
    game.run()
    pygame.quit()
    sys.exit()