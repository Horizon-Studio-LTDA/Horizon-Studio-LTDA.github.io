/*
 _   _            _                  _____ _             _ _         _    ___________  ___  
| | | |          (_)                /  ___| |           | (_)       | |  |_   _|  _  \/ _ \ 
| |_| | ___  _ __ _ _______  _ __   \ `--.| |_ _   _  __| |_  ___   | |    | | | | | / /_\ \
|  _  |/ _ \| '__| |_  / _ \| '_ \   `--. \ __| | | |/ _` | |/ _ \  | |    | | | | | |  _  |
| | | | (_) | |  | |/ / (_) | | | | /\__/ / |_| |_| | (_| | | (_) | | |____| | | |/ /| | | |
\_| |_/\___/|_|  |_/___\___/|_| |_| \____/ \__|\__,_|\__,_|_|\___/  \_____/\_/ |___/ \_| |_/
                                                                                            
                                                                                            
Empresa: @horizon.studio.co
Website: https://horizonstudio.com.br/

Dev: Erlon Dantas (@erlondnjr)

*/


class EcoRunner {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();

        this.gameState = 'menu';
        this.setupEventListeners();
        this.loadAssets();
        this.setupAudio();

        this.backgroundMusic = {
            menu: new Audio('sounds/a-lil-bit.mp3'),
            gameplay: new Audio('sounds/8-bit-sheriff.mp3')
        };
        
