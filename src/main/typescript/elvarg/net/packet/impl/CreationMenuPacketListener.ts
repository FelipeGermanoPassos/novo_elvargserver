import { Player } from '../../entity/impl/player'

export class CreationMenuPacketListener implements PacketExecutor {
    execute(player: Player, packet: Packet) {
        let itemId = packet.readInt();
        let amount = packet.readUnsignedByte();
        if (player.getCreationMenu() != null) {
            player.getCreationMenu().execute(itemId, amount);
        }
    }
}
