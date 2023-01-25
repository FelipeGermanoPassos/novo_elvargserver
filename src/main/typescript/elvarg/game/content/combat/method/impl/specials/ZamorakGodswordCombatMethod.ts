class ZamorakGodswordCombatMethod extends MeleeCombatMethod {
    private static ANIMATION = new Animation(7638, Priority.HIGH);
    private static GRAPHIC = new Graphic(1210, Priority.HIGH);

    start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.ZAMORAK_GODSWORD.getDrainAmount());
        character.performAnimation(ANIMATION);
    }

    handleAfterHitEffects(hit: PendingHit) {
        if (hit.isAccurate()) {
            hit.getTarget().performGraphic(GRAPHIC);
            CombatFactory.freeze(hit.getTarget(), 15);
        }
    }
}
