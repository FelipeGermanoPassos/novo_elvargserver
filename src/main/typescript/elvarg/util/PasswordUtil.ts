export class PasswordUtil {
    private static pbkdf2 = PBKDF2Function.getInstance(Hmac.SHA512, 5000, 512);

    public static generatePasswordHashWithSalt(password: string): string {
        const hash = Password.hash(password).addRandomSalt().with(this.pbkdf2);

        return this.toBase64(hash.getSalt()) + ":" + this.toBase64(hash.getResult());
    }

    public static passwordsMatch(plainTextPassword: string, passwordHashWithSalt: string): boolean {
        const parts = passwordHashWithSalt.split(":");

        const salt = this.fromBase64(parts[0]);
        const passwordHash = this.fromBase64(parts[1]);

        return Password.check(plainTextPassword, passwordHash).addSalt(salt).with(this.pbkdf2);
    }

    private static toBase64(s: string): string {
        return btoa(s);
    }

    private static fromBase64(s: string): string {
        return atob(s);
    }
}
