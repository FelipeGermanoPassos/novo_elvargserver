import { CombatMethod } from "../../../../content/combat/method/CombatMethod"
import { CallistoCombatMethod } from "../../../../content/combat/method/impl/npcs/CallistoCombatMethod"
import { NPC } from "../NPC";
import { Ids } from "../../../../model/Ids"
import { Location } from "../../../../model/Location"
import { NpcIdentifiers } from "../../../../../util/NpcIdentifiers"

@Ids(NpcIdentifiers.CALLISTO)
export class Callisto extends NPC {

    private static COMBAT_METHOD = new CallistoCombatMethod();

    constructor(id: number, position: Location) {
        super(id, position);
    }

    public getCombatMethod(): CombatMethod {
        return Callisto.COMBAT_METHOD;
    }
}
