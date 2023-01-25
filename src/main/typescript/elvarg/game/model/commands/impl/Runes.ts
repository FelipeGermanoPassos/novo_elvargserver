class Runes implements Command {
    execute(player: Player, command: string, parts: string[]) {
    let runes = [554, 555, 556, 557, 558, 559, 560, 561, 562, 563, 564, 565];
    runes.forEach((rune) => {
    player.getInventory().add(rune, 1000);
    });
    }
    
    canUse(player: Player): boolean {
    return (player.getRights() === PlayerRights.OWNER || player.getRights() === PlayerRights.DEVELOPER);
    }
}