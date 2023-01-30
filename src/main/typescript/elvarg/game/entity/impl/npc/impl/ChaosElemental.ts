import { CombatMethod } from "../../../../content/combat/method/CombatMethod"
import { ChaosElementalCombatMethod } from "../../../../content/combat/method/impl/npcs/ChaosElementalCombatMethod"
import { NPC } from "../NPC";
import { Ids } from "../../../../model/Ids"
import { Location } from "../../../../model/Location"
import { NpcIdentifiers } from "../../../../../util/NpcIdentifiers"


@Ids(NpcIdentifiers.CHAOS_ELEMENTAL)
export class ChaosElemental extends NPC {

    private static COMBAT_METHOD = new ChaosElementalCombatMethod();

    constructor(id: number, position: Location) {
        super(id, position);
    }

    public getCombatMethod(): CombatMethod {
        return ChaosElemental.COMBAT_METHOD;
    }
}
