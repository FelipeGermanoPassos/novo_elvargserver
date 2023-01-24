class Systems {
    public static init() {
        // Firstly, gather all the classes inside the npc.impl package
        const npcOverrideClasses = (Object.values(require('reflect-metadata')).filter(clazz => 
        clazz.name.startsWith("com.elvarg.game.entity.impl.npc.impl")));
    
        // Filter all classes which have @Ids annotation defined on them
        const npcClasses = npcOverrideClasses.filter(clazz => Reflect.getMetadata("Ids", clazz) != null);
    
        // Filter all classes which extend NPC
        const implementationClasses = npcClasses.filter(clazz => clazz.prototype instanceof NPC);
        NPC.initImplementations(implementationClasses);
    }
}
