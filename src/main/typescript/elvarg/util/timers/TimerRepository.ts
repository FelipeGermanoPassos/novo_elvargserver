import {TimerKey} from '../timers/TimerKey'
import {Timer} from '../timers/Timer'

export class TimerRepository {
    private timers: Map<TimerKey, Timer> = new Map();

    public has(key: TimerKey): boolean {
        const timer = this.timers.get(key);
        return timer !== null && timer.getTicks() > 0;
    }

    public register(timer: Timer): void;
    public register(key: TimerKey, ticks: number): void;
    public register(key: TimerKey): void;
    public register(key: TimerKey | Timer, ticks?: number): void {
        if (key instanceof Timer) {
            this.timers.set(key.getKey(), key);
        } else {
            if (ticks) {
                this.timers.set(key, new Timer(key, ticks));
            } else {
                this.timers.set(key, new Timer(key, key.getTicks()));
            }
        }
    }

    extendOrRegister(key: TimerKey, ticks: number) {
        const timer = this.timers.get(key);
        if (timer && timer.ticks() >= ticks) {
            this.timers.set(key, new Timer(key, ticks));
        }
    }

    addOrSet(key: TimerKey, ticks: number) {
        this.timers.compute(key, (k, t) => t == null ? new Timer(key, ticks) : new Timer(key, t.ticks() + ticks));
    }

    cancel(name: TimerKey) {
        this.timers.delete(name);
    }

    process() {
        if (this.timers.size) {
            const entries = Array.from(this.timers.entries());
            for (const [key, value] of entries) {
                value.tick();
            }
        }
    }

    getTimers(): Map<TimerKey, Timer> {
        return this.timers;
    }
}