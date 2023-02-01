import { Mobile } from "../../../entity/impl/Mobile";
import { Player } from "../../../entity/impl/player/Player";
import { UpdateFlag } from "../../../model/UpdateFlag"
import { Spell } from "./Spell";

export class EffectSpells {
    public static handleSpell(player: Player, button: number) {
        const spell: Optional<EffectSpell> = EffectSpell.forSpellId(button);
        if (!spell.isPresent()) {
            return false;
        }
        if (!spell.get().getSpell().canCast(player, false)) {
            return true;
        }
        switch (spell.get()) {
            case this.BONES_TO_PEACHES:
            case this.BONES_TO_BANANAS:
                if (!player.getClickDelay().elapsed(500)) {
                    return true;
                }
                if (!player.getInventory().contains(526)) {
                    player.getPacketSender().sendMessage("You do not have any bones in your inventory.");
                    return true;
                }
                player.getInventory().deleteItemSet(spell.get().getSpell().itemsRequired(player));
                let i = 0;
                player.getInventory().getValidItems().forEach(invItem => {
                    if (invItem.getId() == 526) {
                        player.getInventory().delete(526, 1).add(spell.get() == EffectSpell.BONES_TO_PEACHES ? 6883 : 1963, 1);
                        i++;
                    }
                });
                player.performGraphic(new Graphic(141, GraphicHeight.MIDDLE));
                player.performAnimation(new Animation(722));
                player.getSkillManager().addExperience(Skill.MAGIC, spell.get().getSpell().baseExperience() * i);
                player.getClickDelay().reset();
                break;
            case VENGEANCE:
                if (player.getDueling().inDuel()) {
                    player.getPacketSender().sendMessage("You cannot cast Vengeance during a duel!");
                    return true;
                }
                if (player.getSkillManager().getMaxLevel(Skill.DEFENCE) < 40) {
                    player.getPacketSender().sendMessage("You need at least level 40 Defence to cast this spell.");
                    return true;
                }
                if (player.hasVengeance()) {
                    player.getPacketSender().sendMessage("You already have Vengeance's effect.");
                    return true;
                }


                if (!player.getVengeanceTimer().finished()) {
                    player.getPacketSender().sendMessage("You must wait another " + player.getVengeanceTimer().secondsRemaining() + " seconds before you can cast that again.");
                    return true;
                }

                //Send message and effect timer to client

                player.setHasVengeance(true);
                player.getVengeanceTimer().start(30);
                player.getPacketSender().sendEffectTimer(30, EffectTimer.VENGEANCE)
                    .sendMessage("You now have Vengeance's effect.");
                player.getInventory().deleteItemSet(EffectSpell.VENGEANCE.getSpell().itemsRequired(player));
                player.performAnimation(new Animation(4410));
                player.performGraphic(new Graphic(726, GraphicHeight.HIGH));
                break;
        }
        return true;
    }

    BONES_TO_BANANAS = new Spell() {
        
    spellId(): number {
        return 1159;
    }

    levelRequired(): number {
        return 15;
    }

    baseExperience(): number {
        return 650;
    }

    itemsRequired(player: Player): Optional < Item[] > {
        return Optional.of([new Item(561), new Item(555, 2), new Item(557, 2)]);
    }

    equipmentRequired(player: Player): Optional < Item[] > {
        return Optional.empty();
    }

    startCast(cast: Mobile, castOn: Mobile) { }
}

LOW_ALCHEMY = new Spell() {
    spellId(): number {
        return 1162;
    }

    levelRequired(): number {
        return 21;
    }

    baseExperience(): number {
        return 4000;
    }

    itemsRequired(player: Player): Optional < Item[] > {
        return Optional.of([new Item(554, 3), new Item(561)]);
    }

    equipmentRequired(player: Player): Optional < Item[] > {
        return Optional.empty();
    }

    startCast(cast: Mobile, castOn: Mobile) {


    }
}

class TelekineticGrab implements Spell {
    spellId() {
        return 1168;
    }
    levelRequired() {
        return 33;
    }
    baseExperience() {
        return 3988;
    }
    itemsRequired(player: Player) {
        return Optional.of(new Item[]{ new Item(563), new Item(556) });
    }
    equipmentRequired(player: Player) {
        return Optional.empty();
    }
    startCast(cast: Mobile, castOn: Mobile) {
    }
}

class SuperheatItem implements Spell {
    spellId() {
        return 1173;
    }
    levelRequired() {
        return 43;
    }
    baseExperience() {
        return 6544;
    }
    itemsRequired(player: Player) {
        return Optional.of(new Item[]{ new Item(554, 4), new Item(561) });
    }
    equipmentRequired(player: Player) {
        return Optional.empty();
    }
    startCast(cast: Mobile, castOn: Mobile) {
    }
}

TELEKINETIC_GRAB(new TelekineticGrab()),
    SUPERHEAT_ITEM(new SuperheatItem()),


