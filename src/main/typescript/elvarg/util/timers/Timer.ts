interface TimerKey {
    id: string;
    name: string;
}

export class Timer {
    private key: TimerKey;
    private ticks: number;
    
    constructor(key: TimerKey, ticks: number) {
        this.key = key;
        this.ticks = ticks;
    }
    
    public getTicks(): number {
        return this.ticks;
    }
    
    public getKey(): TimerKey {
        return this.key;
    }
    
    public tick(): void {
        if (this.ticks > 0) {
            this.ticks--;
        }
    }
}