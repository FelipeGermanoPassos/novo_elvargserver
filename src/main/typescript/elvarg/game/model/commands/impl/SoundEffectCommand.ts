class SoundEffectCommand implements Command {
    execute(player: Player, command: string, parts: string[]) {
    let soundId: number = parseInt(parts[1]);
    let delay: number = parts.length == 3 ? parseInt(parts[2]) : 0;
    let loopType: number = parts.length == 4 ? parseInt(parts[3]) : 0;
    let volume: number = parts.length == 5 ? parseInt(parts[4]) : 2;
    Sounds.sendSound(player, soundId, loopType, delay, volume);
    }
    canUse(player: Player) {
    return player.getRights() == PlayerRights.OWNER || player.getRights() == PlayerRights.DEVELOPER;
    }
}