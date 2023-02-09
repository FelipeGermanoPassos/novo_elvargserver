import { CombatFactory } from "../../../../../content/combat/CombatFactory";
import { CombatSpecial } from "../../../../../content/combat/CombatSpecial";
import { CombatType } from "../../../../../content/combat/CombatType";
import { CombatSpells } from "../../../../../content/combat/magic/CombatSpells";
import { Presetable } from "../../../../../content/presets/Presetable";
import { Mobile } from "../../../Mobile";
import { PlayerBot } from "../../PlayerBot";
import { AttackStyleSwitch } from "../AttackStyleSwitch";
import { CombatAction } from "../CombatAction";
import { CombatSwitch } from "../CombatSwitch";
import { EnemyDefenseAwareCombatSwitch } from "../EnemyDefenseAwareCombatSwitch";
import { TribridMaxFighterPreset } from "./TribridMaxFighterPreset";
import { FighterPreset } from "../FighterPreset";
import { Item } from "../../../../../model/Item";
import { ItemIdentifiers } from "../../../../../../util/ItemIdentifiers";



export class NHPureFighterPreset implements FighterPreset {
    getItemPreset;
    getCombatActions;
    eatAtPercent;
    public static readonly BOT_NH_PURE_83 = new Presetable("BOT NH Pure",
        [
            new Item(ItemIdentifiers.RUNE_CROSSBOW), new Item(ItemIdentifiers.BLACK_DHIDE_CHAPS), new Item(ItemIdentifiers.RANGING_POTION_4_), new Item(ItemIdentifiers.SUPER_STRENGTH_4_),
            new Item(ItemIdentifiers.AVAS_ACCUMULATOR), new Item(ItemIdentifiers.GRANITE_MAUL), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.DRAGON_BOLTS_E_, 75), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.WATER_RUNE, 1000), new Item(ItemIdentifiers.BLOOD_RUNE, 1000), new Item(ItemIdentifiers.DEATH_RUNE, 1000), new Item(ItemIdentifiers.ANGLERFISH)
        ],
        [new Item(ItemIdentifiers.GHOSTLY_HOOD), new Item(ItemIdentifiers.ZAMORAK_CAPE), new Item(ItemIdentifiers.MAGIC_SHORTBOW), new Item(ItemIdentifiers.AMULET_OF_GLORY), new Item(ItemIdentifiers.GHOSTLY_ROBE), null, new Item(ItemIdentifiers.GHOSTLY_ROBE_2), new Item(ItemIdentifiers.MITHRIL_GLOVES), new Item(ItemIdentifiers.CLIMBING_BOOTS), new Item(ItemIdentifiers.RING_OF_RECOIL), new Item(ItemIdentifiers.RUNE_ARROW, 175),],
        /* atk, def, str, hp, range, pray, mage */
        [60, 1, 85, 99, 99, 1, 99],
        MagicSpellbook.ANCIENT,
        true
    );
    public static readonly COMBAT_ACTIONS: CombatAction[] = [
        {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                return playerBot.getSpecialPercentage() >= 50 && playerBot.getMovementQueue().getMobility().canMove() &&
                    enemy.getHitpointsAfterPendingDamage() <= 45;
            },
            performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
                playerBot.getCombat().attack(enemy);
                CombatSpecial.activate(playerBot);
                CombatSpecial.activate(playerBot);
            }
        }
    ]
    class CombatSwitch {
    constructor(private items: number[]) { }
    shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
        let hasRing = ItemInSlot.getFromInventory(RING_OF_RECOIL, playerBot.getInventory()) != null;
        return hasRing && playerBot.getEquipment().getById(RING_OF_RECOIL) == null;
    }
    performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
        playerBot.getCombat().attack(enemy);
    }
}
class CombatAction {
    shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
        let combatMethod = CombatFactory.getMethod(enemy);
        let distance = playerBot.calculateDistance(enemy);
        let cantAttack = playerBot.getTimers().has(TimerKey.COMBAT_ATTACK) && playerBot.getTimers().left(TimerKey.COMBAT_ATTACK) > 1;
        return cantAttack
            && !enemy.getMovementQueue().getMobility().canMove()
            && distance == 1
            && CombatFactory.canReach(enemy, combatMethod, playerBot);
    }

    perform(playerBot: PlayerBot, enemy: Mobile): void {
        if (playerBot.getMovementQueue().size() > 0) {
            return;
        }
        playerBot.setFollowing(null);
        MovementQueue.randomClippedStepNotSouth(playerBot, 3);
    }
}
const combatSwitch = new CombatSwitch([ZAMORAK_CAPE, GHOSTLY_ROBE_2, GHOSTLY_ROBE]);

