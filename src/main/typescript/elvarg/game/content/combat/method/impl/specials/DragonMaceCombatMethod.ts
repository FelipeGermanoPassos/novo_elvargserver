class DragonMaceCombatMethod extends MeleeCombatMethod {
    private static ANIMATION = new Animation(1060, Priority.HIGH);
    private static GRAPHIC = new Graphic(251, GraphicHeight.HIGH, Priority.HIGH);

    start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.DRAGON_MACE.getDrainAmount());
        character.performAnimation(this.ANIMATION);
        character.performGraphic(this.GRAPHIC);
    }
}
