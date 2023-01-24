import { NPC } from "../NPC";
import { VenenatisCombatMethod } from "../../content/combat/method/impl/npcs/VenenatisCombatMethod";
import { Location } from "../../model/Location";
import { VENENATIS, VENENATIS_2 } from "../../../util/NpcIdentifiers";

class Venenatis extends NPC {
    private static readonly COMBAT_METHOD = new VenenatisCombatMethod();

    constructor(id: number, position: Location) {
        super(id, position);
    }

    public getCombatMethod(): VenenatisCombatMethod {
        return Venenatis.COMBAT_METHOD;
    }
}