        this.setupBackgroundMusic();
    }

    setupBackgroundMusic() {
        Object.values(this.backgroundMusic).forEach(music => {
            music.volume = 0.1;
            music.loop = true;
        });
        
        this.playMenuMusic();
    }

    async playMenuMusic() {
        try {
            this.backgroundMusic.gameplay.pause();
            this.backgroundMusic.gameplay.currentTime = 0;
            
            await this.backgroundMusic.menu.play();
        } catch (error) {
            console.log('Autoplay bloqueado ou erro na música:', error);
        }
    }


    playGameplayMusic() {
        this.backgroundMusic.menu.pause();
        this.backgroundMusic.menu.currentTime = 0;
        
        this.backgroundMusic.gameplay.play().catch(e => console.log('Erro ao tocar música de gameplay:', e));
    }

    stopAllMusic() {
        Object.values(this.backgroundMusic).forEach(music => {
            music.pause();
            music.currentTime = 0;
        });
    }

    setupCanvas() {
        this.canvas.width = 1200;
        this.canvas.height = 600;
        this.groundLevel = this.canvas.height - 40;
    }

    setupAudio() {
        this.audio = {
            jump: new Audio('sounds/jump.mp3'),
            collect: new Audio('sounds/collect.mp3'),
            damage: new Audio('sounds/damage.mp3')
        };

        Object.values(this.audio).forEach(sound => {
            sound.volume = 0.3;
        });
    }

    async loadAssets() {
        this.assets = {
            player: await this.loadImage('images/player.png'),
            fire: await this.loadImage('images/fire.png'),
            wood: await this.loadImage('images/wood.png'),
            paper: await this.loadImage('images/paper.png'),
            can: await this.loadImage('images/can.png'),
            bottle: await this.loadImage('images/bottle.png'),
            banana: await this.loadImage('images/banana.png'),
            bg_grass: await this.loadImage('images/bg-grass.png'),
            bg_burn: await this.loadImage('images/bg-burn.png'),
            floor_sand: await this.loadImage('images/floor-sand.png'),
            floor_grass: await this.loadImage('images/floor-grass.png')
        };

        this.currentTheme = 'grass';
        this.nextTheme = 'sand';
        this.lastThemeChange = 0;
        this.themeDuration = 30 * 60;
        this.transitionProgress = 0;
        this.isTransitioning = false;
        this.transitionDuration = 90;
    }

    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => {
                console.warn('Erro ao carregar: ' + src);
                const canvas = document.createElement('canvas');
                if (src.includes('floor')) {
                    canvas.width = 100;
                    canvas.height = 40;
                    const ctx = canvas.getContext('2d');
                    if (src.includes('grass')) {
                        ctx.fillStyle = '#2E8B57';
                        ctx.fillRect(0, 0, 100, 40);
                        ctx.fillStyle = '#228B22';
                        for (let i = 0; i < 100; i += 20) {
                            ctx.fillRect(i, 5, 10, 3);
                        }
                    } else {
                        ctx.fillStyle = '#8B4513';
                        ctx.fillRect(0, 0, 100, 40);
                        ctx.fillStyle = '#A0522D';
                        for (let i = 0; i < 100; i += 15) {
                            ctx.fillRect(i, 8, 8, 4);
                        }
                    }
                } else if (src.includes('bg_')) {
                    canvas.width = 1200;
                    canvas.height = 600;
                    const ctx = canvas.getContext('2d');
                    if (src.includes('grass')) {
                        ctx.fillStyle = '#87CEEB';
                        ctx.fillRect(0, 0, 1200, 600);
                        ctx.fillStyle = '#90EE90';
                        for (let i = 0; i < 1200; i += 100) {
                            ctx.beginPath();
                            ctx.arc(i, 150, 40, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    } else {
                        ctx.fillStyle = '#FFA500';
                        ctx.fillRect(0, 0, 1200, 600);
                        ctx.fillStyle = '#8B4513';
                        for (let i = 0; i < 1200; i += 80) {
                            ctx.fillRect(i, 200, 3, 100);
                        }
                    }
                } else if (src.includes('player')) {
                    canvas.width = 50;
                    canvas.height = 50;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#4CAF50';
                    ctx.beginPath();
                    ctx.arc(25, 25, 25, 0, Math.PI * 2);
                    ctx.fill();
                } else if (src.includes('wood')) {
                    canvas.width = 30;
                    canvas.height = 45;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(5, 10, 20, 30);
                    ctx.fillStyle = '#A0522D';
                    ctx.fillRect(8, 8, 14, 5);
                } else {
                    canvas.width = 25;
                    canvas.height = 25;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#888888';
                    ctx.fillRect(0, 0, 25, 25);
                    ctx.fillStyle = 'white';
                    ctx.font = '12px Arial';
                    ctx.fillText('?', 12, 12);
                }
                resolve(canvas);
            };
            img.src = src;
        });
    }

    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('instructions-btn').addEventListener('click', () => {
            this.showScreen('instructions-screen');
        });

        document.getElementById('credits-btn').addEventListener('click', () => {
            this.showScreen('credits-screen');
        });

        document.getElementById('back-btn').addEventListener('click', () => {
            this.showScreen('start-screen');
        });

        document.getElementById('credits-back-btn').addEventListener('click', () => {
            this.showScreen('start-screen');
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
            this.startGame();
        });

        document.addEventListener('keydown', (e) => {
            if (this.gameState !== 'playing') return;

            if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
                e.preventDefault();
                this.player.jump();
            }
        });

        document.getElementById('music-volume').addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            Object.values(this.backgroundMusic).forEach(music => {
                music.volume = volume;
            });
        });
    }

    startGame() {
        this.showScreen('game-screen');
        this.gameState = 'playing';

        this.playGameplayMusic();

        this.player = new Player(this);
        this.obstacles = [];
        this.items = [];

        this.score = 0;
        this.lives = 3;
        this.gameTime = 0;
        this.gameSpeed = 8;
        this.currentTheme = 'grass';
        this.nextTheme = 'sand';
        this.lastThemeChange = 0;
        this.transitionProgress = 0;
        this.isTransitioning = false;

        this.lastObstacleTime = 0;
        this.lastItemTime = 0;

        this.updateHUD();
        this.gameLoop();
    }

    updateTheme() {
        const timeSinceChange = this.gameTime - this.lastThemeChange;

        if (!this.isTransitioning && timeSinceChange >= this.themeDuration - this.transitionDuration) {
            this.isTransitioning = true;
            this.nextTheme = this.currentTheme === 'grass' ? 'sand' : 'grass';
        }

        if (this.isTransitioning) {
            this.transitionProgress = (timeSinceChange - (this.themeDuration - this.transitionDuration)) / this.transitionDuration;

            if (this.transitionProgress >= 1) {
                this.currentTheme = this.nextTheme;
                this.isTransitioning = false;
                this.transitionProgress = 0;
                this.lastThemeChange = this.gameTime;
                this.obstacles = [];
                this.lastObstacleTime = this.gameTime;
            }
        }
    }

    getCurrentBackgroundAsset() {
        if (this.isTransitioning) {
            const currentAsset = this.currentTheme === 'grass' ? this.assets.bg_grass : this.assets.bg_burn;
            const nextAsset = this.nextTheme === 'grass' ? this.assets.bg_grass : this.assets.bg_burn;
            return this.transitionProgress < 0.7 ? currentAsset : nextAsset;
        }
        return this.currentTheme === 'grass' ? this.assets.bg_grass : this.assets.bg_burn;
    }

    getCurrentObstacleAsset() {
        if (this.isTransitioning) {
            const currentAsset = this.currentTheme === 'grass' ? this.assets.wood : this.assets.fire;
            const nextAsset = this.nextTheme === 'grass' ? this.assets.wood : this.assets.fire;
            return this.transitionProgress < 0.5 ? currentAsset : nextAsset;
        }
        return this.currentTheme === 'grass' ? this.assets.wood : this.assets.fire;
    }

    getCurrentFloorAsset() {
        if (this.isTransitioning) {
            const currentAsset = this.currentTheme === 'grass' ? this.assets.floor_grass : this.assets.floor_sand;
            const nextAsset = this.nextTheme === 'grass' ? this.assets.floor_grass : this.assets.floor_sand;
            return this.transitionProgress < 0.5 ? currentAsset : nextAsset;
        }
        return this.currentTheme === 'grass' ? this.assets.floor_grass : this.assets.floor_sand;
    }

    getTransitionColor() {
        if (!this.isTransitioning) return null;

        const grassColor = '#2E8B57';
        const sandColor = '#8B4513';

        if (this.transitionProgress < 0.5) {
            return this.mixColors(grassColor, sandColor, this.transitionProgress * 2);
        } else {
            return this.mixColors(sandColor, grassColor, (this.transitionProgress - 0.5) * 2);
        }
    }

    mixColors(color1, color2, ratio) {
        const r1 = parseInt(color1.substr(1, 2), 16);
        const g1 = parseInt(color1.substr(3, 2), 16);
        const b1 = parseInt(color1.substr(5, 2), 16);

        const r2 = parseInt(color2.substr(1, 2), 16);
        const g2 = parseInt(color2.substr(3, 2), 16);
        const b2 = parseInt(color2.substr(5, 2), 16);

        const r = Math.round(r1 + (r2 - r1) * ratio);
        const g = Math.round(g1 + (g2 - g1) * ratio);
        const b = Math.round(b1 + (b2 - b1) * ratio);

        return `rgb(${r}, ${g}, ${b})`;
    }

    gameLoop() {
        if (this.gameState !== 'playing') return;

        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        this.gameTime++;
        this.gameSpeed = 8 + (this.gameTime / 600);

        this.updateTheme();

        const currentTime = this.gameTime;

        if (currentTime - this.lastObstacleTime > Math.max(60, 120 - this.gameTime / 100)) {
            this.spawnObstacle();
            this.lastObstacleTime = currentTime;
        }

        if (currentTime - this.lastItemTime > Math.max(90, 180 - this.gameTime / 80) &&
            currentTime - this.lastObstacleTime > 60) {
            this.spawnItem();
            this.lastItemTime = currentTime;
        }

        this.obstacles.forEach(obstacle => {
            obstacle.x -= obstacle.speed * this.gameSpeed * 0.1;
        });

        this.items.forEach(item => {
            item.x -= item.speed * this.gameSpeed * 0.1;
        });

        this.obstacles = this.obstacles.filter(obs => obs.x + obs.width > 0);
        this.items = this.items.filter(item => item.x + item.width > 0);

        this.player.updateRotationSpeed(this.gameTime);

        this.checkCollisions();

        if (this.gameTime % 60 === 0) {
            this.updateHUD();
        }
    }

    draw() {
        const currentBackground = this.getCurrentBackgroundAsset();
        if (currentBackground) {
            this.ctx.drawImage(currentBackground, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            const bgColor = this.currentTheme === 'grass' ? '#87CEEB' : '#FFA500';
            this.ctx.fillStyle = bgColor;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        const currentFloor = this.getCurrentFloorAsset();
        if (currentFloor) {
            const floorPattern = this.ctx.createPattern(currentFloor, 'repeat');
            this.ctx.fillStyle = floorPattern;
            this.ctx.fillRect(0, this.groundLevel, this.canvas.width, 40);
        } else {
            const transitionColor = this.getTransitionColor();
            if (transitionColor) {
                this.ctx.fillStyle = transitionColor;
            } else {
                this.ctx.fillStyle = this.currentTheme === 'grass' ? '#2E8B57' : '#8B4513';
            }
            this.ctx.fillRect(0, this.groundLevel, this.canvas.width, 40);
        }

        if (this.isTransitioning) {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * Math.sin(this.transitionProgress * Math.PI)}`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        this.items.forEach(item => {
            this.ctx.drawImage(this.assets[item.type], item.x, this.groundLevel - item.height - 15, item.width, item.height);
        });

        const currentObstacle = this.getCurrentObstacleAsset();
        this.obstacles.forEach(obstacle => {
            this.ctx.drawImage(currentObstacle, obstacle.x, this.groundLevel - obstacle.height, obstacle.width, obstacle.height);
        });

        this.player.draw();

        this.drawThemeIndicator();
    }

    drawThemeIndicator() {
        const currentThemeName = this.currentTheme === 'grass' ? 'Floresta' : 'Deserto';
        const nextThemeName = this.nextTheme === 'grass' ? 'Floresta' : 'Deserto';
        const textColor = this.currentTheme === 'grass' ? '#2E8B57' : '#8B4513';

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(this.canvas.width - 150, 10, 140, this.isTransitioning ? 50 : 30);

        if (this.isTransitioning) {
            this.ctx.fillStyle = textColor;
            this.ctx.font = '12px Arial';
            this.ctx.fillText('Transição:', this.canvas.width - 140, 25);
            this.ctx.fillText(`${currentThemeName} → ${nextThemeName}`, this.canvas.width - 140, 45);
        } else {
            this.ctx.fillStyle = textColor;
            this.ctx.font = '14px Arial';
            this.ctx.fillText(currentThemeName, this.canvas.width - 140, 30);

            const timeLeft = this.themeDuration - (this.gameTime - this.lastThemeChange);
            const secondsLeft = Math.ceil(timeLeft / 60);
            this.ctx.fillStyle = 'white';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(secondsLeft + 's', this.canvas.width - 60, 30);
        }
    }

    spawnObstacle() {
        const baseSpeed = this.currentTheme === 'grass' ? 3.5 : 4;
        const types = [
            { speed: baseSpeed + 0.8, gap: 180 },
            { speed: baseSpeed + 0.5, gap: 220 },
            { speed: baseSpeed + 0.2, gap: 260 }
        ];
        const type = types[Math.floor(Math.random() * types.length)];

        const lastObstacle = this.obstacles[this.obstacles.length - 1];
        if (lastObstacle && lastObstacle.x > this.canvas.width - type.gap) {
            return;
        }

        this.obstacles.push({
            x: this.canvas.width,
            width: 30,
            height: 45,
            speed: type.speed
        });
    }

    spawnItem() {
        const types = ['paper', 'can', 'bottle', 'banana'];
        const type = types[Math.floor(Math.random() * types.length)];

        const nearObstacle = this.obstacles.some(obs =>
            Math.abs(obs.x - this.canvas.width) < 150
        );

        if (nearObstacle) return;

        this.items.push({
            x: this.canvas.width,
            width: 24,
            height: 45,
            speed: 3,
            type: type
        });
    }

    checkCollisions() {
        this.obstacles.forEach((obstacle, index) => {
            const obstacleY = this.groundLevel - obstacle.height;

            if (this.player.x < obstacle.x + obstacle.width &&
                this.player.x + this.player.width > obstacle.x &&
                this.player.y < obstacleY + obstacle.height &&
                this.player.y + this.player.height > obstacleY) {

                this.lives--;
                this.score = Math.max(0, this.score - 5);
                this.showDamageEffect();
                this.audio.damage.play().catch(() => { });
                this.updateHUD();

                this.obstacles.splice(index, 1);

                if (this.lives <= 0) {
                    this.gameOver();
                }
                return;
            }
        });

        this.items.forEach((item, index) => {
            const itemY = this.groundLevel - item.height - 15;

            if (this.player.x < item.x + item.width &&
                this.player.x + this.player.width > item.x &&
                this.player.y < itemY + item.height &&
                this.player.y + this.player.height > itemY) {

                this.score += 10;
                this.items.splice(index, 1);
                this.showCollectionEffect();
                this.audio.collect.play().catch(() => { });
                this.updateHUD();
            }
        });
    }

    showDamageEffect() {
        const originalColor = this.canvas.style.backgroundColor;
        this.canvas.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        setTimeout(() => {
            this.canvas.style.backgroundColor = originalColor;
        }, 300);
    }

    showCollectionEffect() {
        const originalColor = this.canvas.style.backgroundColor;
        this.canvas.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
        setTimeout(() => {
            this.canvas.style.backgroundColor = originalColor;
        }, 200);
    }

    updateHUD() {
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('timer').textContent = Math.floor(this.gameTime / 60);
        document.getElementById('score').textContent = this.score;
    }

    showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenName).classList.add('active');
        this.currentScreen = screenName;

        if (screenName === 'start-screen' || screenName === 'instructions-screen' || screenName === 'credits-screen') {
            this.playMenuMusic();
        } else if (screenName === 'game-screen') {
            this.playGameplayMusic();
        } else if (screenName === 'gameover-screen') {
            this.stopAllMusic();
        }
    }

    gameOver() {
        this.gameState = 'gameover';
        this.showScreen('gameover-screen');

        const finalStats = document.getElementById('final-stats');
        finalStats.innerHTML = `
            <p>Tempo de jogo: ${Math.floor(this.gameTime / 60)} segundos</p>
            <p>Pontuação total: ${this.score} pontos</p>
            <p>Itens reciclados: ${Math.floor(this.score / 10)} itens</p>
            <p style="color: #2E8B57; margin-top: 10px;">O planeta agradece sua ajuda! 🌱</p>
        `;
    }
}

class Player {
    constructor(game) {
        this.game = game;
        this.width = 50;
        this.height = 50;
        this.x = 100;
        this.y = game.groundLevel - this.height;
        this.jumpForce = 0;
        this.isJumping = false;
        this.gravity = 0.6;
        this.groundY = this.y;
        this.rotation = 0;
        this.baseRotationSpeed = 3;
        this.rotationSpeed = this.baseRotationSpeed;
    }

    updateRotationSpeed(gameTime) {
        this.rotationSpeed = this.baseRotationSpeed + (gameTime / 600);
    }

    jump() {
        if (!this.isJumping) {
            this.jumpForce = -12;
            this.isJumping = true;
            this.game.audio.jump.play().catch(() => { });
        }
    }

    update() {
        if (this.isJumping) {
            this.y += this.jumpForce;
            this.jumpForce += this.gravity;

            if (this.y >= this.groundY) {
                this.y = this.groundY;
                this.isJumping = false;
                this.jumpForce = 0;
            }
        }

        this.rotation += this.rotationSpeed;
        if (this.rotation >= 360) {
            this.rotation = 0;
        }
    }

    draw() {
        this.update();

        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        this.game.ctx.save();
        this.game.ctx.translate(centerX, centerY);
        this.game.ctx.rotate(this.rotation * Math.PI / 180);
        this.game.ctx.drawImage(
            this.game.assets.player,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );
        this.game.ctx.restore();
    }
}

window.addEventListener('load', () => {
    new EcoRunner();
});