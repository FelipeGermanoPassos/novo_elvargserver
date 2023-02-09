<<<<<<< Updated upstream
class Task {
=======
import { TaskType } from "./TaskType";

interface TaskContructor {
    immediate?: boolean;
    delay?: number;
    type?: TaskType;
    key?: Object;
}

export abstract class Task {
>>>>>>> Stashed changes
    public static DEFAULT_KEY = new Object();
    private immediate: boolean;
    private delay: number;
    private countdown: number;
    public type: TaskType;
    private running = false;
<<<<<<< Updated upstream
    private key: Object;
    
    constructor() {
        this(1);
    }
    
    constructor(immediate: boolean) {
        this(1, immediate);
    }
    
    constructor(delay: number) {
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
    
        if (this.countdown == 0) {
            this.countdown = this.delay;
            this.onExecute();
=======
    private key: object;
    
    constructor(delay?: number, immediate?: boolean, type?: TaskType) {
    this.immediate = immediate !== undefined ? immediate : false;
    this.delay = delay !== undefined ? delay : 1;
    this.bind(Task.DEFAULT_KEY);
    this.type = type !== undefined ? type : TaskType.DEFAULT;
    }
    
    private bind(key: object): void {
    this.key = key;
    }

    isImmediate(): boolean {
        return this.immediate;
        }
        
        isRunning(): boolean {
        return this.running;
        }
        
        isStopped(): boolean {
        return !this.running;
        }
        
        tick(): boolean {
        if (this.running && (this.countdown == 0 || --this.countdown == 0)) {
        this.execute();
        this.countdown = this.delay;
>>>>>>> Stashed changes
        }
        this.onTick();
        return this.running;
        }
        
        onTick() {}
        
        abstract execute(): void;
        
        getDelay(): number {
        return this.delay;
        }
        
        getRemainingTicks(): number {
        return this.countdown;
        }
        
        setDelay(delay: number) {
        if (delay > 0) this.delay = delay;
        }
        
        setRunning(running: boolean) {
        this.running = running;
        }
        
        stop() {
        this.running = false;
    }
<<<<<<< Updated upstream
    
    protected abstract onExecute(): void;
=======
>>>>>>> Stashed changes
}
