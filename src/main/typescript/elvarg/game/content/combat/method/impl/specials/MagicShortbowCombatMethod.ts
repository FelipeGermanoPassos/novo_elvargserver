class MagicShortbowCombatMethod extends RangedCombatMethod {
    private static ANIMATION = new Animation(1074, Priority.HIGH);
    private static GRAPHIC = new Graphic(250, GraphicHeight.HIGH, Priority.HIGH);

    hits(character: Mobile, target: Mobile): PendingHit[] {
        return [new PendingHit(character, target, this, true, 3), new PendingHit(character, target, this, true, 2)];
    }

    canAttack(character: Mobile, target: Mobile): boolean {
        const player = character.getAsPlayer();
        if (player.getCombat().getRangedWeapon() != RangedWeapon.MAGIC_SHORTBOW) {
            return false;
        }        
        if (!CombatFactory.checkAmmo(player, 2)) {
            return false;
        }
        return true;
    }

    start(character: Mobile, target: Mobile) {
        const player = character.getAsPlayer();
        CombatSpecial.drain(player, CombatSpecial.MAGIC_SHORTBOW.getDrainAmount());
        player.performAnimation(ANIMATION);
        player.performGraphic(GRAPHIC);
        new Projectile(player, target, 249, 40, 57, 43, 31).sendProjectile();
        new Projectile(character, target, 249, 33, 57, 48, 31).sendProjectile();
        CombatFactory.decrementAmmo(player, target.getLocation(), 2);
    }

    attackSpeed(character: Mobile): number {
        return super.attackSpeed(character) + 1;
    }
}
