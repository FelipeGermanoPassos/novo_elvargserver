import { NPC } from 'com.elvarg.game.entity.impl.npc';
import { Location } from 'com.elvarg.game.model';
import { RangedData } from 'com.elvarg.game.content.combat.ranged';
import { CombatMethod } from 'com.elvarg.game.content.combat.method';
import { RANGED_COMBAT } from 'com.elvarg.game.content.combat.CombatFactory';

@Ids({ KARIL_THE_TAINTED })
export class KarilTheTainted extends NPC {

    constructor(id: number, position: Location) {
        super(id, position);

        this.getCombat().setRangedWeapon(RangedData.RangedWeapon.KARILS_CROSSBOW);
        this.getCombat().setAmmunition(RangedData.Ammunition.BOLT_RACK);
    }

    public getCombatMethod(): CombatMethod {
        return RANGED_COMBAT;
    }
}
