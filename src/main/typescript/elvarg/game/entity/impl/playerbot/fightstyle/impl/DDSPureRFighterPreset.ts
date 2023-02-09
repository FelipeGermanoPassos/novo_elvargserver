import { CombatSpecial } from "../../../../../content/combat/CombatSpecial";
import { Presetable } from "../../../../../content/presets/Presetable";
import { Mobile } from "../../../Mobile";
import { PlayerBot } from "../../PlayerBot";
import { CombatAction } from "../CombatAction";
import { CombatSwitch } from "../CombatSwitch";
import { FighterPreset } from "../FighterPreset";
import { Item } from "../../../../../model/Item";
import { MagicSpellbook, MagicSpellbooks } from "../../../../../model/MagicSpellbook";
import { ItemIdentifiers } from "../../../../../../util/ItemIdentifiers";



export interface DDSPureRFighterPreset implements FighterPreset {
    public BOT_DDS_PURE_R_73: Presetable = new Presetable("DDS Pure (R)",
        [
            new Item(ItemIdentifiers.RUNE_CROSSBOW),
            new Item(ItemIdentifiers.DRAGON_BOLTS_E_, 75),
            new Item(ItemIdentifiers.RANGING_POTION_4_),
            new Item(ItemIdentifiers.SUPER_STRENGTH_4_),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.DRAGON_DAGGER_P_PLUS_PLUS_),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.RING_OF_RECOIL),
            new Item(ItemIdentifiers.ANGLERFISH)
        ],


        [
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
            new Item(ItemIdentifiers.RUNE_ARROW, 75)
        ],
        {
            atk: 60,
            def: 1,
            str: 99,
            hp: 85,
            range: 99,
            pray: 1,
            mage: 1
        },
        MagicSpellbooks.NORMAL,
        true
    )

    public COMBAT_ACTIONS: CombatAction[] = [
        new CombatSwitch(new number[]{ DRAGON_DAGGER_P_PLUS_PLUS_ }) {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                return playerBot.getSpecialPercentage() >= 25 &&
                    enemy.getHitpoints() < 45;
            },
            performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
                if (!playerBot.isSpecialActivated()) {
                    CombatSpecial.activate(playerBot);
                }
                playerBot.getCombat().attack(enemy);
            }
        },
        new CombatSwitch(new int[]{ RUNE_CROSSBOW, DRAGON_BOLTS_E_ }) {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                return enemy.getHitpoints() < 40;
            },
            performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
                playerBot.getCombat().attack(enemy);
            }
        },
        new CombatSwitch(new int[]{ MAGIC_SHORTBOW, RUNE_ARROW }) {
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
    return BOT_DDS_PURE_R_73;
};

getCombatActions(): CombatAction[] {
    return COMBAT_ACTIONS;
}
}