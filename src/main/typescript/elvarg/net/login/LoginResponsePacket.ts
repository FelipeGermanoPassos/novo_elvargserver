class LoginResponsePacket {
    private readonly response: number;
    private readonly rights: PlayerRights; //TODO: Importar PlayerRights

    constructor(response: number, rights: PlayerRights) {
        this.response = response;
        if(!rights) {
            this.rights = PlayerRights.NONE;
        } else {
            this.rights = rights;
        }
    }


    public getResponse(): number {
        return this.response;
    }

    public getRights(): PlayerRights {
        return this.rights;
    }
}
