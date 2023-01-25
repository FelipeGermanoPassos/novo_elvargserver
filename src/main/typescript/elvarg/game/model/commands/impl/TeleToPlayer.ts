class TeleToPlayer implements Command {
    execute(player: Player, command: string, parts: string[]) {
    let plr = World.getPlayerByName(command.substring(parts[0].length() + 1));
    if (plr) {
    player.moveTo(plr.getLocation().clone());
    }
    }
    canUse(player: Player): boolean {
    let rights = player.getRights();
    return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}