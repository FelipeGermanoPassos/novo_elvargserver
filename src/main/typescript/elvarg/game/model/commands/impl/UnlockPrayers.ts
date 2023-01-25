class UnlockPrayers implements Command {
    execute(player: Player, command: string, parts: string[]) {
    let type = parseInt(parts[1]);
    if (type == 0) {
    player.setPreserveUnlocked(true);
    } else if (type == 1) {
    player.setRigourUnlocked(true);
    } else if (type == 2) {
    player.setAuguryUnlocked(true);
    }
    player.getPacketSender().sendConfig(709, player.isPreserveUnlocked() ? 1 : 0);
    player.getPacketSender().sendConfig(711, player.isRigourUnlocked() ? 1 : 0);
    player.getPacketSender().sendConfig(713, player.isAuguryUnlocked() ? 1 : 0);
    }
    
    Copy code
    canUse(player: Player) {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}