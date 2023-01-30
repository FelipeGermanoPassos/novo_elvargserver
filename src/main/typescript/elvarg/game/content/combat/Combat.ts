class Combat {
    private character: Mobile;
    private hitQueue: HitQueue;
    private damageMap: Map<Player, HitDamageCache> = new Map<Player, HitDamageCache>();
    private lastAttack = new Stopwatch();
    private poisonImmunityTimer = new SecondsTimer();
    private fireImmunityTimer = new SecondsTimer();
    private teleblockTimer = new SecondsTimer();
    private prayerBlockTimer = new SecondsTimer();
    public rangedWeapon: RangedWeapon;
    public rangeAmmoData: Ammunition;
    private target: Mobile;
    private attacker: Mobile;
    private method: CombatMethod;
    private castSpell: CombatSpell;
    private autoCastSpell: CombatSpell;
    private previousCast: CombatSpell;
    constructor(character: Mobile) {
        this.character = character;
        this.hitQueue = new HitQueue();
    }

    public attack(target: Mobile) {
        // Update the target
        this.setTarget(target);
        if (this.character != null && this.character.isNpc() && !this.character.getAsNpc().getDefinition().doesFightBack()) {
            // Don't follow or face enemy if NPC doesn't fight back
            return;
        }

        // Start facing the target
        this.character.setMobileInteraction(target);

        // Perform the first attack now (in same tick)
        this.performNewAttack(false);
    }

    /**
     * Processes combat.
     */
    public process() {
        // Process the hit queue
        this.hitQueue.process(this.character);

        // Reset attacker if we haven't been attacked in 6 seconds.
        if (this.lastAttack.elapsed(6000)) {
            this.setUnderAttack(null);
            return;
        }

        // Handle attacking
        this.performNewAttack(false);
    }

    public performNewAttack(instant: boolean) {
        if (this.target == null || (this.character != null && this.character.isNpc() && !this.character.getAsNpc().getDefinition().doesFightBack())) {
            // Don't process attacks for NPC's who don't fight back
            return;
        }
        // Fetch the combat method the character will be attacking with
        this.method = CombatFactory.getMethod(this.character);

        this.character.setCombatFollowing(this.target);

        // Face target
        this.character.setMobileInteraction(this.target);

        if (!CombatFactory.canReach(this.character, this.method, this.target)) {
            // Make sure the character is within reach before processing combat
            return;
        }

        // Granite maul special attack, make sure we disregard delay
        // and that we do not reset the attack timer.
        let graniteMaulSpecial = (this.method instanceof GraniteMaulCombatMethod);
        if (graniteMaulSpecial) {
            instant = true;
        }

        if (!instant && this.character.getTimers().has(TimerKey.COMBAT_ATTACK)) {
            // If attack isn't instant, make sure timer is elapsed.
            Server.logDebug("Combat : Waiting on COMBAT_ATTACK timer");
            return;
        }

        switch (CombatFactory.canAttack(this.character, this.method, this.target)) {
            case CombatFactory.CAN_ATTACK: {
                if (this.character.getCombat().getAttacker() == null) {
                    // Call the onCombatBegan hook once when combat begins
                    this.method.onCombatBegan(this.character, this.attacker);
                }
                if (this.target.getCombat().getAttacker() == null) {
                    // Call the onCombatBegan hook once when combat begins
                    let targetMethod = CombatFactory.getMethod(this.target);
                    targetMethod.onCombatBegan(this.target, this.character);
                }
                this.method.start(this.character, this.target);
                let hits = this.method.hits(this.character, this.target);
                if (hits == null)
                    return;
                for (let hit of hits) {
                    CombatFactory.addPendingHit(hit);
                }
                this.method.finished(this.character, this.target);

                // Reset attack timer
                if (!graniteMaulSpecial) {
                    let speed = this.method.attackSpeed(this.character);
                    this.character.getTimers().register(TimerKey.COMBAT_ATTACK, speed);
                }
                instant = false;
                if (this.character.isSpecialActivated()) {
                    this.character.setSpecialActivated(false);
                    if (this.character.isPlayer()) {
                        let p = this.character.getAsPlayer();
                        CombatSpecial.updateBar(p);
                    }
                }
            }
            case CombatFactory.ALREADY_UNDER_ATTACK: {
                if (this.character.isPlayer()) {
                    this.character.getAsPlayer().getPacketSender().sendMessage("You are already under attack!");
                }
                this.character.getCombat().reset();
            }
            case CombatFactory.CANT_ATTACK_IN_AREA: {
                this.character.getCombat().reset();
            }
            case CombatFactory.COMBAT_METHOD_NOT_ALLOWED: {
            }
            case CombatFactory.LEVEL_DIFFERENCE_TOO_GREAT: {
                this.character.getAsPlayer().getPacketSender().sendMessage("Your level difference is too great.");
                this.character.getAsPlayer().getPacketSender().sendMessage("You need to move deeper into the Wilderness.");
                this.character.getCombat().reset();
            }
            case CombatFactory.NOT_ENOUGH_SPECIAL_ENERGY: {
                let p = this.character.getAsPlayer();
                p.getPacketSender().sendMessage("You do not have enough special attack energy left!");
                p.setSpecialActivated(false);
                CombatSpecial.updateBar(this.character.getAsPlayer());
                p.getCombat().reset();
            }
            case CombatFactory.STUNNED: {
                let p = this.character.getAsPlayer();
                p.getPacketSender().sendMessage("You're currently stunned and cannot attack.");
                p.getCombat().reset();
            }
            case CombatFactory.DUEL_NOT_STARTED_YET: {
                let p = this.character.getAsPlayer();
                p.getPacketSender().sendMessage("The duel has not started yet!");
                p.getCombat().reset();
            }
            case CombatFactory.DUEL_WRONG_OPPONENT: {
                let p = this.character.getAsPlayer();
                p.getPacketSender().sendMessage("This is not your opponent!");
                p.getCombat().reset();
            }
            case CombatFactory.DUEL_MELEE_DISABLED: {
                let p = this.character.getAsPlayer();
                ConditionDialogue.send(p, "Melee has been disabled in this duel!");
                p.getCombat().reset();
            }
            case CombatFactory.DUEL_RANGED_DISABLED: {
                let p = this.character.getAsPlayer();
                ConditionDialogue.send(p, "Ranged has been disabled in this duel!");
                p.getCombat().reset();
            }
            case CombatFactory.DUEL_MAGIC_DISABLED: {
                let p = this.character.getAsPlayer();
                ConditionDialogue.send(p, "Magic has been disabled in this duel!");
                p.getCombat().reset();
            }
            case CombatFactory.TARGET_IS_IMMUNE: {
                if (this.character.isPlayer()) {
                    ((Player) this.character).getPacketSender().sendMessage("This npc is currently immune to attacks.");
                }
                this.character.getCombat().reset();
            }
            case CombatFactory.INVALID_TARGET: {
                this.character.getCombat().reset();
            }
        }
    }

    public reset() {
        this.setTarget(null);
        this.character.setCombatFollowing(null);
        this.character.setMobileInteraction(null);
    }
    /**
* Adds damage to the damage map, as long as the argued amount of damage is
* above 0 and the argued entity is a player.
*
* @param entity the entity to add damage for.
* @param amount the amount of damage to add for the argued entity.
*/
    public addDamage(entity: Mobile, amount: number) {
        if (amount <= 0 || entity.isNpc()) {
            return;
        }

        let player = entity as Player;
        if (this.damageMap.has(player)) {
            this.damageMap.get(player).incrementDamage(amount);
            return;
        }

        this.damageMap.set(player, new HitDamageCache(amount));
    }

    public getKiller(clearMap: boolean): Optional<Player> {
        // Return null if no players killed this entity.
        if (this.damageMap.size == 0) {
            return Optional.empty();
        }

        // The damage and killer placeholders.
        let damage = 0;
        let killer = Optional.empty();

        for (let entry of this.damageMap.entries()) {

            // Check if this entry is valid.
            if (entry == null) {
                continue;
            }

            // Check if the cached time is valid.
            let timeout = entry[1].getStopwatch().elapsed();
            if (timeout > CombatConstants.DAMAGE_CACHE_TIMEOUT) {
                continue;
            }

            // Check if the key for this entry has logged out.
            let player = entry[0];
            if (!player.isRegistered()) {
                continue;
            }

            // If their damage is above the placeholder value, they become the
            // new 'placeholder'.
            if (entry[1].getDamage() > damage) {
                damage = entry[1].getDamage();
                killer = Optional.of(entry[0]);
            }
        }

        // Clear the damage map if needed.
        if (clearMap)
            this.damageMap.clear();

        // Return the killer placeholder.
        return killer;
    }

    public damageMapContains(player: Player): boolean {
        let damageCache = this.damageMap.get(player);
        if (damageCache == null) {
            return false;
        }
        return damageCache.getStopwatch().elapsed() < CombatConstants.DAMAGE_CACHE_TIMEOUT;
    }

    public getCharacter(): Mobile {
        return this.character;
    }

    public getTarget(): Mobile {
        return this.target;
    }

    public setTarget(target: Mobile) {
        if (this.target != null && target == null && this.method != null) {
            // Target has changed to null, this means combat has ended. Call the relevant hook inside the combat method.
            this.method.onCombatEnded(this.character, this.attacker);
        }

        this.target = target;
    }

    public getHitQueue(): HitQueue {
        return this.hitQueue;
    }

    public getAttacker(): Mobile {
        return this.attacker;
    }

    public setUnderAttack(attacker: Mobile) {
        this.attacker = attacker;
        this.lastAttack.reset();
    }

    public getCastSpell(): CombatSpell {
        return this.castSpell;
    }
    public setCastSpell(castSpell: CombatSpell) {
        this.castSpell = castSpell;
    }

    public getAutocastSpell(): CombatSpell {
        return this.autoCastSpell;
    }

    public setAutocastSpell(autoCastSpell: CombatSpell) {
        this.autoCastSpell = autoCastSpell;
    }

    public getSelectedSpell(): CombatSpell {
        let spell = this.getCastSpell();
        if (spell != null) {
            return spell;
        }
        return this.getAutocastSpell();
    }

    public getPreviousCast(): CombatSpell {
        return this.previousCast;
    }

    public setPreviousCast(previousCast: CombatSpell) {
        this.previousCast = previousCast;
    }

    public getRangedWeapon(): RangedWeapon {
        return this.rangedWeapon;
    }

    public setRangedWeapon(rangedWeapon: RangedWeapon) {
        this.rangedWeapon = rangedWeapon;
    }

    public getRangeAmmoData(): Ammunition {
        return this.rangeAmmoData;
    }

    public setRangeAmmoData(rangeAmmoData: Ammunition) {
        this.rangeAmmoData = rangeAmmoData;
    }

    public getPoisonImmunityTimer(): SecondsTimer {
        return this.poisonImmunityTimer;
    }

    public getFireImmunityTimer(): SecondsTimer {
        return this.fireImmunityTimer;
    }

    public getTeleblockTimer(): SecondsTimer {
        return this.teleblockTimer;
    }

    public getPrayerBlockTimer(): SecondsTimer {
        return this.prayerBlockTimer;
    }

    public getLastAttack(): Stopwatch {
        return lastAttack;
    }
}
