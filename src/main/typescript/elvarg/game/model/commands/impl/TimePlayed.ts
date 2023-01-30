class TimePlayed implements Command {
    execute(player: Player, command: string, parts: string[]) {
    player.forceChat(I've been playing for ${Misc.getFormattedPlayTime(player)}.);
    }
    canUse(player: Player): boolean {
    return true;
    }
}