import { ItemIdentifiers } from "../../util/ItemIdentifiers";
import { Player } from "../entity/impl/player/Player";
import { ItemDefinition } from "../definition/ItemDefinition";
const BrokenItems = {
    DRAGON_DEFENDER_BROKEN: [12954, 20463],
    AVERNIC_DEFENDER_BROKEN: [ItemIdentifiers.AVERNIC_DEFENDER, ItemIdentifiers.AVERNIC_DEFENDER_BROKEN_],
    FIRE_CAPE_BROKEN: [6570, 20445],
    INFERNAL_CAPE_BROKEN: [21295, 21287],
    FIGHTER_TORSO_BROKEN: [10551, 20513],
    VOID_KNIGHT_TOP: [8839, 20465],
    VOID_KNIGHT_ROBE: [8840, 20469],
    VOID_KNIGHT_GLOVES: [8842, 20475],
    VOID_KNIGHT_MAGE_HELM: [11663, 20477],
    VOID_KNIGHT_RANGER_HELM: [11664, 20479],
    VOID_KNIGHT_MELEE_HELM: [11665, 20481]
}

class BrokenItem {
    private static readonly REPAIR_COST_MULTIPLIER = 0.03;
    private static brokenItems = new Map<number, BrokenItem>();

    static init() {
        for (const brokenItem of Object.values(BrokenItem)) {
            BrokenItem.brokenItems.set(brokenItem.originalItem, brokenItem);
        }
    }

    private readonly originalItem: number;
    private readonly brokenItem: number;

    constructor(originalItem: number, brokenItem: number) {
        this.originalItem = originalItem;
        this.brokenItem = brokenItem;
    }

    /**
     * Gets the total cost of repairing a player's stuff.
     *
     * @param player
     * @param deleteEmblems
     * @return
     */
    static getRepairCost(player: Player) {
        let cost = 0;
        for (const b of Object.values(BrokenItem)) {
            const amt = player.getInventory().getAmount(b.brokenItem);
            if (amt > 0) {
                cost += ((ItemDefinition.forId(b.originalItem).getBloodMoneyValue() * BrokenItem.REPAIR_COST_MULTIPLIER) * amt);
            }
        }
        return cost;
    }

    public static get(originalId: number): BrokenItem | undefined {
        return BrokenItem.brokenItems.get(originalId);
    }
}
BrokenItem.init();
