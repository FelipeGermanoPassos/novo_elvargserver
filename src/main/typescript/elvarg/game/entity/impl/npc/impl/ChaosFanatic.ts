import { Ids } from 'com.elvarg.game.model';
import { NPC } from 'com.elvarg.game.entity.impl.npc';
import { Location } from 'com.elvarg.game.model';
import { ChaosFanaticCombatMethod } from 'com.elvarg.game.content.combat.method.impl.npcs';
import { CombatMethod } from 'com.elvarg.game.content.combat.method';

const CHAOS_FANATIC = 6618;

@Ids({ CHAOS_FANATIC })
export class ChaosFanatic extends NPC {

    private static COMBAT_METHOD = new ChaosFanaticCombatMethod();

    constructor(id: number, position: Location) {
        super(id, position);
    }

    public getCombatMethod(): CombatMethod {
        return ChaosFanatic.COMBAT_METHOD;
    }
}
