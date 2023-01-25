import { Ids } from 'com.elvarg.game.model';
import { NPC } from 'com.elvarg.game.entity.impl.npc';
import { Location } from 'com.elvarg.game.model';
import { CombatSpells } from 'com.elvarg.game.content.combat.magic';
import { CombatMethod } from 'com.elvarg.game.content.combat.method';
import { MAGIC_COMBAT } from 'com.elvarg.game.content.combat.CombatFactory';

const ELDER_CHAOS_DRUID = 3299;

@Ids({ ELDER_CHAOS_DRUID })
export class ElderChaosDruid extends NPC {

    constructor(id: number, position: Location) {
        super(id, position);

        this.getCombat().setAutocastSpell(CombatSpells.WIND_WAVE.getSpell());
    }

    public getCombatMethod(): CombatMethod {
        return MAGIC_COMBAT;
    }
}