    class HighAlchemy implements Spell {
        spellId() {
            return 1178;
        }
        levelRequired() {
            return 55;
        }
        baseExperience() {
            return 20000;
        }
        itemsRequired(player: Player) {
            return Optional.of(new Item[]{ new Item(554, 5), new Item(561) });
        }
        equipmentRequired(player: Player) {
            return Optional.empty();
        }
        startCast(cast: Mobile, castOn: Mobile) {
        }
    }

  BONES_TO_PEACHES  {
    spellId() {
        return 15877;
    }
    levelRequired() {
        return 60;
    }
    baseExperience() {
        return 4121;
    }
    itemsRequired(player: Player) {
        return Optional.of(new Item[]{ new Item(561, 2), new Item(555, 4), new Item(557, 4) });
    }
    equipmentRequired(player: Player) {
        return Optional.empty();
    }
    startCast(cast: Mobile, castOn: Mobile) {
    }
}

HIGH_ALCHEMY(new HighAlchemy()),
    BONES_TO_PEACHES(new BonesToPeaches()),

    class BakePie implements Spell {
        spellId() {
            return 30017;
        }
        levelRequired() {
            return 65;
        }
        baseExperience() {
            return 5121;
        }
        itemsRequired(player: Player) {
            return Optional.of(new Item[]{ new Item(9075, 1), new Item(554, 5), new Item(555, 4) });
        }
        equipmentRequired(player: Player) {
            return Optional.empty();
        }
        startCast(cast: Mobile, castOn: Mobile) {
        }
        getSpellbook() {
            return MagicSpellbook.LUNAR;
        }
    }

class VengeanceOther implements Spell {
    spellId() {
        return 30298;
    }
    levelRequired() {
        return 93;
    }
    baseExperience() {
        return 10000;
    }
    itemsRequired(player: Player) {
        return Optional.of(new Item[]{ new Item(9075, 3), new Item(557, 10), new Item(560, 2) });
    }
    equipmentRequired(player: Player) {
        return Optional.empty();
    }
    startCast(cast: Mobile, castOn: Mobile) {
    }
    getSpellbook() {
        return MagicSpellbook.LUNAR;
    }
}

BAKE_PIE(new BakePie()),
    VENGEANCE_OTHER(new VengeanceOther()),

    VENGEANCE = 'VENGEANCE',


    class Vengeance implements Spell {
        spellId() {
            return 30306;
        }
        levelRequired() {
            return 94;
        }
        baseExperience() {
            return 14000;
        }
        itemsRequired(player: Player) {
            return Optional.of(new Item[]{ new Item(9075, 4), new Item(557, 10), new Item(560, 2) });
        }
        equipmentRequired(player: Player) {
            return Optional.empty();
        }
        startCast(cast: Mobile, castOn: Mobile) {
        }
        getSpellbook() {
            return MagicSpellbook.LUNAR;
        }
    }

let spells: Map<number, EffectSpell> = new Map<number, EffectSpell>();
spells.set(30306, EffectSpell.VENGEANCE);

function forSpellId(spellId: number): EffectSpell | undefined {
    return spells.get(spellId);
}
}
