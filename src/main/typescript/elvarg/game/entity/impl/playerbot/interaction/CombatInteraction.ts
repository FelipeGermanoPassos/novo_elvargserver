class CombatInteraction {
    playerBot: PlayerBot;
    private attackTarget: Mobile;

    constructor(playerBot: PlayerBot) {
        this.playerBot = playerBot;
    }

    public process() {
        let fighterPreset = this.playerBot.getDefinition().getFighterPreset();
        let combatAttacker = this.playerBot.getCombat().getAttacker();
        if (combatAttacker != null) {
            this.attackTarget = combatAttacker;
        }

        let combatMethod = CombatFactory.getMethod(this.playerBot);
        if (this.attackTarget != null) {
            if (CombatFactory.canAttack(this.playerBot, combatMethod, this.attackTarget) != CombatFactory.CanAttackResponse.CAN_ATTACK) {
                this.attackTarget = null;
                this.playerBot.getCombat().setUnderAttack(null);
                return;
            }
            for (let combatAction of fighterPreset.getCombatActions()) {
                if (!combatAction.shouldPerform(this.playerBot, this.attackTarget)) {
                    continue;
                }

                combatAction.perform(this.playerBot, this.attackTarget);
                if (combatAction.stopAfter()) {
                    break; // No need to process any more weapon switches
                }
            }
        } else {
            PrayerHandler.resetAll(this.playerBot);
        }

        if (this.playerBot.getHitpoints() <= 0) {
            return;
        }

        if (this.playerBot.getHitpoints() < 30) {
            this.handleEating(this.playerBot.getHitpoints());
        }

        let area = this.playerBot.getArea();
        if (area != null && area.getPlayers().some(p => CombatFactory.canAttack(this.playerBot, combatMethod, p) == CombatFactory.CanAttackResponse.CAN_ATTACK)) {
            this.potUp();
        }

        if (this.attackTarget == null && this.playerBot.getHitpoints() > 0) {
            let shouldReset = (this.playerBot.getInventory().getFreeSlots() > 2
                || this.playerBot.getSpecialPercentage() < 76)
                && this.playerBot.getWildernessLevel() > 0;

            if (shouldReset) {
                this.reset();
            }
        }
    }
    private potUp() {
        //Boost health
        if (!this.playerBot.getSkillManager().isBoosted(Skill.HITPOINTS)) {
            let fish = ItemInSlot.getFromInventory(ItemIdentifiers.ANGLERFISH, this.playerBot.getInventory());

            if (fish != null) {
                Food.consume(this.playerBot, fish.getId(), fish.getSlot());
                return;
            }
        }
        // Boost range
        if (!this.playerBot.getSkillManager().isBoosted(Skill.RANGED)) {
            let pot = RANGE_POTIONS.getIds().map(id => ItemInSlot.getFromInventory(id, this.playerBot.getInventory()))
                .filter(Objects.nonNull)
                .find(p => p);

            if (pot) {
                PotionConsumable.drink(this.playerBot, pot.getId(), pot.getSlot());
                return;
            }
        }
        // Boost all
        if (!this.playerBot.getSkillManager().isBoosted(Skill.STRENGTH)) {
            let pot = SUPER_COMBAT_POTIONS.getIds().map(id => ItemInSlot.getFromInventory(id, this.playerBot.getInventory()))
                .filter(Objects.nonNull)
                .find(p => p);

            if (pot) {
                PotionConsumable.drink(this.playerBot, pot.getId(), pot.getSlot());
                return;
            }
        }
        // Boost strength
        if (!this.playerBot.getSkillManager().isBoosted(Skill.STRENGTH)) {
            let pot = SUPER_STRENGTH_POTIONS.getIds().map(id => ItemInSlot.getFromInventory(id, this.playerBot.getInventory()))
                .filter(Objects.nonNull)
                .find(p => p);

            if (pot) {
                PotionConsumable.drink(this.playerBot, pot.getId(), pot.getSlot());
                return;
            }
        }
        //Boost attack
        if (!this.playerBot.getSkillManager().isBoosted(Skill.ATTACK)) {
            let pot = SUPER_ATTACK_POTIONS.getIds().map(id => ItemInSlot.getFromInventory(id, this.playerBot.getInventory()))
                .filter(Objects.nonNull)
                .find(p => p);

            if (pot) {
                PotionConsumable.drink(this.playerBot, pot.getId(), pot.getSlot());
                return;
            }
        }
    }
    // Called when the PlayerBot takes damage
    public takenDamage(damage: number, attacker: Mobile): void {
        let finalHitpoints: number = this.playerBot.getHitpoints() - damage;
        if (finalHitpoints <= 0 || attacker == null) {
            // We're already gonna be dead XD
            return;
        }

        this.handleEating(finalHitpoints);
    }

    private handleEating(finalHitpoints: number): void {

        let fighterPreset: any = this.playerBot.getDefinition().getFighterPreset();
        let max: number = this.playerBot.getSkillManager().getMaxLevel(Skill.HITPOINTS);
        if (finalHitpoints <= (max * fighterPreset.eatAtPercent()) / 100) {
            // Player Bot needs to eat
            let edible: any = this.edibleItemSlot();
            if (edible == null) {
                return;
            }
            Food.consume(this.playerBot, edible.getId(), edible.getSlot());
            if (edible.getId() != ItemIdentifiers.COOKED_KARAMBWAN) {
                let karambwan: any = ItemInSlot.getFromInventory(ItemIdentifiers.COOKED_KARAMBWAN, this.playerBot.getInventory());
                if (karambwan != null) {
                    Food.consume(this.playerBot, karambwan.getId(), karambwan.getSlot());
                }
            }
        }
    }

    private edibleItemSlot(): any {
        let edible: any = Array.from(Food.Edible.values())
            .map(food => ItemInSlot.getFromInventory(food.getItem().getId(), this.playerBot.getInventory()))
            .filter(Objects.nonNull)
            .find(x => x);

        return edible;
    }

    // Called when the Player Bot is just about to die
    public handleDying(killer: Player | undefined): void {
        if (killer) {
            this.playerBot.sendChat("Gf " + killer.getUsername());
        }
    }

    // Called when the Player Bot has died
    public handleDeath(killer: Player | undefined): void {
        this.playerBot.setFollowing(null);
        this.playerBot.getCombat().setUnderAttack(null);

        TaskManager.submit(new Task(Misc.randomInclusive(10, 20), playerBot, false) {
            execute(): void {
                this.reset();
                this.stop();
            }
        });
    }

    // Called when this bot is assigned a Player target in the wilderness
    public targetAssigned(target: Player): void {
        if (this.playerBot.getArea() == null || this.playerBot.getArea().getPlayers().length > 1 || Misc.randomInclusive(1, 3) != 1) {
            // Don't attack if there's another real player in the same area, and attack 1/3 times
            return;
        }

        this.playerBot.getCombat().attack(target);
    }
    public reset(): void {
        // Reset bot's auto retaliate
        this.playerBot.setAutoRetaliate(true);

        // Load this Bot's preset
        Presetables.load(this.playerBot, this.playerBot.getDefinition().getFighterPreset().getItemPreset());

        // Teleport this bot back to their home location after some time
        TeleportHandler.teleport(this.playerBot, this.playerBot.getDefinition().getSpawnLocation(), TeleportType.NORMAL, false);
    }
}    