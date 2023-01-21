class NPCDeathTask extends Task {
    /**
    * The npc setting off the death task.
    /
    private npc: NPC;
    /*
    * The amount of ticks on the task.
    /
    private ticks: number;
    /*
    * The player who killed the NPC
    */
    private killer: Optional<Player> = Optional.empty();
    
    /**
     * The NPCDeathTask constructor.
     *
     * @param npc The npc being killed.
     */
    constructor(npc: NPC) {
        super(2);
        this.npc = npc;
        this.ticks = 1;
    }

    public execute(): void {
        switch (this.ticks) {
            case 1:
                this.npc.getMovementQueue().setBlockMovement(true).reset();
                this.killer = this.npc.getCombat().getKiller(true);
                this.npc.performAnimation(new Animation(this.npc.getCurrentDefinition().getDeathAnim(), Priority.HIGH));
                this.npc.getCombat().reset();
                this.npc.setMobileInteraction(null);
                break;
            case 0:
                if (this.killer !== undefined) {
                    if (this.killer.getArea() !== null) {
                        this.killer.getArea().defeated(this.killer, this.npc);
                    }
                    Slayer.killed(this.killer, this.npc);
                    NPCDropGenerator.start(this.killer, this.npc);
                }
                this.stop();
                break;
        }
        this.ticks--;
    }
    
    public stop(): void {
        super.stop();
        if (this.npc.getArea() !== null) {
            this.npc.getArea().leave(this.npc, false);
            this.npc.getArea().postLeave(this.npc, false);
            this.npc.setArea(null);
        }
        this.npc.setDying(false);
        this.npc.setNpcTransformationId(-1);
        if (this.npc.getDefinition().getRespawn() > 0) {
            TaskManager.submit(new NPCRespawnTask(this.npc, this.npc.getDefinition().getRespawn()));
        }
        if (this.npc.isBarricade()) {
            Barricades.checkTile(this.npc.getLocation());
        }
        World.getRemoveNPCQueue().add(this.npc);
    }
}