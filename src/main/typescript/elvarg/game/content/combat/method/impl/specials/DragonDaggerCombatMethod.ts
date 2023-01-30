class DragonDaggerCombatMethod extends MeleeCombatMethod {

    private static readonly ANIMATION = new Animation(1062, Priority.HIGH);
    private static readonly GRAPHIC = new Graphic(252, GraphicHeight.HIGH, Priority.HIGH);

    public hits(character: Mobile, target: Mobile): PendingHit[] {
        return [new PendingHit(character, target, this),
                new PendingHit(character, target, this, target.isNpc() ? 1 : 0)];
    }

    public start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.DRAGON_DAGGER.getDrainAmount());
        character.performAnimation(ANIMATION);
        character.performGraphic(GRAPHIC);
        Sounds.sendSound(character.getAsPlayer(), Sound.DRAGON_DAGGER_SPECIAL);
    }
}
