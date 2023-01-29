import { NPC } from "../NPC";
import { JadCombatMethod } from "../../content/combat/method/impl/npcs/JadCombatMethod";
import { Location } from "../../model/Location";
import { FightCavesArea } from "../../model/areas/impl/FightCavesArea";
import { TZTOK_JAD } from "../../../util/NpcIdentifiers";

export class TztokJad extends NPC {
    private static readonly COMBAT_METHOD = new JadCombatMethod();

    constructor(player: Player, area: FightCavesArea, id: number, position: Location) {
        super(id, position);
        this.setOwner(player);
        this.area = area;
        this.area.add(this);
    }

    public aggressionDistance(): number {
        return 64;
    }

    public getCombatMethod(): CombatMethod {
        return TztokJad.COMBAT_METHOD;
    }
}
