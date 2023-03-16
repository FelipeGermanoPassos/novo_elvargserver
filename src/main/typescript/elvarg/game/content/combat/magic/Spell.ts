import { Player } from "../../../entity/impl/player/Player";
import { Skill } from "../../../model/Skill";
import { Autocasting } from "./Autocasting";
import { PlayerMagicStaff } from "./PlayerMagicStaff";
import { Misc } from "../../../../util/Misc";
import { Equipment } from "../../../model/container/impl/Equipment";

export abstract class Spell {
    public canCast(player: Player, delete: boolean): boolean {
    if (player.skillManager.getCurrentLevel(Skill.MAGIC) < levelRequired()) {
        player.packetSender.sendMessage(You need a Magic level of ${ levelRequired() } to cast this spell.);
        player.combat.reset();
        return false;
    }

    if (!player.spellbook.equals(getSpellbook())) {
        Autocasting.setAutocast(player, null);
        player.combat.setCastSpell(null);
        player.combat.reset();
        return false;
    }

    const itemsReq = itemsRequired(player);
    if (itemsReq !== null) {
        const items = PlayerMagicStaff.suppressRunes(player, itemsReq);

        if (!player.inventory.containsAll(items)) {
            player.packetSender.sendMessage("You do not have the required items to cast this spell.");
            player.combat.setCastSpell(null);
            player.combat.reset();
            return false;
        }

        const equipmentReq = equipmentRequired(player);
        if (equipmentReq !== null) {
            if (!player.equipment.containsAll(equipmentReq)) {
                player.packetSender.sendMessage("You do not have the required equipment to cast this spell.");
                player.combat.setCastSpell(null);
                player.combat.reset();
                return false;
            }
        }

        if (player.equipment.items[Equipment.WEAPON_SLOT].id === 11791) {
            if (Misc.getRandom(7) === 1) {
                player.packetSender.sendMessage("Your Staff of the dead negated your runes for this cast.");
                delete = false;
            }
        }

        if (delete) {
            for (const it of items) {
                if (it != null) {
                    player.getInventory().delete(it);
                }
            }
        }
    }
    return true;
}

abstract spellId(): number;
abstract levelRequired(): number;
abstract baseExperience(): number;
abstract itemsRequired(player: Player): Item[] | null;
abstract equipmentRequired(player: Player): Item[] | null;
abstract startCast(cast: Mobile, castOn: Mobile): void;

getSpellbook(): MagicSpellbook {
    return MagicSpellbook.NORMAL;
}
}
