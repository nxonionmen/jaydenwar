class Game {
    constructor() {
        this.app = document.getElementById('app');
        this.app.innerHTML = '<canvas id="gameCanvas"></canvas>';
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.player = new Player();
        this.shop = new Shop();
        this.state = 'HOME';
        this.message = '환영합니다! (H)집, (B)전투, (S)상점. (1-4) 무기 교체';

        this.lastAttackTime = 0;

        // Give player all weapons for testing as per request implied by "Use these weapons"
        // Or should they buy them? The Readme lists them as general items.
        // Let's give them all 3 basic weapons to demonstrate the mechanics.
        this.player.inventory.weapons.push(ITEMS.SWORD);
        this.player.inventory.weapons.push(ITEMS.GUN);
        this.player.inventory.weapons.push(ITEMS.SHURIKEN);
        this.player.equipWeapon(ITEMS.SWORD);

        window.addEventListener('keydown', (e) => this.input(e));

        // Assets
        this.bgImage = new Image();
        this.bgImage.src = 'src/background.png';

        this.sound = new SoundManager();
        this.soundStarted = false;

        this.loadGame();
        this.setupMobileControls();
    }

    save() {
        const data = this.player.saveData();
        localStorage.setItem('jayden_war_save', JSON.stringify(data));
    }

    loadGame() {
        const saved = localStorage.getItem('jayden_war_save');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.player.loadData(data);
                this.message = "저장된 게임을 불러왔습니다.";
            } catch (e) {
                console.error("Save load failed", e);
            }
        }
        // Defensive check: Ensure reviveCount is a number
        if (typeof this.player.reviveCount !== 'number') {
            this.player.reviveCount = 0;
        }
    }

    setupMobileControls() {
        const btns = document.querySelectorAll('.control-btn');
        btns.forEach(btn => {
            const handlePress = (e) => {
                e.preventDefault(); // Prevent accidental selection/zoom
                const key = btn.dataset.key;
                this.input({ key: key });
            };
            btn.addEventListener('touchstart', handlePress, { passive: false });
            btn.addEventListener('mousedown', handlePress); // For testing on PC
        });
    }

    resize() {
        this.canvas.width = 800;
        this.canvas.height = 600;
    }

    input(e) {
        // Resume Audio Context on first interaction
        if (!this.soundStarted) {
            this.sound.resume();
            // this.sound.playBGM(); // BGM Disabled by user request
            this.soundStarted = true;
        }

        // Weapon Switching (1, 2, 3)
        if (e.key === '1') {
            this.player.equipWeapon(this.player.inventory.weapons[0]);
            this.message = `장착: ${this.player.inventory.weapons[0].name}`;
        }
        if (e.key === '2') {
            this.player.equipWeapon(this.player.inventory.weapons[1]);
            this.message = `장착: ${this.player.inventory.weapons[1].name}`;
        }
        if (e.key === '3') {
            this.player.equipWeapon(this.player.inventory.weapons[2]);
            this.message = `장착: ${this.player.inventory.weapons[2].name}`;
        }
        if (e.key === '4') {
            if (this.player.inventory.weapons[3]) {
                this.player.equipWeapon(this.player.inventory.weapons[3]);
                this.message = `장착: ${this.player.inventory.weapons[3].name}`;
            } else {
                this.message = "아직 이 무기가 없습니다!";
            }
        }
        this.attack();
    }
}

if (this.state === 'HOME') {
    if (e.key === 'r' || e.key === 'R') {
        this.rest();
    }
}

if (this.state === 'GAMEOVER') {
    if (e.key === 'r' || e.key === 'R') {
        this.revive();
    }
}

// Battle Selection
if (this.state === 'BATTLE_SELECT') {
    if (e.key === '1') this.startBattle('ORC');
    if (e.key === '2') this.startBattle('KNIGHT');
    if (e.key === '3') this.startBattle('DRAGON');
}

if (this.state === 'SHOP') {
    if (e.key === 'p' || e.key === 'P') {
        if (this.shop.buyPotion(this.player)) {
            this.message = "포션 구매 완료!";
            this.sound.playBuy();
            this.save();
        } else {
            this.message = "골드가 부족합니다!";
        }
    }
    if (e.key === 'g' || e.key === 'G') {
        const result = this.shop.buyWeapon(this.player, ITEMS.GREAT_SWORD);
        if (result === 'BOUGHT') {
            this.message = "대검 구매 완료!";
            this.sound.playBuy();
            this.save();
        }
        if (result === 'ALREADY_OWNED') this.message = "이미 가지고 있습니다!";
        if (result === 'NO_GOLD') this.message = "골드가 부족합니다! (50골드 필요)";
    }
}
    }

