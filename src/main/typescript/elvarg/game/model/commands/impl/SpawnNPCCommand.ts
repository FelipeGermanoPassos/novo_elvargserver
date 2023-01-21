class SpawnNPCCommand implements Command {
    execute(player: Player, command: string, parts: string[]) {
    let npc = NPC.create(parseInt(parts[1]), player.getLocation().clone());
    World.getAddNPCQueue().add(npc);
    if (player.getPrivateArea() != null) {
    player.getPrivateArea().add(npc);
    }
    }
    
    Copy code
    canUse(player: Player) {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}