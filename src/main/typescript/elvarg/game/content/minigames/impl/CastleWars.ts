import { Area } from "../../../model/areas/Area";
import { Player } from "../../../entity/impl/player/Player";
import { Location } from "../../../model/Location";
import { Skill } from "../../../model/Skill";
import { CastleWarsSaradominWaitingArea } from '../../../model/areas/impl/castlewars/CastleWarsSaradominWaitingArea'
import { CastleWarsZamorakWaitingArea } from '../../../model/areas/impl/castlewars/CastleWarsZamorakWaitingArea'
import { CastleWarsGameArea } from '../../../model/areas/impl/castlewars/CastleWarsGameArea'
import { CastleWarsLobbyArea } from '../../../model/areas/impl/castlewars/CastleWarsLobbyArea'
import { Item } from "../../../model/Item";
import { Boundary } from "../../../model/Boundary";
import { Minigame } from "../Minigame";
import { GameObject } from "../../../entity/impl/object/GameObject";
import { ItemIdentifiers } from "../../../../util/ItemIdentifiers";

export class CastleWars implements Minigame {
    firstClickObject(player: Player, object: GameObject): boolean {
    }
    handleButtonClick(player: Player, button: number): boolean {
    }
    process(): void {
    }
    public static readonly SARADOMIN_WAITING_AREA = new CastleWarsSaradominWaitingArea();
    public static readonly ZAMORAK_WAITING_AREA = new CastleWarsZamorakWaitingArea();
    public static readonly GAME_AREA = new CastleWarsGameArea();
    public static readonly LOBBY_AREA = new CastleWarsLobbyArea();
    public static readonly LOBBY_TELEPORT: Location = new Location(2440, 3089, 0);

    public static handleItemOnPlayer(player: Player, target: Player, item: Item) {
        if (item.getId() !== ItemIdentifiers.BANDAGES)
            return false;
        if (this.getTeamForPlayer(player) !== this.getTeamForPlayer(target)) {
            player.getPacketSender().sendMessage("You don't want to be healing your enemies!");
            return true;
        }
        CastleWars.healWithBandage(target, false);
        return true;
    }

    private static healWithBandage(player: Player, use: boolean) {
        let bracelet = player.getEquipment().hasCastleWarsBracelet();
        let maxHP = player.getSkillManager().getMaxLevel(Skill.HITPOINTS);
        let hp = (int) Math.floor(maxHP * (bracelet ? 1.60 : 1.1));
        player.heal(hp);
    }

    Team(area?: Area, waitingRoom?: Location, respawn_area_bounds?: Boundary) {
        this.players = [];
        if (area) {
            this.area = area;
            this.waitingRoom = waitingRoom;
            this.score = 0;
            this.respawn_area_bounds = respawn_area_bounds;
        }
    }

    addPlayer(player: Player) {
        this.players.push(player);
    }

    static removePlayer(player: Player) {
        if (Team.ZAMORAK.players.includes(player)) {
            Team.ZAMORAK.players.splice(Team.ZAMORAK.players.indexOf(player), 1);
        }
        if (Team.SARADOMIN.players.includes(player)) {
            Team.SARADOMIN.players.splice(Team.SARADOMIN.players.indexOf(player), 1);
        }
    }

    getPlayers() {
        return this.players;
    }

    public getWaitingPlayers(): number {
        return this.area.getPlayers().length;
    }

    public getWaitingRoom(): Location {
        return this.waitingRoom;
    }

    public getScore(): number {
        return this.score;
    }

    public incrementScore(): void {
        this.score++;
    }

    public static resetTeams(): void {
        Team.ZAMORAK.score = 0;
        Team.SARADOMIN.score = 0;
        Team.ZAMORAK.players = [];
        Team.SARADOMIN.players = [];
    }

    public static getTeamForPlayer(player: Player): Team | null {
        if (Team.SARADOMIN.players.includes(player)) {
            return Team.SARADOMIN;
        }
        if (Team.ZAMORAK.players.includes(player)) {
            return Team.ZAMORAK;
        }
        return null;
    }
}

export class Team {
    public static readonly ZAMORAK = new Team(CastleWars.ZAMORAK_WAITING_AREA, new Location(2421, 9524), new Boundary(2368, 2376, 3127, 3135, 1));
    public static readonly SARADOMIN = new Team(CastleWars.SARADOMIN_WAITING_AREA, new Location(2381, 9489), new Boundary(2423, 2431, 3072, 3080, 1));
    public static readonly GUTHIX;

    public area: Area;
    public waitingRoom: Location;
    public score: number;
    public players: Player[];

    public respawn_area_bounds: Boundary;

constructor(area: Area, waitingRoom: Location, respawn_area_bounds: Boundary) {
    this.area = area;
    this.waitingRoom = waitingRoom;
    this.score = 0;
    this.players = [];
    this.respawn_area_bounds = respawn_area_bounds;
    }

public addPlayer(player: Player): void {
   this.players.push(player);
}

/**
 * Method to remove a player from whichever team they're on
 *
 * @param player
 */
public static removePlayer(player: Player): void {
    if (Team.ZAMORAK.players.includes(player)) {
        Team.ZAMORAK.players.splice(Team.ZAMORAK.players.indexOf(player), 1);
    }

    if (Team.SARADOMIN.players.includes(player)) {
        Team.SARADOMIN.players.splice(Team.SARADOMIN.players.indexOf(player), 1);
    }
}

public getPlayers(): Player[] {
    return this.players;
    }
    
    public getWaitingPlayers(): number {
    return this.area.getPlayers().length;
    }
    
    public getWaitingRoom(): Location {
    return this.waitingRoom;
    }
    
    public getScore(): number {
    return this.score;
    }
    
    public incrementScore(): void {
    this.score++;
}

public static resetTeams(): void {
    Team.ZAMORAK.score = 0;
    Team.SARADOMIN.score = 0;

    Team.ZAMORAK.players = [];
    Team.SARADOMIN.players = [];
}

/**
 * This method is used to get the teamNumber of a certain player
 *
 * @param player
 * @return
 */
public static getTeamForPlayer(player: Player): Team | null {
    if (Team.SARADOMIN.getPlayers().includes(player)) {
        return Team.SARADOMIN;
    }

    if (Team.ZAMORAK.getPlayers().includes(player)) {
        return Team.ZAMORAK;
    }

    return null;
}
}