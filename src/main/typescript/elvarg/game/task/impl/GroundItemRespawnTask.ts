class GroundItemRespawnTask extends Task {
    /**
    * The {@link ItemOnGround} which is going to respawn.
    */
    private item: ItemOnGround;
    
    constructor(item: ItemOnGround, ticks: number) {
        super(ticks);
        this.item = item;
    }
    
    execute() {
        // Register the new entity..
        ItemOnGroundManager.register(item.clone());
    
        // Stop the task
        this.stop();
    }
}