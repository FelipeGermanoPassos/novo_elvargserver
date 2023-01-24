const chatRank = {
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


class ClanChatRank {
    private readonly actionMenuId: number;
    private readonly spriteId: number;

    public static forId(id: number) {
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
