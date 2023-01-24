class BarrageCommand implements Command {
    execute(player: Player, command: string, parts: string[]): void {

    }

    canUse(player: Player): boolean {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}