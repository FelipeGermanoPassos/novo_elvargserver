import { PrayerHandler } from "../../../../../content/PrayerHandler";
import { CombatSpecial } from "../../../../../content/combat/CombatSpecial";
import { Presetable } from "../../../../../content/presets/Presetable";
import { Mobile } from "../../../Mobile";
import { PlayerBot } from "../../PlayerBot";
import { CombatAction } from "../CombatAction";
import { CombatSwitch } from "../CombatSwitch";
import { FighterPreset } from "../FighterPreset";
import { Item } from "../../../../../model/Item";
import { TimerKey } from "../../../../../../util/timers/TimerKey";
import { ItemIdentifiers } from "../../../../../../util/ItemIdentifiers";
export class GRangerFighterPreset implements FighterPreset {
    eatAtPercent
    const BOT_G_MAULER_70 = {
        name: "G Mauler (R)",
        items: [
            new Item(ItemIdentifiers.RUNE_CROSSBOW), new Item(ItemIdentifiers.DRAGON_BOLTS_E_, 75), new Item(ItemIdentifiers.RANGING_POTION_4_), new Item(ItemIdentifiers.SUPER_STRENGTH_4_),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.GRANITE_MAUL), new Item(ItemIdentifiers.SUPER_RESTORE_4_), new Item(ItemIdentifiers.SUPER_ATTACK_4_),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.SARADOMIN_BREW_4_), new Item(ItemIdentifiers.MONKFISH),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.RING_OF_RECOIL), new Item(ItemIdentifiers.ANGLERFISH),
        ],
        equipment: [
            new Item(ItemIdentifiers.COIF),
            new Item(ItemIdentifiers.AVAS_ACCUMULATOR),
            new Item(ItemIdentifiers.MAGIC_SHORTBOW),
            new Item(ItemIdentifiers.AMULET_OF_GLORY),
            new Item(ItemIdentifiers.LEATHER_BODY),
            null,
            new Item(ItemIdentifiers.BLACK_DHIDE_CHAPS),
            new Item(ItemIdentifiers.MITHRIL_GLOVES),
            new Item(ItemIdentifiers.CLIMBING_BOOTS),
            new Item(ItemIdentifiers.RING_OF_RECOIL),
            new Item(ItemIdentifiers.RUNE_ARROW, 75),
        ],
        stats: {
            atk: 50,
            def: 1,
            str: 99,
            hp: 85,
            range: 99,
            pray: 1,
            mage: 1
        },
        spellbook: "NORMAL",
        specialAttack: true
    };

    export const COMBAT_ACTIONS: CombatAction[] = [
        new CombatSwitch([ItemIdentifiers.DRAGON_DAGGER_P_PLUS_PLUS_]) {
          shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
            const canAttackNextTick = playerBot.getTimers().getTicks(TimerKey.COMBAT_ATTACK) <= 1;
            return canAttackNextTick && playerBot.getSpecialPercentage() >= 25 &&
                   enemy.getHitpoints() < 46;
          }
      
          performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
            if (!playerBot.isSpecialActivated()) {
              CombatSpecial.activate(playerBot);
            }
            playerBot.getCombat().attack(enemy);
          }
        },
        new CombatSwitch([ItemIdentifiers.DRAGON_SCIMITAR]) {
          shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
            return true;
          }
      
          performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
            playerBot.setSpecialActivated(false);
            playerBot.getCombat().attack(enemy);
          }
        },
      ];

    getItemPreset(): Presetable {
        return this.BOT_G_MAULER_70;
    }

    getCombatActions(): CombatAction[] {
        return this.COMBAT_ACTIONS;
    }
}    
    
    
    
    
            

