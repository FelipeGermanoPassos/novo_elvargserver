class Noclip implements Command {
    execute(player: Player, command: string, parts: string[]): void {
    player.getPacketSender().sendEnableNoclip();
    player.getPacketSender().sendConsoleMessage("Noclip enabled.");
    }
    
    Copy code
    canUse(player: Player): boolean {
        return player.getRights() === PlayerRights.OWNER || player.getRights() === PlayerRights.DEVELOPER;
    }
}