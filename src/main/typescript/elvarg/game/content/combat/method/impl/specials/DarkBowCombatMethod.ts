class DarkBowCombatMethod extends RangedCombatMethod {

    private static ANIMATION = new Animation(426, Priority.HIGH);
    private static GRAPHIC = new Graphic(1100, GraphicHeight.HIGH, Priority.HIGH);

    public hits(Mobile character, Mobile target): PendingHit[] {
        return [new PendingHit(character, target, this, false, 3),
                new PendingHit(character, target, this, false, 2)];
    }

    public canAttack(Mobile character, Mobile target): boolean {
        let player = character.getAsPlayer();
        if (player.getCombat().getRangedWeapon() != RangedWeapon.DARK_BOW) {
            return false;
        }
        if (!CombatFactory.checkAmmo(player, 2)) {
            return false;
        }
        return true;
    }

    public start(Mobile character, Mobile target) {
        let player = character.getAsPlayer();
        CombatSpecial.drain(player, CombatSpecial.DARK_BOW.getDrainAmount());
        player.performAnimation(ANIMATION);
        let projectileId = 1099;
        if (player.getCombat().getAmmunition() != Ammunition.DRAGON_ARROW) {
            projectileId = 1101;
        }
        new Projectile(player, target, projectileId, 40, 70, 43, 31).sendProjectile();
        new Projectile(character, target, projectileId, 33, 74, 48, 31).sendProjectile();
        CombatFactory.decrementAmmo(player, target.getLocation(), 2);
    }

    public attackSpeed(Mobile character): number {
        return super.attackSpeed(character) + 1;
    }

    public handleAfterHitEffects(PendingHit hit) {
        hit.getTarget().performGraphic(GRAPHIC);
    }
}
