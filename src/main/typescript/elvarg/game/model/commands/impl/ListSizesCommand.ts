class ListSizesCommand implements Command {
    execute(player: Player, command: string, parts: string[]): void {
    player.getPacketSender().sendMessage(Players: ${World.getPlayers().size()}, NPCs: ${World.getNpcs().size()}, Objects: ${World.getObjects().size()}, GroundItems: ${World.getItems().size()}.);
    }
    
    Copy code
    canUse(player: Player): boolean {
        return player.getRights() == PlayerRights.DEVELOPER || player.getRights() == PlayerRights.OWNER;
    }
}