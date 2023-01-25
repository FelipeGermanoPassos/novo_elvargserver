import { Player } from "../../entity/impl/player/Player";
import { Command } from "../../model/commands/Command";
import { CommandManager } from "../../model/commands/CommandManager";
import { Packet } from "../../net/packet/Packet";
import { PacketExecutor } from "../../net/packet/PacketExecutor";

export class CommandPacketListener implements PacketExecutor {
    public static readonly OP_CODE = 103;

    execute(player: Player, packet: Packet) {
        if (player.getHitpoints() <= 0) {
            return;
        }
        let command = packet.readString();
        let parts = command.split(" ");
        parts[0] = parts[0].toLowerCase();

        let c: Command | undefined = CommandManager.commands.get(parts[0]);
        if (c) {
            if (c.canUse(player)) {
                c.execute(player, command, parts);
            } else {
                // do something if player can't use command
            }
        } else {
            player.getPacketSender().sendMessage("This command does not exist.");
        }
    }
}
