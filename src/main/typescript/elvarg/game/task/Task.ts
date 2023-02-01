import { TaskType } from "./TaskType";

interface TaskContructor {
    immediate?: boolean;
    delay?: number;
    type?: TaskType;
    key?: Object;
}

export class Task {
    public static DEFAULT_KEY = new Object();
    private immediate: boolean;
    private delay: number;
    private countdown: number;
    public type: TaskType;
    private running = false;
    private key: Object;

    constructor(options: TaskContructor = {}) {
        this.delay = options.delay ?? 1;
        this.countdown = options.delay ?? 1;
        this.immediate = options.immediate ?? false;
        this.bind(options.key ?? Task.DEFAULT_KEY);
        this.type = options.type ?? TaskType.DEFAULT
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
