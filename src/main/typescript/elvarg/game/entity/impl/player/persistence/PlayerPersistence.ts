abstract class PlayerPersistence {
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
