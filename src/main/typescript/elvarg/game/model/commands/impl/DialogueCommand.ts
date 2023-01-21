class DialogueCommand implements Command {

    execute(player: Player, command: string, parts: string[]) {
        
    }

    canUse(player: Player): boolean {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }

}