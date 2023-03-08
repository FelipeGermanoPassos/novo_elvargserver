import { FighterPreset } from "../FighterPreset";
import { CombatSpecial } from "../../../../../content/combat/CombatSpecial";
import { Presetable } from "../../../../../content/presets/Presetable";
import { Mobile } from "../../../Mobile";
import { PlayerBot } from "../../PlayerBot";
import { CombatAction } from "../CombatAction";
import { CombatSwitch } from "../CombatSwitch";
import { MagicSpellbook } from "../../../../../model/MagicSpellbook";
import { Item } from "../../../../../model/Item";
import { ItemIdentifiers } from "../../../../../../util/ItemIdentifiers";
import { TimerKey } from "../../../../../../util/timers/TimerKey";

class DragonDaggerCombatSwitch extends CombatSwitch {
    constructor() {
      super([ItemIdentifiers.DRAGON_DAGGER_P_PLUS_PLUS_]);
    }
  
    shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
      const canAttackNextTick = playerBot.getTimers().getTicks(TimerKey.COMBAT_ATTACK) <= 1;
      return canAttackNextTick && playerBot.getSpecialPercentage() >= 25 && enemy.getHitpoints() < 46;
    }
  
    performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
      if (!playerBot.isSpecialActivated()) {
        CombatSpecial.activate(playerBot);
      }
      playerBot.getCombat().attack(enemy);
    }
}

class DragonScimitarCombatSwitchs extends CombatSwitch {
    constructor() {
      super([ItemIdentifiers.DRAGON_SCIMITAR]);
    }
  
    shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
      return true;
    }
  
    performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
      playerBot.setSpecialActivated(false);
      playerBot.getCombat().attack(enemy);
    }
  }

export class DDSPureMFighterPreset extends FighterPreset {
    private static BOT_DDS_PURE_M_73 = new Presetable(
        "DDS Pure (M)",
        [
        new Item(ItemIdentifiers.DRAGON_DAGGER_P_PLUS_PLUS_, 1),
        new Item(ItemIdentifiers.MANTA_RAY, 1),
        new Item(ItemIdentifiers.MANTA_RAY, 1),
        new Item(ItemIdentifiers.SUPER_STRENGTH_4_, 1),
        new Item(ItemIdentifiers.COOKED_KARAMBWAN, 1),
        new Item(ItemIdentifiers.MANTA_RAY, 1),
        new Item(ItemIdentifiers.COOKED_KARAMBWAN, 1),
        new Item(ItemIdentifiers.SUPER_ATTACK_4_, 1),
        new Item(ItemIdentifiers.COOKED_KARAMBWAN, 1),
        new Item(ItemIdentifiers.MANTA_RAY, 1),
        new Item(ItemIdentifiers.MANTA_RAY, 1),
        new Item(ItemIdentifiers.MANTA_RAY, 1),
        new Item(ItemIdentifiers.COOKED_KARAMBWAN, 1),
        new Item(ItemIdentifiers.MANTA_RAY, 1),
        new Item(ItemIdentifiers.MANTA_RAY, 1),
        new Item(ItemIdentifiers.MANTA_RAY, 1),
        new Item(ItemIdentifiers.COOKED_KARAMBWAN, 1),
        new Item(ItemIdentifiers.MANTA_RAY, 1),
        new Item(ItemIdentifiers.MANTA_RAY, 1),
        new Item(ItemIdentifiers.MANTA_RAY, 1),
        new Item(ItemIdentifiers.COOKED_KARAMBWAN, 1),
        new Item(ItemIdentifiers.MANTA_RAY, 1),
        new Item(ItemIdentifiers.MANTA_RAY, 1),
        new Item(ItemIdentifiers.ANGLERFISH, 1)],
        [new Item(ItemIdentifiers.IRON_FULL_HELM, 1),
        new Item(ItemIdentifiers.OBSIDIAN_CAPE, 1),
        new Item(ItemIdentifiers.DRAGON_SCIMITAR, 1),
        new Item(ItemIdentifiers.AMULET_OF_GLORY, 1),
        new Item(ItemIdentifiers.IRON_PLATEBODY, 1),
        new Item(ItemIdentifiers.BOOK_OF_DARKNESS, 1),
        new Item(ItemIdentifiers.BLACK_DHIDE_CHAPS, 1),
        new Item(ItemIdentifiers.MITHRIL_GLOVES, 1),
        new Item(ItemIdentifiers.CLIMBING_BOOTS, 1),
        new Item(ItemIdentifiers.RING_OF_RECOIL, 1),
        new Item(null)]
        
        ,[60, 1, 99, 85, 1, 1, 1]
        ,MagicSpellbook.NORMAL
        ,true
    )

const COMBAT_ACTIONS: CombatAction[] = [
    new DragonDaggerCombatSwitch(){
        shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
            const canAttackNextTick = playerBot.getTimers().getTicks(TimerKey.COMBAT_ATTACK) <= 1;
            return canAttackNextTick && playerBot.getSpecialPercentage() >= 25 &&
                // Switch if the enemy has lowish health
                enemy.getHitpoints() < 46;
        },
        performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
            if (!playerBot.isSpecialActivated()) {
                CombatSpecial.activate(playerBot);
            }
            playerBot.getCombat().attack(enemy);
        }
    },
    new DragonScimitarCombatSwitchs() {
        shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
            return true;
        },
    
            performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
            playerBot.setSpecialActivated(false);
            playerBot.getCombat().attack(enemy);
        }
    },
];

getItemPreset(): Presetable {
    return this.BOT_DDS_PURE_M_73;
}

getCombatActions(): CombatAction[] {
    return this.COMBAT_ACTIONS;
}
}