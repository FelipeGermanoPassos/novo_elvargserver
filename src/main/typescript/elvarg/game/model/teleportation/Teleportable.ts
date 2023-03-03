import { Location } from "../Location";
import { CastleWars } from "../../content/minigames/impl/CastleWars";
import { TeleportButton } from '../teleportation/TeleportButton'

export class Teleportable {
    const teleportButton5 = new TeleportButton(0);
    const WILDERNESS = this.teleportButton1.WILDERNESS;
    const BOSSES = this.teleportButton1.BOSSES;
    const MINIGAME = this.teleportButton1.MINIGAME;

    readonly EDGEVILLE_DITCH = {
        button: this.WILDERNESS,
        type: 0,
        index: 0,
        position: new Location(3088, 3520)
    }
    readonly WEST_DRAGONS = {
        button: this.WILDERNESS,
        type: 0,
        index: 1,
        position: new Location(2979, 3592)
    }
    readonly EAST_DRAGONS = {
        button: this.WILDERNESS,
        type: 0,
        index: 2,
        position: new Location(3356, 3675)
    }
    readonly KING_BLACK_DRAGON = {
        button: this.BOSSES,
        type: 2,
        index: 1,
        position: new Location(3005, 3850)
    }
    readonly CHAOS_ELEMENTAL = {
        button: this.BOSSES,
        type: 2,
        index: 2,
        position: new Location(3267, 3916)
    }
    readonly ELDER_CHAOS_DRUID = {
        button: this.BOSSES,
        type: 2,
        index: 3,
        position: new Location(3236, 3636)
    }
    readonly CRAZY_ARCHAEOLOGIST = {
        button: this.BOSSES,
        type: 2,
        index: 4,
        position: new Location(2980, 3708)
    }
    readonly CHAOS_FANATIC = {
        button: this.BOSSES,
        type: 2,
        index: 5,
        position: new Location(2986, 3838)
    }
    readonly VENENATIS = {
        button: this.BOSSES,
        type: 2,
        index: 6,
        position: new Location(3346, 3727)
    }
    readonly VET_ION = {
        button: this.BOSSES,
        type: 2,
        index: 7,
        position: new Location(3187, 3787)
    }
    readonly CALLISTO = {
        button: this.BOSSES,
        type: 2,
        index: 8,
        position: new Location(3312, 3830)
    }
    readonly DUEL_ARENA = {
        button : this.MINIGAME,
        type: 1,
        index: 0,
        position: new Location(3370, 3270)
    }

    readonly BARROWS = {
        button: this.MINIGAME,
        type: 1,
        index: 1,
        position: new Location(3565, 3313)
    }
    readonly FIGHT_CAVES = {
        button: this.MINIGAME,
        type: 1,
        index: 2,
        position: new Location(2439, 5171)
    }
    readonly CASTLE_WARS = { 
        button: this.MINIGAME,
        type: 1,
        index: 3,
        position: CastleWars.LOBBY_TELEPORT
    }

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