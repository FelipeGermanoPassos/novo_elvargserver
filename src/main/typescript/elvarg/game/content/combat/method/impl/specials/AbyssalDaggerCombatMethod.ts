class AbyssalDaggerCombatMethod extends MeleeCombatMethod {
    private static readonly ANIMATION = new Animation(3300, Priority.HIGH);
    private static readonly GRAPHIC = new Graphic(1283, Priority.HIGH);

    hits(character: Mobile, target: Mobile): PendingHit[] {
        const hit1 = new PendingHit(character, target, this);
        const hit2 = new PendingHit(character, target, this, target.isNpc() ? 1 : 0);
        if (!hit1.isAccurate() || hit1.getTotalDamage() <= 0) {
            hit2.getHits()[0].setDamage(0);
            hit2.updateTotalDamage();
        }

        return [hit1, hit2];
    }

    start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.ABYSSAL_DAGGER.getDrainAmount());
        character.performAnimation(ANIMATION);
        character.performGraphic(GRAPHIC);
    }
}

