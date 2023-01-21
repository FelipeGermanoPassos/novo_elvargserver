class Stopwatch {
    private time: number = Date.now();
    
    constructor() {
        this.time = 0;
    }
    
    public headStart(startAt: number): this {
        this.time = Date.now() - startAt;
        return this;
    }
    
    public reset(i: number): this {
        this.time = i;
        return this;
    }
    
    public reset(): this {
        this.time = Date.now();
        return this;
    }
    
    public elapsed(): number {
        return Date.now() - this.time;
    }
    
    public elapsed(time: number): boolean {
        return this.elapsed() >= time;
    }
    
    public getTime(): number {
        return this.time;
    }
}