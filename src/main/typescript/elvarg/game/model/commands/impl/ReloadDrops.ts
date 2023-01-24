class ReloadDrops implements Command {
    execute(player: Player, command: string, parts: string[]): void {
    try {
    new NpcDropDefinitionLoader().load();
    player.getPacketSender().sendConsoleMessage("Reloaded drops.");
    } catch (e) {
    console.log(e);
    player.getPacketSender().sendMessage("Error reloading npc drops.");
    }
    }
    
    Copy code
    canUse(player: Player): boolean {
        const rights = player.getRights();
        return rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER;
    }
}