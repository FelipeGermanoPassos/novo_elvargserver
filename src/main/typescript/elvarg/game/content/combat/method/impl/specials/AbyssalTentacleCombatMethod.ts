class AbyssalTentacleCombatMethod extends MeleeCombatMethod {
    private static readonly ANIMATION = new Animation(1658, Priority.HIGH);
    private static readonly GRAPHIC = new Graphic(181, GraphicHeight.HIGH, Priority.HIGH);

    start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.ABYSSAL_TENTACLE.getDrainAmount());
        character.performAnimation(ANIMATION);
    }

    handleAfterHitEffects(hit: PendingHit) {
        const target = hit.getTarget();
        if (target.getHitpoints() <= 0) {
            return;
        }
        target.performGraphic(GRAPHIC);
        CombatFactory.freeze(target, 10);
        if (Misc.getRandom(100) < 50) {
            CombatFactory.poisonEntity(target, PoisonType.EXTRA);
        }
    }
}