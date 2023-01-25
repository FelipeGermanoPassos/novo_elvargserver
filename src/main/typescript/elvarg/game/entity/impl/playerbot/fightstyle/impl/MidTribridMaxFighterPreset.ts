export class MidTribridMaxFighterPreset implements FighterPreset {
    private static RANDOM = new RandomGen();
    private CombatAction = new CombatAction();
    public static BOT_MID_TRIBRID: Presetable = new Presetable("Mid Tribrid",
        [
            new Item(AVAS_ACCUMULATOR), new Item(BLACK_DHIDE_BODY), new Item(ABYSSAL_WHIP), new Item(SHARK),
            new Item(RUNE_CROSSBOW), new Item(RUNE_PLATELEGS), new Item(DRAGON_DEFENDER), new Item(SHARK),
            new Item(COOKED_KARAMBWAN), new Item(COOKED_KARAMBWAN), new Item(DRAGON_DAGGER_P_PLUS_PLUS_), new Item(SUPER_RESTORE_4_),
            new Item(SHARK), new Item(SHARK), new Item(SHARK), new Item(SHARK),
            new Item(SHARK), new Item(SHARK), new Item(SHARK), new Item(SUPER_COMBAT_POTION_4_),
            new Item(SHARK), new Item(SHARK), new Item(SHARK), new Item(ANGLERFISH),
            new Item(WATER_RUNE, 6000), new Item(BLOOD_RUNE, 2000), new Item(DEATH_RUNE, 4000), new Item(RANGING_POTION_4_),
        ],
        [
            new Item(HELM_OF_NEITIZNOT),
            new Item(SARADOMIN_CAPE),
            new Item(MASTER_WAND),
            new Item(AMULET_OF_FURY),
            new Item(MYSTIC_ROBE_TOP),
            new Item(SPIRIT_SHIELD),
            new Item(MYSTIC_ROBE_BOTTOM),
            new Item(BARROWS_GLOVES),
            new Item(CLIMBING_BOOTS),
            new Item(RING_OF_RECOIL),
            new Item(DRAGON_BOLTS_E_, 500),
        ],
        [99, 99, 99, 99, 99, 99, 99],
        MagicSpellbook.ANCIENT,
        true
    );

    public static COMBAT_ACTIONS: CombatAction[] = [
        //Slower
        {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                return RANDOM.inclusive(0, 4) != 2;
            },
            perform(playerBot: PlayerBot, enemy: Mobile): void {

            },
            stopAfter(): boolean {
                return false;
            }
        },
        //OverHead prayers
        {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                return RANDOM.inclusive(0, 4) == 2;
            },
            perform(playerBot: PlayerBot, enemy: Mobile) {
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
            }
            stopAfter(): boolean {
                return false;
            }
        },
        new CombatSwitch([DRAGON_DAGGER_P_PLUS_PLUS_, DRAGON_DEFENDER]),
        new PrayerHandler([PrayerHandler.PrayerData.PROTECT_ITEM, PrayerHandler.PrayerData.PIETY]), {

            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                const canAttackNextTick = playerBot.getTimers().willEndIn(TimerKey.COMBAT_ATTACK, 1);
                return canAttackNextTick && playerBot.getMovementQueue().getMobility().canMove()
                    && enemy.getHitpointsAfterPendingDamage() <= 49
                    && playerBot.getSpecialPercentage() >= 50
                    && !enemy.getPrayerActive()[PrayerHandler.PROTECT_FROM_MELEE];
            },
            performAfterSwitch(playerBot: PlayerBot, enemy: Mobile) {
                playerBot.getCombat().setCastSpell(null);
                if (!playerBot.isSpecialActivated()) {
                    CombatSpecial.activate(playerBot);
                }
                playerBot.getCombat().attack(enemy);
            }
        },
        new CombatAction() {

            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                var combatMethod = CombatFactory.getMethod(enemy);
                let distance = playerBot.calculateDistance(enemy);
                let cantAttack = playerBot.getTimers().has(TimerKey.COMBAT_ATTACK) && playerBot.getTimers().left(TimerKey.COMBAT_ATTACK) > 2;
                return cantAttack
                    && playerBot.getMovementQueue().size() == 0
                    && !enemy.getMovementQueue().getMobility().canMove()
                    && distance == 1
                    && CombatFactory.canReach(enemy, combatMethod, playerBot);
            },
            perform(playerBot: PlayerBot, enemy: Mobile) {
                playerBot.setFollowing(null);
                MovementQueue.randomClippedStepNotSouth(playerBot, 3);
            }
        },
        new CombatAction(){

            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                let pot = SUPER_RESTORE_POTIONS.getIds().map(id => ItemInSlot.getFromInventory(id, playerBot.getInventory())).filter(item => item !== null).find(item => true);
                return pot && playerBot.getSkillManager().getCurrentLevel(Skill.PRAYER) < 50;
            },
            perform(playerBot: PlayerBot, enemy: Mobile) {
                let pot = SUPER_RESTORE_POTIONS.getIds().map(id => ItemInSlot.getFromInventory(id, playerBot.getInventory())).filter(item => item !== null).find(item => true);
                PotionConsumable.drink(playerBot, pot.getId(), pot.getSlot());
            }
        },
        new CombatSwitchAction()([MASTER_WAND, SARADOMIN_CAPE, MYSTIC_ROBE_TOP, MYSTIC_ROBE_BOTTOM, SPIRIT_SHIELD]),
        new PrayerHandler()([PrayerHandler.PrayerData.PROTECT_ITEM, PrayerHandler.PrayerData.MYSTIC_MIGHT]){

            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                let canAttackNextTick = playerBot.getTimers().willEndIn(TimerKey.COMBAT_ATTACK, 1);
                return canAttackNextTick && enemy.getMovementQueue().getMobility().canMove() && !enemy.getTimers().has(TimerKey.FREEZE_IMMUNITY) && CombatSpells.ICE_BARRAGE.getSpell().canCast(playerBot, false);
            },

            performAfterSwitch(playerBot: PlayerBot, enemy: Mobile) {
                playerBot.getCombat().setCastSpell(CombatSpells.ICE_BARRAGE.getSpell());
                playerBot.getCombat().attack(enemy);
            }
        },


        class EnemyDefenseAwareCombatSwitch {
            constructor(public attackStyleSwitches: AttackStyleSwitch[]) { }
        },

        class AttackStyleSwitch {
            constructor(public combatType: CombatType, public combatSwitch: CombatSwitch) { }
        },

        class CombatSwitch {
            constructor(public equipment: number[], public prayers: PrayerHandler.PrayerData[]) { }

            public shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                // logic here
            }

            public performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
                // logic here
            }
        },
        
        enum CombatType {
    MAGIC = "MAGIC",
    RANGED = "RANGED",
    MELEE = "MELEE"
}

