enum Teleportable {
    EDGEVILLE_DITCH = {
        button: TeleportButton.WILDERNESS,
        type: 0,
        index: 0,
        position: new Location(3088, 3520)
    },
    WEST_DRAGONS = {
        button: TeleportButton.WILDERNESS,
        type: 0,
        index: 1,
        position: new Location(2979, 3592)
    },
    EAST_DRAGONS = {
        button: TeleportButton.WILDERNESS,
        type: 0,
        index: 2,
        position: new Location(3356, 3675)
    },
    KING_BLACK_DRAGON = {
        button: TeleportButton.BOSSES,
        type: 2,
        index: 1,
        position: new Location(3005, 3850)
    },
    CHAOS_ELEMENTAL = {
        button: TeleportButton.BOSSES,
        type: 2,
        index: 2,
        position: new Location(3267, 3916)
    },
    ELDER_CHAOS_DRUID = {
        button: TeleportButton.BOSSES,
        type: 2,
        index: 3,
        position: new Location(3236, 3636)
    },
    CRAZY_ARCHAEOLOGIST = {
        button: TeleportButton.BOSSES,
        type: 2,
        index: 4,
        position: new Location(2980, 3708)
    },
    CHAOS_FANATIC = {
        button: TeleportButton.BOSSES,
        type: 2,
        index: 5,
        position: new Location(2986, 3838)
    },
    VENENATIS = {
        button: TeleportButton.BOSSES,
        type: 2,
        index: 6,
        position: new Location(3346, 3727)
    },
    VET_ION = {
        button: TeleportButton.BOSSES,
        type: 2,
        index: 7,
        position: new Location(3187, 3787)
    },
    CALLISTO = {
        button: TeleportButton.BOSSES,
        type: 2,
        index: 8,
        position: new Location(3312, 3830)
    },
    DUEL_ARENA = {
        button: TeleportButton.MINIGAME,
        type: 1,
        index: 0,
        position: new Location(3370, 3270)
    },
    BARROWS = {
        button: TeleportButton.MINIGAME,
        type: 1,
        index: 1,
        position: new Location(3565, 3313)
    },
    FIGHT_CAVES = {
        button: TeleportButton.MINIGAME,
        type: 1,
        index: 2,
        position: new Location(2439, 5171)
    },
    CASTLE_WARS = {
        button: TeleportButton.MINIGAME,
        type: 1,
        index: 3,
        position: CastleWars.LOBBY_TELEPORT
    },

    private teleportButton: TeleportButton;
    private type: number;
    private index: number;
    private position: Location;

    constructor(teleportButton: TeleportButton, type: number, index: number, position: Location) {
        this.teleportButton = teleportButton;
        this.type = type;
        this.index = index;
        this.position = position;
    }

public getTeleportButton(): TeleportButton {
    return this.teleportButton;
}

public getType(): number {
    return this.type;
}

public getIndex(): number {
    return this.index;
}

public getPosition(): Location {
    return this.position;
}
}