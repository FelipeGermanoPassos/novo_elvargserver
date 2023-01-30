class BarrelchestAnchorCombatMethod extends MeleeCombatMethod {
    private static readonly ANIMATION = new Animation(5870, Priority.HIGH);
    private static readonly GRAPHIC = new Graphic(1027, GraphicHeight.MIDDLE, Priority.HIGH);

    start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.BARRELSCHEST_ANCHOR.getDrainAmount());
        character.performAnimation(ANIMATION);
        character.performGraphic(GRAPHIC);
    }
}
