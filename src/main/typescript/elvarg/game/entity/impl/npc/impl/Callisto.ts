import { Ids } from 'com.elvarg.game.model';
import { NPC } from 'com.elvarg.game.entity.impl.npc';
import { Location } from 'com.elvarg.game.model';
import { CallistoCombatMethod } from 'com.elvarg.game.content.combat.method.impl.npcs';
import { CombatMethod } from 'com.elvarg.game.content.combat.method';

const CALLISTO = 6609;

@Ids({ CALLISTO })
export class Callisto extends NPC {

    private static COMBAT_METHOD = new CallistoCombatMethod();

    constructor(id: number, position: Location) {
        super(id, position);
    }

    public getCombatMethod(): CombatMethod {
        return Callisto.COMBAT_METHOD;
    }
}
