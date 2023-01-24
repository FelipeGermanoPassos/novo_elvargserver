class MeleeCombatMethod extends CombatMethod {
    start(character: Mobile, target: Mobile) {
        const animation = character.getAttackAnim();
        if (animation !== -1) {
            character.performAnimation(new Animation(animation));
            Sounds.sendSound(character.getAsPlayer(), character.getAttackSound());
        }
    }

    type(): CombatType {
        return CombatType.MELEE;
    }

    hits(character: Mobile, target: Mobile): PendingHit[] {
        return [new PendingHit(character, target, this)];
    }

    attackDistance(character: Mobile): number {
        if (character.isPlayer() && character.getAsPlayer().getWeapon() === WeaponInterface.HALBERD) {
            return 2;
        }
        return 1;
    }
}
