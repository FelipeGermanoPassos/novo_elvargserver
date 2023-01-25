class GraniteMaulCombatMethod extends MeleeCombatMethod {
    private static ANIMATION = new Animation(1667, Priority.HIGH);
    private static GRAPHIC = new Graphic(340, GraphicHeight.HIGH, Priority.HIGH);
    start(character: Mobile, target: Mobile): void {
        CombatSpecial.drain(character, CombatSpecial.GRANITE_MAUL.getDrainAmount());
        character.performAnimation(this.ANIMATION);
        character.performGraphic(this.GRAPHIC);
    }
}
    