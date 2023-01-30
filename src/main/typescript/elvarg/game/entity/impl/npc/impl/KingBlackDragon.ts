import {NpcIdentifiers} from "../../../../../util/NpcIdentifiers"
import {CombatMethod} from "../../../../content/combat/method/CombatMethod"
import {KingBlackDragonMethod} from "../../../../content/combat/method/impl/npcs/KingBlackDragonMethod"
import {NPC} from "../NPC"
import {Ids} from "../../../../model/Ids"
import {Location} from "../../../../model/Location"

@Ids([NpcIdentifiers.KING_BLACK_DRAGON, NpcIdentifiers.KING_BLACK_DRAGON_2, NpcIdentifiers.KING_BLACK_DRAGON_3])

class KingBlackDragon extends NPC {
    private static readonly COMBAT_METHOD : CombatMethod = new KingBlackDragonMethod();

    constructor(id: number, position: Location) {
        super(id, position);
    }
    public getCombatMethod(): CombatMethod {
        return KingBlackDragon.COMBAT_METHOD;
    }
}