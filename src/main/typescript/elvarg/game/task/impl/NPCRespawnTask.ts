class NPCRespawnTask extends Task {
    private npc: NPC;
    constructor(npc: NPC, ticks: number) {
    super(ticks);
    this.npc = npc;
    }
    
    Copy code
    public execute() {
        // Register the new entity..
        World.getAddNPCQueue().add(this.npc.clone());
    
        // Stop the task
        this.stop();
    }
}