class SpecCommand implements Command {
    execute(player: Player, command: string, parts: string[]) {
    let amt = 100;
    if (parts.length > 1)
    amt = parseInt(parts[1]);
    player.setSpecialPercentage(amt);
    CombatSpecial.updateBar(player);
    }
    canUse(player: Player): boolean {
    let rights = player.getRights();
    return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}