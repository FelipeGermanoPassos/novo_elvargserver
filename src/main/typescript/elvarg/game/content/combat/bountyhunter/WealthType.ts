enum WealthType {
    NO_TARGET = { tooltip: "N/A", configId: 876 },
    VERY_LOW = { tooltip: "V. Low", configId: 877 },
    LOW = { tooltip: "Low", configId: 878 },
    MEDIUM = { tooltip: "Medium", configId: 879 },
    HIGH = { tooltip: "High", configId: 880 },
    VERY_HIGH = { tooltip: "V. High", configId: 881 }
}

static getWealth(player: Player): WealthType {
    let wealth = 0;

    const items = [...player.getInventory().getItems(), ...player.getEquipment().getItems()];
    for (const item of items) {
        if (item == null || item.getId() <= 0 || item.getAmount() <= 0 || !item.getDefinition().isDropable() || !item.getDefinition().isTradeable()) {
            continue;
        }
        wealth += item.getDefinition().getValue();
    }
    let type = WealthType.VERY_LOW;
    if (wealth >= Emblem.MYSTERIOUS_EMBLEM_1.value) {
        type = WealthType.LOW;
    }
    if (wealth >= Emblem.MYSTERIOUS_EMBLEM_3.value) {
        type = WealthType.MEDIUM;
    }
    if (wealth >= Emblem.MYSTERIOUS_EMBLEM_6.value) {
        type = WealthType.HIGH;
    }
    if (wealth >= Emblem.MYSTERIOUS_EMBLEM_9.value) {
        type = WealthType.VERY_HIGH;
    }
    return type;
}
