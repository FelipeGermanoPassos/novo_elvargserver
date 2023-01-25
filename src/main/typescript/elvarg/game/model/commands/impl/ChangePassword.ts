import {Player} from '../../../entity/impl/player/Player';
import {Command} from '../../../model/commands/Command';
import {PasswordUtil} from '../../../../util/PasswordUtil';

class ChangePassword implements Command {
    execute(player: Player, command: string, parts: string[]): void {
        // Known exploit
        if (command.includes("\r") || command.includes("\n")) {
            return;
        }

        let pass = command.substring(parts[0].length + 1);
        if (pass.length > 3 && pass.length < 20) {
            player.setPasswordHashWithSalt(PasswordUtil.generatePasswordHashWithSalt(pass));
            player.getPacketSender().sendMessage("Your password is now: " + pass);
        } else {
            player.getPacketSender().sendMessage("Invalid password input.");
        }
    }

    canUse(player: Player): boolean {
        return true;
    }
}