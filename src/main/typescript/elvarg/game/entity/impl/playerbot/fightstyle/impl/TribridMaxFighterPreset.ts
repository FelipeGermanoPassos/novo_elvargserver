import { GameConstants } from "../../../../../GameConstants";
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
import { MagicSpellbook, MagicSpellbooks } from "../../../../../model/MagicSpellbook";
import { Skill } from "../../../../../model/Skill";
import { BonusManager } from "../../../../../model/equipment/BonusManager";
import { MovementQueue } from "../../../../../model/movement/MovementQueue";
import { TeleportHandler } from "../../../../../model/teleportation/TeleportHandler";
import { TeleportType } from "../../../../../model/teleportation/TeleportType";
import { ItemIdentifiers } from "../../../../../../util/ItemIdentifiers";
import { TimerKey } from "../../../../../../util/timers/TimerKey";

export class TribridMaxFighterPreset implements FighterPreset {
    private static BOT_HARD_TRIBRID: Presetable = new Presetable("Bot Tribrid", [
        new Item(ItemIdentifiers.ARMADYL_CROSSBOW), new Item(ItemIdentifiers.ARMADYL_GODSWORD), new Item(ItemIdentifiers.RANGING_POTION_4_), new Item(ItemIdentifiers.SUPER_COMBAT_POTION_4_),
        new Item(ItemIdentifiers.AVAS_ACCUMULATOR), new Item(ItemIdentifiers.KARILS_LEATHERSKIRT), new Item(ItemIdentifiers.KARILS_LEATHERTOP), new Item(ItemIdentifiers.SUPER_RESTORE_4_),
        new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.COOKED_KARAMBWAN),
        new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.COOKED_KARAMBWAN),
        new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.COOKED_KARAMBWAN),
        new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.ANGLERFISH),
        new Item(ItemIdentifiers.WATER_RUNE, 10000), new Item(ItemIdentifiers.BLOOD_RUNE, 10000), new Item(ItemIdentifiers.DEATH_RUNE, 10000), new Item(ItemIdentifiers.TELEPORT_TO_HOUSE, 1),
    ], [
        new Item(ItemIdentifiers.HELM_OF_NEITIZNOT),
        new Item(ItemIdentifiers.INFERNAL_CAPE),
        new Item(ItemIdentifiers.STAFF_OF_THE_DEAD),
        new Item(ItemIdentifiers.AMULET_OF_FURY),
        new Item(ItemIdentifiers.AHRIMS_ROBESKIRT),
        new Item(ItemIdentifiers.BLESSED_SPIRIT_SHIELD),
        new Item(ItemIdentifiers.AHRIMS_ROBETOP),
        new Item(ItemIdentifiers.BARROWS_GLOVES),
        new Item(ItemIdentifiers.CLIMBING_BOOTS),
        new Item(ItemIdentifiers.RING_OF_RECOIL),
        new Item(ItemIdentifiers.DRAGONSTONE_DRAGON_BOLTS_E_, 135),
    ], [
        99, 99, 99, 99, 99, 99, 99
    ], MagicSpellbooks.ANCIENT, true)
    const COMBAT_ACTIONS: CombatAction[] = [
        new CombatAction() {

            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                const food = ItemInSlot.getFromInventory(ItemIdentifiers.MANTA_RAY, playerBot.getInventory());

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
                    PrayerHandler.activatePrayer(playerBot, PrayerData.SMITE);
                    return;
                }

                if (combatType == CombatType.MELEE && CombatFactory.canReach(enemy, combatMethod, playerBot)) {
                    PrayerHandler.activatePrayer(playerBot, PrayerData.PROTECT_FROM_MELEE);
                    return;
                }

                if (combatType == CombatType.RANGED) {
                    PrayerHandler.activatePrayer(playerBot, PrayerData.PROTECT_FROM_MISSILES);
                } else {
                    PrayerHandler.activatePrayer(playerBot, PrayerData.PROTECT_FROM_MAGIC);
                }
            },

            stopAfter(): boolean {
                return false;
            }
        },
        class CombatSwitch {
            private items: number[];
            private prayers: PrayerData[];

            constructor(items: number[], prayers: PrayerData[]) {
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
            },

            perform(playerBot: PlayerBot, enemy: Mobile): void {
                console.log("Retreat");
                playerBot.setFollowing(null);
                MovementQueue.randomClippedStepNotSouth(playerBot, 3);
            }
        },

        new CombatAction(), {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                let pot = Array.stream(PotionConsumable.SUPER_RESTORE_POTIONS.getIds())
                    .mapToObj(id => ItemInSlot.getFromInventory(id, playerBot.getInventory()))
                    .filter(Objects.nonNull)
                    .findFirst();
                return pot.isPresent() && playerBot.getSkillManager().getCurrentLevel(Skill.PRAYER) < 50;
            },
            perform(playerBot: PlayerBot, enemy: Mobile): void {
                console.log("Pot up");
                let pot = PotionConsumable.SUPER_RESTORE_POTIONS.getIds().map(id => ItemInSlot.getFromInventory(id, playerBot.getInventory()))
                    .filter(item => item !== null)
                    .find(item => item !== undefined);
                if (pot !== undefined) {
                    PotionConsumable.drink(playerBot, pot.getId(), pot.getSlot());
                }
            }
        },

        new CombatAction(), {
            private itemsToEquip: number[],
            private prayersToActivate: PrayerHandler.prayerData[],
            constructor(itemsToEquip: number[], prayersToActivate: PrayerData[]) {
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