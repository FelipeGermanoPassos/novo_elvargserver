class DragonLongswordCombatMethod extends MeleeCombatMethod {

    private static ANIMATION = new Animation(1058, Priority.HIGH);
    private static GRAPHIC = new Graphic(248, GraphicHeight.HIGH, Priority.HIGH);

    start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.DRAGON_LONGSWORD.getDrainAmount());
        character.performAnimation(this.ANIMATION);
        character.performGraphic(this.GRAPHIC);
    }
}
