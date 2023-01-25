class BandosGodswordCombatMethod extends MeleeCombatMethod {

    private static ANIMATION = new Animation(7642, Priority.HIGH);
    private static GRAPHIC = new Graphic(1212, Priority.HIGH);

    start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.BANDOS_GODSWORD.getDrainAmount());
        character.performAnimation(ANIMATION);
        character.performGraphic(GRAPHIC);
    }

    handleAfterHitEffects(hit: PendingHit) {
        if (hit.isAccurate() && hit.getTarget().isPlayer()) {
            let skillDrain = 1;
            let damageDrain = (hit.getTotalDamage() * 0.1);
            if (damageDrain < 0)
                return;
            let player = hit.getAttacker().getAsPlayer();
            let target = hit.getTarget().getAsPlayer();
            let skill = Skill.values()[skillDrain];
            target.getSkillManager().setCurrentLevel(skill, player.getSkillManager().getCurrentLevel(skill) - damageDrain);
            if (target.getSkillManager().getCurrentLevel(skill) < 1)
                target.getSkillManager().setCurrentLevel(skill, 1);
            player.getPacketSender().sendMessage("You've drained " + target.getUsername() + "'s " + Misc.formatText(Skill.values()[skillDrain].toString().toLowerCase()) + " level by " + damageDrain + ".");
            target.getPacketSender().sendMessage("Your " + skill.getName() + " level has been drained.");
        }
    }
}