class CombatSwitch {
    constructor(private items: number[]) { }

    shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
        // Freeze the player if they can move
        return (
            enemy.getMovementQueue().getMobility().canMove() &&
            !enemy.getTimers().has(TimerKey.FREEZE_IMMUNITY) &&
            CombatSpells.ICE_BARRAGE.getSpell().canCast(playerBot, false)
        );
    }

    performAfterSwitch(playerBot: PlayerBot, enemy: Mobile) {
        playerBot.getCombat().setCastSpell(CombatSpells.ICE_BARRAGE.getSpell());
        playerBot.getCombat().attack(enemy);
    }
}
const combatSwitch = new CombatSwitch([RUNE_CROSSBOW, DRAGON_BOLTS_E_, AVAS_ACCUMULATOR, BLACK_DHIDE_CHAPS]);
class CombatSwitch {
    constructor(private items: number[]) { }

    shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
        return enemy.getHitpoints() < 40;
    }

    performAfterSwitch(playerBot: PlayerBot, enemy: Mobile) {
        playerBot.getCombat().attack(enemy);
    }
}
class CombatSwitch {
    constructor(private items: number[]) { }

    shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
        throw new Error("Method not implemented.");
    }

    performAfterSwitch(playerBot: PlayerBot, enemy: Mobile) {
        throw new Error("Method not implemented.");
    }
}

class AttackStyleSwitch {
    constructor(private combatType: CombatType, private switch: CombatSwitch) { }
    }

class EnemyDefenseAwareCombatSwitch {
    constructor(private attackStyles: AttackStyleSwitch[]) { }
}

const magicCombatSwitch = new CombatSwitch([ZAMORAK_CAPE, GHOSTLY_ROBE_2, GHOSTLY_ROBE])
magicCombatSwitch.shouldPerform = (playerBot: PlayerBot, enemy: Mobile) => {
    return CombatSpells.ICE_BARRAGE.getSpell().canCast(playerBot, false);
};
magicCombatSwitch.performAfterSwitch = (playerBot: PlayerBot, enemy: Mobile) => {
    playerBot.getCombat().setCastSpell(CombatSpells.ICE_BARRAGE.getSpell());
    playerBot.getCombat().attack(enemy);
};

const rangedCombatSwitch = new CombatSwitch([MAGIC_SHORTBOW, RUNE_ARROW, AVAS_ACCUMULATOR, BLACK_DHIDE_CHAPS])
rangedCombatSwitch.shouldPerform = (playerBot: PlayerBot, enemy: Mobile) => {
    return true;
};
rangedCombatSwitch.performAfterSwitch = (playerBot: PlayerBot, enemy: Mobile) => {
    playerBot.setSpecialActivated(false);
    playerBot.getCombat().attack(enemy);
};

const magicAttackStyle = new AttackStyleSwitch(CombatType.MAGIC, magicCombatSwitch);
const rangedAttackStyle = new AttackStyleSwitch(CombatType.RANGED, rangedCombatSwitch);

const enemyDefenseAwareCombatSwitch = new EnemyDefenseAwareCombatSwitch([
    magicAttackStyle,
    rangedAttackStyle
]); {
    shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
        return true;
    },
},
    
    public getItemPreset(): Presetable {
    return BOT_NH_PURE_83;
}
    
    public getCombatActions(): CombatAction[] {
    return BotNhPure83.COMBAT_ACTIONS;
}
    



}