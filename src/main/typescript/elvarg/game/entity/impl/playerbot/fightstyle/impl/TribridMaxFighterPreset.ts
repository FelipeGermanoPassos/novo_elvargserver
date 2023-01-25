export class TribridMaxFighterPreset implements FighterPreset {
    private static BOT_HARD_TRIBRID: Presetable = new Presetable("Bot Tribrid", [
        new Item(ARMADYL_CROSSBOW), new Item(ARMADYL_GODSWORD), new Item(RANGING_POTION_4_), new Item(SUPER_COMBAT_POTION_4_),
        new Item(AVAS_ACCUMULATOR), new Item(KARILS_LEATHERSKIRT), new Item(KARILS_LEATHERTOP), new Item(SUPER_RESTORE_4_),
        new Item(COOKED_KARAMBWAN), new Item(MANTA_RAY), new Item(MANTA_RAY), new Item(COOKED_KARAMBWAN),
        new Item(COOKED_KARAMBWAN), new Item(MANTA_RAY), new Item(MANTA_RAY), new Item(COOKED_KARAMBWAN),
        new Item(COOKED_KARAMBWAN), new Item(MANTA_RAY), new Item(MANTA_RAY), new Item(COOKED_KARAMBWAN),
        new Item(MANTA_RAY), new Item(MANTA_RAY), new Item(MANTA_RAY), new Item(ANGLERFISH),
        new Item(WATER_RUNE, 10000), new Item(BLOOD_RUNE, 10000), new Item(DEATH_RUNE, 10000), new Item(TELEPORT_TO_HOUSE, 1),
    ], [
        new Item(HELM_OF_NEITIZNOT),
        new Item(INFERNAL_CAPE),
        new Item(STAFF_OF_THE_DEAD),
        new Item(AMULET_OF_FURY),
        new Item(AHRIMS_ROBESKIRT),
        new Item(BLESSED_SPIRIT_SHIELD),
        new Item(AHRIMS_ROBETOP),
        new Item(BARROWS_GLOVES),
        new Item(CLIMBING_BOOTS),
        new Item(RING_OF_RECOIL),
        new Item(DRAGONSTONE_DRAGON_BOLTS_E_, 135),
    ], [
        99, 99, 99, 99, 99, 99, 99
    ], MagicSpellbook.ANCIENT, true)
    const COMBAT_ACTIONS: CombatAction[] = [
        new CombatAction() {

            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                const food = ItemInSlot.getFromInventory(MANTA_RAY, playerBot.getInventory());

                return food == null;
            },

            perform(playerBot: PlayerBot, enemy: Mobile): void {
                console.log("Escape");
                if (enemy.isPlayer()) {
                    playerBot.sendChat(`Cya ${enemy.getAsPlayer().getUsername()}`);
                }
                if (TeleportHandler.checkReqs(playerBot, GameConstants.DEFAULT_LOCATION)) {
                    TeleportHandler.teleport(playerBot, GameConstants.DEFAULT_LOCATION, TeleportType.TELE_TAB, false);
                    playerBot.getInventory().delete(ItemIdentifiers.TELEPORT_TO_HOUSE, 1);
                }
            }
        },
        new CombatAction(), {

            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                return true;
            },

            perform(playerBot: PlayerBot, enemy: Mobile): void {
                const combatMethod = CombatFactory.getMethod(enemy);
                const combatType = combatMethod.type();

                const magicAccuracy = (enemy.isNpc() ? 0 : enemy.getAsPlayer().getBonusManager().getAttackBonus()[BonusManager.ATTACK_MAGIC]);

                if (!CombatFactory.canReach(enemy, combatMethod, playerBot) && magicAccuracy < 35) {
                    PrayerHandler.activatePrayer(playerBot, PrayerHandler.PrayerData.SMITE);
                    return;
                }

                if (combatType == CombatType.MELEE && CombatFactory.canReach(enemy, combatMethod, playerBot)) {
                    PrayerHandler.activatePrayer(playerBot, PrayerHandler.PrayerData.PROTECT_FROM_MELEE);
                    return;
                }

                if (combatType == CombatType.RANGED) {
                    PrayerHandler.activatePrayer(playerBot, PrayerHandler.PrayerData.PROTECT_FROM_MISSILES);
                } else {
                    PrayerHandler.activatePrayer(playerBot, PrayerHandler.PrayerData.PROTECT_FROM_MAGIC);
                }
            },

            stopAfter(): boolean {
                return false;
            }
        },
        class CombatSwitch {
            private items: number[];
            private prayers: PrayerHandler.PrayerData[];

            constructor(items: number[], prayers: PrayerHandler.PrayerData[]) {
                this.items = items;
                this.prayers = prayers;
            }

            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                let canAttackNextTick = playerBot.getTimers().willEndIn(TimerKey.COMBAT_ATTACK, 1);
                return canAttackNextTick && playerBot.getMovementQueue().getMobility().canMove()
                    && enemy.getHitpointsAfterPendingDamage() <= 49
                    && playerBot.getSpecialPercentage() >= 50
                    && !enemy.getPrayerActive()[PrayerHandler.PROTECT_FROM_MELEE];
            }

            performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
                console.log("AGS Spec");
                playerBot.getCombat().setCastSpell(null);
                if (!playerBot.isSpecialActivated()) {
                    CombatSpecial.activate(playerBot);
                }
                playerBot.getCombat().attack(enemy);
            }
        },

        new CombatAction() {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                let combatMethod = CombatFactory.getMethod(enemy);
                let distance = playerBot.calculateDistance(enemy);

                let cantAttack = playerBot.getTimers().has(TimerKey.COMBAT_ATTACK) && playerBot.getTimers().left(TimerKey.COMBAT_ATTACK) > 2;

                return cantAttack
                    && playerBot.getMovementQueue().size() == 0
                    && !enemy.getMovementQueue().getMobility().canMove()
                    && distance == 1
                    && CombatFactory.canReach(enemy, combatMethod, playerBot);
            }

            perform(playerBot: PlayerBot, enemy: Mobile): void {
                console.log("Retreat");
                playerBot.setFollowing(null);
                MovementQueue.randomClippedStepNotSouth(playerBot, 3);
            }
        },

        new CombatAction(), {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                let pot = Arrays.stream(SUPER_RESTORE_POTIONS.getIds())
                    .mapToObj(id => ItemInSlot.getFromInventory(id, playerBot.getInventory()))
                    .filter(Objects.nonNull)
                    .findFirst();
                return pot.isPresent() && playerBot.getSkillManager().getCurrentLevel(Skill.PRAYER) < 50;
            },
            perform(playerBot: PlayerBot, enemy: Mobile): void {
                console.log("Pot up");
                let pot = SUPER_RESTORE_POTIONS.getIds().map(id => ItemInSlot.getFromInventory(id, playerBot.getInventory()))
                    .filter(item => item !== null)
                    .find(item => item !== undefined);
                if (pot !== undefined) {
                    PotionConsumable.drink(playerBot, pot.getId(), pot.getSlot());
                }
            }
        },

        new CombatAction(), {
            private itemsToEquip: number[],
            private prayersToActivate: PrayerHandler.PrayerData[],
            constructor(itemsToEquip: number[], prayersToActivate: PrayerHandler.PrayerData[]) {
                this.itemsToEquip = itemsToEquip;
                this.prayersToActivate = prayersToActivate;
            },
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                let canAttackNextTick = playerBot.getTimers().willEndIn(TimerKey.COMBAT_ATTACK, 1);
                return canAttackNextTick && enemy.getMovementQueue().getMobility().canMove() && !enemy.getTimers().has(TimerKey.FREEZE_IMMUNITY) && CombatSpells.ICE_BARRAGE.getSpell().canCast(playerBot, false);
            },
            performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
                console.log("Freeze");
                playerBot.getCombat().setCastSpell(CombatSpells.ICE_BARRAGE.getSpell());
                playerBot.getCombat().attack(enemy);
            }
        },

        class EnemyDefenseAwareCombatSwitch {
            attackStyleSwitches: AttackStyleSwitch[];

            constructor(attackStyleSwitches: AttackStyleSwitch[]) {
                this.attackStyleSwitches = attackStyleSwitches;
            }

            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                let canAttackNextTick = playerBot.getTimers().willEndIn(TimerKey.COMBAT_ATTACK, 1);
                return canAttackNextTick;
            }

            const magicSwitch: CombatSwitch = {
                items: [STAFF_OF_THE_DEAD, AHRIMS_ROBETOP, AHRIMS_ROBESKIRT, BLESSED_SPIRIT_SHIELD, INFERNAL_CAPE],
                prayers: [PrayerData.PROTECT_ITEM, PrayerData.AUGURY],
                shouldPerform(playerBot: PlayerBot, enemy: Mobile) {
                    return CombatSpells.ICE_BARRAGE.getSpell().canCast(playerBot, false);
                },
                performAfterSwitch(playerBot: PlayerBot, enemy: Mobile) {
                    console.log("Magic");
                    playerBot.getCombat().setCastSpell(CombatSpells.ICE_BARRAGE.getSpell());
                    playerBot.setSpecialActivated(false);
                    playerBot.getCombat().attack(enemy);
                }
            };

            const rangedSwitch: CombatSwitch = {
                items: [ARMADYL_CROSSBOW, AVAS_ACCUMULATOR, KARILS_LEATHERSKIRT, KARILS_LEATHERTOP, BLESSED_SPIRIT_SHIELD],
                prayers: [PrayerData.PROTECT_ITEM, PrayerData.RIGOUR],
                shouldPerform(playerBot: PlayerBot, enemy: Mobile) {
                    return true;
                },
                performAfterSwitch(playerBot: PlayerBot, enemy: Mobile) {
                    console.log("Ranged");
                    playerBot.getCombat().setCastSpell(null);
                    playerBot.setSpecialActivated(false);
                    playerBot.getCombat().attack(enemy);
                }
            };

            const meleeSwitch: CombatSwitch = {
                items: [ARMADYL_GODSWORD, INFERNAL_CAPE, KARILS_LEATHERSKIRT, KARILS_LEATHERTOP],
                prayers: [PrayerData.PROTECT_ITEM, PrayerData.PIETY],
                shouldPerform(playerBot: PlayerBot, enemy: Mobile) {
                    return playerBot.getMovementQueue().getMobility().canMove() && enemy.getHitpointsAfterPendingDamage() <= 45;
                },
                performAfterSwitch(playerBot: PlayerBot, enemy: Mobile) {
                    console.log("Melee");
                    playerBot.getCombat().setCastSpell(null);
                    playerBot.getCombat().attack(enemy);
                }
            }
        },
        shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean, {
            let canAttackNextTick = playerBot.getTimers().willEndIn(TimerKey.COMBAT_ATTACK, 1);
            return canAttackNextTick;
        },
        getItemPreset(): Presetable, {
            return BOT_HARD_TRIBRID;
        },
        getCombatActions(): CombatAction[], {
            return COMBAT_ACTIONS;
        },
        eatAtPercent(): number, {
            return 62;
        },
    }