<<<<<<< Updated upstream
class Kdr implements Command {
=======
import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';


export class Kdr implements Command {
>>>>>>> Stashed changes
    execute(player: Player, command: string, parts: string[]) {
    player.forceChat("I currently have " + player.getKillDeathRatio() + " kdr!");
    }
    canUse(player: Player) {
    return true;
    }
}