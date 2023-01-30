class ReloadCommands implements Command {
    execute(player: Player, command: string, parts: string[]) {
        CommandManager.loadCommands();
        player.getPacketSender().sendConsoleMessage("Reloaded");
    }

    canUse(player: Player) {
        return player.getRights() == PlayerRights.OWNER || player.getRights() == PlayerRights.DEVELOPER;
    }
}