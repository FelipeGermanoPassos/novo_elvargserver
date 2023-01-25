class Players implements Command {
    execute(player: Player, command: string, parts: string[]) {
    player.setDonatorRights(DonatorRights.REGULAR_DONATOR);
    player.getPacketSender().sendRights();
    }
    
    Copy code
    canUse(player: Player): boolean {
        return true;
    }
}