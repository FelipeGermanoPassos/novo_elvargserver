class Kdr implements Command {
    execute(player: Player, command: string, parts: string[]) {
    player.forceChat("I currently have " + player.getKillDeathRatio() + " kdr!");
    }
    canUse(player: Player) {
    return true;
    }
}