class AbyssalWhipCombatMethod extends MeleeCombatMethod {
    private static readonly ANIMATION = new Animation(1658, Priority.HIGH);
    private static readonly GRAPHIC = new Graphic(341, GraphicHeight.HIGH, Priority.HIGH);

    start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.ABYSSAL_WHIP.getDrainAmount());
        character.performAnimation(ANIMATION);
    }

    handleAfterHitEffects(hit: PendingHit) {
        const target = hit.getTarget();
        if (target.getHitpoints() <= 0) {
            return;
        }
        target.performGraphic(GRAPHIC);
        if (target.isPlayer()) {
            const player = target as Player;
            let totalRunEnergy = player.getRunEnergy() - 25;
            if (totalRunEnergy < 0) {
                totalRunEnergy = 0;
            }
            player.setRunEnergy(totalRunEnergy);
            player.getPacketSender().sendRunEnergy();
            if (totalRunEnergy === 0) {
                player.setRunning(false);
                player.getPacketSender().sendRunStatus();
            }
        }
    }
}