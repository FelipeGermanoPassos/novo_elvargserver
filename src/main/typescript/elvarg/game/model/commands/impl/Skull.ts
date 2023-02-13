import { Command } from "../Command";
import { CombatFactory } from "../../../content/combat/CombatFactory";
import { Player } from "../../../entity/impl/player/Player";
import { SkullType, SkullTypes } from "caminho/para/a/classe/SkullType";

class Skull implements Command {
    execute(player: Player, command: string, parts: string[]): void {
        if (CombatFactory.inCombat(player)) {
            player.getPacketSender().sendMessage("You cannot change that during combat!");
            return;
        }
        if (parts[0].includes("red")) {
            CombatFactory.skull(player, SkullTypes.RED_SKULL, (60 * 30)); // Should be 30 mins
        } else {
            CombatFactory.skull(player, SkullTypes.WHITE_SKULL, 300); // Should be 5 mins
        }
    }

    canUse(player: Player): boolean {
        return true;
    }
}