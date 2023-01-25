class SaradominGodswordCombatMethod extends MeleeCombatMethod {
    private static ANIMATION = new Animation(7640, Priority.HIGH);
    private static GRAPHIC = new Graphic(1209, Priority.HIGH);

    start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.SARADOMIN_GODSWORD.getDrainAmount());
        character.performAnimation(ANIMATION);
        character.performGraphic(GRAPHIC);
    }

    handleAfterHitEffects(hit: PendingHit) {
        const player = hit.getAttacker().getAsPlayer();
        const damage = hit.getTotalDamage();
        const damageHeal = Math.floor(damage * 0.5);
        const damagePrayerHeal = Math.floor(damage * 0.25);
        if (player.getSkillManager().getCurrentLevel(Skill.HITPOINTS) < player.getSkillManager().getMaxLevel(Skill.HITPOINTS)) {
            const level = player.getSkillManager().getCurrentLevel(Skill.HITPOINTS) + damageHeal > player.getSkillManager().getMaxLevel(Skill.HITPOINTS)
                            ? player.getSkillManager().getMaxLevel(Skill.HITPOINTS)
                            : player.getSkillManager().getCurrentLevel(Skill.HITPOINTS) + damageHeal;
            player.getSkillManager().setCurrentLevel(Skill.HITPOINTS, level);
        }
        if (player.getSkillManager().getCurrentLevel(Skill.PRAYER) < player.getSkillManager().getMaxLevel(Skill.PRAYER)) {
            const level = player.getSkillManager().getCurrentLevel(Skill.PRAYER) + damagePrayerHeal > player.getSkillManager().getMaxLevel(Skill.PRAYER) ? player.getSkillManager().getMaxLevel(Skill.PRAYER)
                            : player.getSkillManager().getCurrentLevel(Skill.PRAYER) + damagePrayerHeal;
            player.getSkillManager().setCurrentLevel(Skill.PRAYER, level);
        }
    }
}
