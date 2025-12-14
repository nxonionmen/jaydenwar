class Combat {
    static calculateHit(attackerWeapon, defenderArmor) {
        let hitRate = attackerWeapon.hitRate;
        if (defenderArmor) {
            hitRate -= defenderArmor.hitRatePenalty || 0;
        }

        const roll = Math.random();
        console.log(`Combat Roll: ${roll} vs HitRate: ${hitRate}`);
        return roll <= hitRate;
    }

    static calculateDamage(attackerWeapon, defenderShield) {
        let damage = attackerWeapon.damage;
        // Shield penalty on *attacker*? 
        // Readme: "방패 ... 공격력 10% 감소". 
        // If the ATTACKER has a shield, their damage is reduced.
        // If the DEFENDER has a shield, they "take 1.5 less damage" (handled in Player.takeDamage).

        // This function handles Base Output Damage.

        return damage;
    }
}
window.Combat = Combat;
