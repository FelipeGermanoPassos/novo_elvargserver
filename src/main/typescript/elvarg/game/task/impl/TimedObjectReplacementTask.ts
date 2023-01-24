class TimedObjectReplacementTask extends Task {
    private original: GameObject;
    private temp: GameObject;
    private ticks: number;
    private tick = 0;
    private sameTile = false;
    
    constructor(original: GameObject, temp: GameObject, ticks: number) {
        super(1, true);
        this.original = original;
        this.temp = temp;
        this.ticks = ticks;
        this.sameTile = original.getLocation().equals(temp.getLocation());
    }
    
    execute() {
        if (this.tick === 0) {
            ObjectManager.deregister(this.original, !this.sameTile);
            ObjectManager.register(this.temp, true);
        } else if (this.tick >= this.ticks) {
            ObjectManager.deregister(this.temp, !this.sameTile);
            ObjectManager.register(this.original, true);
            this.stop();
        }
        this.tick++;
    }
}