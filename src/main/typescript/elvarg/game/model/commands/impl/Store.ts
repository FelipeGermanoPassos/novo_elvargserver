class Store implements Command {
    execute(player: Player, command: string, parts: string[]) {
    player.getPacketSender().sendURL("http://www.deadlypkers.net");
    }
    canUse(player: Player): boolean {
    return true;
    }
}