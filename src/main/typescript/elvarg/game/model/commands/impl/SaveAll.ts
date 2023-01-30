class SaveAll implements Command {
    execute(player: Player, command: string, parts: string[]) {
        World.savePlayers();
        player.getPacketSender().sendMessage("Saved all players.");
    }

    canUse(player: Player) {
        return (player.getRights() == PlayerRights.DEVELOPER || player.getRights() == PlayerRights.OWNER || player.getRights() == PlayerRights.ADMINISTRATOR);
    }
}