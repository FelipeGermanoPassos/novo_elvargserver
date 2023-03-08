import { Mobile } from "../../../entity/impl/Mobile";
import { Player } from "../../../entity/impl/player/Player";
import { Item } from "../../../model/Item";
import { CombatSpell } from "./CombatSpell";

export class CombatEffectSpell extends CombatSpell {
    public maximumHit(): number {
        return -1;
    }
    public equipmentRequired(player: Player): Item[] | null {
        return null;
    }

    public finishCast(cast: Mobile, castOn: Mobile, accurate: boolean, damage: number): void {
        if (accurate) {
            this.spellEffect(cast, castOn);
        }
    }
    public spellEffect(cast: Mobile, castOn: Mobile) {

    }

    
}