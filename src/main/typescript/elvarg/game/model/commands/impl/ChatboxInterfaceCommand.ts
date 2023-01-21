class ChatboxInterfaceCommand implements Command {
    execute(player: Player, command: string, parts: string[]): void {
        player.getPacketSender().sendChatboxInterface(parseInt(parts[1]));
    }

    canUse(player: Player): boolean {
        return player.getRights() === PlayerRights.OWNER || player.getRights() === PlayerRights.DEVELOPER;
    }
}