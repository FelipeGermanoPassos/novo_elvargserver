import { Player } from '../../../entity/impl/player/Player';
import { Emblem } from './Emblem';

const wealthTypes = {
    NO_TARGET: { tooltip: "N/A", configId: 876 },
    VERY_LOW: { tooltip: "V. Low", configId: 877 },
    LOW: { tooltip: "Low", configId: 878 },
    MEDIUM: { tooltip: "Medium", configId: 879 },
    HIGH: { tooltip: "High", configId: 880 },
    VERY_HIGH: { tooltip: "V. High", configId: 881 }
}

export class WealthType {
    static getWealth(player: Player) {
        let wealth = 0;

        const items = [...player.getInventory().getItems(), ...player.getEquipment().getItems()];
        for (const item of items) {
            if (item == null || item.getId() <= 0 || item.getAmount() <= 0 || !item.getDefinition().isDropable() || !item.getDefinition().isTradeable()) {
                continue;
            }
            wealth += item.getDefinition().getValue();
        }
        let type = wealthTypes.VERY_LOW;
        const emblem = Emblem.find((e) => wealth >= e.value);
        if (emblem) {
        if (emblem === Emblem[5]) {
            type = wealthTypes.HIGH;
        } else if (emblem === Emblem[8]) {
            type = wealthTypes.VERY_HIGH;
        } else {
            type = wealthTypes.LOW;
        }
        }
        return type;
    }
}
