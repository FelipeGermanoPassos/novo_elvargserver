class Empty implements Command {
    execute(player: Player, command: string, parts: string[]) {
        player.getSkillManager().stopSkillable();
        player.getInventory().resetItems().refreshItems();
    }

    canUse(player: Player) {
        return true;
    }
}