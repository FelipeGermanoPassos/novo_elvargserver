class TaskDebug implements Command {
    execute(player: Player, command: string, parts: string[]) {
    player.getPacketSender().sendMessage(Active tasks : ${TaskManager.getTaskAmount()}.);
    }
    canUse(player: Player): boolean {
    let rights = player.getRights();
    return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}