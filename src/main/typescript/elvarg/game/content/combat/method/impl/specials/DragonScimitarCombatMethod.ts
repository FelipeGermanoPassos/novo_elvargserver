class DragonScimitarCombatMethod extends MeleeCombatMethod {
    private static ANIMATION = new Animation(1872, Priority.HIGH);
    private static GRAPHIC = new Graphic(347, GraphicHeight.HIGH, Priority.HIGH);

    start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.DRAGON_SCIMITAR.getDrainAmount());
        character.performAnimation(this.ANIMATION);
        character.performGraphic(this.GRAPHIC);
    }

    handleAfterHitEffects(hit: PendingHit) {
        if (!hit.isAccurate() || !hit.getTarget().isPlayer()) {
            return;
        }
        CombatFactory.disableProtectionPrayers(hit.getTarget().getAsPlayer());
        hit.getAttacker().getAsPlayer().getPacketSender().sendMessage("Your target can no longer use protection prayers.");
    }
}
