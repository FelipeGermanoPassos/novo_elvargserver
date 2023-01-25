class TeleportPacketListener implements PacketExecutor {
    execute(player: Player, packet: Packet) {
    if (player.getHitpoints() <= 0)
    return;
    let type = packet.readByte();
    let index = packet.readByte();
    if (!player.isTeleportInterfaceOpen()) {
        player.getPacketSender().sendInterfaceRemoval();
        return;
    }

    if (player.getRights() == PlayerRights.DEVELOPER) {
        player.getPacketSender().sendMessage(
            `Selected a teleport. Type: ${type}, index: ${index}.`);
    }

    for (let teleport of Teleportable.values()) {
        if (teleport.getType() == type && teleport.getIndex() == index) {
            let teleportPosition = teleport.getPosition();
            if (TeleportHandler.checkReqs(player, teleportPosition)) {
                player.getPreviousTeleports().set(teleport.getTeleportButton(), teleportPosition);
                TeleportHandler.teleport(player, teleportPosition, player.getSpellbook().getTeleportType(), true);
            }
            break;
        }
    }
}

}

interface PacketExecutor {
execute(player: Player, packet: Packet): void;
}

interface Player {
getHitpoints(): number;
isTeleportInterfaceOpen(): boolean;
getPacketSender(): any;
getRights(): PlayerRights;
getPreviousTeleports(): Map<number, Location>;
getSpellbook(): any;
}

interface Packet {
readByte(): number;
}

enum PlayerRights {
DEVELOPER = 2
}

interface Teleportable {
getType(): number;
getIndex(): number;
}