import { Player } from "../../../entity/impl/player/Player";
import { Skill } from "../../../model/Skill";
import { Autocasting } from "./Autocasting";
import { PlayerMagicStaff } from "./PlayerMagicStaff";

export class Spell {
    public canCast(player: Player, delete: boolean): boolean {
    if (player.skillManager.getCurrentLevel(Skill.MAGIC) < levelRequired()) {
        Player.packetSender.sendMessage(
            `You need a Magic level of ${levelRequired()} to cast this spell.`);
        player.combat.reset();
        return false;
    }

    if (!player.spellbook.equals(getSpellbook())) {
        Autocasting.setAutocast(player, null);
        player.combat.setCastSpell(null);
        player.combat.reset();
        return false;
    }
    if (itemsRequired(player).isPresent()) {
        // Suppress the runes based on the staff, we then use the new array
        // of items that don't include suppressed runes.
        const items = PlayerMagicStaff.suppressRunes(player,
            itemsRequired(player).get());

        // Now check if we have all of the runes.
        if (!player.inventory.containsAll(items)) {

            // We don't, so we can't cast.
            player.packetSender.sendMessage(
                "You do not have the required items to cast this spell.");
            player.combat.setCastSpell(null);
            player.combat.reset();
            return false;
        }

        // Finally, we check the equipment required.
        if (equipmentRequired(player).isPresent()) {
            if (!player.equipment.containsAll(
                equipmentRequired(player).get())) {
                player.packetSender.sendMessage(
                    "You do not have the required equipment to cast this spell.");
                player.combat.setCastSpell(null);
                player.combat.reset();
                return false;
            }
        }

        //Check staff of the dead and don't delete runes at a rate of 1/8
        if (player.equipment.items[Equipment.WEAPON_SLOT].id === 11791) {
            if (Misc.getRandom(7) === 1) {
                player.packetSender.sendMessage("Your Staff of the dead negated your runes for this cast.");
                delete = false;
            }
        }

        // We've made it through the checks, so we have the items and can
        // remove them now
        if (delete) {
            for (Item it : Arrays.asList(items)) {
                if (it != null)
                    player.getInventory().delete(it);
            }
        }
    }
    return true;
}

    getSpellbook(): MagicSpellbook {
        return MagicSpellbook.NORMAL;
    }



    interface Spells {
        spellId(): number;
        levelRequired(): number;
        baseExperience(): number;
        itemsRequired(player: Player): Optional<Item[]>;
        equipmentRequired(player: Player): Optional<Item[]>;
        startCast(cast: Mobile, castOn: Mobile): void;
    }
}
