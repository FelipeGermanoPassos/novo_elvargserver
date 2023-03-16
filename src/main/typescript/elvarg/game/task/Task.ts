import { TaskType } from "./TaskType";

interface TaskContructor {
    immediate?: boolean;
    delay?: number;
    type?: TaskType;
    key?: Object;
}

export abstract class Task {
    public static DEFAULT_KEY = new Object();
    private immediate: boolean;
    private delay: number;
    private countdown: number;
    public type: TaskType;
    private running = false;
    private key: object;

    constructor(delay?: number, immediate?: boolean, type?: TaskType, key?: object) {
        this.immediate = immediate !== undefined ? immediate : false;
        this.delay = delay !== undefined ? delay : 1;
        this.type = type !== undefined ? type : TaskType.DEFAULT;
        this.bind(key !== undefined ? key : Task.DEFAULT_KEY);
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
        }
        this.onTick();
        return this.running;
    }

    onTick() { }

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
}
