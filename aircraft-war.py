import pygame
import random
import sys

# 初始化Pygame
pygame.init()

# 游戏常量
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
FPS = 60

# 颜色定义
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)

# 创建游戏窗口
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("飞机大战")
clock = pygame.time.Clock()

# 玩家飞机类
class Player:
    def __init__(self):
        self.width = 50
        self.height = 40
        self.x = SCREEN_WIDTH // 2 - self.width // 2
        self.y = SCREEN_HEIGHT - self.height - 10
        self.speed = 5
        self.health = 100

    def draw(self):
        pygame.draw.rect(screen, BLUE, (self.x, self.y, self.width, self.height))
        # 绘制飞机的细节
        pygame.draw.polygon(screen, BLUE, [(self.x + self.width // 2, self.y),
                                          (self.x, self.y + self.height),
                                          (self.x + self.width, self.y + self.height)])

    def move(self, dx, dy):
        self.x += dx * self.speed
        self.y += dy * self.speed
        # 边界检测
        if self.x < 0:
            self.x = 0
        if self.x > SCREEN_WIDTH - self.width:
            self.x = SCREEN_WIDTH - self.width
        if self.y < 0:
            self.y = 0
        if self.y > SCREEN_HEIGHT - self.height:
            self.y = SCREEN_HEIGHT - self.height

    def get_rect(self):
        return pygame.Rect(self.x, self.y, self.width, self.height)

# 子弹类
class Bullet:
    def __init__(self, x, y):
        self.width = 5
        self.height = 15
        self.x = x + 20  # 从飞机中间发射
        self.y = y
        self.speed = 7

    def update(self):
        self.y -= self.speed

    def draw(self):
        pygame.draw.rect(screen, GREEN, (self.x, self.y, self.width, self.height))

    def is_off_screen(self):
        return self.y < 0

    def get_rect(self):
        return pygame.Rect(self.x, self.y, self.width, self.height)

# 敌机类
class Enemy:
    def __init__(self):
        self.width = 40
        self.height = 30
        self.x = random.randint(0, SCREEN_WIDTH - self.width)
        self.y = random.randint(-100, -40)
        self.speed = random.randint(1, 3)

    def update(self):
        self.y += self.speed

    def draw(self):
        pygame.draw.rect(screen, RED, (self.x, self.y, self.width, self.height))
        # 绘制敌机的细节
        pygame.draw.polygon(screen, RED, [(self.x, self.y),
                                          (self.x + self.width, self.y),
                                          (self.x + self.width // 2, self.y + self.height)])

    def is_off_screen(self):
        return self.y > SCREEN_HEIGHT

    def get_rect(self):
        return pygame.Rect(self.x, self.y, self.width, self.height)

# 游戏主循环
def main():
    player = Player()
    bullets = []
    enemies = []
    score = 0
    enemy_spawn_timer = 0

    running = True
    while running:
        # 控制帧率
        clock.tick(FPS)

        # 事件处理
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    # 发射子弹
                    bullets.append(Bullet(player.x, player.y))

        # 获取键盘状态
        keys = pygame.key.get_pressed()
        dx = 0
        dy = 0
        if keys[pygame.K_LEFT] or keys[pygame.K_a]:
            dx = -1
        if keys[pygame.K_RIGHT] or keys[pygame.K_d]:
            dx = 1
        if keys[pygame.K_UP] or keys[pygame.K_w]:
            dy = -1
        if keys[pygame.K_DOWN] or keys[pygame.K_s]:
            dy = 1

        # 更新玩家位置
        player.move(dx, dy)

        # 更新子弹位置
        for bullet in bullets[:]:
            bullet.update()
            if bullet.is_off_screen():
                bullets.remove(bullet)

        # 生成敌机
        enemy_spawn_timer += 1
        if enemy_spawn_timer >= 60:  # 每秒生成一架敌机
            enemies.append(Enemy())
            enemy_spawn_timer = 0

        # 更新敌机位置
        for enemy in enemies[:]:
            enemy.update()
            if enemy.is_off_screen():
                enemies.remove(enemy)

        # 检测子弹与敌机碰撞
        for bullet in bullets[:]:
            for enemy in enemies[:]:
                if bullet.get_rect().colliderect(enemy.get_rect()):
                    if bullet in bullets:
                        bullets.remove(bullet)
                    enemies.remove(enemy)
                    score += 10
                    break

        # 检测玩家与敌机碰撞
        for enemy in enemies[:]:
            if player.get_rect().colliderect(enemy.get_rect()):
                player.health -= 10
                enemies.remove(enemy)
                if player.health <= 0:
                    running = False

        # 绘制
        screen.fill(BLACK)

        # 绘制玩家
        player.draw()

        # 绘制子弹
        for bullet in bullets:
            bullet.draw()

        # 绘制敌机
        for enemy in enemies:
            enemy.draw()

        # 绘制UI
        font = pygame.font.SysFont(None, 36)
        score_text = font.render(f"Score: {score}", True, WHITE)
        health_text = font.render(f"Health: {player.health}", True, WHITE)
        screen.blit(score_text, (10, 10))
        screen.blit(health_text, (10, 50))

        # 更新显示
        pygame.display.flip()

    # 游戏结束
    font = pygame.font.SysFont(None, 72)
    game_over_text = font.render("GAME OVER", True, WHITE)
    final_score_text = font.render(f"Final Score: {score}", True, WHITE)
    screen.blit(game_over_text, (SCREEN_WIDTH // 2 - game_over_text.get_width() // 2, 
                                 SCREEN_HEIGHT // 2 - game_over_text.get_height() // 2))
    screen.blit(final_score_text, (SCREEN_WIDTH // 2 - final_score_text.get_width() // 2, 
                                   SCREEN_HEIGHT // 2 - final_score_text.get_height() // 2 + 50))
    pygame.display.flip()

    # 等待几秒后退出
    pygame.time.wait(3000)
    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()