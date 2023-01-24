class AbyssalBludgeonCombatMethod extends MeleeCombatMethod {
    private static readonly ANIMATION = new Animation(3299, Priority.HIGH);
    private static readonly GRAPHIC = new Graphic(1284, Priority.HIGH);

    hits(character: Mobile, target: Mobile): PendingHit[] {
        const hit = new PendingHit(character, target, this);
        if (character.isPlayer()) {
            const player = character.getAsPlayer();
            const missingPrayer = player.getSkillManager().getMaxLevel(Skill.PRAYER) - player.getSkillManager().getCurrentLevel(Skill.PRAYER);
            const extraDamage = missingPrayer * 0.5;
            hit.getHits()[0].incrementDamage(extraDamage);
            hit.updateTotalDamage();
        }

        return [hit];
    }

    start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.ABYSSAL_DAGGER.getDrainAmount());
        character.performAnimation(ANIMATION);
    }

    handleAfterHitEffects(hit: PendingHit) {
        hit.getTarget().performGraphic(GRAPHIC);
    }
}