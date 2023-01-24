class Bank implements Command {
    execute(player: Player, command: string, parts: string[]): void {
        player.getBank(player.getCurrentBankTab()).open();
    }

    canUse(player: Player): boolean {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}





