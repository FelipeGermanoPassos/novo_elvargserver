class TestGESellInt implements Command {
    execute(player: Player, command: string, parts: string[]) {
    player.getPacketSender().
    sendItemOnInterface(24780, parseInt(parts[1]), 1).
    sendString(24769, ItemDefinition.forId(parseInt(parts[1])).getName()).
    sendString(24770, ItemDefinition.forId(parseInt(parts[1])).getExamine());
    }
    canUse(player: Player): boolean {
    let rights = player.getRights();
    return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}