<<<<<<< Updated upstream
class Store implements Command {
=======
import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';


export class Store implements Command {
>>>>>>> Stashed changes
    execute(player: Player, command: string, parts: string[]) {
    player.getPacketSender().sendURL("http://www.deadlypkers.net");
    }
    canUse(player: Player): boolean {
    return true;
    }
}