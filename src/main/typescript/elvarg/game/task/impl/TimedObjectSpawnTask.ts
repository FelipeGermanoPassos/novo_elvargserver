class TimedObjectSpawnTask extends Task {
    private temp: GameObject;
    private ticks: number;
    private action: Optional<Action>;
<<<<<<< Updated upstream
    private tick = 0;
    
=======
    public static tick = 0;

>>>>>>> Stashed changes
    constructor(temp: GameObject, ticks: number, action: Optional<Action>) {
        super(1, true);
        this.temp = temp;
        this.action = action;
        this.ticks = ticks;
    }
    
    execute() {
        if (TimedObjectSpawnTask.tick === 0) {
            ObjectManager.register(this.temp, true);
        } else if (TimedObjectSpawnTask.tick >= this.ticks) {
            ObjectManager.deregister(this.temp, true);
    
            if (this.action && this.action.isPresent()) {
                this.action.get().execute();
            }
    
            this.stop();
        }
<<<<<<< Updated upstream
        this.tick++;
=======
        TimedObjectSpawnTask.tick++;
>>>>>>> Stashed changes
    }
}