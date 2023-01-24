class FloodCommand implements Command {
    execute(player: Player, command: string, parts: string[]) {
        let amt = parseInt(parts[1]);
        Server.getFlooder().login(amt);
    }

    canUse(player: Player) {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}