class GFXCommand implements Command {
    execute(player: Player, command: string, parts: string[]) {
    let gfx = parseInt(parts[1]);
    player.performGraphic(new Graphic(gfx));
    }
    canUse(player: Player) {
    return player.getRights() == PlayerRights.OWNER || player.getRights() == PlayerRights.DEVELOPER;
    }
}