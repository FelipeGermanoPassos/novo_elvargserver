import { Ids } from 'com.elvarg.game.model';
import { NPC } from 'com.elvarg.game.entity.impl.npc';
import { Location } from 'com.elvarg.game.model';
import { ChaosElementalCombatMethod } from 'com.elvarg.game.content.combat.method.impl.npcs';
import { CombatMethod } from 'com.elvarg.game.content.combat.method';

const CHAOS_ELEMENTAL = 3200;

@Ids({ CHAOS_ELEMENTAL })
export class ChaosElemental extends NPC {

    private static COMBAT_METHOD = new ChaosElementalCombatMethod();

    constructor(id: number, position: Location) {
        super(id, position);
    }

    public getCombatMethod(): CombatMethod {
        return ChaosElemental.COMBAT_METHOD;
    }
}
