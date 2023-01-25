class DragonHalberdCombatMethod extends MeleeCombatMethod {

    private static readonly ANIMATION = new Animation(1203, Priority.HIGH);
    private static readonly GRAPHIC = new Graphic(282, GraphicHeight.HIGH, Priority.HIGH);

    public hits(character: Mobile, target: Mobile): PendingHit[] {
        return [new PendingHit(character, target, this, 1), new PendingHit(character, target, this)];
    }

    public start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.DRAGON_HALBERD.getDrainAmount());
        character.performAnimation(ANIMATION);
        character.performGraphic(GRAPHIC);
    }
}
