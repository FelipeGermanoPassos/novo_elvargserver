import { PrayerHandler } from "../../../../../content/PrayerHandler";
import { CombatSpecial } from "../../../../../content/combat/CombatSpecial";
import { Presetable } from "../../../../../content/presets/Presetable";
import { Mobile } from "../../../Mobile";
import { PlayerBot } from "../../PlayerBot";
import { CombatAction } from "../CombatAction";
import { CombatSwitch } from "../CombatSwitch";
import { FighterPreset } from "../FighterPreset";
import { Item } from "../../../../../model/Item";
import { MagicSpellbook } from "../../../../../model/MagicSpellbook";
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

    const COMBAT_ACTIONS: CombatAction[] = [
        new CombatSwitch([ItemIdentifiers.GRANITE_MAUL], {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                return playerBot.getSpecialPercentage() >= 50 &&
                    // Don't switch to Melee if we're frozen
                    playerBot.getMovementQueue().getMobility().canMove() &&
                    // Switch if the enemy has enabled protect from missles or has lowish health
                    (!enemy.getPrayerActive()[PrayerHandler.PROTECT_FROM_MELEE] && enemy.getHitpointsAfterPendingDamage() < 45);
            },
            performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
                playerBot.getCombat().attack(enemy);
                CombatSpecial.activate(playerBot);
                CombatSpecial.activate(playerBot);
            },
        }),
        new CombatSwitch([ItemIdentifiers.RUNE_CROSSBOW, ItemIdentifiers.DRAGON_BOLTS_E_], {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                return enemy.getHitpoints() < 40;
            },
            performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
                playerBot.getCombat().attack(enemy);
            },
        }),
        new CombatSwitch([ItemIdentifiers.MAGIC_SHORTBOW, ItemIdentifiers.RUNE_ARROW], {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                return true;
            },
            performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
                playerBot.setSpecialActivated(false);
                playerBot.getCombat().attack(enemy);
            },
        }),
    ];

    getItemPreset(): Presetable {
        return this.BOT_G_MAULER_70;
    }

    getCombatActions(): CombatAction[] {
        return this.COMBAT_ACTIONS;
    }
}    
    
    
    
    
            

]