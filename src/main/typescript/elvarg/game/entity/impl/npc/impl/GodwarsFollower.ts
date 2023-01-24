import { NPC } from 'com.elvarg.game.entity.impl.npc';
import { Location } from 'com.elvarg.game.model';
import { God } from 'com.elvarg.game.model';

export class GodwarsFollower extends NPC {
    private god: God;
    constructor(id: number, position: Location, god: God) {
        super(id, position);
        this.god = god;
    }

    public getGod(): God {
        return this.god;
    }
}
