class DebugCommand implements Command {
    execute(player: Player, command: string, parts: string[]) {
        console.log(RegionManager.wallsExist(player.getLocation().clone(), player.getPrivateArea()));
    }

    canUse(player: Player) {
        return (player.getRights() == PlayerRights.DEVELOPER);
    }
}