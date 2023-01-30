class Yell implements Command {
    static getYellPrefix(player: Player) {
    if (!player.getRights().getYellTag().isEmpty()) {
    return player.getRights().getYellTag();
    }
    return player.getDonatorRights().getYellTag();
    }
    
    Copy code
    static getYellDelay(player: Player) {
        if (player.isStaff()) {
            return 0;
        }
        return player.getDonatorRights().getYellDelay();
    }
    
    execute(player: Player, command: string, parts: string[]) {
        if (PlayerPunishment.muted(player.getUsername()) || PlayerPunishment.IPMuted(player.getHostAddress())) {
            player.getPacketSender().sendMessage("You are muted and cannot yell.");
            return;
        }
        if (!player.getYellDelay().finished()) {
            player.getPacketSender().sendMessage(
                `You must wait another ${player.getYellDelay().secondsRemaining()} seconds to do that.`);
            return;
        }
        let yellMessage = command.substring(4, command.length());
        if (Misc.blockedWord(yellMessage)) {
            return;
        }
    
        let spriteId = player.getRights().getSpriteId();
        let sprite = (spriteId == -1 ? "" : `<img=${spriteId}>`);
        let yell = (`${this.getYellPrefix(player)} ${sprite} ${player.getUsername()}: ${yellMessage}`);
        World.getPlayers().forEach(e => e.getPacketSender().sendSpecialMessage(player.getUsername(), 21, yell));
    
        let yellDelay = this.getYellDelay(player);
        if (yellDelay > 0) {
            player.getYellDelay().start(yellDelay);
        }
    }
    
    canUse(player: Player) {
        if (player.isStaff() || player.isDonator()) {
            return true;
        }
        return false;
    }
}