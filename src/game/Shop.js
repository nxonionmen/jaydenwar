class Shop {
    constructor() {
        this.potionCost = 5; // From readme: "골드는 상점 에서 포션 획득 가능" (implicit price logic? or 'win=20, lose=5').
        // "연속승리시 보너스 골드 (5골드)"
        // "한판 당 새로운 포션 생성" -> Shop refreshes?
    }

    buyPotion(player) {
        // Logic: Potion cost? Readme says "Gold can be used at shop to get potions".
        // It doesn't explicitly modify potion price. Let's assume standard price or exchange.
        // Let's set Potion Price = 10 for now given you get 20 gold per win.
        const price = 10;
        if (player.gold >= price) {
            player.gold -= price;
            player.inventory.potions++;
            return true;
        }
        return false;
    }

    buyWeapon(player, weaponItem) {
        if (player.gold >= weaponItem.cost) {
            // Check if already owns
            if (player.inventory.weapons.some(w => w.name === weaponItem.name)) {
                return "ALREADY_OWNED";
            }
            player.gold -= weaponItem.cost;
            player.inventory.weapons.push(weaponItem);
            return "BOUGHT";
        }
        return "NO_GOLD";
    }
}
window.Shop = Shop;
