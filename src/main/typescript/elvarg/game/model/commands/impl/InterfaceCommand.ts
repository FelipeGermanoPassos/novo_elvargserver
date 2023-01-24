class InterfaceCommand implements Command {
    execute(player: Player, command: string, parts: string[]) {
    player.getPacketSender().sendInterface(parseInt(parts[1]));
    }
    canUse(player: Player) : boolean {
    return (player.getRights() == PlayerRights.OWNER || player.getRights() == PlayerRights.DEVELOPER);
    }
}