const MASTER_WAND = 0;
const SARADOMIN_CAPE = 1;
const MYSTIC_ROBE_TOP = 2;
const MYSTIC_ROBE_BOTTOM = 3;
const SPIRIT_SHIELD = 4;
const RUNE_CROSSBOW = 5;
const AVAS_ACCUMULATOR = 6;
const RUNE_PLATELEGS = 7;
const BLACK_DHIDE_BODY = 8;
const ABYSSAL_WHIP = 9;
const DRAGON_DEFENDER = 10;

const enemyDefenseAwareCombatSwitch = new EnemyDefenseAwareCombatSwitch([
    new AttackStyleSwitch(CombatType.MAGIC, new CombatSwitch([MASTER_WAND, SARADOMIN_CAPE, MYSTIC_ROBE_TOP, MYSTIC_ROBE_BOTTOM, SPIRIT_SHIELD],
        [PrayerHandler.PrayerData.PROTECT_ITEM, PrayerHandler.PrayerData.AUGURY]), {
        public shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
            return CombatSpells.ICE_BARRAGE.getSpell().canCast(playerBot, false);
        },

        public performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
            playerBot.getCombat().setCastSpell(CombatSpells.ICE_BARRAGE.getSpell());
            playerBot.getCombat().attack(enemy);
        }
    }),
    new AttackStyleSwitch(CombatType.RANGED, new CombatSwitch([RUNE_CROSSBOW, AVAS_ACCUMULATOR, RUNE_PLATELEGS, BLACK_DHIDE_BODY],
        [PrayerHandler.PrayerData.PROTECT_ITEM, PrayerHandler.PrayerData.EAGLE_EYE]), {
        public shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
            return true;
        },

        public performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
            playerBot.getCombat().setCastSpell(null);
            playerBot.setSpecialActivated(false);
            playerBot.getCombat().attack(enemy);
        },
        public performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
            playerBot.getCombat().setCastSpell(null);
            playerBot.getCombat().attack(enemy);
        },
    }),
    shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean, {
        return playerBot.getTimers().willEndIn(TimerKey.COMBAT_ATTACK, 1),
    },

    getItemPreset(): Presetable, {
        return BOT_MID_TRIBRID;
    },

    getCombatActions(): CombatAction[], {
        return COMBAT_ACTIONS;
    },

    eatAtPercent(): number, {
        return 45;
    },
}




