import { Location } from "com.elvarg.game.model";
import { CombatMethod } from "com.elvarg.game.content.combat.method";
import { CombatSpells } from "com.elvarg.game.content.combat.magic";
import { NPC } from "com.elvarg.game.entity.impl.npc";

const AHRIM_THE_BLIGHTED = [0];

class AhrimTheBlighted extends NPC {
    constructor(id: number, position: Location) {
        super(id, position);
        this.combat.autocastSpell = CombatSpells.FIRE_WAVE.spell;
    }

    public getCombatMethod(): CombatMethod {
        return MAGIC_COMBAT;
    }
}