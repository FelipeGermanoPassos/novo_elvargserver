class BallistaCombatMethod extends RangedCombatMethod {

    private static readonly ANIMATION = new Animation(7222, Priority.HIGH);

    hits(character: Mobile, target: Mobile): PendingHit[] {
        return [new PendingHit(character, target, this, 2)];
    }

    canAttack(character: Mobile, target: Mobile): boolean {
        if (!character.isPlayer()) {
            return false;
        }
        const player = character.getAsPlayer();
        if (player.getCombat().getRangedWeapon() !== RangedWeapon.BALLISTA) {
            return false;
        }
        if (!CombatFactory.checkAmmo(player, 1)) {
            return false;
        }
        return true;
    }

    start(character: Mobile, target: Mobile): void {
        const player = character.getAsPlayer();
        CombatSpecial.drain(player, CombatSpecial.BALLISTA.getDrainAmount());
        character.performAnimation(ANIMATION);
        new Projectile(player, target, 1301, 70, 30, 43, 31).sendProjectile();
        CombatFactory.decrementAmmo(player, target.getLocation(), 1);
    }
}
