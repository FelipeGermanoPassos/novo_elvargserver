class Stopwatch {
    private time: number = Date.now();
    
    constructor() {
        this.time = 0;
    }
    
    public start(startAt: number): void {
        this.time = Date.now() - startAt;
    }
    
    public reset(i: number): void {
        this.time = i;
    }
    
    public Hasreset(): void {
        this.time = Date.now();
    }
    
    public elapsed(): number {
        return Date.now() - this.time;
    }
    
    public hasElapsed(time: number): boolean {
        return this.elapsed() >= time;
    }
    
    public getTime(): number {
        return this.time;
    }
    }