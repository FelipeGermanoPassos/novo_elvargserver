class Skull implements Command {
    execute(player: Player, command: string, parts: string[]): void {
    if (CombatFactory.inCombat(player)) {
    player.getPacketSender().sendMessage("You cannot change that during combat!");
    return;
    }
    if (parts[0].includes("red")) {
    CombatFactory.skull(player, SkullType.RED_SKULL, (60 * 30)); // Should be 30 mins
    } else {
    CombatFactory.skull(player, SkullType.WHITE_SKULL, 300); // Should be 5 mins
    }
    }
    
    Copy code
    canUse(player: Player): boolean {
        return true;
    }
}