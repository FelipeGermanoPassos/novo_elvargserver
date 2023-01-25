class UnBanPlayer implements Command {
    execute(player: Player, command: string, parts: string[]) {
    let player2 = command.substring(parts[0].length() + 1);
    
    Copy code
        if (!PLAYER_PERSISTENCE.exists(player2)) {
            player.getPacketSender().sendMessage(`Player ${player2} is not online.`);
            return;
        }
    
        if (!PlayerPunishment.banned(player2)) {
            player.getPacketSender().sendMessage(`Player ${player2} is not banned!`);
            return;
        }
    }
    
    canUse(player: Player) {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}