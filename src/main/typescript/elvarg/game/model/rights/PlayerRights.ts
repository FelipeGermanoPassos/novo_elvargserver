export class PlayerRights {
    public static NONE = new PlayerRights(-1, "")
    public static MODERATOR = 618
    public static ADMINISTRATOR = 619
    public static OWNER = 620
    public static DEVELOPER = 621

    private spriteId: number;
    private yellTag: string;
    constructor(spriteId: number, yellTag: string) {
        this.spriteId = spriteId;
        this.yellTag = yellTag;
    }
    public getSpriteId() {
        return this.spriteId;
    }
    public getYellTag() {
        return this.yellTag;
    }
}