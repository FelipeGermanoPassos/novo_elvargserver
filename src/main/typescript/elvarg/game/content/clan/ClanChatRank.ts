enum ClanChatRank {
    FRIEND = -1,
    RECRUIT = 0,
    CORPORAL = 1,
    SERGEANT = 2,
    LIEUTENANT = 3,
    CAPTAIN = 4,
    GENERAL = 5,
    OWNER = -1,
    STAFF = -1,
}

class ClanChatRank {
    private readonly actionMenuId: number;
    private readonly spriteId: number;

    constructor(actionMenuId: number, spriteId: number) {
        this.actionMenuId = actionMenuId;
        this.spriteId = spriteId;
    }

    public static forId(id: number): ClanChatRank {
        for (let rank in ClanChatRank) {
            if (ClanChatRank[rank] === id) {
                return rank;
            }
        }
        return null;
    }

    public static forMenuId(id: number): ClanChatRank {
        for (let rank in ClanChatRank) {
            if (ClanChatRank[rank].actionMenuId === id) {
                return rank;
            }
        }
        return null;
    }

    public getSpriteId(): number {
        return this.spriteId;
    }
}
