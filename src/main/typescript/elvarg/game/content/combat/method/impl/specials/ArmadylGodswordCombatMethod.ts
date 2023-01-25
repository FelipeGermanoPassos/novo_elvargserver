class ArmadylGodswordCombatMethod extends MeleeCombatMethod {

    private static readonly ANIMATION = new Animation(7644, Priority.HIGH);
    private static readonly GRAPHIC = new Graphic(1211, Priority.HIGH);

    start(character: Mobile, target: Mobile): void {
        CombatSpecial.drain(character, CombatSpecial.ARMADYL_GODSWORD.getDrainAmount());
        character.performAnimation(ANIMATION);
        character.performGraphic(GRAPHIC);
    }
}
