class CastleWarsSaradominWaitingArea extends Area {
    constructor() {
        super(Arrays.asList(new Boundary(2368, 2392, 9481, 9497)));
    }

    public getName(): string {
        return "the Saradomin waiting room in Castle Wars";
    }

    public postEnter(character: Mobile): void {
        let player = character.getAsPlayer();
        if (!player) {
            return;
        }

        if (!START_GAME_TASK.isRunning() && CastleWars.ZAMORAK_WAITING_AREA.getPlayers().size > 0) {
            // Ensure the game start timer is active
            TaskManager.submit(START_GAME_TASK);
        }

        let announcement = "Next Game Begins In: " + Misc.getSeconds(START_GAME_TASK.getRemainingTicks()) + " seconds.";
        player.getPacketSender().sendMessage(announcement);

        // Announce the next game in the lobby via Lanthus
        CastleWars.LOBBY_AREA.getLanthus().forceChat(announcement);

        // Equip the cape
        player.getEquipment().setItem(Equipment.CAPE_SLOT, CastleWars.SARADOMIN_CAPE);
        player.getEquipment().refreshItems();
        player.getUpdateFlag().flag(Flag.APPEARANCE);

        // TODO: If player is wearing zamorak items, transform them
    }

    public postLeave(character: Mobile, logout: boolean): void {
        let player = character.getAsPlayer();
        if (!player) {
            return;
        }

        if (START_GAME_TASK.isRunning() && this.getPlayers().size === 0
                && CastleWars.ZAMORAK_WAITING_AREA.getPlayers().size === 0) {
            // Ensure the game start timer is cancelled
            TaskManager.cancelTasks(START_GAME_TASK);
        }

        if (logout) {
            // Player has logged out, teleport them to the lobby
            player.moveTo(new Location(2439 + Misc.random(4), 3085 + Misc.random(5), 0));
        }

        if (player.getArea() != CastleWars.GAME_AREA) {
            // Player has left and not went into the game area, remove cape & items
            CastleWars.deleteGameItems(player);
            player.resetAttributes();
        }

        // Remove the interface
        player.getPacketSender().sendWalkableInterface(-1);

        // TODO: Un-transform player if they were transformed
    }

    public handleObjectClick(player: Player, objectId: number, type: number): boolean {
        switch (objectId) {
            case PORTAL_8:
                player.moveTo(new Location(2439 + Misc.random(4),
                        3085 + Misc.random(5), 0));
                return true;
        }

        return false;
    }

    public process(character: Mobile): void {
        let player = character.getAsPlayer();
        if (!player) {
            return;
        }

         // Update the interface
         player.getPacketSender().sendString(CastleWars.START_GAME_TASK.isRunning() ?
         "Time until next game starts: " + Math.floor(START_GAME_TASK.getRemainingTicks())
         : "Waiting for players to join the other team.", 11480);

        // Send the interface
        player.getPacketSender().sendWalkableInterface(11479);
    }

    public canEquipItem(player: Player, slot: number, item: Item): boolean {
    if (slot === Equipment.CAPE_SLOT || slot === Equipment.HEAD_SLOT) {
        player.getPacketSender().sendMessage("You can't remove your team's colours.");
        return false;
    }

    return true;
    }

    public canUnequipItem(player: Player, slot: number, item: Item): boolean {
    if (slot === Equipment.CAPE_SLOT || slot === Equipment.HEAD_SLOT) {
        player.getPacketSender().sendMessage("You can't remove your team's colours.");
        return false;
    }

    return true;
    }

    public canPlayerBotIdle(playerBot: PlayerBot): boolean {
    // Allow the player bot to wait here if there are players in the other team
    return CastleWars.ZAMORAK_WAITING_AREA.getPlayers().size > 0;
    }
}
    