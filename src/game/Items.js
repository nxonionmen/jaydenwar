// Global definition for Items
const ITEMS = {
    SWORD: {
        name: '검',
        type: 'weapon',
        damage: 2,
        hitRate: 0.8,
        reloadTime: 0,
        cost: 0
    },
    GUN: {
        name: '총',
        type: 'weapon',
        damage: 4,
        hitRate: 0.1,
        reloadTime: 1.5,
        cost: 0
    },
    SHURIKEN: {
        name: '표창',
        type: 'weapon',
        damage: 4,
        hitRate: 1.0,
        reloadTime: 0,
        special: 'LOW_HP_ONLY',
        cost: 0
    },
    GREAT_SWORD: {
        name: '대검',
        type: 'weapon',
        damage: 3,
        hitRate: 0.9,
        reloadTime: 0,
        cost: 50
    },
    ARMOR: {
        name: '갑옷',
        type: 'armor',
        damageReduction: 1.5,
        hitRatePenalty: 0.1,
        cost: 0
    },
    SHIELD: {
        name: '방패',
        type: 'shield',
        damageReduction: 1.5,
        damagePenalty: 0.1,
        cost: 0
    },
    POTION: {
        name: '포션',
        type: 'consumable',
        cost: 5
    }
};
window.ITEMS = ITEMS;
