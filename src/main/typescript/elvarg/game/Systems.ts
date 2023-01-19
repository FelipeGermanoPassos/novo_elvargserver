class Systems {
    static init() {
        try {
            let npcOverrideClasses = ClassPath.from(ClassLoader.getSystemClassLoader())
                .getAllClasses()
                .filter(clazz => clazz.getPackageName().startsWith("com.elvarg.game.entity.impl.npc.impl"))
                .map(clazz => clazz.load());

            let npcClasses = npcOverrideClasses
                .filter(clazz => clazz.getAnnotation(Ids) != null);

            let implementationClasses = npcClasses.filter(clazz => clazz instanceof NPC);
            NPC.initImplementations(implementationClasses);

            let interactionClasses = npcClasses.filter(clazz => clazz instanceof NPCInteraction);
            NPCInteractionSystem.init(interactionClasses);
        } catch (IOException e) {
            console.log(e);
        }
    }
}
