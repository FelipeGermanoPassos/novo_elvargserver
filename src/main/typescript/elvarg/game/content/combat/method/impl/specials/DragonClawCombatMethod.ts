class DragonClawCombatMethod extends MeleeCombatMethod {

    private static readonly ANIMATION = new Animation(7527, Priority.HIGH);
    private static readonly GRAPHIC = new Graphic(1171, Priority.HIGH);

    public hits(character: Mobile, target: Mobile): PendingHit[] {
        let hit = new PendingHit(character, target, this, true, 4, 0);
        // Modify the hits.. Claws have a unique maxhit formula
        let first = hit.getHits()[0].getDamage();
        let second = first <= 0 ? hit.getHits()[1].getDamage() : (first / 2);
        let third = second <= 0 ? second : (second / 2);
        let fourth = second <= 0 ? second : (second / 2);
        hit.getHits()[0].setDamage(first);
        hit.getHits()[1].setDamage(second);
        hit.getHits()[2].setDamage(third);
        hit.getHits()[3].setDamage(fourth);
        hit.updateTotalDamage();
        return [hit];
    }

    public start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.DRAGON_CLAWS.getDrainAmount());
        character.performAnimation(ANIMATION);
        character.performGraphic(GRAPHIC);
    }
}