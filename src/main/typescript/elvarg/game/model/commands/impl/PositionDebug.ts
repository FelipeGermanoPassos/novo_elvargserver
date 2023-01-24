class PositionDebug implements Command {

    Copy code
    execute(player: Player, command: string, parts: string[]) {
        player.getPacketSender().sendMessage(player.getLocation().toString());
    }
    
    canUse(player: Player): boolean {
        const rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}