start() {
    this.gameLoop();
}

gameLoop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
}

update() {
    // Check cooldowns visual?
}

enterBattle() {
    this.state = 'BATTLE_SELECT';
    this.message = '(1)오크 (2)기사 (3)드래곤 - 싸울 상대를 고르세요!';
    this.enemy = null;
}

startBattle(type) {
    this.state = 'BATTLE';
    if (type === 'ORC') {
        this.enemy = { hp: 10, maxHp: 10, name: '오크', xp: 10 };
        this.message = '오크가 나타났습니다!';
    } else if (type === 'KNIGHT') {
        this.enemy = { hp: 30, maxHp: 30, name: '기사', xp: 30 };
        this.message = '기사가 나타났습니다!';
    } else if (type === 'DRAGON') {
        this.enemy = { hp: 100, maxHp: 100, name: '드래곤', xp: 100 };
        this.message = '드래곤이 나타났습니다!';
    }
}

attack() {
    if (!this.enemy) return;

    const now = Date.now();
    const weapon = this.player.activeWeapon || ITEMS.SWORD;

    // Relad Time Check
    if (weapon.reloadTime > 0) {
        const timeSince = (now - this.lastAttackTime) / 1000;
        if (timeSince < weapon.reloadTime) {
            this.message = `재장전 중... (${(weapon.reloadTime - timeSince).toFixed(1)}초)`;
            return;
        }
    }

    // Special Conditions
    if (weapon.special === 'LOW_HP_ONLY') {
        if (this.player.hp > 2) { // "hp 2 이하인 사람만 사용 가능"
            this.message = "체력이 너무 많아 사용할 수 없습니다! (HP 2 이하 필요)";
            return;
        }
    }

    this.lastAttackTime = now;

    const hit = Combat.calculateHit(weapon, null);

    if (hit) {
        this.sound.playAttack();
        const dmg = Combat.calculateDamage(weapon, null);
        this.enemy.hp -= dmg;
        this.message = `${weapon.name} 공격 적중! ${dmg} 데미지!`;

        if (this.enemy.hp <= 0) {
            this.winBattle();
        } else {
            this.enemyAttack();
        }
    } else {
        this.message = `${weapon.name} 빗나감! (${(weapon.hitRate * 100)}%)`;
        this.enemyAttack();
    }
}

enemyAttack() {
    if (!this.enemy || this.enemy.hp <= 0) return;

    const enemyDmg = 1;
    const taken = this.player.takeDamage(enemyDmg);
    this.sound.playHit();

    if (this.player.hp <= 0) {
        this.state = 'GAMEOVER';
        const cost = this.player.reviveCount < 3 ? '무료' : '50골드';
        this.message = `사망했습니다. (R)부활 - 비용: ${cost} (누적: ${this.player.reviveCount}회)`;
    }
}

winBattle() {
    this.state = 'HOME';
    // Reward based on enemy type? strictly 20 gold for now as per minimal logic, but XP varies
    this.player.gold += 20;
    this.player.gainXp(this.enemy.xp || 10);
    this.message = `승리! 20 골드, ${this.enemy.xp} XP 획득.`;
    this.enemy = null;
    this.save();
}

revive() {
    const cost = this.player.reviveCount < 3 ? 0 : 50;

    if (this.player.gold >= cost) {
        this.player.gold -= cost;
        this.player.reviveCount++;
        this.player.hp = Math.floor(this.player.maxHp / 2); // 50% HP Revive
        this.state = 'HOME';
        this.message = `부활했습니다! (HP 50% 회복)`;
        this.save();
    } else {
        this.message = `골드가 부족하여 부활할 수 없습니다. (필요: ${cost})`;
    }
}

rest() {
    if (this.player.heal()) {
        this.message = '휴식하여 체력을 회복했습니다!';
        this.save();
    } else {
        this.message = '쉴 수 없습니다 (체력이 2 이하일 때만 가능).';
    }
}

