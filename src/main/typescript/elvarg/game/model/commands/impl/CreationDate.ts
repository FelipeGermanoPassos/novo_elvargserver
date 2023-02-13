import { Player } from '../../../entity/impl/player/Player';
import { Command } from '../../../model/commands/Command';
import * as moment from 'moment';

export class CreationDate implements Command {
    execute(player: Player, command: string, parts: string[]) {
        let creationDate = moment(player.getCreationDate());
        let dateSuffix = this.getDateSuffix(creationDate.date());

        player.forceChat(`I started playing on the ${creationDate.date()}${dateSuffix} of ${creationDate.format('MMMM')}, ${creationDate.year()}!`);
    }

    canUse(player: Player) {
        return true;
    }

    private getDateSuffix(date: number): string {
        switch (date % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    }
}