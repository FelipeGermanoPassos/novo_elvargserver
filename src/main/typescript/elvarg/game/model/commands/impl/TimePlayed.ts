import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';


class TimePlayed implements Command {
    execute(player: Player, command: string, parts: string[]) {
        player.forceChat(`I've been playing for ${Misc.getFormattedPlayTime(player)}.`);
    }
    canUse(player: Player): boolean {
        return true;
    }
}