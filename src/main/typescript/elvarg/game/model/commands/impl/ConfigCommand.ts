class ConfigCommand implements Command {
    execute(player: Player, command: string, parts: string[]) {
        player.getPacketSender().sendConfig(parseInt(parts[1]), parseInt(parts[2]));
        player.getPacketSender().sendMessage("Sent config");
    }

    canUse(player: Player): boolean {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}