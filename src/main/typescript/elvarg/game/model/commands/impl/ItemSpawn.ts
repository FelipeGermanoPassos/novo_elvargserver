class ItemSpawn implements Command {
    execute(player: Player, command: string, parts: string[]): void {
    let amount = 1;
    if (parts.length > 2) {
    amount = parseInt(parts[2]);
    }
    player.getInventory().add(new Item(parseInt(parts[1]), amount));
    }
    canUse(player: Player): boolean {
    let rights = player.getRights();
    return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}