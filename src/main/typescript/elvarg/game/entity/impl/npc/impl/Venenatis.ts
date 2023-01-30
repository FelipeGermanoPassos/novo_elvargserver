import { CombatMethod } from "../../../../content/combat/method/CombatMethod"
import { VenenatisCombatMethod } from "../../../../content/combat/method/impl/npcs/VenenatisCombatMethod"
import { NPC } from "../NPC";
import { Ids } from "../../../../model/Ids"
import { Location } from "../../../../model/Location"
import { NpcIdentifiers } from "../../../../../util/NpcIdentifiers"


@Ids(NpcIdentifiers.VENENATIS, NpcIdentifiers.VENENATIS_2)
class Venenatis extends NPC {
    private static readonly COMBAT_METHOD: CombatMethod = new VenenatisCombatMethod();

    constructor(id: number, position: Location) {
        super(id, position);
    }

    public getCombatMethod(): VenenatisCombatMethod {
        return Venenatis.COMBAT_METHOD;
    }
}