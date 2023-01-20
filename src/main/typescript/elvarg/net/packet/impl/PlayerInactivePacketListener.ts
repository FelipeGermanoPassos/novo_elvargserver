import { Player } from './entity/impl/player/Player';
import { Packet } from './packet/Packet';
import { PacketExecutor } from './packet/PacketExecutor';

class PlayerInactivePacketListener implements PacketExecutor {

    execute(player: Player, packet: Packet) {
        //CALLED EVERY 3 MINUTES OF INACTIVITY
    }
}
