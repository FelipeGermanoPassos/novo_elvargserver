import { CombatMethod } from "../../../../content/combat/method/CombatMethod"
import { JadCombatMethod } from "../../../../content/combat/method/impl/npcs/JadCombatMethod"
import { NPC } from "../NPC";
import { Player } from "../../player/Player";
import { Location } from "../../../../model/Location"
import { FightCavesArea } from "../../../../model/areas/impl/FightCavesArea"

export class TztokJad extends NPC {
    private static readonly COMBAT_METHOD = new JadCombatMethod();
    area: FightCavesArea;

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

    public location() {

    }

    public getSize() {

    }

    public getLocation() {

    }

    public setLocation() {

    }

    public setArea() {

    }

    public getArea() {

    }

    public getPrivateArea() {

    }
}
