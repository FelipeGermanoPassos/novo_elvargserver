import { CombatMethod } from "../../../../content/combat/method/CombatMethod"
import { RangedData } from "../../../../content/combat/ranged/RangedData"
import { NPC } from "../NPC"
import { Location } from "../../../../model/Location"
import { CombatFactory } from "../../../../content/combat/CombatFactory"

export class KarilTheTainted extends NPC {

    constructor(id: number, position: Location) {
        super(id, position);

        this.getCombat().setRangedWeapon(RangedData.RangedWeapon.KARILS_CROSSBOW);
        this.getCombat().setAmmunition(RangedData.Ammunition.BOLT_RACK);
    }

    public getCombatMethod(): CombatMethod {
        return CombatFactory.RANGED_COMBAT;
    }

    getSize(){

    }
}
