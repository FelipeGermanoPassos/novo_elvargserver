enum Team {
    ZAMORAK = "ZAMORAK",
    SARADOMIN = "SARADOMIN",
    GUTHIX = "GUTHIX",
    area = Area,
    waitingRoom = Location,
    score = number,
    players = Player[],
    respawn_area_bounds = Boundary;
}

export class CastleWars implements Minigame {
    public static readonly CastleWarsSaradominWaitingArea SARADOMIN_WAITING_AREA = new CastleWarsSaradominWaitingArea();
    public static readonly CastleWarsZamorakWaitingArea ZAMORAK_WAITING_AREA = new CastleWarsZamorakWaitingArea();
    public static readonly CastleWarsGameArea GAME_AREA = new CastleWarsGameArea();
    public static readonly CastleWarsLobbyArea LOBBY_AREA = new CastleWarsLobbyArea();

    public static handleItemOnPlayer(player: Player, target: Player, item: Item) {
        if (item.getId() !== BANDAGES)
            return false;
        if (Team.getTeamForPlayer(player) !== Team.getTeamForPlayer(target)) {
            player.getPacketSender().sendMessage("You don't want to be healing your enemies!");
            return true;
        }
        healWithBandage(target, false);
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