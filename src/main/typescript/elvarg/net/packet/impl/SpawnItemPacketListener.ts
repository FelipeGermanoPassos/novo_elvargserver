class SpawnItemPacketListener {
    static spawn(player: Player, item: number, amount: number, toBank: boolean) {
    if (amount < 0) {
    return;
    } else if (amount > Number.MAX_SAFE_INTEGER) {
    amount = Number.MAX_SAFE_INTEGER;
    }

    if (player.busy() || player.getArea() instanceof WildernessArea) {
        player.getPacketSender().sendMessage("You cannot do that right now.");
        return;
    }

    let spawnable = GameConstants.ALLOWED_SPAWNS.includes(item);
    let def = ItemDefinition.forId(item);
    if (!def || !spawnable) {
        player.getPacketSender().sendMessage("This item is currently unavailable.");
        return;
    }

    if (toBank) {
        player.getBank(Bank.getTabForItem(player, item)).add(item, amount);
    } else {
        if (amount > player.getInventory().getFreeSlots()) {
            amount = player.getInventory().getFreeSlots();
        }

        if (amount <= 0) {
            player.getInventory().full();
            return;
        }

        player.getInventory().add(item, amount);
    }

    player.getPacketSender().sendMessage(`Spawned ${def.getName()} to ${toBank ? "bank" : "inventory"}.`);
}

execute(player: Player, packet: Packet) {
    let item = packet.readInt();
    let spawnX = packet.readByte() == 1;
    let toBank = packet.readByte() == 1;
    let def = ItemDefinition.forId(item);
    if (!def) {
    player.getPacketSender().sendMessage("This item is currently unavailable.");
    return;
    }
    if (spawnX) {
        player.setEnteredAmountAction((amount) => {
            spawn(player, item, amount, toBank);
        });
        player.getPacketSender().sendEnterAmountPrompt(`How many ${def.getName()} would you like to spawn?`);
    } else {
        spawn(player, item, 1, toBank);
    }
}
}

interface Player {
busy(): boolean;
getArea(): any;
getPacketSender(): any;
getBank(tab: any): any;
getInventory(): any;
}

interface ItemDefinition {
forId(id: number): any;
getName(): string;
}

interface Bank {
getTabForItem(player: Player, item: number): any;
}

interface GameConstants {
ALLOWED_SPAWNS: number[];
}

interface Inventory {
add(item: number, amount: number): void;
getFreeSlots(): number;
full(): void;
}