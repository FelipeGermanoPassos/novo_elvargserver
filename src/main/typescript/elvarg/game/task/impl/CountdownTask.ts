class CountdownTask extends Task {
    onTick: () => void;
    onComplete: () => void;
    
    constructor(key: Object, ticks: number, onComplete: () => void) {
        super(ticks, key);
        this.onComplete = onComplete;
    }
    
    constructor(key: Object, ticks: number, onTick: () => void, onComplete: () => void) {
        super(ticks, key);
        this.onTick = onTick;
        this.onComplete = onComplete;
    }
    
    onTick() {
        if (this.onTick) {
            this.onTick();
        }
    }
    
    execute() {
        if (this.onComplete) {
            this.onComplete();
        }
    
        // Countdown task only runs once
        this.stop();
    }
}