import { PotionConsumable } from "../../../../../content/PotionConsumable";
import { PrayerData, PrayerHandler } from "../../../../../content/PrayerHandler";
import { CombatFactory } from "../../../../../content/combat/CombatFactory";
import { CombatSpecial } from "../../../../../content/combat/CombatSpecial";
import { CombatType } from "../../../../../content/combat/CombatType";
import { CombatSpells } from "../../../../../content/combat/magic/CombatSpells";
import { CombatMethod } from "../../../../../content/combat/method/CombatMethod";
import { Presetable } from "../../../../../content/presets/Presetable";
import { Mobile } from "../../../Mobile";
import { PlayerBot } from "../../PlayerBot";
import { AttackStyleSwitch } from "../AttackStyleSwitch";
import { CombatAction } from "../CombatAction";
import { CombatSwitch } from "../CombatSwitch";
import { EnemyDefenseAwareCombatSwitch } from "../EnemyDefenseAwareCombatSwitch";
import { FighterPreset } from "../FighterPreset";
import { Item } from "../../../../../model/Item";
import { ItemInSlot } from "../../../../../model/ItemInSlot";
import { MagicSpellbook } from "../../../../../model/MagicSpellbook";
import { Skill } from "../../../../../model/Skill";
import { BonusManager } from "../../../../../model/equipment/BonusManager";
import { MovementQueue } from "../../../../../model/movement/MovementQueue";
import { RandomGen } from "../../../../../../util/RandomGen";
import { TimerKey } from "../../../../../../util/timers/TimerKey";
import { ItemIdentifiers } from "../../../../../../util/ItemIdentifiers";


export class MidTribridMaxFighterPreset implements FighterPreset {
    private static RANDOM = new RandomGen();
    private CombatAction = new CombatAction();
    public static BOT_MID_TRIBRID: Presetable = new Presetable("Mid Tribrid",
        [
            new Item(ItemIdentifiers.AVAS_ACCUMULATOR), new Item(ItemIdentifiers.BLACK_DHIDE_BODY), new Item(ItemIdentifiers.ABYSSAL_WHIP), new Item(ItemIdentifiers.SHARK),
            new Item(ItemIdentifiers.RUNE_CROSSBOW), new Item(ItemIdentifiers.RUNE_PLATELEGS), new Item(ItemIdentifiers.DRAGON_DEFENDER), new Item(ItemIdentifiers.SHARK),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.DRAGON_DAGGER_P_PLUS_PLUS_), new Item(ItemIdentifiers.SUPER_RESTORE_4_),
            new Item(ItemIdentifiers.SHARK), new Item(ItemIdentifiers.SHARK), new Item(ItemIdentifiers.SHARK), new Item(ItemIdentifiers.SHARK),
            new Item(ItemIdentifiers.SHARK), new Item(ItemIdentifiers.SHARK), new Item(ItemIdentifiers.SHARK), new Item(ItemIdentifiers.SUPER_COMBAT_POTION_4_),
            new Item(ItemIdentifiers.SHARK), new Item(ItemIdentifiers.SHARK), new Item(ItemIdentifiers.SHARK), new Item(ItemIdentifiers.ANGLERFISH),
            new Item(ItemIdentifiers.WATER_RUNE, 6000), new Item(ItemIdentifiers.BLOOD_RUNE, 2000), new Item(ItemIdentifiers.DEATH_RUNE, 4000), new Item(ItemIdentifiers.RANGING_POTION_4_),
        ],
        [
            new Item(ItemIdentifiers.HELM_OF_NEITIZNOT),
            new Item(ItemIdentifiers.SARADOMIN_CAPE),
            new Item(ItemIdentifiers.MASTER_WAND),
            new Item(ItemIdentifiers.AMULET_OF_FURY),
            new Item(ItemIdentifiers.MYSTIC_ROBE_TOP),
            new Item(ItemIdentifiers.SPIRIT_SHIELD),
            new Item(ItemIdentifiers.MYSTIC_ROBE_BOTTOM),
            new Item(ItemIdentifiers.BARROWS_GLOVES),
            new Item(ItemIdentifiers.CLIMBING_BOOTS),
            new Item(ItemIdentifiers.RING_OF_RECOIL),
            new Item(ItemIdentifiers.DRAGON_BOLTS_E_, 500),
        ],
        [99, 99, 99, 99, 99, 99, 99],
        MagicSpellbook.ANCIENT,
        true
    );

    public static COMBAT_ACTIONS: CombatAction[] = [
        //Slower
        {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                return this.RANDOM.inclusive(0, 4) != 2;
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
                return this.RANDOM.inclusive(0, 4) == 2;
            },
            perform(playerBot: PlayerBot, enemy: Mobile) {
                const combatMethod = CombatFactory.getMethod(enemy);
                const combatType = combatMethod.type();

                const magicAccuracy = (enemy.isNpc() ? 0 : enemy.getAsPlayer().getBonusManager().getAttackBonus()[BonusManager.ATTACK_MAGIC]);

                if (!CombatFactory.canReach(enemy, combatMethod, playerBot) && magicAccuracy < 35) {
                    PrayerHandler.activatePrayer(playerBot, PrayerHandler.prayerData.SMITE);
                    return;
                }

                if (combatType == CombatType.MELEE && CombatFactory.canReach(enemy, combatMethod, playerBot)) {
                    PrayerHandler.activatePrayer(playerBot, PrayerHandler.prayerData.PROTECT_FROM_MELEE);
                    return;
                }

                if (combatType == CombatType.RANGED) {
                    PrayerHandler.activatePrayer(playerBot, PrayerHandler.prayerData.PROTECT_FROM_MISSILES);
                } else {
                    PrayerHandler.activatePrayer(playerBot, PrayerHandler.prayerData.PROTECT_FROM_MAGIC);
                }
            },
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
        new PrayerHandler()([PrayerHandler.prayerData.PROTECT_ITEM, PrayerHandler.prayerData.MYSTIC_MIGHT]){

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
            constructor(public equipment: number[], public prayers: PrayerData[]) { }

            public shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                // logic here
            }

            public performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
                // logic here
            }
        }
    }