draw() {
    if (this.bgImage.complete) {
        this.ctx.drawImage(this.bgImage, 0, 0, this.canvas.width, this.canvas.height);
    } else {
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Header
    this.ctx.fillStyle = '#FFF';
    this.ctx.font = '24px Inter';
    this.ctx.textAlign = 'left';
    // Translate Mode?
    let modeText = this.state;
    if (this.state === 'HOME') modeText = '집';
    if (this.state === 'BATTLE') modeText = '전투';
    if (this.state === 'SHOP') modeText = '상점';
    if (this.state === 'GAMEOVER') modeText = '게임 오버';

    this.ctx.fillText(`${modeText} 모드 (v4.1)`, 20, 40);

    // Message Bar
    this.ctx.fillStyle = '#555';
    this.ctx.fillRect(0, this.canvas.height - 60, this.canvas.width, 60);
    this.ctx.fillStyle = '#FFD700'; // Gold color for text
    this.ctx.font = '20px Inter';
    this.ctx.fillText(this.message, 20, this.canvas.height - 25);

    // HUD
    this.ctx.fillStyle = '#EEE';
    this.ctx.fillText(`플레이어 HP:`, 20, 100);

    // HP Bar
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(150, 80, 200 * (this.player.hp / this.player.maxHp), 25);
    this.ctx.strokeRect(150, 80, 200, 25);
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(`${this.player.hp} / ${this.player.maxHp}`, 160, 100);

    this.ctx.fillStyle = 'gold';
    this.ctx.fillText(`골드: ${this.player.gold}`, 20, 140);

    // XP Bar
    this.ctx.fillStyle = '#EEE';
    this.ctx.fillText(`Lv.${this.player.level} (${this.player.xp}/${this.player.xpToNextLevel})`, 150, 140);
    this.ctx.fillStyle = 'blue';
    this.ctx.fillRect(300, 125, 200 * (this.player.xp / this.player.xpToNextLevel), 15);
    this.ctx.strokeRect(300, 125, 200, 15);

    // Weapon info
    const active = this.player.activeWeapon || { name: '없음' };
    this.ctx.fillStyle = 'cyan';
    this.ctx.fillText(`무기: ${active.name}`, 20, 180);
    this.ctx.font = '16px Inter';
    this.ctx.fillText(`공격력:${active.damage} | 명중:${(active.hitRate * 100)}% | 쿨타임:${active.reloadTime}초`, 20, 205);

    // Help text
    this.ctx.fillStyle = '#aaa';
    this.ctx.fillText("키: (1)검 (2)총 (3)표창 (4)대검 | (H)집 (B)전투 (S)상점", 20, 500);

    // Scene visuals
    if (this.state === 'HOME') {
        this.ctx.fillStyle = '#4a4';
        this.ctx.fillRect(400, 200, 100, 100);
        this.ctx.fillStyle = 'white';
        this.ctx.fillText("집 (HOME)", 415, 260);
        if (this.player.hp <= 2) {
            this.ctx.fillStyle = '#afa';
            this.ctx.fillText("잠기 (R)", 420, 280);
        }
    } else if (this.state === 'SHOP') {
        this.ctx.fillStyle = '#aa4';
        this.ctx.fillRect(400, 200, 100, 100);
        this.ctx.fillStyle = 'white';
        this.ctx.fillText("상점 (SHOP)", 410, 260);
        this.ctx.fillText("포션 10g (P)", 400, 280);
        this.ctx.fillText("대검 50g (G)", 400, 300);
        this.ctx.font = '12px Inter';
        this.ctx.fillText("공3 명90%", 420, 315);
        this.ctx.font = '20px Inter';
    } else if (this.state === 'BATTLE_SELECT') {
        this.ctx.fillStyle = '#44a';
        this.ctx.fillRect(300, 150, 300, 200);
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.fillText("전투 상대 선택", 450, 190);
        this.ctx.textAlign = 'left';
        this.ctx.fillText("(1) 오크 - 10G/10XP", 320, 230);
        this.ctx.fillText("(2) 기사 - 20G/30XP (체력 높음)", 320, 260);
        this.ctx.fillText("(3) 드래곤 - 20G/100XP (보스)", 320, 290);
    } else if (this.state === 'BATTLE') {
        if (this.enemy) {
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(500, 200, 80, 80);
            this.ctx.fillStyle = '#fff';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(this.enemy.name, 540, 250);
            this.ctx.fillText(`${this.enemy.hp} HP`, 540, 270);
        }
    } else if (this.state === 'GAMEOVER') {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'red';
        this.ctx.font = '40px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.fillText("YOU DIED", 400, 300);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Inter';
        const cost = this.player.reviveCount < 3 ? '무료' : '50골드';
        this.ctx.fillText(`(R) 부활하기 - 비용: ${cost}`, 400, 350);
        this.ctx.fillText(`누적 부활: ${this.player.reviveCount}회`, 400, 380);
    }
}
window.Game = Game;
