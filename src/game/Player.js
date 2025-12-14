class Player {
    constructor() {
        this.maxHp = 5;
        this.hp = this.maxHp;
        this.gold = 0;
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 50;
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
        if (this.hp <= 2) {
            this.hp = this.maxHp;
            return true;
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
        return {
            hp: this.hp,
            maxHp: this.maxHp,
            gold: this.gold,
            level: this.level,
            xp: this.xp,
            xpToNextLevel: this.xpToNextLevel,
            inventory: {
                // Save only item names to avoid circular refs and allow re-linking
                weapons: this.inventory.weapons.map(w => w.name),
                potions: this.inventory.potions
            }
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
        this.xpToNextLevel = data.xpToNextLevel || 50;

        this.inventory.potions = data.inventory.potions || 0;
        this.inventory.weapons = [];

        // Re-link weapons from global ITEMS
        if (data.inventory.weapons) {
            data.inventory.weapons.forEach(name => {
                // Find item by name in ITEMS object
                for (const key in ITEMS) {
                    if (ITEMS[key].name === name) {
                        this.inventory.weapons.push(ITEMS[key]);
                    }
                }
            });
        }
    }
}
window.Player = Player;
