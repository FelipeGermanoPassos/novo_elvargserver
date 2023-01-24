class Up implements Command {
    execute(player: Player, command: string, parts: string[]) {
    let newLocation = player.getLocation().clone().setZ(player.getLocation().getZ() + 1);
    player.moveTo(newLocation);
    }
    
    Copy code
    canUse(player: Player) {
        return (player.getRights() == PlayerRights.OWNER || player.getRights() == PlayerRights.DEVELOPER);
    }
}