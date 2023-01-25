class SaradominSwordCombatMethod extends MeleeCombatMethod {
    private static ENMEMY_GRAPHIC = new Graphic(1196, Priority.HIGH);
    private static ANIMATION = new Animation(1132, Priority.HIGH);
    private static GRAPHIC = new Graphic(1213, Priority.HIGH);

    hits(character: Mobile, target: Mobile): PendingHit[] {
        const hit = new PendingHit(character, target, this, true, 2, 0);
        hit.getHits()[1].setDamage(hit.isAccurate() ? hit.getHits()[0].getDamage() + 16 : 0);
        hit.updateTotalDamage();
        return [hit];
    }

    start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.SARADOMIN_SWORD.getDrainAmount());
        character.performAnimation(ANIMATION);
        character.performGraphic(GRAPHIC);
    }

    handleAfterHitEffects(hit: PendingHit) {
        hit.getTarget().performGraphic(ENMEMY_GRAPHIC);
    }
}
