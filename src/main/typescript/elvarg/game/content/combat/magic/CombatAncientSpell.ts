import { Mobile } from "../../../entity/impl/Mobile";
import { Player } from "../../../entity/impl/player/Player";
import { Item } from "../../../model/Item";
import { MagicSpellbook } from "../../../model/MagicSpellbook"
import { CombatSpell } from "./CombatSpell";
import { Optional } from 'optional'

export abstract class CombatAncientSpell extends CombatSpell {

    public getSpellbook() {
        return MagicSpellbook.ANCIENT;
    }

    public finishCast(cast: Mobile, castOn: Mobile, accurate: boolean, damage: number) {

        // The spell wasn't accurate, so do nothing.
        if (!accurate || damage <= 0) {
            return;
        }

        // Do the spell effect here.
        this.spellEffect(cast, castOn, damage);
    }

    public equipmentRequired(player: Player): Optional<Item[]> {

        // Ancient spells never require any equipment, although the method can
        // still be overridden if by some chance a spell does.
        return Optional.empty();
    }

    /**
     * The effect this spell has on the target.
     *
     * @param cast   the entity casting this spell.
     * @param castOn the person being hit by this spell.
     * @param damage the damage inflicted.
     */
    public spellEffect(cast: Mobile, castOn: Mobile, damage: number) { }

    /**
     * The radius of this spell, only comes in effect when the victim is hit in
     * a multicombat area.
     *
     * @return how far from the target this spell can hit when targeting
     * multiple entities.
     */
    public abstract spellRadius(): number;
}