import * as crypto from 'crypto-js';

class PasswordUtil {
    private static PBKDF2_ITERATIONS = 5000;
    private static PBKDF2_KEY_LENGTH = 512;

    public static generatePasswordHashWithSalt(password: string): string {
        const salt = crypto.lib.WordArray.random(128/8);
        const passwordHash = crypto.PBKDF2(password, salt, { keySize: this.PBKDF2_KEY_LENGTH/32, iterations: this.PBKDF2_ITERATIONS });

        return crypto.enc.Base64.stringify(salt) + ':' + crypto.enc.Base64.stringify(passwordHash);
    }

    public static passwordsMatch(plainTextPassword: string, passwordHashWithSalt: string): boolean {
        const parts = passwordHashWithSalt.split(':');

        const salt = crypto.enc.Base64.parse(parts[0]);
        const passwordHash = crypto.enc.Base64.parse(parts[1]);

        return crypto.PBKDF2(plainTextPassword, salt, { keySize: this.PBKDF2_KEY_LENGTH/32, iterations: this.PBKDF2_ITERATIONS }).toString() === passwordHash.toString();
    }
}