class SpawnObjectCommand implements Command {

    Copy code
    execute(player: Player, command: string, parts: string[]) {
        let id = parseInt(parts[1]);
        let type = parts.length == 3 ? parseInt(parts[2]) : 10;
        let face = parts.length == 4 ? parseInt(parts[3]) : 0;
        let gameObject = new GameObject(id, player.getLocation().clone(), type, face, player.getPrivateArea());
        ObjectManager.register(gameObject, true);
    }
    
    canUse(player: Player) {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}