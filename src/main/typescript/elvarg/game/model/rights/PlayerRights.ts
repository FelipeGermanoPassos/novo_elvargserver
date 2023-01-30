export enum PlayerRights {
    NONE = -1,
    MODERATOR = 618,
    ADMINISTRATOR = 619,
    OWNER = 620,
    DEVELOPER = 621
    private spriteId: number;
    private yellTag: string;
    constructor(spriteId: number, yellTag: string) {
        this.spriteId = spriteId;
        this.yellTag = yellTag;
    }
getSpriteId() {
    return this.spriteId;
}
getYellTag() {
    return this.yellTag;
}
    }