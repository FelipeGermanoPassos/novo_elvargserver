class SwitchItemSlotPacketListener implements PacketExecutor {
    execute(player: Player, packet: Packet) {
    if (player.getHitpoints() <= 0)
    return;
    let interfaceId = packet.readInt();
    packet.readByteC();
    let fromSlot = packet.readLEShortA();
    let toSlot = packet.readLEShort();
    if (player == null || player.getHitpoints() <= 0) {
        return;
    }

    if (interfaceId >= Bank.CONTAINER_START && interfaceId < Bank.CONTAINER_START + Bank.TOTAL_BANK_TABS) {
        let tab = player.isSearchingBank() ? Bank.BANK_SEARCH_TAB_INDEX : interfaceId - Bank.CONTAINER_START;
        if (fromSlot >= 0 && fromSlot < player.getBank(tab).capacity() && toSlot >= 0 && toSlot < player.getBank(tab).capacity() && toSlot != fromSlot) {
            Bank.rearrange(player, player.getBank(tab), fromSlot, toSlot);
        }
        return;
    }

    switch (interfaceId) {
        case Inventory.INTERFACE_ID:
        case Bank.INVENTORY_INTERFACE_ID:
            if (fromSlot >= 0 && fromSlot < player.getInventory().capacity() && toSlot >= 0 && toSlot < player.getInventory().capacity() && toSlot != fromSlot) {
                player.getInventory().swap(fromSlot, toSlot).refreshItems();
            }
            break;
    }
}
}

interface PacketExecutor {
execute(player: Player, packet: Packet): void;
}

interface Player {
getHitpoints(): number;
isSearchingBank(): boolean;
getBank(tab: number): any;
getInventory(): any;
}

interface Packet {
readInt(): number;
readByteC(): number;
readLEShortA(): number;
readLEShort(): number;
}

interface Bank {
static CONTAINER_START: number;
static TOTAL_BANK_TABS: number;
static BANK_SEARCH_TAB_INDEX: number;
static INVENTORY_INTERFACE_ID: number;
static rearrange(player: Player, bank: any, fromSlot: number, toSlot: number): void;
}

interface Inventory {
swap(fromSlot: number, toSlot: number): any;
refreshItems(): void;
capacity(): number;
}
