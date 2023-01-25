import { Player } from "../Player";
import { LoginDetailsMessage } from "../../../../../net/login/LoginDetailsMessage"
import { LoginResponses } from "../../../../../net/login/LoginResponses"
import { DiscordUtil } from "../../../../../util/DiscordUtil"
import { PasswordUtil } from "../../../../../util/PasswordUtil"
import { PlayerSave } from "../persistence/PlayerSave"



export abstract class PlayerPersistence {
    abstract load(username: string): PlayerSave;
    abstract save(player: Player): void;
    abstract exists(username: string): boolean;

    public encryptPassword(plainPassword: string): string {
        return PasswordUtil.generatePasswordHashWithSalt(plainPassword);
    }

    public checkPassword(password: string, playerSave: PlayerSave): boolean {
        let passwordHashWithSalt = playerSave.getPasswordHashWithSalt();
        return PasswordUtil.passwordsMatch(password, passwordHashWithSalt);
    }
}
