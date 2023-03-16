import { CastleWars } from "../content/minigames/impl/CastleWars";

export class Animation {
    public static DEFAULT_RESET_ANIMATION = new Animation(65535);
    private id: number;
    private delay: number;
    private priority: Priority;

    constructor(id: number) {
        this.id = id;
        this.delay = 0;
        this.priority = Priority.LOW;
    }

    getId(): number {
        return this.id;
    }

    getDelay(): number {
        return this.delay;
    }

    getPriority() {
        return this.priority;
    }
}

enum Priority {
    LOW
}