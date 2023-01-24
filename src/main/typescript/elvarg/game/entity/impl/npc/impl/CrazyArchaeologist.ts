import { Ids } from 'com.elvarg.game.model';
import { NPC } from 'com.elvarg.game.entity.impl.npc';
import { Location } from 'com.elvarg.game.model';
import { CrazyArchaeologistCombatMethod } from 'com.elvarg.game.content.combat.method.impl.npcs';
import { CombatMethod } from 'com.elvarg.game.content.combat.method';

const CRAZY_ARCHAEOLOGIST = 6618;

@Ids({ CRAZY_ARCHAEOLOGIST })
export class CrazyArchaeologist extends NPC {

    private static COMBAT_METHOD = new CrazyArchaeologistCombatMethod();

    constructor(id: number, position: Location) {
        super(id, position);
    }

    public getCombatMethod(): CombatMethod {
        return CrazyArchaeologist.COMBAT_METHOD;
    }
}
