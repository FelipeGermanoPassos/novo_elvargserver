class Claim implements Command {
    execute(player: Player, command: string, parts: string[]) {
        player.getPacketSender().sendMessage("To claim purchased items, please talk to the Financial Advisor at home.");
    }
    canUse(player: Player) {
        return true;
    }
}