export const chatRank = {
    FRIEND: -1,
    RECRUIT: 0,
    CORPORAL: 1,
    SERGEANT: 2,
    LIEUTENANT: 3,
    CAPTAIN: 4,
    GENERAL: 5,
    OWNER: -1,
    STAFF: -1,
}

export class ClanChatRank {
    private readonly actionMenuId: any;
    private readonly spriteId: any;

    constructor(actionMenuId: any, spriteId: any) {
        this.actionMenuId = actionMenuId;
        this.spriteId = spriteId;
    }

    public static forId(id: any) {
        for (const rank in chatRank) {
            if (chatRank[rank] === id) {
                return rank;
            }
        }
        return null;
    }

    public static forMenuId(id: number) {
        for (let rank in chatRank) {
            if (chatRank[rank].actionMenuId === id) {
                return rank;
            }
        }
        return null;
    }

    public getSpriteId(): number {
        return this.spriteId;
    }
}
