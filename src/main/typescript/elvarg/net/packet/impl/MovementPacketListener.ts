import { Location } from '../model/Location';
import { MovementQueue } from '../model/movement/MovementQueue';
import { PathFinder } from '../model/movement/path/PathFinder';
import { Packet } from '../net/packet/Packet';
import { PacketExecutor } from '../net/packet/PacketExecutor';
import { Player } from '../entity/impl/player/Player';

export class MovementPacketListener implements PacketExecutor {

    private static FLOATING_WORLD_MAP_INTERFACE = 54000;

    execute(player: Player, packet: Packet) {
        if (player.getHitpoints() <= 0) {
            return;
        }

        let mobility = player.getMovementQueue().getMobility();
        if (!mobility.canMove()) {
            mobility.sendMessage(player);
            return;
        }

        let absoluteX = packet.readShort();
        let absoluteY = packet.readShort();
        let plane = packet.readUnsignedByte();

        let destination = new Location(absoluteX, absoluteY, plane);

        if (!player.getMovementQueue().checkDestination(destination)) {
            return;
        }

        if (player.getInterfaceId() != MovementPacketListener.FLOATING_WORLD_MAP_INTERFACE) {
            // Close all interfaces except for floating world map
            player.getPacketSender().sendInterfaceRemoval();
        }

        // Make sure to reset any previous movement steps
        player.getMovementQueue().reset();

        player.getMovementQueue().walkToReset();

        PathFinder.calculateWalkRoute(player, absoluteX, absoluteY);
    }
}
