import { World } from '../../../Worlds'

export abstract class GameSyncTask {
    private players: boolean;
    private concurrent: boolean;

    constructor(players: boolean, concurrent: boolean) {
        this.players = players;
        this.concurrent = concurrent;
        this.players = true
    }


    public abstract execute(index: number): void;

    public checkIndex(index: number): boolean {
        return (this.players ? World.getPlayers().get(index) != null : World.getNpcs().get(index) != null);
    }

    public getAmount(): number {
        return (this.players ? World.getPlayers().size() : World.getNpcs().size());
    }

    public getCapacity(): number {
        return (this.players ? World.getPlayers().capacity() : World.getNpcs().capacity());
    }

    public isConcurrent(): boolean {
        return this.concurrent;
    }
}
