import * as Player from '../Player';
import * as LoginDetailsMessage from '../../../../../net/login/LoginDetailsMessage';
import * as LoginResponses from '../../../../../net/login/LoginResponses';
import * as DiscordUtil from '../../../../../util/DiscordUtil';
import * as PasswordUtil from '../../../../../util/PasswordUtil';


export class PlayerPersistence {
    const Player = new Player();
    public abstract load(username: string);

    public abstract save(player: Player): void;

    public abstract exists(username: string): boolean;

    public encryptPassword(plainPassword: string): string {
        return PasswordUtil.generatePasswordHashWithSalt(plainPassword);
    }

    public checkPassword(password: string, playerSave: PlayerSave): boolean {
        const passwordHashWithSalt: string = playerSave.getPasswordHashWithSalt();
        return PasswordUtil.passwordsMatch(password, passwordHashWithSalt);
    }
}