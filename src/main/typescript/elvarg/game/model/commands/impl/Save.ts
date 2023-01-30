class Save implements Command {
    execute(player: Player, command: string, parts: string[]) {
    PLAYER_PERSISTENCE.save(player);
    player.getPacketSender().sendMessage("Saved player.");
    }
    canUse(player: Player) {
    return (player.getRights() == PlayerRights.DEVELOPER || player.getRights() == PlayerRights.OWNER);
    }
}