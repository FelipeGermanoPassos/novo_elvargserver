class SpawnPermanentNPCCommand implements Command {

    Copy code
    execute(player: Player, command: string, parts: string[]) {
        try {
            let npcId = parseInt(parts[1]);
            let radius = parts.length > 2 ? parseInt(parts[1]) : 2;
            let npcDef = NpcDefinition.forId(npcId);
            let locationName = player.getArea() == null ? "Unknown area" : player.getArea().getName();
            let description = locationName + " " + npcDef.getName();
            this.write(npcId, player.getLocation().clone(), radius, description);
            player.getPacketSender().sendMessage("Permanently spawned " + description);
        } catch (e) {
            console.error(e);
        }
    
        let npc = NPC.create(parseInt(parts[1]), player.getLocation().clone());
        World.getAddNPCQueue().add(npc);
        if (player.getPrivateArea() != null) {
            player.getPrivateArea().add(npc);
        }
    }
    
    canUse(player: Player) {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }

    public write(npcId: number, npcLocation: Location, npcRadius: number, description: string): void {
        const gson = new Gson();
        const file = new File(GameConstants.DEFINITIONS_DIRECTORY + "npc_spawns.json");
        const reader = new FileReader(file);
    
        const builder = new GsonBuilder().setPrettyPrinting().create();
    
        let definitionArray = gson.fromJson(reader, NpcSpawnDefinition[]);
    
        if (definitionArray == null) {
            return;
        }
    
        const writer = new FileWriter(file, false);
    
        const list = new ArrayList(Arrays.asList(definitionArray));
    
        list.add(new NpcSpawnDefinition(npcId, npcLocation, FacingDirection.SOUTH, 2, description));
    
        let finalArray = new NpcSpawnDefinition[list.size()];
        finalArray = list.toArray(finalArray);
    
        builder.toJson(finalArray, writer);
        writer.flush();
        writer.close();
    }
}