class NetworkConstants {
    public static readonly GAME_PORT: number = 43595;
    public static readonly LOGIN_REQUEST_OPCODE: number = 14;
    public static readonly NEW_CONNECTION_OPCODE: number = 16;
    public static readonly RECONNECTION_OPCODE: number = 18;
    public static readonly SESSION_TIMEOUT: number = 15;
    public static readonly RSA_MODULUS: bigint = new BigInteger("131409501542646890473421187351592645202876910715283031445708554322032707707649791604685616593680318619733794036379235220188001221437267862925531863675607742394687835827374685954437825783807190283337943749605737918856262761566146702087468587898515768996741636870321689974105378482179138088453912399137944888201");
    public static readonly RSA_EXPONENT: bigint = new BigInteger("79304472214370922762932105237390187381463672363705375233978043425709379778525976284494572865658334707555904114207777777341892920168231399767577257735843278036440634354404060637137311110371217284157987350293683059890663583033195388794460636931915044283757261183264988297579912358758185856341914846035938600173"); //TODO: Ver classe math.bigint do java
    public static readonly CONNECTION_LIMIT: number = 2;
    public static readonly SESSION_KEY: string = "session.key";
    public static readonly PACKET_PROCESS_LIMIT: number = 30;
}
