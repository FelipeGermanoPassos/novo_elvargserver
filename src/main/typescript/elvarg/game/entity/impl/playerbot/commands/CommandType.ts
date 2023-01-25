export enum CommandType {
    PUBLIC_CHAT = "public chat",
    PRIVATE_CHAT = "private chat",
    CLAN_CHAT = "clan chat",

    getLabel(): string {
        return this.label;
    }
    }