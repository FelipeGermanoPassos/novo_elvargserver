class Task {
    public static DEFAULT_KEY = new Object();
    private immediate: boolean;
    private delay: number;
    private countdown: number;
    public type: TaskType;
    private running = false;
    private key: Object;
    
    constructor() {
        this(1);
    }
    
    constructor(immediate: boolean) {
        this(1, immediate);
    }
    
    constructor(delay: number) {
        this(delay, false);
        this.bind(DEFAULT_KEY);
        this.type = DEFAULT;
    }
    
    constructor(delay: number, type: TaskType) {
        this(delay, false);
        this.bind(DEFAULT_KEY);
        this.type = type;
    }
    
    constructor(delay: number, immediate: boolean) {
        this.delay = delay;
        this.countdown = delay;
        this.immediate = immediate;
        this.bind(DEFAULT_KEY);
    }
    
    constructor(delay: number, key: Object) {
        this.delay = delay;
        this.countdown = delay;
        this.immediate = false;
        this.bind(key);
    }
    
    constructor(delay: number, key: Object, immediate: boolean) {
        this.delay = delay;
        this.countdown = delay;
        this.immediate = immediate;
        this.bind(key);
    }
    
    public getKey(): Object {
        return Objects.requireNonNull(this.key);
    }
    
    public bind(key: Object): Task {
        this.key = Objects.requireNonNull(key);
        return this;
    }
    
    public isImmediate(): boolean {
        return this.immediate;
    }
    
    public isRunning(): boolean {
        return this.running;
    }
    
    public start(): void {
        if (this.running)
            return;
    
        if (this.immediate) {
            this.execute();
        }
    
        this.running = true;
    }
    
    public stop(): void {
        this.running = false;
    }
    
    public execute(): void {
        if (!this.running)
            return;
    
        this.countdown--;
    
        if (this.countdown == 0) {
            this.countdown = this.delay;
            this.onExecute();
        }
    }
    
    protected abstract onExecute(): void;
}