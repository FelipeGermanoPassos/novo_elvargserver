class KickPlayer implements Command {

    Copy code
    execute(player: Player, command: string, parts: string[]): void {
        let plr = World.getPlayerByName(command.substring(parts[0].length + 1));
        if (plr) {
            plr.requestLogout();
        }
    }
    
    canUse(player: Player): boolean {
        return (player.getRights() == PlayerRights.OWNER || player.getRights() == PlayerRights.DEVELOPER);
    }
}