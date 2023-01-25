class ChaosElementalCombatMethod extends CombatMethod {
    private static readonly MELEE_COMBAT_GFX = new Graphic(869);
    private static readonly RANGED_COMBAT_GFX = new Graphic(867);
    private static readonly MAGIC_COMBAT_GFX = new Graphic(868);
    private currentAttack = ChaosElementalAttackType.DEFAULT;
    private combatType = CombatType.MELEE;

    public type(): CombatType {
        return this.combatType;
    }

    public hits(character: Mobile, target: Mobile): PendingHit[] {
        return [new PendingHit(character, target, this, 2)];
    }

    public start(character: Mobile, target: Mobile) {
        character.performAnimation(new Animation(character.getAttackAnim()));
        new Projectile(character, target, this.currentAttack.projectileId, 40, 70, 31, 43).sendProjectile();
    }

    public attackDistance(character: Mobile): number {
        return 8;
    }

    public finished(character: Mobile, target: Mobile) {
        if (Misc.getRandom(100) <= 10) {
            this.currentAttack = ChaosElementalAttackType.DISARM;
        } else if (Misc.getRandom(100) <= 10) {
            this.currentAttack = ChaosElementalAttackType.TELEPORT;
        }
        this.combatType = CombatType.values()[Misc.getRandom(CombatType.values().length - 1)];
    }

    function handleAfterHitEffects(hit: PendingHit) {
    if (hit.getTarget() != null) {

        switch (combatType) {
            case MELEE:
                hit.getTarget().performGraphic(MELEE_COMBAT_GFX);
                break;
            case RANGED:
                hit.getTarget().performGraphic(RANGED_COMBAT_GFX);
                break;
            case MAGIC:
                hit.getTarget().performGraphic(MAGIC_COMBAT_GFX);
                break;
        }

        if (hit.getTarget().isPlayer()) {
            if (Misc.getRandom(100) <= 20) {
                let player = hit.getTarget().getAsPlayer();

                //DISARMING
                if (currentAttack == ChaosElementalAttackType.DISARM) {
                    disarmAttack(player);
                }
                //TELEPORTING
                else if (currentAttack == ChaosElementalAttackType.TELEPORT) {
                    player.moveTo(player.getLocation().add(Misc.getRandom(4), Misc.getRandom(4)));
                    player.getPacketSender().sendMessage("The Chaos elemental has teleported you.");
                }
            }
        }
    }
}

function disarmAttack(player: Player) {
    if (!player.getInventory().isFull()) {
        const randomSlot = Misc.getRandom(player.getEquipment().capacity() - 1);
        const toDisarm = player.getEquipment().getItems()[randomSlot];
        if (toDisarm.isValid()) {
            player.getEquipment().set(randomSlot, new Item(-1, 0));
            player.getInventory().add(toDisarm.clone());
            player.getPacketSender().sendMessage("You have been disarmed!");
            WeaponInterfaces.assign(player);
            BonusManager.update(player);
            player.getUpdateFlag().flag(Flag.APPEARANCE);
        }
    }
}
    
enum ChaosElementalAttackType {
    DEFAULT = 558,
    DISARM = 551,
    TELEPORT = 554
}