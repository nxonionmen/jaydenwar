class Player {
    constructor() {
        this.maxHp = 5;
        this.hp = this.maxHp;
        this.gold = 0;
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 50;
        this.reviveCount = 0; // Track revives
        this.restCount = 5; // Track rests (Home)

        this.inventory = {
            weapons: [],
            armor: null,
            shield: null,
            potions: 0 // Count
        };
        // Defaults
        // Assuming player starts with nothing or maybe a sword? Readme doesn't specify starting gear.
    }

    heal() {
        if (this.restCount > 0) {
            this.hp = this.maxHp;
            this.restCount--;
            return 'REST_COUNT';
        }
        if (this.gold >= 30) {
            this.gold -= 30;
            this.hp = this.maxHp;
            return 'GOLD';
        }
        return 'FAIL';
    }

    usePotion() {
        if (this.inventory.potions > 0) {
            if (this.hp < this.maxHp) {
                this.inventory.potions--;
                this.hp = Math.min(this.maxHp, this.hp + 5); // Heal 5 or up to max
                return true;
            }
        }
        return false;
    }

    takeDamage(amount) {
        let reduction = 0;
        if (this.inventory.armor) reduction += this.inventory.armor.damageReduction;
        if (this.inventory.shield) reduction += this.inventory.shield.damageReduction;

        const effectiveDamage = Math.max(0, amount - reduction);
        this.hp -= effectiveDamage;
        if (this.hp < 0) this.hp = 0;
        return effectiveDamage;
    }

    addGold(amount) {
        this.gold += amount;
    }

    gainXp(amount) {
        this.xp += amount;
        let leveledUp = false;
        while (this.xp >= this.xpToNextLevel) {
            this.xp -= this.xpToNextLevel;
            this.level++;
            this.maxHp += 2; // Stat increase
            this.hp = this.maxHp; // Full heal
            this.xpToNextLevel += 50; // Harder next time
            leveledUp = true;
        }
        return leveledUp;
    }

    equipWeapon(weapon) {
        this.activeWeapon = weapon;
    }

    // Save Data (Serialization)
    saveData() {
        const weaponData = this.inventory.weapons.map(w => ({
            name: w.name,
            level: w.level || 0,
            bonusDamage: w.bonusDamage || 0
        }));

        return {
            hp: this.hp,
            maxHp: this.maxHp,
            gold: this.gold,
            level: this.level,
            xp: this.xp,
            xpToNextLevel: this.xpToNextLevel,
            activeWeaponName: this.activeWeapon ? this.activeWeapon.name : null,
            inventory: {
                potions: this.inventory.potions,
                weapons: weaponData
            },
            reviveCount: this.reviveCount,
            restCount: this.restCount
        };
    }

    // Load Data (Deserialization)
    loadData(data) {
        if (!data) return;
        this.hp = data.hp;
        this.maxHp = data.maxHp;
        this.gold = data.gold;
        this.level = data.level || 1;
        this.xp = data.xp || 0;
        this.xpToNextLevel = data.xpToNextLevel || 100;
        this.reviveCount = typeof data.reviveCount === 'number' ? data.reviveCount : 0;
        this.restCount = typeof data.restCount === 'number' ? data.restCount : 5;


        // Load inventory
        if (data.inventory) {
            this.inventory.potions = data.inventory.potions || 0;
            this.inventory.weapons = [];

            const savedWeapons = data.inventory.weapons || [];

            // Handle legacy save (string array) vs new save (object array)
            if (savedWeapons.length > 0 && typeof savedWeapons[0] === 'string') {
                // Migrate old save
                savedWeapons.forEach(name => {
                    const baseItem = Object.values(ITEMS).find(i => i.name === name);
                    if (baseItem) {
                        // Clone item to allow upgrades
                        const newItem = Object.assign({}, baseItem);
                        newItem.level = 0;
                        newItem.bonusDamage = 0;
                        this.inventory.weapons.push(newItem);
                    }
                });
            } else {
                // New save format
                savedWeapons.forEach(savedW => {
                    const baseItem = Object.values(ITEMS).find(i => i.name === savedW.name);
                    if (baseItem) {
                        const newItem = Object.assign({}, baseItem);
                        newItem.level = savedW.level || 0;
                        newItem.bonusDamage = savedW.bonusDamage || 0;
                        newItem.damage = baseItem.damage + newItem.bonusDamage; // Apply bonus
                        this.inventory.weapons.push(newItem);
                    }
                });
            }
        }

        if (data.activeWeaponName) {
            const weapon = this.inventory.weapons.find(w => w.name === data.activeWeaponName);
            if (weapon) this.equipWeapon(weapon);
        }
    }

    upgradeWeapon(weapon) {
        if (!weapon) return { success: false, reason: '무기가 가 없습니다.' };

        const currentLevel = weapon.level || 0;
        const cost = (currentLevel + 1) * 50; // Cost: 50, 100, 150...

        if (this.gold >= cost) {
            this.gold -= cost;
            weapon.level = currentLevel + 1;
            weapon.bonusDamage = (weapon.bonusDamage || 0) + 1;
            weapon.damage += 1; // Direct modification since it's a clone
            return { success: true, level: weapon.level, cost: cost };
        } else {
            return { success: false, reason: `골드가 부족합니다 (필요: ${cost}G)` };
        }
    }
}
window.Player = Player;
