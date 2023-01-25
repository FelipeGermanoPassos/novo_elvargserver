import { Player } from "com.elvarg.game.entity.impl.player"
import { Packet } from "com.elvarg.net.packet"

export class FinalizedMapRegionChangePacketListener implements PacketExecutor {
    execute(player: Player, packet: Packet): void {
    }
}