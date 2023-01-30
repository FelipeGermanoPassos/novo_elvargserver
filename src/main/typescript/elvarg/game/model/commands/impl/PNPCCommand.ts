class PNPCCommand implements Command {
    execute(player: Player, command: string, parts: string[]): void {
    player.setNpcTransformationId(parseInt(parts[1]));
    }
    
    Copy code
    canUse(player: Player): boolean {
        return player.getRights() === PlayerRights.OWNER || player.getRights() === PlayerRights.DEVELOPER;
    }
}