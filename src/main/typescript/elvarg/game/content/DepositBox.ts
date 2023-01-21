interface DepositBox {
    static readonly INTERFACE_ID: number = 4465;
    static open(player: Player): void;
    static refresh(player: Player): void;
    static deposit(player: Player, slotId: number, itemId: number, amount: number): void;
}

DepositBox.open = (player: Player) => {
    player.getPacketSender().sendInterface(DepositBox.INTERFACE_ID);
    DepositBox.refresh(player);
}

DepositBox.refresh = (player: Player) => {
    player.getPacketSender().clearItemOnInterface(7423);
    player.getPacketSender().sendItemContainer(player.getInventory(), 7423);
    player.getPacketSender().sendInterfaceSet(4465, 192);
}

DepositBox.deposit = (player: Player, slotId: number, itemId: number, amount: number) => {
    const inventoryItem = player.getInventory().forSlot(slotId);

    if (inventoryItem == null) {
        return;
    }

    if (player.getInventory().getAmount(itemId) < amount) {
        amount = player.getInventory().getAmount(itemId);
    }

    const itemForSlot = inventoryItem.getId();

    if (itemForSlot != itemId) {
        return;
    }

    if (amount <= 0) {
        return;
    }

    Bank.deposit(player, itemId, slotId, amount);
    DepositBox.refresh(player);
}    