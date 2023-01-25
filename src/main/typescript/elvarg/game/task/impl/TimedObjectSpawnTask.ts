class TimedObjectSpawnTask extends Task {
    private temp: GameObject;
    private ticks: number;
    private action: Optional<Action>;
    private tick = 0;
    
    constructor(temp: GameObject, ticks: number, action: Optional<Action>) {
        super(1, true);
        this.temp = temp;
        this.action = action;
        this.ticks = ticks;
    }
    
    execute() {
        if (this.tick === 0) {
            ObjectManager.register(this.temp, true);
        } else if (this.tick >= this.ticks) {
            ObjectManager.deregister(this.temp, true);
    
            if (this.action && this.action.isPresent()) {
                this.action.get().execute();
            }
    
            this.stop();
        }
        this.tick++;
    }
}