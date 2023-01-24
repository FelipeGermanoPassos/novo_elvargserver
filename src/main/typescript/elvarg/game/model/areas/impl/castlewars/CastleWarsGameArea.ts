class CastleWarsGameArea extends Area {
    private static DUNGEON_BOUNDARIES: Boundary[] = [
        new Boundary(2365, 2404, 9500, 9530),
        new Boundary(2394, 2431, 9474, 9499),
        new Boundary(2405, 2424, 9500, 9509)
    ];

    private static GAME_SURFACE_BOUNDARY = new PolygonalBoundary(
        [
            [2377, 3079],
            [2368, 3079],
            [2368, 3136],
            [2416, 3136],
            [2432, 3120],
            [2432, 3080],
            [2432, 3072],
            [2384, 3072]
        ]
    );

    constructor() {
        // Merge the Dungeon boundaries and the game surface area polygonal boundary
        super(DUNGEON_BOUNDARIES.concat(GAME_SURFACE_BOUNDARY));
    }

    public getName(): string {
        return "the Castle Wars Minigame";
    }

    public process(character: Mobile): void {
        const player = character.getAsPlayer();
        if (!player) {
            return;
        }

        let config;
        player.getPacketSender().sendWalkableInterface(11146);
        player.getPacketSender().sendString("Zamorak = " + CastleWars.Team.ZAMORAK.getScore(), 11147);
        player.getPacketSender().sendString(CastleWars.Team.SARADOMIN.getScore() + " = Saradomin", 11148);
        player.getPacketSender().sendString(CastleWars.START_GAME_TASK.getRemainingTicks() + " ticks", 11155);
        config = 2097152 * CastleWars.saraFlag;
        player.getPacketSender().sendToggle(378, config);
        config = 2097152 * CastleWars.zammyFlag; // flags 0 = safe 1 = taken 2 = dropped
        player.getPacketSender().sendToggle(377, config);
    }

    @Override
    public postLeave(character: Mobile, logout: boolean): void {
        const player = character.getAsPlayer();
        if (!player) {
            return;
        }

        CastleWars.Team.removePlayer(player);

        if (getPlayers().size < 2 || (CastleWars.Team.ZAMORAK.getPlayers().size === 0 ||
            CastleWars.Team.SARADOMIN.getPlayers().size === 0)) {
        // If either team has no players left, the game must end
            CastleWars.endGame();
        }

        if (logout) {
        // Player has logged out, teleport them to the lobby
            player.moveTo(new Location(2439 + Misc.random(4), 3085 + Misc.random(5), 0));
        }

        // Remove items
        CastleWars.deleteGameItems(player);

        // Remove the cape
        player.getEquipment().setItem(Equipment.CAPE_SLOT, Equipment.NO_ITEM);
        player.getEquipment().refreshItems();
        player.getUpdateFlag().flag(Flag.APPEARANCE);

        // Remove the interface
        player.getPacketSender().sendWalkableInterface(-1);
        player.getPacketSender().sendEntityHintRemoval(true);
    }

    @Override
    public canPlayerBotIdle(playerBot: PlayerBot): boolean {
        // Allow Player Bots to idle here
        return true;
    }

    @Override
    public canEquipItem(player: Player, slot: number, item: Item): boolean {
        if (slot === Equipment.CAPE_SLOT || slot === Equipment.HEAD_SLOT) {
            player.getPacketSender().sendMessage("You can't remove your team's colours.");
            return false;
        }

        return true;
    }

    canUnequipItem(player: any, slot: number, item: any) {
        if (slot == Equipment.CAPE_SLOT || slot == Equipment.HEAD_SLOT) {
        player.getPacketSender().sendMessage("You can't remove your team's colours.");
        return false;
        }
            return true;
        }
        
    handleObjectClick(player: any, objectId: number, type: number) {
        switch (objectId) {
            case PORTAL_10:// Portals in team respawn room
            case PORTAL_11:
                player.moveTo(new Loc ation(2440, 3089, 0));
                player.getPacketSender().sendMessage("The Castle Wars game has ended for you!");
                return true;
    
            case SARADOMIN_STANDARD_2:
            case 4377:
                let team = CastleWars.Team.getTeamForPlayer(player);
                if (team == null) {
                    return true;
                }
    
        switch (team) {
            case CastleWars.Team.SARADOMIN:
            CastleWars.returnFlag(player, player.getEquipment().getSlot(Equipment.WEAPON_SLOT));
            return true;
            case CastleWars.Team.ZAMORAK:
            CastleWars.captureFlag(player, team);
            return true;
        }
        return true;
    
        case ZAMORAK_STANDARD_2: // zammy flag
        case 4378:
            team = CastleWars.Team.getTeamForPlayer(player);
            if (team == null) {
                return true;
            }

        switch (team) {
            case CastleWars.Team.SARADOMIN:
                CastleWars.captureFlag(player, team);
                return true;
            case CastleWars.Team.ZAMORAK:
                CastleWars.returnFlag(player, player.getEquipment().getSlot(Equipment.WEAPON_SLOT));
                return true;
        }
        return true;

        case TRAPDOOR_16: // Trap door into saradomin spawn point
            if (CastleWars.Team.getTeamForPlayer(player) == CastleWars.Team.ZAMORAK) {
                player.getPacketSender().sendMessage("You are not allowed in the other teams spawn point.");
                return true;
            }

            player.moveTo(new Location(2429, 3075, 1));
            return true;
        case TRAPDOOR_17: // Trap door into saradomin spawn point
            if (CastleWars.Team.getTeamForPlayer(player) == CastleWars.Team.SARADOMIN) {
                player.getPacketSender().sendMessage("You are not allowed in the other teams spawn point.");
                return true;
            }

            player.moveTo(new Location(2370, 3132, 1));
            return true;
        }
    
        return false;
    }

    canTeleport(player: any) {
        ConditionDialogue.send(player, "You can't leave just like that!");
        return false;
        }
        
    handleDeath(player: any, kill: any) {
        let team = CastleWars.Team.getTeamForPlayer(player);
    
        if (team == null) {
            console.error("no team for " + player.getUsername());
            return false;
        }
        /** Respawns them in any free tile within the starting room **/
        CastleWars.dropFlag(player, team);
        player.smartMove(team.respawn_area_bounds);
        player.castlewarsDeaths++;
    
        if (!kill)
            return true;
    
        let killer = kill;
    
        killer.castlewarsKills++;
        return true;
    }
}